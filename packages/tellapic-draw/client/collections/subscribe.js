    Meteor.startup(function() {

        Meteor.subscribe('drawings');
        
        Meteor.subscribe('images');
    });