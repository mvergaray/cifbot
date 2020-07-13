module.exports = {
    "rules": {
        "semi": [2, "always"],
        "no-use-before-define": 0,
        "spaced-comment": 1,
        "one-var": 0,
        "no-undef": 1,
        "no-undefined": 1,
    },
    "env": {
      "jasmine": true,
      "browser": 1,
      "es6": true
    },
    "globals": {
      "angular": true,
      "jQuery": true
    },
    "parserOptions": {
      "sourceType": "module",
  }
};
