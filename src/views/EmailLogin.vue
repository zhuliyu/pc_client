<template>
    <div class="email">
      <div class="content-email">
        <div class="email-margin">
          <div class="email-font">邮箱登录</div>
          <el-card class="email-card">
            <div v-if="isSuccess">
              <el-row type="flex" justify="center" v-if="isIphone">
                <el-col :span="24">
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="email-form">
                    <el-form-item prop="email">
                      <el-input v-model="ruleForm.email" placeholder="请输入你的邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="emailPwd" class="el-form-bottom">
                      <el-input v-model="ruleForm.emailPwd" :type="pwdType" placeholder="请输入你的密码"
                                oncopy="return false" onpaste="return true" oncut="return false">
                        <i slot="suffix" :class="pwdType === 'password' ? 'el-input__icon register-eyes-close' : 'el-input__icon register-eyes-open'" @click="showPwd()"></i>
                      </el-input>
                    </el-form-item>
                    <el-form-item class="el-form-bottom" style="margin-top: 20px;">
                      <el-checkbox label="记住密码" name="type" :checked="rememberPassword" ref="rememberPassword" @change="changeCheck($event)"></el-checkbox>
                      <span class="login-panel-forgot" @click="forgotPassword()">忘记密码？</span>
                    </el-form-item>
                    <el-form-item style="text-align: center;margin-top:8vh">
                      <el-button class="email-login" @click="loginIn()">返回</el-button>
                      <el-button type="primary" size="large" class="email-login" @click="emailClick('ruleForm')">登录</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <!--手机绑定-->
              <div v-if="!isIphone">
                <div class="iphone-content-title">
                  <i class="el-icon-warning"></i>
                  <label>&nbsp;&nbsp;您尚未设置关联手机！为了您的账号安全，请立即绑定手机</label>
                </div>
                <el-row type="flex" justify="center">
                  <el-col :span="24">
                    <el-form :model="iphoneForm" :rules="rules" ref="iphoneForm" class="iphone-form">
                      <el-form-item prop="iphoneVal">
                        <el-input placeholder="请输入你的手机号" v-model="iphoneForm.iphoneVal">
                          <template slot="prepend">+86 (中国大陆)</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item prop="iphoneSms" class="phone-sms">
                        <!-- <el-row type="flex">
                          <el-col :span="13"> -->
                            <el-input placeholder="请输入短信验证码" v-model="iphoneForm.iphoneSms"></el-input>
                          <!-- </el-col>
                          <el-col :span="2"></el-col>
                          <el-col :span="9"> -->
                          <div class="login-form-sms">
                            <SMS v-bind:phoneNumber = iphoneForm.iphoneVal @getUuid="getUuid"  style=""></SMS>
                          </div>
                          <!-- </el-col>
                        </el-row> -->
                      </el-form-item>
                      <el-form-item style="text-align: center;margin-top: 9vh;">
                        <el-button type="primary" class="email-login" @click="bindingClick('iphoneForm')" style="width:100%">立即绑定</el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!--成功提示-->
            <div class="success-content" v-if="!isSuccess">
              <div class="success-div">
                <div class="success-icon">
                  <i class="el-icon-success"></i>
                  <label>&nbsp;&nbsp;恭喜您，现在可以使用邮箱一键登录！</label>
                </div>
                <div class="success-txt">
                  <div class="success-txt-div">您也可以使用手机号登录</div>
                </div>
                <div class="success-btn">
                  <el-button type="primary" style="width: 100%;" @click="goOutFn">返回</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { Action } from 'vuex-class'
