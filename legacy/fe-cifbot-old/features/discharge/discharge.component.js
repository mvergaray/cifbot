

(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('dischargeForm', {
      templateUrl: './features/discharge/discharge.html',
      controller: dischargeFormCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function dischargeFormCtrl (
    $location, $window, DischargeSvc, notification, ReportService
  ) {
    let vm = this;
    var successHandler = function (response, isExport) {
          vm.isDisabled = false;
          vm.backToList();
          notification.great('Registros descargados correctamente');
          let dischargeId = response.result.id;
          notification.warn('Se esta Generando el PDF de la descarga. Por favor espere.');
          // Download PDF
          $window.open(`/publicAccess/closePdf?binnacle_id=${dischargeId}`, '_blank');
          // Download excel
          if (isExport) {
            ReportService.generateExcelPerBinnacle(response.result.id, 2).then(() => {
              notification.great('Registros exportados correctamente.');
            }, () => {
              notification.error('Error al exportar registros.');
            });
          }
        },
        errorHandler = function (err) {
          vm.isDisabled = false;
          notification.error(err.data.message);
        },
        preValidation = function () {
          if (!vm.itemsFound) return '010';
          // Default response
          return '001';
        };

    vm.$onInit = () => {
      vm.backToList = function () {
        $location.path('/');
      };

      vm.discharge = {
        recordCodes: [],
        recordIdsExisting: []
      };


      vm.colDef = [
        {
          columnHeaderDisplayName: '#',
          displayProperty: 'idx',
          width: '5%'
        },

        {
          columnHeaderDisplayName: 'Nro. Doc',
          templateUrl: 'features/records/templates/documentColumn.html',
          width: '30%'
        },
        {
          columnHeaderDisplayName: 'Destino',
          displayProperty: 'destination',
          width: '25%'
        }
      ];
      vm.isTableVisible = false;

      vm.tableConfig = {
        url: 'Document/list-short',
        method: 'get',
        params:{
          codes: '',
          reload: false
        },
        paginationConfig: {
          response: {
            totalItems: 'results.count',
            itemsLocation: 'results.list'
          }
        },
        state: {
          sortKey: 'idrecord',
          sortDirection: 'DEC'
        }
      };

      vm.discharge = new DischargeSvc();
    };
    
    vm.getRecords = function () {
      vm.isTableVisible = true;
      vm.tableConfig.params.codes = angular.copy(vm.discharge.recordCodes);
    };

    vm.save = function (form, isExport) {
      var codeVerification = preValidation();

      vm.isDisabled = true;

      if (codeVerification == '001') {
        if (form.$valid) {
          vm.discharge.action_id = 2;
          vm.discharge.records = vm.discharge.recordIdsExisting;
          vm.discharge.discharge_date = moment(vm.discharge.discharge_date, 'DD/mm/YYYY')
            .format('YYYY-mm-DD');
          vm.discharge.$save(function (response) {
            successHandler(response, isExport);
          }, errorHandler);
        } else {
          vm.isDisabled = false;
          notification.warn('Debe llenar todos los campos obligatorios');
        }
      } else if (codeVerification == '010') {
        notification.warn('Debe asignar al menos un registro.');
      }
      vm.isDisabled = false;
    };

    vm.validateTableData = function (response) {
      var codesReturned;

      vm.missingCodes = [];
      if (vm.discharge.recordCodes && vm.discharge.recordCodes.length) {
        codesReturned = response.items.map(function (a) {return a.code;});
        vm.discharge.recordIdsExisting = response.items.map(function (a) {return a.idrecord;});
        vm.itemsFound = codesReturned.length;

        if (vm.discharge.recordCodes.length != codesReturned) {
          vm.discharge.recordCodes.forEach(function (item) {
            if (codesReturned.indexOf(item) === -1) {
              vm.missingCodes.push(item);
            }
          });
        }
      }
    };
  }
})();
