/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

var inbox = require("inbox");
var iconv = require('iconv-lite');
var async = require('async');
var fs = require('fs');
var MailParser = require("mailparser").MailParser;

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
        imap.search({unseen: true}, true, function(err, emails){

            async.eachSeries(emails, function (item, callback) { // iterator
                console.log(emails, item);
                var stream = imap.createMessageStream(item);
                var string = '';
                stream.on('data',function(buffer){
                    string += buffer;
                });

                stream.on('end',function(){
                    //fs.writeFile('temp/' + (new Date()).getTime() + '.tmp', string);

                    var mailparser = new MailParser();

                    mailparser.on("end", function(mail_object){
                        console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
                        console.log("Subject:", mail_object.subject); // Hello world!
                        console.log("Text body:", mail_object.text); // How are you today?
                        console.log(mail_object.attachments )
                    });

                    mailparser.write(string);
                    mailparser.end();

                    console.log('processed');
                    callback();
                });
            }, function() { // done

            });
        });
    });
});