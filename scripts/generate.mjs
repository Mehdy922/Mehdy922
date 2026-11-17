// Generates the synthwave SVG assets used by README.md.
// Run: node scripts/generate.mjs
// Edit the PROJECTS / STACK data below, re-run, commit the regenerated assets/.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

const C = {
  night: "#0d0221",
  dusk: "#1b0b3a",
  plum: "#2a1158",
  panel: "#140a2e",
  magenta: "#ff2e97",
  cyan: "#22e6ff",
  yellow: "#ffd319",
  orange: "#ff7a3d",
  violet: "#8a5cff",
  text: "#f1ecff",
  soft: "#cbc3ee",
  muted: "#9186c4",
};

const SANS = "'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'Cascadia Code','SF Mono','JetBrains Mono',Consolas,'Courier New',monospace";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const save = (name, svg) => writeFileSync(join(OUT, name), svg.trim() + "\n");

const W = 900; // matches the width GitHub renders a profile README at

// Perspective floor grid: verticals fan out from a vanishing point,
// horizontals bunch up toward the horizon.
function grid({ horizon, bottom, vx = W / 2, cols = 26, rows = 9, opacity = 0.75, speed = 0 }) {
  const depth = bottom - horizon;
  const verticals = [];
  for (let i = -cols; i <= cols; i++) {
    verticals.push(`<line x1="${vx}" y1="${horizon}" x2="${vx + i * 95}" y2="${bottom}"/>`);
  }
  const still = [];
  for (let j = 1; j <= rows; j++) {
    const y = (horizon + depth * Math.pow(j / rows, 2.1)).toFixed(1);
    still.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
  }
  const open = `<g stroke="${C.magenta}" stroke-width="1.2" opacity="${opacity}">`;
  if (!speed) return `${open}${verticals.join("")}${still.join("")}</g>`;

  // Animated floor: each horizontal starts on the horizon and accelerates toward
  // the viewer (ease-in reads as perspective). Negative delays stagger the lines
  // so the loop is already full on the first frame.
  const moving = [];
  for (let j = 0; j < rows; j++) {
    const delay = (-(j * speed) / rows).toFixed(2);
    moving.push(`<line class="gl" style="animation-delay:${delay}s" x1="0" y1="${horizon}" x2="${W}" y2="${horizon}"/>`);
  }
  return `<style>
      .gl { animation: flow ${speed}s cubic-bezier(0.55, 0, 1, 0.5) infinite, rise ${speed}s linear infinite; }
      .gstill { display: none; }
      @keyframes flow { from { transform: translateY(0) } to { transform: translateY(${depth}px) } }
      @keyframes rise { 0% { opacity: 0 } 18%, 100% { opacity: 1 } }
      @media (prefers-reduced-motion: reduce) { .gl { display: none } .gstill { display: inline } }
    </style>
    ${open}${verticals.join("")}<g class="gstill">${still.join("")}</g>${moving.join("")}</g>`;
}

