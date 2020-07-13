/* @ngInject */
const PurchasesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.purchases', {
      url: '/compras',
      template: '<purchases-list></purchases-list>',
      data: {
        pageTitle: 'Gestión de comprobantes de compras'
      }
    });

  $stateProvider
    .state('app.purchasesNew', {
      url: '/compras/nuevo',
      accessMode: 'private',
      template: '<purchases-form></purchases-form>',
      reloadOnSearch: false,
      data: {
        pageTitle: 'Comprobante de compra'
      }
    })
    .state('app.purchasesForm', {
      url: '/compras/:receiptId/editar',
      accessMode: 'private',
      template: '<purchases-form></purchases-form>',
      reloadOnSearch: false,
      data: {
        pageTitle: 'Comprobante de compra'
      }
    })
    .state('app.paymentForm', {
      url: '/compras/:receiptId/pago',
      accessMode: 'private',
      template: '<payment-form></payment-form>',
      reloadOnSearch: false,
      data: {
        pageTitle: 'Registrar Pago'
      }
    });
};

export default PurchasesConfig;