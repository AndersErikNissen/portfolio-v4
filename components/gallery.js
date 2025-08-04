class TheGallery extends HTMLElement {
  constructor() {
    super();
  }

  get loading() {
    return JSON.parse(this.getAttribute("loading"));
  }

  set loading(v) {
    this.setAttribute("loading", JSON.stringify(v));
  }

  get open() {
    return JSON.parse(this.getAttribute("open"));
  }

  set open(v) {
    this.setAttribute("open", JSON.stringify(v));
  }

  get gallery() {
    return this._gallery;
  }

  set gallery(nodes) {
    this._gallery = nodes;
  }

  get wrapper() {
    return this._wrapper;
  }

  set customFontColor(color) {
    if (color) {
      this.style.setProperty('--gallery-custom-color', color);
    } else {
      this.style.removeProperty('--gallery-custom-color');
    }
  }

  set wrapper(node) {
    let closer = document.createElement("gallery-closer");
    let label = SNIPPETS.heading("Luk", "span", ["gallery-closer-label", "fs-medium"], [], false);
    closer.classList.add("gallery-closer", "h-bounce-text", "h-scale-icon");
    closer.append(label, SNIPPETS.icon("circle-close"));

    node.classList.add("gallery-wrapper");
    node.appendChild(closer);
    this.appendChild(node);
    this._wrapper = node;
  }

  get controls() {
    return this._controls;
  }

  set controls(items) {
    this._controls = items;
  }

  get controller() {
    return this._controller;
  }

  set controller(items) {
    let controller = document.createElement("div");
    controller.classList.add("controller", "gallery-controller");
    let controls = [];

    items.forEach((item, index) => {
      let control = document.createElement("div");
      control.classList.add("control-item");
      if (index === 0) control.classList.add("active-item");
      control.addEventListener("click", this.scrollToItem.bind(this, index));

      controls.push(control);
    });

    controller.append(...controls);
    this.wrapper.appendChild(controller);
    this.controls = controls;
    this._controller = controller;
  }

  get observer() {
    return this._observer;
  }

  set observer(callback) {
    const OPTIONS = {
      root: this.wrapper,
      rootMargin: "0px",
      threshold: [0.09, 0.99], // 0/1.0 was too precise
    };

    this._observer = new IntersectionObserver(callback.bind(this), OPTIONS);
  }

  get index() {
    return this._index || 0;
  }

  set index(i) {
    let prevIndex = this.index;

    if (prevIndex !== i) {
      this.controls[prevIndex].classList.remove("active-item");
      this.controls[i].classList.add("active-item");
      this._index = i;
    }
  }

  scrollToItem(i) {
    this.wrapper.scrollTo({
      top: this.wrapper.clientHeight * i,
      behavior: "smooth",
    });
  }

  observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (entries.length > 2) return;

      let itemIndex = this.gallery.indexOf(entry.target);

      if (entry.intersectionRatio > 0.9) {
        let title = entry.target.querySelector(".gallery-image-title");

        this.index = itemIndex;
        if (title && title.hasAttribute("data-animate") && !title.classList.contains("active")) {
          title.classList.add("active");
        }
      }

      if (entry.intersectionRatio < 0.1) {
        if (itemIndex === this.index) {
          this.index = itemIndex - 1;
        }
      }
    });
  }

  async renderImage(obj) {
    return new Promise((resolve) => {
      let img = SNIPPETS.img(obj, "(max-width: 767px) calc(100vw - 24px), calc(100vw - 2.314rem)");

      let wrapper = document.createElement("div");
      wrapper.classList.add("gallery-item");

      let imgWrapper = document.createElement("div");
      imgWrapper.classList.add("gallery-image-wrapper");

      if (obj.alt.length > 0) {
        let title = SNIPPETS.heading(obj.alt, "p", ["h2", "gallery-image-title", "fs-large"]);
        wrapper.appendChild(title);
      }

      imgWrapper.appendChild(img);
      wrapper.appendChild(imgWrapper);

      this.wrapper.appendChild(wrapper);
      img.onload = () => resolve(wrapper);
    });
  }

  async render(imgArr) {
    this.loading = true;
    this.open = true;
    this.innerHTML = "";

    this.wrapper = document.createElement("div");

    const RENDERING_IMAGES = imgArr.map((obj) => this.renderImage(obj));

    this.gallery = await Promise.all(RENDERING_IMAGES);

    if (this.gallery.length > 1) {
      this.controller = this.gallery;

      this.observer = this.observerCallback;

      this.gallery.forEach((item) => this.observer.observe(item));
    }

    this.loading = false;
  }

  bindClosers() {
    this.addEventListener("click", (e) => {
      if (e.target === this) {
        this.open = false;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Escape" && this.open) {
        this.open = false;
      }
    });
  }

  connectedCallback() {
    this.bindClosers();
  }
}

customElements.define("the-gallery", TheGallery);

class GalleryControl extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.gallery = document.querySelector("the-gallery");
  }
}

customElements.define("gallery-control", GalleryControl);

class GalleryOpener extends HTMLElement {
  constructor() {
    super();
  }

  get images() {
    return this._images;
  }

  set images(script) {
    this._images = JSON.parse(script.innerHTML);
  }

  get galleryFontColor() {
    return this.getAttribute("gallery-custom-color") || false;
  }

  pushToGallery() {
    this.gallery.render(this.images);
    this.gallery.customFontColor = this.galleryFontColor;
  }

  connectedCallback() {
    this.gallery = document.querySelector("the-gallery");
    this.images = this.querySelector("script");
    this.addEventListener("click", this.pushToGallery.bind(this));
  }
}

customElements.define("gallery-opener", GalleryOpener);

class GalleryCloser extends HTMLElement {
  constructor() {
    super();
  }

  closeGallery() {
    this.gallery.open = false;
    this.gallery.customFontColor = false;
  }

  connectedCallback() {
    this.gallery = document.querySelector("the-gallery");
    this.addEventListener("click", this.closeGallery.bind(this));
  }
}

customElements.define("gallery-closer", GalleryCloser);
