<template>
	<!-- <view class="container" :style="{'background-image': 'url('+require('../../static/imgs/hero/'+bgImg)+')','background-size': 'cover','background-repeat':'no-repeat'}"> -->
	<view class="container" @tap="handleTap">
		<audio id="audio1" autoplay="true">
			<source src="../../static/sounds/bgMp3.wav">
		</audio>
		<view class="openbox" v-if="showOpenbox">
			<image class="openboxImg" src="../../static/imgs/mapObjs/open.gif"></image>
			<div class="toolImgs" v-if="!showLoad">
				<image class="toolImg" v-if="openToolImg != ''" :src="'../../static/imgs/mapObjs/'+openToolImg"></image>
			</div>
			<div class="spImgs" v-if="openSpImg">
				<image class="spImg" :src="'../../static/imgs/mapObjs/'+spImg"></image>
			</div>
			<div class="loading" v-if="showLoad && !noTool">
				<image class="loadingImg" src="../../static/imgs/mapObjs/loading2.gif"></image>
			</div>
		</view>
		<view class="opreate">
			<image class="mypackImg" @click="openMypack" src="../../static/imgs/mapObjs/mypack.png"></image>
		</view>
		<view class="mypack" v-if="showMypack">
			<view class="tools" v-if="myTool.length != 0">
				<image class="tools-item" @click="toolInfo(item)" v-for="(item,index) in myTool" :key="index" :src="'../../static/imgs/mapObjs/'+item.img"></image>
			</view>
			<view class="toolInfo" v-if="nowToolInfo">
				【{{nowToolInfo.name}}】售价{{nowToolInfo.price}}元。{{nowToolInfo.detail}}
			</view>
			<view class="allPrice">{{allPrice}}</view>
			<view class="closePack" @click="closePack"></view>
		</view>
		<scroll-view :scroll-top="scrollTop" :scroll-left="scrollLeft" @scroll="scroll" scroll-y="true" scroll-x="true">
			<image class="bgImg" :style="{'z-index':bgZIndex,'width':screenWidth*1.45 + 'px','height': screenHeight*1.35 + 'px'}" :src="bgImg"></image>
			<view class="winlogo" v-if="showWinLogo">
				<image class="winlogoImg" style="height: 420rpx" src="../../static/imgs/win.gif"></image>
			</view>
			<view class="main">
				<view>
					<!-- 攻击动画 -->
					<image class="bettleIconImg" v-if="showMyIcon" :style="characterStyle" :src="'../../static/imgs/hero/'+myHero.icon"></image>
					<image class="bettleIconImg bettleIconImgStyle" :style="characterStyle" :src="'../../static/imgs/hero/'+iconStyle"></image>
					<image class="bettleIconImg flyImgStyle" :style="characterStyle" :src="'../../static/imgs/hero/'+flyStyle"></image>
					<image class="bettleIconImg" v-if="showEnIcon" :style="enemyStyle" :src="'../../static/imgs/'+enemy.icon"></image>
					<image class="bettleIconImg" v-if="enemy2" :style="enemyStyle2" :src="'../../static/imgs/'+enemy2.icon"></image>
					<image class="bettleIconImg" v-if="enemy3" :style="enemyStyle3" :src="'../../static/imgs/'+enemy3.icon"></image>
					<image class="bettleIconImg" v-if="enemy4" :style="enemyStyle4" :src="'../../static/imgs/'+enemy4.icon"></image>
					<image class="bettleIconImg" v-if="enemy5" :style="enemyStyle5" :src="'../../static/imgs/'+enemy5.icon"></image>
					
					<image v-if="txImg2 != ''" class="bettleIconImg bettleIconImgTX" :style="characterStyle" :src="'../../static/imgs/'+txImg2"></image>
				</view>
				<view class="my">
					<view class="tallentBar" v-if="showTallentTime">
						<ai-progress percentage="100" :isAnimate="true" :duration="tallentDuring" bgColor="#ffd321"
						 :textInside="true" :strokeWidth="8"></ai-progress>
					</view>
				</view>
				<view class="direct">
					<image class="left" src="../../static/imgs/left2.png" @click.stop="go(1)" @longtap="go(5)"></image>
					<image class="right" src="../../static/imgs/right2.png" @click.stop="go(2)" @longtap="go(6)"></image>
					<image class="top" src="../../static/imgs/top.png" @click.stop="go(3)" @longtap="go(7)"></image>
					<image class="down" src="../../static/imgs/down.png" @click.stop="go(4)" @longtap="go(8)"></image>
				</view>
				<!-- 地图物体 -->
					<image 
						v-if="mapObjects.length != 0"
					  v-for="(item, index) in mapObjects" 
					  :key="index"
					  class="mapObj"
					  :src="'../../static/imgs/mapObjs/' + item.img"
					  :style="{
						left: item.left + 'px',
						top: item.top + 'px',
						width: (item.width?item.width:80) + 'rpx',
						height: (item.height?item.height:80) + 'rpx'
					  }"
					></image>
					<image
						v-if="tallentObjects.length != 0"
					  v-for="(item, index) in tallentObjects" 
					  :key="index"
					  class="tallentObjects"
					  :src="'../../static/imgs/' + item.img"
					  :style="{
						left: item.left + 'px',
						top: item.top + 'px',
						width: (item.width?item.width:80) + 'rpx',
						height: (item.height?item.height:80) + 'rpx'
					  }"
					></image>
					<image
						v-if="enmapObjects.length != 0"
					  v-for="(item, index) in enmapObjects" 
					  :key="index"
					  class="mapObj"
					  :src="'../../static/imgs/' + item.img"
					  :style="{
						left: item.left + 'px',
						top: item.top + 'px',
						width: (item.width?item.width:80) + 'rpx',
						height: (item.height?item.height:80) + 'rpx'
					  }"
					></image>
					<image v-if="showTower" class="towerImg" :style="{left: towerLeft + 'px'}" src="../../static/imgs/tower.png"></image>
					<!-- 第一张地图 -->
					<image class="towerImg" :style="{left: door1 + 'px',top: doorTop1 + 'px'}" 
					src="../../static/imgs/mapObjs/csm.png" v-if="bgImg.indexOf('tanxianBg1.jpeg') != -1"></image>
					<!-- 第二张地图 -->
					<image class="towerImg" :style="{left: door3 + 'px',top: doorTop3 + 'px'}" 
					src="../../static/imgs/mapObjs/csm.png" v-if="bgImg.indexOf('tanxianBg2.jpeg') != -1"></image>
					<!-- 第三张地图 -->
					<image class="towerImg" :style="{left: door5 + 'px',top: doorTop5 + 'px'}"
					 src="../../static/imgs/mapObjs/csm.png" v-if="bgImg.indexOf('tanxianBg3.jpeg') != -1"></image>
					<!-- 第四张地图 -->
					<image class="towerImg" :style="{left: door6 + 'px',top: doorTop6 + 'px'}"
					 src="../../static/imgs/mapObjs/cheli.png" v-if="bgImg.indexOf('tanxianBg4.jpeg') != -1"></image>
					 <!-- 第五张地图 -->
					 <image class="towerImg" :style="{left: door6 + 'px',top: doorTop6 + 'px'}"
					  src="../../static/imgs/mapObjs/cheli.png" v-if="bgImg.indexOf('tanxianBg5.jpeg') != -1"></image>
					<!-- 不同地图的防御塔不同 -->
					<image v-if="showTower2" class="towerImg2" :style="{left: towerLeft + 'px'}" src="../../static/imgs/tower2.png"></image>
					<image v-if="showTower2" class="towerImg2" :style="{left: towerLeft2 + 'px'}" src="../../static/imgs/tower2.png"></image>
					<view v-if="showTower || showTower2" class="towercircle" :style="{left: (towerLeft - 50) + 'px'}"></view>
					<view v-if="showTower || showTower2" class="towercircle towercircle2" :style="{left: (towerLeft2 - 50) + 'px'}"></view>
					<image v-if="bgImg.indexOf('battlebg3') != -1" class="river"  src="../../static/imgs/river.png"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import res from '../../static/data/challegeEnemy.json'
import res2 from '../../static/data/exp.json'
import res3 from '../../static/data/heroList.json'
import res4 from '../../static/data/goods.json'
import heroStrongList from '../../static/data/heroStrong.json'
import { editMoney } from '../../utils/editUser'
import aiProgress from '@/components/ai-progress/ai-progress.vue'

