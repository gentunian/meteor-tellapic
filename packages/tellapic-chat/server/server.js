var debug = true;

Meteor.methods({

    tellapicJoinChat: function (chatSessionId) {
        // The user must be logged
        if (this.userId === null) {
            throw new Meteor.Error('not-logged', 'Not logged users cannot join chatrooms.');
        } else {
            // 'users' field is updated with the user joining the channel.
            var result = ChatSessions.update({ _id: chatSessionId }, { $addToSet: { users: this.userId }});

            // if result is 0 then no chat session was found.
            if (result === 0) {
                throw new Meteor.Error('chat-not-found', 'Chat session \'' + chatSessionId + '\' not found');
            } else {

                if (debug) {
                    console.log('[server]: User ' + this.userId + ' joined chat session ' + chatSessionId);
                }

                return chatSessionId;
            }
        }
    },

    tellapicCreateChat: function () {
        // The user must be logged
        if (this.userId === null) {
            throw new Meteor.Error('not-logged', 'Not logged users cannot create chatrooms.');
        } else {

            // We register the user that created the chat session.
            // We use 'users' field for a list of users that will join 
            // to the chat session. This will allow us to validate
            // messages sent by users to chat sessions.
            // Users that aren't in 'users' list cannot send messages to
            // this session.
            var chatSessionId = ChatSessions.insert({
                ownerId: this.userId,
                created: (new Date()).toJSON(),
                users: [],
            });

            if (debug) {
                console.log('[server]: User ' + this.userId + ' created chat session ' + chatSessionId);
            }

            return chatSessionId;
        }
    },

    tellapicPostMessage: function (msg) {
        // The user must be logged
        if (this.userId === null) {
            throw new Meteor.Error('User id is null.');
        } else {
            // Checks that fields have the correct type.
            check(msg, Match.ObjectIncluding({ text: String, chatSessionId: String, createdAt: Date }));

            // Verify if the user is joined into the chat session he wants to post.
            var q = ChatSessions.find({ _id: msg.chatSessionId, users: { $in: [this.userId] }});

            // If count() > 0 then the user Meteor.userId() is indeed joined in
            // chat session msg.chatSessionId. The reason why we implement this
            // is to avoid faking the chat session by the client. So, posted
            // messages from a user to a chat session must come from joined user
            // into the session they want to post.
            if (q.count() > 0) {

                // Don't reject messages with rare fields. If the above check have passed,
                // 'text' and 'chatSessionId' have the correct type.
                var wrappedMsg = {
                    text: msg.text,
                    chatSessionId: msg.chatSessionId,
                    receivedAt: (new Date()).toJSON(),
                    userId: this.userId
                };

                return ChatMessages.insert(wrappedMsg);

            } else {
                throw new Meteor.Error('not-joined-to-that-session', 'User attempted to post a message into a session he is not joined');
            }
        }
    },

    tellapicRemoveChat: function (chatSessionId) {
        // The user must be logged
        if (Meteor.userId() === null) {
            throw new Meteor.Error('not-logged', 'Not logged users cannot delete chat sessions.');
        } else {
            
            if ( ChatSessions.remove({ ownerId: Meteor.userId(), _id: chatSessionId }) > 0 ) {
                ChatMessages.remove({ _id: chatSessionId });
            }
        }
    }
});

