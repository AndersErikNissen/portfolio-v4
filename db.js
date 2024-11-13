class DataBase {
  dataBase = [
    {
      name: "Forside",
      path: "/",
      template: "index",
    },
    {
      name: "Projekter",
      path: "/projects",
      template: "projects",
    },
    {
      name: "Visuelle projekter",
      path: "/visuals",
      template: "visuals",
    },
    {
      name: "404",
      template: "404",
      default_template: true,
    },
  ];

  get data() {
    // sessionStorage.clear(); // PLSFIX - DEV

    const STORAGE = sessionStorage.getItem("aenders_dk_db");

    if (STORAGE) {
      return JSON.parse(STORAGE);
    }

    return this.dataBase;
  }

  trimObject(obj) {
    obj.title = obj.title.rendered;
    obj.content = obj.content.rendered;
    obj.type = obj.type.replace("portfolio_", "");
    Object.assign(obj, obj.acf);
    if (obj.type !== "visual") {
      obj.path = "/" + obj.type + "s/" + obj.slug;
    }

    delete obj.acf;
    delete obj.id;
    delete obj.class_list;
    delete obj.date;
    delete obj.date_gmt;
    delete obj.guid;
    delete obj.link;
    delete obj.modified;
    delete obj.modified_gmt;
    delete obj.status;
    delete obj._links;
    delete obj.template;

    return obj;
  }

  async fetchDataByType(type) {
    const RESPONSE = await fetch(
      "https://api.aenders.dk/wp-json/wp/v2/" + type + "?acf_format=standard"
    );
    const JSON = await RESPONSE.json();
    const ARRAY = JSON.map((obj) => {
      const TRIMMED = this.trimObject(obj);

      switch (obj.type) {
        case "page":
          return this.upgradePage(TRIMMED);
        case "project":
          return this.upgradeProject(TRIMMED);
        case "visual":
          return this.upgradeVisual(TRIMMED);
      }
    });
    this.dataBase = this.dataBase.concat(ARRAY);
  }

  async fetchData() {
    await this.fetchDataByType("portfolio_pages");
    await this.fetchDataByType("portfolio_projects");
    await this.fetchDataByType("portfolio_visuals");

    sessionStorage.setItem("aenders_dk_db", JSON.stringify(this.data));
  }

  uniqueNumbers(obj) {
    let keys = Object.keys(obj).filter((key) => key.match(/[A-z]*-\d/));
    let nos = keys.map((key) => key.split("-")[1].slice(0, 2));
    return nos.filter((nr, index, array) => array.indexOf(nr) === index);
  }

  createStage(nr, obj) {
    const STAGE = {};

    Object.keys(obj).forEach((key) => {
      let split = key.split("-");

      if (split[1] === nr) {
        if (obj[key]) {
          // Use an array, if the key already exist
          if (STAGE[split[0]]) {
            if (!Array.isArray(STAGE[split[0]])) {
              STAGE[split[0]] = [STAGE[split[0]]];
            }

            STAGE[split[0]].push(obj[key]);
          } else {
            STAGE[split[0]] = obj[key];
          }
        }

        delete obj[key];
      }
    });

    return STAGE;
  }

  upgradePage(obj) {
    obj.stages = [];

    this.uniqueNumbers(obj).forEach((unique) =>
      obj.stages.push(this.createStage(unique, obj))
    );

    return obj;
  }

  upgradeProject(obj) {
    obj.stages = [];

    this.uniqueNumbers(obj).forEach((unique) =>
      obj.stages.push(this.createStage(unique, obj))
    );

    return obj;
  }

  upgradeVisual(obj) {
    obj.gallery = [];

    Object.keys(obj).forEach((key) => {
      if (key.includes("image-")) {
        if (obj[key]) {
          obj.gallery.push(obj[key]);
        }

        delete obj[key];
      }
    });

    return obj;
  }
}
