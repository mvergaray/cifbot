const SalesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.sales', {
      url: '/ventas',
      accessMode: 'private',
      template: '<sales-list></sales-list>',
      reloadOnSearch: false,
      data: {
        pageTitle: 'Gestión de comprobantes de ventas'
      }
    });

  $stateProvider
    .state('app.salesNew', {
      url: '/ventas/nuevo',
      accessMode: 'private',
      template: '<sales-form></sales-form>',
      reloadOnSearch: false,
      data: {
        pageTitle: 'Comprobante de venta'
      }
    })
    .state('app.salesForm', {
      url: '/ventas/:receiptId/editar',
      accessMode: 'private',
      template: '<sales-form></sales-form>',
      reloadOnSearch: false,
      data: {
        pageTitle: 'Comprobante de venta'
      }
    });
};

export default SalesConfig;