var fs = require('fs');
var libxmljs = require('libxmljs');
var updater = require('./updater.js');

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

var app_id = 'myappid';
var app_name = 'myxfaceapp';
var app_version = '1.0.0';
var app_type = 'xapp';
var app_icon = 'icon.png';
var app_content = 'index.html';
var app_mode = 'local';
var app_remote = 'http://itunes.apple.com/cn/app/appname/appid?mt=8';
var app_description = 'A sample widget to demonstrate some of the possibilities.';
var app_author = 'PolyVi';
var app_site = 'http://polyvi.com/';
var app_mail = 'foo-bar@polyvi.com';
var app_license = 'Copyright 2012-2013, Polyvi Inc.';
var app_xml_path = './app.xml';

app_xml_path = (typeof argv.file != 'undefined') ? argv.file : app_xml_path;

if (argv.create) {
    // create app.xml with template
    create(app_xml_path);
} else if (argv.update) {
    update(app_xml_path);
};

function update(appxml) {
    fs.readFile(appxml, 'utf8', function(err, data) {

        if (err) throw err;

        var doc = libxmljs.parseXml(data);

        for (var property in argv) {
            var value = argv[property];
            if (typeof(updater[property]) === 'function') {
                updater[property](doc, argv[property]);
            }
        }

        write(doc, app_xml_path);
    });
};

function create(app_xml_path) {
    app_id = (typeof argv.id != 'undefined') ? argv.id : app_id;
    app_name = (typeof argv.name != 'undefined') ? argv.name : app_name;
    app_version = (typeof argv.version != 'undefined') ? argv.version : app_version;
    app_type = (typeof argv.type != 'undefined') ? argv.type : app_type;
    app_icon = (typeof argv.icon != 'undefined') ? argv.icon : app_icon;
    app_content = (typeof argv.content != 'undefined') ? argv.content : app_content;
    app_mode = (typeof argv.mode != 'undefined') ? argv.mode : app_mode;
    app_remote = (typeof argv.remote != 'undefined') ? argv.remote : app_remote;
    app_description = (typeof argv.description != 'undefined') ? argv.description : app_description;
    app_author = (typeof argv.author != 'undefined') ? argv.author : app_author;
    app_site = (typeof argv.site != 'undefined') ? argv.site : app_site;
    app_mail = (typeof argv.mail != 'undefined') ? argv.mail : app_mail;
    app_license = (typeof argv.license != 'undefined') ? argv.license : app_license;

    var doc = new libxmljs.Document();

    var root = doc.node('widget').attr({id:app_id, version:app_version});
    root.node('name', app_name).attr({short:app_name});
    root.node('icon').attr({src:app_icon});
    root.node('content').attr({src:app_content, encoding:'UTF-8'});
    root.node('preference').attr({name:'type', value:app_type, readonly:'true'});

    if ('xapp' === app_type) {
        root.node('preference').attr({name:'mode', value:app_mode, readonly:'true'})
    }

    if ('napp' === app_type) {
        root.node('preference').attr({name:'remote-pkg', value:app_remote, readonly:'true'})
    }

    root.node('description', app_description);
    root.node('author', app_author).attr({href:app_site, email:app_mail});
    root.node('license', app_license);

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
