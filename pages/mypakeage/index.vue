<template>
	<view class="container">
		<image v-show="showInfo && heroInfo.img != ''" class="bgHero" :src="'../../static/imgs/hero/'+heroInfo.img"></image>
		<view v-if="!showInfo">
			<button size="mini" class="back" @click="back2">主页</button>
			<view class="title">
				<label>我的英雄</label>
			</view>
			<view class="sel">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="roles">
						<view class="item" v-for="item in heroList" :key="item.id">
							<view class="left" @click="sel(item)">
								<image class="icon" :src="'../../static/imgs/hero/'+item.icon"></image>
								<view class="heroName">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<button size="mini" class="fuhuoAll" @click="fuhuoAll">复活所有英雄</button>
			</view>
		</view>
		<view v-if="showInfo">
			<view class="sel">
				<button size="mini" class="back" @click="back">返回</button>
				<button size="mini" class="clear" @click="resetAll">重置天赋点</button>
				<view class="heroInfo">
					<view style="width: 100%;display: flex;flex-direction: column;align-items: center;">
						<image :class="{'heroIcon':true,'dead':addInfo.isLive == 0}" :src="'../../static/imgs/hero/'+heroInfo.icon"></image>
						<view style="margin-top: 10rpx;display: flex;">
							<view v-if="addInfo.isLive == 0"><button size="mini" @click="living">复活</button></view>
							<view v-if="selIndex != 0">
								<button style="margin-left: 16rpx;" type="primary" size="mini" @click="selStrongHero">出战</button>
								<button style="margin-left: 16rpx;" size="mini" @click="showDetails">详情</button>
							</view>
						</view>
						<view :class="{'heroName':true,'deadText':addInfo.isLive == 0}">{{ heroInfo.name }}（{{parseInt(Math.floor(addInfo.allPointer/500))+1}}级）
							<span v-if="parseInt(Math.floor(addInfo.allPointer/500))+1 == 35" class="maxLevel">满级</span>
						</view>
					</view>
					<view class="leftArrow" @click="lastHero">
						<image class="arrowImg" src="../../static/imgs/left.png"></image>
					</view>
					<view class="rightArrow" @click="nextHero">
						<image class="arrowImg" src="../../static/imgs/right.png"></image>
					</view>
					<view class="infos">
						<view class="infoItem">
							<view class="infoText">生命值：</view>
							<view class="infoValue">{{heroInfo.blood}}</view>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(1)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">法力值：</view>
							<view class="infoValue">{{heroInfo.flz}}</view>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(2)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">攻击：</view>
							<view class="infoValue">{{heroInfo.gj}}</view>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(3)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">法术：</view>
							<view class="infoValue">{{heroInfo.fs}}</view>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(4)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">防御：</view>
							<view class="infoValue">{{heroInfo.fy}}</view>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(5)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">攻速：(s/次)</view>
							<view class="infoValue">{{heroInfo.v}}</view>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(6)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">爆击几率：</view>
							<view class="infoValue">{{parseFloat(heroInfo.bj).toFixed(2)}}</view>
							<image v-if="hasPoint > 0 && parseFloat(heroInfo.bj) < 0.8 && selIndex == 0" @click="addP(7)" class="addTallent" src="../../static/imgs/addTallent.png"></image>
						</view>
						<view class="infoItem">
							<view class="infoText">可用升级点：</view>
							<view class="infoValue">{{hasPoint}}</view>
						</view>
					</view>
					<view class="tallentItem">
						<view class="item" v-for="(item,index) in heroInfo.tallent.slice(1)" :key="item.name">
							<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/rune/jm.png"></image>
							<p class="itemText" :text="item.text">{{item.name}}({{addfilter(8+index)}})</p>
							<image v-if="hasPoint > 0 && selIndex == 0" @click="addP(8+index)" class="addTallent" style="padding-top: 16rpx;" src="../../static/imgs/addTallent.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import res from '../../static/data/heroList.json'
