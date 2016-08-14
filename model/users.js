/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Users() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            con.query('select * from users', function(err, result) {
                con.release();
                logger.info(result);
                res.send(result);
            });
        });
    };
    this.getByName = function (username,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from users where username = "'+username+'"', function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getById = function (id,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from users where username = "'+id+'"', function(err, result) {
                con.release();
                logger.info(result);
                callback(err,result);
            });
        });
    }
    this.create = function(users, res) {
        connection.acquire(function(err, con) {
            con.query('insert into users set ?', users, function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'TODO creation failed'});
                } else {
                    res.send({status: 0, message: 'TODO created successfully'});
                }
            });
        });
    };
    this.update = function(users, res) {
        connection.acquire(function(err, con) {
            con.query('update users set ? where id = ?', [users, users.id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'TODO update failed'});
                } else {
                    res.send({status: 0, message: 'TODO updated successfully'});
                }
            });
        });
    };
    this.delete = function(id, res) {
        connection.acquire(function(err, con) {
            con.query('delete from users where id = ?', [id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'Failed to delete'});
                } else {
                    res.send({status: 0, message: 'Deleted successfully'});
                }
            });
        });
    };
}
module.exports = new Users();