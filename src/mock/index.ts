import { getInterfacesData } from '../utils/api/Interfaces'
const Mock = require('mockjs')
const interfacesData = getInterfacesData()
const projectName:any = interfacesData.projectName
const urlData:any = interfacesData.interfacesData
const isPublished:boolean = interfacesData.isPublished

Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.widthCredentials = this.widthCredentials || false
  }
  this.proxy_send(...arguments)
}

function doMockSearch (data:any) {
  for (let keyChild in data) {
    if (data[keyChild].localData) {
      if (data[keyChild].type === 'get') {
        Mock.mock(RegExp(projectName + data[keyChild].remoteUrl + '.*'), data[keyChild].type, data[keyChild].localData)
      } else {
        Mock.mock(projectName + data[keyChild].remoteUrl, data[keyChild].type, data[keyChild].localData)
      }
    } else {
      doMockSearch(urlData[keyChild])
    }
  }
}

if (!isPublished) {
  doMockSearch(urlData)
}
