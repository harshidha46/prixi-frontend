import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Production Rate (detail page)
 * Same palette/typography system as the main dashboard & Factory Health page:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const TARGET_RATE = 3500; // units/day target
const CURRENT_RATE = 3240; // units/day actual (matches dashboard's headline stat)

const CURRENT_SHIFT = {
  shift: "Shift B — 14:00 to 22:00",
  rate: "3,240 m/day",
  ratePerHour: "402 m/hr",
  efficiency: "92.6%",
  updated: "4 min ago",
};

const SECTORS = [
  { key: "carding", title: "Carding", target: 1200, actual: 1180, unit: "kg/hr" },
  { key: "spinning", title: "Spinning", target: 680, actual: 640, unit: "spindles/hr" },
  { key: "weaving", title: "Weaving", target: 3400, actual: 3210, unit: "m/day" },
  { key: "finishing", title: "Finishing", target: 1250, actual: 980, unit: "m/day" },
];

const MONTHLY = [
  { label: "Nov", actual: 88400, target: 96000 },
  { label: "Dec", actual: 91200, target: 96000 },
  { label: "Jan", actual: 87600, target: 98000 },
  { label: "Feb", actual: 93100, target: 98000 },
  { label: "Mar", actual: 96800, target: 100000 },
  { label: "Apr", actual: 94200, target: 100000 },
  { label: "May", actual: 99500, target: 102000 },
  { label: "Jun", actual: 97300, target: 102000 },
  { label: "Jul", actual: 101400, target: 104000 },
  { label: "Aug", actual: 98800, target: 104000 },
  { label: "Sep", actual: 103600, target: 106000 },
  { label: "Oct", actual: 105200, target: 106000 },
];

const ALERT_THRESHOLD_PCT = 85; // % of target below which an alert fires

const DATE_RANGES = [
  { key: "7d", label: "Last 7 Days" },
  { key: "1m", label: "Last Month" },
  { key: "custom", label: "Custom" },
];

function toneColor(tone) {
  return { good: "var(--status-good)", warn: "var(--status-warn)", bad: "var(--status-bad)" }[tone];
}

function pctOf(actual, target) {
  return Math.round((actual / target) * 100);
}

function toneForPct(pct) {
  if (pct >= 100) return "good";
  if (pct >= ALERT_THRESHOLD_PCT) return "warn";
  return "bad";
}

function ProgressRing({ pct = 92, size = 200 }) {
  const clamped = Math.max(0, Math.min(pct, 130));
  const r = 82;
  const C = 2 * Math.PI * r;
  const filled = Math.min(clamped, 100) / 100;
  const overshoot = Math.max(clamped - 100, 0) / 100;
  const color = clamped >= 100 ? "var(--status-good)" : clamped >= ALERT_THRESHOLD_PCT ? "var(--status-warn)" : "var(--status-bad)";
  const vb = 200;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`}>
      <g transform={`translate(${vb / 2},${vb / 2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="rgba(31,61,46,0.09)" strokeWidth="14" />
        <circle
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${r * C === 0 ? 0 : C} ${C}`}
          strokeDashoffset={C * (1 - filled)}
        />
        {overshoot > 0 && (
          <circle
            r={r - 20}
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(r - 20) * 2 * Math.PI} ${(r - 20) * 2 * Math.PI}`}
            strokeDashoffset={(r - 20) * 2 * Math.PI * (1 - Math.min(overshoot, 1))}
          />
        )}
      </g>
      <text x={vb / 2} y={vb / 2 - 4} textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="600" fontSize="46" fill="var(--ink-primary)">
        {pct}%
      </text>
      <text x={vb / 2} y={vb / 2 + 22} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="var(--ink-muted)">
        of daily target
      </text>
    </svg>
  );
}

