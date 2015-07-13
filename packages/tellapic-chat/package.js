    Package.describe({
        name: 'gentunian:tellapic-chat',
        version: '0.0.1',
        // Brief, one-line summary of the package.
        summary: '',
        // URL to the Git repository containing the source code for this package.
        git: '',
        // By default, Meteor will default to using README.md for documentation.
        // To avoid submitting documentation, set this field to null.
        documentation: 'README.md'
    });

    Package.onUse(function(api) {
        api.use('templating', 'client');
        api.versionsFrom('1.1.0.2');
        api.addFiles(['main.js']);
        api.addFiles(['server/server.js', 'server/collections/publish.js'], 'server');
        api.addFiles([
            'client/collections/subscribe.js',
            'client/lib/TellapicChat.js',
            'client/tellapic-chat.html',
            'client/tellapic-chat.css',
            'client/tellapic-chat.js',
            ],
            'client'
            );
        api.use('mongo');
        api.export('tellapicChat');
    });

    Package.onTest(function(api) {
        api.use('tinytest');
        api.use('gentunian:tellapic-chat');
        api.imply('templating');
        api.addFiles('tellapic-chat-tests.js');
    });
