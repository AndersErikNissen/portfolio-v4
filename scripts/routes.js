const ROUTES = [
  {
    path: "/",
    name: "Forside",
    template: "index",
    // src: "./templates/index.js", --- vi har allerede navnet, og ved at templaten kommer fra samme mappe, lige meget hvad
  },
];

/**
 * ROUTE OBJECT
 * pathname: /projects/"slug"
 * template: project
 *  * first time on a project?
 *  * * yes: load template script
 *  * Insert data
 *  * Print markup
 */