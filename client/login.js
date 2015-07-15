    var createdSessionDefaults = {
        sessionName: 'Click to change title',
        sessionDescription: 'Click to change description',
        ownerId: Meteor.userId(),
        createdAt: moment().format('LL'),
        editingName: false,
        editingDescription: false,
        sessionNameClass: 'session-data-placeholder',
        sessionDescriptionClass: 'session-data-placeholder'
    };
    createdSessionDefaults = Object.freeze(createdSessionDefaults);

    Template.registerHelper('SessionGet', function (key) {
        return Session.get(key);
    });

    Template.sessionDialog.onRendered(function() {
        $('#myModal').on('hidden.bs.modal', function (e) {
            Blaze.remove(Blaze.getView($('#myModal').get(0)));
        })
    });

    Template.loggedin.events({

        "click #showCreateSessionDialog": function (e, tmpl) {
            Blaze.renderWithData(Template.sessionDialog, 
                {
                    dialogTitle: 'Create Session',
                    primaryButtonText: 'Create',
                    createSession: true,
                },
                $('body').get(0)
                );
        },

        "click #showJoinSessionDialog": function (e, tmpl) {
            Blaze.renderWithData(Template.sessionDialog,
                {
                    dialogTitle: 'Join Session',
                    primaryButtonText: 'Join',
                    createSession: false,
                },
                $('body').get(0)
                );
        },

        "click #logout": function (e, tmpl) {
            Meteor.logout(function (err) {
                console.log(err);
            });
        }

    });

    Template.sessionDialog.events({

        "click ul > li[role=presentation] > a": function (e, tmpl) {
            $('.modal-footer > button[data-bb-handler="success"]').html(e.target.innerText);
        },

        "change #myFile": function (e, tmpl) {
            // Do nothing if no files were selected
            if (e.target.files.length == 0)
                return;

            // Creates a FileReader (HTML 5)
            var fr = new FileReader();

            // Creates an <img> node element
            var img = new Image();

            // When the FileReader is loaded with data
            // pass the file data into the <img> 'src' attribute.
            // e.g: <img src=e.target.result>
            fr.onload = function (e) {
                console.log('FileReader loaded');
                img.src = e.target.result;
            };

            // When the img.src attribute is set, get the
            // image dimensions.
            img.onload = function (e) {
                console.log('[client]: img loaded ' + img.width + 'x' + img.height);
                var fsFile = new FS.File(fr.result);
                FS.Utility.extend(fsFile, {
                    width: img.width,
                    height: img.height
                });
                var image = Images.insert(fsFile, function (error, result) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(result);
                    }
                });
                Session.set('uploading_image_ID', image._id);
            }

            // feeds the FileReader object with data.
            fr.readAsDataURL(e.target.files[0]);
        }
    });

    Template.sessionDialog.helpers({

        disablePrimaryButton: function () {
            return Session.get('createdSession') === undefined || Session.get('createdSession').sessionName === undefined;
        },

        uploadingImages: function () {
            console.log('[client]: Template.createSessionDialog.helpers["uploadingImages"] invoked');
            var imageId = Session.get('uploading_image_ID');
            return (imageId) ? Images.find({ _id: imageId }) : null;
        },
        images: function () {
            console.log('[client]: Template.createSessionDialog.helpers["images"] invoked');

        },

        createdSession: function () {
            // use defaults values. Only overrides values that are set in current session
            return _.extend(_.clone(createdSessionDefaults), Session.get('createdSession'));
        }

    });

    Template.sessionData.helpers({
        todayDate: function () {
            return moment().format('LL');
        },

        getUsernameById: function(id) {
            var u = Meteor.users.findOne(id);
            if (u) {
                if (u.username) {
                    return u.username;
                } else {
                    return u.profile.name;
                }
            }
            return u;
        },

    });

    Template.sessionData.events({

        // When the Session name input field gets keyboard input
        "keypress h4.media-heading > input": function (e, tmpl) {
            if (e.keyCode == 13) {
                $(e.target).blur();
            }
        },

        // When the Session name input field lost focus
        "blur h4.media-heading > input": function (e, tmpl) {
            var session = Session.get('createdSession') || {};
            session.editingName = false;
            if (e.target.value != '' && e.target.value != createdSessionDefaults.sessionName) {
                session.sessionName = e.target.value
                session.sessionNameClass = '';
            }
            Session.set('createdSession', session);
        },

        // When the Session name input field gain focus
        "focus h4.media-heading > input": function (e, tmpl) {
            $(e.target).select();
        },

        // When the Session name title gets clicked
        "click h4.media-heading > span": function (e, tmpl) {
            var session = Session.get('createdSession') || {};
            session.editingName = true;
            Session.set('createdSession', session);
        },

        "blur .media-body > textarea": function (e, tmpl) {
            var session = Session.get('createdSession') || {};
            session.editingDescription = false;
            if (e.target.value != '' && e.target.value != createdSessionDefaults.sessionDescription) {
                session.sessionDescription = e.target.value
                session.sessionDescriptionClass = '';
            }
            Session.set('createdSession', session);
        },

        "focus .media-body > textarea": function (e, tmpl) {
            $(e.target).select();
        },

        "click .media-body > p:first": function (e, tmpl) {
            var session = Session.get('createdSession') || {};
            session.editingDescription = true;
            Session.set('createdSession', session);
        }
    });

    Template.availableSessions.helpers({
        availableSessions: function (e, tmpl) {
            return Session.get('availableSessions');
        }
    });
