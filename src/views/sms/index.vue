<template>
  <div class="sms-panel">
    <el-button style="text-indent: -7px;" type="primary" @click="getCode()">{{ codeInfo }}</el-button>
  </div>
</template>

<script lang="ts">
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { checkNumberAndEmail } from '@/assets/js/ruleCheck'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Button } from 'element-ui'
@Component({
  name: 'SMS',
  components: {
    [Button.name]: Button
  }
})
export default class SMS extends Vue {
  codeInfo:string = '获取短信验证码';
  codeInterval: number = 0;
  @Prop({
    type: String,
    required: false,
    default: ''
  })
  private phoneNumber !: String | undefined;
  @Prop({
    type: String,
    required: false,
    default: ''
  })
  private checkNumber !: String | undefined;
  @Prop({
    type: String,
    required: false,
    default: ''
  })
  private msgType !: String | undefined;
  /* 获取短信验证码 */
  getCode ():void {
    window.setTimeout(() => {
      checkNumberAndEmail('telephoneNumber', this.phoneNumber, (checkResult:boolean) => {
        if (!checkResult) {
          this.$message({
            message: '请输入正确的手机号码',
            type: 'warning'
          })
        } else {
          if ((this.checkNumber) && (this.checkNumber !== '')) {
            fetch(apiConfig('login/checkAccount'), { username: this.phoneNumber })
              .then((res:any) => {
                if (res.code === 200) {
                  if (this.checkNumber === 'bindPhone') {
                    this.$message({
                      message: '该手机号已被使用',
                      type: 'warning'
                    })
                  } else if (this.checkNumber === 'sameAsOldPhone') {
                    this.$message({
                      message: '新手机号不能与旧手机号相同',
                      type: 'warning'
                    })
                  } else if (this.checkNumber === 'sameOldEmail') {
                    this.$message({
                      message: '该邮箱已被使用',
                      type: 'warning'
                    })
                  } else if (this.checkNumber === 'login') {
                    this.msgContinue()
                  }
                } else {
                  if (this.checkNumber === 'bindPhone') {
                    this.msgContinue()
                  } else if (this.checkNumber === 'sameAsOldPhone') {
                    this.msgContinue()
                  } else if (this.checkNumber === 'login') {
                    this.$message({
                      message: '该手机号未注册，请输入正确的手机号',
                      type: 'warning'
                    })
                  }
                }
              })
          } else {
            this.msgContinue()
          }
        }
      })
    }, 1000)
  }
  msgContinue ():void {
    if (this.codeInfo === '获取短信验证码') {
      post(apiConfig('login/message'), { phoneNum: this.phoneNumber, smsType: this.msgType })
        .then((res:any) => {
          if (res.code === 200) {
            let count = 60
            this.$emit('getUuid', res.data.smsUuid, res.data.phone)
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
  private destroyed () {
    if (this.codeInterval) {
      window.clearInterval(this.codeInterval)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  @import "./sms.less";
</style>
