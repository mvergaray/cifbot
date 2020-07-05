import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {

  constructor(private backendSvc: BackendService) { }

  getReceipts(filter?): Observable<any> {
    return this.backendSvc.request('get', 'receipts', null, filter)
      .pipe(
        map((data: any) => {

          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        })
      );
  }

  getReceipt(id: number) {
    return this.backendSvc.request('get', `receipts/${id}`)
      .pipe(
        map((data: any) => {
          data.code = _.padStart(data.id, 4, '0');

          return data;
        })
      );
  }

  updateReceipt(object: any, id?: number) {
    let endpoint = id ? `receipts/${id}` : 'receipts';

    return this.backendSvc.request(id ? 'put' : 'post', endpoint, object);
  }

  deleteReceipt(id: number) {
    return this.backendSvc.request('delete', `receipts/${id}`);
  }
}
