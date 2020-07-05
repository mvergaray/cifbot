import './attachmentsCard.scss'
(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('attachmentsCard', {
      templateUrl: 'features/records/attachmentsCard/attachmentsCard.html',
      controller: AttachmentsCardCtrl,
      controllerAs: 'vm',
      bindings: {
        documentCode: '<'
      }
    });

  /* @ngInject */
  function AttachmentsCardCtrl (
    $scope,
    $routeParams,
    AttachmentsSvc,
    FileViewerSvc
  ) {
    let vm = this;

    vm.displayAttachment = _displayAttachment;

    vm.$onInit = () => {
      _getAttachments();
    };

    vm.$onDestroy = () => {
      vm.onRefreshRecordEventListener();
    }

    vm.onRefreshRecordEventListener = $scope.$on('refreshRecordEvent', () => {
      _getAttachments();
    });

    function _displayAttachment (file) {
      FileViewerSvc.openPanel(vm.documentCode, file);
    }

    function _getAttachments () {
      AttachmentsSvc.get({ id: $routeParams.id },
        attachments => {
          vm.attachments = _.get(attachments, 'result.list');
        });
    }
  }
})();
