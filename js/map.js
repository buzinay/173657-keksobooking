'use strict';

(function () {
  var mapPin = document.querySelector('.map__pins');

  var cards = window.data.generateCards();
  // Вставляем фрагмент в разметку
  var fragment = window.pin.generateFragmentWithPins(cards);
  mapPin.appendChild(fragment);

  var map = document.querySelector('.map');

  map.classList.remove('map--faded');

  var pins = map.querySelectorAll('[data-number]');

  // В момент открытия, страница должна находиться в следующем состоянии: карта затемнена (добавлен класс map--faded) и форма неактивна (добавлен класс notice__form--disabled и все поля формы недоступны, disabled)

  window.onload = function () {
    map.classList.toggle('map--faded', true);
    window.form.formOnLoad();
    window.util.switchHidden(pins, true);
    window.card.closePopup();
  };

  // После того, как на блоке map__pin--main произойдет событие mouseup, форма и карта должны активироваться:
  var mapPinMain = map.querySelector('.map__pin--main');
  mapPinMain.addEventListener('mouseup', function () {
    map.classList.remove('map--faded'); // У карты убрать класс map--faded
    window.util.switchHidden(pins);
    // У формы убрать класс notice__form--disabled и сделать все поля формы активными
    window.form.disabledForm();
  });

  // При нажатии на любой из элементов .map__pin ему должен добавляться класс map__pin--active и должен показываться элемент .popup
  // Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать

  map.addEventListener('click', function (evt) {
    var target = evt.target;
    window.pin.removeClassActive();
    while (target !== map) {
      if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
        target.classList.add('map__pin--active');
        var activePinNumber = target.getAttribute('data-number');
        window.card.renderCard(cards[activePinNumber]);
        window.card.openPopup();
        return;
      }
      target = target.parentNode;
    }
  });
})();
