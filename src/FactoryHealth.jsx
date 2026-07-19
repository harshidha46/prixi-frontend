import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Factory Health Score (detail page)
 * Same palette/typography system as the main dashboard:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 */

const OVERALL_SCORE = 87;

const BREAKDOWN = [
  {
    key: "machine",
    label: "Machine Health & Reliability",
    score: 91,
    tone: "good",
    note: "Low vibration & wear signatures across active lines",
  },
  {
    key: "efficiency",
    label: "Production Efficiency",
    score: 84,
    tone: "good",
    note: "Throughput tracking close to plan this week",
  },
  {
    key: "energy",
    label: "Energy Efficiency",
    score: 78,
    tone: "warn",
    note: "kWh per unit output slightly above target",
  },
  {
    key: "carbon",
    label: "Carbon Footprint",
    score: 82,
    tone: "good",
    note: "Emissions intensity trending down month-on-month",
  },
  {
    key: "worker",
    label: "Worker Utilization & Safety",
    score: 93,
    tone: "good",
    note: "Zero safety incidents, high shift utilization",
  },
  {
    key: "ai",
    label: "AI Readiness & Downtime Patterns",
    score: 76,
    tone: "warn",
    note: "Predictive coverage growing; some blind spots remain",
  },
];

const TREND = {
  weekly: [79, 81, 80, 83, 85, 84, 86, 87],
  monthly: [72, 75, 79, 87],
};

function toneColor(tone) {
  return { good: "var(--status-good)", warn: "var(--status-warn)", bad: "var(--status-bad)" }[tone];
}

