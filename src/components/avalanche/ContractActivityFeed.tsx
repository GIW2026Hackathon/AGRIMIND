"use client";

import { ContractEvent } from '../../types/avalanche';

interface Props {
  events: ContractEvent[];
  loading: boolean;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
};

export default function ContractActivityFeed({ events, loading }: Props) {
  if (loading) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ height: 20, background: F.border, borderRadius: 10, width: "40%", marginBottom: 20, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: F.border, animation: "pulse 1.5s ease infinite" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, background: F.border, borderRadius: 6, width: "40%", marginBottom: 6, animation: "pulse 1.5s ease infinite" }} />
                <div style={{ height: 10, background: F.border, borderRadius: 5, width: "70%", animation: "pulse 1.5s ease infinite" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>
            Smart Contract Activity
          </div>
          <div style={{ fontSize: 13, color: F.muted }}>On-chain events, newest first</div>
        </div>
        <div style={{ background: F.greenBg, border: `1px solid ${F.green}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: F.green, fontWeight: 600 }}>
          {events.length} Events
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {events.map((evt, i) => (
          <div key={evt.id} style={{
            display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0",
            borderBottom: i < events.length - 1 ? `1px solid ${F.border}` : "none",
            animation: `fadeUp .3s ease ${i * 0.05}s both`
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: evt.color + "18",
              border: `1px solid ${evt.color}44`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0
            }}>
              {evt.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: F.text }}>{evt.title}</div>
                <span style={{ fontSize: 10, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {new Date(evt.timestamp).toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: 12, color: F.muted, marginTop: 2, lineHeight: 1.5 }}>{evt.description}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: evt.color, fontWeight: 600 }}>● {evt.status}</span>
                <span style={{ fontSize: 10, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace" }}>Block #{evt.blockNumber}</span>
                <span style={{ fontSize: 10, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace" }}>TX: {evt.txHash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}