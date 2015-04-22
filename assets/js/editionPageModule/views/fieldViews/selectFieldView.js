define([
    'jquery',
    'underscore',
    'backbone',
    'editionPageModule/views/fieldViews/BaseView',
    'text!editionPageModule/templates/fields/selectFieldView.html',
    'bootstrap-select'
], function($, _, Backbone, BaseView, viewTemplate) {

    var SelectFieldView = BaseView.extend({
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
                'change select'        : 'updateSelected'
            });
        },

        initialize : function(options) {
            var opt = options;
            opt.template = viewTemplate;

            BaseView.prototype.initialize.apply(this, [opt]);
        },

        updateSelected : function(e) {
            this.model.updateSelectedOption($(e.target).find(':selected').index());
        },

        render : function() {
            BaseView.prototype.render.apply(this, arguments);
            $(this.el).find('select').selectpicker();
        }
    });

	return SelectFieldView;

});