<template>
  <div id="my-page-body">
    <div id='header'>
      <div>
        <h2>我的主页</h2>
        <img :src="myAvatar"/>
      </div>
      <div>
        <h1>Resume creator</h1>
      </div>
    </div>
    <div id="content">
      <Tabs type="card" value='1' @on-click="onChangeTab">
        <TabPane label='我的简历' name='1'>
          <Resume :Resumes="myresumes"/>
        </TabPane>
        <TabPane label="我喜欢的简历" anme='2'>
          <Resume :resumes="myLikeResumes"/>
        </TabPane>
      </Tabs>
    </div>
    

  </div>
</template>
<script>
import {api} from '@/api'
import cookie from '@/utils/cookie'

import Resume from '@/components/Resumes'

export default {
    name: 'my',
    components:{
        Resume
    },
    data () {
        return {
            myname: cookie.getItem('username'),
            myAvatar: cookie.getItem('userAvatar'),
            myresumes: [],
            myLikeResumes: [],

        }
    },
    created () {
        this.getMyResumes()
        this.getMyLike()
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

        async getMyLike () {
            let userID = cookie.getItem('userID').replace('j:\"','').replace('\"','')

            let res = await api('get', '/resume/mylike', {userID})

            if (res.code === 0) {
                this.myLikeResumes = res.data
            }
        },

        onChangeTab (tabName) {

        }
    },
}
</script>

<style scoped>
#header{
    padding:20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
#header>div:first-child{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
#header>div:first-child img {
    width:40px;
    border-radius: 40px;
    height: 40px;
    margin:0 20px;
}
#header h1{
    color:rgb(69, 175, 20) ;
}
#content{
    margin: 10px 20px;
}
#my-resumes{
    
}
</style>