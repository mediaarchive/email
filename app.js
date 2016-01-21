/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */
var iconv = require('iconv-lite');
var fs = require('fs');
var path = require('path');

var temp_dir = path.normalize('temp/');
try {
    fs.mkdirSync(temp_dir);
}
catch(e) {
    console.log('temp dir already exist');
}

iconv.extendNodeEncodings();

global.config = require('./config.json');

var module = require('./module');

module.email.config = global.config.api.imap;
module.email.config.root_dir = 'temp/';
module.email.start();