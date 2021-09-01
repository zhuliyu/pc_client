<template>
  <div class='about-panel'>
    <img src='../assets/img/apply/apply.png'  @click='test2()'/>

    <div @click='test()'>正在建设中，敬请期待...</div>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import { apiConfig, put } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'

@Component({
  name: 'Apply'
})
export default class About extends mixins(getUserInfo) {
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
  test ():void {
    let win: any = window || {}
    try {
      /* alert(2)
      let getVal = JSON.stringify({
        'cookies': [
          {
            'name': 'myKey'
          }
        ]
      })
      let val = win.external.GetCookies(getVal)
      alert(val) */
      win.external.CloseCurrentPage()
    } catch (e) {
      alert('取参错误')
    }
  }
  test2 ():void {
    put(apiConfig('notice/read'), {
      userId: this.userId,
      appId: 2
    })
      .then((res:any) => {
        if (res.code === 200) {
          alert('阅读成功')
        }
      })
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

<style scoped lang='less' type='text/less'>
  @import '../less/style.less';
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
