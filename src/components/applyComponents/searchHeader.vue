<template>
  <div class="search-header-container">
    <div class="search-logo"></div>
    <div class="search-main">
      <div class="search-top">
        <el-input placeholder="请输入搜索内容" class="search-input" v-model="searchInput"></el-input>
        <el-button class="search-btn" @click="searchApply">
          <i class="el-icon-search"></i>
          搜索
        </el-button>
      </div>
      <div class="search-keywords" v-show="keywords.length">
        热门关键字：
        <span v-for="(item, index) in keywords"
          :key="'keyword' + index"
          :class="index === activeKeyId ? 'keyword actived':'keyword'"
          @click="selectKeyword(index, item)">{{item}}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import { Dialog, Button, Input } from 'element-ui'
import { mixins } from 'vue-class-component'

@Component({
  name: 'SearchHeader',
  components: {
    [Button.name]: Button,
    [Input.name]: Input
  }
})
export default class newApply extends Vue {
  // @Prop({ default: '' }) searchInput! : string
  // @Emit('searchApply')
  // searchApply (name:any) {}
  @Emit('search')
  search (name:any) {}
  keywords: any[] = []
  activeKeyId: number = -1
  searchInput: any = ''
  mounted () {
    this.getKeyword()
  }
  initData (data: any) {
    this.activeKeyId = -1
    if (data) {
      this.searchInput = data
      this.keywords.length && this.keywords.map((item, index) => {
        if (item === data) {
          this.activeKeyId = index
        }
      })
    }
  }
  searchApply () {
    this.initData(this.searchInput)
    this.search(this.searchInput)
  }
  selectKeyword (id:any, name:any) {
    if (name === this.$route.query.queryContent) {
      this.activeKeyId = -1
      this.searchInput = ''
    } else {
      this.activeKeyId = id
      this.searchInput = name
    }
    this.search(this.searchInput)
  }
  getKeyword (): void {
    fetch(apiConfig('application/getKeywords'))
      .then((res:any) => {
        if (res.code === 200) {
          this.keywords = res.data || []
          if (this.$route.query && this.$route.query.queryContent) {
            this.initData(this.$route.query.queryContent)
          }
        }
      })
  }
}
</script>
<style scoped lang="less" type="text/less">
  @deep: ~'>>>';
   .search-header-container{
      width: 100%;
      height: 136px;
      background: url(../../assets/img/newApply/applySearchBg.png) no-repeat;
      background-size: 100% 136px;
      display: flex;
      flex-direction: row;
      padding: 30px;
      box-sizing: border-box;
      .search-logo {
        width: 219px;
        height: 41px;
        background: url(../../assets/img/newApply/applyLogo.png) no-repeat;
        background-size: 219px 41px;
        margin-top: 4px;
      }
      .search-main{
        margin-left: 48px;
        flex: 1;
        max-width: calc(100% - 275px);
        .search-top{
          display: flex;
          flex-direction: row;
        }
        .search-input {
          width: calc(100% - 126px);
          height: 48px;
          border: solid 1px #1e8dfc;
          border-radius: 24px 0 0 24px;
          font-size: 16px;
          color: #333;
          overflow: hidden;
        }
        .search-input @{deep} .el-input__inner {
          height: 48px;
          border:none;
          // border-radius: 24px 0 0 24px;
        }
        .search-btn {
          width: 126px;
          height: 50px;
          border: none;
          background-color: #1e8dfc;
          color:white;
          border-radius: 0px 24px 24px 0;
          font-size: 18px;
          cursor: pointer;
        }
        .search-keywords{
          padding: 11px 0 0 20px;
          font-size: 14px;
          line-height: 16px;
          max-width: calc(100% - 146px);
          color: #667380;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .keyword{
            padding-right: 20px;
            cursor: pointer;
          }
          .actived{
            color: #1e8dfc
          }
        }
      }
    }
</style>
