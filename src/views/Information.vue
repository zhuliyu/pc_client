<template>
  <div class="user-infomation-main">
    <div class="infomation-content-tip" v-if="!userInfomationCompletely" v-cloak>
      <div>
        <i class="el-icon-warning"></i>您的个人信息尚未完善，请完善以下信息，方便我们更好的为您服务
      </div>
    </div>
    <div :class="userInfomationCompletely ? 'infomation-content-body user-infomation-completely' : 'infomation-content-body'">
      <div>
        <div class="infomation-content-body-title">
          <el-row>
            <el-col :span="12">
              <span class="split-line"></span><span class="infomation-content-body-title-text">个人资料</span>
            </el-col>
            <el-col :span="12" class="infomation-edit-btn">
              <el-button type="primary" size="small" @click="changeModel('edit', false)" v-show="showUserInfo">编辑</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="infomation-content-body-main">
          <el-row  :class="userInfomationCompletely ? 'content-body-box body-box-no-show-tip' : 'content-body-box body-box-show-tip'">
            <el-col :span="21">
              <div class="showUserInfoContent">
                <div class="basic-info">
                  <el-form :model="userInfo" ref="userInfo" :class="showUserInfo ? 'basic-info-box' : 'basic-info-edit'" label-width="0px" :rules="editBasicRules">
                    <el-form-item :class="showUserInfo ? '' : 'basic-info-edit-title-item'">
                      <div class="basic-info-title">基本信息</div>
                    </el-form-item>
                    <el-form-item prop="username" :class="showUserInfo ? '' : 'basic-info-edit-item'">
                      <el-row class="show-value" v-show="showUserInfo">
                        <span class="basic-info-item-label">用户名：</span>
                        <span class="basic-info-item-text">{{userInfo.username === '' ?  '尚未设置' : userInfo.username}}</span>
                      </el-row>
                      <el-row class="edit-value" v-show="!showUserInfo">
                        <el-col :span="24">
                          <span class="basic-info-item-label edit-value-line-height">用户名：</span>
                           <el-input class="eidt-value-input elLength" v-model.trim="userInfo.username" placeholder="请输入您的用户名" clearable></el-input>
                        </el-col>
                      </el-row>
                      <el-row class="edit-value basic-info-item-tip" v-show="!showUserInfo">
                        <span class="edit-tip">（注意：用户名一个自然年内仅能修改3次）</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="realName" :class="showUserInfo ? '' : 'basic-info-edit-item'">
                      <el-row class="show-value" v-show="showUserInfo">
                        <span class="basic-info-item-label">姓名：</span>
                        <span class="basic-info-item-text">{{userInfo.realName === '' ? '尚未设置' : userInfo.realName}}</span>
                      </el-row>
                      <el-row class="edit-value" v-show="!showUserInfo">
                        <el-col :span="24">
                          <span class="basic-info-item-label edit-value-line-height">姓名：</span>
                          <el-input class="eidt-value-input elLength" :disabled="(userInfo.authorizationStatus === 0) || (userInfo.authorizationStatus === 1)" v-model.trim="userInfo.realName" placeholder="请输入您的真实姓名" clearable></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="telephone" :class="showUserInfo ? '' : 'basic-info-edit-item'">
                      <el-row class="show-value" v-show="showUserInfo">
                        <span class="basic-info-item-label">手机号码：</span>
                        <span class="basic-info-item-text">{{userInfo.telephone === '' ? '尚未绑定' : userInfo.telephone}}</span>
                      </el-row>
                      <el-row class="edit-value" v-show="!showUserInfo">
                        <el-col v-if="phone !== ''">
                          <span class="basic-info-item-label">手机号码：</span>
                          <span class="elLength">
                            <span  class="dui-qi">{{userInfo.telephone}}</span>
                            <el-button size="small" @click="userModifyPhone('update')">修改</el-button>
                          </span>
                        </el-col>
                        <el-col v-else>
                          <span class="basic-info-item-label">手机号码：</span>
                          <span class="elLength">
                            <span class="dui-qi">{{userInfo.telephone === '' ? '尚未绑定' : userInfo.telephone}}</span>
                            <el-button size="small" @click="userModifyPhone('add')">绑定</el-button>
                          </span>
                        </el-col>
                      </el-row>
                      <el-row class="edit-value basic-info-item-tip" v-show="!showUserInfo">
                        <span class="edit-tip" v-show="userInfo.telephone !== ''">（注意：手机号码也能用于平台登录及平台身份验证等。手机号码修改后，原手机号不再具有这些功能）</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="mail" :class="showUserInfo ? '' : 'basic-info-edit-title-item'">
                      <el-row class="show-value" v-show="showUserInfo">
                            <span class="basic-info-item-label">邮箱：</span>
                        <span class="basic-info-item-fh"><el-row><el-col></el-col></el-row></span>
                        <span class="basic-info-item-text">{{userInfo.mail === '' ? '尚未绑定' : userInfo.showMail}}</span>
                      </el-row>
                      <el-row class="edit-value" v-show="!showUserInfo">
                        <el-col :span="24">
                          <span class="basic-info-item-label">邮箱：</span>
                          <span class="elLength">
                              <span class="dui-qi">{{userInfo.mail === '' ? '尚未绑定' : userInfo.showMail}}</span>
                              <el-button v-if="userInfo.mail === ''" size="small" @click="userModifyMail('add')">绑定</el-button>
                              <el-button v-else size="small" @click="userModifyMail('update')">修改</el-button>
                          </span>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="password" :class="showUserInfo ? '' : 'basic-info-edit-title-item'">
                      <el-row class="show-value" v-show="showUserInfo">
                        <span class="basic-info-item-label">密码：</span>
                        <span class="basic-info-item-text" v-if="userInfo.password !== ''" >************</span>
                        <span v-else>
                          <span class="basic-info-item-text">尚未设置</span>
                        </span>
                      </el-row>
                      <el-row class="edit-value" v-show="!showUserInfo">
                        <div v-if="userInfo.password !== ''">
                          <span class="basic-info-item-label">密码：</span>
                          <span class="elLength">
                            <span class="dui-qi">************</span>
                            <el-button size="small" @click="userModifyPassword('update')">修改</el-button>
                          </span>
                        </div>
                        <div v-else>
                          <span class="basic-info-item-label">密码：</span>
                          <span class="elLength">
                            <span class="dui-qi">尚未设置</span>
                            <el-button size="small" @click="userModifyPassword('add')">设置</el-button>
                          </span>
                        </div>
                      </el-row>
                    </el-form-item>
                    <!-- <el-form-item label="认证信息：" prop="authorizationStatus">
                       <el-row class="show-value" v-show="showUserInfo"><span class="authorization-status">{{userInfo.authorizationStatusLable}}</span></el-row>
                       <el-row class="edit-value" v-show="!showUserInfo">
                         <span class="authorization-status dui-qi">{{userInfo.authorizationStatusLable}}</span>
                         <el-button v-if="userInfo.authorizationStatus === -1" size="small" @click="goAuthentication">实名认证</el-button>
                         <el-button v-else size="small" @click="goAuthentication()">查看</el-button>
                       </el-row>
                     </el-form-item>-->
                    <el-form-item  v-show="showUserInfo">
                      <div class="basic-info-title">详细信息</div>
                    </el-form-item>
                    <el-form-item prop="companyName" v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">企业：</span>
                        <span class="basic-info-item-text">{{userInfo.companyName === '' ?  '尚未设置' : userInfo.companyName}}</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="department" v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">部门：</span>
                        <span class="basic-info-item-text">{{userInfo.department === '' ?  '尚未设置' : userInfo.department}}</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item prop="position" v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">职位：</span>
                        <span class="basic-info-item-text">{{userInfo.positionLable === '' ?  '尚未设置' : userInfo.positionLable}}</span>
                      </el-row>
                    </el-form-item>
                    <el-row class="show-value" v-show="showUserInfo">
                      <el-form-item>
                        <span class="basic-info-item-label">所属行业：</span>
                        <span class="basic-info-item-text">
                          {{userInfo.industryType === '' ? '尚未设置' : userInfo.industryType}}
                        </span>
                      </el-form-item>
                    </el-row>
                    <el-form-item v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">软件技能：</span>
                        <span class="basic-info-item-text">{{userInfo.softAbilityLable === '' ? '尚未设置' : userInfo.softAbilityLable}}</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">服务能力：</span>
                        <span class="basic-info-item-text">{{userInfo.serverAbilityLable === '' ? '尚未设置' : userInfo.serverAbilityLable}}</span>
                      </el-row>
                    </el-form-item>
      <!--              <el-form-item  v-show="showUserInfo">
                      <div class="basic-info-title">联系信息</div>
                    </el-form-item>
                    <el-form-item v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">所在地区：</span>
                        <span class="basic-info-item-text">{{userInfo.area === '' ? '尚未设置' : userInfo.area}}</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">详细地址：</span>
                        <span class="basic-info-item-text">{{userInfo.detailAddr === '' ? '尚未设置' : userInfo.detailAddr}}</span>
                      </el-row>
                    </el-form-item>
                    <el-form-item v-show="showUserInfo">
                      <el-row class="show-value">
                        <span class="basic-info-item-label">邮政编码：</span>
                        <span class="basic-info-item-text">{{userInfo.postalCode === '' ? '尚未设置' : userInfo.postalCode}}</span>
                      </el-row>
                    </el-form-item>-->
                  </el-form>
                </div>
              </div>
            </el-col>
            <el-col :span="3" align="right">
              <div v-show="showUserInfo"><img style="width:100px;height:100px;margin-top: 30px;border-radius: 50px;" :src="userInfo.imageUrl"/></div>
              <div  @mouseenter="showShadeBox()" @mouseleave="hideShadeBox()" v-show="!showUserInfo" style="position: relative">
                <img style="width:100px;height:100px;margin-top: 30px;border-radius: 50px;" :src="userInfo.imageUrl"/>
                <div id="imgShade" class="imgShade" style="display: none" @click="showEditHeadPortraitDialog()">
                  <span style="position: absolute; top: 45px;width: 100px;right:0px;">编辑头像</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <!--<el-row class="return-btn-content" v-show="showUserInfo" style="display: none;">
            &lt;!&ndash;<el-button @click="returnBack()">返回</el-button>&ndash;&gt;
            <el-button @click="openExitDialog()">退出登录</el-button>
          </el-row>-->
          <el-row v-show="!showUserInfo">
            <div class="return-btn-content">
              <el-button class="edit-cancel-button" type="default" @click="changeModel('show', true)">取消</el-button>
              <el-button type="primary" @click="changeModel('submit', true)" :disabled="submitBtnClick">保存</el-button>
            </div>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
      title="编辑头像"
      :visible.sync="showHeadPortraitDialog"
      class="editHeadPortrait"
      width="700px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span slot="footer" class="dialog-footer">
        <div id="demo">
          <div class="container" v-show="panel">
             <div style="margin-top:20px;margin-bottom: 10px;">
               <span style="font-size:12px;">头像：仅支持JPG、GIF、PNG图片文件，且文件小于2M</span>
               <div id="information-input-file">
                 <span id="information-input-text">选择文件</span>
                 <input style="padding: 10px;display: block;position: absolute;top: 0;left: 0;width: 70px;height: 20px;opacity: 0;-moz-opacity: 0; filter: alpha(opacity=0);" type="file" id="change" accept="image" @change="change">
               </div>
               <!-- <label for="change"></label>-->
            </div>
            <div style="width: 400px;height: 300px;background-color: #00000024;">
              <img id="image" :src="url" alt="Picture">
            </div>
            <div style="padding: 20px 0">
              <el-button type="primary" @click="submitHeadPicture()" :disabled="submitHeadPicBtnClick">保存</el-button>
               <el-button type="primary" @click="cancleHeadPicture()" >取消</el-button>
            </div>
          </div>
          <div style="padding: 60px 20px 0 40px;width: 200px;float: left;">
            <div style="text-align: left"><span>显示结果</span></div>
            <div style="text-align: left;font-size: 12px;padding: 15px 0;"><span>请确认当前的显示效果是否清晰</span></div>
            <div class="show">
              <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
            </div>
            <div style="text-align: left;padding: 16px 0 20px 28px;font-size: 12px;"><span>100x100</span></div>
          </div>
        </div>
        <!--<el-button @click="showHeadPortraitDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, put, postFile, post } from '@/utils/api/Interfaces'
