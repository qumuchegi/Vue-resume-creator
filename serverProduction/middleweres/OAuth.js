/* eslint-disable no-console */
const axios = require('axios')

const OAuth=async (req,res,next)=>{
    let OAuth_token = req.headers["authorization"]
    let userID = req.body.userID

    console.log('OAuth 中间件拿到cookie中的token：',OAuth_token)
    if(OAuth_token) {
        let github_API_userInfo
        try {
            let token = OAuth_token.split('=')[1].replace('&scope','')
            console.log(token)
            github_API_userInfo = await axios.get(`https://api.github.com/user?access_token=${token}`)
            console.log('OAuth 验证成功')
            let username = github_API_userInfo.data.name
            req.username = username
            req.userID = userID // 用以后面查询到简历时比较简历的作者和当前欲修改简历的用户ID
            
            next()
        } catch (err) {
            console.log('走JWT')
            next() // 有 token 但是不是 github 签发的，那就是 JWT token，交给 JWT 来验证
        }
    }
    else {
        console.log('没有token')
        res.status(401)
        res.end()
    }
}
module.exports = OAuth