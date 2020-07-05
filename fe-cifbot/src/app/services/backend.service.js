/* @ngInject */
const BackendService = (
  $http
) => {
  const prefix = 'http://localhost:3000',
    backendSvc = {
    post: (url, data, config) => {
      return $http.post(
        `${prefix}${url}`,
        data,
        config
      );
    }
  };

  return backendSvc;
};

export default BackendService;