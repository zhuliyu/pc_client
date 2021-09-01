<template>
  <div class="app-panel">
    <SearchHeader
      :searchInput="searchInput"
      @search="searchApply"
    />
    <div class="app-box-container" v-if="applyList.length">
      <div class="app-category-container" ref="categoryWrapper">
        <div class="category-item">应用分类</div>
        <div  v-for="(item, index) in category" :key="'category' + index"
          :class="index===activeCategory ? 'category-item active-category': 'category-item '"
          @click="clickMenuItem(index)">{{item}}</div>
      </div>
      <div ref="mainWrapper" class="main-wrapper" @scroll="handleScroll">
        <ul class="app-main" ref="applyUl">
          <li class="app-content" v-for="(item, appindex) in applyList" :key="'apply' + appindex">
            <div class="app-content-title">
              {{item.groupName}}
              <div class="show-more" v-show="item.groupAppList.length > 4" @click="showMore(appindex, item.showMore ? false : true)">
                {{item.showMore ? '收起' : '查看更多'}}
                <div :class="item.showMore? 'icon-normal icon-expend' : 'icon-normal'"><i class="fa fa-chevron-circle-right"></i></div>
              </div>
            </div>
            <div class="app-container">
              <div class="app-box"
                v-for="(list, index) in (item.showMore ? item.groupAppList : item.shortAppList)" :key="'list' + index">
                <div class="app-top" @click="gotoDetail(list)">
                  <div class="app-icn">
                    <img src="../assets/img/newApply/app_default.png"  v-real-img="list.logoUrl">
                  </div>
                  <div class="app-txt">
                    <div class="txt-one">{{list.appName}}</div>
                    <div class="txt-desc">{{list.appDescribe}}</div>
                    <div class="txt-two">
                      <div class="txt-icon"></div>
                      <div class="text-company">{{list.facilitatorName}}</div>
                    </div>
                  </div>
                </div>
                <div class="app-bottom">
                  <el-button @click="gotoDetail(list)">查看详情</el-button>
                  <OpenBtn
                    :appInfo="list"
                    @authVisible="setAuthVisible"
                    :size="80"
                    />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="app-box-container">

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
import SearchHeader from '@/components/applyComponents/searchHeader.vue'
import OpenBtn from '@/components/applyComponents/openBtn.vue'

