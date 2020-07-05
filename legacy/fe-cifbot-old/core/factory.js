(function () {
  var HOST = 'http://localhost:8080';
  angular
    .module('doc.features')
  /**
   * Show notification using angular strap
   */
    .factory('notification', ['$alert', function ($alert) {
      return {
        // @todo : it sounds cool :D but seriously it would be better XD
        great: function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'success',
            show: true,
            container: '.message',
            duration: '8',
            animation: 'am-fade-and-slide-top'
          });
        },
        warn: function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'warning',
            show: true,
            container: '.message',
            duration: '8',
            animation: 'am-fade-and-slide-top'
          });
        },
        error : function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'danger',
            show: true,
            container: '.message',
            duration: '8',
            animation: 'am-fade-and-slide-top'
          });
        },
        genericErrorHandler: function (response) {
          $alert({
            title: response.message || 'Opps algo paso, Por favor refresque la pagina.',
            placement: 'top',
            type: 'danger',
            show: true,
            container: '.message',
            duration: '8',
            animation: 'am-fade-and-slide-top'
          });
        }
      };
    }])
    .factory('CurrentUser', ['$resource', function ($resource) {
      var CurrentUser = $resource(HOST + '/Auth', {});

      /**
       *
       * @param {array} table from entities table
       * @param {string} permission from restriction column , _view, _create, _edit, _delete
       * @returns {boolean} returns permission
       */
      CurrentUser.prototype.isAllowed = function (table, permission) {
        table = table.toUpperCase();

        if (this.role_id === 2) {
          // Role 2 is administrador , has total access
          return true;
        }

        return this.restrictions &&
          this.restrictions[table] &&
          this.restrictions[table][permission] &&
          this.restrictions[table][permission] === 1;
      };

      return CurrentUser;
    }])
    /**
     * This factory allow to share the data among all app ,
     * in the beginning is a Promise, after the firt call is an Object with properties
     * In Controller, It can be used as an Object due that in route.js It was added as a dependecy for controllers
     * In directives, we must valide if It is and Object or promise.
     */
    .factory('permissionsV2', ['CurrentUser', function (CurrentUser) {
      var data = CurrentUser.get(
        // Allow this comments to verfiy when the promise is loaded
        //(data) => { console.log('Permissions Loaded', data); }
      );
      // console.log('factory executed');
      return data;
    }]);
})();
