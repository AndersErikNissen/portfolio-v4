"use strict";

/**
 * Template: Index
 * 
 * Params:
 * Title {string}
 * Content {HTML}
 */

const TEMPLATES = TEMPLATES || {}; 

TEMPLATES.index = function(data) {
  return `
    <h1>${data.title}<h1>
  `;
};