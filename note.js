console.log('NOTE SCRIPT FINAL WITH VALIDATION LOADED');

function cleanQuizFields(body) {
  try {
    if (body instanceof FormData) {
      Array.from(body.keys()).forEach(function (key) {
        if (key.indexOf('quiz_') === 0) {
          body.delete(key);
          console.log('REMOVED FROM FORMDATA:', key);
        }
      });
      return body;
    }

    if (body instanceof URLSearchParams) {
      Array.from(body.keys()).forEach(function (key) {
        if (key.indexOf('quiz_') === 0) {
          body.delete(key);
          console.log('REMOVED FROM URLSEARCHPARAMS:', key);
        }
      });
      return body;
    }

    if (typeof body === 'string' && body.indexOf('quiz_') !== -1) {
      const params = new URLSearchParams(body);

      Array.from(params.keys()).forEach(function (key) {
        if (key.indexOf('quiz_') === 0) {
          params.delete(key);
          console.log('REMOVED FROM STRING:', key);
        }
      });

      return params.toString();
    }
  } catch (e) {
    console.log('CLEAN QUIZ ERROR:', e);
  }

  return body;
}

(function () {
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (body) {
    body = cleanQuizFields(body);
    return originalSend.call(this, body);
  };

  if (window.fetch) {
    const originalFetch = window.fetch;

    window.fetch = function (resource, config) {
      if (config && config.body) {
        config.body = cleanQuizFields(config.body);
      }

      return originalFetch.call(this, resource, config);
    };
  }
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
    const labels = {
      quiz_country: 'Страна проживания',
      quiz_minimumbudget: 'Подходит ли инвестиционный формат от $90,000?',
      quiz_budget: 'Инвестиционный бюджет',
      quiz_timing: 'Срок',
      quiz_goal: 'Цель'
    };

    function getFieldValue(name) {
      const fields = form.querySelectorAll('[name="' + name + '"]');
      let value = '';

      fields.forEach(function (field) {
        if ((field.type === 'radio' || field.type === 'checkbox') && field.checked) {
          value = field.value;
        } else if (field.type !== 'radio' && field.type !== 'checkbox' && field.value.trim()) {
          value = field.value.trim();
        }
      });

      return value;
    }

    function validateQuizFields() {
      for (const name in labels) {
        const value = getFieldValue(name);

        if (!value) {
          alert('Пожалуйста, заполните поле: ' + labels[name]);
          return false;
        }
      }

      return true;
    }

    function fillNote() {
      let note = '';

      Object.keys(labels).forEach(function (name) {
        const value = getFieldValue(name);

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

    form.addEventListener(
      'submit',
      function (e) {
        fillNote();

        if (!validateQuizFields()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      },
      true
    );

    const submitBtn = form.querySelector('.t-submit, [type="submit"]');

    if (submitBtn) {
      submitBtn.addEventListener('mousedown', fillNote);
      submitBtn.addEventListener('click', function (e) {
        fillNote();

        if (!validateQuizFields()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      }, true);
      submitBtn.addEventListener('touchstart', fillNote);
    }

    fillNote();
  }

  init();
});
