import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CompaniesService } from 'src/app/services/companies.service';
import { ProvidersService } from 'src/app/services/provider.service';
import { ClientsService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.scss']
})
export class ManageCompanyComponent implements OnInit {

  dataLoaded;
  form : FormGroup;
  providerTypes = [{
    id: 1,
    label: 'Servicios'
  }, {
    id: 2,
    label: 'Bienes'
  }];

  clientTypes = [{
    id: 1,
    label: 'Servicios'
  }, {
    id: 2,
    label: 'Bienes'
  }];

  constructor(
    private fb: FormBuilder,
    private companiesSvc: CompaniesService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {
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

  ngOnInit() {
    let companyId = this.route.snapshot.params.id;
    if (companyId) {
      this.getCompany(companyId);
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

    this.companiesSvc.update(company, companyId)
      .subscribe((company: any) => {
        this._snackBar.open("Empresa registrada", "OK", {
          duration: 5000,
        });
        this.router.navigate([`/manage/companies`]);
      });
  }

  private getCompany (id) {
    this.companiesSvc.get(id)
      .subscribe((company) => {
        this.form.patchValue({
          id: company.id,
          name: company.name,
          ruc: company.ruc,
          address: company.address,
          telephone: company.telephone,
          isProvider: company.provider_id,
          hasDetraction: company.detraction,
          providerType: company.providerType,
          isClient: company.client_id,
          clientType: company.client_type,
        });
      });
  }
}
