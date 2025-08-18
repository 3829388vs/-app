<template>
	<view class="container">
		<view class="title">
			<label>请选择英雄</label>
		</view>
		<view class="sel">
			<scroll-view scroll-y="true" class="scroll-Y">
				<view class="roles">
					<view class="item" v-for="item in heroList" :key="item.id">
						<view class="left" @click="sel(item)">
							<image :class="{'icon':true,'dead':item.isLive == 0}" :src="'../../static/imgs/hero/'+item.icon"></image>
							<view :class="{'heroName':true,'deadText':item.isLive == 0}">{{ item.name }}{{item.isLive == 0?'（已阵亡）':'' }}</view>
						</view>
						<view class="right" @click="sel(item)">
							<view class="text">
								<label>攻击力：{{ item.gj }}</label>
							</view>
							<view class="text">
								<label>法术强度：{{ item.fs }}</label>
							</view>
							<view class="text">
								<label>防御：{{ item.fy }}</label>
							</view>
							<view class="text">
								<label>生命值：{{ item.blood }}</label>
							</view>
						</view>
						<view class="info" @click="toInfo(item.id)">
							技能详情
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="sel" style="width: 94%;height: 70%;position: absolute;top: 20%;" v-if="showInfo">
			<view class="close" @click="close">×</view>
			<view class="roleInfo">
				<view class="tallent">
					<view class="tallentRow">
						<view class="tallentTitle">被动技能：</view>
						<view style="background-color: rgba(255, 255, 255, 0.15);padding: 0rpx 16rpx;">
							<view class="name">{{ tallentList[0].name }}</view>
							<view class="textInfo">{{ tallentList[0].text }}</view>
						</view>
					</view>
					<view class="tallentRow" v-for="item in tallentList.slice(1)" :key="item.name">
						<view>
							<view class="name">{{ item.name }}</view>
							<view class="textInfo">{{ item.text }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import res from '../../static/data/heroList.json'
export default {
	data() {
		return {
			showInfo: false,
			heroList: [],
			tallentList: [],
			myStoreHero: [],
			type: '',
			innerAudioContext: null,
			enemy: null,
		}
	},
	mounted() {
		let self = this
		if(uni.getStorageSync('myStore')){
			self.myStore = JSON.parse(uni.getStorageSync('myStore'))
		}else{
			let store = []
			uni.setStorageSync('myStore',JSON.stringify(store));
		}
		let mys = JSON.parse(uni.getStorageSync('myStore'))
		if(mys.length != 0){
			mys.forEach((i,d)=>{
				if(!i.isOther){
					if(new Date().getTime() < parseInt(i.buyTime) + 3*24*60*60*1000){
						self.myStoreHero.push(i)
					}else{
						mys.splice(d,1)
						uni.setStorageSync('myStore',JSON.stringify(mys));
					}
				}
			})
		}
		self.getHeros();
	},
	onLoad(option) {
		this.type = uni.getStorageSync('gameType')
		if(this.type == 'fuben') {
			this.enemy = JSON.parse(option.enemy)
		}
		let resp = [...res.data]
		let heroAddData = []
		if(!uni.getStorageSync('heroAddData')){
			resp.forEach(item=>{
				heroAddData.push({
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
			})
			uni.setStorageSync('heroAddData',JSON.stringify(heroAddData))
		}
	},
	methods: {
		close() {
			this.showInfo = false
		},
		getHeros() {
			let resp = [...res.data]
			let list = resp.slice()
			JSON.parse(uni.getStorageSync('heroAddData')).forEach(i=>{
				if(i.isLive == 0){
					list.forEach((it,idx)=>{
						if(i.id == it.id){
							list[idx].isLive = 0
						}
					})	
				}else if(i.isLive == 1){
					list.forEach((it,idx)=>{
						if(i.id == it.id){
							list[idx].isLive = 1
						}
					})	
				}
			})
			this.heroList = [...list].concat(this.myStoreHero)
			// uniCloud.callFunction({
			// 	name: 'getHeros'
			// }).then((res) => {
			// 	if(res.result.data.length == 0){
			// 		uni.showToast({
			// 			title: '网络连接失败，请检查网络',
			// 			icon:'error',
			// 			duration: 1200
			// 		});
			// 	}else {
			// 		self.heroList = res.result.data.slice()
			// 	}
			// 	uni.hideLoading();
			// }).catch((err) => {
			// 	uni.hideLoading();
			// 	uni.showToast({
			// 		title: '登录失败！请检查网络',
			// 		icon:'error',
			// 		duration: 1200
			// 	});
			// })
		},
		toInfo(id) {
			this.showInfo = true
			this.heroList.forEach(item=>{
				if(item.id == id) {
					this.tallentList = item.tallent
				}
			})
		},
		sel(item) {
			if(item.isLive == 0){
				uni.showToast({
					title: '该英雄已阵亡，请到我的背包进行复活',
					icon:'none',
					duration: 2500
				});
				return
			}
			//如果新英雄没有存进内存
			let hasId = false
			let data = JSON.parse(uni.getStorageSync('heroAddData'))
			data.forEach((it,idx)=>{
				if(it.id == item.id){
					hasId = true
					//选择的英雄皮肤过期
					if(data[idx].strongIndex){
						if(new Date().getTime() > parseInt(data[idx].strongDeadTime) + 3*24*60*60*1000){
							data[idx].strongIndex = null
							data[idx].strongDeadTime = null
						}
					}
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
			
			if(this.type == 'fuben') {
				uni.redirectTo({
					url: "/pages/play/load?item="+JSON.stringify(item)+'&enemy='+JSON.stringify(this.enemy)
				})
			}else{
				uni.redirectTo({
					url: "/pages/play/load?item="+JSON.stringify(item)
				})
			}
			
		},
		playVoice(url) {
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.volume = 0.3
			this.innerAudioContext.src = url
			this.innerAudioContext.autoplay = true;
		},
	},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background: url('../../static/imgs/bg4.jpg');
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
	.sel {
		width: 100%;
		height: 80%;
		position: relative;
		top: 5%;
		background: url('../../static/imgs/selRole.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.close {
			position: absolute;
			left: 92%;
			font-size: 56rpx;
			color: #ffffff;
		}
		.scroll-Y {
			height: 78vh;
		}
		.roles {
			width: 100%;
			padding: 0px 20rpx;
			padding-top: 70rpx;
			display: flex;
			flex-wrap: wrap;
			.item {
				width: 94%;
				padding: 20rpx 0rpx;
				display: flex;
				// background-color: rgba(255, 255, 255, 0.2);
				border-bottom: 2rpx solid #888888;
				.left {
					width: 40%;
					position: relative;
					top: 10rpx;
					left: 26rpx;
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
				.dead {
					opacity: 0.3;
				}
				.deadText {
					color: #828282 !important;
				}
				.heroName {
					padding-top: 12rpx;
					color: $main-color;
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
						font-size: 30rpx;
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
}

</style>