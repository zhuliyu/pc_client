<template>
  <div class="about-panel">
    <img src="../assets/img/apply/apply.png"/>

    <div>正在建设中，敬请期待...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'About'
})
export default class About extends Vue {
  appId:string = ''
  getAppId ():void {
    // this.appId = localStorage.getItem('appIdArray') as string
    let win: any = window || {}
    try {
      let cookieVal = JSON.stringify({
        'cookies': [
          {
            'name': 'appId'
          }
        ]
      })
      let val:any = JSON.parse(win.external.GetCookies(cookieVal)).cookies
      val.forEach((item:any) => {
        if (item.name === 'appId') {
          this.appId = JSON.parse(item.val)
        }
      })
    } catch (e) {
      console.log('获取AppId错误')
    }
  }
  mounted () {
    const _self = this
    _self.getAppId()
    /* window.addEventListener('beforeunload', (e) => {
      localStorage.setItem('appIdArray', _self.appId)
    }) */
    window.addEventListener('beforeunload', (e) => {
      let win: any = window || {}
      try {
        let cookieVal = JSON.stringify({
          'cookies': [
            {
              'name': 'appId',
              'val': _self.appId + ''
            }]
        })
        win.external.SetCookies(cookieVal)
      } catch (e) {
        console.log('更新AppId错误')
      }
    })
  }
}
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
