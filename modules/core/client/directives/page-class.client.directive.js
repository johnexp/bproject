(function () {
  'use strict';

  angular.module('core')
    .directive('pageClass', pageClass);

  pageClass.$inject = ['$rootScope', '$interpolate', '$state'];

  function pageClass($rootScope, $interpolate, $state) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        if (toState.data && toState.data.pageClass) {
          var stateClass = $interpolate(toState.data.pageClass)($state.$current.locals.globals);
          element.addClass(stateClass);
          $rootScope.addedClass = stateClass;
        } else {
          if ($rootScope.addedClass) {
            element[0].className = element[0].className.substring(element[0].className.indexOf($rootScope.addedClass) - 1, -1);
            $rootScope.addedClass = null;
          }
        }
      }
    }
  }
}());
