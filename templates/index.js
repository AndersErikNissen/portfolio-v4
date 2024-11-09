"use strict";

/**
 * Template: Index
 * Type: Static
 */

console.log(
  "%cTemplate Index: LOADED",
  "background-color: white; color: black; padding: 2px 4px;"
);

APP_TEMPLATES.index = () => {
  return {
    scripts: [],
    styles: [],
    markup: `
      <h1>INDEX</h1>
    `,
  };
};
