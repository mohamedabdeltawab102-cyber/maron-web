// Admin Panel Interactivity with Password Protection
document.addEventListener('DOMContentLoaded', () => {
    // 🔒 كلمة السر الافتراضية
    const ADMIN_PASSWORD = "admin123"; 

    // التحقق من حالة تسجيل الدخول
    if (sessionStorage.getItem('admin_logged_in') !== 'true') {
        const userPass = prompt("برجاء أدخل كلمة السر للوصول إلى لوحة التحكم:");
        if (userPass === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_logged_in', 'true');
        } else {
            alert("كلمة السر غير صحيحة!");
            document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px; color:red;'>عفواً، لا تملك صلاحية الوصول هذه الصفحة.</h2>";
            return;
        }
    }

    let data = getSiteData();

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Populate Fields
    document.getElementById('input-brand-name').value = data.brandName || '';
    document.getElementById('input-hero-tagline').value = data.hero.tagline || '';
    document.getElementById('input-hero-title').value = data.hero.title || '';
    document.getElementById('input-hero-description').value = data.hero.description || '';
    document.getElementById('input-hero-btn').value = data.hero.buttonText || '';

    document.getElementById('input-emailjs-key').value = data.contact.emailjsKey || '';
    document.getElementById('input-emailjs-service').value = data.contact.emailjsService || '';
    document.getElementById('input-emailjs-template').value = data.contact.emailjsTemplate || '';
    document.getElementById('input-contact-email').value = data.contact.email || '';
    document.getElementById('input-contact-phone').value = data.contact.phone || '';
    document.getElementById('input-contact-address').value = data.contact.address || '';

    // Dynamic Lists Renderers
    function renderStatsEditor() {
        const list = document.getElementById('stats-editor-list');
        list.innerHTML = data.stats.map((s, idx) => `
            <div class="card-box">
                <div class="field-group">
                    <label>Stat Value / Number</label>
                    <input type="text" class="stat-val" data-idx="${idx}" value="${s.value}">
                </div>
                <div class="field-group">
                    <label>Stat Label</label>
                    <input type="text" class="stat-lbl" data-idx="${idx}" value="${s.label}">
                </div>
                <button class="btn-remove" onclick="removeStat(${idx})"><i class="fa-solid fa-trash"></i> Delete Stat</button>
            </div>
        `).join('');
    }

    function renderSectorsEditor() {
        const list = document.getElementById('sectors-editor-list');
        list.innerHTML = data.sectors.map((sec, idx) => `
            <div class="card-box">
                <div class="field-group">
                    <label>Sector Title</label>
                    <input type="text" class="sec-title" data-idx="${idx}" value="${sec.title}">
                </div>
                <div class="field-group">
                    <label>Description</label>
                    <textarea class="sec-desc" data-idx="${idx}" rows="2">${sec.description}</textarea>
                </div>
                <div class="field-group">
                    <label>Card Image URL (Optional)</label>
                    <input type="text" class="sec-img" data-idx="${idx}" value="${sec.image || ''}" placeholder="https://...">
                </div>
                <button class="btn-remove" onclick="removeSector(${idx})"><i class="fa-solid fa-trash"></i> Delete Sector</button>
            </div>
        `).join('');
    }

    function renderProjectsEditor() {
        const list = document.getElementById('projects-editor-list');
        list.innerHTML = data.projects.map((p, idx) => `
            <div class="card-box">
                <div class="field-group">
                    <label>Project Title</label>
                    <input type="text" class="prj-title" data-idx="${idx}" value="${p.title}">
                </div>
                <div class="field-group">
                    <label>Sector Category</label>
                    <input type="text" class="prj-cat" data-idx="${idx}" value="${p.category}">
                </div>
                <div class="field-group">
                    <label>Description</label>
                    <textarea class="prj-desc" data-idx="${idx}" rows="2">${p.description}</textarea>
                </div>
                <div class="field-group">
                    <label>Project Image URL</label>
                    <input type="text" class="prj-img" data-idx="${idx}" value="${p.image || ''}">
                </div>
                <button class="btn-remove" onclick="removeProject(${idx})"><i class="fa-solid fa-trash"></i> Delete Project</button>
            </div>
        `).join('');
    }

    renderStatsEditor();
    renderSectorsEditor();
    renderProjectsEditor();

    // Add Item Buttons
    document.getElementById('btn-add-stat').addEventListener('click', () => {
        data.stats.push({ value: "100+", label: "New Metric" });
        renderStatsEditor();
    });

    document.getElementById('btn-add-sector').addEventListener('click', () => {
        data.sectors.push({ title: "New Sector", description: "Sector description here...", image: "" });
        renderSectorsEditor();
    });

    document.getElementById('btn-add-project').addEventListener('click', () => {
        data.projects.push({ title: "New Project", category: "Roads & Highways", description: "Details...", image: "" });
        renderProjectsEditor();
    });

    window.removeStat = (idx) => { data.stats.splice(idx, 1); renderStatsEditor(); };
    window.removeSector = (idx) => { data.sectors.splice(idx, 1); renderSectorsEditor(); };
    window.removeProject = (idx) => { data.projects.splice(idx, 1); renderProjectsEditor(); };

    // Save All Changes
    document.getElementById('btn-save-all').addEventListener('click', () => {
        data.brandName = document.getElementById('input-brand-name').value;
        data.hero.tagline = document.getElementById('input-hero-tagline').value;
        data.hero.title = document.getElementById('input-hero-title').value;
        data.hero.description = document.getElementById('input-hero-description').value;
        data.hero.buttonText = document.getElementById('input-hero-btn').value;

        // Collect stats
        document.querySelectorAll('.stat-val').forEach((el, i) => { data.stats[i].value = el.value; });
        document.querySelectorAll('.stat-lbl').forEach((el, i) => { data.stats[i].label = el.value; });

        // Collect sectors
        document.querySelectorAll('.sec-title').forEach((el, i) => { data.sectors[i].title = el.value; });
        document.querySelectorAll('.sec-desc').forEach((el, i) => { data.sectors[i].description = el.value; });
        document.querySelectorAll('.sec-img').forEach((el, i) => { data.sectors[i].image = el.value; });

        // Collect projects
        document.querySelectorAll('.prj-title').forEach((el, i) => { data.projects[i].title = el.value; });
        document.querySelectorAll('.prj-cat').forEach((el, i) => { data.projects[i].category = el.value; });
        document.querySelectorAll('.prj-desc').forEach((el, i) => { data.projects[i].description = el.value; });
        document.querySelectorAll('.prj-img').forEach((el, i) => { data.projects[i].image = el.value; });

        // EmailJS & Contact
        data.contact.emailjsKey = document.getElementById('input-emailjs-key').value;
        data.contact.emailjsService = document.getElementById('input-emailjs-service').value;
        data.contact.emailjsTemplate = document.getElementById('input-emailjs-template').value;
        data.contact.email = document.getElementById('input-contact-email').value;
        data.contact.phone = document.getElementById('input-contact-phone').value;
        data.contact.address = document.getElementById('input-contact-address').value;

        saveSiteData(data);
        alert("All changes saved successfully!");
    });
});