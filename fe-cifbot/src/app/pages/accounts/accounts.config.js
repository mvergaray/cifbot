/* @ngInject */
const AccountsConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.accounts', {
      url: '/cuentas',
      template: '<accounts-list></accounts-list>',
      data: {
        pageTitle: 'Gestión de Cuentas Contables'
      }
    });
};

export default AccountsConfig;