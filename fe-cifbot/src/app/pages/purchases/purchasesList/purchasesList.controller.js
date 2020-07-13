/* @ngInject */
class PurchasesListCtrl {

  constructor (
    $state,
    ReceiptsService
  ) {
    this.$state = $state;
    this.ReceiptsService = ReceiptsService;

    this.selected = [];
    this.query = {
      order: 'name',
      limit: 5,
      page: 1
    };
    this.filterParams = {};
    this.receipts = [];

    this.formState = 'app.purchasesForm';
    this.newFormState = 'app.purchasesNew';
  }

  $onInit () {
    this.getReceipts();
  }

  getReceipts () {
    this.promise =  this.ReceiptsService.getReceipts({
      search: this.filterParams.search || '',
      operation_type_id: 1,
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

  goToCreate () {
    this.$state.go(this.newFormState);
  }

  openReceipt (receiptId) {
    this.$state.go(this.formState, {
      receiptId
    });
  }
};

export default PurchasesListCtrl;
