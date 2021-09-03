<template>
  <div class="app-detail-panel" ref="detail-panel">
    <div class="app-detail-container"  :style="{height :expendHeight ? '900px' : '100%'}">
      <div class="app-detail-top">
        <div class="back-container" @click="goback">
          <span><i class="fa fa-long-arrow-left"></i></span>
          返回
        </div>
        <div class="app-container">
          <div class="app-img">
            <img src="../assets/img/newApply/app_default.png"  v-real-img="detail.logoUrl">
          </div>
          <div class="app-content">
            <div class="title">{{detail.appName}}</div>
            <div class="desc">{{detail.appDescribe}}</div>
            <div class="category-list">
              <div class="category-item" v-for="(item, index) in detail.appLabels" :key="'label' + index">{{item}}</div>
            </div>
            <div class="company" @click="goAnchor(2, '#anchor-other-apply')">
              服务商：{{detail.facilitatorName}}
            </div>
          </div>
          <div class="app-control">
            <OpenBtn
              :appInfo="detail"
              @authVisible="setAuthVisible"
              :size="158"
              />
          </div>
        </div>
      </div>
      <div class="app-detail-tab">
        <div :class="activeTab === 1 ? 'tab-item active': 'tab-item'" @click="goAnchor(1)">
          <div>应用详情
            <div class="triangle"></div>
          </div>
        </div>
        <div :class="activeTab === 2 ? 'tab-item active': 'tab-item'" @click="goAnchor(2, '#anchor-support')">
          <div>服务支持
            <div class="triangle"></div>
          </div>
        </div>
      </div>
      <div class="app-detail-content" @scroll="handleScroll">
        <div class="content-parameter" id="anchor-parameter">
          <div class="parameter-title">应用详情</div>
          <div class="parameter-table">
            <div class="list">
              <div class="list-title">版本：</div>
              <div class="list-content">{{detail.appVersion}}</div>
            </div>
            <div class="list">
              <div class="list-title">收费模式：</div>
              <div class="list-content">{{detail.feeModel}}</div>
            </div>
            <div class="list">
              <div class="list-title">支持终端：</div>
              <div class="list-content">{{detail.supportEquipment}}</div>
            </div>
            <div class="list">
              <div class="list-title">上架日期：</div>
              <div class="list-content">{{detail.putawayTime}}</div>
            </div>
          </div>
        </div>
        <div class="content-pic">
          <div v-for="(img, index) in detail.introducePic" :key="index">
            <img :src="img">
          </div>
        </div>
        <div class="content-support" id="anchor-support">
          <div class="support-title">服务支持</div>
          <div class="supprot-list">
            <div class="support-img"></div>
            <div class="support-word">{{detail.facilitatorName}}</div>
          </div>
          <div class="supprot-list">
            <div class="support-img-contact"></div>
            <div class="support-word">{{detail.appServiceTel}}</div>
          </div>
        </div>
        <div class="content-other-apply" id="anchor-other-apply" v-show="otherList.length">
          <div class="other-apply-title">服务商其他应用</div>
          <div class="other-apply-list">
            <div class="other-apply-container" v-for="(item, index) in otherList" :key="index">
              <img :src="item.logoUrl" @click="gotoDetail(item)">
              <div class="apply-content">
                <div @click="gotoDetail(item)">
                  <div class="title">{{item.appName}}</div>
                  <div class="desc">{{item.appDescribe}}</div>
                  <div class="company">
                    <div class="txt-icon"></div>
                    {{item.facilitatorName}}
                  </div>
                </div>
                <div class="app-bottom">
                  <el-button @click="gotoDetail(item)">查看详情</el-button>
                  <OpenBtn
                    :appInfo="item"
                    @authVisible="setAuthVisible"
                    :size="80"
                    />
                </div>
              </div>
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
      <span>您的企业暂未开通此应用，请联系企业管理员开通后再试。</span>
      <span slot="footer" class="dialog-footer">
        <button @click="authVisible = false">关 闭</button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Dialog, Button, Input } from 'element-ui'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import OpenBtn from '@/components/applyComponents/openBtn.vue'

