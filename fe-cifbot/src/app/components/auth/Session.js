/* @ngInject */
const Session = function (
  $q,
  $window,
  _
  ) {
    let authTokenKey = 'cifbot_token',
      rememberMeKey = 'cifbot_remember_session',
      didSetAuthCredentials = 'didSetAuthCredentials',
      SessionDidSignOut = 'SessionDidSignOut',

      service = {
        create: function (data) {
          this.login = data.login;

          if (!_.isEmpty(data.login)) {

          }

          $window.localStorage.removeItem('allowSignin');
        },

        storageEvents: function () {
          return {
            DID_SOLICITATE_AUTH_CREDENTIALS: 'didSolicitateAuthCredentials',
            DID_SET_AUTH_CREDENTIALS: 'didSetAuthCredentials',
            DID_SIGN_OUT: 'didSignOut'
          };
        },
        /**
         * Returns the current authentication token object.
         *
         * @returns
         */
        getToken: () => {
          var rawToken = $window.sessionStorage.getItem(authTokenKey);
          if (rawToken) {
            return JSON.parse(rawToken);
          }
        },

        getRememberMe: () => {
          return JSON.parse($window.localStorage.getItem(rememberMeKey));
        },

        registerToken: function (data) {
          service.registerTokenObject(data);
        },

        registerTokenObject: function (object) {
          // Stores token in HTML's sessionStorage
          $window.sessionStorage.setItem(authTokenKey, JSON.stringify(object.token));
        },
      };

    return service;
};

export default Session;
