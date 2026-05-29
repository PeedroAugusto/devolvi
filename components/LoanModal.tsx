"use client";

import { useEffect, useState } from "react";
import {
  formatCurrencyInput,
  parseCurrencyInput,
  todayISO,
} from "@/lib/format";
import type { LoanFormData } from "@/lib/types";
import { Modal } from "./ui/Modal";

interface LoanModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: LoanFormData;
  onClose: () => void;
  onSubmit: (data: LoanFormData) => void;
}

export function LoanModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: LoanModalProps) {
  const [creditor, setCreditor] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [amountInput, setAmountInput] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setCreditor(initialData?.creditor ?? "");
    setStartDate(initialData?.startDate ?? todayISO());
    setAmountInput(
      initialData?.totalAmount
        ? formatCurrencyInput(initialData.totalAmount)
        : "",
    );
    setNotes(initialData?.notes ?? "");
    setError("");
  }, [open, initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const totalAmount = parseCurrencyInput(amountInput);

    if (!creditor.trim()) {
      setError("Informe o nome do credor.");
      return;
    }

    if (!startDate) {
      setError("Informe a data de início.");
      return;
    }

    if (totalAmount <= 0) {
      setError("Informe um valor emprestado válido.");
      return;
    }

    onSubmit({
      creditor,
      startDate,
      totalAmount,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Novo empréstimo" : "Editar empréstimo"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="loan-form" className="btn-primary">
            {mode === "create" ? "Criar empréstimo" : "Salvar alterações"}
          </button>
        </div>
      }
    >
      <form id="loan-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="form-field">
          <label htmlFor="creditor">Credor</label>
          <input
            id="creditor"
            type="text"
            value={creditor}
            onChange={(event) => setCreditor(event.target.value)}
            placeholder="Ex: João"
            autoFocus
          />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="startDate">Data de início</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="totalAmount">Valor emprestado</label>
            <div className="input-prefix">
              <span>R$</span>
              <input
                id="totalAmount"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(event) =>
                  setAmountInput(formatCurrencyInput(parseCurrencyInput(event.target.value)))
                }
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="notes">Observações</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Opcional"
            rows={3}
          />
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </Modal>
  );
}
