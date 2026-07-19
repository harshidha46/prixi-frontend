import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Carding Sector (detail page)
 * Reached via dashboard.jsx → Factory Sectors → "Carding" card → /carding
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const INITIAL_MACHINES = [
  {
    id: "m1",
    name: "CardMaster 1000",
    manufacturer: "TexFab Corp",
    energy: 350,
    power: 15,
    vibration: 2.9,
    temperature: 56,
    lastService: "2026-06-20",
    nextService: "2026-09-20",
    totalEnergy: 128400,
    status: "Active",
    location: "Carding Bay 1",
    operator: "R. Kumar",
    efficiency: 94.2,
    notes: "Running within normal parameters.",
  },
  {
    id: "m2",
    name: "FiberFlow Pro",
    manufacturer: "FiberTech Ltd",
    energy: 420,
    power: 18,
    vibration: 5.4,
    temperature: 69,
    lastService: "2026-06-05",
    nextService: "2026-09-05",
    totalEnergy: 151800,
    status: "Active",
    location: "Carding Bay 2",
    operator: "R. Kumar",
    efficiency: 91.5,
    notes: "Slight vibration noted during last inspection.",
  },
  {
    id: "m3",
    name: "SpinTex Alpha",
    manufacturer: "SpinWorks Inc",
    energy: 310,
    power: 12,
    vibration: 2.3,
    temperature: 52,
    lastService: "2026-07-01",
    nextService: "2026-10-01",
    totalEnergy: 98600,
    status: "Active",
    location: "Carding Bay 1",
    operator: "S. Velan",
    efficiency: 96.8,
    notes: "Recently serviced, performing well.",
  },
  {
    id: "m4",
    name: "CardWeave X7",
    manufacturer: "WeaveMach Co",
    energy: 500,
    power: 20,
    vibration: 7.2,
    temperature: 81,
    lastService: "2026-05-18",
    nextService: "2026-08-18",
    totalEnergy: 182000,
    status: "Maintenance",
    location: "Carding Bay 3",
    operator: "P. Anand",
    efficiency: 78.4,
    notes: "Scheduled for bearing replacement.",
  },
  {
    id: "m5",
    name: "TexCard Nova",
    manufacturer: "NovaTextile",
    energy: 280,
    power: 10,
    vibration: 3.1,
    temperature: 54,
    lastService: "2026-06-28",
    nextService: "2026-09-28",
    totalEnergy: 89200,
    status: "Active",
    location: "Carding Bay 2",
    operator: "S. Velan",
    efficiency: 95.1,
    notes: "Stable output, no issues reported.",
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

export default function Carding() {
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
    <div className="cd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .cd-root {
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
        .cd-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .cd-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; transition: background 0.15s, color 0.15s;
        }
        .cd-back:hover { background: var(--sage); color: #fff; }
        .cd-back svg { width: 14px; height: 14px; }

        .cd-header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
        .cd-title { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 600; margin: 0 0 6px 0; }
        .cd-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }
        .cd-summary { display: flex; gap: 18px; flex-wrap: wrap; }
        .cd-summary-item { display: flex; flex-direction: column; gap: 2px; text-align: right; }
        .cd-summary-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); }
        .cd-summary-value { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 600; }

        .cd-section-title {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted);
          margin: 26px 0 12px 0; display: flex; align-items: center; gap: 8px;
        }
        .cd-section-title::after { content: ""; flex: 1; height: 1px; background: var(--border-soft); }

        /* machine cards - horizontal */
        .cd-cards-row { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; }
        .cd-machine-card {
          flex: 0 0 200px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px;
          border-left: 4px solid var(--gold); cursor: pointer;
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .cd-machine-card:hover { box-shadow: 0 4px 14px rgba(31,61,46,0.08); }
        .cd-machine-card.selected { border-color: var(--forest); box-shadow: 0 0 0 2px rgba(31,61,46,0.18); }
        .cd-machine-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; line-height: 1.25; }
        .cd-machine-mfr { font-size: 11px; color: var(--ink-muted); }
        .cd-machine-stats { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
        .cd-machine-stat-row { display: flex; justify-content: space-between; font-size: 11.5px; }
        .cd-machine-stat-row span:first-child { color: var(--ink-muted); }
        .cd-machine-stat-row span:last-child { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
        .cd-status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 5px; }

        .cd-add-card {
          flex: 0 0 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; border: 1.5px dashed var(--border-soft); border-radius: 14px; cursor: pointer;
          color: var(--ink-muted); background: transparent; transition: border-color 0.15s, color 0.15s, background 0.15s;
          min-height: 158px;
        }
        .cd-add-card:hover { border-color: var(--gold); color: var(--forest); background: rgba(201,168,106,0.06); }
        .cd-add-plus {
          width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid currentColor;
          display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 300;
        }
        .cd-add-label { font-size: 12px; font-weight: 600; }

        /* add machine form (inline modal) */
        .cd-form-overlay {
          position: fixed; inset: 0; background: rgba(31,61,46,0.35); z-index: 20;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .cd-form-panel { width: 100%; max-width: 380px; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
        .cd-form-title { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .cd-form-field { display: flex; flex-direction: column; gap: 4px; }
        .cd-form-field label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .cd-form-field input {
          background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 8px;
          padding: 8px 10px; font-size: 12.5px; color: var(--ink-primary); outline: none;
        }
        .cd-form-field input:focus { border-color: var(--gold); }
        .cd-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
        .cd-btn-primary {
          background: var(--forest); border: none; border-radius: 8px; color: var(--oat);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .cd-btn-secondary {
          background: transparent; border: 1px solid var(--border-soft); border-radius: 8px; color: var(--ink-muted);
          font-size: 12.5px; font-weight: 600; padding: 9px 16px; cursor: pointer;
        }
        .cd-btn-secondary:hover { color: var(--forest); border-color: var(--forest); }

        /* view details button on machine cards */
        .cd-view-details-btn {
          all: unset; box-sizing: border-box;
          display: inline-flex; align-items: center; justify-content: center; gap: 4px;
          margin-top: 2px; padding: 7px 10px; border-radius: 8px;
          background: var(--bg-panel-raised); color: var(--forest);
          font-size: 11px; font-weight: 700; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .cd-view-details-btn svg { width: 12px; height: 12px; }
        .cd-view-details-btn:hover { background: var(--forest); color: var(--oat); }

        /* machine details popup */
        .cd-detail-panel {
          width: 100%; max-width: 420px; padding: 24px; display: flex; flex-direction: column; gap: 18px;
        }
        .cd-detail-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .cd-detail-name { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--forest); }
        .cd-detail-mfr { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
        .cd-detail-close {
          all: unset; box-sizing: border-box; cursor: pointer; color: var(--ink-muted);
          width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.15s, color 0.15s; flex-shrink: 0;
        }
        .cd-detail-close:hover { background: var(--bg-panel-raised); color: var(--forest); }
        .cd-detail-close svg { width: 16px; height: 16px; }

        .cd-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cd-detail-stat {
          display: flex; flex-direction: column; gap: 4px; padding: 12px 14px;
          border-radius: 10px; background: var(--bg-panel-raised);
        }
        .cd-detail-stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); }
        .cd-detail-stat-value { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: var(--ink-primary); }

        .cd-3d-btn {
          all: unset; box-sizing: border-box;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--forest); color: var(--oat); border-radius: 10px;
          padding: 11px 16px; font-size: 12.5px; font-weight: 700; cursor: pointer;
          transition: background 0.15s;
        }
        .cd-3d-btn:hover { background: #16301f; }
        .cd-3d-btn svg { width: 16px; height: 16px; }

        /* placeholder 3D preview */
        .cd-3d-viewport { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .cd-3d-scene {
          width: 100%; height: 140px; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center, rgba(31,61,46,0.06) 0%, transparent 70%);
          border-radius: 12px; perspective: 500px;
        }
        .cd-3d-cube {
          width: 60px; height: 60px; position: relative; transform-style: preserve-3d;
          animation: cd-spin 7s linear infinite;
        }
        .cd-3d-face {
          position: absolute; width: 60px; height: 60px;
          background: rgba(31,61,46,0.14); border: 1.5px solid var(--forest);
          border-radius: 4px;
        }
        .cd-face-front { transform: translateZ(30px); }
        .cd-face-back { transform: translateZ(-30px) rotateY(180deg); }
        .cd-face-right { transform: rotateY(90deg) translateZ(30px); }
        .cd-face-left { transform: rotateY(-90deg) translateZ(30px); }
        .cd-face-top { transform: rotateX(90deg) translateZ(30px); background: rgba(201,168,106,0.22); }
        .cd-face-bottom { transform: rotateX(-90deg) translateZ(30px); }
        @keyframes cd-spin {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }
        .cd-3d-caption { font-size: 11px; color: var(--ink-muted); text-align: center; max-width: 320px; line-height: 1.4; }

        /* table */
        .cd-table-wrap { overflow-x: auto; }
        .cd-table { width: 100%; border-collapse: collapse; font-size: 11.5px; min-width: 1100px; }
        .cd-table th {
          text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--ink-muted); padding: 10px 12px; border-bottom: 1px solid var(--border-soft);
          white-space: nowrap; position: sticky; top: 0; background: var(--bg-panel);
        }
        .cd-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-soft); vertical-align: top; }
        .cd-table tr:last-child td { border-bottom: none; }
        .cd-table tr.selected { background: rgba(201,168,106,0.09); }
        .cd-table .mono { font-family: 'JetBrains Mono', monospace; }
        .cd-table .cd-name-cell { font-family: 'Fraunces', serif; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
        .cd-table .cd-notes-cell { max-width: 220px; color: var(--ink-muted); }
        .cd-badge { font-size: 10px; padding: 3px 9px; border-radius: 999px; font-weight: 700; white-space: nowrap; }

        @media (max-width: 700px) {
          .cd-header-row { flex-direction: column; align-items: flex-start; }
          .cd-summary { text-align: left; }
          .cd-summary-item { text-align: left; }
        }
      `}</style>

      <button className="cd-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="cd-header-row">
        <div>
          <h1 className="cd-title">Carding</h1>
          <p className="cd-subtitle">Machine-level monitoring for the Carding sector</p>
        </div>
        <div className="cd-summary">
          <div className="cd-summary-item">
            <span className="cd-summary-label">Machines</span>
            <span className="cd-summary-value">{totals.count}</span>
          </div>
          <div className="cd-summary-item">
            <span className="cd-summary-label">Energy / Day</span>
            <span className="cd-summary-value">{totals.energy.toLocaleString()} kWh</span>
          </div>
          <div className="cd-summary-item">
            <span className="cd-summary-label">Avg Efficiency</span>
            <span className="cd-summary-value">{totals.avgEfficiency}%</span>
          </div>
        </div>
      </div>

      <h4 className="cd-section-title">Machines</h4>
      <div className="cd-cards-row">
        {machines.map((m) => (
          <div
            key={m.id}
            className={`panel cd-machine-card ${selectedId === m.id ? "selected" : ""}`}
            onClick={() => openDetails(m)}
          >
            <div>
              <div className="cd-machine-name">{m.name}</div>
              <div className="cd-machine-mfr">{m.manufacturer}</div>
            </div>
            <div className="cd-machine-stats">
              <div className="cd-machine-stat-row">
                <span>Energy Consumption</span>
                <span>{m.energy} kWh/day</span>
              </div>
              <div className="cd-machine-stat-row">
                <span>Power Rating</span>
                <span>{m.power} kW</span>
              </div>
            </div>
            <button
              className="cd-view-details-btn"
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
        <div className="cd-add-card" onClick={() => setShowAddForm(true)}>
          <div className="cd-add-plus">+</div>
          <span className="cd-add-label">Add Machine</span>
        </div>
      </div>

      {showAddForm && (
        <div className="cd-form-overlay" onClick={() => setShowAddForm(false)}>
          <form className="panel cd-form-panel" onClick={(e) => e.stopPropagation()} onSubmit={handleAddMachine}>
            <div className="cd-form-title">Add Machine</div>
            <div className="cd-form-field">
              <label>Machine Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. CardFlex 200"
                required
              />
            </div>
            <div className="cd-form-field">
              <label>Manufacturer</label>
              <input
                value={form.manufacturer}
                onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))}
                placeholder="e.g. TexFab Corp"
                required
              />
            </div>
            <div className="cd-form-field">
              <label>Energy Consumption (kWh/day)</label>
              <input
                type="number"
                value={form.energy}
                onChange={(e) => setForm((f) => ({ ...f, energy: e.target.value }))}
                placeholder="e.g. 350"
                required
              />
            </div>
            <div className="cd-form-field">
              <label>Power Rating (kW)</label>
              <input
                type="number"
                value={form.power}
                onChange={(e) => setForm((f) => ({ ...f, power: e.target.value }))}
                placeholder="e.g. 15"
                required
              />
            </div>
            <div className="cd-form-actions">
              <button type="button" className="cd-btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="cd-btn-primary">Add Machine</button>
            </div>
          </form>
        </div>
      )}

      {detailMachine && (
        <div className="cd-form-overlay" onClick={closeDetails}>
          <div className="panel cd-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cd-detail-head">
              <div>
                <div className="cd-detail-name">{detailMachine.name}</div>
                <div className="cd-detail-mfr">{detailMachine.manufacturer}</div>
              </div>
              <button className="cd-detail-close" onClick={closeDetails} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="cd-detail-grid">
              <div className="cd-detail-stat">
                <span className="cd-detail-stat-label">Vibration</span>
                <span className="cd-detail-stat-value" style={{ color: toneColor(vibrationTone(detailMachine.vibration)) }}>
                  {detailMachine.vibration} mm/s
                </span>
              </div>
              <div className="cd-detail-stat">
                <span className="cd-detail-stat-label">Temperature</span>
                <span className="cd-detail-stat-value" style={{ color: toneColor(temperatureTone(detailMachine.temperature)) }}>
                  {detailMachine.temperature}°C
                </span>
              </div>
              <div className="cd-detail-stat">
                <span className="cd-detail-stat-label">Energy Consumption</span>
                <span className="cd-detail-stat-value">{detailMachine.energy} kWh/day</span>
              </div>
              <div className="cd-detail-stat">
                <span className="cd-detail-stat-label">Power Rating</span>
                <span className="cd-detail-stat-value">{detailMachine.power} kW</span>
              </div>
            </div>

            <button className="cd-3d-btn" onClick={() => setShow3D((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7-6.6 3.7-6.6-3.7L12 4.3ZM5 9.2l6 3.35v6.9l-6-3.35V9.2Zm8 10.25v-6.9l6-3.35v6.9l-6 3.35Z" />
              </svg>
              {show3D ? "Hide 3D Visualizer" : "3D Visualizer"}
            </button>

            {show3D && (
              <div className="cd-3d-viewport">
                <div className="cd-3d-scene">
                  <div className="cd-3d-cube">
                    <div className="cd-3d-face cd-face-front" />
                    <div className="cd-3d-face cd-face-back" />
                    <div className="cd-3d-face cd-face-right" />
                    <div className="cd-3d-face cd-face-left" />
                    <div className="cd-3d-face cd-face-top" />
                    <div className="cd-3d-face cd-face-bottom" />
                  </div>
                </div>
                <div className="cd-3d-caption">Live 3D preview of {detailMachine.name} — rotate to inspect machine geometry</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h4 className="cd-section-title">Machine Details</h4>
      <div className="panel cd-table-wrap">
        <table className="cd-table">
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
                  <td className="cd-name-cell">{m.name}</td>
                  <td className="mono">{m.energy} kWh/day</td>
                  <td>{m.manufacturer}</td>
                  <td className="mono">{formatDate(m.lastService)}</td>
                  <td className="mono">{formatDate(m.nextService)}</td>
                  <td className="mono">{m.totalEnergy ? `${m.totalEnergy.toLocaleString()} kWh` : "—"}</td>
                  <td className="mono">{m.power} kW</td>
                  <td>
                    <span
                      className="cd-badge"
                      style={{ color: toneColor(tone), background: "rgba(31,61,46,0.06)", border: `1px solid ${toneColor(tone)}55` }}
                    >
                      <span className="cd-status-dot" style={{ background: toneColor(tone) }} />
                      {m.status}
                    </span>
                  </td>
                  <td>{m.location}</td>
                  <td>{m.operator}</td>
                  <td className="mono">{m.efficiency ? `${m.efficiency}%` : "—"}</td>
                  <td className="cd-notes-cell">{m.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
