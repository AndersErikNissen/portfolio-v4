class AnimateText extends HTMLElement {
  constructor() {
    super();
  }

  _timing = 100;

  get letters() {
    return this.getAttribute("string").split("");
  }

  get nodes() {
    if (this._nodes) return this._nodes;

    return this.querySelectorAll(".ani-txt-overflow");
  }

  set nodes(nodes) {
    this._nodes = Array.from(nodes);
  }

  createLetter(v) {
    let overflow = document.createElement("span");
    let letter = document.createElement("span");

    overflow.classList.add("ani-txt-overflow");
    letter.classList.add("ani-txt-letter");
    letter.textContent = v === " " ? String.fromCharCode(160) : v;

    overflow.appendChild(letter);
    return overflow;
  }

  async animateLetter(node, idx) {
    return new Promise((resolve) => {
      if (node.classList.contains("animate")) resolve();

      if (idx === 0) {
        node.classList.add("animate");
        resolve();
      }

      setTimeout(() => {
        node.classList.add("animate");
        resolve();
      }, this._timing);
    });
  }

  get animated() {
    return this.hasAttribute("animated") || false;
  }

  async handleLetters() {
    if (!this.animated) {
      for (let i = 0; this.nodes.length > i; i++) {
        await this.animateLetter.call(this, this.nodes[i], i);
      }
      this.setAttribute("animated", "");
    } else {
      this.nodes.forEach((node) => node.classList.remove("animate"));
      this.removeAttribute("animated");
    }
  }

  render() {
    let letters = this.letters.map((letter) => this.createLetter(letter));
    this.replaceChildren(...letters);
  }

  async connectedCallback() {
    this.render();
    this.nodes = this.nodes;
  }
}

customElements.define("ani-txt", AnimateText);
