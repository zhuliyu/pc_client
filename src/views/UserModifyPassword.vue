<template>
  <div class="user-modify-password-main">
    <div class="user-modify-content-body-title">
      <el-row>
        <el-col :span="12">
          <span class="split-line"></span><span class="user-modify-content-body-title-text">
            <span v-if="type === 'update'">修改密码</span>
            <span v-else>设置密码</span>
        </span>
        </el-col>
        <el-col :span="12" class="user-modify-edit-btn">
          <el-button type="default" size="small" @click="returnInformation()" v-show="showModifyContent">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="page-content">
      <div class="page-body">
       <!-- <div class="page-title">
          <span v-if="type === 'update'">修改密码</span>
          <span v-else>设置密码</span>
        </div>-->
        <div v-if="phone !== ''">
          <div class="modify-password-body" v-show="showModifyContent">
            <div class="modify-password-content">
              <div><span class="tip-weight">&nbsp;&nbsp;&nbsp;&nbsp;为确认是您本人，请完成以下认证</span></div>
              <div><span style="color:#666666">&nbsp;&nbsp;&nbsp;&nbsp;已验证手机：</span><span style="color:#1f8dfc">+86</span>&nbsp;&nbsp;<span>{{showPhone}}</span></div>
              <div v-if="type === 'update'">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
                  <el-form-item label="短信验证码：" prop="verificationCode" class="verification-code">
                    <el-input class="modify-password-input modify-password-verification-code" v-model.trim="ruleForm.verificationCode" maxlength="6" placeholder="请输入短信验证码"></el-input>
                    <SMS class="modify-password-sns"  v-bind:phoneNumber = phone v-bind:msgType = msgType @getUuid = "getUuid"></SMS>
                  </el-form-item>
                  <el-form-item label="原密码：" prop="oldPassword">
                    <el-input class="modify-password-input" v-model.trim="ruleForm.oldPassword" :type="oldPwdType" minlength="6" maxlength="20" placeholder="请输入原登录密码">
                      <i slot="suffix" :class="oldPwdType === 'password' ? 'el-input__icon modify-password-eyes-close' : 'el-input__icon modify-password-eyes-open'" @click="showOldPwd()"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="新密码：" prop="newPassword">
                    <el-input class="modify-password-input" v-model.trim="ruleForm.newPassword" :type="pwdType" minlength="6" maxlength="20" placeholder="请设置新的登录密码" oncopy="return false" onpaste="return false" @focus="ruleTip(1)" @blur="hidRuleTip(1)">
                      <i slot="suffix" :class="pwdType === 'password' ? 'el-input__icon modify-password-eyes-close' : 'el-input__icon modify-password-eyes-open'"  @click="showPwd()"></i>
                    </el-input>
                    <!--<div class="rule-tip" v-show="ruleTip1">
                      <div>
                        安全程度：
                        <span :class="ruleForm.newPassword.length > 5 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                        <span :class="ruleForm.newPassword.length > 9 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                        <span :class="ruleForm.newPassword.length > 14 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                      </div>

                      <div>·6~20位字符，区分大小写</div>

                      <div>·只能包含大小写字母、数字以及特殊符号（除空格）</div>

                      <div>·大写字母、小写字母、数字和特殊符号至少包含2种</div>
                    </div>-->
                  </el-form-item>
                  <el-form-item label="确认新密码：" prop="confirmPassword">
                    <el-input class="modify-password-input" v-model.trim="ruleForm.confirmPassword" :type="confirmPwdType" minlength="6" maxlength="20" placeholder="请再次输入新的登录密码" oncopy="return false" onpaste="return false" @focus="ruleTip(2)" @blur="hidRuleTip(2)">
                      <i slot="suffix" :class="confirmPwdType === 'password' ? 'el-input__icon modify-password-eyes-close' : 'el-input__icon modify-password-eyes-open'" @click="showConfirmPwd()"></i>
                    </el-input>
                    <!-- <div class="rule-tip" v-show="ruleTip2">
                       <div>
                         安全程度：
                         <span :class="ruleForm.confirmPassword.length > 5 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                         <span :class="ruleForm.confirmPassword.length > 9 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                         <span :class="ruleForm.confirmPassword.length > 14 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                       </div>

                       <div>·6~20位字符，区分大小写</div>

                       <div>·只能包含大小写字母、数字以及特殊符号（除空格）</div>

                       <div>·大写字母、小写字母、数字和特殊符号至少包含2种</div>
                     </div>-->
                  </el-form-item>
                </el-form>
                <div class="btn-content">
                  <el-button type="primary" size="large" :disabled="passwordSubmitUpdate" @click="submit('ruleForm')">确定</el-button>
                </div>
              </div>
              <div v-else>
                <el-form :model="ruleFormAdd" :rules="rulesAdd" ref="ruleFormAdd" label-width="0">
                  <el-form-item label="短信验证码：" prop="verificationCodeAdd" class="verification-code">
                    <el-input class="modify-password-input modify-password-verification-code" v-model.trim="ruleFormAdd.verificationCodeAdd" maxlength="6" placeholder="请输入短信验证码"></el-input>
                    <SMS class="modify-password-sns" v-bind:phoneNumber = phone v-bind:msgType = msgType @getUuid = "getUuid2"></SMS>
                  </el-form-item>
                  <el-form-item label="新密码：" prop="newPasswordAdd">
                    <el-input class="modify-password-input" v-model.trim="ruleFormAdd.newPasswordAdd" :type="pwdTypeAdd" minlength="6" maxlength="20" placeholder="请设置新的登录密码" oncopy="return false" onpaste="return false" @focus="ruleTip(3)" @blur="hidRuleTip(3)">
                      <i slot="suffix" :class="pwdTypeAdd === 'password' ? 'el-input__icon modify-password-eyes-close' : 'el-input__icon modify-password-eyes-open'"  @click="showPwdAdd()"></i>
                    </el-input>
                    <!-- <div class="rule-tip" v-show="ruleTip3">
                       <div>
                         安全程度：
                         <span :class="ruleFormAdd.newPasswordAdd.length > 5 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                         <span :class="ruleFormAdd.newPasswordAdd.length > 9 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                         <span :class="ruleFormAdd.newPasswordAdd.length > 14 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                       </div>

                       <div>·6~20位字符，区分大小写</div>

                       <div>·只能包含大小写字母、数字以及特殊符号（除空格）</div>

                       <div>·大写字母、小写字母、数字和特殊符号至少包含2种</div>
                     </div>-->
                  </el-form-item>
                  <el-form-item label="确认新密码：" prop="confirmPasswordAdd">
                    <el-input class="modify-password-input" v-model.trim="ruleFormAdd.confirmPasswordAdd" :type="confirmPwdTypeAdd" minlength="6" maxlength="20" placeholder="请再次输入新的登录密码" oncopy="return false" onpaste="return false" @focus="ruleTip(4)" @blur="hidRuleTip(4)">
                      <i slot="suffix" :class="confirmPwdTypeAdd === 'password' ? 'el-input__icon modify-password-eyes-close' : 'el-input__icon modify-password-eyes-open'" @click="showConfirmPwdAdd()"></i>
                    </el-input>
                    <!--<div class="rule-tip" v-show="ruleTip4">
                      <div>
                        安全程度：
                        <span :class="ruleFormAdd.confirmPasswordAdd.length > 5 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                        <span :class="ruleFormAdd.confirmPasswordAdd.length > 9 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                        <span :class="ruleFormAdd.confirmPasswordAdd.length > 14 ? 'rule-tip-progress rule-tip-achieve' : 'rule-tip-progress'"></span>
                      </div>

                      <div>·6~20位字符，区分大小写</div>

                      <div>·只能包含大小写字母、数字以及特殊符号（除空格）</div>

                      <div>·大写字母、小写字母、数字和特殊符号至少包含2种</div>
                    </div>-->
                  </el-form-item>
                </el-form>
                <div class="btn-content">
                  <el-button type="primary" size="large" :disabled="passwordSubmitAdd" @click="submitAdd('ruleFormAdd')">确定</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="modify-password-success" v-show="!showModifyContent">
            <el-row class="success-info">
              <div>
                <img src="../assets/img/user/modifySuccess2.png"/>
                <p v-if="type === 'update'" class="success-info-title">修改成功，请牢记新的登录密码</p>
                <p v-else class="success-info-title">设置成功，请牢记您的登录密码</p>
              </div>

            </el-row>
            <!--<el-row class="btn-content">
              <el-button type="primary" size="large" @click="goLogin()">重新登录</el-button>
            </el-row>-->
          </div>
        </div>
        <div v-else>
          <div class="no-phone-body">
            <div class="no-phone-content">
              <span  v-if="type === 'update'" class="tip-weight">修改密码，需验证手机号，</span>
              <span v-else class="tip-weight">设置密码，需验证手机号，</span>
              <span class="tip-weight">当前账号未绑定手机，请先绑定。</span>
              <div class="btn-content">
                <el-button type="primary" size="large" @click="goModifyPhone('add')">绑定手机</el-button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, post } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { State, Action } from 'vuex-class'
