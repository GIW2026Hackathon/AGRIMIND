"use client";

import { useState } from 'react';

interface Props {
  loading: boolean;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", blue: "#1d4ed8", blueBg: "#eff6ff", amber: "#f59e0b",
  amberBg: "#fffbeb",red: "#dc2626", text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
};

interface Payment {
  id: string;
  type: 'sent' | 'received' | 'escrow';
  amount: string;
  currency: string;
  from: string;
  to: string;
  status: 'completed' | 'pending' | 'processing';
  timestamp: string;
  txHash: string;
  description: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'PAY-001',
    type: 'received',
    amount: '108,000',
    currency: 'KSh',
    from: 'FreshMart Supermarkets',
    to: 'John Kamau',
    status: 'completed',
    timestamp: '2026-06-20 16:45',
    txHash: '0xbf7g...4i6d',
    description: 'Payment for 2,400 kg tomatoes via smart contract escrow',
  },
  {
    id: 'PAY-002',
    type: 'escrow',
    amount: '45,000',
    currency: 'KSh',
    from: 'Wakulima Market',
    to: 'John Kamau',
    status: 'processing',
    timestamp: '2026-06-21 09:30',
    txHash: '0xac3d...7e2f',
    description: 'Escrow for upcoming bean harvest — released on delivery',
  },
  {
    id: 'PAY-003',
    type: 'sent',
    amount: '12,500',
    currency: 'KSh',
    from: 'John Kamau',
    to: 'Cold Chain Logistics',
    status: 'completed',
    timestamp: '2026-06-20 11:00',
    txHash: '0xde4f...8g3h',
    description: 'Transport payment for refrigerated delivery to Nairobi',
  },
];

export default function PaymentsSection({ loading }: Props) {
  const [showPayModal, setShowPayModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    const newPayment: Payment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      type: 'sent',
      amount: '25,000',
      currency: 'KSh',
      from: 'You',
      to: 'John Kamau',
      status: 'completed',
      timestamp: new Date().toLocaleString('en-KE'),
      txHash: '0x' + Array.from({ length: 16 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      description: 'Direct payment for quality seeds and fertilizer',
    };
    setPayments([newPayment, ...payments]);
    setPaying(false);
    setShowPayModal(false);
  };

  if (loading) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ height: 20, background: F.border, borderRadius: 10, width: "40%", marginBottom: 20, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: 80, background: F.border, borderRadius: 12, animation: "pulse 1.5s ease infinite", opacity: 0.5 }} />
          ))}
        </div>
      </div>
    );
  }

  const totalReceived = payments.filter(p => p.type === 'received' || p.type === 'escrow').reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, '')), 0);
  const totalSent = payments.filter(p => p.type === 'sent').reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, '')), 0);

  return (
    <>
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>
              Payments & Escrow
            </div>
            <div style={{ fontSize: 13, color: F.muted }}>USDC-stablecoin payments on Avalanche</div>
          </div>
          <button
            onClick={() => setShowPayModal(true)}
            style={{
              background: `linear-gradient(90deg, ${F.green}, ${F.greenL})`,
              color: "#fff", border: "none", borderRadius: 12,
              padding: "10px 20px", fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <span>💸</span> Pay Farmer
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Received", value: `KSh ${totalReceived.toLocaleString()}`, icon: "📥", color: F.green },
            { label: "Total Sent", value: `KSh ${totalSent.toLocaleString()}`, icon: "📤", color: F.blue },
            { label: "In Escrow", value: `KSh ${(45000).toLocaleString()}`, icon: "🔒", color: F.amber },
          ].map((stat, i) => (
            <div key={stat.label} style={{ background: stat.color + "10", border: `1px solid ${stat.color}33`, borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 20, color: stat.color, lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: F.muted }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Payment List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {payments.map((payment, i) => (
            <div key={payment.id} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px", background: payment.type === 'received' ? F.greenBg : payment.type === 'escrow' ? F.amberBg : F.blueBg,
              borderRadius: 12, border: `1px solid ${payment.type === 'received' ? F.green + "33" : payment.type === 'escrow' ? F.amber + "33" : F.blue + "33"}`,
              animation: `fadeUp .3s ease ${i * 0.05}s both`
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: payment.type === 'received' ? F.green + "22" : payment.type === 'escrow' ? F.amber + "22" : F.blue + "22",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0
              }}>
                {payment.type === 'received' ? '📥' : payment.type === 'escrow' ? '🔒' : '📤'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: F.text }}>{payment.description}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: payment.type === 'sent' ? F.red : F.green }}>
                    {payment.type === 'sent' ? '-' : '+'}{payment.currency} {payment.amount}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: F.muted }}>{payment.from} → {payment.to}</span>
                  <span style={{ fontSize: 10, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace" }}>TX: {payment.txHash}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: payment.status === 'completed' ? F.green : payment.status === 'processing' ? F.amber : F.blue,
                    background: payment.status === 'completed' ? F.green + "18" : payment.status === 'processing' ? F.amber + "18" : F.blue + "18",
                    borderRadius: 8, padding: "2px 8px"
                  }}>
                    {payment.status === 'completed' ? '✓ Completed' : payment.status === 'processing' ? '⏳ Processing' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }} onClick={() => setShowPayModal(false)}>
          <div style={{ background: F.card, borderRadius: 20, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: F.greenBg, border: `2px solid ${F.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 10px" }}>💸</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: F.text }}>Send Payment</div>
              <div style={{ fontSize: 13, color: F.muted }}>Pay farmer directly via Avalanche C-Chain</div>
            </div>

            <div style={{ background: F.greenBg, borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: F.muted }}>To</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: F.text }}>John Kamau</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: F.muted }}>Amount</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: F.text }}>KSh 25,000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: F.muted }}>Network</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: F.green }}>Avalanche Fuji</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              style={{
                width: "100%", background: `linear-gradient(90deg, ${F.green}, ${F.greenL})`,
                color: "#fff", border: "none", borderRadius: 12,
                padding: "14px", fontFamily: "'Poppins', sans-serif",
                fontWeight: 700, fontSize: 15, cursor: paying ? 'wait' : 'pointer',
                opacity: paying ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {paying ? (
                <><span style={{ width: 18, height: 18, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />Processing on Avalanche...</>
              ) : (
                <><span>🚀</span> Confirm Payment</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}