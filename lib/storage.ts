import type { AppState } from "./types";

const STORAGE_KEY = "devolvi-app-state-v1";

export const emptyState: AppState = {
  loans: [],
  payments: [],
  activeLoanId: null,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;

    const parsed = JSON.parse(raw) as AppState;
    return {
      loans: parsed.loans ?? [],
      payments: parsed.payments ?? [],
      activeLoanId: parsed.activeLoanId ?? null,
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
