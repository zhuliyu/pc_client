<template>
  <div class="protect-panel">
    <img src="../assets/img/building/building.png"/>
    <div>网站维护中...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'WebsiteProtect'
})
export default class WebsiteProtect extends Vue {}

</script>

<style scoped lang="less" type="text/less">
  .protect-panel {
    width: 100%;
    height: 100%;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    img {
      position: relative;
      top: 60px;
      overflow: hidden;
    }
    div {
      position: relative;
      top: 60px;
    }
  }
</style>
