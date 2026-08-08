const STORAGE_KEY =
  "maron_site_content_v1";

/* =====================================================
   DEFAULT DATA
===================================================== */

const DEFAULT_DATA = {

  brand:
    "MARON",

  tagline:
    "Capture reality. Build with confidence.",

  description:
    "Precision surveying and geospatial solutions for infrastructure, construction and engineering projects.",

  hero: {

    eyebrow:
      "ENGINEERING DATA • GEOMATICS • REALITY CAPTURE",

    headline:
      "Capture reality.\nBuild with confidence.",

    description:
      "Precision surveying and geospatial solutions for infrastructure, construction and engineering projects.",

    button:
      "Explore capabilities",

    button2:
      "Request a quote"

  },

  services: [

    {

      title:
        "Engineering Surveying",

      desc:
        "GNSS • Total Station • Setting Out • As-Built"

    },

    {

      title:
        "UAV & Photogrammetry",

      desc:
        "Mapping • Orthomosaics • Dense Point Clouds"

    },

    {

      title:
        "LiDAR & 3D Scanning",

      desc:
        "Reality Capture • Point Clouds • 3D Models"

    },

    {

      title:
        "GIS & Volumes",

      desc:
        "Spatial Data • Surfaces • Cut & Fill"

    }

  ],

  projects: [

    {

      title:
        "ROADS",

      desc:
        "Corridor surveys & surfaces"

    },

    {

      title:
        "CONSTRUCTION",

      desc:
        "Setting out & as-built"

    },

    {

      title:
        "EARTHWORKS",

      desc:
        "Volumes & cut/fill"

    }

  ],

  contact: {

    email:
      "hello@marongeomatics.com",

    phone:
      "+20 000 000 0000",

    whatsapp:
      "+20 000 000 0000",

    address:
      "Cairo, Egypt"

  },

  threeD: {

    drone:
      true,

    pointCloud:
      true,

    lidar:
      true,

    animationSpeed:
      1,

    pointDensity:
      9000

  },

  seo: {

    title:
      "MARON Geomatics — Engineering Data & Reality Capture",

    description:
      "MARON Geomatics provides surveying, UAV mapping, LiDAR, 3D scanning, GIS and engineering data solutions.",

    keywords:
      "geomatics, surveying, drone mapping, UAV, LiDAR, 3D scanning, GIS"

  }

};

/* =====================================================
   LOAD DATA
===================================================== */

function loadData() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {

      return structuredClone(
        DEFAULT_DATA
      );

    }

    const parsed =
      JSON.parse(saved);

    return {

      ...structuredClone(
        DEFAULT_DATA
      ),

      ...parsed

    };

  }

  catch {

    return structuredClone(
      DEFAULT_DATA
    );

  }

}

let data =
  loadData();

/* =====================================================
   HELPERS
===================================================== */

const $ =
  id =>
    document.getElementById(id);

function value(
  id,
  fallback = ""
) {

  return (
    $(id)?.value ??
    fallback
  );

}

function setValue(
  id,
  val
) {

  const element =
    $(id);

  if (element)
    element.value =
      val ?? "";

}

/* =====================================================
   GENERAL
===================================================== */

function renderGeneral() {

  setValue(
    "brand",
    data.brand
  );

  setValue(
    "tagline",
    data.tagline
  );

  setValue(
    "description",
    data.description
  );

}

/* =====================================================
   HERO
===================================================== */

function renderHero() {

  setValue(
    "heroEyebrow",
    data.hero.eyebrow
  );

  setValue(
    "heroHeadline",
    data.hero.headline
  );

  setValue(
    "heroDescription",
    data.hero.description
  );

  setValue(
    "heroButton",
    data.hero.button
  );

  setValue(
    "heroButton2",
    data.hero.button2
  );

}

/* =====================================================
   SERVICES
===================================================== */

