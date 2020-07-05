import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ReceiptsService } from 'src/app/services/receipts.service';

@Component({
  selector: 'app-provisions',
  templateUrl: './provisions.component.html',
  styleUrls: ['./provisions.component.scss']
})
export class ProvisionsComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  filterParams: any = {};
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['number', 'description', 'date', 'edit'];
  searchByName;
  searchFilter;
  pageEvent;
  refreshList;

  constructor(
    private receiptsSvc: ReceiptsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getReceipts();
  }

  goToCreate() {
    this.router.navigate(['/manage/provisiones/new'], { relativeTo: this.activatedRoute });
  }

  goToEdit(receiptId) {
    this.router.navigate([`/manage/provisiones/edit/${receiptId}`], { relativeTo: this.activatedRoute });
  }

  getReceipts () {
    this.receiptsSvc.getReceipts({
      search: this.filterParams.search || '',
      operation_type_id: 5,
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
}
