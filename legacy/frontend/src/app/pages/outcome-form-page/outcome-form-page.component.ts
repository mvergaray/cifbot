import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-outcome-form-page',
  templateUrl: './outcome-form-page.component.html',
  styleUrls: ['./outcome-form-page.component.scss']
})
export class OutcomeFormPageComponent implements OnInit {

  private dateFormat = 'YYYY-MM-DD';
  displayedColumns: string[] = ['acc_number', 'debit', 'credit', 'edit'];
  dataLoaded;
  transactionTypes = [ {
    id: 1,
    description: 'Efectivo'
  },
  {
    id: 2,
    description: 'Depósito en cuenta'
  },
  {
    id: 3,
    description: 'Cheque'
  }];

  bankAccounts = [ {
    id: 1,
    description: 'BCP'
  },
  {
    id: 2,
    description: 'Conti'
  },
  {
    id: 3,
    description: 'IBK'
  }];

  dateValues = {
    date: moment().add(5, 'years'),
  };

  unavailabilityForm = this.fb.group({
    date: [this.dateValues.date.format()],
  });
  form : FormGroup;
  listDataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private fb: FormBuilder,
    private receiptsSvc: ReceiptsService,
    private transactionSvc: TransactionService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      date: [''],
      operation_id: [],
      operation_type_id: [],
      bank_account_id: [],
      number: [],
      transaction_type_id: [],
      description: [],
      amount: []
    });
  }

  ngOnInit() {
    let receiptId = this.route.snapshot.params.id;
    this.getReceipt(receiptId);
  }

  onSubmit() {
    const saveObject = {
      company_id: 1,
      operation_type_id: 3,
      bank_account_id: this.form.value.bank_account_id,
      operation_id: this.form.value.operation_id,
      number: this.form.value.number,
      transaction_type_id: this.form.value.transaction_type_id,
      description: this.form.value.description,
      amount: this.form.value.amount,
      date: this.form.value.date.format(this.dateFormat),
    };

    this.transactionSvc.updateTransaction(saveObject)
      .pipe(
        flatMap((response) => {
        return this.transactionSvc.getTransaction(response.result.id);
      }))
      .subscribe((operation: any) => {
        this.listDataSource.data = operation.seats || [];
      });
  }

  private getReceipt (id) {
    this.receiptsSvc.getReceipt(id)
      .subscribe((receipt) => {
        this.form.patchValue({
          operation_id: receipt.operation_id,
        });

        this.dataLoaded = true;
      });
  }

}
