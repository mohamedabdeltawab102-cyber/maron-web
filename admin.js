/* =====================================================================
   MARON — Admin Panel Script
   ===================================================================== */

const SESSION_KEY = "maron_admin_session_v1";
let workingContent = null;

const SERVICE_ICON_OPTIONS = ["compass", "layout", "drone", "map", "scan", "cube", "layers", "volume"];
const SERVICE_CATEGORY_OPTIONS = [
  { value: "land", label: "Land & Engineering" },
  { value: "aerial", label: "UAV & Photogrammetry" },
  { value: "3d", label: "LiDAR & 3D Scanning" },
  { value: "gis", label: "GIS & Volumes" }
];

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initSidebar();
  initSaveBar();
  initSettings();
  initLogoUpload();
  initHeroBgControls();
  initAboutVisualUpload();
  initAddButtons();

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    enterDashboard();
  }
});

/* ---------------------------------------------------------------------
   Auth
   --------------------------------------------------------------------- */

function initLogin() {
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.getElementById("password-input").value;
    const ok = await maronCheckPassword(password);
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "1");
      errorEl.textContent = "";
      enterDashboard();
    } else {
      errorEl.textContent = "Incorrect password. Please try again.";
    }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("password-input").value = "";
  });
}

function enterDashboard() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  workingContent = maronGetContent();
  renderAllForms();
}

/* ---------------------------------------------------------------------
   Sidebar navigation
   --------------------------------------------------------------------- */

