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
      a.classList.add("underlined-btn", "external-link");
      a.setAttribute("target", "_blank");
      a.textContent = link.label;
      WRAPPER.appendChild(a);
    });

    return WRAPPER;
  }

  heading(str, tagType = "h1", cssClass, extraElements = [], animate = true) {
    const DELAY = 15;
    let counter = 0;

    let heading = document.createElement(tagType);
    heading.classList.add("text-overflow-wrapper");

    if (animate) heading.setAttribute("data-animate", "");

    if (cssClass) {
      if (Array.isArray(cssClass)) {
        heading.classList.add(...cssClass);
      } else {
        heading.classList.add(cssClass);
      }
    }

    const itemWrapper = (v) => {
      let item = v;

      if (typeof v === "string") {
        let strWrapper = document.createElement("span");
        strWrapper.classList.add("text-overflow-content");
        strWrapper.innerHTML = v;
        item = strWrapper;
      }

      let wrapper = document.createElement("span");
      wrapper.classList.add("text-overflow");
      wrapper.style.setProperty("--ani-delay", counter * DELAY + "ms");
      wrapper.appendChild(item);

      counter++;
      return wrapper;
    };

    let word;
    str.split("").forEach((char, index, array) => {
      if (char === " ") {
        heading.appendChild(word);
        heading.append(itemWrapper(String.fromCharCode(160)));

        word = undefined;
        return;
      }

      if (!word) {
        word = document.createElement("span");
        word.classList.add("text-overflow-word");
      }

      word.appendChild(itemWrapper(char));

      if (index === array.length - 1) {
        heading.appendChild(word);
      }
    });

    extraElements.forEach((ele) => heading.appendChild(itemWrapper(ele)));

    return heading;
  }

  icon(type, cls) {
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

    let size = 0,
      width,
      height;

    switch (type) {
      case "logo":
        width = 100;
        height = 20;

        addPath(
          "M88.9105 19.966C88.1015 19.966 87.3329 19.8633 86.6048 19.6579C85.8969 19.432 85.2396 19.1239 84.6329 18.7336C84.0261 18.3228 83.5003 17.8402 83.0553 17.2856L84.8149 15.4987C85.3407 16.156 85.9475 16.6489 86.6351 16.9775C87.3228 17.2856 88.0913 17.4397 88.9408 17.4397C89.7902 17.4397 90.4476 17.2959 90.9127 17.0083C91.3779 16.7002 91.6105 16.2792 91.6105 15.7452C91.6105 15.2111 91.4184 14.8004 91.0341 14.5128C90.67 14.2047 90.1947 13.9583 89.6082 13.7734C89.0217 13.568 88.3947 13.3729 87.7273 13.188C87.0801 12.9826 86.4632 12.7259 85.8767 12.4178C85.2902 12.1097 84.8048 11.6887 84.4205 11.1546C84.0565 10.6206 83.8744 9.91201 83.8744 9.02882C83.8744 8.14564 84.0868 7.38568 84.5115 6.74896C84.9362 6.09171 85.5228 5.58849 86.2711 5.23933C87.0396 4.89016 87.9599 4.71558 89.0318 4.71558C90.1644 4.71558 91.1655 4.92097 92.0352 5.33175C92.9251 5.722 93.6532 6.31764 94.2195 7.11867L92.4599 8.90559C92.0554 8.37157 91.5498 7.96078 90.9431 7.67323C90.3565 7.38568 89.6891 7.24191 88.9408 7.24191C88.152 7.24191 87.5453 7.38568 87.1205 7.67323C86.716 7.94024 86.5138 8.32022 86.5138 8.81316C86.5138 9.30611 86.6958 9.68608 87.0599 9.95309C87.4239 10.2201 87.8992 10.446 88.4857 10.6309C89.0925 10.8157 89.7195 11.0109 90.3667 11.2163C91.0139 11.4011 91.6307 11.6579 92.2172 11.9865C92.8038 12.3151 93.2791 12.7567 93.6431 13.3113C94.0274 13.8658 94.2195 14.595 94.2195 15.4987C94.2195 16.8748 93.7341 17.9634 92.7633 18.7644C91.8127 19.5655 90.5285 19.966 88.9105 19.966Z"
        );
        addPath(
          "M75.6156 19.6579V5.02367H78.3459V6.72434C78.4226 6.60549 78.5035 6.49047 78.5886 6.37926C79.4381 5.27014 80.6617 4.71558 82.2595 4.71558C82.9876 4.71558 84.0909 4.84643 84.5846 5.34779L83.0786 7.55C82.7145 7.40622 82.2898 7.33434 81.8044 7.33434C80.7932 7.33434 79.9639 7.66296 79.3167 8.32022C78.6695 8.97748 78.3459 9.97363 78.3459 11.3087V19.6579H75.6156Z"
        );
        addPath(
          "M67.8451 19.966C66.4091 19.966 65.1147 19.6374 63.9619 18.9801C62.8091 18.3023 61.899 17.3883 61.2315 16.2381C60.5641 15.0879 60.2304 13.7837 60.2304 12.3254C60.2304 10.8876 60.554 9.59365 61.2012 8.44345C61.8686 7.29326 62.7585 6.38953 63.8709 5.73227C65.0035 5.05447 66.2676 4.71558 67.6631 4.71558C68.9979 4.71558 70.171 5.02366 71.1822 5.63984C72.2137 6.25602 73.0126 7.1084 73.5789 8.19698C74.1654 9.28557 74.4587 10.5179 74.4587 11.8941C74.4587 12.0994 74.4486 12.3254 74.4284 12.5718C74.4081 12.7978 74.3677 13.0648 74.307 13.3729H63.0218C63.1179 13.9428 63.2897 14.4665 63.5372 14.9441C63.9417 15.7041 64.5181 16.2997 65.2664 16.7311C66.0148 17.1418 66.8743 17.3472 67.8451 17.3472C68.6541 17.3472 69.3923 17.2035 70.0598 16.9159C70.7474 16.6284 71.3339 16.197 71.8193 15.6219L73.5789 17.4397C72.8913 18.2612 72.0418 18.8877 71.0306 19.319C70.0395 19.7503 68.9777 19.966 67.8451 19.966ZM69.8777 7.85809C70.5047 8.22779 70.9901 8.76181 71.3339 9.46015C71.5685 9.92249 71.723 10.4565 71.7976 11.0622H63.0274C63.1203 10.5331 63.2802 10.0504 63.5069 9.61419C63.8911 8.87478 64.4372 8.29968 65.1451 7.88889C65.853 7.47811 66.6721 7.27272 67.6024 7.27272C68.4923 7.27272 69.2508 7.46784 69.8777 7.85809Z"
        );
        addPath(
          "M51.4317 19.966C50.0969 19.966 48.9036 19.6374 47.8519 18.9801C46.8002 18.3023 45.9608 17.3883 45.3339 16.2381C44.7271 15.0879 44.4237 13.7939 44.4237 12.3562C44.4237 10.9184 44.7271 9.62447 45.3339 8.47427C45.9608 7.32407 46.8002 6.41007 47.8519 5.73228C48.9036 5.05448 50.0969 4.71558 51.4317 4.71558C52.5036 4.71558 53.4744 4.95178 54.3441 5.42419C55.117 5.82574 55.754 6.37329 56.2554 7.06681V0H59.0161V19.6579H56.2554V17.6568C55.7588 18.333 55.1318 18.8768 54.3744 19.2882C53.5048 19.7401 52.5239 19.966 51.4317 19.966ZM54.2531 16.7003C53.5857 17.1316 52.7969 17.3472 51.8868 17.3472C50.9766 17.3472 50.1676 17.1316 49.4598 16.7003C48.7721 16.2689 48.226 15.6836 47.8215 14.9441C47.4373 14.1842 47.2451 13.3113 47.2451 12.3254C47.2451 11.36 47.4373 10.5077 47.8215 9.76824C48.226 9.00829 48.7721 8.41265 49.4598 7.98133C50.1474 7.55 50.9463 7.33434 51.8564 7.33434C52.7666 7.33434 53.5553 7.55 54.2228 7.98133C54.9104 8.41265 55.4464 8.99802 55.8306 9.73744C56.2351 10.4768 56.4374 11.3498 56.4374 12.3562C56.4374 13.3215 56.2452 14.1842 55.861 14.9441C55.4767 15.6836 54.9407 16.2689 54.2531 16.7003Z"
        );
        addPath(
          "M40.727 19.6579V11.1238C40.727 10.0147 40.3831 9.10071 39.6955 8.38184C39.0078 7.66296 38.1179 7.30352 37.0258 7.30352C36.2977 7.30352 35.6505 7.46784 35.0842 7.79647C34.5179 8.1251 34.0729 8.57696 33.7493 9.15206C33.4257 9.72716 33.2639 10.3844 33.2639 11.1238V19.6579H30.5336V5.02367H33.2639V6.91441C33.701 6.33332 34.2471 5.85711 34.9022 5.4858C35.7718 4.97232 36.7528 4.71558 37.8449 4.71558C38.9371 4.71558 39.8977 4.99286 40.727 5.54742C41.5764 6.10198 42.2438 6.83112 42.7292 7.73485C43.2146 8.61804 43.4573 9.56285 43.4573 10.5693V19.6579H40.727Z"
        );
        addPath(
          "M23.0923 19.966C21.6563 19.966 20.3619 19.6374 19.2091 18.9801C18.0562 18.3023 17.1461 17.3883 16.4787 16.2381C15.8113 15.0879 15.4775 13.7837 15.4775 12.3254C15.4775 10.8876 15.8011 9.59365 16.4483 8.44345C17.1158 7.29326 18.0057 6.38953 19.118 5.73227C20.2506 5.05447 21.5147 4.71558 22.9102 4.71558C24.2451 4.71558 25.4181 5.02366 26.4294 5.63984C27.4609 6.25602 28.2597 7.1084 28.826 8.19698C29.4126 9.28557 29.7058 10.5179 29.7058 11.8941C29.7058 12.0994 29.6957 12.3254 29.6755 12.5718C29.6553 12.7978 29.6148 13.0648 29.5541 13.3729H18.2689C18.365 13.9428 18.5368 14.4665 18.7843 14.9441C19.1888 15.7041 19.7652 16.2997 20.5136 16.7311C21.2619 17.1418 22.1215 17.3472 23.0923 17.3472C23.9013 17.3472 24.6395 17.2035 25.3069 16.9159C25.9945 16.6284 26.5811 16.197 27.0665 15.6219L28.826 17.4397C28.1384 18.2612 27.2889 18.8877 26.2777 19.319C25.2867 19.7503 24.2249 19.966 23.0923 19.966ZM25.1249 7.85809C25.7518 8.22779 26.2372 8.76181 26.5811 9.46015C26.8156 9.92249 26.9701 10.4565 27.0447 11.0622H18.2745C18.3675 10.5331 18.5273 10.0504 18.754 9.61419C19.1383 8.87478 19.6843 8.29968 20.3922 7.88889C21.1001 7.47811 21.9192 7.27272 22.8496 7.27272C23.7395 7.27272 24.4979 7.46784 25.1249 7.85809Z"
        );
        addPath(
          "M7.0383 19.966C5.72368 19.966 4.5304 19.6374 3.45848 18.9801C2.38655 18.3023 1.5371 17.3883 0.910125 16.2381C0.303375 15.0879 0 13.7939 0 12.3562C0 10.9184 0.303375 9.62446 0.910125 8.47426C1.5371 7.32406 2.37644 6.41007 3.42814 5.73227C4.50006 5.05447 5.70345 4.71558 7.0383 4.71558C8.13045 4.71558 9.10125 4.95178 9.9507 5.42418C10.7081 5.81768 11.335 6.35138 11.8316 7.02525V5.02366H14.5923V19.6579H11.8316V17.6671C11.3514 18.3385 10.7345 18.8789 9.98104 19.2882C9.13159 19.7401 8.15068 19.966 7.0383 19.966ZM10.7698 15.9608C9.94059 16.8851 8.84844 17.3472 7.49336 17.3472C6.58324 17.3472 5.77424 17.1316 5.06636 16.7002C4.35849 16.2689 3.8023 15.6835 3.3978 14.9441C3.01353 14.1842 2.82139 13.3113 2.82139 12.3254C2.82139 11.36 3.01353 10.5077 3.3978 9.76824C3.8023 9.00829 4.34838 8.41265 5.03603 7.98132C5.7439 7.55 6.5529 7.33433 7.46303 7.33433C8.37315 7.33433 9.17204 7.55 9.85969 7.98132C10.5473 8.39211 11.0732 8.97748 11.4372 9.73743C11.8215 10.4768 12.0137 11.3498 12.0137 12.3562C12.0137 13.8145 11.599 15.016 10.7698 15.9608Z"
        );
        addPath(
          "M95.2371 17.6324C95.1444 17.5873 95.1444 17.4533 95.2371 17.4083L96.1485 16.9655C96.5264 16.7819 96.8311 16.4724 97.0119 16.0886L97.4479 15.1631C97.4923 15.0689 97.6243 15.0689 97.6687 15.1631L98.1047 16.0886C98.2855 16.4724 98.5901 16.7819 98.9681 16.9655L99.8795 17.4083C99.9722 17.4533 99.9722 17.5873 99.8795 17.6324L98.9681 18.0752C98.5902 18.2588 98.2855 18.5682 98.1047 18.952L97.6687 19.8776C97.6243 19.9717 97.4923 19.9717 97.4479 19.8776L97.0119 18.952C96.8311 18.5682 96.5265 18.2588 96.1485 18.0752L95.2371 17.6324Z"
        );

        break;

      case "menu":
        size = 33;
        addPath("M29 13H4V12H29V13Z", "top");
        addPath("M29 21H4V20H29V21Z", "bottom");
        break;

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

      case "mail":
        addPath(
          "M0 0H18V9.5H0V0ZM2.31138 1.02866L9 5.20239L15.6886 1.02866H2.31138ZM16.9697 1.44231L9 6.41544L1.0303 1.44231V8.47134H16.9697V1.44231Z"
        );
        width = 18;
        height = 10;
        break;

      case "phone":
        addPath(
          "M1.15753 2.58202L2.73059 6.43162L5.62177 5.65629L5.3577 2.85416L5.75221 2.77455C6.73973 2.57528 7.81158 2.43799 8.89034 2.438C9.969 2.438 11.0409 2.57526 12.0285 2.7745L12.423 2.8541L12.1589 5.65629L15.0671 6.43618L16.8146 2.65777C14.3484 1.55243 11.5539 0.894846 8.89034 0.894844C6.27152 0.894843 3.59885 1.54868 1.15753 2.58202ZM0.396507 1.93696C3.03128 0.765343 5.97718 -1.81973e-06 8.89034 0C11.8461 1.85111e-06 14.9314 0.767272 17.6 2.03491L18 2.22492L15.5625 7.49543L11.1978 6.32497L11.4568 3.57649C10.6277 3.42809 9.75685 3.33284 8.89034 3.33284C8.02376 3.33284 7.15292 3.42811 6.32385 3.57652L6.58286 6.32497L2.20117 7.5L0 2.11328L0.396507 1.93696Z"
        );
        width = 18;
        height = 8;
        break;

      case "star":
        addPath(
          "M0.279272 5.91253C0.0644616 5.80977 0.0644615 5.50396 0.279272 5.4012L2.39071 4.3911C3.2663 3.97222 3.97219 3.26633 4.39107 2.39073L5.40117 0.279302C5.50393 0.0644923 5.80974 0.0644919 5.9125 0.279302L6.92261 2.39075C7.34149 3.26633 8.04738 3.97222 8.92296 4.39109L11.0344 5.4012C11.2492 5.50396 11.2492 5.80977 11.0344 5.91253L8.92297 6.92264C8.04738 7.34152 7.34149 8.0474 6.92261 8.92299L5.9125 11.0344C5.80974 11.2492 5.50393 11.2492 5.40117 11.0344L4.39107 8.923C3.97219 8.04741 3.2663 7.34151 2.39071 6.92264L0.279272 5.91253Z"
        );
        width = 12;
        height = 12;
        break;

      case "github":
        addPath(
          "M25 0.980392C11.7343 0.980392 0.980392 11.7343 0.980392 25C0.980392 38.2657 11.7343 49.0196 25 49.0196C38.2657 49.0196 49.0196 38.2657 49.0196 25C49.0196 11.7343 38.2657 0.980392 25 0.980392ZM0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25Z"
        );
        addPath(
          "M25.5112 12C18.0398 12 12 18.0844 12 25.6116C12 31.6284 15.8699 36.7216 21.2386 38.5242C21.9098 38.6598 22.1556 38.2314 22.1556 37.871C22.1556 37.5554 22.1335 36.4738 22.1335 35.3468C18.375 36.1583 17.5924 33.7242 17.5924 33.7242C16.9884 32.1467 16.0934 31.7413 16.0934 31.7413C14.8632 30.9074 16.183 30.9074 16.183 30.9074C17.5476 30.9976 18.2636 32.3046 18.2636 32.3046C19.4713 34.3777 21.4175 33.792 22.2004 33.4314C22.3122 32.5524 22.6703 31.944 23.0506 31.606C20.0529 31.2905 16.899 30.1187 16.899 24.8903C16.899 23.4029 17.4356 22.1861 18.2857 21.2397C18.1516 20.9017 17.6817 19.5042 18.4201 17.6338C18.4201 17.6338 19.5609 17.2732 22.1332 19.031C23.2345 18.7331 24.3703 18.5815 25.5112 18.5802C26.652 18.5802 27.8149 18.7382 28.8888 19.031C31.4614 17.2732 32.6022 17.6338 32.6022 17.6338C33.3406 19.5042 32.8705 20.9017 32.7364 21.2397C33.6089 22.1861 34.1233 23.4029 34.1233 24.8903C34.1233 30.1187 30.9694 31.2678 27.9493 31.606C28.4416 32.0342 28.8664 32.8453 28.8664 34.1299C28.8664 35.9553 28.8443 37.4202 28.8443 37.8707C28.8443 38.2314 29.0904 38.6598 29.7614 38.5245C35.13 36.7213 38.9999 31.6284 38.9999 25.6116C39.0221 18.0844 32.9601 12 25.5112 12Z"
        );
        size = 50;
        break;

      case "url":
        addPath(
          "M25 0.980392C11.7343 0.980392 0.980392 11.7343 0.980392 25C0.980392 38.2657 11.7343 49.0196 25 49.0196C38.2657 49.0196 49.0196 38.2657 49.0196 25C49.0196 11.7343 38.2657 0.980392 25 0.980392ZM0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25Z"
        );
        addPath(
          "M31.0084 17.3382H18.1649V15H35V31.8351H32.6618V18.9916L16.6534 35L15 33.3466L31.0084 17.3382Z"
        );
        size = 50;
        break;

      case "arrow":
        size = 40;

        addPath(
          "M32.0168 4.67642H6.32978V0H40V33.6702H35.3236V7.98315L3.30673 40L0 36.6933L32.0168 4.67642Z"
        );

        break;
    }

    if (!width) width = size;
    if (!height) height = size;

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.classList.add("icon-" + type);
    if (cls) {
      svg.classList.add(cls);
    }
    return svg;
  }
}

const SNIPPETS = new Snippets();
