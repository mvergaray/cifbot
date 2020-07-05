const ToolbarCtrl = function (
  $scope,
  $location,
  $log,
  $mdSidenav,
  $timeout
) {
  var vm = this;

  vm.logout = _logout;
  vm.goToProfile = _goToProfile;
  vm.openSidebar = buildDelayedToggler('left');

  function _logout () {
    // Delete token
    $location.path('/');
  }

  function _goToProfile () {
    $location.path('/perfil');
  }

  function buildDelayedToggler(navID) {
    return debounce(function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;

    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
};

ToolbarCtrl.$inject = ['$scope',
  '$location',
  '$log',
  '$mdSidenav',
  '$timeout'];

export default ToolbarCtrl;