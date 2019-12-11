import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptsService } from 'src/app/services/receipts.service';

@Component({
  selector: 'app-purchases-list-page',
  templateUrl: './purchases-list-page.component.html',
  styleUrls: ['./purchases-list-page.component.scss']
})
export class PurchasesListPageComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  isCreationEnabled;
  displayedColumns: string[] = ['number', 'client', 'date', 'due_date', 'total', 'tax', 'edit', 'outcome'];
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchFilter;
  filterParams: any = {};
  pageEvent;

  constructor(
    private receiptsSvc: ReceiptsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getReceipts();
  }
  ngOnDestroy(): void {
  }

  goToCreate() {
    this.router.navigate(['/manage/purchases/new'], { relativeTo: this.activatedRoute });
  }

  goToEdit(receiptId) {
    this.router.navigate([`/manage/purchases/edit/${receiptId}`], { relativeTo: this.activatedRoute });
  }

  openOutcomes(receiptId) {
    this.router.navigate([`/manage/purchases/${receiptId}/outcome`], { relativeTo: this.activatedRoute });
  }

  getReceipts () {
    this.receiptsSvc.getReceipts({
      search: this.filterParams.search || '',
      operation_type_id: 1,
      page: this.filterParams.page || 0,
      limit: this.filterParams.limit || 20,
      skip: this.filterParams.skip || 0,
      sort: 'id',
      sort_dir: 'asc'
    })
      .subscribe(result => {
        this.listDataSource.data = result.list;
        this.paginator.length = result.count;
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
}