import SMS from '../views/sms/index.vue'
import base64encode from '@/assets/js/base64New'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import 'jquery'
import {
  Button,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Step,
  Steps
} from 'element-ui'

interface ruleFormInterface {
  verificationCode: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface rulesInterface {
  verificationCode: any,
  oldPassword: any;
  newPassword: any;
  confirmPassword: any
}
interface ruleFormAddInterface {
  verificationCodeAdd: string,
  newPasswordAdd: string,
  confirmPasswordAdd: string
}
interface rulesAddInterface {
  verificationCodeAdd: any,
  newPasswordAdd: any,
  confirmPasswordAdd: any
}
declare const Buffer:any
@Component({
  name: 'userModifyPassword',
  components: { SMS,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Row.name]: Row,
    [Col.name]: Col,
    [Step.name]: Step,
    [Steps.name]: Steps
  }
})
export default class userModifyPassword extends mixins(getUserInfo) {
  showPhone: string = '';
  type: string = '';
  phone: string = '';
  oldPwdType: string = 'password';
  pwdType: string = 'password';
  confirmPwdType: string = 'password';
  pwdTypeAdd: string = 'password';
  confirmPwdTypeAdd: string = 'password';
  showModifyContent: boolean = true;
  uuid: string = '';
  uuid2: string = '';
  ruleTip1: boolean = false;
  ruleTip2: boolean = false;
  ruleTip3: boolean = false;
  ruleTip4: boolean = false;
  msgType: string = 'modifyPassword';
  passwordSubmitUpdate: boolean = false;
  passwordSubmitAdd: boolean = false;
  ruleForm: ruleFormInterface = {
    verificationCode: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  rules: rulesInterface = {
    verificationCode: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入短信验证码'))
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
    oldPassword: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入旧密码'))
          } else {
            if (this.ruleForm.newPassword === '') {
              (this.$refs['ruleForm'] as HTMLFormElement).validateField('newPassword')
            }
            if (this.ruleForm.confirmPassword !== '') {
              (this.$refs['ruleForm'] as HTMLFormElement).validateField('confirmPassword')
            }
            callback()
          }
        },
        trigger: 'blur' }
    ],
    newPassword: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入新密码'))
          } else {
            if ((value.length < 6) || (value.length > 20)) {
              callback(new Error('长度在 6 到 20 个字符，数字、英文字母（区分大小写）、特殊符号组成'))
            } else if (value === this.ruleForm.oldPassword) {
              callback(new Error('该密码与原登录密码相同，请重新设置'))
            } else {
              checkNumberAndEmail('password', value, (checkResult:boolean) => {
                if (!checkResult) {
                  return callback(new Error('长度在6到20个字符，数字、英文字母（区分大小写）、特殊符号组成'))
                } else {
                  if ((/^[0-9]*$/.test(value)) || (/^[a-z]*$/.test(value)) || (/^[A-Z]*$/.test(value)) || (/^[\.!@#\$%\\\^&\*\)\(\+=]+$/.test(value))) {
                    callback(new Error('大写字母、小写字母、数字和特殊符号至少包含2种'))
                  } else {
                    if (this.ruleForm.confirmPassword !== '') {
                      (this.$refs['ruleForm'] as HTMLFormElement).validateField('confirmPassword')
                    }
                    if (this.ruleForm.oldPassword === '') {
                      (this.$refs['ruleForm'] as HTMLFormElement).validateField('oldPassword')
                    }
                    callback()
                  }
                }
              })
            }
          }
        },
        trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请再次输入密码'))
          } else if (value !== this.ruleForm.newPassword) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
        trigger: 'blur' }
    ]
  };
  ruleFormAdd: ruleFormAddInterface = {
    verificationCodeAdd: '',
    newPasswordAdd: '',
    confirmPasswordAdd: ''
  };
  rulesAdd: rulesAddInterface = {
    verificationCodeAdd: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入短信验证码'))
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
    newPasswordAdd: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入新密码'))
          } else {
            if ((value.length < 6) || (value.length > 20)) {
              callback(new Error('长度在 6 到 20 个字符，数字、英文字母（区分大小写）、特殊符号组成'))
            } else {
              checkNumberAndEmail('password', value, (checkResult:boolean) => {
                if (!checkResult) {
                  return callback(new Error('长度在6到20个字符，数字、英文字母（区分大小写）、特殊符号组成'))
                } else {
                  if ((/^[0-9]*$/.test(value)) || (/^[a-z]*$/.test(value)) || (/^[A-Z]*$/.test(value)) || (/^[\.!@#\$%\\\^&\*\)\(\+=]+$/.test(value))) {
                    callback(new Error('大写字母、小写字母、数字和特殊符号至少包含2种'))
                  } else {
                    if (this.ruleFormAdd.confirmPasswordAdd !== '') {
                      (this.$refs['ruleFormAdd'] as HTMLFormElement).validateField('confirmPasswordAdd')
                    }
                    callback()
                  }
                }
              })
            }
          }
        },
        trigger: 'blur' }
    ],
    confirmPasswordAdd: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请再次输入密码'))
          } else if (value !== this.ruleFormAdd.newPasswordAdd) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
        trigger: 'blur' }
    ]
  }
  @Action('cancelUserInformation', { namespace: 'information' })
  cancelUserInformation: any;
  @Action('clearToken', { namespace: 'login' })
  clearToken: any;
  private created () {
    let self = this
    let name2:any = self.$route.query.phone || ''
    if ((name2 !== '') && (name2 !== null) && (name2 !== undefined)) {
      let param = new Buffer(decodeURIComponent(name2), 'base64')
      param = JSON.parse(param)
      self.phone = JSON.parse(JSON.stringify(param.telephone))
      self.type = JSON.parse(JSON.stringify(param.type))
      self.showPhone = self.phone.substring(0, 3) + '****' + self.phone.substring(7, 11)
    } else {
      self.phone = ''
      self.showPhone = '未获取到手机号，请先绑定'
    }
    if (self.type === 'update') {
      self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料', '修改密码'] })
    } else {
      self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料', '设置密码'] })
    }
  }
  private beforeRouteLeave (to:any, from:any, next:any) {
    if (to.name !== 'Information') {
      this.cancelUserInformation()
    }
    next()
  }
  returnInformation ():void {
    // let self = this
    // self.$router.push({
    //   path: '/information'
    // })
    this.$router.push({
      path: '/myAccount/information'
    })
  }
  getUuid (uuid:string):void {
    this.uuid = uuid
  }
  getUuid2 (uuid:string):void {
    this.uuid2 = uuid
  }
  showOldPwd ():void {
    this.oldPwdType === 'password' ? this.oldPwdType = '' : this.oldPwdType = 'password'
  }
  showPwd ():void {
    this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password'
  }
  showConfirmPwd ():void {
    this.confirmPwdType === 'password' ? this.confirmPwdType = '' : this.confirmPwdType = 'password'
  }
  showPwdAdd ():void {
    this.pwdTypeAdd === 'password' ? this.pwdTypeAdd = '' : this.pwdTypeAdd = 'password'
  }
  showConfirmPwdAdd ():void {
    this.confirmPwdTypeAdd === 'password' ? this.confirmPwdTypeAdd = '' : this.confirmPwdTypeAdd = 'password'
  }
  ruleTip (type:number):void {
    if (type === 1) {
      this.ruleTip1 = true
    } else if (type === 2) {
      this.ruleTip2 = true
    } else if (type === 3) {
      this.ruleTip3 = true
    } else if (type === 4) {
      this.ruleTip4 = true
    }
  }
  hidRuleTip (type:number):void {
    if (type === 1) {
      this.ruleTip1 = false
    } else if (type === 2) {
      this.ruleTip2 = false
    } else if (type === 3) {
      this.ruleTip3 = false
    } else if (type === 4) {
      this.ruleTip4 = false
    }
  }
  submit (formName:string):void {
    let self = this;
    (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        self.passwordSubmitUpdate = true
        window.setTimeout(() => {
          self.passwordSubmitUpdate = false
        }, 2000)
        let passwordData = {
          userId: self.userId,
          oldPassword: self.ruleForm.oldPassword,
          newPassword: self.ruleForm.newPassword,
          inputMessageCode: self.ruleForm.verificationCode,
          telephone: self.phone,
          smsUuid: self.uuid
        }
        put(apiConfig('userInfomation/modifyPasswordSubmit'), passwordData)
          .then((res:any) => {
            if (res.code) {
              if (res.code === 200) {
                self.showModifyContent = false
                self.$message({
                  message: '修改成功',
                  type: 'success'
                })
                setTimeout(() => {
                  self.clearToken()
                  self.$router.push({
                    path: '/home'
                  })
                  self.cancelUserInformation()
                }, 2000)
              } else {
                self.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            } else {
              self.$message({
                message: '请求修改密码功能异常，请稍后再试',
                type: 'error'
              })
            }
          })
      } else {
        return false
      }
    })
  }
  submitAdd (formName:string):void {
    let self = this;
    (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        self.passwordSubmitAdd = true
        window.setTimeout(() => {
          self.passwordSubmitAdd = false
        }, 2000)
        let passwordData = {
          userId: self.userId,
          newPassword: self.ruleFormAdd.newPasswordAdd,
          inputMessageCode: self.ruleFormAdd.verificationCodeAdd,
          telephone: self.phone,
          smsUuid: self.uuid2
        }
        post(apiConfig('userInfomation/addPasswordSubmit'), passwordData)
          .then((res:any) => {
            if (res.code) {
              if (res.code === 200) {
                self.showModifyContent = false
                self.$message({
                  message: '设置成功',
                  type: 'success'
                })
                setTimeout(() => {
                  self.clearToken()
                  self.$router.push({
                    path: '/home'
                  })
                  self.cancelUserInformation()
                }, 2000)
              } else {
                self.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            } else {
              self.$message({
                message: '请求设置密码功能异常，请稍后再试',
                type: 'error'
              })
            }
          })
      } else {
        return false
      }
    })
  }
  goLogin () {
    let self = this
    self.clearToken()
    let win: any = window || {}
    win.external.ShowLoginPage()
    self.cancelUserInformation()
  }
  goModifyPhone () {
    let self = this
    self.$router.push({
      path: '/information/userModifyPhone',
      query: {
        phone: encodeURIComponent(base64encode(JSON.stringify({
          telephone: self.phone,
          type: 'add'
        })))
      }
    })
  }
}
</script>
<style>
  .verification-code .sms-panel{
    display: inline-block;
  }
 .modify-password-content .el-form .el-form-item .el-form-item__label{
    width: 150px !important;
  }
 .modify-password-content .el-form .el-form-item .el-form-item__content{
    margin-left: 150px !important;
  }
  .modify-password-content .el-form .el-form-item .el-form-item__label{
    font-size: 18px;/*px*/
    padding-right: 0;
    height: 40px;
    line-height: 40px;
  }
  .modify-password-content .el-form .el-form-item .modify-password-input .el-input__inner{
    height: 40px;
    line-height: 40px;
    font-size: 18px;/*px*/
  }
  .modify-password-sns .el-button{
    height: 40px;
    width:180px;
    font-size: 18px;/*px*/
  }
  .modify-password-content .el-form .el-form-item{
    margin-bottom: 30px;
  }
