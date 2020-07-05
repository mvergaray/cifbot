import './recordsMenu.scss'

(function () {
  'use strict';

  angular
    .module('doc.features')
    .component('recordsMenu', {
      templateUrl: 'features/records/recordsMenu/recordsMenu.html',
      controller: RecordsMenuCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        filterParams: '<'
      }
    });

  function RecordsMenuCtrl (
    $location,
    notification,
    permissionsV2,
    ReportService
  ) {
    var vm = this;

    vm.showActionButtons = _showActionButtons;
    vm.showReportButtons = _showReportButtons;

    vm.redirectTo = (action_id) => {
      switch(action_id) {
        case 1 :
          return $location.path('assign');
        case 2 :
          return $location.path('discharge');
        case 3 :
          return $location.path('close');
        default :
          return $location.path('document/create');
      }
    };

    vm.generateTickets = (type) => {
      var ids = vm.config.selectedRecords.map((i) => {
        return i.idrecord;
      });

      if (ids && ids.length) {
        switch (type) {
          case 'ticket':
            vm.config.isTicketLoading = true;
            ReportService.generateSmallTickets(ids, true).then(() => {
              vm.config.isTicketLoading = false;
            });
            break;
          case 'certificate':
            vm.config.isCertificateLoading = true;
            ReportService.generateSmallTickets(ids, false).then(() => {
              vm.config.isCertificateLoading = false;
            });
            break;
          case 'excel':
            vm.config.isExcelLoading = true;
            ReportService.generateExcelPerIds(ids).then(() => {
              vm.config.isExcelLoading = false;
            }, (error) => {
              vm.config.isExcelLoading = false;
              notification.error(error);
            });
            break;
        }
      }
    };

    vm.isTicketDisabled = () => {
      return !(vm.config.selectedRecords && vm.config.selectedRecords.length);
    };

    vm.generateFullExcel = () => {
      var params = {},
          msToDaysFactor = 86400000,
          dateParts,
          dayDiff;


      params.client_id = vm.filterParams.client_id;
      params.code = vm.filterParams.code;
      params.binnacle_id = vm.filterParams.binnacle_id;
      params.document = vm.filterParams.document;
      params.destination = vm.filterParams.destination;
      params.sender = vm.filterParams.sender;
      params.status = vm.filterParams.status;
      params.created_by = vm.filterParams.created_by;

      if (vm.filterParams.start_date) {
        params.startDate = moment(vm.filterParams.start_date).unix() * 1000;
      }

      if (vm.filterParams.end_date) {
        params.endDate = moment(vm.filterParams.end_date).unix() * 1000;
      }

      dayDiff = (params.endDate - params.startDate) / msToDaysFactor;

      if (!params.binnacle_id) {
        if (!params.startDate || !params.endDate) {
          notification.warn('Debe seleccionar un rango de fechas');
        } else if (dayDiff > 31) {
          notification.warn('El rango de fechas no debe ser mayor a 31 días');
        } else {
          vm.config.isFullLoading = true;
          ReportService.generateFullExcel(params).then(() => {
            vm.config.isFullLoading = false;
          });
        }
      } else {
        vm.config.isFullLoading = true;
        ReportService.generateFullExcel(params).then(() => {
          vm.config.isFullLoading = false;
        });
      }
    };

    function _showActionButtons () {
      return permissionsV2.isAllowed('records', '_create');
    }
    function _showReportButtons () {
      return permissionsV2.isAllowed('records', '_view');
    }
  }
})();
