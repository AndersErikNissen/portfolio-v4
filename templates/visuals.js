"use strict";

/**
 * Template: Visuals
 * Type: Dynamic
 */

console.log(
  "%cTemplate Page: LOADED",
  "background-color: #ffe500; color: black; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.visuals = (data) => {
  // Stages

  let itemsMarkup = "";

  if (data.items.length > 0) {
    data.items.forEach((item, index) => {
      let galleryOpener = document.createElement("gallery-opener");
      let galleryData = document.createElement("script");
      galleryData.innerHTML = JSON.stringify(item.gallery);
      galleryOpener.append(SNIPPETS.icon("circle-plus"), galleryData);
      galleryOpener.classList.add("visuals-item-gallery-opener");

      let heading = SNIPPETS.heading(
        item.title,
        "h2",
        ["visuals-item-title", "h1"],
        [galleryOpener]
      );

      itemsMarkup += `
        <div 
          class="visuals-item carousel-item ${index === 0 ? "active-item" : ""}"
          data-stage="${index}"
        >
          <div class="visuals-item-image-wrapper">
            ${SNIPPETS.img(item.gallery[0]).outerHTML}
          </div>
          <div class="visuals-item-main">
            ${heading.outerHTML}
            <over-flow data-animate class="visuals-item-content">
              ${item.content}
            </over-flow>
          </div>
        </div>
      `;
    });
  }

  return {
    scripts: [
      "components/overflow",
      "components/carousel",
      "components/gallery",
    ],
    styles: [
      "visuals",
      "component-overflow",
      "component-carousel",
      "component-gallery",
    ],
    markup: `
      <a-carousel class="template-visuals visuals-carousel container">
        ${itemsMarkup}
      </a-carousel>
    `,
  };
};