import typeDefine from '../assets/js/plugins/typeDefine'
import base64encode from '@/assets/js/base64New'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import checkurl from '../assets/js/checkUrl'
import { State, Action } from 'vuex-class'
import Cropper from 'cropperjs'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'
import {
  Button,
  Form,
  FormItem,
  Input,
  Dialog,
  Row,
  Col
} from 'element-ui'
interface userInfoInterface {
  type: string,
  area: string,
  password: string,
  username: string,
  realName: string,
  telephone: string,
  mail: string,
  showMail: string,
  authorizationStatus: number,
  companyName: string,
  companyNameFlag: number,
  department: string,
  positionLable: string,
  industryType: string,
  softAbilityLable: string,
  serverAbilityLable: string,
  imageUrl: string,
  detailAddr: string,
  postalCode: any
}
interface editBasicRulesInterface {
  username: any,
  realName: any
}
interface MyWindow extends Window {
  createObjectURL(file:any): void;
  webkitURL: any
}

declare var window: MyWindow
@Component({
  name: 'Information',
  components: {
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Dialog.name]: Dialog,
    [Row.name]: Row,
    [Col.name]: Col
  }
})

export default class Information extends mixins(getUserInfo) {
  list: any = [];
  theme: string = '#f39800';
  userInfomationCompletely: boolean = true;
  showUserInfo: boolean = true;
  userInfo:userInfoInterface = {
    type: '',
    area: '',
    password: '',
    username: '',
    realName: '',
    telephone: '',
    mail: '',
    showMail: '',
    authorizationStatus: -1,
    companyName: '',
    companyNameFlag: 0,
    department: '',
    positionLable: '',
    industryType: '',
    softAbilityLable: '',
    serverAbilityLable: '',
    imageUrl: '',
    detailAddr: '',
    postalCode: ''
  };
  editBasicRules: editBasicRulesInterface = {
    username: [{ validator: (rule:any, value:string, callback:any) => {
      if (!value) {
        return callback(new Error('用户名不可为空'))
      } else {
        if (!(/^[\u4e00-\u9fa50-9A-Za-z\.@]+$/.test(value))) {
          callback(new Error('长度2~20字符，数字、汉字、英文字母（大小写皆可）、@和.组成'))
        } else if ((value.length < 2) || (value.length > 20)) {
          callback(new Error('长度2~20字符，数字、汉字、英文字母（大小写皆可）、@和.组成'))
        } else {
          callback()
        }
      }
    },
    trigger: 'blur' }],
    realName: [{ validator: (rule:any, value:string, callback:any) => {
      if (!value) {
        callback()
      } else {
        checkNumberAndEmail('nameCheck', value, (checkResult:boolean) => {
          if (!checkResult) {
            return callback(new Error('姓名不正确，长度2到20个汉字组成，可包含圆点·'))
          } else {
            callback()
          }
        })
      }
    },
    trigger: 'blur' }]
  };
  phone: string = '';
  userName: string = '';
  originUserInfoData: any = {};
  showHeadPortraitDialog: boolean = false;
  panel: boolean = true;
  url: any = '';
  headerImage: string = '';
  cropper: any = '';
  croppable: boolean = false;
  headFile: string = '';
  picValue: string = '';
  showSaveInfoDialog: boolean = false;
  submitBtnClick: boolean = false;
  submitHeadPicBtnClick: boolean = false;
  cropInterval: any = '';
  @Action('cancelUserInformation', { namespace: 'information' })
  cancelUserInformation: any;
  @Action('setUserInformation', { namespace: 'information' })
  setUserInformation: any;
  @Action('setHeadImgUrl', { namespace: 'login' })
  setHeadImgUrl: any;
  @Action('setUserName', { namespace: 'login' })
  setUserName: any;
  @Action('clearToken', { namespace: 'login' })
  clearToken: any;

