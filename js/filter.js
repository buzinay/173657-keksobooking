'use strict';

// фильтрация данных
(function () {
  var filterForm = document.querySelector('.map__filters');
  var housingType = filterForm.querySelector('#housing-type');
  var housingPrice = filterForm.querySelector('#housing-price');
  var housingRooms = filterForm.querySelector('#housing-rooms');
  var housingGuests = filterForm.querySelector('#housing-guests');
  var housingFeatureList = filterForm.querySelector('#housing-features');


  var getHousingRangeType = function (data) {
    return housingType.value === 'any' ? true : housingType.value === data.offer.type;
  };

  var getHousingRangePrice = function (data) {
    var rangePrice;
    switch (housingPrice.value) {
      case 'low': {
        rangePrice = data.offer.price < 10000;
        break;
      }
      case 'middle': {
        rangePrice = data.offer.price >= 10000 && data.offer.price < 50000;
        break;
      }
      case 'high': {
        rangePrice = data.offer.price >= 50000;
        break;
      }
      default: {
        rangePrice = true;
      }
    }
    return rangePrice;
  };

  var getHousingRangeRooms = function (data) {
    return housingRooms.value === 'any' ? true : housingRooms.value === (data.offer.rooms).toString();
  };

  var getHousingRangeGuests = function (data) {
    return housingGuests.value === 'any' ? true : housingGuests.value === (data.offer.guests).toString();
  };

  var getHousingRangeOffers = function (data) {
    var housingFeatures = housingFeatureList.querySelectorAll('input[type=checkbox]:checked');
    // window.console.dir(housingFeatures, 1);
    var inOffer = true;
    if (housingFeatures.length === 0) {
      inOffer = true;
    } else {
      housingFeatures.forEach(function (it) {
        if (data.offer.features.indexOf(it.value) === -1) {
          inOffer = false;
        }
      });
    }
    return inOffer;
  };


  window.filter = {
    getFilteredData: function (data) {
      var filteredData = [];
      filteredData = data.filter(getHousingRangeType)
          .filter(getHousingRangePrice)
          .filter(getHousingRangeRooms)
          .filter(getHousingRangeGuests)
          .filter(getHousingRangeOffers)
          .filter(getHousingRangeOffers)
          .filter(getHousingRangeOffers);
      // window.console.log(filteredData);
      return filteredData;
    }
  };
})();
