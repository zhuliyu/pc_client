<template>
  <div class="data-panel">
      <div class="panel-header">
          <div class="logo"></div>
          <div class="header-bg">
						<div class="title">无人柔性产线数据采集系统</div>
						<div class="title-en">(SCADA)</div>
					</div>
      </div>
			<div class="panel-container">
				<div class="item-list">
					<div class="item-left">
						<div class="left-title">数控车床02</div>
						<div class="left-btn offline">离线</div>
					</div>
					<div class="item-center">
						<div class="center-list center-equipment">
							<div class="center-list-title">
								<div class="imgcode"></div>
								<span>设备编码：</span>
							</div>
							<div class="center-list-code">c2</div>
						</div>
						<div class="center-list">
							<div class="center-list-title">
								<div class="imgdate"></div>
								<span>更新时间：</span>
							</div>
							<div class="center-list-code">2021-4-16 10:03:15</div>
						</div>
					</div>
					<div class="item-right">
						<div class="right-tag">
							<div class="tag-item" v-for="(item, index) in colorList" :key="index">
								<div class="tag-btn" :style="{background: item.color}"></div>
								<div class="tag-name">{{item.title + '时间'}}</div>
							</div>
						</div>
						<div class="right-process">
							<div class="process-bar">
								<div v-for="(item, index) in eqpStatusList" :key="index" class="item" :style="{width:item.width, background: item.color}"></div>
							</div>
							<div class="process-date">
								<div>0:00</div>
								<div>12:00</div>
								<div>24:00</div>
							</div>
						</div>
						<div class="right-time">
							<div class="time-item" v-for="(item, index) in timeList" :key="index">
								<div class="time-name" :style="{color: item.status==='warning' ? '#bac6d7' : 'white'}">{{item.title + '时间：'}}</div>
								<div class="time-num" :style="{color: item.color}"> {{item.time+ '分钟'}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as echarts from 'echarts'

@Component({
  name: 'DataCollectionDetail'
})
export default class DataCollectionDetail extends Vue {
	colorList: any = [
		{ color: '#6bfffd', title: '运行'},
		{ color: '#ffea60', title: '警告'},
		{ color: '#6dffcc', title: '待机'},
		{ color: '#a8b4c6', title: '离线'}
	]
	status:any = {
		allStatus: ['online','offline','warning','online','warning'],
		allTime: ['12:00:00','14:00:00','16:00:00', '16:30:00','16:59:32']
	}
	timeList:any = [
		{ color: '#0cdbff', title: '运行', status: 'online', time :'725'},	
		{ color: '#0bce8a', title: '待机', status: 'standby', time: '123'},
		{ color: '#a8b4c6', title: '离线', status: 'offline', time: '111'},
		{ color: '#f2a21b', title: '警告', status: 'warning', time: '525'},
	]
	eqpStatusList: any = []
	colorMatch: any = {
		'online' : '#6bfffd',
		'standby': '#6dffcc',
		'offline': '#a8b4c6',
		'warning': '#ffea60'
	}
	mounted () {
		this.status.allStatus.map((item:any, index:any) => {
			let nowTime:any = this.getTime(this.status.allTime[index])
			let prevTime:any = 0
			if(this.status.allTime[index-1]){
				prevTime = this.getTime(this.status.allTime[index-1])
			}
			let width = ((nowTime - prevTime) / 86400 * 100).toFixed(2)
			this.eqpStatusList.push({
				color: this.colorMatch[item],
				status: item,
				width: width + '%',
				minute: ((nowTime - prevTime) / 60).toFixed(0)
			})
		})
		this.calculateMinute()
		console.log(this.eqpStatusList)
	}
	getTime(time:any) {
		if(time.split(':')) {
			let tag = time.split(':')
			return (tag[0] && tag[0] * 3600) + (tag[1] && tag[1] * 60) + (tag[2] && tag[2] * 1)
		}		
	}
	calculateMinute() {
		let onlineTime = 0, offlineTime = 0, warningTime = 0, standbyTime = 0;
		this.eqpStatusList.length && this.eqpStatusList.map((item:any) =>{
			if(item.status === 'online') {
				onlineTime += parseInt(item.minute)
			} else if(item.status === 'offline') {
				offlineTime += parseInt(item.minute)
			} else if(item.status === 'standby') {
				standbyTime += parseInt(item.minute)
			} else if (item.status === 'warning') {
				warningTime += parseInt(item.minute)
			}
		})
		this.timeList.length && this.timeList.map((item:any) => {
			if(item.status === 'online') {
				item.time = onlineTime
			} else if(item.status === 'offline') {
				item.time = offlineTime
			} else if(item.status === 'standby') {
				item.time = standbyTime
			} else if (item.status === 'warning') {
				item.time = warningTime
			}
		})
	}

}

</script>

<style scoped lang="less" type="text/less">
  @import "../less/style.less";
  .data-panel {
    .regionSize(@fill, @fill);
		background-color: #040e26;
		padding: 0 1.6vw;
		box-sizing: border-box;
    .panel-header {
				display: flex;
				flex-direction: row;
				justify-content: center;
				position: relative;
				.logo {
					width:8.5vw;
					height: 2.7vw;
					position: absolute;
					top:0.9vw;
					left: 1.6vw;   
					background: url("../assets/img/dataCollection/data_logo.png") no-repeat;  
					background-size: 100%;  
				}
				.header-bg {
					width:84vw;
					height: 6vw;
					background: url("../assets/img/dataCollection/data_header.png") no-repeat;
					background-size: cover;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.title {
						font-size: 1.9vw;
						line-height: 2.5vw;
						letter-spacing: 2px;
						font-weight: bold;
						background: linear-gradient(to bottom, #53efff 0%, #2dc6ff 73%, #069cff 100%);
						-webkit-background-clip: text;
            color: transparent;
					}
					.title-en {
						font-size: 1.6vw;
						letter-spacing: 2px;
						color: #069cff;
					}
				}

		}
		.panel-container{
			width: 100%;
			height: 47.3vw;
			border: solid 1px rgba(74, 198, 255, 0.5);
			display: flex;
			flex-direction: column;
			margin-top: 1.6vw;
			.item-list{
				display: flex;
				flex-direction: row;
				border-bottom: solid 1px rgba(74, 198, 255, 0.5);
				.item-left {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-right: solid 1px rgba(74, 198, 255, 0.5);
					width: 13vw;
					height: 15.7vw;
					.left-title{
						font-size: 1.3vw;
						color: white;
						font-weight: bold;
					}
					.left-btn{
						width: 5.9vw;
						height: 2.3vw;
						border-radius: 0.1vw;
						color:white;
						text-align: center;
						line-height: 2.3vw;
						font-size: 0.9vw;
						font-weight: bold;
						margin-top: 2vw;
					}
					.offline {
						background-color: rgba(168,180,198, 0.8);
					}
					.running {
						background-color: rgba(107,255,253, 0.88);
					}
					.warning {
						background-color: rgba(255,234,96,0.8);
					}
					.standby{
						background-color: rgba(109,255,204,0.8);
					}
				}
				.item-center {
					width: 17.2vw;
					height: 15.7vw;
					display: flex;
					flex-direction: column;
					border-right: solid 1px rgba(74, 198, 255, 0.5);
					.center-list{
						display: flex;
						flex-direction: column;
						justify-content: center;
						height: 50%;
						width:100%;
						padding-left: 2vw;
						box-sizing: border-box;
						.center-list-title{
							display: flex;
							flex-direction: row;
							align-items: center;
							.imgcode {
								width:1vw;
								height: 1vw;
								background: url("../assets/img/dataCollection/eqp_code.png") no-repeat;
								background-size: 1vw;
								padding-right: 0.6vw;
							}
							.imgdate{
								width:1vw;
								height: 1vw;
								background: url("../assets/img/dataCollection/eqp_update_time.png") no-repeat;
								background-size: 1vw;
								padding-right: 0.6vw;
							}
							span {
								color: #8595ad;
								font-size: 0.9vw;
							}
						}
						.center-list-code{
							font-size: 1.3vw;
							color: white;
							margin-top: 1.2vw;
							margin-left: 1.6vw;
						}
					}
					.center-equipment{
						border-bottom: solid 1px rgba(74, 198, 255, 0.5);
					}
				}
				.item-right{
					width: 70vw;
					padding: 0 1.6vw;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.right-tag{
						width:100%;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-end;
						.tag-item{
							display: flex;
							flex-direction: row;
							align-items: center;
							margin-right: 1.5vw;
							.tag-btn{
								width: 0.9vw;
								height: 0.9vw;
								border-radius: 2px;
								margin-right: 0.7vw;
							}
							.tag-name{
								font-size: 0.8vw;
								color: white;
							}
						}:last-child{
							margin-right: 0;
						}
					}
					.right-process{
						width: 97%;
						margin: 1.8vw 2.7vw 1.4vw 0.7vw;
						display: flex;
						flex-direction: column;
						.process-bar{
							width:100%;
							height: 1.6vw;
							border: solid 1px rgba(12,219,255,0.3);
							border-radius: 2px;
							padding: 0.2vw;
							box-sizing: border-box;
							display: flex;
							flex-direction: row;
							.item{
								height: 100%;

							}:first-child {
								border-radius: 2px 0px 0px 2px;
							}:last-child {
								border-radius: 0px 2px 2px 0px;
							}
							.offline{
								background: #a8b4c6;
							}
							.online{
								background: #6bfffd
							}
							.standby {

							}
						}
						.process-date{
							width:102%;
							display: flex;
							margin-top: 1vw;
							color: #bac6d7;
							font-size: 0.8vw;
							flex-direction: row;
							justify-content: space-between;
							margin-left: -1%;
						}
					}
					.right-time{
						width:100%;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-end;
						.time-item{
							display: flex;
							flex-direction: row;
							align-items: center;
							margin-right: 1.5vw;
							.time-name{
								color: white;
								font-size: 0.83vw;
								padding-right: 0.3vw;
							}
							.time-num{
								font-size: 1.04vw;
								color: white;
							}
						}:last-child{
							margin-right: 0;
						}
					}
					
				}
			}
		}
  }
</style>
