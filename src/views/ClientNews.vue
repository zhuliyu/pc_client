<template>
  <div class="news-panel">
    <div class="news-top">
      <div class="news-top-content">
        <div class="top-content-logo"></div>
        <el-input placeholder="请输入搜索内容" class="search-input" v-model="searchInput" @change="searchNews"></el-input>
        <el-button class="search-btn" @click="searchNews">搜索</el-button>
      </div>
      <div class="news-container">
        <div class="news-list"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled"
          v-show="newsList.length"
          >
          <div class="news-list-item" v-for="(item, index) in newsList" :key="index" @click="openNewsDetail(item)">
            <div class="list-img"><img :src="item.imgUrl || defaultImg"></div>
            <div class="list-content">
              <div class="content-title">
                <span class="title">{{item.title}}</span>
                <span class="top" v-if="item.zzyTop === 1">推荐</span>
              </div>
              <div class="content-desc">{{item.summary}}</div>
              <div class="content-bottom">
                {{item.gainTime}}
              </div>
            </div>
          </div>
          <div v-if="loading" class="loading-tip">
            正在加载
            <i class="el-icon-loading"></i>
          </div>
        </div>
        <div v-show="!newsList.length" class="news-list full-container">
          <div class="no-news">
            <img src="../assets/img/news/no_news.png" alt="">
            <div class="no-news-tip">没有匹配的资讯</div>
          </div>
        </div>
        <div class="apply-list" :style="{display: applyDisplay}">
          <div class="title">热门应用</div>
          <div class="apply-list-item" v-for="(item, index) in applyList" :key="index">
            <div class="apply-img"><img :src="item.img"></div>
            <div class="apply-content">
              <div class="apply-title">{{item.name}}</div>
              <div class="go-btn" @click="openApply(item.clientId, item.appId, item.name)">立即前往→</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="authVisible"
      class="authority-tip"
      width="346px">
      <span>{{tipMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <button @click="authVisible = false">关 闭</button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Dialog, Button, Input } from 'element-ui'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'

@Component({
  name: 'ClientNews',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Input.name]: Input
  }
})
export default class ClientNews extends mixins(getUserInfo) {
  searchInput: string = ''
  authVisible: boolean = false
  loading: boolean = false
  applyDisplay: string = 'none'
  newsCount: number = 0
  searchObj: any = {
    equipmentId: 1,
    pageNum: 1,
    pageSize: 20,
    searchInfos: ''
  }
  tipMsg: string = '您的企业暂未开通此应用，请联系企业管理员开通后再试。'
  newsList:any[] = []
  applyList:any[] = [
    { name: '专家视点', img: require('../assets/img/newApply/newsApply07.png') },
    { name: '精益管理', img: require('../assets/img/newApply/newsApply05.png') },
    { name: '蜂巢资讯', img: require('../assets/img/newApply/newsApply03.png') },
    { name: '汽车产业动态', img: require('../assets/img/newApply/newsApply02.png') },
    { name: '化妆品产业动态', img: require('../assets/img/newApply/newsApply10.png') },
    { name: '高科技电子动态', img: require('../assets/img/newApply/newsApply08.png') },
    { name: '智能制造动态', img: require('../assets/img/newApply/newsApply11.png') },
    { name: '工业互联网动态', img: require('../assets/img/newApply/newsApply06.png') },
    { name: '工业软件动态', img: require('../assets/img/newApply/newsApply09.png') },
    { name: '加工制造技术', img: require('../assets/img/newApply/newsApply04.png') },
    { name: '工业软件技巧', img: require('../assets/img/newApply/newsApply01.png') }
  ]
  defaultImg:string = require('../assets/img/news/news_default.png')
  mounted () {
    this.getAppList()
    this.getNewsList(this.searchObj)
  }
  searchNews ():void {
    this.searchObj.searchInfos = this.searchInput
    this.searchObj.pageNum = 1
    this.getNewsList(this.searchObj, true)
  }
  getNewsList (obj:any, search ?:boolean):void {
    post(apiConfig('home/newsList'), obj)
      .then((res:any) => {
        if (this.loading) {
          this.loading = false
        }
        if (res.code === 200) {
          this.newsCount = res.data.total
          if (search) {
            this.newsList = res.data.infos
          } else {
            this.newsList = [...this.newsList, ...res.data.infos]
          }
        } else {
          this.newsCount = 0
        }
      })
      .catch(() => {
        this.newsCount = 0
        if (this.loading) {
          this.loading = false
        }
      })
  }
  get noMore () {
    return this.newsList.length >= this.newsCount
  }
  get disabled () {
    return this.loading || this.noMore
  }
  openNewsDetail (news:any):void {
    this.openApply(news.clientId, news.appId, news.appName, news.artId)
  }
  getAppList ():void {
    if (this.userId) {
      post(apiConfig('home/appList'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: -1
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.applyDisplay = 'block'
            this.handleData(res.data)
          }
        })
    } else {
      post(apiConfig('home/appListNotLogin'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: -1
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.applyDisplay = 'block'
            this.handleData(res.data)
          }
        })
    }
  }
  handleData (apply:any): void {
    this.applyList.map(item => {
      let find = apply.find((data:any) => data.appName === item.name)
      if (find) {
        item.redirectUrl = find.redirectUrl
        item.appId = find.appId
        item.clientId = find.clientId
      }
    })
  }
  load (): void{
    if (!this.loading) {
      this.loading = true
    }
    this.searchObj.pageNum++
    setTimeout(() => {
      this.getNewsList(this.searchObj)
    }, 600)
  }
  goLogin () {
    let win: any = window || {}
    try {
      win.external.ShowLoginPage()
    } catch (e) {
      this.$router.push({
        path: '/login'
      })
    }
  }
  async openDialog ():Promise<void> {
    let status: any
    let win: any = window || {}
    try {
      status = await win.external.ShowMsgBox(0)
    } catch (e) {
      console.log('打开失败')
    } finally {
      if (status === '1') {
        this.goLogin()
      }
    }
  }

  async openApply (clientId:string, appId:string, appName:string, zxid ?:string):Promise<void> {
    let win: any = window || {}
    try {
      this.userId = JSON.parse(win.external.GetUserLoginInfo()).userId
    } catch (e) {
      console.log('重新获取userId失败')
    }
    if (this.userId) {
      if (clientId && appId) {
        fetch(apiConfig('application/getAccessUrl'), {
          equipmentId: 1,
          userId: this.userId,
          clientId: clientId
        })
          .then((res:any) => {
            if (res.code === 200) {
              let redirectUrl: string = res.data.redirectUrl
              if (res.data.canUseAuth === 0) {
                fetch(apiConfig('home/insertingCoil'), {
                  appId,
                  equipmentId: 1
                })
                  .then((res:any) => {
                    return res.data
                  })
                  .then((res:number) => {
                    if (res === 0) {
                      // 应用已下架
                      this.$message({
                        message: '该应用已经下架！',
                        type: 'warning'
                      })
                    } else {
                      post(apiConfig('home/appRecord'), {
                        appId,
                        userId: this.userId,
                        equipmentId: 1
                      })
                        .then((res:any) => {
                          if (res.code === 200) {
                            // 记录成功！
                          }
                        })
                      try {
                        let cookieVal = JSON.stringify({
                          'cookies': [
                            {
                              'name': 'appId',
                              'val': appId + ''
                            }]
                        })
                        win.external.SetCookies(cookieVal)
                      } catch (e) {
                        console.log('存入AppId错误')
                      }
                      // 存入资讯id
                      if (zxid) {
                        try {
                          let cookieVal = JSON.stringify({
                            'cookies': [
                              {
                                'name': 'zxId',
                                'val': zxid + ''
                              }]
                          })
                          win.external.SetCookies(cookieVal)
                        } catch (e) {
                          console.log('存入zxId错误')
                        }
                      }
                      // win.open(redirectUrl)
                      try {
                        let params = JSON.stringify({
                          'url': redirectUrl + '',
                          'appid': appId + '',
                          'appname': appName + ''
                        })
                        win.external.OpenApp(params)
                      } catch (e) {
                        console.log('open error')
                      }
                    }
                  })
              } else {
                this.authVisible = true
                this.tipMsg = '您的企业暂未开通此应用，请联系企业管理员开通后再试。'
              }
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        if (zxid) {
          this.tipMsg = '当前资讯所属的应用暂未在PC端上架，请在其他终端登录查看，谢谢！'
        }
        this.tipMsg = '该应用已经下架。'
        this.authVisible = true
      }
    } else {
      this.openDialog()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @deep: ~'>>>';
  .authority-tip @{deep}.el-dialog{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -173px;
    margin-top: -105.5px !important;
    height: 211px !important;
    border-radius: 6px;
  }
  .authority-tip @{deep}.el-dialog__header .el-dialog__title{
    font-size: 16px !important;
    font-weight: bold;
  }
  .authority-tip @{deep}.el-dialog__body{
    text-align: center;
    color: black;
    font-size: 14px;
  }
  .authority-tip @{deep}.el-dialog__footer{
    text-align: center !important;
  }
  .authority-tip @{deep}.el-dialog__footer button{
    padding: 5px 30px;
    font-size: 14px;
    background-color: #1f8Dfc;
    color: white;
    border-radius: 3px;
    border:none;
    cursor: pointer;
  }
  .news-panel {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    .news-top {
      .regionSize(@fill, @fill);
      background: url(../assets/img/news/news_bg.png) no-repeat;
      background-size: 100%;
      background-color: white;
      .news-top-content{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
        .top-content-logo {
          width: 123px;
          height: 23px;
          background: url(../assets/img/news/news_logo.png) no-repeat;
          background-size: 100%;
          margin-right: 20px;;
        }
        .search-input{
          width: 710px;
          height: 40px;
          border: none;
          font-size: 17px;
        }
        .search-input @{deep} .el-input__inner{
          border-radius: 20px 0 0 20px;
        }
        .search-btn{
          width: 75px;
          height: 40px;
          border: none;
          border-radius: 0 20px 20px 0;
          background-color: #1f8efc;
          color: white;
          font-size: 17px;
        }
      }
      .news-container{
        padding: 40px 48px;
        display: flex;
        flex-direction: row;
        // justify-content: center;
        height: 100%;
        .news-list{
          min-width: 847px;
          min-height: 300px;
          width: 80%;
          height: calc(100% - 140px);
          display: inline-block;
          padding: 0 25px;
          margin-top: 20px;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          .news-list-tab{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            .tab-item{
              padding: 10px 2px;
              border-bottom: none;
              font-size: 22px;
              color: #000;
              font-weight: bold;
            }
            .active{
              border-bottom: solid 4px #000;
            }
            .tab-item:first-child{
              margin-right: 200px;
            }
          }
          .no-news{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            div{
              padding-top: 15px;
            }
          }
          .news-list-item{
            width:100%;
            padding: 20px 0;
            border-bottom: solid 1px #dfdfdf;
            display: flex;
            flex-direction: row;
            cursor: pointer;
            .list-img{
              width: 120px;
              height: 90px;
              overflow: hidden;
              margin-right: 25px;
              border-radius: 8px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .list-content{
              height: 90px;
              width: calc(100% - 145px);
              .content-title{
                font-size: 18px;
                color: #333;
                font-weight: bold;
                line-height: 20px;
                padding-bottom: 18px;
                display:flex;
                flex-direction: row;
                .title{
                  max-width:92%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .top {
                  color: red;
                  padding-left:15px;
                }
              }
              .content-desc{
                font-size: 16px;
                color: #666;
                line-height: 18px;
                padding-bottom: 18px;
                width:98%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .content-bottom{
                line-height: 16px;
                font-size: 14px;
                color:#666;
              }
            }
          }
          .loading-tip{
            text-align: center;
            line-height: 20px;
            font-size: 18px;
            color: #333;
            margin: 20px 0 40px;
          }
        }
        .full-container{
          width: 100%;
        }
        // .news-list::-webkit-scrollbar {
        //   display: none;
        // }
        .apply-list{
          margin-left: 25px;
          min-width: 315px;
          height: calc(100% - 120px);
          width: 20%;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          .title {
            font-size: 22px;
            color: #000;
            font-weight: bold;
            margin-bottom: 32px;
          }
          .apply-list-item{
            display: flex;
            flex-direction: row;
            margin-bottom: 32px;
            .apply-img{
              width: 125px;
              height: 70px;
              border-radius: 6px;
              overflow: hidden;
              img{
                width:100%;
                height: 100%;
              }
            }
            .apply-content{
              margin-left: 37px;
              width: calc(100% - 168px);
              .apply-title{
                font-size: 20px;
                color: #000;
                font-weight: bold;
                line-height: 22px;
                padding-bottom: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .go-btn{
                width: 90px;
                height: 30px;
                border: solid 1px #888;
                background-color: #eee;
                color: #333;
                font-size: 14px;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
              }
            }
          }
        }
        // .apply-list::-webkit-scrollbar {
        //   display: none;
        // }
      }
    }
  }
</style>
