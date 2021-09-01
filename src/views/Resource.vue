<template>
  <div class="resource-panel">
    <div class="resource-search">
      <div class="search-main">
        <div class="search-top">
          <el-select v-model="searchValue" placeholder="请选择" class="search-select" @change="changeSearchValue" value-key="appId">
            <el-option
              v-for="item in searchResourceCategory"
              :key="item.appId"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <el-input placeholder="请输入搜索内容" class="search-input" v-model="searchInput"></el-input>
          <el-button class="search-btn" @click="searchApply">
            <i class="el-icon-search"></i>
            搜索
          </el-button>
          <el-button class="upload-resource-btn" type="warning" @click="uploadResource">
            <img src="../assets/img/resource/upload_resource.png"/>
            上传资源
          </el-button>
        </div>
        <div class="search-keywords" v-show="keywords.length">
          <div class="fire"></div>
          热门搜索：
          <span v-for="(item, index) in keywords"
            :key="'keyword' + index"
            :class="index === activeKeyId ? 'keyword actived':'keyword'"
            @click="selectKeyword(index, item)">{{item}}</span>
        </div>
      </div>
    </div>
    <div class="resource-category-main">
      <div v-for="(resouce, index) in resourceCategory" :key="index" class="category-list" @click="openWindow(resouce.redirectUrl, resouce.appId, resouce.name)">
        <div class="category-img">
          <img :src="resouce.img" >
        </div>
        <div class="category-word">{{resouce.name}}</div>
      </div>
    </div>
    <div class="resource-recommend-main">
      <div class="recommend-title">
        <div class="circle"></div>
        <div class="title">特色栏目</div>
        <div class="circle"></div>
      </div>
      <div v-for="(recommend, index) in resourceRecommend" :key="index" class="recommend-list">
        <div class="list-left">
          <img :src="recommend.max.img">
          <div class="left-word">
            <div class="name">{{recommend.max.key}}</div>
            <div class="line"></div>
          </div>
        </div>
        <div class="list-right">
          <div class="right-item" v-for="(item, index) in recommend.list" :key="index"
            @click="openWindow(recommend.max.redirectUrl, recommend.max.appId, recommend.max.name, item.key)">
            <div class="item-img"><img :src="item.img"></div>
            <div class="item-word">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="authVisible"
      class="authority-tip"
      width="346px">
      <span>您的企业暂未开通此应用，请联系企业管理员开通后再试。</span>
      <span slot="footer" class="dialog-footer">
        <button @click="authVisible = false">关 闭</button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Dialog, Button, Select, Input, Option } from 'element-ui'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'

