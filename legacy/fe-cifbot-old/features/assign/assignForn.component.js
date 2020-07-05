

(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('assignForm', {
      templateUrl: './features/assign/assignForm.html',
      controller: assignFormCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });


  /* @ngInject */
  function assignFormCtrl (
    $location, $window, AssignSvc, Employees, notification,
      Offices, ReportService, ShippingType
  ) {
    let vm = this;

    var successHandler = function (response, isExport) {
          vm.backToList();
          vm.isDisabled = false;
          notification.great('Registros asignados correctamente.');
          notification.warn('Se esta Generando el PDF de la asignación. Por favor espere.');
          // Download PDF
          $window.open(`/publicAccess/assignPdfDownload?binnacle_id=${response.result.id}`, '_blank');
          // Download excel
          if (isExport) {
            ReportService.generateExcelPerBinnacle(response.result.id, 1).then(() => {
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
          var result = true;

          if (vm.assignedTo.type != 3 && !vm.assignedTo.person) {
            notification.warn('Debe seleccionar a quién asignar los regristros.');
            result = false;
          }

          if (!vm.itemsFound) {
            notification.warn('Debe asignar al menos un registro.');
            result = false;
          }

          return result;
        };

    vm.$onInit = () => {
      vm.assignedList = [];
      vm.shippingTypes = ShippingType.query();
      vm.assignedTo = {
        type: '1'
      };
      vm.assignment = {
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
          columnHeaderDisplayName: '',
          templateUrl: 'features/assign/codeBar.html',
          width: '15%'
        },
        {
          columnHeaderDisplayName: 'Nro. Doc',
          templateUrl: 'features/records/templates/documentColumn.html',
          width: '30%'
        },
        {
          columnHeaderDisplayName: 'Destino',
          templateUrl: 'features/records/templates/destinationColumn.html',
          width: '25%'
        },
        {
          columnHeaderDisplayName: 'Remitente',
          displayProperty: 'sender',
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

      vm.assign = new AssignSvc();

      vm.refreshAssignedList();
    }


    vm.backToList = function () {
      $location.path('/');
    };

    vm.refreshAssignedList = function () {
      vm.assignedTo = {type: vm.assignedTo.type};
      switch (+vm.assignedTo.type) {
        case 2:
          Offices.query((response) => {
            var data = response.results.list;
            data.forEach((item) => item.displayText = `${item.name}`);
            vm.assignedList = data;
          });
          break;
        case 3:
          vm.assignedTo.person = {};
          vm.assignedList = [];
          vm.assignedTo.fullName = `${vm.currentUser.name} ${vm.currentUser.last_name}`;
          break;
        default:
          Employees.query((response) => {
            var data = response.results.list;
            data.forEach((item) => item.displayText = `${item.first_name}
              ${item.last_name} ${item.second_last_name}`);
            vm.assignedList = data;
          });
          break;
      }
      vm.assignedTo.origin = vm.currentUser.origin;
    };

    vm.getAssignee = function () {
      switch (+vm.assignedTo.type) {
        case 2:
          vm.assignedTo.fullName = vm.assignedTo.person.name;
          vm.assignedTo.contact = vm.assignedTo.person.contact;
          vm.assignedTo.address = vm.assignedTo.person.address;
          break;
        case 3:
          vm.assignedList = [];
          vm.assignedTo.fullName = `${vm.currentUser.name} ${vm.currentUser.last_name}`;
          break;
        default:
          vm.assignedTo.fullName = `${vm.assignedTo.person.first_name}
            ${vm.assignedTo.person.last_name} ${vm.assignedTo.person.second_last_name}`;
          vm.assignedTo.address = vm.assignedTo.person.address;
          break;
      }

      vm.assignedTo.origin = vm.currentUser.origin;
    };

    vm.getRecords = function () {
      vm.isTableVisiable = true;
      vm.tableConfig.params.codes = angular.copy(vm.assignment.recordCodes);
    };

    vm.drawCodeBar = function (code) {
      $('#bcTarget-' + code).barcode(code, 'code39', { output: 'css' });
    };

    // TODO: generate pdf when saving
    vm.save = function (form, isExport) {
      vm.isDisabled = true;
      if (preValidation()) {
        if (form.$valid) {
          vm.assign.records = vm.assignment.recordIdsExisting;
          vm.assign.assignment_type = vm.assignedTo.type;
          vm.assign.assigned_id = vm.assignedTo.person.id;
          vm.assign.service_order = vm.assignment.service_order;
          vm.assign.shipping_type = vm.assignment.shipping_type;
          vm.assign.$save(function (response) {
            successHandler(response, isExport);
          }, errorHandler);

        } else {
          vm.isDisabled = false;
          notification.warn('Debe llenar todos los campos obligatorios');
        }
      }
      vm.isDisabled = false;
    };

    vm.validateTableData = function (response) {
      var codesReturned;

      vm.missingCodes = [];
      if (vm.assignment.recordCodes && vm.assignment.recordCodes.length) {
        codesReturned = response.items.map(function (a) {return a.code;});
        vm.assignment.recordIdsExisting = response.items.map(function (a) {return a.idrecord;});
        vm.itemsFound = codesReturned.length;

        if (vm.assignment.recordCodes.length != codesReturned) {
          vm.assignment.recordCodes.forEach(function (item) {
            if (codesReturned.indexOf(item) === -1) {
              vm.missingCodes.push(item);
            }
          });
        }
      }
    };
  }
})();
