const mysql = require('../module/mysql_connector')

module.exports = { 
    get_request: async function(){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE request_status = 0 AND status_request_mekanik = 0 ")
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_request_by_id: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE id = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    approve_request: async function(data){
        try{
            await mysql.connectAsync()
            var sql= "UPDATE request SET request_status ="
            + data.status + ", request_date =  CURRENT_TIMESTAMP, status_request_mekanik_date = NULL, approver = "
            + data.approver + " WHERE id = "
            + data.id_request + ""
            var [result,cache] = await mysql.executeAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    reject_request: async function(data){
        try{
            await mysql.connectAsync()
            var sql= "UPDATE request SET request_status ="
            + data.status + ", reject_reason = '"
            + data.reason + "', approver = "
            + data.approver + " WHERE id = "
            + data.id_request + ""
            var [result,cache] = await mysql.executeAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_last_req_by_id: async function(id_user){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE id = ? ORDER BY created DESC LIMIT 1")
            var [result,cache] = await mysql.executeAsync(sql, id_user)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_request_mekanik_by_id: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE approver = ? ")
            var [result,cache] = await mysql.executeAsync(sql,id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_komponen_by_id: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM tr_komponen WHERE id_request = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_user_name: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM ms_user WHERE id = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    check_id_reform_by_id_req: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM form_repair WHERE id_request = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_history: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM form_repair WHERE createdBy = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_all_request: async function(){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE status_request_mekanik = 1 OR status_request_mekanik = 3 OR status_request_mekanik = 4 OR status_request_mekanik = 5")
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_history_by_id: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE id = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    get_request_by_id_user: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE approver = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    }
}