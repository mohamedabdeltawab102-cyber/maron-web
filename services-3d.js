/* =====================================================================
   MARON — 3D Services Carousel (Three.js / WebGL)
   ---------------------------------------------------------------------
   Renders each service as a rotating 3D shape arranged in a ring.
   Drag/swipe to rotate, click a shape (or the caption) to open its
   full detail page at service.html?slug=<slug>.
   Falls back to a simple flat grid (services-3d-fallback) if WebGL
   is unavailable — see the .no-webgl class toggled on <body>.
   ===================================================================== */

function initServices3D(content) {
  const container = document.getElementById("services-3d-canvas");
  const caption = document.getElementById("services-3d-caption");
  const dotsWrap = document.getElementById("services-3d-dots");
  if (!container) return;

  const services = content.services;

  // ---- WebGL feature detection ----
  let webglOK = false;
  try {
    const testCanvas = document.createElement("canvas");
    webglOK = !!(window.WebGLRenderingContext &&
      (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
  } catch (e) {
    webglOK = false;
  }
  if (!webglOK || !window.THREE) {
    document.body.classList.add("no-webgl");
    renderServicesFallback(content);
    return;
  }

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1.4, 11);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(5, 8, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xe85d25, 1.2, 30);
  rim.position.set(-6, 2, 4);
  scene.add(rim);

  // ---- geometry per icon type ----
  function geometryFor(icon) {
    switch (icon) {
      case "compass": return new THREE.TorusGeometry(0.9, 0.16, 16, 48);
      case "layout": return new THREE.BoxGeometry(1.5, 1.5, 0.25, 4, 4, 1);
      case "drone": return new THREE.OctahedronGeometry(1.05, 0);
      case "map": return new THREE.TorusKnotGeometry(0.65, 0.2, 100, 16);
      case "scan": return new THREE.SphereGeometry(0.95, 24, 24);
      case "cube": return new THREE.BoxGeometry(1.3, 1.3, 1.3);
      case "layers": return new THREE.ConeGeometry(0.95, 1.5, 4);
      case "volume": return new THREE.CylinderGeometry(0.4, 0.95, 1.4, 32);
      default: return new THREE.IcosahedronGeometry(0.95, 0);
    }
  }

  const group = new THREE.Group();
  scene.add(group);

  const radius = 4.6;
  const meshes = services.map((s, i) => {
    const angle = (i / services.length) * Math.PI * 2;
    const geo = geometryFor(s.icon);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x123049,
      metalness: 0.35,
      roughness: 0.35,
      emissive: 0xe85d25,
      emissiveIntensity: 0.06
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
    mesh.userData = { index: i, baseAngle: angle };
    group.add(mesh);
    return mesh;
  });

  // subtle floating ring outline for context
  const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe85d25, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // ---- interaction state ----
  let rotationY = 0;
  let targetRotationY = 0;
  let autoRotate = true;
  let dragging = false;
  let lastX = 0;
  let dragDistance = 0;
  let activeIndex = 0;

  function angleToIndex(rot) {
    const n = services.length;
    const norm = ((-rot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return Math.round(norm / (Math.PI * 2 / n)) % n;
  }

  function updateCaption(index) {
    activeIndex = index;
    const s = services[index];
    caption.querySelector("[data-cap-title]").textContent = s.title;
    caption.querySelector("[data-cap-desc]").textContent = s.desc;
    caption.dataset.slug = maronSlugify(s.title);
    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === index));
    }
    meshes.forEach((m, i) => {
      m.material.emissiveIntensity = i === index ? 0.55 : 0.06;
      m.scale.setScalar(i === index ? 1.15 : 1);
    });
  }

  function goToIndex(index) {
    const n = services.length;
    targetRotationY = -(index / n) * Math.PI * 2;
    autoRotate = false;
  }

  if (dotsWrap) {
    dotsWrap.innerHTML = services
      .map((_, i) => `<button type="button" aria-label="Service ${i + 1}"></button>`)
      .join("");
    dotsWrap.querySelectorAll("button").forEach((btn, i) => {
      btn.addEventListener("click", () => goToIndex(i));
    });
  }

  // pointer drag to rotate
  container.addEventListener("pointerdown", e => {
    dragging = true;
    autoRotate = false;
    lastX = e.clientX;
    dragDistance = 0;
    container.setPointerCapture(e.pointerId);
  });
  container.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    dragDistance += Math.abs(dx);
    targetRotationY += dx * 0.008;
    lastX = e.clientX;
  });
  container.addEventListener("pointerup", e => {
    dragging = false;
    if (dragDistance < 6) {
      // treat as a click — raycast for a mesh
      handleClick(e);
    } else {
      // snap to nearest
      const idx = angleToIndex(targetRotationY);
      goToIndex(idx);
    }
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function handleClick(e) {
    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length) {
      const idx = hits[0].object.userData.index;
      if (idx === activeIndex) {
        window.location.href = `service.html?slug=${encodeURIComponent(maronSlugify(services[idx].title))}`;
      } else {
        goToIndex(idx);
      }
    }
  }

  caption.addEventListener("click", () => {
    window.location.href = `service.html?slug=${encodeURIComponent(caption.dataset.slug)}`;
  });

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  let lastCaptionIndex = -1;
  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) targetRotationY -= 0.0018;
    rotationY += (targetRotationY - rotationY) * 0.08;
    group.rotation.y = rotationY;
    meshes.forEach(m => {
      m.rotation.y += 0.004;
      m.rotation.x += 0.002;
    });

    const idx = angleToIndex(rotationY);
    if (idx !== lastCaptionIndex) {
      updateCaption(idx);
      lastCaptionIndex = idx;
    }
    renderer.render(scene, camera);
  }

  updateCaption(0);
  animate();

  // resume gentle auto-rotate after a period of inactivity
  let idleTimer;
  container.addEventListener("pointerup", () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => (autoRotate = true), 4000);
  });
}

/* Fallback grid used when WebGL is unavailable */
function renderServicesFallback(content) {
  const wrap = document.getElementById("services-3d-fallback");
  if (!wrap) return;
  wrap.innerHTML = content.services
    .map(s => {
      const icon = (typeof MARON_ICONS !== "undefined" && MARON_ICONS[s.icon]) || "";
      const slug = maronSlugify(s.title);
      return `
      <a class="card reveal in" href="service.html?slug=${encodeURIComponent(slug)}">
        <div class="icon-wrap">${icon}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <span class="go">Learn more →</span>
      </a>`;
    })
    .join("");
}
