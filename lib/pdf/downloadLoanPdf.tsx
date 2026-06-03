import type { Loan, LoanMetrics, Payment } from "@/lib/types";
import { LoanPdfDocument } from "./LoanPdfDocument";

function sanitizeFilename(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function generatedAtLabel(): string {
  const now = new Date();
  const datePart = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now);
  const timePart = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  return `${datePart} às ${timePart}`;
}

export async function downloadLoanPdf(
  loan: Loan,
  metrics: LoanMetrics,
  payments: Payment[],
): Promise<void> {
  const { pdf } = await import("@react-pdf/renderer");
  const { registerPdfFonts } = await import("./registerFonts");

  registerPdfFonts();

  const generatedAt = generatedAtLabel();
  const { loadLogoDataUrl } = await import("./loadLogo");
  const logoSrc = await loadLogoDataUrl();

  const blob = await pdf(
    <LoanPdfDocument
      loan={loan}
      metrics={metrics}
      payments={payments}
      generatedAt={generatedAt}
      logoSrc={logoSrc}
    />,
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const creditorSlug = sanitizeFilename(loan.creditor) || "emprestimo";
  const dateSlug = loan.startDate.replace(/-/g, "");
  const filename = `devolvi-${creditorSlug}-${dateSlug}.pdf`;

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
