
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('offices', {
      templateUrl: './features/offices/offices.html',
      controller: officesCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function officesCtrl (
    $location, CurrentUser, Offices, notification
  ) {
    let vm = this;

    vm.currentUser = CurrentUser.get();

    vm.confirmDelete = function (office) {
      vm.toDelete.id = office.id;
      vm.toDelete.name = office.name;

      angular.element('#deleteOfficeModal').modal();
    };

    vm.deleteOffice = function (office_id) {
      Offices.delete({id: office_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        notification.great('Oficina eliminada correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar oficina.';

        notification.error(message);
      });
    };

    vm.search = function () {
      vm.tableConfig.params.name = vm.searchKey;
    };

    vm.$onInit = () => {
      vm.currentPath = '#' + $location.path() + '/';

      vm.headerConfig = {
        title: 'Gestión de Oficinas',
        goTo: '#/oficinas/create',
        icon: 'add_box',
        actionLabel: 'Crear Oficina'
      };

      vm.searchKey = '';
      vm.toDelete = {
        id: 0,
        name: ''
      };
      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          templateUrl: 'features/common/templates/id.html',
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Oficina',
          displayProperty: 'name',
          sortKey: 'name'
        },
        {
          columnHeaderDisplayName: 'Cliente',
          displayProperty: 'client_name',
          sortKey: 'client_name'
        }
      ];

      vm.previousClickedId = {};

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('offices', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('offices', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }


      vm.tableConfig = {
        url: 'Offices/',
        method: 'get',
        params:{
          client_id: vm.currentUser.clients,
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
    };

    vm.rowClicked = function (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('offices', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/oficinas/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    };
  }
})();
