import './filterPanel.scss';

(function () {
  angular
    .module('doc.features')
    .component('filterPanel', {
      templateUrl: 'features/records/filterPanel/filterPanel.html',
      controller: FilterPanelCtrl,
      controllerAs: 'vm',
      bindings: {
        searchKeys: '=',
        clear: '&',
        menuConfig: '<',
        filterParams: '<',
        permissions: '<'
      }
    });

  /* @ngInject */
  function FilterPanelCtrl (
    $mdMedia,
    $rootScope,
    FilterPanelService,
    QrcodeScannerService
  ) {
    var vm = this;

    vm.updateFilter = _updateFilter;
    vm.clearFilter = _clearFilter;
    vm.closePanel = _closePanel;
    vm.isUserDelivery = _isUserDelivery;
    vm.togglePanel = _togglePanel;
    vm.openQRScanner = _openQRScanner;

    vm.mdMediaXs = () => $mdMedia('xs');

    vm.$onInit = () => {
      vm.maxDate = new Date();

      // Default values must be formated as MM/DD/YYYY so material component understand it
      if (vm.searchKeys.startDate) {
        vm.searchKeys.start_date = moment(vm.searchKeys.startDate).format('MM/DD/YYYY');
      }

      if (vm.searchKeys.endDate) {
        vm.searchKeys.end_date = moment(vm.searchKeys.endDate).format('MM/DD/YYYY');
      }
    };

    function _clearFilter () {
      FilterPanelService.closePanel();
      vm.clear();
    }

    function _closePanel () {
      FilterPanelService.closePanel();
    }

    function _togglePanel () {
      vm.isCollapsed = !vm.isCollapsed;
    }

    function _updateFilter () {
      FilterPanelService.closePanel();
      $rootScope.$broadcast('refreshGrid');
    }

    function _openQRScanner () {
      QrcodeScannerService.openPanel();
    }

    function _isUserDelivery() {
      return vm.permissions.role_id === 4;
    }
  }
})();
