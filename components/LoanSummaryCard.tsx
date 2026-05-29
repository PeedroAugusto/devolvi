"use client";

import { Check, Pencil, User } from "lucide-react";

interface LoanSummaryCardProps {
  creditor: string;
  startDateLabel: string;
  totalBorrowed: string;
  totalReturned: string;
  balance: string;
  progressPercent: number;
  isFullyPaid: boolean;
  onEdit: () => void;
}

export function LoanSummaryCard({
  creditor,
  startDateLabel,
  totalBorrowed,
  totalReturned,
  balance,
  progressPercent,
  isFullyPaid,
  onEdit,
}: LoanSummaryCardProps) {
  return (
    <section className="card card-padded mb-6">
      <div className="loan-header">
        <div className="loan-header-info">
          <div className="avatar avatar-lg">
            <User size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="loan-title">Empréstimo com {creditor}</h2>
            <p className="text-caption">Iniciado em {startDateLabel}</p>
          </div>
        </div>
        <button type="button" className="btn-outline shrink-0" onClick={onEdit}>
          <Pencil size={13} strokeWidth={2} />
          Editar
        </button>
      </div>

      <div className="metrics-row">
        <div className="metric-cell">
          <p className="label-inline">Total emprestado</p>
          <p className="metric-value metric-value-positive">{totalBorrowed}</p>
        </div>
        <div className="metric-divider hidden sm:block" />
        <div className="metric-cell">
          <p className="label-inline">Total já devolvido</p>
          <p className="metric-value metric-value-positive">{totalReturned}</p>
        </div>
        <div className="metric-divider hidden sm:block" />
        <div className="metric-cell">
          <p className="label-inline">Saldo restante</p>
          <p className="metric-value metric-value-neutral">{balance}</p>
        </div>
      </div>

      <div className="progress-bar">
        <div className="flex items-center gap-2">
          <Check size={15} strokeWidth={2.5} className="text-[#16a34a]" />
          <span className="progress-text">
            {isFullyPaid
              ? "Empréstimo quitado."
              : `Você já devolveu ${progressPercent}% do total.`}
          </span>
        </div>
        <span className="progress-badge">{progressPercent}%</span>
      </div>
    </section>
  );
}
