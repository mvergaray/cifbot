import './_user.scss';

(() => {
  angular
    .module('doc.features')
    .component('userForm', {
      templateUrl: './features/users/userForm/userForm.html',
      controller: userFormCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function userFormCtrl (
    $scope, $filter, $location,
    $mdConstant,
    $q,
    $routeParams, Areas, Client, Employees,
    Entity, notification, Offices, Ubigeo, User
  ) {
    let vm = this;
    var userId = $routeParams.id,
        loadedZoneId = false,
        preValidation = function () {
          var result = true;

          if (!$scope.user.username) {
            notification.warn('Debe ingresar un usuario.');
            return false;
          }
          if (!$scope.isUsernameValid) {
            notification.warn('El usuario ingresado no es válido');
            return false;
          }
          if (!$scope.user.id) {
            if (!$scope.user.password) {
              notification.warn('Debe ingresar una contraseña.');
              return false;
            }
            if (!$scope.user.password_r) {
              notification.warn('Debe confirmar la contraseña ingresada.');
              return false;
            }
            if ($scope.user.password !== $scope.user.password_r) {
              notification.warn('Las contraseñas ingresadas no coinciden.');
              return false;
            }
          }
          if (!$scope.user.locate_client) {
            notification.warn('Debe seleccionar un cliente.');
            return false;
          }
          if (!$scope.user.locate_office) {
            notification.warn('Debe seleccionar una oficina.');
            return false;
          }
          if (!$scope.user.locate_area) {
            notification.warn('Debe seleccionar un área.');
            return false;
          }
          if (!$scope.user.role_id) {
            notification.warn('Debe seleccionar un rol.');
            return false;
          }
          if ($scope.user.employee_id) {
            if (isNaN(+$scope.user.employee_id)) {
              notification.warn('El código de empleado debe ser número.');
              return false;
            }
          }
          if ($scope.user.legacy_id) {
            if (isNaN(+$scope.user.legacy_id)) {
              notification.warn('El código externo ingresado debe ser número.');
              return false;
            }
            if (($scope.user.legacy_id).length > 3) {
              notification.warn('El código externo debe tener 3 dígitos como máximo.');
              return false;
            }
          }

          return result;
        };

    vm.$onInit = () => {
      $scope.location = {};
      $scope.zone = {};

      Ubigeo.query({}, function (data) {
        $scope.dptos = data.results.list;
      });
      $scope.provs = [];
      $scope.dists = [];

      $scope.clientList = [];
      $scope.officeList = [];
      $scope.areaList = [];
      $scope.clientSelection = {
        selectedClients: []
      };
      $scope.isDisabled = false;
      $scope.isUsernameValid = true;

      vm.separatorKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.TAB];
      vm.assignedEmployees = {};
      vm.delivery = [];

      if (userId) {
        User.get({id: userId}, function (response) {
          var coddpto,
              codprov,
              coddist;

          if (response && response.ubigeo_id) {
            // load ubigeo data
            $scope.zone = {};
            $scope.zone.departamento = response.ubigeo_id.substring(0, 2);
            $scope.zone.provincia = response.ubigeo_id.substring(2, 4);
            $scope.zone.distrito = response.ubigeo_id.substring(4, 6);
            coddpto = +$scope.zone.departamento || undefined;
            codprov = +$scope.zone.provincia || undefined;
            coddist = +$scope.zone.distrito || undefined;
            $scope.location.dpto = _.find($scope.dptos, {coddpto: +$scope.zone.departamento});

            // Get list of provinces
            if (coddpto) {
              Ubigeo.query({
                dpto: coddpto
              }, function (data) {
                $scope.provs = data.results.list;

                // If it is the first time to load previous province data
                if (!loadedZoneId && codprov > 0) {
                  $scope.location.prov = _.find($scope.provs, {codprov: codprov});
                }
              });
            }

            if (codprov) {
              Ubigeo.query({
                dpto: coddpto,
                prov: codprov
              }, function (data) {
                $scope.dists = data.results.list;

                // If it is the first time to load previous district data
                if (!loadedZoneId && coddist > 0) {
                  $scope.location.dist = _.find($scope.dists, {coddist: coddist});
                  // Load completed
                  loadedZoneId = true;
                }
              });
            }
          }

          $scope.user = response;
          $scope.user.status += '';
          $scope.clientSelection.selectedClients = $filter('filter')(response.clients, {selected: true});
          $scope.user.employee_id = +$scope.user.employee_id || '';
          $scope.user.legacy_id = +$scope.user.legacy_id ?
            $filter('leftPad')($scope.user.legacy_id) : '';

          if ($scope.user.locate_client) {
            Offices.get({client_id: $scope.user.locate_client}, function (response) {
              $scope.officeList = response.results.list;
            });
          }

          if ($scope.user.locate_office) {
            Areas.get({office_id: $scope.user.locate_office}, function (response) {
              $scope.areaList = response.results.list;
            });
          }

          _initDelivery()
            .then(delivery => {
              vm.delivery = delivery;
            });
        });

      } else {
        // #/Users/add
        $scope.user = new User();
        $scope.user.status = '1';
        $scope.user.clients = [];
        $scope.user.entities = [];

        Entity.query(function (data) {
          $scope.user.entities = data.results.list;
        });
      }

      Client.query(function (data) {
        if (!userId) {
          $scope.user.clients = data.results.list;
        }
        $scope.clientList = data.results.list;
      });
    };

    $scope.onDptoChange = function () {
      $scope.location.prov = undefined;
      $scope.location.dist = undefined;
      $scope.provs = [];
      $scope.dists = [];

      if (!!$scope.location.dpto) {
        // Get list of provinces
        Ubigeo.query({dpto: $scope.location.dpto.coddpto}, function (data) {
          $scope.provs = data.results.list;

          // If it is the first time to load previous province data
          if (!loadedZoneId && $scope.zone.provincia > 0) {
            $scope.location.prov = +$scope.zone.provincia;
          }
          $scope.user.ubigeo_id = $scope.location.dpto.code;
          $scope.user.ubigeo_id_id = $scope.location.dpto.id;
        });
      }
    };

    $scope.onProvChange = function () {
      $scope.location.dist = undefined;
      $scope.dists = [];

      if (!!$scope.location.prov) {
        // Get list of ditricts
        Ubigeo.query({
          dpto: $scope.location.dpto.coddpto,
          prov: $scope.location.prov.codprov
        }, function (data) {
          $scope.dists = data.results.list;

          // If it is the first time to load previous district data
          if (!loadedZoneId && $scope.zone.distrito > 0) {
            $scope.location.dist = +$scope.zone.distrito;
            // Load completed
            loadedZoneId = true;
          }
          $scope.user.ubigeo_id = $scope.location.prov.code;
          $scope.user.ubigeo_id_id = $scope.location.prov.id;
        });
      }
    };

    $scope.onDistChange = function () {
      $scope.user.ubigeo_id = $scope.location.dist.code;
      $scope.user.ubigeo_id_id = $scope.location.dist.id;
    };

    $scope.onLocateClientChange = function () {
      $scope.officeList = [];
      $scope.areaList = [];
      $scope.user.locate_office = undefined;
      $scope.user.locate_area = undefined;

      if ($scope.user.locate_client) {
        Offices.get({client_id: $scope.user.locate_client}, function (response) {
          $scope.officeList = response.results.list;
        });
      }
    };

    $scope.onLocateOfficeChange = function () {
      $scope.areaList = [];
      $scope.user.locate_area = undefined;

      if ($scope.user.locate_office) {
        Areas.get({office_id: $scope.user.locate_office}, function (response) {
          $scope.areaList = response.results.list;
        });
      }
    };

    $scope.onPermissionsCheck = function (entityName, permission) {
      $scope.user.entities.forEach(function (entity) {
        if (entity.name === entityName) {
          if (permission === 'view' && !entity._view) {
            entity._create = entity._edit = entity._delete = 0;
          } else if (permission === 'all') {
            entity._view = entity._create = entity._edit = entity._delete = 1;
          }
        } else if (entityName === 'all') {
          if (permission === 'view') {
            entity._view = 1;
          } else {
            entity['_' + permission] = entity._view;
          }
        }
      });
    };

    $scope.backToList = function () {
      $location.path('/usuarios');
    };

    $scope.save = function (form) {
      $scope.isDisabled = true;
      if (preValidation()) {
        if (form.$valid) {
          $scope.user.created_at = new Date().getTime();

          // Get clients selection, Admin users automatically include all the clients
          $scope.user.clients.forEach(function (client) {
            if ($scope.user.role_id == 2 ||
                $scope.clientSelection.selectedClients.indexOf(client) > -1) {
              client.selected = true;
            } else {
              client.selected = false;
            }
          });

          $scope.user.entities.forEach(function (entity) {
            // Grant full permissions for Admin users
            if ($scope.user.role_id == 2) {
              entity._view = entity._create = entity._edit = entity._delete = 1;
            // Users'd only be allowed to view
            } else if ($scope.user.role_id == 3) {
              entity._create = entity._edit = entity._delete = 0;
            } else if ($scope.user.role_id == 4 && entity.name == 'RECORDS') {
              entity._edit = entity._create = entity._delete = 0;
              entity._view = 1;
            } else if ($scope.user.role_id == 4) {
              entity._view = entity._edit = entity._create = entity._delete = 0;
            }
          });

          $scope.user.employees = _.map(vm.delivery, 'id');

          if ($scope.user.role_id == 4) {
            $scope.user.clients = [];
          }

          if (!$routeParams.id) {
            $scope.user.$save(function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Usuario guardado Correctamente');
            }, function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            });
          } else {
            $scope.user.$update(function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Usuario guardado Correctamente');
            }, function (error) {
              notification.error(error.data.message);
            });
          }
        } else {
          $scope.isDisabled = false;
          notification.error('Debe llenar todos los campos obligatorios');
        }
      }
      $scope.isDisabled = false;
    };

    $scope.savePassword = function () {
      $scope.isDisabled = true;
      if ($scope.user.password && $scope.user.password === $scope.user.newPassword) {
        $scope.user.$updatePassword(function () {
          $scope.isDisabled = false;
          $scope.backToList();
          notification.great('Clave actualizada Correctamente');
        }, function (err) {
          $scope.isDisabled = false;
          notification.error(err.data.message);
        });
      } else {
        $scope.isDisabled = false;
        if ($scope.user.password !== $scope.user.newPassword) {
          notification.error('Las claves no coinciden');
        } else {
          notification.error('Debe llenar todos los campos obligatorios');
        }
      }
    };

    $scope.validateUsername = function () {
      if ($scope.user.username) {
        $scope.isUsernameValid = /^[0-9a-zA-Z_.-]+$/.test($scope.user.username) &&
          $scope.user.username.indexOf(' ') === -1;
      } else {
        $scope.isUsernameValid = true;
      }
    };

    $scope.clearSelection = function (multiSelected) {
      multiSelected.search = '';
    };

    vm.isEditAllowed = _isEditAllowed;
    vm.addEmployee = angular.noop;
    vm.removeEmployee = angular.noop;

    vm.onSelectedItem = function () {
      if (vm.delivery.length >= 20) {
        // Clear the search text after validating the chip
        vm.searchText = '';
      }
    };

    vm.querySearch = function (searchText) {
      let defer = $q.defer();
      Employees.query({ name: searchText, limit: 25}, response => {
        defer.resolve(response.results.list.map(
          _ => angular.extend(_, {full_name: `${_.first_name} ${_.last_name}` }))
        );
      }, _ => {
        defer.reject(_);
      });
      return defer.promise;
    };

    vm.onModelChange = () => {

    };

    function _isEditAllowed () {
      return vm.currentUser.isAllowed('users', '_edit');
    }

    function _initDelivery () {
      let defer = $q.defer();
      Employees.query({ employee_id: $scope.user.employees, limit: 25}, response => {
        defer.resolve(response.results.list.map(
          _ => angular.extend(_, {full_name: `${_.first_name} ${_.last_name}` }))
        );
      }, _ => {
        defer.reject(_);
      });
      return defer.promise;
    }
  }
})();
