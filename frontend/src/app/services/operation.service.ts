import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private backendSvc: BackendService) { }

  getOperations(filter?): Observable<any> {
    return this.backendSvc.request('get', 'operation', null, filter)
      .pipe(
        map((data: any) => {

          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        })
      );
  }

  getOperation(id: number) {
    return this.backendSvc.request('get', `operation/${id}`)
      .pipe(
        map((data: any) => {
          data.code = _.padStart(data.id, 4, '0');

          return data;
        })
      );
  }
}
