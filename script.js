import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* =====================================================
   ADMIN CONTENT
===================================================== */

const ADMIN_KEY = "maron_site_content_v1";

try {

  const saved =
    JSON.parse(
      localStorage.getItem(ADMIN_KEY) || "null"
    );

  if (saved) {

    const h1 =
      document.querySelector(
        '[data-index="0"] h1'
      );

    const desc =
      document.querySelector(
        '[data-index="0"] .lead'
      );

    const eyebrow =
      document.querySelector(
        '[data-index="0"] .eyebrow'
      );

    if (h1 && saved.tagline) {

      h1.innerHTML =
        saved.tagline.replace(
          /\n/g,
          "<br>"
        );

    }

    if (desc && saved.description) {

      desc.textContent =
        saved.description;

    }

    if (eyebrow && saved.heroEyebrow) {

      eyebrow.textContent =
        saved.heroEyebrow;

    }

    const cards =
      [
        ...document.querySelectorAll(
          ".cap-grid article"
        )
      ];

    (saved.services || [])
      .forEach(
        (service,index) => {

          if (!cards[index]) return;

          const title =
            cards[index]
              .querySelector("strong");

          const text =
            cards[index]
              .querySelector("span");

          if (title)
            title.textContent =
              service.title;

          if (text)
            text.textContent =
              service.desc;

        }
      );

    const projects =
      [
        ...document.querySelectorAll(
          ".project-strip div"
        )
      ];

    (saved.projects || [])
      .forEach(
        (project,index) => {

          if (!projects[index]) return;

          const title =
            projects[index]
              .querySelector("span");

          const text =
            projects[index]
              .querySelector("b");

          if (title)
            title.textContent =
              project.title;

          if (text)
            text.textContent =
              project.desc;

        }
      );

  }

} catch (error) {

  console.warn(
    "MARON Admin content unavailable."
  );

}

/* =====================================================
   THREE.JS
===================================================== */

const canvas =
  document.querySelector("#scene");

const renderer =
  new THREE.WebGLRenderer({

    canvas,

    antialias: true,

    alpha: true,

    powerPreference:
      "high-performance"

  });

renderer.setPixelRatio(
  Math.min(
    devicePixelRatio,
    1.7
  )
);

renderer.setSize(
  innerWidth,
  innerHeight
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

/* SCENE */

const scene =
  new THREE.Scene();

scene.fog =
  new THREE.FogExp2(
    0x071014,
    0.018
  );

/* CAMERA */

const camera =
  new THREE.PerspectiveCamera(

    42,

    innerWidth /
      innerHeight,

    .1,

    500

  );

camera.position.set(
  0,
  18,
  38
);

/* ROOT */

const root =
  new THREE.Group();

scene.add(root);

/* LIGHT */

scene.add(
  new THREE.HemisphereLight(
    0xbfd7d1,
    0x061014,
    2.2
  )
);

const key =
  new THREE.DirectionalLight(
    0xffffff,
    3
  );

key.position.set(
  12,
  25,
  18
);

scene.add(key);

/* MATERIAL */

const mat =
  (
    color,
    opacity = 1
  ) => {

    return new THREE.MeshStandardMaterial({

      color,

      roughness: .7,

      metalness: .18,

      transparent:
        opacity < 1,

      opacity

    });

  };

/* =====================================================
   TERRAIN
===================================================== */

const terrain =
  new THREE.Group();

root.add(terrain);

const terrainGeometry =
  new THREE.PlaneGeometry(
    62,
    42,
    90,
    70
  );

const positions =
  terrainGeometry.attributes.position;

for (
  let i = 0;
  i < positions.count;
  i++
) {

  const x =
    positions.getX(i);

  const y =
    positions.getY(i);

  positions.setZ(

    i,

    1.3 *
      Math.sin(x * .18) *
      Math.cos(y * .15)

    +

    .55 *
      Math.sin(
        (x + y) * .32
      )

    +

    .18 *
      Math.cos(y * .7)

  );

}

terrainGeometry.computeVertexNormals();

const terrainMesh =
  new THREE.Mesh(

    terrainGeometry,

    mat(
      0x50615f,
      .8
    )

  );

terrainMesh.rotation.x =
  -Math.PI / 2;

terrainMesh.position.y =
  -2;

terrain.add(
  terrainMesh
);

/* GRID */

const grid =
  new THREE.GridHelper(
    62,
    31,
    0x7d928e,
    0x263b3a
  );

grid.position.y =
  -1.9;

grid.material.transparent =
  true;

grid.material.opacity =
  .28;

terrain.add(grid);

/* ROAD */

const road =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      46,
      5
    ),

    mat(
      0x1c292b,
      .9
    )

  );

