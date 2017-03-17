/**
 * Created by iqianjin-luming on 16/7/28.
 */
$.ajax({
    method: "GET",
    url: "/getUserName",
    dataType: "json",
    success: function (data) {
        //if (data.username) {
        if (data.user) {
            var username = data.user.username;
            //我改了一下后台，登录验证接口返回user全部信息，username显示在导航，userid存在本地localStorage
            var userId = data.user.id;
            putString("userId", userId);
            putString("userName", username);
            //$('.header-username').html(data.username).css({display: 'block'});
            $('.header-username').html(username).css({display: 'block'});
            $('#logout').show();
        }
    }
});
getPath(location.pathname);
function getPath(path) {
    switch (path) {
        case '/login':
            $('[role=navigation] .navbar-brand').html('登录');
            break;
        case '/monitor':
            $('[role=navigation] .navbar-brand').html('监测中心');
            $('.treeview').addClass('active');
            $('.treeview').find('.treeview-menu').show();
            break;
        case '/control':
            $('[role=navigation] .navbar-brand').html('控制中心');
            $('.treeview').addClass('active');
            $('.treeview').find('.treeview-menu').show();
            break;
        case '/member/list':
            $('[role=navigation] .navbar-brand').html('人员管理');
            $('.member').addClass('active');
            break;
        case '/project/list':
            $('[role=navigation] .navbar-brand').html('项目管理');
            $('.project').addClass('active');
            break;
        case '/equipment/list':
            $('[role=navigation] .navbar-brand').html('设备管理');
            $('.equipment').addClass('active');
            break;
        default:
            break;
    }
}
$('.treeview a').on('click', function () {
    if ($(this).parent().hasClass('active')) {
        $(this).parent().removeClass('active');
        $(this).next().hide();
    } else {
        $(this).parent().addClass('active');
        $(this).next().show();
    }

});

//localStorage （key，value）存取
function putString(key, value) {
    var storage = window.localStorage;
    storage[key] = value;
}
function getString(key) {
    var storage = window.localStorage;
    return storage[key];
}
//自定义弹出框样式
var Tip = {
    alert: function (value, type, back) {
        var t = "";
        var v = "";
        if (value == "add") {
            v = "添加"
        } else if (value == 'edit') {
            v = "编辑"
        } else {
            v = "操作"
        }
        if (type == 'project') {
            t = "项目"
        } else if (type == 'equipment') {
            t = "设备"
        } else if (type == 'member') {
            t = "人员"
        }
        var tip = "";
        if (back == "success") {
            tip =
                '<div class="tipBox" id="tipBox">' +
                '<div style="margin-top: 80px">' + v + t + '成功' + '</div>' +
                '<button id="tip_btn" class="tip_btn">' + '确定' + '</button>' +
                '</div>';
            $("body").append(tip);
            $("#tip_btn").click(function () {
                location.href = "/" + type + "/list";
            });
        } else {
            tip =
                '<div class="tipBox" id="tipBox">' +
                '<div style="margin-top: 80px">' + v + t + '失败，请联系开发' + '</div>' +
                '<button id="tip_btn" class="tip_btn">' + '确定' + '</button>' +
                '</div>';
            $("body").append(tip);
            $("#tip_btn").click(function () {
                $("#tipBox").remove();
            });
        }
    },
    confirm: function (type,id) {
        var t="";
        if(type == 'equipment'){
            t="设备"
        }else if (type == 'member'){
            t="人员"
        }else if (type == 'project'){
            t="项目"
        }
        var tip = "";
        tip =
            '<div class="tipBox" id="tipBox">' +
            '<div style="margin-top: 80px">' + '确认删除此' + t + '吗?' + '</div>' +
            '<button id="left_btn" class="tip_btn" style="margin-right: 20px">' + '取消' + '</button>' +
            '<button id="right_btn" class="tip_btn" style="margin-right: 20px">' + '确定' + '</button>' +
            '</div>';
        $("body").append(tip);
        $("#left_btn").click(function () {
            $("#tipBox").remove();
        });
        $("#right_btn").click(function () {
            if(type == 'equipment'){
                $.ajax({
                    method: "GET",
                    url: "/equipment/del",
                    dataType: "json",
                    data: {id: id},
                    success: function (data) {
                        if (data.status === 1) {
                            location.reload();
                        }
                    }
                })
            }else if(type == 'member'){
                $.ajax({
                    method: "GET",
                    url: "/member/del",
                    dataType: "json",
                    data: {id: id},
                    success: function (data) {
                        if (data.status === 1) {
                            location.reload();
                        }
                    }
                })
            }else if(type == 'project'){
                $.ajax({
                    method: "GET",
                    url: "/project/del",
                    dataType: "json",
                    data: {id: id},
                    success: function (data) {
                        if (data.status === 1) {
                            location.reload();
                        }
                    }
                })
            }

        });
    }
};
//获得当前时间YY-MM-DD HH-MM-SS
function getTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month
    }
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day
    }
    var hour = date.getHours();
    if (hour < 10) {
        hour = "0" + hour
    }
    var min = date.getMinutes();
    if (min < 10) {
        min = "0" + min
    }
    var s = date.getSeconds();
    if (s < 10) {
        s = "0" + s
    }
    return year + '-' + month + '-' + day + " " + hour + ':' + min + ':' + s;
}

