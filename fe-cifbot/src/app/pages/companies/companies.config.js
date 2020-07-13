/* @ngInject */
const CompaniesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.companies', {
      url: '/empresas',
      template: '<companies-list></companies-list>',
      data: {
        pageTitle: 'Gestión de Empresas'
      }
    })
    .state('app.companies.form', {
      url: '/empresas/:companyId',
      template: '<company-form></company-form>',
      data: {
        pageTitle: 'Empresa'
      }
    });
};

export default CompaniesConfig;