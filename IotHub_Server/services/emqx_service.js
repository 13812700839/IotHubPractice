// IotHub_Server/services/emqx_service.js

'use strict'

require('dotenv').config()

const { config } = require('dotenv')
const request = require('request')

class EMQXService {
    static disconnectClient(clientid) {
        // v3
        // const apiUrl = `${process.env.EMQX_API_URL}/connections/${clientid}`
        // const apiUrl = process.env.EMQX_API_URL+'/connections/'+clientid
        // v4
        // const apiUrl = `${process.env.EMQX_API_URL}/clients/${clientid}`
        const apiUrl = process.env.EMQX_API_URL+'/clients/'+clientid
        console.log(apiUrl)
        request.delete(apiUrl, {
            'auth': {
                'user': process.env.EMQX_APP_ID,
                'pass': process.env.EMQX_APP_SECRET,
                'sendImmediately': true
            }
        }, function (error, response, body) {
            console.log('statusCode:', response && response.statusCode)
            console.log('body:', body)
        })
    }
}

module.exports = EMQXService