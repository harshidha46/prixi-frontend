import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PRIXI AI Dashboard
 * Palette lifted directly from the Leafora botanical-tea identity:
 * Forest #1F3D2E · Sage #A6B79A · Mist #D7E0D3 · Oat #EDE7D8 · Gold #C9A86A
 * Signature element: Factory Health Score as concentric "growth rings"
 * (tree-ring metaphor), echoing the brand's leaf mark.
 */

const COPY = {
  en: {
    brand: "PRIXI",
    tagline: "INTELLIGENT MILL COMPANION",
    copilotName: "PRIXI Copilot",
    greeting: "Ask me about any line, machine or shift.",
    placeholder: "Ask PRIXI…",
    send: "Send",
    sectorsLabel: "Factory Sectors",
    addSector: "Add Sector",
    sectorTag: "Sector",
    addSectorModalTitle: "New Sector",
    addSectorModalSub: "Tell us about the factory before we set up the sector.",
    industryName: "Industry Name",
    industryNamePh: "e.g. Leafora Textiles",
    factoryName: "Factory Name",
    factoryNamePh: "e.g. Unit 3 — Coimbatore",
    factoryLocation: "Factory Location",
    factoryLocationPh: "e.g. Coimbatore, Tamil Nadu",
    industryType: "Industry Type",
    industryTypePh: "Select industry type",
    industryTypes: ["Textile", "Food Processing", "Pharmaceuticals", "Automotive", "Chemicals", "Electronics", "Other"],
    logoUpload: "Factory Logo",
    logoUploadHint: "PNG or JPG, up to 5MB",
    logoChange: "Change logo",
    logoRemove: "Remove",
    cancel: "Cancel",
    next: "Next",
    alerts: "Alerts",
    inventory: "Inventory",
    energy: "Energy Consumption",
    supply: "Supply Status",
    replay: "Factory Replay",
    health: "Factory Health Score",
    dna: "Factory DNA Profile",
    roi: "Monthly ROI",
    rate: "Production Rate",
    downtime: "Downtime",
    viewAll: "View all",
    stableGrowth: "Stable growth trend",
    rateSub: "▲ 2.1% vs plan",
    downtimeSub: "▼ 40m vs yesterday",
    optimizerMenu: ["Balance Line Load", "Reduce Bottlenecks", "Optimize Energy Usage"],
    sidebarItems: [
      { type: "metric", key: "roi", label: "Monthly ROI", value: "₹18.4L", sub: "▲ 6.2% vs last month", tone: "good" },
      { type: "metric", key: "dna", label: "Factory DNA Profile", value: "Tex-04A · High Mix", sub: "Blend: Cotton 62 / Poly 38" },
      { type: "metric", key: "replay", label: "Factory Replay", value: "14:02 / 08:00:00", sub: "Playback ready" },
      { type: "metric", key: "energy", label: "Energy Consumption", value: "4,120 kWh", sub: "▲ 3.4% vs plan", tone: "warn" },
      { type: "metric", key: "supply", label: "Supply Status", value: "On Track", sub: "4 shipments due", tone: "good" },
      { type: "nav", key: "optimizer", label: "Production Optimizer" },
    ],
    sectors: [
      {
        key: "carding",
        title: "Carding",
        status: "Running",
        metrics: [
          { label: "Efficiency", value: "94.2%" },
          { label: "Output", value: "1,180 kg/hr" },
          { label: "Waste", value: "1.8%" },
        ],
      },
      {
        key: "spinning",
        title: "Spinning",
        status: "Running",
        metrics: [
          { label: "Efficiency", value: "89.6%" },
          { label: "Output", value: "640 spindles/hr" },
          { label: "Breaks", value: "12/hr" },
        ],
      },
      {
        key: "weaving",
        title: "Weaving",
        status: "Attention",
        metrics: [
          { label: "Efficiency", value: "76.4%" },
          { label: "Output", value: "3,210 m/day" },
          { label: "Loom Stops", value: "18" },
        ],
      },
      {
        key: "finishing",
        title: "Finishing",
        status: "Idle",
        metrics: [
          { label: "Efficiency", value: "52.1%" },
          { label: "Output", value: "980 m/day" },
          { label: "Downtime", value: "2.4 hr" },
        ],
      },
    ],
    alertsList: [
      { id: 1, text: "Finishing Line 2 — motor overheat", time: "2m ago" },
      { id: 2, text: "Weaving Loom 7 — thread tension drift", time: "14m ago" },
      { id: 3, text: "Spinning Frame 3 — spindle break rate rising", time: "26m ago" },
      { id: 4, text: "Carding Line 1 — maintenance completed", time: "1h ago" },
    ],
    inventoryList: [
      { id: 1, name: "Raw Cotton Bales" },
      { id: 2, name: "Polyester Fibre" },
      { id: 3, name: "Dye Stock — Indigo" },
      { id: 4, name: "Sizing Chemicals" },
    ],
  },
  ta: {
    brand: "பிரிக்ஸி",
    tagline: "அறிவார்ந்த ஆலை துணை",
    copilotName: "பிரிக்ஸி துணையாளர்",
    greeting: "எந்த இயந்திரம், லைன் பற்றியும் கேளுங்கள்.",
    placeholder: "பிரிக்ஸியிடம் கேளுங்கள்…",
    send: "அனுப்பு",
    sectorsLabel: "தொழிற்சாலை பிரிவுகள்",
    addSector: "பிரிவைச் சேர்",
    sectorTag: "பிரிவு",
    addSectorModalTitle: "புதிய பிரிவு",
    addSectorModalSub: "பிரிவை அமைக்கும் முன் தொழிற்சாலை பற்றி கூறுங்கள்.",
    industryName: "தொழில் பெயர்",
    industryNamePh: "உதா. லீஃபோரா டெக்ஸ்டைல்ஸ்",
    factoryName: "தொழிற்சாலை பெயர்",
    factoryNamePh: "உதா. யூனிட் 3 — கோயம்புத்தூர்",
    factoryLocation: "தொழிற்சாலை இடம்",
    factoryLocationPh: "உதா. கோயம்புத்தூர், தமிழ்நாடு",
    industryType: "தொழில் வகை",
    industryTypePh: "தொழில் வகையைத் தேர்ந்தெடுக்கவும்",
    industryTypes: ["டெக்ஸ்டைல்", "உணவு பதப்படுத்துதல்", "மருந்துகள்", "ஆட்டோமொபைல்", "இரசாயனங்கள்", "எலக்ட்ரானிக்ஸ்", "மற்றவை"],
    logoUpload: "தொழிற்சாலை லோகோ",
    logoUploadHint: "PNG அல்லது JPG, 5MB வரை",
    logoChange: "லோகோவை மாற்று",
    logoRemove: "அகற்று",
    cancel: "ரத்து செய்",
    next: "அடுத்து",
    alerts: "எச்சரிக்கைகள்",
    inventory: "கையிருப்பு",
    energy: "மின் நுகர்வு",
    supply: "விநியோக நிலை",
    replay: "தொழிற்சாலை மறுஇயக்கம்",
    health: "தொழிற்சாலை ஆரோக்கிய மதிப்பெண்",
    dna: "தொழிற்சாலை டிஎன்ஏ சுயவிவரம்",
    roi: "மாத ROI",
    rate: "உற்பத்தி விகிதம்",
    downtime: "செயலிழப்பு நேரம்",
    viewAll: "அனைத்தையும் காண்க",
    stableGrowth: "நிலையான வளர்ச்சி போக்கு",
    rateSub: "▲ 2.1% திட்டத்தை விட",
    downtimeSub: "▼ 40m நேற்றை விட",
    optimizerMenu: ["லைன் சுமையை சமநிலைப்படுத்து", "தடைகளை குறை", "மின் நுகர்வை மேம்படுத்து"],
    sidebarItems: [
      { type: "metric", key: "roi", label: "மாத ROI", value: "₹18.4L", sub: "▲ 6.2% கடந்த மாதத்தை விட", tone: "good" },
      { type: "metric", key: "dna", label: "தொழிற்சாலை டிஎன்ஏ சுயவிவரம்", value: "Tex-04A · High Mix", sub: "கலவை: பருத்தி 62 / பாலியஸ்டர் 38" },
      { type: "metric", key: "replay", label: "தொழிற்சாலை மறுஇயக்கம்", value: "14:02 / 08:00:00", sub: "இயக்கத்திற்கு தயார்" },
      { type: "metric", key: "energy", label: "மின் நுகர்வு", value: "4,120 kWh", sub: "▲ 3.4% திட்டத்தை விட", tone: "warn" },
      { type: "metric", key: "supply", label: "விநியோக நிலை", value: "சரியான பாதையில்", sub: "4 அனுப்புகள் நிலுவையில்", tone: "good" },
      { type: "nav", key: "optimizer", label: "உற்பத்தி மேம்பாடு" },
    ],
    sectors: [
      {
        key: "carding",
        title: "கார்டிங்",
        status: "இயங்குகிறது",
        metrics: [
          { label: "செயல்திறன்", value: "94.2%" },
          { label: "உற்பத்தி", value: "1,180 kg/hr" },
          { label: "வீணாக்கம்", value: "1.8%" },
        ],
      },
      {
        key: "spinning",
        title: "நூற்பு",
        status: "இயங்குகிறது",
        metrics: [
          { label: "செயல்திறன்", value: "89.6%" },
          { label: "உற்பத்தி", value: "640 spindles/hr" },
          { label: "முறிவுகள்", value: "12/hr" },
        ],
      },
      {
        key: "weaving",
        title: "நெசவு",
        status: "கவனம் தேவை",
        metrics: [
          { label: "செயல்திறன்", value: "76.4%" },
          { label: "உற்பத்தி", value: "3,210 m/day" },
          { label: "நெசவு நிறுத்தங்கள்", value: "18" },
        ],
      },
      {
        key: "finishing",
        title: "இறுதி செய்தல்",
        status: "செயலற்றது",
        metrics: [
          { label: "செயல்திறன்", value: "52.1%" },
          { label: "உற்பத்தி", value: "980 m/day" },
          { label: "செயலிழப்பு", value: "2.4 hr" },
        ],
      },
    ],
    alertsList: [
      { id: 1, text: "இறுதி செய்தல் லைன் 2 — மோட்டார் அதிக வெப்பம்", time: "2 நிமிடங்களுக்கு முன்பு" },
      { id: 2, text: "நெசவு தறி 7 — நூல் இழுவிசை சறுக்கல்", time: "14 நிமிடங்களுக்கு முன்பு" },
      { id: 3, text: "நூற்பு பிரேம் 3 — சுழல் முறிவு விகிதம் அதிகரிப்பு", time: "26 நிமிடங்களுக்கு முன்பு" },
      { id: 4, text: "கார்டிங் லைன் 1 — பராமரிப்பு முடிந்தது", time: "1 மணி நேரத்திற்கு முன்பு" },
    ],
    inventoryList: [
      { id: 1, name: "மூல பருத்தி மூட்டைகள்" },
      { id: 2, name: "பாலியஸ்டர் இழை" },
      { id: 3, name: "சாயம் கையிருப்பு — இண்டிகோ" },
      { id: 4, name: "சைசிங் இரசாயனங்கள்" },
    ],
  },
};

