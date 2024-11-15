class StageManager extends HTMLElement {
  constructor() {
    super();
  }

  _defaultStage = 0;

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
      index = this.stage || Object.keys(this.stages)[this._defaultStage];
    }

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
    let stages = {};

    nodes.forEach((node) => {
      let index = node.dataset.stage;

      if (!stages[index]) {
        stages[index] = [];
      }

      stages[index].push(node);
    });

    this._stages = stages;
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

        this.stage = newIndex;
      }
    }
  }

  init() {
    this.stages = this.nodes;
    this.stage = this.stages;

    if (!this.hasAttribute("stage")) {
      this.setAttribute("stage", this.stage);
    }
  }

  connectedCallback() {
    if (!this.stages) {
      this.init();
    }
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
    console.log(this.nodes);
    this.bindEvents();
  }
}

customElements.define("stage-control", StageControl);
