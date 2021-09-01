<template>
  <div class="forget-panel">
    <div class="forget-form">
      <div class="forget-form-content">
        <div v-show="suffix === 0">
          <div class="forget-form-title">
            <span>{{ tip }}</span>
          </div>

          <div class="forget-form-content">
            <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="0px" class="demo-ruleForm">
              <el-form-item label="" prop="loginName">
                <el-input placeholder="请输入您的手机号/用户名" v-model="ruleForm1.loginName"></el-input>
              </el-form-item>

              <el-form-item label="" prop="identifyingCode" class="identifyingCode">
                <el-input placeholder="请输入验证码" v-model="ruleForm1.identifyingCode"></el-input>

                <img class="suffix-panel-codeImg" :src="codeImg" @click="getCodeImg()" />
              </el-form-item>

              <el-form-item class="forget-form-btn">
                <el-button @click="loginIn()">取消</el-button>

                <el-button type="primary" @click="nextForm('ruleForm1')">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div v-show="suffix === 1">
          <div class="forget-form-title">
            <span>{{ tip }}</span>
          </div>

          <div class="forget-form-content">
            <el-form :model="ruleForm2" :rules="rules" ref="ruleForm2" label-width="0px" class="demo-ruleForm">
              <el-form-item label="">
                <el-radio-group v-model="ruleForm2.type" @change="changeRadios()">
                  <el-radio label="1">向手机{{ telephoneNumber }}发送验证码</el-radio><div style="width: 10px;height: 15px;"></div>

                  <el-radio label="2">以上手机不可用</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-show="ruleForm2.type === '1'" label="" prop="messageCode" class="identifyingCode">
                <el-input placeholder="请输入您的验证码" v-model="ruleForm2.messageCode"></el-input>

                <el-button type="primary" class="messageBtn" @click="getCode()">{{ codeInfo }}</el-button>
              </el-form-item>

              <div class="helpInformation" v-show="ruleForm2.type === '2'">
                <div class="helpInformation-title">请联系人工客服获取帮助</div>

                <div>邮箱：support@zhizaoyun.com</div>

                <div>电话：0571-81967035</div>
              </div>

              <el-form-item class="forget-form-btn">
                <el-button @click="before()">上一步</el-button>

                <el-button type="primary" @click="nextForm('ruleForm2')" :disabled="!readAgreementChecked">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div v-show="suffix === 2">
          <div class="forget-form-title">
            <span>{{ tip }}</span>
          </div>

          <div class="forget-form-content">
            <el-form :model="ruleForm3" :rules="rules" ref="ruleForm3" label-width="0px" class="demo-ruleForm">
              <el-form-item label="" prop="password1">
                <el-input placeholder="请设置新密码" :type="pwdType1" v-model="ruleForm3.password1"
                          oncopy="return false" onpaste="return true" oncut="return false">
                  <i slot="suffix" :class="pwdType1 === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showPwd1()"></i>
                </el-input>
              </el-form-item>

              <el-form-item label="" prop="password2">
                <el-input placeholder="请再次确认您的新密码" :type="pwdType2" v-model="ruleForm3.password2"
                          oncopy="return false" onpaste="return true" oncut="return false">
                  <i slot="suffix" :class="pwdType2 === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showPwd2()"></i>
                </el-input>
              </el-form-item>

              <el-form-item class="forget-form-btn">
                <el-button @click="before()">上一步</el-button>

                <el-button type="primary" @click="nextForm('ruleForm3')">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div v-show="suffix === 3">
          <div class="final-step">
            <div>
              <i class="fa fa-check-circle final-step-right"></i>
            </div>

            <div class="final-step-info">密码重置成功</div>

            <div class="final-step-countDown">
              <span>{{ countDown }}</span><span>秒后</span><span style="color: #828282;">返回登录页</span>
            </div>

            <div class="final-step-login">
              <el-button type="primary" @click="loginIn()">立即登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SMS from '../views/sms/index.vue'
