module.exports = {
    disk_init: function(){
        var disk = new YandexDisk(global.config.api.yandex_disk.login, global.config.api.yandex_disk.pass);
        disk.cd(global.config.api.yandex_disk.root_dir + '/архив/');
    }
}




