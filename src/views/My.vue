<template>
  <div id="my-page-body">


  </div>
</template>
<script>
import {api} from '@/api'
import cookie from '@/utils/cookie'

export default {
    name: 'my',
    data () {
        return {
            myresumes: [],
            myLike: [],

        }
    },
    created () {
        this.getMyResumes()
    },
    methods: {
        async getMyResumes () {
            let token = cookie.getItem('auth_token')
            let config = {
                headers: { 'authorization': token}
            }
            let res = await api('get', '/resume/myresumes', null, config)

            if(res.code === 0) {
                console.log(res)

                this.myresumes = res.data
            }
        },
    },
}
</script>

<style scoped>
    
</style>