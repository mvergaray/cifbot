import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingSetService } from 'src/app/services/accountingSet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-accounting-set',
  templateUrl: './accounting-set.component.html',
  styleUrls: ['./accounting-set.component.scss']
})
export class AccountingSetComponent implements OnInit {

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  isCreationEnabled;
  displayedColumns: string[] = ['acc_number', 'acc_desc', 'edit'];
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchFilter;
  filterParams: any = {};
  pageEvent;

  constructor(
    private accountsSvc: AccountingSetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getAccountSet();
  }
  ngOnDestroy(): void {
  }

  goToCreate() {
    this.router.navigate(['/manage/cuentas-contables/new'], { relativeTo: this.activatedRoute });
  }

  goToEdit(receiptId) {
    this.router.navigate([`/manage/cuentas-contables/edit/${receiptId}`], { relativeTo: this.activatedRoute });
  }

  getAccountSet () {
    this.accountsSvc.getList({
      search: this.filterParams.search || '',
      page: this.filterParams.page || 0,
      limit: this.filterParams.limit || 20,
      skip: this.filterParams.skip || 0,
      sort: 'account',
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
    this.getAccountSet();
  }

  refreshList($event) {
    this.filterParams.limit = $event.pageSize;
    this.filterParams.page = $event.pageIndex;
    this.filterParams.skip = $event.pageIndex * $event.pageSize;
    this.getAccountSet();
  }
}