// ---------------------------------------------------------------- banner
function banner() {
  const H = 300;
  const horizon = 205;
  const sun = { cx: 722, cy: 178, r: 104 };

  // Stripes cut out of the lower half of the sun, thicker toward the horizon.
  const stripes = [];
  let y = sun.cy + 6;
  for (let i = 0; i < 6; i++) {
    const h = 3 + i * 1.9;
    stripes.push(`<rect x="${sun.cx - sun.r}" y="${y.toFixed(1)}" width="${sun.r * 2}" height="${h.toFixed(1)}" fill="black"/>`);
    y += h + 9.5 - i * 0.6;
  }

  // Deterministic star field (no Math.random, so regenerating gives identical output).
  const stars = [];
  for (let i = 0; i < 46; i++) {
    const x = (i * 197 + 31) % W;
    const sy = (i * 71 + 13) % (horizon - 30);
    const r = i % 7 === 0 ? 1.5 : i % 3 === 0 ? 1.1 : 0.7;
    const cls = i % 4 === 0 ? ' class="tw"' : "";
    const delay = i % 4 === 0 ? ` style="animation-delay:${(i % 9) * 0.4}s"` : "";
    stars.push(`<circle${cls}${delay} cx="${x}" cy="${sy}" r="${r}"/>`);
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Muhammad Mehdy, Software Engineer, Data and AI">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.night}"/>
      <stop offset="0.55" stop-color="${C.dusk}"/>
      <stop offset="1" stop-color="#4a1466"/>
    </linearGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.yellow}"/>
      <stop offset="0.5" stop-color="${C.orange}"/>
      <stop offset="1" stop-color="${C.magenta}"/>
    </linearGradient>
    <linearGradient id="title" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.55" stop-color="#d9f9ff"/>
      <stop offset="1" stop-color="${C.cyan}"/>
    </linearGradient>
    <linearGradient id="floorfade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.night}" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="${C.night}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.magenta}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${C.magenta}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scanband" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${C.cyan}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
    </linearGradient>
    <mask id="sunmask">
      <rect x="0" y="0" width="${W}" height="${horizon}" fill="white"/>
      ${stripes.join("")}
    </mask>
    <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <style>
      .tw { animation: tw 3.2s ease-in-out infinite; }
      .halo { animation: pulse 5s ease-in-out infinite; transform-origin: ${sun.cx}px ${sun.cy}px; }
      .cursor { animation: blink 1.1s steps(1) infinite; }
      .shoot { opacity: 0; animation: shoot 9s linear infinite; }
      .s2 { animation-name: shoot2; animation-duration: 13s; animation-delay: 4s; }
      .scan { animation: scan 7s linear infinite; }
      @keyframes shoot { 0% { transform: translate(120px, 18px) rotate(24deg); opacity: 0 } 2% { opacity: 0.9 } 11% { transform: translate(430px, 156px) rotate(24deg); opacity: 0 } 100% { transform: translate(430px, 156px) rotate(24deg); opacity: 0 } }
      @keyframes shoot2 { 0% { transform: translate(560px, 10px) rotate(155deg); opacity: 0 } 2% { opacity: 0.8 } 9% { transform: translate(330px, 118px) rotate(155deg); opacity: 0 } 100% { transform: translate(330px, 118px) rotate(155deg); opacity: 0 } }
      @keyframes scan { from { transform: translateY(-40px) } to { transform: translateY(${H}px) } }
      @keyframes tw { 0%,100% { opacity: 1 } 50% { opacity: 0.15 } }
      @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.85 } 50% { transform: scale(1.12); opacity: 1 } }
      @keyframes blink { 0%,55% { opacity: 1 } 56%,100% { opacity: 0 } }
      @media (prefers-reduced-motion: reduce) { .tw, .halo, .cursor { animation: none } .shoot, .scan { display: none } }
    </style>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <g fill="#ffffff" opacity="0.8">${stars.join("")}</g>

    <g stroke="#ffffff" stroke-width="1.6" stroke-linecap="round">
      <line class="shoot" x1="0" y1="0" x2="46" y2="0"/>
      <line class="shoot s2" x1="0" y1="0" x2="34" y2="0"/>
    </g>
    <rect class="scan" x="0" y="0" width="${W}" height="40" fill="url(#scanband)"/>

    <circle class="halo" cx="${sun.cx}" cy="${sun.cy}" r="${sun.r + 62}" fill="url(#halo)"/>
    <circle cx="${sun.cx}" cy="${sun.cy}" r="${sun.r}" fill="url(#sun)" mask="url(#sunmask)"/>

    <rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${C.night}"/>
    ${grid({ horizon, bottom: H, vx: sun.cx, rows: 10, speed: 3.6 })}
    <rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floorfade)"/>
    <line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="${C.cyan}" stroke-width="2" filter="url(#glow)"/>

    <text x="48" y="70" font-family="${MONO}" font-size="13" letter-spacing="3" fill="${C.magenta}">// HELLO, WORLD</text>
    <text x="46" y="128" font-family="${SANS}" font-size="46" font-weight="800" font-style="italic" letter-spacing="1" fill="${C.magenta}" opacity="0.9" filter="url(#glow)">MUHAMMAD MEHDY</text>
    <text x="46" y="128" font-family="${SANS}" font-size="46" font-weight="800" font-style="italic" letter-spacing="1" fill="url(#title)">MUHAMMAD MEHDY</text>
    <text x="48" y="164" font-family="${MONO}" font-size="16" letter-spacing="2.5" fill="${C.cyan}">SOFTWARE ENGINEER · DATA &amp; AI<tspan class="cursor" fill="${C.magenta}"> _</tspan></text>
    <text x="48" y="190" font-family="${SANS}" font-size="14" fill="${C.soft}">LLM automation · data pipelines · products shipped end to end</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------- section header
