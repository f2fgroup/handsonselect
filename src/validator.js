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
      if (this._references) {
        if (value) {
          if (typeof value === "string") {
            value = value.trim();
          }
          // scan each entry of the datasource
          for(var i = 0; i <  this._references.length; i++) {
            if (this._references[i] == value || this._references[i].id == value) {
              // found by id
              return callback(true);
            } else if (this._references[i].text == value) {
              // found by text
              return callback(true);
            }
          }
          // did not found
          return callback(false);
        } else {
          // the value is empty
          var settings = this.instance.getSettings();
          var col = settings.columns[this.col];
          if (col.mandatory) {
            callback(false);
          } else {
            callback(true);
          }
        }
      } else {
        callback(true);
      }
    };

})(Handsontable);
