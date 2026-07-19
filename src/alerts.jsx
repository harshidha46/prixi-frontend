import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Alerts History (detail page)
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const SECTORS = ["Carding", "Spinning", "Weaving", "Finishing"];

const MACHINES_BY_SECTOR = {
  Carding: ["Carding Line 1", "Carding Line 2"],
  Spinning: ["Spinning Frame 1", "Spinning Frame 2", "Spinning Frame 3", "Spinning Frame 4"],
  Weaving: ["Weaving Loom 3", "Weaving Loom 5", "Weaving Loom 7", "Weaving Loom 8"],
  Finishing: ["Finishing Line 1", "Finishing Line 2"],
};

const ALL_MACHINES = Object.values(MACHINES_BY_SECTOR).flat();

const ALERTS = [
  {
    id: "AL-1042",
    machine: "Finishing Line 2",
    sector: "Finishing",
    timestamp: "2026-07-16T09:12:00",
    status: "unresolved",
    severity: "critical",
    cause: "Motor overheating — thermal cutoff triggered on the primary drive motor.",
    resolvedBy: null,
    resolutionTime: null,
    notes: "Maintenance team dispatched; awaiting replacement bearing.",
  },
  {
    id: "AL-1041",
    machine: "Weaving Loom 7",
    sector: "Weaving",
    timestamp: "2026-07-16T09:00:00",
    status: "unresolved",
    severity: "warning",
    cause: "Thread tension drift beyond acceptable range on warp beam 3.",
    resolvedBy: null,
    resolutionTime: null,
    notes: "Flagged for recalibration during next changeover.",
  },
  {
    id: "AL-1040",
    machine: "Spinning Frame 3",
    sector: "Spinning",
    timestamp: "2026-07-16T08:48:00",
    status: "unresolved",
    severity: "warning",
    cause: "Spindle break rate rising above baseline (12/hr vs 6/hr average).",
    resolvedBy: null,
    resolutionTime: null,
    notes: "Under observation; no fault isolated yet.",
  },
  {
    id: "AL-1039",
    machine: "Carding Line 1",
    sector: "Carding",
    timestamp: "2026-07-16T08:10:00",
    status: "fixed",
    severity: "info",
    cause: "Scheduled preventive maintenance completed.",
    resolvedBy: "R. Kumar",
    resolutionTime: "45 min",
    notes: "Filters cleaned, belt tension checked, all readings nominal.",
  },
  {
    id: "AL-1038",
    machine: "Weaving Loom 5",
    sector: "Weaving",
    timestamp: "2026-07-15T22:34:00",
    status: "fixed",
    severity: "critical",
    cause: "Downtime — loom stopped unexpectedly, fault code E-204 (shuttle jam).",
    resolvedBy: "S. Velan",
    resolutionTime: "1h 20m",
    notes: "Cleared jam, replaced worn shuttle guide, ran test cycle before restart.",
  },
  {
    id: "AL-1037",
    machine: "Finishing Line 1",
    sector: "Finishing",
    timestamp: "2026-07-15T19:05:00",
    status: "fixed",
    severity: "warning",
    cause: "Energy spike — 18% above rolling average draw during dye cycle.",
    resolvedBy: "P. Anand",
    resolutionTime: "30 min",
    notes: "Traced to a stuck heating element relay; relay replaced.",
  },
  {
    id: "AL-1036",
    machine: "Spinning Frame 1",
    sector: "Spinning",
    timestamp: "2026-07-15T16:42:00",
    status: "fixed",
    severity: "info",
    cause: "Routine bobbin change alert.",
    resolvedBy: "Auto-cleared",
    resolutionTime: "5 min",
    notes: "No operator action required.",
  },
  {
    id: "AL-1035",
    machine: "Carding Line 2",
    sector: "Carding",
    timestamp: "2026-07-15T14:18:00",
    status: "fixed",
    severity: "warning",
    cause: "Waste percentage exceeded 3% threshold for 20 continuous minutes.",
    resolvedBy: "R. Kumar",
    resolutionTime: "55 min",
    notes: "Adjusted licker-in speed; waste returned to 1.9%.",
  },
  {
    id: "AL-1034",
    machine: "Weaving Loom 8",
    sector: "Weaving",
    timestamp: "2026-07-15T11:27:00",
    status: "fixed",
    severity: "critical",
    cause: "Downtime — emergency stop triggered by safety guard sensor.",
    resolvedBy: "S. Velan",
    resolutionTime: "2h 05m",
    notes: "Sensor bracket had loosened; re-mounted and re-calibrated guard interlock.",
  },
  {
    id: "AL-1033",
    machine: "Spinning Frame 4",
    sector: "Spinning",
    timestamp: "2026-07-14T20:52:00",
    status: "fixed",
    severity: "warning",
    cause: "Overheating — spindle bearing temperature above 68°C.",
    resolvedBy: "P. Anand",
    resolutionTime: "1h 10m",
    notes: "Re-lubricated bearing, temperature stabilized at 54°C.",
  },
  {
    id: "AL-1032",
    machine: "Finishing Line 2",
    sector: "Finishing",
    timestamp: "2026-07-14T17:36:00",
    status: "fixed",
    severity: "critical",
    cause: "Downtime — conveyor motor tripped on overcurrent.",
    resolvedBy: "R. Kumar",
    resolutionTime: "1h 48m",
    notes: "Replaced worn drive belt causing motor strain.",
  },
  {
    id: "AL-1031",
    machine: "Carding Line 1",
    sector: "Carding",
    timestamp: "2026-07-14T13:04:00",
    status: "fixed",
    severity: "info",
    cause: "Shift changeover calibration check.",
    resolvedBy: "Auto-cleared",
    resolutionTime: "8 min",
    notes: "All parameters within spec.",
  },
  {
    id: "AL-1030",
    machine: "Weaving Loom 3",
    sector: "Weaving",
    timestamp: "2026-07-13T22:14:00",
    status: "fixed",
    severity: "warning",
    cause: "Energy spike during peak-load overlap with Finishing Line 1.",
    resolvedBy: "P. Anand",
    resolutionTime: "22 min",
    notes: "Staggered start times to avoid future load overlap.",
  },
  {
    id: "AL-1029",
    machine: "Spinning Frame 2",
    sector: "Spinning",
    timestamp: "2026-07-13T15:47:00",
    status: "fixed",
    severity: "critical",
    cause: "Downtime — spindle motor failure on frame section B.",
    resolvedBy: "S. Velan",
    resolutionTime: "3h 15m",
    notes: "Motor replaced; root cause traced to bearing seizure from moisture ingress.",
  },
  {
    id: "AL-1028",
    machine: "Finishing Line 1",
    sector: "Finishing",
    timestamp: "2026-07-12T10:22:00",
    status: "fixed",
    severity: "info",
    cause: "Routine dye-vat temperature check.",
    resolvedBy: "Auto-cleared",
    resolutionTime: "4 min",
    notes: "No action needed.",
  },
];

