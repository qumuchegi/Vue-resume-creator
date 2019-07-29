<template>
    <div id="editor">
      <div id="modify-header" v-if="modifyResumeID">
        <h2>修改简历</h2>
        <i class="fas fa-cogs"></i>
      </div>
      <div v-if="insertedImage" id="upload-image-dialog">
        <img :src="insertedImageBase64" id="inserted-image"/>
        <div>
          <Progress :percent="100*uploadImgProgress">
            <Icon type="checkmark-circled"></Icon>
            <span v-if="uploadImgProgress===1">
                成功
            </span>
          </Progress>
        </div>
        <div id="bottons-container">
          <Button type="primary" @click="uploadImg">确定上传</Button>
          <Button type="default" @click="cancleInsertImg">取消</Button>
        </div>
      </div>
      <div id="download-preview" v-if="downloadType">
        <div id="preview-shrink" v-html="htmlFromMd">
        </div>
        <div id="user-download-control">
          <div>
              <h2><span>下载类型：</span>
                {{downloadType==='img' ? '图片':'PDF'}}
              </h2>
          </div>
          <Button @click="download" type="primary" class="botton">确定下载</Button>
          <Button @click="downloadType=''" type="default" class="botton">取消</Button>
        </div>
      </div>
      <div id='control'>
        <div id="edit-components">
          <!--<img v-for="iconPath in icons" :src="iconPath" class="edit-icon"/>-->
          <Dropdown trigger="click" style="margin-left: 20px" @on-click="dropdownName">
            <a href="javascript:void(0)">
              <img src="../assets/title.png" class="edit-icon"/>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="title-1">标题1</DropdownItem>
              <DropdownItem name="title-2">标题2</DropdownItem>
              <DropdownItem name="title-3">标题3</DropdownItem>
              <DropdownItem name="title-4">标题4</DropdownItem>
              <DropdownItem name="title-5">标题5</DropdownItem>
            </DropdownMenu>
          </Dropdown>
         
          <img src="../assets/B.png" class="edit-icon" @click="editComponent('B')"/>
          <img src="../assets/I.png" class="edit-icon" @click="editComponent('I')"/>
          <img src="../assets/underline.png" class="edit-icon" @click="editComponent('underline')"/>
          <img src="../assets/一.png" class="edit-icon" @click="editComponent('divider')"/>
          <label for='color-picker'>
              <img src="../assets/text_color.png" class="edit-icon"/>
              <input type="color" v-model="tColor" id='color-picker' @change="editComponent('t-color')"/>
          </label>
          <img src="../assets/table.png" class="edit-icon" @click="showTableSizeControl"/>
          <img src="../assets/code.png" class="edit-icon" @click="editComponent('code')"/>
          <img src="../assets/eglass-link.png" class="edit-icon" @click="editComponent('link')"/>
          <img src="../assets/list.png" class="edit-icon" @click="editComponent('list')"/>
          <img src="../assets/list-ol.png" class="edit-icon" @click="editComponent('ol-list')"/>
          <img src="../assets/icon_tool.png" class="edit-icon" @click="editComponent('icons')"/>
          <label for="insert-image">
            <img src="../assets/Image-upload.png" class="edit-icon"/>
            <input type="file" id='insert-image'@change="readImage" ref="insertImage" accept="image/png, image/jpeg,image/gif"/>
          </label>
          <Poptip title='可粘贴图片到编辑区:' trigger="hover" :content="this.inserted_img_server_path" v-if="insertedImageBase64" id='copy-img-to-insert-md'>
                <img :src="insertedImageBase64" 
                     />
          </Poptip>
        </div>
        <div id='table-size-control' :class="classHiddenTableControl">
            <div id="row-col-input">
              <label for='table-row'>行数<Input type='number' v-model="rowNum" id="table-row" /> </label>
              <label for='table-col'>列数<Input type='number' v-model="colNum" id="table-col"/></label>
            </div>
            <div id='table-control-botton'>
              <Button type="default" @click="editComponent('table')" class='botton'>确认</Button>
              <Button type="default" @click="showTableSizeControl" class='botton'>取消</Button>
            </div>
        </div>
        <div :class="willInsertIcon ? 'show-insert-icon-container':'hide-insert-icon-container'" id="insert-icon-container">
          <Poptip  v-for="iconclass in icons" trigger="hover" :content="`<i class='${iconclass}'></i>`" placement='bottom'>
            <i :class="iconclass"></i>
          </Poptip>
          <span style="color:rgb(218, 67, 50);margin:10px">
            拷贝图标下面的&lt;i&gt;&lt;/i&gt;元素到编辑区即可插入相应图标
            <a href="https://fontawesome.com/icons" target="_blank">更多图标</a>
        </span>
        </div>
      </div>
      <div class="split" ref="split">
        <div class="split-pane">
          <textarea v-model="markdown_source" 
                type="textarea" 
                id='resume-textarea'
                placeholder="Enter something..." 
                rows="24"
                :cols="editContainerWidth.cols"
          />
        </div>
        <div  class="split-pane" id="preview" v-html="htmlFromMd">
         
        </div>
      </div>
      <div id="get-resume">
        <div class="botton"  v-if="!isLoadingResumeToImg">
          <img src='../assets/image.png' @click="preDownload('img')"/>
          <div>下载图片</div>
        </div>
        <div class="botton" v-if="isLoadingResumeToImg">
          <img src="../assets/loading.png" id="loading-img">
          <div>正在下载中</div>
        </div>
        <div class='botton' v-if="!isLoadingResumeToPDF">
          <img src='../assets/pdf.png' @click="preDownload('pdf')"/>
          <div>下载PDF</div>
        </div>
        <div class="botton" v-if="isLoadingResumeToPDF">
          <img src="../assets/loading.png" id="loading-img">
          <div>正在下载中</div>
        </div>
        <div class="botton" v-if="!uploadSuccess">
          <img src="../assets/upload.png" @click="commitResume"/>
        <div>{{ modifyResumeID ? '提交修改':'保存到云端'}}</div>
        </div>
        <div class="botton" v-if="uploadSuccess">
          <img src="../assets/success.png">
          <div>上传已完成</div>
        </div>
        <div class="botton" v-if="!shareSuccess && !modifyResumeID">
          <img src='../assets/share.png' @click="shareResume"/>
          <div>分享</div>
        </div>
        <div class="botton" v-if="shareSuccess">
          <img src="../assets/success.png">
          <div>分享已成功</div>
        </div>
        <div id="test">
            如果您不满意下载图片和PDF的功能，可以使用截长图软件，还可以使用<a href="http://islide.foxitreader.cn/jpg-to-pdf" target='_blank'>在线图片转pdf</a>
            将截图转换为pdf
        </div>
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import MarkdownIt from 'markdown-it'
let md = new MarkdownIt().set({ html: true, breaks: true })

