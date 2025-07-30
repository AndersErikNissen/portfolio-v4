"use strict";

const APP_TEMPLATES = {};

class DataBase {
  dataBase = [
    {
      title: "Forside",
      path: "/",
      name: "index",
      default_template: true,
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
  ];

  trimObject(obj) {
    obj.title = obj.title.rendered;
    obj.content = obj.content.rendered;
    obj.type = obj.type.replace("portfolio_", "");
    obj.name = obj.type;

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
    const RESPONSE = await fetch("https://api.aenders.dk/wp-json/wp/v2/" + type + "?acf_format=standard");
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

    let dataParent = this.dataBase.find((obj) => obj.name === type.replace("portfolio_", ""));

    if (dataParent) {
      dataParent.items = ARRAY;
    }

    this.dataBase = this.dataBase.concat(ARRAY);
  }

  get data() {
    return new Promise((resolve) => {
      const STORAGE = sessionStorage.getItem("aenders_dk_db");

      if (STORAGE) {
        return resolve(JSON.parse(STORAGE));
      }

      Promise.all([
        this.fetchDataByType("portfolio_pages"),
        this.fetchDataByType("portfolio_projects"),
        this.fetchDataByType("portfolio_visuals"),
      ]).then(() => {
        sessionStorage.setItem("aenders_dk_db", JSON.stringify(this.dataBase));
        return resolve(this.dataBase);
      });
    });
  }

  uniqueNumbers(obj) {
    let keys = Object.keys(obj).filter((key) => key.match(/[A-z]*-\d/));
    let nos = keys.map((key) => key.split("-")[1].slice(0, 2));
    return nos.filter((nr, index, array) => array.indexOf(nr) === index);
  }

  createAndPushStage(nr, obj, target) {
    let stage = {};

    Object.keys(obj).forEach((key) => {
      let split = key.split("-");

      if (split[1] === nr) {
        if (obj[key]) {
          // Use an array, if the key already exist
          if (stage[split[0]]) {
            if (!Array.isArray(stage[split[0]])) {
              stage[split[0]] = [stage[split[0]]];
            }

            stage[split[0]].push(obj[key]);
          } else {
            stage[split[0]] = obj[key];
          }
        }

        delete obj[key];
      }
    });

    // Push if stage has data
    for (const key in stage) {
      if (Object.hasOwn(stage, key)) {
        return target.push(stage);
      }
    }
  }

  upgradePage(obj) {
    obj.stages = [];

    this.uniqueNumbers(obj).forEach((unique) => this.createAndPushStage(unique, obj, obj.stages));

    return obj;
  }

  upgradeProject(obj) {
    obj.stages = [];

    this.uniqueNumbers(obj).forEach((unique) => this.createAndPushStage(unique, obj, obj.stages));

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
      const SCROLLABLE_ELEMENT = v.target.tagName === "OVER-FLOW" || v.target.closest("over-flow");

      if (SCROLLABLE_ELEMENT) {
        stopInteraction = JSON.parse(SCROLLABLE_ELEMENT.getAttribute("scrollable"));
      }

      const CONTROLLER = v.target.tagName === "CAROUSEL-CONTROL" || v.target.closest("carousel-control");

      if (CONTROLLER) {
        stopInteraction = true;
      }
    } else {
      stopInteraction = !!v; // change v to boolean
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

    this.triggerEvent = 'wheel';

    this.listening = false;

    if (e.deltaY > 0 || e.deltaX > 0) {
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
    const isTriggeredByControl = e.target.nodeName === 'STAGE-CONTROL' || e.target.closest('stage-control');

    if (this.listening && !this.stopInteraction && !isTriggeredByControl) {
      this.listening = false;
      this.triggerEvent = 'touch';

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

  get app() {
    return this._app;
  }

  set app(ele) {
    this._app = document.querySelector(ele);
  }

  get path() {
    return new URL(this.getAttribute("the-path") || "/", location.href).pathname;
  }

  event() {
    this.app.transitionToTemplate(this.path);
  }

  connectedCallback() {
    this.app = "the-app";
    this.menu = "the-menu";
    this.addEventListener("click", this.event.bind(this));
  }
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
    return this._previousStage;
  }

  get previousStageClass() {
    return "previous-stage";
  }

  get activeStageClass() {
    return "active-stage";
  }
  
  get directionUpClass() {
    return "direction-up";
  }
  
  get directionDownClass() {
    return "direction-down";
  }
  
  get hasInteracted() {
    return JSON.parse(this.getAttribute("has-interacted"));
  }

  set hasInteracted(v) {
    this.setAttribute("has-interacted", JSON.stringify(v));
  }

  set stage(i) {
    if (i === this.stage) return;

    if (!this.hasInteracted) {
      this.hasInteracted = true;
    }

    let index = this.stages[i] && i || 0;

    if (this.stage !== index) {
      // Make the animations look more natural based on the event type
      let directionClass = this.directionUpClass;

      const fromLastToFirstIndex = this.stages.length - 1 === this.stage && index === 0;
      const fromFirstToLastIndex = this.stage === 0 && index === this.stages.length - 1;
      const toSmallerIndex = this.stage > index;

      if (this.triggerEvent === 'wheel') {
        if (toSmallerIndex && !fromLastToFirstIndex || fromFirstToLastIndex) {
          directionClass = this.directionDownClass;
        } 
      }

      if (this.triggerEvent === 'touch') {
        if (!toSmallerIndex && !fromFirstToLastIndex || fromLastToFirstIndex) {
          directionClass = this.directionDownClass;
        }
      }

      if (this.triggerEvent === 'control') {
        if (toSmallerIndex) {
          directionClass = this.directionDownClass;
        }
      }

      // Handle nodes

      this.deactivateNodes(this.stages[this.stage]);
      this.inanimateNodes(this.animationStages[this.stage]);

      if (this.previousStage >= 0) {
        this.deactivateNodes(this.stages[this.previousStage], this.previousStageClass);
      }

      // active previous stage nodes
      this.activateNodes(this.stages[this.stage], this.previousStageClass, directionClass);

      this._previousStage = this.stage;
      this._stage = index;

      if (parseInt(this.getAttribute("stage")) !== index) {
        this.setAttribute("stage", index);
      }

      this.activateNodes(this.stages[this.stage], this.activeStageClass, directionClass);
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

  activateNodes(nodes, cls = this.activeStageClass, directionClass) {
    nodes.forEach((node) => {
      if (!node.classList.contains(cls)) {
        node.classList.add(cls);
      }

      if (directionClass) {
        node.classList.add(directionClass);
      }
    });
  }

  deactivateNodes(nodes, cls = this.activeStageClass) {
    const classesToRemove = [cls, this.directionUpClass, this.directionDownClass];

    nodes.forEach((node) => {
      classesToRemove.forEach((rmvCls) => {
        if (node.classList.contains(rmvCls)) {
          node.classList.remove(rmvCls);
        };
      });
    });
  }

  animateNodes(nodes) {
    nodes.forEach((node) => {
      if (!node.classList.contains(this._animationClass)) {
        node.classList.add(this._animationClass, this.directionClass);
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
    this.triggerEvent = 'control';
    this.stage = parseInt(newIndex);
  }

  async core() {
    this.timing = 1000;
    this.listening = true;
    this.stages = this.nodes;
    this.animationStages = this.stages;

    // Clean up nodes for mismatching class usage
    let inactiveNodes = this.stages.slice(this.stage + 1, this.stages.length).flat();

    this.deactivateNodes(inactiveNodes);
    this.activateNodes(this.stages[this.stage]);

    if (!this.hasAttribute("stage")) {
      this.setAttribute("stage", this.stage);
    }

    if (!this.hasAttribute("has-interacted")) {
      this.hasInteracted = false;
    }

    this.bindEvents();
  }

  async init() {
    // Is being extended, in other types of <stage-manager>.
    await this.core();
  }
}

customElements.define("stage-manager", StageManager);

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

  async init() {
    this.cooldown = 1000;
    this.animationDelay = 510;
    await this.core();
  }
}

customElements.define("stage-delayed", StageDelayed);

class StageMenu extends StageDelayed {
  bindEvents() {
    // Clear to stop event triggers
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(id) {
    this._timeout = id;
  }

  get randomNumber() {
    return Math.floor(Math.random() * (this.stages.length - 1));
  }

  randomStage(bool) {
    let nr = this.randomNumber;

    while (this.stage === nr) {
      nr = this.randomNumber;
    }

    return setTimeout(() => {
      this.stage = nr;
      this.timeout = this.randomStage(true);
    }, 5000);
  }

  randomize(v) {
    if (!v) {
      clearTimeout(this.timeout);
      this.inanimateNodes(this.animationStages[this.stage]);
      return;
    }

    this.animateNodes(this.animationStages[this.stage]);
    this.timeout = this.randomStage();
  }

  connectedCallback() {
    this.core();
    this.cooldown = 1000;
    this.animationDelay = 510;
  }
}

customElements.define("stage-menu", StageMenu);

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
      this._manager || specifiedManager || this.closest("stage-manager") || document.querySelector("stage-manager")
    );
  }

  set manager(manager) {
    this._manager = manager;
  }

  clickEvent(event) {
    this.manager.stage = parseInt(event.target.dataset.stage);
  }

  bindEvents() {
    this.nodes.forEach((node) => node.addEventListener("click", this.clickEvent.bind(this)));
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
      link.setAttribute("the-path", obj.path);

      let iconWrapper = document.createElement("div");
      iconWrapper.classList.add("menu-link-icon-wrapper");
      iconWrapper.append(SNIPPETS.icon("arrow", "menu-link-icon-1"), SNIPPETS.icon("arrow", "menu-link-icon-2"));

      link.append(SNIPPETS.heading(obj.title, "span", ["menu-link-label", "anton-sc-regular"]), iconWrapper);
      elements.push(link);
    });

    this._links = elements;
  }

  get active() {
    return JSON.parse(document.body.getAttribute("data-menu"));
  }

  set active(v) {
    document.body.setAttribute("data-menu", JSON.stringify(v));

    if (v) {
      setTimeout(() => {
        this.linkWrapper.classList.add("animate");
      }, 510);
    } else {
      this.linkWrapper.classList.remove("animate");
    }

    this.stageManager.randomize(v);
  }

  renderImages() {
    let imageObjects = this.data.filter((item) => item.type === "visual" || item.type === "project");

    imageObjects = imageObjects.map((obj, index) => {
      let imgWrapper = document.createElement("div");
      imgWrapper.setAttribute("data-stage", index);
      imgWrapper.classList.add("menu-image");

      imgWrapper.appendChild(SNIPPETS.img(obj.image, "100vw"));

      if (obj.type !== "visual") {
        let link = document.createElement("a-link");
        link.setAttribute("the-path", obj.path);
        link.setAttribute("data-animate", "");
        link.classList.add("menu-image-link", "h-bounce-text", "h-scale-icon");

        let linkIcon = SNIPPETS.icon("url");

        link.append(
          SNIPPETS.heading(obj.type === "page" ? "Se side" : "Se projekt", "span", [
            "menu-image-link-label",
            "fs-medium",
          ]),
          linkIcon
        );

        imgWrapper.appendChild(link);
      }

      return imgWrapper;
    });

    this.images = imageObjects;

    return this.images;
  }

  render() {
    let header = document.createElement("div");
    header.classList.add("menu-header");

    let headerContent = document.createElement("div");
    headerContent.classList.add("menu-header-content");

    let menuBtn = document.createElement("menu-btn");
    menuBtn.classList.add("menu-btn", "h-bounce-text");
    let label = SNIPPETS.heading("Luk", "span", ["menu-btn-label"], [], false);
    menuBtn.append(SNIPPETS.icon("menu"), label);

    let logo = document.createElement("a-link");
    logo.classList.add("menu-header-logo");
    logo.appendChild(SNIPPETS.icon("logo"));

    headerContent.append(menuBtn, logo);
    header.appendChild(headerContent);

    this.stageManager = document.createElement("stage-menu");
    this.stageManager.classList.add("menu-main");

    this.linkWrapper = document.createElement("div");
    this.linkWrapper.classList.add("menu-links");
    this.linkWrapper.append(...this.links);

    let footer = document.createElement("div");
    footer.classList.add("menu-footer");
    footer.appendChild(SNIPPETS.link_footer());

    this.stageManager.append(this.linkWrapper, ...this.renderImages());
    this.replaceChildren(header, this.stageManager, footer);
  }

  init(data) {
    this.app = "the-app";
    this.data = data;
    this.links = this.data.filter((item) => item.type === "page");

    this.render();
  }
}

customElements.define("the-menu", TheMenu);

class MenuButton extends HTMLElement {
  constructor() {
    super();
  }

  get menu() {
    return this._menu;
  }

  set menu(ele) {
    this._menu = ele;
  }

  event() {
    let swapStatus = this.menu.active ? false : true;
    this.menu.active = swapStatus;
  }

  connectedCallback() {
    this.menu = document.querySelector("the-menu");
    this.addEventListener("click", this.event.bind(this));
  }
}

customElements.define("menu-btn", MenuButton);

class TheHeader extends HTMLElement {
  constructor() {
    super();
  }

  createLeft() {
    let wrapper = document.createElement("div");
    wrapper.classList.add("header-left");

    this.menuBtn = document.createElement("menu-btn");
    this.menuBtn.id = "Menu-btn";
    this.menuBtn.classList.add("menu-btn", "h-bounce-text");
    let label = SNIPPETS.heading("Menu", "span", ["menu-btn-label"], [], false);
    this.menuBtn.append(SNIPPETS.icon("menu"), label);

    wrapper.appendChild(this.menuBtn);
    return wrapper;
  }

  createMiddle() {
    let wrapper = document.createElement("a-link");
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
    phoneBtn.classList.add("header-btn", "h-bounce-text", "header-btn-call", "h-scale-icon");
    phoneBtn.append(
      SNIPPETS.heading("Giv et kald", "span", ["header-btn-label", "fs-small", "header-btn-phone-label"], [], false),
      SNIPPETS.icon("phone")
    );

    let emailBtn = document.createElement("copy-clipboard");
    emailBtn.classList.add("header-btn", "h-scale-icon", "header-btn--email");
    emailBtn.appendChild(SNIPPETS.icon("mail"));

    btns.append(phoneBtn, emailBtn);

    wrapper.append(clock, btns);
    return wrapper;
  }

  render() {
    let main = document.createElement("div");
    main.classList.add("header-main");
    main.append(this.createLeft(), this.createMiddle(), this.createRight());

    this.appendChild(main);
  }

  connectedCallback() {
    this.render();
    this.menuBtn.addEventListener("click", this.menuHandler);
  }
}

customElements.define("the-header", TheHeader);

class CopyToClipboard extends HTMLElement {
  constructor() {
    super();
  }

  get type() {
    return this.getAttribute("content-type") || "email";
  }

  get content() {
    return this._content;
  }

  get toaster() {
    return document.querySelector("copy-toaster");
  }

  set content(type) {
    let content = "anderseriknissen" + "@" + "gmail" + ".com";

    if (type === "phone") {
      content = "+45" + "3178" + "7389";
    }

    this._content = content;
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.content);
      this.toaster.update(this.type);
      console.log(this.content + " er kopieret!");
    } catch (e) {
      console.error("Kunne ikke kopiere til clipboard. Prøv igen!");
    }
  }

  connectedCallback() {
    this.content = this.type;
    this.addEventListener("click", this.copy.bind(this));
  }
}

customElements.define("copy-clipboard", CopyToClipboard);

class CopyToaster extends HTMLElement {
  constructor() {
    super();
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(timing) {
    if (this._timeout) clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      this.displaying = false;
    }, timing);
  }

