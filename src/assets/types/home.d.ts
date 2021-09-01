type noStringData = string|null|undefined
interface newsInterface {
  total:number,
  infos:object[],
  pageNumber:number
}
interface IAppInfoInterface {
  appList:Array<any>,
  appCount:number,
  tabChange:string,
  bannerList:Array<any>,
  newsList:newsInterface,
  tempId:noStringData,
  dialogVisible:boolean
}

export {
  noStringData,
  IAppInfoInterface
}
