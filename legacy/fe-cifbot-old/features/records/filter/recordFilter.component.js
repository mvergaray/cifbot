import './recordFilter.scss';

(function () {
  'use strict';

  angular
    .module('doc.features')
    .component('recordFilter', {
      templateUrl: 'features/records/filter/recordFilter.html',
      controller: RecordFilterCtrl,
      controllerAs: 'vm',
      bindings: {
        searchKeys: '=',
        clear: '&'
      }
    });

  /* @ngInject */
  function RecordFilterCtrl (
    FilterPanelService
  ) {
    var vm = this;

    function _expandFilter () {
      FilterPanelService.openPanel(vm.searchKeys, vm.clear);
    }

    vm.expandFilter = _expandFilter;
  }
})();
