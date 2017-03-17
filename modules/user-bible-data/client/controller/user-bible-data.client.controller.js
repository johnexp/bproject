(function () {
  'use strict';

  // Books controller
  angular
    .module('books')
    .controller('UserMetaController', UserMetaController);

  UserMetaController.$inject = ['Authentication', 'Toast', '$stateParams', 'UserMetaService'];

  function UserMetaController (Authentication, Toast, $stateParams, UserMetaService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.selectedVerses = [];
    vm.selectVerse = selectVerse;
    vm.markVerses = markVerses;
    vm.unmarkVerses = unmarkVerses;
    vm.selectAllVerses = selectAllVerses;
    vm.userMeta = {};
    vm.markers = {};
    vm.setVersesMark = setVersesMark;
    vm.versesCount = 0;
    vm.getUserMeta = getUserMeta;

    function getUserMeta() {
      $stateParams.abbrev = $stateParams.abbrev || 'gn';
      $stateParams.chapter = $stateParams.chapter || 1;
      UserMetaService.get({
        book: $stateParams.abbrev,
        chapter: $stateParams.chapter
      }, function (res) {
        vm.userMeta = res;
        setVersesMark();
      });
    }

    function selectVerse(verse) {
      if (!findVerse(verse)) {
        vm.selectedVerses.push(verse);
      } else {
        var index = findVerseIndex(verse);
        vm.selectedVerses.splice(index, 1);
      }
    }

    function selectAllVerses() {
      vm.selectedVerses = [];
      for (var i = 1; i <= vm.versesCount; i++) {
        vm.selectedVerses.push(i);
      }
    }

    function findVerse(verseToFind) {
      return vm.selectedVerses.find(function (verse) {
        return verse === verseToFind;
      });
    }

    function findVerseIndex(verseToFind) {
      return vm.selectedVerses.findIndex(function (verse) {
        return verse === verseToFind;
      });
    }

    function setVersesMark() {
      var markers = {};
      for (var i = 0; i < vm.userMeta.markers.length; i++) {
        for (var j = 0; j < vm.userMeta.markers[i].verses.length; j++) {
          markers[vm.userMeta.markers[i].verses[j]] = vm.userMeta.markers[i].color;
        }
      }
      vm.markers = markers;
    }

    function unmarkVerses() {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        for (var j = 0; j < vm.userMeta.markers.length; j++) {
          var verseIndex = vm.userMeta.markers[j].verses.indexOf(vm.selectedVerses[i]);
          if (verseIndex !== -1) {
            vm.userMeta.markers[j].verses.splice(verseIndex, 1);
          }
        }
      }
      saveUserMeta();
    }

    function markVerses(color) {
      var mustCreate = true;
      for (var i = 0; i < vm.userMeta.markers.length; i++) {
        if (vm.userMeta.markers[i].color === color) {
          addSelectedVersesToMarker(vm.userMeta.markers[i]);
          mustCreate = false;
        } else {
          removeAlreadyMarked(vm.userMeta.markers[i]);
        }
      }
      if (mustCreate) {
        vm.userMeta.markers.push({ color: color, verses: vm.selectedVerses });
      }
      saveUserMeta();
    }

    function addSelectedVersesToMarker(marker) {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        if (marker.verses.indexOf(vm.selectedVerses[i]) === -1) {
          marker.verses.push(vm.selectedVerses[i]);
        }
      }
    }

    function removeAlreadyMarked(marker) {
      for (var i = 0; i < vm.selectedVerses.length; i++) {
        var verseIndex = marker.verses.indexOf(vm.selectedVerses[i]);
        if (verseIndex !== -1) {
          marker.verses.splice(verseIndex, 1);
        }
      }
    }

    function clearEmptyDocuments() {
      var markersLength = vm.userMeta.markers.length;
      for (var i = markersLength - 1; i >= 0; i--) {
        if (vm.userMeta.markers[i].verses.length === 0) {
          vm.userMeta.markers.splice(i, 1);
        }
      }
    }

    function saveUserMeta() {
      clearEmptyDocuments();
      vm.userMeta.createOrUpdate()
        .then(onSuccess)
        .catch(onError);

      function onSuccess(userMeta) {
        vm.userMeta = userMeta;
        setVersesMark();
      }

      function onError() {
        Toast.genericErrorMessage();
      }
    }
  }

}());
