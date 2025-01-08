const express = require('express')
const router = express.Router()
const mysql = require('../module/mysql_connector.js')
const c_auth = require('./auth/controller_auth')
const c_spv = require('./spv/controller_spv')
const c_karyawan = require('./karyawan/controller_karyawan')
const c_mekanik = require('./mekanik/controller_mekanik')

router.get('/app-status', async (req, res) => {
    var status = {}
    try {
        var [result,cache] = await mysql.queryAsync("SELECT * FROM ms_users")
        await mysql.endPool()
        status['DB'] = 'OK'
        status['length'] = result.length
    } catch (error) {
        status['DB'] = 'NOT OK'
        status['message'] = error
        status['length'] = 0
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.setHeader("Connection", "close")
    res.send(JSON.stringify(status));
    // var status = {status:"OK"}
    
    // res.send(JSON.stringify(status));
})

router.get('/', function(req, res){
    if(req.isAuthenticated()){
        if(req.user.role == 0){
            res.redirect("/spv/dashboard")
        }else if(req.user.role == 1){
            res.redirect("/karyawan/dashboard")
        }else{
            res.redirect("/mekanik/dashboard")
        }
    }else{
        res.redirect("/auth")
    }
})

router.get('/undefined', function(req, res){
    // res.redirect("/panels/dashboard")   
})

router.use("/auth", c_auth)
router.use("/spv", c_spv)
router.use("/karyawan", c_karyawan)
router.use("/mekanik", c_mekanik)

router.use(function(req, res){
    res.status(404).render("page_404",{})
    return
});




module.exports = router