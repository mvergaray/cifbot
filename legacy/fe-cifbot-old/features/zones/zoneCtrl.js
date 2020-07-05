(function () {
  angular.module('doc.features')
    .controller('zonesListCtrl', [
      '$scope',
      '$location',
      'CurrentUser',
      'notification',
      'Ubigeo',
      'Zone',
      'ZoneDepartamento',
      'ZoneDistrito',
      'ZoneProvincia',
      function ($scope, $location, CurrentUser, notification, Ubigeo, Zone,
          ZoneDepartamento, ZoneDistrito, ZoneProvincia) {

        let path = '/zonas';

        $scope.isEditionEnabled = false;
        $scope.currentUser = {};
        // Hold the data which are being showed
        $scope.selectedZone = {
          dpto: 0,
          prov: 0
        };

        $scope.toDelete = {
          id: 0,
          level: 0,
          name: '',
          message: ''
        };

        CurrentUser.get({}, function (response) {
          $scope.currentUser = response;
          $scope.isCreationEnabled = $scope.currentUser.isAllowed('zones', '_create');
          $scope.isEditionEnabled = $scope.currentUser.isAllowed('zones', '_edit');
          $scope.isDeletionEnabled = $scope.currentUser.isAllowed('zones', '_delete');
        });

        // Get list of departments
        $scope.departamentos = Ubigeo.query({});

        $scope.showProvincias = function (departamento_id, row) {
          $scope.selectedZone.dpto = departamento_id;
          $scope.selectedZone.prov = 0;
          $scope.provincias = Ubigeo.query($scope.selectedZone);
          $scope.distritos = [];

          // selected process
          $scope.departamentos.results.list.forEach(function (item) {
            item.isSelected = false;
          });
          row.isSelected = true;
        };

        $scope.showDistritos = function (provincia_id, row) {
          $scope.selectedZone.prov = provincia_id;
          $scope.distritos = Ubigeo.query($scope.selectedZone);

          // selected process
          $scope.provincias.results.list.forEach(function (item) {
            item.isSelected = false;
          });
          row.isSelected = true;
        };

        $scope.createNewDepartamento = function () {
          $location.path(`${path}/createDepartamento`);
        };

        $scope.createNewProvincia = function () {
          $location.path(`${path}/departamento/` + $scope.selectedZone.dpto + '/provincia/' );
        };

        $scope.createNewDistrito = function () {
          $location.path(`${path}/departamento/` + $scope.selectedZone.dpto + '/provincia/'+ $scope.selectedZone.prov +
            '/distrito' );
        };

        $scope.confirmDelete = function (zone_id, name, level) {
          $scope.toDelete.id = zone_id;
          $scope.toDelete.level = level;
          $scope.toDelete.name = name;
          switch (level) {
            case 1:
              $scope.toDelete.message = 'el departamento';
              break;
            case 2:
              $scope.toDelete.message = 'la provincia';
              break;
            case 3:
              $scope.toDelete.message = 'el distrito';
          }
          angular.element('#deleteZoneModal').modal();
        };

        $scope.delete = function () {
          switch ($scope.toDelete.level) {
            case 1:
              ZoneDepartamento.delete({id: $scope.toDelete.id}, function () {
                $scope.departamentos = Ubigeo.query({});
                $scope.provincias = [];
                $scope.distritos = [];
                notification.great('Departamento eliminado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al eliminar departamento.';

                notification.error(message);
              });
              break;
            case 2:
              ZoneProvincia.delete({id: $scope.toDelete.id}, function () {
                $scope.selectedZone.prov = 0;
                $scope.selectedZone.dpto = $scope.toDelete.id.substring(0, 2);
                $scope.provincias = Ubigeo.query($scope.selectedZone);
                $scope.distritos = [];
                notification.great('Provincia eliminado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al eliminar provincia.';

                notification.error(message);
              });
              break;
            case 3:
              ZoneDistrito.delete({id: $scope.toDelete.id}, function () {
                $scope.selectedZone.prov = $scope.toDelete.id.substring(2, 4);
                $scope.distritos = Ubigeo.query($scope.selectedZone);
                notification.great('Distrito eliminado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al eliminar distrito.';

                notification.error(message);
              });
              break;
          }
        };
      }])
    .controller('zonesDepartamentoCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'CurrentUser',
      'notification',
      'Ubigeo',
      'Zone',
      'ZoneDepartamento',
      function ($scope, $location, $routeParams, CurrentUser, notification, Ubigeo, Zone, ZoneDepartamento) {
        var dptoId = $routeParams.id;

        $scope.page = {
          title: 'Gestión de Departamentos'
        };

        if (dptoId) {
          ZoneDepartamento.get({id: dptoId}, function (response) {
            $scope.newName = response.name;
            $scope.oldName = response.name;
          });
        }

        $scope.hasChangeValue = function () {
          // If Id exists it must valid, another way always true
          return $scope.oldName == $scope.newName;
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!dptoId) {
              ZoneDepartamento.save({name: $scope.newName}, function () {
                $location.path(path);
                notification.great('Departamento creado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al crear departamento.';

                notification.error(message);
              });
            } else {
              ZoneDepartamento.update({id: dptoId, name: $scope.newName}, function () {
                $location.path(path);
                notification.great('Departamento actualizado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al actualizar departamento.';

                notification.error(message);
              });
            }
          }
        };

        $scope.cancel = function () {
          $location.path(path);
        };
      }])
    .controller('zoneProvinciaCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'CurrentUser',
      'notification',
      'Ubigeo',
      'Zone',
      'ZoneProvincia',
      function ($scope, $location, $routeParams, CurrentUser, notification, Ubigeo, Zone, ZoneProvincia) {
        var provId = $routeParams.id,
            dptoId = $routeParams.dpto;

        let path = '/zonas';

        $scope.page = {
          title: 'Gestión de Provincias'
        };

        if (provId) {
          ZoneProvincia.get({dpto: dptoId, id: provId}, function (response) {
            $scope.newName = response.name;
            $scope.oldName = response.name;
          });
        }

        $scope.hasChangeValue = function () {
          // If Id exists it must valid, another way always true
          return $scope.oldName == $scope.newName;
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!provId) {
              ZoneProvincia.save({dpto: dptoId, name: $scope.newName}, function () {
                $location.path(path);
                notification.great('Provincia creada correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al crear provincia.';

                notification.error(message);
              });
            } else {
              ZoneProvincia.update({dpto: dptoId, id: provId, name: $scope.newName}, function () {
                $location.path(path);
                notification.great('Provincia actualizada correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al actualizar provincia.';

                notification.error(message);
              });
            }
          }
        };

        $scope.cancel = function () {
          $location.path(path);
        };
      }])
    .controller('zoneDistritoCtrl', [
      '$scope',
      '$location',
      '$routeParams',
      'CurrentUser',
      'notification',
      'Ubigeo',
      'Zone',
      'ZoneDistrito',
      function ($scope, $location, $routeParams, CurrentUser, notification, Ubigeo, Zone, ZoneDistrito) {
        var provId = $routeParams.prov,
            dptoId = $routeParams.dpto,
            id = $routeParams.id;

        let path = '/zonas';

        $scope.page = {
          title: 'Gestión de Distrito'
        };

        if (id) {
          ZoneDistrito.get({dpto: dptoId, prov: provId, id: id}, function (response) {
            $scope.newName = response.name;
            $scope.oldName = response.name;
          });
        }

        $scope.hasChangeValue = function () {
          // If Id exists it must valid, another way always true
          return $scope.oldName == $scope.newName;
        };

        $scope.save = function (form) {
          if (form.$valid) {
            if (!id) {
              ZoneDistrito.save({dpto: dptoId, prov: provId, name: $scope.newName}, function () {
                $location.path(path);
                notification.great('Distrito creado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al crear distrito';

                notification.error(message);
              });
            } else {
              ZoneDistrito.update({dpto: dptoId, prov: provId, id: id, name: $scope.newName}, function () {
                $location.path(path);
                notification.great('Distrito actualizado correctamente.');
              }, function (error) {
                var message = error.data && error.data.results && error.data.results.message ||
                  'Error al actualizar distrito.';

                notification.error(message);
              });
            }
          }
        };

        $scope.cancel = function () {
          $location.path(path);
        };
      }]);
})();
