const Mock = require('mockjs')
const Random = Mock.Random

/*
*  首页-应用列表 */
function messagesMockData (name:string) {
  switch (name) {
    case 'msgListData': {
      const msgListData = ():object => {
        let articles:any[] = []
        const count:number = 10
        for (let i = 0; i < count; i++) {
          let appArticleObject:object = {
            'haveNewNotice': Random.pick([true, false]),
            'logoUrl': Random.dataImage('300x250', 'mock的图片'),
            'appName': Random.csentence(3, 20),
            'latestPushTime': Random.now('day'),
            'latestContent': Random.csentence(5, 20),
            'appId': 'app' + (i + 1)
          }
          articles.push(appArticleObject)
        }
        return articles
      }
      return msgListData
    }
    case 'infoListData': {
      const infoListData = ():object => {
        let articles:any[] = []
        const count:number = 10
        for (let i = 0; i < count; i++) {
          let appArticleObject:object = {
            'noticeTitle': Random.csentence(1, 10),
            'noticeTime': Random.now('day'),
            'noticeContent': Random.csentence(5, 10),
            'infoId': 'app' + (i + 1)
          }
          articles.push(appArticleObject)
        }
        return articles
      }
      return infoListData
    }
  }
}

export {
  messagesMockData
}
