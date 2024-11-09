"use strict";

const APP_TEMPLATES = {};

class TheApp extends HTMLElement {
  constructor() {
    super();

    /* Data base */
    this.db = [
      {
        name: "Forside",
        path: "/",
        template: "index",
      },
      {
        name: "Projekter",
        path: "/projects",
        template: "projects",
      },
      {
        name: "Visuelle projekter",
        path: "/visuals",
        template: "visuals",
      },
      {
        name: "404",
        template: "404",
        default_template: true,
      },
    ];
  }

  set location(url) {
    if (location.href !== url.href) {
      location.replace(url.href);
    }
  }

  loadScript(name, path = "templates") {
    return new Promise((resolve) => {
      const SRC = `./${path}/${name}.js`;

      if (document.querySelector('script[src="' + SRC + '"]')) {
        resolve();
      }

      const SCRIPT = document.createElement("script");
      SCRIPT.src = SRC;
      SCRIPT.addEventListener("load", () => {
        resolve();
      });

      document.body.appendChild(SCRIPT);
    });
  }

  loadStylesheet(name) {
    return new Promise((resolve) => {
      const HREF = `./styles/${name}.css`;

      if (document.querySelector('link[href="' + HREF + '"]')) {
        resolve();
      }

      const LINK = document.createElement("link");
      LINK.rel = "stylesheet";
      LINK.href = HREF;

      LINK.addEventListener("load", () => {
        resolve();
      });

      document.head.appendChild(LINK);
    });
  }

  async prepareTemplate(name, data) {
    const DATA =
      data ||
      this.db.find((data) => data.path === location.pathname) ||
      this.db.find((data) => data.default_template === true);

    let TEMPLATE_NAME = name || DATA.name;

    if (!APP_TEMPLATES[TEMPLATE_NAME]) {
      await this.loadScript(TEMPLATE_NAME);
    }

    await this.loadStylesheet(TEMPLATE_NAME);

    const TEMPLATE = APP_TEMPLATES[TEMPLATE_NAME](DATA);

    TEMPLATE.scripts.forEach((script) => {
      let path = script.path || null;
      this.loadScript(script.name, path);
    });

    TEMPLATE.styles.forEach((style) => this.loadStylesheet(style));

    return TEMPLATE.markup;
  }

  trimFetchObject(obj) {
    const TRIMMED_OBJECT = obj;

    /* Plugin: Advanced Custom Fields - Data */
    const ACF = obj.acf;

    TRIMMED_OBJECT.title = TRIMMED_OBJECT.title.rendered;
    TRIMMED_OBJECT.content = TRIMMED_OBJECT.content.rendered;
    Object.assign(TRIMMED_OBJECT, ACF);

    delete TRIMMED_OBJECT.acf;
    delete TRIMMED_OBJECT.id;
    delete TRIMMED_OBJECT.class_list;
    delete TRIMMED_OBJECT.date;
    delete TRIMMED_OBJECT.date_gmt;
    delete TRIMMED_OBJECT.guid;
    delete TRIMMED_OBJECT.link;
    delete TRIMMED_OBJECT.modified;
    delete TRIMMED_OBJECT.modified_gmt;
    delete TRIMMED_OBJECT.status;
    delete TRIMMED_OBJECT._links;
    delete TRIMMED_OBJECT.template;

    if (obj.type === "project") {
      TRIMMED_OBJECT.template = obj.type;
      TRIMMED_OBJECT.path = "/projects/" + obj.slug;
      TRIMMED_OBJECT.name = obj.title;
    }

    return TRIMMED_OBJECT;
  }

  async fetchDataByType(type) {
    const RESPONSE = await fetch(
      "https://api.aenders.dk/wp-json/wp/v2/" + type + "?acf_format=standard"
    );
    const JSON = await RESPONSE.json();
    const ARRAY = JSON.map((obj) => this.trimFetchObject(obj));
    this.db = this.db.concat(ARRAY);
  }

  async fetchDatabase() {
    sessionStorage.clear();
    const SESSION_DB = sessionStorage.getItem("aenders_dk_db") || false;
    if (SESSION_DB) {
      this.db = JSON.parse(SESSION_DB);
    }

    if (!SESSION_DB) {
      await this.fetchDataByType("portfolio_pages");
      await this.fetchDataByType("portfolio_projects");
      await this.fetchDataByType("portfolio_visuals");

      sessionStorage.setItem("aenders_dk_db", JSON.stringify(this.db));
    }
  }

  async prepareHeader() {
    await this.loadStylesheet("component-clock");
    await this.loadScript("clock", "components");

    return await this.prepareTemplate("header", {}); // empty object, since the template is static
  }

  async render() {
    let markup = "";

    // markup += await this.prepareHeader();
    markup += await this.prepareTemplate("index", {});

    this.innerHTML = markup;
  }

  async connectedCallback() {
    await this.fetchDatabase();

    await this.render();
  }
}

customElements.define("the-app", TheApp);
