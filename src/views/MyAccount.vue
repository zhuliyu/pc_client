<template>
  <div class="my-account-panel">
    <div class="my-accout-main">
      <div class="account-menu-content">
        <el-menu
          :default-active="navIndex"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#e6ebf0"
          text-color="#667380"
          active-text-color="#1e8dfc">
          <el-submenu :index="item.index"  v-for="(item, index) in listGroup" :key="index" @click.native="linkTo(item.url, $event)">
            <template slot="title">
              <img  :src="item.icon">
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="(itemChild, indexChild) in item.children" :key="indexChild" class="menu-item-child" :index="itemChild.index" @click.native="linkTo(itemChild.url, $event)">
              <div class="child-menu-point"></div>
              {{itemChild.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="account-menu-router">
        <div>
          <span class="menu-name-text">{{menuName}}</span>
          <span class="menu-child-name-text" v-for="(item, index) in menuChildName" :key="getKey('myAccount', index)">
           <i class="el-icon-arrow-right"></i>
            <span>{{item}}</span>
          </span>
        </div>
        <router-view @getNavigation = getNavigation></router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, postFile, post } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import util from '../assets/js/util'
import {
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu
} from 'element-ui'

  @Component({
    name: 'MyAccount',
    components: {
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
      [MenuItemGroup.name]: MenuItemGroup,
      [Submenu.name]: Submenu
    }
  })
export default class myAccount extends mixins(getUserInfo) {
    listGroup: any = [
      { name: '我的账号',
        url: '',
        active: '',
        icon: '../../../../../img/myAccount/myInformationIcon.png',
        index: 'my-information',
        'level': 1,
        'children': [
          { name: '个人资料', url: '/myAccount/information', active: 'information', index: 'information', level: 2 }
        ]
      },
      { name: '我的订单',
        icon: '../../../../../img/myAccount/myOrderIcon.png',
        url: '',
        active: '',
        index: 'my-order',
        'level': 1,
        'children': [
          { name: '订单管理', url: '/myAccount/myOrder', active: 'myOrder', index: 'myOrder', level: 2 }
        ]
      }
    ];
    navIndex: string = '';
    menuName: string = '';
    menuChildName: any = {};
    @Watch('$route')
    getRoute (newHash:string, oldHash:string) {
      if (location.pathname.indexOf('myAccount') !== -1) {
        let larr = (location.pathname.split('/')).length - 1
        this.navIndex = location.pathname.split('/')[larr]
      }
    }
    @Watch('navIndex')
    getNavIndex (newHash:string, oldHash:string) {}
    handleOpen (key:any, keyPath:any) {
    }
    handleClose (key:any, keyPath:any) {}
    linkTo (name:string, event:any) {
      if (this.navIndex !== name) {
        var el = event.currentTarget
        this.$router.push({
          path: name
        })
      }
    }
    getNavigation (list: any) {
      let self = this
      self.menuName = list.menuName
      self.menuChildName = list.menuChildName
    }
    get getKey () {
      return (name:string, index:any):string => {
        return name + index
      }
    }
    private mounted () {
      let larr = (location.pathname.split('/')).length
      if (location.pathname.indexOf('myAccount') !== -1) {
        this.navIndex = location.pathname.split('/')[larr - 1]
      } else {
        this.navIndex = location.pathname.split('/')[larr - 2]
      }
      this.listGroup.forEach((item:any) => {
        item.icon = util.getStaticServer() + item.icon
      })
    }
}
</script>
<style>
  .account-menu-content .el-menu .el-submenu .el-submenu__title{
    font-size: 16px;
    color: #142433 !important;
  }
  .account-menu-content .el-menu .el-submenu .el-submenu__title img{
    margin-right: 13px;
  }
  .account-menu-content .el-menu .el-submenu .menu-item-child{
    font-size: 14px;
    padding-left: 53px !important;
  }
  .account-menu-content .el-menu .el-submenu .menu-item-child.is-active{
    background: #cedff0 !important;
  }
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  .my-account-panel {
    .regionSize(@fill, @fill);
    background-color: #f3f5f9;
    padding: 20px;
    font-family: MicrosoftYaHei !important;
    .my-accout-main {
      background-color: #fff;
      .regionSize(calc(@fill - 40px), calc(@fill));
      border-radius: 10px;
      .account-menu-content{
        width: 250px;
        height: 100%;
        float: left;
        .el-menu{
          height: calc(100% - 20px);
          .el-submenu{
            .el-submenu__title{
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 24px;
              letter-spacing: 0px;
              color: #142433;
            }
          }
        }
      }
      .account-menu-router{
        width: calc(100% - 250px);
        display:inline-block;
        float: left;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 26px;
        letter-spacing: 0px;
        height: 100%;
        &>div:first-child{
          padding: 20px 18px;
          height: 20px;
          color: #8a9199;
          .menu-name-text{
            color: #8a9199;
          }
          .menu-child-name-text:last-child{
            .el-icon-arrow-right{
              color: #8a9199;
            }
            color: #8a9199;
            &>span:last-child{
              color: #142433;
            }
          }
        }
      }
    }
  }
</style>
