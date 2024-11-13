class OverFlow extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({ mode: "open" });
  }

  get isOverflowing() {
    return this.wrapper.scrollHeight > this.wrapper.clientHeight;
  }

  get lines() {
    let lineAttribute = this.getAttribute("lines");
    return lineAttribute ? parseInt(lineAttribute) : 4;
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
    const CURRENT_HTML = this.innerHTML;
    this.innerHTML = "";
    const STYLE = document.createElement("style");
    this.wrapper = document.createElement("div");
    const CONTENT = document.createElement("div");
    // const SLOT = document.createElement("slot");

    this.wrapper.classList.add("overflow-wrapper");
    CONTENT.classList.add("overflow-content");
    // SLOT.setAttribute("name", "content");

    STYLE.innerHTML = `
      over-flow {
        display: block;
        position: relative;
        font-size: 1vw;
      }

      .overflow-wrapper {
        min-height: 100%;
        max-height: calc((1.157rem * 1.55) * ${this.lines});
        overflow: auto;
        scrollbar-width: none;
        scroll-behavior: smooth;
      }

      .overflow-wrapper::-webkit-scrollbar {
        display: none;
      }

      .overflow-content {
        font-size: 1.157rem;
        line-height: 1.55;
      }

      @media (max-width: 767px) {
        .overflow-wrapper {
          max-height: calc((18px * 1.55) * ${this.lines});
        }
          
        .overflow-content {
          font-size: 18px;
        }
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
    `;

    // SLOT.addEventListener("slotchange", (e) => {
    //   console.log(
    //     "+",
    //     this.wrapper.clientHeight,
    //     this.wrapper.scrollHeight,
    //     this.clientHeight
    //   );
    //   if (this.isOverflowing) {
    //     this.renderScrollbar();
    //     this.scrollSetup();
    //   }
    // });

    // CONTENT.appendChild(SLOT);
    CONTENT.innerHTML = CURRENT_HTML;
    this.wrapper.appendChild(CONTENT);

    this.wrapper.addEventListener("load", () => {
      console.log(
        "??",
        this.wrapper.clientHeight,
        this.wrapper.scrollHeight,
        this.clientHeight
      );
    });

    this.append(STYLE, this.wrapper);

    console.log(
      "!",
      this.wrapper.clientHeight,
      this.wrapper.scrollHeight,
      this.clientHeight
    );
  }

  renderScrollbar() {
    this.scrollbar = document.createElement("div");
    this.scrollbar.classList.add("overflow-scrollbar");

    this.shadowRoot.appendChild(this.scrollbar);
  }

  async log() {
    return new Promise((resolve) => {
      console.log(this.wrapper);
      this.wrapper.addEventListener("load", () => {
        console.log(
          "?",
          this.wrapper.clientHeight,
          this.wrapper.scrollHeight,
          this.clientHeight
        );

        resolve();
      });
    });
  }

  async connectedCallback() {
    this.render();
    await this.log();

    window.addEventListener("resize", this.render.bind(this));
  }
}

customElements.define("over-flow", OverFlow);
