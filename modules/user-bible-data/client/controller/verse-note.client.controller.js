(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseNoteController', VerseNoteController);

  function VerseNoteController($mdDialog, Toast, currentNote, selectedVerses) {
    var vm = this;
    vm.versesNote = angular.copy(currentNote);
    vm.selectedVerses = selectedVerses;
    vm.saveNote = saveNote;
    vm.hide = hide;

    function hide() {
      $mdDialog.hide();
    }

    function saveNote() {
      if (!vm.versesNote.note || vm.versesNote.note.length < 2) {
        Toast.warning('O campo nota deve ter no mínimo 2 caracteres');
        return;
      }
      currentNote.note = vm.versesNote.note;
      $mdDialog.hide(currentNote);
    }
  }
}());
