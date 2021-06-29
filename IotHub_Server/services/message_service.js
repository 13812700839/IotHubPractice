// IotHub_Server/services/message_service.js

const pathToRegexp = require('path-to-regexp')
const redisClient = require('../models/redis')
var Message = require('../models/message')

class MessageService {
    // 提取元数据
    static dispathMessage({topic, payload, ts} = {}) {
        var dataTopicRule = 'upload_data/:productName/:deviceName/:dataType/:messageId'
        const topicRegx = pathToRegexp(dataTopicRule)
        var result = null
        if ((result = topicRegx.exec(topic)) != null) {
            var productName = result[1]
            var deviceName = result[2]
            var dataType = result[3]
            var messageId = result[4]

            console.log('productName :>> ', productName);
            console.log('sdeviceName :>> ', deviceName);
            console.log('dataType :>> ', dataType);
            console.log('messageId :>> ', messageId);

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
    }
}

module.exports = MessageService