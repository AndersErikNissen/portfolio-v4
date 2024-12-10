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
