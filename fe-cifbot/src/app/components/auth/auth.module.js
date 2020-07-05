import Session from '../auth/Session';
import AuthInterceptor from '../auth/authInterceptor';
import AuthUser  from '../auth/auth.config';
import AuthService from './auth.service';
import TokenService from './token.service';
const AuthModule = angular.module('app.auth', []);

AuthModule
  .run(AuthUser)
  .config(injectAuth)
  .config(noCacheInterceptor)
  .factory('AuthService', AuthService)
  .factory('Session', Session)
  .factory('AuthInterceptor', AuthInterceptor)
  .factory('TokenService', TokenService);

  /* @ngInject */
  function injectAuth ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector', function ($injector) {
        return $injector.get('AuthInterceptor');
      } ]);
  }

  injectAuth.$inject = ['$httpProvider'];

  /* @ngInject */
  function noCacheInterceptor ($httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    $httpProvider.defaults.headers.get[ 'If-Modified-Since' ] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get[ 'Cache-Control' ] = 'no-cache';
    $httpProvider.defaults.headers.get[ 'Pragma' ] = 'no-cache';
  }

  noCacheInterceptor.$inject = ['$httpProvider'];

export default AuthModule;
