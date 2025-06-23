<template>
	<view class="main">
		<view class="close" @click="close">×</view>
		<view class="title">装备商店</view>
		<view class="sel">
			<select class="sels" v-model:value="selType">
				<option>全部</option>
				<option>装备</option>
				<option>道具</option>
			</select>
		</view>
		<view class="equipment">
			<view class="scroll">
				<view class="item" v-for="item in list" :key="item.name">
					<view @click="sel(item)">
						<image class="itemImg" :src="item.icon"></image>
						<view class="itemText">
							<label>{{item.name}}</label>
						</view>
					</view>
				</view>
			</view>
			<view class="info">
				<view class="infoRow">
					<label>{{infoText}}</label>
				</view>
				<view class="infos" v-if="JSON.stringify(data) != '{}'">
					<view class="infoName" v-if="data.gj != 0">攻击加成：</view><view v-if="data.gj != 0" class="gj">{{data.gj}}</view>
					<view class="infoName" v-if="data.fy != 0">防御加成：</view><view v-if="data.fy != 0" class="fy">{{data.fy}}</view>
					<view class="infoName" v-if="data.fs != 0">法术加成：</view><view v-if="data.fs != 0" class="fs">{{data.fs}}</view>
					<view class="infoName" v-if="data.blood != 0">血量加成：</view><view v-if="data.blood != 0" class="blood">{{data.blood}}</view>
					<view class="infoName" v-if="data.flz != 0">法力值加成：</view><view v-if="data.flz != 0" class="flz">{{data.flz}}</view>
					<view class="infoName" v-if="data.gs != 0">攻速加成：</view><view v-if="data.gs != 0" class="gs">{{data.gs}}</view>
					<view class="infoName" v-if="data.bj != 0">暴击加成：</view><view v-if="data.bj != 0" class="bj">{{data.bj}}</view>
					<view class="infoName" v-if="data.speed && data.speed != 0">移动速度加成：</view><view v-if="data.speed && data.speed != 0" class="gs">{{data.speed}}</view>
					<view class="infoName" v-if="data.distance && data.distance != 0">攻击范围加成：</view><view v-if="data.distance && data.distance != 0" class="gj">{{data.distance}}</view>
				</view>
			</view>
			<view class="buy">
				<button class="buyBtn" type="warn" @click="buy(data)" v-if="!needSoult">购买<label v-if="data.price"> ( ${{data.price}} )</label></button>
				<button class="buyBtn" type="primary" @click="soult(data.name)" v-else>出售<label> ( ${{data.price}} )</label></button>
				<view class="money">
					<image class="core" src="../../static/imgs/core.png"></image><label>{{money}}</label>
				</view>
			</view>
			<view class="myeq">
				<view class="eqRow" v-for="item in myEquip" :key="item.name" @click="selMyEq(item)">
					<view>
						<image class="itemImg" :src="item.icon"></image>
						<view class="itemText">
							<label>{{item.name}}</label>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import res from '../../static/data/equipment.json'
