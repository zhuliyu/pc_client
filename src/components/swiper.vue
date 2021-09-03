<template>
  <div class="home">
    <div class="swiper">
      <div class="left-container">
        <div class="left-arrow" @click="handleLeft()" v-show="active !== 0"><i class="el-icon-arrow-left"/></div>
      </div>
      <div class="scroll" ref="scroll">
        <div
          v-for="(item, index) in list"
          :ref="'item' + index"
          :key="index"
          class="item"
          @click="clickItem(index)"
        >
          <div :class="['img-card', active == index ? 'active' : '']">
            <img :src="item.img" alt="" />
          </div>
          <p>{{ item.title }}</p>
        </div>
      </div>
      <div class="right-container">
        <div class="right-arrow" @click="handleRight()" v-show="active !== list.length-1"><i class="el-icon-arrow-right"/></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
@Component({
  name: 'Swiper'
})
export default class Swiper extends Vue {
  @Prop({ default: [] }) list : any
  @Emit('clickTab')
  clickTab (item:any) {}
  spacing:any = 0
  // @Prop({ default: 0 }) active : any
  active:any = 0
  timer:any = null
  mounted () {
    this.initSpacing()
    window.addEventListener('resize', () => {
      this.initSpacing()
    })
    this.timer = setInterval(() => this.interval(), 30000)
  }
  private destroyed () {
    window.removeEventListener('resize', this.initSpacing)
    clearInterval(this.timer)
    this.timer = null
  }
  interval ():void {
    if (this.active < this.list.length - 1) {
      this.handleRight()
    } else {
      this.active = 0
      let scrollRef = this.$refs.scroll as any
      scrollRef.scrollLeft = 0
      this.clickItem(this.active)
    }
  }
  initSpacing ():void {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (!clientWidth) return
    this.spacing = clientWidth * 47 / 1920
  }
  // 获取当前 active 元素
  getNowEle () {
    return (this.$refs['item' + this.active] as any)[0]
  }
  clickItem (index:any) {
    this.clickTab(index)
    this.active = index
    clearInterval(this.timer)
    this.timer = null
    this.timer = setInterval(() => this.interval(), 30000)
  }
  handleLeft () {
    if (this.active > 0) {
      // this.active--;
      this.clickItem(this.active - 1)
    }
    // 如果当前光标元素 不在页面上，调用 showLeft 挪位置
    if (!this.isleftshow(this.getNowEle())) {
      this.showLeft()
    }
  }
  handleRight () {
    if (this.active < this.list.length - 1) {
      // this.active++;
      this.clickItem(this.active + 1)
    }
    // 如果当前光标元素 不在页面上，调用 showRight 挪位置
    if (!this.isInViewPort(this.getNowEle())) {
      console.log('ssss')
      this.showRight()
    }
  }
  // 挪动元素位置，让左面的显示完全
  showLeft () {
    let ele = this.getNowEle()// 获取当前光标所在item
    let eleWidth = ele.offsetWidth // 元素自身宽度
    let parent = ele.parentElement // 父元素
    parent.scrollLeft = this.active * (eleWidth + this.spacing)
  }
  // 挪动元素位置，让右面的显示完全
  showRight () {
    let ele = this.getNowEle() // 获取当前光标所在item
    let eleWidth = ele.offsetWidth // 元素自身宽度
    let offsetLeft = ele.offsetLeft // 元素 与带有定位的父元素的左偏移
    let parent = ele.parentElement // 父元素
    let parentWidth = ele.parentElement.offsetWidth // 父元素宽度
    let left = parentWidth - (eleWidth + this.spacing) * this.active // 父元素减去前面所有元素的宽度
    if (left < eleWidth) {
      parent.scrollLeft = eleWidth - left
    }
  }
  // 判断像左滑时，左面的元素有没有完全显示
  isleftshow (ele:any) {
    let parent = ele.parentElement // 父元素
    let parentScrollLeft = parent.scrollLeft
    let eleWidth = ele.offsetWidth // 元素自身宽度
    let gaiLeft = this.active * (eleWidth + this.spacing) // 应该设置的偏移
    console.log(parentScrollLeft, gaiLeft)
    return parentScrollLeft < gaiLeft
  }
  // 判断向右滑时，右面的元素是否完全显示在页面上
  isInViewPort (ele:any) {
    let eleWidth = ele.offsetWidth // 元素自身宽度
    let parent = ele.parentElement // 父元素
    let left = ele.offsetLeft // 元素 相对于 带定位的父元素 的偏移
    let parentWidth = parent.offsetWidth // 父元素的宽度
    return left <= parentWidth - eleWidth
  }
}
</script>

<style lang="less">
.swiper {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.scroll {
  // width: calc(100% - 8.34vw);
  width: 88.7vw;
  overflow: hidden;
  font-size: 0;
  white-space: nowrap;
  margin: auto;
  position: relative;
}
.item {
  display: inline-block;
  width: 7.68vw;
  // height: 9.64vw;
  margin-right: 2.448vw;
  vertical-align: top;
  box-sizing: border-box;
}
.item:last-of-type {
    margin: 0;
}
.img-card {
  width: 7.66vw;
  height: 7.66vw;
  box-shadow: inset 0vw 0vw 0.84vw 0.09vw
  rgba(74, 198, 255, 0.3),
  inset 0vw 0vw 3.43vw 0.22vw
  rgba(74, 198, 255, 0.18);
  border-radius: 0.1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.item img {
  width: 80%;
  height: 80%;
}
.item p {
  text-align: center;
  font-size: 0.94vw;
  color: white;
  padding: 1.85vh 0 0;
  margin: 0;
}
.left-container{
  width: 2.08vw;
  height: 100%;
}
.left-arrow {
  font-size: 20px;
  text-align: center;
  width: 2.08vw;
  height: 2.08vw;
  background-color: rgba(74,198,255,0.2);
  border-radius: 0.1vw;
  color: white;
  line-height: 2.08vw;
  margin-bottom: 2vw;
  cursor: pointer;
}
.right-container{
  width: 2.08vw;
  height: 100%;
}
.right-arrow {
  font-size: 20px;
  text-align: center;
  width: 2.08vw;
  height: 2.08vw;
  background-color: rgba(74,198,255,0.2);
  border-radius: 0.1vw;
  color: white;
  line-height: 2.08vw;
  margin-bottom: 2vw;
  cursor: pointer;
}
.active {
  width: 7.55vw;
  box-shadow: inset 0vw 0vw 0.84vw 0.09vw
  rgba(74, 198, 255, 0.54),
  inset 0vw 0vw 3.43vw 0.22vw
  rgba(74, 198, 255, 0.18);
  border-radius: 0.1vw;
  border: solid 0.05vw #4ac6ff;
}
</style>
