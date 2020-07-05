(function () {
  angular.module('doc.features')
    .controller('ProfileCtrl', [
      '$scope',
      'User',
      'Client',
      'Entity',
      'CurrentUser',
      'Profile',
      'notification',
      '$window',
      function ($scope, User, Client, Entity, CurrentUser, Profile, notification, $window) {
        $scope.profile = new Profile();
        $scope.isDisabled = false;

        CurrentUser.get({}, function (response) {
          $scope.profile.name = response.name;
          $scope.profile.username = response.username;
          $scope.profile.last_name = response.last_name;
          $scope.currentpassword = response.password;
        }, function (err) {
          var message = err && err.data ? err.data.message : 'Error de autenticación';

          notification.error(message);
        });

        $scope.savePassword = function (form) {
          $scope.isDisabled = true;
          if (form.$valid &&
              $scope.profile.password === $scope.profile.newPassword) {
            $scope.profile.$updatePassword(function (response) {
              if (response.message) {
                notification.warn('Su clave actual no coincide');
                $scope.isDisabled = false;
              } else {
                notification.great('Clave actualizada Correctamente');
                $window.location.reload();
                $scope.isDisabled = false;
              }
            });
          } else {
            $scope.isDisabled = false;
            if ($scope.profile.password !== $scope.profile.newPassword) {
              notification.warn('Las claves no coinciden');
            } else {
              notification.warn('Debe llenar todos los campos obligatorios');
            }
          }
        };

      }]);
})();
