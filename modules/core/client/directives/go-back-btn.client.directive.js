(function () {
  'use strict';

  angular.module('core')
    .directive('goBackBtn', goBackBtn);

  function goBackBtn() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.bind('click', goBack);
        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    };
  }

}());