  get timing() {
    let timing = this.getAttribute("timing") || window.getComputedStyle(this).getPropertyValue("animation-duration");

    if (timing.includes("s")) {
      timing = timing.replace("s", "000");
    }

    return parseInt(timing);
  }

  get displaying() {
    return JSON.parse(this.getAttribute("displaying"));
  }

  set displaying(v) {
    this.setAttribute("displaying", JSON.stringify(v));
  }

  get content() {
    return this._content;
  }

  set content(type) {
    let str = type === "email" ? "E-mail" : "Telefon nummer";
    this._content = str + " er kopieret!";
    this.innerHTML = `<span>${this.content}</span>`;
  }

  update(type) {
    this.content = type;
    this.displaying = true;
    this.timeout = this.timing + 10;
  }
}

customElements.define("copy-toaster", CopyToaster);

class TheApp extends HTMLElement {
  constructor() {
    super();
  }

  get menu() {
    return this._menu;
  }

  set menu(ele) {
    this._menu = ele;
  }

  get path() {
    return this._path;
  }

  set path(path) {
    if (this._path !== path) {
      this._path = path;
    }
  }

  get show() {
    return JSON.parse(this.getAttribute("show"));
  }

  set show(v) {
    this.setAttribute("show", JSON.stringify(v));
    this.header.setAttribute("show", JSON.stringify(v));
  }

