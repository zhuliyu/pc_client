import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '../../router'
import store from '../../store'
import { homeMockData } from '@/mock/home/homeData'
import { userMockData } from '@/mock/user/userData'
import { forgetMockData } from '@/mock/forget/forgetData'
import { loginMockData } from '@/mock/login/loginData'
import { userInfomationMockData } from '@/mock/userInfomation/userInfomationData'
import { messagesMockData } from '@/mock/messages/messagesData'
import { applicationMockData } from '@/mock/application/applicationData'
import { shoppinMockgData } from '@/mock/shopping/shoppingData'

Vue.config.productionTip = false
Vue.prototype.$axios = axios

axios.defaults.timeout = 30000
axios.defaults.baseURL = ''
// axios.defaults.headers.common["Authorization"] = Token;true

const isPublished:boolean = true
const projectName:string = Vue.prototype.BASE_API
let whiteList:string[] = []

// let cancleRequestInterface = (url:string, cancel:any, msg?:string):any => {
//   if (whiteList.indexOf(url) >= 0) {
//     cancel(msg)
//     return 1
//   }
//   whiteList.push(url)
// }

let removeRequestInterface = (url:string):any => {
  if (whiteList.indexOf(url) >= 0) {
    whiteList.splice(whiteList.indexOf(url), 1)
  }
}

const reorganizationData = (result:any):any => {
  let msgResult = {
    code: 200,
    msg: '接口调用成功！',
    count: 33
  }
  let finalResult = {
    data: result,
    ...msgResult
  }
  return finalResult
}

