<template>
  <div id='login-body'>
    <Form label-position="right" :label-width="60" id="form">
        <h3>登录 Resumer</h3>
        <div id='form-input'>
          <FormItem  >
            <Input v-model="name" class="input" placeholder="用户名"></Input>
          </FormItem>
          <FormItem  >
            <Input v-model="password" class="input" type="password" placeholder="密码"></Input>
          </FormItem>
        </div>
        <div id='botton'>
          <Button type='primary' width="100px" long @click="login" :disabled='loginDisable'>登录</Button>
          <Divider/>
          <a href="https://github.com/login/oauth/authorize?client_id=ce3a2fec7c726e1a38b4"
             @click="loginDisable=true"
             id="github-login-link"
               >
               <Poptip trigger="hover" content="使用 github 登录">
                    <img src='../assets/GitHub.png'>
                </Poptip>
          </a>
          <div id="to-register">
              还没有注册 ？ 
              <router-link to="/register">去注册</router-link>
          </div>
        </div>
    </Form>
  </div>
</template>
<script>
import {api} from '@/api'
import cookie from '@/utils/cookie'

export default {
    name: 'login',
    data () {
        return {
            name:'',
            password: '',
            loginDisable: false,
        }
    },
    methods: {
        async login(){
            if(!(this.name || this.password)) return alert('请填写登录信息')

            let res = await api(
                'post',
                '/user/loginbypassword',
                {
                    username: this.name,
                    password: this.password
                }
            )
            if ( res.code === 0) {
                console.log(res.msg)
                cookie.setItem('auth_token', res.user.JWT_token)
                cookie.setItem('userID', res.user._id.replace('j:\"','').replace('\"',''))
                cookie.setItem('userAvatar', 'http://115.220.10.182:80/' + res.user.avatarSrc.replace('assets/user-avatar/', ''))
                cookie.setItem('username', res.user.name)
                this.$router.push('/')
            }
        }
    }
}
</script>

<style scoped>
    #login-body{
        width:100%;
        height: 100%;
        background-color: #666;
    }
    #form{
        width:500px;
        height: 600px;
        margin:auto;
        background-color: rgb(173, 236, 144);
        padding:50px 40px;
    }
    #form h3{
        font-size: 2rem;
        font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        text-align: center;
    }
    #form-input{
        margin-top:100px;
    }
    #form .input{
        width:300px
    }
    #github-login-link{
        font-size: 1.2rem
    }
    #github-login-link img{
        width:30px;
    }
    #botton{
        width:300px;
        margin:auto;
    }
    #to-register{
        
    }
</style>