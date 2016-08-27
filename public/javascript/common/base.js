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
        case '/':
            $('.default').addClass('active');
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

