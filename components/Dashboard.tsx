"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import {
  formatCurrency,
  formatShortDate,
  formatTableDate,
} from "@/lib/format";
import type { Loan, Payment } from "@/lib/types";
import { Header } from "./Header";
import { LoanInfoCard, PaymentsTable } from "./PaymentsTable";
import { LoanListView } from "./LoanListView";
import { LoanModal } from "./LoanModal";
import { LoanSummaryCard } from "./LoanSummaryCard";
import { PaymentModal } from "./PaymentModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";

export function Dashboard() {
  const {
    ready,
    loans,
    activeLoan,
    activeLoanMetrics,
    activeLoanPayments,
    view,
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
  } = useApp();

  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [loanModalMode, setLoanModalMode] = useState<"create" | "edit">("create");
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalMode, setPaymentModalMode] = useState<"create" | "edit">("create");
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [confirmLoanDelete, setConfirmLoanDelete] = useState(false);
  const [confirmPaymentDelete, setConfirmPaymentDelete] = useState<Payment | null>(
    null,
  );

  const sortedLoans = useMemo(
    () =>
      [...loans].sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt) || b.startDate.localeCompare(a.startDate),
      ),
    [loans],
  );

  const openCreateLoan = () => {
    setLoanModalMode("create");
    setEditingLoan(null);
    setLoanModalOpen(true);
  };

  const openEditLoan = () => {
    if (!activeLoan) return;
    setLoanModalMode("edit");
    setEditingLoan(activeLoan);
    setLoanModalOpen(true);
  };

  const openCreatePayment = () => {
    setPaymentModalMode("create");
    setEditingPayment(null);
    setPaymentModalOpen(true);
  };

  const openEditPayment = (payment: Payment) => {
    setPaymentModalMode("edit");
    setEditingPayment(payment);
    setPaymentModalOpen(true);
  };

  if (!ready) {
    return (
      <main className="page">
        <div className="page-container loading-state">Carregando...</div>
      </main>
    );
  }

  const showDetail = view === "detail" && !!activeLoan && !!activeLoanMetrics;

  return (
    <main className="page">
      <div className="page-container">
        <Header
          subtitle={
            showDetail
              ? "Aqui está o resumo do seu empréstimo."
              : loans.length > 0
                ? "Selecione um empréstimo ou crie um novo."
                : "Organize seus empréstimos e devoluções em um só lugar."
          }
          showBack={showDetail}
          onBack={backToList}
          onNewLoan={openCreateLoan}
        />

        {showDetail ? (
          <>
            <LoanSummaryCard
              creditor={activeLoan.creditor}
              startDateLabel={formatShortDate(activeLoan.startDate)}
              totalBorrowed={formatCurrency(activeLoanMetrics.totalBorrowed)}
              totalReturned={formatCurrency(activeLoanMetrics.totalReturned)}
              balance={formatCurrency(activeLoanMetrics.balance)}
              progressPercent={activeLoanMetrics.progressPercent}
              isFullyPaid={activeLoanMetrics.isFullyPaid}
              onEdit={openEditLoan}
            />

            <PaymentsTable
              payments={activeLoanPayments}
              onAdd={openCreatePayment}
              onEdit={openEditPayment}
              onDelete={(payment) => setConfirmPaymentDelete(payment)}
              onToggleStatus={(payment) => togglePaymentStatus(payment.id)}
            />

            <LoanInfoCard
              creditor={activeLoan.creditor}
              startDate={formatTableDate(activeLoan.startDate)}
              totalBorrowed={formatCurrency(activeLoan.totalAmount)}
              notes={activeLoan.notes}
              onDelete={() => setConfirmLoanDelete(true)}
            />
          </>
        ) : (
          <LoanListView
            loans={sortedLoans}
            getProgress={(loanId) => getLoanMetrics(loanId).progressPercent}
            getBalance={(loanId) => getLoanMetrics(loanId).balance}
            onSelect={selectLoan}
            onNewLoan={openCreateLoan}
          />
        )}
      </div>

      <LoanModal
        open={loanModalOpen}
        mode={loanModalMode}
        initialData={
          editingLoan
            ? {
                creditor: editingLoan.creditor,
                startDate: editingLoan.startDate,
                totalAmount: editingLoan.totalAmount,
                notes: editingLoan.notes,
              }
            : undefined
        }
        onClose={() => setLoanModalOpen(false)}
        onSubmit={(data) => {
          if (loanModalMode === "create") {
            createLoan(data);
          } else if (editingLoan) {
            updateLoan(editingLoan.id, data);
          }
        }}
      />

      <PaymentModal
        open={paymentModalOpen}
        mode={paymentModalMode}
        initialData={
          editingPayment
            ? {
                date: editingPayment.date,
                description: editingPayment.description,
                amount: editingPayment.amount,
                method: editingPayment.method,
                status: editingPayment.status,
              }
            : undefined
        }
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(data) => {
          if (!activeLoan) return;

          if (paymentModalMode === "create") {
            createPayment(activeLoan.id, data);
          } else if (editingPayment) {
            updatePayment(editingPayment.id, data);
          }
        }}
      />

      <ConfirmDialog
        open={confirmLoanDelete}
        title="Excluir empréstimo"
        message="Esta ação remove o empréstimo e todos os pagamentos vinculados. Não é possível desfazer."
        onConfirm={() => {
          if (activeLoan) deleteLoan(activeLoan.id);
        }}
        onClose={() => setConfirmLoanDelete(false)}
      />

      <ConfirmDialog
        open={!!confirmPaymentDelete}
        title="Excluir pagamento"
        message="Tem certeza que deseja excluir este pagamento?"
        onConfirm={() => {
          if (confirmPaymentDelete) deletePayment(confirmPaymentDelete.id);
        }}
        onClose={() => setConfirmPaymentDelete(null)}
      />
    </main>
  );
}
