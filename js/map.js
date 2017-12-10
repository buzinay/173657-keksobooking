'use strict';

var CARD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var FLAT_TYPE = ['flat', 'house', 'bungalo'];
var ESC_KEYCODE = 27;

// Функция для выбора случайного числа в диапазоне от min до max
var getRandomNum = function (min, max) {
  var randomNum = Math.round(Math.random() * (max - min)) + min;
  return randomNum;
};

//  Функция возвращает неповторяющийся случайный подмассив из элементов массива array длиной length
var randomArray = function (array, length) {
  var nonRepeatingRandomNumbers = [];
  var nonRepeatingArray = [];
  var i = 0;

  while (i < length) {
    var randomNum = getRandomNum(0, array.length - 1);
    if (!nonRepeatingRandomNumbers[randomNum]) {
      nonRepeatingRandomNumbers[randomNum] = 1;
      nonRepeatingArray[i] = array[randomNum];
      i++;
    }
  }
  return nonRepeatingArray;
};

var cardTotalNumber = 8;
var titles = randomArray(CARD_TITLE, cardTotalNumber);

// Генерируем карточки объявлений
var cards = [];
for (var i = 0; i < cardTotalNumber; i++) {
  cards[i] = {};
  cards[i].author = {
    avatar: 'img/avatars/user0' + (i + 1) + '.png',
  }; // строка, адрес изображения вида img/avatars/user{{xx}}.png, где xx это число от 1 до 8

  cards[i].offer = {
    title: titles[i],
    address: '', // строка, адрес предложения, представляет собой запись вида '{{location.x}}, {{location.y}}'
    price: getRandomNum(1000, 1000000), // число, случайная цена от 1000 до 1000000
    type: FLAT_TYPE[getRandomNum(0, FLAT_TYPE.length - 1)], // строка с одним из трех фиксированных значений: flat, house или bungalo
    rooms: getRandomNum(1, 5), // число, случайное количество комнат от 1 до 5
    guests: getRandomNum(1, 20), // число, случайное количество гостей, которое можно разместить
    checkin: CHECK_TIME[getRandomNum(0, CHECK_TIME.length - 1)], // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00,
    checkout: CHECK_TIME[getRandomNum(0, CHECK_TIME.length - 1)], // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00
    features: randomArray(FEATURES, getRandomNum(1, FEATURES.length)), // массив строк случайной длины из ниже предложенных: 'wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner',
    description: '', // пустая строка,
    photos: [] // пустой массив
  };
  cards[i].location = {
    x: getRandomNum(300, 900), // случайное число, координата x метки на карте от 300 до 900,
    y: getRandomNum(100, 500) // случайное число, координата y метки на карте от 100 до 500
  };
  cards[i].offer.address = cards[i].location.x + ', ' + cards[i].location.y;
}

var getType = function (card) {
  var type = '';
  switch (card.offer.type) {
    case 'house': {
      type = 'Дом';
      break;
    }
    case 'bungalo': {
      type = 'Бунгало';
      break;
    }
    default: {
      type = 'Квартира';
    }
  }
  return type;
};

var mapPin = document.querySelector('.map__pins');

// Создает фрагмент кода с метками объявлений
var fragment = document.createDocumentFragment();
for (i = 0; i < cardTotalNumber; i++) {
  var button = document.createElement('button');
  button.setAttribute('data-number', +i);
  var img = document.createElement('img');
  img.setAttribute('src', cards[i].author.avatar);
  img.setAttribute('width', '40');
  img.setAttribute('height', '40');
  img.setAttribute('draggable', 'false');
  button.className = 'map__pin';
  button.style.left = (cards[i].location.x - parseInt(img.getAttribute('width'), 10) / 2) + 'px';
  button.style.top = (cards[i].location.y - parseInt(img.getAttribute('height'), 10)) + 'px';
  button.appendChild(img);

  fragment.appendChild(button);
}

// Вставляем фрагмент в разметку
mapPin.appendChild(fragment);

var map = document.querySelector('.map');
// Находим шаблон объявления
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var cardItem = mapCardTemplate.cloneNode(true);

// Генерируем  фрагмент разметки с карточкой объявления из шаблона и вставляем в разметку
var createPopup = function () {
// Создаем фрагмент разметки с карточкой объявления
  fragment = document.createDocumentFragment();
  fragment.appendChild(cardItem);

  // Находим нужное место в разметке и вставляем фрагмент
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  map.insertBefore(fragment, mapFiltersContainer);
};
map.classList.remove('map--faded');

createPopup();

var popup = map.querySelector('.map__card');

