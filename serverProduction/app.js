/* eslint-disable no-console */
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'assets/user-avatar')))
app.use(express.static(path.join(__dirname, 'assets/resume-img')))

app.get('/', (req,res) => 
    res.send(require('./dist/index.html'))
)

const {routers} = require('./routes')
routers.forEach(r => {
    app.use(r.path, r.route)
});
 
app.listen(80, ()=>console.log('服务启动成功：80'))