import res2 from '../../static/data/goods.json'
import res3 from '../../static/data/heroStrong.json'
import { editMoney } from '../../utils/editUser'
export default {
	data() {
		return {
			heroList: [],
			myStoreHero: [],
			showInfo: false,
			heroInfo: {},
			hasPoint: 0,
			addInfo: {},
			heroStrong: [],
			selIndex: 0
		}
	},
	mounted() {
		this.getHeros();
	},
	methods: {
		getHeros() {
			const self = this
			let resp = [...res.data]
			if(JSON.parse(uni.getStorageSync('myStore')).length != 0){
				JSON.parse(uni.getStorageSync('myStore')).forEach(i=>{
					if(!i.isOther){
						if(new Date().getTime() < parseInt(i.buyTime) + 3*24*60*60*1000){
							self.myStoreHero.push(i)
						}
					}
				})
			}
			self.heroList = resp.concat(self.myStoreHero).slice()
			if(uni.getStorageSync('heroAddData')){
				let data = JSON.parse(uni.getStorageSync('heroAddData'))
				data.forEach(it=>{
					if(it.strongIndex){
						if(new Date().getTime() > parseInt(it.strongDeadTime) + 3*24*60*60*1000){
							it.strongIndex = null
							it.strongDeadTime = null
							uni.setStorageSync('heroAddData',JSON.stringify(data))
						}else{
							res3.data.map(item=>{
								if(item.id == it.id && item.index == it.strongIndex){
									self.heroList.map((i,d)=>{
										if(it.id == i.id){
											self.heroList[d].name = item.name
											self.heroList[d].icon = item.icon
										}
									})
								}
							})
						}
					}
				})
			}
		},
		sel(item) {
			this.heroInfo = {...item}
			let self = this
			if(!uni.getStorageSync('heroAddData')){
				let heroAddData = []
				res.data.forEach(ite=>{
					heroAddData.push({
						id: ite.id,
						isLive: 1,
						pointer: 0,
						allPointer: 0,
						add1: 0,
						add2: 0,
						add3: 0,
						add4: 0,
						add5: 0,
						add6: 0,
						add7: 0,
						add8: 0,
						add9: 0,
						add10: 0,
						add11: 0,
					})
				})
				uni.setStorageSync('heroAddData',JSON.stringify(heroAddData))
			}else{
				let hasId = false
				let data = JSON.parse(uni.getStorageSync('heroAddData'))
				data.forEach(it=>{
					if(it.id == self.heroInfo.id){
						hasId = true
					}
				})
				if(!hasId){
					data.push({
						id: item.id,
						isLive: 1,
						pointer: 0,
						allPointer: 0,
						add1: 0,
						add2: 0,
						add3: 0,
						add4: 0,
						add5: 0,
						add6: 0,
						add7: 0,
						add8: 0,
						add9: 0,
						add10: 0,
						add11: 0,
					})
					uni.setStorageSync('heroAddData',JSON.stringify(data))
				}
				data.forEach(it=>{
					if(it.id == self.heroInfo.id){
						self.hasPoint = it.pointer
						self.addInfo = {...it}
					}
				})
			}
			self.heroStrong.splice(0)
			self.heroStrong.push(self.heroInfo)
			self.selIndex = 0
			res3.data.map(i=>{
				if(i.id == self.heroInfo.id){
					self.heroStrong.push(i)
				}
			})
			self.getAddTalent()
			self.showInfo = true
		},
		back() {
			this.showInfo = false
			this.heroInfo = {}
		},
		back2() {
			uni.redirectTo({
				url: "/pages/index/index?isLogin=true"
			})
		},
		addP(index) {
			if(index == 8 && this.addInfo.add8 >=4){
				uni.showToast({
					title: '该技能已达到最高等级',
					icon:'none',
					duration: 1500
				});
				return
			}
			if(index == 9 && this.addInfo.add9 >=4){
				uni.showToast({
					title: '该技能已达到最高等级',
					icon:'none',
					duration: 1500
				});
				return
			}
			if(index == 10 && this.addInfo.add10 >=4){
				uni.showToast({
					title: '该技能已达到最高等级',
					icon:'none',
					duration: 1500
				});
				return
			}
			if(index == 11 && this.addInfo.add11 >=3){
				uni.showToast({
					title: '该技能已达到最高等级',
					icon:'none',
					duration: 1500
				});
				return
			}
			if(this.hasPoint < 250){
				uni.showToast({
					title: '至少需要250升级点数',
					icon:'none',
					duration: 1500
				});
				return
			}else{
				if(index == 1){
					this.addInfo.add1 += 1
					this.hasPoint -= 250
				}
				if(index == 2){
					this.addInfo.add2 += 1
					this.hasPoint -= 250
				}
				if(index == 3){
					this.addInfo.add3 += 1
					this.hasPoint -= 250
				}
				if(index == 4){
					this.addInfo.add4 += 1
					this.hasPoint -= 250
				}
				if(index == 5){
					this.addInfo.add5 += 1
					this.hasPoint -= 250
				}
				if(index == 6){
					if(this.addInfo.add6 <3){
						this.addInfo.add6 += 1
						this.hasPoint -= 250
					}else{
						uni.showToast({
							title: '攻速最低为0.5秒/次',
							icon:'none',
							duration: 1500
						});
						return
					}
				}
				if(index == 7){
					this.addInfo.add7 += 1
					this.hasPoint -= 250
				}
				if(index == 8){
					if(this.hasPoint<500){
						uni.showToast({
							title: '至少需要500升级点数',
							icon:'none',
							duration: 1500
						});
						return
					}
					this.addInfo.add8 += 1
					this.hasPoint -= 500
				}
				if(index == 9){
					if(this.hasPoint<500){
						uni.showToast({
							title: '至少需要500升级点数',
							icon:'none',
							duration: 1500
						});
						return
					}
					this.addInfo.add9 += 1
					this.hasPoint -= 500
				}
				if(index == 10){
					if(this.hasPoint<500){
						uni.showToast({
							title: '至少需要500升级点数',
							icon:'none',
							duration: 1500
						});
						return
					}
					this.addInfo.add10 += 1
					this.hasPoint -= 500
				}
				if(index == 11){
					if(this.hasPoint<500){
						uni.showToast({
							title: '至少需要500升级点数',
							icon:'none',
							duration: 1500
						});
						return
					}
					this.addInfo.add11 += 1
					this.hasPoint -= 500
				}
			}
			
			//保存数据addInfo
			let self = this
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			self.addInfo.pointer = self.hasPoint
			datas.forEach((it,idx)=>{
				if(self.heroInfo.id == it.id){
					datas[idx] = self.addInfo
				}
			})
			uni.setStorageSync('heroAddData',JSON.stringify(datas))
			self.getAddTalent()
		},
		living() {
			let self = this
			uni.showModal({
				title: '提示',
				content: '复活需要花费100元，确定要复活吗？',
				success: function (r) {
					if (r.confirm) {
						let datas = JSON.parse(uni.getStorageSync('heroAddData'))
						datas.forEach((it,idx)=>{
							if(self.heroInfo.id == it.id){
								if(editMoney(-100)){
									datas[idx].isLive = 1
									self.addInfo.isLive = 1
									uni.showToast({
										title: '复活成功！',
										icon:'none',
										duration: 1500
									});
								}
							}
						})
						uni.setStorageSync('heroAddData',JSON.stringify(datas))
					} else if (r.cancel) {
						
					}
					
				}
			})
		},
		//装填英雄加成
		getAddTalent() {
			let self = this
			let goods = [...res2.data]
			res.data.concat(goods).forEach(ite=>{
				if(ite.id == self.heroInfo.id){
					self.heroInfo = {...ite}
				}
			})
			this.heroInfo.blood += this.addInfo.add1*150
			this.heroInfo.flz += this.addInfo.add2*100
			this.heroInfo.gj += parseInt(this.addInfo.add3)*2
			this.heroInfo.fs += parseInt(this.addInfo.add4)*2
			this.heroInfo.fy += parseInt(this.addInfo.add5)*2
			if(parseFloat(this.heroInfo.v) > 0.5){
				this.heroInfo.v = parseFloat(this.heroInfo.v - parseInt(this.addInfo.add6)*0.15).toFixed(2)
			}
			this.heroInfo.bj += parseFloat(this.addInfo.add7*0.1).toFixed(1)
			if(parseFloat(this.heroInfo.bj)>1){
				this.heroInfo.bj = 1
			}
		},
		//皮肤装填英雄加成
		getAddTalent2() {
			let self = this
			this.heroInfo.blood += this.addInfo.add1*150
			this.heroInfo.flz += this.addInfo.add2*100
			this.heroInfo.gj += parseInt(this.addInfo.add3)*2
			this.heroInfo.fs += parseInt(this.addInfo.add4)*2
			this.heroInfo.fy += parseInt(this.addInfo.add5)*2
			if(parseFloat(this.heroInfo.v) > 0.5){
				this.heroInfo.v = parseFloat(this.heroInfo.v - parseInt(this.addInfo.add6)*0.15).toFixed(2)
			}
			this.heroInfo.bj += parseFloat(this.addInfo.add7*0.1).toFixed(1)
			if(parseFloat(this.heroInfo.bj)>1){
				this.heroInfo.bj = 1
			}
		},
		showDetails() {
			uni.showModal({
				title: '英雄详情',
				content: this.heroInfo.details,
				showCancel: false,
				success: function (res) {
					if (res.confirm) {}
				}
			});
		},
		addfilter(index) {
			if(index == 8){
				return this.addInfo.add8
			}
			if(index == 9){
				return this.addInfo.add9
			}
			if(index == 10){
				return this.addInfo.add10
			}
			if(index == 11){
				return this.addInfo.add11
			}
		},
		//复活所有
		fuhuoAll() {
			let self = this
			uni.showModal({
				title: '提示',
				content: '复活所有英雄需要花费1000元，确定要复活吗？',
				success: function (r) {
					if (r.confirm) {
						let datas = JSON.parse(uni.getStorageSync('heroAddData'))
						if(editMoney(-1000)){
							datas.forEach((it,idx)=>{
								datas[idx].isLive = 1
								self.addInfo.isLive = 1
								uni.showToast({
									title: '复活成功！',
									icon:'none',
									duration: 1500
								});
							})
						}
						uni.setStorageSync('heroAddData',JSON.stringify(datas))
					} else if (r.cancel) {
						
					}
				}
			});
		},
		resetAll() {
			let self = this
			uni.showModal({
				title: '提示',
				content: '确定要重置天赋吗？不可撤回',
				success: function (r) {
					if (r.confirm) {
						let datas = JSON.parse(uni.getStorageSync('heroAddData'))
						self.hasPoint = self.addInfo.allPointer
						datas.forEach((item,index)=>{
							if(item.id == self.heroInfo.id){
								let goods = [...res2.data]
								res.data.concat(goods).forEach(it=>{
									if(it.id == item.id){
										datas[index] = {
											id: item.id,
											pointer: datas[index].allPointer,
											allPointer: datas[index].allPointer,
											add1: 0,
											add2: 0,
											add3: 0,
											add4: 0,
											add5: 0,
											add6: 0,
											add7: 0,
											add8: 0,
											add9: 0,
											add10: 0,
											add11: 0,
										}
										self.addInfo = {...datas[index]}
										self.heroInfo = {...it}
									}
								})
							}
							
						})
						uni.setStorageSync('heroAddData',JSON.stringify(datas))
					} else if (r.cancel) {
						
					}
				}
			});
		},
		lastHero() {
			let tallent = []
			tallent = [...this.heroInfo.tallent]
			if(this.selIndex > 0){
				this.selIndex -= 1
				this.heroInfo = {...this.heroStrong[this.selIndex]}
				this.heroInfo.tallent = [...tallent]
				this.getAddTalent2()
			}
		},
		nextHero() {
			let tallent = []
			tallent = [...this.heroInfo.tallent]
			if(this.selIndex < this.heroStrong.length - 1){
				this.selIndex += 1
				this.heroInfo = {...this.heroStrong[this.selIndex]}
				this.heroInfo.tallent = [...tallent]
				this.getAddTalent2()
			}
		},
		selStrongHero() {
			let self = this
			uni.showModal({
				title: '提示',
				content: '选择该皮肤需要花费'+self.heroInfo.price+'元，有效期3天，确定要出战吗？',
				success: function (r) {
					if (r.confirm) {
						let datas = JSON.parse(uni.getStorageSync('heroAddData'))
						if(editMoney(-parseInt(self.heroInfo.price))){
							datas.forEach((it,idx)=>{
								if(self.heroInfo.id == it.id){
									datas[idx].strongIndex = self.selIndex
									datas[idx].strongDeadTime = new Date().getTime()
									uni.showToast({
										title: '出战成功！',
										icon:'none',
										duration: 1500
									});
								}
							})
						}
						uni.setStorageSync('heroAddData',JSON.stringify(datas))
					} else if (r.cancel) {
						
					}
				}
			});
		},
	},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background: url('../../static/imgs/storeBg.jpeg');
	background-size: cover;
	background-repeat: no-repeat;
	padding: 0px 3%;
	box-sizing: border-box;
	.title {
		width: 100%;
		text-align: center;
		color: #aa2e2e;
		position: relative;
		top: 50rpx;
		font-size: 50rpx;
		font-weight: bold;
	}
	.bgHero {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		filter: blur(10rpx);
	}
	.sel {
		width: 100%;
		height: 100%;
		.close {
			position: absolute;
			left: 92%;
			font-size: 56rpx;
			color: #ffffff;
		}
		.leftArrow {
			position: absolute;
			top: 14%;
			left: 3%;
		}
		.rightArrow {
			position: absolute;
			top: 14%;
			right: 3%;
		}
		.arrowImg {
			width: 60rpx;
			height: 60rpx;
		}
		.scroll-Y {
			height: 78vh;
		}
		.roles {
			width: 100%;
			padding: 0px 22rpx;
			padding-top: 70rpx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			.item {
				padding: 20rpx 30rpx;
				display: flex;
				.left {
					position: relative;
					top: 10rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				.right {
					width: 60%;
					padding: 10rpx 0rpx;
					.text {
						width: 250rpx;
						text-align: right;
						color: #ebebeb;
						font-size: 32rpx;
					}
				}
				.info {
					width: 200rpx;
					text-align: center;
					height: 56rpx;
					line-height: 56rpx;
					vertical-align: middle;
					color: #ffffff;
					background-color: #00aaff;
					font-size: 26rpx;
					position: relative;
					top: 70%;
					right: 20rpx;
					border-radius: 12rpx;
				}
				.icon {
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					border: 4rpx solid $main-color;
				}
				.heroName {
					padding-top: 12rpx;
					color: #ff4800;
				}
			}
		}
		.roleInfo {
			padding: 60rpx 50rpx;
			.tallent {
				.tallentRow {
					display: flex;
					padding: 4rpx 0rpx;
					.tallentTitle {
						width: 200rpx;
						font-size: 36rpx;
						color: #ebebeb;
					}
					.name {
						color: $main-color;
						font-size: 34rpx;
						font-weight: bold;
					}
					.textInfo {
						color: #ebebeb;
						padding: 10rpx 0rpx;
						font-size: 28rpx;
					}
				}
			}
		}
	}
	.back {
		position: absolute;
		top: 60rpx;
		width: 160rpx;
		z-index: 99;
	}
	.fuhuoAll {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		width: 280rpx;
		z-index: 99;
	}
	.heroInfo {
		position: relative;
		top: 150rpx;
		.heroIcon {
			width: 360rpx;
			height: 360rpx;
			border-radius: 30rpx;
			border: 4rpx solid #ffaa00;
		}
		.heroName {
			padding-top: 12rpx;
			color: #ff4800;
			text-align: center;
			font-weight: bold;
			font-size: 42rpx;
		}
		.dead {
			opacity: 0.3;
		}
		.deadText {
			color: #828282 !important;
		}
		.infoItem {
			width: 46%;
			height: 80rpx;
			display: flex;
		}
		.infoText {
			font-size: 36rpx;
			width: 260rpx;
		}
		.infoValue {
			font-size: 40rpx;
			font-weight: bold;
			color: #06a0ff;
		}
		.infos {
			position: relative;
			top: 70rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
		.addTallent {
			width: 56rpx;
			height: 48rpx;
			position: relative;
			left: 16rpx;
		}
	}
	.maxLevel {
		padding: 6rpx 14rpx;
		background-color: #02c4ff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 10rpx;
	}
	.clear {
		position: absolute;
		top: 60rpx;
		right: 20rpx;
	}
	.tallentItem {
		width: 100%;
		height: 300rpx;
		padding: 10rpx;
		position: relative;
		top: 120rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
		.item {
			width: 120rpx;
			height: 120rpx;
			border-radius: 30rpx;
			border: 2rpx solid $main-color;
			.itemImg {
				width: 120rpx;
				height: 120rpx;
				border-radius: 30rpx;
			}
			.itemText {
				width: 132rpx;
				color: #ff5500;
				font-size: 32rpx;
				text-align: center;
			}
		}
		.bigTel {
			font-weight: bold;
			box-shadow: #ffaa00 0rpx 0rpx 26rpx 6rpx;
		}
		.zw {
			width: 124rpx;
			height: 124rpx;
		}
	}
}

</style>