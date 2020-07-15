/* @ngInject */
const SalesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.sales', {
      url: '/ventas',
      accessMode: 'private',
      template: '<sales-list></sales-list>',
      reloadOnSearch: false,
      title: 'Gestión de comprobantes de ventas'
    });

  $stateProvider
    .state('app.salesNew', {
      url: '/ventas/nuevo',
      accessMode: 'private',
      template: '<sales-form></sales-form>',
      reloadOnSearch: false,
      title: 'Comprobante de venta'
    })
    .state('app.salesEdit', {
      url: '/ventas/:receiptId/editar',
      accessMode: 'private',
      template: '<sales-form></sales-form>',
      reloadOnSearch: false,
      title: 'Comprobante de venta'
    })
    .state('app.incomeNew', {
      url: '/ventas/:receiptId/pago',
      accessMode: 'private',
      template: '<income-form></income-form>',
      reloadOnSearch: false,
      title: 'Registrar Pago'
    })
    .state('app.incomeEdit', {
      url: '/ventas/:receiptId/pago',
      accessMode: 'private',
      template: '<income-form></income-form>',
      reloadOnSearch: false,
      title: 'Registrar Cobro'
    });
};

export default SalesConfig;