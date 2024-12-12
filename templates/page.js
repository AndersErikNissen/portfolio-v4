"use strict";

/**
 * Template: Page
 * Type: Dynamic
 */

console.log(
  "%cTemplate Page: LOADED",
  "background-color: lightgreen; color: black; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.page = (data) => {
  // Stages

  let contentMarkup = "";
  let galleryMarkup = "";
  let controlMarkup = "";

  if (data.stages && data.stages.length > 0) {
    controlMarkup += '<stage-control class="page-control controller">';

    data.stages.forEach((stage, index) => {
      controlMarkup += `
        <div 
          data-stage="${index}"
          class="control-item ${index === 0 ? "active-stage" : ""} "
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
        markup += SNIPPETS.heading(stage.title, "h2", [
          "h1",
          "page-title",
        ]).outerHTML;
      }

      if (stage.content) {
        markup += `
          <over-flow data-animate class="page-content">
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
          class="page-image-wrapper aspect-box ${
            index === 0 ? "active-stage" : ""
          }" 
          data-stage="${index}"
        >
          ${
            SNIPPETS.img(
              stage.image,
              "(max-width: 767px) calc(100vw - 24px), 50vw"
            ).outerHTML
          }
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
    scripts: ["components/overflow"],
    styles: ["page", "component-overflow"],
    markup: `
      <stage-manager class="template-page container">
        <div class="page-sxs container">
          <div class="page-main page-sxs-item">
            <div class="page-main-stages">
              ${contentMarkup}
            </div>
            ${SNIPPETS.link_footer("page-footer").outerHTML}
          </div>
          
          ${controlMarkup}

          <div class="page-gallery page-sxs-item">
            ${galleryMarkup}
          </div>
        </div>
      </stage-manager>
    `,
  };
};
