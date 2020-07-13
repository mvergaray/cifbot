import ReportingConfig from "./reporting.config";

/* @ngInject */
const ReportingModule = angular
  .module('app.reporting', [])
  .config(ReportingConfig);

export default ReportingModule;