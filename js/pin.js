'use strict';

// Создание пинов
(function () {
  window.pin = {
    generateFragmentWithPins: function (cards) {
      var cardTotalNumber = cards.length >= 5 ? 5 : cards.length;
      // Создает фрагмент кода с метками объявлений
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < cardTotalNumber; i++) {
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
      return fragment;
    },

    removeClassActive: function () {
      var map = document.querySelector('.map');
      var activePin = map.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    },

    removePins: function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (elem) {
        elem.remove();
      });
    }
  };
})();
