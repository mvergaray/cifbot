/* @ngInject */
const PurchasesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.purchases', {
      url: '/compras',
      template: 'Home'
    });
};

export default PurchasesConfig;