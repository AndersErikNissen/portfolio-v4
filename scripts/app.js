class TheApp extends HTMLElement {
  constructor() {
    super();

    /* Data base */
    this.db = {};
  }

  trimFetchObject(obj) {
    const TRIMMED_OBJECT = obj;
    const UNWANTED_KEYS = [
      "acf",
      "id",
      "class_list",
      "date",
      "date_gmt",
      "guid",
      "link",
      "modified",
      "modified_gmt",
      "status",
      "template",
      "_links",
    ];

    /* Plugin: Advanced Custom Fields - Data */
    const ACF = obj.acf;

    TRIMMED_OBJECT.title = TRIMMED_OBJECT.title.rendered;
    TRIMMED_OBJECT.content = TRIMMED_OBJECT.content.rendered;
    Object.assign(TRIMMED_OBJECT, ACF);
    UNWANTED_KEYS.forEach((key) => delete TRIMMED_OBJECT[key]);

    return TRIMMED_OBJECT;
  }

  async fetchDataByType(type) {
    const KEY = type.replace("portfolio_", "");
    const RESPONSE = await fetch(
      "https://api.aenders.dk/wp-json/wp/v2/" + type
    );
    const JSON = await RESPONSE.json();
    const VALUE = JSON.map((obj) => this.trimFetchObject(obj));

    this.db[KEY] = VALUE;
  }

  async fetchDatabase() {
    const SESSION_DB = sessionStorage.getItem("aenders_dk_db");
    if (SESSION_DB) {
      this.db = JSON.parse(SESSION_DB);
    }

    if (!SESSION_DB) {
      await this.fetchDataByType("portfolio_pages");
      await this.fetchDataByType("portfolio_projects");
      await this.fetchDataByType("portfolio_visuals");

      sessionStorage.setItem("aenders_dk_db", JSON.stringify(this.db));
    }
  }

  async connectedCallback() {
    await this.fetchDatabase();
  }
}

customElements.define("the-app", TheApp);
