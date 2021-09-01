<template>
  <div class="about-panel">
    <img src="../assets/img/building/building.png"/>
    <div>正在建设中...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'Building'
})
export default class Building extends Vue {}

</script>

<style scoped lang="less" type="text/less">
  @import "../less/style.less";
  .about-panel {
    .regionSize (@fill, @fill);
    font-size: @spacing;
    font-weight: bold;
    text-align: center;
    img {
      position: relative;
      top: @spacing * 5;
      overflow: hidden;
    }
    div {
      position: relative;
      top: @spacing * 5;
    }
  }
</style>
