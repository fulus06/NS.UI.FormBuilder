define(['jquery','marionette', '../layout/HomePageLayout', 'i18n', 'backbone.radio', 'i18n'], function($, Marionette, HomePageLayout, Radio) {

    var HomePageController = Marionette.Controller.extend({

        initialize: function(options) {
            // Kepp homepage region
            this.homePageRegion = options.homePageRegion;

            this.URLOptions = options.URLOptions;

            this.initHomePageChannel();
        },

        initHomePageChannel : function() {
            this.homePageChannel = Backbone.Radio.channel('homepage');

            //  Event send by CenterGridPanelView when user wants to remove a form
            this.homePageChannel.on('deleteForm', this.deleteForm, this);
        },

        deleteForm : function(formID) {
            //  We delete the form and send the result to CenterGridPanelView
            this.homePageChannel.trigger('formDeleted', true)
        },

        homeAction: function() {
            $('#navbarContext').text($.t('navbar.context.home'))

            //  Init homepage layout and render it in the homepage region
            var homePageLayout = new HomePageLayout({
                URLOptions : this.URLOptions
            });
            this.homePageRegion.show( homePageLayout );
        }
    });

    return HomePageController;

});
