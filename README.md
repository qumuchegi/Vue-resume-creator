# vue-resume-creator
使用 Vue 制作的简历生成器

## 亮点

1. 后端结合使用 OAuth2.0 和 JWT 授权，OAuth 和 JWT_auth 是两个中间件，分别对 OAuth2.0 和 JWT 签发的 token 验证，其中 OAuth 验证成功就跳过 JWT_auth，失败则交给 JWT_auth 来验证：

```javascript
router.get('/myresumes', OAuth, JWT_auth, (req,res) =>{})
```
2. 前端使用 Vue + vue router + vuex；

3. 前端使用了一些 html 和图片、pdf 之间转换的库，对 HTML 的 Blob 、File API有了更深的理解。

## 开发

`npm run serve` 开启 Vue 前端构建服务

`npm run server` 开启后端 express 服务

## 预览
1. 可以使用密码登录，也可以使用 github 账号登录：

<img src="./imgs/login.png" width="500px"/>

2. 使用 markdown 编辑简历，并可以下载图片和pdf、分享：

<img src="./imgs/edit.png" width="500px"/>

3. 简历市场，可以发现其他人上传的简历并点赞收藏：

<img src="./imgs/market.png" width="500px"/>