road.rotation.x =
  -Math.PI / 2;

road.position.set(
  -3,
  -1.72,
  -1
);

terrain.add(road);

/* =====================================================
   POINT CLOUD
===================================================== */

function createPointCloud(
  count = 9000
) {

  const geometry =
    new THREE.BufferGeometry();

  const array =
    new Float32Array(
      count * 3
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    const x =
      (Math.random() - .5)
      * 56;

    const z =
      (Math.random() - .5)
      * 35;

    const height =

      1.3 *
        Math.sin(x * .18) *
        Math.cos(z * .15)

      +

      .55 *
        Math.sin(
          (x + z) * .32
        )

      +

      .18 *
        Math.cos(z * .7);

    array[i * 3] =
      x;

    array[i * 3 + 1] =
      height -
      1.35 +
      (Math.random() - .5) *
      .15;

    array[i * 3 + 2] =
      z;

  }

  geometry.setAttribute(

    "position",

    new THREE.BufferAttribute(
      array,
      3
    )

  );

  const material =
    new THREE.PointsMaterial({

      color:
        0xc9e0da,

      size:
        .055,

      transparent:
        true,

      opacity:
        .78

    });

  return new THREE.Points(
    geometry,
    material
  );

}

const cloud =
  createPointCloud();

cloud.visible =
  false;

root.add(cloud);

/* =====================================================
   DRONE
===================================================== */

const drone =
  new THREE.Group();

root.add(drone);

const droneBody =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2.1,
      .55,
      1.25
    ),

    mat(0x202a2c)

  );

drone.add(
  droneBody
);

for (
  const sx of [-1,1]
) {

  for (
    const sz of [-1,1]
  ) {

    const arm =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          1.6,
          .12,
          .12
        ),

        mat(0x71817f)

      );

    arm.position.set(

      sx * .95,
      0,
      sz * .55

    );

    drone.add(
      arm
    );

    const rotor =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          .48,
          .48,
          .035,
          24
        ),

        new THREE.MeshBasicMaterial({

          color:
            0x9db4af,

          transparent:
            true,

          opacity:
            .35

        })

      );

    rotor.rotation.x =
      Math.PI / 2;

    rotor.position.set(

      sx * 1.45,
      .22,
      sz * .78

    );

    drone.add(
      rotor
    );

  }

}

drone.position.set(
  8,
  13,
  5
);

/* DRONE SCAN RAYS */

const rays =
  new THREE.Group();

root.add(
  rays
);

for (
  let i = 0;
  i < 75;
  i++
) {

  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints([

        new THREE.Vector3(

          8 +
          (Math.random() - .5) * 3,

          12.6,

          5 +
          (Math.random() - .5) * 2

        ),

        new THREE.Vector3(

          (Math.random() - .5) * 45,

          -1.6,

          (Math.random() - .5) * 27

        )

      ]);

  rays.add(

    new THREE.Line(

      geometry,

      new THREE.LineBasicMaterial({

        color:
          0x9de0cf,

        transparent:
          true,

        opacity:
          .12

      })

    )

  );

}

/* =====================================================
   LIDAR ROOM
===================================================== */

const room =
  new THREE.Group();

root.add(
  room
);

