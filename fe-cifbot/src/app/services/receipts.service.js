/* @ngInject */
const ReceiptsService = (
  _,
  BackendService
) => {
  const service = {
    getReceipts(filter) {
      return BackendService.request('get', 'receipts', null, filter)
        .then(data => {
          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        });
    },

    getReceipt(id) {
      return BackendService.request('get', `receipts/${id}`)
      .then(data => {
          data.code = _.padStart(data.id, 4, '0');

          return data;
        });
    },

    updateReceipt (object, id) {
      let endpoint = id ? `receipts/${id}` : 'receipts';

      return BackendService.request(id ? 'put' : 'post', endpoint, object);
    },

    deleteReceipt(id) {
      return BackendService.request('delete', `receipts/${id}`);
    }
  };

  return service;
};

export default ReceiptsService;