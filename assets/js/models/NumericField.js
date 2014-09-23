define(['backbone', 'models/TextField'], function(Backbone, TextField) {

    var NumericField = TextField.extend({

        defaults: function() {
            return _.extend(TextField.prototype.defaults(), {
                minValue  : 0,
                maxValue  : 100,
                precision : 1,
                unity     : "meters"
            })
        },

        schema: function() {
            return _.extend(TextField.prototype.schema(), {
                minValue: {
                    type: 'Number'
                },
                maxValue: {
                    type: 'Number'
                },
                precision: {
                    type: 'Number'
                },
                unity: {
                    type: 'Text'
                }
            });
        },

        initialize: function() {
            TextField.prototype.initialize.apply(this, arguments);

            this.set('hint', 'Enter a numeric value');
        },

        getXML: function() {
            return TextField.prototype.getXML.apply(this, arguments) +
                '<min>'         + this.get("minValue")  + '</min>' +
                '<max>'         + this.get("maxValue")  + '</max>' +
                '<precision>'   + this.get("precision") + '</precision>' +
                '<unity>'       + this.get("unity")     + '</unity>';
        }
    }, {
        type   : 'Numeric',
        xmlTag : 'field_numeric',
        i18n   : 'numeric'
    });

    return NumericField;

});