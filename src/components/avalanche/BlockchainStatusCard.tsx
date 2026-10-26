"use client";

import { NetworkStatus } from '../../types/avalanche';
import { useEffect, useState } from 'react';

interface Props {
  network: NetworkStatus | null;
  loading: boolean;
}

const F = {
  bg: "#f0f7f0", card: "#ffffff", border: "#e0ede0",
  green: "#2e7d32", greenL: "#4caf50", greenBg: "#e8f5e9",
  text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
  glass: "rgba(255,255,255,0.7)",
};

export default function BlockchainStatusCard({ network, loading }: Props) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => { const iv = setInterval(() => setPulse(p => (p + 1) % 100), 50); return () => clearInterval(iv); }, []);

  if (loading || !network) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ flex: 1, minWidth: 140 }}>
              <div style={{ height: 12, background: F.border, borderRadius: 6, marginBottom: 10, animation: "pulse 1.5s ease infinite", opacity: 0.5 }} />
              <div style={{ height: 32, background: F.border, borderRadius: 8, animation: "pulse 1.5s ease infinite", opacity: 0.3, width: "70%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Network", value: network.network, icon: "🌐" },
    { label: "Status", value: network.status === 'connected' ? 'Connected ✅' : 'Disconnected', icon: "🔌" },
    { label: "Verified Records", value: network.verifiedRecords.toLocaleString(), icon: "📋" },
    { label: "Smart Contracts", value: `${network.smartContractsActive} Active`, icon: "📜" },
    { label: "Latest Block", value: `#${network.latestBlock.toLocaleString()}`, icon: "🔗" },
  ];

  return (
    <div style={{ background: `linear-gradient(135deg, ${F.card} 0%, ${F.greenBg} 100%)`, borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(46,125,50,0.12)", border: `1px solid ${F.green}33`, animation: "fadeUp .5s ease", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${F.greenL}22 0%, transparent 70%)`, animation: "pulse 4s ease infinite" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: F.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 0 20px ${F.green}44` }}>🌋</div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text }}>Trust Layer Status</div>
            <div style={{ fontSize: 12, color: F.muted, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: F.greenL, display: "inline-block", boxShadow: `0 0 8px ${F.greenL}`, animation: "pulse 2s ease infinite" }} />
              Live · {network.recentVerification}
            </div>
          </div>
          <div style={{ marginLeft: "auto", background: `${F.green}15`, border: `1px solid ${F.green}44`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: F.green, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            Powered by Avalanche
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {metrics.map((m, i) => (
            <div key={m.label} style={{ background: F.glass, backdropFilter: "blur(10px)", borderRadius: 14, padding: "16px 18px", border: `1px solid ${F.border}`, animation: `fadeUp .4s ease ${i * 0.06}s both` }}>
              <div style={{ fontSize: 11, color: F.muted, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{m.label}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{m.icon}</span>{m.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 12, color: F.muted }}>
          <span>⛽ Gas: <strong style={{ color: F.text }}>{network.gasPrice}</strong></span>
          <span>⏱ Block Time: <strong style={{ color: F.text }}>{network.blockTime}</strong></span>
          <span>🔗 Chain ID: <strong style={{ color: F.text }}>{network.chainId}</strong></span>
        </div>
      </div>
    </div>
  );
}