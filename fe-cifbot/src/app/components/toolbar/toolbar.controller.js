/* @ngInject */
const ToolbarCtrl = function (
  $scope,
  $location,
  $log,
  $mdSidenav,
  $state,
  $timeout,
  AuthService,
  TokenService
) {
  var vm = this;

  vm.getPageTitle = _getPageTitle;
  vm.goToProfile = _goToProfile;
  vm.logout = _logout;
  vm.openSidebar = buildDelayedToggler('left');

  function _logout () {
    // Delete token
    AuthService.setRedirectState(undefined, undefined);
    TokenService.logOut();
    $state.go('signin');
  }

  function _getPageTitle () {
    return $state.current.title;
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

export default ToolbarCtrl;