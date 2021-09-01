<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.isKeepAlive"></router-view>
    <GlobalStateTree/>
  </div>
</template>

<script>
import GlobalStateTree from '@/components/global/index.vue'

export default {
  name: 'App',
  components: {
    GlobalStateTree
  }
}
</script>

<style lang="less">
  body, html {
    width: 100%;
    height: 100%;
    min-width: 1170px;
    min-height: 652px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    ::-webkit-scrollbar-track-piece {
      background-color: #f8f8f8;
    }
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #bbc3d2;
      background-clip: padding-box;
      min-height: 28px;
      -webkit-border-radius: 3em;
      -moz-border-radius: 3em;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  .tip-dialog .el-dialog{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -173px;
    margin-top: -105.5px !important;
    height: 211px !important;
  }
  .tip-dialog .el-dialog__header{
    background-color: #1f8Dfc;
    padding: 10px 20px 10px !important;
  }
  .tip-dialog .el-dialog__header .el-dialog__title{
    color: white;
    font-size: 14px;
    opacity: 0.95;
    font-family: MicrosoftYaHei !important;
  }
  .tip-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
    color: #ffffffa1;
    font-size: 24px;
    position: relative;
    top: -8px;
  }
  .tip-dialog .el-dialog__body{
    text-align: center;
    background-color: #ffffff;
    color: black;
    font-family: MicrosoftYaHei !important;
    font-size: 14px;
  }
  .tip-dialog .el-dialog__body img{
    position: relative;
    top: 13px;
    left: -20px;
    width: 40px;
  }
  .tip-dialog .el-dialog__footer{
    text-align: center !important;
    background-color: #ffffff;
  }
  .tip-dialog .el-dialog__footer button{
    padding: 5px 10px;
    font-family: MicrosoftYaHei !important;
    font-size: 14px;
  }
  .tip-dialog .el-dialog__footer button:first-child{
    margin-right: 70px;
  }
</style>
