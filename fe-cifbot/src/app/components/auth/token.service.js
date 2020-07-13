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
      logOut: function () {
          $window.sessionStorage.setItem('loggedOut', true);
          Session.setLogguedOutSession();
          Session.setDidSignOutFlag();
      }
    };

    return service;
};

export default TokenService;