
/* @ngInject */
const TransactionsService = (
  _,
  BackendService
) => {
  const service = {
    getTransactions(filter) {
      return BackendService.request('get', 'transactions', null, filter)
        .then((data) => {

          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        });
    },

    getTransaction(id) {
      return BackendService.request('get', `transactions/${id}`)
        .then((data) => {
            data.code = _.padStart(data.id, 4, '0');

            return data;
          });
    },

    updateTransaction(object, id) {
      let endpoint = id ? `transactions/${id}` : 'transactions';

      return BackendService.request(id ? 'put' : 'post', endpoint, object);
    },

    deleteTransaction(id) {
      return BackendService.request('delete', `transactions/${id}`);
    }
  };

  return service;
};

export default TransactionsService;
