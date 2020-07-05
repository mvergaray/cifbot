
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('shippingTypes', {
      templateUrl: './features/shippingTypes/shippingTypes.html',
      controller: officesCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function officesCtrl(
    $location, ShippingType, notification
  ) {
    let vm = this;

    function _setHeaderConfig () {
      vm.headerConfig = {
        title: 'Gestión de Tipos de Envío',
        goTo: '#/tipo-envios/create',
        icon: 'add_box',
        actionLabel: 'Crear Tipo de Envío'
      };
    }

    vm.$onInit = () => {
      _setHeaderConfig();
      vm.searchKey = '';
      vm.previousClickedId = {};
      vm.toDelete = {
        id: 0,
        name: ''
      };
      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          template: require('../common/templates/id.html'),
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Tipo de Envío',
          displayProperty: 'name',
          sortKey: 'name'
        }
      ];

      vm.tableConfig = {
        url: 'ShippingType/',
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

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('shipping_type', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('shipping_type', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }
    };


    vm.rowClicked = function (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('shipping_type', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/tipo-envios/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    };



    vm.confirmDelete = function (Shipping_type, $event) {
      vm.toDelete.id = Shipping_type.id;
      vm.toDelete.name = Shipping_type.name;

      if ($event) {
        $event.stopPropagation();
      }

      angular.element('#deleteShippingTypeModal').modal();
    };

    vm.deleteShippingType = function (doc_type_id) {
      ShippingType.delete({id: doc_type_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        notification.great('Tipo de envío eliminado correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar tipo de envío.';

        notification.error(message);
      });
    };

    vm.search = function () {
      vm.tableConfig.params.name = vm.searchKey;
    };
  }
})();
