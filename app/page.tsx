"use client";

import { useState } from "react";
import FarmerDashboard from "./farmer/FarmerDashboard";
import MachineDashboard from "./machine/MachineDashboard";

const USER_TYPES = [
  { id: "farmer",     icon: "/avatars/farmer-john.png", label: "Farmer",            color: "#22c55e" },
  { id: "extension",  icon: "/avatars/extension.png",   label: "Extension Officer", color: "#3b82f6" },
  { id: "cooperative",icon: "/avatars/cooperative.png", label: "Cooperative",       color: "#14b8a6" },
  { id: "dealer",     icon: "/avatars/dealer.png",      label: "Agro Dealer",       color: "#f59e0b" },
  { id: "researcher", icon: "/avatars/researcher.png",  label: "Researcher",        color: "#a855f7" },
  { id: "govt",       icon: "/avatars/govt.png",        label: "Government",        color: "#06b6d4" },
  { id: "investor",   icon: "/avatars/investor.png",    label: "Investor",          color: "#ec4899" },
  { id: "verifier",   icon: "/avatars/verifier.png",    label: "Trust Verifier",    color: "#22c55e" },
];

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [userType, setUserType] = useState("farmer");

  if (phase === "platform") {
    if (userType === "farmer") {
      return (
        <FarmerDashboard
          onSwitchToMachine={() => setUserType("extension")}
        />
      );
    }
    return (
      <MachineDashboard
        onSwitchFarmer={() => setUserType("farmer")}
      />
    );
  }

  
return (
  <div
    style={{
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top center, rgba(34,197,94,.18) 0%, #030a05 35%, #010302 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 24px",
      fontFamily: "Inter, sans-serif",
    }}
  >
    {/* Background Glow */}
    <div
      style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "rgba(34,197,94,.12)",
        filter: "blur(120px)",
        top: -100,
        zIndex: 0,
      }}
    />

    {/* Hero */}
    <div
      style={{
        zIndex: 2,
        textAlign: "center",
        maxWidth: 900,
      }}
    >
      <img
        src="/icons/logo.jpeg"
        alt="AgriMind"
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: 18,
    
          boxShadow: "0 0 30px rgba(34,197,94,.4)",
        }}
      />

      <div
        style={{
          display: "inline-block",
          padding: "8px 18px",
          borderRadius: 999,
          border: "1px solid rgba(34,197,94,.3)",
          color: "#9be7b1",
          marginBottom: 20,
          fontSize: 14,
        }}
      >
        Smart Agriculture • AI Powered
      </div>

      <h1
        style={{
          fontSize: "clamp(48px,8vw,84px)",
          color: "#22c55e",
          fontWeight: 900,
          margin: 0,
          lineHeight: 1,
        }}
      >
        AgriMind
      </h1>

      <h2
        style={{
          color: "#fff",
          fontSize: "clamp(24px,4vw,42px)",
          marginTop: 18,
          marginBottom: 16,
        }}
      >
        The Operating System for Agriculture
      </h2>

      <p
        style={{
          color: "#9fb59f",
          fontSize: 18,
          maxWidth: 700,
          margin: "0 auto 40px",
          lineHeight: 1.7,
        }}
      >
        One intelligent platform connecting farmers, extension officers,
        cooperatives, researchers, governments, and investors through AI,
        data, prediction, and decision intelligence.
      </p>
    </div>

    {/* Role Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 18,
        width: "100%",
        maxWidth: 1000,
        zIndex: 2,
      }}
    >
      {USER_TYPES.map((u) => (
        <div
          key={u.id}
          onClick={() => setUserType(u.id)}
          style={{
            cursor: "pointer",
            padding: 24,
            borderRadius: 20,
            background:
              userType === u.id
                ? "rgba(34,197,94,.12)"
                : "rgba(12,26,14,.65)",
            backdropFilter: "blur(14px)",
            border:
              userType === u.id
                ? `1px solid ${u.color}`
                : "1px solid rgba(255,255,255,.06)",
            boxShadow:
              userType === u.id
                ? `0 0 30px ${u.color}55`
                : "none",
            transition: ".25s",
            textAlign: "center",
          }}
        >
          <img
            src={u.icon}
            alt={u.label}
            style={{
              width: 70, height: 70, borderRadius: "50%",
              objectFit: "cover", marginBottom: 14,
              border: "2px solid " + u.color + "44",
            }}
            onError={(e) =>{ (e.target as HTMLImageElement).style.display = "none";}}/>

          <h3
            style={{
              color: "#fff",
              marginBottom: 10,
            }}
          >
            {u.label}
          </h3>

          <p
            style={{
              color: "#8fa58f",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {u.id === "farmer" &&
              "Manage crops, receive AI insights and improve yields."}

            {u.id === "extension" &&
              "Support farmers with real-time recommendations."}

            {u.id === "cooperative" &&
              "Coordinate communities and market access."}

            {u.id === "dealer" &&
              "Connect farmers to inputs and services."}

            {u.id === "researcher" &&
              "Transform agricultural data into innovation."}

            {u.id === "govt" &&
              "Monitor food systems and agricultural development."}

            {u.id === "investor" &&
              "Discover opportunities across agriculture."}

            {u.id === "verifier" &&
              "Verify and audit agricultural records on the blockchain."}
          </p>
        </div>
      ))}
    </div>

    {/* CTA */}
    <button
      onClick={() => setPhase("platform")}
      style={{
        marginTop: 40,
        background:
          "linear-gradient(90deg,#22c55e,#4ade80)",
        color: "#000",
        border: "none",
        padding: "18px 48px",
        borderRadius: 16,
        fontWeight: 800,
        fontSize: 22,
        cursor: "pointer",
        boxShadow: "0 0 30px rgba(34,197,94,.4)",
        zIndex: 2,
      }}
    >
      Enter AgriMind →
    </button>

    {/* Features */}
    <div
      style={{
        marginTop: 50,
        width: "100%",
        maxWidth: 1100,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 16,
        zIndex: 2,
      }}
    >
      {[
        "🌱 AI Decision Intelligence",
        "📡 Real-Time Monitoring",
        "🔒 Secure Agricultural Data",
        "📈 Predictive Analytics",
        "🌋 Avalanche Trust Layer",
      ].map((item) => (
        <div
          key={item}
          style={{
            background: "rgba(12,26,14,.6)",
            backdropFilter: "blur(10px)",
            borderRadius: 14,
            padding: 18,
            textAlign: "center",
            color: "#9be7b1",
            border: "1px solid rgba(34,197,94,.15)",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);
}