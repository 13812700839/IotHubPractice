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
    var brokerUsername = productName+'_'+deviceName

    var device = new Device({
        product_name: productName,
        device_name: deviceName,
        secret: secret,
        broker_username: brokerUsername,
        status: 'active'
    })

    device.save(function (err) {
        if (err) res.status(500).send(err)
        else res.json({product_name: productName, device_name: deviceName, secret: secret})
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

// 禁用设备
router.put('/:productName/:deviceName/suspend', function (req, res){
    var productName = req.params.productName
    var deviceName = req.params.deviceName
    Device.findOneAndUpdate({"product_name": productName, "device_name": deviceName}, 
    {status: "suspended"}, {useFindAndModify: false}).exec(function (err, device){
        if (err) res.send(err)
        else{
            if (device != null) device.disconnect()
            res.status(200).send("ok")
        }
    })
})

// 恢复设备
router.put('/:productName/:deviceName/resume', function (req, res){
    var productName = req.params.productName
    var deviceName = req.params.deviceName
    Device.findOneAndUpdate({"product_name": productName, "device_name": deviceName}, 
    {status: "active"}, {useFindAndModify: false}, function (err) {  
        if (err) res.send(err)
        else res.status(200).send('ok')
    })
})

// 设备删除
router.delete('/:productName/:deviceName', function (req, res){
    var productName = req.params.productName
    var deviceName = req.params.deviceName
    Device.findOne({"product_name": productName, "device_name": deviceName}).exec(function (err, device) {  
        if (err) res.send(err)
        else {
            if (device !=null){
                device.remove()
                device.disconnect()
                res.status(200).send("ok")
            } else res.status(404).json({error: "Not Found"})
        }
    })
})

module.exports = router