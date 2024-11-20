class StageManager extends HTMLElement {
  constructor() {
    super();
  }

  _listening = true;
  _timing = 1000;
  _onLoad = true;
  _activeStageClass = "active-stage";
  _animationClass = "animate";

  get nodes() {
    return this.querySelectorAll("[data-stage]");
  }

  get stage() {
    return this._stage || parseInt(this.getAttribute("stage")) || 0;
  }

  set stage(i) {
    if (i === this.stage) return;

    let index = i;

    if (!this.stages[index]) {
      index = 0;
    }

    if (this.stage !== index) {
      this.deactivateNodes(this.stages[this.stage]);
      this.inanimateNodes(this.animationStages[this.stage]);

      if (parseInt(this.getAttribute("stage")) !== index) {
        this.setAttribute("stage", index);
      }

      this._stage = index;

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
      let index = parseInt(node.dataset.stage);

      if (!stages[index]) {
        stages[index] = [];
      }

      stages[index].push(node);
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

  activateNodes(nodes) {
    nodes.forEach((node) => {
      if (!node.classList.contains(this._activeStageClass)) {
        node.classList.add(this._activeStageClass);
      }
    });
  }

  deactivateNodes(nodes) {
    nodes.forEach((node) => {
      if (node.classList.contains(this._activeStageClass)) {
        node.classList.remove(this._activeStageClass);
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

  get stop() {
    return this._stop;
  }

  set stop(v) {
    let stop = false;

    // Is value an event?
    if (v.target) {
      if (v.target.tagName === "OVER-FLOW" || v.target.closest("over-flow")) {
        stop = true;
      }
    } else {
      stop = !!v;
    }

    this._stop = stop;
  }

  handleWheel(e) {
    this.stop = e;
    if (!this._listening || this.stop) return;

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
    this.stop = e;
    if (this.stop) return;

    this._startY = e.changedTouches[0].clientY;
  }

  handleTouchMove(e) {
    if (!this._listening) return;
    e.preventDefault();
  }

  handleTouchEnd(e) {
    if (this._listening && !this.stop) {
      this._listening = false;

      let touchY = e.changedTouches[0].clientY;
      if (this._startY < touchY) this.next();
      if (this._startY > touchY) this.prev();

      setTimeout(() => {
        this._listening = true;
      }, this._timing);
    }

    this.stop = false;
  }

  bindEvents() {
    this.addEventListener("wheel", this.handleWheel.bind(this));
    this.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  static get observedAttributes() {
    return ["stage"];
  }

  attributeChangedCallback(attrName, oldIndex, newIndex) {
    if (attrName !== "stage") return;
    this.stage = parseInt(newIndex);
  }

  connectedCallback() {
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
