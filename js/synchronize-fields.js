'use strict';

(function () {
  window.synchronizeFields = function (syncField, syncWithField, syncData, syncWithData, operation) {
    var index = syncData.indexOf(syncField.value);
    var value = syncWithData[index];
    operation(syncWithField, value);
  };
})();
