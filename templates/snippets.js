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

      console.warn(srcset);
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

  heading(str, tagType = "h1", clss, animate = true) {
    const DELAY = 15;

    let heading = document.createElement(tagType);

    if (animate) heading.setAttribute("data-animate", "");

    if (clss) {
      if (Array.isArray(clss)) {
        heading.classList.add(...clss);
      } else {
        heading.classList.add(clss);
      }
    }

    let characters = str.split("");

    characters.forEach((character, index) => {
      let wrapper = document.createElement("span");
      let span = document.createElement("span");

      wrapper.classList.add("text-overflow");
      wrapper.style.setProperty("--ani-delay", index * DELAY + "ms");
      span.classList.add("text-overflow-content");

      span.textContent =
        character === " " ? String.fromCharCode(160) : character;

      wrapper.appendChild(span);
      heading.appendChild(wrapper);
    });

    return heading;
  }
}

const SNIPPETS = new Snippets();
