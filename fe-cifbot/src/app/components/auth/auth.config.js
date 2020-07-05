/* @ngInject */
const AuthUser = function (
  $state,
  $transitions,
  AuthService,
  Session,
  StorageService,
) {
  const  ACCESS_MODES = {
    PRIVATE: 'private',
    PUBLIC: 'public'
  },
  publicStates = getPublicStates(),
  rootPath = 'app.rootPath',
  rootState = 'app';

  $transitions.onSuccess({ }, function(trans) {
    var sessionToken = Session.getToken(),
      toState = trans.to(),
      destination = getDestination(toState);

    if (isPublicState(toState.name)) {
      return;
    } else if (isPrivateAndHasNoToken(toState.accessMode, sessionToken)) {
      AuthService.setRedirectState(toState.name, toState);
    }

    if (sessionToken) {
      retrieveUserData(toState, toState);
    } else {
      verifyUserWithoutSessionToken(toState, destination, toState);
    }
  });

  function retrieveUserData (toState, toParams) {
    if (Session.accountId || !_.isEmpty(Session.accounts) ||
        Session.noAccounts) {
      if (isRootPath(toState.name) || isPublicState(toState.name)) {
        goToHome(Session.accountId);
      }
    } else {
      getUserAndRedirect(toState, toParams);
    }
  }

  function goToHome (accountId) {
    $state.go(rootState, {
      accountId: accountId
    });
  }

  function getUserAndRedirect (toState, toParams) {
  }

  function userIsAlreadyAuthenticated () {
    var allowSignin = StorageService.getItemFromLocalStorage('allowSignin');

    if (!allowSignin) {
      //e.preventDefault();
    }

    StorageService.setItemInLocalStorage(Session.storageEvents()
      .DID_SOLICITATE_AUTH_CREDENTIALS, new Date());

    $timeout(function () {
      var storageInfo = JSON.parse(StorageService
        .getItemFromLocalStorage(Session.storageEvents().DID_SET_AUTH_CREDENTIALS));

        StorageService.removeFromLocalStorage(Session.storageEvents()
        .DID_SET_AUTH_CREDENTIALS);
        StorageService.removeFromLocalStorage(Session.storageEvents()
        .DID_SOLICITATE_AUTH_CREDENTIALS);

      if (storageInfo) {
        Session.registerTokenObject(storageInfo);
        $state.transitionTo(rootState);
        return;
      } else {
        StorageService.setItemInLocalStorage('allowSignin', true);
        $state.go('signin');
      }
    }, 1);
  }

  function isPublicState (stateName) {
  return _.includes(publicStates, stateName);
  }

  function isPrivateAndHasNoToken (toStateAccessMode, sessionToken) {
    return toStateAccessMode === ACCESS_MODES.PRIVATE && !sessionToken;
  }

  function getPublicStates () {
    return _.map(_.filter($state.get(), function (state) {
      return state.accessMode !== 'private';
    }), 'name');
  }

 function getDestination (toState) {
  return (toState.name === rootPath ? rootState : (toState.name || rootState));
  }

 function verifyUserWithoutSessionToken (toState, destination, toParams) {
    var rememberMe = Session.getRememberMe();

    if (rememberMe && hasRememberMeExpired(rememberMe)) {
      redirectUserToSignin();

      return;
    }

    if (isPublicState(toState.name)) {
      if (rememberMe) {
        var justLoggedOut = StorageService.getItemFromSessionStorage('loggedOut');

        if (!justLoggedOut) {
          userJustLoggedOut(rememberMe, destination);
        }
      } else {
        userIsAlreadyAuthenticated(e);
      }
    } else {
      accessPrivateState(rememberMe, toState, toParams, destination);
    }
  }

 function accessPrivateState (rememberMe, toState, toParams, destination) {
  StorageService.setItemInLocalStorage(Session.storageEvents()
      .DID_SOLICITATE_AUTH_CREDENTIALS, new Date());

    var storageInfo = JSON.parse(StorageService
      .getItemFromLocalStorage(Session.storageEvents().DID_SET_AUTH_CREDENTIALS));

    StorageService.removeFromLocalStorage(Session.storageEvents()
      .DID_SET_AUTH_CREDENTIALS);
    StorageService.removeFromLocalStorage(Session.storageEvents()
      .DID_SOLICITATE_AUTH_CREDENTIALS);

    if (storageInfo) {
      Session.registerTokenObject(storageInfo);
      getUserAndRedirect(e, toState, toParams);
    } else {
      if (rememberMe) {
        return TokenService.refreshAccessToken(rememberMe.refresh_token)
          .then(function (response) {
            StorageService.removeFromLocalStorage(Session.storageEvents()
              .DID_SOLICITATE_AUTH_CREDENTIALS);
            Session.registerToken(response);
            $timeout(function () {
              $state.go(destination, toParams);
            }, 100);
            return;
          })
          .catch(function () {
            Session.clearRememberMe();
            $state.go('signin');
            return;
          });
      } else {
        $state.go('signin');
        return;
      }
    }
  }
};

export default AuthUser;