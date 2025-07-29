"use strict";

/**
 * Template: Projects
 * Type: Dynamic
 */

console.log(
  "%cTemplate Projects: LOADED",
  "background-color: purple; color: white; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.projects = (data) => {
  let itemsMarkup = "";
  let controlMarkup = "";

  if (data.items && data.items.length > 0) {
    controlMarkup += '<stage-control manager="stage-delayed" class="projects-control controller">';

    data.items.forEach((item, index) => {
      controlMarkup += `
        <div data-stage="${index}" class="control-item"></div>`;
    });

    controlMarkup += "</stage-control>";
  }

  if (data.items.length > 1) {
    data.items.forEach((item, index) => {
      let year = "",
        subtitle = "",
        title = SNIPPETS.heading(item.title, "h3", ["projects-item-title", "h1"]);

      let img = SNIPPETS.img(item.image, "100vw");
      let bg = document.createElement("div");
      bg.classList.add("projects-item-background");
      bg.appendChild(img);

      if (item.year.length > 0) {
        let star = SNIPPETS.icon("star");
        star.setAttribute("data-animate", "");
        star.classList.add("projects-item-star");

        year = SNIPPETS.heading(item.year, "p", ["fs-medium", "anton-sc-regular", "projects-item-year"]);

        year.appendChild(star);
      }

      let content = document.createElement("over-flow");
      content.setAttribute("data-animate", "");
      content.innerHTML = item.content;

      if (item.subtitle.length > 0) {
        subtitle = SNIPPETS.heading(item.subtitle, "p", ["fs-medium", "fw-200", "projects-item-subtitle"]);
      }

      let coverLink = document.createElement("a-link");
      coverLink.setAttribute("the-path", item.path);
      coverLink.classList.add("cover");

      itemsMarkup += `
        <div class="projects-item" data-stage="${index}">
          ${bg.outerHTML}

          <div class="projects-item-main">
            ${year.outerHTML}
            ${title.outerHTML}
            ${content.outerHTML}
          </div>

          ${subtitle.outerHTML}
          ${coverLink.outerHTML}
        </div>      
      `;
    });
  }

  let stage = document.createElement("stage-delayed");
  stage.classList.add("template-projects", "template", "t-curtain");

  stage.innerHTML = `
    <div class="projects-items container">
      ${itemsMarkup}
    </div>

    ${controlMarkup}
  `;

  return {
    scripts: ["components/overflow"],
    styles: ["projects", "component-overflow"],
    html: stage,
  };
};
