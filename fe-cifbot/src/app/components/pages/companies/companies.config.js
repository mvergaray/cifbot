/* @ngInject */
const CompaniesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.companies', {
      url: '/empresas',
      template: 'Home'
    });
};

export default CompaniesConfig;