    
    Meteor.startup(function() {

        Tracker.autorun(function() {

            Meteor.subscribe('sessions', Session.get('sessionId'), function() {
                var chatSessionId = Sessions.findOne({ _id: Session.get('sessionId') }).chatSessionId;
                tellapicChat.join(chatSessionId);
                Session.set('chatSessionId', chatSessionId);
            });

        });

    });