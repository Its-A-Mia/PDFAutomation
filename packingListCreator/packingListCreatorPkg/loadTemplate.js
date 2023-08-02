import * as fs from "fs/promises";
import { PDFDocument } from "pdf-lib";

const loadTemplate = async () => {
  const existingPdfBytes = await fs.readFile(
    "./packingListCreatorPkg/packingListTemplate.pdf",
    (err) => err && console.error(err)
  );

  const packingListTemplate = await PDFDocument.load(existingPdfBytes);

  return packingListTemplate;
};

export default loadTemplate;
