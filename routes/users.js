var express = require('express');
var users = require('../model/member');
var router = express.Router();

module.exports=function (app,passport) {
    /* GET users listing. */
    app.get('/login', function(req, res, next) {
        res.render('users/login', { title: '登录' });
    });
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function (req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
    });
    app.get('/getUserName',function (req,res,next) {
        if(req.user){
            let userName = req.user[0].username;
            res.send({username:userName});
        }else{
            res.send({username:null});
        }

    })
}

