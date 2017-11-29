'use strict';

var CARD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var FLAT_TYPE = ['flat', 'house', 'bungalo'];

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
    photos: [], // пустой массив
    getType: function () {
      var type = '';
      switch (this.type) {
        case 'flat': {
          type = 'Квартира';
          break;
        }
        case 'house': {
          type = 'Дом';
          break;
        }
        case 'bungalo': {
          type = 'Бунгало';
          break;
        }
        default: {
          type = 'Жилое помещение';
        }
      }
      return type;
    }
  };
  cards[i].location = {
    x: getRandomNum(300, 900), // случайное число, координата x метки на карте от 300 до 900,
    y: getRandomNum(100, 500) // случайное число, координата y метки на карте от 100 до 500
  };
  cards[i].offer.address = cards[i].location.x + ', ' + cards[i].location.y;
}

var mapPin = document.querySelector('.map__pins');

// Создает фрагмент кода с метками объявлений
var fragment = document.createDocumentFragment();
for (i = 0; i < cardTotalNumber; i++) {
  var button = document.createElement('button');
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

// Находим шаблон объявления
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

// Создаем DOM элемент объявления
var renderCard = function (card) {
  var cardItem = mapCardTemplate.cloneNode(true);
  cardItem.querySelector('h3').textContent = card.offer.title; // Выведите заголовок объявления offer.title в заголовок h3
  cardItem.querySelector('small').textContent = card.offer.address;// Выведите адрес offer.address в соответствующий блок
  cardItem.querySelector('.popup__price').textContent = card.offer.price + '\u20BD/ночь'; // Выведите цену offer.price в блок .popup__price строкой вида {{offer.price}}&#x20bd;/ночь

  // В блок h4 выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house
  cardItem.querySelector('h4').textContent = card.offer.getType();
  var offerRoom = card.offer.rooms === 1 ? ' комната' : ' комнаты';
  var offerQuests = card.offer.guests === 1 ? ' гостя' : ' гостей';
  cardItem.querySelectorAll('p')[2].textContent = card.offer.rooms + offerRoom + ' для ' + card.offer.guests + offerQuests; // Выведите количество гостей и комнат offer.rooms и offer.guests в соответствующий блок строкой вида {{offer.rooms}} для {{offer.guests}} гостей
  cardItem.querySelectorAll('p')[3].textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout; // Время заезда и выезда offer.checkin и offer.checkout в соответствующий блок строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}

  // В список .popup__features выведите все доступные удобства в квартире из массива {{offer.features}} пустыми элементами списка (<li>) с классом feature feature--{{название удобства}}
  var featureList = cardItem.querySelector('.popup__features');
  while (featureList.firstChild) {
    featureList.removeChild(featureList.firstChild);
  }

  for (i = 0; i < card.offer.features.length; i++) {
    var featureListItem = document.createElement('li');
    featureListItem.classList.add('feature', 'feature--' + card.offer.features[i]);
    featureList.appendChild(featureListItem);
  }

  // В соответствующий блок выведите описание объекта недвижимости offer.description
  cardItem.querySelectorAll('p')[4].textContent = card.offer.description;

  // Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
  cardItem.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);

  return cardItem;
};

// Создаем фрагмент разметки с карточкой объявления
fragment = document.createDocumentFragment();
var cardItem = renderCard(cards[0]);
fragment.appendChild(cardItem);


// Находим нужное место в разметке и вставляем фрагмент
var map = document.querySelector('.map');
var mapCard = document.querySelector('.map__filters-container');
map.insertBefore(fragment, mapCard);

map.classList.remove('map--faded');
