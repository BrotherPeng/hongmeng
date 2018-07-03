/**
 * Created by iqianjin-luming on 16/8/13.
 */
var mysql = require('mysql');

function Connection() {
    this.pool = null;

    this.init = function() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            // password: '12345678',
            // password: 'root',
            password: 'infoadmin',
            database: 'relation'
        });
    };

    this.acquire = function(callback) {
        this.pool.getConnection(function(err, connection) {
            callback(err, connection);
        });
    };
}

module.exports = new Connection();