function MonthlyBarChart({ data }) {
  const w = 720, h = 220, pad = 28, gap = 14;
  const max = Math.max(...data.map((d) => Math.max(d.actual, d.target))) * 1.08;
  const groupW = (w - pad * 2) / data.length;
  const barW = (groupW - gap) / 2;

  const yFor = (v) => h - pad - (v / max) * (h - pad * 2 - 16);

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={pad}
          x2={w - pad}
          y1={pad + (i * (h - pad * 2 - 16)) / 3}
          y2={pad + (i * (h - pad * 2 - 16)) / 3}
          stroke="rgba(31,61,46,0.08)"
          strokeWidth="1"
        />
      ))}
      {data.map((d, i) => {
        const gx = pad + i * groupW;
        const pct = pctOf(d.actual, d.target);
        const tone = toneForPct(pct);
        return (
          <g key={d.label}>
            <rect
              x={gx + 2}
              y={yFor(d.target)}
              width={barW}
              height={h - pad - yFor(d.target)}
              fill="var(--bg-panel-raised)"
              stroke="var(--border-soft)"
              rx="2"
            />
            <rect
              x={gx + barW + gap - 2}
              y={yFor(d.actual)}
              width={barW}
              height={h - pad - yFor(d.actual)}
              fill={toneColor(tone)}
              rx="2"
            />
            <text x={gx + groupW / 2 - gap / 2} y={h - 6} textAnchor="middle" fontSize="10.5" fontFamily="Inter, sans-serif" fill="var(--ink-muted)">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function toCSV(rows) {
  return rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ProductionRate() {
  const navigate = useNavigate();
  const [range, setRange] = useState("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const overallPct = pctOf(CURRENT_RATE, TARGET_RATE);

  const sectorAlerts = useMemo(
    () =>
      SECTORS.filter((s) => pctOf(s.actual, s.target) < ALERT_THRESHOLD_PCT).map((s) => ({
        ...s,
        pct: pctOf(s.actual, s.target),
      })),
    []
  );
  const monthlyAlerts = useMemo(
    () =>
      MONTHLY.filter((m) => pctOf(m.actual, m.target) < ALERT_THRESHOLD_PCT).map((m) => ({
        ...m,
        pct: pctOf(m.actual, m.target),
      })),
    []
  );
  const hasAlerts = sectorAlerts.length > 0 || monthlyAlerts.length > 0;

  function handleExportCSV() {
    const rows = [
      ["Section", "Name", "Target", "Actual", "Unit", "% of Target"],
      ...SECTORS.map((s) => ["Sector", s.title, s.target, s.actual, s.unit, `${pctOf(s.actual, s.target)}%`]),
      ...MONTHLY.map((m) => ["Monthly", m.label, m.target, m.actual, "units", `${pctOf(m.actual, m.target)}%`]),
    ];
    downloadBlob(toCSV(rows), "production-rate-export.csv", "text/csv;charset=utf-8;");
    setExportOpen(false);
  }

  function handleExportPDF() {
    setExportOpen(false);
    window.print();
  }

  return (
    <div className="pr-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .pr-root {
          --forest: #1f3d2e;
          --sage: #a6b79a;
          --mist: #d7e0d3;
          --oat: #ede7d8;
          --gold: #c9a86a;

          --bg-deep: var(--oat);
          --bg-panel: #f8f5ea;
          --bg-panel-raised: var(--mist);
          --border-soft: rgba(31,61,46,0.14);
          --ink-primary: var(--forest);
          --ink-muted: #6f7d64;
          --accent-forest: var(--forest);
          --accent-sage-dark: #7c8f70;
          --accent-gold: var(--gold);
          --status-good: #3f6b4a;
          --status-warn: #b9863f;
          --status-bad: #a85a42;

          font-family: 'Inter', sans-serif;
          background: radial-gradient(ellipse at top left, #f6f2e5 0%, var(--bg-deep) 60%);
          color: var(--ink-primary);
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
        }
        .pr-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel);
          border: 1px solid var(--border-soft);
          border-radius: 14px;
          position: relative;
          box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: "";
          position: absolute;
          top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        /* header row */
        .pr-topline { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
        .pr-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-panel);
          border: 1px solid var(--border-soft);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--forest);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .pr-back:hover { background: var(--sage); color: #fff; }
        .pr-back svg { width: 14px; height: 14px; }

        .pr-header { margin-bottom: 20px; }
        .pr-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; margin: 0 0 6px 0; }
        .pr-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }

        /* controls row: date filter + export */
        .pr-controls { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
        .pr-range-group {
          display: flex; gap: 2px; padding: 2px;
          background: var(--bg-panel-raised);
          border-radius: 8px; border: 1px solid var(--border-soft);
          width: fit-content;
        }
        .pr-range-group button {
          border: none; background: transparent; color: var(--ink-muted);
          font-size: 11.5px; font-weight: 600; padding: 6px 12px; border-radius: 6px; cursor: pointer;
          white-space: nowrap;
        }
        .pr-range-group button.active { background: var(--forest); color: var(--oat); }
        .pr-custom-dates { display: flex; align-items: center; gap: 6px; margin-left: 8px; }
        .pr-custom-dates input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 6px 8px; font-size: 11.5px; color: var(--ink-primary); outline: none;
        }
        .pr-custom-dates input:focus { border-color: var(--gold); }

        .pr-export-wrap { position: relative; }
        .pr-export-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--forest); border: none; border-radius: 10px;
          color: var(--oat); font-size: 12.5px; font-weight: 600;
          padding: 9px 16px; cursor: pointer;
        }
        .pr-export-btn svg { width: 14px; height: 14px; }
        .pr-export-menu {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 5;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          box-shadow: 0 6px 18px rgba(31,61,46,0.14);
          display: flex; flex-direction: column; min-width: 150px; overflow: hidden;
        }
        .pr-export-menu button {
          background: transparent; border: none; text-align: left; padding: 10px 14px;
          font-size: 12.5px; color: var(--ink-primary); cursor: pointer;
        }
        .pr-export-menu button:hover { background: var(--bg-panel-raised); }

        /* alert banner */
        .pr-alert-banner {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(168,90,66,0.08); border: 1px solid rgba(168,90,66,0.35);
          border-radius: 12px; padding: 12px 16px; margin-bottom: 20px;
        }
        .pr-alert-banner svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--status-bad); margin-top: 1px; }
        .pr-alert-title { font-size: 12.5px; font-weight: 700; color: var(--status-bad); margin-bottom: 4px; }
        .pr-alert-list { display: flex; flex-direction: column; gap: 2px; }
        .pr-alert-item { font-size: 11.5px; color: var(--ink-primary); }
        .pr-alert-item .mono { font-family: 'JetBrains Mono', monospace; }

        /* section title */
        .pr-section-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted);
          margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;
        }
        .pr-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border-soft); }

        /* row 1: total + current */
        .pr-top-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .pr-total-panel { display: flex; align-items: center; gap: 24px; padding: 26px 30px; flex-wrap: wrap; }
        .pr-total-meta { display: flex; flex-direction: column; gap: 8px; min-width: 180px; }
        .pr-total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-muted); }
        .pr-total-headline { font-family: 'Fraunces', serif; font-size: 34px; font-weight: 600; line-height: 1.05; }
        .pr-total-sub { font-size: 12px; color: var(--ink-muted); font-family: 'JetBrains Mono', monospace; }

        .pr-current-panel { padding: 26px 30px; display: flex; flex-direction: column; gap: 14px; }
        .pr-current-head { display: flex; justify-content: space-between; align-items: baseline; }
        .pr-current-shift { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; }
        .pr-current-updated { font-size: 10.5px; color: var(--ink-muted); }
        .pr-current-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pr-current-metric { display: flex; flex-direction: column; gap: 3px; }
        .pr-current-metric-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .pr-current-metric-value { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; }

        /* sector cards */
        .pr-sector-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .pr-sector-card {
          padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;
          border-left: 4px solid var(--gold);
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
        }
        .pr-sector-top { display: flex; justify-content: space-between; align-items: center; }
        .pr-sector-title { font-family: 'Fraunces', serif; font-size: 14.5px; font-weight: 600; }
        .pr-sector-pill { font-size: 10.5px; padding: 3px 9px; border-radius: 999px; font-weight: 700; letter-spacing: 0.02em; }
        .pr-sector-rows { display: flex; flex-direction: column; gap: 4px; }
        .pr-sector-row { display: flex; justify-content: space-between; font-size: 11.5px; }
        .pr-sector-row span:first-child { color: var(--ink-muted); }
        .pr-sector-row span:last-child { font-family: 'JetBrains Mono', monospace; }
        .pr-sector-bar-track { height: 6px; border-radius: 4px; background: var(--bg-panel-raised); overflow: hidden; }
        .pr-sector-bar-fill { height: 100%; border-radius: 4px; }

        /* monthly breakdown */
        .pr-monthly-panel { padding: 20px 24px; margin-bottom: 8px; }
        .pr-monthly-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .pr-monthly-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; }
        .pr-legend { display: flex; gap: 14px; font-size: 11px; color: var(--ink-muted); }
        .pr-legend-item { display: flex; align-items: center; gap: 5px; }
        .pr-legend-swatch { width: 10px; height: 10px; border-radius: 2px; }

        @media (max-width: 980px) {
          .pr-sector-grid { grid-template-columns: 1fr 1fr; }
          .pr-top-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .pr-sector-grid { grid-template-columns: 1fr; }
          .pr-current-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pr-topline">
        <button className="pr-back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="pr-header">
        <h1 className="pr-title">Production Rate</h1>
        <p className="pr-subtitle">Overall output, sector performance, and historical trends</p>
      </div>

      <div className="pr-controls">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="pr-range-group">
            {DATE_RANGES.map((r) => (
              <button key={r.key} className={range === r.key ? "active" : ""} onClick={() => setRange(r.key)}>
                {r.label}
              </button>
            ))}
          </div>
          {range === "custom" && (
            <div className="pr-custom-dates">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              <span style={{ color: "var(--ink-muted)", fontSize: 11.5 }}>to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </div>
          )}
        </div>

        <div className="pr-export-wrap">
          <button className="pr-export-btn" onClick={() => setExportOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
            </svg>
            Export
          </button>
          {exportOpen && (
            <div className="pr-export-menu">
              <button onClick={handleExportCSV}>Export as CSV</button>
              <button onClick={handleExportPDF}>Export as PDF</button>
            </div>
          )}
        </div>
      </div>

      {hasAlerts && (
        <div className="pr-alert-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          <div>
            <div className="pr-alert-title">Production below threshold ({ALERT_THRESHOLD_PCT}% of target)</div>
            <div className="pr-alert-list">
              {sectorAlerts.map((s) => (
                <div className="pr-alert-item" key={s.key}>
                  {s.title} sector is running at <span className="mono">{s.pct}%</span> of target
                </div>
              ))}
              {monthlyAlerts.map((m) => (
                <div className="pr-alert-item" key={m.label}>
                  {m.label} finished at <span className="mono">{m.pct}%</span> of monthly target
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pr-top-row">
        <div className="panel pr-total-panel">
          <ProgressRing pct={overallPct} size={180} />
          <div className="pr-total-meta">
            <span className="pr-total-label">Total Production Rate</span>
            <span className="pr-total-headline">{CURRENT_RATE.toLocaleString()} <span style={{ fontSize: 15, fontWeight: 500 }}>units/day</span></span>
            <span className="pr-total-sub">Target: {TARGET_RATE.toLocaleString()} units/day</span>
          </div>
        </div>

        <div className="panel pr-current-panel">
          <div className="pr-current-head">
            <span className="pr-current-shift">{CURRENT_SHIFT.shift}</span>
            <span className="pr-current-updated">Updated {CURRENT_SHIFT.updated}</span>
          </div>
          <div className="pr-current-grid">
            <div className="pr-current-metric">
              <span className="pr-current-metric-label">Rate (Day)</span>
              <span className="pr-current-metric-value">{CURRENT_SHIFT.rate}</span>
            </div>
            <div className="pr-current-metric">
              <span className="pr-current-metric-label">Rate (Hour)</span>
              <span className="pr-current-metric-value">{CURRENT_SHIFT.ratePerHour}</span>
            </div>
            <div className="pr-current-metric">
              <span className="pr-current-metric-label">Efficiency</span>
              <span className="pr-current-metric-value">{CURRENT_SHIFT.efficiency}</span>
            </div>
            <div className="pr-current-metric">
              <span className="pr-current-metric-label">vs Plan</span>
              <span className="pr-current-metric-value" style={{ color: "var(--status-good)" }}>▲ 2.1%</span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="pr-section-title">Sector Indicators — Target vs Actual</h4>
      <div className="pr-sector-grid">
        {SECTORS.map((s) => {
          const pct = pctOf(s.actual, s.target);
          const tone = toneForPct(pct);
          return (
            <div className="panel pr-sector-card" key={s.key}>
              <div className="pr-sector-top">
                <span className="pr-sector-title">{s.title}</span>
                <span
                  className="pr-sector-pill"
                  style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
                >
                  {pct}%
                </span>
              </div>
              <div className="pr-sector-rows">
                <div className="pr-sector-row"><span>Target</span><span>{s.target.toLocaleString()} {s.unit}</span></div>
                <div className="pr-sector-row"><span>Actual</span><span>{s.actual.toLocaleString()} {s.unit}</span></div>
              </div>
              <div className="pr-sector-bar-track">
                <div className="pr-sector-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: toneColor(tone) }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel pr-monthly-panel">
        <div className="pr-monthly-head">
          <span className="pr-monthly-title">Monthly Breakdown — Actual vs Target</span>
          <div className="pr-legend">
            <span className="pr-legend-item"><span className="pr-legend-swatch" style={{ background: "var(--bg-panel-raised)", border: "1px solid var(--border-soft)" }} />Target</span>
            <span className="pr-legend-item"><span className="pr-legend-swatch" style={{ background: "var(--status-good)" }} />Actual (on/above target)</span>
            <span className="pr-legend-item"><span className="pr-legend-swatch" style={{ background: "var(--status-bad)" }} />Actual (below threshold)</span>
          </div>
        </div>
        <MonthlyBarChart data={MONTHLY} />
      </div>
    </div>
  );
}
