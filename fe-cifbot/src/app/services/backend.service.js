/* @ngInject */
const BackendService = (
  $http
) => {
  //const prefix = 'http://localhost:3000',
  const prefix = 'http://198.199.65.100/api',
    backendSvc = {
      post: (url, data, config) => {
        return $http.post(
          `${prefix}${url}`,
          data,
          config
        );
      },

      request(method, type, data, params, headers) {
        let base;

        switch (method) {
          case 'post':
            base = $http.post(`${prefix}/${type}`, data);
            break;
          case 'get':
            base = $http.get(`${prefix}/${type}`, {
              params: params
            });
            break;
          case 'put':
            base = $http.put(`${prefix}${type}`, data);
            break;
          case 'delete':
            base = $http.delete(`${prefix}${type}`);
            break;
        }

        const request = base;

        return request
          .then(_ => _.data);
      }
    };

  return backendSvc;
};

export default BackendService;
