import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CompaniesService } from 'src/app/services/companies.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-companies',
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  isCreationEnabled;
  displayedColumns: string[] = ['code', 'name', 'ruc', 'address', 'telephone', 'provider_id', 'client_id', 'edit', 'delete'];
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchFilter;
  filterParams: any = {};
  pageEvent;

  constructor(
    private companiesSvc: CompaniesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getCompanies();
  }
  ngOnDestroy(): void {
  }

  goToCreate() {
    this.router.navigate(['/manage/companies/new'], { relativeTo: this.activatedRoute });
  }

  goToEdit(receiptId) {
    this.router.navigate([`/manage/companies/edit/${receiptId}`], { relativeTo: this.activatedRoute });
  }

  getCompanies () {
    this.companiesSvc.getList({
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
    this.getCompanies();
  }

  refreshList($event) {
    this.filterParams.limit = $event.pageSize;
    this.filterParams.page = $event.pageIndex;
    this.filterParams.skip = $event.pageIndex * $event.pageSize;
    this.getCompanies();
  }

}
