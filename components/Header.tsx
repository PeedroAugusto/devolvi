"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { Logo } from "./Logo";

interface HeaderProps {
  subtitle: string;
  showBack?: boolean;
  onBack?: () => void;
  onNewLoan?: () => void;
}

export function Header({
  subtitle,
  showBack,
  onBack,
  onNewLoan,
}: HeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        {showBack && onBack ? (
          <button type="button" className="back-link" onClick={onBack}>
            <ArrowLeft size={15} strokeWidth={2} />
            Meus empréstimos
          </button>
        ) : null}
        <Logo />
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {onNewLoan ? (
        <button
          type="button"
          className="btn-primary page-header-action"
          onClick={onNewLoan}
        >
          <Plus size={15} strokeWidth={2.25} />
          <span className="btn-label-full">Novo empréstimo</span>
          <span className="btn-label-short">Novo</span>
        </button>
      ) : null}
    </header>
  );
}
