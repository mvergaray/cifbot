import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private backendSvc: BackendService) { }

  getTransactions(filter?): Observable<any> {
    return this.backendSvc.request('get', 'transactions', null, filter)
      .pipe(
        map((data: any) => {

          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        })
      );
  }

  getTransaction(id: number) {
    return this.backendSvc.request('get', `transactions/${id}`)
      .pipe(
        map((data: any) => {
          data.code = _.padStart(data.id, 4, '0');

          return data;
        })
      );
  }

  updateTransaction(object: any, id?: number) {
    let endpoint = id ? `transactions/${id}` : 'transactions';

    return this.backendSvc.request(id ? 'put' : 'post', endpoint, object);
  }

  deleteTransaction(id: number) {
    return this.backendSvc.request('delete', `transactions/${id}`);
  }
}
