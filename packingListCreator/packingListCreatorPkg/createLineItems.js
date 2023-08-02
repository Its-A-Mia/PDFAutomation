import { StandardFonts, rgb } from "pdf-lib";

const createLineItems = async (pdfDoc, yRef, lineItemValues, copiedPages) => {
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const leftMargin = 37.5;
  const rightMargin = 37.5;
  const fontSize = 10;
  const lineHeight = 12;

  let pageIndex = 0;
  let lineItemCount = 0;

  const pageBreakCheckThreshold = 145;
  const pageBreakThreshold = 55;

  let textLine1YStart = yRef - 26;
  let textLine2YStart = yRef - 42;
  let dashLineYStart = yRef - 51;

  const adjustYAlignment = (operation, multiplier = 1) => {
    const adjustmentDifference = 16;

    if (operation === "up") {
      textLine1YStart = textLine1YStart + adjustmentDifference * multiplier;
      textLine2YStart = textLine2YStart + adjustmentDifference * multiplier;
      dashLineYStart = dashLineYStart + adjustmentDifference * multiplier;
    } else if (operation === "down") {
      textLine1YStart = textLine1YStart - adjustmentDifference * multiplier;
      textLine2YStart = textLine2YStart - adjustmentDifference * multiplier;
      dashLineYStart = dashLineYStart - adjustmentDifference * multiplier;
    }
  };

  const resetYAlignment = () => {
    textLine1YStart = yRef - 26;
    textLine2YStart = yRef - 42;
    dashLineYStart = yRef - 51;
  };

  for (let i = 0; i < lineItemValues.length; i++) {
    let yDelta = 40 * lineItemCount;
    lineItemCount++;

    // map values
    const item = lineItemValues[i]?.Item ?? "";
    const description = lineItemValues[i]?.Desc.replace(/\n/g, " ") ?? "";
    const quantity = lineItemValues[i]?.Quantity?.toFixed(2).toString() ?? "";

    const descriptionTextWidth = helveticaBold.widthOfTextAtSize(
      description,
      fontSize
    );

    const lineBreakThreshold = 330;

    // begin checking if a new page should be added
    if (textLine1YStart - yDelta < pageBreakCheckThreshold) {
      // define the area last Line Item entry will take up
      let lineBreaks = 0;

      if (descriptionTextWidth > lineBreakThreshold) {
        lineBreaks = Math.floor(descriptionTextWidth / lineBreakThreshold);
      }

      let bottomOfLineItemEntry =
        dashLineYStart - (yDelta + lineHeight * lineBreaks);

      // create new page and reset values if threshhold breaks
      if (bottomOfLineItemEntry <= pageBreakThreshold) {
        // add page
        pageIndex++;
        pdfDoc.addPage(copiedPages[pageIndex]);

        // reset
        lineItemCount = 0;
        yDelta = 40 * lineItemCount;
        lineItemCount++;
        resetYAlignment();
      }
    }

    const currentPage = pdfDoc.getPage(pageIndex);
    const { width } = currentPage.getSize();

    //
    // DRAW ALL LINE ITEMS
    //

    if (item.length === 0) {
      adjustYAlignment("up");
    }

    currentPage.drawText(item, {
      x: leftMargin,
      y: textLine1YStart - yDelta,
      size: fontSize,
      font: helveticaBold,
    });

    // adjust Y if description is null
    if (description.length === 0) {
      adjustYAlignment("up");
    }

    currentPage.drawText(description, {
      x: leftMargin,
      y: textLine2YStart - yDelta,
      lineHeight: lineHeight,
      maxWidth: lineBreakThreshold,
      size: fontSize,
    });

    // define text width for right alignment
    const quantityTextWidth = helveticaBold.widthOfTextAtSize(
      quantity,
      fontSize
    );

    currentPage.drawText(quantity, {
      x: width - rightMargin - quantityTextWidth,
      y: textLine2YStart - yDelta,
      size: fontSize,
    });

    if (descriptionTextWidth > lineBreakThreshold) {
      let lineBreaks = Math.floor(descriptionTextWidth / lineBreakThreshold);

      adjustYAlignment("down", lineBreaks);
    }

    currentPage.drawLine({
      start: { x: leftMargin, y: dashLineYStart - yDelta },
      end: { x: width - rightMargin, y: dashLineYStart - yDelta },
      dashArray: [3],
      dashPhase: 100,
      color: rgb(0.827, 0.871, 0.902),
    });
  }
};

export default createLineItems;
