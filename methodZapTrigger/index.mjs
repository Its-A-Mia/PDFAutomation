import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();
const client = new S3Client({ region: '' });

export const fetchMethodData = async () => {
  const methodResponse = await fetch(
    'https://rest.method.me/api/v1/tables/Invoice?filter=BalanceRemaining gt 0&top=100&select=RecordID, BillEmail, SalesRep, Amount, RefNumber&orderby=RecordID',
    {
      headers: { Authorization: `APIKey ${process.env.METHOD_API_KEY}` },
    }
  );

  const methodData = await methodResponse.json();

  return methodData;
};

////////////////////////////////////////

export const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

////////////////////////////////////////

export const getCompareData = async () => {
  const compareDataParams = {
    Bucket: 'method-zapier-trigger-objects-bucket',
    Key: 'MethodDataCompareState.json',
  };

  const getCompareDataCommand = new GetObjectCommand(compareDataParams);
  const { Body } = await client.send(getCompareDataCommand);

  const bodyContents = await streamToString(Body);

  return JSON.parse(bodyContents);
};

////////////////////////////////////////

export const setCompareData = async (newData) => {
  const compareDataUploadParams = {
    Bucket: 'method-zapier-trigger-objects-bucket',
    Key: 'MethodDataCompareState.json',
    Body: JSON.stringify(newData),
  };

  const putCompareDataCommand = new PutObjectCommand(compareDataUploadParams);
  await client.send(putCompareDataCommand);
};

////////////////////////////////////////

export const formatSalesRep = (salesRepTag) => {
  // Receives sales rep initials and returns their name

  if (salesRepTag === 'Initials') {
    return 'Redacted';
  }

  // repeated for 15 iterations

  return 'N/A';
};

////////////////////////////////////////

export const checkIfInvoiceIsDeleted = async (RecordId) => {
  const methodResponse = await fetch(`https://rest.method.me/api/v1/tables/Invoice/${RecordId}`, {
    headers: { Authorization: `APIKey ${process.env.METHOD_API_KEY}` },
  });

  const methodData = await methodResponse.json();

  if (methodData.status === 400) {
    return true;
  }

  return false;
};

////////////////////////////////////////

export const checkEqualityAndDifference = async (methodData, compareData) => {
  let methodDataRecordIDArr = [];
  let compareDataRecordIDArr = [];

  for (const value of methodData.value) {
    methodDataRecordIDArr.push(value.RecordID);
  }

  for (const value of compareData.value) {
    compareDataRecordIDArr.push(value.RecordID);
  }

  const equalityAndDiscrepancies = {
    isStaleData: false,
    staleData: [],
    isNewEntries: false,
  };

  // checks to see if any entries have been paid between stale data and fresh data i.e the record will no longer be in the fresh data

  for (const [index, value] of compareDataRecordIDArr.entries()) {
    if (methodDataRecordIDArr.includes(value) === false) {
      const recordID = compareData.value[index].RecordID;
      const billEmail = compareData.value[index].BillEmail;
      const salesRep = formatSalesRep(compareData.value[index].SalesRep?.trim());
      const amount = compareData.value[index].Amount?.toFixed(2);
      const refNumber = compareData.value[index].RefNumber;
      const isDeleted = await checkIfDeleted(recordID);

      const staleValues = {
        RecordID: recordID,
        Email: billEmail,
        SalesRep: salesRep,
        Amount: amount,
        RefNumber: refNumber,
        isDeleted: isDeleted,
      };

      console.info(staleValues);

      equalityAndDiscrepancies.isStaleData = true;
      equalityAndDiscrepancies.staleData.push(staleValues);
    }
  }

  // checks for new data against the stale data i.e there are new unpaid entries

  for (const value of methodDataRecordIDArr) {
    if (compareDataRecordIDArr.includes(value) === false) {
      equalityAndDiscrepancies.isNewEntries = true;
    }
  }

  return equalityAndDiscrepancies;
};

////////////////////////////////////////

export const invokeZapierTrigger = async (values) => {
  for (const value of values) {
    if (value.isDeleted === true) {
      console.info(`Deleted entry was found. RecordID: ${value.RecordID}`);
      continue;
    }

    const data = {
      RecordID: value.RecordID,
      Email: value.Email,
      SalesRep: value.SalesRep,
      Amount: value.Amount,
      RefNumber: value.RefNumber,
    };

    console.info(data);

    const result = await fetch('https://hooks.zapier.com/hooks/catch/14516036/36x147x/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.info(await result.json());
  }
};

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export const handler = async (event) => {
  // CHECK FOR RECORD ID TO CONFIRM IT WAS PAID OR DELETED
  const methodData = await fetchMethodData();
  const compareData = await getCompareData();

  const equalityAndDiscrepancies = checkEqualityAndDifference(methodData, compareData);

  if (equalityAndDiscrepancies.isStaleData === true) {
    console.info('purging old data');
    await setCompareData(methodData);

    await invokeZapierTrigger(equalityAndDiscrepancies.staleValues);
  }

  if (equalityAndDiscrepancies.isNewEntries === true) {
    console.info('set new entries');
    await setCompareData(methodData);
  }

  const response = {
    statusCode: 200,
    body: equalityAndDiscrepancies,
  };

  return response;
};
