const Mock = require('mockjs')
const Random = Mock.Random

/*
*  登录-短信验证码j校验 * */
function loginMockData (name:string) {
  switch (name) {
    case 'sendVerifyCode': {
      const sendVerifyCodeData = ():object => {
        return {
          smsUuid: 'msUUID123',
          phone: '18652519205',
          verifyCode: '632953'
        }
      }
      return sendVerifyCodeData
    }
    case 'checkPhoneIsUsed': {
      const checkPhoneIsUsedData = ():any => {
        return {
          code: 200,
          msg: '该手机号已注册',
          data: true
        }
      }
      return checkPhoneIsUsedData
    }
    case 'loginSms': {
      const loginSmsData = ():any => {
        return {
          access_token: '12af06e8-6b96-412c-aec0-367c58250acd',
          refresh_token: 'ff24e82d-494c-4164-95ea-5d2a24ce4c52',
          token_type: 'bearer',
          expires_in: 28800,
          scope: ['app'],
          userInfo: {
            userid: '101',
            username: 'test',
            headImgUrl: '../../public/img/company/head.jpg',
            phone: '18652519205',
            remarks: '',
            companyId: '2',
            companyStatus: '0',
            role: '2',
            isIdentification: '2'
          }
        }
      }
      return loginSmsData
    }
    case 'loginPassword': {
      const loginPasswordData = ():any => {
        return {
          'access_token': '12af06e8-6b96-412c-aec0-367c58250acd',
          'refresh_token': 'ff24e82d-494c-4164-95ea-5d2a24ce4c52',
          'token_type': 'bearer',
          'expires_in': 28800,
          'scope': ['app'],
          'userInfo': {
            'userid': '101',
            'username': 'test',
            'headImgUrl': '../../public/img/company/head.jpg',
            'phone': '18652519205',
            'remarks': '',
            'companyId': '2',
            'companyStatus': '0',
            'role': '2',
            'isIdentification': '2'
          }
        }
      }
      return loginPasswordData
    }
    case 'registerSubmit': {
      const registerData = ():any => {
        return {
          'code': 200,
          'success': true,
          'msg': ''
        }
      }
      return registerData
    }
    case 'checkAccount': {
      return {
        id: '101',
        username: 'test',
        headImgUrl: '',
        phone: '18652519205',
        remarks: null,
        companyId: '2',
        role: '1'
      }
    }
  }
}

export {
  loginMockData
}
