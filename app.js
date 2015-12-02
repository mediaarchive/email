/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

var inbox = require("inbox");
var iconv = require('iconv-lite');

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
        imap.search({header: ['subject', '']}, function(err, messages){
            console.log(messages);
        });
        //imap.listMessages(-100, function(err, messages){

        //console.log(messages[0]);
        //var stream = imap.createMessageStream(messages[0].UID);
        //var string = ''
        //stream.on('data',function(buffer){
        //    var part = buffer.toString('win1251');
        //    string += part;
        //});
        //
        //stream.on('end',function(){
        //    console.log('final output ' + string);
        //});
        //})
    })
});