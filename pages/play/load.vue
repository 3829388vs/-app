<template>
	<view class="container" :style="{'background': 'url('+require('../../static/imgs/'+bgImg)+')','background-size': 'cover','background-repeat':'no-repeat'}">
		<view class="vsInfo" v-if="showVS">
			<view class="enemyInfo">
				<view>
					<image class="enemyInfoImg" :src="'../../static/imgs/'+match.icon"></image>
					<view class="heroName">{{match.name}}</view>
				</view>
			</view>
			<view class="vslogo">
				<image class="vslogoImg" src="../../static/imgs/vslogo.png"></image>
			</view>
			<view class="enemyInfo">
				<view class="head">
					<image class="enemyInfoImg heroInfoImg" :src="'../../static/imgs/hero/'+myHero.icon"></image>
					<view class="heroName myheroText">{{myHero.name}}</view>
				</view>
			</view>
		</view>
		
		<view class="tips">
			<view class="text">
				{{tip}}
			</view>
		</view>
		<view class="loadText">
			<label>资源加载中...{{percent}}%</label>
		</view>
	</view>
</template>

<script>
	import res from '../../static/data/enemy.json'
	import res2 from '../../static/data/challegeEnemy.json'
	import res3 from '../../static/data/heroList.json'
	import res4 from '../../static/data/goods.json'
	import heroStrongList from '../../static/data/heroStrong.json'
