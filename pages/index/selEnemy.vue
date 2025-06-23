<template>
	<view class="container">
		<view class="title">
			<label>请选择要挑战的人物</label>
		</view>
		<view class="sel">
			<scroll-view scroll-y="true" class="scroll-Y">
				<view class="roles">
					<view class="item" v-for="item in heroList" :key="item.id">
						<view class="left" @click="sel(item)">
							<image class="icon" :src="'../../static/imgs/'+item.icon"></image>
							<view class="heroName">{{ item.name }}</view>
							<view class="heroName">
								<image style="width: 32rpx;height: 32rpx;" src="../../static/imgs/core.png"></image>
								{{ item.money }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import res from '../../static/data/challegeEnemy.json'
import { editMoney } from '../../utils/editUser'
export default {
	data() {
		return {
			showInfo: false,
			heroList: [],
			tallentList: [],
			type: '',
			innerAudioContext: null,
		}
	},
	mounted() {
		this.getHeros();
	},
	onLoad(option) {
		this.type = uni.getStorageSync('gameType')
	},
	methods: {
		close() {
			this.showInfo = false
		},
		getHeros() {
			const self = this
					let resp = [...res.data]
					self.heroList = []
					let list = resp.slice()
					list.forEach(item=>{
						if(item.level == 101){
							self.heroList.push(item)
						}
					})
			// uniCloud.callFunction({
			// 	name: 'getChallegeEnemy'
			// }).then((res) => {
			// 	if(res.result.data.length == 0){
			// 		uni.showToast({
			// 			title: '网络连接失败，请检查网络',
			// 			icon:'error',
			// 			duration: 1200
			// 		});
			// 	}else {
			// 		self.heroList = []
			// 		let list = res.result.data.slice()
			// 		list.forEach(item=>{
			// 			if(item.level == 101){
			// 				self.heroList.push(item)
			// 			}
			// 		})
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
			let self = this
			uni.showModal({
				title: '提示',
				content: '挑战该英雄需要花费'+parseInt(item.money/2)+'，确定要挑战吗？',
				success: function (r) {
					if (r.confirm) {
						if(editMoney(-parseInt(item.money/2))){
							uni.redirectTo({
								url: "/pages/selRole/index?enemy="+JSON.stringify(item)
							})
						}
					} else if (r.cancel) {
						
					}
				}
			})
			
		},
		playVoice(url) {
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.volume = 0.2
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
			padding: 0px 26rpx;
			padding-top: 70rpx;
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
			.item {
				width: 200rpx;
				padding: 20rpx 0rpx;
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
}
</style>