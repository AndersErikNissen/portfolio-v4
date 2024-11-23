class ACarousel extends UserInteraction {
  _start;
  timing = 1000;
  direction = 1;

  get start() {
    return this._start;
  }

  set start(timestamp) {
    this._start = timestamp;
  }

  get gap() {
    const GAP = window
      .getComputedStyle(this)
      .getPropertyValue("gap")
      .replace("px", "");
    return parseFloat(GAP);
  }

  get slidesInView() {
    let slidesInView = 1;
    if (window.innerWidth > 767) slidesInView = 2;
    return slidesInView;
  }

  get maxSlideTransform() {
    return this._maxSlideTransform;
  }

  set maxSlideTransform(slidesInView) {
    let slideWidth =
      (this.getBoundingClientRect().width - this.gap) / slidesInView;

    this._maxSlideTransform = slideWidth + this.gap;
  }

  get perFrame() {
    return this.maxSlideTransform / this.timing;
  }

  get elements() {
    return this._elements || this.children;
  }

  set elements(elements) {
    let mappedElements = Array.from(elements).map((element) => {
      return {
        element: element,
        transform: 0,
      };
    });

    this._elements = mappedElements;
  }

  prev() {
    console.log("prev");

    this.direction = 1;
    requestAnimationFrame(this.animate.bind(this));
  }

  next() {
    console.log("next");

    this.direction = -1;
    requestAnimationFrame(this.animate.bind(this));
  }

  preAnimation() {
    console.warn("ANIMATION - START");
  }

  postAnimation(shift) {
    console.warn("ANIMATION - COMPLETE");

    this.start = undefined;

    this.elements.forEach((obj) => (obj.transform += shift));
  }

  animate(timestamp) {
    if (!this.start) {
      this.start = timestamp;
      this.preAnimation();
    }

    let delta = timestamp - this.start;
    let shift = Math.min(this.maxSlideTransform, delta * this.perFrame);

    this.elements.forEach((obj) => {
      this.transform(obj, shift);
    });

    if (shift < this.maxSlideTransform) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.postAnimation(shift);
    }
  }

  transform(obj, shift) {
    // somehow, find a way to save negativ direction???
    obj.element.style.transform = `translate3d(${
      (obj.transform + shift) * this.direction
    }px, 0, 0)`;
  }

  connectedCallback() {
    console.warn("ACarousel", this.elements);
    this.elements = this.elements;
    this.maxSlideTransform = this.slidesInView;

    this.bindEvents();
  }
}

customElements.define("a-carousel", ACarousel);
