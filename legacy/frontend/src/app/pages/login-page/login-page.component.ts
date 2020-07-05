import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  email: string;
  password: string;
  errorMessage: string;

  constructor(
    private loginSvc: LoginService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.errorMessage = '';
    if (this.authService.isLogged()) {
      this.navigateTo();
    }
  }

  public async login(email: string, password: string) {
    try {
      this.authService.login(email, password)
        .subscribe((user) => {
          this.userService.setUserRole(user.role_id);
          this.router.navigate(['manage']);
        },
        err => {
          console.log('Usuario o contraseña incorrecta.');
          //this.snackBarSvc.openSnackBar('');
        });
    } catch (e) {
      this.errorMessage = 'Wrong Credentials!';
      console.error('Unable to Login!\n', e);
    }
  }

  public navigateTo(url?: string) {
    url = url || 'manage';
    this.router.navigate([url], { replaceUrl: true });
  }
}
