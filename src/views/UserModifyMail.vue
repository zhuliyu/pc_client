<template>
  <div class="user-modify-mail-main">
    <div class="user-modify-content-body-title">
      <el-row>
        <el-col :span="12">
          <span class="split-line"></span><span class="user-modify-content-body-title-text">
            <span v-if="type === 'update'">修改电子邮箱</span>
            <span v-else>绑定电子邮箱</span>
        </span>
        </el-col>
        <el-col :span="12" class="user-modify-edit-btn">
          <el-button type="default" size="small" @click="returnInformation()" >返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="page-content">
      <div class="page-body">
        <!--<div class="page-title">
          <span v-if="type === 'update'">修改电子邮箱</span>
          <span v-else>绑定电子邮箱</span>
        </div>-->
        <div :class="showBg ? 'modify-mail-body' : 'modify-mail-body no-bg'">
          <el-steps  :active="step" align-center>
            <el-step title="验证身份" description=""></el-step>
            <el-step :title="type === 'update' ? '修改登录邮箱' : '设置登录邮箱'" description=""></el-step>
            <el-step title="完成" description=""></el-step>
          </el-steps>
          <!-- <span @mouseenter="showTip(1)" @mouseleave="hideTip(1)" :class="type === 'add' ? 'no-mail-text-one' : 'no-mail-text-three'" v-show="((type === 'add') && (step === 2)) || ((type === 'update')&&(updateWay === 'phone')&&(step === 2))">没收到邮箱验证码？</span>
           <div :class="type === 'add' ? 'tip-show-one' : 'tip-show-three'" v-show="tipShow1">
             <div>1、请确认邮箱地址是否正确。</div>

             <div>2、请核实邮箱是否正常使用，并检查垃圾邮件箱。</div>

             <div>3、网络通讯异常可能会造成邮件丢失，请重新获取或稍后再试。</div>
           </div>
           <span @mouseenter="showTip(2)" @mouseleave="hideTip(2)" :class="step === 1 ? 'no-mail-text-two' : 'no-mail-text-three'"  v-show="((type === 'update')&&(updateWay === 'mail')&&(step !== 3))">没收到邮箱验证码？</span>
           <div :class="step === 1 ? 'tip-show-two' : 'tip-show-three'" v-show="tipShow2">
             <div>1、请确认邮箱地址是否正确。</div>

             <div>2、请核实邮箱是否正常使用，并检查垃圾邮件箱。</div>

             <div>3、网络通讯异常可能会造成邮件丢失，请重新获取或稍后再试。</div>
           </div>-->
          <div class="modify-mail-info" v-if="type === 'update'">
            <div v-show="step === 1" class="step-one">
              <div v-if="updateWay === ''">
                <el-row><span class="tip-weight checkway-tip">请选择验证方式：</span></el-row>
                <el-row class="update-mail-checkWay">
                  <span class="update-mail-checkWay-left">通过短信验证码验证</span>
                  <el-button class="update-mail-checkWay-btn update-mail-checkWay-right" type="primary" size="large" @click="checkUpdateWay('phone')">立即验证</el-button>
                  <div style="clear: both;"></div>
                </el-row>
                <el-row class="update-mail-checkWay">
                  <span class="update-mail-checkWay-left">通过邮箱验证码验证</span>
                  <el-button class="update-mail-checkWay-btn update-mail-checkWay-right" type="primary" size="large" @click="checkUpdateWay('mail')">立即验证</el-button>
                  <div style="clear: both;"></div>
                </el-row>
              </div>
              <div v-else>
                <div v-if="updateWay === 'phone'">
                  <div v-if="telephone !== ''" >
                    <el-row class="tip-weight"><span>&nbsp;&nbsp;为确认是您本人，请完成以下验证。</span></el-row>
                    <el-row class="mail-step-one-row">
                      <span style="color:#666666">&nbsp;&nbsp;已验证手机：</span><span style="color:#1f8dfc">+86</span>&nbsp;&nbsp;<span>{{showPhone}}</span>
                    </el-row>
                    <el-row>
                      <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1">
                        <el-form-item prop="verificationCode1" label="短信验证码：" class="verification-code">
                          <el-input class="step-one-input" placeholder="请输入验证码" v-model.trim="ruleForm1.verificationCode1" maxlength="6"></el-input>
                          <SMS class="step-one-sns" v-bind:phoneNumber = telephone v-bind:msgType = msgType @getUuid = "getUuid1"></SMS>
                          <div style="clear: both"></div>
                        </el-form-item>
                        <div class="step-one-btn-content">
                          <el-button v-show="(step === 1) && (updateWay !== '') &&  (telephone !== '')" type="primary" size="large" @click="nextStepUpdate()">下一步</el-button>
                        </div>
                      </el-form>
                    </el-row>
                  </div>
                  <div v-else class="no-phone-content">
                    <span class="tip-weight">通过短信验证码验证，需验证手机号，</span>
                    <span class="tip-weight">当前账号未绑定手机，请先绑定。</span>
                    <div class="btn-content">
                      <el-button type="primary" size="large" @click="goModifyPhone('add')">绑定手机</el-button>
                    </div>
                  </div>
                </div>
                <div v-if="updateWay === 'mail'">
                  <el-row class="tip-weight"><span>&nbsp;&nbsp;为确认是您本人，请完成以下验证。</span></el-row>
                  <el-row class="mail-step-one-row">
                    <span style="color:#666666">&nbsp;&nbsp;已验证邮箱：</span><span>{{showMail}}</span>
                  </el-row>
                  <el-row>
                    <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3">
                      <el-form-item prop="verificationCode3" label="邮箱验证码：" class="verification-code">
                        <el-input  class="step-one-input" placeholder="请输入验证码" v-model.trim="ruleForm3.verificationCode3" maxlength="6"></el-input>
                        <el-button class="step-one-sns" type="primary" @click="msgContinueOld()">{{ codeInfoOld }}</el-button>
                        <div style="clear: both"></div>
                      </el-form-item>
                      <div class="step-one-btn-content">
                        <el-button v-show="(step === 1) && (updateWay !== '') &&  (telephone !== '')" type="primary" size="large" @click="nextStepUpdate()">下一步</el-button>
                      </div>
                    </el-form>
                  </el-row>
                </div>
              </div>
            </div>
            <div v-show="step === 2" class="step-two">
              <el-form label-width="0px" :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                <el-form-item label="原登录邮箱：" prop="newMail">
                  <span class="step-two-text">{{showMail}}</span>
                </el-form-item>
                <el-form-item label="新登录邮箱：" prop="newMail">
                  <el-input class="step-two-input" v-model.trim="ruleForm2.newMail" placeholder="请输入您的新登录邮箱"></el-input>
                </el-form-item>
                <el-form-item label="邮箱验证码：" class="verification-code" prop="verificationCode2">
                  <el-input class="step-two-input step-two-input-verification-code"  v-model.trim="ruleForm2.verificationCode2" placeholder="请输入新邮箱的验证码" maxlength="6"></el-input>
                  <el-button class="step-two-sns" type="primary" @click="getCode()">{{ codeInfo }}</el-button>
                  <!-- <SMS v-bind:phoneNumber = ruleForm2.newPhoneNumber v-bind:checkNumber = checkNumber @getUuid = "getUuid2"></SMS>-->
                </el-form-item>
                <div class="step-two-btn-content">
                  <el-button v-show="step === 2" type="primary" size="large" :disabled="submitMailBtn" @click="submit('ruleForm2')">确定</el-button>
                </div>
              </el-form>
            </div>
            <div v-show="step === 3" class="step-three">
              <el-row class="step-three-success-update">
                <div>
                  <img src="../assets/img/user/modifySuccess2.png"/>
                  <p class="success-info-title">修改成功，请牢记新的电子邮箱</p>
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
                    <el-col :span="6" align="center">邮</el-col>
                    <el-col :span="6" align="right">箱</el-col>
                  </el-row>
                  <el-row class="step-three-user-text">
                    <el-col>
                      ：{{showNewMail}}
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row v-if="telephone !== ''" class="step-three-user-info">
                <div>
                  <el-row class="step-three-user-title">
                    <el-col :span="6" align="left">绑</el-col>
                    <el-col :span="6" align="center">定</el-col>
                    <el-col :span="6" align="center">手</el-col>
                    <el-col :span="6" align="right">机</el-col>
                  </el-row>
                  <el-row class="step-three-user-text">
                    <el-col>
                      ：{{showPhone}}
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <div class="step-three-btn-content">
                <el-button v-show="step === 3" type="primary" size="large" @click="returnIndex()">返回</el-button>
              </div>
            </div>
          </div>
          <div v-else class="modify-mail-info">
            <div v-show="step === 1" class="step-one">
              <div v-if="telephone !== ''">
                <el-row class="tip-weight"><span>&nbsp;&nbsp;为确认是您本人，请完成以下验证。</span></el-row>
                <el-row class="mail-step-one-row">
                  <span style="color:#666666">&nbsp;&nbsp;已验证手机：</span><span style="color:#1f8dfc">+86</span>&nbsp;&nbsp;<span>{{showPhone}}</span>
                </el-row>
                <el-row>
                  <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1">
                    <el-form-item prop="verificationCode1" label="短信验证码：" class="verification-code">
                      <el-input class="step-one-input" placeholder="请输入短信验证码" v-model.trim="ruleForm1.verificationCode1" maxlength="6"></el-input>
                      <SMS class="step-one-sns" v-bind:phoneNumber = telephone v-bind:msgType = msgType @getUuid = "getUuid1"></SMS>
                      <div style="clear: both"></div>
                    </el-form-item>
                    <div class="step-one-btn-content">
                      <el-button v-show="(step === 1) && (telephone !== '')" type="primary" size="large" @click="nextStep('ruleForm1')" :disabled="telephone === ''">下一步</el-button>
                    </div>
                  </el-form>
                </el-row>
              </div>
              <div v-else class="no-phone-content">
                <span class="tip-weight">绑定电子邮箱，需验证手机号，</span>
                <span class="tip-weight">当前账号未绑定手机，请先绑定。</span>
                <div class="btn-content">
                  <el-button type="primary" size="large" @click="goModifyPhone('add')">绑定手机</el-button>
                </div>
              </div>
            </div>
            <div v-show="step === 2" class="step-two">
              <el-form label-width="0px" :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                <el-form-item label="登录邮箱：" prop="newMail">
                  <el-input class="step-two-input" v-model.trim="ruleForm2.newMail" placeholder="请输入您的新登录邮箱"></el-input>
                </el-form-item>
                <el-form-item label="邮箱验证码：" class="verification-code" prop="verificationCode2">
                  <el-input class="step-two-input step-two-input-verification-code"  v-model.trim="ruleForm2.verificationCode2" placeholder="请输入新邮箱的邮箱验证码" maxlength="6"></el-input>
                  <el-button class="step-two-sns" type="primary" @click="getCode()">{{ codeInfo }}</el-button>
                  <div style="clear: both"></div>
                  <!-- <SMS v-bind:phoneNumber = ruleForm2.newPhoneNumber v-bind:checkNumber = checkNumber @getUuid = "getUuid2"></SMS>-->
                </el-form-item>
                <div class="step-two-tip">
                  <div style="font-weight: bold">没收到邮箱验证码？</div>
                  <div>1.请确认邮箱地址是否正确。</div>
                  <div>2.请核实邮箱是否正常使用，并检查垃圾邮件箱。</div>
                  <div>3.网络通讯异常可能会造成邮件丢失，请重新获取或稍后再试。</div>
                </div>
                <div class="step-two-btn-content">
                  <el-button v-show="step === 2" type="primary" size="large" :disabled="submitMailBtn" @click="submit('ruleForm2')">确定</el-button>
                </div>
              </el-form>
            </div>
            <div v-show="step === 3" class="step-three">
              <el-row class="step-three-success">
                <div>
                  <img src="../assets/img/user/modifySuccess2.png"/>
                  <p class="success-info-title">修改成功，请牢记绑定的电子邮箱</p>
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
                    <el-col :span="6" align="center">邮</el-col>
                    <el-col :span="6" align="right">箱</el-col>
                  </el-row>
                  <el-row class="step-three-user-text">
                    <el-col>
                      ：{{showNewMail}}
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <el-row v-if="telephone !== ''" class="step-three-user-info">
                <div>
                  <el-row class="step-three-user-title">
                    <el-col :span="6" align="left">绑</el-col>
                    <el-col :span="6" align="center">定</el-col>
                    <el-col :span="6" align="center">手</el-col>
                    <el-col :span="6" align="right">机</el-col>
                  </el-row>
                  <el-row class="step-three-user-text">
                    <el-col>
                      ：{{showPhone}}
                    </el-col>
                  </el-row>
                </div>
              </el-row>
              <div class="step-three-btn-content">
                <el-button v-show="step === 3" type="primary" size="large" @click="returnIndex()">返回</el-button>
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
interface ruleForm1Interface {
  verificationCode1: string
}
interface rule1Interface {
  verificationCode1: any
}
interface ruleForm2Interface {
  newMail: string,
  verificationCode2: string
}
interface rule2Interface {
  newMail: any,
  verificationCode2: any
}
interface ruleForm3Interface {
  verificationCode3: string
}
interface rule3Interface {
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

export default class userModifyMail extends mixins(getUserInfo) {
  type: string = '';
  userName: string = '';
  codeInfo: string = '获取邮箱验证码';
  codeInfoOld: string = '获取邮箱验证码';
  codeInterval: number = 0;
  step: number = 1;
  checkNumber: boolean = false;
  showNewPhone: string = '';
  showNewMail: string = '';
  uuid1: string = '';
  uuid2: string = '';
  showBg: boolean = true;
  updateWay: string = '';
  telephone: string = '';
  showPhone: string = '';
  mail: string = '';
  showMail: string = '';
  tipShow1: boolean = false;
  tipShow2: boolean = false;
  msgType: string = 'modifyMail';
  submitMailBtn: boolean = false;
  @Action('cancelUserInformation', { namespace: 'information' })
  cancelUserInformation: any;
  @Action('loginOut', { namespace: 'login' })
  loginOut: any;
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
    newMail: '',
    verificationCode2: ''
  };
  rules2: rule2Interface = {
    newMail: [
      { required: true,
        validator: this.checkNewMail,
        trigger: 'blur' }
    ],
    verificationCode2: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入邮箱验证码'))
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
    verificationCode3: ''
  };
  rules3: rule3Interface = {
    verificationCode3: [
      { required: true,
        validator: (rule:any, value:string, callback:any) => {
          if (value === '') {
            callback(new Error('请输入邮箱验证码'))
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
  checkNewMail (rule:any, value:string, callback:any) {
    if (value === '') {
      return callback(new Error('新邮箱不能为空'))
    } else {
      checkNumberAndEmail('email', value, (checkResult:boolean) => {
        if (!checkResult) {
          return callback(new Error('新邮箱填写不正确，请输入正确的邮箱'))
        } else {
          post(apiConfig('userInfomation/checkMailOnly'), { userId: this.userId, mail: value })
            .then((res:any) => {
              if (res.code === 200) {
                this.checkNumber = false
                callback()
              } else if (res.code === 501) {
                this.checkNumber = true
                return callback(new Error('该邮箱已被使用'))
              } else {
                return callback(new Error('验证邮箱唯一性功能异常，请稍后再试'))
              }
            })
        }
      })
    }
  }
  private created () {
    let self = this
    let name1:any = self.$route.query.phone || ''
    if ((name1 !== '') && (name1 !== null) && (name1 !== undefined)) {
      let param = new Buffer(decodeURIComponent(name1), 'base64')
      param = JSON.parse(param)
      self.type = JSON.parse(JSON.stringify(param.type))
      self.telephone = JSON.parse(JSON.stringify(param.telephone))
      self.showPhone = self.telephone.substring(0, 3) + '****' + self.telephone.substring(7, 11)
      if (self.type === 'update') {
        self.showBg = false
        self.mail = JSON.parse(JSON.stringify(param.mail))
        let mailArr = self.mail.split('@')
        self.showMail = mailArr[0].substring(0, 3) + '******@' + mailArr[1]
      }
    } else {
      self.telephone = ''
      self.showPhone = '未获取到手机号，请先绑定'
    }
    if (self.type === 'update') {
      self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料', '修改电子邮箱'] })
    } else {
      self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料', '绑定电子邮箱'] })
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
      $('.modify-mail-body .el-steps .el-step').eq(0).find('.el-step__line-inner').css('border', '0px')
      $('.modify-mail-body .el-steps .el-step').eq(0).find('.el-step__line').addClass('el-step__line-down')
    } else if (newVal === 3) {
      $('.modify-mail-body .el-steps .el-step').eq(1).find('.el-step__line-inner').css('border', '0px')
      $('.modify-mail-body .el-steps .el-step').eq(1).find('.el-step__line').addClass('el-step__line-down')
    }
  }
  returnInformation ():void {
    let self = this
    self.$router.push({
      path: '/myAccount/information'
    })
  }
  getCode ():void {
    window.setTimeout(() => {
      checkNumberAndEmail('email', this.ruleForm2.newMail, (checkResult:boolean) => {
        if (!checkResult) {
          this.$message({
            message: '请输入正确的邮箱',
            type: 'warning'
          })
        } else {
          post(apiConfig('userInfomation/checkMailOnly'), { userId: this.userId, mail: this.ruleForm2.newMail })
            .then((res:any) => {
              if (res.code === 200) {
                this.msgContinue()
              } else if (res.code === 501) {
                this.$message({
                  message: '该邮箱已被使用',
                  type: 'warning'
                })
              } else {
                this.$message({
                  message: '验证邮箱唯一性功能异常，请稍后再试',
                  type: 'warning'
                })
              }
            })
        }
      })
    }, 1000)
  }
  msgContinue ():void {
    if (this.codeInfo === '获取邮箱验证码') {
      post(apiConfig('userInfomation/sendMail'), { userId: this.userId, mail: this.ruleForm2.newMail })
        .then((res:any) => {
          if (res.code === 200) {
            let count = 60
            // this.uuid2 = res.data.smsUuid;
            this.codeInterval = window.setInterval(() => {
              if (count === -1) {
                this.codeInfo = '获取邮箱验证码'
                window.clearInterval(this.codeInterval)
              } else {
                this.codeInfo = count + '秒后可重发'
                count--
              }
            }, 1000)
          } else {
            this.$message({
              message: '多次获取邮箱验证码，15分钟后请重试',
              type: 'warning'
            })
          }
        })
    }
  }
  msgContinueOld ():void {
    if (this.codeInfoOld === '获取邮箱验证码') {
      post(apiConfig('userInfomation/sendMail'), { userId: this.userId, mail: this.mail })
        .then((res:any) => {
          if (res.code === 200) {
            let count = 60
            this.codeInterval = window.setInterval(() => {
              if (count === -1) {
                this.codeInfoOld = '获取邮箱验证码'
                window.clearInterval(this.codeInterval)
              } else {
                this.codeInfoOld = count + '秒后可重发'
                count--
              }
            }, 1000)
          } else {
            this.$message({
              message: '多次获取邮箱验证码，15分钟后请重试',
              type: 'warning'
            })
          }
        })
    }
  }
  destroyed ():void {
    if (this.codeInterval) {
      window.clearInterval(this.codeInterval)
    }
  }
  nextStep (formName:string):void {
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
  nextStepUpdate ():void {
    let self = this
    if (self.updateWay === 'phone') {
      (self.$refs['ruleForm1'] as HTMLFormElement).validate((valid:any) => {
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
    } else if (self.updateWay === 'mail') {
      (self.$refs['ruleForm3'] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          let mailData = {
            userId: self.userId,
            mail: self.mail,
            inputMailCode: self.ruleForm3.verificationCode3
          }
          post(apiConfig('userInfomation/checkMailOld'), mailData)
            .then((res:any) => {
              if (res.code) {
                if (res.code === 200) {
                  self.step = 2
                } else if (res.code === 501) {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                } else {
                  self.$message({
                    message: '请求验证已绑邮箱功能异常，请稍后再试',
                    type: 'error'
                  })
                }
              } else {
                self.$message({
                  message: '请求验证已绑邮箱功能异常，请稍后再试',
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    }
  }
  submit (formName:string):void {
    let self = this;
    (self.$refs[formName] as HTMLFormElement).validate((valid:any) => {
      if (valid) {
        self.submitMailBtn = true
        window.setTimeout(() => {
          self.submitMailBtn = false
        }, 2000)
        let phoneData = {
          userId: self.userId,
          // oldTelNum : self.ruleForm2.oldPhoneNumber,
          mail: self.ruleForm2.newMail,
          inputMailCode: self.ruleForm2.verificationCode2
          // smsUuid: self.uuid2
        }
        post(apiConfig('userInfomation/submitMail'), phoneData)
          .then((res:any) => {
            if (res.code) {
              if (res.code === 200) {
                self.step = 3
                let mailArrNew = self.ruleForm2.newMail.split('@')
                self.showNewMail = mailArrNew[0].substring(0, 3) + '******@' + mailArrNew[1]
              } else if (res.code === 501) {
                self.$message({
                  message: res.msg,
                  type: 'warning'
                })
              } else {
                self.$message({
                  message: '请求绑定邮箱功能异常，请稍后再试',
                  type: 'error'
                })
              }
            } else {
              self.$message({
                message: '请求绑定邮箱功能异常，请稍后再试',
                type: 'error'
              })
            }
          })
      } else {
        return false
      }
    })
  }
  returnIndex ():void {
    let self = this
    self.cancelUserInformation()
    self.$router.push({
      path: '/myAccount/information'
    })
    // window.location.href = 'https://www.zhizaoyun.wang/';
  }
  getUuid1 (uuid:string):void {
    this.uuid1 = uuid
  }
  checkUpdateWay (way:string):void {
    let self = this
    self.updateWay = way
    self.showBg = true
  }
  goModifyPhone (type:string):void {
    let self = this
    self.$router.push({
      path: '/information/userModifyPhone',
      query: {
        phone: encodeURIComponent(base64encode(JSON.stringify({
          telephone: self.telephone,
          type: 'add'
        })))
      }
    })
  }
  goInformation ():void {
    let self = this
    self.cancelUserInformation()
    self.$router.push({
      path: '/myAccount/information'
    })
  }
  showTip (type:number) {
    let self = this
    if (type === 1) {
      self.tipShow1 = true
    } else {
      self.tipShow2 = true
    }
  }
  hideTip (type:number) {
    let self = this
    if (type === 1) {
      self.tipShow1 = false
    } else {
      self.tipShow2 = false
    }
  }
}
</script>
<style>
  .verification-code .sms-panel{
    display: inline-block;
  }
  .modify-mail-body .el-steps{
    padding: 10px 0 20px 0;
    margin-left: -100px;
  }
  .modify-mail-body .el-steps .is-process{
    color: #C0C4CC;
    border-color: #C0C4CC;
    font-weight: normal;
  }
  .modify-mail-body .el-steps .el-step .is-finish .is-text{
    width: 40px;
    height: 40px;
    background-color: #1f8dfc;
    color: white;
    top: -8px;
    font-size: 20px;/*px*/
  }
  .modify-mail-body .el-steps .el-step .is-process .is-text,.modify-mail-body .el-steps .el-step .is-wait .is-text{
    width: 40px;
    height: 40px;
    background-color: #d8d8d8;
    color: white;
    top: -8px;
    font-size: 20px;/*px*/
    border: 1px solid #d8d8d8;
  }
  .modify-mail-body .el-steps .el-step .is-finish{
    font-size: 18px;/*px*/
    font-weight: bold;
  }
  .modify-mail-body .el-steps .el-step .is-process,.modify-mail-body .el-steps .el-step .is-wait{
    font-size: 18px;/*px*/
    font-weight: bold;
    color: #666666;
  }
  .modify-mail-body .el-steps .el-step .el-step__head.is-finish .el-step__line{
    background: url("../assets/img/user/arrow-process.png") no-repeat;
    width: calc(100% - 100px);
    margin-left:50px;
  }
  .modify-mail-body .el-steps .el-step .el-step__head.is-process .el-step__line{
    background: url("../assets/img/user/arrow-wait.png") no-repeat;
    width: calc(100% - 100px);
    margin-left:50px;
  }
  .modify-mail-body .el-steps .el-step .el-step__head.is-finish .el-step__line-down{
    background: url("../assets/img/user/arrow-finish.png") no-repeat;
    width: calc(100% - 100px);
    margin-left:50px;
  }
  .modify-mail-info .el-form .el-form-item .el-form-item__label,.modify-phone-info .step-two .el-form .el-form-item .el-form-item__label{
    font-size: 18px;/*px*/
    padding-right: 0;
    height: 40px;
    line-height: 40px;
  }
  .modify-mail-info .el-form .el-form-item .step-one-input .el-input__inner,.modify-mail-info .el-form .el-form-item .step-two-input .el-input__inner{
    height: 40px;
    line-height: 40px;
    font-size: 18px;/*px*/
  }
  .modify-mail-info .step-one .el-form .el-form-item .el-form-item__content .el-form-item__error{
    margin-left: 138px;
  }
  .modify-mail-info .step-two .el-form .el-form-item .el-form-item__label{
    width: 150px !important;
  }
  .modify-mail-info .step-two .el-form .el-form-item .el-form-item__content{
    margin-left: 150px !important;
  }
  .modify-mail-info .step-two .el-form .el-form-item{
    margin-bottom: 30px;
  }
  .step-one-sns .el-button,.step-two-sns .el-button{
    height: 40px;
    width:180px;
    font-size: 18px;/*px*/
  }
</style>
<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @spacing: 20px;
   @fill: 100%;
  .regionSize (@regionW: 100%, @regionH: 100%) {
    width: @regionW;
    height: @regionH;
    position: relative;
  }
  @menuBackgroundColor: #f2f2f2;
  .user-modify-mail-main {
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
        .no-mail-text-one{
          position: absolute;
          display: inline-block;
          top: 259px;
          right: 206px;
          font-size: 14px;
          color: #0099FF;
        }
        .no-mail-text-two{
          position: absolute;
          display: inline-block;
          top: 297px;
          right: 255px;
          font-size: 14px;
          color: #0099FF;
        }
        .no-mail-text-three{
          position: absolute;
          display: inline-block;
          top: 320px;
          right: 205px;
          font-size: 14px;
          color: #0099FF;
        }
        .tip-show-one {
          width: 376px;
          height: 83px;
          position: absolute;
          top: 168px;
          right: 12px;
          background: url(../assets/img/modifyMail/no-find-mail-message.png) no-repeat;
          background-size: cover;
          text-indent: 12px;
          padding-top: 4px;
          font-size: 12px;
          z-index: 99;
        &>div {
           height: 20px;
           line-height: 20px;
         }
        }
        .tip-show-two {
          width: 376px;
          height: 83px;
          position: absolute;
          top: 208px;
          right: 60px;
          background: url(../assets/img/modifyMail/no-find-mail-message.png) no-repeat;
          background-size: cover;
          text-indent: 12px;
          padding-top: 4px;
          font-size: 12px;
          z-index: 99;
        &>div {
           height: 20px;
           line-height: 20px;
         }
        }
        .tip-show-three {
          width: 376px;
          height: 83px;
          position: absolute;
          top: 230px;
          right: 10px;
          background: url(../assets/img/modifyMail/no-find-mail-message.png) no-repeat;
          background-size: cover;
          text-indent: 12px;
          padding-top: 4px;
          font-size: 12px;
          z-index: 99;
        &>div {
           height: 20px;
           line-height: 20px;
         }
        }
        .modify-mail-body{
          width: @fill;
          height: calc( @fill - @spacing*4);
          background-color: white;
          position: relative;
        .modify-mail-info{
          width: @spacing*35;
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
             .checkway-tip{
               font-size: 18px;/*px*/
             }
             .update-mail-checkWay{
                margin-bottom: @spacing;
                height: @spacing*3;
                padding-left: @spacing;
                line-height: @spacing*3;
                width: 100%;
                background-color: #fff;
                border: 1px solid rgba(204, 204, 204, 1);
                .update-mail-checkWay-left{
                   float: left;
                 }
                .update-mail-checkWay-right{
                   float: right;
                }
                .update-mail-checkWay-btn{
                  width: 100px;
                  height: 40px;
                  margin: 9px 20px;
                  font-size: 14px;/*px*/
                }
              }
             .step-one-input{
               width: 395px;
             }
             .step-one-sns{
               float: right;
               height: 40px;
               width:180px;
               font-size: 16px;/*px*/
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
             .no-phone-content{
               width: 580px;
               margin: 0 auto;
               padding: @spacing*2 0 0 0 ;
               font-size: 18px;/*px*/
               line-height:  @spacing*1.5;
               text-align: center;
               .tip-weight{
                 font-weight: bold;
                 color: #333333
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
            .step-two{
              .verification-code{
                 .el-input{
                   width: 250px;
                 }
                .step-two-input-verification-code{
                  width: @spacing*18.2;
                  font-size: 30px;/*px*/
                }
                .step-two-sns{
                  float: right;
                  height: 40px;
                  width:180px;
                  font-size: 16px;/*px*/
                }
              }
              .step-two-tip{
                margin-left: 150px;
                font-size: 16px;/*px*/;
                line-height: 35px;
                color:#1f8dfc;
              }
              .step-two-btn-content{
                text-align: center;
                margin-top: 10px;
                .el-button{
                  width: @spacing*6;
                  height: @spacing*2;
                  font-size: 18px;/*px*/
                }
              }
              .step-two-text{
                height: 40px;
                line-height: 40px;
                font-size: 18px;/*px*/
              }
             }
        .step-three{
          width: 100%;
          margin: 0 auto;
          .step-three-success{
          text-align: center;
          &>div{
            width: 370px;
            display: inline-block;
            line-height: 60px;
            &>img{
              width: 60px;
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
          .step-three-success-update{
            text-align: center;
            &>div{
              width: 350px;
              display: inline-block;
              line-height: 60px;
              &>img{
                width:60px;
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
          margin: 0 0 0 250px;
          height: @spacing*2.5;
          line-height: @spacing*2.5;
          color: #333333;
          font-size: 18px;/*px*/
          font-weight: 400;
          font-style: normal;
          white-space: nowrap;
          .step-three-user-title{
            display: inline-block;
            width:  @spacing*4;
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
        }
        .btn-contnet{
          position: absolute;
          bottom: 36px;
          left: 540px;
        .el-button{
          width: @spacing*5;
        }
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
        .modify-mail-body.no-bg{
          background-color: transparent !important;
        }
       }
     }
  }
</style>
