(function () {
  'use strict';

  angular.module('core')
    .directive('listActionBar', listActionBar);

  function listActionBar() {
    return {
      templateUrl: '/modules/core/client/views/list-action-bar.tmpl.html',
      restrict: 'E',
      controllerAs: 'vm',
      scope: {
        moduleName: '@',
        printData: '@'
      },
      bindToController: true,
      controller: 'ListActionBarController'
    };
  }

}());
