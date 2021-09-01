const Mock = require('mockjs')
const Random = Mock.Random

/*
*  首页-应用列表 */
function userMockData (name:string) {
  switch (name) {
    case 'userInfoData': {
      const userInfoData = ():boolean => {
        let articles:boolean = true
        return articles
      }
      return userInfoData
    }
  }
}

export {
  userMockData
}
