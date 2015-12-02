/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

var inbox = require("inbox");
var iconv = require('iconv-lite');
var async = require('async');
var fs = require('fs');

iconv.extendNodeEncodings();

global.config = require('./config.json');

var imap = inbox.createConnection(global.config.api.imap.port, global.config.api.imap.host, {
    secureConnection: true,
    auth:{
        user: global.config.api.imap.user,
        pass: global.config.api.imap.pass
    }
});
imap.connect();
imap.on("connect", function(){
    console.log("Successfully connected to server");

    imap.openMailbox('INBOX', function(err, info){
        imap.search({unseen: true}, function(err, emails){

            async.eachSeries(emails, function (item, callback) { // iterator
                var stream = imap.createMessageStream(item);
                var string = '';
                stream.on('data',function(buffer){
                    string += buffer.toString('win1251');
                });

                stream.on('end',function(){
                    fs.writeFile('temp/' + (new Date()).getTime() + '.tmp', string);
                    console.log('processed');
                    callback();
                });
            }, function() { // done

            });
        });
    });
});