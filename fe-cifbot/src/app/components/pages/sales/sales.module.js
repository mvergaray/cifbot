import SalesConfig from "./sales.config";

/* @ngInject */
const SalesModule = angular
  .module('app.sales', [])
  .config(SalesConfig);

export default SalesModule;