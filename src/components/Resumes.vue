<template>
  <div id="my-resumes-body">
    <div v-if="!loadingMyLikeResumes && !loadingMyResumes && Resumes.length===0" id='no-my-resumes'>
        <img src="../assets/sad-4.png"/>
        <div>没有数据</div>
    </div>
    <div v-if="loadingMyLikeResumes || loadingMyResumes" id='loading'>
      <img src="../assets/loading.png"/>
    </div>
    <div class="my-resume-item" v-for="resume in Resumes" :key="resume._id">
      <div v-html="md2html(resume.mdContent)" class='content'></div>
      <div class="sample-info"> 
        <div class="author-avatar">
          <img :src=" resume.authorID.avatarSrc.match(/https:\/\//) ? resume.authorID.avatarSrc : 'http://115.220.10.182:80/'+resume.authorID.avatarSrc.replace('assets/user-avatar/','')"/>
        </div>
        <div class='pub-time'>
          <span class="key">发布</span>
          <span class="value">{{resume.pubTime}}</span>
        </div>
        <div class='last-modify-time'>
          <span class='key'>上次修改</span>
          <span class="value">{{resume.lastModify}}</span>
        </div>
        <div class='like'>
          <i class='fas fa-heart'></i>
          <span>{{resume.likeNum.length}}</span>
        </div>
        <div id="modify-botton" v-if="resume.authorID._id === myID">
          <span @click="toModify(resume._id, resume.mdContent)">
            <i class="fas fa-cogs"></i>
            修改
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cookie from '@/utils/cookie'
import MarkdownIt from 'markdown-it'
let md = new MarkdownIt().set({ html: true, breaks: true })

export default {
    name:'my-resumes',

    props:{
        Resumes: Array,
        loadingMyLikeResumes: Boolean,
        loadingMyResumes: Boolean
    },

    data () {
        return {
            modifiedContent: '',
            myID: cookie.getItem('userID').replace('j:\"','').replace('\"','')
        }
    },

    methods: {
        md2html(mdContent) {
            return md.render(mdContent)
        },

        toModify(resumeID, mdContent) {
            this.$store.commit({
                type: 'setModify_mdContent',
                willModify_mdContent: mdContent
            })
            this.$router.push(`/modify/${resumeID}`)
        }
    },
}
</script>

<style scoped>
#my-resumes-body{
    
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
@keyframes rotateLoading {
    from{transform: rotate(0)}
    to{transform: rotate(360deg)}
}
#loading{
   width:100%;
}
#loading img{
    display: block;
    animation: rotateLoading 2s infinite;
    width:100px;
    margin: auto;
}
#no-my-resumes{
    width:300px;
    margin:auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 130%;
}
.my-resume-item{
    flex:1;
    margin:20px;
}
.my-resume-item:hover{
    
}
.my-resume-item .content{
    background-color: rgb(245, 242, 239);
    border:solid 1px #bbb;
    width:600px;
    margin: auto;
    padding: 10px;
    height: 620px;
    overflow: scroll;
}
.sample-info{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width:600px;
    margin: auto;
    font-size: 110%;
    padding:10px;
}
.sample-info>div{
    margin: 2px 10px;
}
.author-avatar img{
  width:30px;
  height: 30px;
  border-radius: 5px;
}
.key{
    font-weight: bold;
    color:black;
    margin-right: 5px;
}
#modify-botton{
    border:solid 1px #bbb;
    border-radius: 4px;
    padding:2px;
}
#modify-botton:hover{
    cursor: pointer;
    color:rgb(69, 175, 20);
}
</style>

