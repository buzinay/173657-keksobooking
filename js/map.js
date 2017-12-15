'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPin = document.querySelector('.map__pins');

  var cards = window.data.generateCards();

  // Вставляем фрагмент со сгенерированными пинами в разметку
  var fragment = window.pin.generateFragmentWithPins(cards);
  mapPin.appendChild(fragment);
  fragment = window.card.createPopupFragment();
  // Находим нужное место в разметке и вставляем фрагмент для карточки объявления
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  map.insertBefore(fragment, mapFiltersContainer);

  map.classList.remove('map--faded');

  var pins = map.querySelectorAll('[data-number]');
  var popup = map.querySelector('.map__card');
  window.console.log('popup' + popup);

  // В момент открытия, страница должна находиться в следующем состоянии: карта затемнена (добавлен класс map--faded) и форма неактивна (добавлен класс notice__form--disabled и все поля формы недоступны, disabled)

  window.onload = function () {
    map.classList.toggle('map--faded', true);
    window.form.formOnLoad();
    window.utils.switchHidden(pins, true);
    closePopup();
  };

  // После того, как на блоке map__pin--main произойдет событие mouseup, форма и карта должны активироваться:
  var mapPinMain = map.querySelector('.map__pin--main');
  mapPinMain.addEventListener('mouseup', function () {
    map.classList.remove('map--faded'); // У карты убрать класс map--faded
    window.utils.switchHidden(pins);
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
        window.card.renderCard(cards[activePinNumber], popup);
        openPopup();
        return;
      }
      target = target.parentNode;
    }
  });

  // Открыть карточку
  var openPopup = function () {
    window.utils.switchHidden(popup);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    window.utils.switchHidden(popup, true);
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
    window.utils.isEscEvent(evt, window.pin.removeClassActive);
  };

  // Закрыть карточку
  var popupClose = popup.querySelector('.popup__close');
  popupClose.addEventListener('click', function () {
    closePopup();
  });
})();
