"use strict";

const APP_TEMPLATES = {};

class UserInteraction extends HTMLElement {
  constructor() {
    super();
  }

  get cooldown() {
    return this._cooldown || this.timing || 0;
  }

  set cooldown(ms) {
    this._cooldown = ms;
  }

  get timing() {
    return this._timing;
  }

  set timing(ms) {
    this._timing = ms;
  }

  get listening() {
    return JSON.parse(this.getAttribute("listening"));
  }

  set listening(v) {
    this.setAttribute("listening", JSON.stringify(v));
  }

  get stopInteraction() {
    return this._stopInteraction;
  }

  set stopInteraction(v) {
    let stopInteraction = false;

    // Is value an event?
    if (v.target) {
      if (v.target.tagName === "OVER-FLOW" || v.target.closest("over-flow")) {
        stopInteraction = true;
      }
    } else {
      stopInteraction = !!v;
    }

    this._stopInteraction = stopInteraction;
  }

  prev() {
    // Overwrite me
  }

  next() {
    // Overwrite me
  }

  handleWheel(e) {
    this.stopInteraction = e;
    if (!this.listening || this.stopInteraction) return;

    this.listening = false;

    if (e.deltaY > 0) {
      this.next();
    } else {
      this.prev();
    }

    setTimeout(() => {
      this.listening = true;
    }, this.cooldown);
  }

  handleTouchStart(e) {
    if (!this.listening) return;
    this.stopInteraction = e;
    if (this.stopInteraction) return;

    this.startY = e.changedTouches[0].clientY;
  }

  handleTouchMove(e) {
    if (!this.listening) return;
    e.preventDefault();
  }

  handleTouchEnd(e) {
    if (this.listening && !this.stopInteraction) {
      this.listening = false;

      let touchY = e.changedTouches[0].clientY;
      if (this.startY < touchY) this.next();
      if (this.startY > touchY) this.prev();

      setTimeout(() => {
        this.listening = true;
      }, this.cooldown);
    }

    this.stopInteraction = false;
  }

  bindEvents() {
    this.addEventListener("wheel", this.handleWheel.bind(this));
    this.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }
}

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

  loadScript(path) {
    return new Promise((resolve) => {
      const SRC = `./${path}.js`;

      if (document.querySelector('script[src="' + SRC + '"]')) {
        return resolve();
      }

      const SCRIPT = document.createElement("script");
      SCRIPT.src = SRC;

      document.body.appendChild(SCRIPT);
      SCRIPT.onload = () => resolve();
    });
  }

  loadStylesheet(name) {
    return new Promise((resolve) => {
      const HREF = `./styles/${name}.css`;
      if (document.querySelector('link[href="' + HREF + '"]')) {
        return resolve();
      }

      const LINK = document.createElement("link");
      LINK.rel = "stylesheet";
      LINK.href = HREF;

      document.head.appendChild(LINK);
      LINK.onload = () => resolve();
    });
  }

  async prepareTemplate(name, data) {
    const DATA =
      data ||
      this.db.dataBase.find((data) => data.path === location.pathname) ||
      this.db.dataBase.find((data) => data.default_template === true);

    let TEMPLATE_NAME = name || DATA.name;

    await this.loadStylesheet(TEMPLATE_NAME);

    if (!APP_TEMPLATES[TEMPLATE_NAME]) {
      await this.loadScript("templates/" + TEMPLATE_NAME);
    }

    const TEMPLATE = APP_TEMPLATES[TEMPLATE_NAME](DATA);

    TEMPLATE.scripts.forEach((path) => {
      this.loadScript(path);
    });

    this.setAttribute("template", TEMPLATE_NAME);

    TEMPLATE.styles.forEach((style) => this.loadStylesheet(style));

    return TEMPLATE.markup;
  }

  async render() {
    let markup = "";

    markup += await this.prepareTemplate("header", {}); // empty object, since the template is static;
    // markup += await this.prepareTemplate("");
    // markup += await this.prepareTemplate("visuals", this.db.dataBase[2]);
    markup += await this.prepareTemplate("project", this.db.dataBase[7]);

    this.innerHTML = markup;
  }

  async connectedCallback() {
    await this.db.fetchData();
    console.log("DB", this.db);
    await this.render();
  }
}

customElements.define("the-app", TheApp);
