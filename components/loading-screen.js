class LoadingScreen extends HTMLElement {
  constructor() {
    super();
  }

  remove() {
    this.setAttribute("fade");

    setTimeout(() => {
      this.remove();
    }, 310);
  }

  get counter() {
    return this._counter;
  }

  set counter(ele) {
    this._counter = ele;
  }

  get progress() {
    return this._progress || 0;
  }

  set progress(v) {
    this._progress = v + this.progress;

    this.style.setProperty("--progress", "-" + (100 - this.progress) + "%");
    this.counter.textContent = this.progress + "%";
  }

  progressInterval() {
    let interval;

    this.progress = 1;

    interval = setInterval(() => {
      if (this.progress === 100) {
        clearInterval(interval);
        this.setAttribute("finished", "");
      } else {
        this.progress = 1;
      }
    }, 50);
  }

  swapLabels() {
    let labels = Array.from(
      this.querySelectorAll(".loading-screen-footer-label")
    );

    let index = 0;

    setInterval(() => {
      labels[index].classList.remove("active-footer-label");

      index = index + 1 > labels.length - 1 ? 0 : index + 1;

      labels[index].classList.add("active-footer-label");
    }, 2000);
  }

  connectedCallback() {
    this.counter = this.querySelector("[data-loading-counter]");

    this.progressInterval();
    this.swapLabels();
  }
}

customElements.define("loading-screen", LoadingScreen);
