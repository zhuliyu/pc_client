export default {
  getUserInfo: (state:any) => (str:string) => {
    return str + state.userName + '_' + state.userID
  }
}
