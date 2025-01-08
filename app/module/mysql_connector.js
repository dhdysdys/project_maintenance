const mysqlConfig = require('../config/mysql.json')
const mysql = require('mysql2');

function createPool() {
    try {
        const pool = mysql.createPool({
            host: mysqlConfig.db_host,
            user: mysqlConfig.db_user,
            password: mysqlConfig.db_pass,
            database: mysqlConfig.database,
            connectionLimit: 20,
            waitForConnections: false,
            queueLimit: 0,
            multipleStatements: true
        });
        const promisePool = pool.promise();
        return promisePool;
    } catch (error) {
        console.log(`Could not connect - ${error}`);
        throw new Error(error.toString());
    }
}

const pool = createPool();

module.exports = {
    connectAsync: async function(){
        return true
    },
    queryAsync: async function(sql){
        try{            
            var connection = await pool.getConnection()
            var [rows, fields] = await connection.query(sql)
            connection.release()
        }catch(ex){
            console.log(sql)
            throw new Error(ex.toString());
        }
        return [rows, fields]
    },
    executeAsync: async function(sql, data){
        try{           
            var connection = await pool.getConnection()
            var[rows, fields] = await connection.query(sql, data)
            connection.release()
        }catch(ex){
            console.log(sql)
            throw new Error(ex.toString());
        }
        return [rows, fields]
    },
    endPool: async function(){
        return true
    },
    escape: function(data){
        return mysql.escape(data)
    }
}