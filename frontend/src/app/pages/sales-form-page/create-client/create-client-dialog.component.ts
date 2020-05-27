import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompaniesService } from 'src/app/services/companies.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'create-client-dialog',
  templateUrl: 'create-client-dialog.html',
})
export class CreateClientDialog implements OnInit{
  form : FormGroup;
  clientTypes = [{
    id: 1,
    label: 'Servicios'
  }, {
    id: 2,
    label: 'Bienes'
  }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CreateClientDialog>,
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
      is_client: true,
      detraction: this.form.value.hasDetraction
    };

    let companyId = this.route.snapshot.params.id;

    this.companiesSvc
      .update(company, companyId)
      .subscribe((company: any) => {
        this._snackBar.open('El cliente ha sido registrado.', 'OK', {
          duration: 5000,
        });
        this.onNoClick()
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