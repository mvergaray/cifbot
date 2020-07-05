import './_records.scss';

(() => {
  angular
    .module('doc.features')
    .component('records', {
      templateUrl: 'features/records/records.component.html',
      controller: RecordsCtrl,
      controllerAs: 'vm',
      bindings: {
        permissions: '<'
      }
    });

  function RecordsCtrl (
    $scope,
    $location,
    $mdMedia,
    DocumentSvc,
    notification,
    RecordService,
    Toast
  ) {
    let vm = this;

    vm.deleteRecord = _deleteRecord;
    vm.confirmDelete = _confirmDelete;
    vm.clearFilters = _clearFilters;
    vm.isUserDelivery = _isUserDelivery;

    vm.mdMediaXs = () => $mdMedia('xs');
    vm.showGrid = _showGrid;

    vm.$onInit = () => {
      vm.menuConfig = {
        isTicketLoading: false,
        isCertificateLoading: false,
        isExcelLoading: false,
        isFullLoading: false,
        selectedRecords: []
      };

      vm.toDelete = {
        id: 0,
        code: ''
      };

      vm.filterParams = _getFilters();
    };

    $scope.$on('onCodeScanned', (evt, code) => {
      _openRecordFromCode(code);
    });

    function _clearFilters () {
      vm.filterParams.code = '';
      vm.filterParams.binnacle_id = '';
      vm.filterParams.document = '';
      vm.filterParams.destination = '';
      vm.filterParams.sender = '';
      vm.filterParams.client_id = '';
      vm.filterParams.created_by = '';
      vm.filterParams.start_date = null;
      vm.filterParams.startDate = null;
      vm.filterParams.end_date = null;
      vm.filterParams.endDate = null;
      localStorage.removeItem('se-records-filters');
      $scope.$broadcast('refreshGrid');
    }

    function _confirmDelete (record) {
      vm.toDelete.id = record.idrecord;
      vm.toDelete.code = record.code;

      angular.element('#deleteRecordModal').modal();
    }

    function _deleteRecord (record_id) {
      DocumentSvc.delete({id: record_id}, () => {
        $scope.$broadcast('refreshGrid');
        notification.great('Registro eliminado correctamente.');
      }, (error) => {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar registro.';

        notification.error(message);
      });
    }

    function _getFilters () {
      let result = JSON.parse(localStorage.getItem('se-records-filters')) || {
        client_id: '',
        created_by: '',
        code: '',
        document: '',
        destination: '',
        sender: ''
      };

      return result;
    }

    function _showGrid () {
      return vm.permissions.isAllowed('records', '_view');
    }

    function _isUserDelivery() {
      return vm.permissions.role_id === 4;
    }

    function _openRecordFromCode (code) {
      if (isNaN(code)) {
        Toast.show('El código es inválido.', '');
      } else {
        Toast.show('Código identificado: ' + code, '');

        vm.filterParams.code = code;
        RecordService.readAll({code: code})
          .then(response => {
            var recordId;

            if (response.list.length === 1) {
              recordId = _.first(response.list).idrecord;

              $location.path('/document/' + recordId);
            } else {
              $scope.$broadcast('refreshGridAdnOpen', code);
            }
          });
      }
    }

  }
})();
