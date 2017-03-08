(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', '$mdSidenav', '$translatePartialLoader', '$translate', '$mdComponentRegistry'];

  function HeaderController($scope, $state, Authentication, menuService, $mdSidenav, $translatePartialLoader, $translate, $mdComponentRegistry) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.sidebar = menuService.getMenu('sidebar');
    vm.changeLanguage = changeLanguage;
    vm.stateIsAbstract = stateIsAbstract;

    $translatePartialLoader.addPart('core');
    $translate.refresh();

    vm.toggleLeftMenu = function toggleLeftMenu() {
      $mdSidenav('left').toggle();
    };

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateIsAbstract(state) {
      return $state.get(state).hasOwnProperty('abstract');
    }

    function stateChangeSuccess() {
      if ($mdComponentRegistry.get('left')) {
        $mdSidenav('left').close();
      }
    }

    function changeLanguage(langKey) {
      $translate.use(langKey);
    }
  }
}());
