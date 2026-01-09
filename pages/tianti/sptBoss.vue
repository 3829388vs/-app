<template>
	<view class="container">
		<view class="back">
			<button @click="back" size="mini">返回</button>
		</view>
		<view class="main">
			<view class="bossItem">
				<view class="left" @click="changeBoss(0)"></view>
				<view class="bossIcon">
					<view class="star">
						<image class="starImg" :src="'../../static/imgs/star'+startNum()+'.png'" v-for="indx in selBoss.levelNum" :key="indx"></image>
					</view>
					<image class="bossIconImg" :style="{'opacity': opacity}" :src="'../../static/imgs/'+selBoss.icon"></image>
				</view>
				<view class="right" @click="changeBoss(1)"></view>
			</view>
			<view class="name">
				{{selBoss.name}}
			</view>
			<view class="details">
				<view class="details-text">
					{{selBoss.details}}
				</view>
			</view>
			<view class="btn">
				<image class="btnImg" src="../../static/imgs/challengeBoss.png" @click="begin"></image>
			</view>
		</view>
	</view>
</template>

<script>
import res from '../../static/data/challegeEnemy.json'
export default {
	data() {
		return {
			boss: [],
			selBoss: {},
			index: 0,
			opacity: 1,
			innerAudioContext: null
		}
	},
	onLoad(option) {
		//遍历boss
		let li = []
		res.data.map(item=>{
			if(parseInt(item.level) >=1000){
				li.push(item)
			}
		})
		this.boss = [...li]
		this.selBoss = this.boss[0]
	},
	methods:{
		changeBoss(type) {
			//左
			if(type == 0){
				if(this.index > 0){
					this.index -= 1
					this.opacity = 0
					this.playVoice()
				}
			}else{	//右
				if(this.index < this.boss.length - 1){
					this.index += 1
					this.opacity = 0
					this.playVoice()
				}
			}
			setTimeout(()=>{
				this.opacity = 1
				this.selBoss = this.boss[this.index]
			},500)
		},
		startNum() {
			let num = ''
			if(this.selBoss.levelNum >= 4 && this.selBoss.levelNum < 5){
				num = 2
			}
			if(this.selBoss.levelNum >= 5){
				num = 3
			}
			return num
		},
		back() {
			uni.redirectTo({
				url: "/pages/index/index?isLogin=true"
			})
		},
		begin() {
			let self = this
			uni.showModal({
				title: '提示',
				content: '确定要挑战'+self.selBoss.name+'吗？',
				success: function (r) {
					if (r.confirm) {
						uni.setStorageSync('sptBoss',JSON.stringify(self.selBoss))
						uni.redirectTo({
							url: "/pages/tianti/index"
						})
					} else if (r.cancel) {
						
					}
				}
			});
		},
		playVoice() {
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.volume = 0.5
			this.innerAudioContext.src = '../../static/sounds/changeTab.wav'
			this.innerAudioContext.play()
			setTimeout(()=>{
				if (this.innerAudioContext) {
				  try {
					this.innerAudioContext.pause();
					this.innerAudioContext.destroy()
					this.innerAudioContext = null
				  } catch (e) {
					//TODO handle the exception
				  }
				}
			},900)
		},
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	background: url('../../static/imgs/bossBg.png');
	background-size: cover;
	background-repeat: no-repeat;
	box-sizing: border-box;
	text-align: center;
	font-size: 42rpx;
	padding: 12rpx;
}
.back {
	position: absolute;
	left: 30rpx;
	top: 50rpx;
}
.main {
	width: 100%;
	height: 900rpx;
}
.bossItem {
	width: 100%;
	height: 550rpx;
	display: flex;
	justify-content: space-between;
}
.left {
	width: 100rpx;
	height: 100rpx;
	position: relative;
	top: 170rpx;
	background: url('../../static/imgs/bossleft.png');
	background-size: cover;
	background-repeat: no-repeat;
}
.right {
	width: 100rpx;
	height: 100rpx;
	position: relative;
	top: 170rpx;
	background: url('../../static/imgs/bossRight.png');
	background-size: cover;
	background-repeat: no-repeat;
}
.bossIcon {
	width: 500rpx;
	height: 500rpx;
	background: url('../../static/imgs/bossIconBg.png');
	background-size: cover;
	background-repeat: no-repeat;
}
.bossIconImg {
	width: 326rpx;
	height: 326rpx;
	border-radius: 32rpx;
	box-shadow: 0px 0px 12rpx 8rpx #513300;
	transition: opacity 0.6s ease;
}
.star {
	width: 100%;
	display: flex;
	justify-content: center;
	height: 84rpx;
	padding-top: 2rpx;
}
.starImg {
	width: 50rpx;
	height: 50rpx;
	margin-left:6rpx;
	z-index: 9;
}
.name {
	margin-top: -106rpx;
	color: #ff7700;
	font-size: 38rpx;
	font-weight: bold;
}
.btn {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 30rpx;
}
.btnImg {
	width: 280rpx;
	height: 86rpx;
}
.details {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 26rpx;
}
.details-text {
	width: 75%;
	height: 250rpx;
	background-color: rgba(25, 25, 25, 0.7);
	color: #eebb00;
	border-radius: 12rpx;
	font-size: 32rpx;
	padding: 18rpx 14rpx;
	text-align: left;
}
</style>