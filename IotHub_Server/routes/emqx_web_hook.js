// IotHub_Server/routes/emqx_web_hook.js

var express = require('express')
var Device = require('../models/device')
var router = express.Router()
var messageService = require('../services/message_service')

router.post("/", function (req, res) {
    // if (req.body.action == 'client_connected') Device.addConnection(req.body)
    // else if (req.body.action == 'client_disconnected') Device.removeConnection(req.body)

    switch(req.body.action) {
        case 'client_connected':
            Device.addConnection(req.body)
            break
        case 'client_disconnected':
            Device.removeConnection(req.body)
            break
        case 'message_publish':
            messageService.dispathMessage({
                topic: req.body.topic,
                payload: req.body.payload,
                ts: req.body.ts
            })
            break
    }

    res.status(200).send('ok')
})

module.exports = router