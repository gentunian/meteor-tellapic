var debug = true;

Meteor.startup(function(){

    /*
     * chatMessages collection;
     * { 
     *   "_id" : "8cpmLfpLFWZHYxQJj",
     *   "chatSessionId" : "YmP4bWbhcYtJzYarK",
     *   "message" : "testing",
     *   "createdAt" : "2015-07-05T22:30:20.001Z", 
     *   "receivedAt" : "2015-07-05T22:30:20.002Z",
     *   "userId" : "WH7rTwKhDtygkKtSf"
     * }
    */
    Meteor.publish('chatMessages', function (chatSessionId) {
        if (Match.test(chatSessionId, Match.OneOf(null, undefined))) return;

        if (this.userId) {
            if (debug) {
                var user = Meteor.users.findOne(this.userId);
                console.log('[server]: User ' + user.profile.name + ' subscribed to chatMessages: ' + chatSessionId);
            }
            return ChatMessages.find({ chatSessionId: chatSessionId });
        }
    });

    /*
     * chatSessions collection:
     * {
     *   "_id" : "irkHHg2SrBNysDw2A",
     *   "ownerId" : "WH7rTwKhDtygkKtSf",
     *   "created" : "2015-07-05T23:36:34.291Z",
     *   "users" : [ "WH7rTwKhDtygkKtSf" ]
     * }
     *
     */
    Meteor.publish('chatSessions', function (chatSessionId) {
        if (Match.test(chatSessionId, Match.OneOf(null, undefined))) return;

        if (this.userId) {
            if (debug) {
                var user = Meteor.users.findOne(this.userId);
                console.log('[server]: User ' + user.profile.name + ' subscribed to chatSession: ' + chatSessionId);
            }
            return ChatSessions.find({ _id: chatSessionId });
        }
    });

    /*
     * A collection of users only showing username and profile.name fields
    */
    Meteor.publish("allUsernames", function () {
        return Meteor.users.find({}, 
            {
                fields: {
                    "username": 1,
                    "profile.name": 1
                }
            });
    });

});