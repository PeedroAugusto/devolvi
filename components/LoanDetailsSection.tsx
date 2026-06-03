"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface LoanDetailsSectionProps {
  creditor: string;
  startDate: string;
  totalBorrowed: string;
  notes: string;
  onDelete: () => void;
}

export function LoanDetailsSection({
  creditor,
  startDate,
  totalBorrowed,
  notes,
  onDelete,
}: LoanDetailsSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="details-section">
      <button
        type="button"
        className="details-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>Detalhes do empréstimo</span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`details-chevron${open ? " details-chevron-open" : ""}`}
        />
      </button>

      {open ? (
        <div className="details-body">
          <div className="details-field">
            <p className="details-field-label">Credor</p>
            <p className="details-field-value">{creditor}</p>
          </div>
          <div className="details-field">
            <p className="details-field-label">Data início</p>
            <p className="details-field-value">{startDate}</p>
          </div>
          <div className="details-field">
            <p className="details-field-label">Valor inicial</p>
            <p className="details-field-value">{totalBorrowed}</p>
          </div>
          {notes.trim() ? (
            <div className="details-field">
              <p className="details-field-label">Observações</p>
              <p className="details-field-value">{notes}</p>
            </div>
          ) : null}

          <button type="button" className="details-delete-btn" onClick={onDelete}>
            Excluir empréstimo
          </button>
        </div>
      ) : null}
    </section>
  );
}
