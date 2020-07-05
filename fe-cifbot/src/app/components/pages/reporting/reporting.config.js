import ReportingModule from "./reporting.module";

/* @ngInject */
const ReportingConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.reporting', {
      url: '/reportes',
      template: 'Home'
    });
};

export default ReportingConfig;