const SIDEBAR_ICONS = {
  roi: (
    <path
      d="M3 17l6-6 4 4 8-8M21 7v6h-6"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  dna: (
    <path
      d="M7 3c0 6 10 12 10 18M17 3c0 6-10 12-10 18M8 8h8M8 16h8"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  replay: (
    <path
      d="M12 21a9 9 0 1 0-9-9M3 4v8h8M12 8v4l3 2"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  energy: (
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  supply: (
    <path
      d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Zm0 0v9L12 21m0-8v8m9-12.5v9L12 21"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  optimizer: (
    <path d="M4 6h9m-9 6h16m-16 6h9M17 4v4M13 10v4M8 16v4" strokeWidth="1.6" stroke="currentColor" fill="none" strokeLinecap="round" />
  ),
};

const SECTOR_META = [
  { key: "carding", tone: "good", spark: [4, 6, 5, 7, 8, 7, 9, 8, 9] },
  { key: "spinning", tone: "good", spark: [6, 5, 6, 6, 7, 6, 5, 6, 7] },
  { key: "weaving", tone: "warn", spark: [7, 6, 5, 4, 5, 4, 3, 4, 3] },
  { key: "finishing", tone: "bad", spark: [5, 4, 3, 3, 2, 2, 3, 2, 2] },
];

const ALERT_META = [
  { id: 1, tone: "bad" },
  { id: 2, tone: "warn" },
  { id: 3, tone: "warn" },
  { id: 4, tone: "good" },
];

const INVENTORY_META = [
  { id: 1, level: 82 },
  { id: 2, level: 61 },
  { id: 3, level: 24 },
  { id: 4, level: 45 },
];

const SECTOR_ROUTES = {
  carding: "/carding",
  spinning: "/spinning",
  weaving: "/weaving",
  finishing: "/finishing",
};

function toneColor(tone) {
  return { good: "var(--status-good)", warn: "var(--status-warn)", bad: "var(--status-bad)" }[tone];
}

function GrowthRingGauge({ score = 87 }) {
  const rings = [
    { r: 30, pct: Math.min(score, 100) / 100, color: "var(--accent-forest)", width: 5 },
    { r: 23, pct: Math.min(score + 6, 100) / 100, color: "var(--accent-gold)", width: 4 },
    { r: 17, pct: Math.min(score - 9, 100) / 100, color: "var(--accent-sage-dark)", width: 3 },
  ];
  const C = 2 * Math.PI;
  return (
    <svg width="72" height="72" viewBox="0 0 76 76">
      <g transform="translate(38,38) rotate(-90)">
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
      <text x="38" y="42" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="600" fontSize="17" fill="var(--ink-primary)">
        {score}
      </text>
    </svg>
  );
}

function LeafMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18.5" stroke="var(--accent-forest)" strokeWidth="1" />
      <path
        d="M20 8c0 8-1 16 0 24M20 14c3 1 6 3 7 6-3 1-6 0-7-3M20 20c-3 1-6 3-7 6 3 1 6 0 7-3M20 26c2 1 4 2.5 4.5 5-2.5.5-4.5-.5-4.5-2.5"
        stroke="var(--accent-forest)"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="27" cy="12" r="1" fill="var(--accent-gold)" />
    </svg>
  );
}

/* small folder-style glyph for the compact sector cards */
function SectorGlyph({ color }) {
  return (
    <svg width="30" height="24" viewBox="0 0 30 24" fill="none">
      <path
        d="M2 5.5c0-1.4 1.1-2.5 2.5-2.5h6l2.4 2.6h12.6c1.4 0 2.5 1.1 2.5 2.5v11.4c0 1.4-1.1 2.5-2.5 2.5h-21C3.1 21.5 2 20.4 2 19V5.5Z"
        fill={color}
        opacity="0.16"
        stroke={color}
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default function PrixiDashboard() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [activeNav, setActiveNav] = useState(null);
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [chatValue, setChatValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [addSectorOpen, setAddSectorOpen] = useState(false);
  const [newSector, setNewSector] = useState({
    industryName: "",
    factoryName: "",
    factoryLocation: "",
    industryType: "",
    logoFile: null,
    logoPreview: "",
  });
  const t = COPY[lang];

  const topStats = useMemo(
    () => [
      { label: t.health, value: <GrowthRingGauge score={87} />, isGauge: true, isHealth: true },
      { label: t.rate, value: "3,240 m/day", sub: t.rateSub, tone: "good", isProdRate: true },
      { label: t.downtime, value: "3h 12m", sub: t.downtimeSub, tone: "warn" },
    ],
    [lang]
  );

  const SECTORS = useMemo(
    () => t.sectors.map((s, i) => ({ ...s, tone: SECTOR_META[i].tone, spark: SECTOR_META[i].spark })),
    [lang]
  );
  const ALERTS = useMemo(
    () => t.alertsList.map((a, i) => ({ ...a, tone: ALERT_META[i].tone })),
    [lang]
  );
  const INVENTORY = useMemo(
    () => t.inventoryList.map((item, i) => ({ ...item, level: INVENTORY_META[i].level })),
    [lang]
  );

  function handleSend() {
    if (!chatValue.trim()) return;
    setChatLog((log) => [...log, { role: "user", text: chatValue }]);
    setChatValue("");
  }

  function openAddSector() {
    setNewSector({
      industryName: "",
      factoryName: "",
      factoryLocation: "",
      industryType: "",
      logoFile: null,
      logoPreview: "",
    });
    setAddSectorOpen(true);
  }

  function closeAddSector() {
    setAddSectorOpen(false);
  }

  function updateNewSector(field, value) {
    setNewSector((s) => ({ ...s, [field]: value }));
  }

  function handleLogoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewSector((s) => ({ ...s, logoFile: file, logoPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setNewSector((s) => ({ ...s, logoFile: null, logoPreview: "" }));
  }

  const isNewSectorValid =
    newSector.industryName.trim() &&
    newSector.factoryName.trim() &&
    newSector.factoryLocation.trim() &&
    newSector.industryType.trim();

  function handleNewSectorNext() {
    if (!isNewSectorValid) return;
    // First step of the "add sector" flow is captured here.
    // Hand off to the sector-creation route with the collected details.
    setAddSectorOpen(false);
    navigate("/sectors/new", { state: { sectorDraft: newSector } });
  }

  return (
    <div className="prixi-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .prixi-root {
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
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 14px;
          padding: 16px;
          box-sizing: border-box;
        }
        .prixi-root * { box-sizing: border-box; }
        .prixi-root button,
        .prixi-root input,
        .prixi-root select,
        .prixi-root textarea {
          font-family: inherit;
        }
        .serif { font-family: 'Fraunces', serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

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

        /* top bar */
        .topbar {
          display: grid;
          grid-template-columns: auto 1fr 1fr 1fr;
          gap: 12px;
          align-items: stretch;
        }
        .brand-card {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-name { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; letter-spacing: 0.02em; }
        .brand-tagline { font-size: 9px; letter-spacing: 0.12em; color: var(--ink-muted); text-transform: uppercase; }
        .stat {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .stat-label {
          display: inline-block;
          width: fit-content;
          max-width: 100%;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--forest);
          background: rgba(201,168,106,0.18);
          padding: 3px 9px;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stat-value {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stat-sub { font-size: 11px; font-family: 'JetBrains Mono', monospace; }
        .stat-clickable { cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s; }
        .stat-clickable:hover, .stat-clickable:focus-visible {
          border-color: var(--gold);
          box-shadow: 0 0 0 2px rgba(201,168,106,0.3);
          outline: none;
        }
        .tone-good { color: var(--status-good); }
        .tone-warn { color: var(--status-warn); }
        .tone-bad { color: var(--status-bad); }

        /* main grid */
        .main-grid {
          display: grid;
          grid-template-columns: 232px 1fr 260px;
          gap: 14px;
          min-height: 0;
        }

        /* sidebar */
        .sidebar { padding: 18px 14px; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }

        .sidebar-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        /* unified pill button — same compact, heading-only look for every sidebar item */
        .sidebar-btn {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 13px;
          border-radius: 11px;
          background: var(--bg-panel-raised);
          border: 1px solid transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, color 0.15s, box-shadow 0.15s, border-color 0.15s;
        }
        .sidebar-btn:hover { background: var(--sage); }
        .sidebar-btn:hover .sidebar-btn-label,
        .sidebar-btn:hover .sidebar-btn-icon { color: #fff; }
        .sidebar-btn.active {
          background: var(--forest);
          box-shadow: 0 0 0 2px rgba(201,168,106,0.35);
        }
        .sidebar-btn.active .sidebar-btn-label,
        .sidebar-btn.active .sidebar-btn-icon,
        .sidebar-btn.active .sidebar-chevron { color: var(--oat); }

        .sidebar-btn-icon {
          width: 18px; height: 18px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: var(--forest);
          transition: color 0.15s;
        }
        .sidebar-btn-icon svg { width: 16px; height: 16px; }

        .sidebar-btn-label {
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--forest);
          transition: color 0.15s;
          line-height: 1.25;
          flex: 1;
        }

        .sidebar-chevron { width: 14px; height: 14px; flex-shrink: 0; color: var(--forest); transition: transform 0.2s, color 0.15s; }
        .sidebar-chevron.open { transform: rotate(180deg); }

        .sidebar-dropdown-wrap { display: flex; flex-direction: column; gap: 4px; }
        .sidebar-dropdown-panel {
          display: flex; flex-direction: column; gap: 3px;
          padding: 5px 6px 2px 38px;
        }
        .sidebar-dropdown-item {
          all: unset;
          box-sizing: border-box;
          font-size: 11px;
          font-weight: 500;
          color: var(--ink-muted);
          padding: 6px 9px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar-dropdown-item:hover { background: var(--bg-panel-raised); color: var(--forest); }

        .leaf-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-soft) 20%, var(--border-soft) 80%, transparent);
        }

        .copilot { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .copilot-head { display: flex; align-items: center; gap: 10px; }
        .copilot-head-clickable { cursor: pointer; border-radius: 8px; padding: 4px; margin: -4px; transition: background 0.15s; }
        .copilot-head-clickable:hover { background: var(--bg-panel-raised); }
        .copilot-head-clickable:hover .copilot-expand-icon { color: var(--forest); transform: translateX(2px); }
        .copilot-expand-icon { width: 14px; height: 14px; color: var(--ink-muted); flex-shrink: 0; transition: color 0.15s, transform 0.15s; }
        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #fffdf7;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px var(--border-soft);
          flex-shrink: 0;
        }
        .copilot-name { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 600; }
        .copilot-greeting { font-size: 11.5px; color: var(--ink-muted); line-height: 1.4; }
        .lang-toggle {
          display: flex; gap: 2px; padding: 2px;
          background: var(--bg-panel-raised);
          border-radius: 8px; border: 1px solid var(--border-soft);
          width: fit-content;
        }
        .lang-toggle button {
          border: none; background: transparent; color: var(--ink-muted);
          font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; cursor: pointer;
        }
        .lang-toggle button.active { background: var(--forest); color: var(--oat); }
        .chat-log { display: flex; flex-direction: column; gap: 6px; max-height: 80px; overflow-y: auto; }
        .chat-bubble {
          font-size: 11.5px; padding: 6px 9px; border-radius: 8px;
          background: var(--bg-panel-raised); align-self: flex-end; max-width: 90%;
          word-break: break-word;
        }
        .copilot-input-row {
          display: flex;
          gap: 6px;
          margin-top: auto;
          width: 100%;
          min-width: 0;
        }
        .copilot-input-row input {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
          background: #fffdf7;
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          padding: 8px 10px;
          color: var(--ink-primary);
          font-size: 12px;
          outline: none;
        }
        .copilot-input-row input::placeholder { color: #a9b3a2; }
        .copilot-input-row input:focus { border-color: var(--gold); }
        .copilot-input-row button {
          flex: 0 0 auto;
          background: var(--forest);
          border: none;
          border-radius: 8px;
          color: var(--oat);
          font-size: 12px;
          font-weight: 600;
          padding: 0 10px;
          white-space: nowrap;
          cursor: pointer;
        }

        /* center: sectors */
        .sectors-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ink-muted);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sectors-label-text {
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--forest);
          background: rgba(201,168,106,0.18);
          padding: 3px 10px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .sectors-label::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border-soft);
        }
        .sectors-col { display: flex; flex-direction: column; min-height: 0; }

        /* sector cards — responsive grid so tiles fill the row evenly instead of
           wrapping into an awkward leftover gap */
        .lines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
          gap: 14px;
        }
        .line-card {
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 12px;
          min-height: 128px;
          text-align: left;
          border: 1px solid var(--border-soft);
          border-top: 3px solid var(--gold);
          background: linear-gradient(160deg, #fbf8ef 0%, var(--bg-panel) 65%);
        }
        .line-card-clickable { cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s; }
        .line-card-clickable:hover, .line-card-clickable:focus-visible {
          border-color: var(--forest);
          box-shadow: 0 4px 14px rgba(31,61,46,0.12);
          transform: translateY(-2px);
          outline: none;
        }
        .line-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .line-status {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 5px;
          background: rgba(31,61,46,0.06);
        }
        .line-title {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--forest);
          line-height: 1.25;
        }
        .line-metric {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px dashed var(--border-soft);
        }
        .line-metric-label { font-size: 10.5px; color: var(--ink-muted); }
        .line-metric-value { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: var(--ink-primary); }

        /* "add sector" tile — same footprint as a line-card, dashed & quiet */
        .add-sector-card {
          border: 1.5px dashed var(--border-soft);
          border-top: 1.5px dashed var(--border-soft);
          background: transparent;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--ink-muted);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .add-sector-card:hover, .add-sector-card:focus-visible {
          border-color: var(--gold);
          color: var(--forest);
          background: rgba(201,168,106,0.08);
          transform: none;
          box-shadow: none;
          outline: none;
        }
        .add-sector-icon { width: 24px; height: 24px; margin-bottom: 2px; }
        .add-sector-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* right panel */
        .right-col { display: flex; flex-direction: column; gap: 14px; min-height: 0; }
        .side-panel { padding: 14px; flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .side-panel h4 {
          margin: 0 0 10px 0; font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 6px; width: fit-content;
          color: var(--forest); background: rgba(201,168,106,0.18);
          padding: 3px 11px; border-radius: 7px;
        }
        .side-panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .side-panel-head h4 { margin: 0; }
        .view-all-btn {
          display: inline-flex; align-items: center; gap: 3px;
          background: transparent; border: none; cursor: pointer;
          font-size: 10.5px; font-weight: 600; color: var(--ink-muted);
          padding: 2px 4px; transition: color 0.15s;
        }
        .view-all-btn svg { width: 12px; height: 12px; }
        .view-all-btn:hover { color: var(--forest); }
        .alert-list, .inv-list { display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
        .alert-item { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; }
        .alert-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
        .alert-text { line-height: 1.35; }
        .alert-time { color: var(--ink-muted); font-size: 10.5px; }
        .inv-item { font-size: 12px; }
        .inv-name-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .inv-bar-track { height: 5px; border-radius: 4px; background: var(--bg-panel-raised); overflow: hidden; }
        .inv-bar-fill { height: 100%; border-radius: 4px; background: var(--status-good); }

        /* add-sector modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(31,61,46,0.42);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }
        .modal-panel {
          width: 100%;
          max-width: 440px;
          max-height: 88vh;
          overflow-y: auto;
          background: var(--bg-panel);
          border: 1px solid var(--border-soft);
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(31,61,46,0.28);
          padding: 22px 22px 18px;
        }
        .modal-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }
        .modal-head h3 {
          margin: 0 0 4px 0;
          font-family: 'Fraunces', serif;
          font-size: 19px;
          font-weight: 700;
          color: var(--forest);
        }
        .modal-sub { margin: 0; font-size: 12px; color: var(--ink-muted); line-height: 1.4; }
        .modal-close {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--ink-muted);
          padding: 4px;
          border-radius: 6px;
          flex-shrink: 0;
          transition: color 0.15s, background 0.15s;
        }
        .modal-close:hover { color: var(--forest); background: rgba(31,61,46,0.06); }
        .modal-close svg { width: 18px; height: 18px; display: block; }
        .modal-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row { display: flex; flex-direction: column; gap: 6px; }
        .form-row label {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--forest);
          letter-spacing: 0.01em;
        }
        .form-row input,
        .form-row select {
          background: #fffdf7;
          border: 1px solid var(--border-soft);
          border-radius: 9px;
          padding: 9px 11px;
          font-size: 13px;
          color: var(--ink-primary);
          outline: none;
          transition: border-color 0.15s;
        }
        .form-row input::placeholder { color: #a9b3a2; }
        .form-row input:focus, .form-row select:focus { border-color: var(--gold); }
        .form-row select { cursor: pointer; }
        .logo-upload { display: flex; align-items: center; gap: 12px; }
        .logo-dropzone {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border: 1.5px dashed var(--border-soft);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-muted);
          cursor: pointer;
          overflow: hidden;
          background: #fffdf7;
          transition: border-color 0.15s, color 0.15s;
        }
        .logo-dropzone:hover { border-color: var(--gold); color: var(--forest); }
        .logo-dropzone svg { width: 24px; height: 24px; }
        .logo-preview { width: 100%; height: 100%; object-fit: cover; }
        .logo-upload-side { display: flex; flex-direction: column; gap: 6px; }
        .logo-hint { font-size: 10.5px; color: var(--ink-muted); }
        .logo-remove-btn {
          align-self: flex-start;
          background: transparent;
          border: none;
          color: var(--status-bad);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px dashed var(--border-soft);
        }
        .modal-btn-secondary {
          background: transparent;
          border: 1px solid var(--border-soft);
          border-radius: 9px;
          padding: 9px 16px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-muted);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .modal-btn-secondary:hover { border-color: var(--forest); color: var(--forest); }
        .modal-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--forest);
          border: none;
          border-radius: 9px;
          padding: 9px 16px;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--oat);
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }
        .modal-btn-primary svg { width: 14px; height: 14px; }
        .modal-btn-primary:hover:not(:disabled) { transform: translateX(1px); }
        .modal-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="panel brand-card">
          <LeafMark size={30} />
          <div>
            <div className="brand-name">{t.brand}</div>
            <div className="brand-tagline">{t.tagline}</div>
          </div>
        </div>
        {topStats.map((s, i) => {
          const clickable = s.isHealth || s.isProdRate;
          const target = s.isHealth ? "/factory-health" : s.isProdRate ? "/production-rate" : null;
          return (
          <div
            className={`panel stat ${clickable ? "stat-clickable" : ""}`}
            key={i}
            onClick={clickable ? () => navigate(target) : undefined}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={
              clickable
                ? (e) => (e.key === "Enter" || e.key === " ") && navigate(target)
                : undefined
            }
          >
            {s.isGauge ? (
              s.value
            ) : (
              <div className="stat-body">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                {s.sub && <div className={`stat-sub ${s.tone ? "tone-" + s.tone : ""}`}>{s.sub}</div>}
              </div>
            )}
            {s.isGauge && (
              <div className="stat-body">
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub tone-good">{t.stableGrowth}</div>
              </div>
            )}
          </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="main-grid">
        {/* LEFT SIDEBAR */}
        <div className="panel sidebar">
          <div className="sidebar-list">
            {t.sidebarItems.map((item) => {
              const icon = SIDEBAR_ICONS[item.key];

              if (item.key === "optimizer") {
                return (
                  <div className="sidebar-dropdown-wrap" key={item.key}>
                    <button
                      className={`sidebar-btn ${optimizerOpen ? "active" : ""}`}
                      onClick={() => setOptimizerOpen((v) => !v)}
                      aria-expanded={optimizerOpen}
                    >
                      <span className="sidebar-btn-icon">
                        <svg viewBox="0 0 24 24" fill="none">{icon}</svg>
                      </span>
                      <span className="sidebar-btn-label">{item.label}</span>
                      <svg
                        className={`sidebar-chevron ${optimizerOpen ? "open" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {optimizerOpen && (
                      <div className="sidebar-dropdown-panel">
                        {t.optimizerMenu.map((entry) => (
                          <button key={entry} className="sidebar-dropdown-item" onClick={() => navigate("/copilot")}>
                            {entry}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Every remaining item — nav or metric — renders as the same
              // compact, heading-only pill: icon + label, no values.
              return (
                <button
                  key={item.key}
                  className={`sidebar-btn ${activeNav === item.key ? "active" : ""}`}
                  onClick={() => setActiveNav(item.key)}
                >
                  <span className="sidebar-btn-icon">
                    <svg viewBox="0 0 24 24" fill="none">{icon}</svg>
                  </span>
                  <span className="sidebar-btn-label">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="leaf-divider" />

          <div className="copilot" style={{ flex: 1, minHeight: 0 }}>
            <div
              className="copilot-head copilot-head-clickable"
              onClick={() => navigate("/copilot")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/copilot")}
            >
              <div className="avatar">
                <LeafMark size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="copilot-name">{t.copilotName}</div>
              </div>
              <svg className="copilot-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <div className="copilot-greeting">{t.greeting}</div>

            <div className="lang-toggle">
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "ta" ? "active" : ""} onClick={() => setLang("ta")}>TA</button>
            </div>

            {chatLog.length > 0 && (
              <div className="chat-log">
                {chatLog.map((m, i) => (
                  <div className="chat-bubble" key={i}>{m.text}</div>
                ))}
              </div>
            )}

            <div className="copilot-input-row">
              <input
                value={chatValue}
                onChange={(e) => setChatValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t.placeholder}
              />
              <button onClick={handleSend}>{t.send}</button>
            </div>
          </div>
        </div>

        {/* CENTER: SECTORS */}
        <div className="sectors-col">
          <div className="sectors-label"><span className="sectors-label-text">{t.sectorsLabel}</span></div>
          <div className="lines-grid">
            {SECTORS.map((line) => {
              const route = SECTOR_ROUTES[line.key];
              const topMetric = line.metrics[0];
              return (
                <div
                  className={`panel line-card ${route ? "line-card-clickable" : ""}`}
                  key={line.key}
                  style={{ borderTopColor: toneColor(line.tone) }}
                  onClick={route ? () => navigate(route) : undefined}
                  role={route ? "button" : undefined}
                  tabIndex={route ? 0 : undefined}
                  onKeyDown={route ? (e) => (e.key === "Enter" || e.key === " ") && navigate(route) : undefined}
                >
                  <div className="line-card-top">
                    <SectorGlyph color={toneColor(line.tone)} />
                    <span className="line-status" style={{ color: toneColor(line.tone) }}>{line.status}</span>
                  </div>
                  <div className="line-title">{line.title}</div>
                  <div className="line-metric">
                    <span className="line-metric-label">{topMetric.label}</span>
                    <span className="line-metric-value">{topMetric.value}</span>
                  </div>
                </div>
              );
            })}

            <div
              className="panel line-card add-sector-card"
              onClick={openAddSector}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openAddSector()}
            >
              <svg className="add-sector-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <div className="add-sector-label">{t.addSector}</div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-col">
          <div className="panel side-panel">
            <div className="side-panel-head">
              <h4>{t.alerts}</h4>
              <button className="view-all-btn" onClick={() => navigate("/alerts")}>
                {t.viewAll}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="alert-list">
              {ALERTS.map((a) => (
                <div className="alert-item" key={a.id}>
                  <div className="alert-dot" style={{ background: toneColor(a.tone) }} />
                  <div>
                    <div className="alert-text">{a.text}</div>
                    <div className="alert-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel side-panel">
            <div className="side-panel-head">
              <h4>{t.inventory}</h4>
              <button className="view-all-btn" onClick={() => navigate("/inventory")}>
                {t.viewAll}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="inv-list">
              {INVENTORY.map((item) => (
                <div className="inv-item" key={item.id}>
                  <div className="inv-name-row">
                    <span>{item.name}</span>
                    <span className="mono">{item.level}%</span>
                  </div>
                  <div className="inv-bar-track">
                    <div
                      className="inv-bar-fill"
                      style={{
                        width: `${item.level}%`,
                        background: item.level < 30 ? "var(--status-bad)" : "var(--status-good)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {addSectorOpen && (
        <div
          className="modal-overlay"
          onClick={closeAddSector}
          role="presentation"
        >
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-sector-title"
          >
            <div className="modal-head">
              <div>
                <h3 id="add-sector-title">{t.addSectorModalTitle}</h3>
                <p className="modal-sub">{t.addSectorModalSub}</p>
              </div>
              <button className="modal-close" onClick={closeAddSector} aria-label={t.cancel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleNewSectorNext();
              }}
            >
              <div className="form-row">
                <label htmlFor="industryName">{t.industryName}</label>
                <input
                  id="industryName"
                  type="text"
                  value={newSector.industryName}
                  placeholder={t.industryNamePh}
                  onChange={(e) => updateNewSector("industryName", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label htmlFor="factoryName">{t.factoryName}</label>
                <input
                  id="factoryName"
                  type="text"
                  value={newSector.factoryName}
                  placeholder={t.factoryNamePh}
                  onChange={(e) => updateNewSector("factoryName", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label htmlFor="factoryLocation">{t.factoryLocation}</label>
                <input
                  id="factoryLocation"
                  type="text"
                  value={newSector.factoryLocation}
                  placeholder={t.factoryLocationPh}
                  onChange={(e) => updateNewSector("factoryLocation", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label htmlFor="industryType">{t.industryType}</label>
                <select
                  id="industryType"
                  value={newSector.industryType}
                  onChange={(e) => updateNewSector("industryType", e.target.value)}
                >
                  <option value="" disabled>{t.industryTypePh}</option>
                  {t.industryTypes.map((opt) => (
                    <option value={opt} key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>{t.logoUpload}</label>
                <div className="logo-upload">
                  <label className="logo-dropzone" htmlFor="logoInput">
                    {newSector.logoPreview ? (
                      <img src={newSector.logoPreview} alt="" className="logo-preview" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V4M12 4 7 9M12 4l5 5" />
                        <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                      </svg>
                    )}
                  </label>
                  <input
                    id="logoInput"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleLogoChange}
                    style={{ display: "none" }}
                  />
                  <div className="logo-upload-side">
                    <span className="logo-hint">{t.logoUploadHint}</span>
                    {newSector.logoPreview && (
                      <button type="button" className="logo-remove-btn" onClick={removeLogo}>
                        {t.logoRemove}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-btn-secondary" onClick={closeAddSector}>
                  {t.cancel}
                </button>
                <button type="submit" className="modal-btn-primary" disabled={!isNewSectorValid}>
                  {t.next}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
