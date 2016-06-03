/// select2 plugin
(function (Handsontable) {
    "use strict";
    function Select2Renderer(instance, TD, row, col, prop, value, cellProperties) {
      if (cellProperties.options && cellProperties.options.data && value) {
        value = value.trim();
        for(var i = 0; i < cellProperties.options.data.length; i++) {
          if(cellProperties.options.data[i].id === value) {
            if (typeof cellProperties.options.templateSelection === 'function') {
              value = cellProperties.options.templateSelection(cellProperties.options[i], TD);
            } else {
              value = cellProperties.options.data[i].text;
            }
            break;
          }
        }
      }
      Handsontable.cellTypes.text.renderer(instance, TD, row, col, prop, value, cellProperties);
    }
    Handsontable.renderers.registerRenderer('select2', Select2Renderer);
})(Handsontable);
