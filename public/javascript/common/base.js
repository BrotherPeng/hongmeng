/**
 * Created by iqianjin-luming on 16/7/28.
 */
$.ajax({
    method: "GET",
    url: "/getUserName",
    dataType: "json",
    success: function (data) {
        if (data.username) {
            $('.header-username').html(data.username).css({display: 'block'});
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
$('.treeview a').on('click',function () {
    if($(this).parent().hasClass('active')){
        $(this).parent().removeClass('active');
        $(this).next().hide();
    }else{
        $(this).parent().addClass('active');
        $(this).next().show();
    }

})

