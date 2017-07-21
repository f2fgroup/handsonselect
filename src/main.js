// registers select2 component as a field type
(function (Handsontable) {
    "use strict";
    console.log('Ready for the show');
    Handsontable.cellTypes.registerCellType('select2', {
      editor: Handsontable.Select2Editor,
      validator: Handsontable.Select2Validator,
      renderer: Handsontable.Select2Renderer
    });
    //Handsontable.cellTypes['select2']
})(Handsontable);
