(function () {
  'use strict';

  angular
    .module('books')
    .factory('ListBooksService', ListBooksService);

  ListBooksService.$inject = [];

  function ListBooksService() {
    var ListBooksService = {
      getBooks: getBooks,
      getChaptersByAbbrev: getChaptersByAbbrev
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

    function getChaptersByAbbrev(abbrev) {
      return new Array(chaptersAmmount[abbrev]);
    }

    var chaptersAmmount = {
      'gn': 50,
      'ex': 40,
      'lv': 27,
      'nm': 36,
      'dt': 34,
      'js': 24,
      'jz': 21,
      'rt': 4,
      '1sm': 31,
      '2sm': 24,
      '1rs': 22,
      '2rs': 25,
      '1cr': 29,
      '2cr': 36,
      'ed': 10,
      'ne': 13,
      'et': 10,
      'jó': 42,
      'sl': 150,
      'pv': 31,
      'ec': 12,
      'ct': 8,
      'is': 66,
      'jr': 52,
      'lm': 5,
      'ez': 48,
      'dn': 12,
      'os': 14,
      'jl': 3,
      'am': 9,
      'ob': 1,
      'jn': 4,
      'mq': 7,
      'na': 3,
      'hc': 3,
      'sf': 3,
      'ag': 2,
      'zc': 14,
      'ml': 4,
      'mt': 28,
      'mc': 16,
      'lc': 24,
      'jo': 21,
      'atos': 28,
      'rm': 16,
      '1co': 16,
      '2co': 13,
      'gl': 6,
      'ef': 6,
      'fp': 4,
      'cl': 4,
      '1ts': 5,
      '2ts': 3,
      '1tm': 6,
      '2tm': 4,
      'tt': 3,
      'fm': 1,
      'hb': 13,
      'tg': 5,
      '1pe': 5,
      '2pe': 3,
      '1jo': 3,
      '2jo': 1,
      '3jo': 1,
      'jd': 1,
      'ap': 22
    };

    return ListBooksService;
  }

}());
