import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * PRIXI — Sales Personnel Details (detail page)
 * Reached via Inventory.jsx → "AI Restock Action" → /sales-personnel?person=<id>
 *
 * BACKEND CONNECTION (integration points — currently mocked below):
 * - Sales DB → SALESPEOPLE should be sourced from GET /api/sales-personnel,
 *   with recentActions joined against the restock history in the Inventory DB
 *   (restock events filtered by responsible salesperson).
 * - Notification Service → performance metrics (avgResponseTime, successfulDeliveries)
 *   would typically be aggregated server-side from restock action timestamps.
 */

const SALESPEOPLE = [
  {
    id: "p1",
    name: "R. Kumar",
    email: "r.kumar@prixi-mills.com",
    phone: "+91 98765 43210",
    sector: "A",
    recentActions: [
      { product: "Raw Cotton Bales", qty: 400, date: "2026-07-10" },
      { product: "Sizing Chemicals", qty: 60, date: "2026-07-13" },
      { product: "Viscose Staple", qty: 150, date: "2026-07-16", pending: true },
    ],
    metrics: { avgResponseTime: "38 min", successfulDeliveries: 24 },
  },
  {
    id: "p2",
    name: "S. Velan",
    email: "s.velan@prixi-mills.com",
    phone: "+91 98450 11223",
    sector: "B",
    recentActions: [
      { product: "Cotton Yarn 30s", qty: 200, date: "2026-07-11" },
      { product: "Blended Yarn", qty: 150, date: "2026-07-08" },
      { product: "Cone Bobbins", qty: 500, date: "2026-07-16", pending: true },
    ],
    metrics: { avgResponseTime: "51 min", successfulDeliveries: 19 },
  },
  {
    id: "p3",
    name: "P. Anand",
    email: "p.anand@prixi-mills.com",
    phone: "+91 90031 77654",
    sector: "D",
    recentActions: [
      { product: "Poly Bags", qty: 3000, date: "2026-07-09" },
      { product: "Labels", qty: 1000, date: "2026-07-15" },
      { product: "Finished Fabric Rolls", qty: 200, date: "2026-07-07" },
      { product: "Cartons", qty: 300, date: "2026-07-16", pending: true },
    ],
    metrics: { avgResponseTime: "29 min", successfulDeliveries: 31 },
  },
  {
    id: "p4",
    name: "M. Iyer",
    email: "m.iyer@prixi-mills.com",
    phone: "+91 88123 99012",
    sector: "C",
    recentActions: [
      { product: "Reactive Dye Black", qty: 80, date: "2026-07-12" },
      { product: "Caustic Soda", qty: 200, date: "2026-07-06" },
      { product: "Softener", qty: 40, date: "2026-07-14" },
      { product: "Indigo Dye", qty: 80, date: "2026-07-16", pending: true },
    ],
    metrics: { avgResponseTime: "44 min", successfulDeliveries: 22 },
  },
];

