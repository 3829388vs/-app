<template>
	<view class="container">
		<view class="levelText2">{{levelFilter(userInfo.pwlv)}}</view>
		<view style="width: 100%;display: flex;justify-content: center;padding-top: 200rpx">
			<image class="level" :src="'../../static/imgs/paiwei/'+img"></image>
		</view>
		<view class="levelText">等级：{{userInfo.pwE}}</view>
		<view style="width: 100%;display: flex;justify-content: center;margin-top: 200rpx;">
			<button style="width: 300rpx;" type="warn" @click="begin">开始排位</button>
		</view>
		<button style="width: 300rpx;margin-top: 30rpx;" type="primary" @click="back">返回菜单</button>
	</view>
</template>

<script>

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
				pwE: 0
			},
			img: 'ht.png'
		}
	},
	onLoad(option){
		if(option){
			if(uni.getStorageSync('user')){
				this.userInfo = JSON.parse(uni.getStorageSync('user'))
				this.getUserInfo()
			}
		}
	},
	methods: {
		getUserInfo() {
			this.userInfo.pwE = this.pweFilter()
			if(this.userInfo.pwlv == 1){
				this.img = 'ht.png'
			}
			if(this.userInfo.pwlv == 2){
				this.img = 'by.png'
			}
			if(this.userInfo.pwlv == 3){
				this.img = 'hj.png'
			}
			if(this.userInfo.pwlv == 4){
				this.img = 'bj.png'
			}
			if(this.userInfo.pwlv == 5){
				this.img = 'zs.png'
			}
			if(this.userInfo.pwlv == 6){
				this.img = 'zqwz.png'
			}
		},
		pweFilter() {
			let i = this.userInfo.pwE
			switch(i){
				case 0 : return 'V'; break;
				case 1 : return 'IV'; break;
				case 2 : return 'III'; break;
				case 3 : return 'II'; break;
				case 4 : return 'I'; break;
				case 5 : return '待晋级'; break;
			}
		},
		begin() {
			uni.removeStorageSync('paiweiEnemy');
			uni.removeStorageSync('paiweiHero');
			uni.setStorageSync('paiweiTime',0)

			setTimeout(()=>{
				uni.redirectTo({
					url: "/pages/paiwei/index"
				})
			},150)
		},
		back() {
			uni.redirectTo({
				url: "/pages/index/index?isLogin=1"
			})
		},
			
		levelFilter(level) {
			let lv = '英勇黄铜'
			if(level == 1) {
				lv = '英勇黄铜'
			}
			if(level == 2) {
				lv = '不屈白银'
			}
			if(level == 3) {
				lv = '荣耀黄金'
			}
			if(level == 4) {
				lv = '华贵铂金'
			}
			if(level == 5) {
				lv = '翡翠钻石'
			}
			if(level == 6) {
				lv = '最强王者'
			}
			return lv
		},
		//真随机（限1-5)
		reallyRandom(Min,Max){
		  var Range = Max - Min;
		  var time = new Date().getTime().toString().slice(-1)
		  if(Range == 0){
			  return 0
		  }
		  if(Range == 1){
			  if(parseInt(time)<5){
				  return Min
			  }else{
				  return Max
			  }
		  }
		  if(Range == 2){
			  if(parseInt(time)<3){
				  return 0
			  }else if(parseInt(time)<6 && parseInt(time)>=3){
				  return 1
			  }else{
				  return 2
			  }
		  }
		  if(Range == 3){
			  if(parseInt(time)<2){
				  return 0
			  }else if(parseInt(time)<4 && parseInt(time)>=2){
				  return 1
			  }else if(parseInt(time)<6 && parseInt(time)>=4){
				  return 2
			  }else if(parseInt(time)<8 && parseInt(time)>=6){
				  return 3
			  }else{
				  return this.randomNum(0,3)
			  }
		  }
		  if(Range == 4){
			  if(parseInt(time)<2){
				  return 0
			  }else if(parseInt(time)<4 && parseInt(time)>=2){
				  return 1
			  }else if(parseInt(time)<6 && parseInt(time)>=4){
				  return 2
			  }else if(parseInt(time)<8 && parseInt(time)>=6){
				  return 3
			  }else{
				  return 4
			  }
		  }
		  if(Range == 5){
			  if(parseInt(time)<2){
				  return 0
			  }else if(parseInt(time)<4 && parseInt(time)>=2){
				  return 1
			  }else if(parseInt(time)<6 && parseInt(time)>=4){
				  return 2
			  }else if(parseInt(time)<8 && parseInt(time)>=6){
				  return 3
			  }else if(parseInt(time) == 8){
				  return 4
			  }else if(parseInt(time) == 9){
				  return 5
			  }
		  }
		}
	}
}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		background: url("../../static/imgs/paiwei/index.jpeg") no-repeat;
		background-size: cover;
		.level {
			width: 80%;
		}
		.levelText {
			font-size: 42rpx;
			text-align: center;
			color: #393939;
			font-weight: bold;
			margin-top: 30rpx;
		}
		.levelText2 {
			font-size: 52rpx;
			letter-spacing: 4rpx;
			text-align: center;
			color: #ffdb0e;
			position: relative;
			top: 160rpx;
		}
	}
</style>