// @ts-ignore
import CryptoJS from 'crypto-js'
// 秘钥
const CRYPTOJSKEY = 'zhizaoyuncode666'
// 加密
function encrypt (text: any) {
  var plaintText = text
  var options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }
  var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY)
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options)
  var encryptedBase64Str = encryptedData.toString()
  return encryptedBase64Str
}
// 解密
function decrypt (encryptedBase64Str: any) {
  var vals = encryptedBase64Str
  var options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }
  var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY)
  var decryptedData = CryptoJS.AES.decrypt(vals, key, options)
  var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData)
  return decryptedStr
}
export {
  encrypt,
  decrypt
}
