/// select2 plugin
(function (Handsontable) {
    "use strict";

    var CustomData;

    $.fn.select2.amd.require([
      'select2/data/array',
      'select2/compat/inputData',
      'select2/utils'
    ], function (ArrayData, InputData, Utils) {
      var pageSize = 20;
      CustomData = function($element, options) {
        var data = options.get('_references') || [];
        ArrayData.__super__.constructor.call(this, $element, options);
        //this.addOptions(this.convertToOptions(data.slice(0, pageSize)));
        this._dataToConvert = data;
      };
      Utils.Extend(CustomData, ArrayData);
      InputData.prototype.query = function(_, params, callback) {
          var results = [];
          for (var d = 0; d < this._dataToConvert.length; d++) {
              var data = this._dataToConvert[d];
              var matches = this.matches(params, data);
              if (matches !== null) {
                  results.push(matches);
              }
          }
          callback({
              results: results.slice(0, pageSize)
          });
      };
    });

    var Select2Editor = Handsontable.editors.TextEditor.prototype.extend();

    Select2Editor.prototype.prepare = function (row, col, prop, td, originalValue, cellProperties) {

        Handsontable.editors.TextEditor.prototype.prepare.apply(this, arguments);

        this.options = {
          theme: 'classic',
          dropdownAutoWidth: true,
          // text for loading more results
          formatLoadMore: 'Loading more...',
          dataAdapter: CustomData,
          language: 'fr'
        };

        if (this.cellProperties.options) {
            this.options = $.extend(this.options, cellProperties.options);
        }
    };

    Select2Editor.prototype.createElements = function () {
        this.$body = $(document.body);

        this.TEXTAREA = document.createElement('input');
        this.TEXTAREA.setAttribute('type', 'text');
        this.$textarea = $(this.TEXTAREA);
        this.$textarea.addClass('handsontableInput');

        this.textareaStyle = this.TEXTAREA.style;
        this.textareaStyle.width = 0;
        this.textareaStyle.height = 0;

        this.TEXTAREA_PARENT = document.createElement('DIV');
        $(this.TEXTAREA_PARENT).addClass('handsontableInputHolder');

        this.textareaParentStyle = this.TEXTAREA_PARENT.style;
        this.textareaParentStyle.top = 0;
        this.textareaParentStyle.left = 0;
        this.textareaParentStyle.display = 'none';

        this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);

        this.instance.rootElement.appendChild(this.TEXTAREA_PARENT);

        var that = this;
        this.instance._registerTimeout(setTimeout(function () {
            that.refreshDimensions();
        }, 0));
    };

    var onSelect2Changed = function () {
        this.close();
        this.finishEditing();
    };
    var onSelect2Closed = function () {
        this.close();
        this.finishEditing();
    };
    var onBeforeKeyDown = function (event) {
        var instance = this;
        var that = instance.getActiveEditor();

        var keyCodes = Handsontable.helper.keyCode;
        if (!keyCodes) {
          keyCodes = {
            ENTER: 13,
            A: 65,
            X: 0,
            C: 0,
            V: 0,
            BACKSPACE: 0,
            DELETE: 8,
            HOME: 0,
            END: 0
          };
        }
        var ctrlDown = (event.ctrlKey || event.metaKey) && !event.altKey; //catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)

        console.log('Keycode > ', event.keyCode);

        //Process only events that have been fired in the editor
        if (event.target.className.indexOf('select2') === -1) {
            return;
        }
        if (event.keyCode === 17 || event.keyCode === 224 || event.keyCode === 91 || event.keyCode === 93) {
            //when CTRL or its equivalent is pressed and cell is edited, don't prepare selectable text in textarea
            event.stopImmediatePropagation();
            return;
        }

        var target = event.target;
        switch (event.keyCode) {
            case 39:
            case 40:
                event.stopImmediatePropagation();
                break;

            case keyCodes.ENTER:
                var selected = that.instance.getSelected();
                var isMultipleSelection = !(selected[0] === selected[2] && selected[1] === selected[3]);
                if ((ctrlDown && !isMultipleSelection) || event.altKey) { //if ctrl+enter or alt+enter, add new line
                    if (that.isOpened()) {
                        that.val(that.val() + '\n');
                        that.focus();
                    } else {
                        that.beginEditing(that.originalValue + '\n');
                    }
                    event.stopImmediatePropagation();
                }
                event.preventDefault(); //don't add newline to field
                break;

            case keyCodes.A:
            case keyCodes.X:
            case keyCodes.C:
            case keyCodes.V:
                if (ctrlDown) {
                    event.stopImmediatePropagation(); //CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)
                }
                break;

            case keyCodes.BACKSPACE:
            case keyCodes.DELETE:
            case keyCodes.HOME:
            case keyCodes.END:
                event.stopImmediatePropagation(); //backspace, delete, home, end should only work locally when cell is edited (not in table context)
                break;
        }

    };

    Select2Editor.prototype.open = function (keyboardEvent) {
		    this.refreshDimensions();
        this.textareaParentStyle.display = 'block';
        this.textareaParentStyle.zIndex = 20000;
        this.instance.addHook('beforeKeyDown', onBeforeKeyDown);

        this.$textarea.css({
            height: $(this.TD).height() + 4,
            'min-width': $(this.TD).outerWidth() - 4
        });
        this.options.width = $(this.TD).outerWidth() + 1;

        //display the list
        this.$textarea.show();
        var self = this;
        var text = this.instance.getDataAtCell(this.row, this.col);
        var foundText = null;
        var refs = this.cellProperties._references;
        for(var i = 0; i < refs.length; i++) {
          if (refs[i].id == text) {
            foundText = refs[i].text;
            break;
          }
        }
        this.$textarea.data('initial', foundText ? foundText : text);
        if (keyboardEvent && keyboardEvent.key.length === 1) {
          if (!foundText) {
            foundText = '#ERR:' + text;
          }
          text = keyboardEvent.key;
        } else {
          if (!foundText) {
            foundText = '#ERR:' + text;
          } else {
            text = foundText;
          }
        }
        this.$textarea.select2(Object.assign({}, this.options, { _references: refs }))
            .on('change', onSelect2Changed.bind(this))
            .on('select2:close', onSelect2Closed.bind(this));
        self.$textarea.select2('open');
        var select2 = self.$textarea.data('select2');
        select2.dropdown.$container.find('.select2-selection__rendered').text(foundText);
        select2.dropdown.$search.val(
          text ? text.substring(0, text.length > 6 ? text.length - 3 : text.length) : ''
        );
        select2.dropdown.$search.focus();
        select2.dropdown.$search.trigger('keydown');
        select2.dropdown.$search.trigger('keypress');
        select2.dropdown.$search.trigger('keyup');
        select2.dropdown.$search.trigger('change');
    };

    Select2Editor.prototype.init = function () {
        Handsontable.editors.TextEditor.prototype.init.apply(this, arguments);
    };

    Select2Editor.prototype.close = function () {
        this.instance.listen();
        this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
        if (this.$textarea.data('select2')) {
          this.$textarea.select2('destroy');
        }
        this.$textarea.off();
        this.$textarea.hide();
        Handsontable.editors.TextEditor.prototype.close.apply(this, arguments);
    };

    Select2Editor.prototype.val = function (value) {
        if (typeof value == 'undefined') {
            return this.$textarea.val();
        } else {
            this.$textarea.val(value);
        }
    };

    Select2Editor.prototype.focus = function () {

        this.instance.listen();

        // DO NOT CALL THE BASE TEXTEDITOR FOCUS METHOD HERE, IT CAN MAKE
        // THIS EDITOR BEHAVE POORLY AND HAS NO PURPOSE WITHIN THE CONTEXT OF THIS EDITOR
        // Handsontable.editors.TextEditor.prototype.focus.apply(this, arguments);
    };

    Select2Editor.prototype.beginEditing = function (initialValue) {
        var onBeginEditing = this.instance.getSettings().onBeginEditing;
        if (onBeginEditing && onBeginEditing() === false) {
            return;
        }
        Handsontable.editors.TextEditor.prototype.beginEditing.apply(this, arguments);
    };

    Select2Editor.prototype.finishEditing = function (isCancelled, ctrlDown) {
        this.instance.listen();
        if (isCancelled) {
          this.$textarea.val(this.$textarea.data('initial'));
        }
        return Handsontable.editors.TextEditor.prototype.finishEditing.apply(this, arguments);
    };

    Handsontable.Select2Editor = Select2Editor;

})(Handsontable);
