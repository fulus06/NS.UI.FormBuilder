
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

    /**
     *  Base view
     */
    var BaseView = Backbone.View.extend({

        /**
         * Events for the intercepted by the view
         */
        events: {
            'click  .trash' : 'removeView',
            'click .copy'   : 'copyModel',
            'focus input'   : 'updateSetting',
        },

        /**
         * Constructor
         */
        initialize: function(options) {
            this.template   = _.template(options.template);
            _.bindAll(this, 'render', 'removeView');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.removeView);

            this.el = options.el;
        },

        /**
         * Copy model of this view
         */
        copyModel : function() {
            /*var cl = this.model.clone();
            require (['app/formbuilder'], function(formbuilderInstance) {
                cl.set('id', formbuilderInstance.currentCollection.length);    //  change id otherwise element replaced copied element
                formbuilderInstance.currentCollection.add(cl);                 //  Add element to the collection
                formbuilderInstance.currentCollection.trigger('newElement', cl);
            });*/
        },

        /**
         * Remove view
         */
        removeView: function() {
            $(this.el).trigger('delete');
            $(this.el).remove();
            this.remove();
        },

        /**
         * Render view
         */
        render: function() {
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            $(this.el).disableSelection();
            return this;
        },

        /**
         * Update view index, sortable callback
         *
         * @param {interger} idx new index of the view
         */
        updateIndex: function(idx) {
            this.model.id = parseInt(idx);
        }
    });

    return BaseView;

});