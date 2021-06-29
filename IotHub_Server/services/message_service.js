// IotHub_Server/services/message_service.js

const pathToRegexp = require('path-to-regexp')
const redisClient = require('../models/redis')
var Message = require('../models/message')
const NotifyService = require('./notify_service')
var Device = require('../models/device')

class MessageService {
    // 提取元数据
    static dispathMessage({topic, payload, ts} = {}) {
        var dataTopicRule = 'upload_data/:productName/:deviceName/:dataType/:messageId'
        var statusTopicRule = 'update_status/:productName/:deviceName/:messageId'
        const topicRegx = pathToRegexp(dataTopicRule)
        const statusRegx = pathToRegexp(statusTopicRule)
        var result = null
        if ((result = topicRegx.exec(topic)) != null) {
            // 处理上报数据
            this.checkMessageDuplication(result[4], function (isDup) {  
                if (!isDup) {
                    MessageService.handleUploadData({
                        productName: result[1],
                        deviceName: result[2],
                        dataType: result[3],
                        messageId: result[4],
                        ts: ts,
                        payload: Buffer.from(payload, 'base64')
                    })
                }
            })
        } else if ((result = statusRegx.exec(topic))!= null) {
            // 处理状态数据
            this.checkMessageDuplication(result[3], function (isDup) {  
                if(!isDup) {
                    MessageService.handleUpdateStatus({
                        productName: result[1],
                        deviceName: result[2],
                        deviceStatus: new Buffer(payload, 'base64').toString(),
                        ts: ts
                    })
                }
            })
        }
    }

    // 消息去重
    static checkMessageDuplication(messageId, callback) {
        // var key = `/messageIDs/${messageId}`
        var key = '/messageIDs/'+messageId
        redisClient.setnx(key, '', function (err, res) {  
            if (res == 1) {
                redisClient.expire(key, 60*60*6)
                callback.call(this, false)
            } else callback.call(this, true)
        })
    }

    // 消息存储
    static handleUploadData({productName, deviceName, ts, payload, messageId, dataType} = {}) {
        var message = new Message({
            product_name: productName,
            device_name: deviceName,
            payload: payload,
            message_id: messageId,
            data_type: dataType,
            sent_at: ts
        })

        message.save()
        NotifyService.notifyUploadData(message)
    }

    static handleUpdateStatus({productName, deviceName, deviceStatus, ts}) {
        Device.findOneAndUpdate({product_name: productName, device_name: deviceName, 
            '$or':[{last_status_update: {'$exists': false}}, {last_status_update: {'$lt':ts}}]},
            {device_status: deviceStatus, last_status_update: ts}, {useFindAndModify: false}).exec(function (error, device) {  
                if (device != null) {
                    NotifyService.notifyUpdateStatus({
                        productName: productName,
                        deviceName: deviceName,
                        deviceStatus: deviceStatus
                    })
                }
            })
    }
}

module.exports = MessageService