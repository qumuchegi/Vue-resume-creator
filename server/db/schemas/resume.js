const mongoose = require('mongoose')
const {Schema} = mongoose
const ObjectId = mongoose.SchemaTypes.ObjectId
const Mixed = Schema.Types.Mixed

const resumeSchema = new Schema({
    public:Boolean,
    mdContent: String,
    authorID: {
        type: String,
        ref: 'user' // 填充 作者
    },
    imgSrc: { // 简历以 图像（png) 格式存储在服务器硬盘，数据库存储器路径
        type: String
    },
    createTime: {
        type: String,
        required: true
    },
    pubTime: {  
        type: String,
        required: false,
    },
    lastModify: {
        type: String,
        required: true
    },
    likeNum: {
        type: Array,
        default: []
    }
})

module.exports = resumeSchema