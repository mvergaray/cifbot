import './assignmentCard.scss';

(() => {
  'use strict';
  angular
    .module('doc.features')
    .component('assignmentCard', {
      templateUrl: 'features/records/assignmentCard/assignmentCard.html',
      controller: AssignmentCardCtrl,
      controllerAs: 'vm',
      bindings: {
        binnacle: '<'
      }
    });

  /* @ngInject */
  function AssignmentCardCtrl (
    $window,
    Folders,
    notification,
    RecordService,
    ReportService
  ) {
    var vm = this;

    vm.downloadManifest = (binnacle_id, action_id) => {
      if (action_id == 1) {
        $window.open(`/publicAccess/assignPdfDownload?binnacle_id=${binnacle_id}`, '_blank');
      } else {
        $window.open(`/publicAccess/closePdf?binnacle_id=${binnacle_id}`, '_blank');
      }

      ReportService.generateExcelPerBinnacle(binnacle_id, action_id).then(() => {
        notification.great('Registros exportados correctamente');
      }, () => {
        notification.error('Error al generar documento');
      });
    };

    vm.downloadSignedManifest = (binnacle_id) => {
      Folders.get({}, (response) => {
        let foldersList = _.map(_.get(response, 'results.list'), 'name');
        RecordService.getFilesName({ code: binnacle_id, isManifest: true, folders: foldersList }).then((data) => {
          if (data && data.length) {
            data.forEach((code) => {
              RecordService.downloadReceipt(code, true);
            });
          } else {
            notification.warn('No se encontró ningún registro con código: ' + binnacle_id);
          }
        }, () => {
          notification.warn('No se encontró ningún manifiesto con código: ' + binnacle_id);
        });
      }, () => {
        notification.error('Error al obtener listado de folders.');
      });
    };
  }
})();
