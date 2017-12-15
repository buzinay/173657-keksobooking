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
      input.setCustomValidity('Пожалуйста, заполните это поле');
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

  noticeTimeIn.addEventListener('change', function () {
    var index = noticeTimeIn.options.selectedIndex;
    noticeTimeOut.options[index].selected = true;
  });

  noticeTimeOut.addEventListener('change', function () {
    var index = noticeTimeOut.options.selectedIndex;
    noticeTimeIn.options[index].selected = true;
  });

  // Синхронизация минимальной цены в зависимости от типа жилья

  var noticeType = noticeForm.querySelector('#type');
  var noticePrice = noticeForm.querySelector('#price');

  // «Лачуга» — минимальная цена 0
  // «Квартира» — минимальная цена 1000
  // «Дом» — минимальная цена 5000
  // «Дворец» — минимальная цена 10000
  var getMinPrice = function (target) {
    var minPrice;
    switch (target) {
      case 'flat': {
        minPrice = 1000;
        break;
      }
      case 'house': {
        minPrice = 5000;
        break;
      }
      case 'palace': {
        minPrice = 10000;
        break;
      }
      default: {
        minPrice = 0;
        break;
      }
    }
    return minPrice;
  };

  noticeType.addEventListener('change', function (evt) {
    var target = evt.target;
    noticePrice.setAttribute('min', getMinPrice(target.value));
  });

  var maxPrice = 1000000;

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

  var noticeRoomNumber = noticeForm.querySelector('#room_number');
  var noticeCapacity = noticeForm.querySelector('#capacity');

  var setCapacity = function (val) {
    for (var i = 0; i < noticeCapacity.options.length; i++) {
      noticeCapacity.options[i].disabled = true;
    }
    switch (val) {
      case '1': {
        noticeCapacity.options[2].selected = true;
        noticeCapacity.options[2].disabled = false;
        break;
      }
      case '2': {
        noticeCapacity.options[1].selected = true;
        noticeCapacity.options[1].disabled = false;
        noticeCapacity.options[2].disabled = false;
        break;
      }
      case '3': {
        noticeCapacity.options[0].selected = true;
        noticeCapacity.options[0].disabled = false;
        noticeCapacity.options[1].disabled = false;
        noticeCapacity.options[2].disabled = false;
        break;
      }
      default: {
        noticeCapacity.options[3].selected = true;
        noticeCapacity.options[3].disabled = false;
        break;
      }
    }
  };

  noticeRoomNumber.addEventListener('change', function (evt) {
    var target = evt.target;
    setCapacity(target.value);
  });

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

  noticeForm.addEventListener('submit', function (event) {
    if (checkRequiredFields()) {
      event.preventDefault();
    }
  });
  window.form = {
    formOnLoad: function () {
      noticeForm.classList.toggle('notice__form--disabled', true);
      for (var i = 0; i < noticeFormFieldsets.length; i++) {
        noticeFormFieldsets[i].setAttribute('disabled', 'disabled');
      }
      setCapacity(noticeRoomNumber.options[noticeRoomNumber.options.selectedIndex].value);
      noticePrice.setAttribute('min', getMinPrice(noticeType.options[noticeType.options.selectedIndex].value));
    },

    disabledForm: function () {
      noticeForm.classList.remove('notice__form--disabled');
      for (var i = 0; i < noticeFormFieldsets.length; i++) {
        noticeFormFieldsets[i].removeAttribute('disabled');
      }
    }
  };
})();
