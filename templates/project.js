"use strict";

/**
 * Template: Project
 * Type: Dynamic
 */

console.log(
  "%cTemplate Project: LOADED",
  "background-color: yellow; color: black; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.project = (data) => {
  let stageCounter = 0;

  let galleryMarkup = "";
  let mainMarkup = "";

  const createGalleryItem = (obj) => {
    let img = SNIPPETS.img(obj, "(max-width: 767px) calc(100vw - 24px), 50vw");
    let wrapper = document.createElement("div");
    wrapper.classList.add("project-gallery-item");
    wrapper.appendChild(img);
    wrapper.setAttribute("data-stage", stageCounter);
    return wrapper;
  };

  const createYear = () => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("project-year-wrapper");
    let star = SNIPPETS.icon("star");
    star.setAttribute("data-animate", "");
    star.classList.add("project-star");

    let year = SNIPPETS.heading(data.year, "p", ["fs-medium", "anton-sc-regular", "project-year"]);
    wrapper.append(star, year);
    return wrapper;
  };

  const createTitle = () => {
    let titleElements = ["url", "github"].map((value) => {
      if (data[value].length > 0) {
        let a = document.createElement("a");
        a.classList.add("project-title-icon", "h-scale-icon");
        a.href = data[value];
        a.setAttribute("target", "_blank");
        a.appendChild(SNIPPETS.icon(value));
        return a;
      }
    });

    return SNIPPETS.heading(data.title, "h1", ["project-title", "h1"], titleElements);
  };

  const mainMeta = () => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("project-meta");

    if (data.year.length > 0) {
      wrapper.appendChild(createYear());
    }

    wrapper.appendChild(createTitle());

    if (data.subtitle && data.subtitle.length > 0) {
      wrapper.appendChild(SNIPPETS.heading(data.subtitle, "p", ["fs-medium", "fw-200", "project-subtitle"]));
    }

    return wrapper;
  };

  const mainItem = (stage, indexes) => {
    let wrapper = document.createElement("div");
    wrapper.setAttribute("data-stage", JSON.stringify(indexes));
    wrapper.classList.add("project-main-item");

    if (stage.title) {
      let title = SNIPPETS.heading(stage.title, "h3", ["h3", "project-main-item-title"]);
      wrapper.appendChild(title);
    }

    if (stage.content) {
      let content = document.createElement("over-flow");
      content.setAttribute("data-animate", "");
      content.classList.add("project-main-item-content");
      content.innerHTML = stage.content;
      wrapper.appendChild(content);
    }

    return wrapper;
  };

  data.stages.forEach((stage) => {
    let indexes = [];

    const handleGalleryItem = (imgObj) => {
      galleryMarkup += createGalleryItem(imgObj).outerHTML;
      indexes.push(stageCounter);
      stageCounter++;
    };

    if (stage.gallery) {
      if (Array.isArray(stage.gallery)) {
        stage.gallery.forEach((imgObj) => handleGalleryItem(imgObj));
      } else {
        handleGalleryItem(stage.gallery);
      }
    } else {
      indexes.push(stageCounter);
      stageCounter++;
    }

    mainMarkup += mainItem(stage, indexes).outerHTML;
  });

  const controller = () => {
    let controller = document.createElement("stage-control");
    controller.classList.add("project-control", "controller");

    for (let i = 0; stageCounter > i; i++) {
      let item = document.createElement("div");
      item.setAttribute("data-stage", i);
      item.classList.add("control-item");
      if (i === 0) item.classList.add("active-stage");
      controller.appendChild(item);
    }

    return controller;
  };

  const galleryOpener = () => {
    let opener = document.createElement("gallery-opener"),
      images = data.stages.map((stage) => stage.gallery).flat(),
      openerData = document.createElement("script");

    openerData.innerHTML = JSON.stringify(images);
    opener.append(SNIPPETS.icon("circle-plus"), openerData);
    opener.classList.add("project-gallery-opener", "h-scale-icon");

    return opener;
  };

  let stageManager = document.createElement("stage-manager");
  stageManager.classList.add("template-project", "template");

  if (data.color && data.color.length > 0) {
    stageManager.style.setProperty("--color-project", data.color);
  }

  stageManager.innerHTML = `
    <div class="project-sxs container">
      <div class="project-gallery t-curtain">
        ${galleryMarkup}
        ${galleryOpener().outerHTML}
      </div>

      ${controller().outerHTML}

      <div class="project-content">
        ${mainMeta().outerHTML}

        <div class="project-main">
          ${mainMarkup}
        </div>
      </div>
    </div>
  `;

  return {
    scripts: ["components/overflow", "components/gallery"],
    styles: ["project", "component-overflow", "component-gallery"],
    html: stageManager,
  };
};
