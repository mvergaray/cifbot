(function () {
  'use strict';

  angular
    .module('doc.features')
    .factory('FileViewerSvc', FileViewerSvc);

  /* @ngInject */
  function FileViewerSvc (
    $mdMedia,
    $mdPanel,
    $q,
  ) {
    var mdPanelRef;

    /**
     * Set the panel reference
     * @param {mdPanelRef} aMdPanelRef
     */
    function _setPanelRef (aPanelRef) {
      mdPanelRef = aPanelRef;
    }

    /**
     * Set the panel reference
     * @returns {mdPanelRef}
     */
    function _getPanelRef () {
      return mdPanelRef;
    }

    /**
     * Close panel
     * @return {IPromise}
     */
    function _closePanel () {
      var deferred = $q.defer();

      if (mdPanelRef) {
        mdPanelRef
          .close()
          .then(function () {
            if (mdPanelRef) {
              mdPanelRef.destroy();
              _setPanelRef(undefined);
            }

            deferred.resolve();
          });
      }

      return deferred.promise;
    }

    function _openPanel (documentCode, file) {
      let config,
        position = $mdPanel.newPanelPosition().absolute().center(),
        elem = angular.element('.c-record-filter-bar');

      config = {
        attachTo: angular.element(document.body),
        template: '<file-viewer data-file="vm.file" data-document-code="vm.documentCode" layout="column" flex="100" layout-fill></file-viewer>',
        position: position,
        zIndex: 90,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false,
        trapFocus: false,
        openFrom: elem,
        fullscreen: $mdMedia('xs'),
        panelClass: 'c-file-viewer md-whiteframe-3dp do-not-loose-selection',
        controller: function () {
        },
        controllerAs: 'vm',
        locals: {
          file: file,
          documentCode: documentCode
        },
        onRemoving: function () {
          if (mdPanelRef) {
            mdPanelRef.destroy();
          }
        }
      };

      $mdPanel.open(config)
        .then(function (panel) {
          _setPanelRef(panel);
        });
    }

    return {
      closePanel: _closePanel,
      openPanel: _openPanel
    };
  }
})();