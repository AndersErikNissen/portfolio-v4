"use strict";

/**
 * Template: 404
 * Type: Static
 */

console.log(
  "%cTemplate 404: LOADED",
  "background-color: red; color: white; padding: 2px 4px;"
);

APP_TEMPLATES.template_404 = (data) => {
  return `
    <h1>404<h1>
    <p>${location.href} kunne ikke findes. Prøv igen!</p>
  `;
};