import { Button, Form, FormItem, Input, Checkbox, Row, Col, Card } from 'element-ui'
import SMS from '../views/sms/index.vue'
import { encrypt, decrypt } from '@/assets/js/encryption'
import 'jquery'
interface ruleFormInterface {
  email:any,
  emailPwd: any,
}
interface phoneInterface {
  iphoneVal:any,
  iphoneSms: any,
  uuid: any,
}
interface rulesInterface {
  email:any,
  emailPwd: any,
  iphoneVal: any,
  iphoneSms: any
}
@Component({
  name: 'EmailLogin',
  components: {
    SMS,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [Row.name]: Row,
    [Col.name]: Col,
    [Card.name]: Card
  }
})
export default class EmailLogin extends Vue {
  redirectAddress:any = ''
  ruleForm:ruleFormInterface = {
    email: '',
    emailPwd: ''
  }
  iphoneForm:phoneInterface = {
    iphoneVal: '',
    iphoneSms: '',
    uuid: ''
  }
  pwdType:string = 'password'
  rememberPassword:boolean = true
  isIphone:boolean = true
  isSuccess:boolean = true
  @Action('userLogin', { namespace: 'login' })
  userLogin: any;
  rules:rulesInterface = {
    email: [
      { validator: (rule:any, value:any, callback:any) => {
        if (!value) {
          return callback(new Error('请输入您的邮箱'))
        } else {
          checkNumberAndEmail('email', value, (checkResult: any) => {
            if (!checkResult) {
              return callback(new Error('邮箱填写不正确，请输入正确的邮箱'))
            } else {
              callback()
            }
          })
        }
      },
      trigger: 'blur' }
    ],
    emailPwd: [
      { validator: (rule:any, value:any, callback:any) => {
        if (!value) {
          return callback(new Error('请输入您的密码'))
        } else {
          if (value.indexOf(' ') >= 0) {
            return callback(new Error('密码不能输入空格'))
          }
          callback()
        }
      },
      trigger: 'blur' }
    ],
    iphoneVal: [
      { validator: (rule:any, value:any, callback:any) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else {
          checkNumberAndEmail('telephoneNumber', value, (checkResult:any) => {
            if (!checkResult) {
              return callback(new Error('手机号填写不正确，请输入有效的11位手机号'))
            } else {
              callback()
            }
          })
        }
      },
      trigger: 'blur' }
    ],
    iphoneSms: [
      { required: true, message: '请输入您的验证码', trigger: 'blur' }
    ]
  }
  getUuid (uuid: any):void {
    this.iphoneForm.uuid = uuid
  }
  /* 控制密码显示 */
  showPwd ():void {
    this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password'
  }
  changeCheck (event: any):void {
    this.rememberPassword = event
  }
  forgotPassword () {
    if (this.redirectAddress) {
      this.$router.push({
        path: '/forgetPop?address=' + this.redirectAddress
      })
    } else {
      this.$router.push({
        path: '/forgetPop'
      })
    }
  }
  // 登录
  emailClick (formName: any) {
    (this.$refs[formName] as HTMLFormElement).validate((valid: any) => {
      if (valid) {
        if (this.rememberPassword) {
          localStorage.setItem('localEmail', this.ruleForm.email)
          localStorage.setItem('localEmailPwd', encrypt(this.ruleForm.emailPwd))
          localStorage.setItem('rememberPassword', 'true')
        } else {
          localStorage.removeItem('localEmail')
          localStorage.removeItem('localEmailPwd')
          localStorage.removeItem('rememberPassword')
        }
        post(apiConfig('login/EmailLogin'), { username: this.ruleForm.email, password: encrypt(this.ruleForm.emailPwd), secretKey: true }).then((res: any) => {
          if (res.code === 200) {
            // 已绑定手机-首页
            // param -> redirect: this.redirectAddress
            this.userLogin({ loginName: this.ruleForm.email, loginPassword: this.ruleForm.emailPwd, type: 1 })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch((err: any) => {
          // 尚未绑定手机-绑定手机页
          if (err.response && err.response.data && err.response.data.code === 1001) {
            this.isIphone = false
          }
        })
      } else {
        return false
      }
    })
  }
  // 立即绑定
  bindingClick (formName:any) {
    (this.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        post(apiConfig('login/bindPhone'), { username: this.ruleForm.email, key: this.iphoneForm.uuid, phone: this.iphoneForm.iphoneVal, code: this.iphoneForm.iphoneSms }).then((res:any) => {
          if (res.code === 200) {
            // 邮箱绑定手机号
            this.isSuccess = false
          }
        }).catch((err: any) => {
          this.$message({
            message: err.response.data.msg,
            type: 'error'
          })
        })
      } else {
        return false
      }
    })
  }
  // 返回
  goOutFn ():void {
    if (this.redirectAddress) {
      this.$router.push({
        path: '/loginPop?address=' + this.redirectAddress
      })
    } else {
      this.$router.push({
        path: '/loginPop'
      })
    }
  }
  loginIn ():void{
    this.$router.push({
      path: '/loginPop'
    })
  }
  created () {
    if (location.href.indexOf('?address=') >= 0) {
      let tempHash = location.href
      this.redirectAddress = unescape(tempHash.split('?address=')[1])
    }
    /* 记住密码功能 */
    let localEmailPwd: any = localStorage.getItem('localEmailPwd')
    if (localStorage.getItem('localEmail') && localEmailPwd.length > 0) {
      this.ruleForm.email = localStorage.getItem('localEmail')
      this.ruleForm.emailPwd = decrypt(localStorage.getItem('localEmailPwd'))
      this.rememberPassword = true
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
@spacing: 20px;
@fill: 100%;
@deep: ~'>>>';
.regionSize (@regionW: 100%, @regionH: 100%) {
  width: @regionW;
  height: @regionH;
  position: relative;
}
.email .login-form-sms @{deep} .el-button--primary {width: 100%;height: 40px;padding:0}
.email .phone-sms @{deep} .el-input {width: calc(100% - 126px);}
// .email .iphone-form@{deep} .el-form-item .el-form-item__content .el-form-item__error{
//     margin-left: 138px;
//   }
.email .iphone-form @{deep}.el-input-group__prepend {
  color: #1f8dfb
}
.email .email-card @{deep} .el-card__body{
  padding: 0;
}
.email {
  .regionSize(@fill, @fill);
  min-width: 320px;
  min-height: 440px;
  max-width: 440px;
  max-height: 568px;
  position: absolute;
  top: 50%;
  left: 50%;
  background: white;
  padding: 1vh 20px 0;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  .content-email {
    .regionSize(@fill, @fill);
    .email-font {
      font-size: 24px;
      font-weight: bold;
      color: #1f8dfb;
      padding-bottom: 20px;
    }
    .email-margin {
      .regionSize(@fill, @fill);
      margin: 0 auto;
      .email-card {
        height: @fill / 1.2;
        border: none;
        box-shadow: none;
      }
      .email-form {
        // width: 440px;
        margin: @spacing * 4 auto 0 auto;
        .el-form-bottom{
          margin-bottom: 0;
        }
      }
      .email-login {
        width:48%;
        float: left;
      }
      .login-panel-forgot {
        float: right;
        font-size: 14px;
        color: #828282;
        cursor: pointer;
      }
      .register-eyes-open{
        background: url(../assets/img/login/register-eyes-open.png) center no-repeat;
        background-size: contain;
        cursor: pointer;
        &:before{
          content: "";
        }
        &:after {
          content: '';
          height: 100%;
          width: 22px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .register-eyes-close{
        background: url(../assets/img/login/register-eyes-close.png) center no-repeat;
        background-size: contain;
        cursor: pointer;
        &:before{
          content: "";
        }
        &:after {
          content: '';
          height: 100%;
          width: 22px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .iphone-content-title {
        margin: @spacing auto;
        padding: @spacing / 2;
        background: #f2f2f2;
        &>i{
          color: red;
          font-size: @spacing * 2;
          vertical-align: middle;
        }
        &>label{
          font-size: @spacing - 6;
        }
      }
      .iphone-form {
        // width: 490px;
        margin: 4vh auto 0 auto;
      }
      .login-form-sms {
        float: right;
        width: @spacing * 5.5;
        height: 45px;
        text-align: center;
        margin-left: 3px;
      }
      .success-content {
        // width: @spacing * 25;
        margin: 0 auto;
        .success-div {
          text-align: center;
          margin-top: calc(@fill / 3.3);
          .success-icon {
            margin-bottom: -@spacing;
            &>i {
              font-size: @spacing * 2;
              color:#67C23A;
              vertical-align: middle;
            }
            &>label {
              font-size: 16px;
              font-weight: bold;
            }
          }
          .success-txt {
            margin: 30px;
            text-align: center;
            .success-txt-div{
              font-size: @spacing - 6;
              color: #999;
            }
          }
          .success-btn {
            width: @fill / 2.5;
            margin: 25px auto;
          }
        }
      }
    }
  }
}

</style>
