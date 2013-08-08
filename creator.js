var prompt = require('prompt');

var schema = {
    properties: {
        id: {
            message: 'id must be unique and only letters, numbers, or underscore. NO spaces!',
            required: true,
            pattern: /^[0-9A-Za-z_]+$/,
        },
        version: {
            default: '1.0.0',
            pattern: /^[0-9.]+$/,
        },
        name: {
            default: 'myxfaceapp',
            pattern: /^[0-9A-Za-z_]+$/,
            message: 'name must be only letters, numbers, or underscore. NO spaces!',
        },
        icon: {
            default: 'icon.png',
        },
        content: {
            default: 'index.html',
            required: true,
        },
        type: {
            default: 'xapp',
            message: 'type MUST be xapp or napp',
            conform: function (value) {
                if ('xapp' === value || 'napp' === value) {
                    return true;
                }

                return false;
            }
        },
        description: {
            default: 'A sample xface app to demonstrate some of the possibilities.',
        },
        author: {
            default: 'PolyVi Inc.',
        },
        site: {
            default: 'http://polyvi.com/',
        },
        mail: {
            default: 'foo-bar@polyvi.com',
        },
        license: {
            default: 'Copyright 2012-2013, Polyvi Inc.',
        },
        engine: {
            default: '3.1.0',
            pattern: /^[3-9].[1-9].[\d]+$/,
        }
    }
};

var propMode = {
    properties: {
        mode: {
            default: 'local',
            message: 'mode MUST be local or online',
            conform: function (value) {
                if ('local' === value || 'online' === value) {
                    return true;
                }

                return false;
            }
        },
    },
};

var config = {};

var create = function(configHandler) {
    prompt.start();

    prompt.get(schema, function (err, result) {
        if (err) throw err;

        config = result;
        if ('xapp' === config.type) {
            prompt.addProperties(config, [propMode], function (err) {
                configHandler(config);
            });
        }

        if ('napp' === config.type) {
            prompt.addProperties(config, ['remote-pkg'], function (err) {
                configHandler(config);
            });
        }
    });
};

module.exports = create;
