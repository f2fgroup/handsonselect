/// select2 plugin
(function (Handsontable) {
    "use strict";
    Handsontable.Select2Renderer = function Select2Renderer(instance, TD, row, col, prop, value, cellProperties) {
      if (value) {
        if (typeof value === "string") {
          value = value.trim();
        }
        var settings = instance.getSettings().columns[col];
        if (settings._references && settings._references.length > 0) {
          for(var i = 0; i < settings._references.length; i++) {
            if(settings._references[i].id == value) {
              if (typeof cellProperties.options.templateSelection === 'function') {
                value = cellProperties.options.templateSelection(settings._references[i], TD);
              } else {
                value = settings._references[i].text;
              }
              break;
            }
          }  
        }
      }
      Handsontable.cellTypes.text.renderer(instance, TD, row, col, prop, value, cellProperties);
    };
})(Handsontable);
