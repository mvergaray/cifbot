import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountingSetService } from 'src/app/services/accountingSet.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountId;
  form : FormGroup;

  constructor(
    private accountsSvc: AccountingSetService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      id: [],
      acc_number: [],
      acc_desc: [],
   });
  }

  ngOnInit() {
    this.accountId = this.route.snapshot.params.id;
    if (this.accountId) {
      this.getCompany(this.accountId);
    }
  }

  onSubmit() {
    const company = {
      name: this.form.value.name,
      ruc: this.form.value.ruc,
      address: this.form.value.address,
      telephone: this.form.value.telephone,
      status: 1,
      is_provider: this.form.value.isProvider,
      is_client: this.form.value.isClient,
      detraction: this.form.value.hasDetraction
    };

    let companyId = this.route.snapshot.params.id;

    this.accountsSvc.update(company, companyId)
      .subscribe((company: any) => {
        this._snackBar.open("Cuenta contable registrada", "OK", {
          duration: 5000,
        });
        this.router.navigate([`/manage/cuentas-contables`]);
      });
  }

  private getCompany (id) {
    this.accountsSvc.get(id)
      .subscribe((account) => {
        this.form.patchValue({
          id: account.id,
          acc_number: account.acc_number,
          acc_desc: account.acc_desc,
        });
      });
  }

}
