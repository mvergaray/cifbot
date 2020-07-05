import ProvisionsConfig from "./provisions.config";

/* @ngInject */
const ProvisionsModule = angular
  .module('app.provisions', [])
  .config(ProvisionsConfig);

export default ProvisionsModule;