(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('bulkLocations', {
      templateUrl: './features/bulkActions/locations/bulkLocations.html',
      controller: bulkLocationsCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });


  /* @ngInject */
  function bulkLocationsCtrl (
    Folders, notification
  ) {
    let vm = this;

    vm.$onInit = () => {
      vm.folders = [];

      getFolders();
    }

    function getFolders() {
      Folders.get({}, function (response) {
        if (!_.get(response, 'results.list.length')){
          vm.folders = [{
            name: ''
          }];
        } else {
          vm.folders = _.get(response, 'results.list');
        }
      });
    }

    vm.addFolder = function () {
      vm.folders.push({
        name: ''
      });
    };

    vm.removeFolder = function (idx) {
      vm.folders.splice(idx, 1);
    };

    vm.save = function () {
      let folders = _.map(vm.folders, (item) => {
        let name = _.get(item, 'name');
        return name ? name.replace(/ /g, '').toLowerCase() : '';
      });
      Folders.save({folders: _.uniq(folders)}, function () {
        notification.great('Folders actualizados.');
        getFolders();
      }, function () {
        notification.error('Error al guardar folders.');
      });
    };
  }
})();
