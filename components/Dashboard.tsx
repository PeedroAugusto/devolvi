"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import {
  formatCurrency,
  formatShortDate,
  formatTableDate,
} from "@/lib/format";
import type { Loan, Payment } from "@/lib/types";
import { Header } from "./Header";
import { DetailHeader } from "./DetailHeader";
import { PaymentsTable } from "./PaymentsTable";
import { LoanDetailsSection } from "./LoanDetailsSection";
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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

  const handleDownloadPdf = async () => {
    if (!activeLoan || !activeLoanMetrics || downloadingPdf) return;

    setDownloadingPdf(true);
    try {
      const { downloadLoanPdf } = await import("@/lib/pdf/downloadLoanPdf");
      await downloadLoanPdf(activeLoan, activeLoanMetrics, activeLoanPayments);
    } finally {
      setDownloadingPdf(false);
    }
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
    <main className={`page${showDetail ? " page-detail" : ""}`}>
      <div className={`page-container${showDetail ? " page-container-detail" : ""}`}>
        {showDetail && activeLoan ? (
          <>
            <DetailHeader
              creditor={activeLoan.creditor}
              startDateLabel={formatShortDate(activeLoan.startDate)}
              onBack={backToList}
              onEdit={openEditLoan}
              onDownload={handleDownloadPdf}
              downloading={downloadingPdf}
            />

            <LoanSummaryCard
              totalBorrowed={formatCurrency(activeLoanMetrics.totalBorrowed)}
              totalReturned={formatCurrency(activeLoanMetrics.totalReturned)}
              balance={formatCurrency(activeLoanMetrics.balance)}
              progressPercent={activeLoanMetrics.progressPercent}
              isFullyPaid={activeLoanMetrics.isFullyPaid}
            />

            <PaymentsTable
              payments={activeLoanPayments}
              onEdit={openEditPayment}
              onDelete={(payment) => setConfirmPaymentDelete(payment)}
              onToggleStatus={(payment) => togglePaymentStatus(payment.id)}
            />

            <LoanDetailsSection
              creditor={activeLoan.creditor}
              startDate={formatTableDate(activeLoan.startDate)}
              totalBorrowed={formatCurrency(activeLoan.totalAmount)}
              notes={activeLoan.notes}
              onDelete={() => setConfirmLoanDelete(true)}
            />
          </>
        ) : (
          <>
            <Header
              subtitle={
                loans.length > 0
                  ? "Selecione um empréstimo ou crie um novo."
                  : "Organize seus empréstimos e devoluções em um só lugar."
              }
              onNewLoan={openCreateLoan}
            />

            <LoanListView
              loans={sortedLoans}
              getProgress={(loanId) => getLoanMetrics(loanId).progressPercent}
              getBalance={(loanId) => getLoanMetrics(loanId).balance}
              onSelect={selectLoan}
              onNewLoan={openCreateLoan}
            />
          </>
        )}
      </div>

      {showDetail ? (
        <div className="sticky-footer">
          <button
            type="button"
            className="btn-primary btn-sticky"
            onClick={openCreatePayment}
          >
            <Plus size={18} strokeWidth={2.25} />
            Registrar pagamento
          </button>
        </div>
      ) : null}

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
