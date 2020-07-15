/* @ngInject */
class PurchasesListCtrl {

  constructor (
    $state,
    ReceiptsService,
    ROUTES
  ) {
    this.$state = $state;
    this.ReceiptsService = ReceiptsService;

    // Constants
    this.ROUTES = ROUTES;

    this.dateFormat = 'YYYY-MM-DD';

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
      operation_type_id: 1,
      page: this.filterParams.page || 0,
      limit: 5000,
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

  goToCreate () {
    this.$state.go(this.ROUTES.PURCHASES_NEW);
  }

  openReceipt (receiptId) {
    this.$state.go(this.ROUTES.PURCHASES_EDIT, {
      receiptId
    });
  }

  goToPayment (receiptId) {
    this.$state.go(this.ROUTES.OUTCOME_NEW, {
      receiptId
    });
  }
};

export default PurchasesListCtrl;
