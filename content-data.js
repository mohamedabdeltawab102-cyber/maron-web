/* =====================================================================
   MARON — Content Data Layer
   ---------------------------------------------------------------------
   Single source of truth for every editable piece of text/image on the
   site. The public site (index.html) and the admin panel (admin.html)
   both read/write through this file so edits made in the admin panel
   are reflected immediately on the live site (same browser/storage).
   ===================================================================== */

const MARON_STORAGE_KEY = "maron_site_content_v1";
const MARON_AUTH_KEY = "maron_admin_auth_v1";

/* Default admin password (SHA-256 hashed at runtime on first load if
   no hash is stored yet). Change this in admin.html > Settings tab. */
const MARON_DEFAULT_PASSWORD = "Maron@2026";

const MARON_DEFAULT_CONTENT = {
  brand: {
    companyName: "MARON",
    tagline: "Geomatics • Reality Capture",
    logoDataUrl: "", // if set (base64), overrides the default SVG emblem
    phone: "+20 100 000 0000",
    email: "info@maron-geo.com",
    address: "New Cairo, Cairo, Egypt",
    whatsapp: "+20 100 000 0000",
    facebook: "",
    linkedin: "",
    instagram: ""
  },
  hero: {
    badgeText: "Integrated Geospatial Intelligence",
    titleMain: "Engineering Data for",
    titleAccent: "Better Decisions",
    description:
      "Delivering integrated geomatics, surveying, and digital reality capture solutions across Egypt, the Middle East, and Africa for major infrastructure, energy, and construction projects.",
    ctaPrimary: "Request a Quote",
    ctaSecondary: "Explore Services",
    hudLat: "30.0444° N",
    hudLon: "31.2357° E",
    hudAccuracy: "±0.002 m",
    backgroundStyle: "animated", // "animated" (drone/radar/point-cloud) or "image"
    backgroundImageDataUrl: ""  // used when backgroundStyle === "image"
  },
  about: {
    tag: "About MARON",
    title: "Precision Geomatics & Engineering Excellence",
    paragraph1:
      "MARON is a leading Egyptian geomatics and surveying company providing integrated geospatial solutions utilizing both conventional precision instruments and cutting-edge digital reality capture technologies.",
    paragraph2:
      "By pairing field-proven surveying methodologies with modern UAV photogrammetry, 3D LiDAR, and digital twin workflows, we equip engineering consultants, contractors, and developers across the Middle East and Africa with actionable spatial data.",
    bullets: [
      "High Precision GNSS & Total Station",
      "3D Laser Scanning & LiDAR",
      "Aerial Photogrammetry",
      "GIS & Digital Twin Integration"
    ],
    visualBigNum: "mm",
    visualTitle: "Millimeter-Level Accuracy",
    visualDesc:
      "Ensuring rigorous quality control and data integrity across complex mega-infrastructure projects.",
    visualImageDataUrl: ""
  },
  stats: [
    { value: "12+", label: "Years of Experience" },
    { value: "350+", label: "Projects Delivered" },
    { value: "40+", label: "Specialists & Surveyors" },
    { value: "±2mm", label: "Typical Accuracy" }
  ],
  services: [
    {
      category: "land",
      icon: "compass",
      title: "Topographic & Cadastral Survey",
      desc: "Precise land and boundary surveys using GNSS RTK and Total Stations for engineering and legal purposes.",
      details: "We deliver high-accuracy topographic and cadastral surveys using GNSS RTK and robotic Total Stations, producing legally defensible boundary data, detailed contour maps, and engineering-ready base drawings for design teams, developers, and legal authorities.",
      imageDataUrl: ""
    },
    {
      category: "land",
      icon: "layout",
      title: "Setting Out & Construction Survey",
      desc: "On-site alignment, grading, and structural setting-out to keep construction within design tolerance.",
      details: "Our field teams provide precise on-site setting-out for foundations, grading, and structural elements throughout the construction lifecycle, ensuring every phase stays within design tolerance and reducing costly rework.",
      imageDataUrl: ""
    },
    {
      category: "aerial",
      icon: "drone",
      title: "UAV Photogrammetry",
      desc: "High-resolution drone mapping producing orthomosaics, DEMs, and contour maps for large sites.",
      details: "Using fixed-wing and multirotor UAVs, we capture high-resolution aerial imagery and process it into orthomosaics, digital elevation models, and contour maps — covering large sites in a fraction of the time of ground survey alone.",
      imageDataUrl: ""
    },
    {
      category: "aerial",
      icon: "map",
      title: "Aerial Corridor Mapping",
      desc: "Fast, accurate corridor and route mapping for roads, pipelines, and transmission line studies.",
      details: "We map long, linear corridors — roads, pipelines, and transmission routes — quickly and accurately from the air, giving planning teams reliable route data without the time and access constraints of ground-only surveying.",
      imageDataUrl: ""
    },
    {
      category: "3d",
      icon: "scan",
      title: "3D Laser Scanning",
      desc: "Terrestrial LiDAR scanning delivering dense, millimeter-accurate point clouds of complex assets.",
      details: "Our terrestrial LiDAR scanners capture dense, millimeter-accurate point clouds of buildings, plants, and infrastructure — the foundation for as-built documentation, clash detection, and renovation planning.",
      imageDataUrl: ""
    },
    {
      category: "3d",
      icon: "cube",
      title: "As-Built BIM & Scan-to-BIM",
      desc: "Converting point cloud data into intelligent 3D BIM models for renovation and facility management.",
      details: "We convert raw point cloud data into intelligent, standards-compliant 3D BIM models — enabling accurate renovation design, clash detection, and long-term facility management.",
      imageDataUrl: ""
    },
    {
      category: "gis",
      icon: "layers",
      title: "GIS Mapping & Analysis",
      desc: "Spatial data management, thematic mapping, and analysis to support planning and decision-making.",
      details: "Our GIS specialists structure, analyze, and visualize spatial data to support planning and investment decisions — from thematic mapping to custom dashboards for asset and land management.",
      imageDataUrl: ""
    },
    {
      category: "gis",
      icon: "volume",
      title: "Volumetric & Stockpile Analysis",
      desc: "Accurate cut/fill and stockpile volume reporting for mining, quarry, and earthworks operations.",
      details: "Using drone and LiDAR data, we deliver accurate cut/fill and stockpile volume reports for mining, quarry, and earthworks operations — supporting monthly reconciliation and progress tracking.",
      imageDataUrl: ""
    }
  ],
  industries: [
    { title: "Roads & Highways", desc: "Alignment surveys, corridor mapping, pavement inspection, and setting out.", imageDataUrl: "" },
    { title: "Infrastructure & Rail", desc: "High-density point clouds, deformation monitoring, and utility mapping.", imageDataUrl: "" },
    { title: "Solar & Renewable Energy", desc: "Topographic site characterization, panel layout setting out, and slope analysis.", imageDataUrl: "" },
    { title: "Mining & Quarries", desc: "Drone-based volumetric stockpiles, open-pit face mapping, and pit expansion monitoring.", imageDataUrl: "" },
    { title: "Real Estate & Development", desc: "Cadastral boundary confirmation, architectural BIM scanning, and site elevation models.", imageDataUrl: "" },
    { title: "Oil & Gas & Industrial", desc: "As-built plant scanning, pipe rack modeling, and offshore/onshore facility mapping.", imageDataUrl: "" }
  ],
  projects: {
    tag: "Our Work",
    title: "Featured Projects",
    description: "A snapshot of recent surveying and reality capture work delivered across the region.",
    items: [
      {
        title: "New Administrative Capital — Corridor Mapping",
        category: "Roads & Highways",
        description: "UAV corridor mapping and topographic survey supporting a major road alignment study.",
        imageDataUrl: ""
      },
      {
        title: "Industrial Plant — As-Built LiDAR Scan",
        category: "Oil & Gas & Industrial",
        description: "Terrestrial LiDAR scanning and scan-to-BIM modeling for an operating industrial facility.",
        imageDataUrl: ""
      },
      {
        title: "Solar Farm — Site Topographic Survey",
        category: "Solar & Renewable Energy",
        description: "Full topographic characterization supporting panel layout and slope analysis for a utility-scale solar site.",
        imageDataUrl: ""
      }
    ]
  },
  emailjs: {
    enabled: false,
    serviceId: "",
    templateId: "",
    publicKey: "",
    recipientEmail: "",
    subjectTemplate: "New Quote Request — {{fullname}} ({{service}})",
    bodyTemplate:
      "New project inquiry received from the MARON website:\n\nName: {{fullname}}\nCompany: {{company}}\nEmail: {{email}}\nPhone: {{phone}}\nService: {{service}}\n\nProject Details:\n{{message}}"
  },
  tech: {
    hardware: {
      title: "Field Hardware & Sensors",
      badges: ["GNSS RTK Receivers", "Robotic Total Stations", "Terrestrial LiDAR Scanners", "UAV / Drone Platforms", "Multispectral Sensors"]
    },
    software: {
      title: "Processing & Software Stack",
      badges: ["AutoCAD Civil 3D", "Trimble Business Center", "Agisoft Metashape", "Autodesk ReCap", "ArcGIS / QGIS"]
    }
  },
  cta: {
    title: "Get a Tailored Project Quote",
    description:
      "Tell us about your project scope and site, and our team will get back to you with a detailed proposal within 48 hours.",
    formNote: "This form is for demonstration. Connect it to your email/CRM backend to receive live submissions."
  },
  testimonials: [
    {
      quote: "The MARON survey team delivered accurate control data ahead of schedule, which kept our earthworks package on track from day one.",
      name: "Ahmed K.",
      role: "Project Director, Infrastructure"
    },
    {
      quote: "Their laser scan point clouds were clean and well registered, which made our BIM coordination noticeably faster.",
      name: "Sara M.",
      role: "BIM Manager, Construction"
    }
  ],
  clients: ["PETRONILE", "DESERT INFRA", "NILEBUILD", "ARABIAN UTILITIES", "SANDSTONE GROUP"],
  equipment: [
    { icon: "gnss", title: "GNSS Receivers", desc: "Centimeter-level RTK positioning for control and topographic survey." },
    { icon: "total", title: "Total Stations", desc: "Robotic and manual instruments for engineering and construction survey." },
    { icon: "scan", title: "3D Laser Scanners", desc: "Terrestrial scanners for high-resolution reality capture." },
    { icon: "drone", title: "Drones", desc: "Fixed-wing and multirotor UAVs with photogrammetry and LiDAR payloads." }
  ],
  footer: {
    about:
      "MARON delivers integrated geomatics, surveying, and reality capture solutions for infrastructure, energy, and development projects across Egypt, the Middle East, and Africa.",
    copyright: "© 2026 MARON Geomatics. All rights reserved."
  }
};

