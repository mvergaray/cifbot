/* @ngInject */
const AccountsConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.accounts', {
      url: '/cuentas',
      template: 'Home'
    });
};

export default AccountsConfig;