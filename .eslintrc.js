module.exports = {
        "env": {
          "browser": true,
          "commonjs": true,
          "es6": true,
          "node": true
        },
        "extends": "eslint:recommended",
        "parserOptions": {
          "ecmaFeatures": {
            "jsx": true
          },
          "ecmaVersion": 2016,
          "sourceType": "module"
        },
        "rules": {
          // "indent": [
          //   "error",
          //   "tab"
          // ],
          "semi": [
            "error",
            "always"
          ],
          "no-console": 2 ,//禁止使用console
        }
};