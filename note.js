document.addEventListener('DOMContentLoaded', function () {
  function init() {
    const form = document.querySelector('#form2231528201');
    if (!form) {
      setTimeout(init, 500);
      return;
    }

    attachLogic(form);
  }

  function attachLogic(form) {
    function fillNote() {
      const labels = {
        quiz_country: 'Страна проживания',
        quiz_minimumbudget: 'Подходит ли инвестиционный формат от $90,000?',
        quiz_budget: 'Инвестиционный бюджет',
        quiz_timing: 'Срок',
        quiz_goal: 'Цель'
      };

      let note = '';

      Object.keys(labels).forEach(function (name) {
        const fields = form.querySelectorAll('[name="' + name + '"]');
        if (!fields.length) return;

        let value = '';

        fields.forEach(function (field) {
          if ((field.type === 'radio' || field.type === 'checkbox') && field.checked) {
            value = field.value;
          } else if (field.type !== 'radio' && field.type !== 'checkbox') {
            value = field.value;
          }
        });

        if (value) note += labels[name] + ': ' + value + '\n';
      });

      let noteField = form.querySelector('[name="note"]');

      if (!noteField) {
        noteField = document.createElement('input');
        noteField.type = 'hidden';
        noteField.name = 'note';
        form.appendChild(noteField);
      }

      noteField.value = note.trim();
      noteField.setAttribute('value', note.trim());

      console.log('NOTE:', note.trim());
    }

    function removeQuizNames() {
      const quizFields = form.querySelectorAll('[name^="quiz_"]');

      quizFields.forEach(function (field) {
        field.setAttribute('data-original-name', field.name);
        field.removeAttribute('name');
      });

      console.log('Quiz fields removed from submit');
    }

    form.addEventListener('input', fillNote);
    form.addEventListener('change', fillNote);

    form.addEventListener('submit', function () {
      fillNote();
      removeQuizNames();
    });

    fillNote();
  }

  init();
});
