import ProvisionsModule from "./provisions.module";
import ProvideConfig from "../../../config/provide.config";

/* @ngInject */
const ProvisionsConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.provisions', {
      url: '/provisiones',
      template: 'Home'
    });
};

export default ProvisionsConfig;