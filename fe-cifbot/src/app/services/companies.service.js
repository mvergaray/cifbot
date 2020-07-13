/* @ngInject */
const CompaniesService = (
  _,
  BackendService
) => {
  const service = {
    getList: (filter) => {
      return BackendService.request('get', 'companies', null, filter)
        .then((data) => {

            _.each(data.results.list, (item) => {
              item.code = _.padStart(item.id, 4, '0');
            });

            return data.results;
        });
    },

    get: (id) => {
      return BackendService.request('get', `companies/${id}`)
        .then((data) => {
            data.code = _.padStart(data.id, 4, '0');

            return _.first(data.results.list);
        });
    },

    update: (object, id) => {
      let endpoint = id ? `companies/${id}` : 'companies';

      return BackendService.request(id ? 'put' : 'post', endpoint, object)
        .then(_ => _.result);
    },

    delete(id) {
      return BackendService.request('delete', `companies/${id}`);
    }
  };

  return service;
};

export default CompaniesService;
