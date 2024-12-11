"use strict";

const APP_TEMPLATES = {};

class DataBase {
  dataBase = [
    {
      title: "Forside",
      path: "/",
      name: "index",
    },
    {
      name: "projects",
      title: "Projekter",
      path: "/projects",
      items: [],
    },
    {
      title: "Grafik",
      path: "/visuals",
      name: "visuals",
      items: [],
    },
    {
      title: "404",
      name: "404",
      template: "404",
      default_template: true,
    },
  ];

  get data() {
    // sessionStorage.clear(); // PLSFIX - DEV

    const STORAGE = sessionStorage.getItem("aenders_dk_db");

    if (STORAGE) {
      return JSON.parse(STORAGE);
    }

    return this.dataBase;
  }

  trimObject(obj) {
    obj.title = obj.title.rendered;
    obj.content = obj.content.rendered;
    obj.type = obj.type.replace("portfolio_", "");

    Object.assign(obj, obj.acf);

    if (obj.type !== "visual") {
      obj.path = "/" + obj.type + "s/" + obj.slug;
    }

    delete obj.acf;
    delete obj.id;
    delete obj.class_list;
    delete obj.date;
    delete obj.date_gmt;
    delete obj.guid;
    delete obj.link;
    delete obj.modified;
    delete obj.modified_gmt;
    delete obj.status;
    delete obj._links;
    delete obj.template;

    return obj;
  }

  async fetchDataByType(type) {
    const RESPONSE = await fetch(
      "https://api.aenders.dk/wp-json/wp/v2/" + type + "?acf_format=standard"
    );
    const JSON = await RESPONSE.json();
    const ARRAY = JSON.map((obj) => {
      const TRIMMED = this.trimObject(obj);

      switch (obj.type) {
        case "page":
          return this.upgradePage(TRIMMED);
        case "project":
          return this.upgradeProject(TRIMMED);
        case "visual":
          return this.upgradeVisual(TRIMMED);
      }
    });

    let dataParent = this.dataBase.find(
      (obj) => obj.name === type.replace("portfolio_", "")
    );

    if (dataParent) {
      dataParent.items = ARRAY;
    }

    this.dataBase = this.dataBase.concat(ARRAY);
  }

  async fetchData() {
    await this.fetchDataByType("portfolio_pages");
    await this.fetchDataByType("portfolio_projects");
    await this.fetchDataByType("portfolio_visuals");

    sessionStorage.setItem("aenders_dk_db", JSON.stringify(this.data));
  }

  uniqueNumbers(obj) {
    let keys = Object.keys(obj).filter((key) => key.match(/[A-z]*-\d/));
    let nos = keys.map((key) => key.split("-")[1].slice(0, 2));
    return nos.filter((nr, index, array) => array.indexOf(nr) === index);
  }

  createStage(nr, obj) {
    const STAGE = {};

    Object.keys(obj).forEach((key) => {
      let split = key.split("-");

      if (split[1] === nr) {
        if (obj[key]) {
          // Use an array, if the key already exist
          if (STAGE[split[0]]) {
            if (!Array.isArray(STAGE[split[0]])) {
              STAGE[split[0]] = [STAGE[split[0]]];
            }

            STAGE[split[0]].push(obj[key]);
          } else {
            STAGE[split[0]] = obj[key];
          }
        }

        delete obj[key];
      }
    });

    return STAGE;
  }

  upgradePage(obj) {
    obj.stages = [];

    this.uniqueNumbers(obj).forEach((unique) =>
      obj.stages.push(this.createStage(unique, obj))
    );

    return obj;
  }

  upgradeProject(obj) {
    obj.stages = [];

    this.uniqueNumbers(obj).forEach((unique) =>
      obj.stages.push(this.createStage(unique, obj))
    );

    return obj;
  }

  upgradeVisual(obj) {
    obj.gallery = [];

    Object.keys(obj).forEach((key) => {
      if (key.includes("image-")) {
        if (obj[key]) {
          obj.gallery.push(obj[key]);
        }

        delete obj[key];
      }
    });

    return obj;
  }
}

class ALink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {}
}

customElements.define("a-link", ALink);

class TheMenu extends HTMLElement {
  constructor() {
    super();
  }

  get app() {
    return this._app;
  }

  set app(ele) {
    this._app = document.querySelector(ele);
  }

  get data() {
    return this._data;
  }

  set data(v) {
    this._data = v;
  }

  get links() {
    return this._links;
  }

  set links(pages) {
    let combined = this.data.slice(0, 3);
    combined.splice(1, 0, ...pages);

    let elements = [];

    combined.forEach((obj) => {
      let link = document.createElement("a-link");
      link.classList.add("menu-link");

      let label = document.createElement("span");
      label.classList.add("menu-link-label");
      label.textContent = obj.title;

      link.append(label, SNIPPETS.icon("arrow"));
      elements.push(link);
    });

    this._links = elements;
  }

