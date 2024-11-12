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
  return {
    scripts: [{ name: "overflow", path: "components" }],
    styles: ["page"],
    markup: `
    `,
  };
};
