import { Readable } from 'stream';
import FormData from 'form-data';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const addFileToPipeDrive = async (pdfDataURI, fileName, dealId) => {
  const pdfBinBuffer = Buffer.from(pdfDataURI, 'base64');

  const pdfStream = new Readable({ defaultEncoding: 'binary' });

  pdfStream.push(pdfBinBuffer);
  pdfStream.push(null);

  var data = new FormData();
  data.append('file', pdfStream, {
    filename: `${fileName}`,
    contentType: 'application/pdf',
  });
  data.append('deal_id', dealId);

  // used Axios due to fetch not working
  try {
    const res = await axios.post(
      `https://api.pipedrive.com/v1/files?api_token=${process.env.PIPEDRIVE_API_KEY}`,
      data,
      { headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json', ...data.getHeaders() } }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default addFileToPipeDrive;
