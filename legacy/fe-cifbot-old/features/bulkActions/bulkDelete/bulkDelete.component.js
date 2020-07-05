(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('bulkDelete', {
      templateUrl: './features/bulkActions/bulkDelete/bulkDelete.html',
      controller: bulkDeleteCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  function bulkDeleteCtrl (
    notification, RecordService
  ) {
    let vm = this;

    vm.$onInit = () => {
      vm.isLoading = false;
      vm.disableSubmit = false;
      vm.callSucced = false;
      vm.creationCodes = [];
      vm.creationObject = '';

      vm.getCreationCodeList();
    }

    function resetValues() {
      vm.isLoading = false;
      vm.disableSubmit = false;
      vm.creationObject = '';
      vm.getCreationCodeList();
    }

    vm.getCreationCodeList = function () {
      RecordService.getCreationCodeList().then(function (response) {
        vm.creationCodes = response;
      }, function (error) {
        notification.error(error.message);
      });
    };

    vm.deleteRecords = function () {
      if (vm.creationObject){
        vm.nroRegistros = '';
        vm.errorMsg = '';
        vm.isLoading = true;
        vm.disableSubmit = true;
        vm.callSucced = false;

        RecordService.deleteRecords(vm.creationObject.creationCode).then(function (response) {
          vm.nroRegistros = response.count;
          vm.callSucced = true;
          resetValues();
        }, function (error) {
          vm.errorMsg = error && error.message ? error.message : 'Error de comunicación con el servidor';
          resetValues();
        });
      }
    };

  }
})();