@Component({
  name: 'applyMain',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Input.name]: Input,
    SearchHeader,
    OpenBtn
  }
})
export default class ApplyMain extends mixins(getUserInfo) {
  authVisible:boolean = false
  applyList:any[] = []
  category:any[] = []
  searchInput:string = ''
  scrollY: any = 0
  tops: any[] = []
  activeCategory:any = 0
  canSetActive: boolean = true
  more: boolean = false
  mounted () {
    sessionStorage.setItem('applyScrollTop', '0')
    this.getAppList()
    window.addEventListener('scroll', this.handleScroll)
  }
  destoryed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
  activated () {
    this.$nextTick(() => {
      if (sessionStorage.getItem('applyScrollTop') && document.querySelector('.main-wrapper')) {
        (document.querySelector('.main-wrapper') as any).scrollTop = parseInt(sessionStorage.getItem('applyScrollTop') as any)
      }
    })
  }
  searchApply (name:any):void {
    this.$router.push({
      path: '/apply/searchlist?queryContent=' + name
    })
  }
  initTops () {
    let tops = []
    let top = 0
    tops[0] = 0

    let lis = (this.$refs.applyUl as any).children
    Array.prototype.slice.call(lis).forEach((li, index) => {
      top = top + li.clientHeight
      tops.push(top)
    })
    console.log(tops)
    this.tops = tops
  }
  handleScroll () {
    let self = this
    let scroll = (self.$refs.mainWrapper as any).scrollTop
    let index = self.tops.findIndex((top, index) => {
      return scroll >= (top - 100) && scroll < self.tops[index + 1] - 100
    })
    if (this.canSetActive) {
      self.activeCategory = index
    } else {
      self.canSetActive = true
    }
  }
  clickMenuItem (index:any) {
    this.activeCategory = index
    const top = this.tops[index]
    this.canSetActive = false
    this.scrollY = top;
    // (document.querySelector('.main-wrapper') as any).scrollTo({
    //   top: this.scrollY,
    //   behavior: 'smooth'
    // })
    (document.querySelector('.main-wrapper') as any).scrollTop = this.scrollY
  }
  getAppList ():void {
    fetch(apiConfig('application/appClassification'), {
      equipmentId: 1
    })
      .then((res:any) => {
        if (res.code === 200) {
          this.applyList = res.data
          let group:any = []
          res.data.length && res.data.map((item: any) => {
            // item.showMore = false
            this.$set(item, 'showMore', false)
            item.shortAppList = item.groupAppList.slice(0, 4)
            group.push(item.groupName)
          })
          this.category = group
          this.$nextTick(() => {
            this.initTops()
          })
        }
      })
  }
  setAuthVisible () {
    this.authVisible = true
  }
  gotoDetail (item:any):void {
    this.$router.push({
      path: `/apply/detail/${item.clientId}/${item.facilitatorId}`
    })
    sessionStorage.setItem('applyScrollTop', (document.querySelector('.main-wrapper') as any).scrollTop)
  }
  showMore (active:any, type:any) {
    this.$set(this.applyList[active], 'showMore', type)
    this.$nextTick(() => {
      this.initTops()
    })
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
  .app-main ::-webkit-scrollbar-track-piece{
        background-color: #e6ebf0 !important;
    }
  .app-panel {
    .regionSize(@fill, @fill);
    padding: @spacing;
    background-color: #f3f5f9;
    box-sizing: border-box;
    // padding-top: @spacing;
    .app-box-container{
      display: flex;
      flex-direction: row;
      background-color: #fff;
      height: 100%;
      position: relative;
    }
    .app-category-container{
      height: calc(100% - 120px);
      width: 181px;
      overflow-y: auto;
      overflow-x: hidden;
      .category-item{
        padding: 17px 12px 17px 30px;
        color: #444;
        font-size: 14px;
        cursor: pointer;
        word-break: break-all;
        word-wrap: break-word;
      }
      .active-category{
        background: #e3f1ff;
        border-left: solid 2px #1e8dfc;
      }
    }
    .app-category-container::-webkit-scrollbar {
      display: none;
    }
    .main-wrapper{
      width: calc(100% - 181px);
      height: calc(100% - 50px);
      overflow-x: hidden;
      overflow-y: auto;
      // position: absolute;
      // left: 181px;
      // top: 0;
    }
    .app-main {
      // .regionSize(@fill, calc(@fill - @spacing * 2.5));
      // margin-left: @spacing;
      padding: @spacing * 1.5;
      // border-radius: 0 0 @spacing / 2 10px;
      // overflow-x: hidden;
      // overflow-y: auto;
      background-color: #fff;
      box-sizing: border-box;
      border-left: solid 1px #ebedf0;
      margin: 0;
      list-style: none;
      margin-bottom: 30px;
      .app-content{
        width: @fill;
        // padding-bottom: 30px;
        .app-content-title{
          font-size: 18px;
          border-left: solid 3px #1f8dfc;
          padding-left: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .show-more {
            color: #667380;
            font-size: 14px;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-left: auto;
            cursor: pointer;
            .icon-normal {
              margin-left: 12px;
              transition: transform 0.2s ease-in-out;
              i {
                color: #1e8dfc;
                font-size: 15px;
              }
            }
            .icon-expend {
              transform: rotate(90deg)
            }
          }
        }
        .app-container{
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          padding-top: 19px;
          .app-box{
            width: calc(100%/2 - 15px);
            display: flex;
            flex-direction: column;
            // justify-content: flex-start;
            // align-items: center;
            box-sizing: border-box;
            background-color: #ffffff;
            box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
            border-radius: 10px;
            border: solid 1px #f2f4f6;
            margin-bottom: 30px;
            .app-top{
              display: flex;
              flex-direction: row;
              padding: 20px;
            }
            .app-bottom{
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              padding: 10px 20px;
              margin-top: auto;
              border-top: solid 1px #ebedf0;
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
            .app-icn{
              width: @spacing * 4;
              height: @spacing *4;
              margin-right: 12px;
              border-radius: 6px;
              overflow: hidden;
              cursor: pointer;
              img{
                border-radius: @spacing / 4;
                width: @fill;
                height: @fill;
              }
            }
            .app-txt{
              width:calc(100% - 92px);
              display: flex;
              flex-direction: column;
              .txt-one{
                width: @fill;
                font-size: 16px;
                color: #142433;
                margin-bottom: @spacing * 0.5;
                cursor: pointer;
                max-width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .txt-desc{
                font-size: 14px;
                color: #667380;
                line-height: 20px;
                word-break: break-all;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 10px;
              }
              .txt-two{
                width: @fill;
                font-size: 14px;
                color: #667380;
                margin-top: auto;
                display: flex;
                flex-direction: row;
                .txt-icon{
                  width: @spacing * 0.7;
                  height: @spacing * 0.8;
                  background: url(../assets/img/application/app_tip.png) no-repeat;
                  background-size: 100%;
                  float: left;
                  margin-right: @spacing * 0.3;
                }
                .text-company{
                  max-width: 90%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
        .app-box:hover{
          border: solid 1px #0687f3
        }
      }
    }
    .app-main::-webkit-scrollbar {
      display: none;
    }
  }
</style>
