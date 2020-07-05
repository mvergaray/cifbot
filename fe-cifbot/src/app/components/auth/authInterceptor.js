/* @ngInject */
const AuthInterceptor = function (
  $q,
  Session,
  URLS
  ) {
    /**
     * Response function
     *
     * @param {Object} response the response
     * @returns {Object}
     */
    function _response (response) {
      if (_isError(response)) {
        if (_isNotFromRefreshAccessTokenEndPoint(response)) {
          return _processErrorResponse(response);
        }
      } else {
        return response || $q.when(response);
      }
    }

    /**
     * Request function
     *
     * @param {Object} config the config file
     * @returns {Object}
     */
    function _request (config) {
      config.headers = config.headers || {};

      //if (_isApiV2(config)) {
        _processApiV2Headers(config);
      //}

      return config || $q.when(config);
    }

    /**
     * Process API v2 headers
     *
     * @param {Object} config the config file
     */
    function _processApiV2Headers (config) {
      var sessionToken = Session.getToken();

      config.headers[ 'Authorization' ] = 'my-auth-token';
      if (_.includes(config.url, '')) {
        config.headers[ 'Content-Type' ] = 'application/json';
      } else {
        config.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
      }

      if (sessionToken && sessionToken.access_token) {
        config.headers.Authorization = 'Bearer ' + sessionToken.access_token;
        config.headers[ 'Cache-Control' ] = 'no-store';
      }
    }

    /**
     * Is Error
     *
     * @param {Object} response
     * @returns {Boolean}
     */
    function _isError (response) {
      return response.status !== 200 &&
        response.status !== 201 &&
        response.status !== 204;
    }
  return {
    request: _request,
    response: _response
  };
};

export default AuthInterceptor;