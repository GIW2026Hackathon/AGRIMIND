"use client"
import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

// ─── THEME ────────────────────────────────────────────────────────
const T = {
  bg:      "#1f351f",
  s1:      "#0d140d",
  s2:      "#111a11",
  card:    "#0f1a0f",
  border:  "#1a2e1a",
  borderL: "#253d25",
  g:       "#22c55e",
  gd:      "#16a34a",
  gdim:    "#052e16",
  lime:    "#84cc16",
  amber:   "#f59e0b",
  red:     "#ef4444",
  blue:    "#3b82f6",
  purple:  "#a855f7",
  teal:    "#14b8a6",
  orange:  "#f97316",
  cyan:    "#06b6d4",
  text:    "#e2ffe2",
  muted:   "#4d7a4d",
  mutedL:  "#7aaa7a",
  white:   "#ffffff",
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0a0f0a;font-family:'Plus Jakarta Sans',sans-serif;color:#e2ffe2;font-size:15px}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2);opacity:0}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:#0a0f0a}
::-webkit-scrollbar-thumb{background:#1a2e1a;border-radius:2px}
`;

// ─── MOCK DATA ────────────────────────────────────────────────────
const PREDICTION_DATA = [
  { date:"May 12", predictions:3200, correct:2700 },
  { date:"May 13", predictions:4100, correct:3500 },
  { date:"May 14", predictions:3800, correct:3200 },
  { date:"May 15", predictions:5200, correct:4400 },
  { date:"May 16", predictions:4800, correct:4100 },
  { date:"May 17", predictions:6100, correct:5200 },
  { date:"May 18", predictions:5800, correct:4982 },
];

const DATA_STREAMS = [
  { name:"Weather Stations", value:38, records:"931K", color:"#3b82f6" },
  { name:"Satellite Imagery",value:24, records:"588K", color:"#22c55e" },
  { name:"Field Sensors",    value:18, records:"441K", color:"#a855f7" },
  { name:"Farmer Reports",   value:12, records:"294K", color:"#f59e0b" },
  { name:"Market Feeds",     value:6,  records:"147K", color:"#14b8a6" },
  { name:"Other Sources",    value:2,  records:"49K",  color:"#6b7c6b"  },
];

const AGENTS = [
  { name:"Weather Agent",            status:"Running", accuracy:98.6, records:"2.4K", color:T.blue   },
  { name:"Disease Surveillance Agent",status:"Running",accuracy:97.1, records:"3.7K", color:T.red    },
  { name:"Pest Detection Agent",     status:"Running", accuracy:96.3, records:"2.1K", color:T.orange },
  { name:"Soil Intelligence Agent",  status:"Running", accuracy:98.9, records:"1.8K", color:T.lime   },
  { name:"Market Intelligence Agent",status:"Running", accuracy:97.6, records:"2.9K", color:T.amber  },
  { name:"Crop Growth Agent",        status:"Running", accuracy:98.2, records:"2.3K", color:T.teal   },
  { name:"Research Knowledge Agent", status:"Running", accuracy:96.8, records:"1.2K", color:T.purple },
  { name:"Recommendation Agent",     status:"Running", accuracy:98.7, records:"3.1K", color:T.g      },
];

const LAYERS = [
  { n:1,  name:"Observation Layer",  status:"Live", color:T.blue   },
  { n:2,  name:"Memory Layer",       status:"Live", color:T.purple },
  { n:3,  name:"Knowledge Graph",    status:"Live", color:T.lime   },
  { n:4,  name:"AI Agents Layer",    status:"Live", color:T.teal   },
  { n:5,  name:"Reasoning Engine",   status:"Live", color:T.g      },
  { n:6,  name:"Prediction Engine",  status:"Live", color:T.amber  },
  { n:7,  name:"Decision Engine",    status:"Live", color:T.orange },
  { n:8,  name:"Alert Network",      status:"Live", color:T.red    },
  { n:9,  name:"Human Action",       status:"Live", color:T.cyan   },
  { n:10, name:"Feedback Loop",      status:"Live", color:T.purple },
];

const INTEL_FEED = [
  { time:"13:45", msg:"Early Blight risk detected in 24 farms", sub:"Tomatoes • Nyandarua County",   level:"High",       color:T.red    },
  { time:"13:42", msg:"Fall Armyworm outbreak predicted",       sub:"Maize • Trans Nzoia County",    level:"High",       color:T.red    },
  { time:"13:35", msg:"Weather anomaly detected",               sub:"High rainfall expected in 3 days",level:"Moderate", color:T.amber  },
  { time:"13:30", msg:"Price increase predicted",               sub:"Tomatoes • +12% in next 7 days", level:"Opportunity",color:T.g    },
  { time:"13:28", msg:"Irrigation recommendation generated",    sub:"126 farms need irrigation",      level:"Action",     color:T.blue   },
];

const RECENT_ALERTS = [
  { name:"Early Blight",    county:"Nyandarua County",  level:"High Risk",     time:"13:45", color:T.red,   icon:"⚠️" },
  { name:"Fall Armyworm",   county:"Trans Nzoia County",level:"High Risk",     time:"13:42", color:T.red,   icon:"⚠️" },
  { name:"Bacterial Wilt",  county:"Kakamega County",   level:"Moderate Risk", time:"13:38", color:T.amber, icon:"⚠️" },
  { name:"Leaf Miner",      county:"Nakuru County",     level:"Low Risk",      time:"13:30", color:T.g,     icon:"ℹ️" },
  { name:"Aphids",          county:"Bungoma County",    level:"Moderate Risk", time:"13:28", color:T.amber, icon:"⚠️" },
];

// Kenya county risk map data (simplified SVG positions)
const COUNTIES = [
  { name:"Trans Nzoia",  x:280, y:185, risk:"very-high", r:18 },
  { name:"Uasin Gishu",  x:320, y:210, risk:"very-high", r:16 },
  { name:"Elgeyo M.",    x:360, y:200, risk:"high",      r:14 },
  { name:"Nandi",        x:340, y:240, risk:"high",      r:15 },
  { name:"Bungoma",      x:240, y:215, risk:"high",      r:14 },
  { name:"Kakamega",     x:255, y:255, risk:"moderate",  r:15 },
  { name:"Vihiga",       x:270, y:280, risk:"moderate",  r:10 },
  { name:"Siaya",        x:235, y:300, risk:"low",       r:12 },
  { name:"Kisumu",       x:255, y:310, risk:"low",       r:13 },
  { name:"Kericho",      x:330, y:275, risk:"moderate",  r:14 },
  { name:"Nakuru",       x:375, y:270, risk:"high",      r:18 },
  { name:"Nyandarua",    x:420, y:245, risk:"very-high", r:14 },
  { name:"Narok",        x:345, y:330, risk:"low",       r:16 },
  { name:"Homa Bay",     x:265, y:345, risk:"very-low",  r:13 },
  { name:"Migori",       x:270, y:380, risk:"very-low",  r:12 },
  { name:"Nyamira",      x:295, y:330, risk:"low",       r:11 },
  { name:"Bomet",        x:335, y:355, risk:"very-low",  r:12 },
  { name:"Kericho",      x:325, y:300, risk:"moderate",  r:11 },
  { name:"Nairobi",      x:420, y:295, risk:"moderate",  r:12 },
];

const RISK_COLORS = {
  "very-high": "#dc2626",
  "high":      "#f97316",
  "moderate":  "#f59e0b",
  "low":       "#84cc16",
  "very-low":  "#22c55e",
};

// ─── NAV SECTIONS ─────────────────────────────────────────────────
const NAV = [
  { section:"OVERVIEW", items:[
    { id:"overview",  icon:"/icons/machine-overview.jpg",  label:"Machine Overview" },
    { id:"intel",     icon:"/icons/intel.jpg",     label:"Intelligence Feed" },
    { id:"monitor",   icon:"/icons/monitor.jpg",   label:"System Monitor"    },
  ]},
  { section:"INTELLIGENCE LAYERS", items:[
    { id:"knowledge", icon:"/icons/knowledge.jpg",  label:"Knowledge Graph"  },
    { id:"gnn",        icon:"/icons/gnn.png",        label:"Neural Network"   },
    { id:"agents",    icon:"/icons/agents.jpg",     label:"AI Agents"         },
    { id:"reasoning", icon:"/icons/reasoning.jpg",  label:"Reasoning Engine"  },
    { id:"prediction",icon:"/icons/prediction.jpg", label:"Prediction Engine" },
    { id:"decision",  icon:"/icons/decision.jpg",   label:"Decision Engine"   },
  ]},
  { section:"DATA & INSIGHTS", items:[
    { id:"streams",   icon:"/icons/streams.jpg",   label:"Data Streams"      },
    { id:"riskmap",   icon:"/icons/riskmap.jpg",   label:"Risk Map"          },
    { id:"analytics", icon:"/icons/analytics.jpg", label:"Analytics"         },
    { id:"reports",   icon:"/icons/reports.jpg",   label:"Reports"           },
  ]},
  { section:"SYSTEM", items:[
    { id:"users",     icon:"/icons/users.jpg",        label:"Users & Roles"     },
    { id:"integrations",icon:"/icons/integrations.jpg",label:"Integrations"     },
    { id:"settings",  icon:"/icons/settings.jpg",     label:"Settings"          },
    { id:"audit",     icon:"/icons/audit.jpg",        label:"Audit Logs"        },
  ]},
];

// ─── ATOMS ────────────────────────────────────────────────────────
function Avatar({ src, alt, size = 32, fallback = "👤", style = {} }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: T.g + "22", border: "1px solid " + T.g + "44",
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
        objectFit: "cover", border: "1px solid " + T.border,
        flexShrink: 0, ...style
      }}
    />
  );
}

function Spinner({ size = 14, color = T.g }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{ animation: "spin .8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color}
        strokeWidth="2.5" strokeDasharray="50" strokeDashoffset="15" strokeLinecap="round" />
    </svg>
  );
}

function LiveDot({ color = T.g }) {
  return (
    <span style={{ position: "relative", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      width: 8, height: 8, flexShrink: 0 }}>
      <span style={{ position: "absolute", width: "100%", height: "100%",
        borderRadius: "50%", background: color,
        animation: "ping 1.5s ease infinite", opacity: .4 }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%",
        background: color, display: "block" }} />
    </span>
  );
}

function MetricCard({ icon, label, value, delta, color, delay = 0 }) {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: "16px 20px",
      animation: "fadeUp .4s ease " + delay + "s both",
      display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10,
        background: color + "18", border: "1px solid " + color + "33",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 4,
          fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.04em", fontWeight: 500 }}>{label}</div>
        <div style={{ fontFamily: "'Inter'", fontWeight: 800,
          fontSize: 32, color: T.text, lineHeight: 1, marginBottom: 5 }}>{value}</div>
        {delta && (
          <div style={{ fontSize: 11, color: T.g, fontWeight: 500 }}>
            ▲ {delta}
          </div>
        )}
      </div>
      <div style={{ width: 28, height: 28, borderRadius: 7,
        background: color + "18", border: "1px solid " + color + "33",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color, fontSize: 13 }}>→</div>
    </div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.s2, border: "1px solid " + T.border,
      borderRadius: 8, padding: "7px 11px",
      fontFamily: "'JetBrains Mono'", fontSize: 15}}>
      <div style={{ color: T.muted, marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || T.g }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
}

// ─── RISK HEAT MAP ────────────────────────────────────────────────
function RiskHeatMap() {
  const [hover, setHover] = useState(null);
  const [county, setCounty] = useState("All Counties");

  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: 16, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'Inter'", fontWeight: 600,
            fontSize: 16, color: T.text }}>Risk Heat Map</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>Disease & Pest Risk</div>
        </div>
        <select value={county} onChange={e => setCounty(e.target.value)}
          style={{ background: T.s2, border: "1px solid " + T.border,
            color: T.text, borderRadius: 7, padding: "5px 10px",
            fontSize: 11, cursor: "pointer", outline: "none",
            fontFamily: "'JetBrains Mono'" }}>
          <option>All Counties</option>
          <option>Nakuru</option>
          <option>Nyandarua</option>
          <option>Trans Nzoia</option>
        </select>
      </div>

      {/* Kenya map SVG */}
      <div style={{ position: "relative", background: T.s1,
        borderRadius: 10, overflow: "hidden" }}>
        <svg viewBox="180 160 320 260" style={{ width: "100%", height: 280 }}>
          {/* Background */}
          <rect x="180" y="160" width="320" height="260" fill={T.bg} rx="8" />

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={"h" + i} x1="180" y1={160 + i * 52} x2="500" y2={160 + i * 52}
              stroke={T.border} strokeWidth="0.5" opacity="0.5" />
          ))}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={"v" + i} x1={180 + i * 64} y1="160" x2={180 + i * 64} y2="420"
              stroke={T.border} strokeWidth="0.5" opacity="0.5" />
          ))}

          {/* County bubbles */}
          {COUNTIES.map((c, i) => {
            const col = RISK_COLORS[c.risk];
            const isHov = hover === c.name;
            return (
              <g key={c.name + i}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}>
                <circle cx={c.x} cy={c.y} r={c.r + (isHov ? 4 : 0)}
                  fill={col + "33"} stroke={col}
                  strokeWidth={isHov ? 2 : 1}
                  style={{ transition: "all .2s", filter: isHov ? "drop-shadow(0 0 8px " + col + ")" : "none" }} />
                <circle cx={c.x} cy={c.y} r={Math.max(3, c.r * 0.35)}
                  fill={col} opacity="0.9" />
                {(c.r > 14 || isHov) && (
                  <text x={c.x} y={c.y + c.r + 10} textAnchor="middle"
                    fill={T.mutedL} fontSize="7.5" fontFamily="Inter">
                    {c.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Hover tooltip */}
          {hover && (() => {
            const c = COUNTIES.find(x => x.name === hover);
            if (!c) return null;
            return (
              <g>
                <rect x={c.x - 40} y={c.y - c.r - 28} width={80} height={22}
                  fill={T.s2} stroke={RISK_COLORS[c.risk]} strokeWidth="1" rx="4" />
                <text x={c.x} y={c.y - c.r - 13} textAnchor="middle"
                  fill={T.text} fontSize="9" fontFamily="Inter" fontWeight="600">
                  {c.name}
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Controls */}
        <div style={{ position: "absolute", bottom: 10, right: 10,
          display: "flex", flexDirection: "column", gap: 4 }}>
          {["⛶","＋","－"].map((btn, i) => (
            <button key={i} style={{ width: 26, height: 26, background: T.s2,
              border: "1px solid " + T.border, color: T.mutedL, borderRadius: 5,
              cursor: "pointer", fontSize: 13, display: "flex",
              alignItems: "center", justifyContent: "center" }}>{btn}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono'",
          marginRight: 4, alignSelf: "center" }}>Risk Level</div>
        {Object.entries({ "Very High":"#dc2626","High":"#f97316","Moderate":"#f59e0b","Low":"#84cc16","Very Low":"#22c55e" }).map(([l, c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 9, color: T.muted, fontFamily: "'JetBrains Mono'" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INTELLIGENCE FEED ────────────────────────────────────────────
function IntelFeed({ onViewAll }) {
  const [live, setLive] = useState(INTEL_FEED);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      if (Math.random() > 0.6) {
        const NEW_EVENTS = [
          { msg:"Humidity spike detected — 89%", sub:"Nakuru North Subcounty",   level:"Moderate", color:T.amber  },
          { msg:"New farm registered",            sub:"Molo • Nakuru County",     level:"Action",   color:T.blue   },
          { msg:"Fungal risk window opening",     sub:"Potatoes • Nyandarua",     level:"High",     color:T.red    },
          { msg:"Market price update",            sub:"Tomatoes KES 45/kg",       level:"Opportunity",color:T.g   },
        ];
        const pick = NEW_EVENTS[Math.floor(Math.random() * NEW_EVENTS.length)];
        const now  = new Date();
        const ts   = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
        setLive(l => [{ time:ts, ...pick }, ...l.slice(0, 8)]);
      }
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: 16, display: "flex",
      flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600,
          fontSize: 16, color: T.text }}>Intelligence Feed</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LiveDot color={T.g} />
          <span style={{ fontSize: 10, color: T.g,
            fontFamily: "'JetBrains Mono'" }}>Live</span>
          <button style={{ background: "none", border: "none",
            color: T.muted, cursor: "pointer", fontSize: 12 }}>▾</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 1 }}>
        {live.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10,
            alignItems: "flex-start", padding: "8px 0",
            borderBottom: "1px solid " + T.border,
            animation: i === 0 ? "slideIn .3s ease" : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%",
              background: item.color, flexShrink: 0, marginTop: 5,
              boxShadow: i === 0 ? "0 0 6px " + item.color : "none" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500,
                color: T.text, lineHeight: 1.4 }}>{item.msg}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{item.sub}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column",
              alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 9, color: T.muted,
                fontFamily: "'JetBrains Mono'" }}>{item.time}</span>
              <span style={{ fontSize: 9, color: item.color,
                fontWeight: 600 }}>{item.level}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onViewAll}
        style={{ background: "none", border: "none", color: T.g,
          fontSize: 13, cursor: "pointer", textAlign: "left",
          marginTop: 10, display: "flex", alignItems: "center", gap: 4,
          fontWeight: 500 }}>
        View All Intelligence →
      </button>
    </div>
  );
}

// ─── SYSTEM ARCHITECTURE STATUS ───────────────────────────────────
function ArchStatus() {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: 16, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600,
          fontSize: 20, color: T.text }}>System Architecture Status</div>
        <span style={{ fontSize: 10, color: T.g,
          fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>
          All Layers Operational
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {LAYERS.map((layer, i) => (
          <div key={layer.n} style={{ display: "flex", alignItems: "center",
            gap: 8, padding: "5px 0",
            borderBottom: "1px solid " + T.border + "88",
            animation: "fadeUp .3s ease " + (i * .04) + "s both" }}>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9,
              color: T.muted, minWidth: 48 }}>Layer {layer.n}</span>
            <span style={{ fontSize: 15, color: T.text, flex: 1,
              fontWeight: 500 }}>{layer.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <LiveDot color={layer.color} />
              <span style={{ fontSize: 9, color: layer.color,
                fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>Live</span>
            </div>
            {/* Mini network graph */}
            <svg width="60" height="16" style={{ flexShrink: 0 }}>
              {[0,1,2,3,4].map(j => (
                <circle key={j} cx={j * 13 + 5} cy={8}
                  r={j % 2 === 0 ? 3 : 2}
                  fill={layer.color + (j === 4 ? "ff" : j === 3 ? "cc" : "66")} />
              ))}
              {[0,1,2,3].map(j => (
                <line key={j} x1={j * 13 + 8} y1={8}
                  x2={j * 13 + 18} y2={8}
                  stroke={layer.color + "44"} strokeWidth="1" />
              ))}
            </svg>
          </div>
        ))}
      </div>

      <button style={{ background: "none", border: "none", color: T.g,
        fontSize: 12, cursor: "pointer", textAlign: "left",
        marginTop: 10, display: "flex", alignItems: "center", gap: 4,
        fontWeight: 500 }}>
        View Architecture →
      </button>
    </div>
  );
}

// ─── AGENTS STATUS ────────────────────────────────────────────────
function AgentsStatus() {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600,
          fontSize: 20, color: T.text }}>AI Agents Status</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LiveDot color={T.g} />
          <span style={{ fontSize: 11, color: T.g, fontWeight: 600 }}>
            {AGENTS.length} Agents Running
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <div style={{ display: "grid",
          gridTemplateColumns: "1fr 70px 60px 50px",
          gap: 8, padding: "4px 8px",
          borderBottom: "1px solid " + T.border }}>
          {["Agent","Status","Accuracy","Records"].map(h => (
            <span key={h} style={{ fontSize: 9, color: T.muted,
              fontFamily: "'JetBrains Mono'", letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>

        {AGENTS.map((agent, i) => (
          <div key={i} style={{ display: "grid",
            gridTemplateColumns: "1fr 70px 60px 50px",
            gap: 8, padding: "8px 8px",
            borderBottom: "1px solid " + T.border + "66",
            animation: "fadeUp .3s ease " + (i * .05) + "s both",
            borderRadius: 6, transition: "background .2s",
            background: "transparent" }}
            onMouseEnter={e => e.currentTarget.style.background = T.s1}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%",
                background: agent.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: T.text,
                fontWeight: 500 }}>{agent.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <LiveDot color={T.g} />
              <span style={{ fontSize: 11, color: T.g,
                fontWeight: 600 }}>{agent.status}</span>
            </div>
            <span style={{ fontSize: 12, color: agent.accuracy > 97 ? T.g : T.amber,
              fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>
              {agent.accuracy}%
            </span>
            <span style={{ fontSize: 11, color: T.muted,
              fontFamily: "'JetBrains Mono'" }}>{agent.records}</span>
          </div>
        ))}
      </div>

      <button style={{ background: "none", border: "none", color: T.g,
        fontSize: 12, cursor: "pointer", textAlign: "left",
        marginTop: 10, display: "flex", alignItems: "center", gap: 4,
        fontWeight: 500 }}>
        View All Agents →
      </button>
    </div>
  );
}

// ─── DATA STREAMS ─────────────────────────────────────────────────
function DataStreams() {
  const [active, setActive] = useState("All Sources");
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setPulse(p => (p + 1) % 100), 55);
    return () => clearInterval(iv);
  }, []);

  const sources = [
    { name:"Satellite", short:"SAT", color:T.blue, value:24, records:"588K", icon:"◉", path:"M 92 88 C 190 70, 265 120, 340 178" },
    { name:"Weather", short:"WX", color:T.teal, value:22, records:"538K", icon:"☁", path:"M 92 178 C 185 145, 270 155, 340 190" },
    { name:"Soil Sensors", short:"SOIL", color:T.orange, value:18, records:"441K", icon:"◌", path:"M 92 270 C 190 225, 270 215, 340 202" },
    { name:"Drones", short:"DRONE", color:T.purple, value:12, records:"294K", icon:"◇", path:"M 608 88 C 510 70, 435 120, 360 178" },
    { name:"Farm Records", short:"FARM", color:T.g, value:10, records:"245K", icon:"⌂", path:"M 608 178 C 515 145, 430 155, 360 190" },
    { name:"Market Feeds", short:"MKT", color:T.amber, value:8, records:"196K", icon:"↗", path:"M 608 270 C 510 225, 430 215, 360 202" },
  ];

  const graphData = [
    { date:"13:00", value:42 }, { date:"13:10", value:51 }, { date:"13:20", value:48 },
    { date:"13:30", value:67 }, { date:"13:40", value:61 }, { date:"13:50", value:78 },
    { date:"14:00", value:74 }, { date:"14:10", value:86 }, { date:"14:20", value:82 },
    { date:"14:30", value:94 }, { date:"14:40", value:88 }, { date:"14:50", value:97 },
  ];

  const activeSource = sources.find(s => s.name === active);
  const streamOpacity = (name) => active === "All Sources" || active === name ? 1 : .16;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* 3D DATA STREAM VISUALIZATION */}
      <div style={{ background:T.card, border:"1px solid " + T.border, borderRadius:12, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 18px 10px" }}>
          <div>
            <div style={{ fontFamily:"'Inter'", fontWeight:700, fontSize:17, color:T.text }}>Agricultural Data Streams</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>Multi-source ingestion → AgriMind Intelligence Core</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, background:T.g+"12", border:"1px solid "+T.g+"35", borderRadius:20, padding:"6px 10px" }}>
            <LiveDot color={T.g} /><span style={{ fontSize:10, color:T.g, fontFamily:"'JetBrains Mono'" }}>STREAMING LIVE</span>
          </div>
        </div>

        <div style={{ position:"relative", height:480, background:"radial-gradient(circle at 50% 48%, #12351c 0%, #091109 48%, #060a06 100%)", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:.28, backgroundImage:"linear-gradient("+T.border+" 1px, transparent 1px),linear-gradient(90deg,"+T.border+" 1px,transparent 1px)", backgroundSize:"42px 42px", transform:"perspective(600px) rotateX(58deg) scale(1.35) translateY(95px)" }} />

          <svg viewBox="0 0 700 390" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
            <defs>
              <filter id="dsGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id="coreGlow"><stop offset="0%" stopColor={T.g} stopOpacity=".55"/><stop offset="55%" stopColor={T.g} stopOpacity=".12"/><stop offset="100%" stopColor={T.g} stopOpacity="0"/></radialGradient>
              <linearGradient id="coreMetal" x1="0" x2="1"><stop stopColor="#0b1d0d"/><stop offset=".5" stopColor="#1c4d27"/><stop offset="1" stopColor="#071008"/></linearGradient>
            </defs>

            <ellipse cx="350" cy="195" rx="175" ry="120" fill="url(#coreGlow)" />

            {/* Data highways */}
            {sources.map((src, i) => (
              <g key={src.name} opacity={streamOpacity(src.name)} style={{ transition:"opacity .35s" }}>
                <path d={src.path} fill="none" stroke={src.color+"22"} strokeWidth="10" filter="url(#dsGlow)" />
                <path d={src.path} fill="none" stroke={src.color+"55"} strokeWidth="2" strokeDasharray="5 8" style={{ strokeDashoffset: -pulse*2, transition:"none" }} />
                {[0,1,2,3].map(j => {
                  const pct = ((pulse + j*25 + i*9) % 100) / 100;
                  const left = src.name === "Satellite" || src.name === "Weather" || src.name === "Soil Sensors";
                  // Points move along a visually curved stream; CSS animation supplies the continuous motion.
                  return <circle key={j} r={j===0 ? 4 : 2.5} fill={src.color} filter="url(#dsGlow)" opacity={.9}
                    style={{ animation:`streamParticle${i} ${2.8+i*.25}s linear infinite`, animationDelay:`-${pct*2.8}s` }} />;
                })}
              </g>
            ))}

            {/* Source nodes */}
            {sources.map((src, i) => {
              const left = i < 3;
              const y = [88,178,270][i%3];
              const x = left ? 72 : 628;
              return (
                <g key={src.name} transform={`translate(${x},${y})`} opacity={streamOpacity(src.name)} onClick={() => setActive(active === src.name ? "All Sources" : src.name)} style={{ cursor:"pointer", transition:"opacity .35s" }}>
                  <circle r="25" fill={src.color+"12"} stroke={src.color+"55"} />
                  <circle r="18" fill={T.s1} stroke={src.color} strokeWidth="1.5" />
                  <text textAnchor="middle" y="5" fill={src.color} fontSize="14" fontFamily="Inter" fontWeight="700">{src.icon}</text>
                  <text x={left ? 32 : -32} y="-7" textAnchor={left ? "start" : "end"} fill={T.text} fontSize="10" fontFamily="Inter" fontWeight="600">{src.name}</text>
                  <text x={left ? 32 : -32} y="8" textAnchor={left ? "start" : "end"} fill={T.muted} fontSize="8" fontFamily="JetBrains Mono">{src.records} · {src.value}%</text>
                </g>
              );
            })}

            {/* Rotating 3D core rings */}
            <g transform={`rotate(${pulse*3.6} 350 195)`} opacity=".9">
              <ellipse cx="350" cy="195" rx="91" ry="34" fill="none" stroke={T.g+"55"} strokeWidth="1.5" strokeDasharray="8 6" />
              <ellipse cx="350" cy="195" rx="108" ry="42" fill="none" stroke={T.teal+"35"} strokeWidth="1" strokeDasharray="3 10" transform="rotate(35 350 195)" />
              <ellipse cx="350" cy="195" rx="120" ry="48" fill="none" stroke={T.blue+"28"} strokeWidth="1" transform="rotate(-28 350 195)" />
            </g>

            {/* Central 3D intelligence core */}
            <g transform="translate(350,195)">
              <ellipse cy="46" rx="76" ry="18" fill="#000" opacity=".45" />
              <path d="M-66 -25 L66 -25 L58 35 Q0 57 -58 35 Z" fill="url(#coreMetal)" stroke={T.g+"88"} strokeWidth="1.5" />
              <ellipse cy="-25" rx="66" ry="22" fill="#102a15" stroke={T.g+"aa"} strokeWidth="2" />
              <ellipse cy="-25" rx="49" ry="15" fill="#061007" stroke={T.teal+"66"} />
              <circle cy="-25" r="9" fill={T.g+"44"} stroke={T.g} filter="url(#dsGlow)" />
              <circle cy="-25" r="3" fill={T.white} />
              <text textAnchor="middle" y="3" fill={T.text} fontSize="13" fontFamily="Inter" fontWeight="800">AGRIMIND</text>
              <text textAnchor="middle" y="19" fill={T.g} fontSize="8" fontFamily="JetBrains Mono" letterSpacing="1.5">INTELLIGENCE CORE</text>
              <text textAnchor="middle" y="32" fill={T.mutedL} fontSize="7" fontFamily="JetBrains Mono">INGEST · FUSE · ANALYZE</text>
            </g>

            {/* flowing output */}
            <path d="M350 250 C350 295, 350 320, 350 355" stroke={T.g+"55"} strokeWidth="8" fill="none" filter="url(#dsGlow)" />
            <path d="M350 250 C350 295, 350 320, 350 355" stroke={T.g} strokeWidth="1.5" strokeDasharray="4 8" style={{ strokeDashoffset:-pulse*2 }} />
            <text x="350" y="375" textAnchor="middle" fill={T.mutedL} fontSize="8" fontFamily="JetBrains Mono">UNIFIED AGRICULTURAL SIGNAL</text>
          </svg>

          {/* Moving particles are positioned by CSS paths below */}
          <style>{sources.map((src, i) => {
            const start = i < 3 ? "8% 22%" : "92% 22%";
            const end = "50% 50%";
            return `@keyframes streamParticle${i}{0%{left:${i<3?12:88}%;top:${[23,46,69][i%3]}%;opacity:0;transform:scale(.5)}12%{opacity:1}82%{opacity:1}100%{left:50%;top:50%;opacity:0;transform:scale(1.5)}}`;
          }).join(" ")}</style>
          {sources.map((src,i)=><div key={src.name+"particle"} style={{ position:"absolute", width:8, height:8, borderRadius:"50%", background:src.color, boxShadow:"0 0 12px "+src.color, animation:`streamParticle${i} ${2.8+i*.25}s linear infinite`, animationDelay:`-${i*.45}s`, pointerEvents:"none", opacity:streamOpacity(src.name) }} />)}

          <div style={{ position:"absolute", left:18, bottom:14, display:"flex", gap:6, flexWrap:"wrap" }}>
            {sources.map(src => <button key={src.name} onClick={() => setActive(active === src.name ? "All Sources" : src.name)} style={{ background:active===src.name?src.color+"20":T.s1+"dd", border:"1px solid "+(active===src.name?src.color:T.border), color:active===src.name?src.color:T.mutedL, borderRadius:5, padding:"5px 8px", fontSize:8, fontFamily:"'JetBrains Mono'", cursor:"pointer" }}>{src.short}</button>)}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:12 }}>
          {[
            ["ACTIVE SOURCES", sources.length, T.g],
            ["RECORDS / 24H", "2.45M", T.blue],
            ["INGESTION RATE", "1.84K/s", T.teal],
            ["CORE STATUS", activeSource ? activeSource.name.toUpperCase() : "ALL SOURCES", activeSource?.color || T.g],
            ].map(([l,v,c])=><div key={l} style={{ background:T.s1, borderRadius:8, padding:"9px 11px", border:"1px solid "+T.border }}><div style={{fontSize:8,color:T.muted,fontFamily:"'JetBrains Mono'"}}>{l}</div><div style={{fontSize:15,color:String(c),fontWeight:800,marginTop:3}}>{v}</div></div>)}
        </div>
      </div>

      {/* GRAPH UNDER THE 3D VISUALIZATION */}
      <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:12, padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:16, color:T.text }}>Data Ingestion Flow</div>
            <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>Records entering the AgriMind intelligence core</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}><LiveDot color={T.g}/><span style={{fontSize:9,color:T.g,fontFamily:"'JetBrains Mono'"}}>LIVE / SEC</span></div>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={graphData}>
            <defs><linearGradient id="gStream" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.g} stopOpacity=".3"/><stop offset="95%" stopColor={T.g} stopOpacity="0"/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="date" tick={{fill:T.muted,fontSize:9,fontFamily:"'JetBrains Mono'"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.muted,fontSize:9,fontFamily:"'JetBrains Mono'"}} axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<ChartTip/>}/>
            <Area type="monotone" dataKey="value" name="Records/sec" stroke={T.g} fill="url(#gStream)" strokeWidth={2} dot={false} isAnimationActive animationDuration={900}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Source breakdown */}
      <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:12, padding:16 }}>
        <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:15,color:T.text,marginBottom:12}}>Stream Sources</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {sources.map(src=><button key={src.name} onClick={()=>setActive(active===src.name?"All Sources":src.name)} style={{textAlign:"left",background:active===src.name?src.color+"12":T.s1,border:"1px solid "+(active===src.name?src.color+"55":T.border),borderRadius:8,padding:"10px 12px",cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,color:T.text,fontWeight:600}}>{src.name}</span><span style={{fontSize:10,color:src.color,fontFamily:"'JetBrains Mono'"}}>{src.value}%</span></div>
            <div style={{fontSize:9,color:T.muted,marginTop:4,fontFamily:"'JetBrains Mono'"}}>{src.records} records</div>
            <div style={{height:3,background:T.border,borderRadius:4,marginTop:7,overflow:"hidden"}}><div style={{width:src.value*3.8+"%",height:"100%",background:src.color,borderRadius:4}}/></div>
          </button>)}
        </div>
      </div>
    </div>
  );
}

// ─── PREDICTIONS SUMMARY ──────────────────────────────────────────
function PredictionsSummary() {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600,
          fontSize: 16, color: T.text }}>Predictions Summary</div>
        <select style={{ background: T.s2, border: "1px solid " + T.border,
          color: T.text, borderRadius: 6, padding: "4px 8px",
          fontSize: 11, cursor: "pointer", outline: "none",
          fontFamily: "'JetBrains Mono'" }}>
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 7 Days</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={PREDICTION_DATA}>
          <defs>
            <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={T.g} stopOpacity={0.25} />
              <stop offset="95%" stopColor={T.g} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gCorr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={T.lime} stopOpacity={0.15} />
              <stop offset="95%" stopColor={T.lime} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: T.muted, fontSize: 9, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.muted, fontSize: 9, fontFamily: "'JetBrains Mono'" }} axisLine={false} tickLine={false} width={32} />
          <Tooltip content={<ChartTip />} />
          <Area type="monotone" dataKey="predictions" name="Total" stroke={T.g} fill="url(#gPred)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="correct" name="Correct" stroke={T.lime} fill="url(#gCorr)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 8, marginTop: 12 }}>
        {[
          ["Total Predictions","12,842","▲ 9.3%", T.g    ],
          ["Correct Predictions","10,982","▲ 85.5%",T.lime],
          ["Accuracy Rate","85.5%","▲ 3.6%",   T.amber   ],
          ["Avg. Confidence","78.2%","▲ 2.1%",  T.blue    ],
        ].map(([l, v, d, c]) => (
          <div key={l} style={{ background: T.s1, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: T.muted,
              fontFamily: "'JetBrains Mono'", marginBottom: 4 }}>{l}</div>
            <div style={{ fontFamily: "'Inter'", fontWeight: 700,
              fontSize: 16, color: T.text, marginBottom: 2 }}>{v}</div>
            <div style={{ fontSize: 10, color: c }}>{d}</div>
          </div>
        ))}
      </div>

      <button style={{ background: "none", border: "none", color: T.g,
        fontSize: 12, cursor: "pointer", textAlign: "left",
        marginTop: 10, display: "flex", alignItems: "center", gap: 4,
        fontWeight: 500 }}>
        View Prediction Engine →
      </button>
    </div>
  );
}

// ─── RECENT ALERTS BAR ────────────────────────────────────────────
function RecentAlertsBar() {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: "'Inter'", fontWeight: 600,
            fontSize: 16, color: T.text }}>Recent Alerts</div>
          <span style={{ background: T.red + "22", border: "1px solid " + T.red + "44",
            color: T.red, borderRadius: 20, padding: "2px 8px",
            fontSize: 11, fontWeight: 700 }}>327</span>
        </div>
        <button style={{ background: "none", border: "none", color: T.g,
          fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
          View All Alerts →
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
        {RECENT_ALERTS.map((a, i) => (
          <div key={i} style={{ background: T.s1,
            border: "1px solid " + a.color + "33",
            borderTop: "2px solid " + a.color,
            borderRadius: 10, padding: "12px 14px",
            minWidth: 170, flexShrink: 0,
            animation: "fadeUp .3s ease " + (i * .06) + "s both" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <span style={{ fontFamily: "'Inter'", fontWeight: 600,
                fontSize: 13, color: T.text }}>{a.name}</span>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>{a.county}</div>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center" }}>
              <span style={{ background: a.color + "22",
                border: "1px solid " + a.color + "44",
                color: a.color, borderRadius: 4, padding: "2px 7px",
                fontSize: 9, fontFamily: "'JetBrains Mono'",
                fontWeight: 700 }}>{a.level}</span>
              <span style={{ fontSize: 10, color: T.muted,
                fontFamily: "'JetBrains Mono'" }}>{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MACHINE HEALTH WIDGET ────────────────────────────────────────
function MachineHealth() {
  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid " + T.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" style={{ color: T.g }}>
          <path d="M3 12h4l3-8 4 16 3-8h4" stroke={T.g} strokeWidth="2"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: "'Inter'", fontWeight: 600,
          fontSize: 12, color: T.text }}>Machine Health</span>
      </div>
      <div style={{ fontFamily: "'Inter'", fontWeight: 800,
        fontSize: 26, color: T.g }}>98.6%</div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
        <LiveDot color={T.g} />
        <span style={{ fontSize: 10, color: T.mutedL }}>All systems active</span>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function MachineSidebar({ page, setPage }) {
  return (
    <div style={{ width: 210, background: T.s1, borderRight: "1px solid " + T.border,
      height: "100vh", position: "sticky", top: 0, flexShrink: 0,
      display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Logo */}
      <div style={{ padding: "16px 16px 12px",
        borderBottom: "1px solid " + T.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <img src="/icons/logo.jpeg" alt="AgriMind" style={{
            width: 99, height: 120, borderRadius: 30,
            objectFit: "cover"
          }} />
          <div> 
            <div style={{ fontFamily: "'Inter'", fontWeight: 800,
              fontSize: 20, color: T.text, letterSpacing: "-0.01em" }}>
              Agri<span style={{ color: T.g }}>Mind</span>
            </div>
            <div style={{ fontSize: 12, color: T.muted,
              fontFamily: "'JetBrains Mono'" }}>Agricultural Intelligence Network</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {NAV.map(section => (
          <div key={section.section} style={{ marginBottom: 8 }}>
            <div style={{ padding: "6px 16px 4px",
              fontSize: 10, color: T.muted,
              fontFamily: "'Space Grotesk',sans-serif",
              letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>
              {section.section}
            </div>
            {section.items.map(item => {
              const active = page === item.id;
              return (
                <button key={item.id} onClick={() => setPage(item.id)}
                  style={{ width: "100%", display: "flex",
                    alignItems: "center", gap: 10,
                    padding: "8px 16px", border: "none",
                    background: active ? T.g + "15" : "transparent",
                    borderLeft: active ? "3px solid " + T.g : "3px solid transparent",
                    color: active ? T.g : T.muted,
                    cursor: "pointer", fontSize: 12,
                    fontFamily: "'Inter'", fontWeight: active ? 600 : 400,
                    transition: "all .2s", textAlign: "left" }}>
                  <div style={{ position: "relative", width: 18, height: 18, flexShrink: 0 }}>
                    <img src={item.icon} alt="" style={{ width: 18, height: 18, objectFit: "contain", position: "absolute", top: 0, left: 0, zIndex: 2 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: active ? T.g + "33" : T.muted + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: active ? T.g : T.muted, position: "absolute", top: 0, left: 0, zIndex: 1 }}>{item.label.charAt(0)}</div>
                  </div>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <MachineHealth />
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────
function MachineHeader({ page, onSwitchFarmer }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const label = NAV.flatMap(s => s.items).find(i => i.id === page)?.label || "Machine Overview";
  const timeStr = time.toLocaleTimeString("en-KE", { hour:"2-digit", minute:"2-digit", second:"2-digit" }) + " EAT";

  return (
    <div style={{ height: 56, background: T.s1,
      borderBottom: "1px solid " + T.border,
      padding: "0 20px", display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "sticky",
      top: 0, zIndex: 100 }}>
      <div>
        <div style={{ fontFamily: "'Inter'", fontWeight: 700,
          fontSize: 17, color: T.text }}>AgriMind Machine Dashboard</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
          <LiveDot color={T.g} />
          <span style={{ fontSize: 10, color: T.g,
            fontFamily: "'JetBrains Mono'" }}>System Operational</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Live badge */}
        <div style={{ background: T.g + "18", border: "1px solid " + T.g + "44",
          borderRadius: 20, padding: "5px 12px",
          display: "flex", alignItems: "center", gap: 6 }}>
          <LiveDot color={T.g} />
          <span style={{ fontSize: 11, color: T.g,
            fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>Live Data</span>
        </div>

        {/* Time */}
        <span style={{ fontFamily: "'JetBrains Mono'",
          fontSize: 14, color: T.mutedL }}>{timeStr}</span>

        {/* Icons */}
        <button style={{ background: "none", border: "none",
          color: T.muted, cursor: "pointer", fontSize: 18 }}>🔍</button>

        {/* Notification */}
        <div style={{ position: "relative" }}>
          <button style={{ background: "none", border: "none",
            color: T.muted, cursor: "pointer", fontSize: 18 }}>🔔</button>
          <span style={{ position: "absolute", top: -2, right: -2,
            background: T.red, color: "#fff", borderRadius: "50%",
            width: 16, height: 16, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 9, fontWeight: 700 }}>7</span>
        </div>

        <button style={{ background: "none", border: "none",
          color: T.muted, cursor: "pointer", fontSize: 18 }}>⚙</button>

        {/* Admin profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8,
          background: T.s2, border: "1px solid " + T.border,
          borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
          <Avatar src="/avatars/admin.png" alt="System Admin" size={28} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>System Admin</div>
            <div style={{ fontSize: 10, color: T.muted }}>Super Administrator</div>
          </div>
          <span style={{ color: T.muted, fontSize: 10 }}>▾</span>
        </div>

        {/* Switch to farmer */}
        {onSwitchFarmer && (
          <button onClick={onSwitchFarmer}
            style={{ background: T.gdim, border: "1px solid " + T.g + "44",
              color: T.g, borderRadius: 8, padding: "6px 12px",
              fontFamily: "'JetBrains Mono'", fontSize: 15,
              fontWeight: 600, cursor: "pointer",
              letterSpacing: "0.06em" }}>
            🌿 Farmer View
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DATE RANGE WIDGET ────────────────────────────────────────────
function DateRangeWidget() {
  return (
    <div style={{ background: T.card, border: "1px solid " + T.border,
      borderRadius: 12, padding: "12px 16px",
      display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 10, color: T.muted,
        fontFamily: "'JetBrains Mono'", letterSpacing: "0.08em" }}>Date Range</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: T.text, fontWeight: 500 }}>May 12 – May 18, 2025</span>
        <span style={{ color: T.muted, fontSize: 12 }}>▾</span>
      </div>
      <div style={{ height: 1, background: T.border }} />
      <div style={{ fontSize: 10, color: T.muted,
        fontFamily: "'JetBrains Mono'", letterSpacing: "0.08em" }}>Date Level</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Inter'", fontWeight: 800,
          fontSize: 24, color: T.text }}>8,921</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={{ background: T.s2, border: "1px solid " + T.border,
            color: T.muted, borderRadius: 5, width: 24, height: 24,
            cursor: "pointer", fontSize: 13 }}>▾</button>
          <button style={{ background: T.s2, border: "1px solid " + T.border,
            color: T.muted, borderRadius: 5, width: 24, height: 24,
            cursor: "pointer", fontSize: 13 }}>⊞</button>
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW PAGE ────────────────────────────────────────────────
function OverviewPage({ onViewAll }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Top metric cards */}
      <div style={{ display: "grid",
        gridTemplateColumns: "repeat(4,1fr) 160px", gap: 10 }}>
        <MetricCard icon="🏘" label="Active Farms"       value="4,532"  delta="12.4% vs last 7 days" color={T.g}      delay={0}    />
        <MetricCard icon="🗄" label="Data Points (24h)"  value="2.45M"  delta="18.7% vs last 24h"    color={T.blue}   delay={0.05} />
        <MetricCard icon="🧠" label="Predictions Made"   value="12,842" delta="9.3% vs last 24h"     color={T.purple} delay={0.1}  />
        <MetricCard icon="⚠️" label="High Risk Alerts"   value="327"    delta="15.2% vs last 7 days"  color={T.red}    delay={0.15} />
        <DateRangeWidget />
      </div>

      {/* Middle row — Heat Map + Intel Feed + Arch Status */}
      <div style={{ display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr", gap: 12, minHeight: 420 }}>
        <RiskHeatMap />
        <IntelFeed onViewAll={onViewAll} />
        <ArchStatus />
      </div>

      {/* Bottom row — Agents + Streams + Predictions */}
      <div style={{ display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <AgentsStatus />
        <DataStreams />
        <PredictionsSummary />
      </div>

      {/* Recent Alerts */}
      <RecentAlertsBar />
    </div>
  );
}

// ─── INTEL FEED PAGE (full) ───────────────────────────────────────
function IntelFeedPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: "'Inter'", fontWeight: 700,
        fontSize: 20, color: T.text }}>Intelligence Feed</div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: 16 }}>
          <IntelFeed onViewAll={() => {}} />
        </div>
        <RecentAlertsBar />
      </div>
    </div>
  );
}

// ─── GENERIC LAYER PAGE ───────────────────────────────────────────
function LayerPage({ title, desc, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontFamily: "'Inter'", fontWeight: 700,
          fontSize: 20, color: T.text }}>{title}</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{desc}</div>
      </div>
      {children}
    </div>
  );
}
function KnowledgeGraphPanel() {
  const NODE_CONFIG = {
    county:  [T.blue,   "/knowledge%20icons/county.jfif", 52],
    farm:    [T.g,      "/knowledge%20icons/kamau%20farm.jfif", 44],
    crop:    [T.lime,   "/knowledge%20icons/tomatoes.jfif", 40],
    disease: [T.red,    "/knowledge%20icons/late%20blight.jfif", 38],
    weather: [T.teal,   "/knowledge%20icons/weather%20node.jfif", 42],
    market:  [T.amber,  "/knowledge%20icons/market%20node.jfif", 38],
    soil:    [T.orange, "/knowledge%20icons/soil%20node.jfif", 36],
  } as const;
  const [selNode, setSelNode] = useState(null);
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetch("/api/knowledge")
      .then(r => r.json())
      .then(d => { setGraph(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
 
  // Fallback mock layout if API not yet wired
  const nodes = graph?.nodes?.length ? graph.nodes.map((n, i) => ({
    id: n.id, type: n.type, label: n.label, data: n.data,
    x: 340 + 180 * Math.cos((i / graph.nodes.length) *10* Math.PI),
    y: 230 + 180 * Math.sin((i / graph.nodes.length) * 10 * Math.PI),
    img: n.img || NODE_CONFIG[n.type]?.[1] || "/knowledge%20icons/county.jfif",
  })) : [
    { id:"county_nakuru", type:"county", label:"Nakuru County", img:"/knowledge%20icons/county.jfif", x:340, y:230 },
    { id:"weather_live",  type:"weather",label:"Live Weather",  img:"/knowledge%20icons/weather%20node.jfif", x:340, y:60  },
    { id:"farm_1", type:"farm", label:"Kamau Farm",     img:"/knowledge%20icons/kamau%20farm.jfif", x:170, y:160 },
    { id:"farm_2", type:"farm", label:"Wanjiku Shamba",  img:"/knowledge%20icons/wanjiku%20farm.jfif", x:170, y:300 },
    { id:"farm_3", type:"farm", label:"Ochieng Farm",    img:"/knowledge%20icons/ochieng%20farm.jfif", x:510, y:160 },
    { id:"farm_4", type:"farm", label:"Njeri Holdings",  img:"/knowledge%20icons/njeri%20farm.jfif", x:510, y:300 },
    { id:"crop_1", type:"crop", label:"Tomatoes", img:"/knowledge%20icons/tomatoes.jfif", x:110, y:80  },
    { id:"crop_2", type:"crop", label:"Maize",    img:"/knowledge%20icons/maize.jfif", x:110, y:380 },
    { id:"dis_1",  type:"disease", label:"Late Blight",   img:"/knowledge%20icons/late%20blight.jfif", x:30,  y:30  },
    { id:"dis_2",  type:"disease", label:"Bacterial Wilt",img:"/knowledge%20icons/bacterial%20wilt.jfif", x:600, y:380 },
  ];
 
  const edges = graph?.edges?.length ? graph.edges.map(e => ({ s: e.source, t: e.target, l: e.label })) : [
    { s:"farm_1", t:"county_nakuru", l:"located in" },
    { s:"farm_2", t:"county_nakuru", l:"located in" },
    { s:"farm_3", t:"county_nakuru", l:"located in" },
    { s:"farm_4", t:"county_nakuru", l:"located in" },
    { s:"county_nakuru", t:"weather_live", l:"conditions" },
    { s:"farm_1", t:"crop_1", l:"grows" },
    { s:"farm_2", t:"crop_2", l:"grows" },
    { s:"crop_1", t:"dis_1", l:"shows" },
    { s:"farm_4", t:"dis_2", l:"shows" },
  ];
 
  if (loading) {
    return (
      <div style={{ background: T.card, border: "1px solid " + T.border,
        borderRadius: 12, padding: 60, textAlign: "center" }}>
        <Spinner size={28} />
        <div style={{ marginTop: 12, color: T.muted, fontSize: 12 }}>
          Loading knowledge graph from Supabase...
        </div>
      </div>
    );
  }
 
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 12 }}>
      <div style={{ background: T.card, border: "1px solid " + T.border,
        borderRadius: 12, overflow: "hidden", position: "relative" }}>
        <svg viewBox="0 0 680 460" style={{ width: "100%", height: 500 }}>
          {edges.map((e, i) => {
            const s = nodes.find(n => n.id === e.s), t = nodes.find(n => n.id === e.t);
            if (!s || !t) return null;
            const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
            return (
              <g key={i}>
                <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={T.border} strokeWidth="1" />
                <text x={mx} y={my - 4} textAnchor="middle" fill={T.muted}
                  fontSize="7" fontFamily="JetBrains Mono">{e.l}</text>
              </g>
            );
          })}
          {nodes.map(node => {
            const [col, defaultIco, sz] = NODE_CONFIG[node.type] || [T.muted, "/knowledge%20icons/county.jfif", 36];
            const ico = node.img || defaultIco;
            const sel = selNode?.id === node.id;
            const r = sz / 2;
            return (
              <g key={node.id} transform={"translate(" + node.x + "," + node.y + ")"}
                onClick={() => setSelNode(node)} style={{ cursor: "pointer" }}>
                {sel && <circle r={r + 10} fill="none" stroke={col} strokeWidth="1"
                  opacity="0.4" style={{ animation: "ping 1.5s ease infinite" }} />}
                <circle r={r} fill={sel ? col + "22" : T.card}
                  stroke={col + (sel ? "cc" : "66")} strokeWidth="1.5" />
                <image href={ico} x={-r * 0.6} y={-r * 0.6}
                  width={r * 1.2} height={r * 1.2}
                  style={{ userSelect: "none" }} clipPath="inset(0% round 50%)" />
                <text y={r + 12} textAnchor="middle" fill={sel ? col : T.mutedL}
                  fontSize="8" fontFamily="JetBrains Mono" style={{ userSelect: "none" }}>
                  {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", bottom: 10, left: 10,
          background: T.card + "ee", border: "1px solid " + T.border,
          borderRadius: 8, padding: "8px 12px" }}>
          {Object.entries(NODE_CONFIG).map(([type, [col, ico]]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <img src={ico} alt={type} style={{ width: 16, height: 16, objectFit: "contain" }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: col }} />
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: T.mutedL }}>{type}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border,
          borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono'",
            letterSpacing: "0.08em", marginBottom: 8 }}>GRAPH STATS</div>
          {[["NODES", nodes.length], ["EDGES", edges.length],
            ["SOURCE", graph?.nodes?.length ? "LIVE SUPABASE" : "MOCK"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between",
              padding: "5px 0", borderBottom: "1px solid " + T.border }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: T.muted }}>{l}</span>
              <span style={{ fontFamily: "'Inter'", fontSize: 12, color: T.g, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        {selNode && (
          <div style={{ background: T.card, border: "1px solid " + (NODE_CONFIG[selNode.type]?.[0] || T.g) + "55",
            borderRadius: 12, padding: 14, animation: "fadeIn .3s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8,
              color: NODE_CONFIG[selNode.type]?.[0] || T.g, letterSpacing: "0.1em",
              marginBottom: 8 }}>{selNode.type.toUpperCase()}</div>
            <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 13,
              color: T.text }}>{selNode.label}</div>
          </div>
        )}
      </div>
    </div>
  );
}
 
function GNNVisualizationPanel() {
  const [pulse, setPulse] = useState(0);
  const [selLayer, setSelLayer] = useState(null);
  const [patterns, setPatterns] = useState([
    { id:1, label:"Humidity > 78% for 3 days → Fungal risk",        confidence:91, strength:"strong",   color:T.red    },
    { id:2, label:"Highland elevation + cool_dry → Late Blight",    confidence:87, strength:"strong",   color:T.red    },
    { id:3, label:"Rainfall spike + flowering stage → Pest surge",  confidence:74, strength:"moderate", color:T.amber  },
    { id:4, label:"Market price rise + harvest window → Sell now",  confidence:82, strength:"strong",   color:T.g     },
    { id:5, label:"Soil moisture <40% + fruiting → Yield drop risk",confidence:69, strength:"moderate", color:T.orange},
  ]);
 
  // Animate the "learning pulse" traveling through the network
  useEffect(() => {
    const iv = setInterval(() => setPulse(p => (p + 1) % 100), 60);
    return () => clearInterval(iv);
  }, []);
 
  // GNN layer architecture (3 hidden layers, matches diagram concept)
  const GNN_LAYERS = [
    { id:"input",  label:"Input Layer",      nodes:8,  desc:"Raw entity embeddings from Knowledge Graph", color:T.blue   },
    { id:"gcn1",   label:"GCN Layer 1",      nodes:12, desc:"Local neighborhood aggregation",              color:T.purple },
    { id:"gat",    label:"Attention Layer",  nodes:10, desc:"Differentially weighted relationships",       color:T.teal   },
    { id:"gcn2",   label:"GCN Layer 2",      nodes:8,  desc:"Higher-order pattern composition",            color:T.lime   },
    { id:"output", label:"Output Layer",     nodes:6,  desc:"Learned risk + opportunity embeddings",       color:T.g      },
  ];
 
  // Generate node positions for the network diagram
  const W = 680, H = 320;
  const layerX = GNN_LAYERS.map((_, i) => 60 + i * ((W - 120) / (GNN_LAYERS.length - 1)));
 
  function nodeY(count, idx) {
    const spacing = (H - 60) / (count + 1);
    return 30 + spacing * (idx + 1);
  }
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
 
      {/* Top metric strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {[
          { l:"GRAPH EMBEDDINGS", v:"2,048-dim", c:T.purple },
          { l:"TRAINING EPOCHS",  v:"1,240",     c:T.blue   },
          { l:"PATTERN CONFIDENCE",v:"84.6%",    c:T.g      },
          { l:"LINK PREDICTION ACC",v:"91.2%",   c:T.lime   },
        ].map((m, i) => (
          <div key={m.l} style={{ background: T.card, border: "1px solid " + T.border,
            borderRadius: 12, padding: "14px 16px",
            animation: "fadeUp .4s ease " + (i * .05) + "s both" }}>
            <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono'",
              letterSpacing: "0.06em", marginBottom: 6 }}>{m.l}</div>
            <div style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 22, color: m.c }}>{m.v}</div>
          </div>
        ))}
      </div>
 
      {/* Network architecture visualization */}
      <div style={{ background: T.card, border: "1px solid " + T.border,
        borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 16, color: T.text }}>
              Graph Neural Network Architecture
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>
              Learning patterns across the agricultural knowledge graph
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LiveDot color={T.purple} />
            <span style={{ fontSize: 10, color: T.purple, fontFamily: "'JetBrains Mono'" }}>
              Training Active
            </span>
          </div>
        </div>
 
        <div style={{ background: T.s1, borderRadius: 10, overflow: "hidden" }}>
          <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: 300 }}>
            {/* Connections between layers */}
            {GNN_LAYERS.slice(0, -1).map((layer, li) => {
              const nextLayer = GNN_LAYERS[li + 1];
              return Array.from({ length: layer.nodes }).map((_, ni) =>
                Array.from({ length: nextLayer.nodes }).map((_, nj) => {
                  const x1 = layerX[li], y1 = nodeY(layer.nodes, ni);
                  const x2 = layerX[li + 1], y2 = nodeY(nextLayer.nodes, nj);
                  // Highlight a traveling subset based on pulse position
                  const isActive = (ni + nj + li * 3) % 17 === Math.floor(pulse / 6) % 17;
                  return (
                    <line key={li + "_" + ni + "_" + nj}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isActive ? layer.color + "aa" : T.border}
                      strokeWidth={isActive ? 1.4 : 0.4}
                      opacity={isActive ? 1 : 0.5} />
                  );
                })
              );
            })}
 
            {/* Nodes */}
            {GNN_LAYERS.map((layer, li) => (
              <g key={layer.id}
                onClick={() => setSelLayer(layer)}
                style={{ cursor: "pointer" }}>
                {Array.from({ length: layer.nodes }).map((_, ni) => {
                  const x = layerX[li], y = nodeY(layer.nodes, ni);
                  const sel = selLayer?.id === layer.id;
                  return (
                    <circle key={ni} cx={x} cy={y}
                      r={sel ? 7 : 5}
                      fill={layer.color + (sel ? "ff" : "cc")}
                      stroke={layer.color}
                      strokeWidth={sel ? 2 : 1}
                      style={{ transition: "all .2s",
                        filter: sel ? "drop-shadow(0 0 6px " + layer.color + ")" : "none" }} />
                  );
                })}
                <text x={layerX[li]} y={H - 8} textAnchor="middle"
                  fill={selLayer?.id === layer.id ? layer.color : T.mutedL}
                  fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
                  {layer.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
 
        {selLayer && (
          <div style={{ marginTop: 10, background: T.s1,
            border: "1px solid " + selLayer.color + "44",
            borderLeft: "3px solid " + selLayer.color,
            borderRadius: 8, padding: "10px 14px", animation: "fadeIn .3s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9,
              color: selLayer.color, letterSpacing: "0.08em", marginBottom: 4 }}>
              {selLayer.label.toUpperCase()} · {selLayer.nodes} NEURONS
            </div>
            <div style={{ fontSize: 12, color: T.text }}>{selLayer.desc}</div>
          </div>
        )}
 
        <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
          {GNN_LAYERS.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span style={{ fontSize: 9, color: T.muted, fontFamily: "'JetBrains Mono'" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* Discovered patterns */}
      <div style={{ background: T.card, border: "1px solid " + T.border,
        borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 16, color: T.text }}>
            Patterns Learned From the Graph
          </div>
          <span style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono'" }}>
            Updated continuously
          </span>
        </div>
 
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {patterns.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12,
              background: T.s1, border: "1px solid " + T.border,
              borderLeft: "3px solid " + p.color,
              borderRadius: 8, padding: "10px 14px",
              animation: "fadeUp .4s ease " + (i * .06) + "s both" }}>
              <div style={{ fontSize: 16 }}>
                {p.strength === "strong" ? "🔗" : "🧩"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{p.label}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 14, color: p.color }}>
                  {p.confidence}%
                </span>
                <span style={{ fontSize: 9, color: T.muted, fontFamily: "'JetBrains Mono'",
                  textTransform: "uppercase" }}>{p.strength}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Explanation note */}
      <div style={{ background: T.gdim, border: "1px solid " + T.g + "33",
        borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: T.mutedL, lineHeight: 1.6 }}>
          The Graph Neural Network learns directly from the relationships in the Knowledge Graph —
          farm-to-county, crop-to-disease, weather-to-outcome — discovering patterns that individual
          AI agents cannot see on their own. These learned patterns feed forward into the Multi-Agent
          Reasoning System, sharpening every prediction with structural context from the entire network.
        </div>
      </div>
    </div>
  );
}
// ─── MAIN MACHINE DASHBOARD ───────────────────────────────────────
export default function MachineDashboard({ onSwitchFarmer }) {
  const [page, setPage] = useState("overview");

  const pages = {
    overview:   <OverviewPage onViewAll={() => setPage("intel")} />,
    intel:      <IntelFeedPage />,
    monitor:    <LayerPage title="System Monitor" desc="Real-time system health and performance"><AgentsStatus /><ArchStatus /></LayerPage>,
    knowledge: <LayerPage title="Knowledge Graph" desc="Relationship intelligence across all farm entities"><KnowledgeGraphPanel /></LayerPage>,
    gnn:       <LayerPage title="Graph Neural Network" desc="Learning patterns across the agricultural knowledge graph"><GNNVisualizationPanel /></LayerPage>,
    agents:     <LayerPage title="AI Agents" desc="All specialist agents running in parallel"><AgentsStatus /></LayerPage>,
    reasoning:  <LayerPage title="Reasoning Engine" desc="Core fusion engine outputs"><PredictionsSummary /></LayerPage>,
    prediction: <LayerPage title="Prediction Engine" desc="7-day disease and yield forecasts"><PredictionsSummary /></LayerPage>,
    decision:   <LayerPage title="Decision Engine" desc="Recommended actions across all farms"><RecentAlertsBar /></LayerPage>,
    streams:    <LayerPage title="Data Streams" desc="Live ingestion from all 11 sources"><DataStreams /></LayerPage>,
    riskmap:    <LayerPage title="Risk Map" desc="County-level disease and pest risk heatmap"><div style={{height:500}}><RiskHeatMap /></div></LayerPage>,
    analytics:  <LayerPage title="Analytics" desc="Platform-wide agricultural intelligence metrics"><PredictionsSummary /><DataStreams /></LayerPage>,
    reports:    <LayerPage title="Reports" desc="Exportable farm intelligence reports"><RecentAlertsBar /></LayerPage>,
    users:    (
  <LayerPage title="Users & Roles" desc="Platform user management">
    <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 16, color: T.text }}>Platform Users</div>
        <button style={{ background: T.g, color: "#000", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>+ Invite User</button>
      </div>
      {[
        { name:"System Admin", role:"Super Administrator", email:"admin@agrimind.ai", status:"Active" },
        { name:"John Kamau", role:"Farmer", email:"john.kamau@agrimind.ai", status:"Active" },
        { name:"Grace Njeri", role:"Extension Officer", email:"grace.njeri@agrimind.ai", status:"Active" },
        { name:"Peter Ochieng", role:"Cooperative Manager", email:"peter.ochieng@agrimind.ai", status:"Pending" },
      ].map((u, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + T.border }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar src="/avatars/user-default.png" alt={u.name} size={32} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{u.name}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{u.email}</div>
            </div>
          </div>
          <span style={{ fontSize: 11, color: T.mutedL }}>{u.role}</span>
          <span style={{ background: u.status === "Active" ? T.g + "22" : T.amber + "22", color: u.status === "Active" ? T.g : T.amber, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{u.status}</span>
        </div>
      ))}
    </div>
  </LayerPage>
),
    integrations:<LayerPage title="Integrations" desc="Connected APIs and data sources"><DataStreams /></LayerPage>,
    settings: (
  <LayerPage title="Settings" desc="Platform configuration">
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { label:"OpenWeather API Key", value:"●●●●●●●●●●a07a809dac", editable:true },
        { label:"Supabase Project URL", value:"https://your-project.supabase.co", editable:true },
        { label:"Notification Channels", value:"SMS, WhatsApp, Push, Email", editable:false },
        { label:"Data Retention Period", value:"5 years", editable:false },
        { label:"Auto-refresh Interval", value:"60 seconds", editable:true },
      ].map((s, i) => (
        <div key={i} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono'" }}>{s.value}</div>
          </div>
          {s.editable && <button style={{ background: "none", border: "1px solid " + T.border, color: T.g, borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Edit</button>}
        </div>
      ))}
    </div>
  </LayerPage>
),
    audit:      <LayerPage title="Audit Logs" desc="Complete activity log"><IntelFeedPage /></LayerPage>,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh",
      background: T.bg, color: T.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{STYLES}</style>
      <MachineSidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <MachineHeader page={page} onSwitchFarmer={onSwitchFarmer} />
        <main style={{ flex: 1, overflowY: "auto", padding: 18 }}>
          {pages[page] || pages.overview}
        </main>
      </div>
    </div>
  );
}
