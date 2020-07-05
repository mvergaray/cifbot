
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('areas', {
      templateUrl: './features/areas/areas.html',
      controller: officesCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function officesCtrl (
    $location, Areas, notification
  ) {
    let vm = this;

    vm.$onInit = () => {
      vm.currentPath = '#' + $location.path() + '/';
      vm.searchKey = '';
      vm.headerConfig = {
        title: 'Gestión de Areas',
        goTo: '#/areas/create',
        icon: 'add_box',
        actionLabel: 'Crear Área'
      };

      vm.toDelete = {
        id: 0,
        name: ''
      };

      vm.previousClickedId = {};

      vm.tableConfig = {
        url: 'Areas/',
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

      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          template: require('../common/templates/id.html'),
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Área',
          displayProperty: 'name',
          sortKey: 'name'
        },
        {
          columnHeaderDisplayName: 'Oficina',
          displayProperty: 'office_name',
          sortKey: 'office_name'
        }
      ];

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('areas', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('areas', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }
    };

    vm.rowClicked = function (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('areas', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/areas/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    };

    vm.confirmDelete = function (office) {
      vm.toDelete.id = office.id;
      vm.toDelete.name = office.name;

      angular.element('#deleteAreaModal').modal();
    };

    vm.deleteArea = function (area_id) {
      Areas.delete({id: area_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        notification.great('Área eliminada correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar área.';

        notification.error(message);
      });
    };

    vm.search = function () {
      vm.tableConfig.params.name = vm.searchKey;
    };
  }
})();
