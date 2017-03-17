(function () {
  'use strict';

  angular
    .module('user-meta')
    .controller('VerseNoteController', VerseNoteController);

  function VerseNoteController($mdDialog, Toast, currentNote) {
    var vm = this;
    vm.versesNote = currentNote;

    vm.hide = function() {
      $mdDialog.hide();
    };

    vm.saveNote = function() {
      if (!vm.versesNote.note || vm.versesNote.note.length < 2) {
        Toast.warning('O campo nota deve ter no mínimo 2 caracteres');
        return;
      }
      $mdDialog.hide(vm.versesNote);
    };
  }
}());
