define(
    ['jquery', 'underscore', 'backbone', 'app/models/model','app/views/views', 'app/views/modal', 'text!../../../templates/mainViews.html', 'i18n','jqueryui', 'nanoscroller', 'bootstrap'], 
    function($, _, Backbone, model, views, modals, templates) {

    var app = { views : {} };

    app.views.FormView = Backbone.View.extend({

        events: {
            'change #protocolName' : 'changeFormName'
        },

        initialize: function() {
            this.template = _.template($(templates).filter('#formView').html());
            _.bindAll(this, 'render',
                            'addElement',
                            'changeFormName',
                            'importXML',
                            'updateView',
                            'getModel',
                            'getXML',
                            "getSubView"
                    );
            this.collection.bind('newElement', this.addElement);
            this._view = [];
        },


        getSubView : function(subViewID) {
            return this._view[subViewID];
        },

        displayNotification : function(type, title, message) {
            new NS.UI.Notification({
                type    : type,
                title   : title,
                message : message
            });
        },

        updateView : function() {
            var renderedContent = this.template(this.collection.toJSON());
            $(this.el).html(renderedContent);
            $(this.el).find('#protocolName').val(this.collection.name);
        },

        addElement: function(newModel) {
            var id = "dropField" + this.collection.length, viewClassName = newModel.constructor.type + "FieldView";

            $('.drop').append('<div class="span12 dropField " id="' + id  + '" ></div>');

            if (views[viewClassName] !== undefined) {
                var vue = new views[viewClassName]({
                    el      : '#' + id,
                    model   : newModel
               });
                if (vue !== null) {
                    vue.render();
                    this._view[id] = vue;
                }
            } else {
                new NS.UI.Notification({
                    type    : 'error',
                    title   : 'An error occured :',
                    message : "Can't create view for this field"
                });
            }
            $(".actions").i18n();
        },

        render: function() {
            var renderedContent = this.template(this.collection.toJSON());
            $(this.el).html(renderedContent);
            var _vues = this._view;
            $(".drop").sortable({
                cancel      : null,
                cursor      : 'pointer',
                axis        : 'y',
                items       : ".dropField",
                handle      : '.fa-arrows',
                hoverClass : 'hovered',
                containement: '.dropArea',
                stop: function(event, ui) {
                    for (var v in _vues) {
                        _vues[v].updateIndex($('#' + v).index());
                    }
                }
            });
            return this;
        },

        getModel : function() {
            return this.collection.length;
        },

        changeFormName: function() {
            this.collection.name = $('#protocolName').val();
        },

        getXML : function() {
            return this.collection.getXML();
        },

        getJSON : function() {
            return this.collection.getJSON();
        },

        importXML: function() {
            require(['text!../templates/modals.html', 'app/formbuilder'], function(modalViewTemplate, formbuilderRef) {
                var modalTemplate = $(modalViewTemplate).filter('#importProtocolModal')

                $( $(modalTemplate) ).modal({

                }).on('click', '#importProtocolFileText, #importProtocolFind', function() {

                    $('#importProtocolFile').trigger ('click');

                }).on('change', '#importProtocolFile', function() {

                    $('#importProtocolFileText').val( $('#importProtocolFile').val() );

                }).on('click', '.btn-primary', _.bind(function() {

                    $('#importProtocolFileText')[ $('#importProtocolFile').val() === "" ? 'addClass' : 'removeClass']('error');

                    $('#importProtocolName')[ $('#importProtocolName').val() === "" ? 'addClass' : 'removeClass']('error');

                    if (!$('#importProtocolFile').hasClass('error') && !$('#importProtocolName').hasClass('error')) {
                        var file = $('#importProtocolFile')[0].files[0];

                        if (file) {
                            if (file.type === "text/xml") {

                                var reader = new FileReader();
                                reader.readAsText(file, "UTF-8");

                                reader.onload = _.bind(function(evt) {
                                    try {
                                        var result = app.views.XMLValidation(evt.target.result);
                                        if (result !== true) {
                                            $('#importProtocolModal').modal('hide').removeData();
                                            new NS.UI.Notification({
                                                type    : 'error',
                                                title   : 'An error occured :',
                                                message : 'There is a error on the ' + result['element'] + '<br />' + result['message'] + '<br />Please check your XML file'
                                            });
                                        } else {
                                            this.collection.updateWithXml(evt.target.result, $('#importProtocolName').val());
                                            $('#importProtocolModal').modal('hide').removeData();
                                            this.displayNotification('success', 'Porotocol imported :','Your protocol was correctly imported')
                                        }
                                    } catch (err) {
                                        $('#importProtocolModal').modal('hide').removeData();
                                        new NS.UI.Notification({
                                            type    : 'error',
                                            title   : 'An error occured :',
                                            message : "Your XML File can't be validated.<br />The specific error is : " + err
                                        });
                                    }
                                }, this);
                                reader.onerror = function(evt) {
                                    $('#importProtocolModal').modal('hide').removeData();
                                    new NS.UI.Notification({
                                        type    : 'error',
                                        title   : 'An error occured :',
                                        message : "An error was occure during reading file"
                                    });
                                };
                            } else {
                                $('#importProtocolModal').modal('hide').removeData();
                                new NS.UI.Notification({
                                    type    : 'error',
                                    title   : 'File type error :',
                                    message : "Your have to give an XML file."
                                });
                            }
                        } else {
                            $('#importProtocolModal').modal('hide').removeData();
                            new NS.UI.Notification({
                                type    : 'error',
                                title   : 'File type error :',
                                message : "An error was occure during reading file."
                            });
                        }
                    }

                }, this)).find('#importProtocolName').typeahead({
                    source: function(query, process) {
                        return $.getJSON(formbuilderRef.URLOptions.protocolAutocomplete, {query : query}, function(data) {
                            return process(data.options);
                        });
                    }
                });

            });
        },

        importJSON : function()  {

        }
    }, {
        templateSrc:    '<div class="row-fluid notification-container"><ul class="notification-list span12"></ul></div>'+
                        '<div class="row-fluid">'+
                            '<input type="text" id="protocolName" class="firstText span12" value="<%= this.collection.name %>" />'+
                        '</div>'+
                        '<div class="row-fluid"><h2 class="center" data-i18n="label.help">Cliquer sur champs pour l\'ajouter au protocole</h2></div>'+
                        '<div class="row-fluid">'+
                            '<div class="span12 drop"></div>'+
                        '</div>',

        popupSrc:   '<div class="modal hide fade" id="importProtocolModal">'+
                    '   <div class="modal-header">'+
                    '       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                    '       <h3>Import protocol</h3>'+
                    '   </div>'+
                    '   <div class="modal-body">'+
                    '       <div class="row-fluid">'+
                    '           <label>Enter a protocol name and import your file</label>'+
                    '       </div>'+
                    '       <div class="row-fluid">'+
                    '           <input type="text" id="importProtocolName" class="span12" placeholder="Protocol name" data-provide="typeahead" />'+
                    '       </div><br />'+
                    '       <div class="row-fluid">'+
                    '           <input type="file" id="importProtocolFile" class="hide" />'+
                    '           <input type="text" id="importProtocolFileText" class="span10" placeholder="Protocol file" style="margin-left : 0" />'+
                    '           <button type="button" class="span2" id="importProtocolFind">Find</button>'+
                    '       </div>'+
                    '   </div>'+
                    '   <div class="modal-footer">'+
                    '       <a href="#" class="btn btn-primary">Import</a>'+
                    '   </div>'+
                    '</div>'
    });

    /**
     * Panel view
     */
    app.views.PanelView = Backbone.View.extend({
        events: {
            'click .fields': 'appendToDrop'
        },
        initialize: function(collection) {
            this.template   = _.template(this.constructor.templateSrc);
            this._collection = collection;

            this.list = [];
            _.each(model, _.bind(function(el, idx) {
                if (el.type != undefined) {
                    this.list[idx] = {
                        i18n : el.i18n
                    }
                }
            }, this));

            _.bindAll(this, 'appendToDrop');
        },

        appendToDrop : function(e) {
            var elementClassName = $(e.target).data("type") + 'Field';

            if (model[elementClassName] !== undefined) {
                this.collection.addElement(elementClassName);
            } else {
                new NS.UI.Notification({
                    type    : 'error',
                    title   : 'An error occured :',
                    message : "Can't create field object"
                });
            }

        },

        render: function() {
            var renderedContent = this.template({ list : this.list});
            $(this.el).html(renderedContent);
            $(this.el).nanoScroller();
            $('.fields').disableSelection();
            return this;
        }
    }, {
        templateSrc :   '<div class="nano-content">'+
                            '<h1 class="center" data-i18n="label.field"></h1>' +
                            '<% for (var n in list) { %>' +
                            '       <div class="row-fluid">' +
                            '           <div class="span10 offset1 fields" data-type="<%= n.replace("Field", "") %>" data-i18n="fields.<%= list[n]["i18n"] %>" >' +
                            '               <%= list[n]["i18n"] %>'+
                            '           </div>' +
                            '       </div>' +
                            ' <%}; %>'+
                        '</div>'
    });

    app.views.MainView = Backbone.View.extend({

        initialize : function(options) {
            this.el = options.el;
            $(this.el).append(
                '<div class="row-fluid content">'+
                '   <div class="span3 widgetsPanel nano"></div>'+
                '   <div class="span9 dropArea"></div>'+
                '   <div class="span5 settings"></div>'+
                '</div>'
            );

            this.form = options.form || new app.views.Form({}, {
                name: "My form"
            });

            this.panelView = new app.views.PanelView({
                el: '.widgetsPanel',
                collection: this.form,
            });

            this.formView = new app.views.FormView({
                collection: this.form,
                el: $('.dropArea')
            });

            this.panelView.render();
            this.formView.render();

            _.bindAll(this, 'getFormXML', 'downloadXML', 'importXML', 'getActions', 'getSubView');
        },

        getSubView : function(subViewID) {
            return this.formView.getSubView(subViewID);
        },

        clear: function() {
            this.form.clearAll();
        },

        getFormXML : function() {
            return this.formView.getXML();
        },

        getFormJSON : function() {
            return this.formView.getJSON();
        },

        downloadXML : function() {
            return this.formView.downloadXML();
        },

        importXML : function() {
            return this.formView.importXML();
        },

        importJSON : function() {
            return this.formView.importJSON();
        },

        getActions : function() {
            return {
                save : new NS.UI.NavBar.Action({
                    title           : '<i class="fa fa-cloud"></i><span data-i18n="nav.save.title" data-key="save">Save protocol</span>',
                    allowedRoles    : ["reader"],
                    actions: {
                        'save.repo' : new NS.UI.NavBar.Action({
                            //  Display modal window for save the protocol in the repository
                            title       : 'Save',
                            allowedRoles: ['reader'],
                            handler: function() {
                                var modalView = new modals.SaveProtocolModalView({el: '#saveModal'});
                                modalView.render();
                            }
                        }),
                        'save.export': new NS.UI.NavBar.Action({
                            //  Allow to export protocol as a XML file
                            handler: function() {
                                require(['app/formbuilder'], function(formbuilderObjectRef) {
                                    var modalView = new modals.ExportProtocolModalView({
                                        el : "#exportModal",
                                        model : formbuilderObjectRef.currentCollection
                                    });
                                    modalView.render();

                                });
                            },
                            allowedRoles    : ["reader"],
                            title           : 'Export as XML'
                        }),
                        'save.json': new NS.UI.NavBar.Action({
                            //  Allow to export protocol as a XML file
                            handler: function() {
                                require(['app/formbuilder'], function(formbuilderObjectRef) {
                                    var modalView = new modals.ExportJSONProtocolModalView({
                                        el : "#exportModal",
                                        model : formbuilderObjectRef.currentCollection
                                    });
                                    modalView.render();

                                });
                            },
                            allowedRoles    : ["reader"],
                            title           : 'Export as JSON'
                        })
                    }
                }),

                'import' : new NS.UI.NavBar.Action({
                    actions : {
                        'import.JSON' : new NS.UI.NavBar.Action({
                            handler : function() {
                                require(['app/formbuilder'], function(formbuilderRef) {
                                    formbuilderRef.mainView.importJSON();
                                });
                            },
                            allowedRoles: ["reader"],
                            title       : 'Importer un fichier JSON'
                        }),
                        'import.XML' : new NS.UI.NavBar.Action({
                            handler: function() {
                                require(['app/formbuilder'], function(formbuilderRef) {
                                    formbuilderRef.mainView.importXML();
                                });
                            },
                            allowedRoles: ["reader"],
                            title       : 'Importer un fichier XML'
                        }),
                        'import.load' : new NS.UI.NavBar.Action({
                            title       : 'Charger depuis le serveur',
                            allowedRoles: ["reader"],
                            handler : function () {
                                alert ('I\'m working on it !');
                            }
                        })
                    },
                    title       : '<i class="fa fa-upload"></i><span data-i18n="nav.import.title" data-key="import">Import</span>',
                    allowedRoles: ["reader"]
                }),

                clear: new NS.UI.NavBar.Action({
                    handler: function() {
                        require(['app/formbuilder'], function(formbuilderRef) {
                            formbuilderRef.mainView.clear();
                        });
                    },
                    allowedRoles: ["reader"],
                    title       : '<i class="fa fa-trash-o"></i> Tout supprimer'
                }),

                show: new NS.UI.NavBar.Action({
                    handler: function() {
                        $('#compareModal').modal('show')
                        .on('click', '#findSource, #findUpdate', function() {
                            $('#' + $(this).prop('id').replace('find', '').toLowerCase() + 'Hide').trigger('click');
                        })
                        .on('change', 'input[type="file"]', function() {
                            var id = $(this).prop('id').replace('Hide', ''), split = $(this).val().split('\\');
                            $('#' + id).val(split[ split.length - 1]);
                        })
                        .on('click', '.btn-primary', function() {
                            $('#compareModal').modal('hide');
                            var source  = $('#compareModal').find('#sourceHide')[0].files[0],
                                update  = $('#compareModal').find('#updateHide')[0].files[0],
                                srcName = source['name'],
                                updName = update['name'],
                                reader  = null;


                            if (source !== null && update !== null) {
                                 if (source.type === "text/xml" && update.type === "text/xml") {
                                    reader = new FileReader();
                                    reader.readAsText(source, "UTF-8");
                                    reader.onload = function(evt) {
                                        try {
                                            if (formBuilder.XMLValidation(evt.target.result) !== true) {
                                                new NS.UI.Notification ({
                                                    title : result.error,
                                                    type : 'error',
                                                    message : 'Your XML don\'t matches with XML Schema'
                                                });
                                            } else {
                                                source = evt.target.result;
                                                reader = new FileReader();
                                                reader.readAsText(update, "UTF-8");
                                                reader.onload = function(evt) {
                                                    if (formBuilder.XMLValidation(evt.target.result) === true) {
                                                        update = evt.target.result;
                                                        $('.widgetsPanel').switchClass('span3', 'span0', 250, function() {
                                                            $('.dropArea').append(
                                                                formBuilder.GetXMLDiff(source, update, srcName, updName)
                                                            ).switchClass('span9', 'span12', 250).find('.diff').addClass('span11');
                                                            var acts = {
                                                                quit: new NS.UI.NavBar.Action({
                                                                    handler: function() {
                                                                        $('.widgetsPanel').switchClass('span0', 'span3', 250, function() {
                                                                            $('.dropArea').switchClass('span2', 'span9', 250).find('table').remove();
                                                                            navbar.setActions(actions);
                                                                            addIcon();
                                                                        });
                                                                    },
                                                                    allowedRoles: ["reader"],
                                                                    title: "Quit"
                                                                })
                                                            };
                                                            navbar.setActions(acts);
                                                        })
                                                    }
                                                };
                                            }
                                        } catch (exp) {
                                            new NS.UI.Notification({
                                                type: 'error',
                                                title: "An error occured",
                                                message: 'One of giles can\'t be read'
                                            });
                                        }
                                    };
                                    reader.onerror = function(evt) {
                                        new NS.UI.Notification({
                                            type: 'error',
                                            title: "Reading error",
                                            message: 'An error was occure during reading file'
                                        });
                                    };

                                } else {
                                    new NS.UI.Notification({
                                        type: 'error',
                                        title: "File mime type error",
                                        message: 'You must choose only XML files'
                                    });
                                }
                            } else {
                                new NS.UI.Notification({
                                    type: 'error',
                                    title: "Reading error",
                                    message: 'Error durring XML loading ! '
                                });
                            }
                        }).removeClass('hide').css('width', '700px');
                    },
                    allowedRoles: ["reader"],
                    title: '<span class="fa fa-bars" data-i18n="nav.compare" data-key="show"></span>'
                })
            };
        }
    });

    return app.views;
});