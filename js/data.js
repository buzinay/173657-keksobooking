'use strict';

(function () {
  var CARD_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var CHECK_TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var FLAT_TYPE = ['flat', 'house', 'bungalo'];

  var cardTotalNumber = 8;// ??????Где определить?
  var titles = window.utils.randomArray(CARD_TITLE, cardTotalNumber);

  window.data = {
    generateCards: function () {
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
          price: window.utils.getRandomNum(1000, 1000000), // число, случайная цена от 1000 до 1000000
          type: FLAT_TYPE[window.utils.getRandomNum(0, FLAT_TYPE.length - 1)], // строка с одним из трех фиксированных значений: flat, house или bungalo
          rooms: window.utils.getRandomNum(1, 5), // число, случайное количество комнат от 1 до 5
          guests: window.utils.getRandomNum(1, 20), // число, случайное количество гостей, которое можно разместить
          checkin: CHECK_TIME[window.utils.getRandomNum(0, CHECK_TIME.length - 1)], // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00,
          checkout: CHECK_TIME[window.utils.getRandomNum(0, CHECK_TIME.length - 1)], // строка с одним из трех фиксированных значений: 12:00, 13:00 или 14:00
          features: window.utils.randomArray(FEATURES, window.utils.getRandomNum(1, FEATURES.length)), // массив строк случайной длины из ниже предложенных: 'wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner',
          description: '', // пустая строка,
          photos: [] // пустой массив
        };
        cards[i].location = {
          x: window.utils.getRandomNum(300, 900), // случайное число, координата x метки на карте от 300 до 900,
          y: window.utils.getRandomNum(100, 500) // случайное число, координата y метки на карте от 100 до 500
        };
        cards[i].offer.address = cards[i].location.x + ', ' + cards[i].location.y;
      }
      return cards;
    }
  };
})();