  renderSlider() {
    let wrapper = document.createElement("stage-manager");
    wrapper.classList.add("menu-slides");

    let slides = this.data.filter(
      (item) => item.type === "visual" || item.type === "project"
    );

    slides.forEach((slide, index) => {
      let imgWrapper = document.createElement("div");
      imgWrapper.setAttribute("data-stage", index);
      imgWrapper.classList.add("menu-slide");

      imgWrapper.appendChild(SNIPPETS.img(slide.image, "100vw"));

      let link = document.createElement("a-link");
      link.setAttribute("slug", slide.slug);
      link.classList.add("menu-slide-link");

      let linkLabel = document.createElement("span");
      linkLabel.classList.add("menu-slide-link-label");
      linkLabel.textContent = slide.type === "page" ? "Se side" : "Se projekt";

      wrapper.appendChild(imgWrapper);
    });

    this.slider = wrapper;

    return this.slider;
  }

  render() {
    let main = document.createElement("div");
    main.classList.add("menu-main");

    let linkWrapper = document.createElement("div");
    linkWrapper.classList.add("menu-links");
    linkWrapper.append(...this.links);

    let footer = document.createElement("div");
    footer.classList.add("menu-footer");
    footer.appendChild(SNIPPETS.link_footer());

    main.append(linkWrapper, this.renderSlider());
    this.replaceChildren(main, footer);
  }

  init(data) {
    this.app = "the-app";
    this.data = data;
    this.links = this.data.filter((item) => item.type === "page");

    this.render();
    console.warn("TheMenu", this.links);
  }
}

customElements.define("the-menu", TheMenu);

class TheHeader extends HTMLElement {
  constructor() {
    super();
  }

  menuHandler() {}

  createLeft() {
    let wrapper = document.createElement("div");
    wrapper.classList.add("header-left");

    this.menuBtn = document.createElement("button");
    this.menuBtn.id = "Menu-btn";
    this.menuBtn.classList.add("h-bounce-text");
    let labelIdle = SNIPPETS.heading(
      "Menu",
      "span",
      ["menu-btn-label", "menu-active--false"],
      [],
      false
    );
    let labelActive = SNIPPETS.heading(
      "Luk",
      "span",
      ["menu-btn-label", "menu-active--true"],
      [],
      false
    );
    this.menuBtn.append(SNIPPETS.icon("menu"), labelIdle, labelActive);

    wrapper.appendChild(this.menuBtn);
    return wrapper;
  }

  createMiddle() {
    let wrapper = document.createElement("div");
    wrapper.classList.add("header-middle");
    wrapper.appendChild(SNIPPETS.icon("logo"));
    return wrapper;
  }

  createRight() {
    let wrapper = document.createElement("div");
    wrapper.classList.add("header-right");

    let clock = document.createElement("digital-clock");

    let btns = document.createElement("div");
    btns.classList.add("header-btns");

    let phoneBtn = document.createElement("copy-clipboard");
    phoneBtn.setAttribute("content-type", "phone");
    phoneBtn.classList.add(
      "header-btn",
      "h-bounce-text",
      "header-btn-call",
      "h-scale-icon"
    );
    phoneBtn.append(
      SNIPPETS.heading(
        "Giv et kald",
        "span",
        ["header-btn-label", "fs-small"],
        [],
        false
      ),
      SNIPPETS.icon("phone")
    );

    let emailBtn = document.createElement("copy-clipboard");
    emailBtn.classList.add("header-btn", "h-scale-icon");
    emailBtn.appendChild(SNIPPETS.icon("mail"));

    btns.append(phoneBtn, emailBtn);

    wrapper.append(clock, btns);
    return wrapper;
  }

  render() {
    let toaster = document.createElement("copy-toaster");
    let main = document.createElement("div");
    main.classList.add("header-main");
    main.append(this.createLeft(), this.createMiddle(), this.createRight());

    this.append(main, toaster);
  }

  connectedCallback() {
    this.render();
    this.menuBtn.addEventListener("click", this.menuHandler);
  }
}

customElements.define("the-header", TheHeader);

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
      const SCROLLABLE_ELEMENT =
        v.target.tagName === "OVER-FLOW" || v.target.closest("over-flow");

      if (SCROLLABLE_ELEMENT) {
        stopInteraction = JSON.parse(
          SCROLLABLE_ELEMENT.getAttribute("scrollable")
        );
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

  get menu() {
    return this._menu;
  }

  set menu(ele) {
    this._menu = ele;
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

    document.body.setAttribute("data-template", TEMPLATE_NAME);

    TEMPLATE.styles.forEach((style) => this.loadStylesheet(style));

    return TEMPLATE.markup;
  }

  async render() {
    let markup = "";

    // markup += await this.prepareTemplate("");
    // markup += await this.prepareTemplate("visuals", this.db.dataBase[2]);

    markup += await this.prepareTemplate("projects", this.db.dataBase[1]);

    // markup += await this.prepareTemplate("project", this.db.dataBase[5]);

    // markup += await this.prepareTemplate("page", this.db.dataBase[4]);

    this.innerHTML = markup;
  }

  async connectedCallback() {
    this.menu = document.querySelector("the-menu");
    await this.db.fetchData();

    this.menu.init(this.db.dataBase);

    console.log("DB", this.db);
    // await this.render();
  }
}

customElements.define("the-app", TheApp);
