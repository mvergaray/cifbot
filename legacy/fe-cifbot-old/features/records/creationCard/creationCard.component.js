import './creationCard.scss';

(() => {
  'use strict';
  angular
    .module('doc.features')
    .component('creationCard', {
      templateUrl: 'features/records/creationCard/creationCard.html',
      controller: CreationCardCtrl,
      controllerAs: 'vm',
      bindings: {
        document: '<'
      }
    });

  /* @ngInject */
  function CreationCardCtrl () {
    var vm = this;
  }
})();
