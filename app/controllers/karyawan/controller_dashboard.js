const express = require('express')
const router = express.Router()
const model = require('../../models/model_auth')
const bcrypt = require('bcryptjs')

router.get("/", async function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth')
        return
    }
   
    var error = req.session.error;
    req.session.error = '';

    if(req.user.role == 2){
        res.render('karyawan/dashboard', {
            user: req.user,
            error: error,
            role: req.user.role
        });
    }else{
        res.status(404).render("page_404",{})
    }

    
})

module.exports = router