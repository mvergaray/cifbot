(function () {
  angular.module('doc.features')
    .controller('EmployeeCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'notification',
      'Employees', // Service object with API methods
      function ($scope, $filter, $location, $routeParams, notification, Employees) {
        var employee_id = $routeParams.id,
            successHandler = function () {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Empleado guardado correctamente');
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              var result = true;

              if ($scope.employee.legacy_id) {
                if (isNaN(+$scope.employee.legacy_id)) {
                  notification.warn('El código ingresado debe ser número.');
                  return false;
                }
                if (($scope.employee.legacy_id).length > 3) {
                  notification.warn('El código debe tener 3 dígitos como máximo.');
                  return false;
                }
              }

              return result;
            };

        // Initialize input-mask for datepickers
        angular.element('.datepicker').inputmask('dd/mm/yyyy', {placeholder: 'dd/mm/aaaa'});

        $scope.isDisabled = false;

        if (employee_id) {
          Employees.get({id: employee_id}, function (response) {
            $scope.employee = response;
            $scope.employee.status += '';
            $scope.employee.type += '';
            $scope.employee.doc_type = $scope.employee.doc_type ?
              $scope.employee.doc_type + '' : null;
            $scope.employee.marital_status = $scope.employee.marital_status ?
              $scope.employee.marital_status + '' : null;
            $scope.employee.legacy_id = +$scope.employee.legacy_id ?
              $filter('leftPad')($scope.employee.legacy_id) : '';
          });
        } else {
          $scope.employee = new Employees();
        }

        $scope.backToList = function () {
          $location.path('/empleados');
        };

        $scope.save = function (form) {
          $scope.isDisabled = true;
          if (preValidation()) {
            if (form.$valid) {
              if ($scope.employee.f_birth_date) {
                $scope.employee.birth_date = moment($scope.employee.f_birth_date, 'DD/mm/YYYY').format('YYYY-mm-DD');
              }
              if ($scope.employee.f_start_date) {
                $scope.employee.start_date = moment($scope.employee.f_start_date, 'DD/mm/YYYY').format('YYYY-mm-DD');
              }

              if (!employee_id) {
                $scope.employee.$save(successHandler, errorHandler);
              } else {
                $scope.employee.$update({id: employee_id}, successHandler, errorHandler);
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
