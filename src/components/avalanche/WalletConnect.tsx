"use client";

import { useState } from 'react';

interface Props {
  onConnect?: (address: string) => void;
}

const F = {
  card: "#ffffff", border: "#e0ede0", green: "#2e7d32", greenL: "#4caf50",
  greenBg: "#e8f5e9", text: "#1a2e1a", muted: "#6b7c6b", mutedL: "#9aaa9a",
  blue: "#1d4ed8", blueBg: "#eff6ff",
};

export default function WalletConnect({ onConnect }: Props) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnect = async () => {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 1500));
    const mockAddress = '0x71C7...8976F';
    setAddress(mockAddress);
    setConnected(true);
    setConnecting(false);
    onConnect?.(mockAddress);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress('');
  };

  return (
    <div style={{
      background: connected ? F.greenBg : F.blueBg,
      border: `1px solid ${connected ? F.green + "44" : F.blue + "44"}`,
      borderRadius: 14, padding: "12px 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: connected ? F.green + "22" : F.blue + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {connected ? '🔓' : '🔒'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: F.text }}>
            {connected ? 'Core Wallet Connected' : 'Connect Wallet'}
          </div>
          <div style={{ fontSize: 11, color: F.muted, fontFamily: "'JetBrains Mono', monospace" }}>
            {connected ? address : 'Avalanche Fuji Testnet'}
          </div>
        </div>
      </div>

      {connected ? (
        <button
          onClick={handleDisconnect}
          style={{
            background: "transparent", color: F.green, border: `1px solid ${F.green}`,
            borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          style={{
            background: `linear-gradient(90deg, ${F.blue}, ${F.green})`,
            color: "#fff", border: "none", borderRadius: 10,
            padding: "6px 16px", fontSize: 12, fontWeight: 700,
            cursor: connecting ? 'wait' : 'pointer', opacity: connecting ? 0.7 : 1,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {connecting ? (
            <><span style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />Connecting...</>
          ) : (
            <><span>🔗</span> Connect</>
          )}
        </button>
      )}
    </div>
  );
}