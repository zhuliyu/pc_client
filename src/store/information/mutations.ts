import * as type from './mutation-types'
export default {
  [type.SET_USER_INFORMATION] (state:any, userData:any) {
    localStorage.setItem('infomation-type', userData.type)
    state.type = userData.type
    localStorage.setItem('infomation-password', userData.password)
    state.password = userData.password
    localStorage.setItem('infomation-username', userData.username)
    state.username = userData.username
    localStorage.setItem('infomation-realName', userData.realName)
    state.realName = userData.realName
    localStorage.setItem('infomation-telephone', userData.telephone)
    state.telephone = userData.telephone
    localStorage.setItem('infomation-phone', userData.phone)
    state.phone = userData.phone
    localStorage.setItem('infomation-mail', userData.mail)
    state.mail = userData.mail
    localStorage.setItem('infomation-showMail', userData.showMail)
    state.showMail = userData.showMail
    localStorage.setItem('infomation-authorizationStatus', userData.authorizationStatus)
    state.authorizationStatus = userData.authorizationStatus
    localStorage.setItem('infomation-companyName', userData.companyName)
    state.companyName = userData.companyName
    localStorage.setItem('infomation-companyNameFlag', userData.companyNameFlag)
    state.companyNameFlag = userData.companyNameFlag
    localStorage.setItem('infomation-department', userData.department)
    state.department = userData.department
    localStorage.setItem('infomation-positionLable', userData.positionLable)
    state.positionLable = userData.positionLable
    localStorage.setItem('infomation-industryType', userData.industryType)
    state.industryType = userData.industryType
    localStorage.setItem('infomation-softAbilityLable', userData.softAbilityLable)
    state.softAbilityLable = userData.softAbilityLable
    localStorage.setItem('infomation-serverAbilityLable', userData.serverAbilityLable)
    state.serverAbilityLable = userData.serverAbilityLable
    localStorage.setItem('infomation-imageUrl', userData.imageUrl)
    state.imageUrl = userData.imageUrl
  },
  [type.CANCEL_USER_INFORMATION] (state:any) {
    localStorage.removeItem('infomation-type')
    state.type = 'show'
    localStorage.removeItem('infomation-password')
    state.password = ''
    localStorage.removeItem('infomation-username')
    state.username = ''
    localStorage.removeItem('infomation-realName')
    state.realName = ''
    localStorage.removeItem('infomation-telephone')
    state.telephone = ''
    localStorage.removeItem('infomation-phone')
    state.phone = ''
    localStorage.removeItem('infomation-mail')
    state.mail = ''
    localStorage.removeItem('infomation-showMail')
    state.showMail = ''
    localStorage.removeItem('infomation-authorizationStatus')
    state.authorizationStatus = -1
    localStorage.removeItem('infomation-companyName')
    state.companyName = ''
    localStorage.removeItem('infomation-department')
    state.department = ''
    localStorage.removeItem('infomation-positionLable')
    state.positionLable = ''
    localStorage.removeItem('infomation-industryType')
    state.industryType = ''
    localStorage.removeItem('infomation-softAbilityLable')
    state.softAbilityLable = ''
    localStorage.removeItem('infomation-serverAbilityLable')
    state.serverAbilityLable = ''
    localStorage.removeItem('infomation-imageUrl')
    state.imageUrl = ''
  }
}
