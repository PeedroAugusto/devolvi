import type { Loan, LoanMetrics, Payment } from "./types";

export function getLoanPayments(payments: Payment[], loanId: string): Payment[] {
  return payments
    .filter((payment) => payment.loanId === loanId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function calculateLoanMetrics(loan: Loan, payments: Payment[]): LoanMetrics {
  const loanPayments = getLoanPayments(payments, loan.id);
  const totalReturned = loanPayments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const balance = Math.max(loan.totalAmount - totalReturned, 0);
  const progressPercent =
    loan.totalAmount > 0
      ? Math.min(Math.round((totalReturned / loan.totalAmount) * 100), 100)
      : 0;

  return {
    totalBorrowed: loan.totalAmount,
    totalReturned,
    balance,
    progressPercent,
    isFullyPaid: balance <= 0 && loan.totalAmount > 0,
  };
}
