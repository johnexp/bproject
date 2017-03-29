(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'search', {
      title: 'Pesquisar Notas',
      state: 'search.notes',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'search', {
      title: 'Pesquisar Tags',
      state: 'search.tags',
      roles: ['user', 'admin']
    });
  }
}());
