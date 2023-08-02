const fillDatesAndInvoiceNum = (page, datesAndInvoiceNum, font) => {
  const { width, height } = page.getSize();
  const fontSize = 9;

  const formatDate = (date) => {
    const dateParts = date.split('-');
    let year = dateParts[0];
    let month = dateParts[1];
    let day = dateParts[2];

    if (month[0].includes(0)) {
      month = month[1];
    }

    if (day[0].includes(0)) {
      day = day[1];
    }

    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  };

  const formattedDate = formatDate(datesAndInvoiceNum.date);
  const formattedDueDate = formatDate(datesAndInvoiceNum.dueDate);

  const dateTextWidth = font.widthOfTextAtSize(formattedDate, fontSize);

  const dueDateTextWidth = font.widthOfTextAtSize(formattedDueDate, fontSize);

  const invoiceNumberTextWidth = font.widthOfTextAtSize(datesAndInvoiceNum.invoiceNumber, fontSize);

  const datePair = { x: width - (170 + dateTextWidth), y: height - 113 };
  const dueDatePair = { x: width - (105 + dueDateTextWidth), y: height - 113 };
  const invoiceNumberPair = {
    x: width - (40 + invoiceNumberTextWidth),
    y: height - 113,
  };

  page.drawText(formattedDate, {
    x: datePair.x,
    y: datePair.y,
    size: fontSize,
  });

  page.drawText(formattedDueDate, {
    x: dueDatePair.x,
    y: dueDatePair.y,
    size: fontSize,
  });

  page.drawText(datesAndInvoiceNum.invoiceNumber, {
    x: invoiceNumberPair.x,
    y: invoiceNumberPair.y,
    size: fontSize,
  });
};

export default fillDatesAndInvoiceNum;
