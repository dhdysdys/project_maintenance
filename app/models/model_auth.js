const mysql = require('../module/mysql_connector')

module.exports = { 
    get_user: async function(){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM ms_user")
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get: async function(email){
        console.log("masuk modelget")
        try{
            await mysql.connectAsync()
            var sql= "SELECT * "+ 
            "FROM ms_user "+ 
            "WHERE email='"+email+"'";
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    byid: async function(id){
        try{
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_user WHERE id="+id+" ";
            var [result,cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
}