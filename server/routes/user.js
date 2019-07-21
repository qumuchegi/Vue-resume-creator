/* eslint-disable no-console */
const mongoose = require('mongoose')
const router = require('express').Router()
const axios = require('axios')

const {getModel} = require('../db')
const UserModel = getModel('user')
const uploadFile = require('../middleweres/multer')
const OAuth_config = require('../config').OAuth

router.post( 
    '/register', 
    uploadFile( 'server/assets/user-avatar' ).any(), 
    (req,res)=>{
        const userAvatar = req.files[0]
        const {
            username,
            password
        } = req.body
        console.log(username, password, userAvatar)

        UserModel.findOne({name: username})
        .exec((err,user)=>{
            if(user) return res.json({code:1, msg: '用户名已经注册'})
            new UserModel({
                name: username,
                password,
                avatarSrc: userAvatar.path
            }).save((err)=>{
                if(!err) return res.json({code:0})
            })
        })

    }
)

router.get( // 使用 github 账号登录（不用注册）
    '/gitlogin',

    async (req,res)=>{
        var code = req.query.code; // GitHub 回调传回 code 授权码
        console.log(code)
    
        // 带着 授权码code、client_id、client_secret 向 GitHub 认证服务器请求 token
        let res_token = await axios.post('https://github.com/login/oauth/access_token', 
            {
                client_id:OAuth_config.client_id,
                client_secret:OAuth_config.client_secret,
                code:code
            }
        )

        let token = res_token.data.split('=')[1].replace('&scope','')

        // 带着 token 从 GitHub 获取用户信息
        let github_API_userInfo = await axios.get(`https://api.github.com/user?access_token=${token}`)
        console.log('github 用户 API：',github_API_userInfo.data)

        let userInfo = github_API_userInfo.data

        UserModel.findOne({name: userInfo.name})
        .exec((err,user)=>{
            if(user) {
                res.cookie('userID', user._id)
                res.cookie('auth_token',res_token.data)
                res.cookie('userAvatar',user.avatarSrc)
                res.cookie('username', user.name)
                //'已经使用过GitHub账号登录过'
                res.redirect(301,'http://localhost:8080')
            } else 
            new UserModel({
                id: mongoose.Types.ObjectId(),
                name: userInfo.name,
                avatarSrc: userInfo.avatar_url
            }).save((err,user) => {
                if(!err) {
                    res.cookie('userID', user._id)
                    res.cookie('auth_token',res_token.data)
                    res.cookie('userAvatar',user.avatarSrc)
                    res.cookie('username', user.name)
                
                    res.redirect(301,'http://localhost:8080') // 从GitHub的登录跳转回我们的客户端页面
                }
            })
        })
    }
)

router.post( // 使用注册的密码登录
    '/loginbypassword',
    (req,res)=>{
        const {username,password} = req.body

        UserModel.findOne({name: username})
        .exec((err,user) => {
            if (!err) {
                if (user.password === password) {
                    console.log(user)
                    
                    res.json({code: 0,user, msg: '使用密码登录成功'})
                } else {
                    res.json({code: 1, msg: '密码错误'})
                }
            } else {
                res.json({code:2, msg: '用户名不存在'})
            }
        })
    }
)
module.exports = router