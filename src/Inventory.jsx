import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Inventory (detail page)
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 *
 * BACKEND CONNECTION (integration points — currently mocked below):
 * - Inventory DB   → replace SECTORS / product stock+threshold with a fetch to
 *                    GET /api/inventory/sectors (stock levels, thresholds).
 * - Notification Service → STOCK_ALERTS should come from a subscription/poll to
 *                    GET /api/alerts?type=stock (fires when stock < threshold).
 * - Sales DB       → RESTOCK_HISTORY and AI_RESTOCK_ACTIONS should be sourced from
 *                    GET /api/restock/history and GET /api/restock/active, each
 *                    joined against the salesperson record in the Sales DB.
 * - Frontend Routing → clicking an "AI Restock Action" row navigates to
 *                    /sales-personnel?person=<salespersonId>, handled in
 *                    SalesPersonnel.jsx.
 */

const SECTORS = [
  {
    key: "A",
    name: "Sector A — Raw Materials",
    products: [
      { name: "Raw Cotton Bales", stock: 820, threshold: 300 },
      { name: "Polyester Fibre", stock: 210, threshold: 250 },
      { name: "Viscose Staple", stock: 0, threshold: 150 },
      { name: "Sizing Chemicals", stock: 145, threshold: 100 },
    ],
  },
  {
    key: "B",
    name: "Sector B — Yarn & Spinning",
    products: [
      { name: "Cotton Yarn 30s", stock: 540, threshold: 200 },
      { name: "Cotton Yarn 40s", stock: 90, threshold: 150 },
      { name: "Blended Yarn", stock: 300, threshold: 120 },
      { name: "Cone Bobbins", stock: 0, threshold: 500 },
    ],
  },
  {
    key: "C",
    name: "Sector C — Dyes & Chemicals",
    products: [
      { name: "Indigo Dye", stock: 60, threshold: 80 },
      { name: "Reactive Dye Black", stock: 130, threshold: 60 },
      { name: "Caustic Soda", stock: 400, threshold: 150 },
      { name: "Softener", stock: 12, threshold: 50 },
    ],
  },
  {
    key: "D",
    name: "Sector D — Packaging & Finished Goods",
    products: [
      { name: "Poly Bags", stock: 5000, threshold: 2000 },
      { name: "Cartons", stock: 150, threshold: 300 },
      { name: "Labels", stock: 0, threshold: 1000 },
      { name: "Finished Fabric Rolls", stock: 640, threshold: 200 },
    ],
  },
];

const STOCK_ALERTS = [
  { product: "Viscose Staple", sector: "A", time: "2026-07-16T08:20:00", restockStatus: "initiated" },
  { product: "Cone Bobbins", sector: "B", time: "2026-07-16T07:55:00", restockStatus: "pending" },
  { product: "Labels", sector: "D", time: "2026-07-15T21:10:00", restockStatus: "completed" },
  { product: "Polyester Fibre", sector: "A", time: "2026-07-16T09:02:00", restockStatus: "initiated" },
  { product: "Cotton Yarn 40s", sector: "B", time: "2026-07-15T18:40:00", restockStatus: "pending" },
  { product: "Indigo Dye", sector: "C", time: "2026-07-16T06:15:00", restockStatus: "pending" },
  { product: "Softener", sector: "C", time: "2026-07-14T23:05:00", restockStatus: "completed" },
  { product: "Cartons", sector: "D", time: "2026-07-16T09:30:00", restockStatus: "initiated" },
];

