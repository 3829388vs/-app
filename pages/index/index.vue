<template>
	<view>
		<!-- <wrap-version-update id="464125186666565" @check="checkVersion"></wrap-version-update> -->
		<view class="container">
			<image class="bgImg" :src="'../../static/imgs/'+bgImg"></image>
			<view class="login" v-if="!isLogin">
				<view class="row">
					<label class="name">账号</label>
					<input class="loginInput" v-model="userInfo.name" />
				</view>
				<view class="row">
					<label class="name">密码</label>
					<input class="loginInput" type="password" v-model="userInfo.passWord" />
				</view>
				<view class="row">
					<view class="loginBtn" @click="submitLogin"></view>
				</view>
			</view>
			<view v-else-if="!selModel">
				<view class="top">
					<view style="display: flex;">
						<image class="avat" src="../../static/imgs/avat.png"></image>
						<span style="color: #00ff7f;font-weight: bold;font-size: 38rpx;padding: 20rpx;">{{userInfo.name}}</span></view>
					<view style="padding-left: 50rpx;padding-top: 20rpx;">
						<image class="core" src="../../static/imgs/core.png"></image>
						<span style="color: #ff7700;font-weight: bold;padding: 0rpx 10rpx;font-size: 38rpx;">{{userInfo.money}}</span>
					</view>
					<view style="padding-left: 50rpx;padding-top: 20rpx;">
						<span>等级：</span>
						<span style="color: #ff0000;font-weight: bold;padding: 0rpx 10rpx;font-size: 42rpx;">{{userInfo.lv}}</span>
					</view>
					<view style="padding-left: 30rpx;padding-top: 20rpx;display: flex;">
						<span>经验：</span>
						<view class="exp">
							<view style="position: absolute;left: 45%;">{{userInfo.e}}/{{exp}}</view>
							<view class="exp2" :style="{'width': expWid+'rpx'}"></view>
						</view>
					</view>
				</view>
				<view class="menu">
					<view class="selRow">
						<view class="btns play" @click="play"></view>
					</view>
					<view class="selRow">
						<view class="btns store" @click="store"></view>
					</view>
					<view class="selRow">
						<view class="btns packs" @click="packs"></view>
					</view>
					<view class="selRow">
						<view class="btns info" @click="info"></view>
					</view>
					<!-- <view class="selRow">
						<view class="back" @click="back"></view>
					</view> -->
				</view>
			</view>
			<view class="menu" v-if="selModel">
				<view class="selModel">
					请选择游戏模式：
				</view>
				<view v-if="isChallenge">
					<view class="selRow">
						<view class="btns match" @click="match('match')"></view>
					</view>
					<view class="selRow">
						<view class="btns fuben" @click="match('fuben')"></view>
					</view>
					<view class="selRow">
						<view class="btns challenge" @click="match('challenge')"></view>
					</view>
					<view class="selRow">
						<view class="btns paiwei" @click="match('paiwei')"></view>
					</view>
					<view class="selRow">
						<view class="btns back" @click="back"></view>
					</view>
				</view>
				<view v-else>
					<view class="selRow">
						<view class="btns tianti" @click="match('tianti')"></view>
					</view>
					<view class="selRow">
						<view class="btns jinbiao" @click="match('jinbiao')"></view>
					</view>
					<view class="selRow">
						<view class="btns shijiebei" @click="match('shijiebei')"></view>
					</view>
					<view class="selRow">
						<view class="btns wuxian" @click="match('wuxian')"></view>
					</view>
					<view class="selRow">
						<view class="btns back" @click="back"></view>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>
