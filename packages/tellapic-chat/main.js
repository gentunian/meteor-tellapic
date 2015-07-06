// Chat sessions:
// A chat session has an owner, a created date and a list of users id.
//
// The list of users is used to not only show the users that joined a session
// but also to validate messages inserted into 'chatMessages' collection.
//
// Messages are inserted into the collection by invoking 'tellapicPostMessage'
// from the server: Meteor.call('tellapicPostMessage', message). The server
// validates the user and verifies that the message being posted into the
// session belongs to a joined user. Messages posted into a session the user
// does not belong to are rejected.
//
ChatSessions = new Mongo.Collection('chatSessions');
ChatMessages = new Mongo.Collection('chatMessages');