const RESTOCK_HISTORY = [
  { product: "Raw Cotton Bales", sector: "A", qty: 400, timestamp: "2026-07-10T11:00:00", type: "AI" },
  { product: "Cotton Yarn 30s", sector: "B", qty: 200, timestamp: "2026-07-11T09:30:00", type: "Manual" },
  { product: "Reactive Dye Black", sector: "C", qty: 80, timestamp: "2026-07-12T14:15:00", type: "AI" },
  { product: "Poly Bags", sector: "D", qty: 3000, timestamp: "2026-07-09T10:05:00", type: "Manual" },
  { product: "Labels", sector: "D", qty: 1000, timestamp: "2026-07-15T20:45:00", type: "AI" },
  { product: "Softener", sector: "C", qty: 40, timestamp: "2026-07-14T22:30:00", type: "AI" },
  { product: "Blended Yarn", sector: "B", qty: 150, timestamp: "2026-07-08T13:20:00", type: "Manual" },
  { product: "Sizing Chemicals", sector: "A", qty: 60, timestamp: "2026-07-13T08:50:00", type: "AI" },
  { product: "Finished Fabric Rolls", sector: "D", qty: 200, timestamp: "2026-07-07T15:40:00", type: "Manual" },
  { product: "Caustic Soda", sector: "C", qty: 200, timestamp: "2026-07-06T10:10:00", type: "AI" },
];

const AI_RESTOCK_ACTIONS = [
  { id: "ra1", product: "Viscose Staple", sector: "A", status: "Restock initiated", personId: "p1", eta: "Today, 4:00 PM" },
  { id: "ra2", product: "Cone Bobbins", sector: "B", status: "Pending approval", personId: "p2", eta: "Awaiting sign-off" },
  { id: "ra3", product: "Labels", sector: "D", status: "Completed", personId: "p3", eta: "Delivered Jul 15" },
  { id: "ra4", product: "Cartons", sector: "D", status: "Delivery in progress", personId: "p3", eta: "Tomorrow, 10:00 AM" },
  { id: "ra5", product: "Indigo Dye", sector: "C", status: "Pending approval", personId: "p4", eta: "Awaiting sign-off" },
];

function productStatus(stock, threshold) {
  if (stock <= 0) return "out";
  if (stock < threshold) return "low";
  return "healthy";
}
function statusTone(status) {
  return { healthy: "good", low: "warn", out: "bad" }[status];
}
function statusDot(status) {
  return { healthy: "🟢", low: "🟠", out: "🔴" }[status];
}
function toneColor(tone) {
  return { good: "var(--status-good)", warn: "var(--status-warn)", bad: "var(--status-bad)" }[tone];
}
function restockTone(status) {
  return { initiated: "warn", pending: "bad", completed: "good" }[status];
}
function actionTone(status) {
  return {
    "Restock initiated": "warn",
    "Pending approval": "bad",
    Completed: "good",
    "Delivery in progress": "warn",
  }[status];
}
function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
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

