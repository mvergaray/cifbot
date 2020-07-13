/* @ngInject */
class ProvisionsListCtrl {

  constructor (
    ReceiptsService
  ) {
    this.ReceiptsService = ReceiptsService;

    this.selected = [];
    this.query = {
      order: 'name',
      limit: 5,
      page: 1
    };
    this.filterParams = {};
    this.receipts = [];
  }

  $onInit () {
    this.getReceipts();
  }

  getReceipts () {
    this.promise =  this.ReceiptsService.getReceipts({
      search: this.filterParams.search || '',
      operation_type_id: 5,
      page: this.filterParams.page || 0,
      limit: this.filterParams.limit,
      skip: this.filterParams.skip || 0,
      sort: 'id',
      sort_dir: 'asc'
    })
      .then((receipts) => {
        this.receipts = receipts.list;
      });
  }

  searchByName() {
    this.paginator.firstPage();
    this.filterParams.search = this.searchFilter.trim().toLowerCase();
    this.getReceipts();
  }

  refreshList($event) {
    this.filterParams.limit = $event.pageSize;
    this.filterParams.page = $event.pageIndex;
    this.filterParams.skip = $event.pageIndex * $event.pageSize;
    this.getReceipts();
  }
};

export default ProvisionsListCtrl;
