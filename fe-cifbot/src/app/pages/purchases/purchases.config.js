/* @ngInject */
const PurchasesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.purchases', {
      url: '/compras',
      template: '<purchases-list></purchases-list>',
      title: 'Gestión de comprobantes de compras'
    });

  $stateProvider
    .state('app.purchasesNew', {
      url: '/compras/nuevo',
      accessMode: 'private',
      template: '<purchases-form></purchases-form>',
      reloadOnSearch: false,
      title: 'Comprobante de compra'
    })
    .state('app.purchasesEdit', {
      url: '/compras/:receiptId/editar',
      accessMode: 'private',
      template: '<purchases-form></purchases-form>',
      reloadOnSearch: false,
      title: 'Comprobante de compra'
    })
    .state('app.outcomeNew', {
      url: '/compras/:receiptId/pago',
      accessMode: 'private',
      template: '<outcome-form></outcome-form>',
      reloadOnSearch: false,
      title: 'Registrar Pago'
    });
};

export default PurchasesConfig;