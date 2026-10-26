"use client";

import { SupplyChainBatch } from '../../types/avalanche';
import { useEffect, useState } from 'react';

interface Props {
  batches: SupplyChainBatch[];
  loading: boolean;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
};

export default function SupplyChainViz({ batches, loading }: Props) {
  const [activeBatch, setActiveBatch] = useState(0);
  const [revealedStages, setRevealedStages] = useState(0);
  const batch = batches[activeBatch];

  useEffect(() => {
    if (!batch) return;
    setRevealedStages(0);
    const iv = setInterval(() => {
      setRevealedStages(s => { if (s >= batch.stages.length) { clearInterval(iv); return s; } return s + 1; });
    }, 400);
    return () => clearInterval(iv);
  }, [batch, activeBatch]);

  if (loading) {
    return (
      <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}` }}>
        <div style={{ height: 20, background: F.border, borderRadius: 10, width: "40%", marginBottom: 24, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: F.border, animation: "pulse 1.5s ease infinite" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, background: F.border, borderRadius: 7, width: "30%", marginBottom: 6, animation: "pulse 1.5s ease infinite" }} />
                <div style={{ height: 10, background: F.border, borderRadius: 5, width: "50%", animation: "pulse 1.5s ease infinite" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!batch) return null;

  return (
    <div style={{ background: F.card, borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${F.border}`, animation: "fadeUp .5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: F.text, marginBottom: 4 }}>Supply Chain Traceability</div>
          <div style={{ fontSize: 13, color: F.muted }}>Batch {batch.batchId} · {batch.crop} · Verified end-to-end</div>
        </div>
        <div style={{ background: F.greenBg, border: `1px solid ${F.green}44`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: F.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: F.greenL, animation: "pulse 2s ease infinite" }} />
          Fully Verified
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {batch.stages.map((stage, i) => {
          const isRevealed = i < revealedStages;
          const isLast = i === batch.stages.length - 1;
          const isCompleted = stage.status === 'completed';
          return (
            <div key={stage.id} style={{ display: "flex", gap: 16, opacity: isRevealed ? 1 : 0.3, transform: isRevealed ? "translateX(0)" : "translateX(-10px)", transition: "all .4s ease" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: isCompleted ? F.greenBg : "#f5f5f5", border: `2px solid ${isCompleted ? F.green : F.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "all .3s ease", boxShadow: isCompleted ? `0 0 12px ${F.green}33` : "none" }}>
                  {stage.icon}
                </div>
                {!isLast && (
                  <div style={{ width: 2, flex: 1, minHeight: 30, background: isCompleted ? `linear-gradient(to bottom, ${F.green}, ${F.greenL})` : F.border, margin: "4px 0" }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20 }}>
                <div style={{ background: isCompleted ? F.greenBg : F.card, border: `1px solid ${isCompleted ? F.green + "33" : F.border}`, borderRadius: 14, padding: "14px 18px", transition: "all .3s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: F.text, marginBottom: 2 }}>{stage.name}</div>
                      <div style={{ fontSize: 12, color: F.muted, marginBottom: 4 }}>{stage.actor} · {stage.location}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {stage.verified && (
                        <span style={{ background: F.green + "18", color: F.green, borderRadius: 12, padding: "2px 10px", fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>✓ Verified</span>
                      )}
                      <span style={{ fontSize: 11, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace" }}>{stage.timestamp}</span>
                    </div>
                  </div>
                  {stage.details && (
                    <div style={{ marginTop: 8, fontSize: 12, color: F.muted, lineHeight: 1.5 }}>{stage.details}</div>
                  )}
                  {stage.txHash && (
                    <div style={{ marginTop: 8, fontSize: 10, color: F.mutedL, fontFamily: "'JetBrains Mono', monospace" }}>TX: {stage.txHash}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}