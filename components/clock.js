"use strict";

class ComponentDigitalClock extends HTMLElement {
  constructor() {
    super();

    this.timeOfDay;
  }

  get iconMarkup() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(
      "http://www.w3.org/2000/xmlns/",
      "xmlns",
      "http://www.w3.org/2000/svg"
    );
    svg.setAttribute("width", 30);
    svg.setAttribute("height", 30);
    svg.setAttribute("viewBox", "0 0 30 30");
    svg.setAttribute("fill", "none");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");
    path.setAttribute("fill", "currentColor");

    switch (this.timeOfDay) {
      case "day":
        path.setAttribute(
          "d",
          "M15.5 5C15.5 4.72386 15.2761 4.5 15 4.5C14.7239 4.5 14.5 4.72386 14.5 5V8C14.5 8.27614 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.27614 15.5 8V5ZM8.27662 7.58069C8.0812 7.38558 7.76462 7.38583 7.56951 7.58125C7.3744 7.77667 7.37465 8.09325 7.57007 8.28836L9.69307 10.408C9.88848 10.6031 10.2051 10.6029 10.4002 10.4074C10.5953 10.212 10.595 9.89544 10.3996 9.70033L8.27662 7.58069ZM22.4426 8.30237C22.6383 8.10763 22.6392 7.79105 22.4445 7.59527C22.2497 7.39948 21.9331 7.39864 21.7374 7.59338L19.6104 9.70901C19.4146 9.90375 19.4137 10.2203 19.6085 10.4161C19.8032 10.6119 20.1198 10.6127 20.3156 10.418L22.4426 8.30237ZM5 14.5C4.72386 14.5 4.5 14.7239 4.5 15C4.5 15.2761 4.72386 15.5 5 15.5H8C8.27614 15.5 8.5 15.2761 8.5 15C8.5 14.7239 8.27614 14.5 8 14.5H5ZM22 14.5C21.7239 14.5 21.5 14.7239 21.5 15C21.5 15.2761 21.7239 15.5 22 15.5H25C25.2761 15.5 25.5 15.2761 25.5 15C25.5 14.7239 25.2761 14.5 25 14.5H22ZM10.4022 20.3019C10.5975 20.1067 10.5976 19.7901 10.4024 19.5948C10.2072 19.3995 9.89063 19.3994 9.69531 19.5946L7.57335 21.7153C7.37803 21.9105 7.37793 22.2271 7.57314 22.4224C7.76834 22.6177 8.08492 22.6178 8.28024 22.4226L10.4022 20.3019ZM20.3047 19.5946C20.1094 19.3994 19.7928 19.3995 19.5976 19.5948C19.4024 19.7901 19.4025 20.1067 19.5978 20.3019L21.7198 22.4226C21.9151 22.6178 22.2317 22.6177 22.4269 22.4224C22.6221 22.2271 22.622 21.9105 22.4266 21.7153L20.3047 19.5946ZM15.5 22C15.5 21.7239 15.2761 21.5 15 21.5C14.7239 21.5 14.5 21.7239 14.5 22V25C14.5 25.2761 14.7239 25.5 15 25.5C15.2761 25.5 15.5 25.2761 15.5 25V22ZM11.5 15C11.5 13.067 13.067 11.5 15 11.5C16.933 11.5 18.5 13.067 18.5 15C18.5 16.933 16.933 18.5 15 18.5C13.067 18.5 11.5 16.933 11.5 15ZM15 10.5C12.5147 10.5 10.5 12.5147 10.5 15C10.5 17.4853 12.5147 19.5 15 19.5C17.4853 19.5 19.5 17.4853 19.5 15C19.5 12.5147 17.4853 10.5 15 10.5Z"
        );
        break;
      case "night":
        path.setAttribute(
          "d",
          "M15.2195 5.68658C15.3208 5.81252 15.355 5.97968 15.3112 6.13529C15.0733 6.98185 14.9459 7.87522 14.9459 8.79917C14.9459 13.9779 18.9538 18.221 24.0367 18.5951C24.1982 18.607 24.3439 18.6963 24.4277 18.8348C24.5116 18.9733 24.5232 19.1438 24.4588 19.2924C22.9408 22.7982 19.4498 25.2525 15.3843 25.2525C9.92535 25.2525 5.5 20.8271 5.5 15.3682C5.5 10.1051 9.61323 5.80307 14.8008 5.50085C14.9622 5.49145 15.1181 5.56064 15.2195 5.68658ZM14.1768 6.56522C9.84151 7.15418 6.5 10.8711 6.5 15.3682C6.5 20.2749 10.4776 24.2525 15.3843 24.2525C18.7924 24.2525 21.7533 22.3334 23.2435 19.5152C17.9882 18.7738 13.9459 14.2588 13.9459 8.79917C13.9459 8.03375 14.0254 7.28644 14.1768 6.56522Z"
        );
        break;
    }

    svg.appendChild(path);

    return svg;
  }

  get labelMarkup() {
    let span = document.createElement("span");

    let hours = this.currentTime.hours;
    if (10 > this.currentTime.hours) {
      hours = "0" + hours;
    }

    let minutes = this.currentTime.minutes;
    if (10 > this.currentTime.minutes) {
      minutes = "0" + minutes;
    }

    span.textContent = hours + ":" + minutes;

    return span;
  }

  movement() {
    const now = new Date();
    const hours = now.getHours();
    const currentTimeOfDay = hours >= 11 ? "day" : "night";

    this.currentTime = {
      hours: hours,
      minutes: now.getMinutes(),
    };

    if (this.timeOfDay !== currentTimeOfDay) {
      this.timeOfDay = currentTimeOfDay;
    }

    this.replaceChildren(this.iconMarkup, this.labelMarkup);
  }

  initiateMovement() {
    this.movement();
    const secondsToNextFullMinute = (60 - new Date().getSeconds()) * 1000;
    setTimeout(this.movement.bind(this), secondsToNextFullMinute);
  }

  connectedCallback() {
    this.initiateMovement();
  }
}

customElements.define("digital-clock", ComponentDigitalClock);
