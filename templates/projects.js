"use strict";

/**
 * Template: Projects
 * Type: Dynamic
 */

console.log(
  "%cTemplate Projects: LOADED",
  "background-color: purple; color: white; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.projects = (data, params) => {



  console.log("params",params);



  let projects = data.items;
  let itemsMarkup = "";
  let controlMarkup = "";
  
  projects.sort((a, b) => {
    return parseInt(b.year + b.month) - parseInt(a.year + a.month);
  });
  

  
  // Possibly change the start stage to match the given project
  let startStageIndex = 0;
  if (params.project) {
    let projectIndex = projects.map((project) => project.slug).indexOf(params.project);
    if (projectIndex > -1) {
      startStageIndex = projectIndex;
    }
  }

  if (projects && projects.length > 0) {
    controlMarkup += '<stage-control manager="stage-delayed" class="projects-control controller">';

    projects.forEach((item, index) => {
      controlMarkup += `
        <div data-stage="${index}" class="control-item"></div>`;
    });

    controlMarkup += "</stage-control>";
  }

  if (projects.length > 1) {
    projects.forEach((item, index) => {
      let year = "",
        subtitle = "",
        title = document.createElement("a-link");

      title.setAttribute("the-path", item.path);
      title.appendChild(SNIPPETS.heading(item.title, "h3", ["projects-item-title", "h1"]));

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

      let contentWrapper = document.createElement("a-link");
      contentWrapper.setAttribute("the-path", item.path);
      contentWrapper.innerHTML = item.content;

      let content = document.createElement("over-flow");
      content.setAttribute("data-animate", "");
      content.innerHTML = contentWrapper.outerHTML;

      if (item.subtitle.length > 0) {
        subtitle = document.createElement("a-link");
        subtitle.setAttribute("the-path", item.path);
        subtitle.appendChild(SNIPPETS.heading(item.subtitle, "p", ["fs-medium", "fw-200", "projects-item-subtitle"]));
      }

      let coverLink = document.createElement("a-link");
      coverLink.setAttribute("the-path", item.path);
      coverLink.classList.add("cover");

      itemsMarkup += `
        <div class="projects-item" data-stage="${index}">
          ${bg.outerHTML}
          ${coverLink.outerHTML}

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

  let stage = document.createElement("stage-delayed");
  stage.setAttribute("stage", startStageIndex);
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
