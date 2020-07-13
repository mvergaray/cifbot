/* @ngInject */
const AccountsService = (
  _,
  BackendService
) => {
  const service = {
    getList: (filter) => {
      return BackendService.request('get', 'accounts', null, filter)
        .then((data) => {
          _.each(data.results.list, (item) => {
            item.acc_number = _.padEnd(item.acc_number, 6, '0');
          });

          return data.results;
        });
    },

    get: (id) => {
      return BackendService.request('get', `accounts/${id}`)
        .then((data) => {
          data.acc_number = _.padEnd(data.acc_number, 6, '0');

          return data;
        });
    },

    update: (object, id) => {
      let endpoint = id ? `accounts/${id}` : 'accounts';

      return BackendService.request(id ? 'put' : 'post', endpoint, object)
        .then((data) => {
          return data.result;
        });
    },

    delete: (id) => {
      return BackendService.request('delete', `accounts/${id}`);
    }
  };

  return service;
};

export default AccountsService;
