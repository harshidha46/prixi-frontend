import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Spinning Sector (detail page)
 * Reached via dashboard.jsx → Factory Sectors → "Spinning" card → /spinning
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const INITIAL_MACHINES = [
  {
    id: "m1",
    name: "SpinMaster 2000",
    manufacturer: "YarnTech Industries",
    energy: 420,
    power: 18,
    vibration: 3.2,
    temperature: 58,
    lastService: "2026-06-22",
    nextService: "2026-09-22",
    totalEnergy: 154200,
    status: "Active",
    location: "Spinning Bay 1",
    operator: "S. Velan",
    efficiency: 93.6,
    notes: "Running within normal parameters.",
  },
  {
    id: "m2",
    name: "TwistFlow X5",
    manufacturer: "FiberWorks Ltd",
    energy: 390,
    power: 16,
    vibration: 4.1,
    temperature: 62,
    lastService: "2026-06-10",
    nextService: "2026-09-10",
    totalEnergy: 142700,
    status: "Active",
    location: "Spinning Bay 2",
    operator: "S. Velan",
    efficiency: 90.8,
    notes: "Minor thread tension drift under observation.",
  },
  {
    id: "m3",
    name: "RotoSpin Elite",
    manufacturer: "SpinPro Machinery",
    energy: 450,
    power: 20,
    vibration: 6.8,
    temperature: 79,
    lastService: "2026-05-30",
    nextService: "2026-08-30",
    totalEnergy: 168400,
    status: "Maintenance",
    location: "Spinning Bay 3",
    operator: "P. Anand",
    efficiency: 74.2,
    notes: "Scheduled for spindle motor inspection.",
  },
  {
    id: "m4",
    name: "TexTwine Nova",
    manufacturer: "TexFab Corp",
    energy: 370,
    power: 15,
    vibration: 2.7,
    temperature: 55,
    lastService: "2026-07-02",
    nextService: "2026-10-02",
    totalEnergy: 121600,
    status: "Active",
    location: "Spinning Bay 1",
    operator: "R. Kumar",
    efficiency: 95.4,
    notes: "Recently serviced, performing well.",
  },
  {
    id: "m5",
    name: "YarnWeave Prime",
    manufacturer: "WeaveMach Co",
    energy: 340,
    power: 14,
    vibration: 3.9,
    temperature: 60,
    lastService: "2026-06-15",
    nextService: "2026-09-15",
    totalEnergy: 108900,
    status: "Idle",
    location: "Spinning Bay 2",
    operator: "R. Kumar",
    efficiency: 88.1,
    notes: "Idle between batch changeovers.",
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

export default function Spinning() {
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
    <div className="sp2-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .sp2-root {
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
        .sp2-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .sp2-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .sp2-back:hover { background: var(--sage); color: #fff; }
        .sp2-back svg { width: 14px; height: 14px; }

        .sp2-header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
        .sp2-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 600; margin: 0 0 6px 0; }
        .sp2-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }
        .sp2-summary { display: flex; gap: 18px; flex-wrap: wrap; }
        .sp2-summary-item { display: flex; flex-direction: column; gap: 2px; text-align: right; }
        .sp2-summary-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); }
        .sp2-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 600; }

        .sp2-section-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted);
          margin: 26px 0 12px 0; display: flex; align-items: center; gap: 8px;
        }
        .sp2-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border-soft); }

        /* machine cards - horizontal */
        .sp2-cards-row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; }
        .sp2-machine-card {
          flex: 0 0 200px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;
          border-left: 4px solid var(--gold); cursor: pointer;
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .sp2-machine-card:hover { box-shadow: 0 4px 14px rgba(31,61,46,0.08); }
        .sp2-machine-card.selected { border-color: var(--forest); box-shadow: 0 0 0 2px rgba(31,61,46,0.18); }
        .sp2-machine-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; line-height: 1.25; }
        .sp2-machine-mfr { font-size: 11px; color: var(--ink-muted); }
        .sp2-machine-stats { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
        .sp2-machine-stat-row { display: flex; justify-content: space-between; font-size: 11.5px; }
        .sp2-machine-stat-row span:first-child { color: var(--ink-muted); }
        .sp2-machine-stat-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .sp2-status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 5px; }

        .sp2-add-card {
          flex: 0 0 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; border: 1.5px dashed var(--border-soft); border-radius: 14px; cursor: pointer;
          color: var(--ink-muted); background: transparent; transition: border-color 0.15s, color 0.15s, background 0.15s;
          min-height: 158px;
        }
        .sp2-add-card:hover { border-color: var(--gold); color: var(--forest); background: rgba(201,168,106,0.06); }
        .sp2-add-plus {
          width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid currentColor;
          display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 300;
        }
        .sp2-add-label { font-size: 12px; font-weight: 600; }

        /* add machine form (inline modal) */
        .sp2-form-overlay {
          position: fixed; inset: 0; background: rgba(31,61,46,0.35); z-index: 20;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .sp2-form-panel { width: 100%; max-width: 380px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
        .sp2-form-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .sp2-form-field { display: flex; flex-direction: column; gap: 4px; }
        .sp2-form-field label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .sp2-form-field input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 8px 10px; font-size: 12.5px; color: var(--ink-primary); outline: none;
        }
        .sp2-form-field input:focus { border-color: var(--gold); }
        .sp2-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
        .sp2-btn-primary {
          background: var(--forest); border: none; border-radius: 8px; color: var(--oat);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .sp2-btn-secondary {
          background: transparent; border: 1px solid var(--border-soft); border-radius: 8px; color: var(--ink-muted);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .sp2-btn-secondary:hover { color: var(--forest); border-color: var(--forest); }

        /* view details button on machine cards */
        .sp2-view-details-btn {
          all: unset; box-sizing: border-box;
          display: inline-flex; align-items: center; justify-content: center; gap: 4px;
          margin-top: 2px; padding: 7px 10px; border-radius: 8px;
          background: var(--bg-panel-raised); color: var(--forest);
          font-size: 11px; font-weight: 700; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .sp2-view-details-btn svg { width: 12px; height: 12px; }
        .sp2-view-details-btn:hover { background: var(--forest); color: var(--oat); }

        /* machine details popup */
        .sp2-detail-panel {
          width: 100%; max-width: 420px; padding: 24px; display: flex; flex-direction: column; gap: 18px;
        }
        .sp2-detail-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .sp2-detail-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--forest); }
        .sp2-detail-mfr { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
        .sp2-detail-close {
          all: unset; box-sizing: border-box; cursor: pointer; color: var(--ink-muted);
          width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .sp2-detail-close:hover { background: var(--bg-panel-raised); color: var(--forest); }
        .sp2-detail-close svg { width: 16px; height: 16px; }

        .sp2-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .sp2-detail-stat {
          display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
          border-radius: 10px; background: var(--bg-panel-raised);
        }
        .sp2-detail-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .sp2-detail-stat-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: var(--ink-primary); }

        .sp2-3d-btn {
          all: unset; box-sizing: border-box;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--forest); color: var(--oat); border-radius: 10px;
          padding: 11px 16px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          transition: background 0.15s;
        }
        .sp2-3d-btn:hover { background: #16301f; }
        .sp2-3d-btn svg { width: 16px; height: 16px; }

        /* placeholder 3D preview */
        .sp2-3d-viewport { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .sp2-3d-scene {
          width: 100%; height: 140px; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center, rgba(31,61,46,0.06) 0%, transparent 70%);
          border-radius: 12px; perspective: 500px;
        }
        .sp2-3d-cube {
          width: 60px; height: 60px; position: relative; transform-style: preserve-3d;
          animation: sp2-spin 7s linear infinite;
        }
        .sp2-3d-face {
          position: absolute; width: 60px; height: 60px;
          background: rgba(31,61,46,0.14); border: 1.5px solid var(--forest);
          border-radius: 4px;
        }
        .sp2-face-front { transform: translateZ(30px); }
        .sp2-face-back { transform: translateZ(-30px) rotateY(180deg); }
        .sp2-face-right { transform: rotateY(90deg) translateZ(30px); }
        .sp2-face-left { transform: rotateY(-90deg) translateZ(30px); }
        .sp2-face-top { transform: rotateX(90deg) translateZ(30px); background: rgba(201,168,106,0.22); }
        .sp2-face-bottom { transform: rotateX(-90deg) translateZ(30px); }
        @keyframes sp2-spin {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }
        .sp2-3d-caption { font-size: 11px; color: var(--ink-muted); text-align: center; max-width: 320px; line-height: 1.4; }

        /* table */
        .sp2-table-wrap { overflow-x: auto; }
        .sp2-table { width: 100%; border-collapse: collapse; font-size: 11.5px; min-width: 1100px; }
        .sp2-table th {
          text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--ink-muted); padding: 10px 12px; border-bottom: 1px solid var(--border-soft);
          white-space: nowrap; position: sticky; top: 0; background: var(--bg-panel);
        }
        .sp2-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-soft); vertical-align: top; }
        .sp2-table tr:last-child td { border-bottom: none; }
        .sp2-table tr.selected { background: rgba(201,168,106,0.09); }
        .sp2-table .mono { font-family: 'JetBrains Mono', monospace; }
        .sp2-table .sp2-name-cell { font-family: 'Fraunces', serif; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
        .sp2-table .sp2-notes-cell { max-width: 220px; color: var(--ink-muted); }
        .sp2-badge { font-size: 10px; padding: 3px 9px; border-radius: 999px; font-weight: 700; white-space: nowrap; }

        @media (max-width: 700px) {
          .sp2-header-row { flex-direction: column; align-items: flex-start; }
          .sp2-summary { text-align: left; }
          .sp2-summary-item { text-align: left; }
        }
      `}</style>

      <button className="sp2-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="sp2-header-row">
        <div>
          <h1 className="sp2-title">Spinning</h1>
          <p className="sp2-subtitle">Machine-level monitoring for the Spinning sector</p>
        </div>
        <div className="sp2-summary">
          <div className="sp2-summary-item">
            <span className="sp2-summary-label">Machines</span>
            <span className="sp2-summary-value">{totals.count}</span>
          </div>
          <div className="sp2-summary-item">
            <span className="sp2-summary-label">Energy / Day</span>
            <span className="sp2-summary-value">{totals.energy.toLocaleString()} kWh</span>
          </div>
          <div className="sp2-summary-item">
            <span className="sp2-summary-label">Avg Efficiency</span>
            <span className="sp2-summary-value">{totals.avgEfficiency}%</span>
          </div>
        </div>
      </div>

      <h4 className="sp2-section-title">Machines</h4>
      <div className="sp2-cards-row">
        {machines.map((m) => (
          <div
            key={m.id}
            className={`panel sp2-machine-card ${selectedId === m.id ? "selected" : ""}`}
            onClick={() => openDetails(m)}
          >
            <div>
              <div className="sp2-machine-name">{m.name}</div>
              <div className="sp2-machine-mfr">{m.manufacturer}</div>
            </div>
            <div className="sp2-machine-stats">
              <div className="sp2-machine-stat-row">
                <span>Energy Consumption</span>
                <span>{m.energy} kWh/day</span>
              </div>
              <div className="sp2-machine-stat-row">
                <span>Power Rating</span>
                <span>{m.power} kW</span>
              </div>
            </div>
            <button
              className="sp2-view-details-btn"
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
        <div className="sp2-add-card" onClick={() => setShowAddForm(true)}>
          <div className="sp2-add-plus">+</div>
          <span className="sp2-add-label">Add Machine</span>
        </div>
      </div>

      {showAddForm && (
        <div className="sp2-form-overlay" onClick={() => setShowAddForm(false)}>
          <form className="panel sp2-form-panel" onClick={(e) => e.stopPropagation()} onSubmit={handleAddMachine}>
            <div className="sp2-form-title">Add Machine</div>
            <div className="sp2-form-field">
              <label>Machine Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. SpinFlex 300"
                required
              />
            </div>
            <div className="sp2-form-field">
              <label>Manufacturer</label>
              <input
                value={form.manufacturer}
                onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                placeholder="e.g. TexFab Corp"
                required
              />
            </div>
            <div className="sp2-form-field">
              <label>Energy Consumption (kWh/day)</label>
              <input
                type="number"
                value={form.energy}
                onChange={(e) => setForm((f) => ({ ...f, energy: e.target.value }))}
                placeholder="e.g. 350"
                required
              />
            </div>
            <div className="sp2-form-field">
              <label>Power Rating (kW)</label>
              <input
                type="number"
                value={form.power}
                onChange={(e) => setForm((f) => ({ ...f, power: e.target.value }))}
                placeholder="e.g. 15"
                required
              />
            </div>
            <div className="sp2-form-actions">
              <button type="button" className="sp2-btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="sp2-btn-primary">Add Machine</button>
            </div>
          </form>
        </div>
      )}

      {detailMachine && (
        <div className="sp2-form-overlay" onClick={closeDetails}>
          <div className="panel sp2-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="sp2-detail-head">
              <div>
                <div className="sp2-detail-name">{detailMachine.name}</div>
                <div className="sp2-detail-mfr">{detailMachine.manufacturer}</div>
              </div>
              <button className="sp2-detail-close" onClick={closeDetails} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sp2-detail-grid">
              <div className="sp2-detail-stat">
                <span className="sp2-detail-stat-label">Vibration</span>
                <span className="sp2-detail-stat-value" style={{ color: toneColor(vibrationTone(detailMachine.vibration)) }}>
                  {detailMachine.vibration} mm/s
                </span>
              </div>
              <div className="sp2-detail-stat">
                <span className="sp2-detail-stat-label">Temperature</span>
                <span className="sp2-detail-stat-value" style={{ color: toneColor(temperatureTone(detailMachine.temperature)) }}>
                  {detailMachine.temperature}°C
                </span>
              </div>
              <div className="sp2-detail-stat">
                <span className="sp2-detail-stat-label">Energy Consumption</span>
                <span className="sp2-detail-stat-value">{detailMachine.energy} kWh/day</span>
              </div>
              <div className="sp2-detail-stat">
                <span className="sp2-detail-stat-label">Power Rating</span>
                <span className="sp2-detail-stat-value">{detailMachine.power} kW</span>
              </div>
            </div>

            <button className="sp2-3d-btn" onClick={() => setShow3D((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7-6.6 3.7-6.6-3.7L12 4.3ZM5 9.2l6 3.35v6.9l-6-3.35V9.2Zm8 10.25v-6.9l6-3.35v6.9l-6 3.35Z" />
              </svg>
              {show3D ? "Hide 3D Visualizer" : "3D Visualizer"}
            </button>

            {show3D && (
              <div className="sp2-3d-viewport">
                <div className="sp2-3d-scene">
                  <div className="sp2-3d-cube">
                    <div className="sp2-3d-face sp2-face-front" />
                    <div className="sp2-3d-face sp2-face-back" />
                    <div className="sp2-3d-face sp2-face-right" />
                    <div className="sp2-3d-face sp2-face-left" />
                    <div className="sp2-3d-face sp2-face-top" />
                    <div className="sp2-3d-face sp2-face-bottom" />
                  </div>
                </div>
                <div className="sp2-3d-caption">Live 3D preview of {detailMachine.name} — rotate to inspect machine geometry</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h4 className="sp2-section-title">Machine Details</h4>
      <div className="panel sp2-table-wrap">
        <table className="sp2-table">
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
                  <td className="sp2-name-cell">{m.name}</td>
                  <td className="mono">{m.energy} kWh/day</td>
                  <td>{m.manufacturer}</td>
                  <td className="mono">{formatDate(m.lastService)}</td>
                  <td className="mono">{formatDate(m.nextService)}</td>
                  <td className="mono">{m.totalEnergy ? `${m.totalEnergy.toLocaleString()} kWh` : "—"}</td>
                  <td className="mono">{m.power} kW</td>
                  <td>
                    <span
                      className="sp2-badge"
                      style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
                    >
                      <span className="sp2-status-dot" style={{ background: toneColor(tone) }} />
                      {m.status}
                    </span>
                  </td>
                  <td>{m.location}</td>
                  <td>{m.operator}</td>
                  <td className="mono">{m.efficiency ? `${m.efficiency}%` : "—"}</td>
                  <td className="sp2-notes-cell">{m.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
