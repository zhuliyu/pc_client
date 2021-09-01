const Mock = require('mockjs')
const Random = Mock.Random

/*
*  首页-应用列表 */
function homeMockData (name:string) {
  switch (name) {
    case 'appListData': {
      const appListData = ():object => {
        let articles:any[] = []
        const count:number = 6
        for (let i = 0; i < count; i++) {
          let appArticleObject:object = {
            'appName': Random.csentence(5, 30),
            'logoUrl': Random.dataImage('300x250', 'mock的图片'),
            'appId': 'app' + (i + 1),
            'redirectUrl': 'http://localhost:3001/yyzx_pc/about?scope=123123&state=123213123'
          }
          articles.push(appArticleObject)
        }
        return articles
      }
      return appListData
    }
    case 'bannerListData': {
      const bannerListData = ():object => {
        let articles:any[] = []
        const count:number = 3
        for (let i = 0; i < count; i++) {
          let bannerArticleObject:object = {
            'imgUrl': './img/home/banner.jpg',
            'linkUrl': 'http://www.baidu.com'
          }
          articles.push(bannerArticleObject)
        }
        return articles
      }
      return bannerListData
    }
    case 'appRecordData': {
      const appRecordData = ():boolean => {
        let articles:boolean = true
        return articles
      }
      return appRecordData
    }
    case 'newsListData': {
      const newsListData = ():object => {
        interface newsInterface {
          total: number,
          infos: object[]
        }
        let articles:newsInterface = {
          total: 66,
          infos: []
        }
        const count:number = 10
        for (let i = 0; i < count; i++) {
          let bannerArticleObject:object = {
            'gainTime': Random.date() + ' ' + Random.time(),
            'imgUrl': Random.dataImage('300x250', 'mock的图片'),
            'infoUrl': 'http://www.baidu.com',
            'title': Random.csentence(5, 30),
            'channel': '蜂巢新闻',
            'summary': Random.csentence(30, 100)
          }
          articles.infos.push(bannerArticleObject)
        }
        return articles
      }
      return newsListData
    }
    case 'insertingCoil': {
      const insertingCoil = ():object => {
        return {
          'code': 200,
          'data': 0,
          'msg': 'app操作查询成功！'
        }
      }
      return insertingCoil
    }
  }
}

export {
  homeMockData
}
