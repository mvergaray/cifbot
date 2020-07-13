import ProvisionsConfig from "./provisions.config";
import ProvisionsList from "./provisionsList/provisionsList.component";

/* @ngInject */
const ProvisionsModule = angular
  .module('app.provisions', [])
  .config(ProvisionsConfig)
  .component('provisionsList', ProvisionsList);

export default ProvisionsModule;