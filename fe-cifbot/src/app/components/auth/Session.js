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
            return _.get(JSON.parse(rawToken), 'token');
          }
        },

        getRememberMe: () => {
          return JSON.parse($window.localStorage.getItem(rememberMeKey));
        },

        getUserLogged: () => {
          var rawToken = $window.sessionStorage.getItem(authTokenKey);
          if (rawToken) {
            return _.get(JSON.parse(rawToken), 'user');
          }
        },

        registerToken: function (data) {
          service.registerTokenObject(data);
        },

        registerTokenObject: function (object) {
          // Stores token in HTML's sessionStorage
          $window.sessionStorage.setItem(authTokenKey, JSON.stringify(object));
        },

        setDidSignOutFlag: function () {
          $window.localStorage.setItem(this.storageEvents().DID_SIGN_OUT, true);
        },

        setLogguedOutSession: function () {
          $window.sessionStorage.setItem(SessionDidSignOut, true);
        },
      };

    return service;
};

export default Session;
