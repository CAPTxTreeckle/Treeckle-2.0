module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    project: "./tsconfig.json",
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-param-reassign": "off",
    "react/no-children-prop": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "react/no-unescaped-entities": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "no-underscore-dangle": "off",
    "no-plusplus": "off",
    "default-case": "off",
    "global-require": "off",
    "no-console": "off",
    "consistent-return": "off",
    "import/no-cycle": "off",
  },
};