  /*  @Watch('$store.state.login.headImgUrl')
  getHeadImgUrl (newVal: string) {
    this.userInfo.imageUrl = this.$store.state.login.headImgUrl ? checkurl(this.$store.state.login.headImgUrl) : '../../../../../yyzx_pc/img/company/head.jpg'
  } */
  private created () {
    let self = this
    // 初始化字典表
    if ((self.$store.state.information.type) && (self.$store.state.information.type === 'edit')) {
      let reUserdata = JSON.parse(JSON.stringify(self.$store.state.information))
      self.phone = reUserdata.phone
      delete reUserdata.type
      delete reUserdata.phone
      self.userInfo = {
        type: '',
        area: '',
        password: '',
        username: '',
        realName: '',
        telephone: '',
        mail: '',
        showMail: '',
        authorizationStatus: -1,
        companyName: '',
        companyNameFlag: 0,
        department: '',
        positionLable: '',
        industryType: '',
        softAbilityLable: '',
        serverAbilityLable: '',
        imageUrl: '',
        detailAddr: '',
        postalCode: ''
      }
      self.userInfo = reUserdata
      self.cancelUserInformation()
      self.changeModel('returnEdit', false, () => {
      })
    } else {
      self.cancelUserInformation()
      self.changeModel('show', true, () => {
      })
    }
    self.$emit('getNavigation', { menuName: '我的账号', menuChildName: ['个人资料'] })
    // self.getUserInfoData();
  }
  private mounted () {
    let self = this
    let image:any = document.getElementById('image')
    self.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      background: false,
      zoomable: false,
      ready: function () {
        self.croppable = true
        self.crop()
      }
    })
  }
  private destroyed () {
    if (this.cropInterval) {
      window.clearInterval(this.cropInterval)
    }
  }
  getUserInfoData (callback:any) {
    let self = this
    fetch(apiConfig('userInfomation/showPersonalBasicInfo'), { userId: self.userId })
      .then((res:any) => {
        if (res.code) {
          if (res.code === 200) {
            if (JSON.stringify(res.data.basicInfo) !== '{}') {
              self.userInfo.username = res.data.basicInfo.username ? res.data.basicInfo.username : ''
              self.originUserInfoData.username = res.data.basicInfo.username ? res.data.basicInfo.username : ''
              self.userInfo.realName = res.data.basicInfo.realName ? res.data.basicInfo.realName : ''
              self.originUserInfoData.realName = res.data.basicInfo.realName ? res.data.basicInfo.realName : ''
              self.userInfo.telephone = res.data.basicInfo.telephone ? res.data.basicInfo.telephone : ''
              self.userInfo.mail = res.data.basicInfo.mail ? res.data.basicInfo.mail : ''
              let mailArr = self.userInfo.mail.split('@')
              self.userInfo.showMail = mailArr[0].substring(0, 3) + '******@' + mailArr[1]
              self.userInfo.password = res.data.basicInfo.password ? res.data.basicInfo.password : ''
              self.userInfo.authorizationStatus = res.data.basicInfo.authorizationStatus
              self.phone = JSON.parse(JSON.stringify(res.data.basicInfo.telephone))
              self.userInfo.imageUrl = res.data.basicInfo.headPic ? checkurl(res.data.basicInfo.headPic) : '../../../../img/company/head.jpg'
              if (self.userInfo.telephone !== '') {
                self.userInfo.telephone = self.userInfo.telephone.substring(0, 3) + '****' + self.userInfo.telephone.substring(7, 11)
              }
            }
            if (JSON.stringify(res.data.workInfo) !== '{}') {
              self.userInfo.companyName = res.data.workInfo.companyName
              self.userInfo.companyNameFlag = res.data.workInfo.companyNameFlag
              self.userInfo.department = res.data.workInfo.department
              self.userInfo.positionLable = res.data.workInfo.positionName
              self.userInfo.industryType = res.data.workInfo.industryTypeName[1] === '' ? res.data.workInfo.industryTypeName[0] : res.data.workInfo.industryTypeName.join('-')
              self.userInfo.softAbilityLable = res.data.workInfo.abilitySoftName.join(',')
              self.userInfo.serverAbilityLable = res.data.workInfo.abilityServiceName.join(',')
            }
            if (JSON.stringify(res.data.linkInfo) !== '{}') {
              self.userInfo.detailAddr = res.data.linkInfo.detailAddr ? res.data.linkInfo.detailAddr : ''
              self.userInfo.postalCode = res.data.linkInfo.postalCode ? res.data.linkInfo.postalCode : ''
              if ((res.data.linkInfo.provinceName !== '') && (res.data.linkInfo.cityName !== '') && (res.data.linkInfo.countyName !== '')) {
                self.userInfo.area = res.data.linkInfo.provinceName + '-' + res.data.linkInfo.cityName + '-' + res.data.linkInfo.countyName
              } else {
                self.userInfo.area = ''
              }
            }
            if ((self.userInfo.username !== '') && (self.userInfo.realName !== '') && (self.userInfo.telephone !== '') && (self.userInfo.mail !== '') && (self.userInfo.password !== '')) {
              self.userInfomationCompletely = true
            } else {
              self.userInfomationCompletely = false
            }
            if (callback) {
              callback()
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        } else {
          self.$message({
            message: '请求个人基本信息数据功能异常，请稍后再试',
            type: 'error'
          })
        }
      })
  }
  userModifyPhone (type:string):void {
    let self = this
    let information = JSON.parse(JSON.stringify(self.userInfo))
    information.type = 'edit'
    information.phone = self.phone
    self.setUserInformation(information)
    self.$router.push({
      path: '/information/userModifyPhone',
      query: {
        phone: encodeURIComponent(base64encode(JSON.stringify({
          telephone: self.phone,
          type: type
        })))
      }
    })
  }
  userModifyPassword (type:string):void {
    let self = this
    let information = JSON.parse(JSON.stringify(self.userInfo))
    information.type = 'edit'
    information.phone = self.phone
    self.setUserInformation(information)
    self.$router.push({
      path: '/information/userModifyPassword',
      query: {
        phone: encodeURIComponent(base64encode(JSON.stringify({
          telephone: self.phone,
          type: type
        })))
      }
    })
  }
  changeModel (type:string, modelBool:boolean, callback:any):void {
    let self = this
    if ((type === 'show') || (type === 'edit')) {
      self.getUserInfoData(() => {
        (this.$refs['userInfo'] as HTMLFormElement).clearValidate(['username', 'realName'])
        self.showUserInfo = modelBool
      })
    } else if (type === 'returnEdit') {
      self.showUserInfo = modelBool
      if (callback) {
        callback()
      }
    } else {
      self.submitBtnClick = true
      window.setTimeout(() => {
        self.submitBtnClick = false
      }, 2000);
      (self.$refs['userInfo'] as HTMLFormElement).validate((valid:any) => {
        if (valid) {
          let editData = {
            userId: self.userId,
            username: self.userInfo.username,
            realName: self.userInfo.realName
          }
          put(apiConfig('userInfomation/editPersonalBasicInfo'), editData)
            .then((res:any) => {
              if (res.code) {
                if (res.code === 200) {
                  self.setUserName(self.userInfo.username)
                  self.getUserInfoData(() => {
                    self.showUserInfo = modelBool
                  })
                  self.$message({
                    message: res.msg,
                    type: 'success'
                  })
                } else {
                  self.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              } else {
                self.$message({
                  message: '请求编辑个人基本资料功能异常，请稍后再试',
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
  userModifyMail (type:string) {
    let self = this
    let information = JSON.parse(JSON.stringify(self.userInfo))
    information.type = 'edit'
    information.phone = self.phone
    self.setUserInformation(information)
    self.$router.push({
      path: '/information/userModifyMail',
      query: {
        phone: encodeURIComponent(base64encode(JSON.stringify({
          telephone: self.phone,
          type: type,
          mail: type === 'update' ? self.userInfo.mail : ''
        })))
      }
    })
  }
  submitFile (data:any, callback:any) {
    let self = this
    postFile(apiConfig('userInfomation/uploadFileCommon'), data)
      .then((res:any) => {
        if (res.code) {
          if (res.code === 200) {
            if (callback) {
              callback(res.data)
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        } else {
          self.$message({
            message: '请求上传头像功能异常，请稍后再试',
            type: 'error'
          })
        }
      })
  }
  returnBack ():void {
    let win: any = window || {}
    try {
      win.external.CloseCurrentPage()
    } catch (e) {
      console.log('错误')
    }
  }
  returnLogin ():void {
    let self = this
    self.clearToken()
    /* let win: any = window || {}
    win.external.ShowLoginPage() */
    self.$router.push({
      path: '/home'
    })
  }
  async openExitDialog ():Promise<void> {
    let status: any
    let win: any = window || {}
    try {
      status = await win.external.ShowMsgBox(1)
    } catch (e) {
      console.log('打开失败')
    } finally {
      if (status === '1') {
        this.returnLogin()
      }
    }
  }
  showEditHeadPortraitDialog () {
    let self = this
    self.url = self.userInfo.imageUrl
    self.headerImage = self.userInfo.imageUrl
    self.showHeadPortraitDialog = true
    $('#image').css('width', '75%')
    self.$nextTick(() => {
      if (self.cropper) {
        self.cropper.replace(self.url)
      }
      self.panel = true
    })
    self.cropInterval = window.setInterval(() => {
      self.crop()
    }, 500)
  }
  getObjectURL (file:any) {
    let win:any = window || {}
    var url = null
    if (win.createObjectURL !== undefined) {
      url = win.createObjectURL(file)
    } else if (win.URL !== undefined) {
      url = win.URL.createObjectURL(file)
    } else if (win.webkitURL !== undefined) {
      url = win.webkitURL.createObjectURL(file)
    }
    return url
  }
  change (e:any) {
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    let splitArr = files[0].name.split('.')
    let type = splitArr[ splitArr.length - 1 ].toLowerCase()
    let allowType = ['jpg', 'jpeg', 'gif', 'png']
    if (!allowType.includes(type)) {
      this.$message({
        message: '文件格式不正确，仅支持jpg、gif、png格式图片',
        type: 'warning'
      })
    } else {
      this.panel = true
      this.picValue = files[0]
      this.url = this.getObjectURL(this.picValue)
      if (this.cropper) {
        this.cropper.replace(this.url)
      }
      this.panel = true
    }
  }
  crop () {
    var croppedCanvas
    var roundedCanvas
    if (!this.croppable) {
      return
    }
    croppedCanvas = this.cropper.getCroppedCanvas()
    roundedCanvas = this.getRoundedCanvas(croppedCanvas)
    this.headerImage = roundedCanvas.toDataURL()
  }
  getRoundedCanvas (sourceCanvas:any) {
    var canvas = document.createElement('canvas')
    let context:any = canvas.getContext('2d')
    var width = sourceCanvas.width
    var height = sourceCanvas.height
    canvas.width = width
    canvas.height = height
    context.imageSmoothingEnabled = true
    context.drawImage(sourceCanvas, 0, 0, width, height)
    context.globalCompositeOperation = 'destination-in'
    context.beginPath()
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    )
    context.fill()
    return canvas
  }
  dataURLtoBlob (dataurl:any) {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  submitHeadPicture () {
    let self = this
    self.submitHeadPicBtnClick = true
    window.setTimeout(() => {
      self.submitHeadPicBtnClick = false
    }, 2000)
    let data = new FormData()
    if (self.headerImage.indexOf('http') === -1) {
      data.append('fileObjs', self.dataURLtoBlob(self.headerImage), 'test.png')
      // @ts-ignore
      data.append('bucketName', this.BUCKET_NAME)
      data.append('folderName', 'headPic')
      data.append('fileNames', JSON.stringify([]))
      self.submitFile(data, (fileData:any) => {
        post(apiConfig('userInfomation/uploadHeadFile'), { userId: self.userId, url: fileData[0].newName })
          .then((res:any) => {
            if (res.code) {
              if (res.code === 200) {
                self.showHeadPortraitDialog = false
                fetch(apiConfig('userInfomation/showPersonalBasicInfo'), { userId: self.userId })
                  .then((res:any) => {
                    if (res.code) {
                      if (res.code === 200) {
                        if (JSON.stringify(res.data.basicInfo) !== '{}') {
                          self.userInfo.imageUrl = ''
                          self.userInfo.imageUrl = res.data.basicInfo.headPic ? checkurl(res.data.basicInfo.headPic) : '../../../../img/company/head.jpg'
                          self.url = res.data.basicInfo.headPic ? checkurl(res.data.basicInfo.headPic) : '../../../../img/company/head.jpg'
                          self.setHeadImgUrl(checkurl(res.data.basicInfo.headPic))
                          $('#image').css('width', '75%')
                          self.headerImage = res.data.basicInfo.headPic ? checkurl(res.data.basicInfo.headPic) : '../../../../img/company/head.jpg'
                        }
                      } else {
                        self.$message({
                          message: res.msg,
                          type: 'warning'
                        })
                      }
                    } else {
                      self.$message({
                        message: '请求个人基本信息数据功能异常，请稍后再试',
                        type: 'error'
                      })
                    }
                  })
                self.$message({
                  message: '上传头像成功',
                  type: 'success'
                })
              } else {
                self.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            } else {
              self.$message({
                message: '请求上传头像功能异常，请稍后再试',
                type: 'error'
              })
            }
          })
      })
    } else {
      self.showHeadPortraitDialog = false
      self.url = self.userInfo.imageUrl
      self.headerImage = self.userInfo.imageUrl
    }
  }
  showShadeBox () {
    $('#imgShade').css('display', 'block')
  }
  hideShadeBox () {
    $('#imgShade').css('display', 'none')
  }
  cancleHeadPicture () {
    if (this.cropInterval) {
      window.clearInterval(this.cropInterval)
    }
    this.showHeadPortraitDialog = false
    this.url = this.userInfo.imageUrl
    this.headerImage = this.userInfo.imageUrl
  }
}
</script>
<style>
  #information-input-file {
    position: relative; /* 保证子元素的定位 */
    width: 70px;
    height: 20px;
    background: #409EFF;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    margin-left: 10px;
    line-height: 20px;
  }
  #information-input-text {
    display: inline-block;
    color: white;
    font-size: 12px;
  }
  .basic-info-edit .el-form-item.is-success .el-input__inner,.basic-info-edit .el-form-item.is-success .el-input__inner:focus,.basic-info-edit .el-form-item.is-success .el-textarea__inner,.basic-info-edit  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #DCDFE6;
  }
  .select-complex .el-form-item .el-form-item__content{
    margin-left: 10px !important;
  }
  .area-content .elLengthForTwo {
    width: calc(100% - 120px) !important;
  }
  .area-content .elLengthForThree {
    margin-left: -110px !important;
  }
  .user-soft-menu, .user-server-menu{
    width: 500px;height: 400px; padding: 0 0;overflow: hidden;
  }
  .user-soft-menu .menu-title,.user-server-menu .menu-title{
    background-color: #f3f9fc;
    padding: 10px;
  }
  .user-soft-menu .menu-tree, .user-server-menu .menu-tree{
    width: 460px;
    height: 300px;
    overflow-y: auto;
    margin: 10px 20px;
    border: 1px solid #DCDFE6;
  }
  .user-soft-menu .menu-tree .el-tree, .user-server-menu .menu-tree .el-tree{
    padding: 10px;
  }
  .user-soft-menu .menu-count-oprate, .user-server-menu .menu-count-oprate{
    height: 36px;
    line-height: 25px;
    padding: 0 20px;
    font-size: 14px;
    color: #606266;
  }
  .editHeadPortrait .el-dialog{
    height: 510px
  }
  .editHeadPortrait .el-dialog__body{
    padding: 0 20px;
  }
  * {

    margin: 0;

    padding: 0;

  }
  #demo #button {

    /* position: absolute;

     right: 10px;

     top: 10px;

     width: 80px;

     height: 40px;

     border: none;

     border-radius: 5px;

     background: white;*/

  }
  #demo .show {

    width: 100px;

    height: 100px;

    overflow: hidden;

    position: relative;

    border-radius: 50%;

    border: 1px solid #d5d5d5;

  }
  #demo .picture {

    width: 100%;

    height: 100%;

    overflow: hidden;

    background-position: center center;

    background-repeat: no-repeat;

    background-size: cover;

  }
  #demo .container {
    width: 400px;
    text-align: center;
    height: 300px;
    float: left;
  }
  #demo #image {

    max-width: 100%;

  }
  .cropper-view-box,
  .cropper-face {

    border-radius: 50%;

  }
  .cropper-container {
    font-size: 0;
    line-height: 0;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    direction: ltr;
    -ms-touch-action: none;
    touch-action: none;
  }
  .cropper-container img {

    /* Avoid margin top issue (Occur only when margin-top <= -height) */

    display: block;

    min-width: 0 !important;

    max-width: none !important;

    min-height: 0 !important;

    max-height: none !important;

    width: 100%;

    height: 100%;

    image-orientation: 0deg;

  }
  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .cropper-wrap-box {
    overflow: hidden;
  }
  .cropper-drag-box {
    opacity: 0;
    background-color: #fff;
  }
  .cropper-modal {
    /* opacity: 0.5;
     background-color: #000;*/
  }
  .cropper-view-box {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);

  }
  .cropper-dashed {
    position: absolute;
    display: block;
    opacity: 0.5;
    border: 0 dashed #eee;
  }
  .cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px;
  }
  .cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px;
  }
  .cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    opacity: 0.75;
  }
  .cropper-center:before,
  .cropper-center:after {
    position: absolute;
    display: block;
    content: " ";
    background-color: #eee;
  }
  .cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px;
  }
  .cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px;
  }
  .cropper-face,
  .cropper-line,
  .cropper-point {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0.1;

  }
  .cropper-face {
    top: 0;
    left: 0;
    background-color: #fff;
  }
  .cropper-line {
    background-color: #39f;
  }
  .cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize;
  }
  .cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize;
  }
  .cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize;
  }
  .cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize;
  }
  .cropper-point {
    width: 5px;
    height: 5px;
    opacity: 0.75;
    background-color: #39f;
  }
  .cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize;
  }
  .cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
  }
  .cropper-point.point-w {

    top: 50%;

    left: -3px;

    margin-top: -3px;

    cursor: w-resize;

  }
  .cropper-point.point-s {

    bottom: -3px;

    left: 50%;

    margin-left: -3px;

    cursor: s-resize;

  }
  .cropper-point.point-ne {

    top: -3px;

    right: -3px;

    cursor: ne-resize;

  }
  .cropper-point.point-nw {

    top: -3px;

    left: -3px;

    cursor: nw-resize;

  }
  .cropper-point.point-sw {

    bottom: -3px;

    left: -3px;

    cursor: sw-resize;

  }
  .cropper-point.point-se {

    right: -3px;

    bottom: -3px;

    width: 20px;

    height: 20px;

    cursor: se-resize;

    opacity: 1;

  }
  @media (min-width: 768px) {

    .cropper-point.point-se {

      width: 15px;

      height: 15px;

    }

  }
  @media (min-width: 992px) {

    .cropper-point.point-se {

      width: 10px;

      height: 10px;

    }

  }
  @media (min-width: 1200px) {

    .cropper-point.point-se {

      width: 5px;

      height: 5px;

      opacity: 0.75;

    }

  }
  .cropper-point.point-se:before {

    position: absolute;

    right: -50%;

    bottom: -50%;

    display: block;

    width: 200%;

    height: 200%;

    content: " ";

    opacity: 0;

    background-color: #39f;

  }
  .cropper-invisible {

    opacity: 0;

  }
  .cropper-bg {

    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");

  }
  .cropper-hide {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
  }
  .cropper-hidden {
    display: none !important;
  }
  .cropper-move {
    cursor: move;
  }
  .cropper-crop {
    cursor: crosshair;
  }
  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
  .basic-info-edit .edit-value .eidt-value-input .el-input__inner{
    height: 40px;
    line-height: 40px;
  }
  /* 个人左导航栏对齐 */
  .user-main .page-content .page-content-menu .page-content-menu-text {
    margin-left: -9px;
  }
  .basic-info-edit .el-form-item.basic-info-edit-item{
    margin-bottom: 22px;
  }
  .basic-info-edit .el-form-item  .el-form-item__error{
    margin-left: 90px;
  }
  .basic-info .basic-info-box .el-form-item__content{
    line-height: 31px;
  }
