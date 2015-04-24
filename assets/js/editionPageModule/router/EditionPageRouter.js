define([
    'marionette',
    'backbone.radio'
], function(Marionette, Radio) {

    var EditionePageRouter = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            "edition": "editionAction",
        },

        initialize : function() {
            this.initEditionPageChannel();
            this.initFormChannel();
        },

        initEditionPageChannel : function() {
            this.editionPageChannel = Backbone.Radio.channel('editionPage');

            //  Event send from formbuilder js when user want to edit a form from the homepage list
            this.editionPageChannel.on('display', this.displayEditionPage, this);

            //  Event send by formbuilder when user wants to import a form from the hompegae
            this.editionPageChannel.on('formImported', this.formImported, this);
        },

        initFormChannel : function() {
            this.formChannel = Backbone.Radio.channel('form');

            //  Return to hompage
            //  Event send by FormPanelView when user click on "exit" button
            this.formChannel.on('exit', this.exit, this);
        },

        /**
         * Init formview with form to edit
         *
         * @param  {Object} formToEdit form to edit
         */
        displayEditionPage : function(formToEdit) {
            this.formChannel.trigger('formEdition', formToEdit);
            //  Start edition
            this.navigate('#edition', {
                trigger : true
            });
            //  Send event to formview

        },

        formImported : function(formAsJSON) {
            this.navigate('#edition', {
                trigger : true
            });
            this.formChannel.trigger('import', formAsJSON)
        },

        exit : function() {
            this.navigate('#', {
                trigger : true
            });
        }

    });

    return EditionePageRouter;

});
