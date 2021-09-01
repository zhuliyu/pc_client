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
							<div class="num-box" v-for="(item, index) in totalNum" :key="index"><div>{{item}}</div></div>
						</div>
					</div>
					<div class="normal-container process">
						<div class="process-title">第一订单进度</div>
						<div class="process-container">
							<div v-for="(item, index) in process1" :key="index" :class="item.active ? 'process-box ' + item.bgName + ` ${item.bgName}-light` : 'process-box ' + item.bgName">
								<div class="process-title">{{item.title}}</div>
							</div>
						</div>
					</div>
					<div class="normal-container process">
						<div class="process-title">第二订单进度</div>
						<div class="process-container">
							<div v-for="(item, index) in process2" :key="index" :class="item.active ? 'process-box ' + item.bgName + ` ${item.bgName}-light` : 'process-box ' + item.bgName">
								<div class="process-title">{{item.title}}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="content-equipment">		
					<img :src="activeEquipment.img" alt="">		
					<div class="shadow"></div>
				</div>
				<div class="content-right">
					<div class="normal-container-row" style="height:21.67vh" v-show="activeEqpIndex === 1 || activeEqpIndex === 5 || activeEqpIndex === 2 || activeEqpIndex === 4 || activeEqpIndex === 9 || activeEqpIndex === 3">
						<div class="equipment-speed">
							<div class="gauge" ref="oee"></div>
							<div class="title">运行</div>
						</div>
						<div class="equipment-speed">
							<div class="gauge" ref="momentum"></div>
							<div class="title">设备稼动率</div>
						</div>
					</div>
					<div class="normal-container-row" style="height:19.91vh;justify-content:space-between" v-show="activeEqpIndex === 1 || activeEqpIndex === 5 || activeEqpIndex === 2 || activeEqpIndex === 3 || activeEqpIndex === 9">
						<div class="equipment-status" v-for="(item, index) in equipmentStatus" :key="index">
							<img :src="item.img" alt="">
							<div class="title" :style="`color:${item.color}`">{{item.title}}</div>
							<div class="result">
								<div class="image-border1"></div>
								<div class="image-border2"></div>
								{{item.result}}
							</div>
						</div>
					</div>
					<div class="normal-container-row" style="height:31.57vh" v-show="activeEqpIndex === 6 || activeEqpIndex === 7 || activeEqpIndex === 8">
						<div class="equipment-useRate">
							<div class="pie-container" ref="userate"></div>
						</div>
						<div class="equipment-userate-info">
							<div class="userate-container" style="margin-bottom: 2vw">
								<div class="num">16</div>
								<div class="title">总库位数</div>
							</div>
							<div class="userate-container">
								<div class="num">15</div>
								<div class="title">使用库位数</div>
							</div>
						</div>
					</div>
					<div class="normal-container" style="height:17.13vh;padding:1vw" v-show="activeEqpIndex === 3 || activeEqpIndex === 4 || activeEqpIndex === 7 || activeEqpIndex === 8">
						<div class="equipmemt-bar" >
							<div class="bar-container" ref="materialBar"></div>
						</div>
					</div>
					<div class="normal-container" style="height:17.13vh;padding:0" v-show="activeEqpIndex === 5 || activeEqpIndex === 2">
						<div class="equipmemt-bar" >
							<div class="bar-container" ref="barKind2"></div>
						</div>
					</div>
					
					<div class="normal-container" style="height:24.44vh" v-show="activeEqpIndex === 0">
						<div class="order-container">
							<div class="order-top">
								<div class="title">第一订单</div>
								<div class="number">13455364</div>
							</div>
							<div class="order-content">
								<div class="image-border1"></div>
								<div class="image-border2"></div>
								<div class="image-border3"></div>
								<div class="image-border4"></div>
								<div class="content-item">
									<div class="name">耗时</div>
									<div class="value">300s</div>
								</div>
								<div class="content-item">
									<div class="name">图案</div>
									<div class="value"></div>
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
	totalNum:any = [6,7,2,3,1,8,7,9]
	process1:any = [
		{ title: '上料', bgName: 'process1-step1', active: true },
		{ title: '打包', bgName: 'process1-step2', active: false },
		{ title: '装配', bgName: 'process1-step3', active: false },
		{ title: '包装', bgName: 'process1-step4', active: false },
		{ title: '入库', bgName: 'process1-step5', active: false }
	]
	process2:any = [
		{ title: '上料', bgName: 'process2-step1', active: false },
		{ title: '打包', bgName: 'process2-step2', active: true },
		{ title: '装配', bgName: 'process2-step3', active: false },
		{ title: '包装', bgName: 'process2-step4', active: false },
		{ title: '入库', bgName: 'process2-step5', active: false }
	]
	equipment:any = [
		{ title: '管理触摸屏', img: require('../assets/img/dataCollection/equipment_01.png'), active: false },
		{ title: '上料工站', img: require('../assets/img/dataCollection/equipment_02.png'), active: false },
		{ title: '打标工站', img: require('../assets/img/dataCollection/equipment_03.png'), active: false },
		{ title: '打标检验工站', img: require('../assets/img/dataCollection/equipment_04.png'), active: false },
		{ title: '号牌装配工站', img: require('../assets/img/dataCollection/equipment_05.png'), active: false },
		{ title: '包装工站', img: require('../assets/img/dataCollection/equipment_06.png'), active: false },
		{ title: '成品仓库', img: require('../assets/img/dataCollection/equipment_07.png'), active: false },
		{ title: '原料仓库', img: require('../assets/img/dataCollection/equipment_08.png'), active: false },
		{ title: '收货道口', img: require('../assets/img/dataCollection/equipment_09.png'), active: false },
		{ title: 'AGV工站', img: require('../assets/img/dataCollection/equipment_10.png'), active: false },
	]
	activeEqpIndex:any = 0
	activeEquipment: any = this.equipment[0]
	oeeChart:any = null
	momentumChart: any = null
	materialChart: any = null
	barKind2Chart: any = null
	useRateChart: any = null
	equipmentStatus: any = [
		{ title: '设备状态', img: require('../assets/img/dataCollection/eqp_status.png'), color: '#0cdbff', result: '运行' },
		{ title: '节拍时间', img: require('../assets/img/dataCollection/eqp_time.png'), color: '#f9f162', result: '180s' },
		{ title: '检查结果', img: require('../assets/img/dataCollection/eqp_result.png'), color: '#389cff', result: '合格' },
		{ title: '故障代码', img: require('../assets/img/dataCollection/eqp_guzhang.png'), color: '#f96568', result: 'NA' },
	]
	mounted () {
		// this.drawChartGauge()
		this.initData()		
	}
	initData() {
		fetch(apiConfig('dataCollection/getInfo'), {
			companyId: '123456'
    })
      .then((res:any) => {
       
      })
	}
	clickTab(index:any) {
		this.activeEqpIndex = index
		this.activeEquipment = this.equipment[index]
		// this.drawChartGauge()
		if(index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 9 ) {
			this.oeeChart && this.oeeChart.dispose()
			this.momentumChart && this.momentumChart.dispose()
			this.drawGauge()
		} 
		if(index === 3 || index === 4 || index === 7 || index === 8 || index ===2 || index ===5) {
			this.materialChart && this.materialChart.dispose()
			this.barKind2Chart && this.barKind2Chart.dispose()
			this.$nextTick(() => {
				this.drawBar()
			})
		} 
		if (index === 6 || index === 7 || index === 8) {
			this.useRateChart && this.useRateChart.dispose()
			this.$nextTick(() => {
				this.drawPie()
			})
		}

	}
	drawGauge():void {
		this.oeeChart = echarts.init(this.$refs.oee as any)
		this.momentumChart = echarts.init(this.$refs.momentum as any)
		this.momentumChart.setOption(this.getMomentumData())
		this.oeeChart.setOption(this.getOeeData())
		window.addEventListener('resize', () =>{
			this.momentumChart.resize()
			this.oeeChart.resize()
		})
	}
	drawBar() :void {
		this.materialChart = echarts.init(this.$refs.materialBar as any)
		this.barKind2Chart = echarts.init(this.$refs.barKind2 as any)
		this.materialChart.setOption(this.getMaterialData())
		this.barKind2Chart.setOption(this.getBarKind2Data())
		window.addEventListener('resize', () =>{
			this.barKind2Chart.resize()
			this.materialChart.resize()
		})
	}
	drawPie() :void {
		console.log('mmmmm')
		this.useRateChart = echarts.init(this.$refs.userate as any)
		this.useRateChart.setOption(this.getUseRateData())
		window.addEventListener('resize', () =>{
			this.useRateChart.resize()
		})
	}
	drawChartGauge() :void {
		this.oeeChart = echarts.init(this.$refs.oee as any)
		this.momentumChart = echarts.init(this.$refs.momentum as any)
		this.materialChart = echarts.init(this.$refs.materialBar as any)
		this.barKind2Chart = echarts.init(this.$refs.barKind2 as any)
		this.useRateChart = echarts.init(this.$refs.userate as any)
		this.oeeChart.setOption(this.getOeeData())
		this.momentumChart.setOption(this.getMomentumData())
		this.useRateChart.setOption(this.getUseRateData())
		this.materialChart.setOption(this.getMaterialData())
		this.barKind2Chart.setOption(this.getBarKind2Data())
		window.addEventListener('resize', () =>{
			console.log('ssss')
			// this.materialChart.resize()
			this.oeeChart.resize()
		})
		
	}
	getFontSize(res:any) {
		let docEl = document.documentElement,
    clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
		if (!clientWidth) return;
		let fontSize = 100 * (clientWidth / 1920);
		return res*fontSize;
	}
	getUseRateData() {
		const option = {
			title: {
					text: '80%',
					x: 'center',
					top: '41%',
					textStyle: {
							fontWeight: 'bold',
							color: '#fff',
							fontSize: this.getFontSize(0.33)
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
							value: 80,
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
							value: 20,
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
        name: "外圈",
        center: [
            "50%",
            "50%"
        ],
        radius: [
            "64%",
            "65%"
        ],
        clockWise: false,
        hoverAnimation: false,
        type: "pie",
        data: [{
            value: 100,
            name: "",
            labelLine: {
                "show": false
            },
            itemStyle: {
                normal: {
                    color: "#6dffcc",
                    borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#0bce8a'
                    }, {
                        offset: 1,
                        color: '#6dffcc'
                    }]),
                    borderWidth: this.getFontSize(0.01)
                }
            },
        }]
    		}
			]
		}
		return option
	}
	getBarKind2Data() {
		const option = {
      xAxis: {
        type: 'category',
        data: ['上盖', '下盖'],
        axisTick: {
            alignWithLabel: true,
            show:false
        },
        
        axisLine: {
          lineStyle: {
            color: 'rgba(6,156,255,0.3)'
          }
        },
        axisLabel: {
					fontSize: this.getFontSize(0.12),
					color:'white'
        }
     	},
			yAxis: [{
				type: 'value',
				axisTick: { //坐标轴刻度
					show:false,
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
							var texts = [];
							if(value==1){
								texts.push('1个');
							}
							else if (value ==2 ){
								texts.push('2个');
							}
							return texts;
					},
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
            },
        }
			],
			series: [{
					name: 'aa',
					data: [1,2],
					type: 'bar',
					// showBackground: true,
					xAxisIndex: 0,
					yAxisIndex: 0,
					barWidth: '86%',
					backgroundStyle: {
						color: 'rgba(180, 180, 180, 0.2)'
					},
					itemStyle: {    // 图形的形状
						color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
											{offset: 0, color: '#53efff'},
											{offset: 0.5, color: '#4ac6ff'},
											{offset: 1, color: '#0cdbff'}
									]
							),
						width: '80%',
						barBorderRadius: [this.getFontSize(0.02), this.getFontSize(0.02), 0 ,0],
					},
					zlevel:11
				},
				{
					name: '背景',
					type: 'bar',
					barWidth: '90%',
					xAxisIndex: 0,
					yAxisIndex: 1,
					barGap: '-102%',
					data: [2, 2],
					itemStyle: {
							normal: {
									color: 'rgba(255,255,255,0)',
									borderColor: 'rgba(74,198,255, 0.5)'
							}
					},
					zlevel: 9
				},
			]
  	}
		return option
	}
	getMaterialData() {
		const option = {
      xAxis: {
        type: 'category',
        data: ['可用材料1', '可用材料2', '可用材料3', '可用材料4', '可用材料5', '可用材料6', '可用材料7','可用材料8','可用材料9','可用材料10'],
        axisTick: {
            alignWithLabel: true,
            show:false
        },
        
        axisLine: {
          lineStyle: {
            color: 'rgba(6,156,255,0.3)'
          }
        },
        axisLabel: {
          rotate: -45,
					fontSize: this.getFontSize(0.1),
					color:'white'
        }
     	},
			yAxis: [{
				type: 'value',
				axisTick: { //坐标轴刻度
					show:false,
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
							var texts = [];
							if(value==1){
								texts.push('1组');
							}
							else if (value ==2 ){
								texts.push('2组');
							}
							return texts;
					},
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
            },
        }
			],
			legend: {
				data: ['直接访问', '背景'],
				show: false
			},
			series: [{
					name: 'aa',
					data: [1,2,1,1,1,2,1,1,1,1],
					type: 'bar',
					// showBackground: true,
					xAxisIndex: 0,
					yAxisIndex: 0,
					barWidth: '35%',
					backgroundStyle: {
						color: 'rgba(180, 180, 180, 0.2)'
					},
					itemStyle: {    // 图形的形状
						color: new echarts.graphic.LinearGradient(
									0, 0, 0, 1,
									[
											{offset: 0, color: '#53efff'},
											{offset: 0.5, color: '#4ac6ff'},
											{offset: 1, color: '#0cdbff'}
									]
							),
						width: '80%',
						barBorderRadius: [this.getFontSize(0.02), this.getFontSize(0.02), 0 ,0],
					},
					zlevel:11
				},
				{
					name: '背景',
					type: 'bar',
					barWidth: '60%',
					xAxisIndex: 0,
					yAxisIndex: 1,
					barGap: '-135%',
					data: [2, 2, 2, 2, 2, 2, 2,2,2,2],
					itemStyle: {
							normal: {
									color: 'rgba(255,255,255,0)',
									borderColor: 'rgba(74,198,255, 0.5)'
							}
					},
					zlevel: 9
				},
			]
  	}
		return option
	}
	getOeeData()  {
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
								splitNumber:10,
								lineStyle: {
										color: '#52ffff',
										width: this.getFontSize(0.01),								
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
										return Math.round(value) + '%';
								},
								color: '#52ffff'
						},
						data: [{
								value: 70,
						}]
				}]
		};
		return option
	}
	getMomentumData()  {
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
								splitNumber:10,
								lineStyle: {
										color: '#52ffff',
										width: this.getFontSize(0.01),								
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
										return Math.round(value) + '%';
								},
								color: '#52ffff'
						},
						data: [{
								value: 70,
						}]
				}]
		};
		return option
	}
}

</script>
<style scoped lang="less" type="text/less">
  @import "../less/style.less";
	@import "../less/dataCollection.less";
</style>
