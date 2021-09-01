import getters from './getters'
import actions from './actions'
import mutations from './mutations'

interface informationInterface {
  type: string | null,
  password: string | null,
  username: string | null,
  realName: string | null,
  telephone: string | null,
  phone: string | null,
  mail: string | null,
  showMail: string | null,
  authorizationStatus: string | null,
  companyName: string | null,
  companyNameFlag: string | null,
  department: string | null,
  positionLable: string | null,
  industryType: string | null,
  softAbilityLable: string | null,
  serverAbilityLable: string | null,
  imageUrl: string | null,
}

const state = {
  type: localStorage.getItem('infomation-type') ? localStorage.getItem('infomation-type') : 'show',
  password: localStorage.getItem('infomation-password') ? localStorage.getItem('infomation-password') : '',
  username: localStorage.getItem('infomation-username') ? localStorage.getItem('infomation-username') : '',
  realName: localStorage.getItem('infomation-realName') ? localStorage.getItem('infomation-realName') : '',
  telephone: localStorage.getItem('infomation-telephone') ? localStorage.getItem('infomation-telephone') : '',
  phone: localStorage.getItem('infomation-phone') ? localStorage.getItem('infomation-phone') : '',
  mail: localStorage.getItem('infomation-mail') ? localStorage.getItem('infomation-mail') : '',
  showMail: localStorage.getItem('infomation-showMail') ? localStorage.getItem('infomation-showMail') : '',
  authorizationStatus: localStorage.getItem('infomation-authorizationStatus') ? localStorage.getItem('infomation-authorizationStatus') : -1,
  companyName: localStorage.getItem('infomation-companyName') ? localStorage.getItem('infomation-companyName') : '',
  companyNameFlag: localStorage.getItem('infomation-companyNameFlag') ? localStorage.getItem('infomation-companyNameFlag') : '',
  department: localStorage.getItem('infomation-department') ? localStorage.getItem('infomation-department') : '',
  positionLable: localStorage.getItem('infomation-positionLable') ? localStorage.getItem('infomation-positionLable') : '',
  industryType: localStorage.getItem('infomation-industryType') ? localStorage.getItem('infomation-industryType') : '',
  softAbilityLable: localStorage.getItem('infomation-softAbilityLable') ? localStorage.getItem('infomation-softAbilityLable') : '',
  serverAbilityLable: localStorage.getItem('infomation-serverAbilityLable') ? localStorage.getItem('infomation-serverAbilityLable') : '',
  imageUrl: localStorage.getItem('infomation-imageUrl') ? localStorage.getItem('infomation-imageUrl') : ''
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