function initSidebar() {
  const buttons = document.querySelectorAll(".admin-sidebar button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(`panel-${btn.dataset.panel}`).classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ---------------------------------------------------------------------
   Path helpers
   --------------------------------------------------------------------- */

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
}

/* ---------------------------------------------------------------------
   Render all forms from workingContent
   --------------------------------------------------------------------- */

function renderAllForms() {
  document.querySelectorAll("[data-field]").forEach(input => {
    const val = getPath(workingContent, input.dataset.field);
    input.value = val === true ? "true" : val === false ? "false" : (val ?? "");
  });

  renderLogoPreview();
  renderBulletsList();
  renderStatsList();
  renderServicesList();
  renderIndustriesList();
  renderProjectsList();
  document.getElementById("tech-hardware-badges").value = workingContent.tech.hardware.badges.join("\n");
  document.getElementById("tech-software-badges").value = workingContent.tech.software.badges.join("\n");

  document.getElementById("hero-bg-image-field").style.display =
    workingContent.hero.backgroundStyle === "image" ? "block" : "none";
}

function renderLogoPreview() {
  const preview = document.getElementById("logo-preview");
  if (workingContent.brand.logoDataUrl) {
    preview.innerHTML = `<img src="${workingContent.brand.logoDataUrl}" alt="Logo preview">`;
  } else {
    preview.innerHTML = `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="44" stroke="#F58220" stroke-width="4" stroke-dasharray="6 4"/><circle cx="50" cy="50" r="30" stroke="#FFFFFF" stroke-width="2"/><circle cx="50" cy="50" r="6" fill="#F58220"/><line x1="50" y1="0" x2="50" y2="100" stroke="#F58220" stroke-width="2"/><line x1="0" y1="50" x2="100" y2="50" stroke="#F58220" stroke-width="2"/></svg>`;
  }
}

/* ---------------------------------------------------------------------
   Repeating lists: bullets, stats, services, industries
   --------------------------------------------------------------------- */

function renderBulletsList() {
  const wrap = document.getElementById("about-bullets-list");
  wrap.innerHTML = "";
  workingContent.about.bullets.forEach((bullet, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" title="Remove">✕</button>
      <div class="field-group" style="margin-bottom:0;">
        <label>Bullet ${i + 1}</label>
        <input type="text" value="${escapeAttr(bullet)}">
      </div>`;
    item.querySelector("input").addEventListener("input", e => (workingContent.about.bullets[i] = e.target.value));
    item.querySelector(".remove-btn").addEventListener("click", () => {
      workingContent.about.bullets.splice(i, 1);
      renderBulletsList();
    });
    wrap.appendChild(item);
  });
}

function renderStatsList() {
  const wrap = document.getElementById("stats-list");
  wrap.innerHTML = "";
  workingContent.stats.forEach((stat, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" title="Remove">✕</button>
      <div class="field-row">
        <div class="field-group"><label>Value</label><input type="text" data-k="value" value="${escapeAttr(stat.value)}"></div>
        <div class="field-group"><label>Label</label><input type="text" data-k="label" value="${escapeAttr(stat.label)}"></div>
      </div>`;
    item.querySelectorAll("input").forEach(inp => {
      inp.addEventListener("input", e => (workingContent.stats[i][e.target.dataset.k] = e.target.value));
    });
    item.querySelector(".remove-btn").addEventListener("click", () => {
      workingContent.stats.splice(i, 1);
      renderStatsList();
    });
    wrap.appendChild(item);
  });
}

function renderServicesList() {
  const wrap = document.getElementById("services-list");
  wrap.innerHTML = "";
  workingContent.services.forEach((service, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" title="Remove">✕</button>
      <div class="field-group"><label>Title</label><input type="text" data-k="title" value="${escapeAttr(service.title)}"></div>
      <div class="field-group"><label>Card Description (short)</label><textarea rows="2" data-k="desc">${escapeHtml(service.desc)}</textarea></div>
      <div class="field-group"><label>Full Details (shown in popup)</label><textarea rows="3" data-k="details">${escapeHtml(service.details || "")}</textarea></div>
      <div class="field-row">
        <div class="field-group">
          <label>Category</label>
          <select data-k="category">
            ${SERVICE_CATEGORY_OPTIONS.map(o => `<option value="${o.value}" ${o.value === service.category ? "selected" : ""}>${o.label}</option>`).join("")}
          </select>
        </div>
        <div class="field-group">
          <label>Icon (used when no image is set)</label>
          <select data-k="icon">
            ${SERVICE_ICON_OPTIONS.map(ic => `<option value="${ic}" ${ic === service.icon ? "selected" : ""}>${ic}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field-group" style="margin-bottom:0;">
        <label>Card Image (optional — overrides icon)</label>
        <input type="file" accept="image/*" data-img-upload>
        <div class="hint">${service.imageDataUrl ? "Image set." : "No image — icon will be shown."} <button type="button" class="btn btn-outline btn-sm" data-img-remove style="margin-top:6px;">Remove image</button></div>
      </div>`;
    item.querySelectorAll("[data-k]").forEach(inp => {
      inp.addEventListener("input", e => (workingContent.services[i][e.target.dataset.k] = e.target.value));
    });
    item.querySelector("[data-img-upload]").addEventListener("change", e => {
      readImageAsDataUrl(e.target.files[0], dataUrl => {
        workingContent.services[i].imageDataUrl = dataUrl;
        renderServicesList();
      });
    });
    item.querySelector("[data-img-remove]").addEventListener("click", () => {
      workingContent.services[i].imageDataUrl = "";
      renderServicesList();
    });
    item.querySelector(".remove-btn").addEventListener("click", () => {
      workingContent.services.splice(i, 1);
      renderServicesList();
    });
    wrap.appendChild(item);
  });
}

function renderIndustriesList() {
  const wrap = document.getElementById("industries-list");
  wrap.innerHTML = "";
  workingContent.industries.forEach((ind, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" title="Remove">✕</button>
      <div class="field-group"><label>Title</label><input type="text" data-k="title" value="${escapeAttr(ind.title)}"></div>
      <div class="field-group"><label>Description</label><textarea rows="2" data-k="desc">${escapeHtml(ind.desc)}</textarea></div>
      <div class="field-group" style="margin-bottom:0;">
        <label>Card Image (optional — overrides color block)</label>
        <input type="file" accept="image/*" data-img-upload>
        <div class="hint">${ind.imageDataUrl ? "Image set." : "No image — a solid navy color block will be shown."} <button type="button" class="btn btn-outline btn-sm" data-img-remove style="margin-top:6px;">Remove image</button></div>
      </div>`;
    item.querySelectorAll("[data-k]").forEach(inp => {
      inp.addEventListener("input", e => (workingContent.industries[i][e.target.dataset.k] = e.target.value));
    });
    item.querySelector("[data-img-upload]").addEventListener("change", e => {
      readImageAsDataUrl(e.target.files[0], dataUrl => {
        workingContent.industries[i].imageDataUrl = dataUrl;
        renderIndustriesList();
      });
    });
    item.querySelector("[data-img-remove]").addEventListener("click", () => {
      workingContent.industries[i].imageDataUrl = "";
      renderIndustriesList();
    });
    item.querySelector(".remove-btn").addEventListener("click", () => {
      workingContent.industries.splice(i, 1);
      renderIndustriesList();
    });
    wrap.appendChild(item);
  });
}

function renderProjectsList() {
  const wrap = document.getElementById("projects-list");
  if (!wrap) return;
  wrap.innerHTML = "";
  workingContent.projects.items.forEach((proj, i) => {
    const item = document.createElement("div");
    item.className = "repeat-item";
    item.innerHTML = `
      <button type="button" class="remove-btn" title="Remove">✕</button>
      <div class="field-row">
        <div class="field-group"><label>Project Title</label><input type="text" data-k="title" value="${escapeAttr(proj.title)}"></div>
        <div class="field-group"><label>Category / Sector</label><input type="text" data-k="category" value="${escapeAttr(proj.category)}"></div>
      </div>
      <div class="field-group"><label>Description</label><textarea rows="2" data-k="description">${escapeHtml(proj.description)}</textarea></div>
      <div class="field-group" style="margin-bottom:0;">
        <label>Project Photo</label>
        <input type="file" accept="image/*" data-img-upload>
        <div class="hint">${proj.imageDataUrl ? "Image set." : "No image yet — a placeholder icon will show until you upload one."} <button type="button" class="btn btn-outline btn-sm" data-img-remove style="margin-top:6px;">Remove image</button></div>
      </div>`;
    item.querySelectorAll("[data-k]").forEach(inp => {
      inp.addEventListener("input", e => (workingContent.projects.items[i][e.target.dataset.k] = e.target.value));
    });
    item.querySelector("[data-img-upload]").addEventListener("change", e => {
      readImageAsDataUrl(e.target.files[0], dataUrl => {
        workingContent.projects.items[i].imageDataUrl = dataUrl;
        renderProjectsList();
      });
    });
    item.querySelector("[data-img-remove]").addEventListener("click", () => {
      workingContent.projects.items[i].imageDataUrl = "";
      renderProjectsList();
    });
    item.querySelector(".remove-btn").addEventListener("click", () => {
      workingContent.projects.items.splice(i, 1);
      renderProjectsList();
    });
    wrap.appendChild(item);
  });
}

function initAddButtons() {
  document.getElementById("add-bullet").addEventListener("click", () => {
    workingContent.about.bullets.push("New capability");
    renderBulletsList();
  });
  document.getElementById("add-stat").addEventListener("click", () => {
    workingContent.stats.push({ value: "0", label: "New Stat" });
    renderStatsList();
  });
  document.getElementById("add-service").addEventListener("click", () => {
    workingContent.services.push({ category: "land", icon: "compass", title: "New Service", desc: "Describe this service." });
    renderServicesList();
  });
  document.getElementById("add-industry").addEventListener("click", () => {
    workingContent.industries.push({ title: "New Industry", desc: "Describe this sector.", imageDataUrl: "" });
    renderIndustriesList();
  });
  document.getElementById("add-project").addEventListener("click", () => {
    workingContent.projects.items.push({ title: "New Project", category: "General", description: "Describe this project.", imageDataUrl: "" });
    renderProjectsList();
  });
}

/* Shared helper: read a File into a base64 data URL, with a friendly size warning */
function readImageAsDataUrl(file, callback) {
  if (!file) return;
  if (file.size > 1.5 * 1024 * 1024) {
    showToast("Image is large (>1.5MB) — consider compressing it for faster page loads.", true);
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

/* ---------------------------------------------------------------------
   Logo upload
   --------------------------------------------------------------------- */

function initLogoUpload() {
  const input = document.getElementById("logo-upload");
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      showToast("Logo file is large (>1MB). Consider compressing it for faster page loads.", true);
    }
    const reader = new FileReader();
    reader.onload = () => {
      workingContent.brand.logoDataUrl = reader.result;
      renderLogoPreview();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("logo-remove").addEventListener("click", () => {
    workingContent.brand.logoDataUrl = "";
    document.getElementById("logo-upload").value = "";
    renderLogoPreview();
  });
}

/* ---------------------------------------------------------------------
   Hero background controls (animated scene vs. uploaded image)
   --------------------------------------------------------------------- */

function initHeroBgControls() {
  const styleSelect = document.getElementById("hero-bg-style");
  const imageField = document.getElementById("hero-bg-image-field");
  const upload = document.getElementById("hero-bg-upload");

  styleSelect.addEventListener("change", () => {
    imageField.style.display = styleSelect.value === "image" ? "block" : "none";
  });

  upload.addEventListener("change", () => {
    readImageAsDataUrl(upload.files[0], dataUrl => {
      workingContent.hero.backgroundImageDataUrl = dataUrl;
      showToast("Background image attached. Remember to select \"Custom uploaded image\" above and Save.");
    });
  });

  document.getElementById("hero-bg-remove").addEventListener("click", () => {
    workingContent.hero.backgroundImageDataUrl = "";
    upload.value = "";
    showToast("Background image removed.");
  });
}

/* ---------------------------------------------------------------------
   About section visual image upload
   --------------------------------------------------------------------- */

function initAboutVisualUpload() {
  const upload = document.getElementById("about-visual-upload");
  upload.addEventListener("change", () => {
    readImageAsDataUrl(upload.files[0], dataUrl => {
      workingContent.about.visualImageDataUrl = dataUrl;
      showToast("About visual image attached. Save to apply.");
    });
  });
  document.getElementById("about-visual-remove").addEventListener("click", () => {
    workingContent.about.visualImageDataUrl = "";
    upload.value = "";
    showToast("Image removed.");
  });
}

/* ---------------------------------------------------------------------
   Save bar
   --------------------------------------------------------------------- */

function initSaveBar() {
  document.getElementById("save-btn").addEventListener("click", () => {
    collectScalarFields();
    workingContent.tech.hardware.badges = document.getElementById("tech-hardware-badges").value
      .split("\n").map(s => s.trim()).filter(Boolean);
    workingContent.tech.software.badges = document.getElementById("tech-software-badges").value
      .split("\n").map(s => s.trim()).filter(Boolean);

    maronSaveContent(workingContent);
    flashSaveStatus();
    showToast("Changes saved. Refresh the site to see them live.");
  });
}

function collectScalarFields() {
  document.querySelectorAll("[data-field]").forEach(input => {
    let value = input.value;
    if (value === "true") value = true;
    else if (value === "false") value = false;
    setPath(workingContent, input.dataset.field, value);
  });
}

function flashSaveStatus() {
  const el = document.getElementById("save-status");
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}

/* ---------------------------------------------------------------------
   Settings: export / import / reset / password
   --------------------------------------------------------------------- */

function initSettings() {
  document.getElementById("export-btn").addEventListener("click", () => {
    collectScalarFields();
    const blob = new Blob([JSON.stringify(workingContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maron-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        workingContent = maronDeepMerge(structuredClone(MARON_DEFAULT_CONTENT), parsed);
        maronSaveContent(workingContent);
        renderAllForms();
        showToast("Content imported and saved.");
      } catch (e) {
        showToast("Could not read that file — make sure it's a valid MARON content JSON export.", true);
      }
    };
    reader.readAsText(file);
    importFile.value = "";
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("This will erase all edits made in this browser and restore the original default content. Continue?")) return;
    maronResetContent();
    workingContent = maronGetContent();
    renderAllForms();
    showToast("Content reset to defaults.");
  });

  document.getElementById("change-password-btn").addEventListener("click", async () => {
    const pw1 = document.getElementById("new-password").value;
    const pw2 = document.getElementById("confirm-password").value;
    if (pw1.length < 6) {
      showToast("Password must be at least 6 characters.", true);
      return;
    }
    if (pw1 !== pw2) {
      showToast("Passwords do not match.", true);
      return;
    }
    await maronSetPassword(pw1);
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
    showToast("Admin password updated.");
  });
}

/* ---------------------------------------------------------------------
   Utilities
   --------------------------------------------------------------------- */

function showToast(message, isError) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.toggle("error", !!isError);
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3800);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
function escapeAttr(str) {
  return (str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
