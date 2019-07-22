<template>
 <div>
  <div id='market-body'>
    <div v-for="resume in resumes" :key='resume.id' class="resume-item">
      <div class='image-resume' >
        <div class='content' v-html="md2html(resume.mdContent)" v-if="viewMDID !== resume._id"></div>
        <!--<img :src="getResumeImageDataURL(resume.id)"/>-->
        <div :class="viewMDID == resume._id ? 'show-MD-content':'hide-MD-content'">
            {{resume.mdContent}}
        </div>
      </div>
      <div class="info">
        <div>
          <div class='author-info'>
            <img :src="resume.authorID.avatarSrc"/>
            <div class='value'>{{resume.authorID.name}}</div>
            <div class="user-opertions">
              <span @click="viewMD(resume._id)" v-if="viewMDID !== resume._id">看markdown原文</span>
              <span @click="viewHtml(resume._id)" v-if="viewMDID == resume._id">看渲染结果</span>
              <span @click="like(resume._id)">
                <i :class="likeResumeID.some(e => e == resume._id) || resume.likeNum.some(ev=>ev.userID == userID ) ? 'fas fa-heart like':'fas fa-heart'"></i>
                <span>{{ likeResumeID.some(e=>e===resume._id) ? resume.likeNum.length + 1 : resume.likeNum.length}}</span>
              </span>
            </div>
          </div>
          <div class='pub-time'>
              {{resume.pubTime}}
          </div>
        </div>
      </div>
    </div> 
     
  </div>
  <div id='page-control'>
    <Page :total="totalNum"  page-size="pageSize" show-elevator show-total @on-change="onChangePage"/>
  </div>  
 </div>
</template>
<script>
import {api} from '@/api'
import MarkdownIt from 'markdown-it'
let md = new MarkdownIt().set({ html: true, breaks: true })
import html2Canvas from 'html2canvas'
import cookie from '@/utils/cookie'

export default {
    name: 'marketplace',
    data () {
        return {
            userID:cookie.getItem('userID').replace('j:\"','').replace('\"',''),
            totalNum: Number,
            resumes: [],
            resume_images_dataurl: [],
            pageNum: 1,
            pageSize: 3,
            selectedResumeContent: '',
            likeResumeID: [],
            viewMDID: ''
        }
    },
    
    created() {
        this.getAllResumes( this.scaleImg )
        console.log(this.userID)
    },
    beforeMount() {
       
    },
    mounted() {
        this.scaleImg()
    },
    methods: {
        async getAllResumes () {
            let res = await api('get', '/resume', {pageNum: this.pageNum, pageSize: this.pageSize})

            if (res.code === 0) {
                console.log(res.data.resumes)
                this.totalNum = res.data.totalNum 
                this.resumes = res.data.resumes
            }
        },

        md2html (mdContent) {
            return md.render(mdContent)
        },

        scaleImg () {
            let imgContainers = document.getElementsByClassName('image-resume')
            //console.log(imgContainers)
            for (let i=0; i < imgContainers.length; i++){
                let imgs = document.getElementsByTagName('img')
                console.log(imgs)
                for (let j=0; j < imgs.length; j++){
                    imgs[j].setAttribute(
                    'width',
                    "0"
                )
                }
            }
        },

        onChangePage(num) {
            this.likeResumeID = []
            console.log(num)
            this.pageNum = num
            this.getAllResumes()
        },

        async like (resume_id) {
            console.log(resume_id)
            //likeResumeID, userID, likeDate
            let userID = cookie.getItem('userID').replace('j:\"','').replace('\"','')

            let  now = new Date()
            now = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} `

            let res = await api('post', '/resume/like', {likeResumeID: resume_id, userID, likeDate:now})

            if (res.code === 0) {

                this.likeResumeID.push( resume_id ) 
            } else {

                alert('这篇简历收藏过了')
            }
            
        },

        viewMD (resume_id) {
            this.viewMDID = resume_id
        },

        viewHtml (resume_id) {
            this.viewMDID = null
        }
    },
}
</script>

<style scoped>
#market-body{
    display: flex;
    justify-content: flex-start;

}
.resume-item{
    width:390px;
    height: 600px;
    border-radius: 7px;
    background-color: #eee;
    box-shadow: 6px -5px 30px #bbb;
    margin:10px;
   
}
.image-resume{
    position: relative;
    height:500px;
    overflow: scroll;
}
.image-resume .content{

    padding:8px;
    background-color: white;
}
.image-resume .content img{
  
}
.image-resume img{
    /*width:390px;*/
    border-radius: 7px 7px 0 0;
}
.info img{
    display: block;
    width:30px;
    height: 30x;
    border-radius: 30px;
    margin: 10px;
}
.author-info{
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.pub-time{
    margin: 10px;
    color:#999;
}
#page-control{
    margin:10px;
    background-color: white;
    padding: 3px;
}
.user-opertions{
    margin:0 30px;
}
.user-opertions span{
    margin:0 10px;
    font-size: .9rem
}
.user-opertions span:hover{
    opacity: 0.5;
    cursor: pointer;

}
.user-opertions .like{
    color:salmon
}
.show-MD-content{
    position: absolute;
    z-index: 100000;
    background-color: white;
    padding:5px;
    top:0;
    left: 0;
    
    transition: transform 1s;
    overflow: scroll;
}
.hide-MD-content{
    
    display: none;
}
</style>