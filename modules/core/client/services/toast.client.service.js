(function () {
  'use strict';

  angular.module('core')
    .factory('Toast', Toast);

  Toast.$inject = ['$mdToast', 'blockUI'];

  function Toast($mdToast, blockUI) {
    var self;

    self = {
      toast: toast,
      warning: warning,
      error: error,
      info: info,
      success: success,
      genericErrorMessage: genericErrorMessage,
      blockScreen: blockScreen,
      unblockScreen: unblockScreen
    };

    function toast(mensagem, tema, iconeTema) {
      $mdToast.show($mdToast.customToast()
        .textContent(mensagem)
        .position('top right')
        .hideDelay(6000)
        .theme(tema)
        .themeIcon(iconeTema));
    }

    function warning(mensagem) {
      return toast(mensagem, 'warning-toast', 'warning');
    }

    function error(mensagem) {
      return toast(mensagem, 'error-toast', 'error');
    }

    function info(mensagem) {
      return toast(mensagem, 'info-toast', 'info');
    }

    function success(mensagem) {
      return toast(mensagem, 'success-toast', 'done');
    }

    function genericErrorMessage() {
      return error('Sua requisição não pode ser completada! Por favor contacte o administrador do sistema.');
    }

    function blockScreen() {
      blockUI.start();
    }

    function unblockScreen() {
      blockUI.stop();
    }

    return self;
  }

}());
