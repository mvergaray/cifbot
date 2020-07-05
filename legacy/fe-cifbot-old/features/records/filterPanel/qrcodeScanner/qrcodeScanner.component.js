(() => {

  angular
    .module('doc.features')
    .component('qrcodeScanner', {
      templateUrl: 'features/records/filterPanel/qrcodeScanner/qrcodeScanner.html',
      controller: qrcodeScannerCtrl,
      controllerAs: 'vm',
      bindings: {
      }
    });

  /* @ngInject */
  function qrcodeScannerCtrl (
    _,
    $rootScope,
    $mdMedia,
    QrcodeScannerService
  ) {
    var vm = this;

    vm.mdMediaXs = $mdMedia('xs');
    vm.mdMediaGtXs = $mdMedia('gt-xs');
    vm.closePanel = _closePanel;
    vm.onScanComplete = _onScanComplete;

    vm.$onInit = () => {
    };

    vm.$onDestroy = () => {

    };

    function _closePanel () {
      QrcodeScannerService.closePanel();
    }

    function _onScanComplete (scnannedCode) {
      $rootScope.$broadcast('onCodeScanned', scnannedCode);
      QrcodeScannerService.closePanel();
    };
  }
})();
