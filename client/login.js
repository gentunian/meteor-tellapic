    Images = new FS.Collection("images", {
        stores: [new FS.Store.FileSystem("images", {path: "~/meteor-projects/tellapic/uploads"})]
    });

    Template.loggedin.events({

        "click #showCreateSessionDialog": function (e, tmpl) {
            bootbox.dialog({
                title: 'Share your thoughts...',
                message: '<div id="createSessionDialogWrapper"></div>',
                buttons: {
                    success: {
                        label: "Create",
                        className: "btn-success",
                        callback: function () {
                            
                        }
                    },
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function () {
                            Meteor.call('tellapicRemoveSession', Session.get('sessionId'));
                        }
                    }
                }
            });
            Blaze.render(Template.createSessionDialog, $("#createSessionDialogWrapper").get(0));
        },

        "click #logout": function (e, tmpl) {
            console.log('logout clicked');
            Meteor.logout(function (err) {
                console.log(err);
            });
        }

    });

    Template.createSessionDialog.onRendered(function () {
        console.log('[client]: createSessionDialog rendered');

        Meteor.call('tellapicCreateSession', function(error, result) {
            if (error) {
                console.log(error);
            } else {
                Session.set('sessionId', result);
            }
        });
    });

    Template.createSessionDialog.events({

        "change #myFile": FS.EventHandlers.insertFiles(Images, {
            metadata: function (fileObj) {
                return {
                    owner: Meteor.userId(),
                    sessionId: Session.get('sessionId'),
                };
            },
            after: function (error, fileObj) {
                console.log("Inserted", fileObj.name);
            }
        })

    });

    Template.createSessionDialog.helpers({

        images: function () {
            var sessionId = Session.get('sessionId');
            return (sessionId) ? Images.find({sessionId: sessionId, owner: Meteor.userId()}) : null;
        }
    });