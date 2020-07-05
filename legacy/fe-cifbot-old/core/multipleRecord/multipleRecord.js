angular
  .module('doc.features')
  .directive('multipleRecord', function () {
    return {
      restrict: 'E',
      templateUrl: 'core/multipleRecord/multipleRecord.html',
      scope: {
        disabled: '=',
        data: '='
      },
      controller: ['$scope', function ($scope) {
        var vm = $scope;

        vm.data = [{
          document: '',
          reference: ''
        }];

        vm.addRecord = function () {
          vm.data.push({
            document: '',
            reference: ''
          });
        };

        vm.removeRecord = function (idx) {
          vm.data.splice(idx, 1);
        };

        return vm;
      }]
    };
  });
