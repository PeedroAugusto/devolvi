"use client";

import { useEffect, useState } from "react";
import {
  formatCurrencyInput,
  parseCurrencyInput,
  todayISO,
} from "@/lib/format";
import type { PaymentFormData, PaymentMethod, PaymentStatus } from "@/lib/types";
import { Modal } from "./ui/Modal";

interface PaymentModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: PaymentFormData;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
}

const paymentMethods: PaymentMethod[] = [
  "PIX",
  "Dinheiro",
  "Transferência",
  "Cartão",
  "Outro",
];

export function PaymentModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: PaymentModalProps) {
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("PIX");
  const [status, setStatus] = useState<PaymentStatus>("completed");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setDate(initialData?.date ?? todayISO());
    setDescription(initialData?.description ?? "");
    setAmountInput(
      initialData?.amount ? formatCurrencyInput(initialData.amount) : "",
    );
    setMethod(initialData?.method ?? "PIX");
    setStatus(initialData?.status ?? "completed");
    setError("");
  }, [open, initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const amount = parseCurrencyInput(amountInput);

    if (!date) {
      setError("Informe a data do pagamento.");
      return;
    }

    if (amount <= 0) {
      setError("Informe um valor válido.");
      return;
    }

    onSubmit({
      date,
      description,
      amount,
      method,
      status,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Adicionar pagamento" : "Editar pagamento"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="payment-form" className="btn-primary">
            {mode === "create" ? "Adicionar" : "Salvar alterações"}
          </button>
        </div>
      }
    >
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="paymentDate">Data</label>
            <input
              id="paymentDate"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="paymentAmount">Valor</label>
            <div className="input-prefix">
              <span>R$</span>
              <input
                id="paymentAmount"
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={(event) =>
                  setAmountInput(formatCurrencyInput(parseCurrencyInput(event.target.value)))
                }
                placeholder="0,00"
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="paymentDescription">Descrição (opcional)</label>
          <input
            id="paymentDescription"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ex: Primeira parcela"
          />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="paymentMethod">Forma de pagamento</label>
            <select
              id="paymentMethod"
              value={method}
              onChange={(event) => setMethod(event.target.value as PaymentMethod)}
            >
              {paymentMethods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="paymentStatus">Status</label>
            <select
              id="paymentStatus"
              value={status}
              onChange={(event) => setStatus(event.target.value as PaymentStatus)}
            >
              <option value="completed">Realizado</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </Modal>
  );
}
