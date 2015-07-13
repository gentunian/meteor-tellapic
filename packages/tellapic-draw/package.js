    Package.describe({
        name: 'gentunian:tellapic-draw',
        version: '0.0.1',
        // Brief, one-line summary of the package.
        summary: '',
        // URL to the Git repository containing the source code for this package.
        git: '',
        // By default, Meteor will default to using README.md for documentation.
        // To avoid submitting documentation, set this field to null.
    });

    Package.onUse(function(api) {
        api.use('manuel:reactivearray', 'client');
        api.use('templating', 'client');
        api.versionsFrom('1.1.0.2');
        api.addFiles([
            'client/tellapic-draw.html',
            'client/tellapic-draw.js',
            ], 'client');
        api.use('mongo');
        api.export('ToolBox');
    });