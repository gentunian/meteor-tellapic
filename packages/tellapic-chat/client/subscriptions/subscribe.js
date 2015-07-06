
    Meteor.startup(function() {

        Meteor.subscribe('allUsernames');

        Tracker.autorun(function() {
            // Subscribes to chatMessages for reactive updates on messages.
            Meteor.subscribe('chatMessages', Session.get('chatSessionId'));

            // Subscribes to chatSessions for reactive updates on joined users.
            Meteor.subscribe('chatSessions', Session.get('chatSessionId'));
        });

    });