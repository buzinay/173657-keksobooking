'use strict';

(function () {
  var CHECK_TIME = ['12:00', '13:00', '14:00'];
  var FLAT_TYPE = ['flat', 'house', 'palace', 'bungalo'];
  var FLAT_MIN_PRICE = ['1000', '5000', '10000', '0'];
  var FLAT_TOTAL_ROOM = ['1', '2', '3', '100'];
  var FLAT_CAPACITY = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];
  var COORDINATE_RANGE = {
    minX: 300,
    maxX: 900,
    minY: 100,
    maxY: 500
  };
  var cardTotalNumber = 8;

  window.data = {
    generateCards: function (data) {
      // Генерируем карточки объявлений
      var cards = [];
      for (var i = 0; i < cardTotalNumber; i++) {
        cards[i] = data[i];
      }
      return cards;
    },

    getCoordinateRange: function () {
      var coordinateRange = COORDINATE_RANGE;
      return coordinateRange;
    },

    getCheckTimes: function () {
      var chekTimes = CHECK_TIME;
      return chekTimes;
    },

    getFlatType: function () {
      var flatTypes = FLAT_TYPE;
      return flatTypes;
    },

    getFlatMinPrice: function () {
      var flatMinPrices = FLAT_MIN_PRICE;
      return flatMinPrices;
    },

    getFlatTotalRoom: function () {
      var flatTotalRooms = FLAT_TOTAL_ROOM;
      return flatTotalRooms;
    },

    getFlatCapacity: function () {
      var flatCapacity = FLAT_CAPACITY;
      return flatCapacity;
    }
  };
})();
