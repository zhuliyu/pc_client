<template>
  <div class="user-modify-phone-main">
    <div class="user-modify-content-body-title">
      <el-row>
        <el-col :span="12">
          <span class="split-line"></span><span class="user-modify-content-body-title-text">
           <span v-if="type === 'update'">修改手机号码</span>
           <span v-else>绑定手机号码</span>
         </span>
        </el-col>
        <el-col :span="12" class="user-modify-edit-btn">
          <el-button type="default" size="small" @click="returnInformation()" >返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="page-content">
      <div class="page-body">
        <!-- <div class="page-title">
           <span v-if="type === 'update'">修改手机号码</span>
           <span v-else>绑定手机号码</span>
         </div>-->
        <div class="modify-phone-body">
          <el-steps v-show="type === 'update'" :active="step" align-center>
            <el-step title="验证身份" description=""></el-step>
            <el-step title="修改手机号码" description=""></el-step>
            <el-step title="完成" description=""></el-step>
          </el-steps>
          <div class="modify-phone-info">
            <div v-if="type === 'update'">
              <div v-show="step === 1" class="step-one">
                <el-row class="tip-weight"><span>&nbsp;&nbsp;为确认是您本人，请完成以下验证。</span></el-row>
                <el-row class="step-one-row-two"><span style="color:#666666">&nbsp;&nbsp;已验证手机：</span><span style="color:#1f8dfc">+86</span>&nbsp;&nbsp;<span>{{showPhone}}</span></el-row>
                <el-row>
                  <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1">
                    <el-form-item prop="verificationCode1" label="短信验证码：" class="verification-code">
                      <el-input class="step-one-input"  placeholder="请输入短信验证码" v-model.trim="ruleForm1.verificationCode1" maxlength="6"></el-input>
                      <SMS class="step-one-sns" v-bind:phoneNumber = telephone v-bind:msgType = msgType @getUuid = "getUuid1"></SMS>
                      <div style="clear: both"></div>
                    </el-form-item>
                    <div class="step-one-btn-content">
                      <el-button v-show="(step === 1) && (type === 'update')" type="primary" size="large" @click="nextStep('ruleForm1')" :disabled="telephone === ''">下一步</el-button>
                    </div>
                  </el-form>
                </el-row>
              </div>
              <div v-show="step === 2" class="step-two">
                <el-form label-width="0px" :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                  <el-form-item label="原手机号码：" prop="oldPhoneNumber">
                    <el-input class="step-two-input" v-model.trim="ruleForm2.oldPhoneNumber" placeholder="请输入您的原手机号码" maxlength="11"></el-input>
                  </el-form-item>
                  <el-form-item label="新手机号码：" prop="newPhoneNumber">
                    <el-input class="step-two-input" v-model.trim="ruleForm2.newPhoneNumber" placeholder="请输入您的新手机号码" maxlength="11"></el-input>
                  </el-form-item>
                  <el-form-item label="短信验证码：" class="verification-code" prop="verificationCode2">
                    <el-input class="step-two-input step-two-input-verification-code" v-model.trim="ruleForm2.verificationCode2" placeholder="请输入新手机号码的短信验证码" maxlength="6"></el-input>
                    <SMS class="step-two-sns" v-bind:phoneNumber = ruleForm2.newPhoneNumber v-bind:msgType = msgType v-bind:checkNumber = checkNumber @getUuid = "getUuid2"></SMS>
                    <div style="clear: both"></div>
                  </el-form-item>
                  <div class="step-two-btn-content">
                    <el-button v-show="(step === 2) && (type === 'update')" type="primary" size="large" :disabled="phoneSubmitUpdate" @click="submit('ruleForm2')">确定</el-button>
                  </div>
                </el-form>
              </div>
              <div v-show="step === 3" class="step-three">
                <el-row class="step-three-success">
                  <div>
                    <img src="../assets/img/user/modifySuccess2.png"/>
                    <p  class="success-info-title">修改成功，请牢记新的手机号码</p>
                  </div>
                </el-row>
                <el-row class="step-three-user-info">
                  <div>
                    <el-row class="step-three-user-title">
                      <el-col :span="8" align="left">
                        用
                      </el-col>
                      <el-col :span="8" align="center">
                        户
                      </el-col>
                      <el-col :span="8" align="right">
                        名
                      </el-col>
                    </el-row>
                    <el-row class="step-three-user-text">
                      <el-col>
                        ：{{userName}}
                      </el-col>
                    </el-row>
                  </div>
                </el-row>
                <el-row class="step-three-user-info">
                  <div>
                    <el-row class="step-three-user-title">
                      <el-col :span="6" align="left">绑</el-col>
                      <el-col :span="6" align="center">定</el-col>
                      <el-col :span="6" align="center">手</el-col>
                      <el-col :span="6" align="right">机</el-col>
                    </el-row>
                    <el-row class="step-three-user-text">
                      <el-col>
                        ：{{showNewPhone}}
                      </el-col>
                    </el-row>
                  </div>
                </el-row>
                <div class="step-three-btn-content">
                  <el-button v-show="(step === 3) && (type === 'update')" type="primary" size="large" @click="returnIndex()">重新登录</el-button>
                </div>
              </div>
            </div>
            <div v-else class="step-two">
              <el-form v-show="bindIng" label-width="0px" :model="ruleForm3" :rules="rules3" ref="ruleForm3">
                <el-form-item label="绑定手机号：" prop="bindPhoneNumber">
                  <el-input class="step-two-input" v-model.trim="ruleForm3.bindPhoneNumber" placeholder="请输入您的绑定手机号码" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码：" class="verification-code" prop="verificationCode3">
                  <el-input class="step-two-input step-two-input-verification-code"  v-model.trim="ruleForm3.verificationCode3" placeholder="请输入绑定手机号码的短信验证码" maxlength="6"></el-input>
                  <SMS class="step-two-sns" v-bind:phoneNumber = ruleForm3.bindPhoneNumber v-bind:msgType = msgType v-bind:checkNumber = checkNumber @getUuid = "getUuid3"></SMS>
                </el-form-item>
                <div class="step-two-btn-content">
                  <el-button v-show="bindIng" type="primary" size="large" :disabled="phoneSubmitAdd" @click="submitAdd('ruleForm3')">确定</el-button>
                </div>
              </el-form>
              <div v-show="!bindIng" class="step-three">
                <el-row class="step-three-success-bind">
                  <div>
                    <img src="../assets/img/user/modifySuccess2.png"/>
                    <p  class="success-info-title">绑定成功，请牢记绑定的手机号码</p>
                  </div>
                </el-row>
                <el-row class="step-three-user-info">
                  <div>
                    <el-row class="step-three-user-title">
                      <el-col :span="8" align="left">
                        用
                      </el-col>
                      <el-col :span="8" align="center">
                        户
                      </el-col>
                      <el-col :span="8" align="right">
                        名
                      </el-col>
                    </el-row>
                    <el-row class="step-three-user-text">
                      <el-col>
                        ：{{userName}}
                      </el-col>
                    </el-row>
                  </div>
                </el-row>
                <el-row class="step-three-user-info">
                  <div>
                    <el-row class="step-three-user-title">
                      <el-col :span="6" align="left">绑</el-col>
                      <el-col :span="6" align="center">定</el-col>
                      <el-col :span="6" align="center">手</el-col>
                      <el-col :span="6" align="right">机</el-col>
                    </el-row>
                    <el-row class="step-three-user-text">
                      <el-col>
                        ：{{showBindPhone}}
                      </el-col>
                    </el-row>
                  </div>
                </el-row>
                <div class="step-three-btn-content">
                  <el-button v-show="!bindIng" type="primary" size="large" @click="returnIndex()">重新登录</el-button>
                </div>
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
  import util from '../assets/js/util'
  import checkUrl from '../assets/js/checkUrl'
  import 'jquery'
  import { mixins } from 'vue-class-component'
  import getUserInfo from '@/components/mixins/getUserInfo'
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
  interface ruleForm1Interface {
    verificationCode1: string
  }
  interface rule1Interface {
    verificationCode1: any
  }
  interface ruleForm2Interface {
    oldPhoneNumber: string,
    newPhoneNumber: string,
    verificationCode2: string
  }
  interface rule2Interface {
    oldPhoneNumber: any,
    newPhoneNumber: any,
    verificationCode2: any
  }
  interface ruleForm3Interface {
    bindPhoneNumber: string,
    verificationCode3: string
  }
  interface rule3Interface {
    bindPhoneNumber: any,
    verificationCode3: any
  }
  declare const Buffer:any
  @Component({
    name: 'userModifyPhone',
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

  export default class userModifyPhone extends mixins(getUserInfo) {
    type: string = '';
    userName: string = '';
    step: number = 1;
    showNewPhone: string = '';
    uuid1: string = '';
    uuid2: string = '';
    uuid3: string = '';
    checkNumber: string = '';
    telephone: string = '';
    showPhone: string = '';
    bindIng: boolean = true;
    showBindPhone: string = '';
    msgType: string = 'modifyPhone';
    phoneSubmitUpdate: boolean = false;
    phoneSubmitAdd: boolean = false;
    ruleForm1: ruleForm1Interface = {
      verificationCode1: ''
    };
    rules1: rule1Interface = {
      verificationCode1: [
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
      ]
    };
    ruleForm2: ruleForm2Interface = {
      oldPhoneNumber: '',
      newPhoneNumber: '',
      verificationCode2: ''
    };
    rules2: rule2Interface = {
      oldPhoneNumber: [
        { required: true,
          validator: (rule:any, value:string, callback:any) => {
            if (value === '') {
              return callback(new Error('旧手机号不能为空'))
            } else {
              checkNumberAndEmail('telephoneNumber', value, (checkResult:boolean) => {
                if (!checkResult) {
                  return callback(new Error('旧手机号填写不正确，请输入有效的11位手机号'))
                } else {
                  callback()
                }
              })
            }
          },
          trigger: 'blur' }
      ],
      newPhoneNumber: [
        { required: true,
          validator: this.checkNewPhoneNumber,
          trigger: 'blur' }
      ],
      verificationCode2: [
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
      ]
    };
    ruleForm3: ruleForm3Interface = {
      bindPhoneNumber: '',
      verificationCode3: ''
    };
    checkNewPhoneNumber (rule:any, value:string, callback:any) {
      if (value === '') {
        return callback(new Error('新手机号不能为空'))
      } else {
        checkNumberAndEmail('telephoneNumber', value, (checkResult:boolean) => {
          if (!checkResult) {
            return callback(new Error('新手机号填写不正确，请输入有效的11位手机号'))
          } else {
            if (value === this.ruleForm2.oldPhoneNumber) {
              this.checkNumber = 'sameAsOldPhone'
              return callback(new Error('新手机号不能与旧手机号相同'))
            } else {
              fetch(apiConfig('login/checkAccount'), { username: value })
                .then((res:any) => {
                  if (res.code === 200) {
                    this.checkNumber = 'bindPhone'
                    return callback(new Error('该手机号已被使用'))
                  } else {
                    this.checkNumber = ''
                    callback()
                  }
                })
            }
          }
        })
      }
    }
    @Action('cancelUserInformation', { namespace: 'information' })
    cancelUserInformation: any;
    @Action('loginOut', { namespace: 'login' })
    loginOut: any;
    @Action('clearToken', { namespace: 'login' })
    clearToken: any;
    rules3: rule3Interface = {
      bindPhoneNumber: [
        { required: true,
          validator: this.checkBindPhoneNumber,
          trigger: 'blur' }
      ],
      verificationCode3: [
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
      ]
    }
    checkBindPhoneNumber (rule:any, value:string, callback:any) {
      if (value === '') {
        return callback(new Error('绑定手机号不能为空'))
      } else {
        checkNumberAndEmail('telephoneNumber', value, (checkResult:boolean) => {
          if (!checkResult) {
            return callback(new Error('绑定手机号填写不正确，请输入有效的11位手机号'))
          } else {
            fetch(apiConfig('login/checkAccount'), { username: value })
              .then((res:any) => {
                if (res.code === 200) {
                  this.checkNumber = 'bindPhone'
                  return callback(new Error('该手机号已被使用'))
                } else {
                  this.checkNumber = ''
                  callback()
                }
              })
          }
        })
      }
    }
    private created () {
      let self = this
      let name3:any = self.$route.query.phone || ''
      if ((name3 !== '') && (name3 !== null) && (name3 !== undefined)) {
        let param = new Buffer(decodeURIComponent(name3), 'base64')
        param = JSON.parse(param)
        self.type = JSON.parse(JSON.stringify(param.type))
        self.telephone = JSON.parse(JSON.stringify(param.telephone))
        self.showPhone = self.telephone.substring(0, 3) + '****' + self.telephone.substring(7, 11)
      } else {
        self.telephone = ''
        self.showPhone = '未获取到手机号，请先绑定'
      }
      if (self.type === 'update') {
        self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料', '修改手机号码'] })
      } else {
        self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料', '绑定手机号码'] })
      }
      let win: any = window || {}
      try {
        let getUserInfoData = JSON.parse(win.external.GetUserLoginInfo())
        self.userName = getUserInfoData.userName
      } catch (e) {}
    }
    @Watch('step')
    getStep (newVal: number) {
      if (newVal === 2) {
        $('.modify-phone-body .el-steps .el-step').eq(0).find('.el-step__line-inner').css('border', '0px')
        $('.modify-phone-body .el-steps .el-step').eq(0).find('.el-step__line').addClass('el-step__line-down')
      } else if (newVal === 3) {
        $('.modify-phone-body .el-steps .el-step').eq(1).find('.el-step__line-inner').css('border', '0px')
        $('.modify-phone-body .el-steps .el-step').eq(1).find('.el-step__line').addClass('el-step__line-down')
      }
    }
    private beforeRouteLeave (to:any, from:any, next:any) {
      if (to.name !== 'Information') {
        this.cancelUserInformation()
      }
      next()
    }
    nextStep (formName:string) {
      let self = this;
      (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          let phoneData = {
            userId: self.userId,
            phoneNum: self.telephone,
            inputMessageCode: self.ruleForm1.verificationCode1,
            smsUuid: self.uuid1
          }
          post(apiConfig('userInfomation/modifyPhoneVerificationCode'), phoneData)
            .then((res:any) => {
              if (res.code) {
                if (res.code === 200) {
                  self.step = 2
                } else {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              } else {
                self.$message({
                  message: '请求验证已绑手机号功能异常，请稍后再试',
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    }
    submit (formName:string) {
      let self = this;
      (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          self.phoneSubmitUpdate = true
          window.setTimeout(() => {
            self.phoneSubmitUpdate = false
          }, 2000)
          let phoneData = {
            userId: self.userId,
            oldTelNum: self.ruleForm2.oldPhoneNumber,
            newTelNum: self.ruleForm2.newPhoneNumber,
            inputMessageCode: self.ruleForm2.verificationCode2,
            smsUuid: self.uuid2
          }
          put(apiConfig('userInfomation/modifyPhoneSubmitEdit'), phoneData)
            .then((res:any) => {
              if (res.code) {
                if (res.code === 200) {
                  self.step = 3
                  self.showNewPhone = self.ruleForm2.newPhoneNumber.substring(0, 3) + '****' + self.ruleForm2.newPhoneNumber.substring(7, 11)
                } else if (res.code === 501) {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                } else {
                  self.$message({
                    message: '请求修改手机号功能异常，请稍后再试',
                    type: 'error'
                  })
                }
              } else {
                self.$message({
                  message: '请求修改手机号功能异常，请稍后再试',
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    }
    submitAdd (formName:string) {
      let self = this;
      (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          self.phoneSubmitAdd = true
          window.setTimeout(() => {
            self.phoneSubmitAdd = false
          }, 2000)
          let phoneData = {
            userId: self.userId,
            newTelNum: self.ruleForm3.bindPhoneNumber,
            inputMessageCode: self.ruleForm3.verificationCode3,
            smsUuid: self.uuid3
          }
          post(apiConfig('userInfomation/modifyPhoneSubmitAdd'), phoneData)
            .then((res:any) => {
              if (res.code) {
                if (res.code === 200) {
                  self.step = 3
                  self.bindIng = false
                  self.showBindPhone = self.ruleForm3.bindPhoneNumber.substring(0, 3) + '****' + self.ruleForm3.bindPhoneNumber.substring(7, 11)
                } else if (res.code === 501) {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                } else {
                  self.$message({
                    message: '请求绑定手机号功能异常，请稍后再试',
                    type: 'error'
                  })
                }
              } else {
                self.$message({
                  message: '请求绑定手机号功能异常，请稍后再试',
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    }
    returnInformation () {
      let self = this
      self.$router.push({
        path: '/myAccount/information'
      })
    }
    returnIndex () {
      let self = this
      self.clearToken()
      self.$router.push({
        path: '/home'
      })
      self.cancelUserInformation()
    }
    returnIndex2 () {
      let self = this
      /* self.loginOut(1); */
      self.cancelUserInformation()
      self.$router.push({
        path: '/myAccount/information'
      })
      // window.location.href = 'https://www.zhizaoyun.wang/';
    }
    getUuid1 (uuid:string) {
      this.uuid1 = uuid
    }
    getUuid2 (uuid:string) {
      this.uuid2 = uuid
    }
    getUuid3 (uuid:string) {
      this.uuid3 = uuid
    }
  }
</script>
<style>
  .verification-code .sms-panel{
    display: inline-block;
  }
  .step-one-sns .el-button,.step-two-sns .el-button{
    height: 40px;
    width:180px;
    font-size: 16px;/*px*/
  }
  .modify-phone-body .el-steps{
    padding: 10px 0 20px 0;
    margin-left: -100px;
  }
  .modify-phone-body .el-steps .is-process{
    color: #C0C4CC;
    border-color: #C0C4CC;
    font-weight: normal;
  }
  .modify-phone-body .el-steps .el-step .is-finish .is-text{
    width: 40px;
    height: 40px;
    background-color: #1f8dfc;
    color: white;
    top: -8px;
    font-size: 20px;/*px*/
  }
  .modify-phone-body .el-steps .el-step .is-process .is-text,.modify-phone-body .el-steps .el-step .is-wait .is-text{
    width: 40px;
    height: 40px;
    background-color: #d8d8d8;
    color: white;
    top: -8px;
    font-size: 20px;/*px*/
    border: 1px solid #d8d8d8;
  }
  .modify-phone-body .el-steps .el-step .is-finish{
    font-size: 18px;/*px*/
    font-weight: bold;
  }
  .modify-phone-body .el-steps .el-step .is-process,.modify-phone-body .el-steps .el-step .is-wait{
    font-size: 18px;/*px*/
    font-weight: bold;
    color: #666666;
  }
  .modify-phone-body .el-steps .el-step .el-step__head.is-finish .el-step__line{
    background: url("../assets/img/user/arrow-process.png") no-repeat;
    width: calc(100% - 100px);
    margin-left:50px;
  }
  .modify-phone-body .el-steps .el-step .el-step__head.is-process .el-step__line{
    background: url("../assets/img/user/arrow-wait.png") no-repeat;
    width: calc(100% - 100px);
    margin-left:50px;
  }
  .modify-phone-body .el-steps .el-step .el-step__head.is-finish .el-step__line-down{
    background: url("../assets/img/user/arrow-finish.png") no-repeat;
    width: calc(100% - 100px);
    margin-left:50px;
  }
  .modify-phone-info .step-one .el-form .el-form-item .el-form-item__label,.modify-phone-info .step-two .el-form .el-form-item .el-form-item__label{
    font-size: 18px;/*px*/
    padding-right: 0;
    height: 40px;
    line-height: 40px;
  }
  .modify-phone-info .step-one .el-form .el-form-item .step-one-input .el-input__inner,.modify-phone-info .step-two .el-form .el-form-item .step-two-input .el-input__inner{
    height: 40px;
    line-height: 40px;
    font-size: 18px;/*px*/
  }
  .modify-phone-info .step-one .el-form .el-form-item .el-form-item__content .el-form-item__error{
    margin-left: 138px;
  }
  .modify-phone-info .step-two .el-form .el-form-item{
    margin-bottom: 30px;
  }
  .modify-phone-info .step-two .el-form .el-form-item .el-form-item__label{
    width: 150px !important;
  }
  .modify-phone-info .step-two .el-form .el-form-item .el-form-item__content{
    margin-left: 150px !important;
  }
</style>
<style scoped lang="less" type="text/less">
  @spacing: 20px;
  @fill: 100%;
  .regionSize (@regionW: 100%, @regionH: 100%) {
    width: @regionW;
    height: @regionH;
    position: relative;
  }
  @menuBackgroundColor: #f2f2f2;
  .user-modify-phone-main {
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
        .modify-phone-body{
          width: @fill;
          height: calc( @fill - @spacing*4);
          background-color: white;
          position: relative;
          .modify-phone-info{
            width: @spacing*33;
            margin: 0 auto;
            padding-top: @spacing*2;
            .step-one{
              line-height: @spacing*2.5;
              font-size: 18px;/*px*/
              .el-input{
                width: @spacing*10;
              }
              .tip-weight{
                color:#1f8dfc;
                font-weight: bold;
              }
              .step-one-sns{
                float: right;
              }
              .step-one-input{
                width: 355px;
              }
              .step-one-btn-content{
                text-align: center;
                margin-top: @spacing*2;
                .el-button{
                  width: @spacing*6;
                  height: @spacing*2;
                  font-size: 18px;/*px*/
                }
              }
              .step-one-row-two{
                margin-bottom: @spacing/2;
              }
              .el-form{
                .el-form-item{
                  .el-form-item__label{
                    font-size: 30px;/*px*/
                  }
                }
              }
            }
            .step-two{
              .verification-code{
                .el-input{
                  width: 250px;
                }
                .step-two-input-verification-code{
                  width: @spacing*16.2;
                  font-size: 18px;/*px*/
                }
                .step-two-sns{
                  float: right;
                }
              }
              .step-two-btn-content{
                text-align: center;
                margin-top: @spacing*2;
                .el-button{
                  width: @spacing*6;
                  height: @spacing*2;
                  font-size: 18px;/*px*/
                }
              }
            }
            .step-three{
              width: 100%;
              margin: 0 auto;
              .step-three-success{
                text-align: center;
                &>div{
                  width: 350px;
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
                }
              }
              .step-three-success-bind{
                text-align: center;
                &>div{
                  width: 385px;
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
                }
              }
              .step-three-user-info{
                width: 100%;
                margin: 0 0 0 225px;
                height: @spacing*2.5;
                line-height: @spacing*2.5;
                color: #333333;
                font-size: 18px;/*px*/
                font-weight: 400;
                font-style: normal;
                white-space: nowrap;
                .step-three-user-title{
                  display: inline-block;
                  width:  @spacing*3.5;
                  color:#666666
                }
                .step-three-user-text{
                  display: inline-block;
                }
              }
              .step-three-btn-content{
                text-align: center;
                margin-top: @spacing*2;
                .el-button{
                  width: @spacing*6;
                  height: @spacing*2;
                  font-size: 18px;/*px*/
                }
              }
            }
            .bind-phone{
              padding-top:80px;
              .bind-success{
                width: @spacing*18;
                margin: 0 auto;
                .step-three-success{
                  &>div{
                    &>img{
                      position: relative;
                      top: -8px;
                      left: 8px;
                    }
                  }
                  .success-info-title{
                    font-size: 20px;
                    font-weight: bold;
                  }
                }
                .step-three-user-info{
                  width: 212px;
                  margin: 0 auto;
                  height: 30px;
                  line-height: 30px;
                  color: #333333;
                  font-size: 16px;
                  font-weight: 400;
                  font-style: normal;
                  white-space: nowrap;
                }
              }
            }
          }
          .btn-contnet{
            position: absolute;
            bottom: 36px;
            left: 450px;
            .el-button{
              width: @spacing*5;
            }
          }
          .btn-contnet.btn-add{
            bottom: 70px !important;
          }
          .el-steps{
            width: calc(100%);
            margin: 0 auto 0 auto;
            padding-top: @spacing * 2;
            .is-process{
              color: #C0C4CC;
              border-color: #C0C4CC;
              font-weight: normal;
            }
          }
        }
      }
    }
  }
</style>
