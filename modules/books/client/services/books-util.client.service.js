(function () {
  'use strict';

  angular
    .module('books')
    .factory('BooksUtilService', BooksUtilService);

  BooksUtilService.$inject = [];

  function BooksUtilService() {
    var BooksUtilService = {
      getMarkers: getMarkers,
      getLegends: getLegends
    };

    function getMarkers() {
      var markers = [{
        marker: 'yellow',
        legend: 'Amarelo'
      },
      {
        marker: 'red',
        legend: 'Vermelho'
      },
      {
        marker: 'purple',
        legend: 'Roxo'
      },
      {
        marker: 'blue',
        legend: 'Azul'
      },
      {
        marker: 'green',
        legend: 'Verde'
      },
      {
        marker: 'pink',
        legend: 'Rosa'
      },
      {
        marker: 'orange',
        legend: 'Alaranjado'
      }];
      return markers;
    }

    function getLegends() {
      var legends = {
        yellow: {
          marker: 'yellow',
          legend: 'Amarelo'
        },
        red: {
          marker: 'red',
          legend: 'Vermelho'
        },
        purple: {
          marker: 'purple',
          legend: 'Roxo'
        },
        blue: {
          marker: 'blue',
          legend: 'Azul'
        },
        green: {
          marker: 'green',
          legend: 'Verde'
        },
        pink: {
          marker: 'pink',
          legend: 'Rosa'
        },
        orange: {
          marker: 'orange',
          legend: 'Alaranjado'
        }
      };
      return legends;
    }

    return BooksUtilService;
  }

}());
