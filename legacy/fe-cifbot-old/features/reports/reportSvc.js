(function () {
  angular
    .module('doc.features')
    .factory('ReportService', ['$http', 'Blob', 'FileSaver', 'notification',
      function ($http, Blob, FileSaver, notification) {
        var vm = this;

        vm.generateExcelPerIds = function (ids) {
          return new Promise((resolve, reject) => {
            $http({
              url: '/publicAccess/generateExcel',
              data: {ids: ids},
              method: 'POST',
              responseType: 'arraybuffer',
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              }
            }).then(function (response) {
              var b;

              if (response.status === 200) {
                b = new Blob([response.data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                FileSaver.saveAs(b, 'Etiquetas.xlsx');
                resolve();
              } else {
                reject(response.statusText);
              }
            }, function () {
              reject('Error al exportar registro.');
            });
          });
        };

        vm.generateExcelPerBinnacle = function (binnacle_id, action_id) {
          return new Promise((resolve, reject) => {
            $http({
              url: '/publicAccess/generateBinnacleExcel',
              data: {
                action_id: action_id,
                binnacle_id: binnacle_id
              },
              method: 'POST',
              responseType: 'arraybuffer',
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              }
            }).then((response) => {
              var b;

              if (response.status === 200) {
                b = new Blob([response.data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                FileSaver.saveAs(b, 'Etiquetas.xlsx');//this is FileSaver.js function
                resolve();
              } else {
                reject(response.statusText);
              }
            }, () => {
              reject('Error al exportar registros.');
            });
          });
        };

        vm.generateFullExcel = function (filter) {
          var url = '/publicAccess/generateFullExcel',
              accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              filetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              fileName = 'Etiquetas.xlsx';

          return $http({
            url: url,
            data: filter,
            method: 'POST',
            responseType: 'arraybuffer',
            headers: {
              'Content-type': 'application/json',
              'Accept': accept
            }
          }).then(function (response) {
            var b;
            if (response.status === 200) {
              b = new Blob([response.data], {
                type: filetype
              });
              FileSaver.saveAs(b, fileName);
            } else {
              notification.warn(response.statusText);
            }
          }, function () {
            notification.error('Error al generar documento');
          });
        };

        vm.generateSmallTickets = function (ids, isTicket) {
          return $http({
            url: '/publicAccess/tickets',
            data: {
              ids: ids,
              is_ticket: isTicket ? 1 : 0
            },
            method: 'POST',
            responseType: 'arraybuffer',
            headers: {
              'Content-type': 'application/json',
              'Accept': 'application/pdf'
            }
          }).then(function (response) {
            var b;
            if (response.status === 200) {
              b = new Blob([response.data], {
                type: 'application/pdf'
              });
              FileSaver.saveAs(b, (isTicket ? 'Etiquetas' : 'Cargo de área') + '.pdf');
            } else {
              notification.warn(response.statusText);
            }
          }, function () {
            notification.error('Error al generar documento');
          });
        };

        vm.downloadTemplate = () => {
          return new Promise((resolve, reject) => {
            $http({
              url: '/publicAccess/template',
              method: 'POST',
              responseType: 'arraybuffer',
              headers: {
                'Content-type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              }
            }).then(function (response) {
              var b;

              if (response.status === 200) {
                b = new Blob([response.data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                FileSaver.saveAs(b, 'Plantilla-Carga.xlsx');
                resolve();
              } else {
                reject(response.statusText);
              }
            }, function () {
              reject('Error al exportar registro.');
            });
          });
        };

        return this;
      }]);
})();
