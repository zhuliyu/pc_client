<template>
  <div class="menuList">
    <span v-for="(item, index) in menuData" :key="getKey(index)">
      <router-link :to="item.to">
        {{ item.name }}
      </router-link>
      <span v-if="index !== (menuData.length - 1)">|</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class menuList extends Vue {
  menuData:any[] = [];
  mounted () {
    this.getMenuList()
  }
  getMenuList ():void {
    this.menuData = [
      { name: 'Home', to: '/home' },
      { name: 'About', to: '/about' }
    ]
  }
  getKey (index:any):string {
    return 'menu' + index
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less">
  @fill: 100%;
  @spacing: 20px;
</style>
