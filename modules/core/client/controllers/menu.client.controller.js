(function () {
  'use strict';

  angular.module('core')
    .controller('MenuController', MenuController);

  MenuController.$inject = ['Authentication', 'MenuMaterialService'];

  function MenuController(Authentication, MenuMaterialService) {

    var vm = this;

    // functions for menu-link and menu-toggle
    vm.isOpen = isOpen;
    vm.toggleOpen = toggleOpen;
    vm.autoFocusContent = false;
    vm.menu = MenuMaterialService;
    vm.authentication = Authentication;

    vm.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    vm.isSelected = function isSelected(page) {
      return MenuMaterialService.isPageSelected(page);
    };

    vm.isSectionSelected = function isSectionSelected(section) {
      var selected = false;
      var openedSection = MenuMaterialService.openedSection;
      if (openedSection === section) {
        selected = true;
      } else if (section.children) {
        section.children.forEach(function (childSection) {
          if (childSection === openedSection) {
            selected = true;
          }
        });
      }
      return selected;
    };

    function isOpen(section) {
      return MenuMaterialService.isSectionSelected(section);
    }

    function toggleOpen(section) {
      MenuMaterialService.toggleSelectSection(section);
    }
  }
}());
