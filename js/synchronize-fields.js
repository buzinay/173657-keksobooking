'use strict';

(function () {
  window.synchronizeFields = function (syncField, syncWithField, syncData, syncWithData, operate) {
    var index = syncData.indexOf(syncField.value);
    var value = syncWithData[index];
    operate(syncWithField, value);
  };
})();
