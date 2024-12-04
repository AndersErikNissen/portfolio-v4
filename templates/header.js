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
    scripts: ["components/clock", "components/copy"],
    styles: ["header", "component-clock", "component-copy"],
    markup: `
      <header id="Header">
        <div class="header-main">
          <div class="header-left">
            <button id="Menu-btn">
              ${SNIPPETS.icon("menu").outerHTML}

              <span class="menu-btn-label">Menu</span>
            </button>
          </div>
          
          <a href="./" class="header-middle">
            ${SNIPPETS.icon("logo").outerHTML}
          </a>

          <div class="header-right">
            <digital-clock></digital-clock>

            <div class="header-btns">
              <copy-clipboard content-type="phone" class="header-btn header-btn-call h-scale-icon">
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
              </copy-clipboard>
              <copy-clipboard class="header-btn h-scale-icon">
                ${SNIPPETS.icon("mail").outerHTML}
              </copy-clipboard>
            </div>
          </div>
        </div>
      </header>
      <copy-toaster></copy-toaster>
    `,
  };
};
