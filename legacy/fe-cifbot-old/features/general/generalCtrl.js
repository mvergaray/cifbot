import '../../sass/main.scss';

(function () {
  angular.module('doc.features')
    // Areas List
    .controller('GeneralCtrl', [
      '$scope',
      'CurrentUser',
      'permissionsV2',
      function ($scope, CurrentUser, permissionsV2) {
        // Load the permissionsV2 instead of CurrentUser to store the permissions data.
        // the change here should be upadte  $scope.currentUser  in children controllers
        $scope.currentUser = permissionsV2;
      }]);
})();
