import './fileViewer.scss'

(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('fileViewer', {
      templateUrl: 'features/records/fileViewer/fileViewer.html',
      controller: FileViewerCtrl,
      controllerAs: 'vm',
      bindings: {
        documentCode: '<',
        file: '<'
      }
    });

  /* @ngInject */
  function FileViewerCtrl (
    _,
    $mdMedia,
    FileViewerSvc
  ) {
    var vm = this;

    vm.mdMediaXs = $mdMedia('xs');
    vm.mdMediaGtXs = $mdMedia('gt-xs');
    vm.closePanel =_closePanel;

    vm.$onInit = () => {
      vm.isValidPreview = _isContentDispositionInline();
    };

    vm.$onDestroy = () => {
    };

    function _closePanel () {
      FileViewerSvc.closePanel();
    }

    function _getExtension () {
      var regex = /\.[0-9a-z]+$/i;
      return _.toLower(_.first(vm.file.url.match(regex)));
    }

    function _isContentDispositionInline () {
      var extension = _getExtension();
      return _.includes(['.jpeg', '.jpg', '.png' ], extension);
    }
  }
})();