<script>
	// import WrapVersionUpdate from '@/uni_modules/wrap-version-update/components/wrap-version-update/wrap-version-update.nvue'
	import res from '../../static/data/users.json'
	import res2 from '../../static/data/exp.json'
	export default {
		data() {
			return {
				userInfo: {
					name: '',
					passWord: '',
					money: 0,
					e: 0,
					lv: 1,
					pwlv: 1,
					pwE: 6
				},
				exp: 0,
				expWid: 0,
				isLogin: false,
				selModel: false,
				bgImg: 'index.jpg',
				bgSize: 'cover',
				isChallenge: true
			}
		},
		mounted() {
			// this.lockOrientation('landscape')
		},
		onLoad(option){
			if(option.isLogin){
				this.isLogin = true
				this.selModel = true
				if(uni.getStorageSync('user')){
					this.userInfo = JSON.parse(uni.getStorageSync('user'))
					this.getUserInfo()
				}
				if(!uni.getStorageSync('myStore')){
					let store = []
					uni.setStorageSync('myStore',JSON.stringify(store));
				}
			}
			if (typeof plus !== 'undefined' && typeof plus.screen !== 'undefined') {
				plus.screen.lockOrientation("portrait")
			}
		},
		// components: {
		// 	WrapVersionUpdate
		// },
		methods: {
			//  lockOrientation(orientation) {
			//   if (typeof plus !== 'undefined' && typeof plus.screen !== 'undefined') {
			// 	plus.screen.lockOrientation(orientation)
			//   }
			// }
			submitLogin() {
				const self = this
				let resp = [...res.data]
				resp.forEach(item=>{
					if(item.name == self.userInfo.name && item.password == self.userInfo.passWord){
						if(!uni.getStorageSync('user')){
							uni.setStorageSync('user',JSON.stringify(resp[0]));
							self.userInfo = {...resp[0]}
						}else{
							self.userInfo = {...JSON.parse(uni.getStorageSync('user'))}
						}
						this.getUserInfo()
						self.isLogin = true
						return
					}
				})
			},
				// uniCloud.callFunction({
				// 	name: 'login',
				// 	data: {
				// 		name: self.userInfo.name,
				// 		password: self.userInfo.passWord
				// 	}
				// }).then((res) => {
				// 	if(res.result.data.length == 0){
				// 		uni.showToast({
				// 			title: '账号或密码错误，请重新输入',
				// 			icon:'error',
				// 			duration: 1200
				// 		});
				// 	}else {
				// 		uni.setStorageSync('user',JSON.stringify(res.result.data[0]));
				// 		self.userInfo = {...res.result.data[0]}
				// 		self.isLogin = true
				// 		uniCloud.callFunction({
				// 			name: 'setLogin',
				// 			data: {
				// 				num: res.result.data[0].num,
				// 				id: res.result.data[0]._id
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
			getUserInfo() {
				if(!this.userInfo.lv){
					this.userInfo.lv = 1
					this.userInfo.e = 0
				}
				res2.data.map(i=>{
					if(i.lv == this.userInfo.lv){
						this.exp = parseInt(i.e)
					}
				})
				this.expWid = parseFloat(this.userInfo.e/this.exp) * 500
			},
			play() {
				this.selModel = true
				this.bgImg = 'bg2.jpeg?'+ new Date().getTime()
				this.bgSize = '100%'
			},
			store() {
				uni.redirectTo({
					url: "/pages/index/store"
				})
			},
			packs() {
				uni.redirectTo({
					url: "/pages/mypakeage/index"
				})
			},
			info() {
				
			},
			match(type) {
				if(type == 'challenge'){
					this.isChallenge = false
					return
				}
				uni.setStorageSync('gameType', type);
				if(type == 'tianti'){
					uni.redirectTo({
						url: "/pages/tianti/index"
					})
					return
				}
				if(type == 'fuben'){
					setTimeout(()=>{
						uni.redirectTo({
							url: "/pages/index/selEnemy"
						})
					},150)
					return
				}
				if(type == 'paiwei'){
					setTimeout(()=>{
						uni.redirectTo({
							url: "/pages/paiwei/init"
						})
					},150)
					return
				}
				setTimeout(()=>{
					uni.redirectTo({
						url: "/pages/selRole/index"
					})
				},150)

			},
			challenge() {
				
			},
			fuben() {
				
			},
			back() {
				const self = this
				this.isChallenge = true
				self.selModel = false
				// uni.showLoading({
				// 	title: '加载中'
				// });
				// uniCloud.callFunction({
				// 	name: 'getUser',
				// 	data: {
				// 		name: JSON.parse(uni.getStorageSync('user')).name,
				// 	}
				// }).then((res) => {
				// 	uni.setStorageSync('user',JSON.stringify(res.result.data[0]));
				// 	self.userInfo = {...res.result.data[0]}
				// 	self.selModel = false
				// 	uni.hideLoading();
				// })
			},
			checkVersion(v) {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	// background-size: cover;
	// background-repeat: no-repeat;
	.bgImg {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		object-fit: cover;
		z-index: 1;
	}
	.login {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 95%;
		z-index: 2;
		.row {
			display: flex;
			margin: 30rpx 0rpx;
			z-index: 2;
			.name {
				color: #aa1313;
				font-size: 38rpx;
				padding-right: 30rpx;
			}
			.loginInput {
				background-color: rgba(0,0,0,0);
				border-bottom: 2rpx solid #939393;
				padding: 6rpx 10rpx;
				color: #2f2f2f;
			}
			.loginBtn {
				width: 320rpx;
				height: 126rpx;
				margin-top: 20rpx;
				background: url("../../static/imgs/loginGame.png") no-repeat;
				background-size: cover;
			}
			.loginBtn:hover {
				width: 320rpx;
				height: 126rpx;
				margin-top: 20rpx;
				background: url("../../static/imgs/btn_act.png") no-repeat;
				background-size: cover;
			}
		}
	}
	.top {
		color: #303030;
		font-size: 34rpx;
		position: absolute;
		display: flex;
		flex-wrap: wrap;
		top: 18rpx;
		left: 20rpx;
		z-index: 2;
		.avat {
			width: 100rpx;
			height: 100rpx;
		}
		.core {
			width: 60rpx;
			height: 60rpx;
		}
	}
	.exp {
		width: 500rpx;
		height: 46rpx;
		border: 2rpx solid #343434;
		border-radius: 8rpx;
		font-weight: bold;
		font-size: 32rpx;
		text-align: center;
		color: #000000;
	}
	.exp2 {
		height: 46rpx;
		background-color: #55ff00;
		border-radius: 8rpx;
	}
	.menu {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 26%;
		z-index: 2;
		.selRow {
			display: flex;
			margin: 26rpx 0rpx;
			z-index: 3;
			.btns {
				width: 390rpx;
				height: 150rpx;
				z-index: 3;
			}
			.play {
				background: url("../../static/imgs/play.png") no-repeat;
				background-size: cover;
			}
			.play:hover {
				background: url("../../static/imgs/play_act.png") no-repeat;
				background-size: cover;
			}
			.store {
				background: url("../../static/imgs/store.png") no-repeat;
				background-size: cover;
			}
			.store:hover {
				background: url("../../static/imgs/store_act.png") no-repeat;
				background-size: cover;
			}
			.packs {
				background: url("../../static/imgs/pack.png") no-repeat;
				background-size: cover;
			}
			.packs:hover {
				background: url("../../static/imgs/pack_act.png") no-repeat;
				background-size: cover;
			}
			.info {
				background: url("../../static/imgs/info.png") no-repeat;
				background-size: cover;
			}
			.info:hover {
				background: url("../../static/imgs/info_act.png") no-repeat;
				background-size: cover;
			}
			.back {
				background: url("../../static/imgs/back2.png") no-repeat;
				background-size: cover;
			}
			.back:hover {
				background: url("../../static/imgs/back2_act.png") no-repeat;
				background-size: cover;
			}
			.match {
				background: url("../../static/imgs/match.png") no-repeat;
				background-size: cover;
			}
			.match:hover {
				background: url("../../static/imgs/match_act.png") no-repeat;
				background-size: cover;
			}
			.fuben {
				background: url("../../static/imgs/fuben.png") no-repeat;
				background-size: cover;
			}
			.fuben:hover {
				background: url("../../static/imgs/fuben_act.png") no-repeat;
				background-size: cover;
			}
			.challenge {
				background: url("../../static/imgs/challenge.png") no-repeat;
				background-size: cover;
			}
			.challenge:hover {
				background: url("../../static/imgs/challenge_act.png") no-repeat;
				background-size: cover;
			}
			.paiwei {
				background: url("../../static/imgs/paiwei.png") no-repeat;
				background-size: cover;
			}
			.paiwei:hover {
				background: url("../../static/imgs/paiwei_act.png") no-repeat;
				background-size: cover;
			}
			.tianti {
				background: url("../../static/imgs/tianti.png") no-repeat;
				background-size: cover;
			}
			.jinbiao {
				background: url("../../static/imgs/jinbiao.png") no-repeat;
				background-size: cover;
			}
			.shijiebei {
				background: url("../../static/imgs/shijiebei.png") no-repeat;
				background-size: cover;
			}
			.wuxian {
				background: url("../../static/imgs/wuxian.png") no-repeat;
				background-size: cover;
			}
		}
		.selModel {
			width: 100%;
			font-size: 56rpx;
			text-align: center;
			padding-bottom: 30rpx;
			color: #aa1313;
			font-weight: bold;
			z-index: 2;
			// #FFFFCA
		}
	}
}
  
</style>