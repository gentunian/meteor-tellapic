var debug = true;

Meteor.methods({

    tellapicJoinSession: function (sessionId) {
        // The user must be logged
        if (Meteor.userId() === null) {
            throw new Meteor.Error('not-logged', 'Not logged users cannot join sessions.');
        } else {
            // 'users' field is updated with the user joining the channel
            var result = Sessions.update({ _id: sessionId }, { $addToSet: { users: Meteor.userId() }});

            // if result is 0 then no chat was found
            if (result === 0) {
                throw new Meteor.Error('session-not-found', 'Session \'' + sessionId + '\' not found');
            } else {

                if (debug) {
                    console.log('[server]: User ' + this.userId + ' created chat session ' + sessionId);
                }

                return sessionId;
            }
        }
    },

    tellapicCreateSession: function () {
        // The user must be logged
        if (Meteor.userId() === null) {
            throw new Meteor.Error('not-logged', 'Not logged users cannot create sessions.');
        } else {

            // create a chat session
            var chatSessionId = Meteor.call('tellapicCreateChat');

            var session = Sessions.insert({
                ownerId: Meteor.userId(),
                chatSessionId: chatSessionId,
                created: (new Date()).toJSON(),
                users: [],
            });

            if (debug) {
                console.log('[server]: User ' + this.userId + ' created session ' + session);
            }

            return session;
        }
    },

    tellapicRemoveSession: function (sessionId) {
        // The user must be logged
        if (Meteor.userId() === null) {
            throw new Meteor.Error('not-logged', 'Not logged users cannot delete sessions.');
        } else {

            // Retrieves chat session id prior to removal.
            var query = Sessions.findOne({ ownerId: Meteor.userId(), _id: sessionId });

            if (query) {
                Meteor.call('tellapicRemoveChat', query.chatSessionId);
            }

            Sessions.remove({ _id: sessionId, ownerId: Meteor.userId() });
        }
    }

});
