class SigninCtrl {
  constructor (
    AuthService,
    CurrentUser
  ) {
    this.AuthService = AuthService;
    this.CurrentUser = CurrentUser;
    this.mainMenu = [];
  }

  $onInit () {

  }

  login () {
    this.AuthService.login({
      email: this.username,
      password: this.password
    })
      .then();
  }
}

SigninCtrl.$inject = ['AuthService'];

export default SigninCtrl;