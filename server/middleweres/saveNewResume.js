/* eslint-disable no-console */
const mongoose = require('mongoose')
const {getModel} = require('../db')
const ResumeModel = getModel('resume')

const saveNewResume = (req, res, next) => {
    let { 
        mdContent,
        authorID, 
        resumeCreatedTime,
        isPublic
    } = req.body
    authorID = authorID.replace('j:"','').replace('"','')
    

    if (!isPublic) isPublic = false

    ResumeModel.findOne({mdContent})
    .exec((err, resume)=>{
        if (!resume) {
            new ResumeModel({
                authorID,
                mdContent,
                public:isPublic,
                createTime: resumeCreatedTime,
                pubTime: resumeCreatedTime,
                lastModify: resumeCreatedTime
            }).save((err, resume)=>{
                if(resume) {
                    let resData = {code:0, msg: '简历成功入库并保存路径到数据库'}
                    req.resData = resData
                    next()
                }
                //return res.json({code:0, msg: '简历成功入库并保存路径到数据库'})
                else {
                    let resData = {code:2, msg: '数据库写入出错'}
                    req.resData = resData
                    next()
                    //res.json({code:2, msg: '图片已经入库，但是数据库写入出错'})
                }
            })
        } else {
            let resData = {code:1, msg: '已经上传相同简历'}
            req.resData = resData
            next()
        }
        //res.send({code:1, msg: '已经上传相同简历'})
    })
}

module.exports = saveNewResume