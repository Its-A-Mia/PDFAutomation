import { rgb } from "pdf-lib";

const createTableTitleBar = (page, yRef, font) => {
  const { width } = page.getSize();

  const titleBarYPos = yRef - 16;
  const leftMargin = 37.5;
  const rightMargin = width - 37.5;
  const fontSize = 9;

  page.drawLine({
    start: { x: leftMargin, y: titleBarYPos },
    end: { x: rightMargin, y: titleBarYPos },
    thickness: 18,
    color: rgb(0.827, 0.871, 0.902),
  });

  page.drawText("DESCRIPTION", {
    x: leftMargin + 3,
    y: titleBarYPos - 3,
    font: font,
    size: fontSize,
  });

  const QTYTextWidth = font.widthOfTextAtSize("QTY", fontSize);

  page.drawText("QTY", {
    x: rightMargin - QTYTextWidth - 3,
    y: titleBarYPos - 3,
    font: font,
    size: fontSize,
  });

  return titleBarYPos;
};

export default createTableTitleBar;
