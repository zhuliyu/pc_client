<template>
  <div class="home-panel">
    <div class="home-header">
      <div v-for="(item, index) in appList"
           :key="getKey('app', index)"
           @click="openWindow(item.redirectUrl, item.logoUrl, item.appName, item.appId)">
        <div>
          <img :src="item.logoUrl"/>
        </div>
        <div>{{ item.appName }}</div>
      </div>
      <div class="home-more" v-if="appCount > 7" @click="gotoApply()">
        <div>...</div>
        <div>更多 >></div>
      </div>
    </div>
    <div class="home-main">
      <!--<div class="home-panel-tab">
        <span class="active home-tab-btn">推荐</span>
        <span class="split-line"></span>
        <span class="home-tab-btn">关注</span>
      </div>-->
      <div class="home-body" v-if="tabChange === 'recommend'">
        <div class="home-banner">
          <el-carousel trigger="click" height="190px" width="100%">
            <el-carousel-item v-for="(item, index) in bannerList" :key="getKey('banner', index)">
              <img :src="item.imgUrl" @click="gotoDetail(item.linkUrl)"/>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="home-news">
          <div v-for="(item, index) in newsList.infos" :key="getKey('news', index)" class="home-news-list" @click="gotoDetail(item.infoUrl)">
            <div><img :src="item.imgUrl"/></div>
            <div>
              <div class="first-panel">
                <span :title="item.title">{{ item.title }}</span>
                <span>{{ item.gainTime }}</span>
              </div>
              <div class="second-panel" :title="item.summary">{{ item.summary }}</div>
              <div class="third-panel">【{{ item.channel }}】</div>
            </div>
          </div>
        </div>
        <div class="home-paging">
          <el-pagination
            @current-change="handlePageChange"
            :current-page="newsList.pageNumber"
            :page-size=10
            layout="total, prev, pager, next, jumper"
            :total="newsList.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      class="tip-dialog"
      width="346px">
      <img src="../assets/img/home/question.png">
      <span>需先登录才可以使用！</span>
      <span slot="footer" class="dialog-footer">
        <button @click="dialogVisible = goLogin()">确 定</button>
        <button @click="dialogVisible = false">取 消</button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import { Carousel, CarouselItem, Pagination, Dialog, Button } from 'element-ui'
import * as I from '@/assets/types/home'

@Component({
  name: 'Home',
  components: {
    [Carousel.name]: Carousel,
    [CarouselItem.name]: CarouselItem,
    [Pagination.name]: Pagination,
    [Dialog.name]: Dialog,
    [Button.name]: Button
  }
})
export default class Home extends mixins(getUserInfo) implements I.IAppInfoInterface {
  appList = [];
  appCount = 0;
  tabChange = 'recommend';
  bannerList = [];
  newsList = {
    total: 0,
    infos: [],
    pageNumber: 1
  };
  tempId = this.getUrlId();
  dialogVisible = false;

  getUrlId ():I.noStringData {
    return this.$route.query.id as I.noStringData
  }
  handlePageChange (val:number):void {
    this.newsList.pageNumber = val
    this.initNews(this.newsList.pageNumber)
  }
  getAppList ():void {
    if (this.userId) {
      post(apiConfig('home/appList'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: 0
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.appList = res.data
            this.appCount = res.count
          }
        })
    } else {
      post(apiConfig('home/appListNotLogin'), {
        equipmentId: 1,
        userId: this.userId,
        limitNum: 0
      })
        .then((res:any) => {
          if (res.code === 200) {
            this.appList = res.data
            this.appCount = res.count
          }
        })
    }
  }
  get getKey () {
    return (name:string, index:any):string => {
      return name + index
    }
  }
  async openWindow (redirectUrl:string, logoUrl:string, appName:string, appId:string):Promise<void> {
    let win: any = window || {}
    /* try {
      let cookieVal = JSON.stringify({
        'cookies': [
          {
            'name': 'myKey',
            'val': '20200616'
          }]
      })
      win.external.SetCookies(cookieVal)
    } catch (e) {
      alert('入参错误')
    } finally {
      win.open('http://njtestyyzx01.zhizaoyun.com/yyzx_pc/apply')
    } */
    if (this.userId) {
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
            this.getAppList()
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
            // ocalStorage.setItem('appIdArray', appId)
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
            win.open(redirectUrl)
          }
        })
    } else {
      this.dialogVisible = true
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
  gotoApply ():void {
    let win: any = window || {}
    try {
      win.external.DoMenuItemJump('menu003')
    } catch (e) {
      this.$router.push({
        path: '/apply'
      })
    }
  }
  initBanner ():void {
    fetch(apiConfig('home/bannerList'), { equipmentId: 1 })
      .then((res:any) => {
        if (res.code === 200) {
          this.bannerList = res.data
        }
      })
  }
  gotoDetail (link:string):void {
    // 打开头条新闻
    window.open(link)
  }
  initNews (pageNumber: number):void {
    post(apiConfig('home/newsList'), { pageNum: pageNumber, pageSize: 10, searchInfos: '', equipmentId: 1 })
      .then((res:any) => {
        if (res.code === 200) {
          this.newsList.total = res.data.total
          this.newsList.infos = res.data.infos
        }
      })
  }
  async initApp ():Promise<void> {
    await this.getAppList()
    await this.initBanner()
    await this.initNews(this.newsList.pageNumber)
  }
  mounted () {
    /* let win:any = window || {}
    let params = {
      // 第三方应用订单号
      'orderNo': '123',
      // 订单标题
      'orderTitle': '123',
      // 订单描述
      'orderDesc': '123',
      // 商品信息 数组
      'goodsDetail': [
        {
          // 订单产品编号
          'goodsId': '11',
          // 订单商品名称
          'goodsName': '图纸通-11',
          // 订单商品数量
          'goodsCount': '2',
          // 订单商品单价
          'goodsPrice': '0.01',
          // 订单商品描述
          'goodsDesc': '11',
          // 商品logo
          'goodsLogo': '../../static/img/shopping/logo.png',
          // 服务商
          'facilitatorName': '杭州新迪数字工程系统有限公司',
          // 商品类型
          'goodsType': 'OrderProdType002'
        },
        {
          // 订单产品编号
          'goodsId': '22',
          // 订单商品名称
          'goodsName': '图纸通-22',
          // 订单商品数量
          'goodsCount': '1',
          // 订单商品单价
          'goodsPrice': '0.01',
          // 订单商品描述
          'goodsDesc': '11',
          // 商品logo
          'goodsLogo': '../../static/img/shopping/logo.png',
          // 服务商
          'facilitatorName': '杭州新迪数字工程系统有限公司',
          // 商品类型
          'goodsType': 'OrderProdType002'
        }
      ]
    }
    win.pcSdk.purchaseOfEntry(JSON.stringify(params)) */
    // win.location.href = 'https://download.huya.com/huyapc/install/HuyaClientInstall.exe'
    this.initApp()
  }
}
</script>

