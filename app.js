"use strict";

const APP_TEMPLATES = {};

class TheApp extends HTMLElement {
  constructor() {
    super();

    /* Data base */
    this.db = new DataBase(); // Found in "./db.js"
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

    await this.loadStylesheet(TEMPLATE_NAME);

    if (!APP_TEMPLATES[TEMPLATE_NAME]) {
      await this.loadScript(TEMPLATE_NAME);
    }

    const TEMPLATE = APP_TEMPLATES[TEMPLATE_NAME](DATA);

    TEMPLATE.scripts.forEach((script) => {
      let path = script.path || null;
      this.loadScript(script.name, path);
    });

    TEMPLATE.styles.forEach((style) => this.loadStylesheet(style));

    return TEMPLATE.markup;
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
    await this.db.fetchData();

    console.log(this.db.data);

    // await this.render();
  }
}

customElements.define("the-app", TheApp);