</style>
<style scoped lang="less" type="text/less">
  .home-panel {
  .regionSize(@fill, @fill);
    background: url("../assets/img/home/header.png") no-repeat;
    background-size: @fill @spacing * 12.6;
    overflow: hidden;
  .home-obligate {
  .regionSize(@fill, @spacing * 2.5);
    background-color: #1f8dfc;
  }
  .home-main {
  .regionSize(@fill, calc(@fill - @spacing * 2.5));
    background-color: #f1f1f1;
    overflow: hidden;
  &>div {
     float: left;
     height: @fill;
     position: relative;
     overflow: hidden;
   }
  &>div:first-child {
     width: @spacing * 9.5;
     background-color: #122266;
  .home-logo {
  .regionSize(@fill, @spacing * 4);
  img {
    width: @spacing * 8;
    margin-top: @spacing;
    margin-left: @spacing / 2 + 3;
  }
  }
  .home-menu {
  .regionSize(@fill, calc(@fill - @spacing * 4));
    overflow: hidden;
    border-top-left-radius: @spacing * 5;
    border-top-right-radius: @spacing * 5;
    background-color: #001529;
  .home-user-info {
    color: #1f8dfc;
  .regionSize(@fill, @spacing * 10);
    text-align: center;
  img {
    width: @spacing * 5;
    margin-top: @spacing * 2;
  }
  div {
    margin-top: @spacing / 2;
    font-weight: bold;
    font-size: 36px;/*px*/
  }
  }
  .home-menu-list {
  .regionSize(@fill, calc(@fill - @spacing * 10));
  }
  }
  }
  &>div:nth-child(2) {
   .regionSize(calc(@fill - @spacing * 12.5), @fill);
     padding: @spacing * 1.5;
     background: white;
   }
  &>div:last-child {
  /*.regionSize(@spacing * 17.7, @fill);*/
  &>div {
  .home-app-list {
  .regionSize(calc(@fill - @spacing * 2.5), auto);
    margin-left: @spacing + 5;
    overflow: hidden;
  .app-list-header {
  .regionSize(@fill, @spacing * 2);
    line-height: @spacing * 2;
    margin-top: @spacing / 2;
    font-size: 36px;/*px*/
  .app-list-icon {
    font-size: 46px;/*px*/
    color: #1f8dfc;
  }
  .app-list-title {
    margin-left: @spacing / 3;
    position: relative;
    top: -(@spacing / 3);
  }
  }
  .app-list {
    width: @spacing * 7.3;
    height: @spacing * 5.1;
    float: left;
    background-size: @fill @fill;
    margin-top: @spacing * 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  div {
    color: white;
    font-weight: bold;
    text-align: center;
    padding: @spacing / 2;
  }
  }
  .notice-list {
  .regionSize(@fill, @spacing * 6.5);
  .notice-summary {
  .regionSize(@fill, @spacing * 4);
    line-height: @spacing + 5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .notice-info {
  &>span:last-child {
     float: right;
     color: #1f8dfc;
   }
  }
  }
  .notice-split-line {
  .regionSize(@fill, 2px);
    background-color: gainsboro;
  }
  .app-list-more {
    float: right;
    font-size: 26px;/*px*/
    color: #7f7f7f;
  }
  }
  }
  &>div:last-child {
   .regionSize(@fill, calc(@fill));
     background-color: white;
     border-radius: @spacing;
     margin-top: @spacing + 5;
   }
  }
  }
  .home-panel-tab {
  .regionSize(@fill, @spacing * 2);
    position: absolute;
    text-align: center;
    margin-top: @spacing * 2;
    color: white;
    z-index: 99;
  .home-tab-btn {
    display: inline-block;
    width: @spacing * 4;
    line-height: @spacing * 2;
    height: @fill;
    font-size: 26px;/*px*/
  }
  .home-tab-btn.active {
    background-color: #1f8dfc;
    border-radius: @spacing / 4;
  &>div {
     margin-top: @spacing / 2;
   }
  }
  .split-line {
    width: 2px;/*px*/
    height: @spacing;
    background-color: white;
    margin-left: @spacing;
    position: relative;
    top: @spacing / 4;
  }
  }
  .home-main-panel {
  .regionSize(@fill, calc(@fill - 25px));
    margin-top: @spacing + 5;
    overflow: hidden;
  .home-main-banner {
  .regionSize(@fill, @spacing * 13);
    overflow: hidden;
  &>div {
   .regionSize(calc(@fill - @spacing * 2.5), @fill);
     margin-left: @spacing + 5;
     overflow: hidden;
     border-top-left-radius: @spacing;
     border-top-right-radius: @spacing;
   }
  }
  .home-news-list {
  .regionSize(calc(@fill - @spacing * 2.5), calc(@fill - @spacing * 13.1));
    background-color: white;
    margin-left: @spacing + 5;
    overflow-x: hidden;
    overflow-y: auto;
  .home-list-cell {
  .regionSize(@fill, @spacing * 8.5);
    min-height: @spacing * 8.5;
    box-sizing: border-box;
    border-bottom: 1px solid #e0e0e0;
  &>div {
     float: left;
     height: @spacing * 7.5;
     margin-top: @spacing / 2;
   }
  &>div:first-child {
     width: @spacing * 8.5;
     margin-left: @spacing / 2;
     overflow: hidden;
     border-radius: @spacing;
  img {
  .regionSize(@fill, @fill);
  }
  }
  &>div:last-child {
     width: calc(@fill - @spacing * 10);
     margin-left: @spacing / 2;
     overflow: hidden;
  .home-list-title {
  .regionSize(@fill - @spacing * 10, @spacing * 2);
    font-weight: bold;
    font-size: 32px;/*px*/
    margin-left: @spacing / 2;
  }
  .home-list-summary {
  .regionSize(@fill - @spacing * 10, @spacing * 3.8);
    margin-left: @spacing / 2;
    color: #666666;
  }
  .home-list-channel, .home-list-date {
    float: left;
    color: #666666;
    line-height: @spacing * 2.4;
    margin-right: @spacing;
  }
  }
  }
  }
  }
  .app-list-border {
    margin-left: 12px;
  }
  }
  @spacing: 20px;
  @fill: 100%;
  .regionSize (@regionW: 100%, @regionH: 100%) {
    width: @regionW;
    height: @regionH;
    position: relative;
  }
  @menuBackgroundColor: #f2f2f2;
  .user-modify-password-main {
    width: calc(@fill - 40px);
    height: calc(@fill - 40px);
    margin-left: 20px;
    margin-top: 20px;
    .user-modify-content-body-title {
      .regionSize(@fill, auto);
      //line-height: @spacing * 4;
      box-sizing: border-box;
      //border-bottom: 1px solid #d8d8d8;
      color: #333333;
      .user-modify-content-body-title-text{
        font-size: 20px;/*px*/
      }
      .user-modify-edit-btn{
        text-align: right;
        .el-button--small{
          border-radius: 5px;
          font-size: 20px;/*px*/
          width: @spacing * 4;
          height: @spacing * 2;
          background: #409EFF;
          color: white;
          border: 0.013333rem solid #DCDFE6;
        }
      }
      .split-line {
        .regionSize(@spacing / 4, @spacing*1.2);
        display: inline-block;
        background-color: #1f8dfc;
        border-radius: @spacing / 10;
        top: @spacing / 5;
        margin-right: @spacing/1.2;
      }
    }
    .page-content {
      width: @fill;
      height: calc(@fill - @spacing * 4);
      .page-body{
        width: 100%;
        height: calc(100%);
        margin: 0 auto 0 auto;
        position: relative;
        top: @spacing;
        .page-title{
          font-size: 22px;
          color: #262626;
          height: 50px;
          line-height: 50px;
          font-weight: bold;
        }
        .modify-password-body{
          width: @fill;
          height: calc( @fill - @spacing*4);
          background-color: white;
          position: relative;
          .modify-password-content{
            width: @spacing*33;
            margin: 0 auto;
            /*padding-top: @spacing*2;*/
            line-height: @spacing*2.5;
            font-size: 18px;/*px*/
            .tip-weight{
              color:#1f8dfc;
              font-weight: bold;
            }
            .modify-password-verification-code{
              width: @spacing*16.2;
              font-size: 18px;/*px*/
            }
            .modify-password-sns{
              float: right;
            }
            .el-form{
              padding-top: 15px;
              .modify-password-eyes-close{
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
              .modify-password-eyes-open{
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
              .rule-tip {
                width: 380px;
                height: 135px;
                position: absolute;
                top: -50px;
                left: 390px;
                /*background: url(../assets/img/register/rule-tip.png) no-repeat;*/
                background-size: cover;
                text-indent: 45px;
                padding-top: 8px;
                &>div {
                  height: 30px;
                  line-height: 30px;
                  .rule-tip-progress {
                    display: inline-block;
                    width: 50px;
                    height: 20px;
                    background-color: #e4e4e4;
                    margin-right: 1px;
                    position: relative;
                    top: 7px;
                  }
                  .rule-tip-achieve {
                    background-color: #1f8dfb;
                  }
                }
              }
            }
            .btn-content{
              text-align: center;
              margin-top: @spacing*2;
              .el-button{
                width: @spacing*6;
                height: @spacing*2;
                font-size: 18px;/*px*/
              }
            }
          }
        }
        .modify-password-success{
          width: @fill;
          height: calc( @fill - @spacing*4);
          background-color: white;
          padding-bottom: @spacing*2;
          padding-top: @spacing*2;
          .success-info{
            text-align: center;
            &>div{
              width: 360px;
              display: inline-block;
              line-height: 60px;
              &>img{
                width: @spacing*3;
                float:left;
                position:relative;
              }
              &>p{
                float:right;
              }
            }
            .success-info-title{
              font-size: 20px;/*px*/
              font-weight: bold;
              margin: 0;
            }
          }
          .btn-content{
            text-align: center;
            margin-top: @spacing*2;
            .el-button{
              width: @spacing*6;
              height: @spacing*2;
              font-size: 18px;/*px*/
            }
          }
        }
        .no-phone-body{
          width: @fill;
          height: 300px;
          background-color: white;
          .no-phone-content{
            width: @spacing*28.5;
            margin: 0 auto;
            padding: @spacing*2 0 0 0 ;
            font-size: 18px;/*px*/
            line-height:  @spacing*1.5;
            text-align: center;
            .tip-weight{
              font-weight: bold;
            }
            .btn-content{
              padding-top: 40px;
              text-align: center;
              .el-button{
                width: @spacing*6;
                height: @spacing*2;
                font-size: 18px;/*px*/
              }
            }
          }
        }
      }
    }
  }
</style>
