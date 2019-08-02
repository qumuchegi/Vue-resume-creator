<template>
  <Layout class="home">
      <div id="mobile-hide">
          <h1>Resume creator</h1>
          <h2>移动平台不方便简历的制作，请移到桌面查看</h2>
      </div>
    <Header class="home-header">
      <div>
        <h2>Resume Creator</h2>
        <img src="../assets/display-arrow-left.png" 
             style="width:30px" 
             @click="onCollapseSider" 
             :class="isCollapsed ? 'right':'left'"/>
      </div>
      <div>
        <div v-if="username" id="user-avatar">
          <Dropdown trigger='click' transfer>
            <a href="javascript:void(0)">
              <img v-if="userAvatarBase64" :src="userAvatarBase64" />
              <i v-if="!userAvatarBase64" class="fab fa-github-alt fa-2x"></i>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>
                <div @click="toMyPage">
                  我的主页
                </div>
              </DropdownItem>
              <DropdownItem> 
                <div @click="logout">
                    <div  id='logout-botton'><span>退登</span><i class="fas fa-sign-out-alt"></i></div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div id='username'>{{username}}</div>
        </div>
        <div v-else id='links'>
          <router-link to="/register">
            <i class="fas fa-registered"></i>
            注册
          </router-link> /
          <router-link to="/login">
            <i class="fas fa-sign-in-alt"></i>
            登录
          </router-link>
        </div>
      </div>
    </Header>
    <Layout id="layout-2">
        <Sider id="sider" ref="siderMenu" collapsible  v-model="isCollapsed" hide-trigger collapsed-width="0">
          <Menu  id='menu' width="200px" active-name="selectMenuItemName" @on-select="onSelecMenuItem" :class="isCollapsed ? 'menu-hide':'menu-show'">
              <MenuItem name="1" to="/" :class="selectMenuItemName==1 ? 'selected-menu-item':'no-select-menu-item'">
                <img src='../assets/market-2.png' v-if="selectMenuItemName==1" class="menu-icon"/>
                <img src='../assets/market-1.png' v-if="selectMenuItemName!=1"class="menu-icon"/>
                简历市场
              </MenuItem>
              <MenuItem name="2" to="/edit" :class="selectMenuItemName==2 ? 'selected-menu-item':'no-select-menu-item'">
                <img src='../assets/edit-2.png' v-if="selectMenuItemName==2" class="menu-icon"/>
                <img src='../assets/edit-1.png' v-if="selectMenuItemName!=2" class="menu-icon"/>
                编辑简历
              </MenuItem>
          </Menu>
          <div id='dev-info' :class="isCollapsed ? 'dev-info-hide':'dev-info-show'">
            <h2>开发者信息</h2>
            <a href="https://github.com/qumuchegi">GitHub</a>
            <a href="https://qumuchegi.github.io/">个人主页</a>
          </div>
        </Sider>
        <Content :class="{contentLargest: isCollapsed,contentSmall: !isCollapsed}">
          <router-view></router-view>
        </Content>
    </Layout>
  </Layout>
</template>

<script>
// @ is an alias to /src
import {api} from '@/api'
import cookie from '@/utils/cookie'

export default {
  name: 'home',
  data () {
    return{
      resumes: [],
      username: null,
      userAvatar: null,
      userAvatarBase64: null,
      selectMenuItemName: 1,
      isCollapsed: false
    }
  },
  computed: {
      
  },
  created () {
    this.$route.path == '/edit' ? this.selectMenuItemName = '2' : this.selectMenuItemName = '1'
    this.readCookies('userAvatar')
    this.readCookies('username')
    this.loadImg(this.userAvatar)
  },
  methods: {
    
    onCollapseSider () {
      this.$refs.siderMenu.toggleCollapse();
    },

    readCookies (key) {
      if(!document.cookie) return
      let cookiesArr = document.cookie.split(';')
      let cookiesObj = {}

      cookiesArr.forEach(kv => {
        let [k, v] = kv.split('=')

        Object.defineProperty( cookiesObj,  
          k.replace(/\s*(\w*)\s*/,'$1'), 
          {
            value: v
          }
        )
      })
      //console.log(cookiesObj)
      this[key] = decodeURIComponent( cookiesObj[key] )
    },

    logout () {
     cookie.removeItem('userAvatar')
     cookie.removeItem('username')
     cookie.removeItem('auth_token')
     cookie.removeItem('userID')

     this.userAvatar = null
     this.username = null
    },

    async loadImg (url) {
      let res = await api('get', url, null, {responseType: 'blob'})
      var reader  = new FileReader();
      reader.readAsDataURL(res)
      let _this = this
      reader.onload = function () {
         _this.userAvatarBase64 = this.result
      }
    },

    onSelecMenuItem (name) {
      console.log(name)
      this.selectMenuItemName = name
    },

    toMyPage () {
      this.$router.push('/my')
    }
  },
}
</script>

<style scoped>
@media screen and (max-width:700px) {
  #mobile-hide{
      width:100vw;
      height:100vh;
      position: absolute;
      z-index: 10000;
      background-color: white;
  }
  #mobile-hide h1,h2{
    text-align: center;
  }
}
@media screen and (min-width:700px){
  #mobile-hide{
    display: none
  }
}
.home-header{
  display: flex;
  justify-content: space-between;
  background-color: white;
  color:rgb(173, 236, 144);
  height:8vh;
  background-color: white;
  margin:0;
  color:black;
  border-block-end: solid 1.2px #bbb;
}
.home-header>div:first-child{
  display: flex;
  align-items: center;
  width:300px;
}
.home-header>div:first-child img:hover{
  opacity: .7;
}
.home-header>div:first-child img.right{
  transform: scaleX(-1)
}
.home-header h2{
  margin: 0 10px;
  color:rgb(69, 175, 20);
}
#user-avatar{
  width: 200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
#user-avatar img{
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 40px
}
#links{
  font-size: 0.9rem
}
#sider{
   position: fixed;
   height: 100%;
   width:200px;
   background-color: white;
   box-shadow: 5px 10px 10px #888
}
#menu{
  height: 100px;
  margin:0;
}
.menu-hide{
  transform: translateX(-100%);
  transition: transform 1s;
}
.menu-show{
  transform: translateX(0%);
  transition: transform 0.2s ;
}
.contentSmall{
  margin-left: 200px;
  transition: transform 2s;
  height: 92vh;
}
.contentLargest{
  margin-left: 0px;
}
#logout-botton{
  color: rgba(112,23,34);
  font-size: 0.9rem
}
#logout-botton span:hover{
  cursor: pointer;
  color:black;
}
.input{
  width:300px;
}
.selected-menu-item{
  display: flex;
  align-items: center;
  background-color: rgb(69, 175, 20) !important;
  color:white !important;
}
.no-select-menu-item{
  display: flex;
  align-items: center;
}
.no-select-menu-item:hover{
  
  color:rgb(69, 175, 20) !important;
}
.menu-icon{
  width:20px
}
#dev-info{
  
  position: absolute;
  bottom: 0rem;
  
  padding:0.5rem;
  width:100%;
  height: 10rem;
}
#dev-info a{
  display: block;
}
.dev-info-hide{
  display: none
}
.dev-info-show{
  display: block
}
</style>
