<template>
  <div class="app-search-panel" ref="container-main">
    <SearchHeader
      :searchInput="searchInput"
      @search="searchApply"
    />
    <div class="app-search-container">
      <div class="app-search-tag">
        <div class="search-list" v-for="item in searchTag" :key="item.id">
          <div class="list-title">{{item.title}}</div>
          <div class="list-item-container">
            <div
              :class="tag.id == item.active ? 'list-item active':'list-item'"
              v-for="tag in item.list" :key="tag.id"
              @click="changeActive(item.type, tag.id)"
            >
              {{tag.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="app-search-order">
        <div class="search-num">
          共<span>{{total}}</span>个
        </div>
        <div class="order-container">
          <div @click="setDefaultOrder">默认排序</div>
          <div @click="setOrder">发布时间
            <span class="caret-wrapper">
              <i :class="sortType == '2' ? 'el-icon-caret-top active' : 'el-icon-caret-top'"></i>
              <i :class="sortType == '1' ? 'el-icon-caret-bottom active' : 'el-icon-caret-bottom'"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="app-search-result" ref="container-wrapper" v-if="applyList.length">
        <div class="app-container" v-for="(item, index) in applyList" :key="index">
          <div class="app-img" @click="gotoDetail(item)">
            <img :src="item.logoUrl" >
          </div>
          <div class="app-content" @click="gotoDetail(item)">
            <div class="title">{{item.appName}}</div>
            <div class="desc">{{item.appDescribe}}</div>
            <div class="support-terminal">支持终端：{{item.supportEquipment}}</div>
            <div class="company">
              <div class="txt-icon"></div>
              <div class="company-name">{{item.facilitatorName}}</div>
              <i class="el-icon-time" />
              {{item.putawayTime}}
            </div>
            <div class="category-list">
              <div class="category-item" v-for="(label, index) in item.appLabels" :key="'label' + index">{{label}}</div>
            </div>
          </div>
          <div class="app-control">
            <!-- <el-button type="primary">打开应用</el-button> -->
            <OpenBtn
              :appInfo="item"
              @authVisible="setAuthVisible"
              :size="110"
              />
            <el-button @click="gotoDetail(item)">查看详情</el-button>
          </div>
        </div>
      </div>
      <div v-else class="no-result">
        <div class="img"></div>
        <div class="word">暂无数据！</div>
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
import SearchHeader from '@/components/applyComponents/searchHeader.vue'
import OpenBtn from '@/components/applyComponents/openBtn.vue'

@Component({
  name: 'applySearchList',
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Input.name]: Input,
    SearchHeader,
    OpenBtn
  }
})
export default class ApplySearchList extends mixins(getUserInfo) {
  tipVisible:boolean = false
  authVisible:boolean = false
  applyList:any[] = []
  activeKeyId:any = 0
  searchInput:string = ''
  searchTag:any[] = [
    { title: '收费模式：',
      active: -1,
      type: 'canFree',
      list: [
        { id: -1, name: '全部' }, { id: 1, name: '完全免费' }, { id: 0, name: '收费' }
      ]
    },
    { title: '应用分类：',
      active: -1,
      type: 'classificationId',
      list: [
        { id: -1, name: '全部' }
      ]
    },
    { title: '支持终端：',
      active: -1,
      type: 'supportEquipment',
      list: [
        { id: -1, name: '全部' }, { id: 1, name: '电脑客户端' }, { id: 3, name: '安卓手机端' }, { id: 5, name: 'iOS手机端' }, { id: 2, name: '安卓PAD端' }, { id: 4, name: 'iPad端' }
      ]
    }
  ]
  sortType: string = ''
  total: number = 0
  mounted () {
    let params: any = { ...this.$route.query }
    this.getClassificationList()
    if (this.$route.query) {
      this.setActiveTag(this.$route.query)
      if (this.$route.query.sortType) {
        this.setSortStatus(this.$route.query)
      }
    }
    this.getAppList(params, true)
    this.$nextTick(() => {
      if (sessionStorage.getItem('applySearchListTop') && this.$refs['container-main']) {
        (this.$refs['container-main'] as any).scrollTop = parseInt(sessionStorage.getItem('applySearchListTop') as any)
      }
    })
  }
  public beforeRouteEnter (to: any, from: any, next: any) {
    if (from.name !== 'applyDetail') {
      sessionStorage.setItem('applySearchScrollTop', '0')
      sessionStorage.setItem('applySearchListTop', '0')
    }
    next()
  }
  setAuthVisible () {
    this.authVisible = true
  }
  setActiveTag (query: any) {
    if (query.canFree || query.canFree === 0) {
      this.searchTag[0].active = query.canFree
    } else {
      this.searchTag[0].active = -1
    }
    if (query.classificationId) {
      this.searchTag[1].active = query.classificationId
    } else {
      this.searchTag[1].active = -1
    }
    if (query.supportEquipment) {
      this.searchTag[2].active = query.supportEquipment
    } else {
      this.searchTag[2].active = -1
    }
  }
  setSortStatus (query: any) {
    // eslint-disable-next-line eqeqeq
    if (query.sortType == '2' && query.putawayTimeOrder) {
      this.sortType = query.putawayTimeOrder
    } else {
      this.sortType = ''
    }
  }
  changeActive (type:any, id:any):void {
    // eslint-disable-next-line
    if (this.$route.query && this.$route.query[type] == id) {
      return
    }
    let currentQuery = { ...this.$route.query, [type]: id }
    this.changeQueryUrl(currentQuery)
  }
  changeQueryUrl (query:any) {
    this.$router.replace({
      path: '/apply/searchlist',
      query: query
    })
  }
  @Watch('$route')
  getRouteChange (to: any, from: any) {
    console.log(to, from)
    if (from.name === 'applySearchList' && from.name === to.name) {
      this.setActiveTag(this.$route.query)
      this.setSortStatus(this.$route.query)
      this.getAppList({ ...this.$route.query })
      if (this.$refs['container-wrapper']) {
        (this.$refs['container-wrapper'] as any).scrollTop = 0
      }
    }
  }
  setOrder ():void {
    let currentSort:any = ''
    if (!this.sortType || this.sortType === '2') {
      currentSort = '1'
    } else if (this.sortType === '1') {
      currentSort = '2'
    }
    let currentQuery = { ...this.$route.query, sortType: 2, putawayTimeOrder: currentSort }
    this.changeQueryUrl(currentQuery)
  }
  setDefaultOrder (): void {
    let query: any = this.$route.query
    this.sortType = ''
    if (query.sortType === 1) {
      return
    }
    let currentQuery: any = { ...this.$route.query, sortType: 1 }
    delete currentQuery.putawayTimeOrder
    this.changeQueryUrl(currentQuery)
  }
  searchApply (name:any):void {
    this.$router.replace({
      path: '/apply/searchlist?queryContent=' + name
    })
  }
  gotoDetail (item:any):void {
    this.$router.push({
      path: `/apply/detail/${item.clientId}/${item.facilitatorId}`
    })
    sessionStorage.setItem('applySearchScrollTop', (this.$refs['container-wrapper'] as any).scrollTop)
    sessionStorage.setItem('applySearchListTop', (this.$refs['container-main'] as any).scrollTop)
  }
  getAppList (params:any, scroll?:boolean):void {
    post(apiConfig('application/getAppSearchList'), { ...params, equipmentId: 1 })
      .then((res:any) => {
        if (res.code === 200) {
          this.applyList = res.data || []
          this.total = res.count
          if (scroll) {
            this.setScroll()
          }
        }
      })
  }
  setScroll () {
    this.$nextTick(() => {
      if (sessionStorage.getItem('applySearchScrollTop') && this.$refs['container-wrapper']) {
        (this.$refs['container-wrapper'] as any).scrollTop = parseInt(sessionStorage.getItem('applySearchScrollTop') as any)
        // (this.$refs['container-main'] as any).scrollTop = parseInt(sessionStorage.getItem('applySearchListTop') as any)
      }
    })
  }
  getClassificationList ():void {
    fetch(apiConfig('application/getClassificationList'))
      .then((res:any) => {
        if (res.code === 200) {
          let newData:any[] = []
          res.data.map((item: any) => {
            newData.push({
              id: item.classificationId,
              name: item.classificationName
            })
          })
          this.searchTag[1].list.push(...newData)
        }
      })
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
  .app-main ::-webkit-scrollbar-track-piece{
        background-color: #e6ebf0 !important;
    }
  .app-search-panel {
    .regionSize(@fill, @fill);
    padding: @spacing;
    background-color: #f3f5f9;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    .app-search-container{
      background-color: #fff;
      padding: 30px 30px 10px 30px;
      .app-search-tag{
        width: 100%;
        background-color: #f2f4f6;
        box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
        border-radius: 8px;
        border: solid 1px #f2f4f6;
        overflow: hidden;
        .search-list{
          // height: 50px;
          border-bottom: solid 1px #ebedf0;
          display: flex;
          flex-direction: row;
          align-items: center;
          .list-title{
            width: 124px;
            background-color: #f2f4f6;
            text-align: center;
            font-size: 14px;
            color: #444;
            // line-height: 50px;
          }
          .list-item-container{
            background: white;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            flex: 1;
            padding-left: 20px;
            .list-item{
              height: 26px;
              padding: 0 16px;
              color: #667380;
              font-size: 14px;
              cursor: pointer;
              line-height: 27px;
              margin: 12px 0;
              margin-right: 2px;
            }
            .active {
              border: solid 1px #1e8dfc;
              background-color: #e3f1ff;
              border-radius: 13px;
              color: #1f8dfc;
            }
          }
        }
        .search-list:last-child{
          border-bottom: none;
        }
      }
      .app-search-order{
        margin: 30px 0;
        width: 100%;
        height: 60px;
        background-color: #ffffff;
        box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
        border-radius: 8px;
        border: solid 1px #f2f4f6;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 30px;
        box-sizing: border-box;
        .search-num {
          font-size: 14px;
          color: #667380;
          span {
            font-size: 18px;
            font-weight: bold;
            color: #1f8dfc;
          }
        }
        .order-container{
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: auto;
          height: 36px;
          border: solid 1px #ebedf0;
          background-color: #f2f4f6;
          border-radius: 18px;
          font-size: 14px;
          color: #667380;
          div{
            width: 100px;
            cursor: pointer;
          }
          &>div:first-child {
            text-align: center;
            border-right: solid 1px #ebedf0;
          }
          &>div:last-child {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .caret-wrapper{
              display: flex;
              flex-direction: column;
              font-size: 12px;
              i{
                line-height: 8px;
              }
              .active {
                color: #1f8dfc;
              }
            }
          }
        }
      }
      .app-search-result{
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
        border-radius: 8px;
        border: solid 1px #f2f4f6;
        padding: 30px;
        box-sizing: border-box;
        height: 500px;
        overflow-x: hidden;
        overflow-y: auto;
        &>div:first-child {
          border-radius: 8px 8px 0 0;
        }
        &>div:last-child {
          border-radius: 0 0 8px 8px;
          border-bottom: solid 1px #ebedf0;
        }
        &>div:only-of-type{
          border-radius: 8px;
        }
        .app-container{
          display: flex;
          flex-direction: row;
          width: 100%;
          padding: 19px 30px 19px 20px;
          border: solid 1px #ebedf0;
          border-bottom: none;
          box-sizing: border-box;
          flex: 1;
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
              font-size: 18px;
              font-weight: bold;
              line-height: 19px;
              margin-bottom: 19px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .desc{
              font-size: 14px;
              line-height: 15px;
              margin-bottom: 19px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;

            }
            .support-terminal{
              font-size: 14px;
              color: #667380;
              padding-bottom: 13px;
              line-height: 15px;
            }
            .company {
              display: flex;
              flex-direction: row;
              align-items: center;
              font-size: 14px;
              color: #667380;
              margin-bottom: 15px;
              .txt-icon{
                width: @spacing * 0.7;
                height: @spacing * 0.8;
                background: url(../assets/img/application/app_tip.png) no-repeat;
                background-size: 100%;
                margin-right: 8px;
              }
              .company-name{
                max-width: 75%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              i {
                padding: 0 8px 0 19px;
                font-size: 16px;
              }
            }
            .category-list {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
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
            width: 110px;
            margin-left: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .el-button{
              width: 110px;
              height: 48px;
              text-align: center;
              line-height: 48px;
              font-size: 16px;
              padding: 0;
              margin: 0;
              margin-bottom: 18px;
              background-color: #1f8dfc;
              box-shadow: 0px 2px 8px 0px rgba(22, 109, 237, 0.35);
              border-radius: 24px;
            }
            .el-button--default {
              border: solid 1px #1f8dfc;
              color: #1e8dfc;
              background-color: white;
            }
          }
        }
      }
      .no-result{
        width: 100%;
        background-color: #ffffff;
        box-shadow: 0px 8px 24px 0px rgba(202, 212, 227, 0.28);
        border-radius: 8px;
        border: solid 1px #f2f4f6;
        padding: 30px;
        box-sizing: border-box;
        height: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .img{
          width: 300px;
          height: 250px;
          background: url(../assets/img/newApply/noApply.png) no-repeat;
          background-size: 100%;
          // margin-bottom: 30px;
        }
        .word{
          color: #667380;
          font-size: 18px;
        }
      }
    }
  }
</style>
