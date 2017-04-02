(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ngMaterial', 'ngFileUpload', 'pascalprecht.translate', 'ui.mask', 'ngSanitize', 'blockUI', 'ngclipboard'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  angular.module('pascalprecht.translate')
    .config(['$translateProvider', '$translatePartialLoaderProvider', function ($translateProvider, $translatePartialLoaderProvider) {
      $translatePartialLoaderProvider.addPart('core');
      $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '/modules/{part}/client/i18n/{part}.{lang}.json'
      });

      // Definimos o idioma padrão
      $translateProvider.preferredLanguage('en_US');
      $translateProvider.forceAsyncReload(true);
      $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
      // Se você preferir que o idioma padrão seja detectado pelo idioma do browser
      // use as linhas abaixo:
      //
      // $translateProvider
      //  .uniformLanguageTag()
      //  .determinePreferredLanguage();
    }]);

}(window));
