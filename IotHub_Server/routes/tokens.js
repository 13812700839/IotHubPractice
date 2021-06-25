// IotHub_Server/routes/tokens.js

var express = require('express')
var router = express.Router()
var shortid = require('shortid')
var jwt = require('jsonwebtoken')

// 这个值应该与EMQ X etc/plugins/emqx_auth_jwt.conf 中保持一致
const jwtSecret = 'emqxsecret'

router.post('/', function (_, res) { 
    var username = shortid.generate()
    var password = jwt.sign({
        username: username,
        exp: Math.floor(Date.now() / 1000)+10*60
    }, jwtSecret)

    res.json({username: username, password: password})
})

module.exports = router
