module.exports = {
    config: {
        port: '',
        host: '',
        user: '',
        pass: ''
    },
    start: function(){
        var self = this;
        new Promise(function(resolve, reject) {
            var imap = inbox.createConnection(self.port, self.host, {
                secureConnection: true,
                auth:{
                    user: self.user,
                    pass: self.pass
                }
            });
            imap.connect();
            imap.on("connect", function(){
                console.log("Successfully connected to imap server");
            
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
                                    //console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
                                    //console.log("Subject:", mail_object.subject); // Hello world!
                                    //console.log("Text body:", mail_object.text); // How are you today?
                                    console.log(mail_object);
                                    
                                    var data = {
                                        authors: []
                                    };
                                    data.authors.push(mail_object.from[0]);
                                    
                                
                                    var dir = path.normalize('temp/' + md5(mail_object.messageId) + '/');
                                    try {
                                        fs.mkdirSync(dir);
                                    }
                                    catch(e) {
                                        console.log('message temp dir already exist');
                                    }
                                    
                                    console.log(dir);
                                    var data_path = path.normalize(dir + '/data.json');
                                    fs.writeFileSync(data_path, JSON.stringify(data));
                                    
                                    var txt_path = path.normalize(dir + '/text.txt');
                                    fs.writeFileSync(txt_path, mail_object.text);
                                    
                                    var photo_dir_created = false;
                                    var photo_dir_base_path = path.normalize(dir + '/фото/');
                                    var photo_dir_path = path.normalize(photo_dir_base_path + data.authors[0].name + '/');
                                    
                                    function create_photo_dir() {
                                        if (photo_dir_created === true) 
                                            return;
                                        
                                        photo_dir_created = true;
                                        fs.mkdirSync(photo_dir_base_path);
                                        fs.mkdirSync(photo_dir_path);
                                    }
                                    
                                    mail_object.attachments.forEach(function(attachment){
                                        var ext = path.extname(attachment.fileName).replace('.', '').toLowerCase();
                                        var file_dir = dir;
                                        
                                        switch (ext) {
                                            case 'jpg': case 'png': case 'gif':
                                                create_photo_dir();
                                                file_dir = photo_dir_path;
                                                break;
                                        }
                                        
                                        var file_path = path.normalize(file_dir + '/' + attachment.fileName);
                                        
                                        if (fs.existsSync(file_path)) {
                                            var file_name = path.basename(attachment.fileName) + ' (' + (new Date()).getTime() + ')';
                                            
                                            var file_path = path.normalize(file_dir + '/' + file_name + '.' + ext);
                                        }
                                        
                                        fs.writeFileSync(file_path, attachment.content);
                                    });
                                    
                                    callback();
                                });
                                
                                mailparser.write(string);
                                mailparser.end();
                                
                                console.log('processed');
                            });
                        }, function() { // done
                            
                        });
                    }); // imap search
                }); // imap.openMailbox
            }); // imap connect
        }); // promise
    }
}