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
      if (this.options.data) {
        if (value) {
          if (typeof value === "string") {
            value = value.trim();
          }
          // scan each entry of the datasource
          for(var i = 0; i <  this.options.data.length; i++) {
            if (this.options.data[i] == value || this.options.data[i].id == value) {
              // found by id
              return callback(true);
            } else if (this.options.data[i].text == value) {
              // found by text
              return callback(true);
            }
          }
          // did not found
          return callback(false);
        } else {
          // the value is empty
          var col = context.editor.datagrid.column(this.instance, this.col);
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
