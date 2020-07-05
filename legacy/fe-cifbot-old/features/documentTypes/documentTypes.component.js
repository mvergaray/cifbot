
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('documentTypes', {
      templateUrl: './features/documentTypes/documentTypes.html',
      controller: documentTypesCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function documentTypesCtrl (
    $location, DocumentTypes, notification
  ) {
    let vm = this;

    function _setHeaderConfig () {
      vm.headerConfig = {
        title: 'Gestión de Tipos de Documento',
        goTo: '#/tipo-documentos/create',
        icon: 'add_box',
        actionLabel: 'Crear Tipo de Documento'
      };
    }

    vm.$onInit = () => {
      vm.currentPath = '#' + $location.path() + '/';

      _setHeaderConfig();

      vm.searchKey = '';

      vm.toDelete = {
        id: 0,
        name: ''
      };
      vm.previousClickedId = {};
      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          templateUrl: 'features/common/templates/id.html',
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Tipo de Documento',
          displayProperty: 'name',
          sortKey: 'name'
        }
      ];

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('document_type', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('document_type', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }


    }

    vm.rowClicked = function (item, level) {
      var tmstp = (new Date()).getTime();
      if (vm.currentUser.isAllowed('document_type', '_edit')) {

        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/tipo-documentos/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    };



      vm.tableConfig = {
        url: 'DocumentTypes/',
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

      vm.confirmDelete = function (document_type) {
        vm.toDelete.id = document_type.id;
        vm.toDelete.name = document_type.name;

        angular.element('#deleteDocumentTypeModal').modal();
      };

      vm.deleteDocumentType = function (doc_type_id) {
        DocumentTypes.delete({id: doc_type_id}, function () {
          vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
          notification.great('Tipo de documento eliminado correctamente.');
        }, function (error) {
          var message = error.data && error.data.results && error.data.results.message ||
            'Error al eliminar tipo de documento.';

          notification.error(message);
        });
      };

      vm.search = function () {
        vm.tableConfig.params.name = vm.searchKey;
      };
  }
})();