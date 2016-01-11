/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

var inbox = require("inbox");
var iconv = require('iconv-lite');
var async = require('async');
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var MailParser = require("mailparser").MailParser;
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

