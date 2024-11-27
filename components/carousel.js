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
    if (document.documentElement.clientWidth > 767) elementsInView = 2;
    return elementsInView;
  }

  get maxElementTransform() {
    return this._maxElementTransform;
  }

  set maxElementTransform(elementsInView) {
    let slideWidth =
      (this.getBoundingClientRect().width - this.gap) / elementsInView;

    if (elementsInView === 1) {
      slideWidth += this.gap;
    }

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
    this.limitIndex = this.elements.length - this.elementsInView;
  }

  prev() {
    this.direction = 1;
    requestAnimationFrame(this.animate.bind(this));
  }

  next() {
    this.direction = -1;
    requestAnimationFrame(this.animate.bind(this));
  }

  presetElements(indexes, transform) {
    this.elements.forEach((obj, index) => {
      if (!indexes.includes(index)) this.transform(obj, transform, true);
    });
  }

  preAnimation() {
    this.prevIndex = this.index;
    this.index = this.index;

    let skipIndexes = this.elements.map((obj, index) => index);

    let transformIndexes = skipIndexes;
    let testTransformX = 0;

    // limit > later = move all by +length(?) (but in view)
    if (this.prevIndex === this.limitIndex && this.index > this.prevIndex) {
      // get indexes to transform instead???? Like now
      transformIndexes.splice(this.limitIndex, this.lastIndex);

      testTransformX = this.maxElementTransform * this.elementsInView;

      console.log("limit > later", transformIndexes, testTransformX);
    }

    /**
     * Pre:
     * limit > later = move all by +length(?) (but in view)
     * 0 > last = move all by -length (but in view)
     *
     *
     * Post:
     * last > 0 = reset all
     * later > limit = set all to -length
     *
     */

    // 0 > last = move all by -length (but in view)
    if (this.prevIndex === 0 && this.index === this.lastIndex) {
    }

    let goingNext = true,
      transformX;

    if (this.prevIndex > this.index) goingNext = false;

    if (this.prevIndex === 0) {
      if (this.index === this.lastIndex) goingNext = false;

      skipIndexes.splice(this.elementsInView, this.lastIndex);

      if (goingNext) {
        // 0 > 1: [2,3] = 0
        console.log("0 > 1: [2,3] = 0");
        transformX = 0;
      } else {
        // 0 > last: [2,3] = length(4) * -1
        console.log("0 > last: [2,3] = length(4) * -1");
        transformX = this.maxElementTransform * this.elements.length * -1;
      }
    }

    if (this.prevIndex === this.limitIndex && this.index === 0) {
      // Mobile: going from last to 0
      if (this.limitIndex === this.lastIndex && this.index === 0) {
        goingNext = true;
      }

      skipIndexes.splice(0, this.elementsInView);
      // limit(2) > last: [0,1] = x2
      console.log("limit(2) > last: [0,1] = x2", this.index, this.prevIndex);
      transformX = this.maxElementTransform * this.elementsInView;

      // limit(2) > 1: [0, 1] = x2 * -1
      if (!goingNext) {
        transformX *= -1;
        console.log("limit(2) > 1: [0, 1] = x2 * -1");
      }
    }

    if (transformX !== undefined) {
      this.presetElements(skipIndexes, transformX);
    }

    this.elements[this.prevIndex].element.classList.remove("active");
  }

  postAnimation(shift) {
    this.start = undefined;
    this.elements.forEach((obj, index) => {
      obj.transform += shift;
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

class CarouselControl extends HTMLElement {
  constructor() {
    super();
  }

  get carousel() {
    return this._carousel;
  }

  set carousel(element) {
    this._carousel = element;
  }

  get mode() {
    return this._mode;
  }

  set mode(v) {
    this._mode = v;
  }

  callback() {
    this.carousel[this.mode]();
  }

  connectedCallback() {
    this.carousel =
      this.getAttribute("carousel") ||
      this.closest("a-carousel") ||
      document.querySelector("a-carousel");
    this.mode = this.getAttribute("mode");
    this.addEventListener("click", this.callback.bind(this));
  }
}

customElements.define("carousel-control", CarouselControl);
