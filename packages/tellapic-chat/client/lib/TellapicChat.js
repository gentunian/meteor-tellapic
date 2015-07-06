// This object acts as a helper and wraps meteor calls.
//
// The object is a client helper for creating, joining and posting
// chat messages.
TellapicChat = function () {
    var _debug = true;
    var _this = this;

    this.create = function () {

        // invokes 'tellapicCreateChat' on server. Invocation returns
        // a chat session id (in the 'result' callback argument). 
        // People should join this subscription with the chat id returned by this function.
        Meteor.call('tellapicCreateChat', function (error, result) {

            // shows the error in an alert box.
            if (error !== undefined) {
                alert(error.reason);

            } else {
                // save the id. This could be shared with people. (use Session?)
                _this.chatSessionId = result;

                Session.set('chatSessionId', result);

                if (_debug)
                    console.log('[client]: created chat ' + Session.get('chatSessionId'));

                // join the recently created chat.
                _this.join(Session.get('chatSessionId'));
            }
        });


    };

    this.join = function (chatSessionId) {

        // invokes 'tellapicJoinChat' on server. This creates a subscription
        // to the chat session passed as argument.
        Meteor.call('tellapicJoinChat', chatSessionId, function (error, result) {

            // shows the error in an alert box
            if (error !== undefined) {
                alert(error.reason);

            } else {
                // save the id. This is the current chat session. (use Session?)
                _this.chatSessionId = result;

                Session.set('chatSessionId', result);

                /*
                Meteor.subscribe('chatMessages', _this.chatSessionId);
                Meteor.subscribe('chatSessions', _this.chatSessionId);
                */

                if (_debug) 
                    console.log('[client]: joined chat ' + Session.get('chatSessionId'));
            }
        });
    };

    this.post = function (text) {

        // creates a message. 'chatSessionId' cannot be faked because is checked
        // in server side. Message won't be posted if message 'chatSessionId' 
        // does not match with your chat subscriptions. (see tellapicPostMessage method)
        // 'createdAt' is only a reference from client-side. Posted messages
        // has a 'receivedAt' parameter at server side. You can't fake
        // the date when this message was received.
        var m = {
            chatSessionId: Session.get('chatSessionId'),
            message: text,
            createdAt: (new Date()).toJSON()
        }

        // Invokes 'tellapicPostMessage' method on server with the message object
        Meteor.call('tellapicPostMessage', m, function(error, result) {
            if (error) {
                alert(error.reason);
            }
        });

        return true;
    };
}
