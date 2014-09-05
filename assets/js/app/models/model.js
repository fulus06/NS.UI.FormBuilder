/**
 * @fileOverview model.js
 *
 * This file implements all field models
 *
 * @author          MICELI Antoine (miceli.antoine@gmail.com)
 * @version         1.0
 */

define(['backbone'], function(Backbone) {

    var models = {};

    //  --------------------------------------------
    //  Basic models herited from Backbone model
    //  --------------------------------------------

    /**
     * Basic field model
     * Establishes common field attributes
     */
    models.BaseField = Backbone.Model.extend({
        defaults: {
            id      : 0,
            label   : "My label",
            name    : {
                label: {
                    value: "field",
                    lang : "en"
                },
                display_label: "field"
            },
            required: false,
            readOnly: false,
            isDragged : false
        },

        getXML: function() {
            return  "<label>" + this.get('label') + '</label>' +
                    "<name>" +
                    "   <label lang='" + this.get('name')['label']['lang'] + "'>" + this.get('name')['label']['value'] + '</label>' +
                    "   <display_label>" + this.get('name')['displayLabel'] + '</display_label>' +
                    "</name>" +
                    "<required>" + this.get('required') + '</required>' +
                    "<readOnly>" + this.get('readOnly') + '</readOnly>';
        },

        isAdvanced : function(index) {
            return this.getSchemaProperty(index, 'advanced') === "advanced";
        },

        getSchemaProperty: function(index, property) {
            if (index.indexOf("/") > 0) {
                //  Complex index like : /name/label/lang -> ['name']['label']['lang']
                var split = index.split('/'), str = "this.constructor.schema";
                for (var each in split) {
                    str += (parseInt(each) === split.length - 1) ? '["' + split[each] + '"]' : '["' + split[each] + '"]["elements"]';
                }
                return eval(str + '["' + property + '"]');
            } else {
                //  Simple index
                return this.constructor.schema[index] !== undefined ? this.constructor.schema[index][property] : "";
            }
        },

        changePropertyValue : function(index, value) {
            if (index.indexOf("[") > 0) {
                //  Complexe attribute
                var split = index.split('['), firstSelector = split.shift(), currentObject = this.get(firstSelector);

                split.forEach(function(element, idx, array) {
                    if (idx === array.length - 1) {
                        currentObject[ element.substr(0, element.length - 1) ] = value;
                    } else {
                        currentObject = currentObject[ element.substr(1, element.length - 1) ];
                    }
                });

                this.trigger('change');
            } else {
                this.set(index, value);
            }
        }

    }, {
        schema : {
            id      : { type    : "integer", section : "advanced", display: "ID"},
            label   : { type    : "string", section : "simple" },
            name : {
                type : "object",
                elements: {
                    label: {
                        type : "object",
                        elements : {
                            value   : { type: "string" },
                            lang    : { type: "string" }
                        }
                    },
                    display_label    : {type : "string", display: "Real displayed value" }
                }
            },
            required : { type : "boolean", section : "advanced" },
            readOnly : { type : "boolean"}
        }
    });

    /**
     * graphical horizontal line field model
     */
    models.HorizontalLineField    = Backbone.Model.extend({
    }, {
        type    : 'HorizontalLine',
        xmlTag  : 'field_horizontalLine',
        i18n    : 'line'
    });

    /**
     * Hidden field model
     */
    models.HiddenField       = Backbone.Model.extend({
        defaults: {
            id  : 0,
            name    : {
                label: {
                    value: "field",
                    lang : "en"
                },
                displayLabel: "field"
            },
            value: ""
        },
        getSchemaProperty: function(index, property) {
            models.BaseField.prototype.getSchemaProperty.apply(this, arguments);
        },

        changePropertyValue : function(index, value) {
            models.BaseField.prototype.changePropertyValue.apply(this, arguments);
        },

        getXML: function() {
            return  "<name>" +
                    "   <label lang='" + this.get('name')['label']['lang'] + "'>" + this.get('name')['label']['value'] + '</label>' +
                    "   <display_label>" + this.get('name')['displayLabel'] + '</display_label>' +
                    "</name>" +
                    "<value>" + this.get('value') + '</value>';
        }
    }, {
        type    : 'Hidden',
        xmlTag  : 'field_hidden',
        i18n    : 'hidden',
        schema: {
            id: {type: "integer"},
            name : {
                type : "object",
                elements: {
                    label: {
                        type : "object",
                        elements : {
                            value   : { type: "string" },
                            lang    : { type: "string" }
                        }
                    },
                    displayLabel    : {type : "string" }
                }
            },
            value: {type: "string"}
        }
    });

    //  --------------------------------------------
    //  Models herited from Base field model
    //  --------------------------------------------

    /**
     * Text field model
     */
    models.TextField = models.BaseField.extend({

        defaults: {
            defaultValue: "",
            hint        : "Write some text",
            size        : 255,
            multiline   : false
        },

        initialize : function(options) {
            models.BaseField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.BaseField.schema);
        },

        getXML: function() {
            var xml = models.BaseField.prototype.getXML.apply(this, arguments);
            return xml +    '<defaultValue>'    + this.get('defaultValue')  + '</defaultValue>' +
                            '<hint>'            + this.get('hint')          + '</hint>' +
                            '<size>'            + this.get('size')          + '</size>' +
                            '<multiline>'       + this.get('multiline')     + '</multiline>';
        }

    }, {

        type    : "Text",
        xmlTag  : 'field_text',
        i18n    : 'text',
        schema : {
            defaultValue: { type : "string", display: "Default value", section : "advanced" },
            hint        : { type : "string" },
            size        : { type : "integer"}
        }

    });

    models.AutocompleteField =models.BaseField.extend({
        defaults: {
            defaultValue: "",
            hint        : "Write some text",
            url         : ""
        },

        getXML: function() {
            var xml = models.BaseField.prototype.getXML.apply(this, arguments);
            return xml +    '<defaultValue>'    + this.get('defaultValue')  + '</defaultValue>' +
                            '<hint>'            + this.get('hint')          + '</hint>' +
                            '<url>'             + this.get('url')           + '</url>';
        },

        initialize : function(options) {
            models.BaseField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.BaseField.schema);
        }

    }, {

        type    : "Autocomplete",
        xmlTag  : 'field_autocomplete',
        i18n    : 'autocomplete',
        schema : {
            defaultValue: { type : "string", display: "Default value", section : "advanced" },
            hint        : { type : "string" },
            url         : { type : "string"}
        }

    });

    /**
     * File field model
     */
    models.FileField         = models.BaseField.extend({
        defaults: {
            defaultValue: "",
            file        : "",
            mimeType    : "*",
            size        : 200    //  specify max file size in ko
        },
        initialize : function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.BaseField.schema);
        },
       getXML : function () {
           var xml = models.BaseField.prototype.getXML.apply(this, arguments);
           return xml + "<file>"            + this.get('file')          + '</file>' +
                        "<defaultValue>"    + this.get('defaultValue')  + '</defaultValue>' +
                        "<mimeType>"        + this.get('mimeType')      + '</mimeType>' +
                        "<size>"            + this.get('size')          + '</size>';
       }
    }, {
        type    : "File",
        xmlTag  : 'field_file',
        i18n    : 'file',
        schema : {
            defaultValue: { type : "string" },
            file        : { type : "string" },
            mimeType    : { type : "string" },
            size        : { type : "integer", display: "Maximum size"}
        }
    });

    /**
     * Tree view model
     */
    models.TreeViewField     = models.BaseField.extend({
       defaults : {
            node: [
                {
                    title   : "Node 1",
                    key     : "1"
                },
                {
                    title   : "Folder 2",
                    key     : "2",
                    folder  : true,
                    children: [
                        {
                            title: "Node 2.1",
                            key: "3"
                        },
                        {
                            title: "Node 2.2",
                            key: "4"
                        }
                    ]
                }
            ],
           defaultNode          : 0,
           multipleSelection    : true,
           hierarchicSelection  : false
       },

       initialize : function() {
           models.BaseField.prototype.initialize.apply(this, arguments);
           _.extend(this.constructor.schema, models.BaseField.schema);
           _.bindAll(this, 'getNodeXml', 'getXML');
       },

       getNodeXml : function(node) {
           var str =    '<node>' +
                        '   <title>'    + node['title']     + '</title>' +
                        '   <key>'      + node['key']       + '</key>'  +
                        '   <folder>' + (node['folder'] === undefined ? "false" : node['folder'])    + '</folder>';

                        if (node['folder'] === true) {
                            str += "<children>";
                            _.each(node['children'], _.bind(function(subNode) {
                                str +=  this.getNodeXml(subNode);
                            }, this));
                            str += "</children>";
                        }

           return str + '</node>';
       },

       getXML : function() {
           var xml = models.BaseField.prototype.getXML.apply(this, arguments);

           xml +=   '<defaultNode>'         + this.get('defaultNode')           + '</defaultNode>' +
                    '<multipleSelection>'   + this.get('multipleSelection')     + '</multipleSelection>' +
                    '<hierarchicSelection>' + this.get('hierarchicSelection')   + '</hierarchicSelection>';
           _.each(this.get('node'), _.bind(function(el) {
               xml +=   this.getNodeXml(el);
           }, this));


           return xml;
       }
    }, {
        type    : 'TreeView',
        xmlTag  : 'field_treeView',
        i18n    : 'tree',
        schema : {
            defaultNode         : { type : "integer" },
            multipleSelection   : { type : "boolean" },
            hierarchicSelection : { type : "boolean" },
            node : [
                {
                    title   : { type : "string"     },
                    key     : { type : "integer"    },
                    folder  : { type : "boolean"    },
                    children: [ { type : "node" } ]
                }
            ]
        }
    });

    /**
     * enumeration field type
     */
    models.EnumerationField  = models.BaseField.extend({

        defaults: {
            itemList : {
                items : [
                    {
                        id : 0, value : "0", en : "My first Option", fr : 'Mon option'
                    },
                    {
                        id : 1, value : "1", en : "My second Option", fr : 'Mon option 2'
                    }
                ],
                defaultValue : 1
            },
            multiple : false,
            expanded : false
        },

        /**
         * Constructor
         *
         * Get BaseField schema and add it on EnumerationField schema
         */
        initialize : function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.BaseField.schema);
        },

        /**
         * Add an item on an itemList
         *
         * @param {integer} listIndex  itemList index
         * @param {object} element    element to add
         * @param {boolean} selected   if this element is the defaultValue
         */
        addOption: function(listIndex, element, selected) {
            this.get('items')[listIndex]['items'].push(element);
            if (selected) {
                this.get('items')[listIndex]['defaultValue'] = element['id'];
            }

            this.trigger('change');
        },

        /**
         * Remove an item from an itemList
         *
         * @param {integer} listIndex  index of the itemList
         * @param {integer} index      index of element to remove
         */
        removeOption: function(listIndex, index) {
            this.get("items")[listIndex].splice(index, 1);
            this.trigger('change');
        },

        /**
         * Return choosen item list elements
         *
         * @param {integer} itemListIndex  itemList index
         * @returns {array} itemList
         */
        getOption: function(itemListIndex) {
            return this.get('items')[itemListIndex];
        },

        /**
         * Return object XML content
         *
         * @returns {String} XML content
         */
        getXML: function() {
            var xml = models.BaseField.prototype.getXML.apply(this, arguments);

            xml +=  '<itemList>'+
                    '<items>';
            _.each(this.get('itemList')['items'], function(el, idx) {
                xml += '<item id="' + el['id'] + '"><en>' + el['en'] + '</en><fr>' + el['fr'] + '</fr><value>' + el['value'] + '</value></item>';
            });
            xml +=  '</items>';
            xml +=  '<defaultValue>'    + this.get('itemList')['defaultValue']  + '</defaultValue>';
            xml +=  '</itemList>';
            xml += '<expanded>' + this.get('expanded') + '</expanded>';
            xml += '<multiple>' + this.get('multiple') + '</multiple>';

            return xml;
        }

    }, {
        schema: {
            items : {
                type : "array",
                itemList : {
                    defaultValue    : { type : "string" },
                    lang            : { type : "string" },
                    type: "array",
                    items : {
                        label   : { type : "string" },
                        value   : { type : "string" }
                    }
                }
            },
            expanded : { type : "boolean" },
            multiple : { type : "boolean" }
        }
    });

    _.defaults(models.TextField.prototype.defaults         , models.BaseField.prototype.defaults);
    _.defaults(models.AutocompleteField.prototype.defaults , models.BaseField.prototype.defaults);
    _.defaults(models.FileField.prototype.defaults         , models.BaseField.prototype.defaults);
    _.defaults(models.TreeViewField.prototype.defaults     , models.BaseField.prototype.defaults);
    _.defaults(models.EnumerationField.prototype.defaults  , models.BaseField.prototype.defaults);

    //  --------------------------------------------
    //  Models herited from text field model
    //  --------------------------------------------

    /**
     * Pattern field model
     */
    models.PatternField      = models.TextField.extend({
        defaults : {
            pattern : ""
        } ,
        initialize : function() {
            models.TextField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.TextField.schema);
        },
        getXML : function() {
            return models.TextField.prototype.getXML.apply(this, arguments) + "<pattern>" + this.get('pattern') + '</pattern>';
        }
    }, {
        type: "Pattern",
        xmlTag : 'field_pattern',
        i18n    : 'mask',
        schema : {
            pattern : { type : "string" }
        }
    });

    /**
     * date pickear field type
     */
    models.DateField         = models.TextField.extend({
        defaults: {
            format: "dd/mm/yyyy"
        },
        initialize : function() {
            models.TextField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.TextField.schema);
        },
        getXML: function() {
            return models.TextField.prototype.getXML.apply(this, arguments) + '<format>' + this.get("format") + '</format>';
        }
    }, {
        type    : "Date",
        xmlTag  : 'field_date',
        i18n    : 'date',
        schema : {
            format : { type : "string" }
        }
    });

    /**
     * numeric field type
     */
    models.NumericField      = models.TextField.extend({
        defaults: {
            minValue    : 0,
            maxValue    : 100,
            precision   : 1,
            unity       : "meters"
        },
        initialize : function() {
            models.TextField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.TextField.schema);
            this.set('hint', 'Enter a numeric value');
        },

        getXML: function() {
            return  models.TextField.prototype.getXML.apply(this, arguments) +
                    '<min>' + this.get("minValue")  + '</min>' +
                    '<max>' + this.get("maxValue")  + '</max>' +
                    '<precision>'+ this.get("precision")      + '</precision>' +
                    '<unity>' + this.get("unity")  + '</unity>';
        }
    }, {
        type    : 'Numeric',
        xmlTag  : 'field_numeric',
        i18n    : 'numeric',
        schema : {
            minValue    : { type : "integer" },
            maxValue    : { type : "integer" },
            precision   : { type : "integer" },
            unity       : { type : "string"  }
        }
    });

    /**
     * long text field type
     */
    models.LongTextField     = models.TextField.extend({
        initialize : function() {
            models.TextField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.TextField.schema);
            this.set('multiline', true);
        },
        getXML: function() {
            return models.TextField.prototype.getXML.apply(this, arguments);
        }
    }, {
        type    : 'LongText',
        xmlTag  : 'field_text',
        i18n    : 'long'
    });

    _.defaults(models.NumericField.prototype.defaults  , models.TextField.prototype.defaults);
    _.defaults(models.PatternField.prototype.defaults  , models.TextField.prototype.defaults);
    _.defaults(models.DateField.prototype.defaults     , models.TextField.prototype.defaults);
    _.defaults(models.LongTextField.prototype.defaults , models.TextField.prototype.defaults);

    //  --------------------------------------------
    //  Models herited from enumeration field model
    //  --------------------------------------------

    /**
     * Checkbox field type
     */
    models.CheckBoxField     = models.EnumerationField.extend({
        getXML: function() {
            return models.EnumerationField.prototype.getXML.apply(this, arguments);
        },
        initialize : function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.EnumerationField.schema);
            this.set('multiple', true);
            this.set('expanded', true);
        }
    }, {
        type    : 'CheckBox',
        xmlTag  : 'field_list',
        i18n    : 'checkbox'
    });

    /**
     * radio field type
     */
    models.RadioField        = models.EnumerationField.extend({
        getXML: function() {
            return models.EnumerationField.prototype.getXML.apply(this, arguments);
        },
        initialize : function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.EnumerationField.schema);
            this.set('multiple', false);
            this.set('expanded', true);
        }
    }, {
        type    : 'Radio',
        xmlTag  : 'field_list',
        i18n    : 'radio'
    });

    /**
     * select field type
     */
    models.SelectField       = models.EnumerationField.extend({
        getXML: function() {
            return models.EnumerationField.prototype.getXML.apply(this, arguments);
        },
        initialize : function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);
            _.extend(this.constructor.schema, models.EnumerationField.schema);
        }
    }, {
        type    : 'Select',
        xmlTag  : 'field_list',
        i18n    : 'select'
    });

    _.defaults(models.RadioField.prototype.defaults    , models.EnumerationField.prototype.defaults);
    _.defaults(models.CheckBoxField.prototype.defaults , models.EnumerationField.prototype.defaults);
    _.defaults(models.SelectField.prototype.defaults   , models.EnumerationField.prototype.defaults);

    models.TableField = Backbone.Model.extend({

        defaults : {
            fields : [],
        },

        initialize : function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
            _.bindAll(this, 'moveModel', 'addModel', 'removeModel', 'getXML');
        },

        getXML : function() {
            var xml = models.BaseField.prototype.getXML.apply(this, arguments)
            _.each (this.get('fields'), function(el, idx) {
                xml += '<' + el.constructor.xmlTag + ' id="' + el.get('id') + '" >' + el.getXML() + '</' + el.constructor.xmlTag + '>'
            });
            return xml;
        },

        addModel  : function(model, modelIndex) {
            var arr = this.get('fields');
            model.set('isDragged', true);
            arr.push(model);
            this.set('fields', arr);
        },

        removeModel : function(index) {
            var arr = this.get('fields');
            delete arr[index];
            this.set("fields", arr);
        },

        moveModel : function(currentIndex, newIndex) {
            var arr = this.get('fields');

            if (arr[newIndex] !== undefined) {
                var tmp           = arr[currentIndex];
                arr[currentIndex] = arr[newIndex];
                arr[newIndex]     = tmp;
            } else {
                arr[newIndex] = arr[currentIndex];
                delete arr[currentIndex];
            }
            this.set('fields', arr);
            this.trigger('update', currentIndex, newIndex);
            this.trigger('done');
        }

    }, {
        type    : 'Table',
        xmlTag  : 'field_table',
        i18n    : 'table'
    });

    _.defaults(models.TableField.prototype.defaults, models.BaseField.prototype.defaults);

    models.SubformField = Backbone.Model.extend({
        defaults : {
            id : 0,
            fields : [],
            legend : 'Fieldset',
            multiple : false
        },

        initialize : function() {
            _.bindAll(this, 'addModel', 'removeModel', 'getXML', 'updateModel');
        },

        addModel  : function(model, modelIndex) {
            var arr = this.get('fields');
            model.set('isDragged', true);
            arr.push(model);
            this.set('fields', arr);
        },

        removeModel : function(index) {
            var arr = this.get('fields');
            delete arr[index];
            this.set("fields", arr);
        },

        updateModel : function(index, from, to) {
            var arr = this.get('fields');
            var element = arr[from];
            arr.splice(from, 1);
            arr.splice(to, 0, element);
            this.set('fields', arr);
        },

        getXML : function() {
            var xml = '<legend>' + this.get('legend') + '</legend>';
                xml += '<multiple>' + this.get('multiple') + '</multiple>';
            _.each (this.get('fields'), function(el, idx) {
                xml += '<' + el.constructor.xmlTag + ' id="' + el.get('id') + '" >' + el.getXML() + '</' + el.constructor.xmlTag + '>'
            });
            return xml;
        },

        changePropertyValue : function(index, value) {
            models.BaseField.prototype.changePropertyValue.apply(this, arguments);
        },
    }, {
        type    : 'Subform',
        xmlTag  : 'fieldset',
        i18n    : 'fieldset'
    });


    return models;

});