export default {
	data() {
		return {
			list: [],
			list2: [],
			infoText: '',
			data: {},
			myEquip: [],
			toolList: [],
			money: 0,
			selType: '全部',
			needSoult: false
		}
	},
	watch: {
		selType(newVal){
			if(newVal == '全部'){
				this.list = [...this.list2]
			}
			if(newVal == '装备'){
				let arr = []
				this.list2.forEach(item=>{
					if(item.istool == 0) {
						arr.push(item)
					}
				})
				this.list = [...arr]
			}
			if(newVal == '道具'){
				let arr = []
				this.list2.forEach(item=>{
					if(item.istool == 1) {
						arr.push(item)
					}
				})
				this.list = [...arr]
			}
		}
	},
	mounted() {
		this.getEquipment()
		this.money = this.moneys
		if(this.lists.length != 0){
			this.myEquip = [...this.lists]
		}
	},
	onShow() {
		this.money = this.moneys
	},
	props:{
		lists: Array,
		tools: Array,
		moneys: Number
	},
	methods: {
		close() {
			this.$emit('eqlist',JSON.stringify(this.myEquip))
			this.$emit('toolList',JSON.stringify(this.toolList))
			this.$emit('showEq',false)
			this.$emit('setMoney',this.money)
		},
		selMyEq(item) {
			this.needSoult = true
			this.infoText = item.detail
			this.data = {...item}
			this.data.price = parseInt(item.price*0.5)
		},
		soult(name) {
			let self = this
			uni.showModal({
				content: '确定出售此装备？(售出后不可撤回)',
				success: function (res) {
					if (res.confirm) {
						self.myEquip.forEach((i,d)=>{
							if(i.name == name){
								self.myEquip.splice(d,1)
								self.money += parseInt(i.price*0.5)
								self.data = {}
								self.infoText = ''
								self.$emit('eqlist',JSON.stringify(self.myEquip))
							}
						})
					}
				},
			})
		},
		getEquipment() {
			const self = this
			let resp = [...res.data]
			self.list = resp.slice()
			self.list2 = resp.slice()
			// uniCloud.callFunction({
			// 	name: 'getEquip'
			// }).then((res) => {
			// 	if(res.result.data.length == 0){
			// 		uni.showToast({
			// 			title: '网络连接失败，请检查网络',
			// 			icon:'error',
			// 			duration: 1200
			// 		});
			// 	}else {
			// 		self.list = res.result.data.slice()
			// 		self.list2 = res.result.data.slice()
			// 	}
			// 	uni.hideLoading();
			// }).catch((err) => {
			// 	uni.hideLoading();
			// 	uni.showToast({
			// 		title: '加载失败！请检查网络',
			// 		icon:'error',
			// 		duration: 1200
			// 	});
			// })
		},
		sel(item) {
			this.needSoult = false
			this.infoText = item.detail
			this.data = {...item}
		},
		buy(item) {
			const self = this
			uni.showModal({
				content: '确定购买此装备？(购买后不可撤回)',
				success: function (res) {
					if (res.confirm) {
						if(self.money >= item.price){
							if(parseInt(item.istool) == 0){
								if(self.myEquip.length >= 5){
									uni.showToast({
										title: '装备上限5件(道具除外)',
										icon:'none',
										duration: 2000
									});
									return
								}
								let has = false
								let hasshoot = false
								let l = []
								self.myEquip.forEach(i=>{
									if(i.name == item.name){
										has = true
									}
									//计算攻击性装备数量
									if(i.gj != 0 || i.fs != 0){
										l.push(i)
									}
									//计算鞋子数量
									if(i.isShoot && item.isShoot){
										hasshoot = true
									}
								})
								if(!has){
									if(hasshoot){
										uni.showToast({
											title: '不能重复购买鞋子',
											icon:'none',
											duration: 2000
										});
										return
									}
									if(l.length > 2 && (item.gj != 0 || item.fs != 0)){
										uni.showToast({
											title: '进攻性装备不能超过3件',
											icon:'none',
											duration: 2000
										});
										return
									}else{
										self.myEquip.push(item)
										self.money -= item.price
									}
								}else{
									uni.showToast({
										title: '该装备已存在，请另选',
										icon:'none',
										duration: 2000
									});
									return
								}
								
							}else{
								if(self.tools.length >= 4 || self.toolList.length >= 2){
									uni.showToast({
										title: '道具上限4件',
										icon:'none',
										duration: 2000
									});
									return
								}
								//防止道具重复
								let has2 = false
								self.tools.forEach(i=>{
									if(i.name == item.name){
										has2 = true
									}
								})
								self.toolList.forEach(i=>{
									if(i.name == item.name){
										has2 = true
									}
								})
								if(!has2){
									self.toolList.push(item)
									self.money -= item.price
								}else{
									uni.showToast({
										title: '该道具已存在，请另选',
										icon:'none',
										duration: 2000
									});
									return
								}
							}
							uni.showToast({
								title: '购买成功',
								icon:'none',
								duration: 1000
							});
						}else{
							uni.showToast({
								title: '金钱不足，无法购买',
								icon:'none',
								duration: 1500
							});
						}
						
					} else if (res.cancel) {
						
					}
				}
			});
		},
	},
}
</script>

