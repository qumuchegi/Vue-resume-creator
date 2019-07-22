/* eslint-disable no-console */
const JWT = require('jsonwebtoken')
const secret = require('../config').JWT_config.secret
const algorithm = require('../config').JWT_config.algorithm

const JWT_auth = (req, res, next) => {
   
    if('username' in req) {
        console.log('跳过 JWT 验证')
        return next() // 如果有username，说明前面的 OAuth 中间件已经验证成功，跳过 JWT 验证
    }

    const  JWT_token = req.headers["authorization"]
    if (JWT_token) try {
        JWT.verify(JWT_token, secret, {algorithm}, (err, decoded) => {
            if(err) {
                console.log(err)
                next(err)
            } else {
                console.log(decoded)
                req.username = decoded.username // 在 req 上添加 username,以便于传到下一个中间件取出 username 来查询数据库
                req.userID = decoded.userid // 用以后面查询到简历时比较简历的作者和当前欲修改简历的用户ID

                next()
            }
        })
    } catch (err) {
        res.status(401).send('未授权')
    }

    else {
        res.status(401).send('未授权')
    }

}

module.exports = JWT_auth