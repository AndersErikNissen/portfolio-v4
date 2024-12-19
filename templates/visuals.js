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
      let galleryOpener;

      if (item.gallery.length > 0) {
        galleryOpener = document.createElement("gallery-opener");
        let galleryData = document.createElement("script");
        galleryData.innerHTML = JSON.stringify(item.gallery);
        galleryOpener.append(SNIPPETS.icon("circle-plus"), galleryData);
        galleryOpener.classList.add("visuals-item-gallery-opener", "h-scale-icon");
      }

      let headingParameters = [item.title, "h2", ["visuals-item-title", "h1"]];
      if (galleryOpener) headingParameters.push([galleryOpener]);
      let heading = SNIPPETS.heading(...headingParameters);

      itemsMarkup += `
        <div 
          class="visuals-item carousel-item ${index === 0 ? "active" : ""}"
          data-stage="${index}"
        >
          <div class="visuals-item-image-wrapper">
            ${SNIPPETS.img(item.gallery[0], "(max-width: 767px) calc(100vw - 24px), 50vw").outerHTML}
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

  let wrapper = document.createElement("section");
  wrapper.classList.add("template-visuals", "template");

  wrapper.innerHTML = `
    <a-carousel class="visuals-carousel container">
      ${itemsMarkup}
    </a-carousel>

    <div class="visuals-controls">
      <carousel-control mode="prev" class="h-scale-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.62189 15.2072L14 24.5853L12.2927 26.2927L5.2907e-07 14L12.2927 1.7073L14 3.41461L4.62189 12.7927L28 12.7927L28 15.2072L4.62189 15.2072Z" fill="currentColor"/>
        </svg>
      </carousel-control>
      <carousel-control mode="next" class="h-scale-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5471 13.0306L14.1689 3.65254L15.8763 1.94522L28.1689 14.2379L15.8763 26.5306L14.1689 24.8233L23.5471 15.4452L0.168945 15.4452L0.168947 13.0306H23.5471Z" fill="currentColor"/>
        </svg>
      </carousel-control>
    </div>
  `;

  return {
    scripts: ["components/overflow", "components/carousel", "components/gallery"],
    styles: ["visuals", "component-overflow", "component-carousel", "component-gallery"],
    html: wrapper,
  };
};
