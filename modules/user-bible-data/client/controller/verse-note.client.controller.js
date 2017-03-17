(function () {
  'use strict';

  angular
    .module('user-bible-data')
    .controller('VerseNoteController', VerseNoteController);

  function VerseNoteController($mdDialog, Toast, currentNote) {
    var vm = this;
    vm.versesNote = currentNote;
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
      $mdDialog.hide(vm.versesNote);
    }
  }
}());