const SECTORS = ["A", "B", "C", "D"];

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
function formatDate(ds) {
  const d = new Date(ds + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function SalesPersonnel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("person");

  const [sectorFilter, setSectorFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const filteredPeople = useMemo(() => {
    return SALESPEOPLE.filter((p) => sectorFilter === "all" || p.sector === sectorFilter).map((p) => ({
      ...p,
      recentActions: p.recentActions.filter((a) => {
        if (dateFrom && a.date < dateFrom) return false;
        if (dateTo && a.date > dateTo) return false;
        return true;
      }),
    }));
  }, [sectorFilter, dateFrom, dateTo]);

  function resetFilters() {
    setSectorFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  function handleExportCSV() {
    const rows = [
      ["Salesperson", "Email", "Phone", "Sector", "Avg Response Time", "Successful Deliveries", "Recent Product", "Qty", "Date"],
      ...filteredPeople.flatMap((p) =>
        p.recentActions.length
          ? p.recentActions.map((a) => [p.name, p.email, p.phone, p.sector, p.metrics.avgResponseTime, p.metrics.successfulDeliveries, a.product, a.qty, formatDate(a.date)])
          : [[p.name, p.email, p.phone, p.sector, p.metrics.avgResponseTime, p.metrics.successfulDeliveries, "", "", ""]]
      ),
    ];
    downloadBlob(toCSV(rows), "sales-personnel-export.csv", "text/csv;charset=utf-8;");
    setExportOpen(false);
  }
  function handleExportPDF() {
    setExportOpen(false);
    window.print();
  }

  return (
    <div className="sp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .sp-root {
          --forest: #1f3d2e; --sage: #a6b79a; --mist: #d7e0d3; --oat: #ede7d8; --gold: #c9a86a;
          --bg-deep: var(--oat); --bg-panel: #f8f5ea; --bg-panel-raised: var(--mist);
          --border-soft: rgba(31,61,46,0.14); --ink-primary: var(--forest); --ink-muted: #6f7d64;
          --accent-forest: var(--forest); --accent-sage-dark: #7c8f70; --accent-gold: var(--gold);
          --status-good: #3f6b4a; --status-warn: #b9863f; --status-bad: #a85a42;

          font-family: 'Inter', sans-serif;
          background: radial-gradient(ellipse at top left, #f6f2e5 0%, var(--bg-deep) 60%);
          color: var(--ink-primary);
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
        }
        .sp-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .sp-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .sp-back:hover { background: var(--sage); color: #fff; }
        .sp-back svg { width: 14px; height: 14px; }

        .sp-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        .sp-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; margin: 0 0 6px 0; }
        .sp-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }

        .sp-export-wrap { position: relative; }
        .sp-export-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--forest); border: none; border-radius: 10px;
          color: var(--oat); font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .sp-export-btn svg { width: 14px; height: 14px; }
        .sp-export-menu {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 5;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          box-shadow: 0 6px 18px rgba(31,61,46,0.14);
          display: flex; flex-direction: column; min-width: 150px; overflow: hidden;
        }
        .sp-export-menu button { background: transparent; border: none; text-align: left; padding: 10px 14px; font-size: 12.5px; color: var(--ink-primary); cursor: pointer; }
        .sp-export-menu button:hover { background: var(--bg-panel-raised); }

        /* filters */
        .sp-filters { padding: 14px 18px; margin-bottom: 20px; display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
        .sp-field { display: flex; flex-direction: column; gap: 4px; }
        .sp-field label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .sp-field select, .sp-field input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 7px 9px; font-size: 12px; color: var(--ink-primary); outline: none;
        }
        .sp-field select:focus, .sp-field input:focus { border-color: var(--gold); }
        .sp-reset-btn {
          background: transparent; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 7px 12px; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); cursor: pointer;
        }
        .sp-reset-btn:hover { color: var(--forest); border-color: var(--forest); }

        /* person cards */
        .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .sp-card { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; transition: box-shadow 0.15s, border-color 0.15s; }
        .sp-card.highlight { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(201,168,106,0.35); }
        .sp-card-head { display: flex; align-items: center; gap: 12px; }
        .sp-avatar {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: var(--forest); color: var(--oat);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-weight: 600; font-size: 15px;
        }
        .sp-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .sp-sector-tag { font-size: 10.5px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.06em; }

        .sp-contact { display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
        .sp-contact-row { display: flex; align-items: center; gap: 7px; color: var(--ink-primary); }
        .sp-contact-row svg { width: 13px; height: 13px; color: var(--ink-muted); flex-shrink: 0; }

        .sp-metrics-row { display: flex; gap: 20px; }
        .sp-metric { display: flex; flex-direction: column; gap: 2px; }
        .sp-metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .sp-metric-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 600; }

        .sp-actions-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); margin-bottom: 6px; }
        .sp-action-item { display: flex; justify-content: space-between; font-size: 11.5px; padding: 6px 0; border-bottom: 1px solid var(--border-soft); }
        .sp-action-item:last-child { border-bottom: none; }
        .sp-action-name { display: flex; flex-direction: column; }
        .sp-action-pending { font-size: 9.5px; color: var(--status-warn); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
        .sp-action-meta { text-align: right; font-family: 'JetBrains Mono', monospace; color: var(--ink-muted); }
        .sp-no-actions { font-size: 11.5px; color: var(--ink-muted); padding: 6px 0; }

        @media (max-width: 900px) {
          .sp-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <button className="sp-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Inventory
      </button>

      <div className="sp-header-row">
        <div>
          <h1 className="sp-title">Sales Personnel</h1>
          <p className="sp-subtitle">Restock owners, contact details, and recent performance</p>
        </div>
        <div className="sp-export-wrap">
          <button className="sp-export-btn" onClick={() => setExportOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
            </svg>
            Export
          </button>
          {exportOpen && (
            <div className="sp-export-menu">
              <button onClick={handleExportCSV}>Export as CSV</button>
              <button onClick={handleExportPDF}>Export as PDF</button>
            </div>
          )}
        </div>
      </div>

      <div className="panel sp-filters">
        <div className="sp-field">
          <label>Sector</label>
          <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
            <option value="all">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>Sector {s}</option>
            ))}
          </select>
        </div>
        <div className="sp-field">
          <label>Actions from</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="sp-field">
          <label>Actions to</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className="sp-reset-btn" onClick={resetFilters}>Reset filters</button>
      </div>

      <div className="sp-grid">
        {filteredPeople.map((p) => (
          <div className={`panel sp-card ${p.id === highlightId ? "highlight" : ""}`} key={p.id}>
            <div className="sp-card-head">
              <div className="sp-avatar">{initials(p.name)}</div>
              <div>
                <div className="sp-name">{p.name}</div>
                <div className="sp-sector-tag">Assigned to Sector {p.sector}</div>
              </div>
            </div>

            <div className="sp-contact">
              <div className="sp-contact-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v16H4z M22 6l-10 7L2 6" />
                </svg>
                {p.email}
              </div>
              <div className="sp-contact-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
                </svg>
                {p.phone}
              </div>
            </div>

            <div className="sp-metrics-row">
              <div className="sp-metric">
                <span className="sp-metric-label">Avg Response Time</span>
                <span className="sp-metric-value">{p.metrics.avgResponseTime}</span>
              </div>
              <div className="sp-metric">
                <span className="sp-metric-label">Successful Deliveries</span>
                <span className="sp-metric-value">{p.metrics.successfulDeliveries}</span>
              </div>
            </div>

            <div>
              <div className="sp-actions-label">Recent Restock Actions</div>
              {p.recentActions.length === 0 ? (
                <div className="sp-no-actions">No actions in this date range.</div>
              ) : (
                p.recentActions.map((a, i) => (
                  <div className="sp-action-item" key={i}>
                    <div className="sp-action-name">
                      <span>{a.product}</span>
                      {a.pending && <span className="sp-action-pending">In progress</span>}
                    </div>
                    <div className="sp-action-meta">
                      +{a.qty} · {formatDate(a.date)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
