'use strict';

// передвижение главного пина
(function () {
  var COORDINATE_RANGE = {
    minX: 300,
    maxX: 900,
    minY: 100,
    maxY: 500
  };

  var mapPinMain = document.querySelector('.map__pin--main');
  var addressField = document.querySelector('#address');
  var defaultCoordinate = {
    x: mapPinMain.offsetLeft,
    y: mapPinMain.offsetTop
  };
  window.console.log(defaultCoordinate);

  var addressCoordinate = {};

  var mapPinMainOffsetX = mapPinMain.offsetWidth / 2;
  var mapPinMainOffsetY = mapPinMain.offsetHeight;
  var minX = COORDINATE_RANGE.minX - mapPinMainOffsetX;
  var maxX = COORDINATE_RANGE.maxX - mapPinMainOffsetX;
  var minY = COORDINATE_RANGE.minY - mapPinMainOffsetY;
  var maxY = COORDINATE_RANGE.maxY - mapPinMainOffsetY;

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapPinMainTop = mapPinMain.offsetTop - shift.y;
      var mapPinMainLeft = mapPinMain.offsetLeft - shift.x;

      if (mapPinMainTop < minY) {
        mapPinMainTop = (minY);
        document.removeEventListener('mousemove', onMouseMove);
      }

      if (mapPinMainTop > maxY) {
        mapPinMainTop = maxY;
        document.removeEventListener('mousemove', onMouseMove);
      }

      if (mapPinMainLeft < minX) {
        mapPinMainLeft = minX;
        document.removeEventListener('mousemove', onMouseMove);
      }

      if (mapPinMainLeft > maxX) {
        mapPinMainLeft = maxX;
        document.removeEventListener('mousemove', onMouseMove);
      }

      mapPinMain.style.top = mapPinMainTop + 'px';
      mapPinMain.style.left = mapPinMainLeft + 'px';

      addressCoordinate.x = mapPinMainLeft + mapPinMain.offsetWidth / 2;
      addressCoordinate.y = mapPinMainTop + mapPinMain.offsetHeight;

      addressField.value = 'x: ' + addressCoordinate.x + ' ' + 'y: ' + addressCoordinate.y;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.mainPin = {
    moveToDefaultPlace: function () {
      mapPinMain.style.left = defaultCoordinate.x + 'px';
      mapPinMain.style.top = defaultCoordinate.y + 'px';
    }
  };
})();
