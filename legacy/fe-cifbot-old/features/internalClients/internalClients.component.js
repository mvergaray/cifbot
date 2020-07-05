
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('internalClients', {
      templateUrl: './features/internalClients/internalClients.html',
      controller: internalClientsCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function internalClientsCtrl (
    $location,
    InternalClients,
    Toast
  ) {
    let vm = this;

    vm.confirmDelete = _confirmDelete;
    vm.deleteInternalClient = _deleteInternalClient;
    vm.rowClicked = _rowClicked;
    vm.search = _search;

    vm.$onInit = () => {
      vm.currentPath = '#' + $location.path() + '/';

      vm.headerConfig = {
        title: 'Gestión de Clientes Internos',
        goTo: '#/clientes-internos/create',
        icon: 'add_box',
        actionLabel: 'Crear Cliente Interno'
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
          columnHeaderDisplayName: 'Nombre Corto',
          displayProperty: 'short_name',
          sortKey: 'short_name',
          width: '9em'
        },
        {
          columnHeaderDisplayName: 'Nombre Largo',
          displayProperty: 'name',
          sortKey: 'name',
          width: '9em'
        },
        {
          columnHeaderDisplayName: 'Dirección',
          displayProperty: 'address',
          sortKey: 'address',
          maxWidth: '10em'
        },
        {
          columnHeaderDisplayName: 'Cód. Dist.',
          templateUrl: 'features/internalClients/templates/ubigeoCodColumn.html',
          sortKey: 'ubigeo_id',
          width: '7em'
        },
        {
          columnHeaderDisplayName: 'UbiGeo',
          templateUrl: 'features/internalClients/templates/ubigeoDescColumn.html'
        },
        {
          columnHeaderDisplayName: 'R.U.C.',
          displayProperty: 'ruc',
          sortKey: 'ruc',
          width: '7em'
        }
      ];

      vm.previousClickedId = {};

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('internal_clients', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('internal_clients', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }

      vm.tableConfig = {
        url: 'InternalClients/',
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
    }

    function _confirmDelete (internal_client) {
      vm.toDelete.id = internal_client.id;
      vm.toDelete.name = internal_client.name;

      angular.element('#deleteInternalClientModal').modal();
    }

    function  _deleteInternalClient (internal_client_id) {
      InternalClients.delete({id: internal_client_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        Toast.great('Cliente interno eliminado correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar cliente interno.';

          Toast.error(message);
      });
    }

    function _rowClicked (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('internal_clients', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/clientes-internos/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    }

    function _search () {
      vm.tableConfig.params.name = vm.searchKey;
    }
  }
})();
