(function () {
  angular.module('doc.features')
    .controller('OfficeCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'Client', // Service object with API methods
      'notification',
      'Offices', // Service object with API methods
      function ($scope, $filter, $location, $routeParams, Client, notification, Offices) {
        var office_id = $routeParams.id,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Oficina guardada correctamente');
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              var result = true;

              if (!$scope.office.client_id) {
                notification.warn('Debe seleccionar un cliente.');
                return false;
              }
              if ($scope.office.legacy_id) {
                if (isNaN(+$scope.office.legacy_id)) {
                  notification.warn('El código ingresado debe ser número.');
                  return false;
                }
                if (($scope.office.legacy_id).length > 3) {
                  notification.warn('El código debe tener 3 dígitos como máximo.');
                  return false;
                }
              }

              return result;
            };

        $scope.clientsList = [];
        $scope.isDisabled = false;

        if (office_id) {
          $scope.office = Offices.get({id: office_id}, function () {
            $scope.office.legacy_id = +$scope.office.legacy_id ?
              $filter('leftPad')($scope.office.legacy_id) : '';
          });
        } else {
          $scope.office = new Offices();
        }

        Client.get(function (data) {
          $scope.clientsList = data.results.list;
        });

        $scope.backToList = function () {
          $location.path('/oficinas');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              if (!office_id) {
                $scope.office.$save(successHandler, errorHandler);
              } else {
                $scope.office.$update({id: office_id}, successHandler, errorHandler);
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
