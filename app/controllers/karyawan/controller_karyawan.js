const express = require('express')
const router = express.Router()
const c_dashboard = require('./controller_dashboard')
const c_request = require('./controller_request')
const c_list = require('./controller_list_request')
const c_history = require('./controller_history')
const c_calendar = require('./controller_calendar')

router.use('/dashboard', c_dashboard)
router.use('/form', c_request)
router.use('/maintenance_request', c_list)
router.use('/history', c_history)
router.use('/calendar', c_calendar)

router.use(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth')
        return
    }
    next()
});

module.exports = router