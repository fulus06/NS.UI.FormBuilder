/**
 * Run the application
 * At start we run HomePageRouter to display homepage
 */

define([
    'underscore',
    'marionette',
    'editionPageModule/router/EditionPageRouter',
    'editionPageModule/controller/EditionPageController',
    'appPageModule/router/AppPageRouter',
    'appPageModule/controller/AppPageController',

    'backbone.radio'
], function(_, Marionette, EditionPageRouter, EditionPageController, AppPageRouter, AppPageController, Radio) {

    //  Create a marionette application
    var FormbuilderApp = new Backbone.Marionette.Application();

    //  Add two main region for the layouts
    FormbuilderApp.addRegions({
        homeRegion  : '#homeSection',
        rightRegion : '#rightSection'
    });

    FormbuilderApp.addInitializer(function(options){
        window.location.hash = "#";
    });

    //  Add a first initializer that create homepage router
    FormbuilderApp.addInitializer(function(options){
          //Create controller for homepage
        var homePageRouter = new AppPageRouter({
            controller : new AppPageController({
                appPageRegion : this.homeRegion,
                URLOptions : options.URLOptions
            })
        });
    });

    FormbuilderApp.addInitializer(function(options){
        //  Create controller for homepage
        var editionPageRouter = new EditionPageRouter({
            controller : new EditionPageController({
                editionPageRegion : this.rightRegion,
                URLOptions : options.URLOptions
            })
        });
    });

    FormbuilderApp.addInitializer(function(options) {
        //  App global channel, use for communication through module
        //  Modules never communicate directly, all pass from formbuilder app
        this.globalChannel = Backbone.Radio.channel('global');

        //  Channel for editionPageModule
        this.editionPageChannel = Backbone.Radio.channel('editionPage');

        //  Event send by CenterGridView when user wants to edit a form present in the grid
        this.globalChannel.on('displayEditionPage', _.bind(function(formToEdit) {
            //  Send event to editionPageRouter
            this.editionPageChannel.trigger('display', formToEdit);
            setTimeout(function() {
                $('#mainRegion').animate({
                    marginLeft : '-100%'
                }, 750);
            }, 300);
        }, this));


        this.globalChannel.on('displayHomePage', _.bind(function() {
            $('#mainRegion').animate({
                marginLeft : '0%'
            }, 750, _.bind(function() {
                this.rightRegion.empty();
            }, this));
        }, this));
    })

    //  Application start callback
    FormbuilderApp.on('start', function(options) {
        Backbone.history.start();
    })

    return FormbuilderApp;

});
