#! /usr/bin/env node

var fs = require('fs');
var libxmljs = require('libxmljs');
var updater = require('./updater.js');
var creator = require('./creator.js')

var argv = require('optimist')
    .options('i', {
        alias: 'id',
        describe: 'unique app id',
    })
    .options('n', {
        alias: 'name',
        describe: 'app name',
    })
    .options('t', {
        alias: 'type',
        describe: 'app type, xapp or napp',
    })
    .options('v', {
        alias: 'version',
        describe: 'version of app',
    })
    .options('c', {
        alias: 'create',
        describe: 'create a new app.xml',
    })
    .options('icon', {
        alias: 'icon',
        describe: 'path to app icon',
    })
    .options('content', {
        alias: 'content',
        describe: 'path to index.html',
    })
    .options('m', {
        alias: 'mode',
        describe: 'running mode for xapp, local or online',
    })
    .options('r', {
        alias: 'remote',
        describe: 'remote url for napp',
    })
    .options('d', {
        alias: 'description',
        describe: 'brief description for your app',
    })
    .options('a', {
        alias: 'author',
        describe: 'author',
    })
    .options('s', {
        alias: 'site',
        describe: 'site of author or app',
    })
    .options('mail', {
        alias: 'mail',
        describe: 'mail of author or publisher',
    })
    .options('l', {
        alias: 'license',
        describe: 'license claim',
    })
    .options('u', {
        alias: 'update',
        describe: 'update configuration',
    })
    .options('f', {
        alias: 'file',
        describe: 'path to app.xml',
    })
    .usage('Generate template for app.xml: $0')
    .argv;

var app_xml_path = './app.xml';

app_xml_path = (typeof argv.file != 'undefined') ? argv.file : app_xml_path;

if (argv.create) {
    // create app.xml with template
    creator(createDoc);
} else if (argv.update) {
    update(app_xml_path);
};

function update(appxml) {
    fs.readFile(appxml, 'utf8', function(err, data) {

        if (err) throw err;

        var doc = libxmljs.parseXml(data);

        console.dir(argv);
        for (var property in argv) {
            var value = argv[property];
            if (typeof(updater[property]) === 'function') {
                updater[property](doc, argv[property]);
            }
        }

        write(doc, app_xml_path);
    });
};

function createDoc(config) {
    console.dir(config);

    var doc = new libxmljs.Document();

    var root = doc.node('widget').attr({id:config.id, version:config.version});
    root.node('name', config.name).attr({short:config.name});
    root.node('icon').attr({src:config.icon});
    root.node('content').attr({src:config.content, encoding:'UTF-8'});
    root.node('preference').attr({name:'type', value:config.type, readonly:'true'});

    if (typeof(config.mode) != 'undefined') {
        root.node('preference').attr({name:'mode', value:config.mode, readonly:'true'})
    }

    if (typeof(config.remote) != 'undefined') {
        root.node('preference').attr({name:'remote-pkg', value:config.remote, readonly:'true'})
    }

    root.node('description', config.description);
    root.node('author', config.author).attr({href:config.site, email:config.mail});
    root.node('license', config.license);

    write(doc, app_xml_path);
};

function write(doc, path) {
    fs.writeFile(path, doc.toString(), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(path + ' was successfully saved!');
        }
    })
};
