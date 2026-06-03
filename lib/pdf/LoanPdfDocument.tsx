import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
} from "@react-pdf/renderer";
import type { Loan, LoanMetrics, Payment } from "@/lib/types";
import { formatCurrency, formatTableDate } from "@/lib/format";
import { PDF_FONT, registerPdfFonts } from "./registerFonts";

registerPdfFonts();

const C = {
  text: "#0F172A",
  secondary: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  primary: "#16A34A",
  primaryDark: "#15803D",
  primaryLight: "#ECFDF5",
  primaryMuted: "#F0FDF4",
  white: "#FFFFFF",
  tableHead: "#F8FAFC",
  resumoBg: "#F0FDF4",
  resumoBorder: "#BBF7D0",
};

const PAGE_W = 595;
const PAGE_PAD = 40;
const CONTENT_W = PAGE_W - PAGE_PAD * 2;

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: PAGE_PAD,
    fontFamily: PDF_FONT,
    fontWeight: 400,
    fontSize: 10,
    color: C.text,
    backgroundColor: C.white,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 30,
    height: 30,
    objectFit: "contain",
  },
  brandName: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
    letterSpacing: -0.3,
  },
  docMeta: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 9,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
    letterSpacing: 0.8,
  },
  docDate: {
    marginTop: 4,
    fontSize: 8,
    color: C.muted,
  },

  loanIdentity: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  loanIdentityText: {
    marginLeft: 10,
    flex: 1,
  },
  loanTitle: {
    fontSize: 13,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
  },
  loanSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: C.secondary,
  },

  heroCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: "center",
  },
  heroLeft: {
    flex: 1,
    paddingRight: 16,
  },
  heroLabel: {
    fontSize: 8,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.primary,
    letterSpacing: 0.8,
  },
  heroBalance: {
    marginTop: 6,
    fontSize: 24,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.primary,
  },
  heroSub: {
    marginTop: 4,
    fontSize: 9,
    color: C.secondary,
  },
  heroDivider: {
    width: 1,
    height: 72,
    backgroundColor: C.border,
  },
  heroRight: {
    width: 96,
    marginLeft: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  donutWrap: {
    width: 88,
    height: 88,
    position: "relative",
  },
  donutCenter: {
    position: "absolute",
    top: 28,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  donutPercent: {
    fontSize: 17,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
  },
  donutLabel: {
    marginTop: 1,
    fontSize: 8,
    color: C.primary,
    fontFamily: PDF_FONT,
    fontWeight: 700,
  },

  kpiRow: {
    flexDirection: "row",
    marginBottom: 22,
  },
  kpiCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  kpiCardFirst: {
    marginRight: 10,
  },
  kpiIcon: {
    marginRight: 10,
  },
  kpiIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiIconSymbol: {
    fontFamily: PDF_FONT,
    fontWeight: 700,
    fontSize: 16,
    color: C.primary,
    marginTop: -1,
  },
  kpiText: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 7,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.muted,
    letterSpacing: 0.5,
  },
  kpiValue: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
    letterSpacing: 0.5,
  },

  table: {
    width: CONTENT_W,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    marginBottom: 16,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.tableHead,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeadCell: {
    fontSize: 7,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.muted,
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    alignItems: "center",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    fontSize: 9,
    color: C.text,
  },
  tableCellGreen: {
    fontSize: 9,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.primary,
  },
  tableMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableMethodText: {
    marginLeft: 4,
    fontSize: 9,
    color: C.text,
  },
  colDate: { width: 72 },
  colDesc: { width: 110 },
  colMethod: { width: 148 },
  colValue: { width: CONTENT_W - 72 - 110 - 148 - 24, textAlign: "right" },
  emptyTable: {
    padding: 16,
    textAlign: "center",
    fontSize: 9,
    color: C.secondary,
  },

  resumoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.resumoBg,
    borderWidth: 1,
    borderColor: C.resumoBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  resumoTitle: {
    width: 52,
    fontSize: 7,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.primaryDark,
    letterSpacing: 0.5,
  },
  resumoRow: {
    flex: 1,
    flexDirection: "row",
  },
  resumoItem: {
    flex: 1,
    paddingRight: 6,
  },
  resumoLabel: {
    fontSize: 6.5,
    color: C.secondary,
    lineHeight: 1.2,
  },
  resumoValue: {
    marginTop: 2,
    fontSize: 8.5,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
  },
  resumoValueGreen: {
    marginTop: 2,
    fontSize: 8.5,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.primary,
  },

  infoBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  infoGrid: {
    flexDirection: "row",
    marginTop: 12,
  },
  infoItem: {
    width: "25%",
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.muted,
    letterSpacing: 0.4,
  },
  infoValue: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: C.text,
  },

  signatures: {
    flexDirection: "row",
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  signatureBlock: {
    flex: 1,
    alignItems: "center",
  },
  signatureBlockFirst: {
    marginRight: 40,
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 8,
    height: 32,
  },
  signatureLabel: {
    fontSize: 9,
    color: C.secondary,
  },
});

function UserIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36">
      <Circle cx={18} cy={18} r={18} fill={C.primaryLight} />
      <Circle cx={18} cy={14} r={5} fill={C.primary} />
      <Path d="M8 30c0-5.5 4.5-10 10-10s10 4.5 10 10" fill={C.primary} />
    </Svg>
  );
}

function DollarIcon() {
  return (
    <View style={styles.kpiIconCircle}>
      <Text style={styles.kpiIconSymbol}>$</Text>
    </View>
  );
}

function CardIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32">
      <Circle cx={16} cy={16} r={16} fill={C.primaryLight} />
      <Rect x={8} y={11} width={16} height={11} rx={2} fill={C.primary} />
      <Rect x={8} y={14} width={16} height={3} fill={C.primaryDark} />
      <Rect x={10} y={19} width={5} height={1.5} rx={0.5} fill={C.white} />
    </Svg>
  );
}

function CalendarIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Rect x={1} y={2.5} width={12} height={10.5} rx={1.5} stroke={C.secondary} strokeWidth={1.2} fill="none" />
      <Line x1={1} y1={5.5} x2={13} y2={5.5} stroke={C.secondary} strokeWidth={1.2} />
      <Line x1={4.5} y1={1} x2={4.5} y2={3.5} stroke={C.secondary} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={9.5} y1={1} x2={9.5} y2={3.5} stroke={C.secondary} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function InfoIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14">
      <Circle cx={7} cy={7} r={6} stroke={C.secondary} strokeWidth={1.2} fill="none" />
      <Line x1={7} y1={6} x2={7} y2={10} stroke={C.secondary} strokeWidth={1.4} strokeLinecap="round" />
      <Circle cx={7} cy={4.2} r={0.8} fill={C.secondary} />
    </Svg>
  );
}

function PixDiamond() {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10">
      <Path
        d="M5 1L9 5L5 9L1 5L5 1Z"
        stroke={C.primary}
        strokeWidth={1.2}
        fill={C.primaryLight}
      />
    </Svg>
  );
}

