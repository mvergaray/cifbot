import './imSelect.scss';

angular
  .module('doc.features')
  .directive('imSelect', function () {
    return {
      restrict: 'E',
      templateUrl: 'core/imSelect/imSelect.html',
      scope: {
        config: '='
      },
      controller: ['$scope',
      function ($scope) {
        var vm = $scope;

        vm.defaultConfig = {
          method: 'GET',
          params: {
            name: ''
          },
          paginationConfig: {
            response: {
              totalItems: 'results.count',
              itemsLocation: 'results.list'
            }
          }
        };

        angular.extend(vm.config, vm.defaultConfig);
        vm.dlc = function(success, response) {
          if (vm.config.onDataLoaded) {
            vm.config.onDataLoaded(success, response);
          }
        };
      }]
    };
  });
