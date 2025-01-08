const express = require('express')
const router = express.Router()
const model = require('../../models/model_request_spv')
const moment = require('moment')
const flash = require('express-flash');

router.use(flash());

router.get("/", async function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth')
        return
    }
   
    var error = req.session.error;
    req.session.error = '';

    if(req.user.role == 2){
    
        res.render('karyawan/calendar', {
            user: req.user,
            error: error,
            role: req.user.role
        });
    }else{
        res.status(404).render("page_404",{})
    }
    
})

router.post("/ajax/getEvent", async function(req,res){
    var [get_request] = await model.get_all_request()
    var data = []

    if(get_request.length > 0){
        for(var i=0;i<get_request.length;i++){
            var [get_name] = await model.get_user_name(get_request[i].id_user)
            var [get_repair] = await model.check_id_reform_by_id_req(get_request[i].id)
            var currTindakan = ""

            if(get_request[i].id_tindakan == 1){
                currTindakan = "Pergantian"
            }else if(get_request[i].id_tindakan == 2){
                currTindakan = "Pemeriksaan"
            }else if(get_request[i].id_tindakan == 3){
                currTindakan = "Pembersihan"
            }else if(get_request[i].id_tindakan == 4){
                currTindakan = "Perbaikan"
            }else{
                currTindakan = "Pelumasan"
            }

            var title = currTindakan + " " + get_request[i].nomor_mesin
            var description = currTindakan + " " + get_request[i].nama_mesin + " (" + get_request[i].nomor_mesin + ") yang direquest oleh " + get_name[0].name

            if(get_repair.length > 0){
                var getReq = {
                    id: get_request[i].id,
                    title: title,
                    desc: description,
                    status: get_request[i].status_request_mekanik,
                    targetSelesai: moment(get_request[i].target_selesai).format("YYYY-MM-DD"),
                    tanggalFinish: moment(get_repair[0].created).format("YYYY-MM-DD")
                }
    
                console.log("getreq repair:", getReq)
    
                data.push(getReq)
            }else{
                var getReq = {
                    id: get_request[i].id,
                    title: title,
                    desc: description,
                    status: get_request[i].status_request_mekanik,
                    targetSelesai: moment(get_request[i].target_selesai).format("YYYY-MM-DD"),
                }
    
                console.log("getreq:", getReq)
    
                data.push(getReq)
            }
            
        }
       
        res.send(JSON.stringify({
            data: data,
        }));
    }

})

module.exports = router