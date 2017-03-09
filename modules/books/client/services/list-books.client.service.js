(function () {
  'use strict';

  angular
    .module('books')
    .factory('ListBooksService', ListBooksService);

  ListBooksService.$inject = [];

  function ListBooksService() {
    var ListBooksService = {
      getBooks: getBooks
    };

    function getBooks() {
      return {
        'at': [
          {
            'abbrev': 'gn',
            'name': 'Gênesis'
          },
          {
            'abbrev': 'ex',
            'name': 'Êxodo'
          },
          {
            'abbrev': 'lv',
            'name': 'Levítico'
          },
          {
            'abbrev': 'nm',
            'name': 'Números'
          },
          {
            'abbrev': 'dt',
            'name': 'Deuteronômio'
          },
          {
            'abbrev': 'js',
            'name': 'Josué'
          },
          {
            'abbrev': 'jz',
            'name': 'Juízes'
          },
          {
            'abbrev': 'rt',
            'name': 'Rute'
          },
          {
            'abbrev': '1sm',
            'name': '1 Samuel'
          },
          {
            'abbrev': '2sm',
            'name': '2 Samuel'
          },
          {
            'abbrev': '1rs',
            'name': '1 Reis'
          },
          {
            'abbrev': '2rs',
            'name': '2 Reis'
          },
          {
            'abbrev': '1cr',
            'name': '1 Crônicas'
          },
          {
            'abbrev': '2cr',
            'name': '2 Crônicas'
          },
          {
            'abbrev': 'ed',
            'name': 'Esdras'
          },
          {
            'abbrev': 'ne',
            'name': 'Neemias'
          },
          {
            'abbrev': 'et',
            'name': 'Ester'
          },
          {
            'abbrev': 'jó',
            'name': 'Jó'
          },
          {
            'abbrev': 'sl',
            'name': 'Salmos'
          },
          {
            'abbrev': 'pv',
            'name': 'Provérbios'
          },
          {
            'abbrev': 'ec',
            'name': 'Eclesiastes'
          },
          {
            'abbrev': 'ct',
            'name': 'Cânticos'
          },
          {
            'abbrev': 'is',
            'name': 'Isaías'
          },
          {
            'abbrev': 'jr',
            'name': 'Jeremias'
          },
          {
            'abbrev': 'lm',
            'name': 'Lamentações de Jeremias'
          },
          {
            'abbrev': 'ez',
            'name': 'Ezequiel'
          },
          {
            'abbrev': 'dn',
            'name': 'Daniel'
          },
          {
            'abbrev': 'os',
            'name': 'Oséias'
          },
          {
            'abbrev': 'jl',
            'name': 'Joel'
          },
          {
            'abbrev': 'am',
            'name': 'Amós'
          },
          {
            'abbrev': 'ob',
            'name': 'Obadias'
          },
          {
            'abbrev': 'jn',
            'name': 'Jonas'
          },
          {
            'abbrev': 'mq',
            'name': 'Miquéias'
          },
          {
            'abbrev': 'na',
            'name': 'Naum'
          },
          {
            'abbrev': 'hc',
            'name': 'Habacuque'
          },
          {
            'abbrev': 'sf',
            'name': 'Sofonias'
          },
          {
            'abbrev': 'ag',
            'name': 'Ageu'
          },
          {
            'abbrev': 'zc',
            'name': 'Zacarias'
          },
          {
            'abbrev': 'ml',
            'name': 'Malaquias'
          }
        ],
        'nt': [
          {
            'abbrev': 'mt',
            'name': 'Mateus'
          },
          {
            'abbrev': 'mc',
            'name': 'Marcos'
          },
          {
            'abbrev': 'lc',
            'name': 'Lucas'
          },
          {
            'abbrev': 'jo',
            'name': 'João'
          },
          {
            'abbrev': 'atos',
            'name': 'Atos'
          },
          {
            'abbrev': 'rm',
            'name': 'Romanos'
          },
          {
            'abbrev': '1co',
            'name': '1 Coríntios'
          },
          {
            'abbrev': '2co',
            'name': '2 Coríntios'
          },
          {
            'abbrev': 'gl',
            'name': 'Gálatas'
          },
          {
            'abbrev': 'ef',
            'name': 'Efésios'
          },
          {
            'abbrev': 'fp',
            'name': 'Filipenses'
          },
          {
            'abbrev': 'cl',
            'name': 'Colossenses'
          },
          {
            'abbrev': '1ts',
            'name': '1 Tessalonicenses'
          },
          {
            'abbrev': '2ts',
            'name': '2 Tessalonicenses'
          },
          {
            'abbrev': '1tm',
            'name': '1 Timóteo'
          },
          {
            'abbrev': '2tm',
            'name': '2 Timóteo'
          },
          {
            'abbrev': 'tt',
            'name': 'Tito'
          },
          {
            'abbrev': 'fm',
            'name': 'Filemom'
          },
          {
            'abbrev': 'hb',
            'name': 'Hebreus'
          },
          {
            'abbrev': 'tg',
            'name': 'Tiago'
          },
          {
            'abbrev': '1pe',
            'name': '1 Pedro'
          },
          {
            'abbrev': '2pe',
            'name': '2 Pedro'
          },
          {
            'abbrev': '1jo',
            'name': '1 João'
          },
          {
            'abbrev': '2jo',
            'name': '2 João'
          },
          {
            'abbrev': '3jo',
            'name': '3 João'
          },
          {
            'abbrev': 'jd',
            'name': 'Judas'
          },
          {
            'abbrev': 'ap',
            'name': 'Apocalipse'
          }
        ]
      };
    }

    return ListBooksService;
  }

}());
