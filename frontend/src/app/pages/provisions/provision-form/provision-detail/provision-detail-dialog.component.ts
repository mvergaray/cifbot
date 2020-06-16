import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompaniesService } from 'src/app/services/companies.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'provision-detail-dialog',
  templateUrl: 'provision-detail-dialog.html',
})
export class ProvisionDetailDialog {
  dateValues = {
    date: moment().add(5, 'years'),
    due_date: moment().add(5, 'years')
  };
  unavailabilityForm = this.fb.group({
    date: [this.dateValues.date.format()],
    due_date: [this.dateValues.due_date.format()]
  });
  form : FormGroup;
  providerTypes = [{
    id: 1,
    label: 'Servicios'
  }, {
    id: 2,
    label: 'Bienes'
  }];

  constructor(
    public dialogRef: MatDialogRef<ProvisionDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private companiesSvc: CompaniesService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [],
      name: [],
      ruc: [],
      address: [],
      telephone: [],
      isProvider: [false],
      providerType: [],
      hasDetraction: [],
      isClient: [],
      clientType: []
    });
  }

  onSubmit() {
    const company = {
      name: this.form.value.name,
      ruc: this.form.value.ruc,
      address: this.form.value.address,
      telephone: this.form.value.telephone,
      status: 1,
      is_provider: true,
      detraction: this.form.value.hasDetraction
    };

    let companyId = this.route.snapshot.params.id;

    this.companiesSvc
      .update(company, companyId)
      .subscribe((company: any) => {
        this._snackBar.open("El detalle ha sido registrado.", "OK", {
          duration: 5000,
        });
        this.onNoClick();
      }, response => {
        this._snackBar.open(response.error.msg, "OK", {
          duration: 5000,
        });
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}