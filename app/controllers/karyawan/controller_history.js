const express = require('express')
const router = express.Router()
const model = require('../../models/model_request')
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

        var [get_request] = await model.get_history(req.user.id)

        var arr = [];
        if(get_request.length > 0){
            for(var i=0;i<get_request.length;i++){
                var dataCurr = {
                    id: parseInt(get_request[i].id),
                    nama: get_request[i].nama_mesin,
                    tipe: get_request[i].tipe_mesin,
                    nomor: get_request[i].nomor_mesin,
                    tindakan: parseInt(get_request[i].id_tindakan),
                    tanggal_pengajuan: moment(get_request[i].tanggal_pengajuan).format('LL'),
                    target_selesai: moment(get_request[i].target_selesai).format('LL'),
                    prior: parseInt(get_request[i].id_prioritas),
                    status: parseInt(get_request[i].request_status),
                    statusMekanik: parseInt(get_request[i].status_request_mekanik)
                }

                arr.push(dataCurr)
            }
        }
        
        res.render('karyawan/history', {
            data: arr,
            user: req.user,
            error: error,
            role: req.user.role
        });
    }else{
        res.status(404).render("page_404",{})
    }
    
    
})

router.post("/ajax/getDetails/:id", async function(req,res){
    console.log("id", req.params.id)

    var id =  req.params.id
    var data = [];
    var dataKomponen = [];
    var currData = []

    if(id != null){
        var [get_details] = await model.get_last_req_by_id(req.params.id)
        var [get_komponen] = await model.get_komponen_by_id(id)

        if(get_komponen.length > 0){
            console.log(get_komponen.length)
            for(var i=0;i<get_komponen.length;i++){
                currData = {
                    peralatan: get_komponen[i].peralatan_material,
                    spek: get_komponen[i].spesifikasi,
                    qty: get_komponen[i].qty,
                    ket: get_komponen[i].keterangan
                }
                
                dataKomponen.push(currData)
            }
        }else if(get_komponen.length == 1){
            currData = {
                peralatan: get_komponen[0].peralatan_material,
                spek: get_komponen[0].spesifikasi,
                qty: get_komponen[0].qty,
                ket: get_komponen[0].keterangan
            }

            dataKomponen.push(currData)
        }else{
            dataKomponen.push("")
        }

        console.log("datakomponen", dataKomponen)

        if(get_details.length > 0){
            var currentAll = {
                uraian: get_details[0].uraian_permintaan,
                permasalahan: get_details[0].permasalahan,
                nama_no: get_details[0].nama_nomor_material,
                dataKomponen: dataKomponen
            }
    
            data.push(currentAll)
            
            res.send(JSON.stringify({
                data: data,
            }));
        }
       
    
    }else{
        res.send(JSON.stringify({
            data: data,
        }));
    
    }
    
})

module.exports = router