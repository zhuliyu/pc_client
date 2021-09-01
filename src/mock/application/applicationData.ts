const Mock = require('mockjs')
const Random = Mock.Random

/*
*  首页-应用列表 */
function applicationMockData (name:string) {
  switch (name) {
    case 'appListData': {
      const appListData = ():object => {
        let articles:any[] = []
        const count:number = 11
        for (let i = 0; i < count; i++) {
          let appArticleObject:object = {
            'logoUrl': Random.dataImage('80x80', 'mock的图片'),
            'appName': Random.csentence(1, 10),
            'facilitatorName': Random.csentence(5, 10),
            'appId': 'app' + (i + 1)
          }
          articles.push(appArticleObject)
        }
        return articles
      }
      return appListData
    }
    case 'platformAuthorizationData': {
      const appListData = ():boolean => {
        return true
      }
      return appListData
    }
  }
}

export {
  applicationMockData
}
