/* @ngInject */
const ProvidersService = (
  _,
  BackendService
) => {
  const service = {
    getProviders(filter) {
      return BackendService.request('get', 'providers', null, filter)
        .then((data) => {
          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        });
    },

    getProvider(id) {
      return BackendService.request('get', `providers/${id}`)
        .then((data) => {
          data.code = _.padStart(data.id, 4, '0');

          return data;
        });
    }
  };

  return service;
};

export default ProvidersService;
