const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const tableDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const feedDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatShortDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  return shortDateFormatter.format(date);
}

export function formatTableDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  return tableDateFormatter.format(date);
}

export function formatFeedDate(isoDate: string): string {
  const date = parseISODate(isoDate);
  const parts = feedDateFormatter.formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const monthRaw = parts.find((p) => p.type === "month")?.value?.replace(".", "") ?? "";
  const month = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  return `${day} ${month} ${year}`;
}

export function formatInputDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

export function formatCurrencyInput(value: number): string {
  if (!value) return "";
  return formatCurrency(value).replace("R$\u00a0", "");
}
