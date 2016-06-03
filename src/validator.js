/// select2 plugin
(function (Handsontable) {
    "use strict";
    /**
     * Autocomplete cell validator.
     *
     * @private
     * @validator AutocompleteValidator
     * @param {*} value - Value of edited cell
     * @param {Function} callback - Callback called with validation result
     */
    Handsontable.Select2Validator = function(value, callback) {
      if (this.strict && this.options.data) {
        if (value) {
          if (typeof value === "string") {
            value = value.trim();
          }
          for(var i = 0; i <  this.options.data.length; i++) {
            if (this.options.data[i] == value || this.options.data[i].id == value) {
              return callback(true);
            } else if (this.options.data[i].text == value) {
              return callback(true);
            }
          }
        }
        callback(false);
      } else {
        callback(true);
      }
    };

})(Handsontable);
