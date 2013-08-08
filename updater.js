
var updater = {};
updater['id'] = updateId;
updater['version'] = updateVersion;
updater['name'] = updateName;
updater['icon'] = updateIcon;
updater['content'] = updateContent;
updater['type'] = updateType;
updater['mode'] = updateMode;
updater['description'] = updateDescription;
updater['site'] = updateSite;
updater['mail'] = updateMail;
updater['author'] = updateAuthor;
updater['license'] = updateLicense;
updater['engine'] = updateEngine;

// TODO: add validator

function updateId(doc, newId) {
    var node = doc.root();
    node.attr({id:newId});
};

function updateVersion(doc, newVersion) {
    var node = doc.root();
    node.attr({version:newId});
};

function updateName(doc, newName) {
    var node = doc.get('name');
    node.attr({short:newName});
    node.text(newName);
}

function updateIcon(doc, newIcon) {
    var node = doc.get('icon');
    if (node) {
        node.attr({src:newIcon});
    }
};

function updateContent(doc, newContentSrc) {
    var node = doc.get('content');
    if (node) {
        node.attr({src:newContentSrc});
    }
};

function updateType(doc, newType) {
    updatePreference(doc, 'type', newType);
};

function updateMode(doc, newMode) {
    updatePreference(doc, 'mode', newMode);
};

function updateEngine(doc, newEngine) {
    updatePreference(doc, 'engine', newEngine);
}

function updatePreference(doc, pref, newValue) {
    var node = findPreferenceWithAttr(doc, pref);
    if (node) {
        node.attr({value:newValue});
    }
};

function findPreferenceWithAttr(doc, includeAttr) {
    var preferences = doc.find('preference');
    for (var i = 0; i < preferences.length; i++) {
        var pref = preferences[i];
        if (pref.attr('name').value() === includeAttr) {
            return pref;
        }
    }

    return null;
};

function updateDescription(doc, newDescr) {
    var node = doc.get('description');
    if (node) {
        node.text(newDescr);
    }
};

function updateSite(doc, newSite) {
    var node = doc.get('author');
    if (node) {
        node.attr({href:newSite});
    }
};

function updateMail(doc, newMail) {
    var node = doc.get('author');
    if (node) {
        node.attr({email:newMail});
    }
};

function updateAuthor(doc, newAuthor) {
    var node = doc.get('author');
    if (node) {
        node.text(newAuthor);
    }
};

function updateLicense(doc, newLicense) {
    var node = doc.get('license');
    if (node) {
        node.text(newLicense);
    }
};

module.exports = updater;