function header(label, index) {
  const H = 46;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">
  <defs>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.magenta}"/>
      <stop offset="0.6" stop-color="${C.violet}"/>
      <stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <style>
      .sweep { animation: sweep 5s ease-in-out infinite; }
      @keyframes sweep { 0% { transform: translateX(0) } 60%, 100% { transform: translateX(${W + 120}px) } }
      @media (prefers-reduced-motion: reduce) { .sweep { display: none } }
    </style>
  </defs>
  <text x="2" y="24" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${C.cyan}">${index}</text>
  <text x="34" y="25" font-family="${SANS}" font-size="20" font-weight="800" font-style="italic" letter-spacing="2.5" fill="${C.magenta}">${esc(label)}</text>
  <rect x="0" y="38" width="${W}" height="2.5" rx="1.25" fill="url(#rule)"/>
  <rect class="sweep" x="-120" y="37.5" width="120" height="3.5" rx="1.75" fill="url(#spark)"/>
</svg>`;
}

// ---------------------------------------------------------------- chips
function chips(items, x0, y, { maxX, size = 11.5, color = C.cyan, gap = 7, h = 22 }) {
  const out = [];
  let x = x0;
  let rowY = y;
  for (const item of items) {
    const w = Math.round(item.length * size * 0.62 + 18);
    if (x + w > maxX) {
      x = x0;
      rowY += h + gap;
    }
    out.push(
      `<rect x="${x}" y="${rowY}" width="${w}" height="${h}" rx="${h / 2}" fill="${color}" fill-opacity="0.09" stroke="${color}" stroke-opacity="0.55"/>` +
        `<text x="${x + w / 2}" y="${rowY + h / 2 + size * 0.36}" text-anchor="middle" font-family="${MONO}" font-size="${size}" fill="${color}">${esc(item)}</text>`
    );
    x += w + gap;
  }
  return { svg: out.join(""), bottom: rowY + h };
}

// Greedy word wrap. Kept conservative (52 chars at 12.5px) so the copy still
// fits the card when a visitor's system falls back to a wider font.
function wrap(text, max) {
  const out = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && (line + " " + word).length > max) {
      out.push(line);
      line = word;
    } else {
      line = line ? line + " " + word : word;
    }
  }
  if (line) out.push(line);
  if (out.length > 4) throw new Error("card copy too long: " + text);
  return out;
}

// ---------------------------------------------------------------- project card
function card(p, n) {
  const CW = 440;
  const CH = 236;
  const accent = p.live ? C.cyan : C.yellow;
  const tag = p.live ? "LIVE" : p.tag;
  const stack = chips(p.stack, 22, 172, { maxX: CW - 20, size: 10.5, h: 20, gap: 6, color: C.violet });
  const lines = wrap(p.lines.join(" "), 52)
    .map((l, i) => `<text x="22" y="${97 + i * 18}" font-family="${SANS}" font-size="12.5" fill="${C.soft}">${esc(l)}</text>`)
    .join("");
  const foot = p.live
    ? `<text x="22" y="${CH - 14}" font-family="${MONO}" font-size="11" fill="${C.cyan}">▶ ${esc(p.live)}</text>`
    : `<text x="22" y="${CH - 14}" font-family="${MONO}" font-size="11" fill="${C.muted}">${esc(p.foot)}</text>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CW} ${CH}" width="${CW}" height="${CH}" role="img" aria-label="${esc(p.name + ": " + p.tagline)}">
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.magenta}"/>
      <stop offset="1" stop-color="${C.cyan}"/>
    </linearGradient>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.dusk}"/>
      <stop offset="1" stop-color="${C.night}"/>
    </linearGradient>
    <radialGradient id="corner" cx="1" cy="0" r="0.9">
      <stop offset="0" stop-color="${C.magenta}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${C.magenta}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="clip"><rect x="1" y="1" width="${CW - 2}" height="${CH - 2}" rx="13"/></clipPath>
    <style>
      .breathe { animation: breathe 6s ease-in-out infinite; animation-delay: -${n}s; }
      @keyframes breathe { 0%, 100% { opacity: 0.5 } 50% { opacity: 1 } }
      @media (prefers-reduced-motion: reduce) { .breathe { animation: none } }
    </style>
  </defs>
  <rect x="1" y="1" width="${CW - 2}" height="${CH - 2}" rx="13" fill="url(#fill)"/>
  <g clip-path="url(#clip)">
    <rect class="breathe" x="0" y="0" width="${CW}" height="${CH}" fill="url(#corner)"/>
    <g stroke="${C.magenta}" stroke-width="1" opacity="0.16">
      ${Array.from({ length: 7 }, (_, i) => `<line x1="${CW - 150 + i * 25}" y1="0" x2="${CW - 150 + i * 25}" y2="62"/>`).join("")}
      ${Array.from({ length: 3 }, (_, i) => `<line x1="${CW - 150}" y1="${12 + i * 25}" x2="${CW}" y2="${12 + i * 25}"/>`).join("")}
    </g>
  </g>
  <rect x="1" y="1" width="${CW - 2}" height="${CH - 2}" rx="13" fill="none" stroke="url(#edge)" stroke-width="1.6"/>

  <text x="22" y="32" font-family="${MONO}" font-size="11" letter-spacing="2" fill="${C.muted}">${String(n).padStart(2, "0")}</text>
  <rect x="${CW - 22 - (tag.length * 7.4 + 26)}" y="18" width="${tag.length * 7.4 + 26}" height="20" rx="10" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.7"/>
  <circle cx="${CW - 22 - (tag.length * 7.4 + 26) + 12}" cy="28" r="3" fill="${accent}"/>
  <text x="${CW - 22 - (tag.length * 7.4 + 26) + 21}" y="32" font-family="${MONO}" font-size="10.5" letter-spacing="1" fill="${accent}">${tag}</text>

  <text x="22" y="58" font-family="${SANS}" font-size="22" font-weight="800" fill="${C.text}">${esc(p.name)}</text>
  <text x="22" y="77" font-family="${SANS}" font-size="12.5" font-weight="600" fill="${C.magenta}">${esc(p.tagline)}</text>
  ${lines}
  ${stack.svg}
  ${foot}
