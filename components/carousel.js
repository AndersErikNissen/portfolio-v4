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

  get elementsInView() {
    let elementsInView = 1;
    if (window.innerWidth > 767) elementsInView = 2;
    return elementsInView;
  }

  get maxElementTransform() {
    return this._maxElementTransform;
  }

  set maxElementTransform(elementsInView) {
    let slideWidth =
      (this.getBoundingClientRect().width - this.gap) / elementsInView;

    this._maxElementTransform = slideWidth + this.gap;
  }

  get perFrame() {
    return this.maxElementTransform / this.timing;
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

  get index() {
    return this._index || 0;
  }

  set index(i) {
    let index = i + this.direction * -1;

    if (index > this.lastIndex) index = 0;
    if (index < 0) index = this.lastIndex;

    this._index = index;
  }

  core() {
    this.elements = this.elements;
    this.lastIndex = this.elements.length - 1;
    this.maxElementTransform = this.elementsInView;
    this.indexBeforeLast = this.elements.length - this.elementsInView;
  }

  prev() {
    this.direction = 1;
    requestAnimationFrame(this.animate.bind(this));
  }

  next() {
    this.direction = -1;
    requestAnimationFrame(this.animate.bind(this));
  }

  presetElements(indexs, transform) {
    this.elements.forEach((obj, index) => {
      if (!indexs.includes(index)) this.transform(obj, transform, true);
    });
  }

  preAnimation() {
    this.prevIndex = this.index;
    this.index = this.index;

    let goingNext = true,
      skipIndexes = this.elements.map((obj, index) => index),
      transformX;

    if (this.prevIndex > this.index) goingNext = false;

    if (this.prevIndex === 0) {
      if (this.index === this.lastIndex) goingNext = false;

      skipIndexes.splice(this.elementsInView, this.lastIndex);

      if (goingNext) {
        // 0 > 1: [2,3] = 0
        transformX = 0;
      } else {
        console.log("!goingNext", skipIndexes);
        // 0 > last: [2,3] = x4 * -1 ?????? Seems to be right
        transformX = this.maxElementTransform * this.elements.length * -1;
      }
    }

    if (this.prevIndex === this.indexBeforeLast) {
      skipIndexes.splice(0, this.elementsInView);
      // limit(2) > last: [0,1] = x2
      transformX = this.maxElementTransform * this.elementsInView;

      // limit(2) > 1: [0, 1] = x2 * -1
      if (!goingNext) transformX *= -1;
    }

    if (transformX !== undefined) {
      this.presetElements(skipIndexes, transformX);
    }
  }

  postAnimation(shift) {
    this.start = undefined;
    this.elements.forEach((obj, index) => {
      obj.transform += shift;
      if (index === this.prevIndex) obj.element.classList.remove("active");
      if (index === this.index) obj.element.classList.add("active");
    });
  }

  animate(timestamp) {
    if (!this.start) {
      this.start = timestamp;
      this.preAnimation();
    }

    let delta = timestamp - this.start;
    let shift = Math.min(this.maxElementTransform, delta * this.perFrame);
    let adjustedShift = shift * this.direction;

    this.elements.forEach((obj) => {
      this.transform(obj, adjustedShift);
    });

    if (shift < this.maxElementTransform) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.postAnimation(adjustedShift);
    }
  }

  transform(obj, shift, overwrite = false) {
    let transformX = overwrite ? shift : obj.transform + shift;
    obj.element.style.transform = "translate3d(" + transformX + "px, 0, 0)";
    if (overwrite) {
      obj.transform = transformX;
    }
  }

  connectedCallback() {
    this.core();
    console.warn("ACarousel");

    this.bindEvents();
  }
}

customElements.define("a-carousel", ACarousel);
