"use client";

import { ArrowLeft, Plus } from "lucide-react";

interface HeaderProps {
  subtitle: string;
  showBack?: boolean;
  onBack?: () => void;
  onNewLoan: () => void;
}

export function Header({ subtitle, showBack, onBack, onNewLoan }: HeaderProps) {
  return (
    <header className="page-header">
      <div>
        {showBack && onBack ? (
          <button type="button" className="back-link" onClick={onBack}>
            <ArrowLeft size={14} strokeWidth={2} />
            Meus empréstimos
          </button>
        ) : null}
        <h1 className="page-title">Olá! 👋</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <button
        type="button"
        className="btn-primary self-start-sm-auto"
        onClick={onNewLoan}
      >
        <Plus size={15} strokeWidth={2.25} />
        Novo empréstimo
      </button>
    </header>
  );
}
