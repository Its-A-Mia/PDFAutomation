import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

const getInvoiceData = async (recordID) => {
  try {
    const response = await fetch(`https://rest.method.me/api/v1/tables/Invoice/${recordID}?expand=InvoiceLine`, {
      method: 'GET',
      headers: {
        Authorization: `APIKey ${process.env.METHOD_API_KEY}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getInvoiceData;