</svg>`;
}

// ---------------------------------------------------------------- stack panel
function stackPanel(groups) {
  const labelW = 132;
  let y = 20;
  const rows = [];
  const palette = [C.cyan, C.magenta, C.yellow, C.violet];
  groups.forEach((g, i) => {
    const color = palette[i % palette.length];
    const row = chips(g.items, labelW + 22, y, { maxX: W - 20, size: 12, h: 24, gap: 8, color });
    rows.push(
      `<text x="22" y="${y + 16.5}" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${color}">${esc(g.label)}</text>` + row.svg
    );
    y = row.bottom + 14;
  });
  const H = y + 6;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tech stack: ${esc(groups.map((g) => g.label + " " + g.items.join(", ")).join("; "))}">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.dusk}"/>
      <stop offset="1" stop-color="${C.night}"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.magenta}"/>
      <stop offset="1" stop-color="${C.cyan}"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="13" fill="url(#fill)" stroke="url(#edge)" stroke-width="1.6"/>
  <line x1="${labelW + 6}" y1="16" x2="${labelW + 6}" y2="${H - 16}" stroke="${C.violet}" stroke-opacity="0.35"/>
  ${rows.join("\n  ")}
</svg>`;
}

// ---------------------------------------------------------------- footer
function footer() {
  const H = 120;
  const horizon = 18;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Thanks for stopping by">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.night}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.night}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-300%" width="140%" height="700%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="14"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="${C.night}"/>
    ${grid({ horizon, bottom: H, rows: 8, opacity: 0.55, speed: 3.6 })}
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
    <line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="${C.cyan}" stroke-width="2" filter="url(#glow)"/>
    <rect x="${W / 2 - 150}" y="50" width="300" height="40" rx="20" fill="${C.night}" fill-opacity="0.85" stroke="${C.magenta}" stroke-opacity="0.8"/>
    <text x="${W / 2}" y="75" text-anchor="middle" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="${C.text}">THANKS FOR STOPPING BY</text>
  </g>
</svg>`;
}

