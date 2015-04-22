define([
    'jquery',
    'underscore',
    'backbone',
    'editionPageModule/views/fieldViews/BaseView',
    'text!editionPageModule/templates/fields/treeviewFieldView.html',
    'jquery-ui', 'fancytree'
], function($, _, Backbone, BaseView, viewTemplate) {

    var TreeViewFieldView = BaseView.extend({
        events: function() {
            return _.extend({}, BaseView.prototype.events, {
            });
        },

        initialize : function(options) {
            var opt = options;
            opt.template = viewTemplate;

            BaseView.prototype.initialize.apply(this, [opt]);
        },

        render : function() {
            BaseView.prototype.render.apply(this, arguments);
            $('#treeview' + this.model.get('id')).fancytree({
                source: [
                    {title: "Node 1", key: "1"},
                    {title: "Folder 2", key: "2", folder: true, children: [
                        {title: "Node 2.1", key: "3"},
                        {title: "Node 2.2" + this.model.get('defaultNode'), key: "4"}
                    ]}
                ],
                selectMode : 1,
                defaultkey : "" + this.model.get('defaultNode')
            });
        }
    });

	return TreeViewFieldView;

});