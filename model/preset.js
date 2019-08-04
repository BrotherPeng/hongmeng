/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Preset() {
    this.getAll = function (callback) {
        connection.acquire(function (err, con) {
            con.query('select * from dailypresetconfig', function (err, daily) {
                for (let i = 0; i < daily.length; i++) {
                    daily[i].type = 'daily'
                }
                con.query('select * from weekpresetconfig', function (err, week) {
                    con.release();
                    // logger.info(result);
                    for (let i = 0; i < week.length; i++) {
                        week[i].type = 'week'
                    }
                    daily = daily.concat(week)
                    // res.render('preset/list',{title:'预置管理',result:daily});
                    callback(err, daily);
                });
            });
        });
    };
    this.getByName = function (username, callback) {
        connection.acquire(function (err, con) {
            con.query('select * from users where username = "' + username + '"', function (err, result) {
                con.release();
                callback(err, result);
            });
        });
    };
    this.getById = function (id, callback) {
        connection.acquire(function (err, con) {
            con.query('select * from users where id = "' + id + '"', function (err, result) {
                con.release();
                logger.info(result);
                callback(err, result);
            });
        });
    };
    this.getByOwnerId = function (ownerId, callback) {
        connection.acquire(function (err, con) {
            con.query("select " +
                "a.`id`,a.`username`,a.`password`,a.`mobile`,a.`email`,a.`role_id`,a.`create_time`,b.`username` as `ownername` " +
                "from users a,users b where a.`owner_id`=b.`id` and a.`owner_id`= ?", [ownerId], function (err, result) {
                    con.release();
                    callback(err, result);
                });
        });
    };
    this.getIdAndNameByOwnerIdLimitRole = function (ownerId, callback) {
        connection.acquire(function (err, con) {
            con.query("select " +
                "a.`id`,a.`username` " +
                // "from users a where a.`role_id` in (2,4) and a.`owner_id`= ?", [ownerId],function(err, result) {
                "from users a where a.`role_id` in (4)", [ownerId], function (err, result) {
                    con.release();
                    logger.info(result);
                    callback(err, result);
                });
        });
    };
    // 创建预置周设置
    this.createWeekPreset = function (weekTimeConfig, res) {
        connection.acquire(function (err, con) {
            con.query('insert into weekpresetconfig set ?', weekTimeConfig, function (err, result) {
                con.release();
                if (err) {
                    //res.render('member/error');
                    res.send({ success: false })
                } else {

                    //res.render('member/success',{title:'监控中心'});
                    res.send({ success: true })
                }
            });
        });
    };
    this.updateWeekPreset = function (weekTimeConfig, id, res) {
        connection.acquire(function (err, con) {
            con.query('update weekpresetconfig set ? where id = ?', [weekTimeConfig, id], function (err, result) {
                con.release();
                if (err) {
                    //res.render('member/error');
                    res.send({ success: false })
                } else {

                    //res.render('member/success',{title:'监控中心'});
                    res.send({ success: true })
                }
            });
        });
    };
    // 创建预置日设置
    this.createDailyPreset = function (dailyTimeConfig, res) {
        connection.acquire(function (err, con) {
            con.query('insert into dailypresetconfig set ?', dailyTimeConfig, function (err, result) {
                con.release();
                if (err) {
                    //res.render('member/error');
                    res.send({ success: false })
                } else {

                    //res.render('member/success',{title:'监控中心'});
                    res.send({ success: true })
                }
            });
        });
    };
    // 创建预置日设置
    this.updateDailyPreset = function (dailyTimeConfig, id, res) {
        connection.acquire(function (err, con) {
            con.query('update dailypresetconfig set ? where id = ?', [dailyTimeConfig, id], function (err, result) {
                con.release();
                if (err) {
                    //res.render('member/error');
                    res.send({ success: false })
                } else {

                    //res.render('member/success',{title:'监控中心'});
                    res.send({ success: true })
                }
            });
        });
    };

    this.delete = function (id, type, res) {
        connection.acquire(function (err, con) {
            const sql = type === 'week' ? 'delete from weekpresetconfig where id = ?' : 'delete from dailypresetconfig where id = ?'
            con.query(sql, [id], function (err, result) {
                con.release();
                if (err) {
                    res.send({ success: -1, message: 'Failed to delete' });
                } else {
                    res.send({ success: 1, message: 'Deleted successfully' });
                }
            });
        });
    };
}
module.exports = new Preset();