function BigScoreRing({ score = 87, size = 220 }) {
  const rings = [
    { r: 92, pct: Math.min(score, 100) / 100, color: "var(--accent-forest)", width: 14 },
    { r: 74, pct: Math.min(score + 6, 100) / 100, color: "var(--accent-gold)", width: 10 },
    { r: 58, pct: Math.min(score - 9, 100) / 100, color: "var(--accent-sage-dark)", width: 8 },
  ];
  const C = 2 * Math.PI;
  const vb = 200;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`}>
      <g transform={`translate(${vb / 2},${vb / 2}) rotate(-90)`}>
        {rings.map((ring, i) => (
          <g key={i}>
            <circle r={ring.r} fill="none" stroke="rgba(31,61,46,0.09)" strokeWidth={ring.width} />
            <circle
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.width}
              strokeLinecap="round"
              strokeDasharray={`${ring.r * C} ${ring.r * C}`}
              strokeDashoffset={ring.r * C * (1 - ring.pct)}
            />
          </g>
        ))}
      </g>
      <text
        x={vb / 2}
        y={vb / 2 + 14}
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="600"
        fontSize="56"
        fill="var(--ink-primary)"
      >
        {score}
      </text>
    </svg>
  );
}

function TrendChart({ values, labels }) {
  const w = 560, h = 160, pad = 24;
  const max = Math.max(...values) + 5;
  const min = Math.min(...values) - 5;
  const span = values.length - 1;

  const pointFor = (v, i) => {
    const x = pad + (i / span) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  };

  const linePts = values.map((v, i) => pointFor(v, i).join(",")).join(" ");
  const areaPts =
    `${pad},${h - pad} ` + values.map((v, i) => pointFor(v, i).join(",")).join(" ") + ` ${w - pad},${h - pad}`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={pad}
          x2={w - pad}
          y1={pad + (i * (h - pad * 2)) / 3}
          y2={pad + (i * (h - pad * 2)) / 3}
          stroke="rgba(31,61,46,0.08)"
          strokeWidth="1"
        />
      ))}
      <polygon points={areaPts} fill="var(--accent-forest)" opacity="0.08" />
      <polyline points={linePts} fill="none" stroke="var(--accent-forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = pointFor(v, i);
        return <circle key={i} cx={x} cy={y} r="4" fill="var(--accent-gold)" stroke="var(--bg-panel)" strokeWidth="1.5" />;
      })}
      {labels.map((lab, i) => {
        const [x] = pointFor(values[i], i);
        return (
          <text key={i} x={x} y={h - 4} textAnchor="middle" fontSize="10" fill="var(--ink-muted)" fontFamily="Inter, sans-serif">
            {lab}
          </text>
        );
      })}
    </svg>
  );
}

export default function FactoryHealth() {
  const navigate = useNavigate();

  const weeklyLabels = useMemo(() => TREND.weekly.map((_, i) => `W${i + 1}`), []);

  return (
    <div className="fh-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .fh-root {
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
        .fh-root * { box-sizing: border-box; }

        .fh-back {
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
          margin-bottom: 20px;
          transition: background 0.15s, color 0.15s;
        }
        .fh-back:hover { background: var(--sage); color: #fff; }
        .fh-back svg { width: 14px; height: 14px; }

        .fh-header { margin-bottom: 22px; }
        .fh-title {
          font-family: 'Fraunces', serif;
          font-size: 30px;
          font-weight: 600;
          margin: 0 0 6px 0;
        }
        .fh-subtitle { font-size: 13.5px; color: var(--ink-muted); margin: 0; }

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

        .fh-score-panel {
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 28px 32px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .fh-score-meta { display: flex; flex-direction: column; gap: 8px; min-width: 220px; }
        .fh-score-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-muted);
        }
        .fh-score-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--status-good);
        }
        .fh-score-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--status-good); }
        .fh-benchmark {
          font-size: 12.5px;
          color: var(--ink-muted);
          line-height: 1.5;
          border-left: 3px solid var(--gold);
          padding-left: 10px;
          max-width: 320px;
        }

        .fh-section-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ink-muted);
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fh-section-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border-soft);
        }

        .fh-breakdown-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .fh-metric-card {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-left: 4px solid var(--gold);
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
        }
        .fh-metric-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .fh-metric-label {
          font-family: 'Fraunces', serif;
          font-size: 13.5px;
          font-weight: 600;
          line-height: 1.3;
        }
        .fh-metric-score {
          font-family: 'JetBrains Mono', monospace;
          font-size: 20px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .fh-metric-bar-track {
          height: 6px;
          border-radius: 4px;
          background: var(--bg-panel-raised);
          overflow: hidden;
        }
        .fh-metric-bar-fill { height: 100%; border-radius: 4px; }
        .fh-metric-note { font-size: 11.5px; color: var(--ink-muted); line-height: 1.4; }

        .fh-trend-panel { padding: 20px 24px; margin-bottom: 20px; }
        .fh-trend-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
        .fh-trend-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; }
        .fh-trend-current { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--status-good); }

        @media (max-width: 900px) {
          .fh-breakdown-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .fh-breakdown-grid { grid-template-columns: 1fr; }
          .fh-score-panel { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <button className="fh-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="fh-header">
        <h1 className="fh-title">Factory Health Score</h1>
        <p className="fh-subtitle">Your factory's overall performance benchmark</p>
      </div>

      <div className="panel fh-score-panel">
        <BigScoreRing score={OVERALL_SCORE} size={200} />
        <div className="fh-score-meta">
          <span className="fh-score-label">Overall Score</span>
          <span className="fh-score-status">
            <span className="fh-score-status-dot" />
            Healthy &amp; Stable
          </span>
          <p className="fh-benchmark">
            Above average compared to similar MSMEs in Tamil Nadu — top quartile for machine reliability and worker safety.
          </p>
        </div>
      </div>

      <h4 className="fh-section-title">Score Breakdown</h4>
      <div className="fh-breakdown-grid">
        {BREAKDOWN.map((m) => (
          <div className="panel fh-metric-card" key={m.key}>
            <div className="fh-metric-top">
              <div className="fh-metric-label">{m.label}</div>
              <div className="fh-metric-score" style={{ color: toneColor(m.tone) }}>
                {m.score}
              </div>
            </div>
            <div className="fh-metric-bar-track">
              <div
                className="fh-metric-bar-fill"
                style={{ width: `${m.score}%`, background: toneColor(m.tone) }}
              />
            </div>
            <div className="fh-metric-note">{m.note}</div>
          </div>
        ))}
      </div>

      <div className="panel fh-trend-panel">
        <div className="fh-trend-head">
          <span className="fh-trend-title">Score Trend — Last 8 Weeks</span>
          <span className="fh-trend-current">▲ +8 pts since W1</span>
        </div>
        <TrendChart values={TREND.weekly} labels={weeklyLabels} />
      </div>
    </div>
  );
}