export default {
	data() {
		return {
			myHero: {},
			begin: false,
			showMypack: false,
			enemy: {},
			enemy2: null,
			enemy3: null,
			enemy4: null,
			enemy5: null,
			blood1: 0,
			blood2: 0,
			time1: null,
			time2: null,
			time3: null,
			time4: null,	//敌方托塔天王
			beatTime: 0,	//持续性伤害时间
			beatTime2: 0,	//敌方持续性伤害时间
			min: 0,
			second: 0,
			gs1: 0,
			bettleEnd: false,
			openEq: false,
			myEquip: [],
			myTool: [],
			openToolImg: '',
			myEquipName: [],
			enList: [],
			flag: 0,
			flag2: 0,
			bgImg: '../../static/imgs/battlebg3.jpg',
			bgImg2: '../../static/imgs/battlebg.jpg',
			win: false,
			money: 0,
			gameType: null,
			showTInfo: false,
			showIntro: false,
			tallentList: [],
			innerAudioContext: [null,null,null,null,null,null,null,null],
			audioVoice: [null,null,null,null,null,null,null,null],
			bgAudio: null,
			yinshen: false,  //自己隐身
			yinshen2: false,  //敌方隐身
			bgImgIndex: 0,	//背景图标记
			addData: {},	//英雄经验加成数据
			tallentDuring: 1000 ,//技能释放延时
			showTallentTime: false,
			bgZIndex: 1,
			origHero: {},	//英雄初始数据
			mygjAnm: '',
			engjAnm: '',
			showMygjAnm: false,	//我方英雄攻击动画
			showEngjAnm: false,	//敌方英雄攻击动画
			showOpenbox: false,
			showWinLogo: false,
			showWinLogo2: false,
			showlose: false,
			myspeed: 0.8,
			fastsp: 0,
			fastsp2: 0,
			enspeed: 1,
			goTime: null,
			goTime2: null,
			goTime3: null,
			goTime4: null,
			goTime5: null,
			characterX: 680,
			characterY: 250,
			enemyX: 0,
			enemyY: 10,
			enemyX2: 0,
			enemyY2: 10,
			enemyX3: 0,
			enemyY3: 10,
			enemyX4: 0,
			enemyY4: 10,
			enemyX5: 0,
			enemyY5: 10,
			directType: null,
			directType2: null,
			directType3: null,
			directType4: null,
			directType5: null,
			directType6: null,
			directType7: null,
			directType8: null,
			distance: 560,
			enemyGJdis: 100,
			heroGJdis: 100,
			screenWidth: 796,
			screenHeight: 360,
			enmoveModel: 1, //敌方移动模式
			enmoveModelTime: null,
			enNoMove: false, 	//敌方禁止移动
			myNoMove: false, 	//我方禁止移动
			mapObjects: [],	//地图物体
			enmapObjects: [],	//敌方放置的地图物体
			tallentObjects: [],	//技能特效物体
			antijiansu: 0,	//反减速
			txImg: '',
			txImg2: '',
			arrowWid: 100,
			arrowHei: 35,
			arrowWid2: 100,
			arrowHei2: 35,
			heroMoveType: 1,	//我方移动方向
			arrowTimer: null,
			arrowTimer2: null,
			enemyBeatCD: null,
			scrollTop: 0,
			scrollLeft: 0,
			old: {
				scrollTop: 0,
				scrollLeft: 0
			},
			showTower: false,
			showTower2: false,
			meeting: false,
			towerLeft: 100,
			towerLeft2: 900,
			regGjTimeout: false,
			showEnIcon: false,
			showMyIcon: true,
			arrowtimeout: null,
			arrowtimeout2: null,
			tempEnemyIcon: null,
			nowToolInfo: null,
			allPrice: 0,
			door1: 920,
			door3: 130,
			door5: 930,
			door6: 920,
			doorTop1: 300,
			doorTop3: 300,
			doorTop5: 170,
			doorTop6: 300,
			openSpImg: false,
			showLoad: true,
			noTool: false,
			spImg: '',
			enemyLoadPer: 0,
			myStore: [],
			iconStyle: '',	//头像装饰
			flyStyle: ''	//羽翼
		}
	},
	 computed: {
	    characterStyle() {
	      return {
	        left: this.characterX + 'px',
	        top: this.characterY + 'px',
	        transitionDuration:  parseFloat(parseFloat(this.myspeed)-parseFloat(this.fastsp)).toFixed(2)+ 's',
			border: this.bigGJTX2
	      }
	    },
		enemyStyle() {
		  return {
		    left: this.enemyX + 'px',
		    top: this.enemyY + 'px',
			opacity: this.yinshen2?0:1,
		    transitionDuration:  parseFloat(parseFloat(this.enspeed)-parseFloat(this.fastsp2)).toFixed(2)+ 's',
			border: this.bigGJTX
		  }
		},
		enemyStyle2() {
		  return {
		    left: this.enemyX2 + 'px',
		    top: this.enemyY2 + 'px',
		    transitionDuration:  parseFloat(parseFloat(this.enspeed)-parseFloat(this.fastsp2)).toFixed(2)+ 's',
		  }
		},
		enemyStyle3() {
		  return {
		    left: this.enemyX3 + 'px',
		    top: this.enemyY3 + 'px',
		    transitionDuration:  parseFloat(parseFloat(this.enspeed)-parseFloat(this.fastsp2)).toFixed(2)+ 's',
		  }
		},
		enemyStyle4() {
		  return {
		    left: this.enemyX4 + 'px',
		    top: this.enemyY4 + 'px',
		    transitionDuration:  parseFloat(parseFloat(this.enspeed)-parseFloat(this.fastsp2)).toFixed(2)+ 's',
		  }
		},
		enemyStyle5() {
		  return {
		    left: this.enemyX5 + 'px',
		    top: this.enemyY5 + 'px',
		    transitionDuration:  parseFloat(parseFloat(this.enspeed)-parseFloat(this.fastsp2)).toFixed(2)+ 's',
		  }
		},
		ArrowStyle() {
			return {
			  left: parseInt(this.arrowX) + 'px',
			  top: parseInt(this.arrowY) + 'px',
			  width: parseInt(this.arrowWid) + 'px',
			  height: parseInt(this.arrowHei) + 'px',
			}
		},
		ArrowStyle2() {
			return {
			  left: parseInt(this.arrowX2) + 'px',
			  top: parseInt(this.arrowY2) + 'px',
			  width: parseInt(this.arrowWid2) + 'px',
			  height: parseInt(this.arrowHei2) + 'px',
			}
		}
	  },
	mounted() {
		if (typeof plus !== 'undefined' && typeof plus.screen !== 'undefined') {
			plus.screen.lockOrientation("landscape")
		}
		setTimeout(()=>{
			this.getSystemInfo()
		},1000)
		this.gameType = uni.getStorageSync('gameType')
		let userInfo = JSON.parse(uni.getStorageSync('user'))
		this.money = parseInt(userInfo.money)
		this.putMapTools()
		if(uni.getStorageSync('myStore')){
			this.myStore = JSON.parse(uni.getStorageSync('myStore'))
			this.myStore.forEach((item,index)=>{
				if(item.id == 110){	//圣旨
					this.enemyLoadPer = 39
				}
				if(item.id == 111){	//钥匙
					this.myTool.push({
						id: new Date().getTime(),
						name: '探险钥匙',
						detail: '探险模式的门卡钥匙',
						img: 'yaoshi.png',
						price: 2000
					})
					this.myStore.splice(index,1)
					uni.setStorageSync('myStore',JSON.stringify(this.myStore))
				}
			})
		}
	},
	onLoad(option) {
		if(option){
			this.myHero = JSON.parse(option.item)
			this.gameType = uni.getStorageSync('gameType')
			this.bgImg = '../../static/imgs/tanxianBg1.jpeg'
			let self = this
			//头像相框
			if(JSON.parse(uni.getStorageSync('myStore')).length != 0){
				JSON.parse(uni.getStorageSync('myStore')).forEach(i=>{
					if(new Date().getTime() < parseInt(i.buyTime) + 2*24*60*60*1000){
						if(i.isOther && i.name.indexOf('像框') != -1){
							self.iconStyle = i.icon
						}
					}else{
						let li = JSON.parse(uni.getStorageSync('myStore'))
						li.forEach((it,indx)=>{
							if(it.name == i.name){
								li.splice(indx,1)
							}
						})
						uni.setStorageSync('myStore',JSON.stringify(li))
					}
				})
			}
			//羽翼
			if(JSON.parse(uni.getStorageSync('myStore')).length != 0){
				JSON.parse(uni.getStorageSync('myStore')).forEach(i=>{
					if(new Date().getTime() < parseInt(i.buyTime) + 2*24*60*60*1000){
						if(i.isOther && i.name.indexOf('羽翼') != -1){
							self.flyStyle = i.icon
							self.myspeed = 0.8
							self.myspeed -= parseFloat(i.speed).toFixed(2)
						}
					}else{
						let li = JSON.parse(uni.getStorageSync('myStore'))
						li.forEach((it,indx)=>{
							if(it.name == i.name){
								li.splice(indx,1)
							}
						})
						uni.setStorageSync('myStore',JSON.stringify(li))
					}
				})
			}
			if(option.type && option.type == 'lose'){
				uni.showToast({
					title: '抗击敌人失败，背包装备已全部掉落',
					icon:'none',
					duration: 2000
				});
				setTimeout(()=>{
					uni.setStorageSync('tanxianPack',JSON.stringify([]))
					this.myStore.forEach((item,index)=>{
						if(item.id == 110){
							this.myStore.splice(index,1)
							uni.setStorageSync('myStore',JSON.stringify(this.myStore))
						}
					})
					setTimeout(()=>{
						uni.redirectTo({
							url: "/pages/white"
						})
					},200)
				},1500)
				return
			}
			if(option.type && option.type == 'win'){
				this.enemyLoadPer = this.randomNum(30,65)
				this.bgImg = option.map.slice(1,option.map.length - 1)
				this.playVoice('../../static/sounds/tanxian.wav',true,10,170000)
				this.myTool = JSON.parse(uni.getStorageSync('tanxianPack'))
				this.showWinLogo = true
				setTimeout(()=>{
					this.showWinLogo = false
				},2500)
				return
			}
			self.playVoice('../../static/sounds/tanxian.wav',true,10,170000)
			if(!uni.getStorageSync('tanxianPack')){
				uni.setStorageSync('tanxianPack',JSON.stringify([]))
			}else{
				this.myTool = JSON.parse(uni.getStorageSync('tanxianPack'))
			}
		}
	},
	methods: {
		backMenu() {
			if(this.gameType == 'paiwei'){
				return
			}
			let money = parseInt(JSON.parse(uni.getStorageSync('user')).money)
			let name = JSON.parse(uni.getStorageSync('user')).name
			let time = parseInt(this.min) * 60 + parseInt(this.second)
			let winner = this.win ? this.randomNum((time*2),(time*3)+150)+150 : 0
			let addPointer = (time*2) + Math.ceil(winner*0.7)
			if(this.gameType == 'match' && this.win && !this.enemy.isHero) {
				winner += this.enemy.lv*100
			}
			if(this.gameType == 'fuben' && this.win) {
				winner += this.enemy.money
			}
			let newMoney = money + (time*8) + this.randomNum(30,100) + winner
			let userInfo = JSON.parse(uni.getStorageSync('user'))
			let winExp = this.win ? time*7 + 300 + this.randomNum(0,300) : Math.floor(time*3.5)+this.randomNum(50,100)
			let lv = userInfo.lv?userInfo.lv:1
			let exp = userInfo.e?userInfo.e:0
			let newLv = parseInt(lv)
			let newExp = parseInt(exp) + winExp
			res2.data.map(i=>{
				if(i.lv == newLv){
					//升级
					if(parseInt(i.e) <= newExp){
						newLv += 1
						newExp = 0
					}
				}
			})
			userInfo.lv = newLv
			userInfo.e = newExp
			userInfo.money = newMoney
			uni.setStorageSync('user',JSON.stringify(userInfo))
			let self = this
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			datas.forEach((it,idx)=>{
				if(self.myHero.id == it.id){
					if((datas[idx].allPointer+addPointer) <= 35*500){
						datas[idx].pointer += addPointer
						datas[idx].allPointer += addPointer
					}else{
						datas[idx].pointer = 0
						datas[idx].allPointer = 35*500-1
					}
				}
			})
			uni.setStorageSync('heroAddData',JSON.stringify(datas))
			clearInterval(self.wzhy)
			setTimeout(()=>{
				uni.redirectTo({
					url: "/pages/white"
				})
				// uniCloud.callFunction({
				// 	name: 'setMoney',
				// 	data: {
				// 		money: newMoney,
				// 		name: name
				// 	}
				// }).then((res) => {
				// 	uni.redirectTo({
				// 		url: "/pages/index/index?isLogin=true"
				// 	})
				// }).catch(e=>{
				// 	uni.showToast({
				// 		title: '请检查网络',
				// 		icon:'error',
				// 		duration: 1200
				// 	});
				// })
			},200)
			if (this.bgAudio) {
			  try {
				this.bgAudio.pause();
				this.bgAudio.destroy()
				this.bgAudio = null
			  } catch (e) {
				//TODO handle the exception
			  }
			}
		},

		randomNum(Min,Max){
		  var Range = Max - Min;
		  var Rand = Math.random();
		  var num = Min + Math.round(Rand * Range); //四舍五入
		  return num;
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
		},
		// 0~999
		reallyRandom2(){
		  var time = new Date().getTime().toString().slice(-3)
		  return parseInt(time)
		},
		//恢复背景图
		backBgImg(name,time,type) {
			setTimeout(()=>{
				if(name.indexOf("fb_") != -1 || type == 1){
					this.showEngjAnm = false
				}else{
					this.showMygjAnm = false
				}
			},time)
		},

		setMoney(num) {
			let userInfo = JSON.parse(uni.getStorageSync('user'))
			userInfo.money = num
			this.money = num
			uni.setStorageSync('user',JSON.stringify(userInfo))
		},
		closeT() {
			this.showTInfo = false
			this.showIntro = false
		},

		//战斗胜利
		winBettle() {
			this.win = true
			this.blood1 = 0
			this.bloodVal1 = 0
			this.bettleEnd = true
			this.audioVoice = [null,null,null,null,null,null,null,null]
			clearInterval(this.goTime2)
			clearInterval(this.arrowTimer)
			if(this.gameType != 'jinbiao'){
				this.showWinLogo = true
				setTimeout(()=>{
					this.showWinLogo = false
				},2500)
			}
			this.addLog(1)
			clearInterval(this.time1)
			clearInterval(this.beatTime)
			if(this.myEquipName.includes('梅贾的窃魂卷')) {
				if(this.gameType == 'paiwei'){
					if(uni.getStorageSync('paiweiHero')){
						let h = JSON.parse(uni.getStorageSync('paiweiHero'))
						h.forEach(e=>{
							if(e.name == this.myHero.name){
								e.fs = e.fs + 26
							}
						})
						uni.setStorageSync('paiweiHero',JSON.stringify(h))
					}
				}else{
					this.myHero.fs = this.myHero.fs + 20
				}
			}
			this.beatTime = null
			this.showEnIcon = false
		},
		//战斗失败
		loseBettle() {
			uni.showToast({
				title: '战斗结束，你的英雄阵亡！请到“我的背包”复活',
				icon:'none',
				duration: 1000
			});
			this.audioVoice = [null,null,null,null,null,null,null,null]
			this.win = false
			this.blood2 = 0
			this.bloodVal2 = 0
			this.bettleEnd = true
			this.showMyIcon = false
			this.addLog(0)
			setTimeout(()=>{
				this.showlose = true
			},500)
			setTimeout(()=>{
				this.showlose = false
			},2400)
			let self = this
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			datas.forEach((it,idx)=>{
				if(self.myHero.id == it.id){
					datas[idx].isLive = 0
				}
			})
			uni.setStorageSync('heroAddData',JSON.stringify(datas))
			if(this.gameType == 'wuxian'){
				if(parseInt(this.loop) > parseInt(uni.getStorageSync('wuxianLevel'))){
					uni.setStorageSync('wuxianLevel',parseInt(this.loop))
				}
			}
			clearInterval(this.time1)
			clearInterval(this.time3)
			clearInterval(this.beatTime)
			clearInterval(this.wzhy)
			clearInterval(this.goTime2)
			clearInterval(this.arrowTimer)
			this.beatTime = null
			if(this.gameType == 'paiwei'){
				let time = parseInt(this.min) * 60 + parseInt(this.second)
				if(parseInt(this.blood1) + parseInt(this.enemy.blood)*0.1 > parseInt(this.enemy.blood)){
					this.blood1 = parseInt(this.enemy.blood)
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
				}else{
					this.blood1 = parseInt(this.blood1) + parseInt(parseInt(this.enemy.blood)*0.1)
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
				}
				setTimeout(()=>{
					let url = this.myHero.name+'&enemyBlood='+parseInt(this.blood1)+'&enemy='+this.enemy.name+'&time='+time
					uni.redirectTo({
						url: "/pages/white?beatHero="+url+""
					})
				},1000)
				if (this.bgAudio) {
				  try {
					this.bgAudio.pause();
					this.bgAudio.destroy()
					this.bgAudio = null
				  } catch (e) {
					//TODO handle the exception
				  }
				}
			}
		},
		//记录
		addLog(win) {
			let name = JSON.parse(uni.getStorageSync('user')).name
			let info = {
				me: this.myHero.name,
				enemy: this.enemy.name,
				type: this.gameType,
				useTime: this.min+ '分' + this.second + '秒',
				user: name,
				isWin: win
			}
			// uniCloud.callFunction({
			// 	name: 'addLog',
			// 	data: info
			// }).then((res) => {
				
			// })
		},
		playVoice(url,type,index,time,voice) {
			if(index == 10){
				this.bgAudio = uni.createInnerAudioContext();
				this.bgAudio.sessionCategory = 'ambient'
				this.bgAudio.volume = 0.4
				this.bgAudio.loop = true
				this.bgAudio.src = url
				this.bgAudio.play()
			}else if(voice){
				let self = this
				//姐姐音xiaoxian
				//温柔女siqi
				//带货女maoxiaomei
				//甜美女声zhimiao_emo
				//小声温柔甜美aiting
				//童声aiying
				//中年男zhifeng_emo
				//东北男laotie
				//青年zhibing_emo
				//年轻xiaogang
				//伊泽aicheng
				if(!self.audioVoice[index]){
					uni.request({
						url: 'https://user.api.hudunsoft.com/v1/alivoice/texttoaudio',
						header: {
							authority: 'user.api.hudunsoft.com',
							origin: 'https://www.luyinzhushou.com',
							'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						method: 'POST',
						data: {
					        client: 'web',
					        source: '335',
					        soft_version:'V4.4.0.0',
					        device_id:'785c8014a163480b84b5d017a9a11886',
					        text: url,
					        bgid:'0',
					        bg_volume:'1',
					        format:'mp3',
							emotion: 'happy',
					        voice: voice,
					        volume: url.length>=5?10:9,
					        speech_rate: url.length>=5?4 : 6,
					        pitch_rate:4,
					        title: url,
					        token:'785c8014a163480b84b5d017a9a11886',
					        bg_url: ''
						},
						success: function(res) {
							self.audioVoice[index] = uni.createInnerAudioContext();
							self.audioVoice[index].sessionCategory = 'ambient'
							self.audioVoice[index].volume = 1
							self.audioVoice[index].src = res.data.data.file_link
							self.audioVoice[index].play()
						}
					});
				}else{
					self.audioVoice[index].play()
				}
			}else{
				this.innerAudioContext[index] = uni.createInnerAudioContext();
				this.innerAudioContext[index].sessionCategory = 'ambient'
				if(type){
					this.innerAudioContext[index].volume = 1
				}else{
					this.innerAudioContext[index].volume = 0.4
				}
				this.innerAudioContext[index].src = url
				this.innerAudioContext[index].play()
				setTimeout(()=>{
					if (this.innerAudioContext[index]) {
					  try {
						this.innerAudioContext[index].pause();
						this.innerAudioContext[index].destroy()
						this.innerAudioContext[index] = null
					  } catch (e) {
						//TODO handle the exception
					  }
					}
				},time)
			}
		},
		
		//计算距离
		computeDistance(num) {
			if(!num){
				let x = Math.abs(this.characterX - this.enemyX)
				let y = Math.abs(this.characterY - this.enemyY)
				this.distance = Math.sqrt(x*x+y*y)
			}else{
				if(num == 2){
					let x = Math.abs(this.characterX - this.enemyX2)
					let y = Math.abs(this.characterY - this.enemyY2)
					this.distance = Math.sqrt(x*x+y*y)
				}
				if(num == 3){
					let x = Math.abs(this.characterX - this.enemyX3)
					let y = Math.abs(this.characterY - this.enemyY3)
					this.distance = Math.sqrt(x*x+y*y)
				}
				if(num == 4){
					let x = Math.abs(this.characterX - this.enemyX4)
					let y = Math.abs(this.characterY - this.enemyY4)
					this.distance = Math.sqrt(x*x+y*y)
				}
				if(num == 5){
					let x = Math.abs(this.characterX - this.enemyX5)
					let y = Math.abs(this.characterY - this.enemyY5)
					this.distance = Math.sqrt(x*x+y*y)
				}
			}
			
		},
		go(type) {
			if(this.myNoMove){
				uni.showToast({
					title: '你被禁止移动',
					icon:'none',
					duration: 800
				});
				return
			}
			this.heroMoveType = type
			clearInterval(this.goTime)
			if(type == 1 && this.directType != true){	//向左
				this.characterX = this.characterX - 35
				this.myMoveEffect()
				if(this.characterX <= this.screenWidth * 0.5){
					this.$nextTick(function() {
						this.scrollLeft = 0
					});
				}
				if(this.characterX < 0){
					let sp = this.myspeed
					this.myspeed = 0
					this.characterX = this.screenWidth - 50
					setTimeout(()=>{
						this.myspeed = sp
					},200)
				}
				this.directType = true
				setTimeout(()=>{
					this.directType = false
				},(this.myspeed-this.fastsp) * 1000-300)
			}
			if(type == 2 && this.directType2 != true){	//向右
				if(this.characterX < this.screenWidth * 1.35){
					this.characterX = this.characterX + 35
				}
				this.myMoveEffect()
				if(this.characterX > this.screenWidth * 0.85){
					this.$nextTick(function() {
						this.scrollLeft = this.screenWidth
					});
				}
				this.directType2 = true
				setTimeout(()=>{
					this.directType2 = false
				},(this.myspeed-this.fastsp) * 1000-300)
			}
			if(type == 3 && this.directType3 != true){	//向上
				this.myMoveEffect()
				if(this.characterY < parseInt(this.screenHeight*0.45)){
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
				}
				if(this.characterY >= 70){
					this.characterY = this.characterY - 35
				}
				this.directType3 = true
				setTimeout(()=>{
					this.directType3 = false
				},(this.myspeed-this.fastsp) * 1000-300)
			}
			if(type == 4 && this.directType4 != true){	//向下
				this.myMoveEffect()
				if(this.characterY > parseInt(this.screenHeight*0.75)){
					this.$nextTick(function() {
						this.scrollTop = this.screenHeight
					});
				}
				if(this.characterY < parseInt(this.screenHeight * 1.1)){
					this.characterY = this.characterY + 35
				}
				this.directType4 = true
				setTimeout(()=>{
					this.directType4 = false
				},(this.myspeed-this.fastsp) * 1000-300)
			}
			if(type == 5){
				this.goTime = setInterval(()=>{
					this.characterX = this.characterX - 35
					if(this.characterX <= this.screenWidth * 0.5){
						this.$nextTick(function() {
							this.scrollLeft = 0
						});
					}
					if(this.characterX < 0){
						let sp = this.myspeed
						this.myspeed = 0
						this.characterX = this.screenWidth - 50
						setTimeout(()=>{
							this.myspeed = sp
						},200)
					}
					this.directType = false
				}, (this.myspeed-this.fastsp) * 1000)
				this.directType = true
			}
			if(type == 6){
				this.goTime = setInterval(()=>{
					if(this.characterX < this.screenWidth * 1.35){
						this.characterX = this.characterX + 35
					}
					if(this.characterX > this.screenWidth * 0.85){
						this.$nextTick(function() {
							this.scrollLeft = this.screenWidth
						});
					}
					this.directType2 = false
				}, (this.myspeed-this.fastsp) * 1000)
				this.directType2 = true
			}
			if(type == 7){
				this.goTime = setInterval(()=>{
					if(this.characterY < parseInt(this.screenHeight*0.45)){
						this.scrollTop = this.old.scrollTop
						this.$nextTick(function() {
							this.scrollTop = 0
						});
					}
					if(this.characterY >= 70){
						this.characterY = this.characterY - 35
					}
					this.directType3 = false
				}, (this.myspeed-this.fastsp) * 1000)
				this.directType3 = true
			}
			if(type == 8){
				this.goTime = setInterval(()=>{
					if(this.characterY > parseInt(this.screenHeight*0.75)){
						this.$nextTick(function() {
							this.scrollTop = this.screenHeight
						});
					}
					if(this.characterY < parseInt(this.screenHeight * 1.1)){
						this.characterY = this.characterY + 35
					}
					this.directType4 = false
				}, (this.myspeed-this.fastsp) * 1000)
				this.directType4 = true
			}
			
		},
		//敌方移动控制
		enemyMoveContrl(type,index) {
			this.enmoveModel = type
			if(type == 1){	//自由模式
					if(!index){
						clearInterval(this.goTime2)
						this.goTime2 = setInterval(()=>{
							this.enemyMove(this.randomNum(1,4))
						},900)
					}else{
						if(index == 2){
							clearInterval(this.goTime3)
							this.goTime3 = setInterval(()=>{
								this.enemyMove2(this.randomNum(1,4))
							},900)
						}
						if(index == 3){
							clearInterval(this.goTime4)
							this.goTime4 = setInterval(()=>{
								this.enemyMove3(this.randomNum(1,4))
							},900)
						}
						if(index == 4){
							clearInterval(this.goTime5)
							this.goTime5 = setInterval(()=>{
								this.enemyMove4(this.randomNum(1,4))
							},900)
						}
						if(index == 5){
							clearInterval(this.goTime6)
							this.goTime6 = setInterval(()=>{
								this.enemyMove5(this.randomNum(1,4))
							},900)
						}
					}
			}
			if(type == 2){	//追击模式
				this.goTime2 = setInterval(()=>{
					if(this.distance < 70){
						return
					}
					if(this.characterX > this.enemyX){
						this.enemyMove(2)
					}else{
						this.enemyMove(1)
					}
					if(this.characterY > this.enemyY){
						this.enemyMove(4)
					}else{
						this.enemyMove(3)
					}
				},500)
			}
			if(type == 3){	//逃离模式
				this.goTime2 = setInterval(()=>{
					if(this.showTower || this.showTower2){
						let x = Math.abs(this.enemyX - this.towerLeft)
						let y = Math.abs(this.enemyY - 170)
						let distance = Math.sqrt(x*x+y*y)
						if(this.enemyX > this.towerLeft + 20){
							this.enemyMove(1)
						}else{
							this.enemyMove(2)
						}
						if(this.enemyY > 170){
							this.enemyMove(3)
						}else{
							this.enemyMove(4)
						}
						if(distance <= 90){	//已经到塔下了
							this.enemyMoveContrl(1)
						}
					}else{
						if(this.characterX > this.enemyX){
							this.enemyMove(1)
							if(this.enemyX < 50 && this.enemyY > 100){
								this.enemyMove(3)
							}
						}else{
							this.enemyMove(1)
							this.enemyMove(this.randomNum(3,4))
						}
						if(this.characterY > this.enemyY){
							this.enemyMove(3)
						}else{
							this.enemyMove(4)
						}
					}
				},500)
			}
		},
		//敌方移动
		enemyMove(type) {
			if(this.enNoMove){
				return
			}
			if(type == 1 && this.directType5 != true){	//向左
				this.enemyX = this.enemyX - 30
				if(this.enemyX < 0){
					let sp = this.enspeed
					this.enspeed = 0
					this.enemyX = this.screenWidth - 50
					setTimeout(()=>{
						this.enspeed = sp
					},200)
				}
				this.directType5 = true
				setTimeout(()=>{
					this.directType5 = false
				},(this.enspeed-this.fastsp2) * 1000)
			}
			if(type == 2 && this.directType6 != true){	//向右
				if(this.enemyX < this.screenWidth * 1.35){
					this.enemyX = this.enemyX + 30
				}
				// if(this.enemyX > this.screenWidth - 50){
				// 	let sp = this.enspeed
				// 	this.enspeed = 0
				// 	this.enemyX = 0
				// 	setTimeout(()=>{
				// 		this.enspeed = sp
				// 	},200)
				// }
				this.directType6 = true
				setTimeout(()=>{
					this.directType6 = false
				},(this.enspeed-this.fastsp2) * 1000)
			}
			if(type == 3 && this.directType7 != true){	//向上
				if(this.enemyY > 80){
					this.enemyY = this.enemyY - 30
				}
				this.directType7 = true
				setTimeout(()=>{
					this.directType7 = false
				},(this.enspeed-this.fastsp2) * 1000)
			}
			if(type == 4 && this.directType8 != true){	//向下
				if(this.enemyY < parseInt(this.screenHeight)){
					this.enemyY = this.enemyY + 30
				}
				this.directType8 = true
				setTimeout(()=>{
					this.directType8 = false
				},(this.enspeed-this.fastsp2) * 1000)
			}
			this.enMoveEffect()
		},
		enemyMove2(type) {
			if(this.enNoMove){
				return
			}
			if(type == 1){	//向左
				this.enemyX2 = this.enemyX2 - 30
				if(this.enemyX2 < 0){
					let sp = this.enspeed
					this.enspeed = 0
					this.enemyX2 = this.screenWidth - 50
					setTimeout(()=>{
						this.enspeed = sp
					},200)
				}
			}
			if(type == 2){	//向右
				if(this.enemyX2 < this.screenWidth * 1.35){
					this.enemyX2 = this.enemyX2 + 30
				}
			}
			if(type == 3){	//向上
				if(this.enemyY2 > 80){
					this.enemyY2 = this.enemyY2 - 30
				}
			}
			if(type == 4){	//向下
				if(this.enemyY2 < parseInt(this.screenHeight)){
					this.enemyY2 = this.enemyY2 + 30
				}
			}
			this.enMoveEffect(2)
		},
		enemyMove3(type) {
			if(this.enNoMove){
				return
			}
			if(type == 1){	//向左
				this.enemyX3 = this.enemyX3 - 30
				if(this.enemyX3 < 0){
					let sp = this.enspeed
					this.enspeed = 0
					this.enemyX3 = this.screenWidth - 50
					setTimeout(()=>{
						this.enspeed = sp
					},200)
				}
			}
			if(type == 2){	//向右
				if(this.enemyX3 < this.screenWidth * 1.35){
					this.enemyX3 = this.enemyX3 + 30
				}
				
			}
			if(type == 3){	//向上
				if(this.enemyY3 > 80){
					this.enemyY3 = this.enemyY3 - 30
				}
				
			}
			if(type == 4){	//向下
				if(this.enemyY3 < parseInt(this.screenHeight)){
					this.enemyY3 = this.enemyY3 + 30
				}
			}
			this.enMoveEffect(3)
		},
		enemyMove4(type) {
			if(this.enNoMove){
				return
			}
			if(type == 1){	//向左
				this.enemyX4 = this.enemyX4 - 30
				if(this.enemyX4 < 0){
					let sp = this.enspeed
					this.enspeed = 0
					this.enemyX4 = this.screenWidth - 50
					setTimeout(()=>{
						this.enspeed = sp
					},200)
				}
			}
			if(type == 2){	//向右
				if(this.enemyX4 < this.screenWidth * 1.35){
					this.enemyX4 = this.enemyX4 + 30
				}
				
			}
			if(type == 3){	//向上
				if(this.enemyY4 > 80){
					this.enemyY4 = this.enemyY4 - 30
				}
				
			}
			if(type == 4){	//向下
				if(this.enemyY4 < parseInt(this.screenHeight)){
					this.enemyY4 = this.enemyY4 + 30
				}
			}
			this.enMoveEffect(4)
		},
		enemyMove5(type) {
			if(this.enNoMove){
				return
			}
			if(type == 1){	//向左
				this.enemyX5 = this.enemyX5 - 30
				if(this.enemyX5 < 0){
					let sp = this.enspeed
					this.enspeed = 0
					this.enemyX5 = this.screenWidth - 50
					setTimeout(()=>{
						this.enspeed = sp
					},200)
				}
			}
			if(type == 2){	//向右
				if(this.enemyX5 < this.screenWidth * 1.35){
					this.enemyX5 = this.enemyX5 + 30
				}
				
			}
			if(type == 3){	//向上
				if(this.enemyY5 > 80){
					this.enemyY5 = this.enemyY5 - 30
				}
				
			}
			if(type == 4){	//向下
				if(this.enemyY5 < parseInt(this.screenHeight)){
					this.enemyY5 = this.enemyY5 + 30
				}
			}
			this.enMoveEffect(5)
		},
		//敌方移动事件
		enMoveEffect(num) {
			this.computeDistance(num)
			//碰面，战斗
			if(this.distanceComp(60) && !this.meeting){
				this.meeting = true
				let en = null
				if(!num){
					en = this.enemy
				}else{
					if(num == 2){
						en = this.enemy2
					}
					if(num == 3){
						en = this.enemy3
					}
					if(num == 4){
						en = this.enemy4
					}
					if(num == 5){
						en = this.enemy5
					}
				}
				let self = this
				uni.showModal({
					title: '提示',
					content: en.name+'想和你交战！',
					showCancel: false,
					success: function (r) {
						if (r.confirm) {
							if (self.bgAudio) {
							  try {
								self.bgAudio.pause();
								self.bgAudio.destroy()
								self.bgAudio = null
							  } catch (e) {
								//TODO handle the exception
							  }
							}
							uni.setStorageSync('tanxianPack',JSON.stringify(self.myTool))
							setTimeout(()=>{
								self.meeting = false
								uni.redirectTo({
									url: "/pages/white?item="+JSON.stringify(self.myHero)+'&en='+JSON.stringify(en)+'&map='+'"'+self.bgImg+'"'+'&tanxian=true'
								})
							},200)
							// uni.redirectTo({
							// 	url: "/pages/play/landScap?item="+JSON.stringify(self.myHero)+'&en='+JSON.stringify(en)+'&map='+'"'+self.bgImg+'"'
							// })
							self.enNoMove = true
						}
					}
				});
			}
		},
	

		//地图上的物体被踩到
		mapObjsEvent(idx,type) {
			if(this.showOpenbox){
				return
			}
			let boxType = this.mapObjects[idx].img
			let time = 800+this.reallyRandom(0,5)*200
			this.showOpenbox = true
			this.showLoad = true
			setTimeout(()=>{
				if(this.gameType == 'tanxian2'){
					this.hardTools(boxType)
				}else{
					this.easyTools(boxType)
				}
				this.showLoad = false
				setTimeout(()=>{
					this.openSpImg = false
				},1000)
				setTimeout(()=>{
					this.showOpenbox = false
					this.noTool = false
				},2500)
			},time)
			this.mapObjects.splice(idx,1)
		},
		addHeroDistance(val,type) {
			if(type == 1){
				this.heroGJdis += val
				this.myHero.dis1 += val
				this.myHero.dis2 += val
				this.myHero.dis3 += val
				this.myHero.dis4 += val
				this.myHero.distance += val
			}else{
				this.enemyGJdis += val
				this.enemy.distance += val
			}
		},
		showTX(type,index,close){
			if(index == 1){		//敌方受到
				if(close){	//关闭特效
					this.txImg = ''
					return
				}
				if(type == 1){	//攻击特效
					this.txImg = 'mygjTX.gif'
				}
				if(type == 2){	//移动速度特效
					this.txImg = 'addspTX.gif'
				}
			}else{	//我方受到
				if(close){	//关闭特效
					this.txImg2 = ''
					return
				}
				if(type == 1){	//攻击特效
					this.txImg2 = 'engjTX.gif'
				}
				if(type == 2){	//移动速度特效
					this.txImg2 = 'addspTX.gif'
				}
			}
			
		},
		
		//地图随机道具
		putMapTools() {
			this.mapObjects.splice(0)
				for(let i = 0;i<this.randomNum(1,3);i++){
					this.mapObjects.push({
						name: 'box1',
						left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
						top: this.randomNum(70,this.screenHeight),
						img: 'box1.png'
					});
				}
			if(this.randomNum(0,1) == 1){
				for(let i = 0;i<this.randomNum(1,2);i++){
					this.mapObjects.push({
						name: 'box2',
						left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
						top: this.randomNum(70,this.screenHeight),
						img: 'box2.png'
					});
				}
			}
				for(let i = 0;i<this.randomNum(1,3);i++){
					this.mapObjects.push({
						name: 'box3',
						left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
						top: this.randomNum(70,this.screenHeight),
						img: 'box3.png'
					});
				}
				if(this.bgImg.indexOf('tanxianBg4.jpeg') != -1){
					for(let i = 0;i<this.randomNum(1,2);i++){
						this.mapObjects.push({
							name: 'box1',
							left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.2),
							top: this.randomNum(30,this.screenHeight),
							img: 'box1.png'
						});
					}
					for(let i = 0;i<this.randomNum(1,2);i++){
						this.mapObjects.push({
							name: 'box2',
							left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.2),
							top: this.randomNum(30,this.screenHeight),
							img: 'box2.png'
						});
					}
				}
				if(this.bgImg.indexOf('tanxianBg5.jpeg') != -1){
					this.mapObjects.push({
						name: 'bigbox',
						left: 579,
						top: 251,
						img: 'bigbox.png'
					});
				}
		},
		towerBeat() {
			if((this.showTower || this.showTower2) && this.begin && !this.bettleEnd){
				let x = Math.abs(this.characterX - this.towerLeft)
				let y = Math.abs(this.characterY - 170)
				let x2 = Math.abs(this.enemyX - (this.towerLeft2+35))
				let y2 = Math.abs(this.enemyY - 230)
				let distance = Math.sqrt(x*x+y*y)
				let distance2 = Math.sqrt(x2*x2+y2*y2)
				
				if(distance <= 190){
					let val = this.enemy.gj*1.5 + 200 + this.randomNum(0,200)
					this.enemyBeat2(val)
				}
				if(distance2 <= 125){
					let val = this.randomNum(300,500)
					this.beat(val)
				}
			}
		},
		//我方移动事件
		myMoveEffect() {
			if(this.mapObjects.length != 0){
				this.mapObjects.map((it,idx)=>{
					let x = Math.abs(it.left - this.characterX)
					let y = Math.abs(it.top - this.characterY)
					let dis = Math.sqrt(x*x+y*y)
					if(dis <= 38){	//踩到
						this.mapObjsEvent(idx,2)
					}
				})
			}
			this.computeDistance()
			//轮回之地不用敌人，宝箱少也没有敌人
			if(this.bgImg.indexOf("tanxianBg5.jpeg") == -1 && this.mapObjects.length > 2){
				if(this.gameType == 'tanxian'){
					if(this.reallyRandom2() > (920+this.enemyLoadPer) && !this.showEnIcon){
						this.getEnemy(1)
					}
				}else{	//困难模式
					if(this.reallyRandom2() > (890+this.enemyLoadPer) && !this.showEnIcon){
						this.getEnemy(1)
					}
				}
			}
			
			let door = 0
			let top = 0
			if(this.bgImg.indexOf("tanxianBg1.jpeg") != -1){
				door = this.door1
				top = this.doorTop1
			}
			if(this.bgImg.indexOf("tanxianBg2.jpeg") != -1){
				door = this.door3
				top = this.doorTop3
			}
			if(this.bgImg.indexOf("tanxianBg3.jpeg") != -1){
				door = this.door5
				top = this.doorTop5
			}
			if(this.bgImg.indexOf("tanxianBg4.jpeg") != -1){
				door = this.door6
				top = this.doorTop6
			}
			if(this.bgImg.indexOf("tanxianBg5.jpeg") != -1){
				door = this.door6
				top = this.doorTop6
			}
			//判断你是否移动到传送门
			let x = Math.abs(this.characterX - (door+35))
			let y = Math.abs(this.characterY - top - 90)
			let distance = Math.sqrt(x*x+y*y)
			if(distance <= 70){
				uni.showToast({
					title: '等待中',
					icon:'none',
					duration: 500
				});
				this.myNoMove = true
				setTimeout(()=>{
					this.$nextTick(function() {
						this.scrollLeft = 0
					});
					this.$nextTick(function() {
						this.scrollTop = 0
					});
					setTimeout(()=>{
						if(this.bgImg.indexOf("tanxianBg1.jpeg") != -1){
							this.bgImg = '../../static/imgs/tanxianBg2.jpeg?'+ new Date().getTime()
							this.characterX = 200
							this.characterY = 100
							this.putMapTools()
							if(this.gameType == 'tanxian2'){
								this.putMapEnemy(this.reallyRandom(2,3))
							}
						}else{
							if(this.bgImg.indexOf("tanxianBg2.jpeg") != -1){
								this.bgImg = '../../static/imgs/tanxianBg3.jpeg?'+ new Date().getTime()
								this.characterX = 300
								this.characterY = 250
								this.putMapTools()
								if(this.gameType == 'tanxian2'){
									this.putMapEnemy(this.reallyRandom(3,4))
								}
							}else{
								if(this.bgImg.indexOf("tanxianBg3.jpeg") != -1){
									this.bgImg = '../../static/imgs/tanxianBg4.jpeg?'+ new Date().getTime()
									this.characterX = 300
									this.characterY = 250
									this.putMapTools()
									if(this.gameType == 'tanxian2'){
										this.putMapEnemy(this.reallyRandom(4,5))
									}else{
										if(this.reallyRandom(0,1) == 1){
											this.putMapEnemy(this.reallyRandom(2,3))
										}
									}
								}else{
									//撤离
									if(this.bgImg.indexOf("tanxianBg4.jpeg") != -1){
										let has = false
										let indx = 0
										this.myTool.forEach((it,ind)=>{
											if(it.name == '探险钥匙'){
												has = true
												indx = ind
											}
										})
										if(has){
											let self = this
											uni.showModal({
												title: '提示',
												content: '是否通过探险钥匙进入轮回之地，寻找更稀有的宝物？',
												success: function (r) {
													if (r.confirm) {
														self.bgImg = '../../static/imgs/tanxianBg5.jpeg?'+ new Date().getTime()
														self.characterX = 200
														self.characterY = 180
														self.myTool.splice(indx,1)
														self.putMapTools()
														self.enemy = {}
														self.enemy2 = null
														self.enemy3 = null
														self.enemy4 = null
														self.enemy5 = null
														self.showEnIcon = false
														clearInterval(self.goTime2)
														clearInterval(self.goTime3)
														clearInterval(self.goTime4)
														clearInterval(self.goTime5)
													} else if (r.cancel) {
														self.exit()
													}
												}
											});
										}else{
											this.exit()
										}
									}else{
										this.exit()
									}
								}
							}
						}
						this.myNoMove = false
					},100)
				},1000)
			}
		},
		//点击背景图释放技能
		handleTap(e) {
			const pageY = e.changedTouches[0].pageY + parseInt(this.scrollTop/2.6)
			const pageX = e.changedTouches[0].pageX + parseInt(this.scrollLeft/2.2)
			let addTalent = parseInt(this.addData.add8)
			let addTalent2 = parseInt(this.addData.add9)
			let addTalent3 = parseInt(this.addData.add10)
			let addTalent4 = parseInt(this.addData.add11)
			let strongIndex = 0
			if(this.addData.strongIndex){
				strongIndex = parseInt(this.addData.strongIndex)
			}
		},
		 getSystemInfo() {
			const systemInfo = uni.getSystemInfoSync();
			setTimeout(()=>{
				this.screenWidth = systemInfo.windowWidth;
				this.screenHeight = systemInfo.windowHeight;
				this.characterX = parseInt(this.screenWidth*0.8) - this.reallyRandom(0,5)*45
				this.characterY = parseInt(this.screenHeight*0.6) - this.reallyRandom(0,5)*15
				this.enemyX = this.reallyRandom(0,5)*45
				this.enemyY = this.enemyY + this.reallyRandom(0,5)*10
				if(this.showTower || this.showTower2){
					this.towerLeft2 = this.screenWidth * 1.15
				}
			},100)
		},
		scroll: function(e) {
			this.old.scrollTop = e.detail.scrollTop
			this.old.scrollLeft = e.detail.scrollLeft
		},
		distanceComp(dis1,num) {
			if(this.distance <= dis1){
				return true
			}else{
				return false
			}
		},
		openMypack() {
			this.showMypack = true
			this.allPrice = 0
			this.myTool.forEach(item=>{
				this.allPrice = this.allPrice + parseInt(item.price)
			})
		},
		closePack() {
			this.showMypack = false
			this.nowToolInfo = null
		},
		toolInfo(info) {
			this.nowToolInfo = {...info}
		},
		getEnemy(num) {
			let chaLi = []
			res.data.forEach(item=>{
				if(item.level >= 205 && item.level <= 216){
					chaLi.push(item)
				}
			})
			res3.data.forEach(item=>{
				if(!item.isOther){
					let ite = {...item}
					if(this.gameType == 'tanxian2'){
						ite.gj = parseInt(ite.gj*1.8 + this.reallyRandom(0,5)*10)
						ite.fy = parseInt(ite.fy*2.2 + this.reallyRandom(0,5)*10)
						ite.blood = parseInt(ite.blood*2.2)
					}else{
						ite.gj = parseInt(ite.gj*1.8 + this.reallyRandom(0,5)*5)
						ite.fy = parseInt(ite.fy*2.2)
						ite.blood = parseInt(ite.blood*1.8)
					}
					ite.gs = ite.v
					ite.mk = ite.fy
					ite.icon = 'hero/' + ite.icon
					ite.speed = 0.8 - this.reallyRandom(0,2)*0.1
					ite.isHero = true
					chaLi.push(ite)
				}
			})
			this.enNoMove = false
			this.fastsp = 0
			this.fastsp2 = 0
			if(num == 1){
				this.enemy = {...chaLi[this.randomNum(0,chaLi.length - 1)]}
				this.enemyX = this.characterX - this.randomNum(0,500) + 250
				this.enemyY = this.characterY - this.randomNum(0,200) + 100
				this.showEnIcon = true
				this.enemyMoveContrl(2)
			}else{
				this.enemyMoveContrl(1,num)
				if(num == 2){
					this.enemy2 = {...chaLi[this.randomNum(0,chaLi.length - 1)]}
					this.enemyX2 = parseInt(this.screenWidth*1.2) - this.randomNum(10,this.screenWidth*1)
					this.enemyY2 = this.randomNum(100,this.screenHeight)
				}
				if(num == 3){
					this.enemy3 = {...chaLi[this.randomNum(0,chaLi.length - 1)]}
					this.enemyX3 = parseInt(this.screenWidth*1.2) - this.randomNum(10,this.screenWidth*1)
					this.enemyY3 = this.randomNum(100,this.screenHeight)
				}
				if(num == 4){
					this.enemy4 = {...chaLi[this.randomNum(0,chaLi.length - 1)]}
					this.enemyX4 = parseInt(this.screenWidth*1.2) - this.randomNum(10,this.screenWidth*1)
					this.enemyY4 = this.randomNum(100,this.screenHeight)
				}
				if(num == 5){
					this.enemy5 = {...chaLi[this.randomNum(0,chaLi.length - 1)]}
					this.enemyX5 = parseInt(this.screenWidth*1.2) - this.randomNum(10,this.screenWidth*1)
					this.enemyY5 = this.randomNum(100,this.screenHeight)
				}
			}
		},
		exit(){
			let self = this
			uni.showModal({
				title: '提示',
				content: '是否要撤离？',
				success: function (r) {
					if (r.confirm) {
						self.enemy = {}
						self.enemy2 = null
						self.enemy3 = null
						self.enemy4 = null
						self.enemy5 = null
						self.showEnIcon = false
						clearInterval(self.goTime)
						clearInterval(self.goTime2)
						clearInterval(self.goTime3)
						clearInterval(self.goTime4)
						clearInterval(self.goTime5)
						uni.setStorageSync('tanxianPack',JSON.stringify(self.myTool))
						setTimeout(()=>{
							uni.redirectTo({
								url: "/pages/white"
							})
						},200)
						if (self.bgAudio) {
						  try {
							self.bgAudio.pause();
							self.bgAudio.destroy()
							self.bgAudio = null
						  } catch (e) {
							//TODO handle the exception
						  }
						}
					} else if (r.cancel) {
						
					}
				}
			});
		},
		putMapEnemy(num) {
			if(num == 2){
				this.getEnemy(2)
			}
			if(num == 3){
				this.getEnemy(2)
				this.getEnemy(3)
			}
			if(num == 4){
				this.getEnemy(2)
				this.getEnemy(3)
				this.getEnemy(4)
			}
			if(num == 5){
				this.getEnemy(2)
				this.getEnemy(3)
				this.getEnemy(4)
				this.getEnemy(5)
			}
		},
		hardTools(boxType){
			//踩到宝箱
			if(boxType == 'box1.png' || boxType == 'box2.png' || boxType == 'box3.png'){
				let val = this.reallyRandom2()
				//紫金矿
				if(val>=0 && val<100){
					this.openToolImg = 'zijinkuang.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '紫金矿',
						detail: '矿物质，交易行的流通矿物之一。',
						img: 'zijinkuang.png',
						price: 700
					})
				}
				//大米
				if(val>=100 && val<270){
					this.openToolImg = 'rice.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '大米',
						detail: '家家户户的粮食，必需品。',
						img: 'rice.png',
						price: 150
					})
				}
				//戒指
				if(val>=270 && val<310){
					this.openToolImg = 'jiezi.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '凯尔的戒指',
						detail: '一枚价值不菲的戒指。',
						img: 'jiezi.png',
						price: 3900
					})
				}
				//金蛋
				if(val>=310 && val<360){
					if(this.reallyRandom(0,1) == 1){
						this.openToolImg = 'jindan.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '塔克的金杯',
							detail: '塔克的金杯，价值连城，拍卖行喜欢的收藏品。',
							img: 'jindan.png',
							price: 2500
						})
					}else{
						this.openToolImg = 'wurenji.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '无人机',
							detail: '大疆无人机。',
							img: 'wurenji.png',
							price: 19900
						})
					}
				}
				//锤子
				if(val>=360 && val<410){
					this.openToolImg = 'gongjucui.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '工具锤',
						detail: '木工用的工具铁锤，重量5kg',
						img: 'gongjucui.png',
						price: 300
					})
				}
				//斩魔刀
				if(val>=410 && val<422){
					this.openToolImg = 'zhanmodao.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '斩魔刀',
						detail: '斩魔刀，黄金制成，世间利器。',
						img: 'zhanmodao.png',
						gj: 85,
						fy: 0,
						fs: 0,
						flz: 0,
						price: 88000
					})
				}
				//仙灵羽翼扇
				if(val>=422 && val<430){
					this.openToolImg = 'xianling.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '仙灵羽翼扇',
						detail: '赤脚大仙府邸的宝物，拥有法力无边的威力，盘古开天后形成的宝物。',
						fs: 306,
						flz: 1000,
						gj: 0,
						fy: 0,
						img: 'xianling.png',
						price: 300000
					})
				}
				//钥匙
				if(val>=430 && val<480){
					if(this.reallyRandom(0,1) == 1){
						this.openToolImg = 'yaoshi.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '探险钥匙',
							detail: '探险模式的门卡钥匙',
							img: 'yaoshi.png',
							price: 2000
						})
					}else{
						this.openToolImg = 'camera.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '相机',
							detail: '一部数码相机，可以拍出很清晰的照片。',
							img: 'camera.png',
							price: 2500
						})
					}
				}
				//皇冠
				if(val>=480 && val<491){
					this.openToolImg = 'huangguan.png'
					this.openSpImg = true
					this.spImg = 'huangguan.gif'
					this.myTool.push({
						id: new Date().getTime(),
						name: '德玛西亚女皇皇冠',
						detail: '女皇的皇冠，象征着荣誉、和平、至高无上。',
						img: 'huangguan.png',
						price: 200000
					})
				}
				//开山斧
				if(val>=491 && val<510){
					this.openToolImg = 'kaishanfu.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '开山斧',
						detail: '开山斧，威力无穷，可将山给劈开。',
						gj: 60,
						fy: 30,
						fs: 0,
						flz: 0,
						img: 'kaishanfu.png',
						price: 10000
					})
				}
				//至尊幻焰剑
				if(val>=510 && val<515){
					this.openToolImg = 'zhizun.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '至尊幻焰剑',
						detail: '至尊幻焰剑，神挡杀神，无可匹及的存在。',
						img: 'zhizun.png',
						gj: 209,
						fs: 170,
						fy: 0,
						flz: 0,
						price: 300000
					})
				}
				//胸甲
				if(val>=515 && val<565){
					if(this.reallyRandom(0,1) == 1){
						this.openToolImg = 'xiongjia.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '胸甲',
							detail: '合成钢做的胸甲，坚硬无比。',
							img: 'xiongjia.png',
							fy: 65,
							price: 3000
						})
					}else{
						this.openToolImg = 'shouji.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '手机',
							detail: '一部智能手机。',
							img: 'shouji.png',
							price: 3800
						})
					}
				}
				//钻石
				if(val>=565 && val<577){
					this.openToolImg = 'zhuanshi.png'
					this.spImg = 'zhuanshi.gif'
					this.openSpImg = true
					this.myTool.push({
						id: new Date().getTime(),
						name: '钻石',
						detail: '地球稀有矿物，可打造很多钻石饰品，价值非常高。',
						img: 'zhuanshi.png',
						price: 100000
					})
				}
				//降龙剑
				if(val>=577 && val<582){
					this.openToolImg = 'xianglong.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '降龙剑',
						detail: '降龙宝剑，世间威力最大的剑，可斩龙，可上天入地...',
						img: 'xianglong.png',
						gj: 258,
						fs: 210,
						fy: 0,
						flz: 0,
						price: 350000
					})
				}
				//鼎
				if(val>=582 && val<645){
					this.openToolImg = 'ding.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '鼎',
						detail: '一顶很好看的鼎，用来承装东西，有一定的收藏价值，交易行很流行的物品。',
						img: 'ding.png',
						price: 3500
					})
				}
				//头盔
				if(val>=645 && val<696){
					this.openToolImg = 'toukui.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '头盔',
						detail: '防护用头盔',
						img: 'toukui.png',
						fy: 30,
						gj: 0,
						fs: 0,
						flz: 0,
						price: 800
					})
				}
				//聚龙锤
				if(val>=696 && val<705){
					this.openToolImg = 'julong.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '聚龙锤',
						detail: '一锤可定天下。拥有神龙的力量，可召唤出神龙。',
						img: 'julong.png',
						fs: 100,
						gj: 169,
						fy: 0,
						flz: 0,
						price: 250000
					})
				}
				//金杯
				if(val>=705 && val<720){
					this.openToolImg = 'jinbei.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '金杯',
						detail: '纯金打造的奖杯，交易行顶级藏品之一，价值非常高。',
						img: 'jinbei.png',
						price: 100000 + this.reallyRandom(0,5)*1263
					})
				}
				//画笔
				if(val>=720 && val<800){
					this.openToolImg = 'huabi.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '画笔',
						detail: '普通的毛笔，可用来作画、写字。',
						img: 'huabi.png',
						price: 100
					})
				}
				//卷轴
				if(val>=800 && val<890){
					this.openToolImg = 'zhanglaojuanzou.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '长老卷轴',
						detail: '长老的卷轴，收藏品。',
						img: 'zhanglaojuanzou.png',
						price: 380
					})
				}
				//诗经
				if(val>=890 && val<950){
					this.openToolImg = 'shijin.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '诗经',
						detail: '一套诗经集。',
						img: 'shijin.png',
						price: 200
					})
				}
				//手镯
				if(val>=950 && val<980){
					this.openToolImg = 'shouzhuo.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '手镯',
						detail: '一个昂贵的手镯，纯金打造。',
						img: 'shouzhuo.png',
						price: 30000
					})
				}
				if(val>=980){
					this.noTool = true
					this.openToolImg = ''
					uni.showToast({
						title: '箱子里什么也没有',
						icon:'none',
						duration: 1000
					});
				}
			}
			if(boxType == 'bigbox.png'){
				if(this.reallyRandom(0,5) == 0){
					this.openToolImg = 'ding.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '鼎',
						detail: '一顶很好看的鼎，用来承装东西，有一定的收藏价值，交易行很流行的物品。',
						img: 'ding.png',
						price: 3500
					})
				}
				if(this.reallyRandom(0,5) == 1){
					this.openToolImg = 'shouji.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '手机',
						detail: '一部智能手机。',
						img: 'shouji.png',
						price: 3800
					})
				}
				if(this.reallyRandom(0,5) == 2){
					this.openToolImg = 'zijinkuang.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '紫金矿',
						detail: '矿物质，交易行的流通矿物之一。',
						img: 'zijinkuang.png',
						price: 700
					})
				}
				if(this.reallyRandom(0,5) == 3){
					this.openToolImg = 'gon.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '枪',
						detail: '一把现代的沙鹰手枪，威力很大。',
						img: 'gon.png',
						price: 1500
					})
				}
				if(this.reallyRandom(0,5) == 4){
					this.openToolImg = 'chanzhang.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '长老的禅杖',
						detail: '唐僧的禅杖，法力很大。',
						fs: 185,
						flz: 300,
						fy: 0,
						gj: 0,
						img: 'chanzhang.png',
						price: 50000
					})
				}
				if(this.reallyRandom(0,5) == 5){
					if(this.randomNum(0,1) == 1){
						this.openToolImg = 'guangying.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '光影剑',
							detail: '传说中的光影剑，价值不可估量...',
							img: 'guangying.png',
							fs: 150,
							gj: 150,
							fy: 0,
							flz: 0,
							price: 220000
						})
					}
					if(this.randomNum(0,1) == 0){
						this.openToolImg = 'jian2.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '驱魔宝剑',
							detail: '驱魔宝剑，斩妖除魔的利器，是一把比较稀有的宝剑。',
							img: 'jian2.png',
							fs: 130,
							gj: 0,
							fy: 0,
							flz: 0,
							price: 6000
						})
					}
				}
			}
		},
		easyTools(boxType){
			//踩到宝箱
			if(boxType == 'box1.png' || boxType == 'box2.png' || boxType == 'box3.png'){
				let val = this.reallyRandom2()
				//紫金矿
				if(val>=0 && val<100){
					this.openToolImg = 'zijinkuang.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '紫金矿',
						detail: '矿物质，交易行的流通矿物之一。',
						img: 'zijinkuang.png',
						price: 700
					})
				}
				//大米
				if(val>=100 && val<300){
					if(this.randomNum(0,1) == 1){
						this.openToolImg = 'rice.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '大米',
							detail: '家家户户的粮食，必需品。',
							img: 'rice.png',
							price: 150
						})
					}else{
						this.openToolImg = 'poyifu.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '破衣服',
							detail: '一件破旧的衣服。',
							img: 'poyifu.png',
							price: 60
						})
					}
				}
				//戒指
				if(val>=300 && val<320){
					this.openToolImg = 'jiezi.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '凯尔的戒指',
						detail: '一枚价值不菲的戒指。',
						img: 'jiezi.png',
						price: 5000
					})
				}
				//金蛋
				if(val>=320 && val<365){
					this.openToolImg = 'jindan.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '塔克的金杯',
						detail: '塔克的金杯，价值连城，拍卖行喜欢的收藏品。',
						img: 'jindan.png',
						price: 2500
					})
				}
				//锤子
				if(val>=365 && val<435){
					this.openToolImg = 'gongjucui.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '工具锤',
						detail: '木工用的工具铁锤，重量5kg',
						img: 'gongjucui.png',
						price: 300
					})
				}
				//金砖
				if(val>=435 && val<447){
					this.openToolImg = 'jinzhuan.png'
					this.openSpImg = true
					this.spImg = 'jintiao.gif'
					this.myTool.push({
						id: new Date().getTime(),
						name: '金砖',
						detail: '足金999，质量100g，商品价值随当前金价波动。',
						img: 'jinzhuan.png',
						price: 95000 + this.reallyRandom(0,5)*1263
					})
				}
				//钥匙
				if(val>=447 && val<480){
					if(this.reallyRandom(0,1) == 1){
						this.openToolImg = 'yaoshi.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '探险钥匙',
							detail: '探险模式的门卡钥匙',
							img: 'yaoshi.png',
							price: 2000
						})
					}else{
						this.openToolImg = 'camera.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '相机',
							detail: '一部数码相机，可以拍出很清晰的照片。',
							img: 'camera.png',
							price: 2500
						})
					}
				}
				//皇冠
				if(val>=480 && val<490){
					this.openToolImg = 'huangguan.png'
					this.openSpImg = true
					this.spImg = 'huangguan.gif'
					this.myTool.push({
						id: new Date().getTime(),
						name: '德玛西亚女皇皇冠',
						detail: '女皇的皇冠，象征着荣誉、和平、至高无上。',
						img: 'huangguan.png',
						price: 200000
					})
				}
				//驱魔宝剑
				if(val>=490 && val<508){
					this.openToolImg = 'jian2.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '驱魔宝剑',
						detail: '驱魔宝剑，斩妖除魔的利器，是一把比较稀有的宝剑。',
						img: 'jian2.png',
						fs: 130,
						gj: 0,
						fy: 0,
						flz: 0,
						price: 6000
					})
				}
				//至尊幻焰剑
				if(val>=508 && val<515){
					this.openToolImg = 'zhizun.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '至尊幻焰剑',
						detail: '至尊幻焰剑，神挡杀神，无可匹及的存在。',
						img: 'zhizun.png',
						gj: 209,
						fs: 170,
						fy: 0,
						flz: 0,
						price: 300000
					})
				}
				//越王勾践剑
				if(val>=515 && val<540){
					this.openToolImg = 'jian3.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '越王勾践剑',
						detail: '越王勾践的剑，很稀有，价值连城。',
						img: 'jian3.png',
						gj: 65,
						fy: 0,
						fs: 0,
						flz: 0,
						price: 3000
					})
				}
				//钻石
				if(val>=540 && val<553){
					this.openToolImg = 'zhuanshi.png'
					this.spImg = 'zhuanshi.gif'
					this.openSpImg = true
					this.myTool.push({
						id: new Date().getTime(),
						name: '钻石',
						detail: '地球稀有矿物，可打造很多钻石饰品，价值非常高。',
						img: 'zhuanshi.png',
						price: 100000
					})
				}
				//古茗翡翠
				if(val>=553 && val<600){
					this.openToolImg = 'feicui.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '古茗翡翠',
						detail: '翡翠，可携带在身上辟邪，提升阳气，女士佩戴美观，男士佩戴雅观。',
						img: 'feicui.png',
						price: 1800
					})
				}
				//头盔
				if(val>=600 && val<680){
					this.openToolImg = 'toukui.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '头盔',
						detail: '防护用头盔',
						img: 'toukui.png',
						price: 800
					})
				}
				//金杯
				if(val>=680 && val<693){
					this.openToolImg = 'jinbei.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '金杯',
						detail: '纯金打造的奖杯，交易行顶级藏品之一，价值非常高。',
						img: 'jinbei.png',
						price: 100000 + this.reallyRandom(0,5)*1263
					})
				}
				//画笔
				if(val>=693 && val<800){
					if(val <= 775){
						this.openToolImg = 'huabi.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '画笔',
							detail: '普通的毛笔，可用来作画、写字。',
							img: 'huabi.png',
							price: 100
						})
					}else{
						this.openToolImg = 'wurenji.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '无人机',
							detail: '大疆无人机。',
							img: 'wurenji.png',
							price: 19900
						})
					}
				}
				//卷轴
				if(val>=800 && val<870){
					this.openToolImg = 'zhanglaojuanzou.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '长老卷轴',
						detail: '长老的卷轴，收藏品。',
						img: 'zhanglaojuanzou.png',
						price: 380
					})
				}
				//诗经
				if(val>=870 && val<930){
					this.openToolImg = 'shijin.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '诗经',
						detail: '一套诗经集。',
						img: 'shijin.png',
						price: 200
					})
				}
				if(boxType == 'box2.png' && val >= 930){
					this.openToolImg = 'gon.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '枪',
						detail: '一把现代的沙鹰手枪，威力很大。',
						img: 'gon.png',
						price: 1500
					})
					return
				}
				if(val>=930){
					this.noTool = true
					this.openToolImg = ''
					uni.showToast({
						title: '箱子里什么也没有',
						icon:'none',
						duration: 1000
					});
				}
			}
			if(boxType == 'bigbox.png'){
				if(this.reallyRandom(0,5) == 0){
					this.openToolImg = 'zhanglaojuanzou.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '长老卷轴',
						detail: '长老的卷轴，收藏品。',
						img: 'zhanglaojuanzou.png',
						price: 380
					})
				}
				if(this.reallyRandom(0,5) == 1){
					this.openToolImg = 'feicui.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '古茗翡翠',
						detail: '翡翠，可携带在身上辟邪，提升阳气，女士佩戴美观，男士佩戴雅观。',
						img: 'feicui.png',
						price: 1800
					})
				}
				if(this.reallyRandom(0,5) == 2){
					this.openToolImg = 'jian2.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '驱魔宝剑',
						detail: '驱魔宝剑，斩妖除魔的利器，是一把比较稀有的宝剑。',
						img: 'jian2.png',
						fs: 130,
						gj: 0,
						fy: 0,
						flz: 0,
						price: 6000
					})
				}
				if(this.reallyRandom(0,5) == 3){
					this.openToolImg = 'camera.png'
					this.myTool.push({
						id: new Date().getTime(),
						name: '相机',
						detail: '一部数码相机，可以拍出很清晰的照片。',
						img: 'camera.png',
						price: 2500
					})
				}
				if(this.reallyRandom(0,5) == 4){
					this.openToolImg = 'zhuanshi.png'
					this.spImg = 'zhuanshi.gif'
					this.openSpImg = true
					this.myTool.push({
						id: new Date().getTime(),
						name: '钻石',
						detail: '地球稀有矿物，可打造很多钻石饰品，价值非常高。',
						img: 'zhuanshi.png',
						price: 100000
					})
				}
				if(this.reallyRandom(0,5) == 5){
					if(this.randomNum(0,1) == 1){
						this.openToolImg = 'kaishanfu.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '开山斧',
							detail: '开山斧，威力无穷，可将山给劈开。',
							img: 'kaishanfu.png',
							gj: 60,
							fy: 30,
							fs: 70,
							flz: 0,
							price: 10000
						})
					}
					if(this.randomNum(0,1) == 0){
						this.openToolImg = 'zhanmodao.png'
						this.myTool.push({
							id: new Date().getTime(),
							name: '斩魔刀',
							detail: '斩魔刀，黄金制成，世间利器。',
							img: 'zhanmodao.png',
							gj: 85,
							fy: 0,
							fs: 70,
							flz: 0,
							price: 88000
						})
					}
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
	background-color: #000000;
	// background: url('../../static/imgs/bg5.jpeg');
	// background-size: cover;
	// background-repeat: no-repeat;
	// box-sizing: border-box;
	.bgImg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		object-fit: cover;
		z-index: 1;
	}
	.opreate {
		width: 100%;
		height: 250rpx;
		display: flex;
		position: fixed;
		left: 30rpx;
		bottom: 20rpx;
		z-index: 16;
		.mypackImg {
			width: 170rpx;
			height: 210rpx;
		}
	}

	.main {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.checkT {
			position: relative;
			left: 38rpx;
			top: -4rpx;
			color: #fff;
			background-color: #0aa9ff;
			font-size: 26rpx;
			padding: 2rpx 12rpx;
			border-radius: 8rpx;
		}

		.bettleIconImg {
			width: 90rpx;
			height: 90rpx;
			border-radius: 100%;
			box-shadow: 0rpx 0rpx 8rpx 6rpx #3e3e3e;
			position: absolute;
			transition: left ease, top ease, opacity linear;
			z-index: 4;
		}
		.bettleIconImgStyle {
			width: 160rpx;
			height: 160rpx;
			z-index: 5;
			margin-top: -36rpx;
			margin-left: -36rpx;
			box-shadow: none !important;
			border: none !important;
		}
		.flyImgStyle {
			width: 380rpx;
			height: 280rpx;
			z-index: 2;
			margin-top: -120rpx;
			margin-left: -142rpx;
			box-shadow: none !important;
			border: none !important;
		}
		.bettleIconImgTX {
			width: 130rpx;
			height: 130rpx;
			z-index: 5;
			box-shadow: none !important;
			transition: none !important;
			border: none !important;
		}
		.ArrowTX {
			position: absolute;
			transition: left linear, top linear;
			z-index: 3;
		}
		.circle1 {
			width: 150rpx;
			height: 150rpx;
			border-radius: 100%;
			box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(50, 255, 14, 0.6);
			background-color: rgba(139, 255, 67, 0.15);
			position: absolute;
			transition: left ease, top ease;
			z-index: 3;
		}
		.circle2 {
			width: 150rpx;
			height: 150rpx;
			border-radius: 100%;
			box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(255, 72, 16, 0.55);
			background-color: rgba(255, 59, 33, 0.1);
			position: absolute;
			transition: left ease, top ease;
			z-index: 3;
		}
		.name {
			color: $main-color;
			font-size: 32rpx;
			padding: 6rpx 0rpx;
		}
		.harmText2 {
			font-weight: bold;
			font-size: 36rpx;
		}
	}

	.openbox {
		width: 36%;
		position: fixed;
		top: 15%;
		left: 38%;
		z-index: 999;
		.openboxImg {
			width: 650rpx;
			height: 530rpx;
		}
		.toolImgs {
			width: 30%;
			z-index: 1000;
			position: relative;
			top: -610rpx;
			left: 50rpx;
			.toolImg {
				transform: scale(0.3);
			}
		}
		.spImgs {
			width: 50%;
			z-index: 1000;
			position: absolute;
			top: 20%;
			left: 20%;
			.spImgs {
				width: 100%;
				height: 100%;
			}
		}
		.loading {
			width: 290rpx;
			height: 290rpx;
			z-index: 1000;
			position: relative;
			top: -520rpx;
			left: 180rpx;
			.loadingImg {
				width: 100%;
				height: 100%;
			}
		}
	}
	.direct {
		z-index: 18;
		.left {
			width: 70rpx;
			height: 70rpx;
			position: fixed;
			right: 240rpx;
			top: 160rpx;
			z-index: 18;
		}
		.right {
			width: 70rpx;
			height: 70rpx;
			position: fixed;
			right: 60rpx;
			top: 160rpx;
			z-index: 18;
		}
		.top {
			width: 70rpx;
			height: 70rpx;
			position: fixed;
			right: 152rpx;
			top: 70rpx;
			z-index: 18;
		}
		.down {
			width: 70rpx;
			height: 70rpx;
			position: fixed;
			right: 152rpx;
			top: 250rpx;
			z-index: 18;
		}
	}
	.mapObj{
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		z-index: 2;
	}
	.tallentObjects {
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		z-index: 2;
		transition-property: top;
		transition-duration: 0.8s;
		transition-timing-function: linear;
	}

	.towerImg {
		position: absolute;
		top: 85%;
		left: 97%;
		width: 160px;
		height: 160px;
		z-index: 2;
	}
	.towercircle {
		width: 260px;
		height: 260px;
		border-radius: 100%;
		box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(255, 72, 16, 0.9);
		background-color: rgba(255, 59, 33, 0.3);
		position: absolute;
		top: 100px;
		z-index: 3;
	}
	.towercircle2 {
		box-shadow: 0rpx 0rpx 4rpx 2rpx rgba(50, 255, 14, 0.8);
		background-color: rgba(139, 255, 67, 0.35);
	}
	.mypack {
		width: 1330rpx;
		height: 93%;
		position: fixed;
		top: 20rpx;
		left: 20rpx;
		background: url('../../static/imgs/packageBg.png') no-repeat;
		background-size: 100% 100%;
		z-index: 1000;
		.tools{
			position: relative;
			width: 820rpx;
			left: 342rpx;
			top: 66rpx;
			display: flex;
			flex-wrap: wrap;
			.tools-item {
				width: 66rpx;
				height: 66rpx;
				margin-right: 34rpx;
				margin-top: 16rpx;
			}
			.tools-item:hover {
				border: 2rpx solid #ffed65;
			}
		}
	}
	.river {
		width: 380rpx;
		height: 670rpx;
		position: absolute;
		object-fit: cover;
		top: 200rpx;
		left: 45%;
		z-index: 1;
		opacity: 0.85;
	}
	.closePack {
		position: relative;
		width: 100rpx;
		height: 100%;
		left: calc(100% - 110rpx);
		top: -600rpx;
	}
	.toolInfo {
		width: 600rpx;
		position: absolute;
		top: calc(90% - 40rpx);
		left: 66rpx;
		font-size: 26rpx;
		color: #ffed65;
	}
	.allPrice {
		width: 200rpx;
		position: absolute;
		top: calc(90% - 26rpx);
		left: 700rpx;
		font-size: 32rpx;
		color: #ffed65;
	}
	.winlogo {
		width: 30%;
		position: fixed;
		top: 15%;
		left: 38%;
		display: flex;
		justify-content: center;
		z-index: 999;
		.winlogoImg {
			width: 92%;
		}
	}
}

</style>