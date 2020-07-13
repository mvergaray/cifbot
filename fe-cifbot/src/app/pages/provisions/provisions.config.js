import ProvisionsModule from "./provisions.module";
import ProvideConfig from "../../config/provide.config";

/* @ngInject */
const ProvisionsConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.provisions', {
      url: '/provisiones',
      template: '<provisions-list></provisions-list>',
      data: {
        pageTitle: 'Gestión de provisiones'
      }
    })
    .state('app.provisions.form', {
      url: '/provisiones/:receiptId',
      template: '<provision-form></provision-form>',
      data: {
        pageTitle: 'Provisiones'
      }
    });
};

export default ProvisionsConfig;