"use client";

import { Check, Clock, Info, Plus } from "lucide-react";
import type { Payment } from "@/lib/types";
import { formatCurrency, formatTableDate } from "@/lib/format";
import { ActionMenu } from "./ui/ActionMenu";
import { PixIcon } from "./ui/PixIcon";

interface PaymentsTableProps {
  payments: Payment[];
  onAdd: () => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onToggleStatus: (payment: Payment) => void;
}

function PaymentMethodLabel({ method }: { method: Payment["method"] }) {
  if (method === "PIX") {
    return (
      <div className="col-method flex items-center gap-2">
        <PixIcon />
        <span className="text-body">{method}</span>
      </div>
    );
  }

  return <span className="col-method text-body">{method}</span>;
}

export function PaymentsTable({
  payments,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
}: PaymentsTableProps) {
  return (
    <section className="card card-padded mb-6">
      <div className="section-header">
        <h2 className="section-title">Pagamentos</h2>
        <button type="button" className="btn-primary self-start-sm-auto" onClick={onAdd}>
          <Plus size={15} strokeWidth={2.25} />
          Adicionar pagamento
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="empty-inline">
          <p>Nenhum pagamento registrado ainda.</p>
          <button type="button" className="link-button" onClick={onAdd}>
            Adicionar o primeiro pagamento
          </button>
        </div>
      ) : (
        <div className="payments-table-wrap">
          <div className="payments-table-inner">
            <div className="table-header">
              <span />
              <span className="label">Data</span>
              <span className="col-desc label">Descrição</span>
              <span className="label">Valor</span>
              <span className="col-method label">Forma de pagamento</span>
              <span />
            </div>

            {payments.map((payment) => (
              <div key={payment.id} className="table-row">
                <div className="flex items-center justify-center">
                  {payment.status === "completed" ? (
                    <div className="status-icon status-icon-done">
                      <Check size={12} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="status-icon status-icon-pending">
                      <Clock size={12} strokeWidth={2} />
                    </div>
                  )}
                </div>
                <span className="text-body">{formatTableDate(payment.date)}</span>
                <span className="col-desc text-body">
                  {payment.description.trim() ? payment.description : "—"}
                </span>
                <span className="text-amount">{formatCurrency(payment.amount)}</span>
                <PaymentMethodLabel method={payment.method} />
                <div className="table-row-actions">
                  <ActionMenu
                  items={[
                    {
                      label:
                        payment.status === "completed"
                          ? "Marcar como pendente"
                          : "Marcar como realizado",
                      onClick: () => onToggleStatus(payment),
                    },
                    { label: "Editar", onClick: () => onEdit(payment) },
                    {
                      label: "Excluir",
                      onClick: () => onDelete(payment),
                      danger: true,
                    },
                  ]}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface LoanInfoCardProps {
  creditor: string;
  startDate: string;
  totalBorrowed: string;
  notes: string;
  onDelete: () => void;
}

export function LoanInfoCard({
  creditor,
  startDate,
  totalBorrowed,
  notes,
  onDelete,
}: LoanInfoCardProps) {
  return (
    <section className="info-card card-padded">
      <div className="info-header">
        <div className="info-title-row">
          <Info size={15} strokeWidth={2} className="text-[#8b95a5]" />
          <h2>Informações do empréstimo</h2>
        </div>
        <button type="button" className="link-button danger" onClick={onDelete}>
          Excluir empréstimo
        </button>
      </div>

      <div className="info-grid">
        <div>
          <p className="label">Credor</p>
          <p className="info-value">{creditor}</p>
        </div>
        <div>
          <p className="label">Data do início</p>
          <p className="info-value">{startDate}</p>
        </div>
        <div>
          <p className="label">Total emprestado</p>
          <p className="info-value">{totalBorrowed}</p>
        </div>
        <div>
          <p className="label">Observações</p>
          <p className="info-value">{notes.trim() ? notes : "—"}</p>
        </div>
      </div>
    </section>
  );
}
