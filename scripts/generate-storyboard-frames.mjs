import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const width = 1920;
const height = 1080;
const outputDir = path.resolve("public/images/storyboard");

const frameFiles = [
  "frame-01.jpg",
  "frame-02.jpg",
  "frame-03.jpg",
  "frame-04.jpg",
  "frame-05.jpg",
  "frame-06.jpg",
  "frame-07.jpg"
];

function createRng(seed) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function snowField(seed, count, options = {}) {
  const random = createRng(seed);
  const minRadius = options.minRadius ?? 1.4;
  const maxRadius = options.maxRadius ?? 8.4;
  const minOpacity = options.minOpacity ?? 0.12;
  const maxOpacity = options.maxOpacity ?? 0.72;

  return Array.from({ length: count }, () => {
    const x = (random() * width).toFixed(2);
    const y = (random() * height).toFixed(2);
    const radius = (minRadius + random() * (maxRadius - minRadius)).toFixed(2);
    const opacity = (minOpacity + random() * (maxOpacity - minOpacity)).toFixed(2);
    const glow = random() > 0.72 ? ' filter="url(#snow-blur)"' : "";

    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="rgba(255,255,255,${opacity})"${glow} />`;
  }).join("");
}

function gogglePath(x, y, w, h) {
  const radius = h * 0.18;
  const noseWidth = w * 0.15;
  const noseDepth = h * 0.24;
  const center = x + w / 2;
  const right = x + w;
  const bottom = y + h;

  return [
    `M ${x + radius} ${y}`,
    `H ${right - radius}`,
    `Q ${right} ${y} ${right} ${y + radius}`,
    `V ${bottom - radius}`,
    `Q ${right} ${bottom} ${right - radius} ${bottom}`,
    `H ${center + noseWidth}`,
    `Q ${center + noseWidth * 0.36} ${bottom - noseDepth * 0.22} ${center + noseWidth * 0.12} ${bottom - noseDepth * 0.8}`,
    `Q ${center} ${bottom - noseDepth} ${center - noseWidth * 0.12} ${bottom - noseDepth * 0.8}`,
    `Q ${center - noseWidth * 0.36} ${bottom - noseDepth * 0.22} ${center - noseWidth} ${bottom}`,
    `H ${x + radius}`,
    `Q ${x} ${bottom} ${x} ${bottom - radius}`,
    `V ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    "Z"
  ].join(" ");
}

function callout({
  anchorX,
  anchorY,
  elbowX,
  elbowY,
  title,
  subtitle,
  align = "start"
}) {
  const textAnchor = align === "end" ? "end" : "start";
  const horizontalEnd = align === "end" ? elbowX - 260 : elbowX + 260;
  const textX = align === "end" ? elbowX - 8 : elbowX + 8;

  return `
    <g>
      <path
        d="M ${anchorX} ${anchorY} L ${elbowX} ${elbowY} L ${horizontalEnd} ${elbowY}"
        fill="none"
        stroke="rgba(235,242,248,0.5)"
        stroke-width="1.5"
      />
      <circle cx="${anchorX}" cy="${anchorY}" r="5.5" fill="none" stroke="rgba(235,242,248,0.82)" stroke-width="1.5" />
      <text x="${textX}" y="${elbowY - 12}" fill="#f2f6fb" font-size="24" font-weight="500" text-anchor="${textAnchor}">
        ${title}
      </text>
      <text x="${textX}" y="${elbowY + 26}" fill="rgba(242,246,251,0.74)" font-size="18" text-anchor="${textAnchor}">
        ${subtitle}
      </text>
    </g>
  `;
}

function renderHud({
  left = 360,
  top = 180,
  width: hudWidth = 1220,
  brightness = 1,
  large = false
}) {
  const strokeOpacity = large ? 0.78 : 0.58;
  const fillOpacity = large ? 0.1 : 0.06;
  const textOpacity = large ? 0.96 : 0.84;
  const lineOpacity = large ? 0.9 : 0.72;
  const leftBoxWidth = large ? 430 : 360;
  const rightBoxWidth = large ? 430 : 360;
  const middleY = top + 120;

  return `
    <g opacity="${brightness}">
      <g filter="url(#hud-glow)">
        <path
          d="M ${left + 20} ${top} H ${left + leftBoxWidth - 50} L ${left + leftBoxWidth} ${top + 90} L ${left + leftBoxWidth - 50} ${top + 180} H ${left + 20}
             Q ${left} ${top + 180} ${left} ${top + 160} V ${top + 20} Q ${left} ${top} ${left + 20} ${top}"
          fill="rgba(185,234,255,${fillOpacity})"
          stroke="rgba(229,247,255,${strokeOpacity})"
          stroke-width="2"
        />
        <path
          d="M ${left + hudWidth - rightBoxWidth + 50} ${top} H ${left + hudWidth - 20}
             Q ${left + hudWidth} ${top} ${left + hudWidth} ${top + 20} V ${top + 160}
             Q ${left + hudWidth} ${top + 180} ${left + hudWidth - 20} ${top + 180}
             H ${left + hudWidth - rightBoxWidth + 50} L ${left + hudWidth - rightBoxWidth} ${top + 90} Z"
          fill="rgba(185,234,255,${fillOpacity})"
          stroke="rgba(229,247,255,${strokeOpacity})"
          stroke-width="2"
        />
        <line
          x1="${left + hudWidth * 0.43}"
          y1="${middleY}"
          x2="${left + hudWidth * 0.57}"
          y2="${middleY}"
          stroke="rgba(220,250,255,${lineOpacity})"
          stroke-width="3"
          stroke-linecap="round"
        />
      </g>

      <g fill="rgba(245,249,252,${textOpacity})">
        <text x="${left + 82}" y="${top + 44}" font-size="22">Speed:</text>
        <text x="${left + 82}" y="${top + 112}" font-size="${large ? 52 : 46}" font-weight="500">28 km/h</text>
        <text x="${left + 82}" y="${top + 156}" font-size="22">Temperature:</text>
        <text x="${left + 82}" y="${top + 222}" font-size="${large ? 52 : 46}" font-weight="500">-4°C</text>

        <text x="${left + hudWidth * 0.47}" y="${top + 62}" font-size="28" text-anchor="middle">Direction:</text>
        <text x="${left + hudWidth * 0.47}" y="${top + 122}" font-size="${large ? 52 : 48}" font-weight="500" text-anchor="middle">NE</text>
        <path
          d="M ${left + hudWidth * 0.53} ${top + 108} l 38 -14 l -14 38 l -10 -12 z"
          fill="rgba(235,249,255,${textOpacity})"
        />

        <text x="${left + hudWidth - 208}" y="${top + 44}" font-size="22" text-anchor="middle">Altitude:</text>
        <text x="${left + hudWidth - 208}" y="${top + 112}" font-size="${large ? 52 : 46}" font-weight="500" text-anchor="middle">2140 m</text>
        <path
          d="M ${left + hudWidth - 310} ${top + 122} l 24 -32 l 24 32 z"
          fill="rgba(235,249,255,${textOpacity})"
        />
        <path
          d="M ${left + hudWidth - 288} ${top + 108} l 16 -22 l 16 22 z"
          fill="rgba(185,234,255,${textOpacity})"
        />
      </g>
    </g>
  `;
}

function mountainScene({ framed = false }) {
  const sceneTop = framed ? 120 : 0;
  const skyHeight = framed ? 720 : 840;
  const horizon = framed ? 440 : 510;

  return `
    <rect x="0" y="${sceneTop}" width="${width}" height="${height - sceneTop}" fill="url(#sky-gradient)" />
    <path d="M 0 ${horizon} L 180 ${horizon - 80} L 360 ${horizon - 40} L 520 ${horizon - 120} L 760 ${horizon - 65} L 980 ${horizon - 135} L 1220 ${horizon - 42} L 1490 ${horizon - 124} L 1710 ${horizon - 28} L 1920 ${horizon - 82} L 1920 ${height} L 0 ${height} Z" fill="#93abc8" opacity="0.62" />
    <path d="M 0 ${horizon + 40} L 120 ${horizon - 10} L 290 ${horizon + 30} L 470 ${horizon - 42} L 660 ${horizon + 22} L 910 ${horizon - 72} L 1140 ${horizon + 26} L 1410 ${horizon - 58} L 1640 ${horizon + 20} L 1920 ${horizon - 24} L 1920 ${height} L 0 ${height} Z" fill="#7388a8" opacity="0.82" />
    <path d="M 0 ${horizon + 170} L 220 ${horizon + 140} L 450 ${horizon + 110} L 660 ${horizon + 160} L 960 ${horizon + 122} L 1300 ${horizon + 178} L 1640 ${horizon + 88} L 1920 ${horizon + 142} L 1920 ${height} L 0 ${height} Z" fill="#f4f7fc" />
    <path d="M 0 700 C 340 630 620 610 930 670 S 1560 665 1920 590 L 1920 1080 L 0 1080 Z" fill="#eef4fa" />
    <path d="M 0 760 C 280 730 590 710 840 756 S 1380 810 1920 720" fill="none" stroke="rgba(205,219,234,0.95)" stroke-width="4" stroke-linecap="round" />
    <path d="M 180 690 C 420 680 680 630 930 678 S 1470 725 1760 650" fill="none" stroke="rgba(255,255,255,0.62)" stroke-width="2" />
    <path d="M 1210 710 C 1310 760 1360 835 1460 870" fill="none" stroke="rgba(207,223,240,0.9)" stroke-width="4" stroke-linecap="round" />
    <path d="M 1125 760 C 1200 782 1256 820 1316 842" fill="none" stroke="rgba(207,223,240,0.82)" stroke-width="3" stroke-linecap="round" />
    <circle cx="1040" cy="780" r="5" fill="#313844" />
    <circle cx="1112" cy="804" r="5" fill="#31517b" />
    <circle cx="1170" cy="790" r="5" fill="#d6a649" />
    <circle cx="1258" cy="834" r="5" fill="#ca4c56" />
    <circle cx="1338" cy="822" r="5" fill="#6cc1d9" />
    <path d="M 894 910 l -10 170 l 28 0 l -8 -170 z" fill="#11161b" />
    <path d="M 994 910 l -6 170 l 28 0 l -12 -170 z" fill="#171d24" />
    <path d="M 898 978 l -14 -18 l 18 -22 l 14 18 z" fill="#d84b3d" />
    <path d="M 998 978 l -14 -18 l 18 -22 l 14 18 z" fill="#d84b3d" />
    <path d="M 112 890 c -22 58 -26 112 -20 176 l 80 -18 c 0 -40 8 -96 18 -146 z" fill="#0f141b" />
    <path d="M 1760 890 c 18 56 24 108 20 174 l -82 -20 c 0 -38 -8 -94 -18 -146 z" fill="#0f141b" />
    ${snowField(12, 84, { minRadius: 1.2, maxRadius: 7.8, minOpacity: 0.1, maxOpacity: 0.55 })}
  `;
}

function frontGoggle({
  x,
  y,
  w,
  h,
  clipId,
  transparent = false,
  scene = "",
  overlay = "",
  brand = true,
  opacity = 1
}) {
  const outer = gogglePath(x, y, w, h);
  const inner = gogglePath(x + 42, y + 38, w - 84, h - 92);
  const fill = transparent ? "url(#glass-shell)" : "url(#carbon-pattern)";
  const frameStroke = transparent ? "rgba(237,246,255,0.88)" : "#55606d";
  const frameOpacity = transparent ? 0.24 : 1;
  const sceneMarkup = scene
    ? `<g clip-path="url(#${clipId})">${scene}</g>`
    : "";
  const overlayMarkup = overlay
    ? `<g clip-path="url(#${clipId})">${overlay}</g>`
    : "";

  return {
    defs: `<clipPath id="${clipId}"><path d="${inner}" /></clipPath>`,
    outer,
    inner,
    markup: `
      <g opacity="${opacity}">
        <path d="${outer}" fill="${fill}" fill-opacity="${frameOpacity}" stroke="${frameStroke}" stroke-width="${transparent ? 3 : 4}" />
        <path d="${outer}" fill="url(#frame-sheen)" opacity="${transparent ? 0.14 : 0.34}" />
        <path d="${inner}" fill="${transparent ? "rgba(240,248,255,0.08)" : "url(#lens-dark)"}" stroke="${transparent ? "rgba(236,246,255,0.62)" : "rgba(202,228,255,0.18)"}" stroke-width="${transparent ? 2 : 1.4}" />
        ${sceneMarkup}
        ${overlayMarkup}
        <ellipse cx="${x + w * 0.47}" cy="${y + 44}" rx="${w * 0.28}" ry="26" fill="rgba(255,255,255,0.16)" filter="url(#soft-blur)" />
        <rect x="${x + 26}" y="${y + h - 30}" width="38" height="14" rx="7" fill="#8fdfff" opacity="${transparent ? 0.18 : 0.82}" />
        <rect x="${x + w - 64}" y="${y + h - 30}" width="38" height="14" rx="7" fill="#8fdfff" opacity="${transparent ? 0.18 : 0.82}" />
        <rect x="${x + w - 20}" y="${y + 130}" width="12" height="30" rx="6" fill="#8fdfff" opacity="${transparent ? 0.18 : 0.86}" />
        <rect x="${x + w - 20}" y="${y + 188}" width="12" height="30" rx="6" fill="#8fdfff" opacity="${transparent ? 0.18 : 0.7}" />
        ${
          brand
            ? `<text x="${x + w / 2}" y="${y + 34}" fill="rgba(241,246,251,0.74)" font-size="22" text-anchor="middle" letter-spacing="2.5">NEO-VISION</text>`
            : ""
        }
      </g>
    `
  };
}

function sideProfileFrame() {
  const goggle = frontGoggle({
    x: 250,
    y: 210,
    w: 760,
    h: 500,
    clipId: "side-lens",
    brand: false
  });

  return svgDocument({
    defs: goggle.defs,
    content: `
      ${darkBackdrop(41)}
      <g transform="translate(80 26) rotate(-6 920 450)">
        <g>
          ${goggle.markup}
          <rect x="936" y="286" width="96" height="338" rx="38" fill="#1a2027" stroke="rgba(100,112,126,0.56)" stroke-width="2" />
          <rect x="1014" y="344" width="706" height="154" rx="42" fill="url(#carbon-pattern)" stroke="rgba(72,80,90,0.64)" stroke-width="2" />
          <rect x="1162" y="374" width="426" height="96" rx="28" fill="rgba(28,32,39,0.88)" stroke="rgba(153,227,255,0.78)" stroke-width="2" />
          <rect x="1162" y="374" width="426" height="96" rx="28" fill="url(#hud-panel)" opacity="0.9" filter="url(#hud-glow)" />
          <text x="1094" y="418" fill="rgba(235,243,250,0.42)" font-size="20" letter-spacing="2">NEO-VISION</text>
          <text x="1210" y="431" fill="rgba(245,249,252,0.96)" font-size="18">Speed:</text>
          <text x="1210" y="458" fill="rgba(245,249,252,0.96)" font-size="28">28 km/h</text>
          <text x="1362" y="431" fill="rgba(245,249,252,0.96)" font-size="18">Direction:</text>
          <text x="1362" y="458" fill="rgba(245,249,252,0.96)" font-size="28">NE</text>
          <text x="1506" y="431" fill="rgba(245,249,252,0.96)" font-size="18">Altitude:</text>
          <text x="1506" y="458" fill="rgba(245,249,252,0.96)" font-size="28">2140 m</text>
          <text x="868" y="338" fill="rgba(243,248,252,0.55)" font-size="20">N</text>
        </g>
      </g>
      ${snowField(42, 92)}
    `
  });
}

function explodedElectronicsFrame() {
  const rightBody = frontGoggle({
    x: 860,
    y: 180,
    w: 790,
    h: 520,
    clipId: "electronics-lens",
    brand: false
  });
  const leftOuter = gogglePath(240, 240, 610, 450);
  const leftMid = gogglePath(520, 220, 580, 470);
  const leftInner = gogglePath(690, 205, 550, 480);

  return svgDocument({
    defs: rightBody.defs,
    content: `
      ${darkBackdrop(51)}
      <path d="${leftOuter}" fill="url(#glass-lens)" fill-opacity="0.32" stroke="rgba(238,247,255,0.66)" stroke-width="3" />
      <path d="${leftMid}" fill="url(#glass-lens)" fill-opacity="0.24" stroke="rgba(238,247,255,0.58)" stroke-width="2.5" />
      <path d="${leftInner}" fill="url(#glass-lens)" fill-opacity="0.18" stroke="rgba(238,247,255,0.56)" stroke-width="2.5" />
      ${rightBody.markup}
      <rect x="1510" y="324" width="360" height="126" rx="40" fill="url(#carbon-pattern)" stroke="rgba(72,80,90,0.7)" stroke-width="2" />
      <rect x="1438" y="262" width="68" height="354" rx="30" fill="#171d25" stroke="rgba(92,104,116,0.62)" stroke-width="2" />
      <rect x="1006" y="420" width="92" height="92" rx="10" fill="#927455" stroke="#d7be8f" stroke-width="3" />
      <rect x="1026" y="440" width="52" height="52" rx="6" fill="url(#chip-core)" />
      <path d="M 1106 450 C 1160 420 1230 406 1334 398" fill="none" stroke="rgba(198,237,255,0.74)" stroke-width="3" />
      <path d="M 1106 470 C 1188 462 1248 462 1334 462" fill="none" stroke="rgba(198,237,255,0.6)" stroke-width="3" />
      <path d="M 1106 490 C 1206 510 1264 530 1334 562" fill="none" stroke="rgba(198,237,255,0.44)" stroke-width="3" />
      ${callout({
        anchorX: 560,
        anchorY: 336,
        elbowX: 160,
        elbowY: 132,
        title: "Outer Protective Lens",
        subtitle: "Hard-coated outer surface"
      })}
      ${callout({
        anchorX: 694,
        anchorY: 360,
        elbowX: 640,
        elbowY: 144,
        title: "Optical Transparent Lens",
        subtitle: "Crystal-clear vision layer"
      })}
      ${callout({
        anchorX: 1062,
        anchorY: 320,
        elbowX: 1210,
        elbowY: 126,
        title: "Reflective Projection Layer",
        subtitle: "Semi-mirror waveguide"
      })}
      ${callout({
        anchorX: 1052,
        anchorY: 464,
        elbowX: 1320,
        elbowY: 276,
        title: "Micro-LED Display Module",
        subtitle: "Waveguide micro-optics"
      })}
      ${callout({
        anchorX: 1180,
        anchorY: 760,
        elbowX: 1244,
        elbowY: 878,
        title: "Inner Protective Layer",
        subtitle: "Comfort-facing lens"
      })}
      ${snowField(52, 92)}
    `
  });
}

function explodedClearFrame() {
  const frameLayer = gogglePath(1020, 215, 650, 470);
  const outerLens = gogglePath(250, 220, 620, 470);
  const opticalLens = gogglePath(500, 245, 590, 452);
  const reflectiveLayer = gogglePath(760, 232, 560, 462);
  const innerLens = gogglePath(1000, 225, 610, 470);

  return svgDocument({
    content: `
      ${darkBackdrop(61)}
      <path d="${outerLens}" fill="url(#glass-lens)" fill-opacity="0.34" stroke="rgba(240,248,255,0.82)" stroke-width="3" />
      <path d="${opticalLens}" fill="url(#glass-lens)" fill-opacity="0.24" stroke="rgba(240,248,255,0.72)" stroke-width="2.5" />
      <path d="${reflectiveLayer}" fill="url(#glass-lens)" fill-opacity="0.16" stroke="rgba(240,248,255,0.68)" stroke-width="2.5" />
      <path d="${innerLens}" fill="url(#glass-lens)" fill-opacity="0.14" stroke="rgba(240,248,255,0.64)" stroke-width="2.5" />
      <path d="${frameLayer}" fill="url(#glass-shell)" fill-opacity="0.18" stroke="rgba(240,248,255,0.54)" stroke-width="3" />
      <path d="M 1030 442 C 1080 434 1118 430 1186 432 S 1298 438 1376 432" fill="none" stroke="rgba(190,231,255,0.56)" stroke-width="3" />
      <path d="M 1030 468 C 1104 464 1182 464 1376 468" fill="none" stroke="rgba(190,231,255,0.48)" stroke-width="3" />
      <path d="M 1030 494 C 1080 500 1120 512 1186 538 S 1298 566 1376 564" fill="none" stroke="rgba(190,231,255,0.34)" stroke-width="3" />
      ${callout({
        anchorX: 464,
        anchorY: 300,
        elbowX: 136,
        elbowY: 130,
        title: "Outer Protective Lens",
        subtitle: "Precision hard-coated"
      })}
      ${callout({
        anchorX: 630,
        anchorY: 328,
        elbowX: 622,
        elbowY: 142,
        title: "Optical Lens",
        subtitle: "High-clarity optics"
      })}
      ${callout({
        anchorX: 984,
        anchorY: 430,
        elbowX: 1002,
        elbowY: 142,
        title: "Reflective Projection Layer",
        subtitle: "Internal micro-optics"
      })}
      ${callout({
        anchorX: 1204,
        anchorY: 488,
        elbowX: 1510,
        elbowY: 270,
        title: "Inner Protective Lens",
        subtitle: "Face-side seal"
      })}
      ${callout({
        anchorX: 1206,
        anchorY: 756,
        elbowX: 1420,
        elbowY: 866,
        title: "Clear Frame Structure",
        subtitle: "Precision molded"
      })}
      ${snowField(62, 82)}
    `
  });
}

function darkBackdrop(seed) {
  return `
    <rect width="${width}" height="${height}" fill="url(#dark-gradient)" />
    <rect width="${width}" height="${height}" fill="url(#ambient-shine)" opacity="0.88" />
    <ellipse cx="960" cy="920" rx="720" ry="180" fill="rgba(198,225,245,0.09)" filter="url(#soft-blur)" />
    <ellipse cx="1080" cy="260" rx="420" ry="140" fill="rgba(255,255,255,0.08)" filter="url(#soft-blur)" />
    ${snowField(seed, 74)}
  `;
}

function svgDocument({ content, defs = "" }) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="dark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#171c24" />
          <stop offset="45%" stop-color="#1f2630" />
          <stop offset="100%" stop-color="#11161d" />
        </linearGradient>
        <linearGradient id="ambient-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.1)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7db3eb" />
          <stop offset="48%" stop-color="#d7e6f7" />
          <stop offset="100%" stop-color="#edf4fb" />
        </linearGradient>
        <linearGradient id="lens-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(22,27,34,0.8)" />
          <stop offset="52%" stop-color="rgba(53,59,70,0.56)" />
          <stop offset="100%" stop-color="rgba(11,15,21,0.88)" />
        </linearGradient>
        <linearGradient id="glass-lens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(245,249,252,0.76)" />
          <stop offset="25%" stop-color="rgba(228,239,247,0.14)" />
          <stop offset="60%" stop-color="rgba(202,224,239,0.08)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.22)" />
        </linearGradient>
        <linearGradient id="glass-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(245,249,252,0.46)" />
          <stop offset="40%" stop-color="rgba(228,239,247,0.1)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.18)" />
        </linearGradient>
        <linearGradient id="frame-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
          <stop offset="16%" stop-color="rgba(255,255,255,0.06)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.2)" />
        </linearGradient>
        <linearGradient id="chip-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fff0c4" />
          <stop offset="50%" stop-color="#d6b6ff" />
          <stop offset="100%" stop-color="#79d8ff" />
        </linearGradient>
        <linearGradient id="hud-panel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="rgba(90,215,255,0.12)" />
          <stop offset="100%" stop-color="rgba(90,215,255,0.2)" />
        </linearGradient>
        <pattern id="carbon-pattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="20" height="20" fill="#242b34" />
          <rect width="10" height="10" fill="#39424d" />
          <rect x="10" y="10" width="10" height="10" fill="#39424d" />
          <rect x="10" y="0" width="10" height="10" fill="#1b2129" />
          <rect x="0" y="10" width="10" height="10" fill="#1b2129" />
        </pattern>
        <filter id="soft-blur">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="snow-blur">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <filter id="hud-glow">
          <feGaussianBlur stdDeviation="7" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        ${defs}
      </defs>
      <rect width="${width}" height="${height}" fill="#11161d" />
      <g font-family="Segoe UI, Arial, sans-serif">${content}</g>
    </svg>
  `;
}

function buildFrameSvgs() {
  const gogglePov = frontGoggle({
    x: 76,
    y: 86,
    w: 1768,
    h: 918,
    clipId: "pov-lens",
    scene: mountainScene({ framed: true }),
    overlay: renderHud({ left: 370, top: 160, width: 1180, large: false })
  });

  const frontMinimal = frontGoggle({
    x: 180,
    y: 160,
    w: 1560,
    h: 820,
    clipId: "front-minimal",
    overlay: renderHud({ left: 420, top: 318, width: 1080, large: false })
  });

  const frontLarge = frontGoggle({
    x: 120,
    y: 132,
    w: 1680,
    h: 856,
    clipId: "front-large",
    overlay: renderHud({ left: 400, top: 292, width: 1140, large: true })
  });

  return [
    svgDocument({
      content: `
        ${mountainScene({ framed: false })}
        ${renderHud({ left: 340, top: 92, width: 1260, large: true, brightness: 0.86 })}
      `
    }),
    svgDocument({
      defs: gogglePov.defs,
      content: `
        <rect width="${width}" height="${height}" fill="url(#dark-gradient)" />
        ${gogglePov.markup}
        <path d="M 0 0 H ${width} V 120 H 0 Z" fill="rgba(10,14,18,0.2)" />
        ${snowField(22, 90)}
      `
    }),
    sideProfileFrame(),
    svgDocument({
      defs: frontMinimal.defs,
      content: `
        ${darkBackdrop(31)}
        ${frontMinimal.markup}
        ${snowField(32, 88)}
      `
    }),
    svgDocument({
      defs: frontLarge.defs,
      content: `
        ${darkBackdrop(36)}
        ${frontLarge.markup}
        ${snowField(37, 90)}
      `
    }),
    explodedElectronicsFrame(),
    explodedClearFrame()
  ];
}

await mkdir(outputDir, { recursive: true });

const frameSvgs = buildFrameSvgs();

for (const [index, frameSvg] of frameSvgs.entries()) {
  const outputPath = path.join(outputDir, frameFiles[index]);

  await sharp(Buffer.from(frameSvg))
    .jpeg({
      quality: 88,
      mozjpeg: true,
      progressive: true
    })
    .toFile(outputPath);

  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
}
