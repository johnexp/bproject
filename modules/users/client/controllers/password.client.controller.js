(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Toast'];

  function PasswordController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Toast) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      Toast.success('Um email foi enviado ao endereço de email da sua conta!');
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      Toast.error('Não foi possível enviar o email com as informações para a troca da senha!');
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      Toast.success('Senha alterada com sucesso!');
      // And redirect to the index page
      $location.path('/password/reset/success');
    }

    function onResetPasswordError(response) {
      Toast.error('Não foi possível alterar a senha!');
    }
  }
}());
