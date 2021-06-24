// routes/device.js

var Device = require('../models/device')
var shortid = require('shortid')
var express = require('express')
var router = express.Router()

router.post("/", function (req, res){
    var productName = req.body.product_name
    var deviceName = shortid.generate();
    var secret = shortid.generate();
    // var brokerUsername = `${productName}/${deviceName}`
    var brokerUsername = productName+'/'+deviceName

    console.log(productName)
    console.log(deviceName)
    console.log(secret)
    console.log(brokerUsername)

    var device = new Device({
        product_name: productName,
        device_name: deviceName,
        secret: secret,
        broker_username: brokerUsername
    })

    device.save(function (err) {
        if (err)
            res.status(500).send(err)
        else
            res.json({product_name: productName, device_name: deviceName, secret: secret})
    })
})

module.exports = router