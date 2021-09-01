import * as type from './mutation-types'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Message } from 'element-ui'
import router from '../../router'
import { encrypt, decrypt } from '@/assets/js/encryption'

export default {
  [type.USER_LOGIN_IN] (state:any, userInfo:any) {
    let params = { username: userInfo.loginName, password: encrypt(userInfo.loginPassword), loginType: 'pc', secretKey: true }
    let loginType:string = 'pc'
    post(apiConfig('login/passwordLogin') + '&type=' + loginType, params)
      .then((res:any) => {
        if (res.code === 200) {
          res.data = JSON.parse(decrypt(res.data))
          state.userName = res.data.userInfo.username
          state.userID = res.data.userInfo.userid
          state.headImgUrl = res.data.userInfo.headImgUrl
          state.role = res.data.userInfo.role
          state.token = res.data.access_token
          let userData = {
            token: res.data.access_token,
            expires_in: res.data.expires_in,
            userId: res.data.userInfo.userid,
            userName: res.data.userInfo.username,
            headUrl: res.data.userInfo.headImgUrl
          }
          if (res.data.userInfo && res.data.userInfo.phone) {
            let win: any = window || {}
            Message({
              message: '登录成功！',
              type: 'success',
              duration: 1500
            })
            try {
              // 调用盒子并塞值
              win.external.SetUserLoginInfo(JSON.stringify(userData))
            } catch (e) {
              router.push({
                path: '/home'
              })
            }
          } else {
            router.push({
              path: '/bindPhone',
              query: userData
            })
          }
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
  },
  [type.TEL_LOGIN_IN] (state:any, userInfo:any) {
    let params = { phone: userInfo.loginName, code: userInfo.loginPassword, key: userInfo.key, loginType: 'pc', secretKey: true }
    let loginType:string = 'pc'
    post(apiConfig('login/telLogin') + '?type=' + loginType, params)
      .then((res:any) => {
        if (res.code === 200) {
          res.data = JSON.parse(decrypt(res.data))
          let win: any = window || {}
          state.userName = res.data.userInfo.username
          state.userID = res.data.userInfo.userid
          state.headImgUrl = res.data.userInfo.headImgUrl
          state.role = res.data.userInfo.role
          state.token = res.data.access_token
          Message({
            message: '登录成功！',
            type: 'success',
            duration: 1500
          })
          let params = {
            token: res.data.access_token,
            expires_in: res.data.expires_in,
            userId: res.data.userInfo.userid,
            userName: res.data.userInfo.username,
            headUrl: res.data.userInfo.headImgUrl
          }
          try {
            // 调用盒子并塞值
            win.external.SetUserLoginInfo(JSON.stringify(params))
          } catch (e) {
            router.push({
              path: '/home'
            })
          }
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
        }
      })
  },
  [type.CLEAR_USER_INFO] (state:any) {
    state['userName'] = ''
    state['userID'] = ''
    state['headImgUrl'] = ''
    state['role'] = ''
    state['token'] = ''
    let win: any = window || {}
    try {
      // 清空盒子
      win.external.ClearUserLoginInfo()
    } catch (e) {
      // this is desktop
    }
  },
  [type.SET_HEAD_IMG_URL] (state:any, headImgUrl:string) {
    let win: any = window || {}
    let getUserInfoData = JSON.parse(win.external.GetUserLoginInfo())
    getUserInfoData.headUrl = headImgUrl
    try {
      // 调用盒子并塞值
      win.external.SetUserLoginInfo(JSON.stringify(getUserInfoData))
    } catch (e) {}
  },
  [type.SET_USER_NAME] (state:any, userName:string) {
    let win: any = window || {}
    let getUserInfoData = JSON.parse(win.external.GetUserLoginInfo())
    getUserInfoData.userName = userName
    try {
      // 调用盒子并塞值
      win.external.SetUserLoginInfo(JSON.stringify(getUserInfoData))
    } catch (e) {}
  },
  [type.USER_WX_BIND] (state:any, userInfo:any) {
    let win: any = window || {}
    let params = { type: userInfo.type, username: userInfo.username, password: userInfo.password, openid: userInfo.openid, unionid: userInfo.unionid, bind: userInfo.bind }
    post(apiConfig('login/wxBind'), params)
      .then((result:any) => {
        if (result.code === 200) {
          // 调用登录接口
          let loginType:string = 'pc'
          let params = { username: userInfo.username, password: encrypt(userInfo.password), loginType: 'pc', secretKey: true }
          post(apiConfig('login/passwordLogin') + '&type=' + loginType, params)
            .then((res: any) => {
              if (res.code === 200) {
                res.data = JSON.parse(decrypt(res.data))
                state.userName = res.data.userInfo.username
                state.userID = res.data.userInfo.userid
                state.headImgUrl = res.data.userInfo.headImgUrl
                state.role = res.data.userInfo.role
                state.token = res.data.access_token

                let params = {
                  token: res.data.access_token,
                  expires_in: res.data.expires_in,
                  userId: res.data.userInfo.userid,
                  userName: res.data.userInfo.username,
                  headUrl: res.data.userInfo.headImgUrl
                }
                Message({
                  message: '绑定成功',
                  type: 'success',
                  duration: 1500
                })
                try {
                  // 调用盒子并塞值
                  win.external.SetUserLoginInfo(JSON.stringify(params))
                } catch (e) {
                  console.log(e)
                }
                if (userInfo.bind) {
                  if (userInfo.redirectAddress) {
                    if (userInfo.redirectAddress.indexOf('?') >= 0) {
                      window.location.href = userInfo.redirectAddress + '&token=' + res.data.access_token
                    } else {
                      window.location.href = userInfo.redirectAddress + '?token=' + res.data.access_token
                    }
                    return
                  }
                }
                userInfo.next(1, res.data.access_token)
              }
            })
            .catch((err:any) => {
              Message({
                message: err.response.data.msg || '系统错误',
                type: 'warning',
                duration: 1500
              })
            })
        } else {
          // Message({
          //   message: result.msg,
          //   type: 'warning',
          //   duration: 1500
          // })
          userInfo.next(result.msg)
        }
      })
  }
}