const interfacesData:object = {
  // 消息通知
  notice: {
    // 消息阅读 params: {appId:AppID,userId:用户ID}
    read: { localData: reorganizationData(homeMockData('appListData')), remoteUrl: 'api-n/client/notice/app', type: 'post' }
  },
  // 首页
  home: {
    // 应用列表 params: {equipmentId:设备类型}
    appList: { localData: reorganizationData(homeMockData('appListData')), remoteUrl: 'api-apps/client/homepage/appList', type: 'post' },
    appListNotLogin: { localData: reorganizationData(homeMockData('appListData')), remoteUrl: 'api-apps/apps-anon/client/homepage/appList', type: 'post' },
    // banner列表 params: {equipmentId:设备类型}
    bannerList: { localData: reorganizationData(homeMockData('bannerListData')), remoteUrl: 'api-apps/apps-anon/client/homepage/carousel', type: 'get' },
    // app操作信息 params: {equipmentId:设备类型,appId:AppID,userId:用户ID}
    appRecord: { localData: reorganizationData(homeMockData('appRecordData')), remoteUrl: 'api-apps/client/appRecord', type: 'post' },
    // 资讯列表 params: {equipmentId:设备类型,pageNum:当前页,pageSize:每页条数,searchInfos:查询项}
    newsList: { localData: reorganizationData(homeMockData('newsListData')), remoteUrl: 'api-apps/apps-anon/client/homepage/msgWaterfall2', type: 'post' },
    // 应用是否下架 params: {equipmentId:设备类型,appId:AppID}
    insertingCoil: { localData: reorganizationData(homeMockData('insertingCoil')), remoteUrl: 'api-apps/client/homepage/app/shelf', type: 'get' }
  },
  // 用户信息
  user: {
    // 验证token是否有效
    userInfo: { localData: reorganizationData(userMockData('userInfoData')), remoteUrl: 'api-u/users/current', type: 'get' }
  },
  // 登录服务
  login: {
    // 手机号登录  params: {phone, key, code} post请求，json格式  key是获取验证码接口返回的smsUuid，code是verifyCode
    telLogin: { localData: reorganizationData(loginMockData('loginSms')), remoteUrl: 'sys/login-sms', type: 'post' },
    // 短信验证码 params: {phoneNum, smsType} post请求，json格式
    message: { localData: reorganizationData(loginMockData('sendVerifyCode')), remoteUrl: 'api-n/notification-anon/sendVerifyCode', type: 'post' },
    // 该手机是否注册 params: {phoneNum} get请求
    isAdmin: { localData: reorganizationData(loginMockData('checkPhoneIsUsed')), remoteUrl: 'api-u/users-anon/checkPhoneIsUsed', type: 'get' },
    // 账号密码登录 params: {username, password} post请求，json格式 username可填登录名或手机号
    passwordLogin: { localData: reorganizationData(loginMockData('loginPassword')), remoteUrl: 'sys/login?110', type: 'post' },
    // 账号确认 params: {username} get请求 username可填登录名或手机号
    checkAccount: { localData: reorganizationData(forgetMockData('checkAccount')), remoteUrl: 'api-u/users-anon/getUserSimpleInfo', type: 'get' },
    // 退出登录
    loginOut: { localData: reorganizationData(forgetMockData('checkAccount')), remoteUrl: 'sys/logout' },
    // 验证token
    userInfo: { localData: reorganizationData(forgetMockData('checkAccount')), remoteUrl: 'api-u/users/current' },
    // 邮箱登录
    EmailLogin: { localData: reorganizationData(loginMockData('loginSms')), remoteUrl: 'sys/login?111' },
    // 邮箱未绑定手机用户，绑定手机号 post json  params: {username，phone，key, code}
    bindPhone: { localData: reorganizationData(loginMockData('loginSms')), remoteUrl: 'api-u/users-anon/bindPhone' },
    // 获取QQ授权登录网址 get请求
    qqLoginUrl: {
      localData: reorganizationData(loginMockData('loginSms')),
      remoteUrl: 'api-u/users-anon/thirdPartyLogin/getQQAuthorizeUrl',
      type: 'get'
    },
    // 获取微博授权登录网址 get请求
    blogLoginUrl: {
      localData: reorganizationData(loginMockData('loginSms')),
      remoteUrl: 'api-u/users-anon/thirdPartyLogin/getSinaBlogAuthorizeUrl',
      type: 'get'
    },
    // 获取QQ用户在本平台是否已注册状态信息 get请求 params: {code（授权码） state}
    qqLoginInfo: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/thirdPartyLogin/getQQLoginInfo'
    },
    // 获取新浪微博用户在本平台是否已注册状态信息 get请求 params: {code（授权码） state}
    blogLoginInfo: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/thirdPartyLogin/getSinaBlogLoginInfo'
    },
    // wechat注册用户绑定到现有账号  params: {username password openid unionid type(11:qq,12：微信，13：微博)} post请求 json格式
    wxBind: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/thirdParty/bindUserByPwd'
    },
    // 第三方平台账号注册并登录 params: {username, phone, openid, unionid, type(11:qq,12：微信，13：新浪微博), state} post请求
    registerImmediately: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/thirdPartyRegister'
    },
    // 第三方平台注册用户绑定到现有账号  params: {username state openid unionid type(11:qq,12：微信，13：微博)} post请求 json格式
    thirdBind: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/thirdParty/bindUser'
    },
    // 获取微信登录二维码 get请求
    loginCode: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/getWeChatOfficialAccountQRCode'
    },
    // 判断微信是否登录成功 params: {code} get请求 返回结果 status  1 ：扫码未注册 2:扫码已注册
    wxIsLogin: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/getWeChatLoginInfo'
    },
    // 未绑定手机号用户登录时绑定手机号
    modifyBindPhone: {
      localData: reorganizationData(forgetMockData('checkAccount')),
      remoteUrl: 'api-u/users-anon/bindPhone'
    }
  },
  // 注册
  register: {
    // 注册 post请求 params: {username, phone, password}
    registerSubmit: { localData: reorganizationData(loginMockData('registerSubmit')), remoteUrl: 'api-u/users-anon/register', type: 'post' }
  },
  // 忘记密码
  forget: {
    // 账号确认 params: {username} get请求 username可填登录名或手机号
    checkAccount: { localData: reorganizationData(forgetMockData('checkAccount')), remoteUrl: 'api-u/users-anon/getUserSimpleInfo', type: 'get' },
    // 随机生成码 get请求
    codeImg: { localData: reorganizationData(forgetMockData('codeImg')), remoteUrl: 'api-u/users-anon/getCodeImg', type: 'get' },
    // 查验验证码是否正确 params: {key, code, delete}  get请求
    // key是获取验证码接口返回的smsUuid，code是verifyCode，delete校验后删除校验码缓存，此处delete必须填false,因为后面密码重置还需要校验验证码，否则将造形成安全漏洞
    checkStatus: { localData: reorganizationData(forgetMockData('checkVerifyCode')), remoteUrl: 'api-n/notification-anon/checkVerifyCode', type: 'get' },
    // 密码查重 params: {username, password} get请求
    checkPassWord: { localData: reorganizationData(forgetMockData('checkPasswordSame')), remoteUrl: 'api-u/users-anon/checkPasswordSame', type: 'get' },
    // 密码重置 params: {phoneNum, newPassword, key, code} post请求，json格式
    commitPassword: { localData: reorganizationData(forgetMockData('resetPasswordWithCode')), remoteUrl: 'api-u/users-anon/resetPasswordWithCode', type: 'post' }
  },
  // 个人资料
  userInfomation: {
    // 展示个人基本资料
    showPersonalBasicInfo: { localData: reorganizationData(userInfomationMockData('showPersonalBasicInfos')), remoteUrl: 'api-u/personalBasicInfos', type: 'get' },
    // 编辑个人资料
    editPersonalBasicInfo: { localData: reorganizationData(userInfomationMockData('editPersonalBasicInfos')), remoteUrl: 'api-u/personalBasicInfos', type: 'put' },
    // 修改手机号校验验证码
    modifyPhoneVerificationCode: { localData: reorganizationData(userInfomationMockData('modifyPhoneVerificationCode')), remoteUrl: 'api-u/telNumCheckouts', type: 'post' },
    // 提交新手机号
    modifyPhoneSubmitEdit: { localData: reorganizationData(userInfomationMockData('modifyPhoneSubmit')), remoteUrl: 'api-u/telNums', type: 'put' },
    modifyPhoneSubmitAdd: { localData: reorganizationData(userInfomationMockData('modifyPhoneSubmitAdd')), remoteUrl: 'api-u/telNums', type: 'post' },
    // 提交新密码
    modifyPasswordSubmit: { localData: reorganizationData(userInfomationMockData('modifyPasswordSubmit')), remoteUrl: 'api-u/passwords', type: 'put' },
    // 添加新密码
    addPasswordSubmit: { localData: reorganizationData(userInfomationMockData('addPasswordSubmit')), remoteUrl: 'api-u/personalBasicInfos/setPassword', type: 'post' },
    // 校验邮箱唯一性
    checkMailOnly: { localData: reorganizationData(userInfomationMockData('checkMailOnly')), remoteUrl: 'api-u/personalBasicInfos/checkMail', type: 'post' },
    // 发送邮件
    sendMail: { localData: reorganizationData(userInfomationMockData('sendMail')), remoteUrl: 'api-u/personalBasicInfos/sendMail', type: 'post' },
    // 绑定修改邮件
    submitMail: { localData: reorganizationData(userInfomationMockData('submitMail')), remoteUrl: 'api-u/personalBasicInfos/email', type: 'post' },
    // 修改邮箱验证旧邮箱
    checkMailOld: { localData: reorganizationData(userInfomationMockData('checkMailOld')), remoteUrl: 'api-u/personalBasicInfos/checkCode', type: 'post' },
    // 上传头像
    uploadHeadFile: { localData: reorganizationData(userInfomationMockData('uploadHeadFile')), remoteUrl: 'api-u/headPic', type: 'post' },
    uploadFileCommon: { localUrl: reorganizationData(userInfomationMockData('uploadFileCommon')), remoteUrl: 'api-f/upload/multifile', type: 'post' }
  },
  // 消息列表页
  messages: {
    // 消息列表 params: {equipmentId:设备类型}
    msgList: { localData: reorganizationData(messagesMockData('msgListData')), remoteUrl: 'api-n/client/notice', type: 'post' },
    // 消息详情 params: {equipmentId:设备类型}
    infoList: { localData: reorganizationData(messagesMockData('infoListData')), remoteUrl: 'api-n/client/notice/app', type: 'post' },
    // 消息详情 params: {equipmentId:设备类型}
    infoView: { localData: reorganizationData(messagesMockData('infoListData')), remoteUrl: 'api-n/client/notice/app', type: 'get' }
  },
  // 应用中心列表页
  application: {
    // 消息列表 params: {equipmentId:设备类型}
    msgList: { localData: reorganizationData(applicationMockData('appListData')), remoteUrl: 'api-apps/client/homepage/appList', type: 'post' },
    // 判断操作平台授权app权限 params: {appId:应用id, userId:用户id}
    platformAuthorization: { localData: reorganizationData(applicationMockData('platformAuthorizationData')), remoteUrl: 'api-apps/client/platform/permission', type: 'get' },
    // 获取应用分类列表
    appClassification: { localData: reorganizationData(applicationMockData('platformAuthorizationData')), remoteUrl: 'api-apps/apps-anon/client/appClassificationList', type: 'get' },
    // 获取热门关键词
    getKeywords: { localData: reorganizationData(applicationMockData('getKeywords')), remoteUrl: 'api-apps/apps-anon/client/keywords', type: 'get' },
    // 获取应用搜索列表
    getAppSearchList: { localData: reorganizationData(applicationMockData('getAppSearchList')), remoteUrl: 'api-apps/apps-anon/client/appList', type: 'get' },
    // 获取分类信息列表
    getClassificationList: { localData: reorganizationData(applicationMockData('getClassificationList')), remoteUrl: 'api-apps/apps-anon/client/classificationInfo', type: 'get' },
    // 获取应用详情
    getAppDetail: { localData: reorganizationData(applicationMockData('getAppDetail')), remoteUrl: 'api-apps/apps-anon/client/details', type: 'get' },
    // 获取应用跳转链接
    getAccessUrl: { localData: reorganizationData(applicationMockData('getAccessUrl')), remoteUrl: 'api-apps/client/accessUrl', type: 'get' }
  },
  // 购买商品
  shopping: {
    // 提交订单 post请求 params: {appId:应用id, userId:用户id, orderDesc:订单描述, orderNo:第三方订单号, orderTitle:订单名称, recvTotalPrice:页面所有商品总价, goodsDetail:商品列表, equipmentId:设备类型}
    commitOrder: { localData: reorganizationData(shoppinMockgData('commitOrder')), remoteUrl: 'api-apps/client/order/user', type: 'post' },
    // 收银详情 get请求 params: {userId:用户id, orderNo:第三方订单号, outTradeNo:应用中心生成订单号}
    getCashierData: { localData: reorganizationData(shoppinMockgData('getCashierData')), remoteUrl: 'api-apps/client/order/user/pc/cashierDesk', type: 'get' },
    // 订单列表 get请求 params: {userId:用户id, pageNum:当前页, pageSize:每页条数}
    getOrderList: { localData: reorganizationData(shoppinMockgData('getOrderList')), remoteUrl: 'api-apps/client/pc/order/user', type: 'get' },
    // 删除订单 post请求 params: {userId:用户id, orderNo:第三方订单号, outTradeNo:应用中心订单号}
    deleteOrder: { localData: reorganizationData(shoppinMockgData('deleteOrder')), remoteUrl: 'api-apps/client/order/user/delete', type: 'post' },
    // 取消订单 post请求 params: {userId:用户id, orderNo:第三方订单号, outTradeNo:应用中心订单号}
    cancelOrder: { localData: reorganizationData(shoppinMockgData('cancelOrder')), remoteUrl: 'api-apps/client/order/user/cancel', type: 'post' },
    // 订单详情 get请求 params: {userId:用户id, orderNo:第三方订单号, outTradeNo:应用中心订单号}
    getOrderInfo: { localData: reorganizationData(shoppinMockgData('getOrderInfo')), remoteUrl: 'api-apps/client/order/user/orderInfo', type: 'get' },
    // 支付结果 post请求 params: {userId:用户id, orderNo:第三方订单号, outTradeNo:应用中心订单号}
    getPaymentInfo: { localData: reorganizationData(shoppinMockgData('getPaymentInfo')), remoteUrl: 'api-apps/client/order/user/paySuccess', type: 'post' },
    // 获取微信支付二维码
    getWeixinQrCode: { localData: reorganizationData(shoppinMockgData('getWeixinQrCode')), remoteUrl: 'api-pay/wxPay/payQRCode', type: 'get' },
    // 获取支付宝二维码
    getAlipayQrCode: { localData: reorganizationData(shoppinMockgData('getAlipayQrCode')), remoteUrl: 'api-pay/aliPay/payQRCode', type: 'get' },
    // 获取支付状态
    getPayStatus: { localData: reorganizationData(shoppinMockgData('getPayStatus')), remoteUrl: 'api-apps/client/outer/order', type: 'get' },
    // 通知支付类型
    noticePayType: { localData: reorganizationData(shoppinMockgData('noticePayType')), remoteUrl: 'api-apps/client/order/user/payType', type: 'post' }
  },
  dataCollection: {
    getInfo: { localData: reorganizationData(shoppinMockgData('noticePayType')), remoteUrl: 'api-apps/apps-anon/getScadaInfo', type: 'get' }
  }
}

