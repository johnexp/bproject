/* eslint-disable */
(function () {
  'use strict';

  angular.module('core')
    .controller('CustomToastController', CustomToastController);

  CustomToastController.$inject = ['$scope', '$mdToast'];

  function CustomToastController($scope, $mdToast) {
    var vm = this;
    var textContent = '';
    var isDlgOpen = false;

    if (vm.highlightAction) {
      $scope.highlightClasses = ['md-highlight', vm.highlightClass]
    }

    $scope.$watch(function () {
      return textContent;
    }, function () {
      vm.content = textContent;
    });

    vm.resolve = function () {
      $mdToast.hide('ok');
    };

    $scope.closeToast = function () {
      if (isDlgOpen) return;

      $mdToast
        .hide()
        .then(function () {
          isDlgOpen = false;
        });
    };
  }

}());