/* ---------------------------------------------------------------------
   Storage helpers
   --------------------------------------------------------------------- */

function maronGetContent() {
  try {
    const raw = localStorage.getItem(MARON_STORAGE_KEY);
    if (!raw) return structuredClone(MARON_DEFAULT_CONTENT);
    const parsed = JSON.parse(raw);
    // Shallow-merge with defaults so newly added fields never break old saves
    return maronDeepMerge(structuredClone(MARON_DEFAULT_CONTENT), parsed);
  } catch (e) {
    console.warn("MARON content load failed, using defaults", e);
    return structuredClone(MARON_DEFAULT_CONTENT);
  }
}

function maronSaveContent(content) {
  localStorage.setItem(MARON_STORAGE_KEY, JSON.stringify(content));
}

function maronResetContent() {
  localStorage.removeItem(MARON_STORAGE_KEY);
}

function maronDeepMerge(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (typeof base === "object" && base !== null) {
    const out = { ...base };
    for (const key in override || {}) {
      out[key] = maronDeepMerge(base[key], override[key]);
    }
    return out;
  }
  return override !== undefined ? override : base;
}

/* ---------------------------------------------------------------------
   Simple auth (client-side gate — see admin.html for full disclosure)
   --------------------------------------------------------------------- */

async function maronHash(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function maronGetStoredPasswordHash() {
  let hash = localStorage.getItem(MARON_AUTH_KEY);
  if (!hash) {
    hash = await maronHash(MARON_DEFAULT_PASSWORD);
    localStorage.setItem(MARON_AUTH_KEY, hash);
  }
  return hash;
}

async function maronCheckPassword(candidate) {
  const stored = await maronGetStoredPasswordHash();
  const candidateHash = await maronHash(candidate);
  return candidateHash === stored;
}

async function maronSetPassword(newPassword) {
  const hash = await maronHash(newPassword);
  localStorage.setItem(MARON_AUTH_KEY, hash);
}

/* ---------------------------------------------------------------------
   Slug helper — used to build/read detail-page URLs like
   service.html?slug=topographic-cadastral-survey without storing a
   redundant slug field on every content item.
   --------------------------------------------------------------------- */
function maronSlugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
