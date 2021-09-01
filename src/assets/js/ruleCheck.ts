/*
 author: zmy
 since: 2019-11-19
 description: 手机号、身份证、邮箱正则校验
 */
const trueFlag:boolean = true
const falseFlag:boolean = false
function checkNumberAndEmail (type:string, value:any, callback:any) {
  switch (type) {
    // 11位手机号
    case 'telephoneNumber': {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 15位/18位身份证
    case 'IdCard': {
      if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 邮箱
    case 'email': {
      if (!(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 6位短信验证码
    case 'verificationCode': {
      if (!(/^\d{6}$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 6为邮政编码
    case 'postalCode': {
      if (!(/^[0-9]{6}$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 社会信用代码
    case 'socialCreditCode': {
      if (!(/^[0-9A-Z]{18}$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 密码
    // if(!(/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/.test(value))){
    case 'password': {
      if (!(/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=]+$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
    // 人名校验
    case 'nameCheck': {
      if (!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value))) {
        callback(falseFlag)
      } else {
        callback(trueFlag)
      }
      break
    }
  }
}

export {
  checkNumberAndEmail
}
