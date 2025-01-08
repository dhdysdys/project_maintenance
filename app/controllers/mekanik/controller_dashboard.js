const express = require('express')
const router = express.Router()
const model = require('../../models/model_request_mekanik')
const moment = require('moment')
const flash = require('express-flash');

router.use(flash());

router.get("/", async function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth')
        return
    }

    if(req.user.role == 3){
        var [data,err] = await model.get_request()

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
                    status: parseInt(data[i].request_status),
                    statusMekanik: parseInt(data[i].status_request_mekanik),
                }

                arr.push(dataCurr)
            }
        }   

        console.log(arr)
    
        res.render('mekanik/dashboard', {
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
        }else{
            currData = {
                peralatan: get_komponen[0].peralatan_material,
                spek: get_komponen[0].spesifikasi,
                qty: get_komponen[0].qty,
                ket: get_komponen[0].keterangan
            }

            dataKomponen.push(currData)
        }

        console.log("datakomponen", dataKomponen)

        if(get_details.length > 0){
            var currentAll = {
                status: get_details[0].status_request_mekanik,
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

router.get("/approveRequest/:id", async function(req,res){
    console.log(req.params.id)
    
    var get_request = await model.get_request_by_id(req.params.id)

    if(get_request.length > 0){
        var currDate = new Date()
        var today = moment(currDate).format('YYYY-MM-DD HH:MM:SS')

        var data = {
            status: 1,
            approver: parseInt(req.user.id),
            id_request: parseInt(req.params.id),
            date: today
        }
    
        var update_status = await model.approve_request(data)
    
        req.flash("messages", { "success" : "Success Approve Request!" });
        res.redirect("/mekanik/dashboard")
    }else{
        req.flash("messages", { "error" : "Failed Approve Request!" });
        res.redirect("/mekanik/dashboard")
    }  
})

router.post("/rejectRequest", async function(req,res){
    console.log(req.body)

    var get_request = await model.get_request_by_id(parseInt(req.body.idrequest))

    if(get_request.length > 0){
        var data = {
            status: 2,
            approver: parseInt(req.user.id),
            reason: req.body.reason,
            id_request: parseInt(req.body.idrequest)
        }

        var update_status = await model.reject_request(data)
    
        req.flash("messages", { "success" : "Success Reject Request!" });
        res.redirect("/mekanik/dashboard")
    }else{
        req.flash("messages", { "error" : "Failed Reject Request!" });
        res.redirect("/mekanik/dashboard")
    }
})

module.exports = router