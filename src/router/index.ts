import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { apiConfig, fetch } from '@/utils/api/Interfaces'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/Home.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '制造云首页'
    }
  },
  {
    path: '/notice',
    name: 'Messages',
    component: () => import(/* webpackChunkName: 'message' */ '../views/Messages.vue'),
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      title: '制造云消息'
    }
  },
  {
    path: '/apply',
    name: 'Application',
    component: () => import(/* webpackChunkName: 'application' */ '../views/Application.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '制造云应用中心'
    }
  },
  {
    path: '/newApply',
    name: 'ApplyMain',
    component: () => import(/* webpackChunkName: 'applyMain' */ '../views/ApplyMain.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: true,
      title: '制造云应用中心'
    }
  },
  {
    path: '/empower',
    name: 'Empower',
    component: () => import(/* webpackChunkName: 'empower' */ '../views/Empower.vue'),
    meta: {
      requireAuth: true,
      isKeepAlive: false
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: 'about' */ '../views/About.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '关于'
    }
  },
  // {
  //   path: '/apply',
  //   name: 'Apply',
  //   component: () => import(/* webpackChunkName: 'apply' */ '../views/Apply.vue'),
  //   meta: {
  //     requireAuth: false,
  //     isKeepAlive: false
  //   }
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: 'login' */ '../views/Login.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: 'register' */ '../views/Register.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '注册'
    }
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import(/* webpackChunkName: 'forget' */ '../views/Forget.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '忘记密码'
    }
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import(/* webpackChunkName: 'shoppingCart' */ '../views/ShoppingCart.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '确认订单'
    }
  },
  {
    path: '/cashierDesk/:orderNo/:outTradeNo',
    name: 'CashierDesk',
    component: () => import(/* webpackChunkName: 'cashierDesk' */ '../views/CashierDesk.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '选择支付方式'
    }
  },
  {
    path: '/paymentSuccess/:orderNo/:outTradeNo',
    name: 'PaymentSuccess',
    component: () => import(/* webpackChunkName: 'paymentSuccess' */ '../views/PaymentSuccess.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '支付成功'
    }
  },
  {
    path: '/paymentFailed/:orderNo/:outTradeNo',
    name: 'PaymentFailed',
    component: () => import(/* webpackChunkName: 'paymentFailed' */ '../views/PaymentFailed.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '支付失败'
    }
  },
  {
    path: '/myAccount',
    name: 'MyAccount',
    component: () => import(/* webpackChunkName: 'myAccount' */ '../views/MyAccount.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '我的'
    },
    children: [{
      path: '/myAccount/information',
      name: 'Information',
      component: () => import(/* webpackChunkName: 'information' */ '../views/Information.vue'),
      meta: {
        requireAuth: false,
        isKeepAlive: false,
        title: '我的'
      }
    },
    {
      path: '/myAccount/myOrder',
      name: 'MyOrder',
      component: () => import(/* webpackChunkName: 'myOrder' */ '../views/MyOrder.vue'),
      meta: {
        requireAuth: false,
        isKeepAlive: false,
        title: '我的'
      }
    },
    {
      path: '/information/userModifyPhone',
      name: 'UserModifyPhone',
      component: () => import(/* webpackChunkName: 'userModifyPhone' */ '../views/UserModifyPhone.vue'),
      meta: {
        requireAuth: false,
        isKeepAlive: false,
        title: '我的'
      }
    },
    {
      path: '/information/userModifyPassword',
      name: 'UserModifyPassword',
      component: () => import(/* webpackChunkName: 'userModifyPassword' */ '../views/UserModifyPassword.vue'),
      meta: {
        requireAuth: false,
        isKeepAlive: false,
        title: '我的'
      }
    },
    {
      path: '/information/userModifyMail',
      name: 'UserModifyMail',
      component: () => import(/* webpackChunkName: 'userModifyMail' */ '../views/UserModifyMail.vue'),
      meta: {
        requireAuth: false,
        isKeepAlive: false,
        title: '我的'
      }
    },
    {
      path: '/myOrder/OrderDetail/:orderNo/:outTradeNo',
      name: 'OrderDetail',
      component: () => import(/* webpackChunkName: 'orderDetail' */ '../views/OrderDetail.vue'),
      meta: {
        requireAuth: false,
        isKeepAlive: false,
        title: '我的'
      }
    }
    ]
  },
  {
    path: '/building',
    name: 'Building',
    component: () => import(/* webpackChunkName: 'building' */ '../views/Building.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '建设'
    }
  },
  {
    path: '/loginPop',
    name: 'loginPop',
    component: () => import(/* webpackChunkName: 'loginPop' */ '../views/LoginPop.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '登录'
    }
  },
  {
    path: '/registerPop',
    name: 'registerPop',
    component: () => import(/* webpackChunkName: 'registerPop' */ '../views/RegisterPop.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '注册'
    }
  },
  {
    path: '/forgetPop',
    name: 'forgetPop',
    component: () => import(/* webpackChunkName: 'forgetPop' */ '../views/ForgetPop.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '忘记密码'
    }
  },
  {
    path: '/clientNews',
    name: 'clientNews',
    component: () => import(/* webpackChunkName: 'clientNews' */ '../views/ClientNews.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '新闻资讯'
    }
  },
  {
    path: '/skip/:type',
    name: 'skip',
    component: () => import(/* webpackChunkName: 'skip' */ '../views/Skip.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '三方登录'
    }
  },
  {
    path: '/bindAccount',
    name: 'bindAccount',
    component: () => import(/* webpackChunkName: 'bindAccount' */ '../views/BindAccount.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '联合登录'
    }
  },
  {
    path: '/codeLogin',
    name: 'codeLogin',
    component: () => import(/* webpackChunkName: 'codeLogin' */ '../views/CodeLogin.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '微信扫描登录'
    }
  },
  {
    path: '/emailLogin',
    name: 'emailLogin',
    component: () => import(/* webpackChunkName: 'emailLogin' */ '../views/EmailLogin.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '邮箱登录'
    }
  },
  {
    path: '/apply/searchList',
    name: 'applySearchList',
    component: () => import(/* webpackChunkName: 'applySearchList' */ '../views/ApplySearchList.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '制造云应用中心'
    }
  },
  {
    path: '/apply/detail/:id/:faciltatorid',
    name: 'applyDetail',
    component: () => import(/* webpackChunkName: 'applyDetail' */ '../views/ApplyDetail.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '制造云应用中心'
    }
  },
  {
    path: '/bindPhone',
    name: 'bindPhone',
    component: () => import(/* webpackChunkName: 'bindPhone' */ '../views/BindPhone.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '绑定手机号'
    }
  },
  {
    path: '/404',
    name: '404Page',
    component: () => import(/* webpackChunkName: '404Page' */ '../views/WebsiteProtect.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '网站维护中'
    }
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => import(/* webpackChunkName: 'resource' */ '../views/Resource.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '资源'
    }
  },
  {
    path: '/dataCollection',
    name: 'dataCollection',
    component: () => import(/* webpackChunkName: 'dataCollection' */ '../views/DataCollection.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '数据采集'
    }
  },
  {
    path: '/dataCollection/detail',
    name: 'dataCollectionDetail',
    component: () => import(/* webpackChunkName: 'dataCollectionDetail' */ '../views/DataCollectionDetail.vue'),
    meta: {
      requireAuth: false,
      isKeepAlive: false,
      title: '数据采集'
    }
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

const baiduStatistic = (to: any) => {
  // @ts-ignore
  if (_hmt) {
    if (to.path) {
      // @ts-ignore
      _hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
}

router.beforeEach((to:any, from:any, next:any) => {
  if (to.meta.requireAuth) {
    let win: any = window || {}
    try {
      let getUserInfo = JSON.parse(win.external.GetUserLoginInfo())
      if (getUserInfo.token) {
        fetch(apiConfig('user/userInfo'), { access_token: getUserInfo.token })
          .then((res:any) => {
            if (res.code === 200) {
              if (to.meta.title) {
                //
                document.title = to.meta.title
              }
              baiduStatistic(to)
              next()
            }
          }).catch(() => {
            next(false)
            // alert('route1 here')
            store.dispatch('login/clearToken')
            document.title = '制造云首页'
            next({
              path: '/home',
              query: {}
            })
          })
      } else {
        // alert('route2 here')
        next(false)
        store.dispatch('login/clearToken')
        document.title = '制造云首页'
        next({
          path: '/home',
          query: {}
        })
      }
    } catch (e) {
      if (to.meta.title) {
        document.title = to.meta.title
      }
      baiduStatistic(to)
      next()
    } finally {
      // this is desktop
    }
  } else {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    baiduStatistic(to)
    next()
  }
})

export default router
