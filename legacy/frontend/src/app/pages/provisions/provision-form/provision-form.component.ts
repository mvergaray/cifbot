import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ProvisionDetailDialog } from './provision-detail/provision-detail-dialog.component';
import { startWith, debounceTime, switchMap, map, flatMap } from 'rxjs/operators';
import { ProvidersService } from 'src/app/services/provider.service';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-provision-form',
  templateUrl: './provision-form.component.html',
  styleUrls: ['./provision-form.component.scss']
})
export class ProvisionFormComponent implements OnInit {
  private dateFormat = 'YYYY-MM-DD';
  receiptId:any;
  isLoading;
  provisionId;
  openPayments;
  operationTypes: any;
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['sequence', 'anexo', 'acc_number', 'debit', 'credit', 'edit'];
  dateValues = {
    date: moment().add(5, 'years'),
    due_date: moment().add(5, 'years')
  };
  unavailabilityForm = this.fb.group({
    date: [this.dateValues.date.format()],
    due_date: [this.dateValues.due_date.format()]
  });

  form : FormGroup;
  seatForm : FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public companiesSvc: CompaniesService,
    private receiptsSvc: ReceiptsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isLoading = true
    this.form = this.fb.group({
      id: [''],
      date: [''],
      operation: [],
      assoc_company_id: [],
      doc_number: [],
      description: []
    });

    this.seatForm = this.fb.group({
      date: [''],
      operation_id: [],
      operation_type_id: [],
      bank_account_id: [],
      number: [],
      transaction_type_id: [],
      description: [],
      amount: []
    });

    this.operationTypes = [
      {id: 5, code: 8, description: 'Otros'},
    ];
  }

  ngOnInit() {
    this.receiptId = this.route.snapshot.params.id;
    if (this.receiptId) {
      this.getReceipt(this.receiptId);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProvisionDetailDialog, {
      width: '250px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onSubmit() {
    const saveObject = {
      company_id: 1,
      operation_type_id: this.form.value.operation,
      doc_number: this.form.value.doc_number,
      //serie: this.form.value.serie,
      description: this.form.value.description,
      date: this.form.value.date.format(this.dateFormat),
    };

    this.receiptsSvc.updateReceipt(saveObject)
      .subscribe((response: any) => {
        this.router.navigate([`/manage/provisiones/${response.result.id}/edit`], { relativeTo: this.route });
      });
  }

  private getReceipt (id) {
    this.receiptsSvc.getReceipt(id)
      .pipe(flatMap((receipt) => {
        let services = of(null),
          date = moment(receipt.date, 'DD/MM/YYYY'),
          dueDate = moment(receipt.due_date, 'DD/MM/YYYY'),
          period = date.format('MM/YYYY');


        this.form.patchValue({
          date: date,

          operation: receipt.operation_type_id,
          doc_number: receipt.doc_number,

          description: receipt.description
        });
        this.listDataSource.data = receipt.seats;

        return services;
      }))
      .subscribe((provider) => {

      });
  }
}
