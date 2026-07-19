import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Weaving Sector (detail page)
 * Reached via dashboard.jsx → Factory Sectors → "Weaving" card → /weaving
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const INITIAL_MACHINES = [
  {
    id: "m1",
    name: "WeaveMaster 3000",
    manufacturer: "LoomTech Industries",
    energy: 480,
    power: 22,
    vibration: 4.4,
    temperature: 64,
    lastService: "2026-06-18",
    nextService: "2026-09-18",
    totalEnergy: 176500,
    status: "Active",
    location: "Weaving Bay 1",
    operator: "P. Anand",
    efficiency: 92.3,
    notes: "Running within normal parameters.",
  },
  {
    id: "m2",
    name: "TexWeaver X9",
    manufacturer: "FiberWorks Ltd",
    energy: 410,
    power: 18,
    vibration: 5.1,
    temperature: 68,
    lastService: "2026-06-08",
    nextService: "2026-09-08",
    totalEnergy: 149300,
    status: "Active",
    location: "Weaving Bay 2",
    operator: "P. Anand",
    efficiency: 89.7,
    notes: "Minor loom stop rate increase under observation.",
  },
  {
    id: "m3",
    name: "LoomPro Elite",
    manufacturer: "SpinFab Machinery",
    energy: 530,
    power: 25,
    vibration: 7.6,
    temperature: 83,
    lastService: "2026-05-25",
    nextService: "2026-08-25",
    totalEnergy: 192800,
    status: "Maintenance",
    location: "Weaving Bay 3",
    operator: "S. Velan",
    efficiency: 71.6,
    notes: "Scheduled for shuttle guide replacement.",
  },
  {
    id: "m4",
    name: "ThreadLine Nova",
    manufacturer: "TexFab Corp",
    energy: 390,
    power: 16,
    vibration: 3.3,
    temperature: 59,
    lastService: "2026-07-05",
    nextService: "2026-10-05",
    totalEnergy: 134100,
    status: "Active",
    location: "Weaving Bay 1",
    operator: "R. Kumar",
    efficiency: 94.8,
    notes: "Recently serviced, performing well.",
  },
  {
    id: "m5",
    name: "WarpFlow Prime",
    manufacturer: "WeaveMach Co",
    energy: 360,
    power: 15,
    vibration: 4.0,
    temperature: 61,
    lastService: "2026-06-12",
    nextService: "2026-09-12",
    totalEnergy: 116700,
    status: "Idle",
    location: "Weaving Bay 2",
    operator: "R. Kumar",
    efficiency: 85.9,
    notes: "Idle between warp beam changeovers.",
  },
];

function vibrationTone(v) {
  if (v >= 6) return "bad";
  if (v >= 4.5) return "warn";
  return "good";
}
function temperatureTone(t) {
  if (t >= 78) return "bad";
  if (t >= 65) return "warn";
  return "good";
}

