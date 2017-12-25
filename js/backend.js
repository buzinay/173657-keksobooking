'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';

  var getXhrResult = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = getXhrResult(onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = getXhrResult(onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    },

    onError: function (errorMessage) {
      var onErrorMessage = document.createElement('div');
      onErrorMessage.style.cssText = 'z-index: 100; margin: 0 auto; padding: 35px 35px; text-align: center; color: red; background-color: white; box-shadow: 0 2px 0 3px rgba(0, 0, 0, 0.2);';
      onErrorMessage.style.position = 'absolute';
      onErrorMessage.style.left = 0;
      onErrorMessage.style.right = 0;
      onErrorMessage.style.width = '300px';
      onErrorMessage.style.height = '100px';
      onErrorMessage.style.fontSize = '24px';

      onErrorMessage.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', onErrorMessage);
      setTimeout(function () {
        onErrorMessage.parentNode.removeChild(onErrorMessage);
      }, 5000);
    }
  };
})();
