module.exports = {
  root: true,
  env: { es6: true, browser: true, node: true },
  extends: ["plugin:@typescript-eslint/recommended"],
  ignorePatterns: [".eslintrc"],
  parser: "@typescript-eslint/parser",
  rules: {
    // variable
    "no-var": "warn",
    "prefer-const": "warn",
    "one-var": ["warn", "never"],

    // array & object
    "no-array-constructor": "warn",
    "no-object-constructor": "warn",
    "object-shorthand": "warn",
    "prefer-destructuring": ["warn", { object: true, array: true }],

    // arrow function
    "prefer-arrow-callback": "warn",
    "arrow-body-style": ["warn", "as-needed"],

    // code style
    camelcase: "warn",
    eqeqeq: "warn",
    "no-nested-ternary": "warn",
    curly: "warn",
    "prefer-template": "warn",
    "no-async-promise-executor": "warn",
  },
};