export default function Inventory() {
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);

  const sectorTotals = useMemo(
    () =>
      SECTORS.map((s) => ({
        ...s,
        total: s.products.reduce((sum, p) => sum + p.stock, 0),
      })),
    []
  );

  function handleExportCSV() {
    const rows = [
      ["Section", "Product", "Sector", "Stock/Qty", "Threshold/Status/Type", "Timestamp"],
      ...SECTORS.flatMap((s) =>
        s.products.map((p) => ["Stock Level", p.name, s.key, p.stock, `threshold ${p.threshold} (${productStatus(p.stock, p.threshold)})`, ""])
      ),
      ...STOCK_ALERTS.map((a) => ["Stock Alert", a.product, a.sector, "", a.restockStatus, formatTimestamp(a.time)]),
      ...RESTOCK_HISTORY.map((r) => ["Restock History", r.product, r.sector, r.qty, r.type, formatTimestamp(r.timestamp)]),
    ];
    downloadBlob(toCSV(rows), "inventory-export.csv", "text/csv;charset=utf-8;");
    setExportOpen(false);
  }
  function handleExportPDF() {
    setExportOpen(false);
    window.print();
  }

  return (
    <div className="iv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .iv-root {
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
        .iv-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .iv-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .iv-back:hover { background: var(--sage); color: #fff; }
        .iv-back svg { width: 14px; height: 14px; }

        .iv-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        .iv-title { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; margin: 0 0 6px 0; }
        .iv-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }

        .iv-export-wrap { position: relative; }
        .iv-export-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--forest); border: none; border-radius: 10px;
          color: var(--oat); font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .iv-export-btn svg { width: 14px; height: 14px; }
        .iv-export-menu {
          position: absolute; top: calc(100% + 6px); right: 0; z-index: 5;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          box-shadow: 0 6px 18px rgba(31,61,46,0.14);
          display: flex; flex-direction: column; min-width: 150px; overflow: hidden;
        }
        .iv-export-menu button { background: transparent; border: none; text-align: left; padding: 10px 14px; font-size: 12.5px; color: var(--ink-primary); cursor: pointer; }
        .iv-export-menu button:hover { background: var(--bg-panel-raised); }

        .iv-section-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted);
          margin: 28px 0 12px 0; display: flex; align-items: center; gap: 8px;
        }
        .iv-section-title:first-of-type { margin-top: 0; }
        .iv-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border-soft); }

        /* sector boxes */
        .iv-sector-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .iv-sector-card { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; border-left: 4px solid var(--gold); }
        .iv-sector-head { display: flex; justify-content: space-between; align-items: baseline; }
        .iv-sector-name { font-family: 'Fraunces', serif; font-size: 13.5px; font-weight: 600; line-height: 1.3; }
        .iv-sector-total { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ink-muted); }
        .iv-product-rows { display: flex; flex-direction: column; gap: 8px; }
        .iv-product-row { display: flex; flex-direction: column; gap: 3px; padding-bottom: 8px; border-bottom: 1px solid var(--border-soft); }
        .iv-product-row:last-child { border-bottom: none; padding-bottom: 0; }
        .iv-product-top { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .iv-product-name { font-size: 11.5px; font-weight: 600; }
        .iv-product-stock { font-size: 11px; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 4px; }
        .iv-product-threshold { font-size: 10px; color: var(--ink-muted); }

        /* stock alerts */
        .iv-alert-list { display: flex; flex-direction: column; gap: 8px; }
        .iv-alert-card { padding: 12px 16px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .iv-alert-info { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 2px; }
        .iv-alert-product { font-family: 'Fraunces', serif; font-size: 13.5px; font-weight: 600; }
        .iv-alert-meta { font-size: 11px; color: var(--ink-muted); }
        .iv-badge { font-size: 10.5px; padding: 3px 9px; border-radius: 999px; font-weight: 700; letter-spacing: 0.02em; text-transform: capitalize; }

        /* restock history table */
        .iv-table-wrap { overflow-x: auto; }
        .iv-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .iv-table th {
          text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--ink-muted); padding: 10px 12px; border-bottom: 1px solid var(--border-soft);
        }
        .iv-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-soft); }
        .iv-table tr:last-child td { border-bottom: none; }
        .iv-table .mono { font-family: 'JetBrains Mono', monospace; }
        .iv-type-pill { font-size: 10px; padding: 2px 8px; border-radius: 999px; font-weight: 700; }
        .iv-type-ai { background: rgba(31,61,46,0.08); color: var(--forest); }
        .iv-type-manual { background: rgba(201,168,106,0.18); color: #8a6d33; }

        /* AI restock action panel */
        .iv-action-list { display: flex; flex-direction: column; gap: 8px; }
        .iv-action-card {
          padding: 13px 16px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .iv-action-card:hover { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(201,168,106,0.25); }
        .iv-action-info { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 2px; }
        .iv-action-product { font-family: 'Fraunces', serif; font-size: 13.5px; font-weight: 600; }
        .iv-action-meta { font-size: 11px; color: var(--ink-muted); }
        .iv-action-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: var(--forest); }
        .iv-action-link svg { width: 12px; height: 12px; }

        @media (max-width: 1000px) {
          .iv-sector-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .iv-sector-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <button className="iv-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="iv-header-row">
        <div>
          <h1 className="iv-title">Inventory</h1>
          <p className="iv-subtitle">Stock levels, alerts, restock history, and AI-driven restock actions</p>
        </div>
        <div className="iv-export-wrap">
          <button className="iv-export-btn" onClick={() => setExportOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
            </svg>
            Export
          </button>
          {exportOpen && (
            <div className="iv-export-menu">
              <button onClick={handleExportCSV}>Export as CSV</button>
              <button onClick={handleExportPDF}>Export as PDF</button>
            </div>
          )}
        </div>
      </div>

      {/* 1. CURRENT STOCK LEVELS */}
      <h4 className="iv-section-title">Current Stock Levels</h4>
      <div className="iv-sector-grid">
        {sectorTotals.map((s) => (
          <div className="panel iv-sector-card" key={s.key}>
            <div className="iv-sector-head">
              <span className="iv-sector-name">{s.name}</span>
            </div>
            <span className="iv-sector-total">Total stock: {s.total.toLocaleString()} units</span>
            <div className="iv-product-rows">
              {s.products.map((p) => {
                const status = productStatus(p.stock, p.threshold);
                const tone = statusTone(status);
                return (
                  <div className="iv-product-row" key={p.name}>
                    <div className="iv-product-top">
                      <span className="iv-product-name">{p.name}</span>
                      <span className="iv-product-stock">
                        {statusDot(status)} {p.stock.toLocaleString()}
                      </span>
                    </div>
                    <span className="iv-product-threshold" style={{ color: toneColor(tone) }}>
                      Min threshold: {p.threshold.toLocaleString()} · {status === "healthy" ? "Healthy" : status === "low" ? "Low stock" : "Out of stock"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 2. STOCK ALERTS */}
      <h4 className="iv-section-title">Stock Alerts</h4>
      <div className="iv-alert-list">
        {STOCK_ALERTS.map((a, i) => {
          const tone = restockTone(a.restockStatus);
          return (
            <div className="panel iv-alert-card" key={i}>
              <div className="iv-alert-info">
                <span className="iv-alert-product">{a.product}</span>
                <span className="iv-alert-meta">Sector {a.sector} · {formatTimestamp(a.time)}</span>
              </div>
              <span
                className="iv-badge"
                style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
              >
                {a.restockStatus}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. RESTOCK HISTORY */}
      <h4 className="iv-section-title">Restock History</h4>
      <div className="panel iv-table-wrap">
        <table className="iv-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sector</th>
              <th>Quantity Refilled</th>
              <th>Timestamp</th>
              <th>Restock Type</th>
            </tr>
          </thead>
          <tbody>
            {RESTOCK_HISTORY.map((r, i) => (
              <tr key={i}>
                <td>{r.product}</td>
                <td>Sector {r.sector}</td>
                <td className="mono">+{r.qty.toLocaleString()}</td>
                <td className="mono">{formatTimestamp(r.timestamp)}</td>
                <td>
                  <span className={`iv-type-pill ${r.type === "AI" ? "iv-type-ai" : "iv-type-manual"}`}>{r.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. AI RESTOCK ACTION */}
      <h4 className="iv-section-title">AI Restock Action</h4>
      <div className="iv-action-list">
        {AI_RESTOCK_ACTIONS.map((a) => {
          const tone = actionTone(a.status);
          return (
            <div className="panel iv-action-card" key={a.id} onClick={() => navigate(`/sales-personnel?person=${a.personId}`)}>
              <div className="iv-action-info">
                <span className="iv-action-product">{a.product}</span>
                <span className="iv-action-meta">Sector {a.sector} · {a.eta}</span>
              </div>
              <span
                className="iv-badge"
                style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
              >
                {a.status}
              </span>
              <span className="iv-action-link">
                View salesperson
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
