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

    if(req.user.role == 1){
        var [data,err] = await model.get_request_mekanik_by_id(req.user.id)

        var error = req.session.error;
        req.session.error = '';
        
        var arr = [];
        if(data.length > 0){
            for(var i=0;i<data.length;i++){
                var dataCurr = {
                    id: data[i].id,
                    nama: data[i].nama_mesin,
                    tipe: data[i].tipe_mesin,
                    nomor: data[i].nomor_mesin,
                    tindakan: parseInt(data[i].id_tindakan),
                    tanggal_pengajuan: moment(data[i].tanggal_pengajuan).format('LL'),
                    target_selesai: moment(data[i].target_selesai).format('LL'),
                    prior: parseInt(data[i].id_prioritas),
                    statusMekanik: parseInt(data[i].status_request_mekanik),
                }

                arr.push(dataCurr)
            }
        }   

        console.log(arr)
    
        res.render('spv/maintenance_request', {
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
                status: parseInt(get_details[0].status_request_mekanik),
                reason: get_details[0].reject_reason_mekanik,
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

router.get("/form_finalize/:id", async function(req,res){
    if (!req.isAuthenticated()) {
        res.redirect('/auth')
        return
    }

    if(req.user.role == 1){
        var error = req.session.error;
        req.session.error = '';
        var data = [];
        var dataKomponen = [];
        var currData = []
    

        var [get_details] = await model.get_last_req_by_id(req.params.id)
        var [get_komponen] = await model.get_komponen_by_id(req.params.id)

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
            var [get_user_name] = await model.get_user_name(get_details[0].id_user)
            var [get_user_name_approver] = await model.get_user_name(get_details[0].approver)
            var [get_user_name_repaired] = await model.get_user_name(get_details[0].approver_mekanik)

            var uraianDb = ""
            var durasi, jmlManpower, biayaManpower, biayaPeralatan, total = 0 
            var [check_id_req] = await model.check_id_reform_by_id_req(req.params.id)

            if(check_id_req.length > 0){
                uraianDb = check_id_req[0].uraian
                durasi = check_id_req[0].durasi
                jmlManpower =  check_id_req[0].jmlTenagaKerja
                biayaManpower = check_id_req[0].biayaTenagaKerja
                biayaPeralatan = check_id_req[0].biayaPeralatan
                total = check_id_req[0].total
            }else{
                uraianDb = null
                durasi = null
                jmlManpower =  null
                biayaManpower = null
                biayaPeralatan =null
                total = null
            }
            
            var currentAll = {
                id: get_details[0].id,
                nama: get_details[0].nama_mesin,
                tipe: get_details[0].tipe_mesin,
                nomor: get_details[0].nomor_mesin,
                tindakan: parseInt(get_details[0].id_tindakan),
                tanggal_pengajuan: moment(get_details[0].tanggal_pengajuan).format('YYYY-MM-DD'),
                target_selesai: moment(get_details[0].target_selesai).format('YYYY-MM-DD'),
                prior: parseInt(get_details[0].id_prioritas),
                status: get_details[0].status_request_mekanik,
                uraian: get_details[0].uraian_permintaan,
                permasalahan: get_details[0].permasalahan,
                nama_no: get_details[0].nama_nomor_material,
                dataKomponen: dataKomponen,
                tanggalApproveMekanik: moment(get_details[0].status_request_mekanik_date).format('YYYY-MM-DD'),
                tanggalApproveSpv: moment(get_details[0].request_date).format('YYYY-MM-DD'),
                requestUser: get_user_name[0].name,
                approver: get_user_name_approver[0].name,
                repairedBy: get_user_name_repaired[0].name,
                uraianDb: uraianDb,
                durasi: durasi,
                jmlM: jmlManpower,
                biayaM: biayaManpower,
                biayaP: biayaPeralatan,
                total: total
            }
    
            data.push(currentAll)
        }

        console.log(data)
    
        res.render('spv/form_repair', {
            data:data,
            user: req.user,
            error: error,
            role: req.user.role
        });
    }else{
        res.status(404).render("page_404",{})
    }
})

module.exports = router