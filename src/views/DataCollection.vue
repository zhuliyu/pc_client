<template>
  <div class="data-panel">
      <div class="panel-header">
          <div class="logo"></div>
          <div class="header-bg">
          <div class="title">无人柔性产线数据采集系统</div>
          <div class="title-en">(SCADA)</div>
        </div>
    </div>
    <div class="panel-center-content">
      <div class="content-left">
        <div class="normal-container">
          <div class="company">蜂巢互联</div>
          <div class="num-container">
            <div class="num-box" v-for="(item, index) in teleNum" :key="index"><div>{{item}}</div></div>
          </div>
        </div>
        <div class="normal-container process" v-show="activeEquipment.firstOrder">
          <div class="process-title">第一订单进度</div>
          <div class="process-container">
            <div v-for="(item, index) in process1" :key="index"
              :class="item.title === activeEquipment.firstOrderProgress? 'process-box ' + item.bgName + ` ${item.bgName}-light` : 'process-box ' + item.bgName">
              <div class="process-title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="normal-container process" v-show="activeEquipment.secondOrder">
          <div class="process-title">第二订单进度</div>
          <div class="process-container">
            <div v-for="(item, index) in process2" :key="index"
              :class="item.title === activeEquipment.secondOrderProgress? 'process-box ' + item.bgName + ` ${item.bgName}-light` : 'process-box ' + item.bgName">
              <div class="process-title">{{item.title}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-equipment" @click="enterDetail">
        <img :src="activeEquipment.img" alt=""
          :style="{marginLeft: activeEquipment.title === '包装工站' ? '30%' : '0' }"
          >
        <div class="shadow"></div>
      </div>
      <div class="content-right">
        <div class="normal-container-row" style="height:21.67vh" v-show="activeEquipment.equipmentRunningRate || activeEquipment.equipmentOEE">
          <div class="equipment-speed">
            <div class="gauge" ref="oee"></div>
            <div class="title">运行</div>
          </div>
          <div class="equipment-speed">
            <div class="gauge" ref="momentum"></div>
            <div class="title">设备稼动率</div>
          </div>
        </div>
        <div class="normal-container-row" style="height:19.91vh;justify-content:space-around" v-show="activeEquipment.equipmentRunInfos&&activeEquipment.equipmentRunInfos.length">
          <div class="equipment-status" v-for="(item, index) in activeEquipment.equipmentRunInfos" :key="index">
            <img :src="item.img" alt="">
            <div class="title" :style="`color:${item.color}`">{{item.title}}</div>
            <div class="result">
              <div class="image-border1"></div>
              <div class="image-border2"></div>
              {{item.result}}
            </div>
          </div>
        </div>
        <div class="normal-container-row" style="height:31.57vh" v-show="activeEquipment.storageUtilization">
          <div class="equipment-useRate">
            <div class="pie-container" ref="userate"></div>
          </div>
          <div class="equipment-userate-info">
            <div class="userate-container" style="margin-bottom: 2vw">
              <div class="num">{{activeEquipment.totalStorage}}</div>
              <div class="title">总库位数</div>
            </div>
            <div class="userate-container">
              <div class="num">{{activeEquipment.usedStorage}}</div>
              <div class="title">使用库位数</div>
            </div>
          </div>
        </div>
        <div class="normal-container" style="height:17.13vh" v-show="activeEquipment.materialInfos && activeEquipment.materialInfos.length">
          <div class="equipmemt-bar" >
            <div class="bar-container" ref="materialBar"></div>
          </div>
        </div>
        <!-- <div class="normal-container" style="height:17.13vh;padding:0" v-show="activeEqpIndex === 5 || activeEqpIndex === 2">
          <div class="equipmemt-bar" >
            <div class="bar-container" ref="barKind2"></div>
          </div>
        </div> -->
        <div class="normal-container" style="height:24.44vh" v-show="activeEqpIndex === 0 && activeEquipment.firstOrder">
          <div class="order-container">
            <div class="order-top">
              <div class="title">第一订单</div>
              <div class="number">{{activeEquipment.firstOrder}}</div>
            </div>
            <div class="order-content">
              <div class="image-border1"></div>
              <div class="image-border2"></div>
              <div class="image-border3"></div>
              <div class="image-border4"></div>
              <div class="content-item">
                <div class="name">耗时</div>
                <div class="value">{{activeEquipment.firstOrderTime}}</div>
              </div>
              <div class="content-item">
                <div class="name">图案</div>
                <div class="value"><img :src="'data:image/png;base64,'+activeEquipment.firstOrderImage" alt=""></div>
              </div>
            </div>
          </div>
        </div>
        <div class="normal-container" style="height:24.44vh" v-show="activeEqpIndex === 0 && activeEquipment.secondOrder">
          <div class="order-container">
            <div class="order-top">
              <div class="title">第二订单</div>
              <div class="number">{{activeEquipment.secondOrder}}</div>
            </div>
            <div class="order-content">
              <div class="image-border1"></div>
              <div class="image-border2"></div>
              <div class="image-border3"></div>
              <div class="image-border4"></div>
              <div class="content-item">
                <div class="name">耗时</div>
                <div class="value">{{activeEquipment.secondOrderTime}}</div>
              </div>
              <div class="content-item">
                <div class="name">图案</div>
                <div class="value">
                  <img :src="'data:image/png;base64,'+activeEquipment.secondOrderImage" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-bottom">
      <Swiper :list="equipment" @clickTab="clickTab" :active="activeEqpIndex"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apiConfig, fetch, post } from '@/utils/api/Interfaces'
