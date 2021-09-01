<template>
  <div class="msg_panel">
      <div class="msg_main">
        <div class="msg_list">
            <div class="list_head">
                <div class="input_box">
                    <div class="input_icn"></div>
                    <input placeholder="搜索您想要找的内容..." v-model="value" @keyup.enter="findValue" @input="findValue">
                </div>
            </div>
            <div class="list_body">
                <div class="msg_info">
                    <div class="info_content" v-for="item in appList" :key="item.appId" @click="lookInfoList(item)">
                        <div class="info_icn">
                            <div class="info_newsTip" v-show="item.haveNewNotice"></div>
                            <img :src="item.logoUrl" >
                        </div>
                        <div class="info_txt">
                            <div class="info_title">
                                <div class="info_titleTxt">{{item.appName}}</div>
                                <div class="info_time">{{item.latestPushTime}}</div>
                            </div>
                            <div class="info_news">{{item.latestContent}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="msg_view" v-if="showInfoList">
            <div class="view_title" v-show="itemName.length > 0 ? true : false">
                <div class="title_bar"></div>
                <div class="title_txt">{{itemName}}</div>
            </div>
            <div class="view_info">
                <div class="info_data" v-for="item in infoList" :key="item.infoId">
                    <div class="data_time">{{item.noticeTime}}</div>
                    <div class="data_Txt">
                        <div class="txt_one">{{item.noticeTitle}}</div>
                        <div class="txt_two">{{item.noticeContent}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="msg_view_no_data" v-if="showNoData">
          <img src="../assets/img/order/noData.png">
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch, post, put } from '@/utils/api/Interfaces'
import { mixins } from 'vue-class-component'
import getUserInfo from '@/components/mixins/getUserInfo'

@Component({
  name: 'Messages',
  components: {}
})
export default class Messages extends mixins(getUserInfo) {
    value:string = '';
    appList:any[] = [];
    timerData:any = null;
    infoList:any[] = [];
    itemName:string = '';
    yes:any = {};
    showInfoList: boolean = false;
    showNoData: boolean = false;
    mounted () {
      this.getMsgList()
    }
    getMsgList ():void {
      let win: any = window || {}
      this.showInfoList = false
      this.showNoData = false
      if (this.userId) {
        post(apiConfig('messages/msgList'), {
          equipmentId: 1,
          appName: this.value,
          userId: this.userId
        }).then((res:any) => {
          //   this.yes = res.data.userNoticeLists
          if (res.code === 200) {
            this.appList = res.data.userNoticeLists
            win.external.SetMessageCount(res.data.totalCount)
            if (this.appList.length > 0) {
              this.showInfoList = true
              this.showNoData = false
            } else {
              this.showInfoList = false
              this.showNoData = true
            }
          } else {
            this.showInfoList = false
            this.showNoData = true
          }
        })
      } else {
        win.external.SetMessageCount(0)
      }
    }
    findValue ():void {
      if (this.value.length > 0) {
        let that = this
        clearTimeout(that.timerData as any)
        that.timerData = setTimeout(function () {
          that.getMsgList()
        }, 500)
      } else {
        this.getMsgList()
      }
    }
    lookInfoList (e:any):void {
      this.itemName = e.appName
      put(apiConfig('messages/infoView'), { appId: e.appId, userId: this.userId })
        .then((res:any) => {
          if (res.code === 200) {
            this.getMsgList()
          }
        })
      post(apiConfig('messages/infoList'), {
        equipmentId: 1,
        appId: e.appId,
        userId: this.userId
      }).then((res:any) => {
        if (res.code === 200) {
          this.infoList = res.data.appNoticesLists
        }
      })
    }
}
</script>

<style scoped lang="less" type="text/less">
  @import "../less/common.less";
    .msg_panel ::-webkit-scrollbar-track-piece{
        background-color: #e6ebf0 !important;
    }
    .msg_view ::-webkit-scrollbar-track-piece{
        background-color: #fff !important;
    }
  .msg_panel {
    .regionSize(@fill, @fill);
    background-color: #f1f1f1;
    padding-top: @spacing;
    .msg_main {
        .regionSize(calc(@fill - @spacing * 2), calc(@fill - @spacing * 2));
        margin-left: @spacing;
        border-radius: @spacing / 2;
        overflow: hidden;
        .msg_list{
            float: left;
            .regionSize(@spacing * 21, @fill);
            background-color: #e6ebf0;
            .list_head{
                .regionSize(@fill, @spacing * 4);
                background-color: #e6ebf0;
                .input_box{
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: @spacing;
                    input::-webkit-input-placeholder {
                        color: rgb(155, 161, 166);
                        font-family: '微软雅黑';
                        font-size: 14px;
                    }
                    input::-moz-placeholder {
                        /* Mozilla Firefox 19+ */
                        color: rgb(155, 161, 166);
                        font-family: '微软雅黑';
                        font-size: 14px;
                    }
                    input:-moz-placeholder {
                        /* Mozilla Firefox 4 to 18 */
                        color: rgb(155, 161, 166);
                        font-family: '微软雅黑';
                        font-size: 14px;
                    }
                    input:-ms-input-placeholder {
                        /* Internet Explorer 10-11 */
                        color: rgb(155, 161, 166);
                        font-family: '微软雅黑';
                        font-size: 14px;
                    }
                    input {
                        border: none;
                        background-color: #dce1e5;
                        height: @spacing * 1.6;
                        width: @spacing * 11.5;
                        border-radius: @spacing / 2;
                        line-height: @spacing * 1.6;
                        padding-left: @spacing * 2;
                        font-size: 14px;
                        color: #667380;
                        font-family: '微软雅黑';
                    }
                    .input_icn{
                        position: absolute;
                        top: @spacing * 1.6 / 2 - @spacing * 0.7 / 2;
                        left: @spacing / 2;
                        width: @spacing * 0.7;
                        height: @spacing * 0.7;
                        background: url(../assets/img/messages/search.png) no-repeat;
                    }
                }
            }
            .list_body{
                .regionSize(@fill, calc(@fill - @spacing * 4));
                background-color: #e6ebf0;
                overflow-x: hidden;
                overflow-y: auto;
                .msg_info{
                    .regionSize(@fill, @spacing * 3.7);
                    background-color: #e6ebf0;
                    .info_content{
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;
                        width: @fill;
                        height: @fill;
                        padding: @spacing / 2;
                        .info_icn{
                            position: relative;
                            width: 50px;
                            height: 50px;
                            .info_newsTip{
                                width: @spacing / 2;
                                height: @spacing / 2;
                                position: absolute;
                                right: -@spacing / 6;
                                top: -@spacing / 6;
                                background: url(../assets/img/messages/tips.png) no-repeat;
                                background-size: 100%;
                            }
                            img{
                                border-radius: @spacing / 4;
                                width: @fill;
                                height: @fill;
                            }
                        }
                        .info_txt{
                            width: calc(@fill - @spacing * 2.5);
                            height:  @spacing * 2.5;
                            padding-left:  @spacing / 2;
                            padding-right: @spacing / 2;
                            .info_title{
                                display: flex;
                                justify-content: space-between;
                                margin-top: @spacing / 6;
                                margin-bottom: @spacing / 4;
                                .info_titleTxt{
                                    max-width: @spacing * 12;
                                    font-size: 16px;
                                    color:#142433;
                                    white-space:nowrap;
                                    overflow:hidden;
                                    text-overflow:ellipsis;
                                }
                                .info_time{
                                    max-width: @spacing * 4;
                                    font-size: 14px;
                                    color: #667380;
                                    white-space:nowrap;
                                    overflow:hidden;
                                    text-overflow:ellipsis;
                                }
                            }
                            .info_news{
                                font-size: 14px;
                                color: #667380;
                                white-space:nowrap;
                                overflow:hidden;
                                text-overflow:ellipsis;
                            }
                        }
                    }
                    .info_content:hover {
                        background-color: #dce1e6;
                    }
                }
            }
        }
      .msg_view{
            float: left;
            .regionSize(calc(@fill - @spacing * 22.5), @fill);
            background-color: #fff;
            padding-left: @spacing * 1.5;
            .view_title{
                width:  @fill;
                height:  @spacing;
                margin-top: @spacing;
                margin-bottom: @spacing * 0.8;
                display: flex;
                justify-content: flex-start;
                .title_bar{
                    width: @spacing / 5;
                    height:  @fill;
                    background-color: #1e8dfc;
                }
                .title_txt{
                    margin-left: @spacing * 0.6;
                    height:  @fill;
                    line-height: @spacing;
                    font-size: 18px;
                    font-weight: 700;
                    color: #142433;
                }
            }
            .view_info{
                background-color: #fff;
                width:  @fill;
                height:  calc(@fill - @spacing * 2.8);
                overflow-x: hidden;
                overflow-y: auto;
                .info_data{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .data_time{
                        box-sizing: border-box;
                        height: @spacing * 1.4;
                        padding: @spacing * 0.3 @spacing / 2;
                        background-color: #f0f2f5;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #667380;
                        margin-bottom: @spacing * 0.8;
                    }
                    .data_Txt{
                        box-sizing: border-box;
                        width: @spacing * 22;
                        height: auto;
                        border-radius: 8px;
                        border: solid 1px #f0f2f5;
                        margin-bottom: @spacing * 1.2;
                        box-shadow: 0px 4px 6px 0px rgba(200, 211, 222, 0.2);
                        padding: @spacing;
                        overflow: hidden;
                        .txt_one{
                            width:  @fill;
                            font-size: 16px;
                            color: #142433;
                            margin-bottom: @spacing / 2;
                            word-break: break-all;
                        }
                        .txt_two{
                            width:  @fill;
                            font-size: 14px;
                            color: #667380;
                            word-break: break-all;
                        }
                    }
                }
            }
        }
      .msg_view_no_data{
        float: left;
        .regionSize(calc(@fill - @spacing * 22.5), @fill);
        background-color: #fff;
        padding-left: @spacing * 1.5;
        display:flex;
        justify-content:center;
        align-items:center;
      }
    }
  }
</style>
