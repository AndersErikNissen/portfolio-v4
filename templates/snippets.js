class Snippets {
  img(obj, sizes) {
    const IMG = document.createElement("img");
    IMG.setAttribute("alt", obj.alt);
    IMG.setAttribute("src", obj.url);
    IMG.setAttribute("width", obj.width);
    IMG.setAttribute("height", obj.height);

    if (sizes) {
      let srcset = "";
      let sizeNames = [
        "medium_large",
        "medium",
        "large",
        "1536x1536",
        "2048x2048",
      ];

      sizeNames.forEach((name, index) => {
        if (index !== 0) {
          srcset += ", ";
        }

        srcset += `${obj.sizes[name]} ${obj.sizes[name + "-width"]}w`;
      });

      IMG.setAttribute("sizes", sizes);
      IMG.setAttribute("srcset", srcset);
    }

    return IMG;
  }

  box_img(obj, sizes, aspect) {
    const ASPECT = aspect || (obj.height / obj.width) * 100;
    const BOX = document.createElement("div");
    const IMG = this.img(obj, sizes);

    BOX.classList.add("aspect-box");
    BOX.style.setProperty("--aspect-ratio", ASPECT + "%");

    BOX.appendChild(IMG);

    return BOX;
  }

  link_footer(cls) {
    const LINKS = [
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/anders-erik-nissen/",
      },
      {
        label: "GitHub",
        url: "https://github.com/AndersErikNissen",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/aendersledes/",
      },
    ];

    const WRAPPER = document.createElement("footer");
    WRAPPER.classList.add("link-footer");

    if (cls) {
      WRAPPER.classList.add(cls);
    }

    LINKS.forEach((link) => {
      let a = document.createElement("a");
      a.href = link.url;
      a.classList.add("underlined-btn");
      a.setAttribute("target", "_blank");
      a.textContent = link.label;
      WRAPPER.appendChild(a);
    });

    return WRAPPER;
  }

  heading(str, tagType = "h1", cssClass, extraElements = []) {
    const DELAY = 15;

    let heading = document.createElement(tagType);

    heading.setAttribute("data-animate", "");

    if (cssClass) {
      if (Array.isArray(cssClass)) {
        heading.classList.add(...cssClass);
      } else {
        heading.classList.add(cssClass);
      }
    }

    let characters = str.split("");
    let parts = characters.concat(extraElements);

    parts.forEach((part, index) => {
      let wrapper = document.createElement("span");
      wrapper.classList.add("text-overflow");
      wrapper.style.setProperty("--ani-delay", index * DELAY + "ms");

      let content =
        typeof part === "string" ? document.createElement("span") : part;
      content.classList.add("text-overflow-content");

      if (typeof part === "string") {
        content.innerHTML = part === " " ? String.fromCharCode(160) : part;
      }

      wrapper.appendChild(content);

      heading.appendChild(wrapper);
    });

    return heading;
  }

  icon(type) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(
      "http://www.w3.org/2000/xmlns/",
      "xmlns",
      "http://www.w3.org/2000/svg"
    );
    svg.setAttribute("fill", "none");

    const addPath = (d, name) => {
      let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("fill-rule", "evenodd");
      path.setAttribute("clip-rule", "evenodd");
      path.setAttribute("fill", "currentColor");
      path.setAttribute("d", d);
      if (name) {
        path.classList.add(name);
      }
      svg.appendChild(path);
    };

    const addCircle = (x, y, r) => {
      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("fill", "currentColor");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", r);
      svg.appendChild(circle);
    };

    let size = 0;

    switch (type) {
      case "circle-plus":
        size = 52;
        addCircle(26, 26, 25);
        addPath("M25 27V35H27V27H35V25L27 25V17H25V25L17 25V27H25Z", "plus");
        addPath(
          "M26 1.5C12.469 1.5 1.5 12.469 1.5 26C1.5 39.531 12.469 50.5 26 50.5C39.531 50.5 50.5 39.531 50.5 26C50.5 12.469 39.531 1.5 26 1.5ZM0.5 26C0.5 11.9167 11.9167 0.5 26 0.5C40.0833 0.5 51.5 11.9167 51.5 26C51.5 40.0833 40.0833 51.5 26 51.5C11.9167 51.5 0.5 40.0833 0.5 26Z"
        );
        break;
      case "circle-close":
        size = 52;
        addCircle(26, 26, 25);
        addPath(
          "M24.5856 26L18.9287 31.6569L20.3429 33.0711L25.9998 27.4142L31.6566 33.0711L33.0708 31.6569L27.414 26L33.0708 20.3432L31.6566 18.929L25.9998 24.5858L20.3429 18.929L18.9287 20.3432L24.5856 26Z",
          "close"
        );
        addPath(
          "M26 1.5C12.469 1.5 1.5 12.469 1.5 26C1.5 39.531 12.469 50.5 26 50.5C39.531 50.5 50.5 39.531 50.5 26C50.5 12.469 39.531 1.5 26 1.5ZM0.5 26C0.5 11.9167 11.9167 0.5 26 0.5C40.0833 0.5 51.5 11.9167 51.5 26C51.5 40.0833 40.0833 51.5 26 51.5C11.9167 51.5 0.5 40.0833 0.5 26Z"
        );
        break;
    }

    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.classList.add("icon-" + type);
    return svg;
  }
}

const SNIPPETS = new Snippets();
