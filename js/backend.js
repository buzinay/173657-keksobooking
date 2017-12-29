'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var SUCCESS_STATUS = 200;
  var TIMEOUT_INTERVAL = 5000;
  var LOAD_TIMEOUT_INTERVAL = 10000;

  var getXhrResult = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
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

    xhr.timeout = LOAD_TIMEOUT_INTERVAL; // 10s

    return xhr;
  };
  var getMessageWindow = function (message) {
    var messageWindow = document.createElement('div');
    messageWindow.style.cssText = 'z-index: 100; margin: 0 auto; padding: 50px 35px; text-align: center; background-color: white; border-radius: 5px; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);';
    messageWindow.style.position = 'fixed';
    messageWindow.style.left = '50%';
    messageWindow.style.top = '20%';
    messageWindow.style.transform = 'translateX(-50%)';
    messageWindow.style.width = '500px';
    messageWindow.style.height = '200px';
    messageWindow.style.fontSize = '24px';
    messageWindow.textContent = message;
    return messageWindow;
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
      var onErrorMessage = getMessageWindow(errorMessage);
      document.body.insertAdjacentElement('afterbegin', onErrorMessage);
      window.setTimeout(function () {
        onErrorMessage.parentNode.removeChild(onErrorMessage);
      }, TIMEOUT_INTERVAL);
    }
  };
})();
