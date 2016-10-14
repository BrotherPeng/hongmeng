/**
 * Created by iqianjin-luming on 16/8/20.
 */
//权限管理
var ConnectRoles = require('connect-roles');
var roles = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (~accept.indexOf('html')) {
            res.render('access-denied', {action: action});
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});
//admin users can access all pages
roles.use(function (req) {
    // if (req.user[0].role_id === 1) {
        return true;
    // }
});
// roles.use('access user page', function (req) {
//     if (req.user[0].role_id === 2||req.user[0].role_id === 4) {
//         return true;
//     }
// })
// roles.use('access member page', function (req) {
//     if (req.user[0].role_id === 2||req.user[0].role_id === 4) {
//         return true;
//     }
// })
module.exports=roles;