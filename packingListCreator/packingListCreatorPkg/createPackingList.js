import { StandardFonts } from 'pdf-lib';
import getInvoiceData from './getInvoiceData.js';
import loadTemplate from './loadTemplate.js';
import fillBillToInfo from './fillBillToInfo.js';
import fillshipToInfo from './fillShipToInfo.js';
import fillDatesAndInvoiceNum from './fillDatesAndInvoiceNum.js';
import createTableTitleBar from './createTableTitleBar.js';
import createLineItems from './createLineItems.js';
import addFileToPipeDrive from './addFileToPipeDrive.js';
// import savePackingList from './savePackingList.js';

const createPackingList = async (recordId, dealId) => {
  const packingListPDFStarter = await loadTemplate();

  const invoiceData = await getInvoiceData(recordId);
  console.log(invoiceData.BillAddressAddr1, invoiceData.DueDate);

  //
  // map invoice data
  //

  const customerName = invoiceData.Customer;

  const billToInfo = {
    billToName: invoiceData.BillAddressAddr1 ?? '',
    billAddress1: invoiceData.BillAddressAddr2 ?? '',
    billAddress2: invoiceData.BillAddressAddr3 ?? '',
    billAddressCity: invoiceData.BillAddressCity ?? '',
    billAddressState: invoiceData.BillAddressState ?? '',
    billAddressPostalCode: invoiceData.BillAddressPostalCode ?? '',
    billAddressCountry: invoiceData.BillAddressCountry ?? '',
  };

  const shipToInfo = {
    shipToName: invoiceData.ShipAddressAddr1 ?? '',
    shipAddress1: invoiceData.ShipAddressAddr2 ?? '',
    shipAddress2: invoiceData.ShipAddressAddr3 ?? '',
    shipAddressCity: invoiceData.ShipAddressCity ?? '',
    shipAddressState: invoiceData.ShipAddressState ?? '',
    shipAddressPostalCode: invoiceData.ShipAddressPostalCode ?? '',
    shipAddressCountry: invoiceData.ShipAddressCountry ?? '',
  };

  const datesAndInvoiceNum = {
    date: invoiceData.TxnDate?.slice(0, 10) ?? '',
    dueDate: invoiceData.DueDate?.slice(0, 10) ?? '',
    invoiceNumber: invoiceData.RefNumber ?? '',
  };

  //
  // Fill in Bill To, Shipping To, Date, Due Date, Invoice#
  //

  const firstPage = packingListPDFStarter.getPage(0);

  const helvetica = await packingListPDFStarter.embedFont(StandardFonts.Helvetica);

  const helveticaBold = await packingListPDFStarter.embedFont(StandardFonts.HelveticaBold);

  //
  // returns reference points to calculate starting Y pos for later drawn items
  //

  const billToLowestYPos = fillBillToInfo(firstPage, billToInfo, helvetica);
  const shipToLowestYPos = fillshipToInfo(firstPage, shipToInfo, helvetica);

  fillDatesAndInvoiceNum(firstPage, datesAndInvoiceNum, helvetica);

  //
  // Determines lowest reference point
  //

  let lowestYPosReference;

  if (billToLowestYPos > shipToLowestYPos) {
    lowestYPosReference = shipToLowestYPos;
  } else {
    lowestYPosReference = billToLowestYPos;
  }

  const titleBarYPos = createTableTitleBar(firstPage, lowestYPosReference, helveticaBold);

  //
  // create copies
  //

  packingListPDFStarter.save();
  const packingListPDF = await packingListPDFStarter.copy();

  const [copy1] = await packingListPDF.copyPages(packingListPDF, [0]);
  const [copy2] = await packingListPDF.copyPages(packingListPDF, [0]);
  const [copy3] = await packingListPDF.copyPages(packingListPDF, [0]);
  const [copy4] = await packingListPDF.copyPages(packingListPDF, [0]);
  const [copy5] = await packingListPDF.copyPages(packingListPDF, [0]);

  const copiedPages = [copy1, copy2, copy3, copy4, copy5];

  //
  // create line items
  //

  const lineItemValues = invoiceData.__InvoiceLine.value;

  createLineItems(packingListPDF, titleBarYPos, lineItemValues, copiedPages);

  //
  // update pdf bytes object
  //

  const pdfDataURI = await packingListPDF.saveAsBase64();

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                               Development/testing purposes only                                         //
  // const filePath = `./packingListCreatorPkg/createdPackingLists/${customerName} ${datesAndInvoiceNum.invoiceNumber}.pdf`; //
  // savePackingList(pdfDataURI, filePath);                                                                                  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const fileName = `${customerName} ${datesAndInvoiceNum.invoiceNumber}.pdf`;
  const pipeDriveRes = await addFileToPipeDrive(pdfDataURI, fileName, dealId);

  return pipeDriveRes;
};

export default createPackingList;
