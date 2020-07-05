
(() => {
  angular
    .module('doc.features')
    .component('bulkImport', {
      templateUrl: './features/bulkActions/bulkImport/bulkImport.html',
      controller: bulkImportCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function bulkImportCtrl (
    $scope, Client, notification, ReportService, Upload, User
  ) {
    let vm = this;

    vm.$onInit = () => {
      vm.customer = {};
      vm.isLoading = false;
      vm.disableSave = false;
      vm.callSucced = false;
      vm.selection = {
        enableSender: false,
        default_user: {},
        sender: {},
        useCode: false
      };

      vm.users = User.get({client_id: vm.currentUser.clients, limit: 10}, function () {
        if (vm.users.results.list.length) {
          vm.users.results.list.forEach(function (user) {
            user.full_name = user.name + ' ' + (user.last_name ? user.last_name : '');
          });

          vm.selection.default_user = {};
        }
      });

      vm.deliveryUserConfig = {
        service: User,
        displayValue: 'full_name',
        placeholder: 'Seleccione un operario.',
        required: true,
        loadEveything: true,
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
    };

    vm.saveData = function (file) {
      let default_user;
      if (!vm.customer || !Object.keys(vm.customer).length) {
        notification.warn('Seleccione el archivo a cargar. Se recomienda cargar los ' +
          'datos a partir de la plantilla brindada.');
      } else if (!_.get(vm, 'selection.default_user.id')) {
        notification.warn('Selecciona el operario que será asignado como creador de todos los ' +
          'registros por cargar.');
      } else if (vm.selection.enableSender && !_.get(vm, 'selection.sender.id')) {
        notification.warn('Selecciona el remitente que será asignado a todos los registros por cargar.');
      } else {
        default_user = vm.selection.default_user;
        vm.nroRegistros = '';
        vm.errorMsg = '';
        vm.isLoading = true;
        vm.disableSave = true;

        Upload.upload({
          url: 'records/upload',
          data: {
            uploadFile: file,
            client_id: default_user.locate_client,
            office_id: default_user.locate_office,
            area_id: default_user.locate_area,
            user_id: default_user.id,
            client_id: vm.selection.default_user.client_id,
            bulk_sender: vm.selection.enableSender ? 1 : 0,
            sender_id: _.get(vm, 'selection.sender.id'),
            use_code: vm.selection.useCode ? 1 : 0
          }
        }).then(function (resp) {
          notification.great(`Se crearon ${resp.data.count} registros.`);
          resetValues();
        }, function (error) {
          notification.warn(error && error.message ? error.message :
            'Error de comunicación con el servidor');
          resetValues();
        });
      }
    };

    vm.downloadTemplate = () => {
      vm.isExcelLoading = true;
      ReportService.downloadTemplate().then(() => {
        $scope.$apply(() => {
          vm.isExcelLoading = false;
        });
      }, () => {
        $scope.$apply(() => {
          vm.isExcelLoading = false;
        });
        notification.error('Error al descargar plantilla.');
      });
    };

    vm.disableSubmit = function () {
      return !!(vm.disableSave &&
        vm.selection.default_user.id);
    };

    function resetValues() {
      vm.customer = {};
      vm.isLoading = false;
      vm.disableSave = false;
      angular.element('#registrosForm')[0].reset();
      vm.selection.enableSender = false;
      vm.selection.useCode = false;
    }
  }
})();
