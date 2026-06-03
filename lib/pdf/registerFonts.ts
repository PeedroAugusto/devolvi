import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;

  Font.register({
    family: "Nunito",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/npm/@fontsource/nunito@5.2.5/files/nunito-latin-400-normal.woff",
        fontWeight: 400,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@fontsource/nunito@5.2.5/files/nunito-latin-600-normal.woff",
        fontWeight: 600,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@fontsource/nunito@5.2.5/files/nunito-latin-700-normal.woff",
        fontWeight: 700,
      },
    ],
  });

  registered = true;
}

export const PDF_FONT = "Nunito";

export const pdfBold = { fontFamily: PDF_FONT, fontWeight: 700 as const };
export const pdfSemi = { fontFamily: PDF_FONT, fontWeight: 600 as const };
export const pdfRegular = { fontFamily: PDF_FONT, fontWeight: 400 as const };
