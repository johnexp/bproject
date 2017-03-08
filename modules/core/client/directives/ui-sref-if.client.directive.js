(function () {
  'use strict';

  angular.module('core')
    .directive('uiSrefIf', uiSrefIf);

  uiSrefIf.$inject = ['$compile'];

  function uiSrefIf($compile) {
    return {
      scope: {
        val: '@uiSrefVal',
        if: '=uiSrefIf'
      },
      link: function($scope, $element) {
        $element.removeAttr('ui-sref-if');

        $scope.$watch('if', function(bool) {
          if (bool) {
            $element.attr('ui-sref', $scope.val);
          } else {
            $element.removeAttr('ui-sref');
            $element.removeAttr('href');
            var expandIcon = angular.element('<md-icon md-font-set="material-icons">expand_more</md-icon>');
            $element[0].append(expandIcon[0]);
          }
          $compile($element)($scope);
        });
      }
    };
  }

}());