// ================================================================ data
const PROJECTS = [
  {
    file: "card-neural-lab.svg",
    name: "Neural Lab",
    tagline: "Classroom lessons on what a machine really learns",
    lines: [
      "Teams draw on their phones, train a tiny neural network in the",
      "browser, then watch it fail on other teams' drawings. Lesson",
      "two: cross-examine chatbots they trained.",
    ],
    stack: ["React", "Vite", "Firebase RTDB", "Vitest", "GitHub Actions"],
    live: "mehdy922.github.io/neural-lab",
  },
  {
    file: "card-razetech.svg",
    name: "RazeTech",
    tagline: "E-commerce storefront + admin for a tech retailer",
    lines: [
      "Catalog, cart, guest and account checkout, order tracking,",
      "custom orders and an admin panel. TypeScript monorepo",
      "running entirely on free tiers.",
    ],
    stack: ["Next.js", "TypeScript", "Firestore", "Netlify", "Cloudinary"],
    live: "razetech-pk.netlify.app",
  },
  {
    file: "card-meha-tracker.svg",
    name: "MEHA Tracker",
    tagline: "Shared weight + calorie tracker for friend groups",
    lines: [
      "Log daily weight and calories, set a goal, and see who is",
      "closest to their target. Email and password auth on Supabase,",
      "with Postgres row-level security.",
    ],
    stack: ["Next.js 15", "Supabase", "Postgres RLS", "Recharts"],
    live: "meha-tracker.vercel.app",
  },
  {
    file: "card-elder-ring.svg",
    name: "Elder Ring",
    tagline: "Real-time AI monitoring for elderly care",
    lines: [
      "Final year project. Detects falls and custom gestures with",
      "YOLOv8 posture recognition and pushes real-time emergency",
      "alerts to caregivers through a Flutter app.",
    ],
    stack: ["Python", "YOLOv8", "Flutter", "Firebase"],
    tag: "FYP",
    foot: "final year project · private repo",
  },
  {
    file: "card-moveon.svg",
    name: "MoveOn",
    tagline: "Booking app for a transport company",
    lines: [
      "Cross-platform app for real-time tour and wedding transport",
      "bookings, built for a real client and used by 100+ people.",
    ],
    stack: ["Flutter", "Dart", "Firestore", "Cloud Functions"],
    tag: "CLIENT",
    foot: "client work · private repo",
  },
  {
    file: "card-ai-automation.svg",
    name: "AI Workflow Automation",
    tagline: "Day job: Data & AI engineering at Techlogix",
    lines: [
      "LLM-driven tools that take manual workflows from",
      "hours to minutes, plus ETL/ELT pipelines and Oracle PL/SQL",
      "for production database migrations.",
    ],
    stack: ["Python", "LLM integration", "Oracle", "PL/SQL", "ETL/ELT"],
    tag: "WORK",
    foot: "employer work · not public",
  },
];

const STACK = [
  { label: "DATA & AI", items: ["Python", "SQL", "PL/SQL", "Oracle DB", "ETL/ELT pipelines", "LLM integration", "YOLOv8"] },
  { label: "WEB", items: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Tailwind", "Supabase", "Firebase"] },
  { label: "MOBILE", items: ["Flutter", "Dart", "Firebase Auth", "Firestore", "Cloud Functions"] },
  { label: "TOOLS", items: ["Git", "GitHub Actions", "Linux", "AWS", "Netlify", "Vercel", "C/C++"] },
];

// ================================================================ build
save("banner.svg", banner());
save("header-now.svg", header("NOW", "01"));
save("header-builds.svg", header("FEATURED BUILDS", "02"));
save("header-stack.svg", header("STACK", "03"));
save("header-badges.svg", header("BADGES", "04"));
save("header-contact.svg", header("CONTACT", "05"));
PROJECTS.forEach((p, i) => save(p.file, card(p, i + 1)));
save("stack.svg", stackPanel(STACK));
save("footer.svg", footer());

console.log(`wrote ${PROJECTS.length + 8} files to ${OUT}`);
