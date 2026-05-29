export type PaymentMethod = "PIX" | "Dinheiro" | "Transferência" | "Cartão" | "Outro";

export type PaymentStatus = "completed" | "pending";

export interface Payment {
  id: string;
  loanId: string;
  date: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Loan {
  id: string;
  creditor: string;
  startDate: string;
  totalAmount: number;
  notes: string;
  createdAt: string;
}

export interface AppState {
  loans: Loan[];
  payments: Payment[];
  activeLoanId: string | null;
}

export interface LoanFormData {
  creditor: string;
  startDate: string;
  totalAmount: number;
  notes: string;
}

export interface PaymentFormData {
  date: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface LoanMetrics {
  totalBorrowed: number;
  totalReturned: number;
  balance: number;
  progressPercent: number;
  isFullyPaid: boolean;
}
