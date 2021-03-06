var MailParser = require("mailparser").MailParser;
var async = require('async');
var inbox = require("inbox");
var iconv = require('iconv-lite');

module.exports = {
    config: {
        port: '',
        host: '',
        user: '',
        pass: '',
        root_dir: ''
    },
    start: function(finish_callback){
        for (var key in this.config) {
            if (typeof this.config[key] !== 'undefined' && this.config[key] != '') {
                global.config[key] = this.config[key];
            }
        }
        
        var self = this;
        new Promise(function(resolve, reject) {
            var imap = inbox.createConnection(global.config.port, global.config.host, {
                secureConnection: true,
                auth:{
                    user: global.config.user,
                    pass: global.config.pass
                }
            });
            imap.connect();
            imap.on("connect", function(){
                console.log("Successfully connected to imap server");
            
                imap.openMailbox('INBOX', function(err, info){
                    imap.search({unseen: true}, true, function(err, emails){
                        async.eachSeries(emails, function (item, callback) { // iterator on UIDs of emails
                            console.log(emails, item);
                            var stream = imap.createMessageStream(item);
                            var string = '';
                            stream.on('data',function(buffer){
                                string += buffer;
                            });
            
                            stream.on('end',function(){
                                var mailparser = new MailParser();
            
                                mailparser.on("end", function(mail_object){
                                    global.sort.start(mail_object);

                                    imap.addFlags(item, ["\\Seen"], function(err, flags){
                                        if(err)
                                            console.error('error in setting flags of email', err);
                                    });
                                    
                                    callback();
                                });
                                
                                mailparser.write(string);
                                mailparser.end();
                                
                                console.log('processed');
                            });
                        }, function() { // done
                            console.log('finished');
                            if (typeof finish_callback !== 'undefined') 
                                finish_callback();
                            // @TODO: посылать в finish_callback информацию о письмах
                        });
                    }); // imap search
                }); // imap.openMailbox
            }); // imap connect
        }); // promise
    }
}