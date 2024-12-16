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

class ALink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {}
}

customElements.define("a-link", ALink);

class StageManager extends UserInteraction {
  _onLoad = true;
  _animationClass = "animate";

  get nodes() {
    return this.querySelectorAll("[data-stage]");
  }

  get stage() {
    return this._stage || parseInt(this.getAttribute("stage")) || 0;
  }

  get previousStage() {
    return this._previousStage || 0;
  }

  get previousStageClass() {
    return "previous-stage";
  }

  get activeStageClass() {
    return "active-stage";
  }

  set stage(i) {
    if (i === this.stage) return;

    if (!this.hasAttribute("allow-animation")) {
      this.setAttribute("allow-animation", "");
    }

    let index = i;

    if (!this.stages[index]) {
      index = 0;
    }

    if (this.stage !== index) {
      this.history = index;

      this.deactivateNodes(this.stages[this.stage]);
      this.inanimateNodes(this.animationStages[this.stage]);

      if (this.previousStage >= 0) {
        this.deactivateNodes(
          this.stages[this.previousStage],
          this.previousStageClass
        );
      }

      this.activateNodes(this.stages[this.stage], this.previousStageClass);

      this._previousStage = this.stage;
      this._stage = index;

      if (parseInt(this.getAttribute("stage")) !== index) {
        this.setAttribute("stage", index);
      }

      this.activateNodes(this.stages[this.stage]);
      this.animateNodes(this.animationStages[this.stage]);
    }
  }

  get stages() {
    return this._stages;
  }

  set stages(nodes) {
    let stages = [];

    nodes.forEach((node) => {
      let parsed = JSON.parse(node.dataset.stage);
      let indexes = Array.isArray(parsed) ? parsed : [parsed];

      indexes.forEach((i) => {
        if (!stages[i]) {
          stages[i] = [];
        }

        stages[i].push(node);
      });
    });

    this._stages = stages;
  }

  get animationStages() {
    return this._animationStages;
  }

  set animationStages(array) {
    let stages = [];

    array.forEach((nodeArray) => {
      let nodes = [];

      nodeArray.forEach((node) => {
        nodes.push(Array.from(node.querySelectorAll("[data-animate]")));
      });

      stages.push(nodes.flat());
    });

    this._animationStages = stages;
  }

  next() {
    this.stage = this.stage + 1 > this.stages.length - 1 ? 0 : this.stage + 1;
  }

  prev() {
    this.stage = 0 > this.stage - 1 ? this.stages.length - 1 : this.stage - 1;
  }

  activateNodes(nodes, cls = this.activeStageClass) {
    nodes.forEach((node) => {
      if (!node.classList.contains(cls)) {
        node.classList.add(cls);
      }
    });
  }

  deactivateNodes(nodes, cls = this.activeStageClass) {
    nodes.forEach((node) => {
      if (node.classList.contains(cls)) {
        node.classList.remove(cls);
      }
    });
  }

  animateNodes(nodes) {
    nodes.forEach((node) => {
      if (!node.classList.contains(this._animationClass)) {
        node.classList.add(this._animationClass);
      }
    });
  }

  inanimateNodes(nodes) {
    nodes.forEach((node) => {
      if (node.classList.contains(this._animationClass)) {
        node.classList.remove(this._animationClass);
      }
    });
  }

  static get observedAttributes() {
    return ["stage"];
  }

  attributeChangedCallback(attrName, oldIndex, newIndex) {
    if (attrName !== "stage") return;
    this.stage = parseInt(newIndex);
  }

  init() {
    this.timing = 1000;
    this.listening = true;
    this.stages = this.nodes;
    this.animationStages = this.stages;

    // Clean up nodes for mismatching class usage
    let inactiveNodes = this.stages
      .slice(this.stage + 1, this.stages.length)
      .flat();

    this.deactivateNodes(inactiveNodes);
    this.activateNodes(this.stages[this.stage]);

    if (!this.hasAttribute("stage")) {
      this.setAttribute("stage", this.stage);
    }

    setTimeout(() => {
      this.animateNodes(this.animationStages[this.stage]);
    }, 100);

    this.bindEvents();
  }

  connectedCallback() {
    this.init();
  }
}

customElements.define("stage-manager", StageManager);

class StageControl extends HTMLElement {
  constructor() {
    super();
  }

  get nodes() {
    return this.querySelectorAll("[data-stage]");
  }

  set nodes(nodes) {
    this._nodes = nodes;
  }

  get manager() {
    let specifiedManager;

    if (this.getAttribute("manager")) {
      specifiedManager = document.querySelector(this.getAttribute("manager"));
    }

    return (
      this._manager ||
      specifiedManager ||
      this.closest("stage-manager") ||
      document.querySelector("stage-manager")
    );
  }

  set manager(manager) {
    this._manager = manager;
  }

  clickEvent(event) {
    this.manager.stage = parseInt(event.target.dataset.stage);
  }

  bindEvents() {
    this.nodes.forEach((node) =>
      node.addEventListener("click", this.clickEvent.bind(this))
    );
  }

  init() {
    this.nodes = this.nodes;
    this.manager = this.manager;
    this.bindEvents();
  }