function renderServices() {

  const container =
    $("servicesList");

  container.innerHTML =
    "";

  data.services.forEach(
    (service,index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "editor-item";

      item.innerHTML = `

        <div class="editor-item-header">

          <strong>
            SERVICE ${String(index + 1).padStart(2,"0")}
          </strong>

          <button
            class="remove"
            data-remove-service="${index}"
          >
            REMOVE
          </button>

        </div>

        <label>

          Title

          <input
            data-service-title="${index}"
            value="${escapeHTML(service.title)}"
          >

        </label>

        <label>

          Description

          <input
            data-service-desc="${index}"
            value="${escapeHTML(service.desc)}"
          >

        </label>

      `;

      container.appendChild(
        item
      );

    }
  );

}

/* =====================================================
   PROJECTS
===================================================== */

function renderProjects() {

  const container =
    $("projectsList");

  container.innerHTML =
    "";

  data.projects.forEach(
    (project,index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "editor-item";

      item.innerHTML = `

        <div class="editor-item-header">

          <strong>
            PROJECT ${String(index + 1).padStart(2,"0")}
          </strong>

          <button
            class="remove"
            data-remove-project="${index}"
          >
            REMOVE
          </button>

        </div>

        <label>

          Title

          <input
            data-project-title="${index}"
            value="${escapeHTML(project.title)}"
          >

        </label>

        <label>

          Description

          <input
            data-project-desc="${index}"
            value="${escapeHTML(project.desc)}"
          >

        </label>

      `;

      container.appendChild(
        item
      );

    }
  );

}

/* =====================================================
   CONTACT
===================================================== */

function renderContact() {

  setValue(
    "email",
    data.contact.email
  );

  setValue(
    "phone",
    data.contact.phone
  );

  setValue(
    "whatsapp",
    data.contact.whatsapp
  );

  setValue(
    "address",
    data.contact.address
  );

}

/* =====================================================
   3D
===================================================== */

function render3D() {

  setValue(
    "droneEnabled",
    String(data.threeD.drone)
  );

  setValue(
    "pointCloudEnabled",
    String(data.threeD.pointCloud)
  );

  setValue(
    "lidarEnabled",
    String(data.threeD.lidar)
  );

  setValue(
    "animationSpeed",
    data.threeD.animationSpeed
  );

  setValue(
    "pointDensity",
    data.threeD.pointDensity
  );

}

/* =====================================================
   SEO
===================================================== */

function renderSEO() {

  setValue(
    "seoTitle",
    data.seo.title
  );

  setValue(
    "seoDescription",
    data.seo.description
  );

  setValue(
    "seoKeywords",
    data.seo.keywords
  );

}

/* =====================================================
   COLLECT DATA
===================================================== */

function collectData() {

  data.brand =
    value(
      "brand"
    );

  data.tagline =
    value(
      "tagline"
    );

  data.description =
    value(
      "description"
    );

  data.hero = {

    eyebrow:
      value("heroEyebrow"),

    headline:
      value("heroHeadline"),

    description:
      value("heroDescription"),

    button:
      value("heroButton"),

    button2:
      value("heroButton2")

  };

  /* SERVICES */

  document
    .querySelectorAll(
      "[data-service-title]"
    )
    .forEach(
      element => {

        const index =
          Number(
            element.dataset
              .serviceTitle
          );

        data.services[index].title =
          element.value;

      }
    );

  document
    .querySelectorAll(
      "[data-service-desc]"
    )
    .forEach(
      element => {

        const index =
          Number(
            element.dataset
              .serviceDesc
          );

        data.services[index].desc =
          element.value;

      }
    );

  /* PROJECTS */

  document
    .querySelectorAll(
      "[data-project-title]"
    )
    .forEach(
      element => {

        const index =
          Number(
            element.dataset
              .projectTitle
          );

        data.projects[index].title =
          element.value;

      }
    );

  document
    .querySelectorAll(
      "[data-project-desc]"
    )
    .forEach(
      element => {

        const index =
          Number(
            element.dataset
              .projectDesc
          );

        data.projects[index].desc =
          element.value;

      }
    );

  /* CONTACT */

  data.contact = {

    email:
      value("email"),

    phone:
      value("phone"),

    whatsapp:
      value("whatsapp"),

    address:
      value("address")

  };

  /* 3D */

  data.threeD = {

    drone:
      value("droneEnabled") ===
      "true",

    pointCloud:
      value("pointCloudEnabled") ===
      "true",

    lidar:
      value("lidarEnabled") ===
      "true",

    animationSpeed:
      Number(
        value(
          "animationSpeed",
          1
        )
      ),

    pointDensity:
      Number(
        value(
          "pointDensity",
          9000
        )
      )

  };

  /* SEO */

  data.seo = {

    title:
      value("seoTitle"),

    description:
      value("seoDescription"),

    keywords:
      value("seoKeywords")

  };

}

