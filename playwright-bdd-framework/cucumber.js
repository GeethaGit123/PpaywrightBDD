module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["tsx/cjs"],
    require: ["support/**/*.ts", "step-definitions/**/*.ts", "hooks/**/*.ts"],
    format: ["progress", "html:reports/cucumber-report.html"],
  },
};
