
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('createPanelHeader', {
      templateUrl: './features/common/create-panel-header/createPanelHeader.html',
      controller: createPanelHeaderCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<'
      }
    });

  function createPanelHeaderCtrl (

  ) {

  }
})();
