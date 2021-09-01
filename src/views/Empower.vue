<template>
  <div class="empower-panel">
    <div class="empower-logo">
      <img class="empower-logo-pic" src="../assets/img/empower/logo.png"/>
      <img class="empower-logo-arrow" src="../assets/img/empower/arrow.png"/>
      <img class="empower-logo-pic" :src="logoUrl"/>
    </div>
    <div class="empower-info">
      <span>您即将授权的第三方应用</span>
      <span>{{ appName }}</span>
    </div>
    <div class="empower-info">
      <span>授权范围</span>
      <span>用户名、用户头像</span>
    </div>
    <div class="empower-tip">
      <span><i class="el-icon-warning"></i></span>
      <span>请确认第三方应用为您希望授权应用，如有疑问请联系制造云客服</span>
    </div>
    <div class="empower-button">
      <div @click="goHome()">取消</div>
      <div @click="openThird()">确定</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, post } from '@/utils/api/Interfaces'

@Component({
  name: 'Empower'
})
export default class Empower extends Vue {
  interfaceUrl:any
  logoUrl:any
  appName:any
  appId:any

  goHome ():void {
    this.$router.push({
      path: '/home'
    })
  }
  openThird ():void {
    post(apiConfig('home/appRecord'), { appId: this.appId, userId: this.$store.state.login.userID, equipmentId: 1 })
      .then((res:any) => {
        if (res.code === 200) {
          // 记录成功！
          alert(1)
        }
      })
    // 调用第三方地址
    // window.ApplyFunc.showApplyParams(this.interfaceUrl, this.appId, this.$store.state.login.token);
  }

  created () {
    this.interfaceUrl = this.$route.query.interfaceUrl
    this.logoUrl = this.$route.query.logoUrl
    this.appName = this.$route.query.appName
    this.appId = this.$route.query.appId
  }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/style.less";
  .empower-panel {
    .regionSize(@fill, @fill);
    background-color: #f1f1f1;
    .empower-logo {
      .regionSize(@fill, @spacing * 9);
      text-align: center;
      .empower-logo-pic {
        .regionSize(@spacing * 10, @spacing * 3.5);
        margin-top: @spacing * 2.5;
        margin-left: @spacing * 2.5;
      }
      .empower-logo-arrow {
        .regionSize(@spacing * 6, @spacing / 2);
        margin-left: @spacing * 3;
        top: -(@spacing * 2);
      }
    }
    .empower-info {
      .regionSize(@fill, @spacing * 7);
      background-color: white;
      line-height: @spacing * 7;
      font-size: 26px;/*px*/
      margin-bottom: @spacing / 5;
      &>span:first-child {
        float: left;
        margin-left: @spacing * 2.5;
        color: #8c8c8c;
      }
      &>span:last-child {
        float: right;
        margin-right: @spacing * 2.5;
        color: black;
      }
    }
    .empower-tip {
      .regionSize(calc(@fill - @spacing * 4), auto);
      margin-left: @spacing * 2.5;
      margin-top: @spacing * 1.5;
      color: #3b9afb;
    }
    .empower-button {
      width: @fill;
      height: @spacing * 5;
      line-height: @spacing * 5;
      position: absolute;
      bottom: 0;
      &>div {
        .regionSize(@fill / 2, @fill);
        float: left;
        text-align: center;
        font-size: 26px;/*px*/
        cursor: pointer;
      }
      &>div:first-child {
        color: #3b9afb;
        background-color: white;
      }
      &>div:last-child {
        color: white;
        background-color: #3b9afb;
      }
    }
  }
</style>
