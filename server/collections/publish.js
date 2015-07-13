    Meteor.startup(function(){

        Meteor.publish('sessions', function (sessionId) {
            if (Match.test(sessionId, Match.OneOf(null, undefined))) return;

            if (this.userId) {
                var user = Meteor.users.findOne(this.userId);
                console.log('[server]: User ' + user.profile.name + ' subscribed to session: ' + sessionId);
                return Sessions.find({ _id: sessionId });
            }
        });

    });