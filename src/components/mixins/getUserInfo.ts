import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'getUserInfo'
})
export default class getUserInfo extends Vue {
  public userId:string = (():string => {
    let win: any = window || {}
    let getUserInfo:any = {}
    let tempUserId:string
    try {
      getUserInfo = JSON.parse(win.external.GetUserLoginInfo())
    } catch (e) {
      getUserInfo = {
        userId: ''
      }
    } finally {
      tempUserId = getUserInfo.userId
    }
    return tempUserId
  })()
}
