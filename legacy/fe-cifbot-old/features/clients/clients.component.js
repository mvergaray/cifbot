
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('clients', {
      templateUrl: './features/clients/clients.html',
      controller: clientsCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function clientsCtrl (
    $location,
    Client,
    notification
  ) {
    let vm = this;

    vm.confirmDelete = _confirmDelete;
    vm.deleteClient = _deleteClient;
    vm.rowClicked = _rowClicked;
    vm.search = _search;

    vm.$onInit = () => {
      vm.currentPath = '#' + $location.path() + '/';

      vm.headerConfig = {
        title: 'Gestión de Clientes',
        goTo: '#/clientes/create',
        icon: 'add_box',
        actionLabel: 'Crear Cliente'
      };

      vm.searchKey = '';

      vm.toDelete = {
        id: 0,
        description: ''
      };

      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          displayProperty: 'id',
          templateUrl: 'features/common/templates/id.html',
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Descripción',
          displayProperty: 'description',
          sortKey: 'description'
        }
      ];

      vm.previousClickedId = {};

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('clients', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }

      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('clients', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }

      vm.tableConfig = {
        url: 'Clients/',
        method: 'get',
        params:{
          id: vm.currentUser.clients,
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

    function _confirmDelete (client) {
      vm.toDelete.id = client.id;
      vm.toDelete.description = client.description;

      angular.element('#deleteClientModal').modal();
    };

    function _deleteClient (client_id) {
      Client.delete({client_id: client_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        notification.great('Cliente eliminado correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar cliente.';

        notification.error(message);
      });
    }

    function _rowClicked (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('clients', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/clientes/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    }

    function _search () {
      vm.tableConfig.params.description = vm.searchKey;
    }
  }
})();
