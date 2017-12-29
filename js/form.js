'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeTitle = noticeForm.querySelector('#title');
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  var minTitle = 30;
  var maxTitle = 100;

  noticeTitle.addEventListener('invalid', function (evt) {
    var target = evt.target;
    checkNoticeTitle(target);
  });

  noticeTitle.addEventListener('keydown', function (evt) {
    var target = evt.target;
    checkNoticeTitle(target);
  });

  var checkNoticeTitle = function (input) {
    if (input.validity.valueMissing || input.value === '') {
      input.setCustomValidity('Пожалуйста, заполните это поле');
      setErrorStyle(input);
    } else if (input.validity.tooLong || input.length > maxTitle) {
      input.setCustomValidity('Заголовок не должен превышать 100 символов');
      setErrorStyle(input);
    } else if (input.validity.tooShort || input.value.length < minTitle) {
      input.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
      setErrorStyle(input);
    } else {
      removeErrorStyle(input);
    }
  };

  var setErrorStyle = function (elem) {
    elem.setAttribute('style', 'border:3px solid red');
  };

  var removeErrorStyle = function (elem) {
    elem.setCustomValidity('');
    elem.removeAttribute('style');
  };

  var noticeAddress = noticeForm.querySelector('#address');
  var checkAddressValidity = function (input) {
    if (input.validity.valueMissing || input.value === '') {
      input.setCustomValidity('Пожалуйста, выберите местоположение Вашего помещения на карте');
      setErrorStyle(input);
    } else {
      removeErrorStyle(input);
    }
  };

  noticeAddress.addEventListener('invalid', function (evt) {
    var target = evt.target;
    checkAddressValidity(target);
  });

  // Синхронизация время выезда со временем въезда
  var noticeTimeIn = noticeForm.querySelector('#timein');
  var noticeTimeOut = noticeForm.querySelector('#timeout');
  var timeIn = window.data.getCheckTimes();
  var timeOut = window.data.getCheckTimes();

  var syncValues = function (element, value) {
    element.value = value;
  };

  noticeTimeIn.addEventListener('change', function () {
    window.synchronizeFields(noticeTimeIn, noticeTimeOut, timeIn, timeOut, syncValues);
  });

  noticeTimeOut.addEventListener('change', function () {
    window.synchronizeFields(noticeTimeOut, noticeTimeIn, timeOut, timeIn, syncValues);
  });

  // Синхронизация минимальной цены в зависимости от типа жилья

  var noticeType = noticeForm.querySelector('#type');
  var noticePrice = noticeForm.querySelector('#price');
  var minPrices = window.data.getFlatMinPrice();
  var flatTypes = window.data.getFlatType();

  // «Лачуга» — минимальная цена 0
  // «Квартира» — минимальная цена 1000
  // «Дом» — минимальная цена 5000
  // «Дворец» — минимальная цена 10000

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  noticeType.addEventListener('change', function () {
    window.synchronizeFields(noticeType, noticePrice, flatTypes, minPrices, syncValueWithMin);
  });

  var maxPrice = 1000000;

  var getMinPrice = function (value) {
    var index = flatTypes.indexOf(value);
    var minPrice = minPrices[index];
    return minPrice;
  };

  var checkPriceValidity = function (input) {
    var currentMinPrice = getMinPrice(noticeType.value);
    if (input.validity.valueMissing || input.value === '') {
      input.setCustomValidity('Пожалуйста, заполните это поле');
      setErrorStyle(input);
    } else if (input.validity.rangeUnderflow || input.value < currentMinPrice) {
      input.setCustomValidity('Минимальныя цена должна быть не ниже ' + currentMinPrice);
      setErrorStyle(input);
    } else if (input.validity.rangeOverflow || input.value > maxPrice) {
      input.setCustomValidity('Максимальная цена должна быть ниже 1000000 ');
      setErrorStyle(input);
    } else {
      removeErrorStyle(input);
    }
  };

  noticePrice.addEventListener('invalid', function (evt) {
    var target = evt.target;
    checkPriceValidity(target);
  });

  noticePrice.addEventListener('change', function (evt) {
    var target = evt.target;
    checkPriceValidity(target);
  });

  // Количество комнат связано с количеством гостей:
  // 1 комната — «для одного гостя»
  // 2 комнаты — «для 2-х или 1-го гостя»
  // 3 комнаты — «для 2-х, 1-го или 3-х гостей»
  // 100 комнат — «не для гостей»
  // Синхронизация количество комнат с количеством гостей
  var noticeRoomNumber = noticeForm.querySelector('#room_number');
  var noticeCapacity = noticeForm.querySelector('#capacity');
  var roomNumbers = window.data.getFlatTotalRoom();
  var flatCapacities = window.data.getFlatCapacity();

  var syncFlatCapacity = function (element, values) {
    for (var i = 0; i < element.options.length; i++) {
      element.options[i].disabled = true;
    }
    for (i = 0; i < values.length; i++) {
      for (var j = 0; j < element.options.length; j++) {
        if (element.options[j].value === values[i]) {
          element.options[j].disabled = false;
          element.options[j].selected = true;
        }
      }
    }
  };

  noticeRoomNumber.addEventListener('change', function () {
    window.synchronizeFields(noticeRoomNumber, noticeCapacity, roomNumbers, flatCapacities, syncFlatCapacity);
  });

  // Проверка на заполнение обязательных оплей
  var requiredFields = ['title', 'address', 'price'];
  var noticeFormFields = noticeForm.querySelectorAll('input:not([type="submit"])');

  var checkRequiredFields = function () {
    var error = false;
    for (var i = 0; i < requiredFields.length; i++) {
      for (var j = 0; j < noticeFormFields.length; j++) {
        if (noticeFormFields[j].name === requiredFields[i] && noticeFormFields[j].value === '') {
          setErrorStyle(noticeFormFields[j]);
          error = true;
        }
      }
    }
    return error;
  };

  var synchronizeNoticeFormFields = function () {
    window.synchronizeFields(noticeRoomNumber, noticeCapacity, roomNumbers, flatCapacities, syncFlatCapacity);
    window.synchronizeFields(noticeTimeIn, noticeTimeOut, timeIn, timeOut, syncValues);
    window.synchronizeFields(noticeType, noticePrice, flatTypes, minPrices, syncValueWithMin);
  };

  var onSuccess = function () {
    noticeForm.reset();
    synchronizeNoticeFormFields();
  };

  noticeForm.addEventListener('submit', function (event) {
    if (checkRequiredFields()) {
      event.preventDefault();
    } else {
      window.backend.upload(new FormData(noticeForm), onSuccess, window.backend.onError);
      event.preventDefault();
    }
  });

  window.form = {
    formOnLoad: function () {
      noticeForm.classList.toggle('notice__form--disabled', true);
      for (var i = 0; i < noticeFormFieldsets.length; i++) {
        noticeFormFieldsets[i].disabled = true;
      }
      synchronizeNoticeFormFields();
    },

    disabledForm: function () {
      noticeForm.classList.remove('notice__form--disabled');
      for (var i = 0; i < noticeFormFieldsets.length; i++) {
        noticeFormFieldsets[i].disabled = false;
      }
    }
  };
})();
