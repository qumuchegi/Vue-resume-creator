/* eslint-disable no-console */
import axios from 'axios'
import qs from 'querystring'

const baseUrl = 'http://localhost:3001'
 
function resHandler (res) {
    const {status, data} = res
    
    return data
}
export const api = async (method, route, data, config={}) => {
     if (method === 'get') {
        let params = ( data ? '?': '' )+ qs.stringify(data)
        if ( !route.match(/http/) ) {
            return resHandler( await axios.get( baseUrl + route + params, config))
        } else {
            return resHandler( await axios.get(route, config))
        }
     } else if(method === 'post') {
         return resHandler( await axios.post(baseUrl + route, data, config))
     }
}

