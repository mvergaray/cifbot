(function () {
  'use strict';

  angular
    .module('doc.features')
    .component('operatorPicker', {
      templateUrl: 'features/records/operatorPicker/operatorPicker.html',
      controller: OperatorPickerCtrl,
      controllerAs: 'vm',
      bindings: {
        selectedOperator: '='
      }
    });

  /* @ngInject */
  function OperatorPickerCtrl (
    $mdMedia,
    $q,
    User,
    FilterPanelService
  ) {
    var vm = this,
      _userList = [];

    vm.expandFilter = _expandFilter;
    vm.searchTextChange = _querySearch;
    vm.querySearch = _querySearch;
    vm.selectedItemChange = _selectedItemChange;

    vm.$onInit = () => {
      _getUsersList(vm.selectedOperator);

      vm.placeholder = 'OPERARIO';
    };

    function _expandFilter () {
      FilterPanelService.openPanel();
    };

    function _getUsersList (id) {
      User.get({ limit: 20, id: id}, (data) => {

        if (id) {
          _userList = [data];
          vm.selectedItem = data;
        } else {
          _userList = data.results.list;
        }
      });
    }

    function _querySearch (query) {
      var defer = $q.defer();
      User.get({ limit: 20, name: query}, (data) => {
        defer.resolve(data.results.list);
      });

      return defer.promise;
    }

    function _selectedItemChange (item) {
      vm.selectedOperator = item ?  item.id : undefined;
    }
  }
})();
