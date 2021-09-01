/*
 author: zmy
 since: 2019-11-19
 description: 校验url
 */
// https://nj.develop.test.obs.cn-east-2.myhuaweicloud.com:443/e129586978b64ec0b427ed9d5f29e09d.jpg?AccessKeyId=CLX6MAVTXA1WBLKJFVI7&Expires=1576556223&Signature=%2BIeDE8w1DHb4bVyfU%2BHhxEQH4kQ%3D

// https://nj.develop.test.obs.cn-east-2.myhuaweicloud.com:443/headPic/21f69c0299a2451eac5c018c3bcfa2e0.png?AccessKeyId=CLX6MAVTXA1WBLKJFVI7&Expires=1577690137&Signature=xDP6qPxCURZnRxcSqfV5XqAjeQs%3D
function checkurl (url:any) {
  /* if(url.indexOf(':443/')!=-1){
    let commonurl = url.split('//')[1]
    let  first = commonurl.split(':')[0]
    let second = commonurl.split(':')[1].split('443/')[1]
    url = "http://" + first + '/' + second
  } */
  return url
}

export default checkurl
