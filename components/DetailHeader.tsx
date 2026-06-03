"use client";

import { ArrowLeft, Pencil } from "lucide-react";

interface DetailHeaderProps {
  creditor: string;
  startDateLabel: string;
  onBack: () => void;
  onEdit: () => void;
}

export function DetailHeader({
  creditor,
  startDateLabel,
  onBack,
  onEdit,
}: DetailHeaderProps) {
  return (
    <header className="detail-header">
      <button
        type="button"
        className="detail-back-btn"
        onClick={onBack}
        aria-label="Voltar para meus empréstimos"
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      <div className="detail-header-center">
        <h1 className="detail-title">Empréstimo com {creditor}</h1>
        <p className="detail-subtitle">Iniciado em {startDateLabel}</p>
      </div>

      <button
        type="button"
        className="detail-edit-btn"
        onClick={onEdit}
        aria-label="Editar empréstimo"
      >
        <Pencil size={16} strokeWidth={2} />
      </button>
    </header>
  );
}
