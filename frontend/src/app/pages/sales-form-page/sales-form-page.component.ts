import { Component, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, switchMap, map, flatMap, startWith } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { ClientsService } from 'src/app/services/client.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { OperationService } from 'src/app/services/operation.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-sales-form-page',
  templateUrl: './sales-form-page.component.html',
  styleUrls: ['./sales-form-page.component.scss']
})
export class SalesFormPageComponent implements OnInit, OnDestroy {
  @ViewChildren('name') nameInput;
  private dateFormat = 'YYYY-MM-DD';
  receiptId;
  docType: any = {};
  form : FormGroup;
  isLoading: boolean;
  operationTypes: any;
  dateValues = {
    date: moment().add(5, 'years'),
    due_date: moment().add(5, 'years')
  };
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();
  paymentsList: MatTableDataSource<any> = new MatTableDataSource();
  unavailabilityForm = this.fb.group({
    date: [this.dateValues.date.format()],
    due_date: [this.dateValues.due_date.format()]
  });
  displayedColumns: string[] = ['acc_number', 'debit', 'credit', 'edit'];

  clientsList$: Observable<any>;
  routeSubscriber;

  constructor(
    private clientsSvc: ClientsService,
    private receiptsSvc: ReceiptsService,
    private transactionSvc: TransactionService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.isLoading = true
    this.form = this.fb.group({
      date: [''],
      due_date: [''],
      period: [],
      operation: [],
      assoc_company_id: [],
      client: [],
      doc_number: [],
      serie: [],
      total_amount: [],
      tax_base: [],
      tax_percentage: [18],
      description: []
    });
  }

  ngOnInit() {
    this.receiptId = this.route.snapshot.params.id;

    this.initClientList();
    this.operationTypes = [
      {id: 2, code: 5, description: 'Ventas'}
    ];

    if (this.receiptId) {
      this.getReceipt(this.receiptId);
    }
  }

  ngOnDestroy(): void {
  }

  private initClientList () {
    this.clientsList$ = this.form.get('client').valueChanges
      .pipe(
        startWith(''),
        // delay emits
        debounceTime(300),
        // use switch map so as to cancel previous subscribed events, before creating new once
        switchMap((value) => {
          let result = [];
          if (typeof value === 'string') {
            // lookup from github
            return this.clientsSvc.getClients(value)
              .pipe(map(result => result.list));
          } else {
            if (!_.isEmpty(value)) {
              result.push(value);
            }
            // if no value is present, return null
            return of(result);
          }
        })
      );
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
          due_date: dueDate,
          period: period,
          operation: receipt.operation_type_id,
          assoc_company_id: receipt.assoc_company_id,
          doc_number: receipt.doc_number,
          serie: receipt.serie,
          total_amount: receipt.total_amount,
          tax_base: receipt.tax_base,
          tax_percentage: 18,
          description: receipt.description
        });
        this.listDataSource.data = receipt.seats;

        this.getTransactions(receipt.operation_id);

        if (receipt.assoc_company_id) {
          services = this.clientsSvc.getClient(receipt.assoc_company_id);
        }

        return services;
      }))
      .subscribe((client) => {
        this.form.get('client').setValue(client);
      });
  }

  private getTransactions (operationId) {
    this.transactionSvc.getTransactions({ operation_id: operationId })
      .subscribe((transactions) => {
        this.paymentsList.data = _.flatMap(transactions.list, 'seats');
      });
  }

  displayFn(user?: any): string | undefined {
    return user ? user.name : undefined;
  }

  goToList() {
    this.router.navigate(['manage/sales']);
  }

  openPayments(receiptId) {
    this.router.navigate([`/manage/sales/${receiptId}/payment`], { relativeTo: this.route });
  }

  onSubmit() {
    const saveObject = {
      company_id: 1,
      operation_type_id: this.form.value.operation,
      assoc_company_id: this.form.value.client.id,
      doc_number: this.form.value.doc_number,
      serie: this.form.value.serie,
      total_amount: this.form.value.total_amount,
      tax_base: this.getTaxBase(),
      tax_percentage: this.form.value.tax_percentage,
      tax_value: this.mathRandom(this.form.value.total_amount - this.getTaxBase()),
      description: this.form.value.description,
      date: this.form.value.date.format(this.dateFormat),
      due_date: this.form.value.due_date.format(this.dateFormat),
    };

    this.receiptsSvc.updateReceipt(saveObject)
      .pipe(flatMap((response) => {
        this.receiptId = response.result.id;
        return this.receiptsSvc.getReceipt(response.result.id);
      }))
      .subscribe((operation: any) => {
        this.listDataSource.data = operation.seats || [];
      });
  }

  public getTaxBase () {
    let taxBase = this.form.value.total_amount * 100 / (100 + this.form.value.tax_percentage);
    taxBase = (Math.round(taxBase * 100) / 100) || 0;
    return  taxBase;
  }

  private mathRandom (number) {
    return (Math.round(number * 100) / 100) || 0;
  }
}
