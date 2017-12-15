'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    // Функция для выбора случайного числа в диапазоне от min до max
    getRandomNum: function (min, max) {
      var randomNum = Math.round(Math.random() * (max - min)) + min;
      return randomNum;
    },

    //  Функция возвращает неповторяющийся случайный подмассив из элементов массива array длиной length
    randomArray: function (array, length) {
      var nonRepeatingRandomNumbers = [];
      var nonRepeatingArray = [];
      var i = 0;
      while (i < length) {
        var randomNum = this.getRandomNum(0, array.length - 1);
        if (!nonRepeatingRandomNumbers[randomNum]) {
          nonRepeatingRandomNumbers[randomNum] = 1;
          nonRepeatingArray[i] = array[randomNum];
          i++;
        }
      }
      return nonRepeatingArray;
    },

    switchHidden: function (elem, flag) {
      if (elem.length) {
        for (var i = 0; i < elem.length; i++) {
          if (flag) {
            elem[i].classList.add('hidden');
          } else {
            elem[i].classList.remove('hidden');
          }
        }
      } else {
        if (flag) {
          elem.classList.add('hidden');
        } else {
          elem.classList.remove('hidden');
        }
      }
    },

    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
