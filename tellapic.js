    Drawings = new Mongo.Collection('drawings');
    Sessions = new Mongo.Collection('sessions');
    
    if (Meteor.isClient) {
        
        function Class() { }
        Class.prototype.construct = function() {};
        Class.extend = function(def) {
            var classDef = function() {
                if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
            };

            var proto = new this(Class);
            var superClass = this.prototype;

            for (var n in def) {
                var item = def[n];
                if (item instanceof Function) item.$ = superClass;
                proto[n] = item;
            }

            classDef.prototype = proto;

            classDef.extend = this.extend;
            return classDef;
        };

        var DrawingTool = Class.extend({

            id: null,
            name: null,
            paper: null,
            element: null,
            startX: -1,
            startY: -1,
            icon: '',
            using: false,

            construct: function(paper, name, icon) {
                this.id = name.replace(/ /g, '');
                this.paper = paper;
                this.name = name;
                this.icon = icon;
            },

            begin: function(ev) {
                this.using = true;
                this.startX = ev.offsetX;
                this.startY = ev.offsetY;
                console.log('DrawingTool.begin() using is ' + this.isUsing());
            },

            end: function(ev) {
                this.using = false;
                console.log('DrawingTool.end() using is ' + this.isUsing());
            },

            move: function(ev) {
            },

            isUsing: function() {
                return this.using;
            },

            wrapElement: function(type, id) {
                var a = _.clone(this.element.attrs);
                a.type = type;
                a.id = ''+id;
                return a;
            },
        });

        var DrawingToolCircle = DrawingTool.extend({

            construct: function(paper) {
                arguments.callee.$.construct(paper, 'Circle', 'fa-circle-o');
            },

            begin: function(ev) {
                arguments.callee.$.begin(ev);
                console.log('DrawingToolCircle.begin()' + this.isUsing());
                this.element = this.paper.circle(this.startX, this.startY, 0);
                return this.wrapElement('circle', this.element.id);
            },

            move: function(ev) {
                arguments.callee.$.move(ev);
                if (this.isUsing()) {
                    var d = Math.sqrt(Math.pow((ev.offsetY - this.startY), 2) + Math.pow((ev.offsetX - this.startX), 2));
                    this.element.attr({
                      r: d/2,
                      cx: this.startX + d/2,
                      cy: this.startY + d/2
                  });
                    return this.wrapElement('circle', this.element.id);
                } else {
                    this.element = null;
                }
            },

            end: function(ev) {
                arguments.callee.$.end(ev);
                console.log('DrawingToolCircle.end()' + this.isUsing());
                if (this.element) {
                    return this.wrapElement('circle', this.element.id);
                }

            },
        });

        ToolBox = {

            // this will hold the current tool index
            current: null,

            // ReactiveArray in order to update template properly
            tools: new ReactiveArray(),

            // Sets the current tool based on name
            setTool: function (name) {
                for(var i = 0; i < this.tools.length; i++) {
                    if (this.tools[i].name === name) this.current = i;
                }
            }
        };

        Accounts.ui.config({
            passwordSignupFields: 'USERNAME_ONLY'
        });

        Template.tellapicNavBarToolsItem.helpers({

            // Returns the available tools (ToolBox.tools is a ReactiveArray)
            drawingTools: function() {
                return ToolBox.tools.list();
            }
        });

        Template.tellapicNavBarToolsItem.events({

            // Selects the current tool to use when the
            // tool is clicked
            "click a": function (e, tmpl) {
                tmpl.$('li').removeClass('active');
                $(e.target).parent().addClass('active');
                ToolBox.setTool(e.target.id);
            }

        });

        Template.drawingArea.events({

            // When the mouse button is pressed in the canvas wrapper
            // pass the event to the currently selected tool.
            // If an element is returned, adds it to 'drawings' with
            // the user id (the element belongs to this user)
            "mousedown #drawingArea": function (e, tmpl) {
                var element = ToolBox.tools[ToolBox.current].begin(e);
                if (element) {
                    element._id = element.id;
                    element.owner = Meteor.userId();
                    Drawings.insert(element);
                }
            },

            // When mouse is moved inside the canvas wrapper
            // pass the event to the currently selected tool.
            // If an element is returned, update it.
            "mousemove #drawingArea": function (e, tmpl) {
                if (ToolBox.current === null || ToolBox.current === undefined) return;
                var element = ToolBox.tools[ToolBox.current].move(e);
                if (element) {
                    Drawings.update({_id: element.id}, {$set: element});
                }
            },

            "mouseup #drawingArea": function (e, tmpl) {
                var element = ToolBox.tools[ToolBox.current].end(e);
            },

            "mousewheel #drawingArea": function (e, tmpl) {
                console.log(e);
            },

        });

        Template.drawingArea.onRendered(function () {
            // Creates the paper after the template was rendered
            var paper = Raphael('drawingArea', $('body').width(), $('#drawingArea').height());

            // Hold a reference to paper (remove??)
            ToolBox.paper = paper;

            // Creates a circle drawing tool and adds it to the toolbox
            // Each tool in ToolBox will be rendered in the HTML tools selector.
            ToolBox.tools.push(new DrawingToolCircle(paper));

            // Sets the callbacks for the drawings collection
            Drawings.find({}).observeChanges({

                // When a document is added to 'drawings' it can be
                // a local document already in 'paper'. Add the item
                // if it's not already in 'paper'.
                added: function (id, fields) {
                    console.log('added: '+id);
                    if (paper.getById(id) == null) {
                        paper.add([fields]);
                    }
                },

                // When a document gets updated, an element needs
                // to be updated if it's not the local element (TODO).
                changed: function (id, fields) {
                    console.log('changed: ' + id);
                    var el = paper.getById(id);
                    if (el) {
                        el.attr(fields);
                    }
                },

                // The element needs to be removed from the 'paper'.
                removed: function (id, doc) {
                    console.log('removed: ' + id);
                    var el = paper.getById(id);
                    if (el) {
                        el.remove();
                    }
                }
            });
        });

        Template.header.events({
            "focus #cmd": function (e, tmpl) {

            }
        });

        Template.tellapicNavBarChatItem.events({
            "click a": function (e, tmpl) {
                $('#wrapper').toggleClass('toggled');
            }
        });

        Template.tellapicNavBarCmdItem.events({

            "keyup input": function (e, tmpl) {
                var text = e.currentTarget.value;
                if (e.which == 13) {
                    if (tellapicChat.post(text)) {
                        $(e.currentTarget).val('');
                    }
                } else {

                }
            }

        });

        Accounts.onLogin(function () {
            sAlert.success('<b>Welcome, '+ Meteor.user().profile.name + '!</b>');
        });

        Meteor.startup(function () {
            sAlert.config({
                effect: 'slide',
                position: 'bottom-right',
                timeout: 5000,
                html: true,
                stack: true,
                offset: 0
            });

            Meteor.subscribe('drawings');
            Meteor.subscribe('images');
        });

    }

    if (Meteor.isServer) {
        Images = new FS.Collection("images", {
            stores: [new FS.Store.FileSystem("images", {path: "~/meteor-projects/tellapic/uploads"})]
        });

        Meteor.startup(function () {
            // code to run on server at startup

            Meteor.publish('drawings', function () {
                //return Drawings.find({sessionId: sessionId}, {fields: {'sessionId': 0}});
                return Drawings.find({});
            });

            Meteor.publish('images', function() {
                return Images.find({});
            });

            // TODO: add security session based
            Drawings.allow({
                insert: function(){return true;},
                update: function(){return true;},
                remove: function(){return true;},
            });
            // TODO: add security session based
            Images.allow({
                insert: function(){return true;},
                update: function(){return true;},
                remove: function(){return true;},
                download:function(){return true;}
            });
        });
    }
