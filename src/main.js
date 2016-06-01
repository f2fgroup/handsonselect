// registers select2 component as a field type
(function (Handsontable) {
    "use strict";
    Handsontable.Select2Cell = {
      editor: Handsontable.editors.Select2Editor,
      renderer: Handsontable.renderers.getRenderer('select2'),
      validator: Handsontable.Select2Validator
    };
    Handsontable.cellTypes.select2 = Handsontable.Select2Cell;
})(Handsontable);