/* =====================================================
   SAVE
===================================================== */

$("save")
  .addEventListener(
    "click",
    () => {

      collectData();

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
          data
        )

      );

      $("status")
        .textContent =
          "Changes saved ✓";

      setTimeout(
        () => {

          $("status")
            .textContent =
              "All changes are local.";

        },
        2500
      );

    }
  );

/* =====================================================
   RESET
===================================================== */

$("reset")
  .addEventListener(
    "click",
    () => {

      const confirmReset =
        confirm(
          "Reset all MARON website content to default?"
        );

      if (!confirmReset)
        return;

      data =
        structuredClone(
          DEFAULT_DATA
        );

      localStorage.removeItem(
        STORAGE_KEY
      );

      renderAll();

      $("status")
        .textContent =
          "Reset completed.";

    }
  );

/* =====================================================
   ADD SERVICE
===================================================== */

$("addService")
  .addEventListener(
    "click",
    () => {

      data.services.push({

        title:
          "New Service",

        desc:
          "Service description"

      });

      renderServices();

    }
  );

/* =====================================================
   ADD PROJECT
===================================================== */

$("addProject")
  .addEventListener(
    "click",
    () => {

      data.projects.push({

        title:
          "NEW PROJECT",

        desc:
          "Project description"

      });

      renderProjects();

    }
  );

/* =====================================================
   REMOVE ITEMS
===================================================== */

document.addEventListener(
  "click",
  event => {

    const serviceButton =
      event.target.closest(
        "[data-remove-service]"
      );

    if (serviceButton) {

      const index =
        Number(
          serviceButton.dataset
            .removeService
        );

      data.services.splice(
        index,
        1
      );

      renderServices();

      return;

    }

    const projectButton =
      event.target.closest(
        "[data-remove-project]"
      );

    if (projectButton) {

      const index =
        Number(
          projectButton.dataset
            .removeProject
        );

      data.projects.splice(
        index,
        1
      );

      renderProjects();

    }

  }
);

/* =====================================================
   SIDEBAR NAVIGATION
===================================================== */

document
  .querySelectorAll(
    ".side-item"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.section;

          document
            .querySelectorAll(
              ".side-item"
            )
            .forEach(
              item =>
                item.classList
                  .remove(
                    "active"
                  )
            );

          button.classList
            .add(
              "active"
            );

          document
            .querySelectorAll(
              ".dashboard-section"
            )
            .forEach(
              section => {

                section.classList
                  .toggle(
                    "active",

                    section.id ===
                    target

                  );

              }
            );

        }
      );

    }
);

/* =====================================================
   INITIALIZE
===================================================== */

function renderAll() {

  renderGeneral();

  renderHero();

  renderServices();

  renderProjects();

  renderContact();

  render3D();

  renderSEO();

}

renderAll();

/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
  string
) {

  return String(
    string ?? ""
  )
  .replace(
    /&/g,
    "&amp;"
  )
  .replace(
    /</g,
    "&lt;"
  )
  .replace(
    />/g,
    "&gt;"
  )
  .replace(
    /"/g,
    "&quot;"
  )
  .replace(
    /'/g,
    "&#039;"
  );

}