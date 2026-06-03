"use client";

import { Check, Clock } from "lucide-react";
import type { Payment } from "@/lib/types";
import { formatCurrency, formatFeedDate } from "@/lib/format";
import { ActionMenu } from "./ui/ActionMenu";
import { PixIcon } from "./ui/PixIcon";

interface PaymentsTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onToggleStatus: (payment: Payment) => void;
}

function PaymentMethodBadge({ method }: { method: Payment["method"] }) {
  return (
    <span className="feed-method">
      {method === "PIX" ? <PixIcon /> : null}
      {method}
    </span>
  );
}

function PaymentActions({
  payment,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  payment: Payment;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onToggleStatus: (payment: Payment) => void;
}) {
  return (
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
  );
}

export function PaymentsTable({
  payments,
  onEdit,
  onDelete,
  onToggleStatus,
}: PaymentsTableProps) {
  return (
    <section className="payments-section">
      <h2 className="payments-heading">Pagamentos</h2>

      {payments.length === 0 ? (
        <div className="payments-empty">
          <p>Nenhum pagamento registrado ainda.</p>
        </div>
      ) : (
        <ul className="feed-list">
          {payments.map((payment) => (
            <li key={payment.id} className="feed-item">
              <div className="feed-item-main">
                <div className="feed-item-top">
                  <div className="feed-item-meta">
                    {payment.status === "completed" ? (
                      <span className="feed-status feed-status-done">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span className="feed-status feed-status-pending">
                        <Clock size={12} strokeWidth={2} />
                      </span>
                    )}
                    <PaymentMethodBadge method={payment.method} />
                  </div>
                  <div className="feed-item-actions">
                    <PaymentActions
                      payment={payment}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
                    />
                  </div>
                </div>

                <p className="feed-amount">{formatCurrency(payment.amount)}</p>

                {payment.description.trim() ? (
                  <p className="feed-desc">{payment.description}</p>
                ) : null}

                <p className="feed-date">{formatFeedDate(payment.date)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
