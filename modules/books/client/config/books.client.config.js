(function () {
  'use strict';

  angular
    .module('books')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Bíblias',
      state: 'bible',
      type: 'dropdown',
      icon: 'collections_bookmark',
      roles: ['user', 'admin', 'guest']
    });

    // Set top bar menu items
    menuService.addMenuItem('sidebar', {
      title: 'Pesquisa',
      state: 'bible.search',
      type: 'dropdown',
      icon: 'search',
      roles: ['user', 'admin', 'guest']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'bible', {
      title: 'Almeida Atualizada',
      state: 'bible.view({"version": "aa"})',
      roles: ['user', 'admin', 'guest']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'bible', {
      title: 'Almeida Corrigida Fiel',
      state: 'bible.view({"version": "acf"})',
      roles: ['user', 'admin', 'guest']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidebar', 'bible', {
      title: 'Nova Versão Internacional',
      state: 'bible.view({"version": "nvi"})',
      roles: ['user', 'admin', 'guest']
    });
  }
}());