function statusTone(status) {
  return { Active: "good", Idle: "warn", Maintenance: "bad" }[status] || "warn";
}
function toneColor(tone) {
  return { good: "var(--status-good)", warn: "var(--status-warn)", bad: "var(--status-bad)" }[tone];
}
function formatDate(ds) {
  if (!ds) return "—";
  const d = new Date(ds + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export default function Weaving() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", manufacturer: "", energy: "", power: "" });
  const [detailMachine, setDetailMachine] = useState(null);
  const [show3D, setShow3D] = useState(false);

  function openDetails(m) {
    setSelectedId(m.id);
    setDetailMachine(m);
    setShow3D(false);
  }
  function closeDetails() {
    setDetailMachine(null);
    setShow3D(false);
  }

  const totals = useMemo(
    () => ({
      count: machines.length,
      energy: machines.reduce((sum, m) => sum + m.energy, 0),
      avgEfficiency: (machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length).toFixed(1),
    }),
    [machines]
  );

  function handleAddMachine(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.manufacturer.trim() || !form.energy || !form.power) return;
    const newMachine = {
      id: `m${Date.now()}`,
      name: form.name.trim(),
      manufacturer: form.manufacturer.trim(),
      energy: Number(form.energy),
      power: Number(form.power),
      lastService: "",
      nextService: "",
      totalEnergy: 0,
      status: "Active",
      location: "Unassigned",
      operator: "Unassigned",
      efficiency: 0,
      notes: "Newly added — pending first service log.",
    };
    setMachines((prev) => [...prev, newMachine]);
    setForm({ name: "", manufacturer: "", energy: "", power: "" });
    setShowAddForm(false);
  }

  return (
    <div className="wv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .wv-root {
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
        .wv-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .wv-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .wv-back:hover { background: var(--sage); color: #fff; }
        .wv-back svg { width: 14px; height: 14px; }

        .wv-header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
        .wv-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 600; margin: 0 0 6px 0; }
        .wv-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }
        .wv-summary { display: flex; gap: 18px; flex-wrap: wrap; }
        .wv-summary-item { display: flex; flex-direction: column; gap: 2px; text-align: right; }
        .wv-summary-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); }
        .wv-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 600; }

        .wv-section-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted);
          margin: 26px 0 12px 0; display: flex; align-items: center; gap: 8px;
        }
        .wv-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border-soft); }

        /* machine cards - horizontal */
        .wv-cards-row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; }
        .wv-machine-card {
          flex: 0 0 200px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;
          border-left: 4px solid var(--gold); cursor: pointer;
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .wv-machine-card:hover { box-shadow: 0 4px 14px rgba(31,61,46,0.08); }
        .wv-machine-card.selected { border-color: var(--forest); box-shadow: 0 0 0 2px rgba(31,61,46,0.18); }
        .wv-machine-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; line-height: 1.25; }
        .wv-machine-mfr { font-size: 11px; color: var(--ink-muted); }
        .wv-machine-stats { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
        .wv-machine-stat-row { display: flex; justify-content: space-between; font-size: 11.5px; }
        .wv-machine-stat-row span:first-child { color: var(--ink-muted); }
        .wv-machine-stat-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .wv-status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 5px; }

        .wv-add-card {
          flex: 0 0 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; border: 1.5px dashed var(--border-soft); border-radius: 14px; cursor: pointer;
          color: var(--ink-muted); background: transparent; transition: border-color 0.15s, color 0.15s, background 0.15s;
          min-height: 158px;
        }
        .wv-add-card:hover { border-color: var(--gold); color: var(--forest); background: rgba(201,168,106,0.06); }
        .wv-add-plus {
          width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid currentColor;
          display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 300;
        }
        .wv-add-label { font-size: 12px; font-weight: 600; }

        /* add machine form (inline modal) */
        .wv-form-overlay {
          position: fixed; inset: 0; background: rgba(31,61,46,0.35); z-index: 20;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .wv-form-panel { width: 100%; max-width: 380px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
        .wv-form-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .wv-form-field { display: flex; flex-direction: column; gap: 4px; }
        .wv-form-field label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .wv-form-field input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 8px 10px; font-size: 12.5px; color: var(--ink-primary); outline: none;
        }
        .wv-form-field input:focus { border-color: var(--gold); }
        .wv-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
        .wv-btn-primary {
          background: var(--forest); border: none; border-radius: 8px; color: var(--oat);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .wv-btn-secondary {
          background: transparent; border: 1px solid var(--border-soft); border-radius: 8px; color: var(--ink-muted);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .wv-btn-secondary:hover { color: var(--forest); border-color: var(--forest); }

        /* view details button on machine cards */
        .wv-view-details-btn {
          all: unset; box-sizing: border-box;
          display: inline-flex; align-items: center; justify-content: center; gap: 4px;
          margin-top: 2px; padding: 7px 10px; border-radius: 8px;
          background: var(--bg-panel-raised); color: var(--forest);
          font-size: 11px; font-weight: 700; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .wv-view-details-btn svg { width: 12px; height: 12px; }
        .wv-view-details-btn:hover { background: var(--forest); color: var(--oat); }

        /* machine details popup */
        .wv-detail-panel {
          width: 100%; max-width: 420px; padding: 24px; display: flex; flex-direction: column; gap: 18px;
        }
        .wv-detail-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .wv-detail-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--forest); }
        .wv-detail-mfr { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
        .wv-detail-close {
          all: unset; box-sizing: border-box; cursor: pointer; color: var(--ink-muted);
          width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .wv-detail-close:hover { background: var(--bg-panel-raised); color: var(--forest); }
        .wv-detail-close svg { width: 16px; height: 16px; }

        .wv-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .wv-detail-stat {
          display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
          border-radius: 10px; background: var(--bg-panel-raised);
        }
        .wv-detail-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .wv-detail-stat-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: var(--ink-primary); }

        .wv-3d-btn {
          all: unset; box-sizing: border-box;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--forest); color: var(--oat); border-radius: 10px;
          padding: 11px 16px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          transition: background 0.15s;
        }
        .wv-3d-btn:hover { background: #16301f; }
        .wv-3d-btn svg { width: 16px; height: 16px; }

        /* placeholder 3D preview */
        .wv-3d-viewport { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .wv-3d-scene {
          width: 100%; height: 140px; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center, rgba(31,61,46,0.06) 0%, transparent 70%);
          border-radius: 12px; perspective: 500px;
        }
        .wv-3d-cube {
          width: 60px; height: 60px; position: relative; transform-style: preserve-3d;
          animation: wv-spin 7s linear infinite;
        }
        .wv-3d-face {
          position: absolute; width: 60px; height: 60px;
          background: rgba(31,61,46,0.14); border: 1.5px solid var(--forest);
          border-radius: 4px;
        }
        .wv-face-front { transform: translateZ(30px); }
        .wv-face-back { transform: translateZ(-30px) rotateY(180deg); }
        .wv-face-right { transform: rotateY(90deg) translateZ(30px); }
        .wv-face-left { transform: rotateY(-90deg) translateZ(30px); }
        .wv-face-top { transform: rotateX(90deg) translateZ(30px); background: rgba(201,168,106,0.22); }
        .wv-face-bottom { transform: rotateX(-90deg) translateZ(30px); }
        @keyframes wv-spin {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }
        .wv-3d-caption { font-size: 11px; color: var(--ink-muted); text-align: center; max-width: 320px; line-height: 1.4; }

        /* table */
        .wv-table-wrap { overflow-x: auto; }
        .wv-table { width: 100%; border-collapse: collapse; font-size: 11.5px; min-width: 1100px; }
        .wv-table th {
          text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--ink-muted); padding: 10px 12px; border-bottom: 1px solid var(--border-soft);
          white-space: nowrap; position: sticky; top: 0; background: var(--bg-panel);
        }
        .wv-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-soft); vertical-align: top; }
        .wv-table tr:last-child td { border-bottom: none; }
        .wv-table tr.selected { background: rgba(201,168,106,0.09); }
        .wv-table .mono { font-family: 'JetBrains Mono', monospace; }
        .wv-table .wv-name-cell { font-family: 'Fraunces', serif; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
        .wv-table .wv-notes-cell { max-width: 220px; color: var(--ink-muted); }
        .wv-badge { font-size: 10px; padding: 3px 9px; border-radius: 999px; font-weight: 700; white-space: nowrap; }

        @media (max-width: 700px) {
          .wv-header-row { flex-direction: column; align-items: flex-start; }
          .wv-summary { text-align: left; }
          .wv-summary-item { text-align: left; }
        }
      `}</style>

      <button className="wv-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="wv-header-row">
        <div>
          <h1 className="wv-title">Weaving</h1>
          <p className="wv-subtitle">Machine-level monitoring for the Weaving sector</p>
        </div>
        <div className="wv-summary">
          <div className="wv-summary-item">
            <span className="wv-summary-label">Machines</span>
            <span className="wv-summary-value">{totals.count}</span>
          </div>
          <div className="wv-summary-item">
            <span className="wv-summary-label">Energy / Day</span>
            <span className="wv-summary-value">{totals.energy.toLocaleString()} kWh</span>
          </div>
          <div className="wv-summary-item">
            <span className="wv-summary-label">Avg Efficiency</span>
            <span className="wv-summary-value">{totals.avgEfficiency}%</span>
          </div>
        </div>
      </div>

      <h4 className="wv-section-title">Machines</h4>
      <div className="wv-cards-row">
        {machines.map((m) => (
          <div
            key={m.id}
            className={`panel wv-machine-card ${selectedId === m.id ? "selected" : ""}`}
            onClick={() => openDetails(m)}
          >
            <div>
              <div className="wv-machine-name">{m.name}</div>
              <div className="wv-machine-mfr">{m.manufacturer}</div>
            </div>
            <div className="wv-machine-stats">
              <div className="wv-machine-stat-row">
                <span>Energy Consumption</span>
                <span>{m.energy} kWh/day</span>
              </div>
              <div className="wv-machine-stat-row">
                <span>Power Rating</span>
                <span>{m.power} kW</span>
              </div>
            </div>
            <button
              className="wv-view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                openDetails(m);
              }}
            >
              View Details
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        ))}
        <div className="wv-add-card" onClick={() => setShowAddForm(true)}>
          <div className="wv-add-plus">+</div>
          <span className="wv-add-label">Add Machine</span>
        </div>
      </div>

      {showAddForm && (
        <div className="wv-form-overlay" onClick={() => setShowAddForm(false)}>
          <form className="panel wv-form-panel" onClick={(e) => e.stopPropagation()} onSubmit={handleAddMachine}>
            <div className="wv-form-title">Add Machine</div>
            <div className="wv-form-field">
              <label>Machine Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. WeaveFlex 400"
                required
              />
            </div>
            <div className="wv-form-field">
              <label>Manufacturer</label>
              <input
                value={form.manufacturer}
                onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                placeholder="e.g. TexFab Corp"
                required
              />
            </div>
            <div className="wv-form-field">
              <label>Energy Consumption (kWh/day)</label>
              <input
                type="number"
                value={form.energy}
                onChange={(e) => setForm((f) => ({ ...f, energy: e.target.value }))}
                placeholder="e.g. 350"
                required
              />
            </div>
            <div className="wv-form-field">
              <label>Power Rating (kW)</label>
              <input
                type="number"
                value={form.power}
                onChange={(e) => setForm((f) => ({ ...f, power: e.target.value }))}
                placeholder="e.g. 15"
                required
              />
            </div>
            <div className="wv-form-actions">
              <button type="button" className="wv-btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="wv-btn-primary">Add Machine</button>
            </div>
          </form>
        </div>
      )}

      {detailMachine && (
        <div className="wv-form-overlay" onClick={closeDetails}>
          <div className="panel wv-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="wv-detail-head">
              <div>
                <div className="wv-detail-name">{detailMachine.name}</div>
                <div className="wv-detail-mfr">{detailMachine.manufacturer}</div>
              </div>
              <button className="wv-detail-close" onClick={closeDetails} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="wv-detail-grid">
              <div className="wv-detail-stat">
                <span className="wv-detail-stat-label">Vibration</span>
                <span className="wv-detail-stat-value" style={{ color: toneColor(vibrationTone(detailMachine.vibration)) }}>
                  {detailMachine.vibration} mm/s
                </span>
              </div>
              <div className="wv-detail-stat">
                <span className="wv-detail-stat-label">Temperature</span>
                <span className="wv-detail-stat-value" style={{ color: toneColor(temperatureTone(detailMachine.temperature)) }}>
                  {detailMachine.temperature}°C
                </span>
              </div>
              <div className="wv-detail-stat">
                <span className="wv-detail-stat-label">Energy Consumption</span>
                <span className="wv-detail-stat-value">{detailMachine.energy} kWh/day</span>
              </div>
              <div className="wv-detail-stat">
                <span className="wv-detail-stat-label">Power Rating</span>
                <span className="wv-detail-stat-value">{detailMachine.power} kW</span>
              </div>
            </div>

            <button className="wv-3d-btn" onClick={() => setShow3D((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7-6.6 3.7-6.6-3.7L12 4.3ZM5 9.2l6 3.35v6.9l-6-3.35V9.2Zm8 10.25v-6.9l6-3.35v6.9l-6 3.35Z" />
              </svg>
              {show3D ? "Hide 3D Visualizer" : "3D Visualizer"}
            </button>

            {show3D && (
              <div className="wv-3d-viewport">
                <div className="wv-3d-scene">
                  <div className="wv-3d-cube">
                    <div className="wv-3d-face wv-face-front" />
                    <div className="wv-3d-face wv-face-back" />
                    <div className="wv-3d-face wv-face-right" />
                    <div className="wv-3d-face wv-face-left" />
                    <div className="wv-3d-face wv-face-top" />
                    <div className="wv-3d-face wv-face-bottom" />
                  </div>
                </div>
                <div className="wv-3d-caption">Live 3D preview of {detailMachine.name} — rotate to inspect machine geometry</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h4 className="wv-section-title">Machine Details</h4>
      <div className="panel wv-table-wrap">
        <table className="wv-table">
          <thead>
            <tr>
              <th>Machine Name</th>
              <th>Energy Consumption</th>
              <th>Manufacturer</th>
              <th>Last Service Date</th>
              <th>Next Service Date</th>
              <th>Total Energy Consumed</th>
              <th>Power Rating</th>
              <th>Status</th>
              <th>Location</th>
              <th>Operator</th>
              <th>Efficiency (%)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => {
              const tone = statusTone(m.status);
              return (
                <tr key={m.id} className={selectedId === m.id ? "selected" : ""}>
                  <td className="wv-name-cell">{m.name}</td>
                  <td className="mono">{m.energy} kWh/day</td>
                  <td>{m.manufacturer}</td>
                  <td className="mono">{formatDate(m.lastService)}</td>
                  <td className="mono">{formatDate(m.nextService)}</td>
                  <td className="mono">{m.totalEnergy ? `${m.totalEnergy.toLocaleString()} kWh` : "—"}</td>
                  <td className="mono">{m.power} kW</td>
                  <td>
                    <span
                      className="wv-badge"
                      style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
                    >
                      <span className="wv-status-dot" style={{ background: toneColor(tone) }} />
                      {m.status}
                    </span>
                  </td>
                  <td>{m.location}</td>
                  <td>{m.operator}</td>
                  <td className="mono">{m.efficiency ? `${m.efficiency}%` : "—"}</td>
                  <td className="wv-notes-cell">{m.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
