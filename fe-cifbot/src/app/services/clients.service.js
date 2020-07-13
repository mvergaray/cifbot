/* @ngInject */
const ClientsService = (
  _,
  BackendService
) => {
  const service = {
    getClients(filter) {
      return BackendService.request('get', 'clients', null, filter)
        .then((data) => {
          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        });
    },

    getClient(id) {
      return BackendService.request('get', `clients/${id}`)
        .then((data) => {
          data.code = _.padStart(data.id, 4, '0');

          return data;
        });
    }
  };

  return service;
};

export default ClientsService;