// Заполняем DOM элемент объявления
var renderCard = function (card) {
  popup.querySelector('h3').textContent = card.offer.title; // Выведите заголовок объявления offer.title в заголовок h3
  popup.querySelector('small').textContent = card.offer.address;// Выведите адрес offer.address в соответствующий блок
  popup.querySelector('.popup__price').textContent = card.offer.price + '\u20BD/ночь'; // Выведите цену offer.price в блок .popup__price строкой вида {{offer.price}}&#x20bd;/ночь

  // В блок h4 выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house
  popup.querySelector('h4').textContent = getType(card);
  var offerRoom = card.offer.rooms === 1 ? ' комната' : ' комнаты';
  var offerQuests = card.offer.guests === 1 ? ' гостя' : ' гостей';
  popup.querySelectorAll('p')[2].textContent = card.offer.rooms + offerRoom + ' для ' + card.offer.guests + offerQuests; // Выведите количество гостей и комнат offer.rooms и offer.guests в соответствующий блок строкой вида {{offer.rooms}} для {{offer.guests}} гостей
  popup.querySelectorAll('p')[3].textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout; // Время заезда и выезда offer.checkin и offer.checkout в соответствующий блок строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}

  // В список .popup__features выведите все доступные удобства в квартире из массива {{offer.features}} пустыми элементами списка (<li>) с классом feature feature--{{название удобства}}
  var featureList = popup.querySelector('.popup__features');
  while (featureList.firstChild) {
    featureList.removeChild(featureList.firstChild);
  }

  for (i = 0; i < card.offer.features.length; i++) {
    var featureListItem = document.createElement('li');
    featureListItem.classList.add('feature', 'feature--' + card.offer.features[i]);
    featureList.appendChild(featureListItem);
  }

  // В соответствующий блок выведите описание объекта недвижимости offer.description
  popup.querySelectorAll('p')[4].textContent = card.offer.description;

  // Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
  popup.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);
};


// ===============================================================
var switchHidden = function (elem, flag) {
  if (elem.length) {
    for (i = 0; i < elem.length; i++) {
      if (flag) {
        elem[i].classList.add('hidden');
      } else {
        elem[i].classList.remove('hidden');
      }
    }
  } else {
    if (flag) {
      elem.classList.add('hidden');
    } else {
      elem.classList.remove('hidden');
    }
  }
};

var pins = map.querySelectorAll('[data-number]');

var removeClassActive = function () {
  var activePin = map.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// В момент открытия, страница должна находиться в следующем состоянии: карта затемнена (добавлен класс map--faded) и форма неактивна (добавлен класс notice__form--disabled и все поля формы недоступны, disabled)
var noticeForm = document.querySelector('.notice__form');
var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');

window.onload = function () {
  map.classList.toggle('map--faded', true);
  noticeForm.classList.toggle('notice__form--disabled', true);
  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].setAttribute('disabled', 'disabled');
  }
  setCapacity(noticeRoomNumber.options[noticeRoomNumber.options.selectedIndex].value);
  noticePrice.setAttribute('min', getMinPrice(noticeType.options[noticeType.options.selectedIndex].value));
  switchHidden(pins, true);
  closePopup();
};

// После того, как на блоке map__pin--main произойдет событие mouseup, форма и карта должны активироваться:
var mapPinMain = map.querySelector('.map__pin--main');
mapPinMain.addEventListener('mouseup', function () {
  map.classList.remove('map--faded'); // У карты убрать класс map--faded
  switchHidden(pins);
  // У формы убрать класс notice__form--disabled и сделать все поля формы активными
  noticeForm.classList.remove('notice__form--disabled');
  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].removeAttribute('disabled');
  }
});

// При нажатии на любой из элементов .map__pin ему должен добавляться класс map__pin--active и должен показываться элемент .popup
// Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать

map.addEventListener('click', function (evt) {
  var target = evt.target;
  removeClassActive();
  while (target !== map) {
    if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
      target.classList.add('map__pin--active');
      var activePinNumber = target.getAttribute('data-number');
      renderCard(cards[activePinNumber]);
      openPopup();
      return;
    }
    target = target.parentNode;
  }
});

// Закрыть карточку
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeClassActive();
    closePopup();
  }
};

var closePopup = function () {
  switchHidden(popup, true);
  // popup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

// Открыть карточку
var openPopup = function () {
  switchHidden(popup);
  // popup.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

// Закрыть карточку
var popupClose = popup.querySelector('.popup__close');
popupClose.addEventListener('click', function () {
  closePopup();
});

// ====Валидация формы============================================

var noticeTitle = noticeForm.querySelector('#title');
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
    input.setCustomValidity('');
    input.removeAttribute('style');
  }
};

var setErrorStyle = function (elem) {
  elem.setAttribute('style', 'border:3px solid red');
};

var noticeAddress = noticeForm.querySelector('#address');
var checkAddressValidity = function (input) {
  if (input.validity.valueMissing || input.value === '') {
    input.setCustomValidity('Пожалуйста, заполните это поле');
    setErrorStyle(input);
  } else {
    input.setCustomValidity('');
    input.removeAttribute('style');
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
    // input.setCustomValidity('');
    input.setCustomValidity('Пожалуйста, заполните это поле');
    setErrorStyle(input);
  } else if (input.validity.rangeUnderflow || input.value < currentMinPrice) {
    // input.setCustomValidity('');
    input.setCustomValidity('Минимальныя цена должна быть не ниже ' + currentMinPrice);
    setErrorStyle(input);
  } else if (input.validity.rangeOverflow || input.value > maxPrice) {
    // input.setCustomValidity('');
    input.setCustomValidity('Максимальная цена должна быть ниже 1000000 ');
    setErrorStyle(input);
  } else {
    input.setCustomValidity('');
    input.removeAttribute('style');
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
// noticeTimeIn.options[index].selected = true;

var noticeRoomNumber = noticeForm.querySelector('#room_number');
var noticeCapacity = noticeForm.querySelector('#capacity');

var setCapacity = function (val) {
  for (i = 0; i < noticeCapacity.options.length; i++) {
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
  for (i = 0; i < requiredFields.length; i++) {
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
