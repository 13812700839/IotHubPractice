// routes/device.js

var Device = require('../models/device')
var shortid = require('shortid')
var express = require('express')
var Connection = require('../models/connection')
var router = express.Router()

// Server API：设备注册
router.post("/", function (req, res){
    var productName = req.body.product_name
    var deviceName = shortid.generate();
    var secret = shortid.generate();
    // var brokerUsername = `${productName}/${deviceName}`
    var brokerUsername = productName+'/'+deviceName

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

// Server API：设备信息查询
// 单个设备信息查询
router.get("/:productName/:deviceName", function(req, res) {
    var productName = req.params.productName
    var deviceName = req.params.deviceName
    Device.findOne({"product_name": productName, "device_name": deviceName}, function(err, device) {
        if (err) res.send(err)
        else {
            if (device!=null) {
                Connection.find({device: device._id}, function (_, connections) {
                    res.json(Object.assign(device.toJSONObject(), {
                        connections: connections.map(function (conn) {
                            return conn.toJSONObject()
                        })
                    }))
                })
            }
            else res.status(404).json({error: "Not Found"})
        }
    })
})

// 多个设备信息查询
router.get("/:productName", function(req, res) {
    var productName = req.params.productName
    Device.find({"product_name": productName}, function(err, devices) {
        if (err) res.send(err)
        else res.json(devices.map(function(device) {
            return device.toJSONObject()
        }))
    })
})

module.exports = router