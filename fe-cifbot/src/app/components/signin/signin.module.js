import SigninConfigRoute from "./config.route";
import SigninComponent from "./signin.component";

const SigninModule = angular.module('app.signin', []);

SigninModule
  .config(SigninConfigRoute)
  .component('signIn', SigninComponent);


export default SigninModule;