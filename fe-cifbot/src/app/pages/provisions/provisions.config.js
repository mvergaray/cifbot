/* @ngInject */
const ProvisionsConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.provisions', {
      url: '/provisiones',
      accessMode: 'private',
      template: '<provisions-list></provisions-list>',
      reloadOnSearch: false,
      title: 'Gestión de provisiones'
    });

  $stateProvider
    .state('app.provisionsNew', {
      url: '/provisiones/nuevo',
      accessMode: 'private',
      template: '<provision-form></provision-form>',
      reloadOnSearch: false,
      title: 'Provisión'
    })
    .state('app.provisionsEdit', {
      url: '/provisiones/:receiptId/editar',
      accessMode: 'private',
      template: '<provision-form></provision-form>',
      reloadOnSearch: false,
      title: 'Provisión'
    });
};

export default ProvisionsConfig;