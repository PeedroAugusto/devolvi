"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { calculateLoanMetrics } from "@/lib/calculations";
import { createId, emptyState, loadState, saveState } from "@/lib/storage";
import type {
  AppState,
  Loan,
  LoanFormData,
  LoanMetrics,
  Payment,
  PaymentFormData,
} from "@/lib/types";

interface AppContextValue {
  ready: boolean;
  loans: Loan[];
  payments: Payment[];
  activeLoan: Loan | null;
  activeLoanMetrics: LoanMetrics | null;
  activeLoanPayments: Payment[];
  view: "list" | "detail";
  setView: (view: "list" | "detail") => void;
  selectLoan: (loanId: string) => void;
  backToList: () => void;
  createLoan: (data: LoanFormData) => Loan;
  updateLoan: (loanId: string, data: LoanFormData) => void;
  deleteLoan: (loanId: string) => void;
  createPayment: (loanId: string, data: PaymentFormData) => void;
  updatePayment: (paymentId: string, data: PaymentFormData) => void;
  deletePayment: (paymentId: string) => void;
  togglePaymentStatus: (paymentId: string) => void;
  getLoanMetrics: (loanId: string) => LoanMetrics;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<"list" | "detail">("list");

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setView(loaded.activeLoanId ? "detail" : "list");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState(state);
  }, [state, ready]);

  const activeLoan = useMemo(
    () => state.loans.find((loan) => loan.id === state.activeLoanId) ?? null,
    [state.loans, state.activeLoanId],
  );

  const activeLoanPayments = useMemo(() => {
    if (!activeLoan) return [];
    return state.payments
      .filter((payment) => payment.loanId === activeLoan.id)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [state.payments, activeLoan]);

  const activeLoanMetrics = useMemo(() => {
    if (!activeLoan) return null;
    return calculateLoanMetrics(activeLoan, state.payments);
  }, [activeLoan, state.payments]);

  const getLoanMetrics = useCallback(
    (loanId: string) => {
      const loan = state.loans.find((item) => item.id === loanId);
      if (!loan) {
        return {
          totalBorrowed: 0,
          totalReturned: 0,
          balance: 0,
          progressPercent: 0,
          isFullyPaid: false,
        };
      }
      return calculateLoanMetrics(loan, state.payments);
    },
    [state.loans, state.payments],
  );

  const selectLoan = useCallback((loanId: string) => {
    setState((prev) => ({ ...prev, activeLoanId: loanId }));
    setView("detail");
  }, []);

  const backToList = useCallback(() => {
    setState((prev) => ({ ...prev, activeLoanId: null }));
    setView("list");
  }, []);

  const createLoan = useCallback((data: LoanFormData) => {
    const loan: Loan = {
      id: createId(),
      creditor: data.creditor.trim(),
      startDate: data.startDate,
      totalAmount: data.totalAmount,
      notes: data.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      loans: [loan, ...prev.loans],
      activeLoanId: loan.id,
    }));
    setView("detail");
    return loan;
  }, []);

  const updateLoan = useCallback((loanId: string, data: LoanFormData) => {
    setState((prev) => ({
      ...prev,
      loans: prev.loans.map((loan) =>
        loan.id === loanId
          ? {
              ...loan,
              creditor: data.creditor.trim(),
              startDate: data.startDate,
              totalAmount: data.totalAmount,
              notes: data.notes.trim(),
            }
          : loan,
      ),
    }));
  }, []);

  const deleteLoan = useCallback((loanId: string) => {
    setState((prev) => {
      const loans = prev.loans.filter((loan) => loan.id !== loanId);
      const payments = prev.payments.filter((payment) => payment.loanId !== loanId);
      const activeLoanId =
        prev.activeLoanId === loanId ? null : prev.activeLoanId;

      return { loans, payments, activeLoanId };
    });
    setView("list");
  }, []);

  const createPayment = useCallback((loanId: string, data: PaymentFormData) => {
    const payment: Payment = {
      id: createId(),
      loanId,
      date: data.date,
      description: data.description.trim(),
      amount: data.amount,
      method: data.method,
      status: data.status,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      payments: [payment, ...prev.payments],
    }));
  }, []);

  const updatePayment = useCallback((paymentId: string, data: PaymentFormData) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              date: data.date,
              description: data.description.trim(),
              amount: data.amount,
              method: data.method,
              status: data.status,
            }
          : payment,
      ),
    }));
  }, []);

  const deletePayment = useCallback((paymentId: string) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.filter((payment) => payment.id !== paymentId),
    }));
  }, []);

  const togglePaymentStatus = useCallback((paymentId: string) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: payment.status === "completed" ? "pending" : "completed",
            }
          : payment,
      ),
    }));
  }, []);

  const value: AppContextValue = {
    ready,
    loans: state.loans,
    payments: state.payments,
    activeLoan,
    activeLoanMetrics,
    activeLoanPayments,
    view,
    setView,
    selectLoan,
    backToList,
    createLoan,
    updateLoan,
    deleteLoan,
    createPayment,
    updatePayment,
    deletePayment,
    togglePaymentStatus,
    getLoanMetrics,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de AppProvider");
  }
  return context;
}