const floor =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      25,
      .18,
      16
    ),

    mat(
      0x1a2729
    )

  );

floor.position.y =
  -1.7;

room.add(
  floor
);

/* WALLS */

for (
  const [x,z] of [
    [-12,0],
    [12,0],
    [0,-8],
    [0,8]
  ]
) {

  const wall =
    new THREE.Mesh(

      new THREE.BoxGeometry(

        Math.abs(x) > 0
          ? .25
          : 25,

        8,

        Math.abs(x) > 0
          ? 16
          : .25

      ),

      mat(
        0x253537,
        .55
      )

    );

  wall.position.set(
    x,
    z,
    2.2
  );

  room.add(
    wall
  );

}

/* SCANNER */

const scanner =
  new THREE.Group();

room.add(
  scanner
);

const stand =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      .18,
      .28,
      3.2,
      16
    ),

    mat(
      0x6f7e7c
    )

  );

stand.position.y =
  .1;

scanner.add(
  stand
);

const scannerHead =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      .65,
      .65,
      .45,
      32
    ),

    mat(
      0x20292b
    )

  );

scannerHead.position.y =
  1.75;

scanner.add(
  scannerHead
);

/* LASER RING */

const ring =
  new THREE.Mesh(

    new THREE.TorusGeometry(
      1.15,
      .035,
      8,
      64
    ),

    new THREE.MeshBasicMaterial({

      color:
        0xa7e5d8,

      transparent:
        true,

      opacity:
        .85

    })

  );

ring.rotation.x =
  Math.PI / 2;

ring.position.y =
  1.75;

scanner.add(
  ring
);

/* LIDAR RAYS */

const lidarRays =
  new THREE.Group();

scanner.add(
  lidarRays
);

for (
  let i = 0;
  i < 110;
  i++
) {

  const angle =
    i / 110 *
    Math.PI *
    2;

  const end =
    new THREE.Vector3(

      Math.cos(angle) * 10,

      1.75 +
        (Math.random() - .5) * 5,

      Math.sin(angle) * 6.5

    );

  lidarRays.add(

    new THREE.Line(

      new THREE.BufferGeometry()
        .setFromPoints([

          new THREE.Vector3(
            0,
            1.75,
            0
          ),

          end

        ]),

      new THREE.LineBasicMaterial({

        color:
          0x8be3d0,

        transparent:
          true,

        opacity:
          .13

      })

    )

  );

}

room.visible =
  false;

/* =====================================================
   SURVEY SCENE
===================================================== */

const survey =
  new THREE.Group();

root.add(
  survey
);

for (
  let i = 0;
  i < 48;
  i++
) {

  const x =
    -20 +
    i * .82;

  const z =
    Math.sin(i * .28) *
    4;

  const stake =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        .018,
        .018,
        1.2,
        5
      ),

      new THREE.MeshBasicMaterial({

        color:
          0x9be1d1,

        transparent:
          true,

        opacity:
          .65

      })

    );

  stake.position.set(
    x,
    -1.1,
    z
  );

  survey.add(
    stake
  );

}

survey.visible =
  false;

/* =====================================================
   NAVIGATION
===================================================== */

let target =
  0;

let current =
  0;

let lastWheel =
  0;

const panels =
  [
    ...document.querySelectorAll(
      ".panel"
    )
  ];

const nav =
  [
    ...document.querySelectorAll(
      ".nav-item"
    )
  ];

const progress =
  document.querySelector(
    "#progressFill"
  );

function goTo(index) {

  target =
    Math.max(
      0,
      Math.min(
        5,
        index
      )
    );

  panels.forEach(

    (panel, i) => {

      panel.classList.toggle(
        "active",
        i === target
      );

    }

  );

  nav.forEach(

    item => {

      item.classList.toggle(

        "active",

        Number(
          item.dataset.target
        ) === target

      );

    }

  );

  progress.style.width =
    (
      (target + 1) /
      6 *
      100
    ) + "%";

}

