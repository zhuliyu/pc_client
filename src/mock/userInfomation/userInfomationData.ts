const Mock = require('mockjs')
const Random = Mock.Random

/*
*  首页-应用列表 */
function userInfomationMockData (name:string) {
  switch (name) {
    case 'showPersonalBasicInfos': {
      return {
        basicInfo: {
          realName: '李张三',
          username: 'test124',
          password: '1111111',
          mail: '111@qq.com',
          telephone: '13309097878',
          authorizationStatus: 1
        },
        linkInfo: {
          area: '天津-天津县辖-宝坻县',
          detailAddr: '111',
          postalCode: '',
          provinceName: '江苏',
          cityName: '南京',
          countyName: '建邺'
        },
        workInfo: {
          companyName: 'TEST',
          department: 'TEST',
          positionId: 'code1',
          positionName: 'TEST',
          industryTypeName: [],
          industryTypeId: [],
          abilitySoftName: [],
          abilityServiceName: [],
          abilitySoftId: [],
          abilityServiceId: []
        }
      }
    }
    case 'editPersonalBasicInfos': {
      return ''
    }
    case 'modifyPhoneVerificationCode': {
      return ''
    }
    case 'modifyPhoneSubmit': {
      return {}
    }
  }
}

export {
  userInfomationMockData
}
