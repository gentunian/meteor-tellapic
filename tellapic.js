    Drawings = new Mongo.Collection('drawings');
    Sessions = new Mongo.Collection('sessions');

    if (Meteor.isClient) {
        // WTF?
        Template.registerHelper('Session', function(key) { return Session.get(key); });

        Images = new FS.Collection("images", {
            filter: {
                allow: {
                    contentTypes: ['image/*']
                }
            },
            stores: [ new FS.Store.FileSystem("images", {
                path: "~/meteor-projects/tellapic/uploads",
            })
            ]
        });

        Accounts.ui.config({
            passwordSignupFields: 'USERNAME_ONLY'
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
                position: 'top-right',
                timeout: 5000,
                html: true,
                stack: true,
                offset: 20
            });

        });

    }

    if (Meteor.isServer) {
        
        Images = new FS.Collection("images", {
            filter: {
                allow: {
                    contentTypes: ['image/*']
                }
            },
            stores: [ new FS.Store.FileSystem("images", {
                path: "~/meteor-projects/tellapic/uploads",
            })
            ]
        });

        Meteor.startup(function () {

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
