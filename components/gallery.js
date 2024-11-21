class AGallery extends HTMLElement {
  constructor() {
    super();
  }

  get items() {
    return this._items || this.querySelectorAll("a-gallery > *");
  }
  set items(elements) {
    this._items = elements;
  }

  connectedCallback() {
    console.warn("AGallery");
  }
}

customElements.define("a-gallery", AGallery);
