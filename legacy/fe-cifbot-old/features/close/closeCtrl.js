(function () {
  angular.module('doc.features')
    .controller('CloseCtrl', [
      '$scope',
      '$filter',
      '$location',
      '$routeParams',
      'CloseSvc',
      'notification',
      'ReportService',
      'User',
      '$window',
      function ($scope, $filter, $location, $routeParams, CloseSvc, notification, ReportService, User, $window) {
        var successHandler = function (response, isExport) {
              $scope.isDisabled = false;
              $scope.backToList();
              notification.great('Registros cerrados correctamente.');
              let closeId = response.result.id;
              notification.warn('Se esta Generando el PDF del cierre. Por favor espere.');
              // Download PDF
              $window.open(`/publicAccess/closePdf?binnacle_id=${closeId}`, '_blank');
              // Download excel
              if (isExport) {
                ReportService.generateExcelPerBinnacle(response.result.id, 3).then(() => {
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
              if (!$scope.assignedTo) return false;

              if(!$scope.itemsFound) return '010';
              // Default response
              return '001';
            };

        $scope.backToList = function () {
          $location.path('/');
        };

        $scope.assignedTo = {};

        $scope.close = {
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
        $scope.isTableVisiable = false;

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

        $scope.deliveryUserConfig = {
          service: User,
          displayValue: 'full_name',
          placeholder: 'Seleccione un usuario.',
          required: true,
          initialValue: undefined,
          onSelectItem: function (item) {
            $scope.assignedTo = item;
          }
        };

        $scope.close = new CloseSvc();

        $scope.getRecords = function () {
          $scope.isTableVisiable = true;
          $scope.tableConfig.params.codes = angular.copy($scope.close.recordCodes);
        };

        $scope.save = function (form, isExport) {
          var codeVerification = preValidation();

          $scope.isDisabled = true;

          if (codeVerification == '001') {
            if (form.$valid) {

              $scope.close.action_id = 3;
              $scope.close.assigned_id = $scope.assignedTo.id;
              $scope.close.records = $scope.close.recordIdsExisting;
              $scope.close.$save(function (response) {
                successHandler(response, isExport);
              }, errorHandler);
            } else {
              $scope.isDisabled = false;
              notification.warn('Debe llenar todos los campos obligatorios');
            }
          } else if(codeVerification == '010') {
            notification.warn('Debe asignar al menos un registro.');
          } else {
            $scope.isDisabled = false;
            notification.warn('Debe llenar todos los campos obligatorios');
          }
          $scope.isDisabled = false;
        };

        $scope.validateTableData = function (response) {
          var codesReturned;

          $scope.missingCodes = [];
          if ($scope.close.recordCodes && $scope.close.recordCodes.length) {
            codesReturned = response.items.map(function (a) {return a.code;});
            $scope.close.recordIdsExisting = response.items.map(function (a) {return a.idrecord;});
            $scope.itemsFound = codesReturned.length;

            if ($scope.close.recordCodes.length != codesReturned) {
              $scope.close.recordCodes.forEach(function (item) {
                if (codesReturned.indexOf(item) === -1) {
                  $scope.missingCodes.push(item);
                }
              });
            }
          }
        };
      }]);
})();
