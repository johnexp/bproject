(function () {
  'use strict';

  angular
    .module('core')
    .factory('DialogService', DialogService);

  DialogService.$inject = ['$mdDialog', '$translate'];

  function DialogService($mdDialog, $translate) {

    var dialogService;

    dialogService = {
      showConfirmDeletion: showConfirmDeletion,
      showConfirmInactivation: showConfirmInactivation
    };

    return dialogService;

    function showConfirmDeletion(ev, callback) {
      var confirm = $mdDialog.confirm()
        .title($translate.instant('delete_item'))
        .textContent($translate.instant('confirm_deletion'))
        .ariaLabel($translate.instant('delete_item'))
        .targetEvent(ev)
        .ok($translate.instant('Yes'))
        .cancel($translate.instant('No'));

      $mdDialog.show(confirm).then(function () {
        callback(true);
      }, function () {
        callback(false);
      });
    }

    function showConfirmInactivation(ev, callback) {
      var confirm = $mdDialog.confirm()
        .title($translate.instant('inactivate_item'))
        .textContent($translate.instant('confirm_inactivation'))
        .ariaLabel($translate.instant('inactivate_item'))
        .targetEvent(ev)
        .ok($translate.instant('Yes'))
        .cancel($translate.instant('No'));

      $mdDialog.show(confirm).then(function () {
        callback(true);
      }, function () {
        callback(false);
      });
    }

  }

}());