  connectedCallback() {
    this.init();
  }
}

customElements.define("stage-control", StageControl);

class StageDelayed extends StageManager {
  get animationDelay() {
    return this._animationDelay || 0;
  }

  set animationDelay(ms) {
    this._animationDelay = ms;
  }

  animateNodes(nodes) {
    setTimeout(() => {
      nodes.forEach((node) => {
        if (!node.classList.contains(this._animationClass)) {
          node.classList.add(this._animationClass);
        }
      });
    }, this.animationDelay);
  }

  connectedCallback() {
    this.init();
    this.cooldown = 1000;
    this.animationDelay = 400;
  }
}

customElements.define("stage-delayed", StageDelayed);

class StageMenu extends StageDelayed {
  bindEvents() {
    // Clear to stop event triggers
  }

  randomize(v) {
    let interval;
    let randomNumber;

    const getRandomNumber = () => {
      return Math.floor(Math.random() * (this.stages.length - 1));
    };

    if (v) {
      randomNumber = getRandomNumber();

      this.stage = randomNumber;

      interval = setInterval(() => {
        let newRandomNumber = getRandomNumber();

        while (newRandomNumber === randomNumber) {
          newRandomNumber = getRandomNumber();
        }

        randomNumber = newRandomNumber;

        this.stage = randomNumber;
      }, 10000);
    } else {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    }
  }

  connectedCallback() {
    this.init();
    this.cooldown = 1000;
    this.animationDelay = 400;
  }
}

customElements.define("stage-menu", StageMenu);

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
      link.classList.add("menu-link", "h-bounce-text");
      link.setAttribute("slug", obj.path);

      let iconWrapper = document.createElement("div");
      iconWrapper.classList.add("menu-link-icon-wrapper");
      iconWrapper.append(
        SNIPPETS.icon("arrow", "menu-link-icon-1"),
        SNIPPETS.icon("arrow", "menu-link-icon-2")
      );

      link.append(
        SNIPPETS.heading(
          obj.title,
          "span",
          ["menu-link-label", "anton-sc-regular"],
          [],
          false
        ),
        iconWrapper
      );
      elements.push(link);
    });

    this._links = elements;
  }

  get active() {
    return JSON.parse(document.body.getAttribute("data-menu-active"));
  }

  set active(v) {
    document.body.setAttribute("data-active-menu", JSON.stringify(v));
    this.stageManager.randomize(v);
  }

  renderImages() {
    let imageObjects = this.data.filter(
      (item) => item.type === "visual" || item.type === "project"
    );

    imageObjects = imageObjects.map((obj, index) => {
      let imgWrapper = document.createElement("div");
      imgWrapper.setAttribute("data-stage", index);
      imgWrapper.classList.add("menu-image", "blur-stage-animation");

      let link = document.createElement("a-link");
      link.setAttribute("slug", obj.path);
      link.classList.add("menu-image-link");

      let linkIcon = SNIPPETS.icon("url", "h-scale-icon");
      linkIcon.setAttribute("data-animate", "");

      link.append(
        SNIPPETS.heading(
          obj.type === "page" ? "Se side" : "Se projekt",
          "span",
          ["menu-image-link-label", "fs-medium"]
        ),
        linkIcon
      );

      imgWrapper.append(SNIPPETS.img(obj.image, "100vw"), link);

      return imgWrapper;
    });

    this.images = imageObjects;

    return this.images;
  }

  render() {
    this.stageManager = document.createElement("stage-menu");
    this.stageManager.classList.add("menu-main");

    let linkWrapper = document.createElement("div");
    linkWrapper.classList.add("menu-links");
    linkWrapper.append(...this.links);

    let footer = document.createElement("div");
    footer.classList.add("menu-footer");
    footer.appendChild(SNIPPETS.link_footer());

    this.stageManager.append(linkWrapper, ...this.renderImages());
    this.replaceChildren(this.stageManager, footer);
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

class MenuButton extends HTMLElement {}

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

  get location() {
    return location.href;
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
    /**
     * Use path instead of name
     * If no path match, use 404
     *
     * Use data.name to find template
     */

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

  async render(path) {
    console.log("render()", "path:", path);
    let markup = "";

    // markup += await this.prepareTemplate("");
    // markup += await this.prepareTemplate("visuals", this.db.dataBase[2]);

    markup += await this.prepareTemplate("projects", this.db.dataBase[1]);

    // markup += await this.prepareTemplate("project", this.db.dataBase[5]);

    // markup += await this.prepareTemplate("page", this.db.dataBase[4]);

    this.innerHTML = markup;

    /**
     * Gem content som default (CSS)
     * Find en god måde at tilføje en load class, så tingene animeres
     * * Stages skal måske håndters anderledes
     */
  }

  async init() {
    await this.db.fetchData();

    this.menu = document.querySelector("the-menu");
    this.menu.init(this.db.dataBase);

    /**
     * Find den bedste måde at teste /path i DEV-miljøet - måske det skal tages LIVE på et tidspunkt?
     */
    this.render(this.location);

    console.log("DB", this.db);
  }
}

customElements.define("the-app", TheApp);
