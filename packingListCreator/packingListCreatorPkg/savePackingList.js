import * as fs from 'fs/promises';
import { Base64 } from 'js-base64';

const savePackingList = async (pdfDataURI, path) => {
  const pdfDataBin = Base64.atob(pdfDataURI);
  console.log(pdfDataBin);

  await fs.writeFile(path, pdfDataBin, 'binary', (err) => err && console.error(err));
};

export default savePackingList;
