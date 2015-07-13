    Meteor.startup(function(){

        Meteor.publish('drawings', function () {
            return Drawings.find({});
        });

        Meteor.publish('images', function() {
            return Images.find({});
        });

        Meteor.publish('drawSessions', function() {
            return Images.find({});
        });

    });