import html2Canvas from 'html2canvas'
import html2pdf from 'simple-html2pdf';
import cookie from '@/utils/cookie'
import {api} from '@/api'
import mdplaceholder from '@/assets/md'

export default {
    name: 'edit',
    created () {
        
        let modify_params = this.$route.params
         
        this.modifyResumeID = modify_params.resumeID
        console.log(this.modifyResumeID);
        if(this.modifyResumeID) {
            this.markdown_source =  this.$store.getters.get_willModify_mdContent 

            console.log( '待修改：', this.markdown_source )
        }
    },
    data () {
        return {
            modifyResumeID: '',
            mdplaceholder: mdplaceholder,
            markdown_source: mdplaceholder.str,
            tColor:'rgba(69, 175, 20,.7)',
            olistMode: false,
            olistNum: 1,
            rowNum:2,
            colNum:2,
            isHiddenTableSizeControl: true,
            isLoadingResumeToImg: false,
            isLoadingResumeToPDF: false,
            isUploadResume: false,
            uploadSuccess: false,
            shareSuccess: false,
            insertedImage: '',
            insertedImageBase64: '',
            uploadImgProgress: 0,
            inserted_img_server_path:'',
            willInsertIcon: false,
            downloadType: '',
            icons: [
                 'fas fa-heart fa-2x',
                 'fas fa-address-book fa-2x',
                 'fab fa-gitlab fa-2x',
                 'fab fa-github-square fa-2x',
                 'fab fa-github fa-2x',
                 'fab fa-git fa-2x',
                 'fas fa-mobile-alt fa-2x',
                 'fas fa-phone fa-2x',
                 'fas fa-envelope-square fa-2x',
                 'fas fa-envelope fa-2x',
                 'fas fa-home fa-2x',
                 'fas fa-school fa-2x',
                 'fas fa-graduation-cap fa-2x',
                 'fab fa-twitter fa-2x',
                 'fab fa-facebook-f fa-2x',
                 'fab fa-facebook-square fa-2x',
                 'fab fa-qq fa-2x',
            ],
            
        }
    },
   
    computed: {
        classHiddenTableControl () {
            return {
                'hidden-table-size-control': this.isHiddenTableSizeControl,
                'show-table-size-control': !this.isHiddenTableSizeControl
            }
        },
        editContainerWidth () {
            if (this.$refs.split) {
                
                let cols = ( this.$refs.split.offsetWidth / 2 ) + 70
                console.log(this.$refs.split.offsetWidth.offsetWidth)
                return {
                    cols
                }

            } else {
                return {cols:73}
            }
            
        },

        htmlFromMd () {
            return md.render(this.markdown_source)
        },

        ...mapGetters([
            'get_willModify_mdContent'
        ])
    },
     
    methods: {

        editComponent (type) {
            console.log(type)
            if(type!=='ol-list') {
                this.olistMode = false
                this.olistNum = 1
            }
            switch (type) {
                case 'title-1':
                    this.markdown_source += '\n# ';break;
                case 'title-2':
                    this.markdown_source += '\n## ';break;
                case 'title-3':
                    this.markdown_source += '\n### ';break;
                case 'title-4':
                    this.markdown_source += '\n#### ';break;
                case 'title-5':
                    this.markdown_source += '\n##### ';break;
                case 'B':
                    this.markdown_source += '\n****';break;
                case 'I':
                    this.markdown_source += '\n**';break;
                case 'underline':
                    this.markdown_source += '\n<u></u>';break;
                case 'divider':
                    this.markdown_source += '\n---';break;
                case 't-color':
                    this.markdown_source += `\n <span style="color:${this.tColor}"></span>`;break;
                case 'code':
                    this.markdown_source += '\n```javascript\n\n```';break;
                case 'link':
                    this.markdown_source += `\n[]()`;break;
                case 'list':
                    this.markdown_source += `\n* `;break;
                case 'icons':
                    this.willInsertIcon = ! this.willInsertIcon;break;
                case 'ol-list':
                    this.olistMode = true;
                    this.markdown_source += `\n${this.olistNum++}. `;break;
                case 'table':
                    let table = '\n'
                    let row1 = '', row2 = ''

                    for (let i=0 ; i<=this.colNum ; i++){
                         
                        if (i==this.colNum){
                             row1 += '  |\n'
                             row2 += '|\n'
                             
                         }else{
                            row1 += '|  '
                            row2 += '| --- '
                         }
                    }
                   
                    for ( let j=0 ; j<=this.rowNum ; j++){
                        if (j===1) {
                            table += row2
                            continue
                        }
                        table += row1
                    }
                    this.markdown_source += table; this.isHiddenTableSizeControl=true; break;
            }
        },

        dropdownName (selectedName) {
            this.editComponent (selectedName)
        },

        onDropItemName (name) {
            this.editComponent (selectedName)
        },

        showTableSizeControl () {
            this.isHiddenTableSizeControl = !this.isHiddenTableSizeControl
        },

        preDownload (type) {
            this.downloadType = type
        },

        download () {
            if (this.downloadType === 'img') { this.downloadImg() }
            if (this.downloadType === 'pdf') { this.downloadPDF() }
        },

        downloadImg () {
            if (!this.markdown_source) return alert('请编辑简历')

            this.isLoadingResumeToImg = true
            let _this = this
             
            html2Canvas(
              document.getElementById('preview-shrink')
            ).then( canvas => {
              canvas.toBlob(img => {
                console.log(img)
                         
                let reader = new FileReader()
                reader.readAsDataURL(img)
                        
                reader.onload = function () {// 使用 a 标签下载生成的图片
                  var a = document.createElement("a");
                  a.href = this.result;
                  a.download = 'reusme-img';
                  a.click();

                  _this.isLoadingResumeToImg = false
                  this.downloadType=''
                }

              })
            }, err => {
                    console.log(err)
            })
        },

        downloadPDF () {
            if (!this.markdown_source) return alert('请编辑简历')

            this.isLoadingResumeToPDF = true

            html2pdf( document.getElementById('preview-shrink'), {
                filename: 'resume.pdf',
                margin: 40,
                //smart: true // true: Smartly adjust content width
            }, () => 
            { 
                this.isLoadingResumeToPDF = false
                this.downloadType=''
            })
        },

        downloadMD () {
            if (!this.markdown_source) return alert('请编辑简历')
        },

        commitResume () {
            this.modifyResumeID ? this.modify() : this.uploadResume(false)
        },

        async modify () {
            let modifyTime = this.getNow()
            let token = cookie.getItem('auth_token')
            let userID = cookie.getItem('userID').replace('j:\"','').replace('\"','')

            console.log('修改')
            let res = await api(
                'post', 
                '/resume/modifyresume', 
                {
                    resumeID: this.modifyResumeID, 
                    newMDContent: this.markdown_source, 
                    modifyTime,
                    userID 
                    // 当 token 不是 JWT 而是 github 签发的时候（JWT token 中有 userID），
                    //在参数中添加 userID 用以后端和 简历作者的 ID 比较，防止不是作者修改简历
                },
                {headers:{'authorization': token}})

            if( res.code === 0) {
                alert(res.msg)
            }else{
                alert('修改错误')
            }
        },

        getNow () {
            let  now = new Date()
            now = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} `

            return now
        },
        
        async uploadResume ( pub ) {
            pub = pub | false
            if (!this.markdown_source) return alert('请编辑简历')
            if (!cookie.getItem( 'userID' )) return alert('请先登录')

            this.isUploadResume = true
            
            let mdContent = this.markdown_source, authorID = cookie.getItem('userID'), resumeCreatedTime = this.getNow()

            console.log({mdContent, authorID, resumeCreatedTime})

            let res = await api(
                'post', 
                '/resume', 
                {
                    mdContent,
                    authorID, 
                    resumeCreatedTime,
                    isPublic:pub
                 }
            )
            if(res.code === 0) {
                if (!pub)  this.uploadSuccess = true
                if (pub)  this.shareSuccess = true
                this.isUploadResume = false
                setTimeout(()=>{
                    this.uploadSuccess = false
                    this.shareSuccess = false
                },1200)
            } else if (res.code === 1) {
                this.isUploadResume = false
                alert(`${res.msg}, 修改之后才可上传`)
            }
            
        },

        shareResume () {
          this.uploadResume(true)
        },

        readImage () {
            let _this = this
            let reader = new FileReader()
            let blob = this.$refs.insertImage.files[0]
            this.insertedImage = blob

            reader.readAsDataURL(blob)

            reader.onload = function () {
                _this.insertedImageBase64 = this.result
            }
        },

        async uploadImg () {
            let formData = new FormData()
            
            formData.append('resumeImg', this.insertedImage)

            let config = {
                headers: { 'Content-Type': 'multipart/form-data'},
                onUploadProgress: (e) => {
                    if (e.lengthComputable) {
                        this.uploadImgProgress = e.loaded / e.total
                    }
                }
            }
            let res = await api('post', '/resume/uploadimg', formData,  config)
            
            if (res.code === 0) {
                console.log(res.msg)
                
                this.uploadImgProgress = 1

                setTimeout(()=>{
                    //this.insertedImageBase64 = null
                    this.insertedImage = null
                    this.inserted_img_server_path = res.data.replace('assets/resume-img/','')
                    this.inserted_img_server_path = `<img src="http://115.220.10.182:80/${this.inserted_img_server_path}" width="100px"/>`
                    
                    this.copyImgWillInstered()
                    
                    alert('图片已在剪贴板，请在编辑区任意位置直接粘贴图片即可')
                },1000)
            }
        },

        copyImgWillInstered () {
            var textarea = document.getElementById("resume-textarea");
            textarea.value = this.inserted_img_server_path
            textarea.select();                      //选择对象  
            document.execCommand("Copy");       //执行浏览器复制命令
        },

        cancleInsertImg () {
            this.insertedImage = null
            this.insertedImageBase64 = null
        }
         
    }
}
</script>

<style scoped>
#modify-header{
    height:10%;
    padding:20px;
    border-bottom: solid 1.2px #888;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    color:rgb(69, 175, 20);
}
#upload-image-dialog{
    position: absolute;
    z-index: 100;
    top:0px;
    left:0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(1,1,1,0.3);
    
}
#download-preview{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: absolute;
    background-color: white;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    top:0px;
    left:0px;
    background-color: rgba(1,1,1,.6);
}
#upload-image-dialog img{
    display: block;
    width:300px;
    margin:  auto;
    margin-top: 100px;
    top:0px;
    left:0px;
}
#upload-image-dialog #bottons-container{
    width: 300px;
    margin: auto;
    margin-top: 100px;
    display: flex;
    justify-content: space-around;
}
#preview-shrink{
    width:704.6px;
    padding: 20px;
    font-size: 70%;
    transform-origin: 0 0;
    transform: translate(0) scale(0.7);
    /*transform: translate(0);*/
    background-color: white;
}
#user-download-control{
    background-color: rgba(129, 224, 85, 1);
    border-radius: 10px;
    margin: 100px 20px;
    padding: 100px;
}
#user-download-control h2{
    color:white
}
#user-download-control .botton{
    margin-right:20px
}
#editor{
    background-color: white;
    color:black;
}
#control{
    position: relative;
    height: 50px;
    background-color: white;
}
.split{
        height: 600px;
        display: flex;
        justify-content: flex-end;
        border: 1px solid #dcdee2;
        padding: 0;
    }
.split-pane{
    flex: 1;
    padding: 0px;
    height: 600px;
    overflow: scroll
}
#get-resume{
    display: flex;
    justify-content: flex-start;
    padding: 10px;
    color:rgb(69, 175, 20);
    width:80%
}
#get-resume .botton{
   margin:0 5px;
   flex:1
}
#get-resume .botton img:hover{
    cursor: pointer;
    opacity: 0.6;
    color:rgba(69, 175, 20,0.7);
}
#get-resume .botton img{
    display: block;
    width:20px;
    height: 20px;
    margin: auto;
}
#get-resume .botton>div{
    width:110px;
    margin: auto;
    text-align: center;
}
#resume-textarea{
    margin: 0;
    background-color: #eee;
    font-size: 1rem;
    padding: 0.7rem;
}
.edit-icon{
    width: 30px;
    margin: 10px;
}
img.edit-icon:hover{
    border:solid 1px #bbb
}
#preview{
    padding: 10px;
}
#preview.split-pane hr{
    margin: 0 !important;
    width:1px !important;
}
input#color-picker,input#insert-image{
    display: none;
}
#table-size-control{
    padding: 5px;
    width:100%;
    
    position: absolute;
    
    border:solid 1px #bbb;
    top:50px;
    background-color: white;
    margin: 0;
}
.hidden-table-size-control{
    transform: translateY(-190%);
    z-index: -2;
    transition: transform 1s , z-index 1s
}
.show-table-size-control{
    transform: translateY( 0 );
    z-index: 1;
    transition: transform 1s, z-index 1s
}
.hide-insert-icon-container{
    transform: translateY(-390%);
    z-index: -34;
    transition: transform .5s , z-index .1s
}
.hide-insert-icon-container .fa-2x{
    color:rgb(20, 175, 167);
    margin:8px;
}
.show-insert-icon-container{
    transform: translateY( 0 );
    z-index: 10000000;
    transition: transform 1s, z-index .1s;
    background-color: white;
    display: flex;
    justify-content: flex-start;
}
.show-insert-icon-container .fa-2x{
    color:rgb(20, 175, 167);
    margin:8px;
}
#table-row,#table-col{
    width:100px;
    margin: 0 6px;
}
#table-control-botton{
    padding:10px;
}
#table-control-botton .botton{
    margin: 0 9px;
}
@keyframes rotateLoading {
    from{transform: rotate(0)}
    to{transform: rotate(360deg)}
}
#loading-img{
    animation: rotateLoading 4s infinite;
}
#copy-img-to-insert-md{
    display: inline-block;
    align-items: center;
   
}
#copy-img-to-insert-md img{
    display: block;
    width: 34px;
    margin-block-end: 10px;
    border:dashed 1px rgb(69, 175, 20);
}
 span#paste-img-path{
     margin-bottom: 10px;
     background-color: rgba(69, 175, 20,.3);
     border-radius: 4px;
 }
 #test{
     width:400px;
     color:rgb(219, 117, 22)
 }
 
</style>