import { apiConfig, _Fetch, post, fetch } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import {
  Button,
  Tree,
  Form,
  FormItem,
  Input,
  Checkbox,
  Radio,
  RadioGroup
} from 'element-ui'

interface ruleForm3Interface {
  password1:string,
  password2: string
}
interface ruleForm2Interface {
  type:string,
  messageCode: string,
  uuid: string
}
interface ruleForm1Interface {
  loginName:string,
  identifyingCode: string
}
interface rulesInterface {
  loginName: any,
  identifyingCode: any,
  messageCode: any,
  password1: any,
  password2: any
}

@Component({
  name: 'Forget',
  components: {
    SMS,
    [Button.name]: Button,
    [Tree.name]: Tree,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup
  }
})
export default class Forget extends Vue {
  tip:string = '找回密码-账号确认';
  suffix:number = 0;
  tempCode: string = '';
  codeImg: string = '';
  phoneNumber: string = '';
  telephoneNumber: string = '';
  readAgreementChecked: boolean = true;
  codeInfo: string = '获取短信验证码';
  codeInterval: number = 0;
  countInterval: number = 0;
  pwdType1: string = 'password';
  pwdType2: string = 'password';
  countDown: number = 5;
  ruleForm3:ruleForm3Interface = {
    password1: '',
    password2: ''
  };
  ruleForm2: ruleForm2Interface = {
    type: '1',
    messageCode: '',
    uuid: ''
  };
  ruleForm1: ruleForm1Interface = {
    loginName: '',
    identifyingCode: ''
  };
  rules: rulesInterface = {
    loginName: [{ validator: (rule:any, value:string, callback:any) => {
      if (value === '') {
        return callback(new Error('请输入您的手机号/用户名'))
      } else {
        if (value.indexOf(' ') >= 0) {
          return callback(new Error('手机号/用户名不能输入空格'))
        } else {
          fetch(apiConfig('forget/checkAccount'), { username: value })
            .then((res:any) => {
              if (res.code === 200) {
                callback()
              } else {
                return callback(new Error('该手机号/用户名未注册'))
              }
            })
        }
      }
    },
    trigger: 'blur' }],
    identifyingCode: [{ validator: this.identifyingCodeRules, trigger: 'blur' }
    ],
    messageCode: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
    password1: [{ validator: (rule:any, value:string, callback:any) => {
      if (value === '') {
        return callback(new Error('请输入您的新密码'))
      } else {
        if ((value.length < 6) || (value.length > 20)) {
          callback(new Error('长度在6到20个字符，数字、字母（区分大小写）、特殊符号组成'))
        } else {
          if (value.indexOf(' ') >= 0) {
            return callback(new Error('密码不能有空格'))
          } else {
            checkNumberAndEmail('password', value, async (checkResult:boolean) => {
              if (!checkResult) {
                await callback(new Error('长度在6到20个字符，数字、字母（区分大小写）、特殊符号组成'))
              } else {
                if ((/^[0-9]*$/.test(value)) || (/^[a-z]*$/.test(value)) || (/^[A-Z]*$/.test(value)) || (/^[\.!@#\$%\\\^&\*\)\(\+=]+$/.test(value))) {
                  await callback(new Error('大写字母、小写字母、数字和特殊符号至少包含2种'))
                } else {
                  await _Fetch(apiConfig('forget/checkPassWord'), { username: this.ruleForm1.loginName, password: this.ruleForm3.password1 })
                    .then(async (res:any) => {
                      if (res.data) {
                        await callback(new Error('该密码与原登录密码相同，请重新设置'))
                      } else {
                        await callback()
                        if (this.ruleForm3.password2 !== '') {
                          (this.$refs['ruleForm3'] as HTMLFormElement).validateField('password2', (emailError:boolean) => {
                            if (!emailError) {
                            } else {
                              return false
                            }
                          })
                        }
                      }
                    })
                }
              }
            })
          }
        }
      }
    },
    trigger: 'blur' }],
    password2: [{ validator: async (rule:any, value:string, callback:any) => {
      if (value === '') {
        await callback(new Error('请确认您的新密码'))
      } else {
        if (value !== this.ruleForm3.password1) {
          await callback(new Error('两次密码输入不一致'))
        } else if (value.indexOf(' ') >= 0) {
          await callback(new Error('密码不能有空格'))
        } else {
          await _Fetch(apiConfig('forget/checkPassWord'), { username: this.ruleForm1.loginName, password: this.ruleForm3.password1 })
            .then(async (res:any) => {
              if (res.data) {
                await callback(new Error('该密码与原登录密码相同，请重新设置'))
              } else {
                await callback()
              }
            })
        }
      }
    },
    trigger: 'blur' }]
  };
  identifyingCodeRules (rule:any, value:string, callback:any) {
    if (value === '') {
      return callback(new Error('请输入验证码'))
    } else {
      if (value !== this.tempCode) {
        return callback(new Error('请输入正确的验证码'))
      }
      callback()
    }
  }
  showPwd1 ():void{
    this.pwdType1 === 'password' ? this.pwdType1 = '' : this.pwdType1 = 'password'
  }
  showPwd2 ():void{
    this.pwdType2 === 'password' ? this.pwdType2 = '' : this.pwdType2 = 'password'
  }
  changeRadios ():void{
    this.readAgreementChecked = !this.readAgreementChecked
  }
  getCode ():void{
    if (this.codeInfo === '获取短信验证码') {
      post(apiConfig('login/message'), { phoneNum: this.phoneNumber, smsType: 'forgot' })
        .then((res:any) => {
          if (res.code === 200) {
            let count = 60
            this.ruleForm2.uuid = res.data.smsUuid
            this.codeInterval = window.setInterval(() => {
              if (count === -1) {
                this.codeInfo = '获取短信验证码'
                window.clearInterval(this.codeInterval)
              } else {
                this.codeInfo = count + '秒后可重发'
                count--
              }
            }, 1000)
          } else if (res.code === 201) {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          } else {
            this.$message({
              message: '多次获取短信验证码，15分钟后请重试',
              type: 'warning'
            })
          }
        })
    }
  }
  before ():void{
    this.ruleForm2.type = '1'
    this.readAgreementChecked = true
    this.suffix--
    this.changeTip()
    if (this.suffix === 0) {
      this.getCodeImg()
    }
  }
  nextForm (formName:string):void{
    (this.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        window.setTimeout(() => {
          if (this.suffix === 0) {
            _Fetch(apiConfig('forget/checkAccount'), { username: this.ruleForm1.loginName })
              .then((res:any) => {
                if (res.code === 200) {
                  this.phoneNumber = res.data.phone
                  this.telephoneNumber = res.data.phone.substring(0, 3) + '******' + res.data.phone.substring(9, 11)
                  this.ruleForm2.type = '1'
                  this.readAgreementChecked = true
                  this.suffix++
                  this.changeTip()
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
          } else if (this.suffix === 1) {
            if (this.ruleForm2.uuid) {
              _Fetch(apiConfig('forget/checkStatus'), { code: this.ruleForm2.messageCode, key: this.ruleForm2.uuid, delete: false })
                .then((res:any) => {
                  if (res.code === 200) {
                    this.ruleForm2.type = '1'
                    this.readAgreementChecked = true
                    this.suffix++
                    this.changeTip()
                  } else {
                    this.$message({
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                })
            } else {
              this.$message({
                message: '验证码错误或已失效！',
                type: 'warning'
              })
            }
          } else {
            post(apiConfig('forget/commitPassword'), { phoneNum: this.phoneNumber, newPassword: this.ruleForm3.password2, code: this.ruleForm2.messageCode, key: this.ruleForm2.uuid })
              .then((res:any) => {
                if (res.code === 200) {
                  this.ruleForm2.type = '1'
                  this.readAgreementChecked = true
                  this.suffix++
                  this.changeTip()
                  this.countInterval = window.setInterval(() => {
                    this.countDown--
                    if (this.countDown === -1) {
                      this.$router.push({
                        path: '/login'
                      })
                    }
                  }, 1000)
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
          }
        }, 1000)
      } else {
        return false
      }
    })
  }
  loginIn ():void{
    this.$router.push({
      path: '/login'
    })
  }
  getCodeImg ():void{
    this.initCodeImg()
  }
  initCodeImg ():void{
    fetch(apiConfig('forget/codeImg'), {})
      .then((res:any) => {
        this.codeImg = res.data.base64
        this.tempCode = res.data.validateCode
      })
  }
  changeTip ():void{
    let tempString = ''
    switch (this.suffix) {
      case 0:
        tempString = '找回密码-账号确认'
        break
      case 1:
        tempString = '找回密码-身份验证'
        break
      case 2:
        tempString = '找回密码-密码重置'
        break
      case 3:
        tempString = ''
        break
      default:
        tempString = '找回密码-账号确认'
    }
    this.tip = tempString
  }
  private mounted () {
    this.initCodeImg()
  }
  private destroyed () {
    if (this.codeInterval) {
      window.clearInterval(this.codeInterval)
    }
    if (this.countInterval) {
      window.clearInterval(this.countInterval)
    }
  }
}
</script>

<style>
  .forget-form .identifyingCode .el-input {width: calc(100% - 220px);}
  .forget-form .el-input input {height: 40px;}
  .forget-form .forget-form-btn .el-button {width: 48%;height: 45px;font-size: 18px;float: left;/*px*/}
  .forget-form .final-step-login .el-button {width: 100%;height: 45px;font-size: 18px;float: left;/*px*/}
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @import '~font-awesome/css/font-awesome.css';
  .forget-panel {
    .regionSize(@fill, @fill);
    background: url("../assets/img/login/bg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    .forget-form {
      .regionSize(@spacing * 28, @spacing * 22);
      background-size: @fill @fill;
      margin: 0 auto;
      top: 50%;
      margin-top: -(@spacing * 12);
      .forget-form-content{
        &>div {
          /*.regionSize(@spacing * 28, @spacing * 22);*/
          width: @spacing * 28;
          background: url("../assets/img/login/form.png") no-repeat center / contain;
          background-size: 100% 100%;
          /* margin-left: @spacing * 4;
           top: @spacing * 1.5;*/
          .forget-form-title {
            width: calc(100% - 120px);
            padding-top: 40px;
            padding-left: 80px;
            &>span {
              color: #1f8dfb;
              font-weight: bold;
              font-size: 26px;/*px*/
            }
          }
          .forget-form-content {
            padding-top: @spacing * 1.5;
            width: calc(100% - 140px);
            padding-left: 80px;
            .suffix-panel-codeImg {
              float:right;
              width: @spacing * 10;
              height: 40px;
            }
            .forget-form-btn {
              padding-top: 20px;
              padding-bottom: 30px;
            }
            .messageBtn {
              float: right;
              width: @spacing * 10.5;
              height: 40px;
              text-align: center;
              text-indent: -7px;
            }
            .helpInformation {
              .regionSize(@fill, @spacing * 7);
              line-height: @spacing * 2;
              text-indent: @spacing;
              background: url("../assets/img/forget/tip.png") no-repeat;
              background-size: cover;
              overflow: hidden;
              .helpInformation-title {
                font-weight: bold;
                margin-top: @spacing / 2;
              }
            }
          }
        }
        .final-step {
          width: @spacing * 10.5;
          height: @spacing * 15;
          position: relative;
          left: 185px;
          top: @spacing ;
          text-align: center;
          .final-step-right {
            font-size: @spacing * 5;
            color: #74baff;
          }
          .final-step-info {
            color: #333333;
            font-weight: bold;
            font-size: 26px;/*px*/
            margin-top: @spacing / 2;
          }
          .final-step-countDown {
            margin-top: @spacing / 2;
            font-size: @spacing;/*px*/
            color: #218dfa;
          }
          .final-step-login {
            margin-top: @spacing * 1.5;
            width: @spacing * 10.5;
            height: @spacing * 3.5;
          }
        }
      }
    }
  }
</style>
