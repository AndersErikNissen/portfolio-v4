"use strict";

/**
 * Template: Header
 * Type: Static
 */

console.log(
  "%cTemplate Header: LOADED",
  "background-color: grey; color: white; padding: 4px 8px 3px; border-radius: 2px;"
);

APP_TEMPLATES.header = () => {
  return {
    scripts: ["components/clock"],
    styles: ["header", "component-clock"],
    markup: `
      <header id="Header">
        <div class="header-main">
          <div class="header-left">
            <button id="Menu-btn">
              ${SNIPPETS.icon("menu").outerHTML}

              <span class="menu-btn-label">Menu</span>
            </button>
          </div>
          
          <div class="header-middle">
            ${SNIPPETS.icon("logo").outerHTML}
          </div>

          <div class="header-right">
            <digital-clock></digital-clock>

            <div class="header-btns">
              <button class="header-btn header-btn-call">
                ${
                  SNIPPETS.heading(
                    "Giv et kald",
                    "span",
                    ["header-btn-label", "fs-small"],
                    [],
                    false
                  ).outerHTML
                }
                ${SNIPPETS.icon("phone").outerHTML}
              </button>
              <button class="header-btn">
                ${SNIPPETS.icon("mail").outerHTML}
              </button>
            </div>
          </div>
        </div>
      </header>
    `,
  };
};
