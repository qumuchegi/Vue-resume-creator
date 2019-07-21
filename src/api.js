/* eslint-disable no-console */
import axios from 'axios'
import qs from 'querystring'

const baseUrl = 'http://localhost:3001'
/*
axios.interceptors.request.use(config => {
    // 在 localStorage 获取 token
    let token = localStorage.getItem("token");
    console.log('axios配置:token',token)
    // 如果存在则设置请求头
    if(document.cookie){
        let OAtuh_token = unescape(document.cookie.split(';').filter(e=>/auth_token/.test(e))[0].replace(/auth_token=/,''))
        config.headers['Authorization'] = OAtuh_token;
        console.log(config)
    }
   
    return config;
});
*/
function resHandler (res) {
    const {status, data} = res
    
    return data
}
export const api = async (method, route, data, config={}) => {
     if (method === 'get') {
        let params = '?' + qs.stringify(data)
        if ( !route.match(/http/) ) {
            return resHandler( await axios.get( baseUrl + route + params, config))
        } else {
            return resHandler( await axios.get(route, config))
        }
     } else if(method === 'post') {
         return resHandler( await axios.post(baseUrl + route, data, config))
     }
}