export function getInterfacesData ():any {
  return {
    projectName: Vue.prototype.BASE_API,
    interfacesData,
    isPublished
  }
}

/* Vue.prototype.$api = interfacesData
 console.log('aaa:___________________' + Vue.prototype.$api) */
/**
 * 接口请求列表
 * isPublished 发布状态
 * Vue.prototype.BASE_API 接口根路径
 * @param url
 */
export function apiConfig (url:string) {
  let interfaces = interfacesData
  let obj:any[] = url.split('/')
  let address:any = interfaces
  obj.map((item) => {
    address = address[item]
  })
  let interfaceObj = address.remoteUrl
  return interfaceObj
}

let beforeRequest = (url: string, fn: any) => {
  let tempFlag: boolean = whiteList.indexOf(url) >= 0
  let res: any
  if (tempFlag) {
    res = new Promise((resolve, reject) => {
      return 'request is cancle'
    })
  } else {
    whiteList.push(url)
    res = fn && fn()
  }
  return res
}

/**
 * 封装post文件下载请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postFile (url:string, data:any = {}) {
  url = Vue.prototype.BASE_API + url
  return beforeRequest(url + '_post', () => {
    return new Promise((resolve, reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
  })
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function _Fetch (url:string, params:any = {}) {
  url = Vue.prototype.BASE_API + url
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch (url:string, params:any = {}) {
  url = Vue.prototype.BASE_API + url
  return beforeRequest(url + '_get', () => {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: params })
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

export function fetchCode (url:string, params:any = {}) {
  url = Vue.prototype.BASE_API + url
  return new Promise((resolve, reject) => {
    for (let key in params) {
      url = url + '/' + params[key]
    }
    axios.get(url, {})
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url:string, data:any = {}) {
  url = Vue.prototype.BASE_API + url
  return beforeRequest(url + '_post', () => {
    return new Promise((resolve, reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch (url:string, data:any = {}) {
  url = Vue.prototype.BASE_API + url
  return beforeRequest(url + '_patch', () => {
    return new Promise((resolve, reject) => {
      axios.patch(url, data)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put (url:string, data:any = {}) {
  url = Vue.prototype.BASE_API + url
  return beforeRequest(url + '_put', () => {
    return new Promise((resolve, reject) => {
      axios.put(url, data)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
  })
}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // let cancel: any
    // config.cancelToken = new axios.CancelToken((c) => {
    //   cancel = c
    // })
    // cancleRequestInterface(config.url as string, cancel, `${config.url} is not send`)
    let win: any = window || {}
    try {
      // 获取盒子数据
      let getUserInfo = JSON.parse(win.external.GetUserLoginInfo())
      if (getUserInfo.token) {
        config.headers = {
          'Authorization': 'Bearer ' + getUserInfo.token
        }
      }
      return config
    } catch (e) {
      if (localStorage.getItem('token')) {
        config.headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
      /* config.headers = {
        'Authorization': 'Bearer a02b1948-eb43-4dbc-80e7-ebe9865d7c11'
      } */
      return config
    }
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    /* if(response.data.errCode ==2){
      router.push({
        path:"/login",
        query:{redirect:router.currentRoute.fullPath}
      })
    } */
    removeRequestInterface(`${response.config.url}_${response.config.method}` as string)
    return response
  },
  error => {
    removeRequestInterface(`${error.response.config.url}_${error.response.config.method}` as string)
    if (error.response.status === 401) {
      try {
        // alert('interface here')
        store.dispatch('login/clearToken')
      } catch (e) {
        // 退出失败
      } finally {
        window.setTimeout(() => {
          router.push({
            path: '/home'
          })
        }, 2000)
      }
    } else if (error.response.data.code === 500) {
      if (error.response.config.url.indexOf('/getWeChatLoginInfo') < 0) {
        Message({
          message: error.response.data.msg,
          type: 'error',
          duration: 1500
        })
      }
    } else if (error.response.data.code === 501) {
      Message({
        message: error.response.data.msg,
        type: 'warning',
        duration: 1500
      })
    }
    if (error.response.status === 404) {
      router.push({
        path: '/404'
      })
    }
    return Promise.reject(error)
  }
)
