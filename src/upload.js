/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';
/**
  * Подключение зависимости библиотеки browser-cookies в переменную
  */
var browserCookies = require('browser-cookies');
/**
  * Преобразование в строку
  */
var toString = function(str) {
  return '' + str;
};
/**
  * Функция сохранения в cookies последний выбранный фильтр:
  * «Оригинал», «Хром» или «Сепия»
  */
function saveSelectFilter() {
  var selectFilter = document.querySelector('.upload-filter-controls input:checked');
  var dateToExpires = new Date(Date.now() + getTimeNearBirthDay()).toUTCString();
  browserCookies.set('filter', toString(selectFilter.value), {expires: dateToExpires});
  // console.log(browserCookies.set('filter', toString(selectFilter.value), {expires: dateToExpires}));
}

/**
  * Дата рождения @constant {date}
  * Month от 0(ЯНВ) до 11 (ДЕК)
  */
var BIRTHDAY_DATE = new Date('1991', '3', '23');

/**
  * Функция вычисления количества дней с ближайщего дня рождения
  */
function getTimeNearBirthDay() {
  var nowDate = new Date();
  nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
  if (nowDate.getMonth() >= BIRTHDAY_DATE.getMonth()) {
    if (nowDate.getDate() >= BIRTHDAY_DATE.getDate()) {
      BIRTHDAY_DATE.setFullYear(nowDate.getFullYear());
    } else {
      BIRTHDAY_DATE.setFullYear(nowDate.getFullYear() - 1);
    }
  } else {
    BIRTHDAY_DATE.setFullYear(nowDate.getFullYear() - 1);
  }
  return nowDate - BIRTHDAY_DATE;
}
(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }
  var formResize = document.querySelector('#upload-resize');

  formResize.change = function(event) {
    var target = event.target;
    if (!target.is('input')) {
      return;
    }
    validate();
  };

  /**
    * Проверяет, валидны ли данные, в форме кадрирования.
    */
  var resizeXField = formResize.querySelector('#resize-x');
  var resizeYField = formResize.querySelector('#resize-y');
  var resizeSize = formResize.querySelector('#resize-size');
  var submitButton = formResize.querySelector('#resize-fwd');

  var toNumber = function(num) {
    return parseInt(num, 10);
  };
  /** Проверяем данные на следующие критерии:
  Сумма значений полей «слева» и «сторона» не должна быть больше ширины исходного изображения.
  Сумма значений полей «сверху» и «сторона» не должна быть больше высоты исходного изображения.
  Поля «сверху» и «слева» не могут быть отрицательными.
  */
  var validate = function() {
    if ((toNumber(resizeXField.value) + toNumber(resizeSize.value) > currentResizer._image.naturalWidth)
    || (toNumber(resizeYField.value) + toNumber(resizeSize.value) > currentResizer._image.naturalHeigh)
    || (toNumber(resizeXField.value) < 0)
    || (toNumber(resizeYField.value) < 0)) {

      submitButton.setAttribute('disabled', 'true');
      submitButton.classList.add('btn-disabled');

      return false;
    }

    submitButton.removeAttribute('disabled');
    submitButton.classList.remove('btn-disabled');

    return true;
  };
  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработка валидации данных инпута.
   */
  resizeForm.onchange = function() {
    if (validate()) {
      filterImage.src = currentResizer.exportImage().src;
    }
  };
  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();
    saveSelectFilter();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };
  //Устанавливаем фильтр, записанный в cookies, по умолчанию.
  function setDefaultFilter() {
    var controls = document.querySelector('.upload-filter-controls');
    var filterName = browserCookies.get('filter') || 'none';
    var filterSelected = controls.querySelector('#upload-filter-' + filterName);

    filterSelected.setAttribute('checked', true);

  }
  setDefaultFilter();
  cleanupResizer();
  updateBackground();
})();
