'use strict';
$(function(){
    document.getElementById("icontenter").style.minHeight = document.body.clientHeight-70+"px"; 
    lib.getJsonData("get", '/data/config.txt', {}, function(data) {
        if (data.data) {
            var tpl = template('listtpl', data);
            var tpl_menu = template('menutpl', data);
            $('.nav-menu').html(tpl_menu);
            $('.list-ul').html(tpl);    
        } else {
            return false;
        }
    });
})
