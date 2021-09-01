<template>
  <div class="stateTree" v-show="showOff">
    <div class="stateTreeTitle">{{ msg }}</div>
    <div class="treeBox">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="id"
      >
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { Tree } from 'element-ui'

document.oncontextmenu = function () {
  return false
}

@Component({
  name: 'stateTree',
  components: {
    [Tree.name]: Tree
  }
})
export default class treeState extends Vue {
  msg:string = 'This is a state tree ~ Welcome !'
  showOff:boolean = false
  currentMainKey:any = null
  treeData:any[] = []
  defaultProps:any = {
    children: 'children',
    label: 'label'
  }
  @State(state => state)
  stateAll:any;
  mounted () {
    this.register(0, 'I')
  }
  get globalState () :any {
    return this.stateAll
  }
  @Watch('globalState', { deep: true })
  globalStateChanged (nV: string, oV: string): void {
    this.getTree()
  }
  getTree ():void {
    let self = this
    self.treeData = []
    for (let key in self.$store.state) {
      interface treeNodeInterface {
        label: string,
        children: any[]
      }
      let treeNode:treeNodeInterface = {
        label: key,
        children: []
      }
      for (let keyChild in self.$store.state[key]) {
        let treeNodeChild:any = {
          label: keyChild + ': ' + (self.$store.state[key])[keyChild],
          children: []
        }
        treeNode.children.push(treeNodeChild)
      }
      self.treeData.push(treeNode)
    }
  }
  register (tag:number, val:string):void {
    let MainKey:number
    const _self:any = this

    switch (tag) {
      case 0:
        // Ctrl eslint-disable-line
        MainKey = 17
        break
      case 1:
        // Shift eslint-disable-line
        MainKey = 16
        break
      case 2:
        // Alt eslint-disable-line
        MainKey = 18
        break
    }

    document.onkeyup = e => {
      console.log(e)
      _self.currentMainKey = null
    }

    document.onkeydown = event => {
      /* let win: any = window || {}
      let currKey = 0
      let evt = event || window.event
      currKey = evt.keyCode || evt.which || evt.charCode
      if (currKey === 123) {
        win.event.cancelBubble = true
        win.event.returnValue = false
      } */
      let keyCode = event.keyCode
      let keyValue = String.fromCharCode(event.keyCode)

      if (_self.currentMainKey != null) {
        if (keyValue === val) {
          _self.currentMainKey = null
          _self.showOff = !_self.showOff
        }
      }
      if (keyCode === MainKey) {
        _self.currentMainKey = keyCode
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less">
  @fill: 100%;
  @spacing: 20px;
  @treeC: white;
  @treeBackground: black;
  @treeL: yellow;
  @treeBackBlack: black;
  .treeBox{
    height: 90%;
    overflow-y: auto;
    .el-tree-node{
      .el-tree-node__content{
        &:hover{
          background-color: @treeBackBlack;
        }
        &:focus{
          background-color: @treeBackBlack;
        }
      }
      &:focus>.el-tree-node__content {
        background-color:@treeBackBlack;
      }
    }
  }
  .treeContent(@treeW: 300px, @treeH: 100%) {
    width: @treeW;
    height: @treeH;
    position: absolute;
    right: 0;
    top: 0;
    color: @treeC;
    background-color: @treeBackground;
    text-align: left;
    overflow-y: auto;
    z-index: 999;
  }
  .treeBox{
    .el-tree {
      position: relative;
      cursor: default;
      background: @treeBackground ;
      color: @treeL;
    }
  }
  .stateTree {
    .treeContent(auto, @fill);
    &>div {
      margin-left: @spacing - 5;
    }
    .stateTreeTitle {
      margin-top: @spacing + 5;
      margin-bottom: @spacing + 5;
      color: mediumpurple;
    }
    .stateVal {
      margin-left: @spacing + 5;
    }
    span {
      color: @treeL;
    }
  }
</style>
