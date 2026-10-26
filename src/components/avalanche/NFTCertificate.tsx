"use client";

import { useState } from 'react';
import { CropVerification } from '../../types/avalanche';

interface Props {
  data: CropVerification | null;
  loading: boolean;
  walletConnected: boolean;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", amber: "#f59e0b", amberBg: "#fffbeb",
  text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
  purple: "#7c3aed", purpleBg: "#f3e8ff",
};

export default function NFTCertificate({ data, loading, walletConnected }: Props) {
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  if (loading || !data) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ height: 20, background: F.border, borderRadius: 10, width: "50%", marginBottom: 20, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ height: 200, background: F.border, borderRadius: 12, animation: "pulse 1.5s ease infinite", opacity: 0.5 }} />
      </div>
    );
  }

  const handleMint = async () => {
    setMinting(true);
    await new Promise(r => setTimeout(r, 2500));
    setMinting(false);
    setMinted(true);
  };

  return (
    <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>
            NFT Certificate
          </div>
          <div style={{ fontSize: 13, color: F.muted }}>Mint harvest proof as Avalanche NFT</div>
        </div>
        {minted && (
          <div style={{ background: F.purpleBg, border: `1px solid ${F.purple}44`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: F.purple, fontWeight: 700 }}>
            ✓ Minted on C-Chain
          </div>
        )}
      </div>

      {/* Certificate Preview */}
      <div style={{
        background: `linear-gradient(135deg, ${F.greenBg} 0%, ${F.purpleBg} 100%)`,
        border: `2px solid ${F.green}44`, borderRadius: 16,
        padding: 24, marginBottom: 20, position: "relative", overflow: "hidden",
      }}>
        {/* Decorative corner stamp */}
        <div style={{
          position: "absolute", top: -20, right: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: `${F.green}15`, border: `2px solid ${F.green}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, transform: "rotate(-15deg)",
        }}>
          🏆
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, color: F.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
            AgriMind Verified Harvest
          </div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 22, color: F.text, marginBottom: 4 }}>
            {data.crop} — Grade {data.qualityGrade}
          </div>
          <div style={{ fontSize: 13, color: F.muted, marginBottom: 16 }}>
            {data.farmer} · {data.location} · {data.harvestDate}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Batch ID", value: data.batchId },
              { label: "Weight", value: data.weight },
              { label: "Certificate", value: data.certificateId },
              { label: "Network", value: "Avalanche C-Chain" },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 9, color: F.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: F.text, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: F.muted }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: F.greenL, display: "inline-block" }} />
            Verified on block #{data.blockNumber.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Mint Button */}
      {!walletConnected ? (
        <div style={{ background: F.amberBg, border: `1px solid ${F.amber}44`, borderRadius: 12, padding: "12px 16px", textAlign: "center", fontSize: 13, color: F.amber, fontWeight: 600 }}>
          🔒 Connect Core Wallet to mint this certificate
        </div>
      ) : minted ? (
        <div style={{ background: F.purpleBg, border: `1px solid ${F.purple}44`, borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: F.purple, marginBottom: 4 }}>✓ Certificate Minted</div>
          <div style={{ fontSize: 11, color: F.muted, fontFamily: "'JetBrains Mono', monospace" }}>
            TX: 0x8f3a...2b9c · View on Snowtrace →
          </div>
        </div>
      ) : (
        <button
          onClick={handleMint}
          disabled={minting}
          style={{
            width: "100%", background: `linear-gradient(90deg, ${F.purple}, ${F.green})`,
            color: "#fff", border: "none", borderRadius: 12,
            padding: "14px 24px", fontFamily: "'Poppins', sans-serif",
            fontWeight: 700, fontSize: 15, cursor: minting ? 'wait' : 'pointer',
            opacity: minting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {minting ? (
            <><span style={{ width: 18, height: 18, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />Minting on C-Chain...</>
          ) : (
            <><span>🎨</span> Mint as NFT</>
          )}
        </button>
      )}
    </div>
  );
}