export default {
	data() {
		return {
			bgImg: 'load1.jpg',
			percent: 0,
			tip: '',
			time: null,
			myHero: {},
			type: '',
			enmList: [],
			match: {},
			showVS: true
		}
	},
	mounted() {
		this.loading()
		let type = uni.getStorageSync('gameType')
		if(type == 'match') {
			this.type = '匹配模式'
			this.getEnmList()
		}
		if(type == 'fuben') {
			this.type = '副本模式'
		}
		if(type == 'tianti') {
			this.type = '天梯模式'
		}
		if(type == 'shijiebei') {
			this.type = '世界杯'
			this.getWorldcupEnmList()
		}
		if(type == 'wuxian') {
			this.type = '无限战争'
			this.getWxEnmList()
		}
		if(type == 'jinbiao') {
			this.type = '锦标赛模式'
			this.getJBEnmList()
		}
		if(type == 'spt'){
			this.match = JSON.parse(uni.getStorageSync('sptBoss'))
			this.myHero = JSON.parse(uni.getStorageSync('tiantiHero'))[0]
		}
		if(uni.getStorageSync('gameType') == 'paiwei' || uni.getStorageSync('gameType') == 'tianti'){
			this.showVS = false
		}
	},
	created() {
		let random = this.randomNum(1,5)
		let random2 = this.randomNum(1,5)
		if(random == 1){
			this.bgImg = 'load1.jpg'
		}
		if(random == 2){
			this.bgImg = 'load2.png'
		}
		if(random == 3){
			this.bgImg = 'load3.jpg'
		}
		if(random == 4){
			this.bgImg = 'load4.jpg'
		}
		if(random2 == 1){
			this.tip = '技能属于物理伤害的英雄出物理装备，反之魔法伤害也如此'
		}
		if(random2 == 2){
			this.tip = '每场战斗都会积累金币，金币可前往游戏商城购买道具和英雄'
		}
		if(random2 == 3){
			this.tip = '每场战斗胜利都会给英雄积累经验，之后可前往我的背包升级英雄技能和属性'
		}
		if(random2 == 4){
			this.tip = '选择英雄时多研究其技能，合理顺序释放技能，这样胜利率就高哦'
		}
		if(random2 == 5){
			this.tip = '开始战斗前的购买装备环节及其重要，合理选择装备能更有效制敌'
		}
		if(this.match.name == '花木兰') {
			this.bgImg = 'load1.png'
		}
		if(this.match.name == '杨贵妃') {
			this.bgImg = 'load2.png'
		}
		if(this.match.name == '齐天大圣') {
			this.bgImg = 'qtdsbg.jpg'
		}
		if(this.match.name == '扫地僧') {
			this.bgImg = 'sds.jpg'
		}
		if(this.match.name == '椿') {
			this.bgImg = 'chun.jpg'
		}
		if(this.match.name == '湫') {
			this.bgImg = 'qiu.jpg'
		}
	},
	onLoad(option) {
		if(option){
			this.myHero = JSON.parse(option.item)
			if(uni.getStorageSync('gameType') == 'fuben' || uni.getStorageSync('gameType') == 'paiwei') {
				this.match = JSON.parse(option.enemy)
			}
			let data = JSON.parse(uni.getStorageSync('heroAddData'))
			data.forEach(it=>{
				if(it.id == this.myHero.id){
					if(it.strongIndex){
						heroStrongList.data.map(i=>{
							if(i.id == it.id && it.strongIndex == i.index){
								this.myHero.icon = i.icon
								this.myHero.name = i.name
							}
						})
					}
				}
			})
		}
	},
	methods: {
		randomNum(Min,Max){
		  var Range = Max - Min;
		  var Rand = Math.random();
		  var num = Min + Math.round(Rand * Range); //四舍五入
		  return num;
		},
		getEnmList() {
			const self = this
			let resp = [...res.data]
			let resp2 = []
			res3.data.concat(res4.data.slice(1)).forEach(item=>{
				if(!item.isOther){
					let ite = {...item}
					ite.gj = parseInt(ite.gj*1.5) + parseInt(ite.fs*0.35)
					ite.fy = parseInt(ite.fy*1.7)
					ite.blood = parseInt(ite.blood*1.2)
					ite.gs = ite.v
					ite.mk = ite.fy
					ite.icon = 'hero/' + ite.icon
					ite.isHero = true
					resp2.push(ite)
				}
			})
			self.enmList = resp.concat(resp2).slice()
			let leng = self.enmList.length
			self.match = {...self.enmList[self.randomNum(0,leng - 1)]}
			// uniCloud.callFunction({
			// 	name: 'getEnList'
			// }).then((res) => {
			// 	this.enmList = res.result.data.slice()
			// 	let leng = this.enmList.length
			// 	this.match = {...this.enmList[this.randomNum(0,leng - 1)]}
			// })
		},
		//世界杯敌人
		getWorldcupEnmList() {
			const self = this
			let resp2 = []
			res3.data.concat(res4.data.slice(1)).forEach(item=>{
				if(!item.isOther){
					let ite = {...item}
					ite.gj = parseInt(ite.gj*1.5) + parseInt(ite.fs*0.35)
					ite.fy = parseInt(ite.fy*1.5)
					ite.blood = parseInt(ite.blood*1.2)
					ite.gs = ite.v
					ite.mk = ite.fy
					ite.speed = 0.9
					ite.icon = 'hero/' + ite.icon
					ite.isHero = true
					resp2.push(ite)
				}
			})
			self.enmList = resp2.slice()
			let leng = self.enmList.length
			self.match = {...self.enmList[self.randomNum(0,leng - 1)]}
		},
		//无限战争的敌人
		getWxEnmList() {
			const self = this
			let resp = [...res2.data]
			let li = []
			resp.forEach(i=>{
				if(i.level == 4){
					li.push(i)
				}
			})
			self.enmList = li.slice()
			let leng = self.enmList.length
			self.match = {...self.enmList[self.randomNum(0,leng - 1)]}
			if(!uni.getStorageSync('wuxianLevel')){
				uni.setStorageSync('wuxianLevel',0)
			}
		},
		getJBEnmList() {
			const self = this
					let resp = [...res2.data]
					self.enmList = resp.slice()
					let list = []
					self.enmList.forEach(item=>{
						if(item.level == 64) {
							list.push(item)
						}
					})
					self.match = {...list[self.randomNum(0,list.length - 1)]}
			// uniCloud.callFunction({
			// 	name: 'getChallegeEnemy'
			// }).then((res) => {
			// 	this.enmList = res.result.data.slice()
			// 	let list = []
			// 	this.enmList.forEach(item=>{
			// 		if(item.level == 32) {
			// 			list.push(item)
			// 		}
			// 	})
			// 	this.match = {...list[this.randomNum(0,list.length - 1)]}
			// })
		},
		loading() {
			let time = null
			let time2 = null
			let time3 = null
			let inttime = 380
			let inttime2 = 280
			if(this.percent < 100){
				if(uni.getStorageSync('gameType') == 'paiwei'){
					inttime = 150
					inttime2 = 120
				}
				time = setInterval(()=>{
					if(this.percent < 18){
						this.percent += 1
					}
				},100)
				time2 = setInterval(()=>{
					if(this.percent >= 18 && this.percent <= 50){
						this.percent += 4
					}
				},inttime2)
				time3 = setInterval(()=>{
					if(this.percent >= 50 && this.percent < 100){
						if(this.percent+9 > 100){
							this.percent = 100
							if(this.type == '天梯模式' || uni.getStorageSync('gameType') == 'spt'){
								setTimeout(()=>{
									uni.redirectTo({
										url: "/pages/tianti/tiantiLandScap"
									})
									time.clearInterval()
									time2.clearInterval()
									time3.clearInterval()
								},800)
							}else{
								setTimeout(()=>{
									uni.redirectTo({
										url: "/pages/play/landScap?item="+JSON.stringify(this.myHero)+'&en='+JSON.stringify(this.match)
									})
									time.clearInterval()
									time2.clearInterval()
									time3.clearInterval()
								},800)
							}
						}else{
							this.percent += 9
						}
					}
				},inttime)
			}
			
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	.tips {
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 10%;
	}
	.text {
		width: 80%;
		height: 100rpx;
		text-align: center;
		padding: 8rpx 18rpx;
		font-size: 34rpx;
		color: #f1f1f1;
		background-color: rgba(0,0,0,0.4);
		border-radius: 16rpx;
	}
	.loadText {
		position: absolute;
		bottom: 36rpx;
		color: #ffff7f;
		right: 50rpx;
	}
	.vsInfo {
		width: 100%;
		.enemyInfo {
			padding: 9% 0rpx;
			display: flex;
			justify-content: center;
			.enemyInfoImg {
				width: 230rpx;
				height: 230rpx;
				border-radius: 26rpx;
				box-shadow: #ff4305 0rpx 0rpx 26rpx 6rpx;
			}
			.heroInfoImg {
				box-shadow: #ffaa00 0rpx 0rpx 26rpx 6rpx;
			}
			.heroName {
				text-align: center;
				color: #ff1f02;
				font-weight: bold;
				font-size: 42rpx;
				padding-top: 12rpx;
			}
			.myheroText {
				color: #ffaa00;
			}
			.head {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}
		.vslogo {
			width: 100%;
			margin: 5% 0rpx;
			display: flex;
			justify-content: center;
			.vslogoImg {
				width: 238rpx;
				height: 138rpx;
			}
		}
	}
}
body {
	overflow: hidden;
}
.scroll-container {
	-webkit-overflow-scrolling: auto;
}
</style>