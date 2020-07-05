(function () {
  angular.module('doc.features')
    .controller('InternalClientCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'Client', // Service object with API methods
      'InternalClients', // Service object with API methods
      'notification',
      'Ubigeo',
      function ($scope, $location, $routeParams, Client, InternalClients, notification, Ubigeo) {
        var internal_client_id = $routeParams.id,
            loadedZoneId = false,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Cliente interno guardado correctamente');
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              var result = true;

              if ($scope.internal_client.legacy_id) {
                if (isNaN(+$scope.internal_client.legacy_id)) {
                  notification.warn('El código ingresado debe ser número.');
                  return false;
                }
                if (($scope.internal_client.legacy_id).length > 3) {
                  notification.warn('El código debe tener 3 dígitos como máximo.');
                  return false;
                }
              }

              return result;
            };

        $scope.isDisabled = false;

        // Initialize prov

        $scope.location = {};

        // Due that Ubigeo has a complex code , it requires to generate it
        function getCode(location) {
          var result;

          if (location.dpto) {
            result = location.dpto < 10 ? '0' + location.dpto.toString() : location.dpto.toString();

            result += location.prov ? (location.prov < 10 ? '0' + location.prov.toString() :
              location.prov.toString()) : '00';

            result += location.dist ? (location.dist < 10 ? '0' + location.dist.toString() :
              location.dist.toString()) : '00';
          }

          return result;
        }

        function getUbigeoId(list) {
          return _.get(_.first(list), 'id');
        }

        Ubigeo.query({}, function (data) {
          $scope.dptos = data.results.list;
        });

        $scope.provs = [];
        $scope.dists = [];

        $scope.onDptoChange = function () {
          $scope.location.prov = undefined;
          $scope.location.dist = undefined;
          $scope.provs = [];
          $scope.dists = [];

          if (!!$scope.location.dpto) {
            // Get list of provinces
            Ubigeo.query({dpto: $scope.location.dpto}, function (data) {
              $scope.provs = data.results.list;

              // If it is the first time to load previous province data
              if (!loadedZoneId && $scope.zone.provincia > 0) {
                $scope.location.prov = +$scope.zone.provincia;
              }
              $scope.internal_client.ubigeo_id = getCode($scope.location);
              $scope.internal_client.ubigeo_id_id = getUbigeoId(data.results.list);
            });
          }
        };

        $scope.onProvChange = function () {
          $scope.location.dist = undefined;
          $scope.dists = [];

          if (!!$scope.location.prov === true) {
            // Get list of ditricts
            Ubigeo.query({
              dpto: $scope.location.dpto,
              prov: $scope.location.prov
            }, function (data) {
              $scope.dists = data.results.list;

              // If it is the first time to load previous district data
              if (!loadedZoneId && $scope.zone.distrito > 0) {
                $scope.location.dist = +$scope.zone.distrito;
                // Load completed
                loadedZoneId = true;
              }
              $scope.internal_client.ubigeo_id = getCode($scope.location);
              $scope.internal_client.ubigeo_id_id = getUbigeoId(data.results.list);
            });
          }
        };

        $scope.onDistChange = function () {
          if (!!$scope.location.dist === true) {
            // Get list of ditricts
            Ubigeo.query({
              dpto: $scope.location.dpto,
              prov: $scope.location.prov,
              dist: $scope.location.dist
            }, function (data) {
              $scope.internal_client.ubigeo_id = getCode($scope.location);
              $scope.internal_client.ubigeo_id_id = getUbigeoId(data.results.list);
            });
          }
        };

        $scope.clientsList = [];

        if (internal_client_id) {
          InternalClients.get({id: internal_client_id}, function (response) {
            $scope.internal_client = response;

            $scope.zone = {};
            if (response && response.ubigeo_id) {
              // load ubigeo data
              $scope.zone.departamento = response.ubigeo_id.substring(0, 2);
              $scope.zone.provincia = response.ubigeo_id.substring(2, 4);
              $scope.zone.distrito = response.ubigeo_id.substring(4, 6);
              $scope.location.dpto = +$scope.zone.departamento || undefined;
              $scope.location.prov = +$scope.zone.provincia || undefined;
              $scope.location.dist = +$scope.zone.distrito || undefined;

              // Get list of provinces
              if ($scope.location.dpto) {
                Ubigeo.query({
                  dpto: $scope.location.dpto
                }, function (data) {
                  $scope.provs = data.results.list;

                  // If it is the first time to load previous province data
                  if (!loadedZoneId && $scope.zone.provincia > 0) {
                    $scope.location.prov = +$scope.zone.provincia;
                  }
                });
              }

              if ($scope.location.prov) {
                Ubigeo.query({
                  dpto: $scope.location.dpto,
                  prov: $scope.location.prov
                }, function (data) {
                  $scope.dists = data.results.list;

                  // If it is the first time to load previous district data
                  if (!loadedZoneId && $scope.zone.distrito > 0) {
                    $scope.location.dist = +$scope.zone.distrito;
                    // Load completed
                    loadedZoneId = true;
                  }
                });
              }
            }
          });
        } else {
          $scope.internal_client = new InternalClients();
          // due that it is a new it does not required load
          loadedZoneId = true;
        }

        Client.get(function (data) {
          $scope.clientsList = data.results.list;
        });

        $scope.backToList = function () {
          $location.path('/clientes-internos');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              $scope.internal_client.ubigeo_id = getCode($scope.location);
              if (!internal_client_id) {
                $scope.internal_client.$save(successHandler, errorHandler);
              } else {
                $scope.internal_client.$update({id: internal_client_id}, successHandler, errorHandler);
              }

            } else {
              notification.warn('Error ingresando formulado');
            }
          }
          $scope.isDisabled = false;
        };
      }]);
})();
