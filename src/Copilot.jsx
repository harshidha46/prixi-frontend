import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI — Copilot (full-page AI assistant interface)
 * Same palette/typography system as the rest of the PRIXI suite:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 * Clean, assistant-focused design — no charts or analytics visuals.
 */

const QUICK_ACTIONS = [
  {
    key: "roi",
    label: "Generate ROI Report",
    icon: (
      <path d="M3 3v18h18M7 15l4-5 3 3 5-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    key: "maintenance",
    label: "Predict Maintenance Needs",
    icon: (
      <path
        d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.7 2.7-2-2 2.7-2.7Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    key: "energy",
    label: "Optimize Energy Usage",
    icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    key: "efficiency",
    label: "View Efficiency Trends",
    icon: (
      <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

const SUGGESTIONS = [
  "Show me top 3 machines by efficiency",
  "Compare spinning vs finishing energy usage",
  "Suggest ways to reduce downtime",
];

export default function Copilot() {
  const navigate = useNavigate();
  const [chatValue, setChatValue] = useState("");
  const [chatLog, setChatLog] = useState([]);

  function handleSend(text) {
    const value = (text ?? chatValue).trim();
    if (!value) return;
    setChatLog((log) => [...log, { role: "user", text: value }]);
    setChatValue("");
  }

  return (
    <div className="cp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .cp-root {
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
          display: flex;
          flex-direction: column;
        }
        .cp-root * { box-sizing: border-box; }

        .panel {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 14px;
          position: relative; box-shadow: 0 1px 2px rgba(31,61,46,0.04);
        }
        .panel::before {
          content: ""; position: absolute; top: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,106,0.55), transparent);
        }

        .cp-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--forest);
          cursor: pointer; margin-bottom: 20px; width: fit-content; transition: background 0.15s, color 0.15s;
        }
        .cp-back:hover { background: var(--sage); color: #fff; }
        .cp-back svg { width: 14px; height: 14px; }

        /* header */
        .cp-header { text-align: center; margin-bottom: 26px; }
        .cp-title {
          font-family: 'Fraunces', serif; font-weight: 700; font-size: 34px;
          color: var(--forest); margin: 0 0 8px 0; letter-spacing: 0.01em;
        }
        .cp-subtitle { font-size: 14px; color: var(--ink-muted); margin: 0; }

        /* quick actions */
        .cp-actions-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 26px;
        }
        .cp-action-btn {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 18px 14px; cursor: pointer; text-align: center;
          transition: box-shadow 0.15s, border-color 0.15s, transform 0.1s;
        }
        .cp-action-btn:hover { border-color: var(--gold); box-shadow: 0 4px 14px rgba(31,61,46,0.1); transform: translateY(-1px); }
        .cp-action-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--bg-panel-raised);
          display: flex; align-items: center; justify-content: center;
          color: var(--forest);
        }
        .cp-action-icon svg { width: 19px; height: 19px; }
        .cp-action-label { font-size: 12.5px; font-weight: 600; color: var(--ink-primary); line-height: 1.3; }

        /* ask panel */
        .cp-ask-panel {
          flex: 1;
          padding: 34px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          margin-bottom: 18px;
        }
        .cp-ask-head { text-align: center; }
        .cp-ask-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; margin: 0 0 6px 0; }
        .cp-ask-sub { font-size: 13px; color: var(--ink-muted); margin: 0; }

        .cp-chat-area { width: 100%; max-width: 640px; flex: 1; display: flex; flex-direction: column; gap: 10px; min-height: 60px; }
        .cp-chat-bubble {
          align-self: flex-end; max-width: 85%;
          background: var(--forest); color: var(--oat);
          font-size: 13px; padding: 10px 14px; border-radius: 12px 12px 2px 12px;
          line-height: 1.4;
        }

        .cp-suggestions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 640px; }
        .cp-suggestion-box {
          background: var(--bg-panel-raised); border: 1px solid var(--border-soft); border-radius: 999px;
          padding: 9px 16px; font-size: 12px; font-weight: 500; color: var(--ink-primary);
          cursor: pointer; transition: background 0.15s, border-color 0.15s;
        }
        .cp-suggestion-box:hover { background: var(--sage); color: #fff; border-color: var(--sage); }

        .cp-input-row {
          width: 100%; max-width: 640px;
          display: flex; gap: 8px;
        }
        .cp-input-row input {
          flex: 1; background: #fffdf7; border: 1px solid var(--border-soft); border-radius: 10px;
          padding: 12px 16px; font-size: 13px; color: var(--ink-primary); outline: none;
        }
        .cp-input-row input::placeholder { color: #a9b3a2; }
        .cp-input-row input:focus { border-color: var(--gold); }
        .cp-send-btn {
          background: var(--forest); border: none; border-radius: 10px; color: var(--oat);
          font-size: 13px; font-weight: 700; padding: 0 24px; cursor: pointer;
          transition: background 0.15s;
        }
        .cp-send-btn:hover { background: #16301f; }

        /* footer */
        .cp-footer { text-align: center; padding-top: 6px; }
        .cp-footer-links { font-size: 11.5px; color: #9aa494; }
        .cp-footer-links a { color: #9aa494; text-decoration: none; }
        .cp-footer-links a:hover { color: var(--forest); text-decoration: underline; }

        @media (max-width: 800px) {
          .cp-actions-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 500px) {
          .cp-actions-row { grid-template-columns: 1fr; }
          .cp-ask-panel { padding: 24px 18px; }
        }
      `}</style>

      <button className="cp-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>

      <div className="cp-header">
        <h1 className="cp-title">PRIXI Copilot</h1>
        <p className="cp-subtitle">Your AI-powered assistant for factory insights and decision support.</p>
      </div>

      <div className="cp-actions-row">
        {QUICK_ACTIONS.map((a) => (
          <div className="panel cp-action-btn" key={a.key} onClick={() => handleSend(a.label)}>
            <div className="cp-action-icon">
              <svg viewBox="0 0 24 24">{a.icon}</svg>
            </div>
            <span className="cp-action-label">{a.label}</span>
          </div>
        ))}
      </div>

      <div className="panel cp-ask-panel">
        <div className="cp-ask-head">
          <h2 className="cp-ask-title">Ask PRIXI Copilot</h2>
          <p className="cp-ask-sub">How can I assist you today?</p>
        </div>

        {chatLog.length > 0 && (
          <div className="cp-chat-area">
            {chatLog.map((m, i) => (
              <div className="cp-chat-bubble" key={i}>{m.text}</div>
            ))}
          </div>
        )}

        <div className="cp-suggestions">
          {SUGGESTIONS.map((s) => (
            <div className="cp-suggestion-box" key={s} onClick={() => handleSend(s)}>
              {s}
            </div>
          ))}
        </div>

        <div className="cp-input-row">
          <input
            value={chatValue}
            onChange={(e) => setChatValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
          />
          <button className="cp-send-btn" onClick={() => handleSend()}>Send</button>
        </div>
      </div>

      <div className="cp-footer">
        <span className="cp-footer-links">
          <a href="#help">Help</a> | <a href="#docs">Documentation</a> | <a href="#support">Contact Support</a>
        </span>
      </div>
    </div>
  );
}