@Component({
  name: 'newApply',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Select.name]: Select,
    [Input.name]: Input,
    [Option.name]: Option
  }
})
export default class newApply extends mixins(getUserInfo) {
  authVisible:boolean = false
  searchInput:any = ''
  serverError: boolean = false
  serverReturn: boolean = false
  resourceCategory:any[] = [
    { name: '设计模型库', img: require('../assets/img/newApply/designModel.png'), redirectUrl: '', appId: '1' },
    { name: '产品样本库', img: require('../assets/img/newApply/productSample.png'), redirectUrl: '', appId: '2' },
    { name: '工程图纸库', img: require('../assets/img/newApply/blueprint.png'), redirectUrl: '', appId: '3' },
    { name: '技术资料库', img: require('../assets/img/newApply/technicalInformation.png'), redirectUrl: '', appId: '4' },
    { name: '零件库', img: require('../assets/img/newApply/3dResource.png'), redirectUrl: '', appId: '5' }
  ]
  searchResourceCategory: any[] = [...this.resourceCategory].slice(0, 4)
  searchValue:any = this.resourceCategory[0]
  resourceRecommend:any[] = [
    { max: { img: require('../assets/img/resource/sjmx00.png'), name: '设计模型库', redirectUrl: '', appId: '', key: '工业机器人专区' },
      list: [
        { img: require('../assets/img/resource/sjmx01.png'), name: 'ABB工业机器人', key: 'ABB机器人' },
        { img: require('../assets/img/resource/sjmx02.png'), name: 'KUKA库卡工业机器人', key: 'KUKA库卡机器人' },
        { img: require('../assets/img/resource/sjmx03.png'), name: '安川工业机器人合集', key: '安川机器人' },
        { img: require('../assets/img/resource/sjmx04.png'), name: '川崎工业机器人合集', key: '川崎机器人' },
        { img: require('../assets/img/resource/sjmx05.png'), name: '焊接机器人合集', key: '焊接机器人' },
        { img: require('../assets/img/resource/more.png'), name: '更多', key: '' }
      ] },
    { max: { img: require('../assets/img/resource/cpyb00.png'), name: '产品样本库', redirectUrl: '', appId: '', key: '通用机械零部件样本' },
      list: [
        { img: require('../assets/img/resource/cpyb01.png'), name: '西门子产品样本', key: '西门子' },
        { img: require('../assets/img/resource/cpyb02.png'), name: '三菱产品样本', key: '三菱' },
        { img: require('../assets/img/resource/cpyb03.png'), name: '南方泵业产品样本', key: '南方泵业' },
        { img: require('../assets/img/resource/cpyb04.png'), name: '正泰电器产品样本', key: '正泰电器' },
        { img: require('../assets/img/resource/cpyb05.png'), name: '上银产品样本', key: '上银' },
        { img: require('../assets/img/resource/more.png'), name: '更多', key: '' }
      ] },
    { max: { img: require('../assets/img/resource/gctz00.png'), name: '工程图纸库', redirectUrl: '', appId: '', key: '自动化2D图纸' },
      list: [
        { img: require('../assets/img/resource/gctz01.png'), name: '直线导轨二维模型', key: '直线导轨' },
        { img: require('../assets/img/resource/gctz02.png'), name: '轴承二维模型', key: '轴承' },
        { img: require('../assets/img/resource/gctz03.png'), name: '汽车离合器二维模型', key: '汽车离合器' },
        { img: require('../assets/img/resource/gctz04.png'), name: '滚珠丝杠二维模型', key: '滚珠丝杠' },
        { img: require('../assets/img/resource/gctz05.png'), name: '齿轮二维模型', key: '齿轮' },
        { img: require('../assets/img/resource/more.png'), name: '更多', key: '' }
      ] }
  ]
  keywords:any[] = ['口罩机', '包装机', '自动上下料', '锐奎自动化', '上海信进']
  activeKeyId:number = -1
  mounted () {
    this.getAppList()
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
            this.handleData(res.data)
          } else {
            this.serverError = true
          }
        }).catch((err: any) => {
          this.serverError = true
        })
    } else {
      post(apiConfig('home/appListNotLogin'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: -1
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.handleData(res.data)
          } else {
            this.serverError = true
          }
        }).catch((err: any) => {
          this.serverError = true
        })
    }
  }
  handleData (apply:any) {
    this.resourceCategory.map(item => {
      let find = apply.find((data:any) => data.appName === item.name)
      if (find) {
        item.redirectUrl = find.redirectUrl
        item.appId = find.appId
      }
    })
    this.resourceRecommend.map(item => {
      let find = apply.find((data:any) => data.appName === item.max.name)
      if (find) {
        item.max.redirectUrl = find.redirectUrl
        item.max.appId = find.appId
      }
    })
    this.serverReturn = true
  }
  selectKeyword (id: any, name: any) {
    if (name === this.searchInput) {
      this.activeKeyId = -1
    } else {
      this.activeKeyId = id
    }
    // 热门搜索属于设计模型库
    let app = this.resourceCategory[0]
    this.openWindow(app.redirectUrl, app.appId, app.name, name)
  }
  changeSearchValue (item: any) {
    this.searchValue = item
  }
  initKeyword (data: any) {
    this.activeKeyId = -1
    if (data) {
      this.searchInput = data
      this.keywords.length && this.keywords.map((item, index) => {
        if (item === data) {
          this.activeKeyId = index
        }
      })
    }
  }
  searchApply () {
    this.initKeyword(this.searchInput)
    if(this.searchInput) {
      this.openWindow(this.searchValue.redirectUrl, this.searchValue.appId, this.searchValue.name, this.searchInput)
    } else {
      return
    }
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
  async openWindow (redirectUrl:string, appId:string, appName:string, state?:string):Promise<void> {
    let win: any = window || {}
    try {
      this.userId = JSON.parse(win.external.GetUserLoginInfo()).userId
    } catch (e) {
      console.log('重新获取userId失败')
    }     
    if (this.userId) {
      if (this.serverError) {
        this.$message({
          message: '服务器异常，请稍后再试',
          type: 'warning'
        })
        return;
      }
      if (!this.serverReturn) {
        this.$message({
          message: '数据请求中，请稍后',
          type: 'warning'
        })
        return;
      }
      if (redirectUrl && appId) {
        if(state){
          redirectUrl = `${redirectUrl}&state=${state}`
        }
        fetch(apiConfig('application/platformAuthorization'), { appId, userId: this.userId })
          .then((res:any) => {
            if (res.data) {
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
                    // 存入appId
                    // localStorage.setItem('appIdArray', appId)
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
            }
          })
      } else {
        this.authVisible = true
      }
    } else {
      this.openDialog()
    }
  }
  uploadResource () {
    let win: any = window || {}
    let getUserInfo = JSON.parse(win.external.GetUserLoginInfo())
    let redirectUrl = 'https://frame.zhizaoyun.com/returnpage.html?url=http://my.zhizaoyun.com/Application.html&token=' + getUserInfo.token
    let params = JSON.stringify({
      'url': redirectUrl + '',
      'appid': 'goUploadResourceFromApplicationCenterPc',
      'appname': '上传资源'
    })
    win.external.OpenApp(params)
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
  .authority-tip @{deep} .el-dialog__header .el-dialog__title{
    font-size: 16px !important;
    font-weight: bold;
  }
  .authority-tip @{deep} .el-dialog__body{
    text-align: center;
    color: black;
    font-size: 14px;
  }
  .authority-tip @{deep} .el-dialog__footer{
    text-align: center !important;
  }
  .authority-tip @{deep} .el-dialog__footer button{
    padding: 5px 30px;
    font-size: 14px;
    background-color: #1f8Dfc;
    color: white;
    border-radius: 3px;
    border:none;
    cursor: pointer;
  }
  .resource-main ::-webkit-scrollbar-track-piece{
        background-color: #e6ebf0 !important;
    }
  .resource-panel {
    height: 100%;
    background-color: #fff;
    padding: 30px 18px 30px 20px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .resource-search {
      display: flex;
      flex-direction: row;
      justify-content: center;
      .search-main{
        margin-left: 48px;
        flex: 1;
        max-width: calc(100% - 275px);
        .search-top{
          display: flex;
          flex-direction: row;
        }
        .search-select {
          width: 188px;
          height: 48px;
          cursor: pointer;
        }
        .search-select @{deep} .el-input .el-input__inner {
          border-radius: 8px 0 0 8px;
          border: solid 1px #1e8dfc;
          border-right: 0;
          height: 50px;
        }
        .search-select @{deep} .el-input .el-select__caret {
          color: #333;
          font-weight: bold;
        }
        .search-input {
          width: calc(100% - 126px);
          height: 48px;
          border: solid 1px #1e8dfc;
          border-radius: 0;
          font-size: 16px;
          color: #333;
          overflow: hidden;
        }
        .search-input @{deep} .el-input__inner {
          height: 48px;
          border:none;
        }
        .search-btn {
          width: 126px;
          height: 50px;
          border: none;
          background-color: #1e8dfc;
          color:white;
          border-radius: 0px 8px 8px 0;
          font-size: 18px;
          cursor: pointer;
        }
        .upload-resource-btn{
          width: 180px;
          height: 50px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          &>span{
            &>img{
              vertical-align: middle;
              position: relative;
              top: -3px;
            }
          }
        }
        .search-keywords{
          padding: 11px 0 0 128px;
          font-size: 14px;
          line-height: 16px;
          max-width: calc(100% - 146px);
          color: #667380;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          flex-direction: row;
          align-items: center;
          .fire{
            width: 16px;
            height: 16px;
            background: url(../assets/img/resource/fire.png) no-repeat;
            background-size: 16px;
            margin-right: 7px;
          }
          .keyword{
            padding-right: 20px;
            cursor: pointer;
          }
          .actived{
            color: #1e8dfc
          }
        }
      }
    }
    .resource-category-main{
      width: 100%;
      height: 219px;
      background-color: #ffffff;
      box-shadow: 0px 8px 24px 0px
        rgba(202, 212, 227, 0.28);
      border-radius: 10px;
      border: solid 1px #f2f4f6;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      margin-top: 40px;
      .category-list{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .category-img{
          width: 120px;
          height: 120px;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .category-word{
          font-size: 18px;
          color: #333;
          padding-top: 20px;
        }
      }
    }
    .resource-recommend-main{
      height: auto;
      background-color: #ffffff;
      box-shadow: 0px 8px 24px 0px
        rgba(202, 212, 227, 0.28);
      border-radius: 10px 10px 18px 18px;
      border: solid 1px #f2f4f6;
      padding: 40px 30px 0px 30px;
      box-sizing: border-box;
      margin-top: 30px;
      .recommend-title{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 20px;
        margin-bottom: 30px;
        .circle{
          width:6px;
          height: 6px;
          border-radius: 50%;
          background-color: #8dbff0;
        }
        .title {
          font-size: 20px;
          color: #1e8dfc;
          padding: 0 20px;
        }
      }
      .recommend-list{
        display: flex;
        flex-direction: row;
        margin-bottom: 30px;
        box-sizing: border-box;
        .list-left{
          width: 307px;
          height: 482px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          img{
            width: 100%;
            height: 100%;
          }
          .left-word{
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
            position: absolute;
            left: 0;
            top: 58px;
            .name {
              font-size: 24px;
              color: white;
            }
            .ename {
              font-size: 14px;
              color: white;
              margin-top: 12px;
            }
            .line{
              width: 43px;
              height: 4px;
              background-color: white;
              border-radius: 2px;
              margin-top: 35px;
            }
          }
        }
        .list-right{
          width: calc(100% - 307px);
          height: 482px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .right-item{
            width: calc(100%/3 - 30px);
            height: 226px;
            border-radius: 10px;
            border: solid 1px #d8d8d8;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            margin-left: 30px;
            margin-bottom: 30px;
            box-sizing: border-box;
            cursor: pointer;
            .item-img{
              width: 226px;
              height: 150px;
              border-radius: 10px;
              overflow: hidden;
              box-sizing: border-box;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .item-word{
              font-size: 16px;
              color: #333;
              line-height: 16px;
              margin-top: 20px;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:hover{
              border: solid 1px #1e8dfc;
              box-shadow: 0px 8px 24px 0px
	          	rgba(30, 141, 252, 0.28);
            }
          }
        }
      }
    }
  }
</style>
