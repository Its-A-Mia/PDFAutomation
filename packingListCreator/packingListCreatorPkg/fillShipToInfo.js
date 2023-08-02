const fillshipToInfo = (page, shipToInfo, font) => {
  const { height } = page.getSize();

  const leftMargin = 181.25;
  const fontSize = 9;

  const shipToLineMaxWidth = 150;
  let shipToLine1YPos = height - 145;
  let shipToLine2YPos = height - 157;
  let shipToLine3YPos = height - 169;
  let shipToLine4YPos = height - 181;

  const adjustYPosShipToLines = () => {
    shipToLine1YPos += 12;
    shipToLine2YPos += 12;
    shipToLine3YPos += 12;
    shipToLine4YPos += 12;
  };

  const adjustYPosShipToLineBreak = (textWidth) => {
    if (textWidth > shipToLineMaxWidth) {
      const multiplier = Math.floor(textWidth / shipToLineMaxWidth);

      shipToLine1YPos -= 12 * multiplier;
      shipToLine2YPos -= 12 * multiplier;
      shipToLine3YPos -= 12 * multiplier;
      shipToLine4YPos -= 12 * multiplier;
    }
  };

  ////

  if (shipToInfo.shipToName.length === 0) {
    adjustYPosShipToLines();
  }

  page.drawText(shipToInfo.shipToName, {
    x: leftMargin,
    y: shipToLine1YPos,
    size: fontSize,
    maxWidth: shipToLineMaxWidth,
    lineHeight: 12,
  });

  const shipToNameTextWidth = font.widthOfTextAtSize(
    shipToInfo.shipToName,
    fontSize
  );

  adjustYPosShipToLineBreak(shipToNameTextWidth);

  ////

  if (shipToInfo.shipAddress1.length === 0) {
    adjustYPosShipToLines();
  }

  page.drawText(shipToInfo.shipAddress1, {
    x: leftMargin,
    y: shipToLine2YPos,
    size: fontSize,
    maxWidth: shipToLineMaxWidth,
    lineHeight: 12,
  });

  const shipAddress1TextWidth = font.widthOfTextAtSize(
    shipToInfo.shipAddress1,
    fontSize
  );

  adjustYPosShipToLineBreak(shipAddress1TextWidth);

  ////

  if (shipToInfo.shipAddress2.length === 0) {
    adjustYPosShipToLines();
  }

  page.drawText(shipToInfo.shipAddress2, {
    x: leftMargin,
    y: shipToLine3YPos,
    size: fontSize,
    maxWidth: shipToLineMaxWidth,
    lineHeight: 12,
  });

  const shipAddress2TextWidth = font.widthOfTextAtSize(
    shipToInfo.shipAddress2,
    fontSize
  );

  adjustYPosShipToLineBreak(shipAddress2TextWidth);

  ////

  if (
    shipToInfo.shipAddressCity.length === 0 &&
    shipToInfo.shipAddressState.length === 0 &&
    shipToInfo.shipAddressPostalCode.length === 0 &&
    shipToInfo.shipAddressCountry === 0
  ) {
    adjustYPosShipToLines();
  }

  page.drawText(
    `${shipToInfo.shipAddressCity} ${shipToInfo.shipAddressState} ${shipToInfo.shipAddressPostalCode} ${shipToInfo.shipAddressCountry}`,
    {
      x: leftMargin,
      y: shipToLine4YPos,
      size: fontSize,
      maxWidth: shipToLineMaxWidth,
      lineHeight: 12,
    }
  );

  const shipCityStatePostalCountryTextWidth = font.widthOfTextAtSize(
    `${shipToInfo.shipAddressCity} ${shipToInfo.shipAddressState} ${shipToInfo.shipAddressPostalCode} ${shipToInfo.shipAddressCountry}`,
    fontSize
  );

  adjustYPosShipToLineBreak(shipCityStatePostalCountryTextWidth);

  ////

  const lowestYPosRef = shipToLine4YPos;

  return lowestYPosRef;
};

export default fillshipToInfo;
