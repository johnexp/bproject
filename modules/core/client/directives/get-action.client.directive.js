(function () {
  'use strict';

  angular.module('core')
    .directive('getAction', getAction);

  getAction.$inject = ['$filter'];

  function getAction($filter) {
    var directive = {
      restrict: 'A',
      replace: true,
      scope: {
        getAction: '=getAction'
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      scope.$watch(function() {
        return element.html();
      }, function () {
        console.log(getAction(element.text()));
        element.html(getAction(element.text()));
      });
    }

    function getAction(char) {
      var $translate = $filter('translate');
      switch (char) {
        case 'C':
          return $translate('Created');
        case 'U':
          return $translate('Updated');
        case 'D':
          return $translate('Deleted');
      }
    }
  }

}());
