/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */
var iconv = require('iconv-lite');
var path = require('path');
var fs = require('fs');

var YandexDisk = require('yandex-disk').YandexDisk;

var temp_dir = path.normalize('temp/');
try {
    fs.mkdirSync(temp_dir);
}
catch(e) {
    console.log('temp dir already exist');
}


iconv.extendNodeEncodings();

global.config = require('./config.json');

var email = require('./email');

email.config = global.config.api.imap;
email.start();

global.sort = require('./sort');
global.sort.root_dir = 'temp/';

