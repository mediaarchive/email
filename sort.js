var path = require('path');
var md5 = require('md5');
var moment = require('moment');
var fs = require('fs');

module.exports = {
    root_dir: '',
    start: function(mail_object){ // files from email
        var data = {
            authors: []
        };
        data.authors.push(mail_object.from[0]);
        
        var list_of_dirs = [
            this.root_dir + '/' + moment().format('YYYY') + '/',
            this.root_dir + '/' + moment().format('YYYY') + '/' + moment().format('MM') + '/',
            this.root_dir + '/' + moment().format('YYYY') + '/' + moment().format('MM') + '/' + moment().format('DD') + '/'
        ];

        list_of_dirs.forEach(function(dir){
            try {
                fs.mkdirSync(path.normalize(dir));
            } catch(e) {}
        });
        
    
        var dir = path.normalize(list_of_dirs[list_of_dirs.length - 1] + '/' + mail_object.subject + '/');
        try {
            fs.mkdirSync(dir);
        }
        catch(e) {}
        
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
        if (typeof mail_object.attachments !== 'undefined') {
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
        }            
    }
}