import ProvisionsConfig from "./provisions.config";
import ProvisionsList from "./provisionsList/provisionsList.component";
import ProvisionForm from "./provisionForm/provisionForm.component";

/* @ngInject */
const ProvisionsModule = angular
  .module('app.provisions', [])
  .config(ProvisionsConfig)
  .component('provisionsList', ProvisionsList)
  .component('provisionForm', ProvisionForm)
  ;

export default ProvisionsModule;