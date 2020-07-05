(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('bulkUpdate', {
      templateUrl: './features/bulkActions/bulkUpdate/bulkUpdate.html',
      controller: bulkUpdateCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });


  /* @ngInject */
  function bulkUpdateCtrl (
    notification, RecordService, User
  ) {
    let vm = this;

    vm.$onInit = () => {
      vm.isLoading = false;
      vm.disableSubmit = false;
      vm.callSucced = false;
      vm.creationCodes = [];
      vm.creationObject = '';
      vm.selection = {
        default_user: {},
        sender: {}
      };

      vm.deliveryUserConfig = {
        service: User,
        displayValue: 'full_name',
        placeholder: 'Seleccione un operario.',
        required: true,
        initialValue: undefined,
        onSelectItem: function (item) {
          vm.selection.default_user = item;
        }
      };

      vm.senderUserConfig = {
        service: User,
        displayValue: 'full_name',
        placeholder: 'Seleccione un remitente.',
        required: true,
        loadEveything: true,
        initialValue: undefined,
        onSelectItem: function (item) {
          vm.selection.sender = item;
        }
      };

      vm.getCreationCodeList();
    };

    vm.getCreationCodeList = function () {
      RecordService.getCreationCodeList().then(function (response) {
        vm.creationCodes = response;
      }, function (error) {
        notification.error(error.message);
      });
    };

    vm.updateRecords = () => {
      if (!vm.creationObject) {
        notification.warn('Seleccione la fecha de la carga de archivos a actualizar.');
      } else if (!_.get(vm, 'selection.default_user.id')) {
        notification.warn('Selecciona el operario que será asignado como creador de todos los ' +
          'registros por cargar.');
      } else if (vm.selection.enableSender && !_.get(vm, 'selection.sender.id')) {
        notification.warn('Selecciona el remitente que será asignado a todos los registros por cargar.');
      } else {
        vm.nroRegistros = '';
        vm.errorMsg = '';
        vm.isLoading = true;
        vm.disableSubmit = true;
        vm.callSucced = false;

        RecordService.assignRecords(
          vm.creationObject.creationCode,
          vm.selection.default_user,
          _.get(vm, 'selection.sender.id'))
        .then(function (resp) {
          notification.great(`Se actualizaron ${resp.count} registros.`);
          resetValues();
        }, function (error) {
          notification.warn(error && error.message ? error.message :
          'Error de comunicación con el servidor');
          resetValues();
        });
      }
    };

    function resetValues() {
      vm.isLoading = false;
      vm.disableSubmit = false;
      vm.creationObject = '';
      vm.getCreationCodeList();
      vm.selection.enableSender = false;
    }
  }
})();
