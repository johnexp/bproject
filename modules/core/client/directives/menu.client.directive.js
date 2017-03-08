(function () {
  'use strict';

  angular.module('core')
    .directive('menuToggle', menuToggle)
    .directive('menuLink', menuLink)
    .directive('menuApp', menuApp);

  menuToggle.$inject = ['$mdUtil', '$timeout'];

  function menuToggle ($mdUtil, $timeout) {
    return {
      scope: {
        section: '='
      },
      templateUrl: '/modules/core/client/views/menu-toggle.tmpl.html',
      link: function ($scope, $element) {
        var controller = $element.parent().controller();
        $scope.isOpen = function () {
          return controller.isOpen($scope.section);
        };
        $scope.toggle = function () {
          controller.toggleOpen($scope.section);
          controller.select;
        };

        $mdUtil.nextTick(function () {

          $scope.$watch(function () {
            return controller.isOpen($scope.section);
          }, function (open) {
            var $ul = $element.find('ul');

            var targetHeight = open ? getTargetHeight() : 0;
            $timeout(function () {
              $ul.css({ height: targetHeight + 'px' });
            }, 0, false);

            function getTargetHeight() {
              var targetHeight;
              $ul.addClass('no-transition');
              $ul.css('height', '');
              targetHeight = $ul.prop('clientHeight');
              $ul.css('height', 0);
              $ul.removeClass('no-transition');
              return targetHeight;
            }
          });
        });

        var parentNode = $element[0].parentNode.parentNode.parentNode;
        if (parentNode.classList.contains('parent-list-item')) {
          var heading = parentNode.querySelector('h2');
          $element[0].firstChild.setAttribute('aria-describedby', heading.id);
        }
      }
    };
  }

  function menuLink () {
    return {
      scope: {
        section: '='
      },
      templateUrl: '/modules/core/client/views/menu-link.tmpl.html',
      link: function ($scope, $element) {
        var controller = $element.parent().controller();

        $scope.focusSection = function () {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
        };
      }
    };
  }

  function menuApp () {
    return {
      templateUrl: '/modules/core/client/views/menu.tmpl.html',
      restrict: 'E',
      controllerAs: 'vm',
      scope: {},
      bindToController: true,
      controller: 'MenuController'
    };
  }

}());
