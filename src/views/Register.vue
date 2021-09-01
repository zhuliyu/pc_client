<template>
  <div class="register-panel">
    <div class="closeBox" @click="closeBox()">
      <i class="el-icon-close"></i>
    </div>
    <div class="register-form">
      <div>
        <div class="register-form-title">
          <span>欢迎注册</span><span @click="goLogin()">立即登录</span><span>已有账号？</span>
        </div>

        <div class="register-form-content">
          <el-form ref="registerForm" :rules="rules" :model="registerForm" class="registerForm">
            <el-form-item prop="telephoneNumber">
              <el-input v-model.trim="registerForm.telephoneNumber" class="telephoneNumber" prefix-icon="telephoneNumberPre" maxlength="11" placeholder="请输入您的手机号">
              </el-input>
            </el-form-item>

            <el-form-item prop="textVerificationCode" style="display:none">
              <el-input v-model.trim="registerForm.textVerificationCode" >
              </el-input>
            </el-form-item>

            <el-form-item prop="verificationCode">
                  <el-input class="verificationCodeInput" v-model.trim="registerForm.verificationCode"  placeholder="请输入短信验证码" maxlength="6"></el-input>
                  <SMS class="verificationCodeBtn login-form-sms" v-bind:phoneNumber = registerForm.telephoneNumber
                       v-bind:checkNumber = checkNumber
                       v-bind:msgType = msgType
                       @getUuid = "getUuid"></SMS>
            </el-form-item>

            <el-form-item prop="name">
              <el-input v-model.trim="registerForm.name" placeholder="请设置您的用户名" minlength="2" maxlength="20">
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model.trim="registerForm.password" :type="pwdType" placeholder="请设置您的密码" class="passwordInpput" minlength="6" maxlength="20"
                        oncopy="return false" onpaste="return true" oncut="return false">
                <i slot="suffix" :class="pwdType === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showPwd"></i>
              </el-input>
            </el-form-item>

            <el-form-item  prop="confirmPassword">
              <el-input v-model.trim="registerForm.confirmPassword" :type="confirmPwdType" placeholder="请再次输入密码"  class="confirmPasswordInpput" minlength="6" maxlength="20"
                        oncopy="return false" onpaste="return true" oncut="return false">
                <i slot="suffix" :class="confirmPwdType === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showConfirmPwd"></i>
              </el-input>
            </el-form-item>

            <el-form-item class="readAgreementCheck">
              <el-checkbox v-model="readAgreementChecked">
              </el-checkbox>
              <span class="text">已阅读并同意</span>
              <span class="agreement" @click="openAgreement(1)">《用户服务条款》</span>
              <span class="text" style="margin-left: -15px;">和</span>
              <span class="agreement" @click="openAgreement(2)">《法律声明及隐私权政策》</span>
            </el-form-item>

            <el-form-item :class="readAgreementChecked ? 'registerBtnActive register-form-btn' : 'registerBtn register-form-btn'">
              <el-button type="primary" :disabled="!readAgreementChecked" @click="userRegister('registerForm')">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="go-back" @click="goLogin()">
      <span><i class="fa fa-long-arrow-left"></i></span>
      <span>返回</span>
    </div>
    <el-dialog  title=""
                :visible.sync="show"
                width="700px"
                class="registerDialog"
                :close-on-click-modal="false"
                :show-close="true">
      <firstDeclare v-show="firstDialog"></firstDeclare>
      <secondDeclare v-show="secondDialog"></secondDeclare>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SMS from '../views/sms/index.vue'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import base64encode from '@/assets/js/base64New'
import { Action } from 'vuex-class'
import firstDeclare from '../views/firstDeclare.vue'
import secondDeclare from '../views/secondDeclare.vue'
import config from '@/assets/js/config'
import { Button, Form, FormItem, Input, Checkbox, Dialog } from 'element-ui'

interface registerFormInterface{
  name: string,
  password: string,
  confirmPassword: string,
  verificationCode: string,
  textVerificationCode: number,
  telephoneNumber: string
}
interface ruleInterface {
  telephoneNumber:any,
  verificationCode: any,
  name: any,
  password: any,
  confirmPassword: any
}
interface paramInterface {
  type:string
}

