"use client";

import { FarmerIdentity } from '../../types/avalanche';

interface Props {
  farmer: FarmerIdentity | null;
  loading: boolean;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", amber: "#f59e0b", blue: "#1d4ed8", text: "#1a2e1a",
  muted: "#6b7c6b", mutedL: "#9aaa9a",
};

function ScoreRing({ value, color, label }: { value: number; color: string; label: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#e0ede0" strokeWidth="5" />
          <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 16, color }}>{value}</span>
        </div>
      </div>
      <span style={{ fontSize: 10, color: F.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
    </div>
  );
}

export default function FarmerIdentityCard({ farmer, loading }: Props) {
  if (loading) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: F.border, animation: "pulse 1.5s ease infinite" }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 18, background: F.border, borderRadius: 9, width: "40%", marginBottom: 8, animation: "pulse 1.5s ease infinite" }} />
            <div style={{ height: 12, background: F.border, borderRadius: 6, width: "60%", animation: "pulse 1.5s ease infinite" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 60, background: F.border, borderRadius: 10, animation: "pulse 1.5s ease infinite", opacity: 0.5 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!farmer) return null;

  return (
    <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>Farmer Identity</div>
          <div style={{ fontSize: 13, color: F.muted }}>Verified on-chain reputation</div>
        </div>
        {farmer.isVerified && (
          <div style={{ background: F.greenBg, border: `1px solid ${F.green}44`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: F.green, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <span>✓</span> Verified Farmer
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: F.greenBg, border: `2px solid ${F.green}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
          {farmer.avatar}
        </div>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text }}>{farmer.name}</div>
          <div style={{ fontSize: 13, color: F.muted, marginBottom: 4 }}>{farmer.location}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {farmer.certifications.map(cert => (
              <span key={cert} style={{ background: F.greenBg, border: `1px solid ${F.green}33`, borderRadius: 10, padding: "3px 10px", fontSize: 10, color: F.green, fontWeight: 600 }}>{cert}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24 }}>
        <ScoreRing value={farmer.reputationScore} color={F.green} label="Reputation" />
        <ScoreRing value={farmer.trustScore} color={F.blue} label="Trust" />
        <ScoreRing value={Math.round(farmer.rating * 20)} color={F.amber} label="Rating" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Harvests", value: farmer.harvestHistory, icon: "🌾" },
          { label: "Transactions", value: farmer.completedTransactions, icon: "🤝" },
          { label: "Years Active", value: farmer.yearsActive, icon: "📅" },
          { label: "Blockchain ID", value: `${farmer.blockchainAddress.slice(0, 6)}...${farmer.blockchainAddress.slice(-4)}`, icon: "🔗" },
        ].map((item, i) => (
          <div key={item.label} style={{ background: F.greenBg, borderRadius: 12, padding: "12px 14px", animation: `fadeUp .3s ease ${i * 0.05}s both` }}>
            <div style={{ fontSize: 11, color: F.muted, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{item.icon}</span>{item.label}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: F.text }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: F.greenBg, border: `1px solid ${F.green}33`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: F.text }}>
        <strong style={{ color: F.green }}>Verified since:</strong> {new Date(farmer.verificationDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}