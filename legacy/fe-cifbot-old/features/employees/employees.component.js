
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('employees', {
      templateUrl: './features/employees/employees.html',
      controller: employeesCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });


  /* @ngInject */
  function employeesCtrl (
    $location, Employees, notification
  ) {
    let vm = this;

    vm.confirmDelete = function (employee) {
      vm.toDelete.id = employee.id;
      vm.toDelete.name = [employee.first_name, employee.last_name, employee.second_last_name].join(' ');

      angular.element('#deleteEmployeeModal').modal();
    };

    vm.deleteEmployee = function (employee_id) {
      Employees.delete({id: employee_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        notification.great('Empleado eliminado correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar empleado.';

        notification.error(message);
      });
    };

    vm.search = function () {
      vm.tableConfig.params.name = vm.searchKey;
    };

    vm.rowClicked = function (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('employees', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/empleados/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    };

    vm.$onInit = () => {
      _setHeaderConfig();

      vm.currentPath = '#' + $location.path() + '/';

      vm.searchKey = '';
      vm.toDelete = {
        id: 0,
        name: ''
      };
      vm.previousClickedId = {}

      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          templateUrl: 'features/common/templates/id.html',
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Nombre',
          templateUrl: 'features/employees/templates/nameColumn.html',
          sortKey: 'first_name'
        },
        {
          columnHeaderDisplayName: 'Fecha de Ingreso',
          displayProperty: 'f_start_date',
          sortKey: 'f_start_date'
        },
        {
          columnHeaderDisplayName: 'Tipo',
          templateUrl: 'features/employees/templates/typeColumn.html',
          sortKey: 'type'
        },
        {
          columnHeaderDisplayName: 'Estado',
          templateUrl: 'features/employees/templates/statusColumn.html',
          sortKey: 'status'
        }
      ];

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('employees', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('employees', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }


      vm.tableConfig = {
        url: 'Employees/',
        method: 'get',
        params:{
          reload: false
        },
        paginationConfig: {
          response: {
            totalItems: 'results.count',
            itemsLocation: 'results.list'
          }
        },
        state: {
          sortKey: 'id',
          sortDirection: 'ASC'
        },
        rowClass: function (item, index) {
          var rowClass = '';
          if (index % 2) {
            rowClass = 'info';
          }
          return rowClass;
        }
      };
    }

    function _setHeaderConfig () {
      vm.headerConfig = {
        title: 'Gestión de Empleados',
        goTo: '#/empleados/create',
        icon: 'add_box',
        actionLabel: 'Crear Empleado'
      };
    }

  }
})();
