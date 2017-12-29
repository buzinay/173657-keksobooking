'use strict';

(function () {

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

  // Заполняем DOM элемент объявления
  window.card = {
    createPopupFragment: function () {
      // Находим шаблон объявления
      var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
      var cardItem = mapCardTemplate.cloneNode(true);

      // Генерируем  фрагмент разметки с карточкой объявления из шаблона и вставляем в разметку
      // Создаем фрагмент разметки с карточкой объявления
      var fragment = document.createDocumentFragment();
      fragment.appendChild(cardItem);
      return fragment;
    },
    renderCard: function (card, popup) {
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

      for (var i = 0; i < card.offer.features.length; i++) {
        var featureListItem = document.createElement('li');
        featureListItem.classList.add('feature', 'feature--' + card.offer.features[i]);
        featureList.appendChild(featureListItem);
      }

      // В соответствующий блок выведите описание объекта недвижимости offer.description
      popup.querySelectorAll('p')[4].textContent = card.offer.description;

      var pictureList = popup.querySelector('.popup__pictures');
      while (pictureList.firstChild) {
        pictureList.removeChild(pictureList.firstChild);
      }

      var generatePhotoListItem = function (photo) {
        var photoListItem = document.createElement('li');
        var photoItem = document.createElement('img');
        photoItem.setAttribute('src', photo);
        photoItem.style.width = '45px';
        photoItem.style.margin = '2px';
        photoListItem.appendChild(photoItem);
        return photoListItem;
      };

      var fragment = document.createDocumentFragment();
      for (i = 0; i < card.offer.photos.length; i++) {
        fragment.appendChild(generatePhotoListItem(card.offer.photos[i]));
      }

      pictureList.appendChild(fragment);

      // Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
      popup.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);
    }
  };
})();