const SEVERITIES = ["critical", "warning", "info"];
const STATUSES = ["fixed", "unresolved"];

function severityTone(sev) {
  return { critical: "bad", warning: "warn", info: "neutral" }[sev];
}
function statusTone(status) {
  return status === "fixed" ? "good" : "bad";
}
function toneColor(tone) {
  return {
    good: "var(--status-good)",
    warn: "var(--status-warn)",
    bad: "var(--status-bad)",
    neutral: "var(--accent-sage-dark)",
  }[tone];
}
function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCSV(rows) {
  return rows.map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
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

export default function AlertsHistory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [machine, setMachine] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  const machineOptions = sector === "all" ? ALL_MACHINES : MACHINES_BY_SECTOR[sector] || [];

  const filtered = useMemo(() => {
    return ALERTS.filter((a) => {
      if (sector !== "all" && a.sector !== sector) return false;
      if (machine !== "all" && a.machine !== machine) return false;
      if (severity !== "all" && a.severity !== severity) return false;
      if (status !== "all" && a.status !== status) return false;
      if (dateFrom && new Date(a.timestamp) < new Date(dateFrom)) return false;
      if (dateTo && new Date(a.timestamp) > new Date(dateTo + "T23:59:59")) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${a.machine} ${a.sector} ${a.cause} ${a.id}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [search, sector, machine, severity, status, dateFrom, dateTo]);

  const counts = useMemo(
    () => ({
      total: filtered.length,
      unresolved: filtered.filter((a) => a.status === "unresolved").length,
      critical: filtered.filter((a) => a.severity === "critical").length,
    }),
    [filtered]
  );

  function resetFilters() {
    setSearch("");
    setSector("all");
    setMachine("all");
    setSeverity("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
  }

  function handleExportCSV() {
    const rows = [
      ["Alert ID", "Machine", "Sector", "Timestamp", "Status", "Severity", "Cause", "Resolved By", "Resolution Time", "Notes"],
      ...filtered.map((a) => [
        a.id,
        a.machine,
        a.sector,
        formatTimestamp(a.timestamp),
        a.status,
        a.severity,
        a.cause,
        a.resolvedBy || "",
        a.resolutionTime || "",
        a.notes || "",
      ]),
    ];
    downloadBlob(toCSV(rows), "alerts-history-export.csv", "text/csv;charset=utf-8;");
    setExportOpen(false);
  }
  function handleExportPDF() {
    setExportOpen(false);
    window.print();
  }

  return (
    <div className="ah-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .ah-root {
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
        .ah-root * { box-sizing: border-box; }

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

        .ah-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .ah-back:hover { background: var(--sage); color: #fff; }
        .ah-back svg { width: 14px; height: 14px; }

        .ah-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        .ah-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; margin: 0 0 6px 0; }
        .ah-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }

        .ah-export-wrap { position: relative; }
        .ah-export-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--forest); border: none; border-radius: 10px;
          color: var(--oat); font-size: 12.5px; font-weight: 600;
          padding: 9px 16px; cursor: pointer;
        }
        .ah-export-btn svg { width: 14px; height: 14px; }
        .ah-export-menu {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 5;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          box-shadow: 0 6px 18px rgba(31,61,46,0.14);
          display: flex; flex-direction: column; min-width: 150px; overflow: hidden;
        }
        .ah-export-menu button {
          background: transparent; border: none; text-align: left; padding: 10px 14px;
          font-size: 12.5px; color: var(--ink-primary); cursor: pointer;
        }
        .ah-export-menu button:hover { background: var(--bg-panel-raised); }

        /* summary chips */
        .ah-summary-row { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
        .ah-chip { padding: 10px 16px; display: flex; flex-direction: column; gap: 2px; min-width: 120px; }
        .ah-chip-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); }
        .ah-chip-value { font-family: 'JetBrains Mono', monospace; font-size: 19px; font-weight: 600; }

        /* filters panel */
        .ah-filters { padding: 16px 18px; margin-bottom: 18px; display: flex; flex-direction: column; gap: 12px; }
        .ah-filters-top { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .ah-search {
          flex: 1 1 220px; display: flex; align-items: center; gap: 8px;
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px; padding: 8px 12px;
        }
        .ah-search svg { width: 15px; height: 15px; color: var(--ink-muted); flex-shrink: 0; }
        .ah-search input { border: none; outline: none; background: transparent; font-size: 12.5px; width: 100%; color: var(--ink-primary); }
        .ah-filters-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; align-items: end; }
        .ah-field { display: flex; flex-direction: column; gap: 4px; }
        .ah-field label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .ah-field select, .ah-field input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 7px 9px; font-size: 12px; color: var(--ink-primary); outline: none;
        }
        .ah-field select:focus, .ah-field input:focus { border-color: var(--gold); }
        .ah-reset-btn {
          background: transparent; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 7px 12px; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); cursor: pointer;
          white-space: nowrap;
        }
        .ah-reset-btn:hover { color: var(--forest); border-color: var(--forest); }

        /* alert list */
        .ah-list { display: flex; flex-direction: column; gap: 10px; }
        .ah-alert-card { padding: 0; overflow: hidden; }
        .ah-alert-row {
          display: grid;
          grid-template-columns: 3px 1.4fr 1fr 1.2fr 0.9fr 0.9fr 28px;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          cursor: pointer;
        }
        .ah-sev-bar { align-self: stretch; border-radius: 4px; }
        .ah-machine { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ah-machine-name { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 600; }
        .ah-machine-id { font-size: 10.5px; color: var(--ink-muted); font-family: 'JetBrains Mono', monospace; }
        .ah-sector-text { font-size: 12px; color: var(--ink-primary); }
        .ah-timestamp { font-size: 11.5px; font-family: 'JetBrains Mono', monospace; color: var(--ink-muted); }
        .ah-badge {
          font-size: 10.5px; padding: 3px 9px; border-radius: 999px; font-weight: 700;
          letter-spacing: 0.02em; width: fit-content; text-transform: capitalize;
        }
        .ah-chevron { width: 16px; height: 16px; color: var(--ink-muted); transition: transform 0.15s; justify-self: end; }
        .ah-chevron.open { transform: rotate(180deg); }

        .ah-alert-detail {
          padding: 4px 16px 16px 16px;
          border-top: 1px solid var(--border-soft);
          margin: 0 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .ah-detail-block { padding-top: 12px; }
        .ah-detail-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); margin-bottom: 4px; }
        .ah-detail-text { font-size: 12.5px; line-height: 1.5; color: var(--ink-primary); }
        .ah-detail-meta { font-size: 11.5px; color: var(--ink-muted); margin-top: 4px; }

        .ah-empty { padding: 40px 20px; text-align: center; color: var(--ink-muted); font-size: 13px; }

        @media (max-width: 1000px) {
          .ah-filters-grid { grid-template-columns: repeat(2, 1fr); }
          .ah-alert-row { grid-template-columns: 3px 1fr 1fr 24px; }
          .ah-sector-text, .ah-timestamp { display: none; }
          .ah-alert-detail { grid-template-columns: 1fr; }
        }
      `}</style>

      <button className="ah-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="ah-header-row">
        <div>
          <h1 className="ah-title">Alerts History</h1>
          <p className="ah-subtitle">Past machine alerts across every sector, with cause and resolution detail</p>
        </div>
        <div className="ah-export-wrap">
          <button className="ah-export-btn" onClick={() => setExportOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
            </svg>
            Export
          </button>
          {exportOpen && (
            <div className="ah-export-menu">
              <button onClick={handleExportCSV}>Export as CSV</button>
              <button onClick={handleExportPDF}>Export as PDF</button>
            </div>
          )}
        </div>
      </div>

      <div className="ah-summary-row">
        <div className="panel ah-chip">
          <span className="ah-chip-label">Showing</span>
          <span className="ah-chip-value">{counts.total}</span>
        </div>
        <div className="panel ah-chip">
          <span className="ah-chip-label">Unresolved</span>
          <span className="ah-chip-value" style={{ color: "var(--status-bad)" }}>{counts.unresolved}</span>
        </div>
        <div className="panel ah-chip">
          <span className="ah-chip-label">Critical</span>
          <span className="ah-chip-value" style={{ color: "var(--status-bad)" }}>{counts.critical}</span>
        </div>
      </div>

      <div className="panel ah-filters">
        <div className="ah-filters-top">
          <div className="ah-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              placeholder="Search by machine, sector, cause, or alert ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="ah-reset-btn" onClick={resetFilters}>Reset filters</button>
        </div>
        <div className="ah-filters-grid">
          <div className="ah-field">
            <label>Sector</label>
            <select
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setMachine("all");
              }}
            >
              <option value="all">All sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="ah-field">
            <label>Machine</label>
            <select value={machine} onChange={(e) => setMachine(e.target.value)}>
              <option value="all">All machines</option>
              {machineOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="ah-field">
            <label>Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="all">All severities</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>
              ))}
            </select>
          </div>
          <div className="ah-field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === "fixed" ? "Fixed" : "Unresolved"}</option>
              ))}
            </select>
          </div>
          <div className="ah-field">
            <label>Date range</label>
            <div style={{ display: "flex", gap: 4 }}>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="ah-list">
        {filtered.length === 0 && (
          <div className="panel ah-empty">No alerts match the current filters.</div>
        )}
        {filtered.map((a) => {
          const open = expandedId === a.id;
          const sevTone = severityTone(a.severity);
          const stTone = statusTone(a.status);
          return (
            <div className="panel ah-alert-card" key={a.id}>
              <div className="ah-alert-row" onClick={() => setExpandedId(open ? null : a.id)}>
                <div className="ah-sev-bar" style={{ background: toneColor(sevTone) }} />
                <div className="ah-machine">
                  <span className="ah-machine-name">{a.machine}</span>
                  <span className="ah-machine-id">{a.id}</span>
                </div>
                <span className="ah-sector-text">{a.sector}</span>
                <span className="ah-timestamp">{formatTimestamp(a.timestamp)}</span>
                <span
                  className="ah-badge"
                  style={{ color: toneColor(sevTone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(sevTone)}55` }}
                >
                  {a.severity}
                </span>
                <span
                  className="ah-badge"
                  style={{ color: toneColor(stTone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(stTone)}55` }}
                >
                  {a.status === "fixed" ? "Fixed" : "Unresolved"}
                </span>
                <svg className={`ah-chevron ${open ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {open && (
                <div className="ah-alert-detail">
                  <div className="ah-detail-block">
                    <div className="ah-detail-label">Cause</div>
                    <div className="ah-detail-text">{a.cause}</div>
                  </div>
                  <div className="ah-detail-block">
                    <div className="ah-detail-label">Resolution Notes</div>
                    {a.status === "fixed" ? (
                      <>
                        <div className="ah-detail-text">{a.notes}</div>
                        <div className="ah-detail-meta">Resolved by {a.resolvedBy} · Time to resolve: {a.resolutionTime}</div>
                      </>
                    ) : (
                      <div className="ah-detail-text" style={{ color: "var(--status-bad)" }}>
                        Not yet resolved. {a.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
