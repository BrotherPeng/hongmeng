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
        case '/monitor':
            $('.treeview').addClass('active');
            $('.treeview').find('.treeview-menu').show();
            break;
        case '/control':
            $('.treeview').addClass('active');
            $('.treeview').find('.treeview-menu').show();
            break;
        case '/member/list':
            $('.member').addClass('active');
            break;
        case '/project/list':
            $('.project').addClass('active');
            break;
        case '/equipment/list':
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

