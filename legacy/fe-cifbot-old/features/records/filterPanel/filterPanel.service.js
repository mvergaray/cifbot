(function () {
  'use strict';

  angular
    .module('doc.features')
    .factory('FilterPanelService', FilterPanelService);

  /* @ngInject */
  function FilterPanelService (
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

    function _openPanel (searchKeys, clear) {
      var position, config,
        elem = angular.element('.c-record-filter-bar'),
        animation = $mdPanel.newPanelAnimation(elem);

      position = $mdPanel
        .newPanelPosition();

      position = position
        .relativeTo(elem)
        .addPanelPosition(
          $mdPanel.xPosition.ALIGN_START,
          $mdPanel.yPosition.BELOW
        );

      animation = animation
        .openFrom('.c-record-filter_left-icon')
        .closeTo('.c-record-filter_left-icon')
        .withAnimation($mdPanel.animation.SCALE);

      config = {
        attachTo: angular.element('record-filter'),
        template: '<filter-panel data-search-keys="vm.searchKeys" data-clear="vm.clear()"></filter-panel>',
        animation: animation,
        position: position,
        zIndex: 90,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false,
        trapFocus: false,
        openFrom: elem,
        fullscreen: $mdMedia('xs'),
        panelClass: 'md-whiteframe-3dp do-not-loose-selection',
        controller: function () {
        },
        controllerAs: 'vm',
        locals: {
          searchKeys: searchKeys,
          clear: clear
        },
        onRemoving: function () {
          _setPanelRef(undefined);
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