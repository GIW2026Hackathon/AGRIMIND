"use client";

import { CropVerification } from '../../types/avalanche';
import { useState } from 'react';

interface Props {
  data: CropVerification | null;
  loading: boolean;
 onVerify: (batchId: string) => Promise<{ success: boolean; txHash: string } | void>;
  verifying: boolean;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", amber: "#f59e0b", amberBg: "#fffbeb", red: "#dc2626",
  blue: "#1d4ed8", blueBg: "#eff6ff", text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
};

const GRADE_COLORS: Record<string, string> = {
  'A+': F.green, 'A': F.greenL, 'B+': F.blue, 'B': F.amber, 'C': F.red,
};

export default function CropVerificationCard({ data, loading, onVerify, verifying }: Props) {
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ height: 20, background: F.border, borderRadius: 10, width: "50%", marginBottom: 20, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: 50, background: F.border, borderRadius: 10, animation: "pulse 1.5s ease infinite", opacity: 0.5 }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const handleVerify = async () => {
    await onVerify(data.batchId);
    setShowModal(true);
  };

  const details = [
    { label: "Batch ID", value: data.batchId, icon: "📦" },
    { label: "Crop", value: `${data.crop} (${data.variety})`, icon: "🌱" },
    { label: "Farmer", value: data.farmer, icon: "👨‍🌾" },
    { label: "Harvest Date", value: data.harvestDate, icon: "📅" },
    { label: "Location", value: data.location, icon: "📍" },
    { label: "Weight", value: data.weight, icon: "⚖️" },
  ];

  return (
    <>
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>Crop Verification</div>
            <div style={{ fontSize: 13, color: F.muted }}>Blockchain-backed quality assurance</div>
          </div>
          <div style={{ background: data.blockchainStatus === 'verified' ? F.greenBg : F.amberBg, border: `1px solid ${data.blockchainStatus === 'verified' ? F.green + "44" : F.amber + "44"}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: data.blockchainStatus === 'verified' ? F.green : F.amber, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>{data.blockchainStatus === 'verified' ? '✅' : '⏳'}</span>
            {data.blockchainStatus === 'verified' ? 'Verified on Avalanche' : 'Pending'}
          </div>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${GRADE_COLORS[data.qualityGrade]}15`, border: `2px solid ${GRADE_COLORS[data.qualityGrade]}44`, borderRadius: 14, padding: "10px 20px", marginBottom: 24 }}>
          <span style={{ fontSize: 24 }}>🏆</span>
          <div>
            <div style={{ fontSize: 10, color: F.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quality Grade</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 24, color: GRADE_COLORS[data.qualityGrade], lineHeight: 1 }}>{data.qualityGrade}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
          {details.map((d, i) => (
            <div key={d.label} style={{ background: F.greenBg, borderRadius: 12, padding: "14px 16px", animation: `fadeUp .3s ease ${i * 0.04}s both` }}>
              <div style={{ fontSize: 11, color: F.muted, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <span>{d.icon}</span>{d.label}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: F.text }}>{d.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: F.blueBg, border: `1px solid ${F.blue}33`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: F.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Blockchain Record</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: F.muted }}>Transaction Hash</span>
              <span style={{ color: F.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{data.transactionHash.slice(0, 20)}...{data.transactionHash.slice(-8)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: F.muted }}>Block Number</span>
              <span style={{ color: F.text, fontWeight: 600 }}>#{data.blockNumber.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: F.muted }}>Network</span>
              <span style={{ color: F.text }}>{data.network}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: F.muted }}>Certificate ID</span>
              <span style={{ color: F.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{data.certificateId}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: F.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Inspection History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.inspections.map((ins, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: ins.result === 'pass' ? F.greenBg : ins.result === 'fail' ? '#fef2f2' : F.amberBg, borderRadius: 10, border: `1px solid ${ins.result === 'pass' ? F.green + "33" : ins.result === 'fail' ? F.red + "33" : F.amber + "33"}` }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{ins.result === 'pass' ? '✓' : ins.result === 'fail' ? '✗' : '!'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: F.text }}>{ins.inspector}</div>
                  <div style={{ fontSize: 11, color: F.muted, marginTop: 2 }}>{ins.notes}</div>
                </div>
                <span style={{ fontSize: 10, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{ins.date}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleVerify} disabled={verifying || data.blockchainStatus === 'verified'}
          style={{ width: "100%", background: data.blockchainStatus === 'verified' ? F.greenBg : `linear-gradient(90deg, ${F.green}, ${F.greenL})`, color: data.blockchainStatus === 'verified' ? F.green : "#fff", border: `2px solid ${F.green}`, borderRadius: 12, padding: "14px 24px", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, cursor: data.blockchainStatus === 'verified' ? 'default' : 'pointer', opacity: verifying ? 0.7 : 1, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {verifying ? (
            <><span style={{ width: 18, height: 18, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />Verifying on Avalanche...</>
          ) : data.blockchainStatus === 'verified' ? (
            <><span>✓</span> Already Verified</>
          ) : (
            <><span>🔍</span> Verify on Avalanche</>
          )}
        </button>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, animation: "fadeIn .2s ease" }} onClick={() => setShowModal(false)}>
          <div style={{ background: F.card, borderRadius: 20, padding: 28, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "fadeUp .3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: F.greenBg, border: `2px solid ${F.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>✅</div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: F.text }}>Verification Confirmed</div>
              <div style={{ fontSize: 13, color: F.muted, marginTop: 4 }}>This record is permanently stored on Avalanche</div>
            </div>
            <div style={{ background: F.greenBg, border: `1px solid ${F.green}33`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
              {[
                { label: "Transaction Hash", value: `${data.transactionHash.slice(0, 16)}...${data.transactionHash.slice(-16)}`, mono: true },
                { label: "Block Number", value: `#${data.blockNumber.toLocaleString()}`, mono: false },
                { label: "Timestamp", value: new Date(data.verifiedAt).toLocaleString('en-KE'), mono: false },
                { label: "Network", value: data.network, mono: false },
                { label: "Status", value: "✓ Success", mono: false },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${F.border}` : "none", fontSize: 13 }}>
                  <span style={{ color: F.muted }}>{item.label}</span>
                  <span style={{ color: F.text, fontWeight: 600, fontFamily: item.mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif", fontSize: item.mono ? 11 : 13 }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://testnet.snowtrace.io/tx/${data.transactionHash}`} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: F.green, color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, textAlign: "center", textDecoration: "none", display: "inline-block", cursor: "pointer" }}>
                View on Explorer →
              </a>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: "transparent", color: F.green, border: `2px solid ${F.green}`, borderRadius: 12, padding: "12px 20px", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}