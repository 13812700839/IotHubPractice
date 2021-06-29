// IotHub_Server/routes/messages.js

var express = require('express')
var router = express.Router()
var Message = require('../models/message')

router.get('/:productName', function (req, res) {  
    console.log('query ', req.query)
    console.log('params ', req.params)
    var messageId = req.query.message_id
    var deviceName = req.query.device_name
    var productName = req.params.productName
    var query = {product_name: productName}
    if (messageId != null) query.message_id = messageId
    if (deviceName != null) query.device_name = deviceName
    Message.find(query, function (error, messages) {  
        res.json({
            messages: messages.map(function (message) {  
                return message.toJSONObject()
            })
        })
    })
})

module.exports = router