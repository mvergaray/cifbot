class SigninCtrl {
  constructor (
    AuthService
  ) {
    this.AuthService = AuthService;
    this.mainMenu = [];
  }

  $onInit () {

  }

  login () {
    this.AuthService.login({
      email: this.username,
      password: this.password
    })
      .then()
  }
}

SigninCtrl.$inject = ['AuthService'];

export default SigninCtrl;