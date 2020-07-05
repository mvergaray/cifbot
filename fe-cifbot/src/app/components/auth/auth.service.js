/* @ngInject */
const AuthService = function (
  $log,
  $q,
  $state,
  Session,
  TokenService
) {
  let redirectTo = {
    url: undefined, params: undefined
  },
  authService = {
    getRedirectState: function () {
      return redirectTo;
    },

    setRedirectState: (url, params) => {
      redirectTo = {
        url: url,
        params: params
      };
    },

    login: (user) => {
      return TokenService.login(user)
        .then(getUserInfo)
        .then(function (response) {
          Session.create(response);

          if (angular.isDefined(authService.getRedirectState().url)) {
            var redirectTo = authService.getRedirectState();

            if (redirectTo.params && redirectTo.params.accountId) {
              Session.setDefaultAccount(redirectTo.params.accountId);
            }

            $state.go(redirectTo.url, redirectTo.params);
          } else {
            $state.go('app.home', {
              accountId: Session.accountId
            });
          }
          authService.setRedirectState(undefined);

          return response;
        })
        .catch(function (error) {
          $log.log(error);
          return $q.reject(error);
        });
    }
  },

  getUserInfo = (data) => {
    return data.user;
  };

  return authService;
};

export default AuthService;