@Component({
  name: 'Register',
  components: {
    SMS,
    firstDeclare,
    secondDeclare,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [Dialog.name]: Dialog
  }
})
export default class Register extends Vue {
  show: boolean = false;
  firstDialog: boolean = false;
  secondDialog: boolean = false;
  msgType: string = 'register';
  checkNumber: string = '';
  registerForm:registerFormInterface ={
    name: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    textVerificationCode: 0,
    telephoneNumber: ''
  };
  pwdType: string = 'password';
  confirmPwdType: string = 'password';
  readAgreementChecked: boolean = false;
  uuid: string = '';
  returnPhone: string = '';
  rules:ruleInterface = {
    telephoneNumber: [
      { validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('手机号不能为空'))
        } else {
          checkNumberAndEmail('telephoneNumber', value, async (checkResult:boolean) => {
            if (!checkResult) {
              return callback(new Error('手机号填写不正确，请输入有效的11位手机号'))
            } else {
              await fetch(apiConfig('forget/checkAccount'), { username: value })
                .then((res:any) => {
                  if (res.code === 200) {
                    this.checkNumber = 'bindPhone'
                    return callback(new Error('当前手机号已注册，建议您立即登录'))
                  } else {
                    this.checkNumber = ''
                    callback()
                  }
                })
            }
          })
        }
      },
      trigger: 'blur' }
    ],
    verificationCode: [
      { validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('请输入短信验证码'))
        } else {
          checkNumberAndEmail('verificationCode', value, (checkResult:boolean) => {
            if (!checkResult) {
              return callback(new Error('验证码填写不正确，请输入6位数字验证码'))
            } else {
              callback()
            }
          })
        }
      },
      trigger: 'blur' }
    ],
    name: [
      { validator: async (rule:any, value:string, callback:any) => {
        if (value === '') {
          return callback(new Error('请输入用户名'))
        } else {
          if (value.indexOf(' ') >= 0) {
            return callback(new Error('用户名不能有空格'))
          } else if ((value.length < 2) || (value.length > 20)) {
            return callback(new Error('长度2~20字符，数字、汉字、英文字母（大小写皆可）、@和.组成'))
          } else if (!(/^[\u4e00-\u9fa50-9A-Za-z\.@]+$/.test(value))) {
            return callback(new Error('长度2~20字符，数字、汉字、英文字母（大小写皆可）、@和.组成'))
          } else {
            await fetch(apiConfig('forget/checkAccount') + '?fid=' + Math.random() * 100, { username: value })
              .then((res:any) => {
                if (res.code === 200) {
                  return callback(new Error('该用户名已被注册'))
                } else {
                  callback()
                }
              })
            if (this.registerForm.confirmPassword !== '') {
              (this.$refs['registerForm'] as HTMLFormElement).validateField('confirmPassword')
            }
          }
        }
      },
      trigger: 'blur' }
    ],
    password: [
      { validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if ((value.length < 6) || (value.length > 20)) {
            callback(new Error('长度在6到20个字符，数字、字母（区分大小写）、特殊符号组成'))
          } else {
            if (value.indexOf(' ') >= 0) {
              return callback(new Error('密码不能有空格'))
            } else {
              checkNumberAndEmail('password', value, (checkResult:boolean) => {
                if (!checkResult) {
                  return callback(new Error('长度在6到20个字符，数字、字母（区分大小写）、特殊符号组成'))
                } else {
                  if ((/^[0-9]*$/.test(value)) || (/^[a-z]*$/.test(value)) || (/^[A-Z]*$/.test(value)) || (/^[\.!@#\$%\\\^&\*\)\(\+=]+$/.test(value))) {
                    callback(new Error('大写字母、小写字母、数字和特殊符号至少包含2种'))
                  } else {
                    /* if (this.registerForm.confirmPassword !== '') {
                      (this.$refs['registerForm'] as HTMLFormElement).validateField('confirmPassword')
                    } */
                    callback()
                  }
                }
              })
            }
          }
        }
      },
      trigger: 'blur' }
    ],
    confirmPassword: [
      { validator: (rule:any, value:string, callback:any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else if (value.indexOf(' ') >= 0) {
          return callback(new Error('密码不能有空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur' }
    ]
  }
  @Action('userLogin', { namespace: 'login' })
  userLogin: any;
  showConfirmPwd ():void{
    this.confirmPwdType === 'password' ? this.confirmPwdType = '' : this.confirmPwdType = 'password'
  }
  showPwd ():void{
    this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password'
  }
  getUuid (uuid:string, number:string):void{
    this.uuid = uuid
    if (number) {
      this.returnPhone = number
    }
  }
  goLogin ():void{
    this.$router.push({
      path: '/login'
    })
  }
  openAgreement (type:number):void {
    this.show = true
    if (type === 1) {
      this.firstDialog = true
      this.secondDialog = false
    } else {
      this.firstDialog = false
      this.secondDialog = true
    }
  }
  userRegister (formName:string):void {
    let self = this;
    /* self.readAgreementChecked = false
    window.setTimeout(() => {
      self.readAgreementChecked = true
    }, 2000); */
    (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        if (self.returnPhone !== '') {
          if (self.registerForm.telephoneNumber === self.returnPhone) {
            self.userRegisterData()
          } else {
            self.$message({
              message: '注册手机号与发送验证码手机号不匹配，请检查注册手机号是否有误',
              type: 'warning'
            })
          }
        } else {
          self.userRegisterData()
        }
      } else {
        return false
      }
    })
  }
  userRegisterData () {
    let self = this
    let registerData = {
      username: self.registerForm.name,
      password: self.registerForm.password,
      phone: self.registerForm.telephoneNumber,
      sourceType: config.registerSourceType
    }
    fetch(apiConfig('forget/checkStatus'), { code: self.registerForm.verificationCode, key: self.uuid, delete: false })
      .then((res:any) => {
        if (res.code) {
          if (res.code === 200) {
            post(apiConfig('register/registerSubmit'), registerData)
              .then((res:any) => {
                if (res.code) {
                  if (res.code === 200) {
                    this.$message({
                      message: '注册成功',
                      type: 'success'
                    })
                    this.userLogin({ loginName: this.registerForm.name, loginPassword: this.registerForm.password, type: 3 })
                  } else {
                    self.$message({
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                } else {
                  self.$message({
                    message: '请求注册功能异常，请稍后再试',
                    type: 'error'
                  })
                }
              })
          } else {
            self.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        } else {
          self.$message({
            message: '请求校验短信验证码异常，请稍后再试',
            type: 'error'
          })
        }
      })
  }
  closeBox ():void {
    let win: any = window || {}
    try {
      win.external.CloseClientByJs()
    } catch (e) {

    }
  }
}
</script>

<style>
/*  .register-form .el-input input {height: 45px;}*/
/*  .register-form .login-form-sms .el-button--primary {width: calc(100% - 20px);height: 45px;}*/
  .register-form .register-form-btn .el-button--primary {width: 100%;height: 50px;}
  .register-panel .registerDialog .el-dialog{margin-top: 60px !important;height: calc(100% - 120px)}
  .register-panel .registerDialog .el-dialog .el-dialog__body{height: calc(100% - 90px);padding: 0 20px;}
  .register-panel .registerDialog .el-dialog .el-dialog__header {padding: 40px 20px 10px !important;}
  .telephoneNumber .el-input__inner {padding-left: 15px !important;}
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @import '~font-awesome/css/font-awesome.css';
  .register-panel {
    .regionSize(@fill, @fill);
    color: #7d8082;
    background: url("../assets/img/login/bg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    .register-form {
      .regionSize(@spacing * 28, @spacing * 30);
      background: url("../assets/img/login/form.png") no-repeat;
      background-size: @fill @fill;
      margin: 0 auto;
      top: calc(50% - 300px);
      &>div {
        .regionSize(@spacing * 20, @spacing * 25);
        margin-left: @spacing * 4;
        top: @spacing * 1.5;
        .register-form-title {
          &>span:first-child {
            color: #1f8dfb;
            font-weight: bold;
            font-size: 28px;/*px*/
          }
          &>span:nth-child(2) {
            float: right;
            margin-top: @spacing;
            color: #1f8dfb;
            cursor: pointer;
            margin-right: @spacing / 2;
          }
          &>span:last-child {
            float: right;
            margin-top: @spacing;
          }
        }
        .register-form-content {
          margin-top: @spacing * 1.5;
          .regionSize(@fill, @spacing * 20);
          .register-form-panel {
            margin-bottom: @spacing * 2;
          }
          .register-form-btn {
            margin-top: @spacing * 1.5;
          }
          .register-form-sms {
            float: right;
            width: @spacing * 10;
            height: @spacing * 3.5;
            text-align: center;
            margin-left: 3px;
          }
          .register-panel-forgot {
            float: right;
            font-size: 20px;/*px*/
          }
          .num10086 {
            position: absolute;
            z-index: 9;
            left: 18px;
            top: 15px;
            color: #1f8dfb;
          }
          .verificationCodeInput{
            width: calc(100% - 143px);
            display: inline-block;
            margin-right: 10px;
          }
          .verificationCodeBtn{
            display: inline-block;
            width: 133px;
            .el-button{
            width: 100%
            }
          }
        }
        .register-form-btn {
          margin-top: @spacing * 4;
        }
        .agreement {
          color: #1f8dfb;
          margin-left: -(@spacing / 5);
          margin-right: @spacing / 2;
          cursor: pointer;
        }
      }
    }
    .closeBox{
      font-size: 30px;
      position: absolute;
      right: @spacing;
      top: 25px;
      color: #fff;
      cursor: pointer;
    }
    .registerDialog{
      .el-dialog{
        margin-top: 100px;
      }
    }
    .go-back {
      position: absolute !important;
      .regionSize(@spacing * 6, @spacing * 2);
      line-height: @spacing * 2;
      color: #1970fb;
      background-color: white;
      border-radius: @spacing / 2;
      bottom: @spacing;
      left: @spacing;
      cursor: pointer;
      span:first-child {
        font-size: @spacing + 10;
        margin-left: @spacing / 2;
      }
      span:last-child {
        font-size: @spacing + 4;
        margin-left: @spacing;
        position: relative;
        top: -2px;
      }
    }
  }
</style>
