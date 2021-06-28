// IotHub_Server/routes/emqx_web_hook.js

var express = require('express')
var Device = require('../models/device')
var router = express.Router()

router.post("/", function (req, res) {
    if (req.body.action == 'client_connected') Device.addConnection(req.body)
    else if (req.body.action == 'client_disconnected') Device.removeConnection(req.body)
    res.status(200).send('ok')
})

module.exports = router