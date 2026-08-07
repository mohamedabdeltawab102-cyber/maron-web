/* =====================================================================
   MARON v2 — Homepage Script
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const content = maronGetContent();
  renderHero(content);
  renderAbout(content);
  renderStats(content);
  renderIndustries(content);
  renderProjects(content);
  renderEquipment(content);
  renderClients(content);
  renderTestimonials(content);
  renderCTA(content);
  renderFooter(content);

  initHeaderScroll();
  initMobilePanel();
  initReveal();
  initBackToTop();
  initQuoteForm(content);
  initServices3D(content);
});

function setText(sel, text) {
  document.querySelectorAll(sel).forEach(el => (el.textContent = text));
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderHero(c) {
  setText("[data-brand-name]", c.brand.companyName);
  setText("[data-hero-badge]", c.hero.badgeText);
  setText("[data-hero-title]", `${c.hero.titleMain} ${c.hero.titleAccent}`);
  setText("[data-hero-desc]", c.hero.description);
  setText("[data-hero-cta-primary]", c.hero.ctaPrimary);
  setText("[data-hero-cta-secondary]", c.hero.ctaSecondary);
  setText("[data-hud-lat]", c.hero.hudLat);
  setText("[data-hud-accuracy]", c.hero.hudAccuracy);
  document.title = `${c.brand.companyName} | Advanced Surveying & Digital Engineering Solutions`;
}

function renderAbout(c) {
  setText("[data-about-title]", c.about.title);
  const p1 = document.querySelector("[data-about-p1]");
  if (p1) p1.textContent = c.about.paragraph1;
  const list = document.querySelector("[data-about-list]");
  if (list) {
    list.innerHTML = c.about.bullets
      .map(b => `<li><svg viewBox="0 0 24 24"><use href="#ic-check"/></svg> ${escapeHtml(b)}</li>`)
      .join("");
  }
}

function renderStats(c) {
  const wrap = document.querySelector("[data-stats-grid]");
  if (!wrap) return;
  wrap.innerHTML = c.stats
    .map(s => `<div class="stat reveal"><div class="n">${escapeHtml(s.value)}</div><div class="l">${escapeHtml(s.label)}</div></div>`)
    .join("");
}

function renderIndustries(c) {
  const wrap = document.querySelector("[data-industries-grid]");
  if (!wrap) return;
  const items = c.industries.slice(0, 3);
  wrap.innerHTML = items
    .map(ind => {
      const bg = ind.imageDataUrl || "";
      return `
    <a class="ind-tile reveal" href="list.html?type=industries">
      ${bg ? `<img src="${bg}" alt="${escapeHtml(ind.title)}">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--navy-800),var(--navy-950));"></div>`}
      <span class="lbl">${escapeHtml(ind.title)}</span>
    </a>`;
    })
    .join("");
}

function renderProjects(c) {
  const wrap = document.querySelector("[data-projects-grid]");
  if (!wrap || !c.projects) return;
  const items = c.projects.items.slice(0, 3);
  wrap.innerHTML = items
    .map(p => `
    <a class="proj-card reveal" href="list.html?type=projects">
      <div class="proj-media">
        <span class="proj-tag">${escapeHtml(p.category)}</span>
        ${p.imageDataUrl ? `<img src="${p.imageDataUrl}" alt="${escapeHtml(p.title)}">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--navy-800),var(--navy-950));"></div>`}
      </div>
      <div class="proj-body"><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p></div>
    </a>`)
    .join("");
}

function renderEquipment(c) {
  const wrap = document.querySelector("[data-equipment-grid]");
  if (!wrap || !c.equipment) return;
  wrap.innerHTML = c.equipment
    .slice(0, 4)
    .map(e => `
    <div class="card equip-card reveal">
      <div class="icon-wrap">${MARON_ICONS[e.icon] || ""}</div>
      <h3>${escapeHtml(e.title)}</h3>
      <p>${escapeHtml(e.desc)}</p>
    </div>`)
    .join("");
}

function renderClients(c) {
  const wrap = document.querySelector("[data-clients-row]");
  if (!wrap || !c.clients) return;
  wrap.innerHTML = c.clients.map(name => `<span class="client-logo">${escapeHtml(name)}</span>`).join("");
}

function renderTestimonials(c) {
  const wrap = document.querySelector("[data-testimonials-grid]");
  if (!wrap || !c.testimonials) return;
  wrap.innerHTML = c.testimonials
    .slice(0, 2)
    .map(t => `
    <div class="test-card reveal">
      <div class="stars">★★★★★</div>
      <p class="quote">${escapeHtml(t.quote)}</p>
      <div class="test-person"><div style="width:44px;height:44px;border-radius:50%;background:var(--navy-800);"></div>
        <div><div class="name">${escapeHtml(t.name)}</div><div class="role">${escapeHtml(t.role)}</div></div>
      </div>
    </div>`)
    .join("");
}

function renderCTA(c) {
  setText("[data-cta-title]", c.cta.title);
}

function renderFooter(c) {
  setText("[data-footer-about]", c.footer.about);
  setText("[data-footer-copyright]", c.footer.copyright);
  setText("[data-footer-phone]", c.brand.phone);
  setText("[data-footer-email]", c.brand.email);
  setText("[data-footer-address]", c.brand.address);
}

/* ---------------------------------------------------------------------
   UI behaviors
   --------------------------------------------------------------------- */

function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40));
}

function initMobilePanel() {
  const burger = document.getElementById("burgerBtn");
  const panel = document.getElementById("mobilePanel");
  const close = document.getElementById("mpClose");
  if (!burger || !panel) return;
  burger.addEventListener("click", () => panel.classList.add("open"));
  close.addEventListener("click", () => panel.classList.remove("open"));
  panel.querySelectorAll("a").forEach(a => a.addEventListener("click", () => panel.classList.remove("open")));
}

function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.15 }
  );
  els.forEach(el => io.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById("totop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 600));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initQuoteForm(content) {
  const form = document.getElementById("quote-form");
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const successEl = document.getElementById("form-success");
    const errorEl = document.getElementById("form-error");
    const ej = content.emailjs;
    const params = {
      fullname: form.fullname.value,
      company: form.company.value || "—",
      email: form.email.value,
      phone: form.phone.value || "—",
      service: form.service ? form.service.value : "—",
      message: form.message.value,
      to_email: ej.recipientEmail || content.brand.email
    };

    if (ej.enabled && ej.serviceId && ej.templateId && ej.publicKey && window.emailjs) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      try {
        await window.emailjs.send(ej.serviceId, ej.templateId, params, ej.publicKey);
        successEl.classList.add("show");
        form.reset();
      } catch (err) {
        console.error("EmailJS send failed", err);
        if (errorEl) errorEl.classList.add("show");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Request";
      }
    } else {
      successEl.classList.add("show");
      form.reset();
    }
    setTimeout(() => {
      successEl.classList.remove("show");
      if (errorEl) errorEl.classList.remove("show");
    }, 7000);
  });
}