import * as echarts from 'echarts'
import Swiper from '@/components/swiper.vue'

@Component({
  name: 'DataCollection',
  components: {
    Swiper
  }
})
export default class DataCollection extends Vue {
  teleNum:any = [1, 7, 6, 2, 1, 4, 6, 3, 3, 1, 6]
  process1:any = [
    { title: '上料', bgName: 'process1-step1' },
    { title: '打包', bgName: 'process1-step2' },
    { title: '装配', bgName: 'process1-step3' },
    { title: '包装', bgName: 'process1-step4' },
    { title: '入库', bgName: 'process1-step5' }
  ]
  process2:any = [
    { title: '上料', bgName: 'process2-step1' },
    { title: '打包', bgName: 'process2-step2' },
    { title: '装配', bgName: 'process2-step3' },
    { title: '包装', bgName: 'process2-step4' },
    { title: '入库', bgName: 'process2-step5' }
  ]
  equipment:any = [
    { title: '管理触摸屏', img: require('../assets/img/dataCollection/equipment_01.png') },
    { title: '上料工站', img: require('../assets/img/dataCollection/equipment_02.png') },
    { title: '打标工站', img: require('../assets/img/dataCollection/equipment_03.png') },
    { title: '打标检验工站', img: require('../assets/img/dataCollection/equipment_04.png') },
    { title: '号牌装配工站', img: require('../assets/img/dataCollection/equipment_05.png') },
    { title: '包装工站', img: require('../assets/img/dataCollection/equipment_06.png') },
    { title: '成品仓库', img: require('../assets/img/dataCollection/equipment_07.png') },
    { title: '原料仓库', img: require('../assets/img/dataCollection/equipment_08.png') },
    { title: '收货道口', img: require('../assets/img/dataCollection/equipment_09.png') },
    { title: 'AGV工站', img: require('../assets/img/dataCollection/equipment_10.png') }
  ]
  activeEqpIndex:any = 0
  activeEquipment: any = this.equipment[0]
  oeeChart:any = null
  momentumChart: any = null
  materialChart: any = null
  useRateChart: any = null
  requestEqpData: any = null
  equipmentStatus: any = [
    { title: '设备状态', img: require('../assets/img/dataCollection/eqp_status.png'), color: '#0cdbff' },
    { title: '节拍时间', img: require('../assets/img/dataCollection/eqp_time.png'), color: '#f9f162' },
    { title: '检查结果', img: require('../assets/img/dataCollection/eqp_result.png'), color: '#389cff' },
    { title: '故障代码', img: require('../assets/img/dataCollection/eqp_guzhang.png'), color: '#f96568' },
    { title: '可用本体', img: require('../assets/img/dataCollection/eqp_useful.png'), color: '#f9629e' },
    { title: '补料时间', img: require('../assets/img/dataCollection/eqp_buliao.png'), color: '#96ff6d' },
    { title: '电池剩余', img: require('../assets/img/dataCollection/eqp_buliao.png'), color: '#b333ff' }
  ]
  timer: any = null
  nameMatch: any = {
    'online': '运行',
    'standby': '待机',
    'offline': '离线',
    'warning': '告警'
  }
  mounted () {
    let location:any = window.location || {}
    this.initData()
    this.timer = setInterval(() => location.reload(), 1800000)
  }
  private destroyed () {
    clearInterval(this.timer)
    this.timer = null
  }
  initData () {
    fetch(apiConfig('dataCollection/getInfo'), {
      companyId: '123456'
    })
      .then((res:any) => {
        if (res.code === 200) {
          res.data && res.data.length && res.data.map((item:any) => {
            item.equipmentRunInfos && item.equipmentRunInfos.length && item.equipmentRunInfos.map((machine:any, index:any) => {
              if (machine.title === '设备状态') {
                machine.result = this.nameMatch[machine.result]
              }
              let find = this.equipmentStatus.find((status:any) => status.title === machine.title)
              if (find) {
                item.equipmentRunInfos[index] = { ...machine, ...find }
              }
            })
          })
          this.handleData(res.data)
        }
      })
    // let res = [
    //   { machineName: '管理触摸屏',
    //     firstOrder: '13xxxxxxx',
    //     firstOrderTime: '300s',
    //     secondOrderTime: '120s',
    //     secondOrder: '124xxxxxx',
    //     firstOrderProgress: '上料',
    //     secondOrderProgress: '打包'
    //   },
    //   { machineName: '上料工站',
    //     firstOrder: '13xxxxxxx',
    //     firstOrderProgress: '入库',
    //     equipmentRunningRate: '60',
    //     equipmentOEE: '20',
    //     equipmentRunInfos: [{ title: '设备状态', result: '运行' }, { title: '节拍时间', result: '180S' }]
    //   },
    //   {
    //     machineName: '打标工站',
    //     firstOrder: '13xxxxxxx',
    //     equipmentRunningRate: '70',
    //     equipmentOEE: '50',
    //     equipmentRunInfos: [{ title: '节拍时间', result: '120s' }, { title: '故障代码', result: 'NA' }],
    //     materialInfos: [
    //       { title: '上盖', result: 2 },
    //       { title: '下盖', result: 1 },
    //       { title: '可用材料1', result: 2 }
    //     ]
    //   },
    //   {
    //     machineName: '号牌装配工站',
    //     firstOrder: '13xxxxxxx',
    //     equipmentRunningRate: '25',
    //     equipmentOEE: '40',
    //     equipmentRunInfos: [{ title: '节拍时间', result: '120s' }, { title: '故障代码', result: 'NA' }],
    //     materialInfos: [
    //       { title: '可用材料1', result: 2 },
    //       { title: '可用材料2', result: 1 },
    //       { title: '可用材料3', result: 2 },
    //       { title: '可用材料4', result: 1 },
    //       { title: '可用材料5', result: 1 }
    //     ]
    //   },
    //   {
    //     machineName: '成品仓库',
    //     firstOrder: '13xxxxxxx',
    //     storageUtilization: '60',
    //     totalStorage: '10',
    //     usedStorage: '8'
    //   }
    // ]
    // res.map((item:any) => {
    //   item.equipmentRunInfos && item.equipmentRunInfos.length && item.equipmentRunInfos.map((machine:any, index:any) => {
    //     if (machine.title === '设备状态') {
    //       machine.result = this.nameMatch[machine.result]
    //     }
    //     let find = this.equipmentStatus.find((status:any) => status.title === machine.title)
    //     if (find) {
    //       item.equipmentRunInfos[index] = { ...machine, ...find }
    //     }
    //   })
    // })
    // this.handleData(res)
  }
  handleData (data:any) {
    console.log(data)
    this.equipment.map((item:any, index:any) => {
      let find = data.find((data:any) => data.machineName === item.title)
      if (find) {
        this.equipment[index] = { ...item, ...find }
      }
    })
    this.activeEquipment = this.equipment[0]
    console.log(this.equipment)
  }
  clickTab (index:any) {
    this.activeEqpIndex = index
    this.activeEquipment = this.equipment[index]
    if (this.activeEquipment.equipmentOEE) {
      this.oeeChart && this.oeeChart.dispose()
      this.$nextTick(() => {
        this.drawOeeGauge(this.activeEquipment.equipmentOEE)
      })
    }
    if (this.activeEquipment.equipmentRunningRate) {
      this.momentumChart && this.momentumChart.dispose()
      this.$nextTick(() => {
        this.drawRunningGauge(this.activeEquipment.equipmentRunningRate)
      })
    }
    if (this.activeEquipment.materialInfos && this.activeEquipment.materialInfos.length) {
      this.materialChart && this.materialChart.dispose()
      this.$nextTick(() => {
        this.drawBar(this.activeEquipment.materialInfos)
      })
    }
    if (this.activeEquipment.storageUtilization) {
      this.useRateChart && this.useRateChart.dispose()
      this.$nextTick(() => {
        this.drawPie(this.activeEquipment.storageUtilization)
      })
    }
  }
  drawRunningGauge (rate:any) :void {
    this.momentumChart = echarts.init(this.$refs.momentum as any)
    this.momentumChart.setOption(this.getMomentumData(rate))
    window.addEventListener('resize', () => {
      this.momentumChart.resize()
    })
  }
  drawOeeGauge (oee:any):void {
    this.oeeChart = echarts.init(this.$refs.oee as any)
    this.oeeChart.setOption(this.getOeeData(oee))
    window.addEventListener('resize', () => {
      this.oeeChart.resize()
    })
  }
  drawBar (data:any) :void {
    let arr:any = []; let value:any = []
    for (let key of data) {
      arr.push(key.title)
      value.push(key.result)
    }
    this.materialChart = echarts.init(this.$refs.materialBar as any)
    this.materialChart.setOption(this.getMaterialData(arr, value))
    window.addEventListener('resize', () => {
      this.materialChart.resize()
    })
  }
  drawPie (rate:any) :void {
    this.useRateChart = echarts.init(this.$refs.userate as any)
    this.useRateChart.setOption(this.getUseRateData(rate))
    window.addEventListener('resize', () => {
      this.useRateChart.resize()
    })
  }
  getFontSize (res:any) {
    let docEl = document.documentElement
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (!clientWidth) return
    let fontSize = 100 * (clientWidth / 1920)
    return res * fontSize
  }
  getUseRateData (rate:any) {
    const option = {
      title: {
        text: rate + '%',
        x: 'center',
        top: '41%',
        textStyle: {
          fontWeight: 'bold',
          color: '#fff',
          fontSize: this.getFontSize(0.32)
        }
      },
      graphic: [{
        type: 'group',
        left: 'center',
        top: '52%',
        children: [{
          type: 'text',
          z: 100,
          left: this.getFontSize(0.1),
          top: 'middle',
          style: {
            fill: '#8595ad',
            text: '库位利用率',
            fontSize: this.getFontSize(0.2)
          }
        }]
      }],
      color: ['rgba(176, 212, 251, 1)'],
      series: [{
        name: 'Line 1',
        type: 'pie',
        center: ['50%', '50%'],
        clockWise: true,
        radius: ['47%', '55%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        },
        hoverAnimation: false,
        data: [{
          value: rate,
          name: '01',
          itemStyle: {
            normal: {
              color: { // 完成的圆环的颜色
                colorStops: [{
                  offset: 0,
                  color: '#0bce8a' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#6dffcc' // 100% 处的颜色
                }]
              },
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              borderWidth: this.getFontSize(0.2)
            }
          }
        }, {
          name: '02',
          value: 100 - rate,
          itemStyle: {
            normal: {
              color: '#076a47',
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              borderWidth: this.getFontSize(0.2)
            }
          }
        }]
      },
      {
        name: '外圈',
        center: [
          '50%',
          '50%'
        ],
        radius: [
          '64%',
          '65%'
        ],
        clockWise: false,
        hoverAnimation: false,
        type: 'pie',
        data: [{
          value: 100,
          name: '',
          labelLine: {
            'show': false
          },
          itemStyle: {
            normal: {
              color: '#6dffcc',
              borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#0bce8a'
              }, {
                offset: 1,
                color: '#6dffcc'
              }]),
              borderWidth: this.getFontSize(0.01)
            }
          }
        }]
      }
      ]
    }
    return option
  }
  getMaterialData (arr:any, value:any) {
    var lineArr = new Array(arr.length).fill(2)
    console.log(lineArr)
    const option = {
      xAxis: {
        type: 'category',
        data: arr,
        axisTick: {
          alignWithLabel: true,
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(6,156,255,0.3)'
          }
        },
        axisLabel: {
          rotate: arr.length > 5 ? -45 : 0,
          fontSize: arr.length > 5 ? this.getFontSize(0.11) : this.getFontSize(0.12),
          color: 'white'
        }
      },
      yAxis: [{
        type: 'value',
        interval: 1,
        axisTick: { // 坐标轴刻度
          show: false
        },
        splitLine: { // 刻度线
          show: false
        },
        axisLine: { // 坐标轴线
          lineStyle: {
            color: 'rgba(6,156,255,0.3)'
          },
          show: true
        },
        axisLabel: {
          color: 'white',
          formatter: function (value: any) {
            return value
          }
        }
      },
      {
        type: 'value',
        gridIndex: 0,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
      ],
      legend: {
        data: ['直接访问', '背景'],
        show: false
      },
      series: [{
        name: 'aa',
        data: value,
        type: 'bar',
        // showBackground: true,
        xAxisIndex: 0,
        yAxisIndex: 0,
        barWidth: '50%',
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        itemStyle: { // 图形的形状
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 0, color: '#53efff' },
              { offset: 0.5, color: '#4ac6ff' },
              { offset: 1, color: '#0cdbff' }
            ]
          ),
          width: '80%',
          borderRadius: [this.getFontSize(0.02), this.getFontSize(0.02), 0, 0]
        },
        zlevel: 11
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: '60%',
        xAxisIndex: 0,
        yAxisIndex: 1,
        barGap: '-110%',
        data: lineArr,
        itemStyle: {
          normal: {
            color: 'rgba(255,255,255,0)',
            borderColor: 'rgba(74,198,255, 0.5)'
          }
        },
        zlevel: 9
      }
      ]
    }
    return option
  }
  getOeeData (oee:any) {
    const option = {
      series: [{
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: this.getFontSize(0.05),
            color: [
              [0.2, '#52ffff'],
              [0.8, '#f2a21b'],
              [1, '#52ffff']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '50%',
          width: this.getFontSize(0.05),
          offsetCenter: [0, '-0%'],
          itemStyle: {
            color: '#52ffff'
          }
        },
        axisTick: {
          length: this.getFontSize(0.04),
          distance: this.getFontSize(0.03),
          splitNumber: 10,
          lineStyle: {
            color: '#52ffff',
            width: this.getFontSize(0.01)
          }
        },
        axisLabel: {
          color: '#52ffff',
          distance: this.getFontSize(0.1),
          fontSize: this.getFontSize(0.12)
        },
        splitLine: {
          length: this.getFontSize(0.04),
          distance: this.getFontSize(0.03),
          lineStyle: {
            color: '#52ffff',
            width: this.getFontSize(0.01)
          }
        },
        detail: {
          fontSize: this.getFontSize(0.2),
          offsetCenter: [0, '60%'],
          valueAnimation: true,
          formatter: function (value:any) {
            return Math.round(value) + '%'
          },
          color: '#52ffff'
        },
        data: [{
          value: oee
        }]
      }]
    }
    return option
  }
  getMomentumData (rate:any) {
    const option = {
      series: [{
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: this.getFontSize(0.05),
            color: [
              [0.2, '#52ffff'],
              [0.8, '#f9f162'],
              [1, '#52ffff']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '50%',
          width: this.getFontSize(0.05),
          offsetCenter: [0, '-0%'],
          itemStyle: {
            color: '#52ffff'
          }
        },
        axisTick: {
          length: this.getFontSize(0.04),
          distance: this.getFontSize(0.03),
          splitNumber: 10,
          lineStyle: {
            color: '#52ffff',
            width: this.getFontSize(0.01)
          }
        },
        axisLabel: {
          color: '#52ffff',
          distance: this.getFontSize(0.1),
          fontSize: this.getFontSize(0.12)
        },
        splitLine: {
          length: this.getFontSize(0.04),
          distance: this.getFontSize(0.03),
          lineStyle: {
            color: '#52ffff',
            width: this.getFontSize(0.01)
          }
        },
        detail: {
          fontSize: this.getFontSize(0.2),
          offsetCenter: [0, '60%'],
          valueAnimation: true,
          formatter: function (value:any) {
            return Math.round(value) + '%'
          },
          color: '#52ffff'
        },
        data: [{
          value: rate
        }]
      }]
    }
    return option
  }
  enterDetail ():void {
    this.$router.push({
      path: '/dataCollection/detail?title=' + this.activeEquipment.title
    })
  }
}

</script>
<style scoped lang="less" type="text/less">
  @import "../less/style.less";
  @import "../less/dataCollection.less";
</style>
