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

class StageProjects extends StageManager {
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

customElements.define("stage-delayed", StageProjects);
