'use strict';

// передвижение главного пина
(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var addressField = document.querySelector('#address');
  var addressCoordinate = {};

  var coordinateRange = window.data.getCoordinateRange();

  var mapPinMainOffsetX = mapPinMain.offsetWidth / 2;
  var mapPinMainOffsetY = mapPinMain.offsetHeight;
  var minX = coordinateRange.minX - mapPinMainOffsetX;
  var maxX = coordinateRange.maxX - mapPinMainOffsetX;
  var minY = coordinateRange.minY - mapPinMainOffsetY;
  var maxY = coordinateRange.maxY - mapPinMainOffsetY;

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
        mapPinMainTop = minY;
      }

      if (mapPinMainTop > maxY) {
        mapPinMainTop = maxY;
      }

      if (mapPinMainLeft < minX) {
        mapPinMainLeft = minX;
      }

      if (mapPinMainLeft > maxX) {
        mapPinMainLeft = maxX;
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
})();
