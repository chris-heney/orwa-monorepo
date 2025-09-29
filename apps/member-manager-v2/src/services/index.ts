import { PDFFont, PDFPage } from "pdf-lib";

export function wrapAndDrawText(
    page: PDFPage,
    text: string,
    font: PDFFont,
    fontSize: number,
    lineHeight: number,
    margin: number,
    pageWidth: number,
    yPosition: number
  ): number {
    const maxWidth = pageWidth - 2 * margin;
    const paragraphs = text.split("\n");
    paragraphs.forEach((paragraph) => {
      const lines = wrapText(paragraph, font, fontSize, maxWidth);
      lines.forEach((line) => {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
        });
        yPosition -= lineHeight;
      });
    });
    return yPosition;
  }
  
  // Utility function to wrap text
 export function wrapText(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
  
    words.forEach((word) => {
      const testLine = line + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && line !== "") {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    });
  
    if (line) {
      lines.push(line.trim());
    }
  
    return lines;
  }