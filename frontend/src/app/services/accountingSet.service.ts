
import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AccountingSetService {

  constructor(private backendSvc: BackendService) { }

  getList(filter?): Observable<any> {
    return this.backendSvc.request('get', 'accounts', null, filter)
      .pipe(
        map((data: any) => {

          _.each(data.results.list, (item) => {
            item.acc_number = _.padEnd(item.acc_number, 6, '0');
          });

          return data.results;
        })
      );
  }

  get(id: number) {
    return this.backendSvc.request('get', `accounts/${id}`)
      .pipe(
        map((data: any) => {
          data.acc_number = _.padEnd(data.acc_number, 6, '0');

          return data;
        })
      );
  }

  update(object: any, id?: number) {
    let endpoint = id ? `accounts/${id}` : 'accounts';

    return this.backendSvc.request(id ? 'put' : 'post', endpoint, object)
      .pipe(
        map((data: any) => {
          return data.result;
        })
      );
  }

  delete(id: number) {
    return this.backendSvc.request('delete', `accounts/${id}`);
  }
}
