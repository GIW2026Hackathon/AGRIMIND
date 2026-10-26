"use client";

import { CarbonCredit } from '../../types/avalanche';

interface Props {
  data: CarbonCredit | null;
  loading: boolean;
}

const F = {
 card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", amber: "#f59e0b", amberBg: "#fffbeb", text: "#1a2e1a",
  muted: "#6b7c6b", mutedL: "#9aaa9a",
};

function ProgressBar({ value, target, unit, color, label }: { value: number; target: number; unit: string; color: string; label: string }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: F.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: F.text }}>{value.toLocaleString()} <span style={{ color: F.muted, fontWeight: 400 }}>/ {target.toLocaleString()} {unit}</span></span>
      </div>
      <div style={{ height: 8, background: "#e8f5e9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 4, transition: "width 1.5s ease" }} />
      </div>
    </div>
  );
}

export default function CarbonCreditTracker({ data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ height: 20, background: F.border, borderRadius: 10, width: "50%", marginBottom: 20, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1,2,3,4].map(i => (
            <div key={i}>
              <div style={{ height: 12, background: F.border, borderRadius: 6, width: "30%", marginBottom: 8, animation: "pulse 1.5s ease infinite" }} />
              <div style={{ height: 8, background: F.border, borderRadius: 4, animation: "pulse 1.5s ease infinite" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>Carbon Credit Tracker</div>
          <div style={{ fontSize: 13, color: F.muted }}>Sustainable farming impact</div>
        </div>
        <div style={{ background: data.status === 'verified' ? F.greenBg : F.amberBg, border: `1px solid ${data.status === 'verified' ? F.green + "44" : F.amber + "44"}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: data.status === 'verified' ? F.green : F.amber, fontWeight: 700 }}>
          {data.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { icon: "🌍", value: `${data.carbonSaved.toLocaleString()}`, label: "kg CO₂ Saved", color: F.green },
          { icon: "🌳", value: `${data.treesEquivalent}`, label: "Trees Equivalent", color: F.greenL },
          { icon: "📉", value: `${data.emissionReduction}%`, label: "Emission Reduction", color: "#84cc16" },
          { icon: "🏅", value: `${data.creditsEarned}`, label: "Credits Earned", color: F.green },
        ].map((stat, i) => (
          <div key={stat.label} style={{ background: F.greenBg, borderRadius: 14, padding: "16px", textAlign: "center", animation: `fadeUp .3s ease ${i * 0.06}s both` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 22, color: stat.color, lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: F.muted }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: F.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Progress to Targets</div>
        {data.milestones.map((m, i) => (
          <ProgressBar key={i} label={m.label} value={m.value} target={m.target} unit={m.unit} color={m.color} />
        ))}
      </div>

      <div style={{ background: F.greenBg, border: `1px solid ${F.green}33`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: F.text, lineHeight: 1.6 }}>
        <strong style={{ color: F.green }}>Methodology:</strong> {data.methodology}<br />
        <strong style={{ color: F.green }}>Period:</strong> {data.period}<br />
        <strong style={{ color: F.green }}>Blockchain:</strong> {data.blockchainTx.slice(0, 20)}...{data.blockchainTx.slice(-8)}
      </div>
    </div>
  );
}