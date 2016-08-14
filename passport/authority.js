/**
 * Created by iqianjin-luming on 16/8/14.
 */
module.exports = {
    /**
     * 登陆权限验证
     */
    isAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }else{
            req.flash('loginMessage', '请先登录!');
            res.redirect('/login')
        }
    }
};