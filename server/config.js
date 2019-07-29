module.exports = {
    dbURL: 'mongodb://localhost:27017/resumecreator',
    OAuth: {// 从 GitHub Auth 申请到的，用于 OAuth2.0 授权
        githubAuthToken: 'https://github.com/login/oauth/access_token',
        githubUserApi: 'https://api.github.com/user?access_token=',
        client_id:'ce3a2fec7c726e1a38b4',  
        client_secret:'67a5cde7ff81f4a5d7bb59b1fff9047d516b59d4'
    },
    JWT_config: {
        secret: 'qumuchegi',
        algorithm:'HS256'
    }
}