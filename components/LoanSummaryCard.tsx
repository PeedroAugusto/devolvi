"use client";

interface LoanSummaryCardProps {
  totalBorrowed: string;
  totalReturned: string;
  balance: string;
  progressPercent: number;
  isFullyPaid: boolean;
}

export function LoanSummaryCard({
  totalBorrowed,
  totalReturned,
  balance,
  progressPercent,
  isFullyPaid,
}: LoanSummaryCardProps) {
  const progressLabel = isFullyPaid
    ? "Quitado"
    : `${progressPercent}% quitado`;

  return (
    <section className="hero-card">
      <p className="hero-label">Saldo restante</p>
      <p className="hero-balance">{balance}</p>
      <p className="hero-progress-label">{progressLabel}</p>

      <div
        className="hero-progress-track"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="hero-progress-fill"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      <div className="kpi-row">
        <div className="kpi-item">
          <p className="kpi-value">{totalBorrowed}</p>
          <p className="kpi-label">Emprestado</p>
        </div>
        <div className="kpi-divider" aria-hidden="true" />
        <div className="kpi-item">
          <p className="kpi-value kpi-value-positive">{totalReturned}</p>
          <p className="kpi-label">Pago</p>
        </div>
      </div>
    </section>
  );
}
