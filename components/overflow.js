class OverFlow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get isOverflowing() {
    return this.wrapper.scrollHeight > this.wrapper.clientHeight;
  }

  set progress(pct) {
    this.style.setProperty(
      "--scroll-progress",
      Math.min(this.pctBase + pct, 100) + "%"
    );
    this.scrollProgress = pct;
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
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }

        .overflow-wrapper {
          max-height: calc((var(--scale-20) * 1.55) * 4);
          overflow: auto;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }

        .overflow-wrapper::-webkit-scrollbar {
          display: none;
        }

        .overflow-scrollbar {
          display: block;
          position: absolute;
          height: var(--scale-64);
          max-height: 90%;
          width: var(--scale-4);
          right: 0;
          top: 50%;
          transform: translate(calc(100% + var(--scale-8)), -50%);
          background-color: var(--color-grey-subtle);
          border-radius: 99px;
          overflow: hidden;
        }

        .overflow-scrollbar::before {
          content: "";
          display: block;
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          transform: translateY(var(--scroll-progress));
          background-color: var(--color-grey-intense);
          border-radius: 99px;
        }

      </style>
      <div class="overflow-wrapper">
        <div class="overflow-content">
          <slot name="content"></slot>
        </div>
      </div>
    `;

    this.wrapper = this.shadowRoot.querySelector(".overflow-wrapper");
  }

  renderScrollbar() {
    this.scrollbar = document.createElement("div");
    this.scrollbar.classList.add("overflow-scrollbar");

    this.shadowRoot.appendChild(this.scrollbar);
  }

  init() {
    this.render();

    if (this.isOverflowing) {
      this.renderScrollbar();
      this.scrollSetup();
    }
  }

  connectedCallback() {
    this.init();
    window.addEventListener("resize", this.init.bind(this));
  }
}

customElements.define("over-flow", OverFlow);
