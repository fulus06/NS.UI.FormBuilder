define([
    'jquery',
    'underscore',
    'backbone',
    'views/fieldViews/baseView',
    'text!../../../templates/fieldView/datefieldView.html'
], function($, _, Backbone, BaseView, viewTemplate) {

    var DateFieldView = BaseView.extend({
        events: function() {
            return BaseView.prototype.events;
        },

        initialize : function(options) {
            var opt = options;
            opt.template = viewTemplate;

            BaseView.prototype.initialize.apply(this, [opt]);
        },

       render : function() {
           BaseView.prototype.render.apply(this, arguments);
           $(this.el).find('input').datepicker({
               format: this.model.get('format')
           });
       }
    });

    return DateFieldView;

});