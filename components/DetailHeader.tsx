"use client";

import { ArrowLeft, Download, Loader2, Pencil } from "lucide-react";
import { Logo } from "./Logo";

interface DetailHeaderProps {
  creditor: string;
  startDateLabel: string;
  onBack: () => void;
  onEdit: () => void;
  onDownload: () => void;
  downloading?: boolean;
}

export function DetailHeader({
  creditor,
  startDateLabel,
  onBack,
  onEdit,
  onDownload,
  downloading = false,
}: DetailHeaderProps) {
  return (
    <>
      {/* <Logo className="site-logo-detail" /> */}
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

      <div className="detail-header-actions">
        <button
          type="button"
          className="detail-edit-btn"
          onClick={onDownload}
          disabled={downloading}
          aria-label="Baixar extrato em PDF"
        >
          {downloading ? (
            <Loader2 size={16} strokeWidth={2} className="detail-spinner" />
          ) : (
            <Download size={16} strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          className="detail-edit-btn"
          onClick={onEdit}
          aria-label="Editar empréstimo"
        >
          <Pencil size={16} strokeWidth={2} />
        </button>
      </div>
    </header>
    </>
  );
}
