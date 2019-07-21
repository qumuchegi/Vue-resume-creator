<template>
  <div id='regioster-body'>
    <Form label-position="right" :label-width="0" id="register-form">
      <h2>注册 Resumer</h2>
      <div id='form-input'>
        <FormItem  >
          <Input v-model="name" class="input" placeholder="用户名"></Input>
        </FormItem>
        <FormItem  >
          <Input v-model="password1" class="input" placeholder="密码" type="password"></Input>
        </FormItem>
        <FormItem  >
          <Input v-model="password2" class="input" placeholder="请在输入密码" type="password"></Input>
        </FormItem>
        <label for='upload-img'>
          <div id='upload-botton'>上传头像</div>
          <img :src="willUploadImgBase64" id='user-avatar'/>
          <input type='file' id='upload-img' @change="readImg" ref='fileInput' accept="image/png, image/jpeg,image/gif"/>
        </label>
      </div>
      <Button type='primary' width="100px" long @click="register">注册</Button>
      <Divider/>
      <div id='botton'>
        已经有账号 ？ 
        <router-link to="/login">去登录</router-link>
      </div>
    </Form>
  </div> 
</template>
<script>
import {api} from '@/api'

export default {
    name: 'register',
    data () {
        return {
            name: '',
            password1: '',
            password2: '',
            willUploadImg: '', // 用于存放在后端
            willUploadImgBase64: '' // 用于本地显示
        }
    },
    watch: {
        
    },
    methods: {
        async register () {
            if( this.password1 !== this.password2) return alert('密码不一致！')
            if( !(this.name || this.password1 || this.password2 || this.willUploadImg)) return alert('请填写完整！') 
            let formData = new FormData()
            
            formData.append('username', this.name)
            formData.append('password', this.password1)
            formData.append('userAvatar', this.willUploadImg)
            
           console.log(formData)
           
           if (formData) {
                let res = await api( 
                'post', 
                '/user/register', 
                formData,
                {headers: { 'Content-Type': 'multipart/form-data' }}
                )
                if ( res.code === 1) {
                    console.log( res.msg )
                } else {
                    console.log( '注册成功' )
                }
           }
        },
        readImg () {
            let reader = new FileReader()
            let blob = this.$refs.fileInput.files[0]
            console.log(blob)
            this.willUploadImg = blob

            reader.readAsDataURL(blob)
            let _this = this
            reader.onload = function () {
                _this.willUploadImgBase64 = this.result
            }
        }
    }
}
</script>

<style scoped>
#regioster-body{
    width:100%;
    height: 100%;
    background-color: #666;
}
#register-form{
    width: 500px;
    margin: auto;
    padding:50px 50px;
    background-color: rgb(173, 236, 144);
}
#register-form h2{
    text-align: center;
    font-size: 2rem;

}
#register-form #form-input{
    margin-top: 100px;
}
#upload-img{
    display: none;
}
#upload-botton{
    width:100%;
    background-color: aliceblue;
    margin:10px 0;
    text-align: center;
}
#user-avatar{
    display: block;
    width:200px;
    margin: 10px auto;
}
</style>