  get transition() {
    return JSON.parse(this.getAttribute("transition"));
  }

  set transition(v) {
    this.setAttribute("transition", JSON.stringify(v));
  }

  loadScript(name) {
    return new Promise((resolve) => {
      const SRC = location.origin + `/${name}.js`;

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
      const HREF = location.origin + `/styles/${name}.css`;

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

  async renderTemplate(path) {
    const DATA = this.db.find((data) => data.path === path) || this.db.find((data) => data.default_template === true);

    const NAME = DATA.name;

    if (!APP_TEMPLATES[NAME]) {
      await this.loadScript("templates/" + NAME);
    }

    const TEMPLATE = APP_TEMPLATES[NAME](DATA);

    const STYLES = TEMPLATE.styles.map((path) => this.loadStylesheet(path));
    const SCRIPTS = TEMPLATE.scripts.map((path) => this.loadScript(path));

    document.body.setAttribute("data-template", NAME);
    this.setAttribute("template", NAME);

    this.path = path;
    this.replaceChildren(TEMPLATE.html);

    // history.replaceState({}, "", DATA.path); PLS FIX
    document.title = DATA.title + " - AENDERS.DK";

    return Promise.all([...STYLES, ...SCRIPTS]).then(async () => {
      // Uses .then() to make sure the CSS/JS has been loaded beforehand.

      let customElementNames = ["STAGE-MANAGER", "STAGE-DELAYED", "A-CAROUSEL"];

      if (customElementNames.indexOf(TEMPLATE.html.nodeName) > -1) {
        let customElement = TEMPLATE.html;
        await customElement.init();

        return customElement;
      }

      return false;
    });
  }

  async transitionToTemplate(path) {
    if (path === this.path) {
      if (this.menu.active) this.menu.active = false;
      return;
    }

    this.show = false;

    const preRender = () => {
      if (!this.menu.active) this.transition = true;
      if (this.menu.active) this.menu.active = false;

      return new Promise((resolve) => {
        setTimeout(() => {
          if (!this.menu.active) this.transition = false;
          return resolve();
        }, 510);
      });
    };

    preRender()
      .then(async () => {
        return await this.renderTemplate(path);
      })
      .then((customElement) => this.displayAfterRender(customElement));
  }

  displayAfterRender(customElement) {
    window.requestAnimationFrame(() => {
      this.show = true;

      switch (customElement.nodeName) {
        case "STAGE-DELAYED":
        case "STAGE-MANAGER":
          customElement.animateNodes(customElement.animationStages[customElement.stage]);
          break;
        case "A-CAROUSEL":
          setTimeout(() => {
            customElement.activateOnRender();
          }, 510);
          break;
      }
    });
  }

  async init() {
    let dataBase = new DataBase();
    this.db = await dataBase.data;

    this.menu = document.querySelector("the-menu");
    this.menu.init(this.db);
    this.header = document.querySelector("the-header");

    let template = await this.renderTemplate(location.pathname);

    return template;
  }
}

customElements.define("the-app", TheApp);
