/* @ngInject */
const TokenService = function (
  $http,
  $q,
  $window,
  BackendService,
  Session,
  URLS
) {
  var service = {
      login: (user) => {
        var data = {
          username: user.email,
          password: user.password
        };

        return BackendService.post(
            URLS.LOGIN,
            data,
            (data) => {
              var str = [];
              for (var prop in data) {
                str.push(encodeURIComponent(prop) + '=' + encodeURIComponent(data[ prop ]));
              }

              return str.join('&');
            }
          )
          .then((response) => {
            // Save token into sessionStorage
            var token = Session.registerToken(response.data);
            return response.data;
          })
          .catch((er) => {
            if (er.status !== 401) {
              console.log('XHR Failed for getUserToken', er.data);
            }
            return $q.reject(er);
          });
      },
      /**
       * Revokes the specified access token and all other associated
       * credentials (refresh token, etc.)
       *
       * An Authorization header is REQUIRED (contaisn the token to be revoked).
       * @returns
       */
      logOut: function () {
        return $http({
          method: 'DELETE',
          url: URLS.TOKENS + '/access/',
          transformRequest: function (data) {
            var str = [];
            for (var prop in data) {
              str.push(encodeURIComponent(prop) + '=' + encodeURIComponent(data[ prop ]));
            }

            return str.join('&');
          }
        }).then(function (response) {
          $window.sessionStorage.setItem('loggedOut', true);
          $window.sessionStorage.removeItem('checklist_modified');
          Session.setLogguedOutSession();
          Session.setDidSignOutFlag();
          // We cannot test Logout while /me v1 and v2 are working together, cause we call v2 to get the token
          // then we call v1 and overwrite the info

          // Delete all account information
          //AccountService.clearAccounts();

          //analyticsService.onDestroySession();
          //Session.destroy();
        });
      }
    };

    return service;
};
/*
TokenService.$inject = [
  '$http',
  '$window'
];
*/
export default TokenService;