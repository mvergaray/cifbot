

(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('closeForm', {
      templateUrl: './features/close/closeForm.html',
      controller: closeFormCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });


  /* @ngInject */
  function closeFormCtrl ($location, CloseSvc, notification, ReportService, User, $window) {
    let vm = this;

    var successHandler = function (response, isExport) {
          vm.isDisabled = false;
          vm.backToList();
          notification.great('Registros cerrados correctamente.');
          let closeId = response.result.id;
          notification.warn('Se esta Generando el PDF del cierre. Por favor espere.');
          // Download PDF
          $window.open(`/publicAccess/closePdf?binnacle_id=${closeId}`, '_blank');
          // Download excel
          if (isExport) {
            ReportService.generateExcelPerBinnacle(response.result.id, 3).then(() => {
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
          if (!vm.assignedTo) return false;

          if(!vm.itemsFound) return '010';
          // Default response
          return '001';
        };

    vm.$onInit = () => {
      vm.assignedTo = {};

      vm.close = {
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
      vm.isTableVisiable = false;

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

      vm.deliveryUserConfig = {
        service: User,
        displayValue: 'full_name',
        placeholder: 'Seleccione un usuario.',
        required: true,
        initialValue: undefined,
        onSelectItem: function (item) {
          vm.assignedTo = item;
        }
      };

      vm.close = new CloseSvc();
    };

    vm.backToList = function () {
      $location.path('/');
    };

    vm.getRecords = function () {
      vm.isTableVisiable = true;
      vm.tableConfig.params.codes = angular.copy(vm.close.recordCodes);
    };

    vm.save = function (form, isExport) {
      var codeVerification = preValidation();

      vm.isDisabled = true;

      if (codeVerification == '001') {
        if (form.$valid) {

          vm.close.action_id = 3;
          vm.close.assigned_id = vm.assignedTo.id;
          vm.close.records = vm.close.recordIdsExisting;
          vm.close.$save(function (response) {
            successHandler(response, isExport);
          }, errorHandler);
        } else {
          vm.isDisabled = false;
          notification.warn('Debe llenar todos los campos obligatorios');
        }
      } else if(codeVerification == '010') {
        notification.warn('Debe asignar al menos un registro.');
      } else {
        vm.isDisabled = false;
        notification.warn('Debe llenar todos los campos obligatorios');
      }
      vm.isDisabled = false;
    };

    vm.validateTableData = function (response) {
      var codesReturned;

      vm.missingCodes = [];
      if (vm.close.recordCodes && vm.close.recordCodes.length) {
        codesReturned = response.items.map(function (a) {return a.code;});
        vm.close.recordIdsExisting = response.items.map(function (a) {return a.idrecord;});
        vm.itemsFound = codesReturned.length;

        if (vm.close.recordCodes.length != codesReturned) {
          vm.close.recordCodes.forEach(function (item) {
            if (codesReturned.indexOf(item) === -1) {
              vm.missingCodes.push(item);
            }
          });
        }
      }
    };
  }
})();