<style scoped lang='less' type='text/less'>
  @import '../less/style.less';
  .home-panel {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    overflow: hidden;
    .home-header {
      .regionSize(calc(@fill - @spacing * 2), @spacing * 5.5);
      margin-left: @spacing;
      border-radius: @spacing / 2;
      margin-top: @spacing;
      margin-bottom: @spacing;
      background-color: white;
      color: #5a5a5a;
      &>div {
        .regionSize(calc(@fill / 7 - 23px), @spacing * 4.5);
        float: left;
        margin-top: @spacing / 2;
        margin-left: @spacing;
        text-align: center;
        font-weight: bold;
        cursor: pointer;
        overflow: hidden;
        &>div:first-child {
          .regionSize(@spacing * 3.4, @spacing * 3.4);
          line-height: @spacing * 3.4;
          border-radius: @spacing / 2;
          margin: 0 auto;
        }
        &>div:last-child {
          line-height: @spacing + 6;
          font-size: 14px;
        }
        img {
          .regionSize(@fill, @fill);
        }
      }
      .home-more {
        color: #5a5a5a;
        font-size: 18px;
        background-color: white;
        &>div:first-child {
          box-sizing: border-box;
          border: 1px solid #d8d8d8;
          border-radius: @spacing / 2;
        }
      }
    }
    .home-main {
      .regionSize(calc(@fill - @spacing * 2), calc(@fill - @spacing * 6.5));
      margin-left: @spacing;
      .home-panel-tab {
        .regionSize(@fill, @spacing * 1.5);
        position: absolute;
        text-align: center;
        margin-top: @spacing / 2;
        color: white;
        z-index: 99;
        .home-tab-btn {
          display: inline-block;
          width: @spacing * 3.5;
          line-height: @spacing * 1.5;
          height: @fill;
          font-size: 16px;
          cursor: pointer;
        }
        .home-tab-btn.active {
          background-color: #1f8dfc;
          border-radius: @spacing / 4;
          &>div {
            margin-top: @spacing / 2;
          }
        }
        .split-line {
          width: 1px;
          height: @spacing - 2;
          background-color: white;
          margin-left: @spacing;
          position: relative;
          top: @spacing / 4 - 1;
          display: inline-block;
        }
      }
      .home-body {
        .regionSize(@fill, @fill);
        .home-banner {
          .regionSize(@fill, @spacing * 7.5);
          border-radius: @spacing / 2;
          margin-bottom: @spacing;
          cursor: pointer;
          overflow: hidden;
          img {
            .regionSize(@fill, @fill);
          }
        }
        .home-news {
          .regionSize(@fill, calc(@fill - @spacing * 11.2));
          overflow-x: hidden;
          overflow-y: auto;
          background-color: white;
          border-top-left-radius: @spacing / 2;
          border-top-right-radius: @spacing / 2;
          .home-news-list {
            .regionSize(calc(@fill / 2 - @spacing * 1.4), @spacing * 5 - 2px);
            float: left;
            margin-top: @spacing;
            margin-left: @spacing;
            &>div {
              float: left;
              height: @fill;
              cursor: pointer;
            }
            &>div:first-child {
              width: @spacing * 6;
              border-radius: @spacing / 2;
              overflow: hidden;
              img {
                .regionSize(@fill, @fill);
              }
            }
            &>div:last-child {
              width: calc(@fill - @spacing * 6.5);
              margin-left: @spacing / 2;
              font-size: 12px;
              color: #959595;
              .first-panel {
                .regionSize(@fill, @spacing * 1.5);
                line-height: @spacing * 1.5;
                box-sizing: border-box;
                border-bottom: 1px solid #eaeaea;
                &>span:first-child:hover {
                  color: #1f8dfc;
                }
                &>span:first-child {
                  /*color: #1f8dfb;*/
                  font-size: 14px;
                  float: left;
                  display: inline-block;
                  width: calc(@fill - @spacing * 7);
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  font-weight: bold;
                  color: black;
                }
                &>span:last-child {
                  float: right;
                  display: inline-block;
                  width: @spacing * 7;
                  text-align: right;
                }
              }
              .second-panel {
                .regionSize(@fill, @spacing * 2.1);
                margin-top: @spacing / 4;
                line-height: @spacing;
                margin-bottom: @spacing / 5;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }
              .third-panel {
                margin-left: -(@spacing / 3);
              }
            }
          }
        }
        .home-paging {
          .regionSize(@fill, @spacing * 1.7);
          text-align: center;
          background-color: white;
        }
      }
    }
  }
</style>
