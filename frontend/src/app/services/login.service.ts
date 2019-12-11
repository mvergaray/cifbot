import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private backendSvc: BackendService) { }

  login (username, password) {
    return this.backendSvc.post('/auth/login', {
        username: username,
        password: password
      })
      .pipe(
        map((authResult: any) => {
          this.backendSvc.saveToken(authResult.token);
        })
      );
  }
}
