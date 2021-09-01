const Mock = require('mockjs')
const Random = Mock.Random

/*
*  登录-忘记密码 */
function forgetMockData (name:string) {
  switch (name) {
    case 'checkAccount': {
      const checkAccountData = ():object => {
        return {
          'id': '101',
          'username': 'test',
          'headImgUrl': '',
          'phone': '18652519205',
          'remarks': null,
          'companyId': '2',
          'role': '1'
        }
      }
      return checkAccountData
    }
    case 'codeImg': {
      const codeImgData = ():any => {
        return {
          base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAeCAIAAAA0IQ7mAAABgElEQVR4Xu2W0U0DQQxErwlaQHRAD3RBBfzRDx0gaqKPcNJKJ/uN7b1jFV20ifQ+Mt7xbEY5JVmWy+W+oJ4e6umhnh7q6aGeHmrP6+fPRnakW/ux+Rm6NQS1p7g4mx9C6ym6NQS1p7g4m49wjUxC7XkUDo50699cI5NQex6Fg6M98yIntOkRDIqaY6g9RWJ3bo90EtK12fAQXSHUHk1Uii0NeX/6Un+2qGRXh8MYag8uCNEtu4jXK2vnrHadaQ3wZPMAak8RlM11MbSFnTOzGtSTzQm1Z+QCuxvatHNhhkE92ZxQe0YuKHY38Hh3/ch8+XjTI91yUHuKN53N1VDbFvNRd80IvKHCdrF2NlrnrhNpt1IYW4XTsnbuOpG8Fca8gtpTBHXn9kgnIV2bDW+2tXN4Ywq1p8g6NC9yQpsewRCi/gDqU/l9/m4vsj8nttvhqg3qU9kKN7SzNrTfW7ugPhUUXqTzVIW1bcM+3ndRuFH8UB/rTH0edeFFHu+NQ4X/ADGOmDn3/fV5AAAAAElFTkSuQmCC',
          validateCode: 'HxTp'
        }
      }
      return codeImgData
    }
    case 'checkVerifyCode': {
      return '18652519205'
    }
    case 'checkPasswordSame': {
      return false
    }
    case 'resetPasswordWithCode': {
      return '修改密码成功'
    }
  }
}

export {
  forgetMockData
}
