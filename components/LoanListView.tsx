"use client";

import { ChevronRight, Plus, User } from "lucide-react";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { Loan } from "@/lib/types";

interface LoanListViewProps {
  loans: Loan[];
  getProgress: (loanId: string) => number;
  getBalance: (loanId: string) => number;
  onSelect: (loanId: string) => void;
  onNewLoan: () => void;
}

export function LoanListView({
  loans,
  getProgress,
  getBalance,
  onSelect,
  onNewLoan,
}: LoanListViewProps) {
  if (loans.length === 0) {
    return (
      <div className="empty-state card">
        <div className="avatar avatar-lg">
          <User size={22} strokeWidth={1.75} />
        </div>
        <h2 className="empty-state-title">Nenhum empréstimo ainda</h2>
        <p className="empty-state-text">
          Comece registrando um empréstimo para acompanhar quanto você pegou,
          quanto já devolveu e todos os pagamentos realizados.
        </p>
        <button type="button" className="btn-primary mt-7" onClick={onNewLoan}>
          <Plus size={15} strokeWidth={2.25} />
          Criar primeiro empréstimo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {loans.map((loan) => {
        const progress = getProgress(loan.id);
        const balance = getBalance(loan.id);

        return (
          <button
            key={loan.id}
            type="button"
            className="loan-list-item card w-full text-left"
            onClick={() => onSelect(loan.id)}
          >
            <div className="flex items-center gap-3.5">
              <div className="avatar avatar-md">
                <User size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate loan-title">
                    Empréstimo com {loan.creditor}
                  </h3>
                  <ChevronRight size={16} className="shrink-0 text-[#8b95a5]" strokeWidth={2} />
                </div>
                <p className="text-caption mt-0.5">
                  Iniciado em {formatShortDate(loan.startDate)}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
                  <span className="text-[#5f6b7a]">
                    Emprestado{" "}
                    <strong className="font-semibold text-[#16a34a]">
                      {formatCurrency(loan.totalAmount)}
                    </strong>
                  </span>
                  <span className="text-[#5f6b7a]">
                    Saldo{" "}
                    <strong className="font-semibold text-[#0f1419]">
                      {formatCurrency(balance)}
                    </strong>
                  </span>
                  <span className="badge">{progress}% devolvido</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
