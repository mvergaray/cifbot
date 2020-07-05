import './recordMenu.scss';

(function () {
  'use strict';

  angular
    .module('doc.features')
    .component('recordMenu', {
      templateUrl: 'features/records/recordMenu/recordMenu.html',
      controller: RecordMenuCtrl,
      controllerAs: 'vm',
      bindings: {
      }
    });

  /* @ngInject */
  function RecordMenuCtrl (
    $rootScope,
    $routeParams,
    $window,
    notification,
    permissionsV2,
    Upload
  ) {
    var vm = this,
        recordId;

    vm.printRecord = _printRecord;
    vm.saveData = _saveData;
    vm.showAddAttachment = _showAddAttachment;

    vm.$onInit = () => {
      vm.customer = {};
      recordId = $routeParams.id || 0;
    };

    function _printRecord () {
      $window.open(`/publicAccess/print/${recordId}`, '_blank');
    }

    function _saveData (file) {
      if (file && file.length) {
        Upload.upload({
          url: `Document/${recordId}/attachments`,
          data: {
            attachments: file,
            record_id: recordId
          }
        }).then(function () {
          notification.great('Archivo adjuntado correctamente');
          $rootScope.$broadcast('refreshRecordEvent');
        }, function (error) {
          notification.warn(error && error.message ? error.message :
            'Los archivos no se pudieron adjuntar.');
        });
      }
    }

    function _showAddAttachment () {
      return permissionsV2.role_id !== 3;
    }
  }
})();
