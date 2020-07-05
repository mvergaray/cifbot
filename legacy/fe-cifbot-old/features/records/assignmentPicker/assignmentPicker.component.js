import './assignmentPicker.scss';

(function () {
  'use strict';

  angular
    .module('doc.features')
    .component('assignmentPicker', {
      templateUrl: 'features/records/assignmentPicker/assignmentPicker.html',
      controller: AssignmentPickerCtrl,
      controllerAs: 'vm',
      bindings: {
        selectedClient: '='
      }
    });

  /* @ngInject */
  function AssignmentPickerCtrl (
    Client,
    FilterPanelService
  ) {
    var vm = this,
      _clientList = [];

    vm.expandFilter = _expandFilter;
    vm.searchTextChange = _querySearch;
    vm.querySearch = _querySearch;
    vm.selectedItemChange = _selectedItemChange;

    vm.$onInit = () => {
      _getClientList();

      vm.placeholder = 'CLIENTE';
    };

    function _expandFilter () {
      FilterPanelService.openPanel();
    };

    function _getClientList () {
      Client.get({ limit: 50}, (data) => {
        _clientList = data.results.list;

        if (vm.selectedClient) {
          vm.selectedItem = _.find(_clientList, { id: vm.selectedClient });
        }
      });
    }

    function _querySearch (query) {
      var results = query ? _clientList.filter(_createFilterFor(query)) : _clientList;
      return results;
    };

    function _createFilterFor (query) {
      var lowercaseQuery = query.toLowerCase();

      return function filterFn(state) {
        return !lowercaseQuery || state.description
          .toLowerCase()
          .indexOf(lowercaseQuery) >= 0;
      };
    }

    function _selectedItemChange (item) {
      vm.selectedClient = item ?  item.id : undefined;
    }
  }
})();
