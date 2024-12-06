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
  console.log("projects", data);

  let itemsMarkup = "";
  let controlMarkup = "";

  if (data.items && data.items.length > 0) {
    controlMarkup +=
      '<stage-control manager="stage-projects" class="projects-control controller">';

    data.items.forEach((item, index) => {
      controlMarkup += `
        <div 
          data-stage="${index}"
          class="control-item ${index === 0 ? "active-stage" : ""} "
        ></div>`;
    });

    controlMarkup += "</stage-control>";
  }

  if (data.items.length > 1) {
    data.items.forEach((item, index) => {
      let year = "",
        subtitle = "",
        title = document.createElement("a");

      title.href = item.href;
      title.appendChild(
        SNIPPETS.heading(item.title, "h3", ["projects-item-title", "h1"])
      );

      let img = SNIPPETS.img(item.image);
      let bg = document.createElement("div");
      bg.classList.add("projects-item-background");
      bg.appendChild(img);

      if (item.year.length > 0) {
        let star = SNIPPETS.icon("star");
        star.setAttribute("data-animate", "");
        star.classList.add("projects-item-star");

        year = SNIPPETS.heading(item.year, "p", [
          "fs-medium",
          "anton-sc-regular",
          "projects-item-year",
        ]);

        year.appendChild(star);
      }

      let content = document.createElement("over-flow");
      content.setAttribute("data-animate", "");
      content.innerHTML = item.content;

      if (item.subtitle.length > 0) {
        subtitle = SNIPPETS.heading(item.subtitle, "p", [
          "fs-medium",
          "fw-200",
          "projects-item-subtitle",
        ]);
      }

      itemsMarkup += `
        <div 
          class="projects-item ${index === 0 ? "active-stage" : ""}" 
          data-stage="${index}"
        >
          ${bg.outerHTML}

          <div class="projects-item-main">
            ${year.outerHTML}
            ${title.outerHTML}
            ${content.outerHTML}
          </div>

          ${subtitle.outerHTML}
        </div>      
      `;
    });
  }

  return {
    scripts: ["components/overflow", "components/stage-manager"],
    styles: ["projects", "component-overflow", "component-stage-manager"],
    markup: `
      <stage-projects class="template-projects template">
        <div class="projects-items container">
          ${itemsMarkup}
        </div>

        ${controlMarkup}
      </stage-projects>
    `,
  };
};
