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

    get_request: async function(){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request")
            var [result,cache] = await mysql.queryAsync(sql)
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
            var sql=("SELECT * FROM request WHERE id_user = ?")
            var [result,cache] = await mysql.executeAsync(sql, id)
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

    insert_request: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "INSERT INTO request(nama_mesin, tipe_mesin, nomor_mesin, id_tindakan, tanggal_pengajuan, target_selesai, id_prioritas, uraian_permintaan, permasalahan, nama_nomor_material, request_status, id_user) VALUES('"
            + data.nama_mesin + "', '"
            + data.tipe_mesin + "', '"
            + data.nomor_mesin + "', "
            + data.jenis_tindakan + ", '"
            + data.tanggal_pengajuan + "', '"
            + data.target_selesai + "', "
            + data.prior + ", '"
            + data.uraian + "', '" 
            + data.permasalahan + "', '"
            + data.nama_no_material + "', "
            + 0  + ", "
            + data.id_user + ")"
            var [result,cache] = await mysql.executeAsync(sql)
            await mysql.endPool()
            console.log("res",result)
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    update_request: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "UPDATE request SET nama_mesin ='"
            + data.nama_mesin + "', tipe_mesin = '"
            + data.tipe_mesin + "', nomor_mesin = '"
            + data.nomor_mesin + "', id_tindakan = "
            + data.jenis_tindakan + ", tanggal_pengajuan = '"
            + data.tanggal_pengajuan + "', target_selesai = '"
            + data.target_selesai + "', id_prioritas = "
            + data.prior + ", uraian_permintaan = '"
            + data.uraian + "', permasalahan = '"
            + data.permasalahan + "', nama_nomor_material = '"
            + data.nama_no_material + "', request_status = "
            + 0 + ", status_request_mekanik = "
            + 0 + ", request_date = NULL, status_request_mekanik_date = NULL WHERE id = " + data["id"]
            var [result,cache] = await mysql.executeAsync(sql)
            await mysql.endPool()
            console.log("res",result)
            return [result, null]
        }catch(error){
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

    insert_komponen: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "INSERT INTO tr_komponen(id_request, peralatan_material, spesifikasi, qty, keterangan) VALUES("
            + data["id_req"] + ", '"
            + data["material"] + "', '"
            + data["spek"] + "', "
            + data["qty"] + ", '"
            + data["ket"] + "')"
            var [result,cache] = await mysql.executeAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    update_komponen: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "UPDATE tr_komponen SET peralatan_material = '"
            + data["material"] + "', spesifikasi = '"
            + data["spek"] + "', qty = "
            + data["qty"] + ", keterangan = '"
            + data["ket"] + "' WHERE id_request = "
            + data["idReq"] + " AND id = "
            + data["id"] + ""
            var [result,cache] = await mysql.executeAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch(error){
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

    get_history: async function(id){
        try{
            await mysql.connectAsync()
            var sql=("SELECT * FROM request WHERE request_status > 0 AND status_request_mekanik > 0  AND id_user = ?")
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
}