console.log('NOTE SCRIPT FINAL LOADED');

(function () {
  const originalAppend = FormData.prototype.append;
  const originalSet = FormData.prototype.set;

  FormData.prototype.append = function (key, value) {
    if (key && key.indexOf('quiz_') === 0) {
      console.log('BLOCKED FIELD:', key);
      return;
    }
    return originalAppend.call(this, key, value);
  };

  FormData.prototype.set = function (key, value) {
    if (key && key.indexOf('quiz_') === 0) {
      console.log('BLOCKED FIELD:', key);
      return;
    }
    return originalSet.call(this, key, value);
  };
})();

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

        if (value) {
          note += labels[name] + ': ' + value + '\n';
        }
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

    form.addEventListener('input', fillNote);
    form.addEventListener('change', fillNote);
    form.addEventListener('submit', fillNote);

    const submitBtn = form.querySelector('.t-submit, [type="submit"]');

    if (submitBtn) {
      submitBtn.addEventListener('mousedown', fillNote);
      submitBtn.addEventListener('click', fillNote);
      submitBtn.addEventListener('touchstart', fillNote);
    }

    fillNote();
  }

  init();
});
