(function () {
  angular.module('doc.features')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(false).hashPrefix('');
      $routeProvider
        .when('/', {
          template: '<records data-permissions="$resolve.permissions"></records>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/upload', {
          template: '<bulk-import data-current-user="$resolve.permissions"></bulk-import>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/bulkDelete', {
          template: '<bulk-delete data-current-user="$resolve.permissions"></bulk-delete>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/bulkUpdate', {
          template: '<bulk-update data-current-user="$resolve.permissions"></bulk-update>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/folders', {
          template: '<bulk-locations data-current-user="$resolve.permissions"></bulk-locations>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/clientes', {
          template: '<clients data-current-user="$resolve.permissions"></clients>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/clientes/create', {
          templateUrl: 'features/clients/clientForm.html',
          controller: 'ClientCreateCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/clientes/:id', {
          templateUrl: 'features/clients/clientForm.html',
          controller: 'ClientCreateCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/usuarios', {
          template: '<users data-current-user="$resolve.permissions"></users>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/usuarios/add', {
          template: '<user-form data-current-user="$resolve.permissions"></user-form>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/usuarios/:id', {
          template: '<user-form data-current-user="$resolve.permissions"></user-form>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/perfil', {
          templateUrl: 'features/profile/profile.html',
          controller: 'ProfileCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/oficinas', {
          template: '<offices data-current-user="$resolve.permissions"></offices>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/oficinas/create', {
          templateUrl: 'features/offices/officeForm.html',
          controller: 'OfficeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/oficinas/:id', {
          templateUrl: 'features/offices/officeForm.html',
          controller: 'OfficeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/areas', {
          template: '<areas data-current-user="$resolve.permissions"></areas',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/areas/create', {
          templateUrl: 'features/areas/areaForm.html',
          controller: 'AreaCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/areas/:id', {
          templateUrl: 'features/areas/areaForm.html',
          controller: 'AreaCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/clientes-internos', {
          template: '<internal-clients data-current-user="$resolve.permissions"></internal-clients>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/clientes-internos/create', {
          templateUrl: 'features/internalClients/internalClientForm.html',
          controller: 'InternalClientCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/clientes-internos/:id', {
          templateUrl: 'features/internalClients/internalClientForm.html',
          controller: 'InternalClientCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/zonas', {
          templateUrl: 'features/zones/zones.html',
          controller: 'zonesListCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/zonas/createDepartamento', {
          templateUrl: 'features/zones/templates/mantZone.html',
          controller: 'zonesDepartamentoCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/zonas/createDepartamento/:id', {
          templateUrl: 'features/zones/templates/mantZone.html',
          controller: 'zonesDepartamentoCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/zonas/departamento/:dpto/provincia', {
          templateUrl: 'features/zones/templates/mantZone.html',
          controller: 'zoneProvinciaCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/zonas/departamento/:dpto/provincia/:id', {
          templateUrl: 'features/zones/templates/mantZone.html',
          controller: 'zoneProvinciaCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/zonea/departamento/:dpto/provincia/:prov/distrito', {
          templateUrl: 'features/zones/templates/mantZone.html',
          controller: 'zoneDistritoCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/zonas/departamento/:dpto/provincia/:prov/distrito/:id', {
          templateUrl: 'features/zones/templates/mantZone.html',
          controller: 'zoneDistritoCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/tipo-documentos', {
          template: '<document-types data-current-user="$resolve.permissions"></document-types>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/tipo-documentos/create', {
          templateUrl: 'features/documentTypes/documentTypeForm.html',
          controller: 'DocumentTypeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/tipo-documentos/:id', {
          templateUrl: 'features/documentTypes/documentTypeForm.html',
          controller: 'DocumentTypeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/tipo-envios', {
          template: '<shipping-types data-current-user="$resolve.permissions"></shipping-types>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/tipo-envios/create', {
          templateUrl: 'features/shippingTypes/shippingTypeForm.html',
          controller: 'ShippingTypeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/tipo-envios/:id', {
          templateUrl: 'features/shippingTypes/shippingTypeForm.html',
          controller: 'ShippingTypeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/empleados', {
          template: '<employees data-current-user="$resolve.permissions"></employees>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/empleados/create', {
          templateUrl: 'features/employees/employeeForm.html',
          controller: 'EmployeeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/empleados/:id', {
          templateUrl: 'features/employees/employeeForm.html',
          controller: 'EmployeeCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/document/create', {
          templateUrl: 'features/records/recordForm/recordForm.html',
          controller: 'RecordCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })
        .when('/document/:id', {
          templateUrl: 'features/records/recordForm/recordForm.html',
          controller: 'RecordCtrl',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/assign', {
          template: '<assign-form data-current-user="$resolve.permissions"></assign-form>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/discharge', {
          template: '<discharge-form data-current-user="$resolve.permissions"></discharge-form>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .when('/close', {
          template: '<close-form data-current-user="$resolve.permissions"></close-form>',
          resolve: {
            permissions: function (permissionsV2) {
              return permissionsV2.$promise;
            }
          }
        })

        .otherwise({ redirectTo: '/'});

    }]);
})();
