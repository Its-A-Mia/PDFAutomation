import { checkEqualityAndDifference } from '../../index.mjs';

/////////////////////
// @keys of Inputs
// RecordID,
// BillEmail,
// SalesRep,
// Amount,
// RefNumber
/////////////////////

const firstTestMethodMockData = {
  value: [
    {
      RecordID: 0,
      Customer_RecordID: 0,
      SalesRep: 'ME',
      Amount: 555.55,
      RefNumber: '99999',
    },
  ],
};

const firstTestCompareMockData = {
  value: [
    {
      RecordID: 0,
      Customer_RecordID: 0,
      SalesRep: 'ME',
      Amount: 555.55,
      RefNumber: '99999',
    },
  ],
};

const firstTestResults = {
  isStaleData: false,
  staleData: [],
  isNewEntries: false,
};

const secondTestMethodMockData = {
  value: [
    {
      RecordID: 0,
      Customer_RecordID: 0,
      SalesRep: 'ME',
      Amount: 555.55,
      RefNumber: '99999',
      isDeleted: false,
    },
  ],
};

const secondTestCompareMockData = {
  value: [
    {
      RecordID: 0,
      Customer_RecordID: 0,
      SalesRep: 'ME',
      Amount: 555.55,
      RefNumber: '99999',
      isDeleted: false,
    },
    {
      RecordID: 1,
      Customer_RecordID: 1,
      SalesRep: 'YOU',
      Amount: 55.55,
      RefNumber: '99998',
      isDeleted: false,
    },
  ],
};

const secondTestResults = {
  isStaleData: true,
  staleData: [
    {
      RecordID: 2,
      Email: 'result@email.com',
      SalesRep: 'THEM',
      Amount: '1010.10',
      RefNumber: '99997',
      isDeleted: false,
    },
  ],
  isNewEntries: false,
};

const thirdTestMethodMockData = {
  value: [
    {
      RecordID: 0,
      Customer_RecordID: 0,
      SalesRep: 'ME',
      Amount: 555.55,
      RefNumber: '99999',
    },
    {
      RecordID: 1,
      Customer_RecordID: 1,
      SalesRep: 'YOU',
      Amount: 55.55,
      RefNumber: '99998',
    },
  ],
};

const thirdTestCompareMockData = {
  value: [
    {
      RecordID: 0,
      Customer_RecordID: 0,
      SalesRep: 'ME',
      Amount: 555.55,
      RefNumber: '99999',
    },
  ],
};

const thirdTestResults = {
  isStaleData: false,
  staleData: [],
  isNewEntries: true,
};

/////////////////////
// @params
// methodData
// compareData
/////////////////////

// ensure the API key is inserted into API call

describe('checkEqualityAndDifference function', () => {
  it('determines the differences and equality between the two main data groups, then returns an object containing results of comparison', async () => {
    const result = await checkEqualityAndDifference(firstTestMethodMockData, firstTestCompareMockData);
    expect(result).toStrictEqual(firstTestResults);
  });

  it('will return a false in equality if there is stale data in the compareSet', async () => {
    const result = await checkEqualityAndDifference(secondTestMethodMockData, secondTestCompareMockData);
    expect(result).toStrictEqual(secondTestResults);
  });

  it('will return a true in newEntries if there is new data in the methodSet', async () => {
    const result = await checkEqualityAndDifference(thirdTestMethodMockData, thirdTestCompareMockData);
    expect(result).toStrictEqual(thirdTestResults);
  });
});
