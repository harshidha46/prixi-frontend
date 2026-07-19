import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Finishing Sector (detail page)
 * Reached via dashboard.jsx → Factory Sectors → "Finishing" card → /finishing
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const INITIAL_MACHINES = [
  {
    id: "m1",
    name: "FinishMaster 2000",
    manufacturer: "TexFinish Industries",
    energy: 400,
    power: 17,
    vibration: 3.6,
    temperature: 60,
    lastService: "2026-06-16",
    nextService: "2026-09-16",
    totalEnergy: 146800,
    status: "Active",
    location: "Finishing Bay 1",
    operator: "R. Kumar",
    efficiency: 91.4,
    notes: "Running within normal parameters.",
  },
  {
    id: "m2",
    name: "SmoothTex Pro",
    manufacturer: "FiberWorks Ltd",
    energy: 360,
    power: 14,
    vibration: 4.8,
    temperature: 67,
    lastService: "2026-06-04",
    nextService: "2026-09-04",
    totalEnergy: 131200,
    status: "Active",
    location: "Finishing Bay 2",
    operator: "R. Kumar",
    efficiency: 88.9,
    notes: "Roller alignment checked, within tolerance.",
  },
  {
    id: "m3",
    name: "GlossLine X5",
    manufacturer: "SpinFab Machinery",
    energy: 470,
    power: 21,
    vibration: 6.9,
    temperature: 85,
    lastService: "2026-05-22",
    nextService: "2026-08-22",
    totalEnergy: 172400,
    status: "Maintenance",
    location: "Finishing Bay 3",
    operator: "P. Anand",
    efficiency: 68.3,
    notes: "Scheduled for heating element replacement.",
  },
  {
    id: "m4",
    name: "TexFinish Nova",
    manufacturer: "TexFab Corp",
    energy: 340,
    power: 13,
    vibration: 2.8,
    temperature: 57,
    lastService: "2026-07-03",
    nextService: "2026-10-03",
    totalEnergy: 118600,
    status: "Active",
    location: "Finishing Bay 1",
    operator: "S. Velan",
    efficiency: 93.7,
    notes: "Recently serviced, performing well.",
  },
  {
    id: "m5",
    name: "FiberPolish Alpha",
    manufacturer: "WeaveMach Co",
    energy: 300,
    power: 12,
    vibration: 3.4,
    temperature: 59,
    lastService: "2026-06-14",
    nextService: "2026-09-14",
    totalEnergy: 102300,
    status: "Idle",
    location: "Finishing Bay 2",
    operator: "S. Velan",
    efficiency: 84.6,
    notes: "Idle between finishing batch changeovers.",
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

export default function Finishing() {
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
    <div className="fn-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .fn-root {
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
        .fn-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .fn-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .fn-back:hover { background: var(--sage); color: #fff; }
        .fn-back svg { width: 14px; height: 14px; }

        .fn-header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
        .fn-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 600; margin: 0 0 6px 0; }
        .fn-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }
        .fn-summary { display: flex; gap: 18px; flex-wrap: wrap; }
        .fn-summary-item { display: flex; flex-direction: column; gap: 2px; text-align: right; }
        .fn-summary-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); }
        .fn-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 600; }

        .fn-section-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted);
          margin: 26px 0 12px 0; display: flex; align-items: center; gap: 8px;
        }
        .fn-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border-soft); }

        /* machine cards - horizontal */
        .fn-cards-row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; }
        .fn-machine-card {
          flex: 0 0 200px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;
          border-left: 4px solid var(--gold); cursor: pointer;
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .fn-machine-card:hover { box-shadow: 0 4px 14px rgba(31,61,46,0.08); }
        .fn-machine-card.selected { border-color: var(--forest); box-shadow: 0 0 0 2px rgba(31,61,46,0.18); }
        .fn-machine-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; line-height: 1.25; }
        .fn-machine-mfr { font-size: 11px; color: var(--ink-muted); }
        .fn-machine-stats { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
        .fn-machine-stat-row { display: flex; justify-content: space-between; font-size: 11.5px; }
        .fn-machine-stat-row span:first-child { color: var(--ink-muted); }
        .fn-machine-stat-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .fn-status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 5px; }

        .fn-add-card {
          flex: 0 0 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; border: 1.5px dashed var(--border-soft); border-radius: 14px; cursor: pointer;
          color: var(--ink-muted); background: transparent; transition: border-color 0.15s, color 0.15s, background 0.15s;
          min-height: 158px;
        }
        .fn-add-card:hover { border-color: var(--gold); color: var(--forest); background: rgba(201,168,106,0.06); }
        .fn-add-plus {
          width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid currentColor;
          display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 300;
        }
        .fn-add-label { font-size: 12px; font-weight: 600; }

        /* add machine form (inline modal) */
        .fn-form-overlay {
          position: fixed; inset: 0; background: rgba(31,61,46,0.35); z-index: 20;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .fn-form-panel { width: 100%; max-width: 380px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
        .fn-form-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .fn-form-field { display: flex; flex-direction: column; gap: 4px; }
        .fn-form-field label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .fn-form-field input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 8px 10px; font-size: 12.5px; color: var(--ink-primary); outline: none;
        }
        .fn-form-field input:focus { border-color: var(--gold); }
        .fn-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
        .fn-btn-primary {
          background: var(--forest); border: none; border-radius: 8px; color: var(--oat);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .fn-btn-secondary {
          background: transparent; border: 1px solid var(--border-soft); border-radius: 8px; color: var(--ink-muted);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .fn-btn-secondary:hover { color: var(--forest); border-color: var(--forest); }

        /* view details button on machine cards */
        .fn-view-details-btn {
          all: unset; box-sizing: border-box;
          display: inline-flex; align-items: center; justify-content: center; gap: 4px;
          margin-top: 2px; padding: 7px 10px; border-radius: 8px;
          background: var(--bg-panel-raised); color: var(--forest);
          font-size: 11px; font-weight: 700; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .fn-view-details-btn svg { width: 12px; height: 12px; }
        .fn-view-details-btn:hover { background: var(--forest); color: var(--oat); }

        /* machine details popup */
        .fn-detail-panel {
          width: 100%; max-width: 420px; padding: 24px; display: flex; flex-direction: column; gap: 18px;
        }
        .fn-detail-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .fn-detail-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--forest); }
        .fn-detail-mfr { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
        .fn-detail-close {
          all: unset; box-sizing: border-box; cursor: pointer; color: var(--ink-muted);
          width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .fn-detail-close:hover { background: var(--bg-panel-raised); color: var(--forest); }
        .fn-detail-close svg { width: 16px; height: 16px; }

        .fn-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .fn-detail-stat {
          display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
          border-radius: 10px; background: var(--bg-panel-raised);
        }
        .fn-detail-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .fn-detail-stat-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: var(--ink-primary); }

        .fn-3d-btn {
          all: unset; box-sizing: border-box;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--forest); color: var(--oat); border-radius: 10px;
          padding: 11px 16px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          transition: background 0.15s;
        }
        .fn-3d-btn:hover { background: #16301f; }
        .fn-3d-btn svg { width: 16px; height: 16px; }

        /* placeholder 3D preview */
        .fn-3d-viewport { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .fn-3d-scene {
          width: 100%; height: 140px; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center, rgba(31,61,46,0.06) 0%, transparent 70%);
          border-radius: 12px; perspective: 500px;
        }
        .fn-3d-cube {
          width: 60px; height: 60px; position: relative; transform-style: preserve-3d;
          animation: fn-spin 7s linear infinite;
        }
        .fn-3d-face {
          position: absolute; width: 60px; height: 60px;
          background: rgba(31,61,46,0.14); border: 1.5px solid var(--forest);
          border-radius: 4px;
        }
        .fn-face-front { transform: translateZ(30px); }
        .fn-face-back { transform: translateZ(-30px) rotateY(180deg); }
        .fn-face-right { transform: rotateY(90deg) translateZ(30px); }
        .fn-face-left { transform: rotateY(-90deg) translateZ(30px); }
        .fn-face-top { transform: rotateX(90deg) translateZ(30px); background: rgba(201,168,106,0.22); }
        .fn-face-bottom { transform: rotateX(-90deg) translateZ(30px); }
        @keyframes fn-spin {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }
        .fn-3d-caption { font-size: 11px; color: var(--ink-muted); text-align: center; max-width: 320px; line-height: 1.4; }

        /* table */
        .fn-table-wrap { overflow-x: auto; }
        .fn-table { width: 100%; border-collapse: collapse; font-size: 11.5px; min-width: 1100px; }
        .fn-table th {
          text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--ink-muted); padding: 10px 12px; border-bottom: 1px solid var(--border-soft);
          white-space: nowrap; position: sticky; top: 0; background: var(--bg-panel);
        }
        .fn-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-soft); vertical-align: top; }
        .fn-table tr:last-child td { border-bottom: none; }
        .fn-table tr.selected { background: rgba(201,168,106,0.09); }
        .fn-table .mono { font-family: 'JetBrains Mono', monospace; }
        .fn-table .fn-name-cell { font-family: 'Fraunces', serif; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
        .fn-table .fn-notes-cell { max-width: 220px; color: var(--ink-muted); }
        .fn-badge { font-size: 10px; padding: 3px 9px; border-radius: 999px; font-weight: 700; white-space: nowrap; }

        @media (max-width: 700px) {
          .fn-header-row { flex-direction: column; align-items: flex-start; }
          .fn-summary { text-align: left; }
          .fn-summary-item { text-align: left; }
        }
      `}</style>

      <button className="fn-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="fn-header-row">
        <div>
          <h1 className="fn-title">Finishing</h1>
          <p className="fn-subtitle">Machine-level monitoring for the Finishing sector</p>
        </div>
        <div className="fn-summary">
          <div className="fn-summary-item">
            <span className="fn-summary-label">Machines</span>
            <span className="fn-summary-value">{totals.count}</span>
          </div>
          <div className="fn-summary-item">
            <span className="fn-summary-label">Energy / Day</span>
            <span className="fn-summary-value">{totals.energy.toLocaleString()} kWh</span>
          </div>
          <div className="fn-summary-item">
            <span className="fn-summary-label">Avg Efficiency</span>
            <span className="fn-summary-value">{totals.avgEfficiency}%</span>
          </div>
        </div>
      </div>

      <h4 className="fn-section-title">Machines</h4>
      <div className="fn-cards-row">
        {machines.map((m) => (
          <div
            key={m.id}
            className={`panel fn-machine-card ${selectedId === m.id ? "selected" : ""}`}
            onClick={() => openDetails(m)}
          >
            <div>
              <div className="fn-machine-name">{m.name}</div>
              <div className="fn-machine-mfr">{m.manufacturer}</div>
            </div>
            <div className="fn-machine-stats">
              <div className="fn-machine-stat-row">
                <span>Energy Consumption</span>
                <span>{m.energy} kWh/day</span>
              </div>
              <div className="fn-machine-stat-row">
                <span>Power Rating</span>
                <span>{m.power} kW</span>
              </div>
              <div className="fn-machine-stat-row">
                <span>Efficiency</span>
                <span style={{ color: toneColor(statusTone(m.status)) }}>
                  {m.efficiency ? `${m.efficiency}%` : "—"}
                </span>
              </div>
            </div>
            <button
              className="fn-view-details-btn"
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
        <div className="fn-add-card" onClick={() => setShowAddForm(true)}>
          <div className="fn-add-plus">+</div>
          <span className="fn-add-label">Add Machine</span>
        </div>
      </div>

      {showAddForm && (
        <div className="fn-form-overlay" onClick={() => setShowAddForm(false)}>
          <form className="panel fn-form-panel" onClick={(e) => e.stopPropagation()} onSubmit={handleAddMachine}>
            <div className="fn-form-title">Add Machine</div>
            <div className="fn-form-field">
              <label>Machine Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. FinishFlex 500"
                required
              />
            </div>
            <div className="fn-form-field">
              <label>Manufacturer</label>
              <input
                value={form.manufacturer}
                onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                placeholder="e.g. TexFab Corp"
                required
              />
            </div>
            <div className="fn-form-field">
              <label>Energy Consumption (kWh/day)</label>
              <input
                type="number"
                value={form.energy}
                onChange={(e) => setForm((f) => ({ ...f, energy: e.target.value }))}
                placeholder="e.g. 350"
                required
              />
            </div>
            <div className="fn-form-field">
              <label>Power Rating (kW)</label>
              <input
                type="number"
                value={form.power}
                onChange={(e) => setForm((f) => ({ ...f, power: e.target.value }))}
                placeholder="e.g. 15"
                required
              />
            </div>
            <div className="fn-form-actions">
              <button type="button" className="fn-btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="fn-btn-primary">Add Machine</button>
            </div>
          </form>
        </div>
      )}

      {detailMachine && (
        <div className="fn-form-overlay" onClick={closeDetails}>
          <div className="panel fn-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="fn-detail-head">
              <div>
                <div className="fn-detail-name">{detailMachine.name}</div>
                <div className="fn-detail-mfr">{detailMachine.manufacturer}</div>
              </div>
              <button className="fn-detail-close" onClick={closeDetails} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="fn-detail-grid">
              <div className="fn-detail-stat">
                <span className="fn-detail-stat-label">Vibration</span>
                <span className="fn-detail-stat-value" style={{ color: toneColor(vibrationTone(detailMachine.vibration)) }}>
                  {detailMachine.vibration} mm/s
                </span>
              </div>
              <div className="fn-detail-stat">
                <span className="fn-detail-stat-label">Temperature</span>
                <span className="fn-detail-stat-value" style={{ color: toneColor(temperatureTone(detailMachine.temperature)) }}>
                  {detailMachine.temperature}°C
                </span>
              </div>
              <div className="fn-detail-stat">
                <span className="fn-detail-stat-label">Energy Consumption</span>
                <span className="fn-detail-stat-value">{detailMachine.energy} kWh/day</span>
              </div>
              <div className="fn-detail-stat">
                <span className="fn-detail-stat-label">Power Rating</span>
                <span className="fn-detail-stat-value">{detailMachine.power} kW</span>
              </div>
            </div>

            <button className="fn-3d-btn" onClick={() => setShow3D((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7-6.6 3.7-6.6-3.7L12 4.3ZM5 9.2l6 3.35v6.9l-6-3.35V9.2Zm8 10.25v-6.9l6-3.35v6.9l-6 3.35Z" />
              </svg>
              {show3D ? "Hide 3D Visualizer" : "3D Visualizer"}
            </button>

            {show3D && (
              <div className="fn-3d-viewport">
                <div className="fn-3d-scene">
                  <div className="fn-3d-cube">
                    <div className="fn-3d-face fn-face-front" />
                    <div className="fn-3d-face fn-face-back" />
                    <div className="fn-3d-face fn-face-right" />
                    <div className="fn-3d-face fn-face-left" />
                    <div className="fn-3d-face fn-face-top" />
                    <div className="fn-3d-face fn-face-bottom" />
                  </div>
                </div>
                <div className="fn-3d-caption">Live 3D preview of {detailMachine.name} — rotate to inspect machine geometry</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h4 className="fn-section-title">Machine Details</h4>
      <div className="panel fn-table-wrap">
        <table className="fn-table">
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
                  <td className="fn-name-cell">{m.name}</td>
                  <td className="mono">{m.energy} kWh/day</td>
                  <td>{m.manufacturer}</td>
                  <td className="mono">{formatDate(m.lastService)}</td>
                  <td className="mono">{formatDate(m.nextService)}</td>
                  <td className="mono">{m.totalEnergy ? `${m.totalEnergy.toLocaleString()} kWh` : "—"}</td>
                  <td className="mono">{m.power} kW</td>
                  <td>
                    <span
                      className="fn-badge"
                      style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
                    >
                      <span className="fn-status-dot" style={{ background: toneColor(tone) }} />
                      {m.status}
                    </span>
                  </td>
                  <td>{m.location}</td>
                  <td>{m.operator}</td>
                  <td className="mono">{m.efficiency ? `${m.efficiency}%` : "—"}</td>
                  <td className="fn-notes-cell">{m.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