function getDonutArcPath(cx: number, cy: number, r: number, percent: number): string {
  if (percent <= 0) return "";
  const start = -Math.PI / 2;
  const end = start + (Math.min(percent, 100) / 100) * 2 * Math.PI;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const largeArc = percent > 50 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

function DonutChart({ percent }: { percent: number }) {
  const size = 88;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cy} r={r} stroke={C.border} strokeWidth={stroke} fill="none" />
      {percent >= 100 ? (
        <Circle cx={cx} cy={cy} r={r} stroke={C.primary} strokeWidth={stroke} fill="none" />
      ) : percent > 0 ? (
        <Path
          d={getDonutArcPath(cx, cy, r, percent)}
          stroke={C.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}

function formatPdfLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function paymentDescription(payment: Payment): string {
  return payment.description.trim() || "Pagamento";
}

interface LoanPdfDocumentProps {
  loan: Loan;
  metrics: LoanMetrics;
  payments: Payment[];
  generatedAt: string;
  logoSrc: string;
}

export function LoanPdfDocument({
  loan,
  metrics,
  payments,
  generatedAt,
  logoSrc,
}: LoanPdfDocumentProps) {
  const progress = Math.min(metrics.progressPercent, 100);

  return (
    <Document
      title={`Relatório — Empréstimo com ${loan.creditor}`}
      author="Devolvi"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image src={logoSrc} style={styles.logoIcon} />
            <Text style={styles.brandName}>Devolvi</Text>
          </View>
          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>RELATÓRIO DE EMPRÉSTIMO</Text>
            <Text style={styles.docDate}>Gerado em {generatedAt}</Text>
          </View>
        </View>

        <View style={styles.loanIdentity}>
          <UserIcon />
          <View style={styles.loanIdentityText}>
            <Text style={styles.loanTitle}>Empréstimo com {loan.creditor}</Text>
            <Text style={styles.loanSubtitle}>
              Iniciado em {formatPdfLongDate(loan.startDate)}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>SALDO RESTANTE</Text>
            <Text style={styles.heroBalance}>{formatCurrency(metrics.balance)}</Text>
            <Text style={styles.heroSub}>
              de {formatCurrency(metrics.totalBorrowed)} emprestados
            </Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroRight}>
            <View style={styles.donutWrap}>
              <DonutChart percent={progress} />
              <View style={styles.donutCenter}>
                <Text style={styles.donutPercent}>{progress}%</Text>
                <Text style={styles.donutLabel}>quitado</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, styles.kpiCardFirst]}>
            <View style={styles.kpiIcon}>
              <DollarIcon />
            </View>
            <View style={styles.kpiText}>
              <Text style={styles.kpiLabel}>TOTAL EMPRESTADO</Text>
              <Text style={styles.kpiValue}>{formatCurrency(metrics.totalBorrowed)}</Text>
            </View>
          </View>
          <View style={styles.kpiCard}>
            <View style={styles.kpiIcon}>
              <CardIcon />
            </View>
            <View style={styles.kpiText}>
              <Text style={styles.kpiLabel}>TOTAL DEVOLVIDO</Text>
              <Text style={styles.kpiValue}>{formatCurrency(metrics.totalReturned)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <CalendarIcon />
          </View>
          <Text style={styles.sectionTitle}>HISTÓRICO DE PAGAMENTOS</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadCell, styles.colDate]}>DATA</Text>
            <Text style={[styles.tableHeadCell, styles.colDesc]}>DESCRIÇÃO</Text>
            <Text style={[styles.tableHeadCell, styles.colMethod]}>FORMA DE PAGAMENTO</Text>
            <Text style={[styles.tableHeadCell, styles.colValue]}>VALOR</Text>
          </View>

          {payments.length === 0 ? (
            <Text style={styles.emptyTable}>Nenhum pagamento registrado.</Text>
          ) : (
            payments.map((payment, index) => (
              <View
                key={payment.id}
                style={[
                  styles.tableRow,
                  index === payments.length - 1 ? styles.tableRowLast : {},
                ]}
              >
                <Text style={[styles.tableCell, styles.colDate]}>
                  {formatTableDate(payment.date)}
                </Text>
                <Text style={[styles.tableCell, styles.colDesc]}>
                  {paymentDescription(payment)}
                </Text>
                <View style={[styles.tableMethod, styles.colMethod]}>
                  {payment.method === "PIX" ? <PixDiamond /> : null}
                  <Text style={styles.tableMethodText}>{payment.method}</Text>
                </View>
                <Text
                  style={[
                    payment.status === "completed"
                      ? styles.tableCellGreen
                      : styles.tableCell,
                    styles.colValue,
                  ]}
                >
                  {formatCurrency(payment.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitle}>RESUMO</Text>
          <View style={styles.resumoRow}>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Pagamentos</Text>
              <Text style={styles.resumoValue}>{payments.length}</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Devolvido</Text>
              <Text style={styles.resumoValue}>
                {formatCurrency(metrics.totalReturned)}
              </Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Saldo</Text>
              <Text style={styles.resumoValueGreen}>
                {formatCurrency(metrics.balance)}
              </Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoLabel}>Quitado</Text>
              <Text style={styles.resumoValueGreen}>{progress}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <InfoIcon />
            </View>
            <Text style={styles.sectionTitle}>INFORMAÇÕES DO EMPRÉSTIMO</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>CREDOR</Text>
              <Text style={styles.infoValue}>{loan.creditor}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>DATA DO INÍCIO</Text>
              <Text style={styles.infoValue}>{formatTableDate(loan.startDate)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>VALOR INICIAL</Text>
              <Text style={styles.infoValue}>{formatCurrency(loan.totalAmount)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>OBSERVAÇÕES</Text>
              <Text style={styles.infoValue}>
                {loan.notes.trim() ? loan.notes.trim() : "—"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
