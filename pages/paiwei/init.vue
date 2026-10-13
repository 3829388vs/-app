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
		<image class="reward" src="../../static/imgs/mapObjs/bigbox.png" @click="reward"></image>
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
				this.img = 'cfds.png'
			}
			if(this.userInfo.pwlv == 7){
				this.img = 'zqwz.png'
			}
			if(this.userInfo.pwlv > 7){
				this.img = 'dianfengshai.png'
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
		reward() {
			if(parseInt(this.userInfo.pwlv) >= 5){
				let myToolList = JSON.parse(uni.getStorageSync('tanxianPack'))
				let has = false
				myToolList.forEach(i=>{
					if(i.name == '云霄龙魂'){
						has = true
					}
				})
				if(!has){
					uni.showToast({
						title: '获得【云霄龙魂】',
						icon:'none',
						duration: 2000
					});
					myToolList.push({"id":new Date().getTime(),"name":"云霄龙魂","gj": 0,"fy": 0,"fs": 0,"flz": 0,"speed": 5,"img":"yunxiaolh.png","icon":"yunxiaolh.png","detail":"手动触发该龙魂后，提升英雄移动速度120，持续12秒，并永久提升5移动速度。","price":0,"istool":1})
					uni.setStorageSync('tanxianPack',JSON.stringify(myToolList))
				}
			}
			if(parseInt(this.userInfo.pwlv) == 7){
				let myToolList = JSON.parse(uni.getStorageSync('myStore'))
				let has = false
				myToolList.forEach(i=>{
					if(i.name == '王者羽翼'){
						has = true
					}
				})
				if(!has){
					uni.showToast({
						title: '获得【王者羽翼】【王者相框】',
						icon:'none',
						duration: 2000
					});
				
					myToolList.push({
						id: new Date().getTime(),
						name: '王者羽翼',
						details: '王者羽翼。装备后可提升移动速度30%，防御力提升50',
						icon: 'wangzheyy.png',
						buyTime: new Date().getTime(),
						fy: 50,
						speed: 0.4,
						istool:0,
						isOther: true,
						price: 10000
					})
					myToolList.push({"id":new Date().getTime()+1,"buyTime": new Date().getTime(),"name":"王者像框","isOther":true,"icon":"wzCircle.png","details":"王者像框","price":10000,"istool":0})
					uni.setStorageSync('myStore',JSON.stringify(myToolList))
				}else{
					uni.showToast({
						title: '你已经领取过王者羽翼和相框',
						icon:'none',
						duration: 1500
					});
				}
			}
			if(parseInt(this.userInfo.pwlv) == 8){
				let myToolList = JSON.parse(uni.getStorageSync('myStore'))
				let has = false
				myToolList.forEach(i=>{
					if(i.name == '嗜血恶魔羽翼'){
						has = true
					}
				})
				if(!has){
					uni.showToast({
						title: '获得【嗜血恶魔羽翼】',
						icon:'none',
						duration: 2000
					});
				
					myToolList.push({
						id: new Date().getTime(),
						name: '嗜血恶魔羽翼',
						details: '嗜血恶魔羽翼。装备后可提升移动速度40%，防御力提升75',
						icon: 'shixueemoyy.png',
						buyTime: new Date().getTime(),
						fy: 75,
						speed: 0.4,
						istool:0,
						isOther: true,
						price: 15000
					})
					uni.setStorageSync('myStore',JSON.stringify(myToolList))
				}else{
					uni.showToast({
						title: '你已经领取过嗜血恶魔羽翼',
						icon:'none',
						duration: 1500
					});
				}
			}
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
				lv = '超凡大师'
			}
			if(level == 7) {
				lv = '最强王者'
			}
			if(level > 7) {
				lv = '巅峰王者'
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
		.reward {
			position: absolute;
			right: 50rpx;
			bottom: 50rpx;
			width: 140rpx;
			height: 130rpx;
		}
	}
</style>