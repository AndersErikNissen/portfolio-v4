"use strict";

/**
 * Template: Page
 * Type: Dynamic
 */

console.log(
  "%cTemplate Page: LOADED",
  "background-color: lightgreen; color: black; padding: 2px 4px;"
);

APP_TEMPLATES.page = (data) => {
  // Stages

  let contentMarkup = "";
  let galleryMarkup = "";
  let controlMarkup = "";

  if (data.stages && data.stages.length > 0) {
    controlMarkup += '<stage-control class="page-control">';

    data.stages.forEach((stage, index) => {
      controlMarkup += `
        <div 
          ${index === 0 ? 'class="active-stage"' : ""} 
          data-stage="${index}"
        ></div>`;
    });

    controlMarkup += "</stage-control>";
  }

  if (data.stages && data.stages.length > 0) {
    const stageContentItem = (stage, index) => {
      if (!stage.title && !stage.content) return;

      let markup = `
        <div 
          class="page-main-stage ${index === 0 ? "active-stage" : ""}" 
          data-stage="${index}"
        >
      `;

      if (stage.title) {
        markup += `<h2 class="page-title h1">${stage.title}</h2>`;
      }

      if (stage.content) {
        markup += `
          <over-flow class="page-content">
            <p>${stage.content}</p>
          </over-flow>
        `;
      }

      markup += "</div>";

      contentMarkup += markup;
    };

    const stageGalleryItem = (stage, index) => {
      if (!stage.image) return;

      let markup = `
        <div 
          class="page-image-wrapper ${index === 0 ? "active-stage" : ""}" 
          data-stage="${index}"
        >
          ${SNIPPETS.img(stage.image).outerHTML}
        </div>
      `;

      galleryMarkup += markup;
    };

    data.stages.forEach((stage, index) => {
      stageContentItem(stage, index);
      stageGalleryItem(stage, index);
    });
  }

  return {
    scripts: ["components/overflow", "components/stage"],
    styles: ["page", "component-overflow", "component-stagemanager"],
    markup: `
      <stage-manager class="template-page container">
        <div class="page-sxs container">
          <div class="page-main page-sxs-item">
            ${contentMarkup}
            ${SNIPPETS.link_footer().outerHTML}
          </div>

          <div class="page-gallery page-sxs-item">
            ${galleryMarkup}
          </div>
        </div>
        ${controlMarkup}
      </stage-manager>
    `,
  };
};
