import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import './mock/index'
import {
  Message
} from 'element-ui'
import infiniteScroll from 'vue-infinite-scroll'
import axios from 'axios'
import { Component } from 'vue-property-decorator'
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave'
])
Vue.use(infiniteScroll)

Vue.prototype.$message = Message

Vue.config.productionTip = false

axios.get('/config.json').then((res:any) => {
  Vue.prototype.BASE_API = res.data.BASE_API
  Vue.prototype.BUCKET_NAME = res.data.BUCKET_NAME
  work()
})
// @ts-ignore
// eslint-disable-next-line no-use-before-define
let _hmt: any = _hmt || []
let win: any = window
win._hmt = _hmt;
(function () {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?fb6d65fd62c046d88bd3b157ac7d1ba7'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode && s.parentNode.insertBefore(hm, s)
})();

(function () {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?40bb026b63721093f05ec0961354063f'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode && s.parentNode.insertBefore(hm, s)
})()
// 全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', async function (el, binding) {
  let imgURL = binding.value
  if (imgURL) {
    let exist = await imageIsExist(imgURL)
    if (exist) {
      el.setAttribute('src', imgURL)
    }
  }
})
function imageIsExist (url:any) {
  return new Promise((resolve) => {
    let img:any = new Image()
    img.onload = function () {
      if (this.complete === true) {
        resolve(true)
        img = null
      }
    }
    img.onerror = function () {
      resolve(false)
      img = null
    }
    img.src = url
  })
}
function work () {
  new Vue({
    router,
    store,
    // bus,
    render: h => h(App)
  }).$mount('#app')
}
