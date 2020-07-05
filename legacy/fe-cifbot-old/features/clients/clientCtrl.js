(function () {
  angular.module('doc.features')
    // lista los clientes
    .controller('ClientCtrl', [
      '$scope',
      '$location',
      'Client',
      'CurrentUser',
      'notification',
      'permissions',  // Provided from route.js, Here it is an Object
      function ($scope, $location, Client, CurrentUser, notification, permissions) {
        $scope.currentUser = permissions; // We can use This object directly

        $scope.searchKey = '';
        $scope.toDelete = {
          id: 0,
          description: ''
        };
        $scope.colDef = [
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

        $scope.previousClickedId = {};
        $scope.rowClicked = function (item, level) {
          var tmstp = (new Date()).getTime();
          if ($scope.currentUser.isAllowed('clients', '_edit')) {

            // Prevent from opening record when clicking on checkbox
            if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
              if ($scope.previousClickedId.id === item.id &&
                  // consider a 300 miliseconds the time for a double click
                  (tmstp - $scope.previousClickedId.tmstp) < 300) {
                return $location.path('/clients/' + item.id);
              }
              $scope.previousClickedId = {
                id: item.id,
                tmstp: (new Date()).getTime()
              };
            }
          }
        };

        // If user has edit permission then show edit column
        if ($scope.currentUser.isAllowed('clients', '_edit')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/common/grid/editColumn.html',
            width: '1em'
          });
        }
        // If user has delete permission then show delete column
        if ($scope.currentUser.isAllowed('clients', '_delete')) {
          $scope.colDef.push({
            columnHeaderDisplayName: '',
            templateUrl: 'features/common/grid/deleteColumn.html',
            width: '1em'
          });
        }

        $scope.tableConfig = {
          url: 'Clients/',
          method: 'get',
          params:{
            id: $scope.currentUser.clients,
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

        $scope.confirmDelete = function (client) {
          $scope.toDelete.id = client.id;
          $scope.toDelete.description = client.description;

          angular.element('#deleteClientModal').modal();
        };

        $scope.deleteClient = function (client_id) {
          Client.delete({client_id: client_id}, function () {
            $scope.tableConfig.params.reload = !$scope.tableConfig.params.reload;
            notification.great('Cliente eliminado correctamente.');
          }, function (error) {
            var message = error.data && error.data.results && error.data.results.message ||
              'Error al eliminar cliente.';

            notification.error(message);
          });
        };

        $scope.search = function () {
          $scope.tableConfig.params.description = $scope.searchKey;
        };

        $scope.headerConfig = {
          title: 'Gestión de Clientes Internos',
          goTo: '#/clientes/create',
          icon: 'add_box',
          actionLabel: 'Crear Cliente'
        };
      }])
    .controller('ClientCreateCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'Client', // Objecto que contiene los metodosAPi Rest
      'notification',
      function ($scope, $filter, $location, $routeParams, Client, notification) {
        var client_id = $routeParams.id,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Cliente guardado correctamente');
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              var result = true;

              if ($scope.client.legacy_id) {
                if (isNaN(+$scope.client.legacy_id)) {
                  notification.warn('El código ingresado debe ser número.');
                  return false;
                }
                if (($scope.client.legacy_id).length > 3) {
                  notification.warn('El código debe tener 3 dígitos como máximo.');
                  return false;
                }
              }

              return result;
            };

        $scope.isDisabled = false;

        if (client_id) {
          $scope.client = Client.get({client_id: client_id}, function () {
            $scope.client.legacy_id = +$scope.client.legacy_id ?
              $filter('leftPad')($scope.client.legacy_id) : '';
          });
        } else {
          $scope.client = new Client();
        }

        $scope.backToList = function () {
          $location.path('/clientes');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              if (!client_id) {
                $scope.client.$save(successHandler, errorHandler);
              } else {
                $scope.client.$update({client_id: client_id}, successHandler, errorHandler);
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
