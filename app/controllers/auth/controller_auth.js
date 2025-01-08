const express = require('express')
const router = express.Router()
const passport= require('passport')
const model = require('../../models/model_auth')
const randomstring = require('randomstring')
const axios = require('axios')
const bcrypt = require('bcryptjs')

//router to login page
router.get("/", async function(req, res){
    if(req.isAuthenticated()){
        if(req.user.role == 0){
            res.redirect("/spv/dashboard")
        }else{
            res.redirect("/karyawan/dashboard")
        }
    } else{
        var error= req.session.error
        req.session.error= ""
        res.render("auth/login", {error: error})
    }
})

router.post('/login', async function(req, res, next){
    console.log("masuklogin")
    console.log(req.body.email, req.body.password);

    passport.authenticate('local', async function(err, user, info) {
        console.log("user", user)
        if(err || !user){
            console.log('error: Incorrect email or password!')
            req.session.error= 'Incorrect email or password!'
            res.redirect('/auth')
            return
        }

        if ( req.body.remember ) {
            var hour = 3600000;
            req.session.cookie.maxAge = 7 * 24 * hour; //1 week
        } else {
            req.session.cookie.expires = false;
        }
        req.session.id = user.id;

        req.login(user, async function(err){
            console.log('Success')
            if(err){
                console.log('error, Incorrect email or password!')
                req.session.error= 'Incorrect email or password!'
                res.redirect('/auth')
                return
            }
            console.log('Login Success!')
            if(req.user.role == 2){
                res.redirect('/karyawan/dashboard')
                console.log("karyawan")
            }else if(req.user.role == 3){
                res.redirect('/mekanik/dashboard')
                console.log("mekanik")
            }else if(req.user.role == 1){
                res.redirect('/spv/dashboard')
                console.log("spv")
            }
        })
    })
    (req, res, next)
});

router.get('/logout', async function(req, res){
    req.session.destroy(async function (err) {
        req.logout()
        res.redirect('/auth');
    })
});

module.exports = router