@Component({
  name: 'applyDetail',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Input.name]: Input,
    OpenBtn
  }
})
export default class ApplyDetail extends mixins(getUserInfo) {
  authVisible:boolean = false
  activeTab:number = 1
  detail:any = {}
  otherList:any[] = []
  expendHeight:boolean = false
  mounted () {
    this.getAppDetail()
    window.addEventListener('scroll', this.handleScroll)
    window.onresize = () => {
      this.screenChange()
    }

    this.$nextTick(() => {
      this.screenChange()
    })
  }
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
  @Watch('$route')
  getRouteChange () {
    this.getAppDetail()
  }
  screenChange () {
    if (this.$refs['detail-panel']) {
      if ((this.$refs['detail-panel'] as any).clientHeight < 800) {
        this.expendHeight = true
      } else {
        this.expendHeight = false
      }
    }
  }
  goAnchor (tab:any, el:any) {
    this.activeTab = tab
    let container: any = document.querySelector('.app-detail-content')
    if (el) {
      let anchor = this.$el.querySelector(el)
      let detailTopHeight = (document.querySelector('.app-detail-top') as any).clientHeight + 61
      // console.log(anchor.offsetTop, anchor.scrollTop)
      this.$nextTick(() => {
        container.scrollTop = anchor.offsetTop - detailTopHeight
      })
    } else {
      this.$nextTick(() => {
        container.scrollTop = 0
      })
    }
  }
  handleScroll () {
    let scrollTop = (document.querySelector('.app-detail-content') as any).scrollTop
    let anchorSupport = (this.$el.querySelector('#anchor-support') as any).offsetTop - (document.querySelector('.app-detail-container') as any).clientHeight
    // let anchorParameter = (this.$el.querySelector('#anchor-parameter') as any).offsetTop - 425
    if (scrollTop >= 0 && scrollTop < anchorSupport) {
      this.activeTab = 1
    } else if (scrollTop >= anchorSupport) {
      this.activeTab = 2
    }
  }
  getAppDetail ():void {
    fetch(apiConfig('application/getAppDetail'), {
      equipmentId: 1,
      clientId: this.$route.params.id,
      facilitatorId: this.$route.params.faciltatorid
    })
      .then((res:any) => {
        if (res.code === 200) {
          this.detail = res.data.appDetails
          this.otherList = res.data.facilitatorOtherAppList
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  setAuthVisible ():void {
    this.authVisible = true
  }
  gotoDetail (item:any):void {
    this.$router.replace({
      path: `/apply/detail/${item.clientId}/${item.facilitatorId}`
    })
  }
  goback () {
    // this.$router.push({
    //   path: '/apply/searchlist'
    // })
    this.$router.go(-1)
  }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @import '~font-awesome/css/font-awesome.css';
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
  .app-detail-panel {
    .regionSize(@fill, @fill);
    padding: @spacing;
    background-color: #f3f5f9;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    .app-detail-container{
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
    }
    .app-detail-top{
      padding: 12px 30px 30px;
      box-sizing: border-box;
      .back-container {
        width: 100px;
        height: 40px;
        line-height: 40px;
        background-color: #f2f4f6;
        border-radius: 20px;
        border: solid 1px #ebedf0;
        color: #667380;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 12px;
        cursor:pointer;
      }
      .app-container{
        display: flex;
        flex-direction: row;
        // align-items: center;
        width: 100%;
        padding: 30px;
        box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
        border-radius: 8px;
        border: solid 1px #f2f4f6;
        box-sizing: border-box;
        .app-img {
          width: 164px;
          height: 164px;
          overflow: hidden;
          margin-right: 19px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .app-content{
          display: flex;
          flex-direction: column;
          color: #404040;
          flex: 1;
          max-width: calc(100% - 350px);
          .title{
            font-size: 24px;
            font-weight: bold;
            line-height: 25px;
            margin-bottom: 27px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .desc{
            font-size: 16px;
            line-height: 17px;
            margin-bottom: 19px;
            word-break: break-all;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 2;
            // overflow: hidden;
            // text-overflow: ellipsis;
          }
          .company {
            // display: flex;
            // flex-direction: row;
            font-size: 14px;
            color: #667380;
            cursor: pointer;
            word-break: break-all;
          }
          .category-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-bottom: 16px;
            .category-item {
              height: 28px;
              padding: 0 11px;
              background-color: #e3f1ff;
              border-radius: 14px;
              border: solid 1px #049eff;
              font-size: 14px;
              color: #1e8dfc;
              line-height: 29px;
              margin-right: 12px;
              margin-bottom: 12px;
            }
          }
        }
        .app-control {
          width: 158px;
          margin-left: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .el-button{
            width: 158px;
            height: 60px;
            text-align: center;
            line-height: 48px;
            font-size: 16px;
            padding: 0;
            margin: 0;
            margin-bottom: 18px;
            background-color: #1f8dfc;
            box-shadow: 0px 2px 8px 0px rgba(22, 109, 237, 0.35);
            border-radius: 30px;
          }
        }
      }
    }
    .app-detail-tab{
      height: 51px;
      background-color: #f2f6fc;
      display: flex;
      flex-direction: row;
      .tab-item{
        width: 50%;
        height: 48px;
        color: #444;
        font-size: 18px;
        div{
          width: 88px;
          height: 100%;
          margin: auto;
          line-height: 51px;
          text-align: center;
          border-bottom: solid 3px #f2f6fc;
          position: relative;
          cursor: pointer;
          .triangle{
            position: absolute;
            bottom: 0px;
            left: calc(50% - 5px);
            width: 0;
            height: 0;
            border-width:5px;
            border-style: solid;
            border-color: transparent transparent transparent transparent;
          }
        }
      }
      .active {
        div{
          border-bottom: solid 3px #1f8dfc;
          .triangle {
            border-color: transparent transparent #1f8dfc transparent;
          }
        }
      }
    }
    .app-detail-content{
      width: 100%;
      background: #fff;
      // padding: 30px;
      // box-sizing: border-box;
      height: calc(100% - 400px);
      // height: 400px;
      overflow-x: hidden;
      overflow-y: auto;
      .content-parameter{
        margin: 30px;
      }
      .parameter-title {
        height: 16px;
        border-left: solid 3px #1f8dfc;
        padding-left: 23px;
        font-size: 18px;
        font-weight: bold;
        color: #444;
        display: flex;
        align-items: center;
      }
      .parameter-table{
        margin-top: 19px;
        border: solid 1px #f2f4f6;
        border-radius: 8px;
        overflow: hidden;
        .list {
          height: 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: solid 1px #ebedf0;
          font-size: 16px;
          .list-title {
            height: 100%;
            background: #f2f4f6;
            width: 188px;
            padding-left: 30px;
            color: #444;
            line-height: 50px;
            // border-bottom: solid 1px #ebedf0;
            box-sizing: border-box;
          }
          .list-content{
            color: #667380;
            padding-left: 30px;
          }
        }
        .list:last-child{
          border-bottom: none;
        }
      }
      .content-support{
        background: #e8edf6;
        padding: 40px 30px;
        .support-title {
          height: 16px;
          border-left: solid 3px #1f8dfc;
          padding-left: 23px;
          font-size: 18px;
          font-weight: bold;
          color: #444;
          display: flex;
          align-items: center;
        }
        .supprot-list{
          height: 86px;
          border: solid 1px #f2f4f6;
          background: white;
          border-radius: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 24px;
          width: 100%;
          .support-img {
            width: 188px;
            height: 86px;
            background: url(../assets/img/newApply/service.png) no-repeat;
            background-size: 100%;
          }
          .support-img-contact {
            width: 188px;
            height: 86px;
            background: url(../assets/img/newApply/contact.png) no-repeat;
            background-size: 100%;
          }
          .support-word{
            padding-left: 30px;
            font-size: 18px;
            color: #444;
            max-width: calc(100% - 220px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .content-pic{
        // height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        img{
          max-width: 100%;
          margin-bottom: 20px;
        }
      }
      .content-other-apply{
        background: white;
        padding: 80px 44px 30px;
        .other-apply-title{
          text-align: center;
          font-size: 30px;
          color: #444;
        }
        .other-apply-list{
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          // justify-content: space-between;
          margin-top: 30px;
          .other-apply-container{
            width: calc(100%/3 - 30px);
            display: flex;
            flex-direction: row;
            background-color: #ffffff;
            box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
            border-radius: 10px;
            border: solid 1px #f2f4f6;
            padding: 20px;
            box-sizing: border-box;
            margin: 0 15px 30px 15px;
            img{
              width: 80px;
              height: 80px;
              cursor: pointer;
            }
            .apply-content{
              display: flex;
              flex: 1;
              flex-direction: column;
              padding-left: 12px;
              max-width: calc(100% - 100px);
              .title{
                font-size: 16px;
                color: #142433;
                line-height: 17px;
                margin-bottom: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
              }
              .desc{
                font-size: 14px;
                color: #667380;
                line-height: 20px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 15px;
              }
              .company{
                font-size: 14px;
                color: #667380;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .txt-icon{
                  width: @spacing * 0.7;
                  height: @spacing * 0.8;
                  background: url(../assets/img/application/app_tip.png) no-repeat;
                  background-size: 100%;
                  float: left;
                  margin-right: @spacing * 0.3;
                }
              }
              .app-bottom{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                padding-top: 10px;
                .el-button{
                  width: 80px;
                  height: 32px;
                  border-radius: 16px;
                  text-align: center;
                  line-height: 32px;
                  font-size: 12px;
                  padding: 0;
                }
                .el-button--default {
                  border: solid 1px #1e8dfc;
                  color: #1e8dfc;
                  margin-right: 12px;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
