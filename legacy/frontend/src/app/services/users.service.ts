import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userRole
  constructor(private backendSvc: BackendService) { }
getUserRole() {
  return this.userRole;
}

setUserRole(role) {
  this.userRole = role;
}
}