<style lang="scss" scoped>
	.main {
		width: 100%;
		position: absolute;
		top: 0;
		background: url('../../static/imgs/selRole.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		z-index: 12;
		.close {
			position: absolute;
			left: 92%;
			top: 12rpx;
			font-size: 70rpx;
			color: #ffffff;
		}
		.title {
			font-size: 38rpx;
			color: $main-color;
			font-weight: bold;
			width: 100%;
			text-align: center;
			padding-top: 12rpx;
		}
		.sel {
			position: absolute;
			top: 26rpx;
			left: 30rpx;
			.sels {
				padding: 6rpx 26rpx;
				font-size: 32rpx;
				border-radius: 10rpx;
				background-color: #d8d8d8;
			}
		}
		.equipment {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			padding: 20rpx;
			.scroll {
				width: 100%;
				height: 45%;
				overflow-y: auto;
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				align-content: flex-start;
				border-bottom: 2rpx solid #fff;
				box-shadow: #d9d9d9 2rpx 0rpx 6rpx 2rpx;
			}
			.item {
				width: 150rpx;
				height: 120rpx;
				margin: 30rpx 0rpx;
				display: flex;
				justify-content: center;
				.itemImg {
					width: 100rpx;
					height: 100rpx;
					border: 2rpx solid #f1f1f1;
					border-radius: 16rpx;
				}
				.itemImg:hover {
					border: 6rpx solid $main-color;
				}
				.itemText {
					color: #f1f1f1;
					text-align: center;
					padding: 4rpx 0rpx;
				}
			}
			.info {
				width: 100%;
				height: 24%;
				padding: 26rpx;
				box-sizing: border-box;
				box-shadow: inset 0px 0px 4px 4px rgba(0, 0, 0, 0.5);
				background-color: $main-color;
				.infoRow {
					font-size: 34rpx;
					padding-bottom: 30rpx;
				}
				.infos {
					width: 100%;
					box-sizing: border-box;
					padding: 0rpx 26rpx;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					.infoName {
						font-size: 34rpx;
						color: #464646;
						font-weight: bold;
					}
					.gj {
						font-weight: bold;
						font-size: 38rpx;
						color: #ff4000;
					}
					.fy {
						font-weight: bold;
						font-size: 38rpx;
						color: #00ba00;
					}
					.fs {
						font-weight: bold;
						font-size: 38rpx;
						color: #0055ff;
					}
					.blood {
						font-weight: bold;
						font-size: 38rpx;
						color: #00ba00;
					}
					.flz {
						font-weight: bold;
						font-size: 38rpx;
						color: #00aaff;
					}
					.gs {
						font-weight: bold;
						font-size: 38rpx;
						color: #ffff00;
					}
					.bj {
						font-weight: bold;
						font-size: 38rpx;
						color: #ff4000;
					}
				}
			}
			.buy {
				width: 100%;
				display: flex;
				justify-content: center;
				margin-top: 20rpx;
				.buyBtn {
					width: 330rpx;
				}
			}
			.myeq {
				margin-top: 32rpx;
				width: 100%;
				height: 190rpx;
				padding: 0rpx 30rpx;
				border-radius: 8rpx;
				box-sizing: border-box;
				background-color: rgba(235, 235, 235, 0.2);
				display: flex;
				.eqRow {
					width: 160rpx;
					height: 190rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.itemImg {
						width: 100rpx;
						height: 100rpx;
						border: 2rpx solid #f1f1f1;
						border-radius: 16rpx;
					}
					.itemImg:hover {
						border: 6rpx solid $main-color;
					}
					.itemText {
						color: #f1f1f1;
						text-align: center;
						padding: 2rpx 0rpx;
					}
				}
			}
			.money {
				width: 230rpx;
				color: $main-color;
				font-size: 42rpx;
				margin-top: 26rpx;
				.core {
					width: 52rpx;
					height: 52rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
</style>