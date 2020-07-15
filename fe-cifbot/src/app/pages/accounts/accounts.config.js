/* @ngInject */
const AccountsConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.accounts', {
      url: '/cuentas',
      template: '<accounts-list></accounts-list>',
      title: 'Gestión de Cuentas Contables'
    });
};

export default AccountsConfig;