import './discharge.scss';

(function () {
  angular.module('doc.features')
    .controller('DischargeCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      '$window',
      'DischargeSvc',
      'Employees',
      'notification',
      'ReportService',
      function ($scope, $filter, $location, $routeParams, $window, DischargeSvc,
          Employees, notification, ReportService) {
        var successHandler = function (response, isExport) {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Registros descargados correctamente');
              let dischargeId = response.result.id;
              notification.warn('Se esta Generando el PDF de la descarga. Por favor espere.');
              // Download PDF
              $window.open(`/publicAccess/closePdf?binnacle_id=${dischargeId}`, '_blank');
              // Download excel
              if (isExport) {
                ReportService.generateExcelPerBinnacle(response.result.id, 2).then(() => {
                  notification.great('Registros exportados correctamente.');
                }, () => {
                  notification.error('Error al exportar registros.');
                });
              }
            },
            errorHandler = function (err) {
              $scope.isDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = function () {
              if (!$scope.itemsFound) return '010';
              // Default response
              return '001';
            };

        $scope.backToList = function () {
          $location.path('/');
        };

        $scope.discharge = {
          recordCodes: [],
          recordIdsExisting: []
        };

        $scope.colDef = [
          {
            columnHeaderDisplayName: '#',
            displayProperty: 'idx',
            width: '5%'
          },

          {
            columnHeaderDisplayName: 'Nro. Doc',
            templateUrl: 'features/records/templates/documentColumn.html',
            width: '30%'
          },
          {
            columnHeaderDisplayName: 'Destino',
            displayProperty: 'destination',
            width: '25%'
          }
        ];
        $scope.isTableVisible = false;

        $scope.tableConfig = {
          url: 'Document/list-short',
          method: 'get',
          params:{
            codes: '',
            reload: false
          },
          paginationConfig: {
            response: {
              totalItems: 'results.count',
              itemsLocation: 'results.list'
            }
          },
          state: {
            sortKey: 'idrecord',
            sortDirection: 'DEC'
          }
        };

        $scope.getRecords = function () {
          $scope.isTableVisible = true;
          $scope.tableConfig.params.codes = angular.copy($scope.discharge.recordCodes);
        };

        $scope.discharge = new DischargeSvc();
        $scope.save = function (form, isExport) {
          var codeVerification = preValidation();

          $scope.isDisabled = true;

          if (codeVerification == '001') {
            if (form.$valid) {
              $scope.discharge.action_id = 2;
              $scope.discharge.records = $scope.discharge.recordIdsExisting;
              $scope.discharge.discharge_date = moment($scope.discharge.discharge_date, 'DD/mm/YYYY')
                .format('YYYY-mm-DD');
              $scope.discharge.$save(function (response) {
                successHandler(response, isExport);
              }, errorHandler);
            } else {
              $scope.isDisabled = false;
              notification.warn('Debe llenar todos los campos obligatorios');
            }
          } else if (codeVerification == '010') {
            notification.warn('Debe asignar al menos un registro.');
          }
          $scope.isDisabled = false;
        };

        $scope.validateTableData = function (response) {
          var codesReturned;

          $scope.missingCodes = [];
          if ($scope.discharge.recordCodes && $scope.discharge.recordCodes.length) {
            codesReturned = response.items.map(function (a) {return a.code;});
            $scope.discharge.recordIdsExisting = response.items.map(function (a) {return a.idrecord;});
            $scope.itemsFound = codesReturned.length;

            if ($scope.discharge.recordCodes.length != codesReturned) {
              $scope.discharge.recordCodes.forEach(function (item) {
                if (codesReturned.indexOf(item) === -1) {
                  $scope.missingCodes.push(item);
                }
              });
            }
          }
        };
      }]);
})();
