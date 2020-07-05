(function () {
  angular.module('doc.features')
    // Document Types List
    .controller('DocumentTypesCtrl', [
      '$scope',
      '$location',
      'CurrentUser',
      'DocumentTypes',
      'notification',
      function ($scope, $location, CurrentUser, DocumentTypes, notification) {
        $scope.searchKey = '';
        $scope.toDelete = {
          id: 0,
          name: ''
        };
        $scope.colDef = [
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

        $scope.previousClickedId = {};
        $scope.rowClicked = function (item, level) {
          var tmstp = (new Date()).getTime();
          if ($scope.currentUser.isAllowed('document_type', '_edit')) {

            // Prevent from opening record when clicking on checkbox
            if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
              if ($scope.previousClickedId.id === item.id &&
                  // consider a 300 miliseconds the time for a double click
                  (tmstp - $scope.previousClickedId.tmstp) < 300) {
                return $location.path('/tipo-documentos/' + item.id);
              }
              $scope.previousClickedId = {
                id: item.id,
                tmstp: (new Date()).getTime()
              };
            }
          }
        };

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('document_type', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/common/grid/editColumn.html',
            width: '1em'
          });
        }
        // If user has delete permission then show delete column
        if ($scope.currentUser.isAllowed('document_type', '_delete')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/common/grid/deleteColumn.html',
            width: '1em'
          });
        }

        $scope.currentUser = CurrentUser.get();

        $scope.tableConfig = {
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

        $scope.confirmDelete = function (document_type) {
          $scope.toDelete.id = document_type.id;
          $scope.toDelete.name = document_type.name;

          angular.element('#deleteDocumentTypeModal').modal();
        };

        $scope.deleteDocumentType = function (doc_type_id) {
          DocumentTypes.delete({id: doc_type_id}, function () {
            $scope.tableConfig.params.reload = !$scope.tableConfig.params.reload;
            notification.great('Tipo de documento eliminado correctamente.');
          }, function (error) {
            var message = error.data && error.data.results && error.data.results.message ||
              'Error al eliminar tipo de documento.';

            notification.error(message);
          });
        };

        $scope.search = function () {
          $scope.tableConfig.params.name = $scope.searchKey;
        };
      }])
    .controller('DocumentTypeCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'notification',
      'DocumentTypes', // Service object with API methods
      function ($scope, $filter, $location, $routeParams, notification, DocumentTypes) {
        var document_type_id = $routeParams.id,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Tipo de documento guardado correctamente');
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              var result = true;

              return result;
            };

        $scope.isDisabled = false;

        if (document_type_id) {
          $scope.document_type = DocumentTypes.get({id: document_type_id});
        } else {
          $scope.document_type = new DocumentTypes();
        }

        $scope.backToList = function () {
          $location.path('/tipo-documentos');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              if (!document_type_id) {
                $scope.document_type.$save(successHandler, errorHandler);
              } else {
                $scope.document_type.$update({id: document_type_id}, successHandler, errorHandler);
              }
            } else {
              $scope.isDisabled = false;
              notification.warn('Debe llenar todos los campos obligatorios');
            }
          }
          $scope.isDisabled = false;
        };
      }]);
})();