document
  .querySelectorAll(
    "[data-target]"
  )
  .forEach(

    element => {

      element.addEventListener(
        "click",
        () => {

          goTo(
            Number(
              element.dataset.target
            )
          );

        }
      );

    }

  );

/* KEYBOARD */

addEventListener(
  "keydown",
  event => {

    if (
      [
        "ArrowRight",
        "PageDown",
        " "
      ].includes(event.key)
    ) {

      event.preventDefault();

      goTo(
        target + 1
      );

    }

    if (
      [
        "ArrowLeft",
        "PageUp"
      ].includes(event.key)
    ) {

      event.preventDefault();

      goTo(
        target - 1
      );

    }

  }
);

/* WHEEL */

addEventListener(

  "wheel",

  event => {

    const now =
      performance.now();

    if (
      now - lastWheel <
      650
    )
      return;

    if (
      Math.abs(
        event.deltaY
      ) > 18
    ) {

      lastWheel =
        now;

      goTo(

        target +
        (
          event.deltaY > 0
            ? 1
            : -1
        )

      );

    }

  },

  {
    passive: true
  }

);

/* SWIPE */

let startX =
  null;

addEventListener(
  "pointerdown",
  event => {

    startX =
      event.clientX;

  }
);

addEventListener(
  "pointerup",
  event => {

    if (
      startX === null
    )
      return;

    const dx =
      event.clientX -
      startX;

    startX =
      null;

    if (
      Math.abs(dx) > 55
    ) {

      goTo(

        target +
        (
          dx < 0
            ? 1
            : -1
        )

      );

    }

  }
);

/* FORM */

document
  .querySelector(
    "#quoteForm"
  )
  .addEventListener(

    "submit",

    event => {

      event.preventDefault();

      event.currentTarget
        .querySelector(
          ".form-note"
        )
        .textContent =
          "Thanks — connect this form to your email/CRM endpoint to receive submissions.";

    }

  );

/* =====================================================
   ANIMATION
===================================================== */

const clock =
  new THREE.Clock();

function animate() {

  const time =
    clock.getElapsedTime();

  current =
    THREE.MathUtils.damp(
      current,
      target,
      .9,
      .016
    );

  camera.position.x =
    THREE.MathUtils.lerp(

      camera.position.x,

      target === 3
        ? 0
        : 2.5 *
          Math.sin(
            current * .8
          ),

      .035

    );

  camera.position.y =
    THREE.MathUtils.lerp(

      camera.position.y,

      target === 3
        ? 7
        : 15,

      .035

    );

  camera.position.z =
    THREE.MathUtils.lerp(

      camera.position.z,

      target === 3
        ? 28
        : 35,

      .035

    );

  camera.lookAt(
    0,
    0,
    0
  );

  const isUAV =
    Math.round(current) === 2;

  const isLiDAR =
    Math.round(current) === 3;

  const isSurvey =
    Math.round(current) === 4;

  drone.visible =
    !isLiDAR;

  rays.visible =
    !isLiDAR;

  terrain.visible =
    !isLiDAR;

  cloud.visible =
    isUAV ||
    Math.round(current) === 1;

  room.visible =
    isLiDAR;

  survey.visible =
    isSurvey;

  drone.position.y =
    12.5 +
    Math.sin(
      time * 1.6
    ) * .45;

  drone.rotation.y =
    time * .18;

  rays.rotation.y =
    time * .05;

  ring.rotation.z =
    time * 1.4;

  lidarRays.rotation.y =
    time * .7;

  room.rotation.y =
    Math.sin(
      time * .12
    ) * .12;

  cloud.rotation.y =
    time * .015;

  renderer.render(
    scene,
    camera
  );

  requestAnimationFrame(
    animate
  );

}

animate();

/* RESIZE */

addEventListener(
  "resize",
  () => {

    renderer.setSize(
      innerWidth,
      innerHeight
    );

    camera.aspect =
      innerWidth /
      innerHeight;

    camera.updateProjectionMatrix();

  }
);