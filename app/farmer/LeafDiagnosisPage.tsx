"use client";

import { useEffect, useRef, useState } from "react";

type Diagnosis = {
  name?: string;
  scientific_name?: string;
  crop?: string;
  condition?: string;
  is_healthy?: boolean;
  confidence?: number;
  severity?: string;
  severity_percentage?: number;
  score?: number;
  summary?: string;
  treatment?: string[];
  prevention?: string[];
  symptoms?: string[];
  heatmap?: string | null;
  demo?: boolean;
};

type ServiceHealth = {
  status?: string;
  model_loaded?: boolean;
  gemini_active?: boolean;
  error?: string;
};

const palette = {
  text: "#1a2e1a",
  muted: "#6b7c6b",
  green: "#2e7d32",
  greenBg: "#e8f5e9",
  border: "#e0ede0",
  background: "#f0f7f0",
  red: "#b42318",
};

export default function LeafDiagnosisPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const previewUrl = useRef<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leaf-diagnosis", { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Service status unavailable.");
        return data as ServiceHealth;
      })
      .then(data => { if (!cancelled) setHealth(data); })
      .catch(() => { if (!cancelled) setHealth({ status: "unavailable" }); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  function selectFile(selected: File | undefined) {
    setError("");
    setDiagnosis(null);
    if (!selected) return;
    const clearSelection = () => {
      setFile(null);
      setPreview(null);
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = null;
    };
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      clearSelection();
      setError("Choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      clearSelection();
      setError("Image must be 10 MB or smaller.");
      return;
    }
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(selected);
    setPreview(previewUrl.current);
    setFile(selected);
  }

  async function analyzeLeaf() {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setDiagnosis(null);
    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch("/api/leaf-diagnosis", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.detail || "Leaf analysis failed.");
      setDiagnosis(data as Diagnosis);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Leaf analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const confidence = diagnosis?.confidence == null
    ? null
    : Math.round(diagnosis.confidence <= 1 ? diagnosis.confidence * 100 : diagnosis.confidence);
  const heatmap = diagnosis?.heatmap;
  const heatmapSrc = heatmap && (heatmap.startsWith("data:") || heatmap.startsWith("http"))
    ? heatmap
    : heatmap ? "data:image/png;base64," + heatmap : null;
  const modelStatus = health?.status === "unavailable"
    ? "Service unavailable"
    : health?.model_loaded
      ? "Diagnosis model ready"
      : health?.gemini_active
        ? "AI service online · model warming up"
        : "Checking service";

  return (
    <section style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ color: palette.text, fontSize: 25, fontWeight: 750 }}>Leaf Diagnosis</h1>
          <p style={{ color: palette.muted, fontSize: 14, marginTop: 5 }}>Upload a crop photo for disease identification and treatment guidance.</p>
        </div>
        <div role="status" style={{ color: palette.green, background: palette.greenBg, borderRadius: 999, padding: "7px 11px", fontSize: 12, fontWeight: 650 }}>
          <span aria-hidden="true">● </span>{modelStatus}
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 16, alignItems: "start" }}>
        <div style={{ background: "#fff", border: `1px solid ${palette.border}`, borderRadius: 12, padding: 20 }}>
          <h2 style={{ color: palette.text, fontSize: 17, marginBottom: 14 }}>Choose a leaf photo</h2>
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={event => selectFile(event.target.files?.[0])} />
          <input ref={cameraInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={event => selectFile(event.target.files?.[0])} />
          <button type="button" onClick={() => fileInput.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} style={{ width: "100%", minHeight: 210, display: "grid", placeItems: "center", background: palette.background, border: `1px dashed ${palette.border}`, borderRadius: 9, color: palette.muted, cursor: "pointer", overflow: "hidden" }}>
            {preview ? <img src={preview} alt="Selected leaf preview" style={{ width: "100%", height: 250, objectFit: "contain" }} /> : <span style={{ padding: 18, textAlign: "center", lineHeight: 1.7 }}>＋<br />Choose or drop a leaf photo<br /><small>JPG, PNG, or WEBP · up to 10 MB</small></span>}
          </button>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button type="button" onClick={() => fileInput.current?.click()} style={{ flex: 1, minWidth: 140, border: `1px solid ${palette.border}`, borderRadius: 8, padding: "10px 12px", background: "#fff", color: palette.text, cursor: "pointer", fontWeight: 600 }}>Choose photo</button>
            <button type="button" onClick={() => cameraInput.current?.click()} style={{ flex: 1, minWidth: 140, border: `1px solid ${palette.border}`, borderRadius: 8, padding: "10px 12px", background: "#fff", color: palette.text, cursor: "pointer", fontWeight: 600 }}>Use camera</button>
          </div>
          <button type="button" onClick={analyzeLeaf} disabled={!file || loading} style={{ width: "100%", marginTop: 10, border: 0, borderRadius: 8, padding: "12px 14px", background: !file || loading ? "#9aaa9a" : palette.green, color: "#fff", cursor: !file || loading ? "not-allowed" : "pointer", fontWeight: 700 }}>
            {loading ? "Analyzing leaf..." : "Analyze leaf"}
          </button>
          {error && <p role="alert" style={{ color: palette.red, fontSize: 13, marginTop: 12 }}>{error}</p>}
          <p style={{ color: palette.muted, fontSize: 12, lineHeight: 1.55, marginTop: 12 }}>Use one sharply focused leaf in daylight, with the affected area visible. The photo is sent to AgroVision AI for analysis.</p>
        </div>

        <div aria-live="polite" style={{ background: "#fff", border: `1px solid ${palette.border}`, borderRadius: 12, padding: 20, minHeight: 300 }}>
          <h2 style={{ color: palette.text, fontSize: 17, marginBottom: 14 }}>Diagnosis result</h2>
          {!diagnosis && !loading && <p style={{ color: palette.muted, fontSize: 14, lineHeight: 1.6 }}>Your diagnosis, heatmap, and treatment guidance will appear here.</p>}
          {loading && <p style={{ color: palette.green, fontSize: 14 }}>Sending the image to the diagnosis service…</p>}
          {diagnosis && <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ color: palette.muted, fontSize: 12, marginBottom: 4 }}>{diagnosis.crop || "Plant"}{diagnosis.condition ? ` · ${diagnosis.condition}` : ""}</p>
              <h3 style={{ color: palette.text, fontSize: 21 }}>{diagnosis.is_healthy ? "Healthy leaf" : diagnosis.name || "Identified plant condition"}</h3>
              {diagnosis.scientific_name && <p style={{ color: palette.muted, fontSize: 12, marginTop: 3 }}>{diagnosis.scientific_name}</p>}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {confidence !== null && <span style={{ background: palette.greenBg, borderRadius: 6, padding: "6px 9px", color: palette.green, fontSize: 12, fontWeight: 650 }}>Confidence {confidence}%</span>}
              {diagnosis.severity && <span style={{ background: palette.background, borderRadius: 6, padding: "6px 9px", color: palette.text, fontSize: 12, fontWeight: 650 }}>Severity {diagnosis.severity}{diagnosis.severity_percentage != null ? ` · ${diagnosis.severity_percentage}%` : ""}</span>}
              {diagnosis.demo && <span style={{ background: "#fffbeb", borderRadius: 6, padding: "6px 9px", color: "#92400e", fontSize: 12, fontWeight: 650 }}>Demo result</span>}
            </div>
            {diagnosis.summary && <p style={{ color: palette.text, fontSize: 14, lineHeight: 1.6 }}>{diagnosis.summary}</p>}
            {heatmapSrc && <div><h4 style={{ color: palette.text, fontSize: 13, marginBottom: 6 }}>Affected area</h4><img src={heatmapSrc} alt="AI heatmap highlighting the affected leaf area" style={{ display: "block", width: "100%", maxHeight: 280, objectFit: "contain", background: palette.background, borderRadius: 8 }} /></div>}
            {diagnosis.symptoms?.length ? <ResultList title="Observed symptoms" items={diagnosis.symptoms} /> : null}
            {diagnosis.treatment?.length ? <ResultList title="Treatment" items={diagnosis.treatment} /> : null}
            {diagnosis.prevention?.length ? <ResultList title="Prevention" items={diagnosis.prevention} /> : null}
          </div>}
        </div>
      </div>
    </section>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return <div><h4 style={{ color: palette.text, fontSize: 13, marginBottom: 5 }}>{title}</h4><ul style={{ color: palette.muted, fontSize: 13, lineHeight: 1.65, paddingLeft: 19 }}>{items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}</ul></div>;
}