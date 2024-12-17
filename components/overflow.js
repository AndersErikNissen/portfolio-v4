class OverFlow extends HTMLElement {
  constructor() {
    super();
  }

  get isOverflowing() {
    return this.wrapper.scrollHeight > this.wrapper.clientHeight;
  }

  get lines() {
    let lineAttribute = this.getAttribute("lines");
    return lineAttribute ? parseInt(lineAttribute) : 4;
  }

  set progress(pct) {
    this.style.setProperty("--scroll-progress", Math.min(this.pctBase + pct, 100) + "%");
    this.scrollProgress = pct;
  }

  get scrollable() {
    return JSON.parse(this.getAttribute("scrollable"));
  }

  set scrollable(v) {
    this.setAttribute("scrollable", JSON.stringify(v));
  }

  scrollSetup() {
    const HEIGHT = this.wrapper.scrollHeight;
    this.pctBase = (this.wrapper.clientHeight / HEIGHT) * 100;
    this.progress = 0;

    this.wrapper.addEventListener("scroll", (e) => {
      this.progress = (e.target.scrollTop / HEIGHT) * 100;
    });
  }

  render() {
    const INITIAL_CONTENT = this.innerHTML;
    this.innerHTML = "";

    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("overflow-wrapper");

    this.content = document.createElement("div");
    this.content.classList.add("overflow-content");
    this.content.innerHTML = INITIAL_CONTENT;

    this.wrapper.appendChild(this.content);

    this.replaceChildren(this.wrapper);

    /**
     * Not ideal with a timeout, but didn't want to bother with MutationObserver to check for then the wrapper is added.
     * (And maybe that wouldn't work)
     */
    setTimeout(() => {
      if (this.isOverflowing) {
        this.renderScrollbar();
        this.scrollSetup();
        this.scrollable = true;
      } else {
        this.scrollable = false;
      }
    }, 500);
  }

  renderScrollbar() {
    this.scrollbar = document.createElement("div");
    this.scrollbar.classList.add("overflow-scrollbar");

    this.appendChild(this.scrollbar);
  }

  async connectedCallback() {
    this.render();

    window.addEventListener("resize", this.render.bind(this));
  }
}

customElements.define("over-flow", OverFlow);
