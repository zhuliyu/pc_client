<template>
  <div class="bindphone-panel">
    <!-- <div class="login-panel-close" @click="closePanel()">X</div> -->
    <div class="bindphone-form">
      <div>
        <div class="bindphone-form-title">
          <span>手机号码绑定</span>
          <!-- <span @click="goLogin()">立即登录</span><span>已绑定手机号？</span> -->
        </div>

        <div class="bindphone-form-content">
          <el-form ref="bindPhoneForm" :rules="rules" :model="bindPhoneForm" class="registerForm">
            <el-form-item prop="telephoneNumber">
              <el-input v-model.trim="bindPhoneForm.telephoneNumber" class="telephoneNumber" prefix-icon="telephoneNumberPre" maxlength="11" placeholder="请输入您的手机号">
              </el-input>
            </el-form-item>

            <el-form-item prop="verificationCode">
                  <el-input class="verificationCodeInput" v-model.trim="bindPhoneForm.verificationCode"  placeholder="请输入短信验证码" maxlength="6"></el-input>
                  <SMS class="verificationCodeBtn login-form-sms" v-bind:phoneNumber = bindPhoneForm.telephoneNumber
                       v-bind:checkNumber = checkNumber
                       v-bind:msgType = msgType
                       @getUuid = "getUuid"></SMS>
            </el-form-item>

            <el-form-item class="readAgreementCheck">
              <el-checkbox v-model="readAgreementChecked">
              </el-checkbox>
              <span class="text">已阅读并同意</span>
              <span class="agreement" @click="openAgreement(1)">《用户服务条款》</span>
              <span class="text" style="margin-left: -15px;">和</span>
              <span class="agreement" @click="openAgreement(2)">《法律声明及隐私权政策》</span>
            </el-form-item>

            <el-form-item :class="readAgreementChecked ? 'registerBtnActive bindphone-form-btn' : 'registerBtn bindphone-form-btn'">
              <el-button type="primary" :disabled="!readAgreementChecked" @click="bindPhone('bindPhoneForm')">绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog  title=""
                :visible.sync="show"
                class="registerDialog"
                :close-on-click-modal="false"
                :show-close="true"
                width="440px"
                top="0px"
                :append-to-body="true"
                :modal-append-to-body="true">
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

interface bindPhoneFormInterface{
  verificationCode: string,
  telephoneNumber: string
}
interface ruleInterface {
  telephoneNumber:any,
  verificationCode: any,
}

@Component({
  name: 'BindPhone',
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
export default class RegisterPop extends Vue {
  show: boolean = false;
  firstDialog: boolean = false;
  secondDialog: boolean = false;
  msgType: string = 'bindPhone';
  checkNumber: string = '';
  bindPhoneForm:bindPhoneFormInterface ={
    verificationCode: '',
    telephoneNumber: ''
  };
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
    ]
  }
  @Action('userLogin', { namespace: 'login' })
  userLogin: any;
  getUuid (uuid:string, number:string):void{
    this.uuid = uuid
    if (number) {
      this.returnPhone = number
    }
  }
  goLogin ():void{
    this.$router.push({
      path: '/loginPop'
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
  bindPhone (formName:string):void {
    let self = this;
    (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        if (self.bindPhoneForm.telephoneNumber === self.returnPhone) {
          self.bindUserPhone()
        } else {
          self.$message({
            message: '绑定手机号与发送验证码手机号不匹配，请检查绑定手机号是否有误',
            type: 'warning'
          })
        }
      } else {
        return false
      }
    })
  }
  bindUserPhone () {
    let self = this
    post(apiConfig('login/modifyBindPhone'), {
      phone: self.bindPhoneForm.telephoneNumber,
      code: self.bindPhoneForm.verificationCode,
      key: self.uuid,
      username: self.$route.query.userName
    })
      .then((res:any) => {
        if (res.code) {
          if (res.code === 200) {
            let win: any = window || {}
            let query: any = self.$route.query || {}
            let userData = {
              token: query.token,
              expires_in: query.expires_in,
              userId: query.userId,
              userName: query.userName,
              headUrl: query.headUrl
            }
            console.log(userData)
            try {
              // 调用盒子并塞值
              win.external.SetUserLoginInfo(JSON.stringify(userData))
            } catch (e) {
              console.log('login error')
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        } else {
          self.$message({
            message: '绑定手机号功能异常，请稍后再试',
            type: 'error'
          })
        }
      })
  }
}
</script>
<style scoped lang="less" type="text/less">
  @deep: ~'>>>';
  .bindphone-form .bindphone-form-btn @{deep} .el-button--primary {width: 100%;height: 48px;}
  .registerDialog @{deep} .el-dialog{
    margin: 0 auto !important;
    min-width: 320px;
    min-height: 440px;
    max-width: 440px;
    max-height: 568px;
  }
  .bindphone-panel .registerDialog @{deep} .el-dialog .el-dialog__body{height: calc(100% - 90px);padding: 0 20px;}
  .bindphone-panel .registerDialog @{deep} .el-dialog .el-dialog__header {padding: 40px 20px 10px !important;}
  .telephoneNumber @{deep} .el-input__inner {padding-left: 15px !important;}
  .bindphone-form @{deep} .el-form-item {margin-bottom: 3.2vh }
  .readAgreementCheck @{deep} .el-form-item__content {
    line-height: 16px;
    font-size: 12px;
  }
  @import "../less/common.less";
  .login-panel-close {
    margin-left: 94%;
    margin-top: 10px;
    cursor: pointer;
  }
  .bindphone-panel {
    .regionSize(100%, 100%);
    color: #7d8082;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 320px;
    min-height: 440px;
    max-width: 440px;
    max-height: 568px;
    .bindphone-form {
      .regionSize(100%, calc(100% - 28px));
      margin: auto;
      padding: 1vh 20px 0px;
      box-sizing: border-box;
      &>div {
        .bindphone-form-title {
          &>span:first-child {
            color: rgb(31,141,251);
            font-weight: bold;
            font-size: 24px;/*px*/
          }
          // &>span:nth-child(2) {
          //   float: right;
          //   margin-top: 15px;
          //   color: #1f8dfb;
          //   cursor: pointer;
          //   font-size: 14px;
          // }
          // &>span:last-child {
          //   float: right;
          //   margin-top: 15px;
          //   font-size: 14px;
          // }
        }
        .bindphone-form-content {
          margin-top: 18vh;
          .register-form-panel {
            margin-bottom: @spacing * 2;
          }
          .bindphone-form-btn {
            // margin-top: 3vh;
            // margin-bottom: 0;
            position: absolute;
            bottom: 30px;
            margin: 0;
            width: 91%;
            button{
              font-size: 18px;
            }
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
        .bindphone-form-btn {
          margin-top: @spacing * 4;
        }
        .agreement {
          color: #1f8dfb;
          margin-left: -(@spacing / 5);
          margin-right: @spacing / 2;
          cursor: pointer;
          font-size: 12px;
        }
        .readAgreementCheck {
          label{
            margin-right: 8px;
          }
          .text{
            font-size: 12px;
          }
        }
      }
    }
    .registerDialog{
      .el-dialog{
        margin-top: 100px;
      }
    }
  }
</style>
