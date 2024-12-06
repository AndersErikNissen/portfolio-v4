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
  console.warn("Project(data)", data);

  let stageCounter = 0;

  let galleryMarkup = "";
  let mainMarkup = "";

  const createGalleryItem = (obj) => {
    let img = SNIPPETS.img(obj);
    let wrapper = document.createElement("div");
    wrapper.classList.add("project-gallery-item");
    wrapper.appendChild(img);
    wrapper.setAttribute("data-stage", stageCounter);
    return wrapper;
  };

  const createYear = () => {
    let star = SNIPPETS.icon("star");
    star.setAttribute("data-animate", "");
    star.classList.add("project-star");

    let year = SNIPPETS.heading(data.year, "p", [
      "fs-medium",
      "anton-sc-regular",
      "project-year",
    ]);

    return year.appendChild(star);
  };

  const createTitle = () => {
    let titleElements = ["url", "github"].filter((value) => {
      if (data[value].length > 0) {
        let a = document.createElement("a");
        a.classList.add("project-title-icon");
        a.href = data[value];
        a.appendChild(SNIPPETS.icon(value));

        return a;
      }
    });

    return SNIPPETS.heading(
      data.title,
      "h1",
      ["project-title", "h1"],
      titleElements
    );
  };

  const mainMeta = () => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("project-meta");

    if (data.year.length > 0) {
      wrapper.appendChild(createYear());
    }

    wrapper.appendChild(createTitle());

    if (data.subtitle.length > 0) {
      wrapper.appendChild(
        SNIPPETS.heading(stage.subtitle, "p", [
          "fs-medium",
          "fw-200",
          "project-subtitle",
        ])
      );
    }

    return wrapper;
  };

  const mainItem = (stage, indexes) => {
    let wrapper = document.createElement("div");
    wrapper.setAttribute("data-stage", JSON.stringify(indexes));
    wrapper.classList.add("project-main-item");

    if (stage.title.length > 0) {
      let title = document.createElement("h3");
      title.classList.add("h4", "project-main-item-title");
      title.textContent = stage.title;
      wrapper.appendChild(title);
    }

    if (stage.content.length > 0) {
      let content = document.createElement("over-flow");
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

  let controlMarkup = '<stage-control class="project-control controller">';
  for (let i = 0; stageCounter > i; i++) {
    controlMarkup += `
      <div 
        data-stage="${i}"
        class="control-item ${i === 0 ? "active-stage" : ""} "
      ></div>
    `;
  }
  controlMarkup += "</stage-control>";

  return {
    scripts: ["components/stage-manager", "components/overflow"],
    styles: ["project", "component-stage-manager", "component-overflow"],
    markup: `
      <stage-manager class="template-project template">
        <div class="project-sxs container">
          <div class="project-gallery">
            ${galleryMarkup}
          </div>

          ${controlMarkup}

          <div class="project-main">
            ${mainMarkup}
          </div>
        </div>
      </stage-manager>
    `,
  };
};
