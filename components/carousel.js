class ACarousel extends UserInteraction {
  direction = 1;

  get start() {
    return this._start;
  }

  set start(timestamp) {
    this._start = timestamp;
  }

  get gap() {
    const GAP = window.getComputedStyle(this).getPropertyValue("gap").replace("px", "");
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
    let slideWidth = (this.getBoundingClientRect().width - this.gap) / elementsInView;

    if (elementsInView === 1) {
      slideWidth += this.gap;
    }

    this._maxElementTransform = slideWidth + this.gap;
  }

  get perFrame() {
    return this.maxElementTransform / this.timing;
  }

  get elements() {
    return this._elements;
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
      if (indexes.includes(index)) this.transform(obj, transform, true);
    });
  }

  preAnimation() {
    this.prevIndex = this.index;
    this.index = this.index;

    let transformIndexes = this.elements.map((obj, index) => index),
      transformX;

    // limit to later (or limit to 0) = move all by +length (all but in view)
    if (this.prevIndex === this.limitIndex) {
      if (this.index > this.prevIndex || this.index === 0) {
        transformIndexes.splice(this.limitIndex, this.lastIndex);
        transformX = this.maxElementTransform * this.elementsInView;
      }
    }

    // 0 to last = move all by -length (all but in view)
    if (this.prevIndex === 0 && this.index === this.lastIndex) {
      transformIndexes.splice(0, this.elementsInView);
      transformX = this.elements.length * this.maxElementTransform * -1;
    }

    if (transformX !== undefined) {
      this.presetElements(transformIndexes, transformX);
    }

    this.elements[this.prevIndex].element.classList.remove("active");
  }

  postAnimation(shift) {
    this.start = undefined;

    this.elements.forEach((obj, index) => {
      obj.transform += shift;
      if (index === this.index) obj.element.classList.add("active");
    });

    let transformIndexes = this.elements.map((obj, index) => index),
      transformX;

    // last to 0 = reset all
    if (this.prevIndex === this.lastIndex && this.index === 0) {
      transformX = 0;
    }

    // later to limit = set all to -length (- in view)
    let fromFirstToLimit = this.prevIndex === 0 && this.index === this.limitIndex,
      fromLaterToLimit = this.prevIndex > this.index && this.index === this.limitIndex;

    if (fromFirstToLimit || fromLaterToLimit) {
      transformX = (this.elements.length - this.elementsInView) * this.maxElementTransform * -1;
    }

    if (transformX !== undefined) {
      this.presetElements(transformIndexes, transformX);
    }
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

  activateOnRender() {
    this.elements[this.index].element.classList.add("active");
  }

  async init() {
    this.timing = 1000;
    this.cooldown = this.timing + 500;
    this.listening = true;
    this.elements = this.querySelectorAll(".carousel-item");
    this.lastIndex = this.elements.length - 1;
    this.maxElementTransform = this.elementsInView;
    this.limitIndex = this.elements.length - this.elementsInView;

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
    this.carousel.listening = false;
    setTimeout(() => {
      this.carousel.listening = true;
    }, this.carousel.cooldown);
  }

  connectedCallback() {
    this.carousel = this.getAttribute("carousel") || this.closest("a-carousel") || document.querySelector("a-carousel");
    this.mode = this.getAttribute("mode");
    this.addEventListener("click", this.callback.bind(this));
  }
}

customElements.define("carousel-control", CarouselControl);
