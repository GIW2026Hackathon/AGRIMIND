import { useState, useEffect, useCallback , useRef} from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell ,CartesianGrid
} from "recharts";
import AvalancheTrustLayerPage from "../avalanche/page";
import LeafDiagnosisPage, { type LeafDiagnosis } from "./LeafDiagnosisPage";

// ─── THEME ────────────────────────────────────────────────────────
const F = {
  bg:       "#f0f7f0",
  sidebar:  "#1a3a1a",
  sidebarL: "#2a5a2a",
  card:     "#ffffff",
  border:   "#e0ede0",
  green:    "#2e7d32",
  greenL:   "#4caf50",
  greenBg:  "#e8f5e9",
  amber:    "#f59e0b",
  amberBg:  "#fffbeb",
  red:      "#dc2626",
  redBg:    "#fef2f2",
  blue:     "#1d4ed8",
  blueBg:   "#eff6ff",
  text:     "#1a2e1a",
  muted:    "#6b7c6b",
  mutedL:   "#9aaa9a",
  white:    "#ffffff",
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#f0f7f0;font-family:'Inter',sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideR{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#f0f7f0}
::-webkit-scrollbar-thumb{background:#c8dcc8;border-radius:2px}
@media(max-width:720px){.farmer-sidebar{display:none!important}.farmer-content{min-width:0}.farmer-main{padding:16px!important}.farmer-mobile-nav{display:flex!important;position:sticky;bottom:0;z-index:50;padding-bottom:env(safe-area-inset-bottom)}}
`;

// ─── MOCK DATA ────────────────────────────────────────────────────
const FARMER = {
  name: "John",
  fullName: "John Kamau",
  location: "Kisii, Kenya",
  crop: "Tomatoes",
  farmName: "Kamau Farm",
  size: "3.2 ha",
  stage: "Fruiting",
  plantedAt: "2026-03-10",
  expectedHarvest: "2026-06-20",
  avatar: "👨‍🌾",
  phone: "+254712345678",
  lastSync: "2 min ago",
};

const WEATHER_MOCK = {
  temp: 24, condition: "Partly Cloudy", icon: "⛅",
  humidity: 79, rainfall: 0, wind: 19,
  forecast: [
    { day: "Today", hi: 24, lo: 18, icon: "⛅", rain: 0   },
    { day: "Tue",   hi: 22, lo: 16, icon: "🌧", rain: 12  },
    { day: "Wed",   hi: 21, lo: 15, icon: "🌧", rain: 18  },
    { day: "Thu",   hi: 23, lo: 17, icon: "⛅", rain: 5   },
    { day: "Fri",   hi: 26, lo: 18, icon: "☀️", rain: 0   },
  ],
};

const MARKET_MOCK = {
  crop: "Tomatoes",
  price: 38,
  trend: "+12%",
  trendUp: true,
  bestTime: "7 - 10 days",
  data: [
    { day: "Mon", price: 32 }, { day: "Tue", price: 34 },
    { day: "Wed", price: 33 }, { day: "Thu", price: 36 },
    { day: "Fri", price: 38 }, { day: "Sat", price: 39 },
    { day: "Now", price: 38 },
  ],
};

const CROP_PORTFOLIO = [
  { crop: "Tomatoes", price: 38, trend: "+12%", trendUp: true, volume: "2.4K kg", bestMarket: "Nairobi", confidence: 94 },
  { crop: "Maize", price: 28, trend: "-3%", trendUp: false, volume: "5.1K kg", bestMarket: "Eldoret", confidence: 87 },
  { crop: "Beans", price: 85, trend: "+8%", trendUp: true, volume: "800 kg", bestMarket: "Nakuru", confidence: 91 },
  { crop: "Potatoes", price: 42, trend: "+5%", trendUp: true, volume: "3.2K kg", bestMarket: "Nairobi", confidence: 89 },
  { crop: "Onions", price: 55, trend: "-1%", trendUp: false, volume: "1.5K kg", bestMarket: "Eldoret", confidence: 85 },
];

const MARKET_COMPARISON = [
  { market: "Nakuru Municipal", distance: "2 km", tomatoes: 38, maize: 30, beans: 82, potatoes: 40, onions: 58, trend: "stable" },
  { market: "Nairobi Wakulima", distance: "156 km", tomatoes: 45, maize: 26, beans: 95, potatoes: 48, onions: 52, trend: "rising" },
  { market: "Eldoret", distance: "180 km", tomatoes: 35, maize: 32, beans: 78, potatoes: 38, onions: 60, trend: "stable" },
  { market: "Kisumu", distance: "210 km", tomatoes: 40, maize: 28, beans: 88, potatoes: 44, onions: 55, trend: "falling" },
];

const PRICE_HISTORY_FORECAST = [
  { day: "Mon", actual: 32, forecast: null },
  { day: "Tue", actual: 34, forecast: null },
  { day: "Wed", actual: 33, forecast: null },
  { day: "Thu", actual: 36, forecast: null },
  { day: "Fri", actual: 38, forecast: null },
  { day: "Sat", actual: 39, forecast: null },
  { day: "Sun", actual: 38, forecast: null },
  { day: "Mon+1", actual: null, forecast: 40 },
  { day: "Tue+1", actual: null, forecast: 42 },
  { day: "Wed+1", actual: null, forecast: 44 },
  { day: "Thu+1", actual: null, forecast: 43 },
  { day: "Fri+1", actual: null, forecast: 45 },
  { day: "Sat+1", actual: null, forecast: 44 },
  { day: "Sun+1", actual: null, forecast: 46 },
];

const SUPPLY_DEMAND_SIGNAL = {
  crop: "Tomatoes",
  signal: "FAVORABLE",
  supplyChange: "-18%",
  demandChange: "+12%",
  insight: "Tomato supply dropping 18% regionally — favorable for sellers. Prices expected to peak at KSh 46/kg in 7 days.",
  confidence: 94,
};

const QUICK_ACTIONS = [
  { icon: "⚠️", label: "Report Problem",    color: F.red     },
  { icon: "💬", label: "Ask AgriMind",      color: F.green   },
  { icon: "📋", label: "Add Farm Record",   color: F.blue    },
  { icon: "🌱", label: "Update Crop Stage", color: F.greenL  },
  { icon: "📖", label: "Treatment Guide",   color: F.amber   },
  { icon: "🌋", label: "Trust Layer",       color: F.green   },
];

const NAV_ITEMS = [
  { id: "dashboard",    icon: "🏠", label: "Home"          },
  { id: "farm",         icon: "🌿", label: "My Farm"       },
  { id: "leaf-diagnosis", icon: "🔬", label: "Leaf Diagnosis" },
  { id: "weather",      icon: "⛅", label: "Weather"       },
  { id: "alerts",       icon: "🔔", label: "Alerts"        },
  { id: "recommendations", icon: "💡", label: "Recommendations" },
  { id: "market",       icon: "📊", label: "Market Prices" },
  { id: "records",      icon: "📋", label: "My Records"    },
  { id: "avalanche",    icon: "🌋", label: "Trust Layer"   },
  { id: "chat",         icon: "💬", label: "Chat with AgriMind" },
];

// ─── AI HELPERS ───────────────────────────────────────────────────
async function getAIRecommendation(farmer, weather) {
  const prompt =
    "You are AgriMind, friendly AI assistant for African farmers. " +
    "Farmer: " + farmer.name + ", growing " + farmer.crop + " in " + farmer.location + " (" + farmer.stage + " stage). " +
    "Weather: " + (weather?.temp || 24) + "C, " + (weather?.humidity || 79) + "% humidity. " +
    "Return ONLY JSON (no backticks): {" +
    "\"health_score\":0-100," +
    "\"health_label\":\"Your farm is in good/fair/poor condition\"," +
    "\"soil_moisture\":\"Good|Fair|Poor\"," +
    "\"weather_conditions\":\"Good|Fair|Poor\"," +
    "\"crop_health\":\"Good|Fair|Poor\"," +
    "\"pest_risk\":\"Low|Moderate|High\"," +
    "\"disease_name\":\"...\"," +
    "\"disease_risk\":\"High|Moderate|Low\"," +
    "\"disease_confidence\":0-100," +
    "\"disease_desc\":\"one sentence\"," +
    "\"expected_days\":0," +
    "\"recommended_action\":\"...\"," +
    "\"product_recommendation\":\"...\"," +
    "\"action_reason\":\"...\"," +
    "\"market_insight\":\"one sentence\"," +
    "\"greeting_tip\":\"one encouraging sentence for the farmer\"" +
    "}";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      farmer,
      weather,
      message: prompt,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Unable to generate a recommendation.");
  return JSON.parse(data.reply.replace(/```json|```/g, "").trim());
}

async function chatWithAI(farmer, weather, history, message, diagnosis) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ farmer, weather, history, message, diagnosis }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Unable to generate a chat response.");
  return data.reply;
}

// ─── ATOMS ────────────────────────────────────────────────────────
function Avatar({ src, alt, size = 40, fallback = "👤", style = {} }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: F.greenBg, border: "2px solid " + F.green + "44",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.5, flexShrink: 0, ...style
      }}>{fallback}</div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      style={{
        width: size, height: size, borderRadius: "50%",
        objectFit: "cover", border: "2px solid " + F.green + "44",
        flexShrink: 0, ...style
      }}
    />
  );
}

function Spinner({ size = 18, color = F.green }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{ animation: "spin .8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color}
        strokeWidth="2.5" strokeDasharray="50" strokeDashoffset="15" strokeLinecap="round" />
    </svg>
  );
}

function Badge({ children, color = F.green, bg = F.greenBg }) {
  return (
    <span style={{ background: bg, color, borderRadius: 20, padding: "3px 10px",
      fontSize: 12, fontWeight: 600 }}>
      {children}
    </span>
  );
}

function ScoreBar({ value, color = F.green }) {
  return (
    <div style={{ height: 8, background: F.border, borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: value + "%",
        background: "linear-gradient(90deg," + color + "88," + color + ")",
        borderRadius: 4, transition: "width 1.6s ease" }} />
    </div>
  );
}

function CheckRow({ label, value }) {
  const col = value === "Good" ? F.green : value === "Fair" || value === "Moderate" ? F.amber : F.red;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "7px 0", borderBottom: "1px solid " + F.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%",
          background: col + "20", border: "1px solid " + col + "44",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11 }}>✓</div>
        <span style={{ fontSize: 14, color: F.text }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: col }}>{value}</span>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ page, setPage, weather, alertCount }) {
  return (
    <div className="farmer-sidebar" style={{ width: 220, background: F.sidebar, color: F.white,
      display: "flex", flexDirection: "column", position: "sticky",
      top: 0, height: "100vh", flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10,
            background: F.green, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20 }}>🌿</div>
          <div>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700,
              fontSize: 18, color: F.greenL, letterSpacing: "-0.01em" }}>
              Agri<span style={{ color: "#fff" }}>Mind</span>
            </div>
            <div style={{ fontSize: 10, color: "#ffffff88" }}>Intelligence for a Better Harvest</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px", overflow: "auto" }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 12px", borderRadius: 10, border: "none",
                background: active ? F.greenL : "transparent",
                color: active ? "#fff" : "#ffffff99",
                cursor: "pointer", marginBottom: 2,
                fontFamily: "'Inter'", fontSize: 14, fontWeight: active ? 600 : 400,
                transition: "all .2s", textAlign: "left", position: "relative" }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {item.id === "alerts" && alertCount > 0 && (
                <span style={{ position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: F.red,
                  color: "#fff", borderRadius: "50%", width: 20, height: 20,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700 }}>{alertCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Farmer profile */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid #ffffff22" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar src="/avatars/farmer-john.png" alt={FARMER.name} size={42} fallback="👨‍🌾" />
          <div>
            <div style={{ fontSize: 11, color: "#ffffff88" }}>Good Morning,</div>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700,
              fontSize: 15, color: "#fff" }}>{FARMER.name}!</div>
            <div style={{ fontSize: 11, color: F.greenL }}>Let's grow better today 🌱</div>
          </div>
        </div>

        {/* Weather widget */}
        {weather && (
          <div style={{ background: "#ffffff15", borderRadius: 10,
            padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>{weather.icon}</span>
              <div>
                <div style={{ fontFamily: "'Poppins'", fontWeight: 700,
                  fontSize: 18, color: "#fff" }}>{weather.temp}°C</div>
                <div style={{ fontSize: 11, color: "#ffffff88" }}>{weather.condition}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#ffffff88", marginBottom: 8 }}>
              {FARMER.location}
            </div>
            <button onClick={() => setPage("weather")}
              style={{ width: "100%", background: "#ffffff15",
                border: "1px solid #ffffff33", color: "#fff",
                borderRadius: 7, padding: "6px 0", fontSize: 12,
                cursor: "pointer", fontFamily: "'Inter'", fontWeight: 500 }}>
              View Weather →
            </button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%",
            background: F.greenL, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#ffffff66" }}>
            Last synced {FARMER.lastSync}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────
function CropTimeline() {
  const stages = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Mature", "Harvested"];
  const currentStage = stages.indexOf(FARMER.stage);
  const plantedAt = new Date(FARMER.plantedAt);
  const harvestAt = new Date(FARMER.expectedHarvest);
  const today = new Date();
  const totalDays = Math.max(1, Math.ceil((harvestAt.getTime() - plantedAt.getTime()) / 86_400_000));
  const daysElapsed = Math.max(0, Math.min(totalDays, Math.ceil((today.getTime() - plantedAt.getTime()) / 86_400_000)));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  return (
    <div style={{ background: F.card, borderRadius: 16, padding: 22, boxShadow: "0 2px 12px #00000010" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 17, color: F.text }}>🌱 Crop Timeline</div>
          <div style={{ fontSize: 12, color: F.muted, marginTop: 3 }}>Planted {plantedAt.toLocaleDateString("en-KE", { day: "numeric", month: "short" })} · Expected harvest {harvestAt.toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</div>
        </div>
        <div style={{ background: F.greenBg, color: F.green, borderRadius: 20, padding: "5px 10px", fontSize: 12, fontWeight: 700 }}>{FARMER.stage}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", marginBottom: 18 }}>
        <div style={{ position: "absolute", left: "5%", right: "5%", top: 13, height: 4, background: F.border, zIndex: 0 }} />
        <div style={{ position: "absolute", left: "5%", width: `${Math.max(0, currentStage) / (stages.length - 1) * 90}%`, top: 13, height: 4, background: F.green, zIndex: 1, transition: "width .4s ease" }} />
        {stages.map((stage, index) => {
          const complete = index <= currentStage;
          const active = index === currentStage;
          return <div key={stage} style={{ width: "16.66%", position: "relative", zIndex: 2, textAlign: "center" }}>
            <div style={{ width: 28, height: 28, margin: "0 auto 7px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: active ? F.green : complete ? F.greenBg : F.card, color: active ? "#fff" : complete ? F.green : F.mutedL, border: `2px solid ${active || complete ? F.green : F.border}`, boxShadow: active ? "0 0 0 5px " + F.green + "22" : "none" }}>{complete ? "✓" : index + 1}</div>
            <div style={{ color: active ? F.green : F.muted, fontSize: 10, fontWeight: active ? 700 : 500, lineHeight: 1.2 }}>{stage}</div>
          </div>;
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[{ label: "Days elapsed", value: daysElapsed }, { label: "Days remaining", value: daysRemaining }, { label: "Crop cycle", value: `${totalDays} days` }].map(item => <div key={item.label} style={{ background: F.bg, borderRadius: 10, padding: "10px 12px" }}><div style={{ color: F.muted, fontSize: 11 }}>{item.label}</div><div style={{ color: F.text, fontSize: 16, fontWeight: 800, marginTop: 2 }}>{item.value}</div></div>)}
      </div>
    </div>
  );
}

function SoilHealthCard() {
  const metrics = [
    { label: "Moisture", value: 62, ideal: "60–70%", status: "Good", color: F.green },
    { label: "pH", value: 70, display: "6.5", ideal: "6.0–6.8", status: "Good", color: F.green },
    { label: "Nitrogen", value: 46, ideal: "40–60 ppm", status: "Fair", color: F.amber },
    { label: "Phosphorus", value: 72, ideal: "20–30 ppm", status: "Good", color: F.green },
    { label: "Potassium", value: 38, ideal: "180–250 ppm", status: "Poor", color: F.red },
    { label: "Organic Matter", value: 58, ideal: "3–5%", status: "Fair", color: F.amber },
  ];
  return <div style={{ background: F.card, borderRadius: 16, padding: 22, boxShadow: "0 2px 12px #00000010" }}>
    <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 17, color: F.text, marginBottom: 4 }}>🪴 Soil Health</div>
    <div style={{ fontSize: 12, color: F.muted, marginBottom: 16 }}>Latest field-sensor and soil-test readings</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
      {metrics.map(metric => <div key={metric.label} style={{ background: F.bg, borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}><span style={{ fontSize: 12, color: F.text, fontWeight: 600 }}>{metric.label}</span><span style={{ color: metric.color, fontSize: 10, fontWeight: 800 }}>{metric.status}</span></div>
        <div style={{ height: 6, borderRadius: 6, overflow: "hidden", background: F.border, margin: "9px 0 6px" }}><div style={{ height: "100%", width: `${metric.value}%`, background: metric.color, borderRadius: 6 }} /></div>
        <div style={{ color: F.muted, fontSize: 10 }}>{metric.display || `${metric.value}%`} · Ideal {metric.ideal}</div>
      </div>)}
    </div>
    <div style={{ marginTop: 14, padding: "12px 14px", background: F.amberBg, borderLeft: `3px solid ${F.amber}`, borderRadius: 8, color: F.text, fontSize: 13, lineHeight: 1.55 }}><strong>Fertilizer recommendation:</strong> Apply 50 kg/acre of MOP (muriate of potash) this week; your potassium is below the ideal range for fruiting tomatoes.</div>
  </div>;
}

function NearbyFarmerAlerts() {
  const alerts = [
    { name: "Mary Wanjiku", distance: "1.2 km", issue: "Late Blight", detail: "Moderate outbreak reported in tomatoes", color: F.red, icon: "⚠️" },
    { name: "Peter Ochieng", distance: "3.4 km", issue: "Whitefly", detail: "Increasing activity in greenhouse crops", color: F.amber, icon: "🐛" },
    { name: "Grace Njeri", distance: "4.1 km", issue: "Waterlogging", detail: "Heavy rain affecting lower fields", color: F.blue, icon: "💧" },
  ];
  return <div style={{ background: F.card, borderRadius: 16, padding: 22, boxShadow: "0 2px 12px #00000010" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 17, color: F.text }}>📡 Nearby Farmer Alerts</div><span style={{ color: F.green, fontSize: 11, fontWeight: 700 }}>COMMUNITY LIVE</span></div>
    <div style={{ fontSize: 12, color: F.muted, marginBottom: 14 }}>Community intelligence from farms near you</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{alerts.map(alert => <div key={alert.name} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", background: alert.color + "0d", border: `1px solid ${alert.color}33`, borderRadius: 10 }}><div style={{ fontSize: 20 }}>{alert.icon}</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, color: F.text, fontWeight: 700 }}>{alert.issue} <span style={{ fontWeight: 400, color: F.muted }}>· {alert.name}</span></div><div style={{ fontSize: 11, color: F.muted, marginTop: 2 }}>{alert.detail}</div></div><div style={{ color: alert.color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{alert.distance}</div></div>)}</div>
  </div>;
}

function TreatmentCostCalculator({ data }) {
  const options = [
    { name: "Mancozeb", cost: 3200, efficacy: 0.62 }, { name: "Ridomil Gold", cost: 6800, efficacy: 0.84 }, { name: "Copper Oxychloride", cost: 4100, efficacy: 0.69 }, { name: "Neem Oil", cost: 2500, efficacy: 0.45 },
  ];
  const [selected, setSelected] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const risk = String(data?.disease_risk || data?.pest_risk || "Moderate").toLowerCase();
  const riskFactor = risk === "high" ? 0.3 : risk === "low" ? 0.12 : 0.2;
  const potentialLoss = Math.round(2400 * 38 * riskFactor);
  const treatment = options[selected];
  const lossAvoided = Math.round(potentialLoss * treatment.efficacy);
  const netBenefit = lossAvoided - treatment.cost;
  const roi = Math.round((netBenefit / treatment.cost) * 100);
  return <div style={{ background: F.card, borderRadius: 16, padding: 22, boxShadow: "0 2px 12px #00000010" }}>
    <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 17, color: F.text }}>🧮 Treatment Cost Calculator</div>
    <div style={{ fontSize: 12, color: F.muted, margin: "3px 0 15px" }}>Based on your current <strong style={{ color: risk === "high" ? F.red : risk === "low" ? F.green : F.amber }}>{risk} risk</strong> and estimated tomato yield</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 13 }}>{options.map((option, index) => <button key={option.name} onClick={() => { setSelected(index); setCalculated(false); }} style={{ padding: 10, borderRadius: 10, cursor: "pointer", background: selected === index ? F.greenBg : F.bg, border: `1px solid ${selected === index ? F.green : F.border}`, textAlign: "left" }}><div style={{ color: F.text, fontSize: 12, fontWeight: 700 }}>{option.name}</div><div style={{ color: F.muted, fontSize: 11, marginTop: 2 }}>KSh {option.cost.toLocaleString()}</div></button>)}</div>
    <button onClick={() => setCalculated(true)} style={{ background: F.green, border: "none", borderRadius: 9, color: "#fff", width: "100%", padding: "10px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Calculate {treatment.name} benefit</button>
    {calculated && <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 14 }}>{[{ label: "Total cost", value: `KSh ${treatment.cost.toLocaleString()}`, color: F.text }, { label: "Loss avoided", value: `KSh ${lossAvoided.toLocaleString()}`, color: F.green }, { label: "Net benefit", value: `KSh ${netBenefit.toLocaleString()}`, color: netBenefit >= 0 ? F.green : F.red }, { label: "ROI", value: `${roi}%`, color: roi >= 0 ? F.green : F.red }].map(item => <div key={item.label} style={{ background: F.bg, padding: "10px 8px", borderRadius: 9, textAlign: "center" }}><div style={{ fontSize: 10, color: F.muted }}>{item.label}</div><div style={{ fontSize: 13, color: item.color, fontWeight: 800, marginTop: 3 }}>{item.value}</div></div>)}</div>}
  </div>;
}

function DashboardPage({ data, loading, onMarkDone, done, setPage }) {
  const score = data?.health_score || 87;
  const scoreColor = score >= 70 ? F.green : score >= 45 ? F.amber : F.red;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860, margin: "0 auto" }}>

      {/* Greeting */}
      <div style={{ animation: "fadeUp .4s ease" }}>
        <h1 style={{ fontFamily: "'Poppins'", fontWeight: 700,
          fontSize: 26, color: F.text, marginBottom: 4 }}>
          {greeting}, <span style={{ color: F.green }}>{FARMER.name}!</span>
        </h1>
        <p style={{ fontSize: 15, color: F.muted }}>
          {data?.greeting_tip || "Here's what's happening on your farm today."}
        </p>
      </div>

      {/* Farm health score */}
      <div style={{ background: F.card, borderRadius: 16, padding: 22,
        boxShadow: "0 2px 12px #00000010", animation: "fadeUp .4s ease .05s both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 16, color: F.text }}>Farm Health Score</span>
              <span style={{ fontSize: 14, color: F.mutedL }}>ⓘ</span>
            </div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0" }}>
                <Spinner size={20} />
                <span style={{ fontSize: 14, color: F.muted }}>Analysing your farm...</span>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Poppins'", fontWeight: 800,
                    fontSize: 52, color: scoreColor, lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: 20, color: F.muted, fontWeight: 500 }}>/100</span>
                </div>
                <p style={{ fontSize: 14, color: F.muted, marginBottom: 8 }}>
                  {data?.health_label || "Your farm is in good condition"}
                </p>
                <ScoreBar value={score} color={scoreColor} />
              </>
            )}
          </div>

          {/* Crop illustration */}
          <img src="/avatars/farm.png" alt="Farm" style={{
            width: 100, height: 100, borderRadius: "50%",
            objectFit: "cover", border: "2px solid " + F.green + "44",
            animation: "bounce 3s ease infinite", flexShrink: 0
          }} />

          {/* Check rows */}
          <div style={{ minWidth: 200 }}>
            {[
              ["Soil Moisture",    data?.soil_moisture    || "Good"    ],
              ["Weather Conditions",data?.weather_conditions || "Good" ],
              ["Crop Health",     data?.crop_health       || "Good"    ],
              ["Pest & Disease Risk", data?.pest_risk     || "Moderate"],
            ].map(([l, v]) => <CheckRow key={l} label={l} value={v} />)}
          </div>
        </div>
      </div>

      {/* Disease alert */}
      {!loading && data && (
        <div style={{ background: data.disease_risk === "High" ? "#fff5f5" : data.disease_risk === "Moderate" ? "#fffbeb" : "#f0fdf4",
          border: "1px solid " + (data.disease_risk === "High" ? "#fecaca" : data.disease_risk === "Moderate" ? "#fde68a" : "#bbf7d0"),
          borderRadius: 16, padding: 20, animation: "fadeUp .4s ease .1s both",
          boxShadow: "0 2px 12px #00000008" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{data.disease_risk === "High" ? "⚠️" : "ℹ️"}</span>
                <span style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 14,
                  color: data.disease_risk === "High" ? F.red : F.amber }}>
                  {data.disease_risk} Risk Alert
                </span>
              </div>
              <h3 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 20,
                color: F.text, marginBottom: 6 }}>{data.disease_name || "Late Blight Disease"}</h3>
              <p style={{ fontSize: 14, color: F.muted, marginBottom: 6 }}>
                {data.disease_desc || "High risk detected for your tomatoes"}
              </p>
              <p style={{ fontSize: 14, color: F.muted }}>
                Expected to increase in <strong style={{ color: F.text }}>{data.expected_days || 5} days</strong> due to high humidity and rain.
              </p>
              <button onClick={() => setPage("alerts")}
                style={{ background: "none", border: "none",
                  color: F.green, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", marginTop: 8, display: "flex",
                  alignItems: "center", gap: 4 }}>
                View Details →
              </button>
            </div>

            {/* Disease image */}
            <img src="/avatars/farm.png" alt="Crop" style={{
              width: 110, height: 110, borderRadius: "50%",
              objectFit: "cover", border: "2px solid " + F.green + "44",
              flexShrink: 0, boxShadow: "0 4px 16px #00000018"
            }} />

            {/* Risk stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 140 }}>
              {[
                ["Risk Level",    data.disease_risk || "HIGH",                   data.disease_risk === "High" ? F.red : F.amber],
                ["Confidence",   (data.disease_confidence || 87) + "%",          F.red   ],
                ["Affected Crop", FARMER.crop,                                   F.text  ],
              ].map(([l, v, c]) => (
                <div key={l} style={{ background: "#ffffff88", borderRadius: 10,
                  padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: F.muted, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontFamily: "'Poppins'", fontWeight: 700,
                    fontSize: 16,
                    
                    background: l === "Risk Level" ? (data.disease_risk === "High" ? F.red : F.amber) : "transparent",
                    color: l === "Risk Level" ? "#fff" : c,
                    borderRadius: l === "Risk Level" ? 6 : 0,
                    padding: l === "Risk Level" ? "2px 10px" : 0,
                    display: "inline-block" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended action */}
      {!loading && data && (
        <div style={{ background: F.card, borderRadius: 16, padding: 20,
          boxShadow: "0 2px 12px #00000010", animation: "fadeUp .4s ease .15s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%",
                background: F.green, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                🛡
              </div>
              <div>
                <div style={{ fontSize: 12, color: F.green, fontWeight: 600, marginBottom: 3 }}>
                  Recommended Action
                </div>
                <h3 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 17,
                  color: F.text, marginBottom: 4 }}>
                  {data.recommended_action || "Apply fungicide within 48 hours"}
                </h3>
                <p style={{ fontSize: 13, color: F.muted }}>
                  Recommended: {data.product_recommendation || "Mancozeb 75% WP"}
                </p>
                <p style={{ fontSize: 13, color: F.muted }}>
                  {data.action_reason || "This will help prevent the spread of Early Blight."}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 180 }}>
              <button onClick={onMarkDone}
                style={{ background: done ? F.muted : F.green, color: "#fff",
                  border: "none", borderRadius: 10, padding: "12px 20px",
                  fontFamily: "'Poppins'", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", display: "flex", alignItems: "center",
                  gap: 8, justifyContent: "center", transition: "all .2s" }}>
                {done ? "✓ Done!" : "✓ Mark as Done"}
              </button>
              <button onClick={() => setPage("recommendations")}
                style={{ background: "transparent", color: F.green,
                  border: "2px solid " + F.green, borderRadius: 10,
                  padding: "12px 20px", fontFamily: "'Poppins'",
                  fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                View All Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weather + Market row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Weather forecast */}
        <div style={{ background: F.card, borderRadius: 16, padding: 18,
          boxShadow: "0 2px 12px #00000010", animation: "fadeUp .4s ease .2s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 18 }}>⛅</span>
              <span style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.text }}>
                Weather Forecast
              </span>
            </div>
            <button onClick={() => setPage("weather")}
              style={{ background: "none", border: "none", color: F.green,
                fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              View Full Forecast →
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>{WEATHER_MOCK.icon}</span>
            <div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 700,
                fontSize: 28, color: F.text }}>{WEATHER_MOCK.temp}°C</div>
              <div style={{ fontSize: 13, color: F.muted }}>{WEATHER_MOCK.condition}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
              {[["Humidity", WEATHER_MOCK.humidity + "%"], ["Rainfall", WEATHER_MOCK.rainfall + " mm"], ["Wind", WEATHER_MOCK.wind + " km/h"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", gap: 6, fontSize: 13 }}>
                  <span style={{ color: F.muted }}>{l}</span>
                  <span style={{ fontWeight: 600, color: F.text }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {WEATHER_MOCK.forecast.map((f, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center",
                background: i === 0 ? F.greenBg : F.bg,
                borderRadius: 10, padding: "8px 4px" }}>
                <div style={{ fontSize: 10, color: F.muted, marginBottom: 4 }}>{f.day}</div>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: F.text }}>{f.hi}°</div>
                <div style={{ fontSize: 10, color: F.muted }}>{f.lo}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Market prices */}
        <div style={{ background: F.card, borderRadius: 16, padding: 18,
          boxShadow: "0 2px 12px #00000010", animation: "fadeUp .4s ease .25s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 18 }}>📊</span>
              <span style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.text }}>
                Market Price Outlook
              </span>
            </div>
            <button onClick={() => setPage("market")}
              style={{ background: "none", border: "none", color: F.green,
                fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              View Market →
            </button>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700,
              fontSize: 16, color: F.text, marginBottom: 4 }}>
              {MARKET_MOCK.crop}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "'Poppins'", fontWeight: 800,
                fontSize: 28, color: F.text }}>KSh {MARKET_MOCK.price}/kg</span>
            </div>
            <div style={{ fontSize: 13, color: F.green, fontWeight: 600, marginTop: 2 }}>
              {MARKET_MOCK.trend} increase expected next week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={70}>
            <AreaChart data={MARKET_MOCK.data}>
              <defs>
                <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={F.green} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={F.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="price" stroke={F.green}
                fill="url(#mG)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 14 }}>⏱</span>
            <span style={{ fontSize: 13, color: F.muted }}>
              Best time to sell: <strong style={{ color: F.text }}>{MARKET_MOCK.bestTime}</strong>
            </span>
          </div>
        </div>
      </div>

      <CropTimeline />
      <SoilHealthCard />
      <NearbyFarmerAlerts />
      <TreatmentCostCalculator data={data} />

      {/* Quick actions */}
      <div style={{ background: F.card, borderRadius: 16, padding: 20,
        boxShadow: "0 2px 12px #00000010", animation: "fadeUp .4s ease .3s both" }}>
        <h3 style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 16,
          color: F.text, marginBottom: 14 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i}
              style={{ display: "flex", flexDirection: "column", alignItems: "center",
                gap: 6, padding: "14px 18px", background: F.bg,
                border: "1px solid " + F.border, borderRadius: 12,
                cursor: "pointer", transition: "all .2s", flex: 1, minWidth: 90 }}
              onMouseEnter={e => { e.currentTarget.style.background = F.greenBg; e.currentTarget.style.borderColor = F.green + "66"; }}
              onMouseLeave={e => { e.currentTarget.style.background = F.bg; e.currentTarget.style.borderColor = F.border; }}>
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: F.text, textAlign: "center" }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WEATHER PAGE ─────────────────────────────────────────────────
function WeatherPage({ weather, weatherError }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 22, color: F.text }}>Weather Intelligence</h2>
      {weatherError && (
        <div role="alert" style={{ background: F.amberBg, border: "1px solid #fde68a", borderRadius: 12, padding: 14, color: F.text, fontSize: 13 }}>
          Live weather is unavailable ({weatherError}). Showing sample data; add an OpenWeather API key to `.env.local` to enable Kisii weather.
        </div>
      )}
      <div style={{ background: F.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px #00000010" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 56 }}>{weather.icon}</span>
          <div>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: 48, color: F.text, lineHeight: 1 }}>{weather.temp}°C</div>
            <div style={{ fontSize: 16, color: F.muted }}>{weather.condition}</div>
            <div style={{ fontSize: 13, color: F.muted, marginTop: 4 }}>{FARMER.location}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[["💧 Humidity", weather.humidity + "%", weather.humidity > 80 ? F.red : F.green], ["🌧 Rainfall", weather.rainfall + " mm", F.blue], ["💨 Wind", weather.wind + " km/h", F.muted]].map(([l, v, c]) => (
            <div key={l} style={{ background: F.bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: F.muted, marginBottom: 6 }}>{l}</div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 22, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {weather.forecast.map((f, i) => (
            <div key={i} style={{ background: i === 0 ? F.greenBg : F.bg, border: "1px solid " + (i === 0 ? F.green + "44" : F.border), borderRadius: 12, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: F.muted, marginBottom: 6 }}>{f.day}</div>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 16, color: F.text }}>{f.hi}°</div>
              <div style={{ fontSize: 12, color: F.muted }}>{f.lo}°</div>
              {f.rain > 0 && <div style={{ fontSize: 11, color: F.blue, marginTop: 4 }}>{f.rain}mm</div>}
            </div>
          ))}
        </div>
      </div>
      {weather.humidity > 75 && (
        <div style={{ background: F.amberBg, border: "1px solid #fde68a", borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.amber, marginBottom: 4 }}>Weather Risk Alert</div>
              <p style={{ fontSize: 14, color: F.text, lineHeight: 1.6 }}>Humidity at {weather.humidity}% is in the disease risk zone. Check local field conditions for fungal risk on your {FARMER.crop}.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ALERTS PAGE ──────────────────────────────────────────────────
function AlertsPage({ data }) {
  const [dismissed, setDismissed] = useState([]);
  const ALERTS = [
    { id:1, sev:"HIGH",     icon:"🦠", title: data?.disease_name || "Late Blight Detected", desc: data?.disease_desc || "High risk for your tomatoes — act within 24 hours", time:"5 min ago",  action:"Apply Mancozeb 75% WP fungicide"  },
    { id:2, sev:"MODERATE", icon:"🌧", title:"Heavy Rain Expected Tomorrow",                  desc:"18mm rainfall forecast — ensure good field drainage",    time:"1 hr ago",  action:"Check drainage channels"             },
    { id:3, sev:"LOW",      icon:"💧", title:"Irrigation Advisory",                           desc:"Soil moisture adequate — skip irrigation today",          time:"2 hrs ago", action:"No irrigation needed today"          },
  ].filter(a => !dismissed.includes(a.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 22, color: F.text }}>Alerts</h2>
      {ALERTS.map(a => {
        const col = a.sev === "HIGH" ? F.red : a.sev === "MODERATE" ? F.amber : F.green;
        const bg  = a.sev === "HIGH" ? "#fff5f5" : a.sev === "MODERATE" ? F.amberBg : F.greenBg;
        return (
          <div key={a.id} style={{ background: bg, border: "1px solid " + col + "33", borderLeft: "4px solid " + col, borderRadius: 14, padding: 18, animation: "fadeUp .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.text }}>{a.title}</span>
                    <Badge color={col} bg={col + "18"}>{a.sev}</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: F.muted, marginBottom: 8 }}>{a.desc}</p>
                  <div style={{ background: "#ffffff88", borderRadius: 8, padding: "8px 12px", display: "inline-block" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: F.green }}>Action: </span>
                    <span style={{ fontSize: 12, color: F.text }}>{a.action}</span>
                  </div>
                  <div style={{ fontSize: 11, color: F.mutedL, marginTop: 6 }}>{a.time}</div>
                </div>
              </div>
              <button onClick={() => setDismissed(d => [...d, a.id])} style={{ background: "none", border: "none", color: F.muted, cursor: "pointer", fontSize: 20, flexShrink: 0 }}>×</button>
            </div>
          </div>
        );
      })}
      {ALERTS.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 18, color: F.green }}>All Clear!</div>
          <div style={{ fontSize: 14, color: F.muted, marginTop: 6 }}>No active alerts for your farm right now.</div>
        </div>
      )}
    </div>
  );
}

// ─── RECOMMENDATIONS PAGE ─────────────────────────────────────────
function RecommendationsPage({ data }) {
  const recs = [
    { icon:"🌿", title: data?.recommended_action || "Apply fungicide within 48 hours", desc: data?.action_reason || "Prevent Late Blight spread on your tomatoes", priority:"HIGH",  done:false },
    { icon:"💧", title:"Skip irrigation today",              desc:"Soil moisture at 62% is adequate. Irrigating increases disease risk.", priority:"MODERATE", done:false },
    { icon:"🌱", title:"Apply potassium fertilizer",         desc:"Support fruit development during fruiting stage with K-rich fertilizer.", priority:"LOW",  done:false },
    { icon:"🔍", title:"Scout for whitefly weekly",          desc:"Check undersides of leaves. Population below economic threshold.",         priority:"LOW",  done:false },
  ];
  const [done, setDone] = useState([]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 22, color: F.text }}>Recommendations</h2>
      {recs.map((r, i) => {
        const col = r.priority === "HIGH" ? F.red : r.priority === "MODERATE" ? F.amber : F.green;
        const isDone = done.includes(i);
        return (
          <div key={i} style={{ background: isDone ? F.greenBg : F.card, border: "1px solid " + (isDone ? F.green + "44" : F.border), borderRadius: 14, padding: 18, boxShadow: "0 2px 8px #00000008", transition: "all .3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: isDone ? F.muted : F.text, textDecoration: isDone ? "line-through" : "none", marginBottom: 3 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: F.muted }}>{r.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge color={col} bg={col + "18"}>{r.priority}</Badge>
                <button onClick={() => setDone(d => isDone ? d.filter(x => x !== i) : [...d, i])}
                  style={{ background: isDone ? F.muted : F.green, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  {isDone ? "Undo" : "Mark Done"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MARKET PAGE ──────────────────────────────────────────────────
function MarketPage({ data }) {
  const [selectedCrop, setSelectedCrop] = useState("Tomatoes");
  const selectedData = CROP_PORTFOLIO.find(c => c.crop === selectedCrop) || CROP_PORTFOLIO[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 24, color: F.text }}>Market Intelligence</h2>

      {/* Supply/Demand Signal Banner */}
      <div style={{ background: SUPPLY_DEMAND_SIGNAL.signal === "FAVORABLE" ? "#f0fdf4" : "#fffbeb",
        border: "1px solid " + (SUPPLY_DEMAND_SIGNAL.signal === "FAVORABLE" ? F.green + "44" : F.amber + "44"),
        borderRadius: 14, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%",
          background: SUPPLY_DEMAND_SIGNAL.signal === "FAVORABLE" ? F.greenBg : F.amberBg,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
          {SUPPLY_DEMAND_SIGNAL.signal === "FAVORABLE" ? "📈" : "⚠️"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 14,
              color: SUPPLY_DEMAND_SIGNAL.signal === "FAVORABLE" ? F.green : F.amber }}>
              {SUPPLY_DEMAND_SIGNAL.signal} — {SUPPLY_DEMAND_SIGNAL.confidence}% Confidence
            </span>
          </div>
          <p style={{ fontSize: 14, color: F.text, lineHeight: 1.6 }}>{SUPPLY_DEMAND_SIGNAL.insight}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: F.muted }}>
              <strong style={{ color: F.red }}>{SUPPLY_DEMAND_SIGNAL.supplyChange}</strong> Supply
            </span>
            <span style={{ fontSize: 12, color: F.muted }}>
              <strong style={{ color: F.green }}>{SUPPLY_DEMAND_SIGNAL.demandChange}</strong> Demand
            </span>
          </div>
        </div>
      </div>

      {/* Crop Portfolio */}
      <div>
        <h3 style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 16, color: F.text, marginBottom: 12 }}>Your Crop Portfolio</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          {CROP_PORTFOLIO.map((c, i) => {
            const active = selectedCrop === c.crop;
            return (
              <button key={i} onClick={() => setSelectedCrop(c.crop)}
                style={{ background: active ? F.greenBg : F.card,
                  border: "2px solid " + (active ? F.green + "66" : F.border),
                  borderRadius: 14, padding: 16, cursor: "pointer",
                  textAlign: "left", transition: "all .2s", position: "relative" }}>
                <div style={{ fontSize: 12, color: F.muted, marginBottom: 6 }}>{c.crop}</div>
                <div style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: 24, color: F.text, marginBottom: 4 }}>
                  KSh {c.price}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: c.trendUp ? F.green : F.red, fontWeight: 600 }}>
                    {c.trendUp ? "▲" : "▼"} {c.trend}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: F.muted }}>Vol: {c.volume}</div>
                <div style={{ fontSize: 11, color: F.green, marginTop: 2 }}>Best: {c.bestMarket}</div>
                {active && (
                  <div style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8,
                    borderRadius: "50%", background: F.green }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price History + Forecast Chart */}
      <div style={{ background: F.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px #00000010" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 16, color: F.text }}>
              {selectedCrop} — Price History & Forecast
            </div>
            <div style={{ fontSize: 12, color: F.muted, marginTop: 2 }}>
              Solid = actual · Dashed = AI predicted
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 3, background: F.green, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: F.muted }}>Actual</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 3, borderTop: "2px dashed " + F.blue, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: F.muted }}>Forecast</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={PRICE_HISTORY_FORECAST}>
            <defs>
              <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={F.green} stopOpacity={0.25} />
                <stop offset="95%" stopColor={F.green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={F.blue} stopOpacity={0.15} />
                <stop offset="95%" stopColor={F.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={F.border} vertical={false} />
            <XAxis dataKey="day" tick={{ fill: F.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: F.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid " + F.border, fontSize: 12 }} />
            <Area type="monotone" dataKey="actual" name="Actual KSh/kg" stroke={F.green} fill="url(#actualG)" strokeWidth={2.5} dot={{ fill: F.green, r: 4 }} connectNulls={false} />
            <Area type="monotone" dataKey="forecast" name="Forecast KSh/kg" stroke={F.blue} fill="url(#forecastG)" strokeWidth={2.5} strokeDasharray="6 4" dot={{ fill: F.blue, r: 4 }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Nearby Markets Comparison */}
      <div style={{ background: F.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px #00000010" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 16, color: F.text }}>
            Where to Sell — Market Comparison
          </div>
          <span style={{ fontSize: 12, color: F.muted }}>Prices for {selectedCrop} (KSh/kg)</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MARKET_COMPARISON.map((m, i) => {
            const price = m[selectedCrop.toLowerCase()] || m.tomatoes;
            const isBest = price === Math.max(...MARKET_COMPARISON.map(x => x[selectedCrop.toLowerCase()] || x.tomatoes));
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", background: isBest ? F.greenBg : F.bg,
                border: "1px solid " + (isBest ? F.green + "44" : F.border),
                borderRadius: 12, transition: "all .2s" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 14, color: F.text }}>{m.market}</div>
                  <div style={{ fontSize: 11, color: F.muted }}>{m.distance} away · {m.trend}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Poppins'", fontWeight: 800, fontSize: 20, color: isBest ? F.green : F.text }}>
                    KSh {price}
                  </div>
                  <div style={{ fontSize: 11, color: F.muted }}>/kg</div>
                </div>
                {isBest && (
                  <div style={{ background: F.green, color: "#fff", borderRadius: 20,
                    padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>
                    BEST PRICE
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: 12, background: F.greenBg, borderRadius: 10, border: "1px solid " + F.green + "33" }}>
          <div style={{ fontSize: 13, color: F.text, fontWeight: 500 }}>
            💡 AI Recommendation: Transport to <strong>Nairobi Wakulima</strong> for +18% revenue on {selectedCrop}. Net gain after transport: ~KSh 3,200 for your current stock.
          </div>
        </div>
      </div>

      {/* Original simple market card (kept for reference) */}
      <div style={{ background: F.greenBg, border: "1px solid " + F.green + "44", borderRadius: 14, padding: 18 }}>
        <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.green, marginBottom: 6 }}>💡 AI Market Advice</div>
        <p style={{ fontSize: 14, color: F.text, lineHeight: 1.7 }}>
          Based on current trends, hold your {selectedCrop} harvest for 7-10 more days. Prices are expected to peak at KSh 46/kg as supply drops 18% in your region. Best window: {MARKET_MOCK.bestTime}.
        </p>
      </div>
    </div>
  );
}

// ─── CHAT PAGE ────────────────────────────────────────────────────
function ChatPage({ weather, diagnosis, initialQuestion, onQuestionConsumed }) {
  const [chat, setChat] = useState([
    { role: "ai", text: "Hello " + FARMER.name + "! I'm AgriMind, your AI farming assistant. Ask me anything about your " + FARMER.crop + " farm — disease risks, irrigation, market prices, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  const chatEndRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);
  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
      onQuestionConsumed();
    }
  }, [initialQuestion, onQuestionConsumed]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput("");
    setChat(c => [...c, { role: "user", text: q }]);
    setLoading(true);
    try {
      const ans = await chatWithAI(FARMER, weather, chat, q, diagnosis);
      setChat(c => [...c, { role: "ai", text: ans }]);
    } catch (error) {
      setChat(c => [...c, {
        role: "ai",
        text: error instanceof Error ? error.message : "Sorry, I couldn't connect. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  const SUGGESTIONS = ["What should I spray for Late Blight?", "Should I irrigate today?", "When should I harvest my tomatoes?", "What's the best fertilizer right now?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: F.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
        <div>
          <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 18, color: F.text }}>Chat with AgriMind</div>
          <div style={{ fontSize: 12, color: F.green }}>● Online — AI-powered farming assistant</div>
        </div>
      </div>

      {diagnosis && (
        <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: F.greenBg, color: F.text, fontSize: 13, lineHeight: 1.5 }}>
          🌿 Your latest leaf scan ({diagnosis.is_healthy ? "healthy leaf" : diagnosis.name || diagnosis.condition || "diagnosis"}) is included as context for this chat.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => setInput(s)}
            style={{ background: F.greenBg, border: "1px solid " + F.green + "44", color: F.green, borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4 }}>
        {chat.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease" }}>
            {m.role === "ai" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: F.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🌿</div>
            )}
            <div style={{ maxWidth: "74%", padding: "12px 16px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? F.green : F.card,
              color: m.role === "user" ? "#fff" : F.text,
              boxShadow: "0 2px 8px #00000010",
              fontSize: 14, lineHeight: 1.7, fontFamily: "'Inter'" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: F.green, display: "flex", alignItems: "center", justifyContent: "center" }}>🌿</div>
            <div style={{ padding: "12px 16px", background: F.card, borderRadius: "18px 18px 18px 4px", display: "flex", gap: 6, alignItems: "center" }}>
              <Spinner size={14} /><span style={{ fontSize: 13, color: F.muted }}>AgriMind is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask anything about your farm..."
          style={{ flex: 1, background: F.card, border: "2px solid " + F.border, borderRadius: 14, padding: "12px 16px", fontSize: 14, outline: "none", color: F.text, fontFamily: "'Inter'" }}
          onFocus={e => e.target.style.borderColor = F.green}
          onBlur={e => e.target.style.borderColor = F.border} />
        <button onClick={send} disabled={loading || !input.trim()}
          style={{ background: F.green, color: "#fff", border: "none", borderRadius: 14, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: loading || !input.trim() ? 0.5 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ─── MY FARM PAGE ─────────────────────────────────────────────────
function MyFarmPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 22, color: F.text }}>My Farm</h2>
      <div style={{ background: F.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px #00000010" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avatar src="/avatars/farmer-john.png" alt={FARMER.fullName} size={64} fallback="👨‍🌾" />
          <div>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 20, color: F.text }}>{FARMER.fullName}</div>
            <div style={{ fontSize: 14, color: F.muted }}>{FARMER.farmName} · {FARMER.location}</div>
            <div style={{ fontSize: 13, color: F.green, marginTop: 2 }}>{FARMER.phone}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          {[["🌿 Crop", FARMER.crop], ["📍 Location", FARMER.location], ["📐 Farm Size", FARMER.size], ["🌱 Stage", FARMER.stage], ["📅 Planted", "10 Mar 2026"], ["🌾 Harvest", "20 Jun 2026"]].map(([l, v]) => (
            <div key={l} style={{ background: F.bg, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, color: F.muted, marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RECORDS PAGE ─────────────────────────────────────────────────
function RecordsPage() {
  const RECORDS = [
    { date:"06 Jun 2026", type:"Fungicide Application",   note:"Applied Mancozeb 75% WP — 2kg per acre", icon:"🌿" },
    { date:"02 Jun 2026", type:"Irrigation",              note:"Drip irrigation — 18mm applied",          icon:"💧" },
    { date:"28 May 2026", type:"Disease Observation",     note:"Early signs of leaf spots on row 3-5",    icon:"🔍" },
    { date:"20 May 2026", type:"Fertilizer Application",  note:"CAN fertilizer — 50kg top dressing",      icon:"🌱" },
    { date:"10 Mar 2026", type:"Planting",                note:"Cal-J variety tomatoes planted — 3.2 ha", icon:"🌿" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Poppins'", fontWeight: 700, fontSize: 22, color: F.text }}>My Records</h2>
        <button style={{ background: F.green, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Add Record</button>
      </div>
      {RECORDS.map((r, i) => (
        <div key={i} style={{ background: F.card, borderRadius: 14, padding: 18, boxShadow: "0 2px 8px #00000008", display: "flex", gap: 14, alignItems: "flex-start", animation: "fadeUp .3s ease " + (i * .06) + "s both" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: F.greenBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 15, color: F.text, marginBottom: 3 }}>{r.type}</div>
            <div style={{ fontSize: 13, color: F.muted, marginBottom: 4 }}>{r.note}</div>
            <div style={{ fontSize: 11, color: F.mutedL }}>{r.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function FarmerDashboard({ onSwitchToMachine }) {
  const [page,      setPage]      = useState("dashboard");
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [done,      setDone]      = useState(false);
  const [weather,   setWeather]   = useState(WEATHER_MOCK);
  const [weatherError, setWeatherError] = useState("");
  const [leafDiagnosis, setLeafDiagnosis] = useState<LeafDiagnosis | null>(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const clearChatQuestion = useCallback(() => setChatQuestion(""), []);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    let currentWeather = WEATHER_MOCK;
    try {
      const res = await fetch("/api/weather?city=Kisii,Kenya");
      const d   = await res.json();
      if (!res.ok) {
        throw new Error(d.error || "Unable to load Kisii weather.");
      }
      const forecastByDay = new Map();
      for (const entry of d.forecast.list) {
        const day = entry.dt_txt.slice(0, 10);
        const items = forecastByDay.get(day) || [];
        items.push(entry);
        forecastByDay.set(day, items);
      }
      const forecast = [...forecastByDay.values()].slice(0, 5).map((items, index) => {
        const temps = items.map(item => item.main.temp);
        const rainfall = items.reduce((sum, item) => sum + (item.rain?.["3h"] || 0), 0);
        return {
          day: index === 0 ? "Today" : new Date(items[0].dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
          hi: Math.round(Math.max(...temps)),
          lo: Math.round(Math.min(...temps)),
          icon: rainfall > 0 ? "🌧" : "⛅",
          rain: Math.round(rainfall),
        };
      });
      currentWeather = {
        temp: Math.round(d.current.main.temp),
        condition: d.current.weather[0].description,
        icon: "⛅",
        humidity: d.current.main.humidity,
        rainfall: Math.round((d.current.rain?.["1h"] || 0) * 10) / 10,
        wind: Math.round(d.current.wind.speed * 3.6),
        forecast: forecast.length ? forecast : WEATHER_MOCK.forecast,
      };
      setWeather(currentWeather);
      setWeatherError("");
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : "Unable to load Kisii weather.");
    }
    try {
      const rec = await getAIRecommendation(FARMER, currentWeather);
      setData(rec);
    } catch { /* use null */ }
    setLoading(false);
  }

  const alertCount = 3;

  const pages = {
    dashboard:      <DashboardPage data={data} loading={loading} onMarkDone={() => setDone(true)} done={done} setPage={setPage} />,
    farm:           <MyFarmPage />,
    "leaf-diagnosis": <LeafDiagnosisPage
      onDiagnosisChange={setLeafDiagnosis}
      onAskAssistant={(question) => {
        setChatQuestion(question);
        setPage("chat");
      }}
    />,
    weather:        <WeatherPage weather={weather} weatherError={weatherError} />,
    alerts:         <AlertsPage data={data} />,
    recommendations:<RecommendationsPage data={data} />,
    market:         <MarketPage data={data} />,
    records:        <RecordsPage />,
    avalanche:      <AvalancheTrustLayerPage />,
    chat:           <ChatPage
      weather={weather}
      diagnosis={leafDiagnosis}
      initialQuestion={chatQuestion}
      onQuestionConsumed={clearChatQuestion}
    />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: F.bg,
      fontFamily: "'Inter',sans-serif" }}>
      <style>{STYLES}</style>
      <Sidebar page={page} setPage={setPage} weather={weather} alertCount={alertCount} />

      <div className="farmer-content" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ height: 60, background: F.card, borderBottom: "1px solid " + F.border,
          padding: "0 24px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 2px 8px #00000008" }}>
          <div style={{ fontFamily: "'Poppins'", fontWeight: 600, fontSize: 18, color: F.text }}>
            {NAV_ITEMS.find(n => n.id === page)?.label || "Dashboard"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onSwitchToMachine && (
              <button onClick={onSwitchToMachine}
                style={{ background: F.sidebar, color: "#fff", border: "none",
                  borderRadius: 8, padding: "7px 14px", fontSize: 12,
                  fontWeight: 600, cursor: "pointer" }}>
                🔬 Machine View
              </button>
            )}
            <div style={{ position: "relative" }}>
              <button onClick={() => setPage("alerts")}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>🔔</button>
              {alertCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4,
                  background: F.red, color: "#fff", borderRadius: "50%",
                  width: 18, height: 18, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {alertCount}
                </span>
              )}
            </div>
            <Avatar src="/avatars/farmer-john.png" alt={FARMER.name} size={36} fallback="👨‍🌾" />
          </div>
        </div>

        {/* Main content */}
        <main className="farmer-main" style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {pages[page] || pages.dashboard}
        </main>

        {/* Mobile bottom nav */}
        <div className="farmer-mobile-nav" style={{ display: "none", background: F.card, borderTop: "1px solid " + F.border,
          padding: "8px 0", position: "sticky", bottom: 0 }}>
          {NAV_ITEMS.slice(0, 5).map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 2, padding: "4px 0",
                color: page === item.id ? F.green : F.muted }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: page === item.id ? 600 : 400 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
