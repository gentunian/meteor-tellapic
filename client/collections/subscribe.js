    
    Meteor.startup(function() {

        Tracker.autorun(function() {

            Meteor.subscribe('sessions', Session.get('sessionId'), function() {
                var session = Sessions.findOne({ _id: Session.get('sessionId') });
                tellapicChat.join(session.chatSessionId);
                //Session.set('chatSessionId', chatSessionId);
            });

        });

    });