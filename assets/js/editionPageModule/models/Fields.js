define([
    'jquery', 'underscore', 'backbone', '../../Translater', '../editor/CheckboxEditor', 'app-config', '../../homePageModule/collection/FormCollection'
], function($, _, Backbone, Translater, CheckboxEditor, AppConfig, FormCollection) {

    var fieldTemplate = _.template('\
        <div class="form-group field-<%= key %>">\
            <label class="control-label" for="<%= editorId %>"><%= title %></label>\
            <div data-editor >\
                <p class="help-block" data-error></p>\
                <p class="help-block"><%= help %></p>\
            </div>\
        </div>\
    ');

    var models = {}, translater = Translater.getTranslater();

    models.BaseField = Backbone.Model.extend({

        defaults: {
            order       : 1,
            name        : "Field",
            labelFr     : translater.getValueFromKey('schema.label.fr'),
            labelEn     : translater.getValueFromKey('schema.label.en'),
            required    : false,
            editMode    : {visible : true, editable : true, nullable : true, nullmean : false},
            isDragged   : false,
            editorClass : '',
            fieldClassEdit  : '',
            fieldClassDisplay  : '',
            fieldSizeEdit   : 1,
            fieldSizeDisplay   : 1,
            endOfLine   : false,
            linkedFieldset               : '',

            // Linked fields values
            isLinkedField                : false,
            linkedFieldTable             : '',
            linkedFieldIdentifyingColumn : '',
            linkedField                  : '',

            // Input Template
            applyTemplate                : ''
        },

        schema : {
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
                validators : ['required'],
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.name')
                }
            },
            editMode : {
                type        : 'Object',
                subSchema   : {
                    visible : {
                        type: CheckboxEditor,
                        title: translater.getValueFromKey('schema.editMode.visible'),
                        fieldClass: "checkBoxEditor"
                    },
                    editable : {
                        type: CheckboxEditor,
                        title: translater.getValueFromKey('schema.editMode.editable'),
                        fieldClass: "checkBoxEditor"
                    },
                    nullable : {
                        type: CheckboxEditor,
                        title: translater.getValueFromKey('schema.editMode.nullable'),
                        fieldClass: "checkBoxEditor"
                    },
                    nullmean : {
                        type: CheckboxEditor,
                        title: translater.getValueFromKey('schema.editMode.nullmean'),
                        fieldClass: "checkBoxEditor"
                    }
                },
                title       : translater.getValueFromKey('schema.editMode.editMode')
            },
            editorClass : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.editorClass'),
                editorClass : 'form-control',
                fieldClass  : 'marginTop20',
                template    : fieldTemplate
            },
            fieldClassEdit : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.fieldClassEdit'),
                editorClass : 'form-control',
                template    : fieldTemplate
            },
            fieldClassDisplay : {
                type        : "Text",
                title       : translater.getValueFromKey('schema.fieldClassDisplay'),
                editorClass : 'form-control',
                template    : fieldTemplate
            },
            fieldSizeEdit : {
                type : 'Radio',
                title       : translater.getValueFromKey('schema.fieldSizeEdit'),
                editorClass : 'radiosField',
                template    : fieldTemplate,
                options : [
                    {
                        label : translater.getValueFromKey('schema.sizeValue.small'),
                        val : 1
                    },
                    {
                        label : translater.getValueFromKey('schema.sizeValue.medium'),
                        val : 2
                    },
                    {
                        label : translater.getValueFromKey('schema.sizeValue.large'),
                        val : 3
                    }
                ]
            },
            fieldSizeDisplay : {
                type : 'Radio',
                title       : translater.getValueFromKey('schema.fieldSizeDisplay'),
                editorClass : 'radiosField',
                template    : fieldTemplate,
                options : [
                    {
                        label : translater.getValueFromKey('schema.sizeValue.small'),
                        val : 1
                    },
                    {
                        label : translater.getValueFromKey('schema.sizeValue.medium'),
                        val : 2
                    },
                    {
                        label : translater.getValueFromKey('schema.sizeValue.large'),
                        val : 3
                    }
                ]
            },
            endOfLine : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.eol')
            },
            linkedFieldset : {
                title       : translater.getValueFromKey('schema.linkedFieldset'),
                editorClass : 'form-control',
                template    : fieldTemplate
            },

            //  Linked field section
            isLinkedField : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.isLinkedField') || "isLinkedField"
            },
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

            applyTemplate : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.applyTemplate'),
                template    : fieldTemplate,
                editorClass : 'form-control',
                options : []
            }

        },

        initialize : function(options) {
            _.bindAll(this, 'getJSON');
        },

        isAdvanced : function(index) {
            return this.getSchemaProperty(index, 'advanced') === "advanced";
        },

        /**
         * Return the model in JSON object
         *
         * @returns {object} field as json object
         */
        getJSON : function() {
            var jsonObject                  = {
                validators : []
            },
            schemaKeys                  = _.keys( typeof this.schema == "function" ? this.schema() : this.schema ),
            schemaKeysWithoutValidator  = _.without(schemaKeys, 'required');

            _.each(schemaKeysWithoutValidator, _.bind(function(el) {
                jsonObject[el] = this.get(el);
            }, this));

            jsonObject["id"]    = this.get("id");
            jsonObject["order"] = this.get("order");

            if (this.get('editMode') & 4 != 4) {
                jsonObject['validators'].push('required');
            }
            if (this.get('editMode') & 2 != 2) {
                jsonObject['validators'].push('readonly');
            }
            return _.omit(jsonObject, 'isLinkedField');
        }

    });

    models.HiddenField = Backbone.Model.extend({
        defaults: {
            id          : 0,
            order       : 1,
            title       : translater.getValueFromKey('tooltip.hidden'),
            name        : "Field",
            value       : ""
        },

        schema: {
            name   : {
                type        : "Text",
                title       : 'Name',
                editorClass : 'form-control',
                template    : fieldTemplate,
                editorAttrs : {
                    placeholder : translater.getValueFromKey('placeholder.name')
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
            },

            //  Linked field section
            isLinkedField : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.isLinkedField') || "isLinkedField"
            },
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

            applyTemplate : {
                type : 'Select',
                title       : translater.getValueFromKey('schema.applyTemplate'),
                template    : fieldTemplate,
                editorClass : 'form-control',
                fieldClass  : 'col-xs-10',
                options : []
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
                help         : translater.getValueFromKey('placeholder.autocomplete'),
                triggerlength: 2,
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
                triggerlength: {
                    type        : 'Number',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.triggerlength'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.triggerlength')
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
                help         : translater.getValueFromKey('placeholder.text'),
                valuesize    : AppConfig.sizes.strings.defaultsize,
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
                valuesize: {
                    type        : 'Select',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.size'),
                    options     : AppConfig.sizes.getStringSizes()
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
                filesize         : 200, //  specify max file size in ko,
                help         : translater.getValueFromKey('placeholder.file')
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
                help: {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.help'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.help')
                    }
                },
                filesize: {
                    type        : 'Number',
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
                choices: [
                    {
                        id             : 1,
                        value          : "1",
                        en             : "My first Option",
                        fr             : 'Mon option',
                        isDefaultValue : false
                    }
                ],
                //  the default value refers to the default choice id
                //  We used an array because we can have multiple default value
                defaultValue: [1],
                webServiceURL : "",
                multiple: false,
                expanded: false
            });
        },

        getJSON : function() {
            var json = models.BaseField.prototype.getJSON.apply(this, arguments);
            json.choices = JSON.stringify(this.get('choices'));

            return json;
        },

        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                webServiceURL : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.webServiceURL')
                },
                multiple: {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor"
                }
            });
        },

        /**
         * To manage Enumeration field values we used Backgrid.
         * So we need to specify which columns use
         */
        columns : [
            {
                name     : 'isDefaultValue',
                label    : '',
                cell     : 'boolean'
            },
            {
                name     : 'en',
                label    : 'en',
                cell     : 'string'
            },
            {
                name     : 'fr',
                label    : 'fr',
                cell     : 'string'
            },
            {
            name     : 'value',
            label    : 'value',
            cell     : 'string'
            },
            {
                name     : 'action',
                label    : '',
                cell     : 'string',
                editable : false
            }
        ],

        /**
         * Default value when we add a new row
         */
        columDefaults : {
            en             : 'English value',
            fr             : 'French label',
            value          : 'Value',
            action         : '',
            isDefaultValue : false
        },

        /**
        * Constructor
        *
        * Get models.BaseField schema and add it on EnumerationField schema
        */
        initialize: function(options) {
            models.BaseField.prototype.initialize.apply(this, arguments);
            if (typeof this.get('choices') === 'string') {
                this.set('choices', JSON.parse(this.get('choices')));
            }
        }
    });

    //  ----------------------------------------------------
    //  Field herited by TextField
    //  ----------------------------------------------------

    models.DateField = models.TextField.extend({

        defaults: function() {
            return _.extend( {}, models.TextField.prototype.defaults(), {
                format: "dd/mm/yyyy",
                help : translater.getValueFromKey('placeholder.date')
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
            schema.valuesize.validators = [function checkValue(value, formValues) {
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
            baseSchema.help = translater.getValueFromKey('placeholder.numeric');
            return _.extend( {}, baseSchema, {
                minValue     : '',
                maxValue     : '',
                precision    : 1,
                decimal      : true,
                defaultValue : '',
                unity        : '',
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

        subSchema : models.EnumerationField.prototype.subSchema,

        initialize: function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);

            this.set('multiple', true);
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
            return _.omit(models.EnumerationField.prototype.schema(), 'multiple');
        },

        subSchema : models.EnumerationField.prototype.subSchema,

        initialize: function() {
            models.EnumerationField.prototype.initialize.apply(this, arguments);

            this.set('multiple', false);
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

        subSchema : models.EnumerationField.prototype.subSchema,

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
            id                : 0,
            order             : 1,
            fields            : [],
            fieldsObject      : [],
            legend            : 'Fieldset',
            multiple          : false
        },

        schema : {
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

        addField : function(field) {

            //  Update field array
            var arr = this.get('fields');

            arr.push(field.get('name'));
            this.set('fields', arr);

            //  Send event to the subForm view
            //  The subForm view will create subView corresponding to the field in parameter
            this.trigger('fieldAdded', field);
        },

        removeField : function(field) {

            var arr     = this.get('fields'),
                index   = arr.indexOf(field);
            arr.splice(index, 1);
            this.set('fields', arr);
            this.trigger('fieldRemoved');
        }

    }, {
        type   : 'Subform',
        i18n   : 'fieldset',
        section : 'presentation'
    });

    models.ThesaurusField = models.BaseField.extend({
        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                webServiceURL : AppConfig.paths.thesaurusWSPath,
                defaultNode: "",
                fullpath : false,
                iscollapsed : false
            });
        },
        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                webServiceURL : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.webServiceURL'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.node.url')
                    }
                },
                defaultNode: {
                    type  : 'Text',
                    title : translater.getValueFromKey('schema.defaultNode'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.tree.default')
                    }
                },
                fullpath : {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor",
                    title       : translater.getValueFromKey('schema.fullpath')
                },
                iscollapsed : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('schema.iscollapsed')
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type: 'Thesaurus',
        i18n: 'thesaurus',
        doubleColumn : true
    });

    models.AutocompleteTreeViewField = models.BaseField.extend({
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
                wsUrl : {
                    type        : 'Text',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.wsUrl')
                },
                defaultNode: {
                    type  : 'Text',
                    title : translater.getValueFromKey('schema.defaultNode'),
                    editorClass : 'form-control',
                    template    : fieldTemplate
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
                },
                fullpath : {
                    type        : CheckboxEditor,
                    fieldClass : "checkBoxEditor",
                    title       : translater.getValueFromKey('schema.fullpath')
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

    var getFormsList = function(context){
        var toret = [];
        if (AppConfig.paths){
            var formCollection = new FormCollection({
                url : AppConfig.paths.forms
            });

            formCollection.fetch({
                async: false,
                reset : true,
                success : _.bind(function() {
                    $.each(formCollection.models, function(index, value){
                        if (context.collection.name != value.attributes.name &&
                            (!value.attributes.context || value.attributes.context == window.context))
                            toret.push({"val" : value.attributes.id  ,"label" : value.attributes.name});
                    });
                }, this)
            });
            return(toret);
        }
    };

    models.ChildFormField = models.BaseField.extend({
        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                childFormName : "",
                help : translater.getValueFromKey('placeholder.childform'),
            });
        },
        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                childFormName: {
                    type        : 'Select',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.childFormName'),
                    validators  : ['required'],
                    options     : getFormsList(this)
                },
                help: {
                    type        : 'Hidden',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.help'),
                    editorAttrs : {
                        placeholder : translater.getValueFromKey('placeholder.help')
                    }
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type   : 'ChildForm',
        i18n   : 'childForm'
    });

    // This input type is EcoReleve Dependent
    models.ObjectPickerField = models.BaseField.extend({
        defaults: function() {
            return _.extend( {}, models.BaseField.prototype.defaults, {
                objectType : "Monitored Site"
            });
        },
        schema: function() {
            return _.extend( {}, models.BaseField.prototype.schema, {
                objectType: {
                    type        : 'Select',
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    title       : translater.getValueFromKey('schema.objectType'),
                    options     : ["Individual", "Monitored Site", "Sensor"]
                }
            });
        },

        initialize: function() {
            models.BaseField.prototype.initialize.apply(this, arguments);
        }
    }, {
        type   : 'ObjectPicker',
        i18n   : 'objectpicker'
    });

    return models;

});
