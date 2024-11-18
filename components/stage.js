class StageManager extends HTMLElement {
  constructor() {
    super();
  }

  _listening = true;
  _timing = 1000;
  _defaultStage = 0;
  _stage = 0;

  get nodes() {
    return this.querySelectorAll("[data-stage]");
  }

  get stage() {
    return this._stage;
  }

  set stage(v) {
    let index = v;

    if (NodeList.prototype.isPrototypeOf(v) /* If v = NodeList */) {
      let activeNode = Array.from(v).find((node) =>
        node.classList.contains("active-stage")
      );

      index = activeNode.dataset.stage;
    }

    if (!this.stages[index]) {
      index = this.stage || this.stages[this._defaultStage];
    }

    index = isNaN(parseInt(index)) ? 0 : parseInt(index);

    if (this.stage !== index) {
      this.updateNodes(index);
      this.setAttribute("stage", index);
      this._stage = index;
    }
  }

  get stages() {
    return this._stages;
  }

  set stages(nodes) {
    let stages = [];

    nodes.forEach((node) => {
      let index = node.dataset.stage;

      if (!stages[index]) {
        stages[index] = [];
      }

      stages[index].push(node);
    });

    this._stages = stages;
  }

  next() {
    this.stage = this.stage + 1 > this.stages.length - 1 ? 0 : this.stage + 1;
  }

  prev() {
    this.stage = 0 > this.stage - 1 ? this.stages.length - 1 : this.stage - 1;
  }

  updateNodes(newIndex) {
    if (this.stage) {
      this.stages[this.stage].forEach((node) =>
        node.classList.remove("active-stage")
      );
    } else {
      // Reset, so no .active-stage's are present
      this.nodes.forEach((node) => {
        if (node.classList.contains("active-stage")) {
          node.classList.remove("active-stage");
        }
      });
    }

    this.stages[newIndex].forEach((node) => {
      node.classList.add("active-stage");
    });
  }

  static get observedAttributes() {
    return ["stage"];
  }

  attributeChangedCallback(attrName, oldIndex, newIndex) {
    if (attrName === "stage") {
      if (oldIndex !== newIndex) {
        if (!this.stages) {
          this.stages = this.nodes;
        }

        this.stage = parseInt(newIndex);
      }
    }
  }

  get block() {
    return this._block;
  }

  set block(v) {
    let block = false;

    // Is value an event?
    if (v.target) {
      if (v.target.tagName === "OVER-FLOW" || v.target.closest("over-flow")) {
        block = true;
      }
    } else {
      block = !!v;
    }

    this._block = block;
  }

  handleWheel(e) {
    this.block = e;
    if (!this._listening || this.block) return;

    this._listening = false;

    if (e.deltaY > 0) {
      this.next();
    } else {
      this.prev();
    }

    setTimeout(() => {
      this._listening = true;
    }, this._timing);
  }

  handleTouchStart(e) {
    if (!this._listening) return;
    this.block = e;
    if (this.block) return;

    this._startY = e.changedTouches[0].clientY;
  }

  handleTouchMove(e) {
    if (!this._listening) return;
    e.preventDefault();
  }

  handleTouchEnd(e) {
    if (this._listening && !this.block) {
      this._listening = false;

      let touchY = e.changedTouches[0].clientY;
      if (this._startY < touchY) this.next();
      if (this._startY > touchY) this.prev();

      setTimeout(() => {
        this._listening = true;
      }, this._timing);
    }

    this.block = false;
  }

  init() {
    this.stages = this.nodes;
    this.stage = this.stages;

    if (!this.hasAttribute("stage")) {
      this.setAttribute("stage", this.stage);
    }
  }

  bindEvents() {
    this.addEventListener("wheel", this.handleWheel.bind(this));
    this.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  connectedCallback() {
    if (!this.stages) {
      this.init();
    }

    this.bindEvents();
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
    this.manager.stage = event.target.dataset.stage;
  }

  bindEvents() {
    this.nodes.forEach((node) =>
      node.addEventListener("click", this.clickEvent.bind(this))
    );
  }

  connectedCallback() {
    this.nodes = this.nodes;
    this.manager = this.manager;
    this.bindEvents();
  }
}

customElements.define("stage-control", StageControl);
