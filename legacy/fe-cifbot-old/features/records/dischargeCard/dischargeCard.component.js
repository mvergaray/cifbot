import './dischargeCard.scss';

(() => {
  'use strict';
  angular
    .module('doc.features')
    .component('dischargeCard', {
      templateUrl: 'features/records/dischargeCard/dischargeCard.html',
      controller: DischargeCardCtrl,
      controllerAs: 'vm',
      bindings: {
        binnacle: '<'
      }
    });

  /* @ngInject */
  function DischargeCardCtrl (
    $window,
    notification,
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
  }
})();
