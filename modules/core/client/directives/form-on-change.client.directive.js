(function () {
  'use strict';

  angular.module('core')
    .directive('formOnChange', formOnChange);

  function formOnChange($parse) {
    return {
      require: 'form',
      link: function(scope, element, attrs) {
        var cb = $parse(attrs.formOnChange);
        element.on('change textInput input', function() {
          cb(scope);
          scope.$apply();
        });
      }
    };
  }


}());
