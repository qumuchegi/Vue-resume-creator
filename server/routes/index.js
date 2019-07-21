const userRouter = require('./user')
const resumeRouter = require('./resume')

module.exports = {
    routers:[
        {
            path: '/user',
            route: userRouter
        },
        {
            path: '/resume',
            route: resumeRouter
        }
    ]
}