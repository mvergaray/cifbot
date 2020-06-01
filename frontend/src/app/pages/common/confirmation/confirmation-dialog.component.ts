import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompaniesService } from 'src/app/services/companies.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmDialog implements OnInit {
  form : FormGroup;
  receipt: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ConfirmDialog>,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.receipt = this.data;
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

  onConfirm() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}