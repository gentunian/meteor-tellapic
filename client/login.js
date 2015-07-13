
    Template.loggedin.events({

        "click #showCreateSessionDialog": function (e, tmpl) {
            bootbox.dialog({
                title: '',
                message: '<div id="createSessionDialogWrapper"></div>',
                buttons: {
                    success: {
                        label: "Create",
                        className: "btn-success",
                        callback: function () {  }
                    },
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function () {  }
                    }
                },
                closeButton: false,
            });
            Blaze.render(Template.createSessionDialog, $("#createSessionDialogWrapper").get(0));
        },

        "click #showJoinSessionDialog": function (e, tmpl) {
            bootbox.dialog({
                title: '',
                message: '<div id="joinSessionDialogWrapper" style="overflow:auto; height:450px; padding: 15px;"></div>',
                buttons: {
                    success: {
                        label: "Create",
                        className: "btn-success",
                        callback: function () {}
                    },
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function () { }
                    }
                },
                closeButton: false,
            });
            Blaze.render(Template.joinSessionDialog, $("#joinSessionDialogWrapper").get(0));
        },

        "click #logout": function (e, tmpl) {
            console.log('logout clicked');
            Meteor.logout(function (err) {
                console.log(err);
            });
        }

    });

    Template.createSessionDialog.onRendered(function () {

        Meteor.call('tellapicCreateSession', function(error, result) {
            if (error) {
                console.log(error);
            } else {
             //   Session.set('sessionId', result);
            }
        });

    });

    Template.createSessionDialog.events({
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

    Template.createSessionDialog.helpers({

        uploadingImages: function () {
            console.log('[client]: Template.createSessionDialog.helpers["uploadingImages"] invoked');
            var imageId = Session.get('uploading_image_ID');
            return (imageId) ? Images.find({ _id: imageId }) : null;
        },
        images: function () {
            console.log('[client]: Template.createSessionDialog.helpers["images"] invoked');

        }

    });

    Template.registerHelper('session', function (key) {
            return Session.keys;
    });

    Template.sessionData.helpers({
        todayDate: function () {
            return moment().format('LL');
        },

    });

    Template.sessionData.events({
        "blur h4.media-heading > input": function (e, tmpl) {
            if (e.target.value) {
                tmpl.$('h4.media-heading > span').html(e.target.value);
            }
            tmpl.$('h4.media-heading > input, h4.media-heading > span').toggleClass('hidden');
        },
        "focus h4.media-heading > input": function (e, tmpl) {
            e.target.value = tmpl.$('h4.media-heading > span').val();
        },
        "keypress h4.media-heading > input": function (e, tmpl) {
            if (e.keyCode == 13) {
                $(e.target).blur();
            }
        },
        "click h4.media-heading > span": function (e, tmpl) {
            tmpl.$('h4.media-heading > input, h4.media-heading > span').toggleClass('hidden');
            tmpl.$('h4.media-heading > input').focus();
        },
        "blur .media-body > textarea": function (e, tmpl) {
            if (e.target.value) {
                tmpl.$('.media-body > p:first').html(e.target.value);
            }
            tmpl.$('.media-body > p:first, .media-body > textarea').toggleClass('hidden');
        },
        "focus .media-body > textarea": function (e, tmpl) {
            e.target.value = tmpl.$('.media-body > p:first').val();
        },
        "click .media-body > p:first": function (e, tmpl) {
            tmpl.$('.media-body > textarea, .media-body > p:first').toggleClass('hidden');
            tmpl.$('.media-body > textarea').focus();
        }
    });

    Template.joinSessionDialog.helpers({
        availableSessions: function (e, tnpl) {
            return Session.get('availableSessions');
        }
    });
