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
      console.log(this.toaster);
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

  get timing() {
    let timing =
      this.getAttribute("timing") ||
      window.getComputedStyle(this).getPropertyValue("animation-duration");

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
    console.log(this.timing);
    setTimeout(() => (this.displaying = false), this.timing + 10);
  }
}

customElements.define("copy-toaster", CopyToaster);
