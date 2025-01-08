var passport = require('passport')
const bcrypt = require('bcryptjs')
const model = require('../models/model_auth')
var LocalStrategy = require('passport-local').Strategy

var init = function () {
    console.log(model)
    passport.serializeUser(async function (req, user, done) {
        console.log(user)
        var data = { id: user.id, name: user.name, email:user.email, role: user.role}
        console.log('serialize user: ',data)
        done(null, data);
    });


    passport.deserializeUser(async function (req, data, done) {
        var [resFind, errFind] = await model.byid(data.id);
        
        if (errFind) return done(null, false);

        done(null, data);
    });

    passport.use('local',
        new LocalStrategy(
            {   usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true },
            async function (req, email, password, done) {
                console.log("masuk local",email, password)
                try{
                    var [user, err] = await model.get(email);
                    console.log("getuser", user)

                    if (err || !user) {
                        console.log("ga ada user")
                        return done(null, false);
                    }

                    if(password != "" && password != null ){
                        console.log("berhasil masok sini")
                        var compare = bcrypt.compareSync(password, user.password);
                        console.log(compare)
                        
                        if (!compare) {
                            return done(null, false);
                        }

                        console.log("Success login pass")

                        return done(null, user);
                    }
                    
                }catch(err){
                    console.log("error passport")
                    return done(false)
                }
            }
        )
    )
    return passport
};

module.exports = init()