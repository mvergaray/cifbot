(function () {
  angular.module('doc.features')
    .controller('AreaCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'Areas', // Service object with API methods
      'Client', // Service object with API methods
      'notification',
      'Offices', // Service object with API methods
      function ($scope, $filter, $location, $routeParams, Areas, Client, notification, Offices) {
        var areaId = $routeParams.id,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Área guardada correctamente');
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              if (!$scope.area.client_id) {
                notification.warn('Debe seleccionar un cliente.');
                return false;
              }
              if (!$scope.area.office_id) {
                notification.warn('Debe seleccionar una oficina.');
                return false;
              }
              if ($scope.area.legacy_id) {
                if (isNaN(+$scope.area.legacy_id)) {
                  notification.warn('El código ingresado debe ser número.');
                  return false;
                }
                if (($scope.area.legacy_id).length > 3) {
                  notification.warn('El código debe tener 3 dígitos como máximo.');
                  return false;
                }
              }

              return true;
            };

        $scope.clientsList = [];
        $scope.officesList = [];
        $scope.isDisabled = false;

        $scope.onClientSelected = function (client_id) {
          $scope.area.office_id = undefined;
          Offices.get({client_id: client_id}, function (data) {
            $scope.officesList = data.results.list;
          });
        };

        if (areaId) {
          $scope.area = Areas.get({id: areaId}, function () {
            Offices.get({client_id: $scope.area.client_id}, function (data) {
              $scope.officesList = data.results.list;
            });
            $scope.area.legacy_id = +$scope.area.legacy_id ?
              $filter('leftPad')($scope.area.legacy_id) : '';
          });

        } else {
          $scope.area = new Areas();
        }

        Client.get(function (data) {
          $scope.clientsList = data.results.list;
        });

        $scope.backToList = function () {
          $location.path('/areas');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              if (!areaId) {
                $scope.area.$save(successHandler, errorHandler);
              } else {
                $scope.area.$update({id: areaId}, successHandler, errorHandler);
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
