/* @ngInject */
const Toast = function ($mdToast) {
  /**
   *
   * @param {*} message
   * @param {*} action
   * @param {*} opts
   */
  function _show (html, action, delay) {
    /* @ngInject */
    function mdToastController ($mdToast) {
      this.resolve = function () {
        $mdToast.hide();
      };
    }

    return $mdToast.show(
      $mdToast.build()
        .template('<md-toast>' +
          '<div class="md-toast-content" flex layout="row" layout-align="space-between">' +
          html +
          '<md-button md-no-ink class="md-primary" ng-click="toast.resolve()" style="color: rgb(3,169,244)">' +
          action +
          '</md-button>' +
          '</div>' +
          '</md-toast>')
        .controllerAs('toast')
        .controller(mdToastController)
        .hideDelay(delay)
    );
  }

  function _error () {

  }

  function _great () {

  }

  return {
    show: _show,
    error: _error,
    great: _great
  };
};

export default Toast;
