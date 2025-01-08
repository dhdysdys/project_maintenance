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

    if(req.user.role == 2){
        var error = req.session.error;
        req.session.error = '';
    
        res.render('karyawan/form_request', {
            user: req.user,
            error: error,
            role: req.user.role
        });
    }else{
        res.status(404).render("page_404",{})
    }
   
    
})

router.post("/input", async (req,res) => {
    console.log(req.body)

    console.log(req.user.id)
    var [get_data, err] = await model.get_request_by_id_user(req.user.id)
    console.log(get_data)

    var datepengajuan = new Date(req.body.tanggal_pengajuan)
    var datetarget = new Date(req.body.target_selesai)

    var tanggalPengajuan = moment(datepengajuan).format('YYYY-MM-DD HH:MM:SS')
    var targetSelesai = moment(datetarget).format('YYYY-MM-DD HH:MM:SS')

    console.log(tanggalPengajuan)
    console.log(targetSelesai)

    console.log("insert data")
    var dataReq = {
        nama_mesin: req.body.nama_mesin,
        tipe_mesin: req.body.tipe_mesin,
        nomor_mesin: req.body.nomor_mesin,
        jenis_tindakan: parseInt(req.body.jenis_tindakan),
        tanggal_pengajuan: tanggalPengajuan,
        target_selesai: targetSelesai,
        prior: parseInt(req.body.prior),
        uraian: req.body.uraian,
        permasalahan: req.body.permasalahan,
        nama_no_material: req.body.nama_no_material,
        id_user: parseInt(req.user.id)
    }

    console.log("datareq:", dataReq)

    var [insert_req, err] = await model.insert_request(dataReq)

    console.log("length:",typeof req.body.material)
    if(typeof req.body.material == "object"){
        console.log("masuk req body banyak")
        for(var i=0;i<req.body.material.length;i++){
            console.log(req.body.material[i])

            var dataKomponen = {
                material: req.body.material[i],
                spek: req.body.spek[i],
                qty: parseInt(req.body.qty[i]),
                ket: req.body.ket[i],
                id_req: insert_req.insertId
            }
        
            console.log("data komponen if", dataKomponen)
        
            var [insert_komponen, err] = await model.insert_komponen(dataKomponen)
        }
    }else if(typeof req.body.material == "string"){
        console.log("masuk req body 1", req.body.material)

        var dataKomponen = {
            material: req.body.material,
            spek: req.body.spek,
            qty: parseInt(req.body.qty),
            ket: req.body.ket,
            id_req: insert_req.insertId
        }
    
        console.log("data komponen else ", dataKomponen)
    
        var [insert_komponen, err] = await model.insert_komponen(dataKomponen)
    }
    
    req.flash("messages", { "success" : "Success Request!" });
    res.redirect("/karyawan/dashboard")
    
})

module.exports = router