</style>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
  @import '~font-awesome/css/font-awesome.css';
  @spacing: 20px;
  @fill: 100%;
  .regionSize (@regionW: 100%, @regionH: 100%) {
    width: @regionW;
    height: @regionH;
    position: relative;
  }
  .user-infomation-main {
    .regionSize();
    font-family: MicrosoftYaHei !important;
    .split-line {
      .regionSize(@spacing / 4, @spacing*1.2);
      display: inline-block;
      background-color: #1f8dfc;
      border-radius: @spacing / 10;
      top: @spacing / 5;
      margin-right: @spacing/1.2;
    }
    .infomation-content-tip {
      .regionSize(@fill, @spacing * 1.8);
      background-color: white;
      font-size: 14px;/*px*/
      line-height: @spacing * 1.8;
      &>div {
        .regionSize(calc(@fill - @spacing), @fill);
        margin-left: @spacing / 2;
        box-sizing: border-box;
        border: 1px solid #ebf2fa ;
        border-radius: @spacing / 3;
        text-indent: @spacing / 2;
        background-color: #ebf2fa;
        color: #1e8dfc;
        .el-icon-warning {
          color: #1f8dfc ;
          font-size: 20px;/*px*/
          position: relative;
          top: @spacing / 10;
          margin-right: @spacing / 2;
        }
      }
    }
    .infomation-content-body{
      .regionSize(@fill, calc(@fill - @spacing * 4.5));
      overflow: hidden;
      background-color: white;
      overflow-y: auto;
      &>div {
        .regionSize(calc(@fill - @spacing * 2), calc(@fill - @spacing));
        background-color: white;
        margin-top: @spacing;
        margin-left: @spacing;
        .infomation-content-body-title {
          .regionSize(@fill, 30px);
          //line-height: @spacing * 4;
          box-sizing: border-box;
          //border-bottom: 1px solid #d8d8d8;
          color: #333333;
          .infomation-content-body-title-text{
            font-size: 20px;/*px*/
          }
          .infomation-edit-btn{
            text-align: right;
            .el-button--small{
              border-radius: 5px;
              background: #1f8dfc;
              border: none;
              font-size: 14px;/*px*/
              width: @spacing * 3;
              height: @spacing * 1.5;
              &:hover{
                background-color: #1f8dfc;
              }
            }
          }
        }
        .infomation-content-body-main{
          height: calc(100% - 20px * 4);
          width: 100%;
          margin-top: 20px;
          border-top: 1px solid #e6ebf0;
          padding-top: 10px;
          .content-body-box{
            padding-left: 20px;
            overflow-y: auto;
            .basic-info{
              .basic-info-title{
                color: #333333;
                font-size: 18px;/*px*/
                //margin-left: -100px;
                height: @spacing*2.2;
                line-height: @spacing*2;
                font-weight: bold;
              }
              .basic-info-box{
                line-height: @spacing*1;
                color: #333333;
                font-size: 14px;
                .el-form-item{
                  margin-bottom: 0;
                }
                .show-value{
                  color: #666666;
                  line-height: 40px;
                }
                .basic-info-item-label{
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #142433;
                  width:  @spacing * 4.5;
                  display: inline-block;
                }
                .basic-info-item-fh{
                  font-size: 16px;/*px*/
                  color: #666666;
                  display: inline-block;
                }
                .basic-info-item-text{
                  font-size: 16px;/*px*/
                  color: #707e8c;
                  display: inline-block;
                }
              }
              .basic-info-edit{
                line-height: @spacing*3;
                color: #333333;
                font-size: 14px;
                .basic-info-edit-title-item{
                  margin-bottom: 5px;
                }
                .edit-value{
                  .edit-tip{
                    color: red;
                    font-size: 14px;/*px*/
                  }
                  .userNameTip{
                    margin-left: -90px;
                  }
                  .el-button {
                    background: #1f8dfc;
                    border: none;
                    color: white;
                    border-radius: 5px;
                    width: @spacing*3;
                    height: @spacing*1.5;
                    font-size: 14px;/*px*/
                    &:hover{
                      background-color: #1f8dfc;
                    }
                  }
                  .area-content{
                    display: inline-block;
                  }
                  .dui-qi{
                    min-width: calc(100% - @spacing*5);
                    display: inline-block;
                    font-size: 16px;/*px*/;
                  }
                  .eidt-value-input{
                    font-size: 16px;/*px*/
                    .el-input__inner{
                      height: @spacing*4;
                      line-height: @spacing*4;
                    }
                  }
                }
                .elLength{
                  width: calc(@fill - @spacing*40);
                  display: inline-block;
                  min-width: @spacing*25
                }
                .elLengthOne{
                  width: calc(@fill - 10px);
                }
                .elLengthFour{
                  width: calc(@fill - 230px);
                }
                .basic-info-item-label{
                  font-size: 16px;/*px*/
                  color: #666666;
                  width:  @spacing * 4.5;
                  display: inline-block;
                }
                .basic-info-item-fh{
                  font-size: 18px;/*px*/
                  color: #666666;
                  display: inline-block;
                }
                .edit-value-line-height{
                  height: @spacing*2;
                  line-height: @spacing*2;
                }
                .basic-info-item-tip{
                  margin-left: 80px;
                }
              }
              .authorization-status{
                color: #f39800;
              }
              .edit-user-info-btn{
                .el-button{
                  width: @spacing*7;
                  padding: 12px 0;
                }
                .edit-user-submit{
                  background: #f39800;
                  border: none;
                  color: white;
                  &:hover{
                    background-color: #ffb100f5;
                  }
                }
              }
            }
            &>div{
              &>img{
                position: relative;
                top: @spacing*2;
                right: @spacing;
              }
            }
            .imgShade{
              height: 100px;
              width: 100px;
              position: absolute;
              top: 30px;
              right: 0px;
              cursor: default;
              text-align: center;
              color: #fff;
              opacity: 0;
              font-size: 16px;
              background-color: rgba(0, 0, 0, 0.3);
              border-radius: 50px;
              -webkit-transition: opacity 0.3s;
              transition: opacity 0.3s;
              .el-icon-delete{
                margin-top: @spacing * 4.5;
                cursor: pointer;
              }
              &:hover{
                opacity: 1;
              }
            }
          }
          .body-box-no-show-tip{
            height: calc(100% - 120px);
          }
          .body-box-show-tip{
            height: calc(100% - 70px);
          }
          .return-btn-content{
            text-align: center;
            .el-button{
              width: @spacing*7;
              height: @spacing*2.5;
              font-size: 18px;/*px*/
              background: #1f8dfc;
              color: white;
            }
          }
        }
      }
    }
    .infomation-content-body.user-infomation-completely{
      height: calc(@fill) !important;
    }
  }
  .my-swipe .van-swipe-item {
    line-height: @spacing * 13;
    border-radius: @spacing;
    text-align: center;
    img {
      .regionSize(@fill, @fill);
    }
  }
</style>
