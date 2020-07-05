import './shippingTypes.scss';

(function () {
  angular.module('doc.features')
    .controller('ShippingTypeCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'notification',
      'ShippingType', // Service object with API methods
      function ($scope, $filter, $location, $routeParams, notification, ShippingType) {
        var shipping_type_id = $routeParams.id || 0,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Tipo de envío guardado correctamente');
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

        if (shipping_type_id) {
          $scope.shipping_type = ShippingType.get({id: shipping_type_id});
        } else {
          $scope.shipping_type = new ShippingType();
        }

        $scope.backToList = function () {
          $location.path('/tipo-envios');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              if (!shipping_type_id) {
                $scope.shipping_type.$save(successHandler, errorHandler);
              } else {
                $scope.shipping_type.$update({id: shipping_type_id}, successHandler, errorHandler);
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
