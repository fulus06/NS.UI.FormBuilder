define([
    'jquery', 'underscore', 'backbone', '../../Translater', '../editor/CheckboxEditor'
], function($, _, Backbone, Translater, CheckboxEditor) {

    var fieldTemplate = _.template('\
        <div class="form-group field-<%= key %>">\
            <label class="control-label" for="<%= editorId %>"><%= title %></label>\
            <div data-editor >\
                <p class="help-block" data-error></p>\
                <p class="help-block"><%= help %></p>\
            </div>\
        </div>\
    ');

    var checkboxFieldTemplate = _.template('\
        <div class="checkboxField <%= this.editor.schema.editorClass %>">\
            <div class="form-group field-<%= key %>">\
                <span data-editor><label class="checkboxLabel" for="<%= editorId %>"><%= title %></label></span>\
                <p class="help-block"><%= help %></p>\
            </div>\
        </div>\
    ');

    var models = {}, translater = Translater.getTranslater();

    models.BaseField = Backbone.Model.extend({

        defaults: {
            id          : 0,
            name        : "Field",
            labelFr     : translater.getValueFromKey('schema.label.fr'),
            labelEn     : translater.getValueFromKey('schema.label.en'),
            required    : false,
            readonly    : false,
            isDragged   : false,
            editorClass : '',
            fieldClass  : '',
            fieldSize   : '',
            endOfLine   : false,

            //  Linked fields values
            linkedFieldTable             : '',
            linkedFieldIdentifyingColumn : '',
            linkedField                  : '',
            formIdentifyingColumn        : ''
        },

        schema : {
            id : {
                type        : "Number",
                fieldClass  : 'advanced',
                editorClass : 'form-control',
                template    : fieldTemplate
            },
            labelFr   : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.label.fr'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators : ['required'],
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.label.fr')
                }
            },
            labelEn   : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.label.en'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators : ['required'],
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.label.en')
                }
            },
            name   : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.name'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                fieldClass  : 'marginBottom10',
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.name')
                }
            },
            required : {
                type        : CheckboxEditor,
                title       : translater.getValueFromKey('schema.required'),
                fieldClass : "checkBoxEditor"
            },
            readonly : {
                type        : CheckboxEditor,
                fieldClass : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.readonly')
            },
            editorClass : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.editorClass'),
                editorClass : 'form-control',
                fieldClass  : 'marginTop20',
                template    : fieldTemplate
            },
            fieldClass : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.fieldClass'),
                editorClass : 'form-control',
                template    : fieldTemplate
            },
            fieldSize : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.fieldSize'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : [translater.getValueFromKey('schema.sizeValue.small'), translater.getValueFromKey('schema.sizeValue.medium'), translater.getValueFromKey('schema.sizeValue.large')]
            },
            endOfLine : {
                type        : CheckboxEditor,
                fieldClass : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.eol')
            },

            //  Linked field section
            linkedFieldTable : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.linkedFieldTable'),
                template    : fieldTemplate,
                editorClass : 'form-control',
                options : []
            },
            linkedFieldIdentifyingColumn : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.linkedFieldIdentifyingColumn'),
                template    : fieldTemplate,
                editorClass : 'form-control',
                options : []
            },
            linkedField : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.linkedField'),
                template    : fieldTemplate,
                editorClass : 'form-control',
                options : []
            },
            formIdentifyingColumn : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.formIdentifyingColumn'),
                template    : fieldTemplate,
                editorClass : 'form-control',
                options : []
            },

        },

        initialize : function(options) {
            _.bindAll(this, 'getJSON');
        },

        isAdvanced : function(index) {
            return this.getSchemaProperty(index, 'advanced') === "advanced";
        },

        getJSON : function() {

            var jsonObject                  = {
                validators : []
            },
            schemaKeys                  = _.keys( typeof this.schema == "function" ? this.schema() : this.schema ),
            schemaKeysWithoutValidator  = _.without(schemaKeys, 'required');

            _.each(schemaKeysWithoutValidator, _.bind(function(el) {
                jsonObject[el] = this.get(el);
            }, this));

            if (this.get('required')) {
                jsonObject['validators'].push('required');
            }

            return jsonObject;
        }

    });

    models.HiddenField = Backbone.Model.extend({
        defaults: {
            id    : 0,
            labelFr     : translater.getValueFromKey('schema.label.fr'),
            labelEn     : translater.getValueFromKey('schema.label.en'),
            name  : "Field",
            value : ""
        },

        schema: {
            id: {
                type: 'Number',
                title : "ID"
            },
            name   : {
                type        : "Text",
                title       : 'Name',
                editorClass : 'form-control',
                template    : fieldTemplate,
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.name')
                }
            },
            labelFr   : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.label.fr'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators : ['required'],
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.label.fr')
                }
            },
            labelEn   : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.label.en'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators : ['required'],
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.label.en')
                }
            },
            value: {
                type        : 'Text',
                editorClass : 'form-control',
                template    : fieldTemplate,
                title       : translater.getValueFromKey('schema.value'),
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.value')
                }
            }
        }
    }, {
        type   : 'Hidden',
        section : 'presentation',
        i18n   : 'hidden'
    });

    models.HorizontalLineField = Backbone.Model.extend({}, {
        type   : 'HorizontalLine',
        section : 'presentation',
        i18n   : 'line'
    });

    //  ----------------------------------------------------
    //  Field herited by BaseField
    //  ----------------------------------------------------

    models.AutocompleteField = models.BaseField.extend({

        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                defaultValue : "",
                help         : "Write some text to see a list value",
                url          : "ressources/autocomplete/example.json"
            });
        },

        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                defaultValue: {
                    type        : 'Text',
                    title       : translater.getValueFromKey('schema.default'),
                    fieldClass  : 'advanced',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.value')
                    }
                },
                help: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.help'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.help')
                    }
                },
                url: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.url'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.url')
                    }
                }
            });
        },

        initialize: function(options) {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }

    }, {
        type   : "Autocomplete",
        section : 'autocomplete',
        i18n   : 'autocomplete'
    });

    models.TextField = models.BaseField.extend({

        defaults : function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                defaultValue : "",
                help         : "Write some text",
                size         : 255,
                multiline    : false
            });
        },

        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                defaultValue: {
                    type        : 'Text',
                    title       : translater.getValueFromKey('schema.default'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.value')
                    }
                },
                help: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.help'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.help')
                    }
                },
                size: {
                    type        : 'Number',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.size'),
                    validators : [function checkValue(value, formValues) {
                        if (value < 0 || value > 255) {
                            return {
                                type : 'Invalid number',
                                message : "La taille doit être comprise en 0 et 255"
                            }
                        }
                    }],
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.size')
                    }
                }
            })
        },

        initialize: function(options) {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {

        type   : "Text",
        section : 'standard',
        i18n   : 'text'
    });

    models.FileField = models.BaseField.extend({

        defaults: function() {
            return _.extend({}, models.BaseField.prototype.defaults, {
                mimeType     : "*",
                size         : 200 //  specify max file size in ko
            })
        },

        schema: function() {
            return _.extend({}, models.BaseField.prototype.schema, {
                mimeType: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.mime'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.mime')
                    }
                },
                size: {
                    type        : 'Number',
                    title       : "Maximum size",
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.size'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.fileSize')
                    }
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type   : "File",
        i18n   : 'file'
    });

    var Node = Backbone.Model.extend({
        schema: {
            title: {
                type  : "Text",
                title : translater.getValueFromKey('schema.title')
            },
            key: {
                type  : 'Number',
                title : translater.getValueFromKey('schema.key')
            },
            folder: {
                type        : CheckboxEditor,
                fieldClass : "checkBoxEditor",
                title : translater.getValueFromKey('schema.readonly')
            }
        },

        initialize: function(options) {
        }
    });

    models.TreeViewField = models.BaseField.extend({

        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                node: [{
                    title: "Node 1",
                    key: "1"
                }, {
                    title: "Folder 2",
                    key: "2",
                    folder: true,
                    children: [{
                        title: "Node 2.1",
                        key: "3"
                    }, {
                        title: "Node 2.2",
                        key: "4"
                    }]
                }],
                webServiceURL : '',
                defaultNode: 0,
                multipleSelection: true,
                hierarchicSelection: false
            })
        },

        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                defaultNode: {
                    type  : 'Number',
                    title : translater.getValueFromKey('schema.defaultNode'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.tree.default')
                    }
                },
                multipleSelection: {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor",
                    title : translater.getValueFromKey('schema.multipleSelection'),
                },
                hierarchicSelection: {
                    title : translater.getValueFromKey('schema.hierarchic'),
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor"
                },
                webServiceURL : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.webServiceURL'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.tree.url')
                    }
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type: 'TreeView',
        i18n: 'tree'
    });

    models.EnumerationField = models.BaseField.extend({

        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                itemList: {
                    items: [{
                        id    : 0,
                        value : "0",
                        en    : "My first Option",
                        fr    : 'Mon option'
                    }, {
                        id    : 1,
                        value : "1",
                        en    : "My second Option",
                        fr    : 'Mon option 2'
                    }],
                    defaultValue: 1
                },
                webServiceURL : "",
                multiple: false,
                expanded: false
            });
        },

        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                webServiceURL : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.webServiceURL')
                },
                itemList : {
                    type : 'Object',
                    title : '',
                    subSchema : {
                        defaultValue : {
                            type        : 'Text',
                            editorClass : 'form-control',
                            template    : fieldTemplate,
                            title       : translater.getValueFromKey('schema.default')
                        },
                        items : {
                            type : 'List',
                            editorClass : 'itemList',
                            itemType : 'Object',
                            itemToString : function(item) {
                                return 'ID : ' + item.id + ', <b>EN label</b> : ' + item.en + ', FR label : ' + item.fr + ', value : ' + item.value;
                            },
                            subSchema : {
                                id    : {
                                    type  : 'Number',
                                    title : "ID"
                                },
                                value : {
                                    type       : 'Text',
                                    title      : translater.getValueFromKey('schema.real'),
                                    validators : ['required']
                                },
                                en    : {
                                    type : 'Text',
                                    title      : 'Text display in English',
                                    validators : ['required'] ,
                                    title      : translater.getValueFromKey('schema.englishText')
                                },
                                fr    : {
                                    type       : 'Text',
                                    title      : translater.getValueFromKey('schema.frenchText'),
                                    validators : ['required']
                                }
                            }
                        }
                    }
                },
                expanded: {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor"
                },
                multiple: {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor"
                }
            });
        },


        /**
        * Constructor
        *
        * Get models.BaseField schema and add it on EnumerationField schema
        */
        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
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

        updateSelectedOption : function(index) {
            var itemList = this.get('itemList');
            itemList.defaultValue = index;
            this.set('itemList', itemList);
        }

    });

    //  ----------------------------------------------------
    //  Field herited by TextField
    //  ----------------------------------------------------

    models.DateField = models.TextField.extend({

        defaults: function() {
            return _.extend( {}, models.TextField.prototype.defaults(), {
                format: "dd/mm/yyyy"
            });
        },

        schema: function() {
            return _.extend( {}, models.TextField.prototype.schema(), {
                format: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.format'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.format')
                    }
                }
            });
        },

        initialize: function() {
            models.TextField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type   : "Date",
        i18n   : 'date'
    });

    models.TextAreaField = models.TextField.extend({

        defaults : function() {
            return _.extend( {}, models.TextField.prototype.defaults(), {
                multiline : true
            });
        },

        schema: function() {
            var schema =  _.extend( {}, models.TextField.prototype.schema(), {
                multiline : {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor",
                    title       : translater.getValueFromKey('schema.multiline')
                }
            });
            schema.size.validators = [function checkValue(value, formValues) {
                if (value < 0 || value > 8000) {
                    return {
                        type : 'Invalid number',
                        message : "La taille doit être comprise en 0 et 8000"
                    }
                }
            }];
            return schema;
        },

        initialize: function() {
            models.TextField.prototype.initialize.apply(this, arguments);
            this.set('multiline', true);
        }

    }, {
        type   : 'TextArea',
        i18n   : 'TextArea'
    });

    models.NumberField = models.TextField.extend({

        defaults: function() {
            var baseSchema = _.pick(
                models.TextField.prototype.defaults(), _.keys(models.BaseField.prototype.defaults, 'help')
            );
            baseSchema.help = translater.getValueFromKey('schema.numericHelp')
            return _.extend( {}, baseSchema, {
                minValue     : 0,
                maxValue     : 100,
                precision    : 1,
                decimal      : true,
                defaultValue : 10,
                unity        : "meters",
            })
        },

        baseSchema : {
            decimal : {
                type        : CheckboxEditor,
                fieldClass : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.decimal')
            },
            defaultValue : _.pick(models.TextField.prototype.schema(), 'defaultValue')['defaultValue'],
            minValue: {
                type        : 'Number',
                editorClass : 'form-control',
                template    : fieldTemplate,
                title       : translater.getValueFromKey('schema.min'),
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.num.min')
                }
            },
            maxValue: {
                type        : 'Number',
                editorClass : 'form-control',
                template    : fieldTemplate,
                title       : translater.getValueFromKey('schema.max'),
                validators : [function checkValue(value, formValues) {
                    if (value < formValues['minValue']) {
                        return {
                            type : 'Invalid number',
                            message : "La valeur maximale est inférieure à la valeur minimale"
                        }
                    }
                }],
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.num.max')
                }
            },
            precision: {
                type        : 'Number',
                editorClass : 'form-control',
                fieldClass  : 'advanced',
                template    : fieldTemplate,
                title       : translater.getValueFromKey('schema.precision'),
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.num.precision')
                }
            },
            unity: {
                type        : 'Text',
                editorClass : 'form-control',
                template    : fieldTemplate,
                title       : translater.getValueFromKey('schema.unity'),
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.num.unity')
                }
            }
        },

        schema : function() {
            var schema = _.extend( {}, _.pick(models.TextField.prototype.schema(), _.keys(models.BaseField.prototype.schema), 'help'), this.baseSchema);

            schema.defaultValue.type = 'Number';
            schema.defaultValue.validators = [function checkValue(value, formValues) {
                if (value > formValues['maxValue']) {
                    return {
                        type : 'Invalid number',
                        message : "La valeur par défault est supérieur à la valeur maximale"
                    }
                } else if (value < formValues['minValue']) {
                    return {
                        type : 'Invalid number',
                        message : "La valeur par défault est inférieure à la valeur minimale"
                    }
                } else {
                    return undefined;
                }

            }]
            return schema;
        },

        initialize: function() {
            models.TextField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type   : 'Number',
        i18n   : 'Number'
    });

    //  Numeric field with range
    //  It's the same modal we change only constructor object
    models.NumericRangeField = models.NumberField.extend({

        defaults : function() {
            return models.NumberField.prototype.defaults()
        },

        schema : function() {
            return models.NumberField.prototype.schema()
        },

    }, {
        type   : 'NumericRange',
        i18n   : 'numericrange'
    });


    models.PatternField = models.TextField.extend({
        defaults: function() {
            return _.extend( {}, models.TextField.prototype.defaults(), {
                pattern: ""
            })
        },

        schema: function() {
            return _.extend( {}, models.TextField.prototype.schema(), {
                pattern: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.pattern')
                }
            });
        },

        initialize: function() {
            models.TextField.prototype.initialize.apply(this, arguments);
        }

    }, {
        type   : "Pattern",
        i18n   : 'mask'
    });

    //  ----------------------------------------------------
    //  Field herited by EnumerationField
    //  ----------------------------------------------------

    models.CheckBoxField = models.EnumerationField.extend({

        defaults : function() {
            return models.EnumerationField.prototype.defaults();
        },

        schema: function() {
            return models.EnumerationField.prototype.schema();
        },

        initialize: function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);

            this.set('multiple', true);
            this.set('expanded', true);
        }

    }, {
        type   : 'CheckBox',
        i18n   : 'checkbox',
        section : 'list'
    });

    models.RadioField = models.EnumerationField.extend({
        defaults : function() {
            return models.EnumerationField.prototype.defaults();
        },

        schema : function() {
            return models.EnumerationField.constructor.schema;
        },

        initialize: function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);
            this.set('multiple', false);
            this.set('expanded', true);
        }
    }, {
        type   : 'Radio',
        i18n   : 'radio',
        section : 'list'
    });

    models.SelectField = models.EnumerationField.extend({

        defaults : function() {
            return models.EnumerationField.prototype.defaults();
        },

        schema : function() {
            return models.EnumerationField.prototype.schema();
        },

        initialize: function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type   : 'Select',
        i18n   : 'select',
        section : 'list'
    });

    models.SubformField = Backbone.Model.extend({
        defaults: {
            id       : 0,
            fields   : [],
            legend   : 'Fieldset',
            multiple : false
        },

        schema : {
            id       : {
                type        : 'Number',
                title       : 'ID',
                editorClass : 'form-control',
                template    : fieldTemplate,
                fieldClass  : 'advanced'
            },
            multiple : {
                type        : CheckboxEditor,
                fieldClass : "checkBoxEditor",
                help        : 'If this fieldset can be present many times in one form <br />' ,
                title       : translater.getValueFromKey('schema.multiple')
            },
            legend   : {
                type        : 'Text',
                editorClass : 'form-control',
                template    : fieldTemplate ,
                title       : translater.getValueFromKey('schema.legend'),
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.legend')
                }
            }
        },

        initialize: function(options) {
            _.bindAll(this, 'addModel', 'removeModel', 'updateModel');
        },

        addModel: function(model) {
            var arr = this.get('fields');
            model.set('isDragged', true);
            arr.push(model);
            this.set('fields', arr);
        },

        removeModel: function(index) {
            var arr = this.get('fields');
            delete arr[index];
            this.set("fields", arr);
        },

        updateModel: function(index, from, to) {
            var arr = this.get('fields');
            var element = arr[from];
            arr.splice(from, 1);
            arr.splice(to, 0, element);
            this.set('fields', arr);
        }
    }, {
        type   : 'Subform',
        i18n   : 'fieldset',
        section : 'presentation'
    });

    models.ThesaurusField = models.BaseField.extend({
        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                webServiceURL : 'ressources/thesaurus/thesaurus.json',
                defaultNode: ""
            });
        },
        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                defaultNode: {
                    type  : 'Text',
                    title : translater.getValueFromKey('schema.defaultNode'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.node.default')
                    }
                },
                webServiceURL : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.webServiceURL'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.node.url')
                    }
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type: 'Thesaurus',
        i18n: 'thesaurus'
    });

    models.AutocompleteTreeView = models.BaseField.extend({
        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                language    : { hasLanguage: true, lng: 'En' },
                wsUrl       : 'ressources/thesaurus',
                webservices : 'autocompleteTreeView.json',
                startId     : '85263',
                defaultNode : ""
            });
        },
        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                defaultNode: {
                    type  : 'Text',
                    title : translater.getValueFromKey('schema.defaultNode'),
                    editorClass : 'form-control',
                    template    : fieldTemplate
                },
                wsUrl : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.wsUrl')
                },
                webservices : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.ws')
                },
                language : {
                    type        : 'Select',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.wslng'),
                    options : ["fr", "en"]
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type: 'AutocompleteTreeView',
        i18n: 'autocomp',
        doubleColumn : true
    });

    return models;

});
