define([
    'jquery',
    'underscore',
    'backbone',
    'editionPageModule/views/fieldViews/BaseView',
    'text!editionPageModule/templates/fields/thesaurusFieldView.html',
    'text!editionPageModule/templates/fields/readonly/thesaurusFieldView.html',
    'backbone.radio',
    'app-config'
], function($, _, Backbone, BaseView, viewTemplate, viewTemplateRO, Radio, AppConfig) {

    var TreeViewFieldView = BaseView.extend({

        events: function() {
            return _.extend({}, BaseView.prototype.events, {
            });
        },

        initialize : function(options, readonly) {
            var opt = options;
            opt.template = viewTemplate;
            if (readonly)
                opt.template = viewTemplateRO;
            BaseView.prototype.initialize.apply(this, [opt]);

            this.initGlobalChannel();
            this.initConfigChannel();

            this.rendered = false;
        },

        initGlobalChannel : function() {
            this.globalChannel = Backbone.Radio.channel('global');

            this.globalChannel.on('nodeSelected' + this.model.get('id'), this.updateTreeView, this);
            this.globalChannel.on('nodeReset' + this.model.get('id'), this.resetTreeView, this);
        },

        initConfigChannel : function() {
            this.configChannel = Backbone.Radio.channel('config');

            this.configChannel.on('get:startID', _.bind(this.displayTreeView, this));
        },

        displayTreeView : function(startID) {
            var that = this;
            if (startID == "")

            {
                startID = AppConfig.config.startID.thesaurus[window.context];
                if (!startID)
                    startID = AppConfig.config.startID.thesaurus.default;
            }

            var callbackWSCallHttp = function(data){
                var fancyval = $('#thesaurus' + that.model.get('id')).fancytree({
                    source: data['children'],
                    checkbox: false,
                    selectMode: 2,
                    activeNode: startID,
                    click: function (event, data){/*console.log("-01**************", event, data);*/}
                });
                if ($('#thesaurus' + that.model.get('id')).fancytree("getTree").getNodeByKey){
                    $('#thesaurus' + that.model.get('id')).fancytree('getTree').reload({
                        children : $('#thesaurus' + that.model.get('id')).fancytree("getTree").getNodeByKey(startID).children
                    });
                }
            };

            var callbackWSCallOther = function(data){
                $('#thesaurus' + that.model.get('id')).fancytree({
                    source: data['d'],
                    checkbox: false,
                    selectMode: 2,
                    activeNode: startID,
                    click : _.bind(function(event, data) {
                        //console.log("03**************", event, data);
                    }, this)
                });
            };


            require(['jquery-ui', 'fancytree'], _.bind(function() {
                if (that.model.get('webServiceURL').substring(0, 5) == 'http:') {
                    if (window.trees[that.model.get('webServiceURL')]) {
                        callbackWSCallHttp(window.trees[that.model.get('webServiceURL')]);
                    }
                    else {
                        $.ajax({
                            data: JSON.stringify({StartNodeID: startID, lng: "fr"}),
                            type: 'POST',
                            url: that.model.get('webServiceURL'),
                            contentType: 'application/json',
                            //  If you run the server and the back separately but on the same server you need to use crossDomain option
                            //  The server is already configured to used it
                            crossDomain: true,

                            //  Trigger event with ajax result on the formView
                            success: _.bind(function (data) {
                                callbackWSCallHttp(data);
                            }, this)
                        });
                    }
                }
                else {
                    if (window.trees[that.model.get('webServiceURL')]) {
                        callbackWSCallOther(window.trees[that.model.get('webServiceURL')]);
                    }
                    else {
                        $.getJSON(that.model.get('webServiceURL'), _.bind(function (data) {
                            callbackWSCallOther(data);
                        }, this)).error(function (a, b, c) {
                            alert("can't load ressources !");
                        });
                    }
                }
            }), this);
        },

        updateTreeView : function(data) {
            var startID = "";
            var nodeFullpath = "";
            var children = null;

            if (data['node'])
            {
                startID = data['node']['key'] ;
                nodeFullpath = data['node']['data']['fullpath'];
                children = data['node']['children'];
            }
            else
            {
                startID = data['key'] ;
                nodeFullpath = data['fullpath'];
                children = data['children'];
            }

            var that = this;

            var reloadFieldInList = function(){
                if (children !== null) {
                    $('#thesaurus' + that.model.get('id')).fancytree('getTree').reload({
                        children : children
                    });
                } else {
                    // that.$el.first('.thesaurusField').fancytree('getTree').reload(that.savedArr);
                }
            };

            if (!that.savedDefaultNode)
            {
                that.savedDefaultNode = this.model.get('defaultNode');
                that.savedFullpath = this.model.get('fullpath');
                var arr = [];
                arr[0] = data.node;
                that.savedArr = arr;
            }

            reloadFieldInList();

            this.model.set('defaultNode', startID);
            $('input[name="defaultNode"]').val(nodeFullpath);
            this.model.set('fullpath', nodeFullpath);
        },

        resetTreeView : function()
        {
            var that = this;

            this.displayTreeView(that.savedDefaultNode);
            /*
            if (that.savedDefaultNode)
            {
                this.model.set('defaultNode', that.savedDefaultNode);
                $('input[name="defaultNode"]').val(that.savedFullpath);
                this.model.set('fullpath', that.savedFullpath);
                $('#thesaurus' + that.model.get('id')).fancytree('getTree').reload(that.savedArr);
            }
            */
        },

        render : function() {
            if (!this.rendered) {
                BaseView.prototype.render.apply(this, arguments);
                this.rendered = true;
                this.displayTreeView(this.model.get("defaultNode"));
            }
            else
            {
                $('#dropField'+this.model.get('id')+' .field-label').text(this.model.get('labelFr'));
            }
        }
    });

	return TreeViewFieldView;

});