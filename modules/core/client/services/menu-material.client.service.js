(function () {
  'use strict';

  angular
    .module('core')
    .factory('MenuMaterialService', MenuMaterialService);

  MenuMaterialService.$inject = ['$location', 'menuService'];

  function MenuMaterialService($location, menuService) {

    var self;

    self = {
      sections: menuService.getMenu('sidebar').items,

      selectSection: function (section) {
        self.openedSection = section;
      },

      toggleSelectSection: function (section) {
        self.openedSection = (self.openedSection === section ? null : section);
      },
      isSectionSelected: function (section) {
        return self.openedSection === section;
      },

      selectPage: function (section, page) {
        page && page.url && $location.path(page.url);
        self.currentSection = section;
        self.currentPage = page;
      },

      isPageSelected: function (page) {
        return self.currentPage === page;
      }
    };

    return self;
  }
}());
