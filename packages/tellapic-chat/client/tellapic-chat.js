    var chatSimulation = 0;

    tellapicChat = new TellapicChat();

    Template.chatButton.events({

        "click #createChat": function(event) {
            tellapicChat.create();
        },

        "click #joinChat": function(event) {
            tellapicChat.join($('#chatSessionId').val());
        },


    });

    if (tellapicChat.debug) {
        Template.chatButton.events({
            "click #simulateChat": function(event) {
                var elem = $(event.target);
                if (elem.hasClass('simulate')) {
                    chatSimulation = window.setInterval(function(){
                        tellapicChat.post(Fake.sentence());
                    }, 2000);
                    elem.html('Stop');
                } else {
                    window.clearInterval(chatSimulation);
                    elem.html('Simulate');
                }
                elem.toggleClass('simulate');
            },
        });
    }

    Template.tellapicChatMessageHistory.helpers({

        messages: function(){
            console.log('[client]: messages helper invoked');
            return ChatMessages.find({}, {sort: {receivedAt:1}});
        }
    });

    Template.tellapicChatMessage.helpers({

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

        getMessageTime: function (t) {
            var n = moment(new Date());
            var m = moment(t);
            var today = m.clone().startOf('day').isSame(n);
            if (today) {
                return m.format('HH:mm');
            } else {
                return m.format('dddd HH:mm');
            }
        },
    });

    Template.tellapicChat.events({

        "keypress input": function(e, template) {
            if (e.charCode == 13) {
                e.stopPropagation();
                tellapicChat.post($(e.target).val());
                $(e.target).val('');
                return false;
            }
        },
    });

    Meteor.subscribe('allUsernames');