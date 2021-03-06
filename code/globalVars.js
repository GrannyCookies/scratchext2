// variables and functions for use with extensions
var scratchext = {
    username: Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
    creator: Scratch.INIT_DATA.PROJECT.model.creator,
    author: Scratch.INIT_DATA.LOGGED_IN_USER.model.username === Scratch.INIT_DATA.PROJECT.model.creator,
    installed: [],
    isShared: Scratch.FlashApp.model.attributes.isPublished,
    id: Scratch.INIT_DATA.PROJECT.model.id,
    libraries: {},
    root: 'http://scratchextproxy.x10.mx/?p=',
    
    css_root: 'http://scratchextproxy.x10.mx/?mime=text/css&p=',
    
    banner: {},
    settingsOpen: false
};

$.getScript(scratchext.root + 'font.js');

String.prototype.replaceAll = function(find, replace) {
	return this.toString().replace(new RegExp(find, 'g'), replace);
};

scratchext.getWiki = function(lib) {
    return 'http://grannycookies.github.io/scratchext2/help/' + lib + '/';
};

// disabled because of error :(
scratchext.projectJSON = function(id, callback) {
    /*$.get("http://scratch.mit.edu/internalapi/project/"+id.toString()+"/get/", function(data) {
        callback(data);
    });*/
    callback(false);
}

scratchext.projectJSON(scratchext.id, function(data) {
    try {
        scratchext.projectExtensions = data.info.savedExtensions.map(function(e){return e.extensionName}); //This tells which extensions were installed at the moment the project was last saved
    } catch(e) {
        scratchext.projectExtensions = []; //In case the project doesn't use any extensions.
    }
});

scratchext.editMode = function() {
    return Scratch.FlashApp.isEditMode;
};

scratchext.notes = function() {
    var notes;
    if(scratchext.username === scratchext.creator) {
        // the current user made this project
        notes = $('textarea[name=description]').text().replace(/\s/g, "").toUpperCase();
    } else {
        // project was not shared by the current user
        notes = $('.overview:eq(1)').text().replace(/\s/g, "").toUpperCase();
    }

    return notes;
};

scratchext.install = function(name, descriptor, extension) {
	scratchext.installed.push(name);
	scratchext.log('Installed extension "'+name+'"!');
	ScratchExtensions.register(name, descriptor, extension);
};

scratchext.log = function(string, color) {
    if(color===undefined)
        color = '#4A9EE2';

    // filter out MSU etc to only allow "debug" to be shown in js console
    console.debug('%c[%cScratchExt%c] %c'+string, 'color: white;', 'color: #986fe6;', 'color: white;', 'color: '+color+';');
}

scratchext.addCSS = function(url) {
    var link = window.document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    document.getElementsByTagName("HEAD")[0].appendChild(link);
};

// show/hide scratchext editor button if in editor or not
scratchext.editShow = function() {
    if(scratchext.editMode()) {
        $('.editorOnly').show();
        $('.playerOnly').hide();
    } else {
        $('.editorOnly').hide();
        $('.playerOnly').show();
    }
    
    setTimeout(scratchext.editShow, 100);
};

scratchext.editShow();

// insert in arrays using scratch-like way
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

// tell other file that scratchext has loaded
go();
