/* eslint-disable no-console */
const user = require('./schemas/user')
const resume = require('./schemas/resume')
const mongoose = require('mongoose')

const model = mongoose.model

// 连接数据库
const {dbURL} = require('../config')
mongoose.connect(dbURL,err=>console.log(err))
// 编译模版
model('user',user)
model('resume',resume)



module.exports = { 
    getModel: (modelName)=>{
        return model(modelName)
    }
}