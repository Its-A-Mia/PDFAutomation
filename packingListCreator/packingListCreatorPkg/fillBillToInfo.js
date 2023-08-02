const fillBillToInfo = (page, billToInfo, font) => {
  const { height } = page.getSize();

  const leftMargin = 37.5;
  const fontSize = 9;

  const billToLineMaxWidth = 150;
  let billToLine1YPos = height - 145;
  let billToLine2YPos = height - 157;
  let billToLine3YPos = height - 169;
  let billToLine4YPos = height - 181;

  const adjustYPosBillToLines = () => {
    billToLine1YPos += 12;
    billToLine2YPos += 12;
    billToLine3YPos += 12;
    billToLine4YPos += 12;
  };

  const adjustYPosBillToLineBreak = (textWidth) => {
    if (textWidth > billToLineMaxWidth) {
      const multiplier = Math.floor(textWidth / billToLineMaxWidth);

      billToLine1YPos -= 12 * multiplier;
      billToLine2YPos -= 12 * multiplier;
      billToLine3YPos -= 12 * multiplier;
      billToLine4YPos -= 12 * multiplier;
    }
  };

  /////

  if (billToInfo.billToName.length === 0) {
    adjustYPosBillToLines();
  }

  page.drawText(billToInfo.billToName, {
    x: leftMargin,
    y: billToLine1YPos,
    size: fontSize,
    maxWidth: billToLineMaxWidth,
    lineHeight: 12,
  });

  const billToNameTextWidth = font.widthOfTextAtSize(
    billToInfo.billToName,
    fontSize
  );

  adjustYPosBillToLineBreak(billToNameTextWidth);

  /////

  if (billToInfo.billAddress1.length === 0) {
    adjustYPosBillToLines();
  }

  page.drawText(billToInfo.billAddress1, {
    x: leftMargin,
    y: billToLine2YPos,
    size: fontSize,
    maxWidth: billToLineMaxWidth,
    lineHeight: 12,
  });

  const billAddress1TextWidth = font.widthOfTextAtSize(
    billToInfo.billAddress1,
    fontSize
  );

  adjustYPosBillToLineBreak(billAddress1TextWidth);

  /////

  if (billToInfo.billAddress2.length === 0) {
    adjustYPosBillToLines();
  }

  page.drawText(billToInfo.billAddress2, {
    x: leftMargin,
    y: billToLine3YPos,
    size: fontSize,
    maxWidth: billToLineMaxWidth,
    lineHeight: 12,
  });

  const billAddress2TextWidth = font.widthOfTextAtSize(
    billToInfo.billAddress2,
    fontSize
  );

  adjustYPosBillToLineBreak(billAddress2TextWidth);

  /////

  if (
    billToInfo.billAddressCity.length === 0 &&
    billToInfo.billAddressState.length === 0 &&
    billToInfo.billAddressPostalCode.length === 0 &&
    billToInfo.billAddressCountry === 0
  ) {
    adjustYPosBillToLines();
  }

  page.drawText(
    `${billToInfo.billAddressCity} ${billToInfo.billAddressState} ${billToInfo.billAddressPostalCode} ${billToInfo.billAddressCountry}`,
    {
      x: leftMargin,
      y: billToLine4YPos,
      size: fontSize,
      maxWidth: billToLineMaxWidth,
      lineHeight: 12,
    }
  );

  const billCityStatePostalCountryTextWidth = font.widthOfTextAtSize(
    `${billToInfo.billAddressCity} ${billToInfo.billAddressState} ${billToInfo.billAddressPostalCode} ${billToInfo.billAddressCountry}`,
    fontSize
  );

  adjustYPosBillToLineBreak(billCityStatePostalCountryTextWidth);

  /////

  const lowestYPosRef = billToLine4YPos;

  return lowestYPosRef;
};

export default fillBillToInfo;
