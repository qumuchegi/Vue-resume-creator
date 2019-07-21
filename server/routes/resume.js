/* eslint-disable no-console */
const mongoose = require('mongoose')
const router = require('express').Router()
const async = require('async')
 
const {getModel} = require('../db')
const ResumeModel = getModel('resume')
const UserModel = getModel('user')
const uploadFile = require('../middleweres/multer')
const saveNewResume = require('../middleweres/saveNewResume')
const OAuth = require('../middleweres/OAuth')
const JWT_auth = require('../middleweres/jwtAuth')

router.post('/', saveNewResume, (req, res )=>{
    const resData = req.resData
    res.json(resData)
})

router.get('/', async (req, res, next) => {
    let {pageNum, pageSize} = req.query

    console.log(pageNum,pageSize)

    pageNum = Number(pageNum)
    pageSize = Number(pageSize)

    ResumeModel.find({})
    .skip( (pageNum-1)*pageSize )
    .limit(pageSize)
    .populate('authorID')
    .exec(async (err, limitedResumes)=>{
        if(err) return next(err)
        let totalNum 
        await ResumeModel.find({}).exec(
            (err, allresumes) => {
                if (!err) {
                    totalNum = allresumes.length

                    let data = {
                        resumes: limitedResumes,
                        totalNum
                    }
                    res.json({code:0, data})
                }
            })
    }
    )
        
})
 
router.get('/myresumes', OAuth,JWT_auth, (req,res) => {
    const username = req.username
    let userID

    async.series(
        [ getUserID, getResumes ],
        (err, result) => {
            res.json({code:0, data: result[1]})
        }
    )

    function getUserID (cb) {
        UserModel
        .findOne({name: username})
        .exec((err,user) => {
            if(user) {
                userID = user._id
                cb(null, userID)
            }
        })
    }

    function getResumes (cb) {
        ResumeModel
        .find({authorID: userID})
        .exec((err, resumes) => {
            if(resumes) {
               
                cb(null, resumes)
            }
        })
    }
    

})
router.post('/pubnewresume', saveNewResume, (req, res )=>{
    const resData = req.resData
    res.json(resData)
  }
)

router.post('/uploadimg', uploadFile('server/assets/resume-img').any(), ( req, res ) => {
    const resumeImg = req.files[0]
    
    res.json({code:0, msg: '插入图片上传成功', data: resumeImg.path})
    
})

router.post(
    '/like',
    (req,res) => {
        const {likeResumeID, userID, likeDate} = req.body
        
        ResumeModel.findOne({_id: likeResumeID})
        .exec((err, resume) => {
            if (resume) {
                let arr = []
                arr = resume.likeNum

                if( arr.some(e => e.userID===userID)) return res.json({code:1 , mag: '已经收藏过了'})
                Array.prototype.push.call(arr, {
                    userID,
                    likeDate
                })
                 
                resume.likeNum = arr

                resume.markModified('likeNum')

                resume.save((err) => {
                    if (!err) {
                        res.json({code:0, mag: '收藏成功'})
                    }
                })
            }
        })
    }
)
module.exports = router