(() => {

  angular
    .module('doc.features')
    .component('seSelector', {
      templateUrl: 'features/common/seSelector/seSelector.html',
      controller: seSelectorCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '='
      }
    });

  /* @ngInject */
  function seSelectorCtrl (permissionsV2) {
    var vm = this,
        service,
        getData = (name, id) => {
          service[vm.config.method || 'get']({limit: 10, name: name, id: id}, (data) => {

            if (vm.config.loadEverything && vm.config.initialValue) {
              vm.data = data.results.list;
              if (!_.find(vm.data, {id: vm.config.initialValue})) {
                vm.data.push(vm.config.initialItem);
              }
              vm.onSelect(vm.config.initialValue);
            } else {
              if (id) {
                vm.data = _.get(data, 'results.list.length') ? data.results.list : [data];
                vm.onSelect(_.get(_.first(vm.data), 'id'));
              } else {
                vm.data = data.results.list;
              }
            }
          });
        };

    vm.isSelectDisabled = _isSelectDisabled;

    vm.refreshItems = function (searchText) {
      if (vm.config.initialValue && !vm.config.loadEverything) {
        getData(undefined, vm.config.initialValue);
        vm.config.initialValue = undefined;
      } else {
        getData(searchText);
      }
    };

    vm.onSelect = function (item) {
      var itemSelected = (vm.data || [])
          .find(function (i) {return i.id === item;}),
          params = ['id', 'ubigeo_desc', 'ubigeo_id'],
          result = {};

      if (_.get(vm.config, 'custom_params.length')) {
        params = _.concat(params, vm.config.custom_params);
      } else {
        // Add params by default for 'User' service
        params.push('name', 'last_name', 'full_name', 'office_name', 'area_name', 'client_id');
      }

      params.forEach(function (i) {
        if (itemSelected) {
          result[i] = itemSelected[i];
        }
      });

      vm.config.onSelectItem(result);
    };

    vm.$onInit = () => {
      service = vm.config.service;

      vm.model = vm.config.initialValue;
      vm.propFilter = function (searchText) {
        var result = {};

        result[vm.config.displayValue] = searchText;
        return result;
      };

    };

    function _isSelectDisabled () {
      return vm.data && vm.data.length < 1 ||
        !(permissionsV2.isAllowed('records', '_create') ||
        permissionsV2.isAllowed('records', '_edit'));
    }
  }
})();
