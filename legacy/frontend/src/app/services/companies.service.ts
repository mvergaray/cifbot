import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private backendSvc: BackendService) { }

  getList(filter?): Observable<any> {
    return this.backendSvc.request('get', 'companies', null, filter)
      .pipe(
        map((data: any) => {

          _.each(data.results.list, (item) => {
            item.code = _.padStart(item.id, 4, '0');
          });

          return data.results;
        })
      );
  }

  get(id: number) {
    return this.backendSvc.request('get', `companies/${id}`)
      .pipe(
        map((data: any) => {
          data.code = _.padStart(data.id, 4, '0');

          return _.first(data.results.list);
        })
      );
  }

  update(object: any, id?: number) {
    let endpoint = id ? `companies/${id}` : 'companies';

    return this.backendSvc.request(id ? 'put' : 'post', endpoint, object)
      .pipe(
        map((data: any) => {
          return data.result;
        })
      );
  }

  delete(id: number) {
    return this.backendSvc.request('delete', `companies/${id}`);
  }
}
