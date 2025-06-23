<template>
	<!-- <view class="container" :style="{'background-image': 'url('+require('../../static/imgs/hero/'+bgImg)+')','background-size': 'cover','background-repeat':'no-repeat'}"> -->
	<view class="container" @tap="handleTap">
		<scroll-view :scroll-top="scrollTop" :scroll-left="scrollLeft" @scroll="scroll" scroll-y="true" scroll-x="true">
			<image class="bgImg" :style="{'z-index':bgZIndex,'width':screenWidth*1.45 + 'px','height': screenHeight*1.35 + 'px'}" :src="bgImg"></image>
			<view class="time" v-if="begin">
				<image class="aler" src="../../static/imgs/time.png"></image>
				<view class="timeText">0{{min}}:{{second}}</view>
			</view>
			<view class="vs">
				<view v-if="bettleEnd" @click.stop="backMenu" class="backMenu">返回主页</view>
				<image v-else-if="!begin" @click.stop="beginBettle" class="begImg" src="../../static/imgs/begin.png"></image>
			</view>
			<view class="winlogo" v-if="showWinLogo">
				<image class="winlogoImg" style="height: 420rpx" src="../../static/imgs/win.gif"></image>
			</view>
			<view class="winlogo" v-if="showWinLogo2">
				<image class="winlogoImg" style="height: 420rpx" src="../../static/imgs/challengeWin.gif"></image>
			</view>
			<view class="winlogo" v-if="showlose">
				<image class="winlogoImg" style="width: 100%;height: 500rpx" src="../../static/imgs/lose2.gif"></image>
			</view>
			<equipment style="width: 60%;z-index: 20;" v-if="openEq" :lists="myEquip" :tools="myTool" :moneys="money" @setMoney="setMoney" 
			@showEq="openEquip" @eqlist="getEqlist" @toolList="getToolList"></equipment>
			<view class="main">
				<view style="z-index: 3;">
				<view class="enemy">
					<view class="icon1">
						<image class="icon1Img icon2Img" :src="'../../static/imgs/'+enemy.icon"></image>
					</view>
					<view style="width: 100%;">
						<view class="name" style="color: #ffffff;">
							<label>{{enemy.name}}</label>
						</view>
						<view style="display: flex;width: 100%;">
							<view class="blood" ref="blood">
								<view class="bloodText">{{blood1}}/{{enemy.blood}}</view>
								<view class="bloodVal" :style="{width: bloodVal1 + '%'}"></view>
								<view class="bloodVal2" :style="{width: bloodVal1 + '%'}"></view>
							</view>
							<view class="harmText1" v-if="showHarm">
								-{{harm}}
							</view>
							<view class="harmText1" style="color: #00ff00" v-if="showAddBlood">
								+{{harm}}
							</view>
							<view class="enemyInfo">
								<view class="infoRow">
									<view style="display: flex;">
										<label>攻击：</label>
										<view style="color: #ff5a08;font-weight: bold;font-size: 32rpx;">
											<label>{{enemy.gj}}</label>
										</view>
									</view>
									<view style="display: flex;">
										<label>防御：</label>
										<view style="color: #ff5a08;font-weight: bold;font-size: 32rpx;">
											<label>{{enemy.fy}}</label>
										</view>
									</view>
									<view style="display: flex;">
										<label>魔抗：</label>
										<view style="color: #ff5a08;font-weight: bold;font-size: 32rpx;">
											<label>{{enemy.mk}}</label>
										</view>
									</view>
									<view style="display: flex;">
										<label>攻速：</label>
										<view style="color: #ff5a08;font-weight: bold;font-size: 32rpx;">
											<label>{{enemy.gs}}</label>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				</view>
			
				<view>
					<!-- 攻击动画 -->
					<image class="mygjAnm" :style="{top: parseInt(enemyY - 55) + 'px', left: parseInt(enemyX - 30) + 'px'}" :src="engjAnm" v-if="showEngjAnm"></image>
					<image class="mygjAnm" :style="{top: parseInt(characterY - 100) + 'px', left: parseInt(characterX - 70) + 'px'}" :src="mygjAnm" v-if="showMygjAnm"></image>
					<image class="bettleIconImg" v-if="showMyIcon" :style="characterStyle" :src="'../../static/imgs/hero/'+myHero.icon"></image>
					<image class="bettleIconImg" v-if="showEnIcon" :style="enemyStyle" :src="'../../static/imgs/'+enemy.icon"></image>
					<image v-if="txImg != ''" class="bettleIconImg bettleIconImgTX" :style="enemyStyle" :src="'../../static/imgs/'+txImg"></image>
					<image v-if="txImg2 != ''" class="bettleIconImg bettleIconImgTX" :style="characterStyle" :src="'../../static/imgs/'+txImg2"></image>
					<image v-if="ArrowTX != ''" class="ArrowTX" :style="ArrowStyle" :src="'../../static/imgs/'+ArrowTX"></image>
					<image v-if="ArrowTX2 != ''" class="ArrowTX" :style="ArrowStyle2" :src="'../../static/imgs/'+ArrowTX2"></image>
					<view class="circle1" :style="circle1Style"></view>
					<!-- <view class="circle2" :style="circle2Style"></view> -->
				</view>
				<view class="my">
					<view class="tallentBar" v-if="showTallentTime">
						<ai-progress percentage="100" :isAnimate="true" :duration="tallentDuring" bgColor="#ffd321"
						 :textInside="true" :strokeWidth="8"></ai-progress>
					</view>
					<view class="me" v-show="!yinshen">
						<view class="icon1" style="position: relative;top: 10rpx;">
							<image class="icon1Img" :src="'../../static/imgs/hero/'+myHero.icon"></image>
						</view>
						<view style="width: 100%;">
							<view style="display: flex;width:100%">
								<view style="width: 35%;">
									<view class="name">
										<label>{{myHero.name}}</label>
										<label class="checkT" @click="toTInfo">技能说明</label>
									</view>
									<view style="display: flex;width: 100%;">
										<view class="blood" style="width: 100%;">
											<view class="bloodText">{{blood2}}/{{myHero.blood}}</view>
											<view class="bloodVal mybloodVal" :style="{width: bloodVal2 + '%'}"></view>
											<view class="bloodVal2 mybloodVal2" :style="{width: bloodVal2 + '%'}"></view>
										</view>
									</view>
									<view class="blood" style="height: 34rpx;margin-top: 12rpx;width: 100%;">
										<view class="blueVal" :style="{width: blueVal + '%'}"></view>
										<view class="bloodText" style="position: absolute;width: 35%;">{{flz}}/{{myHero.flz}}</view>
									</view>
								</view>
								<view class="enemyInfo" v-show="!yinshen">
									<view class="infoRow" style="justify-content: flex-start;">
										<view style="display: flex;flex-direction: column;justify-content: flex-end;">
											<view class="harmText2" :style="{color: harm2<0?'#ed0003':'#00ff00'}" v-if="showHarm2">
												{{harm2<0? harm2 : ('+' + harm2)}}
											</view>
											<view class="infoRow">
												<label>攻击力：</label><label class="val">{{myHero.gj}}</label>
											</view>
											<view class="infoRow">
												<label>法术强度：</label><label class="val">{{myHero.fs}}</label>
											</view>
										</view>
										<view style="display: flex;flex-direction: column;justify-content: flex-end;margin-left: 30rpx;">
											<view class="infoRow">
												<label>防御力：</label><label class="val">{{myHero.fy}}</label>
											</view>
											<view class="infoRow">
												<label>攻击速度：</label><label class="val">{{myHero.v}}</label>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="opreate">
								<view class="store" @click="openEquip(true)">
									<image class="storeImg" src="../../static/imgs/storeIcon.png"></image>
									<view class="storeText">装备商店</view>
								</view>
								<view class="tool">
									<view class="tooltext">道具</view>
									<view class="store" v-if="myTool.length >= 1" v-for="item in myTool.slice(0,myTool.length>=2?2:1)">
										<image class="toolImg" @click.stop="useTool(item.name)" :src="item.icon"></image>
										<view class="storeText">{{item.name}}</view>
									</view>
									<view style="color: #fff;margin-top: 32rpx;" v-if="myTool.length == 0">暂无道具</view>
								</view>
							</view>
						</view>
					</view>
					<view class="tallent">
						<view class="tallentRow">
							<tallent ref="tallents" :noflz="flz == 0" :name="myHero.name" :heroId="myHero.id" 
							@tallent="tallentHandle" :disList="[myHero.dis1,myHero.dis2,myHero.dis3,myHero.dis4]" :dist="distance"></tallent>
						</view>
					</view>
					</view>
					<view class="regularGj" v-if="cd5" @click.stop="regGj">
						<image class="storeImg" src="../../static/imgs/gj.png" ></image>
						<view class="storeText">攻击/追击</view>
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
					<image v-if="showTower" class="towerImg" :style="{left: towerLeft2 + 'px'}" src="../../static/imgs/tower.png"></image>
					<!-- 不同地图的防御塔不同 -->
					<image v-if="showTower2" class="towerImg2" :style="{left: towerLeft + 'px'}" src="../../static/imgs/tower2.png"></image>
					<image v-if="showTower2" class="towerImg2" :style="{left: towerLeft2 + 'px'}" src="../../static/imgs/tower2.png"></image>
					<view v-if="showTower || showTower2" class="towercircle" :style="{left: (towerLeft - 50) + 'px'}"></view>
					<view v-if="showTower || showTower2" class="towercircle towercircle2" :style="{left: (towerLeft2 - 50) + 'px'}"></view>
					<image v-if="bgImg.indexOf('battlebg3') != -1" class="river"  src="../../static/imgs/river.png"></image>
				<!-- 查看技能介绍 -->
				<view class="sel" style="height: 75%;position: absolute;top: 20%;" v-if="showTInfo">
					<view class="close" @click="closeT">×</view>
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
		</scroll-view>
	</view>
</template>

<script>
import tallent from '@/components/tallent/index2.vue'
import equipment from '@/components/equipment/index.vue'
import res from '../../static/data/challegeEnemy.json'
import res2 from '../../static/data/exp.json'
import heroStrongList from '../../static/data/heroStrong.json'
import { editMoney } from '../../utils/editUser'
import aiProgress from '@/components/ai-progress/ai-progress.vue'

export default {
	data() {
		return {
			myHero: {},
			begin: false,
			enemy: {},
			blood1: 0,
			blood2: 0,
			flz: 0,
			bloodVal1: 100,
			bloodVal2: 100,
			blueVal: 100,
			shotVal1: 0,
			shotVal2: 0,
			time1: null,
			time2: null,
			time3: null,
			cd1: null,
			cd2: null,
			cd3: null,
			cd4: null,
			cd5: true,
			beatTime: 0,	//持续性伤害时间
			beatTime2: 0,	//敌方持续性伤害时间
			min: 0,
			second: 0,
			gs1: 0,
			gs2: 0,
			harm: 0,	//给敌方的伤害
			harm2: 0,
			showHarm: false,
			showHarm2: false,
			showAddBlood: false,
			bettleEnd: false,
			shotDown: false,
			openEq: false,
			myEquip: [],
			myTool: [],
			myEquipName: [],
			regGjAdd: {	//普攻加成
				gjHarm: 0, 	//普攻附加伤害
				addBlood: 0,  //回血
				addFlz: 0,   //回魔法
			},
			flag: 0,
			flag2: 0,
			bgImg: '../../static/imgs/battlebg3.jpg',
			bgImg2: '../../static/imgs/battlebg.jpg',
			win: false,
			money: 0,
			xuli: 0,	//武器大师蓄力
			jinbiao: false,
			gameType: null,
			fyS: 1.7,	//敌方对自己护甲穿透，越小伤害越高
			showTInfo: false,
			showIntro: false,
			tallentList: [],
			innerAudioContext: [null,null,null,null,null,null,null,null],
			ygbj: false,	//嫦娥月光标记或战士换枪标记
			ylzz: null,	//影流之主flag
			yinshen: false,  //自己隐身
			yinshen2: false,  //敌方隐身
			dianren: false,	//电刃标记
			bgImgIndex: 0,	//背景图标记
			addData: {},	//英雄经验加成数据
			xinshiFlag: 0,	//星蚀武器
			xinzhigang: 0,	//心之钢
			tallentDuring: 1000 ,//技能释放延时
			showTallentTime: false,
			bgZIndex: 1,
			pojia: 1,
			pomo: 1,
			wzhy: null,	//无终恨意计时器
			origHero: {},	//英雄初始数据
			loop: 1	,//关卡
			mygjAnm: '',
			engjAnm: '',
			showMygjAnm: false,	//我方英雄攻击动画
			showEngjAnm: false,	//敌方英雄攻击动画
			showWinLogo: false,
			showWinLogo2: false,
			showlose: false,
			myspeed: 1.1,
			fastsp: 0,
			fastsp2: 0,
			enspeed: 1,
			goTime: null,
			goTime2: null,
			characterX: 680,
			characterY: 250,
			enemyX: 30,
			enemyY: 130,
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
			antijiansu: 0,	//反减速
			txImg: '',
			txImg2: '',
			bigGJTX: 'none'		,//我方大伤害攻击特效
			bigGJTX2: 'none',		//敌方大伤害攻击特效
			ArrowTX: '',
			ArrowTX2: '',
			arrowWid: 100,
			arrowHei: 35,
			arrowWid2: 100,
			arrowHei2: 35,
			heroMoveType: 1,	//我方移动方向
			arrowX: 0,
			arrowY: 0,
			arrowX2: 0,
			arrowY2: 0,
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
			towerLeft: 100,
			towerLeft2: 900,
			regGjTimeout: false,
			showEnIcon: true,
			showMyIcon: true,
			arrowtimeout: null,
			arrowtimeout2: null,
			riverTime: null,
			riverTime2: null,
			tempEnemyIcon: null
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
		circle1Style() {
			return {
			  left: parseInt(this.characterX - this.myHero.distance + 22) + 'px',
			  top: parseInt(this.characterY - this.myHero.distance + 22) + 'px',
			  width: parseInt(this.myHero.distance *2) + 'px',
			  height: parseInt(this.myHero.distance*2) + 'px',
			  transitionDuration:  parseFloat(parseFloat(this.myspeed)-parseFloat(this.fastsp)).toFixed(2)+ 's'
			}
		},
		circle2Style() {
			return {
			  left: parseInt(this.enemyX - this.enemyGJdis + 22) + 'px',
			  top: parseInt(this.enemyY - this.enemyGJdis + 22) + 'px',
			  width: parseInt(this.enemyGJdis*2) + 'px',
			  height: parseInt(this.enemyGJdis*2) + 'px',
			  transitionDuration:  parseFloat(parseFloat(this.enspeed)-parseFloat(this.fastsp2)).toFixed(2)+ 's'
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
		if(JSON.parse(uni.getStorageSync('user')).showIntro == 1){
			this.showIntro = true
		}else{
			this.showIntro = false
		}
		let userInfo = JSON.parse(uni.getStorageSync('user'))
		this.money = parseInt(userInfo.money)
		this.bgImgIndex = this.reallyRandom(0,4)
		if(this.bgImgIndex == 0){
			this.bgImg = '../../static/imgs/battlebg.jpg'
		}else if(this.bgImgIndex == 1){
			this.bgImg = '../../static/imgs/battlebg2.jpg'
		}else if(this.bgImgIndex == 2){
			this.bgImg = '../../static/imgs/battlebg3.jpg'
		}else if(this.bgImgIndex == 3){
			this.bgImg = '../../static/imgs/battlebg4.jpg'
		}else if(this.bgImgIndex == 4){
			this.bgImg = '../../static/imgs/battlebg5.jpg'
		}
		this.putMapTools()
		if(this.gameType == 'fuben' || this.gameType == 'paiwei'){
			if(this.bgImgIndex == 0 || this.bgImgIndex == 4){
				this.showTower2 = true
			}else{
				this.showTower = true
			}
		}
		// if(this.gameType == 'wuxian'){
		// 	this.bgImg = '../../static/imgs/wuxianBg.jpg'
		// 	this.bgImg2 = '../../static/imgs/wuxianBg.jpg'
		// }
	},
	onLoad(option) {
		if(option){
			this.myHero = JSON.parse(option.item)
			this.enemy = JSON.parse(option.en)
			this.blood1 = this.enemy.blood
			this.gameType = uni.getStorageSync('gameType')
			if(this.gameType == 'match' || (this.gameType == 'paiwei' && !this.enemy.speed)){
				this.enemy.speed = 0.9
			}
			this.enspeed = this.enemy.speed
			this.enemyGJdis = this.enemy.distance
			let self = this
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			datas.forEach((it,idx)=>{
				if(self.myHero.id == it.id){
					self.addData = {...it}
				}
			})
			//装填英雄属性加成
			self.getAddTalent(option)
			self.origHero = {...self.myHero}
			//敌方英雄随机属性加成
			if(self.gameType == 'fuben' || self.gameType == 'jinbiao' || self.gameType == 'match'){
				self.addEnemyStrong()
			}
			if(self.gameType == 'paiwei') {
				if(uni.getStorageSync('paiweiHero')){
					let eqli = []
					let he = []
					he = JSON.parse(uni.getStorageSync('paiweiHero'))
					he.forEach((i,d)=>{
						if(i.id == this.myHero.id && he[d].eqlist){
							he[d].eqlist.map(ite=>{
								eqli.push(JSON.parse(ite))
							})
						}
					})
					if(eqli.length != 0){
						self.getEqlist(JSON.stringify(eqli),true)
					}
				}
			}
			if(self.gameType == 'wuxian'){
				if(uni.getStorageSync('wuxianLevel') == 0){
					self.modelFrame('欢迎来到无限战争','消息')
				}else{
					self.modelFrame('欢迎来到无限战争，您的历史最好成绩是第'+uni.getStorageSync('wuxianLevel')+'关','消息')
				}
			}
		}
	},
	components: {
		tallent,
		equipment
	},
	methods: {
		beginBettle() {
			if(this.myEquip.length == 0){
				//法师
				if(this.myHero.fs >= 50){
					let li = [{"_id":{"$oid":"6509a9647ad52ddc64ea029c"},"name":"灭世者的死亡之帽","gj":0,"fy":0,"fs":100,"mk":0,"blood":0,"flz":200,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3089.png","detail":"法术强度+100，法力值+200","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b08409664caf2943e60d"},"name":"兰顿之兆","gj":0,"fy":75,"fs":0,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3143.png","detail":"防御+75，生命值+350，主动触发时对附近敌人造成50%减速持续3秒。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509aa337ad52ddc64ea2a71"},"name":"莫雷洛秘典","gj":0,"fy":0,"fs":60,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3165.png","detail":"法术强度+60，生命值+350，每施放一个法术技能时，带法术吸血效果（生命值回复）。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509aa337ad52ddc64ea2a73"},"name":"卢登的配枪","gj":0,"fy":0,"fs":70,"mk":0,"blood":0,"flz":350,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6655.png","detail":"法术强度+70，法力值+350。该武器可以当道具使用，主动激发可使敌方造成一定的伤害。","bj":0,"price":370,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b15"},"name":"法师之靴","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3020.png","detail":"法师鞋子，提升移动速度25%，增加15%法术穿透","bj":0,"price":220,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509a9647ad52ddc64ea029c"},"name":"灭世者的死亡之帽","gj":0,"fy":0,"fs":100,"mk":0,"blood":0,"flz":200,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3089.png","detail":"法术强度+100，法力值+200","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509a9647ad52ddc64ea036c"},"name":"虚空之杖","gj":0,"fy":0,"fs":60,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3135.png","detail":"法术强度+60。30%法术穿透","bj":0,"price":350,"istool":0},
					{"_id":{"$oid":"6509aa337ad52ddc64ea2a76"},"name":"冰晶节杖","gj":0,"fy":0,"fs":40,"mk":0,"distance": 10,"blood":600,"flz":500,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3116.png","detail":"法术强度+40，法力值+500，生命值+600。冰封：装上此装备释放的技能会使对方移动速度减少25%（持续2秒）","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b15"},"name":"法师之靴","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3020.png","detail":"法师鞋子，提升移动速度25%，增加15%法术穿透","bj":0,"price":220,"istool":0,"isShoot":true}]
					if(this.reallyRandom(0,1) == 0){
						if(editMoney(-1580)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li))
						}
					}else{
						if(editMoney(-1260)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li2))
						}
					}
				}else if(this.myHero.details == '射手'){
					let li = [{"_id":{"$oid":"6509acbda7c432baa0c89b30"},"name":"破败王者之刃","gj":30,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3153.png","detail":"攻击力+30，攻速+25%，释放技能和普通攻击有15%生命偷取（与饮血剑装备叠加则无效）。","bj":0,"price":335,"istool":0},
					{"_id":{"$oid":"6509acbda7c432baa0c89b35"},"name":"急射火炮","gj":25,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3094.png","detail":"如果装备的英雄是【射手】，暴击几率提升至0.2，攻击力提升至40，攻速提升至30%，攻击范围提升至15码","bj":0.1,"price":260,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b7cb"},"name":"界弓","gj":20,"fy":0,"fs":0,"mk":0,"blood":0,"distance": 10,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3302.png","detail":"如果装备的英雄是【射手】，攻击速度提升35%，攻击力提升至35，护甲穿透10%","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509b08409664caf2943e60d"},"name":"兰顿之兆","gj":0,"fy":75,"fs":0,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3143.png","detail":"防御+75，生命值+350，主动触发时对附近敌人造成50%减速持续3秒。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b12"},"name":"狂战士胫甲","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3006.png","detail":"提升移动速度25%，增加20%攻击速度","bj":0,"price":200,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":60,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+60，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":375,"istool":0},
					{"_id":{"$oid":"6509acbda7c432baa0c89b35"},"name":"急射火炮","gj":25,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3094.png","detail":"如果装备的英雄是【射手】，暴击几率提升至0.2，攻击力提升至40，攻速提升至30%，攻击范围提升至15码","bj":0.1,"price":260,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b7cb"},"name":"界弓","gj":20,"fy":0,"fs":0,"mk":0,"blood":0,"distance": 10,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3302.png","detail":"如果装备的英雄是【射手】，攻击速度提升35%，攻击力提升至35，护甲穿透10%","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509b08409664caf2943e60d"},"name":"兰顿之兆","gj":0,"fy":75,"fs":0,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3143.png","detail":"防御+75，生命值+350，主动触发时对附近敌人造成50%减速持续3秒。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b12"},"name":"狂战士胫甲","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3006.png","detail":"提升移动速度25%，增加20%攻击速度","bj":0,"price":200,"istool":0,"isShoot":true}]
					if(this.reallyRandom(0,1) == 0){
						if(editMoney(-1415)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li))
						}
					}else{
						if(editMoney(-1455)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li2))
						}
					}
				}else if(this.myHero.details == '刺客'){
					let li = [{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":60,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+60，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":375,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b91f"},"name":"收集者","gj":50,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6676.png","detail":"攻击力+50，护甲穿透10%。【刺客专属特效】如果敌方生命值低于16%，任意有伤害的技能会直接秒杀对方。","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b93f"},"name":"电震涡流剑","gj":55,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6699.png","detail":"攻击力+55。【刺客专属特效】每次冲刺性的技能都会提升5攻击力，且冲刺的伤害提升。","bj":0,"price":335,"istool":0},
					{"_id":{"$oid":"6509b08409664caf2943e60d"},"name":"兰顿之兆","gj":0,"fy":75,"fs":0,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3143.png","detail":"防御+75，生命值+350，主动触发时对附近敌人造成50%减速持续3秒。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b28"},"name":"明朗之靴","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3158.png","detail":"提升移动速度25%，在脱离战斗下，提升额外15%移动速度","bj":0,"price":180,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":60,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+60，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":375,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b91f"},"name":"收集者","gj":50,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6676.png","detail":"攻击力+50，护甲穿透10%。【刺客专属特效】如果敌方生命值低于16%，任意有伤害的技能会直接秒杀对方。","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"黑曜切割者","gj":50,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7037.png","detail":"攻击力+50，生命值+500，15%护甲穿透","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6509b08409664caf2943e60d"},"name":"兰顿之兆","gj":0,"fy":75,"fs":0,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3143.png","detail":"防御+75，生命值+350，主动触发时对附近敌人造成50%减速持续3秒。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b28"},"name":"明朗之靴","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3158.png","detail":"提升移动速度25%，在脱离战斗下，提升额外15%移动速度","bj":0,"price":180,"istool":0,"isShoot":true}]
					if(this.reallyRandom(0,1) == 0){
						if(editMoney(-1510)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li))
						}
					}else{
						if(editMoney(-1535)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li2))
						}
					}
				}else{	//战士
					let li = [{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"黑曜切割者","gj":50,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7037.png","detail":"攻击力+50，生命值+500，15%护甲穿透","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6509acbda7c432baa0c89b30"},"name":"破败王者之刃","gj":30,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3153.png","detail":"攻击力+30，攻速+25%，释放技能和普通攻击有15%生命偷取（与饮血剑装备叠加则无效）。","bj":0,"price":335,"istool":0},
					{"_id":{"$oid":"6509b11ff08210d515235598"},"name":"狂徒铠甲","gj":0,"fy":0,"fs":0,"mk":0,"blood":1350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3083.png","detail":"生命值+1350，一旦没有受到敌方伤害，每秒回复35生命值","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b2ca"},"name":"焚天","gj":30,"fy":0,"fs":0,"mk":0,"blood":400,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6610.png","detail":"在释放两个普通技能后（非大招），普通攻击必定会爆击","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b23"},"name":"铁板靴","gj":0,"fy":25,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3047.png","detail":"提升移动速度25%，防御力提升25","bj":0,"price":220,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"黑曜切割者","gj":50,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7037.png","detail":"攻击力+50，生命值+500，15%护甲穿透","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6509b08409664caf2943e60d"},"name":"兰顿之兆","gj":0,"fy":75,"fs":0,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3143.png","detail":"防御+75，生命值+350，主动触发时对附近敌人造成50%减速持续3秒。","bj":0,"price":330,"istool":0},		
					{"_id":{"$oid":"6509b11ff08210d515235598"},"name":"狂徒铠甲","gj":0,"fy":0,"fs":0,"mk":0,"blood":1350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3083.png","detail":"生命值+1350，一旦没有受到敌方伤害，每秒回复35生命值","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b2ca"},"name":"焚天","gj":30,"fy":0,"fs":0,"mk":0,"blood":400,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6610.png","detail":"在释放两个普通技能后（非大招），普通攻击必定会爆击","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b23"},"name":"铁板靴","gj":0,"fy":25,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3047.png","detail":"提升移动速度25%，防御力提升25","bj":0,"price":220,"istool":0,"isShoot":true}]
					if(this.reallyRandom(0,1) == 0){
						if(editMoney(-1575)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li))
						}
					}else{
						if(editMoney(-1570)){
							uni.showToast({
								title: '已自动购买装备',
								icon:'none',
								duration: 600
							});
							this.getEqlist(JSON.stringify(li2))
						}
					}
				}
			}
			this.begin = true
			this.shotDown = false
			this.enNoMove = false
			this.myNoMove = false
			this.fastsp = 0
			this.fastsp2 = 0
			this.enemyBeat();
			if(this.second == 0){
				this.timeBg();
			}
			this.computeDistance()
			this.enemyMoveContrl(2)
		},
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
			
		},
		//敌方英雄属性随机加成
		addEnemyStrong(){
			let level = parseInt(this.addData.allPointer)/500
			if(level>=25){
				this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*55,parseInt(this.enemy.blood*0.15) + parseInt(level)*90))
			}else if(level>=20 && level<25){
				this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*40,parseInt(this.enemy.blood*0.13) + parseInt(level)*75))
			}else if(level>=15 && level<20){
				this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*35,parseInt(this.enemy.blood*0.1) + parseInt(level)*65))
			}else if(level>=7 && level<15){
				this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*35,parseInt(this.enemy.blood*0.1) + parseInt(level)*50))
			}else{
				this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*25,parseInt(this.enemy.blood*0.1) + parseInt(level)*50))
			}
			this.blood1 = this.enemy.blood
			this.enemy.gj = this.enemy.gj + this.randomNum(parseInt(level),parseInt(level)+parseInt(this.enemy.gj*(0.06+level*0.01)))
			this.enemy.fy = this.enemy.fy + this.randomNum(parseInt(level),parseInt(level)+parseInt(this.enemy.fy*(0.12+level*0.01)))
			this.enemy.mk = this.enemy.mk + this.randomNum(parseInt(level),parseInt(level)+parseInt(this.enemy.mk*(0.12+level*0.01)))
		},
		enemyBeat() {
			clearInterval(this.time1)
			if(!this.begin){
				return
			}
			this.gs1 = parseFloat(this.enemy.gs) * 1000
			this.time1 = setInterval(()=>{
				if(this.shotDown){
					return
				}
				//排位赛敌方英雄伤害、技能
				if((this.gameType == 'paiwei' || this.gameType == 'match') && this.enemy.isHero){
					if(this.randomNum(0,1) == 1){
						//敌方技能cd
						if(this.enemyBeatCD == null){
							setTimeout(()=>{
								this.enemyBeatCD = null
							},5000 + this.randomNum(0,10)*350)
							if(this.distanceComp(this.enemy.dis1)){
								setTimeout(()=>{
									this.enemyTallent(1)
								},200)
							}
							if(this.distanceComp(this.enemy.dis2)){
								setTimeout(()=>{
									this.enemyTallent(2)
								},1000)
							}
							if(this.distanceComp(this.enemy.dis3)){
								setTimeout(()=>{
									this.enemyTallent(3)
								},2300)
							}
							if(this.distanceComp(this.enemy.dis4)){
								setTimeout(()=>{
									this.enemyTallent(4)
								},3300)
							}
							this.enemyBeatCD = 1
						}
					}
				}
				this.enemyHarm()	//触发事件
				//不在攻击范围内
				if(this.enemyGJdis < this.distance){
					if(this.distance <= 380 && this.bloodVal1 <= 38 && this.bloodVal1 > 2){
						this.enemyMoveContrl(3)	//逃跑
					}else if(this.bloodVal1 <= 38 && this.bloodVal1 > 2){
						if(this.randomNum(0,1) == 1){
							this.enemyMoveContrl(1)	//自由模式
						}
					}
					return
				}else{
					//如果双方都没血
					if(this.bloodVal1 <= 38 && this.bloodVal1 > 2 && this.bloodVal2 <= 38){
						this.enemyMoveContrl(this.randomNum(2,3))	//冲击或逃跑
					}
				}
				this.fyS = 2.3
				if(parseInt(this.myHero.fy) > 150 && parseInt(this.myHero.fy) < 230) {
					this.fyS = 2
				}
				if(parseInt(this.myHero.fy) >= 230) {
					this.fyS = 1.65
				}
				let h = (parseInt(this.enemy.gj * 3) - parseInt(this.myHero.fy * this.fyS)) * 2
				if(h<0){
					h = 0
				}
				this.shotVal1 = h + this.randomNum(50,parseInt(this.enemy.gj * 1.6))
				this.shotVal1 = parseInt(this.shotVal1)
				//排位赛敌方英雄伤害、技能
				if((this.gameType == 'paiwei' || this.gameType == 'match') && this.enemy.isHero){
					this.shotVal1 = parseInt(parseInt(this.shotVal1)*0.5)
				}
				//伤害显示
				this.harm2 = -this.shotVal1
				this.showHarm2 = true
				let t = 800
				if(this.shotVal1 >= 950){
					t = 1500
					this.bigGJTX2 = 6 + 'rpx solid red'
				}
				this.txImg2 = 'engjTX.gif'
				setTimeout(()=>{
					this.showHarm2 = false
					this.bigGJTX2 = 'none'
					this.txImg2 = ''
				},t)
				if(parseInt(this.blood2) - parseInt(this.shotVal1) > 0){
					this.blood2 = parseInt(this.blood2) - parseInt(this.shotVal1)
					this.bloodVal2 = Math.round(parseInt(this.blood2) / parseInt(this.myHero.blood) * 100)
				}else{
					this.loseBettle()
				}
			},this.gs1)
		},
		
		//自定义敌方伤害
		enemyBeat2(val) {
				if(this.shotDown || !this.begin || this.bettleEnd){
					return
				}
				// //不在攻击范围内
				// if(this.enemyGJdis < this.distance){
				// 	if(this.distance > 220 && this.bloodVal1 <= 38 && this.bloodVal1 > 2){
				// 		this.enemyMoveContrl(1)	//自由模式
				// 	}
				// 	return
				// }
				this.fyS = 2.2
				if(parseInt(this.myHero.fy) > 150 && parseInt(this.myHero.fy) < 230) {
					this.fyS = 2
				}
				if(parseInt(this.myHero.fy) >= 230) {
					this.fyS = 1.65
				}
				this.shotVal1 = (val - parseInt(this.myHero.fy * this.fyS)) * 2
				
				if(parseInt(this.shotVal1) < 50){
					this.shotVal1 = 50 + this.randomNum(0,200)
				}
				this.shotVal1 = parseInt(this.shotVal1)
				//伤害显示
				this.harm2 = -this.shotVal1
				this.showHarm2 = true
				let t = 800
				if(this.shotVal1 >= 950){
					t = 1500
					this.bigGJTX2 = 6 + 'rpx solid red'
				}
				this.txImg2 = 'engjTX.gif'
				setTimeout(()=>{
					this.showHarm2 = false
					this.bigGJTX2 = 'none'
					this.txImg2 = ''
				},t)
				if(parseInt(this.blood2) - parseInt(this.shotVal1) > 0){
					this.blood2 = parseInt(this.blood2) - parseInt(this.shotVal1)
					this.bloodVal2 = Math.round(parseInt(this.blood2) / parseInt(this.myHero.blood) * 100)
				}else{
					this.loseBettle()
				}
		},
		
		//敌方持续攻击
		consistEnemyBeat(val,time,timeOut) {
			let time2 = null
			if(!this.bettleEnd || this.begin){
			time2 = setInterval(()=>{
				if(this.shotDown){
					return
				}
				if(this.bettleEnd || !this.begin){
					clearInterval(time2)
					return
				}
				this.shotVal1 = parseInt(val)
				if(this.shotVal1<=50){
					this.shotVal1 = this.randomNum(60,100)
				}
				//伤害显示
				this.harm2 = -this.shotVal1
				this.showHarm2 = true
				if(this.shotVal1 >= 800){
					this.bigGJTX2 = 6 + 'rpx solid red'
				}
				this.showTX(1,2,false)
				setTimeout(()=>{
					this.showHarm2 = false
					this.bigGJTX2 = 'none'
					this.showTX(1,2,true)
				},800)
				
				if(parseInt(this.blood2) - parseInt(this.shotVal1) > 0){
					this.blood2 = parseInt(this.blood2) - parseInt(this.shotVal1)
					this.bloodVal2 = Math.round(parseInt(this.blood2) / parseInt(this.myHero.blood) * 100)
				}else{
					clearInterval(time2)
					this.loseBettle()
				}
			},time)
			setTimeout(()=>{
				clearInterval(time2)
			},timeOut)
			}
		},
		timeBg() {
			const self = this
			clearInterval(this.time3)
			this.time3 = setInterval(()=>{
				if(self.second+1 == 60) {
					self.second = 0
					self.min += 1
				}
				self.second += 1
				self.towerBeat()
				if(self.enspeed <= 0.3){
					self.enspeed = 0.7
				}
			},1000)
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
		//敌方发动攻击触发事件
		enemyHarm() {
			//自己装备的效果
			if(this.myEquipName.includes('挑战护手') && this.flag == 0) {
				if(this.bloodVal2 <= 30){
					this.addBlood(800,0,0)
					this.myHero.fy = parseInt(this.myHero.fy) + 25
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy) - 25
					},6000)
					this.flag = 1
				}
			}
			//自己装备的效果
			if(this.myEquipName.includes('天使之杖') && this.flag == 0) {
				if(this.bloodVal2 <= 30){
					this.addBlood(800,0,0)
					this.flag = 1
				}
			}
			if(this.myEquipName.includes('玛莫提乌斯之噬') && this.flag == 0) {
				if(this.bloodVal2 <= 30){
					this.addBlood(600,0,0)
					this.flag = 1
				}
			}
			if(this.myHero.id == 17 && this.flag == 0) {
				if(this.bloodVal2 <= 26){
					this.heroAnm('../../static/imgs/hero/fuhuo.gif?'+ new Date().getTime())
					this.backBgImg('fuhuo',3000)
					this.delayTel(3000,0)
					this.myNoMove = true
					this.shotDown = true
					this.showMyIcon = false
					setTimeout(()=>{
						this.addBlood(parseInt(this.myHero.blood*0.5),0,0)
						this.myNoMove = false
						this.shotDown = false
						this.showMyIcon = true
					},3000)
					this.flag = 1
				}
			}
			if(this.myEquipName.includes('狂徒铠甲')) {
				this.addBlood(35,0,0)
			}
			if(this.myEquipName.includes('明朗之靴')) {
				this.fastsp = 0.15
			}
			if(this.myEquipName.includes('荆棘之甲') && this.distanceComp(this.enemyGJdis)) {
				let m = parseInt(this.harm2*0.12) - parseInt(this.myHero.fy*0.06)
				this.beat(Math.abs(m),1)
			}
			if(this.myEquipName.includes('心之钢')) {
				let time = parseInt(this.min) * 60 + parseInt(this.second)
				if(time - this.xinzhigang >= 15){
					this.myHero.blood += 200
					this.xinzhigang = time
				}
				if(this.xinzhigang == 0){
					this.xinzhigang = time
				}
			}
			
			//对手技能
			if(this.enemy.name == '神奇宝贝-小火龙' && this.distanceComp(100)){
				setTimeout(()=>{
					this.consistEnemyBeat(30,200,1600)
				},3000)
			}
			if((this.enemy.name == '三丽鸥-玉桂狗' || this.enemy.name == '葫芦兄弟') && this.distanceComp(100)){
				setTimeout(()=>{
					let v = this.randomNum(10,250)
					this.consistEnemyBeat(v,1000,1050)
				},3000)
			}
			if(this.enemy.name == '南宫问天' && this.distanceComp(800)){
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_ngwt') == -1){
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_ngwt.gif?'+ new Date().getTime()
					this.backBgImg('fb_ngwt',2600)
					uni.showToast({
						title: '神兵天晶！',
						icon:'none',
						duration: 1200
					});
					this.enemyConsistAddBlood(38,200,2600)
					this.enemy.fy += 30
					setTimeout(()=>{
						this.enemy.fy -= 30
					},3500)
				}
			}
			if(this.enemy.name == '哆啦A梦-小夫' && this.distanceComp(130)){
				if(this.randomNum(0,2) == 1){
					uni.showToast({
						title: '小子！',
						icon:'none',
						duration: 1200
					});
					this.enChongci(130)
					let val = this.enemy.gj*2.1 - this.myHero.fy*1.5 + this.randomNum(100,300)
					this.enemyBeat2(val)
				}
			}
			if(this.enemy.name == '神奇宝贝-杰尼龟' && this.distanceComp(800)){
				if(this.randomNum(0,2) == 1){
					uni.showToast({
						title: '俺可不是吃素的！',
						icon:'none',
						duration: 1200
					});
					this.fasheArrow(2500,1,35,"无",1,11)
					this.enemy.fy += 50
					setTimeout(()=>{
						this.enemy.fy -= 50
					},2500)
				}
			}
			if(this.enemy.name == '羊村-灰太狼' && this.distanceComp(800)){
				if(this.bloodVal1 <= 16 && this.bloodVal1 > 2){
					uni.showToast({
						title: '我又回来了！',
						icon:'none',
						duration: 1200
					});
					this.enDuobi(50)
					this.enemyConsistAddBlood(250,500,1500)
				}
			}
			if(this.enemy.name == '猪猪侠-超人强' && this.distanceComp(150)){
				if(this.randomNum(0,2) == 1){
					uni.showToast({
						title: '小样！也敢和我决斗！',
						icon:'none',
						duration: 1200
					});
					this.consistEnemyBeat(80,500,2000)
					this.enemyConsistAddBlood(60,500,2000)
				}
			}
			if(this.enemy.name == '传说-金武圣人'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_lq') == -1 && this.distanceComp(150)){
					uni.showToast({
						title: '施主看招！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_lq.gif?'+ new Date().getTime()
					this.backBgImg('fb_lq',3500)
					this.enChongci(150)
					this.tallentExpert(1,2,3000)
					let val = this.enemy.gj*2.2 - this.myHero.fy*1.5 + this.randomNum(200,700)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},3000)
				}
				if(this.randomNum(0,4) == 1){
					this.enChongci(50,1)
				}
				if(this.randomNum(0,2) == 1){
					this.fasheArrow(320,1,35,"敌方射击-高伤害",1,5)
				}
				if(this.randomNum(0,4) == 0 && this.distanceComp(100)){
					uni.showToast({
						title: '放下屠刀吧！',
						icon:'none',
						duration: 1000
					});
					let v = this.randomNum(100,250)
					this.consistEnemyBeat(v,500,2000)
				}
			}
			if(this.enemy.name == '绝命毒师' && this.distanceComp(100)){
				if(this.randomNum(0,2) == 1){
					if(this.enspeed >= 0.6){
						this.enspeed -= 0.3
						setTimeout(()=>{
							this.enspeed += 0.3
						},2500)
					}
				}
				setTimeout(()=>{
					let v = this.randomNum(30,90)
					this.consistEnemyBeat(v,500,2000)
				},1000)
			}
			if(this.enemy.name == '杨贵妃'){
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_ygf') == -1){
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_ygf.gif?'+ new Date().getTime()
					this.backBgImg('fb_ygf',2200)
					this.myHero.fy -= 50
					setTimeout(()=>{
						this.myHero.fy += 50
					},3000)
				}
				if(this.randomNum(0,3) == 0 && this.engjAnm.indexOf('fb_yyh') == -1 && this.distanceComp(160)){
					uni.showToast({
						title: '汝且听我演奏一曲',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_yyh.gif?'+ new Date().getTime()
					this.backBgImg('fb_yyh',2500)
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 1.2).toFixed(1)
					this.shotDown = true
					this.enemyConsistAddBlood(35,100,1800)
					setTimeout(()=>{
						this.shotDown = false
					},1750)
					setTimeout(()=>{
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 1.2).toFixed(1)
					},3600)
				}
			}
			if(this.enemy.name == '武侠-扫地僧' || this.enemy.name == '扫地僧'){
				if(this.bloodVal1 <= 35 && this.bloodVal1 > 2){
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
				}
				if(this.randomNum(0,2) == 1){
					this.fasheArrow(320,1,35,"敌方射击-高伤害",1,5)
				}
				if(this.randomNum(0,4) == 1){
					this.enChongci(50,1)
				}
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_lq') == -1 && this.distanceComp(130)){
					uni.showToast({
						title: '施主看招！',
						icon:'none',
						duration: 1000
					});
					this.enChongci(130)
					this.tallentExpert(1,2,3000)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_lq.gif?'+ new Date().getTime()
					this.backBgImg('fb_lq',3500)
					let val = this.enemy.gj*2.5 - this.myHero.fy*1.5 + this.randomNum(200,1000)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},3000)
				}
				
			}
			if(this.enemy.name == '加勒比海盗王'){
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_plk') == -1){
					uni.showToast({
						title: '嗯？',
						icon:'none',
						duration: 1000
					});
					if(this.blood1 + 500 <= this.enemy.blood){
						this.blood1 = parseInt(this.blood1) + 500
						this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					}
				}
				if(this.randomNum(0,1) == 1){
					this.fasheArrow(320,1,35,"敌方射击",1,12)
				}
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_plk') == -1 && this.distanceComp(130)){
					uni.showToast({
						title: '是谁动了我蛋糕？！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_plk.gif?'+ new Date().getTime()
					this.backBgImg('fb_plk',2500)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
					setTimeout(()=>{
						let v = this.randomNum(50,100)
						this.consistEnemyBeat(v,500,2000)
					},2500)
				}
			}
			
			if(this.enemy.name == '海贼王-路飞'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_hzw') == -1 && this.distanceComp(100)){
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hzw2.gif?'+ new Date().getTime()
					this.backBgImg('fb_hzw2',4900)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},3500)
					let val = this.enemy.gj*2.6 - this.myHero.fy*1.6 + this.randomNum(300,1000)
					setTimeout(()=>{
						this.enemyBeat2(val)
						let v = this.randomNum(15,35)
						this.consistEnemyBeat(v,500,2000)
					},3700)
				}
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_hzw') == -1){
					uni.showToast({
						title: '觉醒！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hzw1.gif?'+ new Date().getTime()
					this.backBgImg('fb_hzw1',3000)
					this.enemy.gj += 50
					this.shotDown = true
					if(this.enspeed >= 0.6){
						this.enspeed = this.enspeed - 0.3
					}
					setTimeout(()=>{
						this.shotDown = false
					},2000)
					setTimeout(()=>{
						this.enemy.gj -= 50
						this.enspeed = this.enspeed + 0.3
					},5000)
				}
			}
			
			if((this.myHero.id == 5 || this.myHero.name == '鲲') && this.bloodVal2 <= 33 && this.flag2 == 0){
				if(this.myHero.name == '鲲'){
					this.addBlood(800,0,0)
				}else{
					if(this.myHero.id == 5 && parseInt(this.addData.strongIndex) != 0){
						this.addBlood(parseInt(500 + this.myHero.fs * 1.5),0,0)
					}else{
						this.addBlood(350,0,0)
					}
				}
				this.flag2 = 1
			}
			if(this.myHero.name == '精英战士' && this.bloodVal2 <= 30 && this.flag2 == 0){
				this.myHero.gj = parseInt(this.myHero.gj) + parseInt(this.myHero.gj)*0.2
				this.myHero.bj = this.myHero.bj + 0.25
				if(this.myspeed >= 0.6){
					this.myspeed = this.myspeed - 0.4
				}
				this.flag2 = 1
			}
			if(this.myHero.name == '风神' && this.bloodVal2 < 50 && this.flag2 == 0){
				this.myHero.fy += parseInt(this.myHero.fy)*0.15
				this.flag2 = 1
			}
			if(this.myHero.name == '熔岩巨兽'){
				if(this.second%10 == 0 || this.second%10 == 1){
					this.addBlood(parseInt(this.myHero.blood*0.025),0,0)
				}
			}
			//副本模式英雄
			if(this.enemy.name == '齐天大圣'){
				if(this.randomNum(0,1) == 1 && this.bloodVal1 <= 33 && this.bloodVal1 > 2){
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					uni.showToast({
						title: '俺老孙是打不死的！',
						icon:'none',
						duration: 1500
					});
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_swk') == -1 && this.distanceComp(120)){
					this.playVoice('../../static/sounds/qtds3.wav',true,5,2000)
					uni.showToast({
						title: '俺老孙来也！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_swk.gif?'+ new Date().getTime()
					this.backBgImg('fb_swk',2000)
					this.enChongci(120)
					if(this.enspeed >= 0.5){
						this.enspeed = this.enspeed - 0.2
					}
					this.enemy.gs = this.enemy.gs - 0.5
					setTimeout(()=>{
						this.enemy.gs = this.enemy.gs + 0.5
						if(this.enspeed+0.2 <= 0.5){
							this.enspeed = this.enspeed + 0.2
						}
					},2000)
					setTimeout(()=>{
						this.showEngjAnm = true
						this.engjAnm = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
						this.backBgImg('fb_qtds',3000)
						uni.showToast({
							title: '吃俺老孙一棒！',
							icon:'none',
							duration: 1000
						});
						let val = this.enemy.gj*2.3 - this.myHero.fy*1.5 + this.randomNum(200,600)
						setTimeout(()=>{
							this.enemyBeat2(val)
							this.shotDown = true
							setTimeout(()=>{
								this.shotDown = false
							},2000)
						},2200)
					},800)
				}
				if(this.randomNum(0,2) == 0 && this.engjAnm.indexOf('fb_qtds') == -1 && this.distanceComp(85)){
					this.playVoice('../../static/sounds/qtds1.wav',true,6,2000)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
					this.backBgImg('fb_qtds',3000)
					uni.showToast({
						title: '吃俺老孙一棒！',
						icon:'none',
						duration: 1000
					});
					let val = this.enemy.gj*2.3 - this.myHero.fy*1.5 + this.randomNum(200,600)
					setTimeout(()=>{
						this.enemyBeat2(val)
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},2000)
					},2200)
				}
			}
			if(this.enemy.name == '葫芦兄弟'){
				if(this.randomNum(0,1) == 1 && this.engjAnm.indexOf('fb_hlw') == -1 && this.bloodVal1 <= 50 && this.bloodVal1 > 2){
					uni.showToast({
						title: '兄弟连心！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hlw.gif?'+ new Date().getTime()
					this.backBgImg('fb_hlw',2200)
					this.enemy.fy = this.enemy.fy + 200
					setTimeout(()=>{
						this.enemy.fy = this.enemy.fy - 200
					},3000)
				}
				if(this.randomNum(0,2) == 2 && this.engjAnm.indexOf('fb_hlw') == -1 && this.distanceComp(700)){
					this.fasheArrow(2000,1,35,"无",1,14)
					if(this.distanceComp(450) && Math.abs(this.enemyY - this.characterY)<=55){
						let val = this.enemy.gj*2.2 - this.myHero.fy*2 + this.randomNum(100,200)
						this.consistEnemyBeat(val,500,2000)
					}
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_hlw') == -1 && this.distanceComp(90)){
					uni.showToast({
						title: '看我排山蹈海！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hlw2.gif?'+ new Date().getTime()
					this.backBgImg('fb_hlw2',1700)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},600)
					let val = this.enemy.gj*2.2 - this.myHero.fy*1 + this.randomNum(100,600)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},800)
				}
			}
			if(this.enemy.name == '花木兰'){
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_hml') == -1 && this.distanceComp(120)){
					uni.showToast({
						title: '兄长，吃我一剑！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hml.gif?'+ new Date().getTime()
					this.backBgImg('fb_hml',4200)
					this.enChongci(120)
					let val = this.enemy.gj*2.5 - this.myHero.fy*1.5 + this.randomNum(100,700)
					setTimeout(()=>{
						this.enemyBeat2(val)
						if(this.myHero.fy > 5){
							this.myHero.fy -= 5
						}
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1800)
					},2000)
				}
				if(this.randomNum(0,2) == 0 && this.engjAnm.indexOf('fb_hml') == -1 && this.distanceComp(65)){
					uni.showToast({
						title: '兄长，看招！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hml.gif?'+ new Date().getTime()
					this.backBgImg('fb_hml',4200)
					let val = this.enemy.gj*2 - this.myHero.fy*1.5 + this.randomNum(100,300)
					setTimeout(()=>{
						this.enemyBeat2(val)
						if(this.myHero.fy > 5){
							this.myHero.fy -= 5
						}
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1500)
					},2000)
				}
			}
			if(this.enemy.name == '血耻鳄鱼'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_ey') == -1 && this.distanceComp(100)){
					uni.showToast({
						title: '来吧！伙计',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.enChongci(100)
					this.engjAnm = '../../static/imgs/hero/fb_ey.gif?'+ new Date().getTime()
					this.backBgImg('fb_ey',2700)
					let val = this.enemy.gj*2 - this.myHero.fy*1.5 + this.randomNum(50,300)
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
					this.delayTel(800,0)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},300)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},800)
				}
				if(this.randomNum(0,3) == 2 && this.engjAnm.indexOf('fb_ey') == -1){
					this.enChongci(50)
				}
			}
			if(this.enemy.name == '湫'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_chun') == -1){
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_chun.gif?'+ new Date().getTime()
					this.backBgImg('fb_chun',2500)
					this.enemy.gj += 50
					this.enemy.gs = (parseFloat(this.enemy.gs) - 0.2).toFixed(1)
					this.blood1 = parseInt(this.blood1) + 100
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						this.enemy.gj -= 50
						this.enemy.gs = (parseFloat(this.enemy.gs) + 0.2).toFixed(1)
					},2000)
				}
			}
			if(this.enemy.name == '哪吒'){
				if(this.randomNum(0,3) == 0 && this.engjAnm.indexOf('fb_nz') == -1){
					uni.showToast({
						title: '我命由我不由天！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_nz.gif?'+ new Date().getTime()
					this.backBgImg('fb_nz',6900)
					this.enemy.gj = this.enemy.gj + 30
					this.enemy.fy = this.enemy.fy + 70
					this.blood1 = parseInt(this.blood1) + 900
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj - 30
						this.enemy.fy = this.enemy.fy - 70
					},5000)
				}
			}
			if(this.enemy.name == '玄武'){
				if(this.randomNum(0,3) == 0 && this.engjAnm.indexOf('fb_xw') == -1){
					uni.showToast({
						title: '世界唯我独尊！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_xw.gif?'+ new Date().getTime()
					this.backBgImg('fb_xw',5000)
					this.enemy.fy = this.enemy.fy + 50
					this.enemy.mk = this.enemy.mk + 50
					let val = parseInt((parseInt(this.enemy.blood) - parseInt(this.blood1))*0.07)
					this.enemyConsistAddBlood(val,500,3000)
					setTimeout(()=>{
						this.enemy.mk = this.enemy.mk - 50
						this.enemy.fy = this.enemy.fy - 50
					},5000)
				}
			}
			if(this.enemy.name == '成龙历险记-圣主'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_sz') == -1 && this.distanceComp(800)){
					uni.showToast({
						title: '恶龙激光波！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sz.gif?'+ new Date().getTime()
					this.backBgImg('fb_sz',2800)
					this.fasheArrow(2800,1,35,"无",1,10)
					if(this.distanceComp(450) && Math.abs(this.enemyY - this.characterY)<=55){
						let val = this.enemy.gj*2.6 - this.myHero.fy*1.2 + this.randomNum(100,500)
						setTimeout(()=>{
							this.enemyBeat2(val)
						},2600)
						setTimeout(()=>{
							let v = 35
							this.consistEnemyBeat(v,150,750)
						},2800)
					}
				}
			}
			if(this.enemy.name == '妖族-奎木狼'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_kml') == -1 && this.distanceComp(130)){
					uni.showToast({
						title: '看招',
						icon:'none',
						duration: 1200
					});
					this.enChongci(130)
					//禁锢
					this.tallentExpert(1,2,1500)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_kml.gif?'+ new Date().getTime()
					this.backBgImg('fb_kml',900)
					setTimeout(()=>{
						this.enemyBeat2(parseInt(this.enemy.gj)*2 - parseInt(this.myHero.fy)+this.randomNum(100,300))
					},300)
				}
			}
			if(this.enemy.name == '妖族-石矶娘娘'){
				if(this.randomNum(0,2) == 1 && this.distanceComp(100)){
					uni.showToast({
						title: '给我灰飞烟灭！',
						icon:'none',
						duration: 1200
					});
					this.tallentExpert(3,1,2500)
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						this.enemyBeat2(parseInt(this.enemy.gj)*1.5 - parseInt(this.myHero.fy*0.8)+this.randomNum(150,300))
					},300)
				}
				if(this.bloodVal1 <= 23 && this.bloodVal1 > 2){
					if(this.randomNum(0,1) == 1){
						this.enemyConsistAddBlood(50,100,1500)
						uni.showToast({
							title: '嘿！挺能打的嘛',
							icon:'none',
							duration: 1500
						});
					}
				}
			}
			if(this.enemy.name == '妖族-北海龙王'){
				if(this.bloodVal1 <= 50 && this.bloodVal1 > 2){
					if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_bhlw') == -1){
						uni.showToast({
							title: '眼前是哪位勇士？',
							icon:'none',
							duration: 1200
						});
						this.showEngjAnm = true
						this.engjAnm = '../../static/imgs/hero/fb_bhlw.gif?'+ new Date().getTime()
						if(this.enspeed >= 0.6){
							this.enspeed = this.enspeed - 0.3
						}
						this.playVoice('../../static/sounds/jiguangbo.wav',false,6,3000)
						this.backBgImg('fb_bhlw',5300)
						this.enemyConsistAddBlood(90,300,2700)
						let self = this
						if(self.distanceComp(100)){
							setTimeout(()=>{
								self.enemyBeat2(parseInt(self.enemy.gj)*2.2 - parseInt(self.myHero.fy) + self.randomNum(150,500))
							},5500)
						}
						setTimeout(()=>{
							if(self.enspeed <= 0.6){
								self.enspeed = self.enspeed + 0.3
							}
						},5800)
					}
				}
				if(this.randomNum(0,3) == 1){
					if(Math.abs(this.characterX - this.enemyX) <= 600 && Math.abs(this.characterY - this.enemyY)<=33){
						setTimeout(()=>{
							this.consistEnemyBeat(parseInt(this.enemy.gj)*1.3 - parseInt(this.myHero.fy) + this.randomNum(50,100),500,2000)
						},1000)
					}
					this.fasheArrow(2000,1,35,"无",1,10)
				}
			}
			if(this.enemy.name == '妖族-西海龙王' || this.enemy.name == '西海龙王-敖闰'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_lkz') == -1){
					uni.showToast({
						title: '裂空爪！',
						icon:'none',
						duration: 1000
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_lkz.gif?'+ new Date().getTime()
					this.backBgImg('fb_lkz',4000)
					setTimeout(()=>{
						this.yinshen2 = true
						this.enNoMove = true
						setTimeout(()=>{
							this.enemyX = 20
							this.enemyY = 20
						},800)
						setTimeout(()=>{
							this.enNoMove = false
							this.enChongci(3000)
							setTimeout(()=>{
								this.yinshen2 = false
								this.enemyBeat2(parseInt(this.enemy.gj)*2 - parseInt(this.myHero.fy) + this.randomNum(100,200))
							},500)
						},3000+this.randomNum(0,3)*1200)
					},3500)
				}
				if(this.bloodVal1 <= 35 && this.bloodVal1 > 2 && this.randomNum(0,2) == 2 && this.engjAnm.indexOf('fb_lkz') == -1){
					uni.showToast({
						title: '走了！再见',
						icon:'none',
						duration: 1000
					});
					this.yinshen2 = true
					setTimeout(()=>{
						this.yinshen2 = false
					},2500+this.randomNum(0,3)*1200)
				}
			}
			if(this.enemy.name == '东海龙王-敖光'){
				//敌方技能cd
				if(this.enemyBeatCD == null){
					setTimeout(()=>{
						this.enemyBeatCD = null
					},1500 + this.randomNum(0,10)*350)
					if(this.randomNum(0,3) == 0 && this.engjAnm.indexOf('ag1-1') == -1 && this.engjAnm.indexOf('ag1') == -1){
						if(this.randomNum(0,1) == 1 && this.fastsp2 == 0){	//龙形态
							this.heroAnm('../../static/imgs/hero/ag1-1.gif?'+ new Date().getTime(),1)
							this.backBgImg('ag1-1',6500,1)
							this.playVoice('../../static/sounds/ag4.wav',false,num+3,6500)
							this.fastsp2 = this.enspeed - 0.4
							setTimeout(()=>{
								this.fastsp2 = 0
							},5000)
						}else{
							this.heroAnm('../../static/imgs/hero/ag1.gif?'+ new Date().getTime(),1)
							this.backBgImg('ag1',4000,1)
							this.playVoice('../../static/sounds/ag1.wav',true,num+3,4000)
							if(this.distanceComp(150)){
								setTimeout(()=>{
									let val = this.harmComputer(3) + parseInt(this.enemy.gj*1.5) + 260 + (this.reallyRandom(0,5)*100)
									this.enemyBeat2(val)
								},2500)
							}else{
								setTimeout(()=>{
									this.fasheArrow(550,1,30,"敌方射击",1,2)
								},2000)
							}
						}
					}
					if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('ag2') == -1){
						if(this.randomNum(0,1) == 1){	//龙形态
							this.fasheArrow(420,1,30,"敌方射击-高伤害",2,4)
						}else{
							this.heroAnm('../../static/imgs/hero/ag2.gif?'+ new Date().getTime(),1)
							this.backBgImg('ag2',5500,1)
							this.playVoice('../../static/sounds/ag'+num+'.wav',false,num+3,5500)
							setTimeout(()=>{
								this.enemy.gj = this.enemy.gj + 50
								uni.showToast({
									title: '你被禁止释放技能',
									icon:'none',
									duration: 1200
								});
								this.delayTel(2000,0)
								setTimeout(()=>{
									this.enemy.gj = this.enemy.gj - 50
								},2000)
							},1000)
						}
					}
					if(this.randomNum(0,2) == 2 && this.engjAnm.indexOf('ag2') == -1){
						this.fasheArrow(3000,1,35,"无",3,14)
						if(Math.abs(this.enemyX - this.characterX) <= 450 && Math.abs(this.enemyY - this.characterY)<=35){
							let val = parseInt(this.enemy.gj*1.8) - parseInt(this.myHero.fy*1.5) + 50
							if(val<=0){
								val = 50
							}
							this.consistEnemyBeat(val,500,3000)
						}
					}
					if(this.randomNum(0,4) == 3 && this.engjAnm.indexOf('ag2') == -1 && this.engjAnm.indexOf('ag4') == -1){
						this.heroAnm('../../static/imgs/hero/ag4.gif?'+ new Date().getTime(),1)
						this.backBgImg('ag4',5500,1)
						this.playVoice('../../static/sounds/ag'+num+'.wav',false,num+3,4000)
						setTimeout(()=>{
							if(this.enspeed>=0.6){
								this.enspeed = this.enspeed - 0.2
								setTimeout(()=>{
									this.enspeed = this.enspeed + 0.2
								},3000)
							}
							this.enemyConsistAddBlood(200,500,1500)
						},2000)
					}
					this.enemyBeatCD = 1
				}
			}
			if(this.enemy.name == '神-哪吒'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_nz2') == -1){
					uni.showToast({
						title: '哪吒在此！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.playVoice('../../static/sounds/jiguangbo.wav',false,6,3000)
					this.engjAnm = '../../static/imgs/hero/fb_nz2.gif?'+ new Date().getTime()
					this.backBgImg('fb_nz2',1500)
					this.enemy.gs = this.enemy.gs - 0.3
					setTimeout(()=>{
						this.enemy.gs = this.enemy.gs + 0.3
					},2500)
				}
				if(this.randomNum(0,3) == 0 && this.engjAnm.indexOf('fb_nz') == -1){
					uni.showToast({
						title: '我命由我不由天！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_nz.gif?'+ new Date().getTime()
					this.backBgImg('fb_nz',6900)
					if(this.enspeed >= 0.7){
						this.enspeed = this.enspeed - 0.4
					}
					this.enemy.gj = this.enemy.gj + 30
					this.enemy.fy = this.enemy.fy + 60
					this.blood1 = parseInt(this.blood1) + 500
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						if(this.enspeed+0.4 <= 0.7){
							this.enspeed = this.enspeed + 0.4
						}
						this.enemy.gj = this.enemy.gj - 30
						this.enemy.fy = this.enemy.fy - 60
					},5000)
				}
			}
			if(this.enemy.name == '神-韩湘子'){
				if(this.randomNum(0,3) == 1 && this.enspeed != 0.2 && this.engjAnm.indexOf('fb_hxz') == -1){
					uni.showToast({
						title: '八仙过海',
						icon:'none',
						duration: 2000
					});
					var sp = this.enspeed
					this.enspeed = 0.2
					setTimeout(()=>{
						this.enspeed = sp
					},3000)
					this.playVoice('../../static/sounds/rain.wav',false,6,3000)
					if(this.distanceComp(100)){
						this.delayTel(1000,0)
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 800
						});
					}
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hxz.gif?'+ new Date().getTime()
					this.backBgImg('fb_hxz',3200)
				}
			}
			if(this.enemy.name == '神-十万天兵'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_swtb') == -1 && this.distanceComp(80)){
					uni.showToast({
						title: '杀！杀！杀！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('../../static/sounds/lianji.wav',false,6,5000)
					this.consistEnemyBeat(this.randomNum(20,50),100,1200)
				}
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_swtb') == -1){
					uni.showToast({
						title: '集合！',
						icon:'none',
						duration: 2500
					});
					this.showEngjAnm = true
					this.enDuobi(60)
					this.engjAnm = '../../static/imgs/hero/fb_swtb.gif?'+ new Date().getTime()
					this.backBgImg('fb_swtb',6500)
					this.enemyConsistAddBlood(100,500,2500)
					this.shotDown = true
					let self = this
					setTimeout(()=>{
						self.shotDown = false
						self.enemy.gj = self.enemy.gj + 25
						setTimeout(()=>{
							self.enemy.gj = self.enemy.gj - 25
						},3000)
					},3000)
				}
			}
			if(this.enemy.name == '神-四大天王'){
				if(this.randomNum(0,3) == 0 && this.engjAnm.indexOf('fb_sdtw') == -1 && this.distanceComp(110)){
					uni.showToast({
						title: '持国天王：破！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw3.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw3',1000)
					let val = this.enemy.gj*2.7 - this.myHero.fy*1.5 + this.randomNum(200,500)
					setTimeout(()=>{
						this.playVoice('../../static/sounds/enchongji.wav',false,5,2000)
						this.enChongci(110)
						this.enemyBeat2(val)
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1500)
					},1200)
				}
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_sdtw') == -1){
					uni.showToast({
						title: '多闻天王：转！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw2.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw2',1600)
					this.fasheArrow(2000,1,35,"无",1,11)
					this.playVoice('../../static/sounds/lianji.wav',false,7,5000)
					this.enemyConsistAddBlood(60,200,1600)
					if(this.distanceComp(150) && Math.abs(this.characterY - this.enemyY) < 35){
						this.consistEnemyBeat(this.randomNum(20,35),100,1600)
					}
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1600)
				}
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_sdtw') == -1 && this.enspeed != 0.5){
					uni.showToast({
						title: '增长天王：进！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw',3500)
					this.shotDown = true
					this.enChongci(50,1)
					var sp = this.enspeed
					this.enspeed = 0.5
					setTimeout(()=>{
						this.shotDown = false
						this.enspeed = sp
					},2000)
					this.enemy.gj = this.enemy.gj + 30
					this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) - 0.2).toFixed(2)
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj - 30
						this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.2).toFixed(2)
					},5500)
				}
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_sdtw') == -1 && this.distanceComp(500)){
					uni.showToast({
						title: '广目天王：电！',
						icon:'none',
						duration: 800
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw4.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw4',1200)
					this.fasheArrow(320,1,35,"敌方射击-高伤害",1,13)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1000)
				}
			}
			if(this.enemy.name == '神-二郎神杨戬'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_yj') == -1 && this.distanceComp(100)){
					uni.showToast({
						title: '杨戬在此！谁敢造次',
						icon:'none',
						duration: 2000
					});
					this.playVoice('../../static/sounds/soonGJ.wav',true,7,2000)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_yj.gif?'+ new Date().getTime()
					this.backBgImg('fb_yj',3000)
					setTimeout(()=>{
						this.blood1 = parseInt(this.blood1) + 500
						this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
						this.enemyBeat2(this.randomNum(80,300))
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1000)
					},3000)
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_yj') == -1){
					if(this.distanceComp(150) && Math.abs(this.characterY - this.enemyY) < 35){
						let val = this.enemy.gj*2.3 - this.myHero.fy*1.5 + this.randomNum(100,300)
						this.enemyBeat2(val)
					}
					this.fasheArrow(1000,1,35,"无",1,15)
				}
			}
			if(this.enemy.name == '神-齐天大圣'){
				if(this.randomNum(0,1) == 1 && this.bloodVal1 <= 33 && this.bloodVal1 > 2){
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					uni.showToast({
						title: '俺老孙是打不死的！',
						icon:'none',
						duration: 1500
					});
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_swk') == -1 && this.distanceComp(120)){
					this.playVoice('../../static/sounds/qtds3.wav',true,5,2000)
					uni.showToast({
						title: '俺老孙来也！',
						icon:'none',
						duration: 1500
					});
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_swk.gif?'+ new Date().getTime()
					this.playVoice('../../static/sounds/qtds3.wav',true,7,2000)
					this.backBgImg('fb_swk',2000)
					this.enChongci(120)
					if(this.enspeed >= 0.5){
						this.enspeed = this.enspeed - 0.2
					}
					this.enemy.gs = this.enemy.gs - 0.5
					setTimeout(()=>{
						this.enemy.gs = this.enemy.gs + 0.5
						if(this.enspeed+0.2 <= 0.5){
							this.enspeed = this.enspeed + 0.2
						}
					},2000)
					setTimeout(()=>{
						this.showEngjAnm = true
						this.engjAnm = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
						this.backBgImg('fb_qtds',3000)
						uni.showToast({
							title: '吃俺老孙一棒！',
							icon:'none',
							duration: 1000
						});
						let val = this.enemy.gj*2.3 - this.myHero.fy*1.5 + this.randomNum(200,600)
						setTimeout(()=>{
							this.enemyBeat2(val)
							this.shotDown = true
							setTimeout(()=>{
								this.shotDown = false
							},2000)
						},2200)
					},800)
				}
				if(this.randomNum(0,2) == 0 && this.engjAnm.indexOf('fb_qtds') == -1 && this.distanceComp(85)){
					this.playVoice('../../static/sounds/qtds1.wav',true,6,2000)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
					this.backBgImg('fb_qtds',3000)
					uni.showToast({
						title: '吃俺老孙一棒！',
						icon:'none',
						duration: 1000
					});
					this.playVoice('../../static/sounds/qtds1.wav',true,6,2000)
					let val = this.enemy.gj*2.3 - this.myHero.fy*1.5 + this.randomNum(200,600)
					setTimeout(()=>{
						this.enemyBeat2(val)
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},2000)
					},2200)
				}
			}
			if(this.enemy.name.indexOf('神明')!= -1 && this.fastsp2 != 0.01){
				if(this.bloodVal1 <= 30 && this.bloodVal1 > 2){
					this.heroAnm('../../static/imgs/hero/fuhuo.gif?'+ new Date().getTime(),1)
					this.backBgImg('fuhuo',3000,1)
					this.delayTel(3000,0)
					this.enNoMove = true
					this.shotDown = true
					this.showEnIcon = false
					setTimeout(()=>{
						this.blood1 = parseInt(this.blood1) + parseInt(this.enemy.blood*0.5)
						this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
						this.enNoMove = false
						this.shotDown = false
						this.showEnIcon = true
						this.fastsp2 = 0.01
					},3000)
				}
			}
		},
		//已方发动技能触发事件
		heroHarm () {
			if(this.myEquipName.includes('兰德里的折磨') && !this.beatTime){
				this.consistBeat(30+this.myHero.fs*0.5,700,2800)
			}
			if(this.myEquipName.includes('残疫') && !this.beatTime){
				this.consistBeat(30+this.myHero.fs*0.4,1000,3000)
				this.enemy.mk -= 1
			}
			if(this.myEquipName.includes('星蚀')){
				this.xinshiFlag += 1
				if(this.xinshiFlag == 3){
					let self = this
					let val = self.myHero.gj*2
					self.addBlood(val,0,0)
					setTimeout(()=>{
						if(parseInt(self.blood2) - parseInt(self.shotVal1) > 0){
							self.blood2 = parseInt(self.blood2) - self.myHero.gj*1.5
							self.bloodVal2 = Math.round(parseInt(self.blood2) / parseInt(self.myHero.blood) * 100)
						}
					},2500)
					this.xinshiFlag = 0
				}
			}
			if(this.myEquipName.includes('饮血剑') || this.myEquipName.includes('破败王者之刃')
			|| this.myEquipName.includes('莫雷洛秘典')) {
				let val = parseInt(this.harm*0.15)
				if(val < 30){
					val = 30
				}
				if(this.myEquipName.includes('饮血剑')){
					val = parseInt(this.harm*0.2)
				}
				this.addBlood(val,0,0)
			}
			if(this.myEquipName.includes('影焰') && this.bloodVal1 <= 40 && this.bloodVal1 > 2) {
				let val = parseInt(this.myHero.fs * 0.6) + this.randomNum(50,100)
				this.beat(val,1)
			}
			if(this.myEquipName.includes('冰晶节杖')) {
				this.tallentExpert(3,1,2000,0.25)
			}
			if(this.myEquipName.includes('收集者') && (this.myHero.details == '刺客' || this.myHero.id == 102)) {
				if(this.bloodVal1 <= 16 && this.bloodVal1 > 2){
					let val = parseInt(this.myHero.gj * 10) + 1000
					this.beat(val,1)
				}
			}
		},
		//持续给敌方伤害
		consistBeat(beatVal,time,outTime) {
			clearInterval(this.beatTime)
			this.beatTime = null
			this.beatTime = setInterval(()=>{
				this.beat(beatVal,1)
			},time)
			setTimeout(()=>{
				clearInterval(this.beatTime)
				this.beatTime = null
			},outTime)
		},
		
		beat(beatVal,type) {
			if(this.bettleEnd || !this.begin){
				return
			}
			this.gs2 = parseFloat(this.myHero.v) * 1000
			//攻击伤害
			let gjval = parseInt(this.myHero.gj * 1.2)
			//法术伤害
			let fsval = parseInt(this.myHero.fs * 1.2)
			//自定义伤害
			if(type == 1){
				gjval = 0;
				fsval = 0;
			}
			this.shotVal2 = gjval + fsval + parseInt(beatVal)
			if(parseInt(this.shotVal2) < 50){
				this.shotVal2 = 60 + this.randomNum(20,60)
			}
			this.shotVal2 = parseInt(this.shotVal2)
			
			//伤害显示
			this.harm = this.shotVal2
			this.showHarm = true
			let t = 800
			if(this.harm >= 950){
				t = 1500
				this.bigGJTX = 6 + 'rpx solid red'
			}
			this.showTX(1,1,false)
			setTimeout(()=>{
				this.showHarm = false
				this.showTX(1,1,true)
				this.bigGJTX = 'none'
			},t)
			
			if(parseInt(this.blood1) - parseInt(this.shotVal2) > 0){
				this.blood1 = parseInt(this.blood1) - parseInt(this.shotVal2)
				this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
				if(!type){	//普通技能触发事件
					this.heroHarm()
				}
			}else{
				this.winBettle()
			}
		},
		//计算法力值
		blueComput(val,type) {
			if(type = 'reduce'){
				if(parseInt(this.flz) - val < 0){
					this.flz = 0
				}else{
					this.flz = parseInt(this.flz) - val
				}
				this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
			}else{
				this.flz = parseInt(this.flz) + val
				if(parseInt(this.flz) > parseInt(this.myHero.flz)){
					this.myHero.flz = this.flz
				}
				this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
			}
		},
		cd(time,num) {
			if(num == 1){
				this.cd1 = setTimeout(()=>{
					this.$refs.tallents.tallentShow = true
					this.cd1 = null
				},time)
			}
			if(num == 2){
				this.cd2 = setTimeout(()=>{
					this.$refs.tallents.tallentShow2 = true
					this.cd2 = null
				},time)
			}
			if(num == 3){
				this.cd3 = setTimeout(()=>{
					this.$refs.tallents.tallentShow3 = true
					this.cd3 = null
				},time)
			}
			if(num == 4){
				this.cd4 = setTimeout(()=>{
					this.$refs.tallents.tallentShow4 = true
					this.cd4 = null
				},time)
			}
		},
		tallentHandle(data) {
			let num = JSON.parse(data).type
			let addTalent = parseInt(this.addData.add8)
			let addTalent2 = parseInt(this.addData.add9)
			let addTalent3 = parseInt(this.addData.add10)
			let addTalent4 = parseInt(this.addData.add11)
			let strongIndex = 0
			if(this.addData.strongIndex){
				strongIndex = parseInt(this.addData.strongIndex)
			}
			if(this.bettleEnd){
				return
			}
			if(!this.begin) {
				uni.showToast({
					title: '请点击开始战斗',
					icon:'none',
					duration: 1500
				});
				this.delayTel(1000,0)
				return
			}
			//释放技能，敌方追击或逃跑
			if(this.bloodVal2 <= 35 || this.bloodVal1 >= this.randomNum(40,50)){
				this.enemyMoveContrl(2)
			}else{	//两者都没什么血
				this.enemyMoveContrl(this.reallyRandom(2,3))
			}
			if(this.myHero.name == '德玛西亚之力' || this.myHero.id == 1){
				let t1 = null
				//被动
				t1 = setInterval(()=>{
					this.myHero.fy = parseInt(this.myHero.fy) + 1
				},1000)
				setTimeout(()=>{
					clearInterval(t1)
				},2000)
				this.playVoice('../../static/sounds/dmxyzl'+num+'.wav',true,num-1,5000)
				if(num == 1){
					this.cd(5500 - addTalent*150,1)
					this.blueComput(70 + addTalent*6,'reduce')
					if(this.distanceComp(75)){
						let val = this.harmComputer(1,addTalent) + 250 + addTalent*30
						this.beat(val)
						//沉默1.5秒
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1500)
					}else{
						this.fastsp = 0.4
						setTimeout(()=>{
							this.fastsp = 0
						},2500)
					}
					
				}
				if(num == 2){
					if(strongIndex == 1){
						this.cd(3000 - addTalent2*150,2)
					}else{
						this.cd(4000 - addTalent2*150,2)
					}
						this.blueComput(30 + addTalent2*6,'reduce')
						this.myHero.fy = parseInt(this.myHero.fy) + 100 + addTalent2*15
						setTimeout(()=>{
							this.myHero.fy = parseInt(this.myHero.fy) - 100 - addTalent2*15
						},2000 + addTalent2*100)
				}
				if(num == 3){
					this.cd(5200 - addTalent3*150,3)
					this.delayTel(1000,num)
					setTimeout(()=>{
						this.blueComput(70 + addTalent3*10,'reduce')
						let val = parseInt(this.myHero.gj * (1.2+addTalent3*0.1)) - parseInt(this.enemy.fy*(1.2*this.pojia)) + 50 + addTalent3*15
						if(strongIndex == 1){
							val += 30
						}
						this.consistBeat(val,200,2200)
					},1000)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*200,4)
					this.delayTel(1000,num)
					this.blueComput(100 + addTalent4*15,'reduce')
					this.heroAnm('../../static/imgs/hero/dmxyzy.gif?'+ new Date().getTime())
					this.backBgImg('dmxyzy',3000)
					let cval = 0
					//敌方生命值小于30%
					if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.33){
						cval = parseInt(this.myHero.gj * 2.3) + 700 - parseInt(this.enemy.fy*4*this.pojia) + addTalent4*150
					}
					let val = (parseInt(this.myHero.gj * (2.5+addTalent4*0.25)) - parseInt(this.enemy.fy*4*this.pojia))*2 + 600 + cval + addTalent4*100
					setTimeout(()=>{
						this.beat(val)
					},1000)
				}
			}
			if(this.myHero.name == 'GG Bond' || this.myHero.id == 3) {
				if(num == 1){
					this.cd(3200 - addTalent*150,1)
					this.delayTel(1000,num)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent) + 300 + addTalent*50
						if(strongIndex == 1){
							val = val + 200
						}
						this.beat(val)
						this.blueComput(100 + addTalent*10,'reduce')
					},1000)
				}
				if(num == 2){
					this.cd(5500 - addTalent2*200,2)
					this.delayTel(500,num)
					this.tallentExpert(1,2,3000)
					let val = parseInt(this.myHero.fs) * (0.5 + addTalent2*0.1) + 50
					this.addBlood(val,500,3000)
					this.blueComput(100 + addTalent2*10,'reduce')
				}
				if(num == 3){
					this.cd(8000 - addTalent3*250,3)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/cjbbt.gif?'+ new Date().getTime())
						this.backBgImg('cjbbt',6000)
						setTimeout(()=>{
							this.myHero.fs = parseInt(this.myHero.fs) + 80
							this.myHero.gj = parseInt(this.myHero.gj) + 8 + addTalent3*3
							this.myHero.fy = parseInt(this.myHero.fy) + 8 + addTalent3*3
							this.addBlood(600 + addTalent3*100,0,0)
							if(strongIndex == 1){
								this.heroAddSpeed(0.3,4000)
							}
							 let time = setInterval(()=>{
								 this.myHero.fs = parseInt(this.myHero.fs) - 10
							 },500)
							 setTimeout(()=>{
								 clearInterval(time)
							 },4000)
							this.myHero.flz = parseInt(this.myHero.flz) + 100 + addTalent3*20
							this.flz = parseInt(this.flz) + 100 + addTalent3*20
						},1500)
					},500)
				}
				if(num == 4){
					this.cd(11000 - addTalent4*250,4)
					this.delayTel(3000,num)
					this.heroAnm('../../static/imgs/hero/xlsbz.gif?'+ new Date().getTime())
					this.backBgImg('xlsbz',5500)
					this.blueComput(250 + addTalent4*15,'reduce')
					setTimeout(()=>{
						this.fasheArrow(600,2,50,this.myHero.id,4,3)
					},2500)
				}
			}
			if(this.myHero.name == '少林武僧' || this.myHero.id == 2) {
				let randomVal = this.randomNum(50,250)
				if(strongIndex == 2){
					randomVal = 0
					this.myHero.fs = this.myHero.fs + 5
				}
				if(num == 1){
					if(strongIndex == 1){
						this.cd(2300 - addTalent*200,1)
					}else{
						this.cd(3800 - addTalent*200,1)
					}
					this.playVoice('../../static/sounds/wuqi1.wav',false,0,4000)
					this.delayTel(300,num)
					this.heroChongci(this.myHero.dis1)
					let val = this.harmComputer(1,addTalent) + addTalent*35
					+ randomVal + this.xuli + 350
					if(strongIndex == 1){
						val = val + 100
					}
					this.beat(val)
					this.blueComput(70 + addTalent*8,'reduce')
					this.xuli = 0
				}
				if(num == 2){
					this.cd(6000 - addTalent2*300,2)
					this.playVoice('../../static/sounds/wuqi2.wav',false,1,2000)
					this.xuli = parseInt(this.myHero.fs * (2.6 + addTalent2*0.25)) + 250 + addTalent2*35
					this.blueComput(70 + addTalent2*10,'reduce')
				}
				if(num == 3){
					this.cd(8000 - addTalent3*300,3)
					this.playVoice('../../static/sounds/wuqi3.wav',false,2,4000)
					this.delayTel(500,num)
					this.blueComput(100 + addTalent3*15,'reduce')
					let val = Math.round(this.shotVal1) + Math.round(120 / parseFloat(this.enemy.gs)) + addTalent3*150
					+ parseInt(this.myHero.fs) + parseInt(this.myHero.gj) - parseInt(this.enemy.mk*0.6*this.pomo) - parseInt(this.enemy.fy*(0.6*this.pojia)) + randomVal
					if(val<=0){
						val = randomVal
					}
					setTimeout(()=>{
						this.beat(val,1)
						if(strongIndex == 2){
							if(parseFloat(this.myHero.v)>=0.6){
								this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.3 + addTalent*0.04)).toFixed(2)
								setTimeout(()=>{
									this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.3 + addTalent*0.04)).toFixed(2)
								},3000)
							}
						}
						this.tallentExpert(2,1,2500 + addTalent3*200)
					},2500 + addTalent3*200)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.playVoice('../../static/sounds/wuqi4.wav',false,3,5800)
					this.delayTel(1000,num)
					this.heroAnm('../../static/imgs/hero/wqds.gif?'+ new Date().getTime())
					this.backBgImg('wqds',1500)
					if(strongIndex == 2){
						this.$refs.tallents.tallentShow = true
						this.$refs.tallents.tallentShow2 = true
						this.$refs.tallents.tallentShow3 = true
					}
					this.heroAddSpeed(0.3,5000)
					this.myHero.fy = parseInt(this.myHero.fy) + 30 + addTalent4*10
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy) - 30 - addTalent4*10
					},5000)
					let val =  parseInt(this.myHero.gj * (2.5 + addTalent4*0.25)) + parseInt(this.myHero.fs * (2.5 + addTalent4*0.25))
					 - parseInt(this.enemy.fy*2*(1*this.pojia)) - parseInt(this.enemy.mk*2*this.pomo)*2.2 + 500 + randomVal + addTalent4*70
					this.blueComput(100 + addTalent4*25,'reduce')
					setTimeout(()=>{
						this.beat(val)
					},1000)
				}
			}
			if(this.myHero.name == '无极剑圣' || this.myHero.id == 4){
				//被动
				this.regGjAdd.gjHarm = parseInt(this.myHero.fs*0.6) + 50
				if(strongIndex == 1){
					this.regGjAdd.addBlood = this.myHero.gj + 100
				}
				this.playVoice('../../static/sounds/jiansheng'+num+'.wav',true,num-1,4000)
				if(num == 1){
					this.cd(4500 - addTalent*200,1)
					this.delayTel(500,num)
					this.blueComput(65 + addTalent*8,'reduce')
					this.heroChongci(this.myHero.dis1)
					let val = this.harmComputer(1,addTalent) + 250 + addTalent*35
					this.beat(val)
					//沉默1.5秒
					this.shotDown = true
					this.yinshen = true
					setTimeout(()=>{
						this.shotDown = false
						this.yinshen = false
					},1500)
				}
				if(num == 2){
					this.cd(9500 - addTalent2*250,2)
					this.delayTel(3000,num)
					this.tallentExpert(1,2,3000)
					this.blueComput(80 + addTalent2*10,'reduce')
					let val = parseInt(this.myHero.fs*0.7) + 50 + this.randomNum(10,50 + addTalent2*50)
					this.addBlood(val,500,3000)
					this.myHero.fy = parseInt(this.myHero.fy) + 60 + addTalent2*10
					this.cd5 = false
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy) - 60 - addTalent2*10
						this.cd5 = true
					},3000)
				}
				if(num == 3){
					this.cd(4000 - addTalent3*200,3)
					this.blueComput(50 + addTalent3*10,'reduce')
					let val = parseInt(this.myHero.gj * 1.2) + this.randomNum(30,200) - parseInt(this.enemy.fy*(1*this.pojia)) + addTalent3*20
					if(val <= 60){
						val = this.randomNum(70,210)
					}
					this.heroAddSpeed(0.3,2500 + addTalent3*100)
					this.regGjAdd.gjHarm = val
					setTimeout(()=>{
						this.regGjAdd.gjHarm = parseInt(this.myHero.fs*1.2) + 50
					},5000)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.delayTel(1000,num)
					this.blueComput(120 + addTalent4*20,'reduce')
					this.heroAnm('../../static/imgs/hero/wjjs.gif?'+ new Date().getTime())
					this.backBgImg('wjjs',5000)
					let val = parseInt(this.myHero.gj * (1.3 + addTalent4*0.2)) - parseInt(this.enemy.fy*(1.5*this.pojia)) + this.randomNum(50,200 + addTalent4*20)
					if(val <= 60){
						val = this.randomNum(70,210)
					}
					this.consistBeat(val,500,3000)
				}
			}
			if(this.myHero.name == '广寒仙子-嫦娥' || this.myHero.id == 5){
				this.playVoice('../../static/sounds/cer'+num+'.wav',true,num-1,2500)
				if(num == 1){
					this.cd(3600 - addTalent*250,1)
					this.delayTel(1000,num)
					if(strongIndex == 2){
						this.myHero.dis1 = 150
					}
					setTimeout(()=>{
						this.blueComput(70 + addTalent*8,'reduce')
						this.ygbj = true
						let val = this.harmComputer(2,addTalent) + 250 + addTalent*30
						this.beat(val)
					},1000)
				}
				if(num == 2){
					this.cd(6000 - addTalent2*250,2)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.blueComput(80 + addTalent2*10,'reduce')
						this.myHero.fy = parseInt(this.myHero.fy) + 35 + addTalent2*6
						this.myHero.fs = parseInt(this.myHero.fs) + 60 + addTalent2*10
						setTimeout(()=>{
							this.myHero.fy = parseInt(this.myHero.fy) - 35 - addTalent2*6
							this.myHero.fs = parseInt(this.myHero.fs) - 60 - addTalent2*10
							let val = (parseInt(this.myHero.fs)*2 - parseInt(this.enemy.mk*2*this.pomo))*2 + 150 + addTalent2*30
							if(val < 150){
								val = 150
							}
							this.beat(val,1)
						},4000)
					},500)
				}
				if(num == 3){
					this.delayTel(500,num)
						let addVal = 0
						if(this.ygbj){
							addVal = parseInt(this.myHero.fs)
							this.cd(2500 - addTalent3*250,3)
						}else{
							this.cd(6500 - addTalent3*300,3)
						}
						this.blueComput(100 + addTalent3*20,'reduce')
						this.heroChongci(parseInt(this.myHero.dis3))
						let val = this.harmComputer(2,addTalent3) + 350 + addVal + addTalent3*35
						if(strongIndex == 1){
							val = this.harmComputer(2,addTalent3) + 550 + addVal*1.3 + addTalent3*50
						}
						if(val < 150){
							val = 150
						}
						this.beat(val)
						this.ygbj = false
				}
				if(num == 4){
					this.cd(10500 - addTalent4*350,4)
					this.delayTel(1500,num)
					this.heroAnm('../../static/imgs/hero/cer.gif?'+ new Date().getTime())
					this.backBgImg('cer',3600)
					setTimeout(()=>{
						let val = Math.ceil(parseInt(this.myHero.fs)*(1.5 + addTalent4*0.3)) + 500 + this.randomNum(0,250 + addTalent4*120)
						this.addBlood(val,0,0)
						this.myHero.fy = parseInt(this.myHero.fy) + 35 + addTalent4*10
						this.myHero.fs = parseInt(this.myHero.fs) + 50 + addTalent4*10
						this.flz = parseInt(this.flz) + 150
						if(this.flz > parseInt(this.myHero.flz)){
							this.flz = this.myHero.flz
						}
						this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
						setTimeout(()=>{
							this.myHero.fy = parseInt(this.myHero.fy) - 35 - addTalent4*10
							this.myHero.fs = parseInt(this.myHero.fs) - 50 - addTalent4*10
						},5000)
						if(strongIndex == 2){
							this.heroAddSpeed(0.3,3500)
						}
					},1500)
				}
			}
			if(this.myHero.name == '鲲' || this.myHero.id == 6){
				this.playVoice('../../static/sounds/kun'+num+'.wav',true,num-1,6500)
				if(num == 1){
					this.cd(5000 - addTalent*250,1)
					this.delayTel(900,num)
					setTimeout(()=>{
						this.blueComput(60 + addTalent*8,'reduce')
						this.enemy.gj = parseInt(this.enemy.gj) - Math.ceil(parseInt(this.enemy.gj) * 0.4) - addTalent*5
						setTimeout(()=>{
							this.enemy.gj = parseInt(this.enemy.gj) + Math.ceil(parseInt(this.enemy.gj) * 0.4) + addTalent*5
						},2000 + addTalent*250)
					},900)
				}
				if(num == 2){
					this.cd(6200 - addTalent2*250,2)
					this.delayTel(1200,num)
					this.blueComput(80 + addTalent2*10,'reduce')
					this.fasheArrow(220,2,30,this.myHero.id,2,2)
				}
				if(num == 3){
					this.cd(2500 - addTalent3*150,3)
					this.delayTel(800,num)
					this.blueComput(35 + addTalent3*8,'reduce')
					this.heroChongci(this.myHero.dis3)
					if(strongIndex == 1){
						this.tallentExpert(3,1,2500)
					}
					let val = this.harmComputer(2,addTalent3) + 250 + addTalent3*70
					if(val < 50){
						val = this.randomNum(100,300)
					}
					this.beat(val)
				}
				if(num == 4){
					this.cd(11000 - addTalent4*500,4)
					this.delayTel(2000,num)
					this.blueComput(180 + addTalent4*30,'reduce')
					this.heroAnm('../../static/imgs/hero/jthl.gif?'+ new Date().getTime())
					this.backBgImg('jthl',6000)
					setTimeout(()=>{
						this.fasheArrow(500,2,65,this.myHero.id,4,6)
					},2000)
				}
			}
			
			if(this.myHero.name == '精英战士' || this.myHero.id == 7){
				this.playVoice('../../static/sounds/jyzs'+num+'.wav',true,num-1,3000)
				if(num == 1){
					//狙击枪
					if(this.ygbj){
						this.cd(3500 - addTalent*250,1)
						this.delayTel(1000,num)
						this.blueComput(50 + addTalent*8,'reduce')
						this.heroAnm('../../static/imgs/hero/jyzs3.gif?'+ new Date().getTime())
						this.backBgImg('jyzs3',2200)
						setTimeout(()=>{
							if(strongIndex == 1){
								this.fasheArrow(780,2,25,this.myHero.id,1,1)
							}else{
								this.fasheArrow(650,2,25,this.myHero.id,1,1)
							}
						},1000)
					}else{	//步枪
						this.cd(1200 - addTalent*30,1)
						this.blueComput(15 + addTalent*3,'reduce')
						if(strongIndex == 1){
							this.fasheArrow(550,2,22,this.myHero.id,1,12)
						}else{
							this.fasheArrow(420,2,22,this.myHero.id,1,12)
						}
					}
				}
				if(num == 2){
					//手榴弹
					if(this.ygbj){
						this.cd(5500 - addTalent2*300,2)
						this.blueComput(50 + addTalent2*10,'reduce')
						let val = this.harmComputer(1,addTalent2) + 250 +
						this.randomNum(250,250+this.myHero.gj*3.5)+ addTalent2*50
						setTimeout(()=>{
							this.beat(val)
						},4000)
					}else{	//烟雾弹
						this.cd(7000 - addTalent2*300,2)
						this.blueComput(70 + addTalent2*10,'reduce')
						this.tallentExpert(3,1,5000)
						this.enemy.gs = (parseFloat(this.enemy.gs) + 0.4 + addTalent2*0.1).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = (parseFloat(this.enemy.gs) - 0.4 - addTalent2*0.1).toFixed(2)
						},5000)
					}
					this.delayTel(1000,num)
				}
				if(num == 3){
					this.cd(5000 - addTalent3*300,3)
					this.addBlood(100 + addTalent3*100,0,0)
					this.delayTel(500,num)
					this.shanxian(50)
					this.heroAddSpeed(0.3 + addTalent3*0.06,3000)
					setTimeout(()=>{
						this.ygbj = !this.ygbj
						if(this.ygbj){
							uni.showToast({
								title: '目前是狙击枪（射击距离较长）',
								icon:'none',
								duration: 800
							});
						}else{
							uni.showToast({
								title: '目前是步枪（射击距离较短）',
								icon:'none',
								duration: 800
							});
						}
					},500)
				}
				if(num == 4){
					if(strongIndex == 1){
						this.cd(6000 - addTalent4*200,4)
					}else{
						this.cd(7500 - addTalent4*300,4)
					}
					setTimeout(()=>{
						this.fasheArrow(2000,2,38,this.myHero.id,4,3)
					},1000)
					this.heroAnm('../../static/imgs/hero/jyzs2.gif?'+ new Date().getTime())
					this.backBgImg('jyzs2',5000)
					this.delayTel(1700,num)
					this.blueComput(100,'reduce')
				}
			}
			if(this.myHero.name == '风神' || this.myHero.id == 8){
				if(num != 1){
					this.playVoice('../../static/sounds/fs'+num+'.wav',true,num-1,5000)
				}
				if(num == 1){
					uni.showToast({
						title: '请点击地图上任意位置释放闪电',
						icon:'none',
						duration: 800
					});
					this.$refs.tallents.tallentShow = true
				}
				if(num == 2){
					if(strongIndex == 1){
						this.cd(5600 - addTalent2*200,2)
					}else{
						this.cd(7500 - addTalent2*200,2)
					}
					this.delayTel(1000,num)
					setTimeout(()=>{
						this.blueComput(80+addTalent2*8,'reduce')
						this.fasheArrow(600,2,100,this.myHero.id,2,7)
					},1000)
				}
				if(num == 3){
					this.cd(6000 - addTalent3*300,3)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.blueComput(35+addTalent3*8,'reduce')
						this.myHero.fs = Math.ceil(parseInt(this.myHero.fs) + parseInt(this.myHero.fs)*0.3 + 50 + addTalent3*20)
						setTimeout(()=>{
							this.myHero.fs = parseInt(this.myHero.fs) - 50 - addTalent3*20
							this.myHero.fs = Math.ceil(parseInt(this.myHero.fs) - parseInt(this.myHero.fs)*0.25)
						},3000)
					},500)
				}
				if(num == 4){
					this.cd(10000 - addTalent4*500,4)
					this.delayTel(2000,num)
					this.blueComput(150+addTalent4*25,'reduce')
					this.heroAnm('../../static/imgs/hero/fengs2.gif?'+ new Date().getTime())
					this.backBgImg('fengs2',3000)
					//沉默1.5秒
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
					this.tallentExpert(3,1,3000+addTalent4*250)
					setTimeout(()=>{
						let val = (parseInt(this.myHero.fs)*(2.6+addTalent4*0.3) - parseInt(this.enemy.mk*4*this.pomo))*2.5 + this.randomNum(250,500+addTalent4*100)
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.beat(val)
					},2000)
				}
			}
			if(this.myHero.name == '诺克萨斯之手' || this.myHero.id == 9){
				this.playVoice('../../static/sounds/nksszs'+num+'.wav',true,num-1,3000)
				if(num == 1){
					this.cd(6200 - addTalent*150,1)
					this.delayTel(1600,num)
					setTimeout(()=>{
						this.blueComput(70 + addTalent*10,'reduce')
						let val = this.harmComputer(1,addTalent) + 250+addTalent*50
						if(strongIndex == 1){
							val = val + 150
						}
						if(!this.distanceComp(70)){
							val = (parseInt(this.myHero.gj * (2.8+addTalent*0.2)) - parseInt(this.enemy.fy*4*this.pojia))*2 + 450+addTalent*50
							if(strongIndex == 1){
								val = val + 200
								this.addBlood(parseInt(val*0.75),0,0)
							}else{
								this.addBlood(parseInt(val*0.6),0,0)
							}
						}
						if(this.xuli < 4){
							this.xuli += 1
						}
						this.beat(val)
					},1600)
				}
				if(num == 2){
					this.cd(3800 - addTalent2*150,2)
					this.delayTel(200,num)
					this.blueComput(35 + addTalent2*10,'reduce')
					setTimeout(()=>{
						let val = parseInt(this.myHero.gj * (2+addTalent2*0.2)) - parseInt(this.enemy.fy*2.5*this.pojia) + 200+addTalent2*50
						//被动
						this.consistBeat(this.randomNum(20,60),500,2000)
						this.tallentExpert(3,1,2500 + addTalent2*150)
						if(this.xuli < 4){
							this.xuli += 1
						}
						this.beat(val)
					},200)
				}
				if(num == 3){
					this.cd(6000 - addTalent3*150,3)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.blueComput(50 + addTalent3*10,'reduce')
						this.enemy.fy = Math.floor(this.enemy.fy*(0.7-addTalent3*0.06))
						this.enChongci(this.myHero.dis3)
					},500)
					setTimeout(()=>{
						this.enemy.fy = Math.floor(this.enemy.fy/(0.7-addTalent3*0.06))
					},2500 + addTalent3*380)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*200,4)
					this.delayTel(1300,num)
					this.blueComput(100 + addTalent4*15,'reduce')
					this.heroAnm('../../static/imgs/hero/dtt.gif?'+ new Date().getTime())
					this.backBgImg('dtt',2200)
					let cval = 0
					//敌方生命值小于35%
					if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.35){
						cval = parseInt(this.myHero.gj*0.7) + 200 + addTalent4*50
					}
					let val = parseInt(this.myHero.gj * 1.3) + 200 + cval + parseInt(this.xuli)*125 + addTalent4*100
					setTimeout(()=>{
						this.beat(val)
						this.xuli = 0
					},1300)
				}
			}
			if(this.myHero.name == '探险家' || this.myHero.id == 10){
				this.playVoice('../../static/sounds/txj'+num+'.wav',true,num-1,3000)
				if(num == 1){
					this.delayTel(100,num)
						this.cd(4000 - addTalent*250,1)
						this.blueComput(35 + addTalent*6,'reduce')
						this.fasheArrow(220,2,30,this.myHero.id,1,1)
				}
				if(num == 2){
					this.cd(6500 - addTalent2*150,2)
					this.delayTel(500,num)
					this.heroAnm('../../static/imgs/hero/ez1.gif?'+ new Date().getTime())
					this.backBgImg('ez1',1000)
					this.blueComput(35 + addTalent2*6,'reduce')
					this.fasheArrow(185,2,25,this.myHero.id,2,4)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*150,3)
					this.delayTel(200,num)
					let self = this
					self.shanxian(60 + addTalent3*5)
					self.blueComput(80 + addTalent3*10,'reduce')
				}
				if(num == 4){
					this.cd(10000 - addTalent4*200,4)
					this.delayTel(1500,num)
					this.blueComput(100 + addTalent4*15,'reduce')
					this.heroAnm('../../static/imgs/hero/ez2.gif?'+ new Date().getTime())
					this.backBgImg('ez2',2200)
					setTimeout(()=>{
						this.fasheArrow(2000,2,40,this.myHero.id,4,6)
					},1500)
				}
			}
			if(this.myHero.name == '齐天大圣' || this.myHero.id == 101){
				this.playVoice('../../static/sounds/qtds'+num+'.wav',true,num-1,4000)
				if(num == 1){
					this.delayTel(2900,num)
					if(this.yinshen){
						if(strongIndex == 2){
							this.cd(3500 - addTalent*150,1)
						}else{
							this.cd(4300 - addTalent*250,1)
						}
						this.shotDown = false
						this.yinshen = false
					}else{
						if(strongIndex == 2){
							this.cd(4500 - addTalent*150,1)
						}else{
							this.cd(5300 - addTalent*250,1)
						}
					}
					this.blueComput(50 + addTalent*6,'reduce')
					this.heroAnm('../../static/imgs/hero/swk1.gif?'+ new Date().getTime())
					this.backBgImg('swk1',2900)
					let val = this.harmComputer(1,addTalent) + 450 + addTalent*60
					if(strongIndex == 2){
						val = val+(this.myHero.gj*1.5)
					}
					setTimeout(()=>{
						this.beat(val)
						//三昧真火
						if(strongIndex == 3){
							this.consistBeat(this.randomNum(30+parseInt(this.myHero.gj*0.5),70+parseInt(this.myHero.gj)),500,1500)
						}
					},2200)
					this.enemy.fy = parseInt(this.enemy.fy*0.7)
					setTimeout(()=>{
						this.enemy.fy = parseInt(this.enemy.fy/0.7)
					},3500 + addTalent*200)
				}
				if(num == 2){
					this.cd(9500 - addTalent2*150,2)
					this.delayTel(300,num)
					this.blueComput(60 + addTalent2*6,'reduce')
					this.heroAnm('../../static/imgs/hero/swk2.gif?'+ new Date().getTime())
					this.backBgImg('swk2',1200)
					this.shanxian(40 + addTalent2*5)
					this.enemyMoveContrl(1)
					let strong = 0
					if(strongIndex == 1){
						this.heroAddSpeed(0.4 + addTalent2*0.08,4500 + addTalent2*120)
						strong = 1500
					}else{
						this.heroAddSpeed(0.3 + addTalent2*0.08,3000 + addTalent2*120)
					}
					this.myHero.icon = ''
					//沉默3秒
					this.shotDown = true
					this.yinshen = true
					setTimeout(()=>{
						this.shotDown = false
						this.yinshen = false
						this.enemyMoveContrl(2)
						this.myHero.icon = this.origHero.icon
					},3000 + addTalent2*120 + strong)
				}
				if(num == 3){
					if(strongIndex == 2){
						this.cd(6000 - addTalent3*150,3)
					}else{
						this.cd(7000 - addTalent3*150,3)
					}
					this.delayTel(1000,num)
					this.heroAnm('../../static/imgs/hero/swk3.gif?'+ new Date().getTime())
					this.backBgImg('swk3',4000)
					this.blueComput(80 + addTalent3*10,'reduce')
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.3).toFixed(2)
					this.yinshen = false
					this.heroChongci(this.myHero.dis3)
					//攻速恢复
					setTimeout(()=>{
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3).toFixed(2)
					},3000+addTalent3*250)
					let val = this.harmComputer(1,addTalent3) + 300 + addTalent3*60
					if(this.yinshen){
						val += parseInt(this.myHero.gj*1.2)
						this.shotDown = false
					}
					this.beat(val)
					//三昧真火
					if(strongIndex == 3){
						this.consistBeat(this.randomNum(30+parseInt(this.myHero.gj*0.5),70+parseInt(this.myHero.gj)),500,1500)
					}
				}
				if(num == 4){
					this.cd(11000 - addTalent4*200,4)
					this.blueComput(120 + addTalent4*15,'reduce')
					this.delayTel(5000,num)
					this.heroAnm('../../static/imgs/hero/swk4.gif?'+ new Date().getTime())
					this.backBgImg('swk4',5300)
					if(strongIndex == 2 || strongIndex == 1){
						this.follow(1,5000)
						this.myNoMove = true
					}
					this.cd5 = false
					this.myHero.fy = parseInt(this.myHero.fy + this.myHero.fy*0.5)
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy - this.myHero.fy*0.5)
						this.cd5 = true
						if(strongIndex == 2 || strongIndex == 1){
							this.myNoMove = false
						}
					},5300)
					let val = parseInt(this.myHero.gj * (1.6+addTalent4*0.1)) - parseInt(this.enemy.fy*1.6*this.pojia)
					  + addTalent4*15 + this.randomNum(20,70)
					this.consistBeat(val,300,5000)
				}
			}
			if(this.myHero.name == '影流之主' || this.myHero.id == 102){
				if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.5){
					this.regGjAdd.gjHarm = this.regGjAdd.gjHarm + this.myHero.gj*0.7
					setTimeout(()=>{
						this.regGjAdd.gjHarm = this.regGjAdd.gjHarm - this.myHero.gj*0.7
					},2500)
				}
				this.playVoice('../../static/sounds/ylzz'+num+'.wav',true,num-1,6000)
				if(num == 1){
					this.delayTel(150,num)
					this.cd(5500 - addTalent*250,1)
					this.blueComput(70 + addTalent*10,'reduce')
					let val = this.harmComputer(1,addTalent) + 450 + addTalent*60
					let cval = parseInt(val*0.6)
					if(this.xuli == 1){
						val = val + cval
					}
					if(this.xuli == 2 && this.reallyRandom(0,3) != 1){
						val = val + cval + val*0.5
					}
					if(strongIndex == 2 || strongIndex == 1){
						val = val + 150
					}
					this.beat(val)
				}
				if(num == 2){
					//与分身互换位置
					if(this.ylzz != null && !this.ygbj){
						let objlist = []
						this.mapObjects.map(i=>{
							if(i.img == 'hero/jie.jpg'){
								objlist.push(i)
							}
						})
						if(objlist.length != 0){
							this.fastsp = this.myspeed - 0.1
							if(this.fastsp < 0){
								this.fastsp = 0
							}
							let x = this.characterX
							let y = this.characterY
							this.characterX = objlist[0].left
							this.characterY = objlist[0].top
							objlist[0].left = x
							objlist[0].top = y
							setTimeout(()=>{
								this.fastsp = 0
							},500)
							this.ygbj = true
							return
						}
					}
					this.delayTel(150,num)
					this.cd(200,2)
					this.blueComput(30 + addTalent2*5,'reduce')
					this.ylzz = setTimeout(()=>{
						clearTimeout(this.ylzz)
						this.ylzz = null
					},9000 - addTalent2*250)
					this.xuli += 1
					let left = 0
					if(this.heroMoveType == 1){
						if(strongIndex == 2 || strongIndex == 1){
							left = -90 + addTalent2*5
						}else{
							left = -70 + addTalent2*5
						}
					}
					if(this.heroMoveType == 2){
						if(strongIndex == 2 || strongIndex == 1){
							left = 90 + addTalent2*5
						}else{
							left = 70 + addTalent2*5
						}
					}
					
					// 添加分身到地图上
					 this.mapObjects.push({
						left: this.characterX + left,
						top: this.characterY,
						img: 'hero/jie.jpg'
					 });
					 this.myHero.dis1 = this.myHero.dis1 + 86
					 this.myHero.dis3 = this.myHero.dis3 + 86
					setTimeout(()=>{
						this.xuli -= 1
						this.myHero.dis1 = this.myHero.dis1 - 86
						this.myHero.dis3 = this.myHero.dis3 - 86
						this.ygbj = false
						this.cd(5000 - addTalent2*250,2)
						this.mapObjects.map((i,d)=>{
							if(i.img == 'hero/jie.jpg' && !i.name){
								this.mapObjects.splice(d,1)
							}
						})
					},4000+addTalent2*250)
				}
				if(num == 3){
					this.delayTel(70,num)
					this.cd(4000 - addTalent3*250,3)
					this.blueComput(50 + addTalent3*6,'reduce')
					let h = (parseInt(this.myHero.gj * (2+addTalent3*0.2)) - parseInt(this.enemy.fy*2.5*this.pojia))*2
					if(h<0){
						h = 0
					}
					let val = h + 250 + addTalent3*35
					let cval = parseInt(val*0.6)
					if(this.xuli == 1){
						val = val + cval
					}
					this.beat(val)
				}
				if(num == 4){
					let objlist = []
					this.mapObjects.map(i=>{
						if(i.img == 'hero/jie.jpg'){
							objlist.push(i)
						}
					})
					if(objlist.length >= 2 || (objlist.length == 1 && objlist[0].name == 'big')){
						//与分身互换位置
							this.fastsp = this.myspeed - 0.1
							if(this.fastsp < 0){
								this.fastsp = 0
							}
							let x = this.characterX
							let y = this.characterY
							objlist.forEach(i=>{
								if(i.name == 'big'){
									this.characterX = i.left
									this.characterY = i.top
									i.left = x
									i.top = y
									setTimeout(()=>{
										this.fastsp = 0
									},500)
								}
							})
						return
					}
					this.cd(200,4)
					this.delayTel(500,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie2.gif?'+ new Date().getTime())
						this.backBgImg('jie2',1500)
					},1000)
					// 添加分身到地图上
					 this.mapObjects.push({
						 name: 'big',
						left: this.characterX,
						top: this.characterY,
						img: 'hero/jie.jpg'
					 });
					 
					 this.myHero.dis1 = this.myHero.dis1 + 40
					 this.myHero.dis3 = this.myHero.dis3 + 40
					setTimeout(()=>{
						this.myHero.dis1 = this.myHero.dis1 - 40
						this.myHero.dis3 = this.myHero.dis3 - 40
						this.xuli -= 1
						this.mapObjects.map((i,d)=>{
							if(i.name == 'big' && i.img == 'hero/jie.jpg'){
								this.mapObjects.splice(d,1)
							}
						})
						if(strongIndex == 2){
							this.cd(10000 - addTalent4*150,4)
						}else{
							this.cd(12000 - addTalent4*250,4)
						}
					},5500+addTalent4*250)
					this.xuli += 1
					this.heroChongci(this.myHero.dis4)
					setTimeout(()=>{
						let cval = 0
						let aval = 0
						//50%概率吨级伤害
						if(this.reallyRandom(0,1) == 1){
							aval = parseInt(this.myHero.gj*2) + 100
						}
						//敌方生命值小于33%
						if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.33){
							cval = parseInt(this.myHero.gj) + 300 + addTalent4*50
						}
						if(strongIndex == 2){
							//敌方生命值小于55%
							if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.55){
								cval = parseInt(this.myHero.gj) + 370 + addTalent4*50
							}
						}
						let val = (parseInt(this.myHero.gj * (2.6+addTalent4*0.25)) - parseInt(this.enemy.fy*4*this.pojia))*2
						 + 550 + cval + aval + addTalent4*100
						this.beat(val)
					},4500)
				}
			}
			if(this.myHero.name == '玉玲珑' || this.myHero.id == 11){
				this.xuli += 1
				if(this.xuli >= 3){
					this.addBlood(parseInt(this.myHero.fs*1.2),0,0)
					this.xuli = 0
				}
				if(strongIndex == 2){
					this.addBlood(parseInt(this.myHero.fs*0.5),0,0)
				}
				if(num == 1){
					this.delayTel(3500,num)
					if(strongIndex == 1){
						this.cd(6000 - addTalent*200,1)
					}else{
						this.cd(8000 - addTalent*200,1)
					}
					this.playVoice('../../static/sounds/yll1.wav',true,0,4000)
					this.blueComput(65 + addTalent*10,'reduce')
					this.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime())
					this.backBgImg('yll1',3500)
					this.tallentExpert(3,1,3000 + addTalent*300)
					this.follow(1,3500)
						let val = parseInt(this.myHero.fs * (1.7 + addTalent*0.12)) - parseInt(this.enemy.mk*2) + this.randomNum(addTalent*10,30 + addTalent*20)
						if(strongIndex == 2){
							val = parseInt(this.myHero.fs * (1.8 + addTalent*0.12)) - parseInt(this.enemy.mk*2) + this.randomNum(addTalent*25,50 + addTalent*20)
						}
						if(val < 50){
							val = this.randomNum(70,150)
						}
						this.consistBeat(val,500,3500)
				}
				if(num == 2){
					this.cd(9000 - addTalent2*200,2)
					this.delayTel(1000,num)
					this.blueComput(50 + addTalent2*6,'reduce')
					this.heroAnm('../../static/imgs/hero/yll2.gif?'+ new Date().getTime())
					this.backBgImg('yll2',1500)
					this.myHero.fy = this.myHero.fy + 35 + addTalent2*5
					setTimeout(()=>{
						let val = addTalent2*50 + parseInt(this.blood1*0.07)
						if(val < 50){
							val = this.randomNum(100,200)
						}
						this.beat(val,1)
					},1000)
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy - 35 - addTalent2*5
					},4000 + addTalent2*250)
				}
				if(num == 3){
					if(strongIndex == 1){
						this.cd(5300 - addTalent3*220,3)
					}else{
						this.cd(6800 - addTalent3*220,3)
					}
					this.playVoice('../../static/sounds/yll3.wav',false,1,2000)
					this.delayTel(200,num)
					this.blueComput(60 + addTalent3*6,'reduce')
					this.heroChongci(this.myHero.dis3)
					let self = this
						let val = self.harmComputer(2,addTalent3) + 100 + addTalent3*50
						self.beat(val)
						setTimeout(()=>{
							self.addBlood(parseInt(self.myHero.fs) + addTalent3*50,0,0)
						},500)
						self.pomo = self.pomo - 0.25
						setTimeout(()=>{
							self.pomo = self.pomo + 0.25
						},2000)
						//敌方生命值小于40%
						if(parseInt(self.blood1)/parseInt(self.enemy.blood) <= 0.4){
							setTimeout(()=>{
								self.$refs.tallents.tallentShow = true
							},200)
						}
				}
				if(num == 4){
					this.cd(11000 - addTalent4*200,4)
					this.delayTel(2500,num)
					this.blueComput(120 + addTalent4*15,'reduce')
					let self = this
					self.heroAnm('../../static/imgs/hero/yll4.gif?'+ new Date().getTime())
					self.backBgImg('yll4',2500)
					self.shotDown = true
					let val = (parseInt(self.myHero.fs * (2.5 + addTalent4*0.2)) - parseInt(self.enemy.mk*2.5))*1.5 + 200 + addTalent4*50
					if(val < 50){
						val = self.randomNum(100,200)
					}
					self.consistBeat(val,800,1700)
					setTimeout(()=>{
						let val = self.harmComputer(2,addTalent4) + self.myHero.fs + 300 + addTalent4*50
						if(strongIndex == 2){
							if(self.randomNum(0,1) == 1){
								val = parseInt(val * 1.6)
							}
						}
						self.beat(val)
						self.shotDown = false
					},2300)
				}
			}
			if(this.myHero.name == '迅捷斥候' || this.myHero.id == 12){
				if(num == 1){
					this.delayTel(1000,num)
					this.cd(9000 - addTalent*150,1)
					this.blueComput(70 + addTalent*10,'reduce')
					this.heroAnm('../../static/imgs/hero/timo1.gif?'+ new Date().getTime())
					this.backBgImg('timo1',2000)
					setTimeout(()=>{
						this.fasheArrow(220,2,30,this.myHero.id,1,2)
					},1200)
				}
				if(num == 2){
					this.cd(7000 - addTalent2*200,2)
					this.blueComput(30 + addTalent2*5,'reduce')
					if(parseFloat(this.myHero.v)>0.5){
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.25 + addTalent2*0.04)).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.25 + addTalent2*0.04)).toFixed(2)
						},3000)
					}
					this.heroAddSpeed(0.4 + addTalent2*0.07, 3000+addTalent2*250)
				}
				if(num == 3){
					this.cd(7000 - addTalent3*200,3)
					this.delayTel(500,num)
					this.blueComput(50 + addTalent3*6,'reduce')
					let val = parseInt(this.myHero.fs * (1.5 + addTalent3*0.1)) + addTalent3*35
					this.regGjAdd.gjHarm = this.regGjAdd.gjHarm + val
					setTimeout(()=>{
						this.regGjAdd.gjHarm = this.regGjAdd.gjHarm - val
					},2500 + addTalent3*250)
					this.xuli = 1
				}
				if(num == 4){
					this.cd(5000 - addTalent4*250,4)
					this.delayTel(1000,num)
					this.blueComput(35 + addTalent4*5,'reduce')
					let self = this
					 // 添加蘑菇到地图上
					  this.mapObjects.push({
						left: this.characterX,  // 随机位置
						top: this.characterY,
						img: 'mogu.png'
					  });
				}
			}
			if(this.myHero.name == '云影之剑' || this.myHero.id == 13){
				if(num == 1){
					this.playVoice('../../static/sounds/shuixingjian.wav',false,0,3000)
					this.delayTel(1000,num)
					if(strongIndex == 1){
						this.cd(4500 - addTalent*200,1)
					}else{
						this.cd(5500 - addTalent*200,1)
					}
					this.blueComput(50 + addTalent*8,'reduce')
					this.heroAnm('../../static/imgs/hero/yyzj.gif?'+ new Date().getTime())
					this.backBgImg('yyzj',1800)
					if(this.myspeed > 0.35){
						this.heroAddSpeed(0.15,2000)
					}
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent) + 300 + addTalent*50
						if(strongIndex == 2){
							val = val + this.myHero.gj
						}
						this.beat(val)
						this.enspeed = this.enspeed + 0.5
						setTimeout(()=>{
							this.enspeed = this.enspeed - 0.5
						},2000 + addTalent*250)
					},1000)
				}
				if(num == 2){
					this.cd(8000 - addTalent2*200,2)
					this.blueComput(30 + addTalent2*5,'reduce')
					if(parseFloat(this.myHero.v)>=0.8){
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.3 + addTalent2*0.04)).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.3 + addTalent2*0.04)).toFixed(2)
						},2000 + addTalent*500)
					}
					//记录当前位置
					this.mapObjects.map((i,d)=>{
						if(i.img == 'chuansongdoor.gif'){
							this.mapObjects.splice(d,1)
						}
					})
					this.mapObjects.push({
						left: this.characterX,
						top: this.characterY,
						width: 160,
						height: 160,
						img: 'chuansongdoor.gif'
					});
					setTimeout(()=>{
						this.mapObjects.map((i,d)=>{
							if(i.img == 'chuansongdoor.gif'){
								this.mapObjects.splice(d,1)
							}
						})
					},7000)
					if(strongIndex == 1){
						this.heroAddSpeed(0.4,2500 + addTalent*250)
					}else{
						this.heroAddSpeed(0.25,2500 + addTalent*250)
					}
				}
				if(num == 3){
					this.playVoice('../../static/sounds/kuaisuyidong.wav',false,1,4000)
					this.cd(6500 - addTalent3*100,3)
					this.delayTel(100,num)
					this.blueComput(70 + addTalent3*8,'reduce')
					if(this.distanceComp(110)){
						this.heroChongci(110,2)
						if(this.characterX > this.enemyX){
							this.characterX = this.enemyX - 50
						}else{
							this.characterX = this.enemyX + 50
						}
						if(this.characterY > this.enemyY){
							this.characterY = this.enemyY - 50
						}else{
							this.characterY = this.enemyY + 50
						}
						let val = this.harmComputer(1,addTalent) + 300 + parseInt(this.myHero.gj*0.6) + addTalent*50
						this.beat(val)
					}else{
						this.shanxian(70 + addTalent3*5)
					}
				}
				if(num == 4){
					this.playVoice('../../static/sounds/mofasukan.wav',false,3,2000)
					this.cd(10000 - addTalent4*250,4)
					this.delayTel(300,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					if(this.myspeed > 0.35){
						this.heroAddSpeed(0.15,2000)
					}
					if(this.distanceComp(70)){
						let val = (parseInt(this.myHero.gj * (2.7+addTalent4*0.25)) - parseInt(this.enemy.fy*4*this.pojia))*2
						 + 600 + addTalent4*100
						this.beat(val)
						if(strongIndex == 1){
							this.$refs.tallents.tallentShow3 = true
						}
					}
					if(this.distance > 100){
						this.addBlood(this.myHero.gj+150+addTalent4*50,0,0)
					}
					if(strongIndex == 2){
						if(this.reallyRandom(0,1) == 1){
							setTimeout(()=>{
								this.playVoice('../../static/sounds/mofasukan.wav',false,3,2000)
								let val = parseInt(this.myHero.gj * (2+addTalent4*0.2)) - parseInt(this.enemy.mk*2*this.pojia)
								 + 600 + addTalent4*100
								this.beat(val)
							},3000 + this.randomNum(0,5)*800)
						}
					}
					this.mapObjects.map((i,d)=>{
						if(i.img == 'chuansongdoor.gif'){
							this.myNoMove = true
							let sp = this.myspeed
							this.myspeed = 0.35
							this.characterX = parseInt(i.left) + 15
							this.characterY = parseInt(i.top) + 20
							setTimeout(()=>{
								this.myspeed = sp
								this.myNoMove = false
							},300)
						}
					})
				}
			}
			if(this.myHero.name == '刀锋之影' || this.myHero.id == 14){
				this.playVoice('../../static/sounds/dfzy'+num+'.wav',true,num-1,3000)
				if(num == 1){
					if(strongIndex == 1){
						this.cd(7000 - addTalent*200,1)
					}else{
						this.cd(8000 - addTalent*200,1)
					}
					this.blueComput(50 + addTalent*8,'reduce')
					this.heroChongci(110,2)
					let val = this.harmComputer(1,addTalent) + 100 + addTalent*50
					this.beat(val)
					setTimeout(()=>{
						if(this.distanceComp(90) && this.yinshen){
							let val = (parseInt(this.myHero.gj * (2.5+addTalent4*0.15)) - parseInt(this.enemy.fy*4*this.pojia))*2
							 + 600 + addTalent4*70
							this.beat(val)
							this.shotDown = false
							this.yinshen = false
							this.enemyMoveContrl(2)
						}
					},300)
					//敌方生命值小于20%
					if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.2){
						this.addBlood(500+this.reallyRandom(0,5)*100,0,0)
					}
				}
				if(num == 2){
					this.delayTel(900,num)
					this.cd(7500 - addTalent2*200,2)
					this.blueComput(60 + addTalent2*6,'reduce')
					this.tallentExpert(3,1,3000 + addTalent2*250)
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent) + addTalent*20
						if(strongIndex == 1){
							val = val+150
						}
						this.beat(val)
						setTimeout(()=>{
							if(this.distanceComp(90) && this.yinshen){
								let val = (parseInt(this.myHero.gj * (2.5+addTalent4*0.15)) - parseInt(this.enemy.fy*4*this.pojia))*2
								 + 600 + addTalent4*70
								this.beat(val)
								this.shotDown = false
								this.yinshen = false
								this.enemyMoveContrl(2)
							}
						},300)
					},500)
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent) + addTalent*20
						if(strongIndex == 1){
							val = val+150
						}
						this.beat(val)
					},1800)
				}
				if(num == 3){
					this.cd(9000 - addTalent3*250,3)
					this.delayTel(100,num)
					this.blueComput(30 + addTalent3*5,'reduce')
					this.heroGJdis = this.heroGJdis + 20
					this.regGjAdd.gjHarm = this.regGjAdd.gjHarm + 150 + addTalent3*30
					setTimeout(()=>{
						this.regGjAdd.gjHarm = this.regGjAdd.gjHarm - 150 - addTalent3*30
					},5000 + addTalent3*250)
				}
				if(num == 4){
					this.cd(12500 - addTalent4*300,4)
					this.delayTel(200,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					if(this.myspeed > 0.5){
						this.heroAddSpeed(0.2,5000 + addTalent4*500)
					}
					if(this.distanceComp(90)){
						let val = (parseInt(this.myHero.gj * (2.4+addTalent4*0.15)) - parseInt(this.enemy.fy*4*this.pojia))*2
						 + 550 + addTalent4*70
						this.beat(val)
					}
					this.myHero.icon = ''
					//沉默
					this.shotDown = true
					this.yinshen = true
					this.enemyMoveContrl(1)
					setTimeout(()=>{
						this.shotDown = false
						this.yinshen = false
						this.enemyMoveContrl(2)
						this.myHero.icon = this.origHero.icon
						if(this.distanceComp(90)){
							let val = (parseInt(this.myHero.gj * (2.5+addTalent4*0.15)) - parseInt(this.enemy.fy*4*this.pojia))*2
							 + 600 + addTalent4*70
							this.beat(val)
						}
					},5000 + addTalent4*500)
				}
			}
			if(this.myHero.name == '熔岩巨兽' || this.myHero.id == 15){
				if(num == 1){
					this.delayTel(500,num)
					this.cd(8000 - addTalent*250,1)
					this.blueComput(70 + addTalent*10,'reduce')
					setTimeout(()=>{
						this.fasheArrow(230,2,30,this.myHero.id,1,2)
					},500)
					this.playVoice('../../static/sounds/ryjs'+num+'.wav',true,num-1,3000)
				}
				if(num == 2){
					this.cd(6500 - addTalent2*150,2)
					this.delayTel(200,num)
					this.blueComput(50 + addTalent2*5,'reduce')
					this.heroAnm('../../static/imgs/hero/ryjs2.gif?'+ new Date().getTime())
					this.backBgImg('ryjs2',2000)
					this.playVoice('../../static/sounds/ryjs'+num+'.wav',true,num-1,3000)
					this.heroGJdis = this.heroGJdis + 25
					this.regGjAdd.gjHarm = this.regGjAdd.gjHarm + parseInt(this.myHero.fs*1.5) + this.myHero.fy
					setTimeout(()=>{
						this.heroGJdis = this.heroGJdis - 25
						this.regGjAdd.gjHarm = this.regGjAdd.gjHarm - parseInt(this.myHero.fs*1.5) - this.myHero.fy
					},4000+ addTalent2*250)
				}
				if(num == 3){
					this.cd(7000 - addTalent3*250,3)
					this.delayTel(500,num)
					this.blueComput(30 + addTalent3*3,'reduce')
					this.fasheArrow(3000+addTalent3*500,2,50,15,3,11)
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy + 35 + addTalent3*5
					},500)
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy - 35 - addTalent3*5
					},3500 + addTalent3*500)
				}
				if(num == 4){
					this.cd(11500 - addTalent4*250,4)
					this.delayTel(300,num)
					this.blueComput(120 + addTalent4*15,'reduce')
					this.heroChongci(150)
					this.playVoice('../../static/sounds/ryjs'+num+'.wav',true,num-1,3000)
					setTimeout(()=>{
						let val = (parseInt(this.myHero.fs)*(2.5+addTalent4*0.2) - parseInt(this.enemy.mk*4*this.pomo))*2 + this.randomNum(150,300+addTalent4*70)
						if(val < 50){
							val = this.randomNum(100,200)
						}
						this.beat(val)
						this.tallentExpert(2,1,2500+addTalent4*330)
					},300)
				}
			}
			if(this.myHero.name == '东海龙王敖光' || this.myHero.id == 16){
				this.antijiansu = 0.5
				if(num == 1){
					if(this.ygbj){	//龙形态
						if(strongIndex == 1){
							this.cd(9000 - addTalent*150,1)
						}else{
							this.cd(11000 - addTalent*250,1)
						}
						this.delayTel(1000,num)
						this.blueComput(60+addTalent*6,'reduce')
						this.heroAnm('../../static/imgs/hero/ag1-1.gif?'+ new Date().getTime())
						this.backBgImg('ag1-1',6500)
						this.playVoice('../../static/sounds/ag4.wav',false,num-1,6500)
						this.heroAddSpeed(0.6,5000 + addTalent*250)
					}else{
						this.cd(9000 - addTalent*250,1)
						this.delayTel(2500,num)
						this.blueComput(60+addTalent*6,'reduce')
						this.heroAnm('../../static/imgs/hero/ag1.gif?'+ new Date().getTime())
						this.backBgImg('ag1',4000)
						this.playVoice('../../static/sounds/ag1.wav',true,num-1,4000)
						if(this.distanceComp(150)){
							setTimeout(()=>{
								let val = this.harmComputer(2,addTalent) + parseInt(this.myHero.fs*1.5) + (200+addTalent*60) + (this.reallyRandom(0,5)*100)
								if(strongIndex == 1){
									val = val + 250
								}
								this.beat(val)
							},2500)
						}else{
							setTimeout(()=>{
								this.fasheArrow(400,2,30,this.myHero.id,1,2)
							},3000)
						}
					}
				}
				if(num == 2){
					if(this.ygbj){	//龙形态
						this.cd(5000 - addTalent2*250,2)
						this.blueComput(50+addTalent2*5,'reduce')
						this.fasheArrow(400,2,30,this.myHero.id,2,4)
					}else{
						this.cd(7000 - addTalent2*250,2)
						this.delayTel(1000,num)
						this.blueComput(30+addTalent2*3,'reduce')
						this.heroAnm('../../static/imgs/hero/ag2.gif?'+ new Date().getTime())
						this.backBgImg('ag2',5500)
						this.playVoice('../../static/sounds/ag'+num+'.wav',false,num-1,5500)
						setTimeout(()=>{
							this.myHero.fs = this.myHero.fs + 35 + addTalent2*10
							this.shotDown = true
							setTimeout(()=>{
								this.shotDown = false
								this.myHero.fs = this.myHero.fs - 35 - addTalent2*10
							},2500+addTalent2*250)
						},1000)
					}
				}
				if(num == 3){
					if(this.ygbj){	//龙形态
						this.cd(10000 - addTalent3*250,3)
						this.blueComput(90+addTalent3*10,'reduce')
						this.fasheArrow(3000,2,33,"无",3,14)
						if(Math.abs(this.characterX - this.enemyX) <= 625 && Math.abs(this.characterY - this.enemyY)<=35){
							let val = parseInt(this.myHero.fs*1.8) - parseInt(this.enemy.mk*1.5) + 30+addTalent3*15
							if(val<=0){
								val = 50
							}
							if(strongIndex == 1){
								val = val + 50
							}
							this.consistBeat(val,500,3000)
						}
					}else{
						this.cd(8000 - addTalent3*250,3)
						this.delayTel(200,num)
						this.blueComput(40+addTalent3*5,'reduce')
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.3-addTalent3*0.02).toFixed(2)
						this.heroGJdis = this.heroGJdis + 30+addTalent3*5
						//攻速恢复
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3+addTalent3*0.02).toFixed(2)
							this.heroGJdis = this.heroGJdis - 30-addTalent3*5
						},4000+addTalent3*250)
					}
				}
				if(num == 4){
					this.cd(15000 - addTalent4*500,4)
					this.delayTel(2000,num)
					this.blueComput(120+addTalent4*10,'reduce')
					this.heroAnm('../../static/imgs/hero/ag4.gif?'+ new Date().getTime())
					this.backBgImg('ag4',5500)
					this.playVoice('../../static/sounds/ag'+num+'.wav',false,num-1,4000)
					setTimeout(()=>{
						this.ygbj = !this.ygbj
						if(this.ygbj){
							this.myHero.icon = 'agIcon.jpeg'
						}else{
							this.myHero.icon = 'ag.jpg'
						}
						this.heroAddSpeed(0.2,3000+addTalent4*500)
						this.addBlood(parseInt(this.myHero.fs*1.5)+addTalent4*100,0,0)
					},2000)
				}
			}
			if(this.myHero.name == '神明' || this.myHero.id == 17){
				if(num == 2){
					this.cd(8000 - addTalent2*250,2)
					this.blueComput(70 + addTalent2*10,'reduce')
					this.heroAnm('../../static/imgs/hero/sm2.gif?'+ new Date().getTime())
					this.backBgImg('sm2',3300)
					let time = setInterval(()=>{
						if(this.distanceComp(this.heroGJdis)){
							let val = parseInt(parseInt(this.myHero.fs)*(1.2+addTalent2*0.08)) - parseInt(this.enemy.mk*2*this.pomo) + this.randomNum(70,80+addTalent2*15)
							if(val <= 30){
								val = this.randomNum(30,40)
							}
							this.beat(val,1)
						}
					},300)
					setTimeout(()=>{
						clearInterval(time)
					},3300)
					this.playVoice('../../static/sounds/sm'+num+'.wav',true,num-1,5300)
				}
				if(num == 3){
					this.cd(7000 - addTalent3*250,3)
					this.delayTel(500,num)
					this.blueComput(30 + addTalent3*3,'reduce')
					this.fasheArrow(3000+addTalent3*500,2,50,15,3,11)
					this.ygbj = true
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy + 50 + addTalent3*5
					},500)
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy - 50 - addTalent3*5
						this.ygbj = false
					},3500 + addTalent3*250)
				}
				if(num == 4){
					this.cd(11000 - addTalent4*250,4)
					this.delayTel(300,num)
					this.blueComput(150 + addTalent4*15,'reduce')
					setTimeout(()=>{
						this.fasheArrow(320,2,44,this.myHero.id,4,6)
					},300)
					this.playVoice('../../static/sounds/sm'+num+'.wav',false,num-1,2300)
				}
			}
			if(this.myHero.name == '达摩' || this.myHero.id == 18){
				// this.playVoice('../../static/sounds/dfzy'+num+'.wav',true,num-1,3000)
				if(num == 1){
					if(!this.ygbj){
						this.$refs.tallents.tallentShow = false
						setTimeout(()=>{
							if(!this.ygbj){
								this.cd(8500 - addTalent*250,1)
							}
						},1200)
						this.delayTel(300,num)
						this.blueComput(50 + addTalent*7,'reduce')
						setTimeout(()=>{
							this.fasheArrow(260 + addTalent*10,2,43,this.myHero.id,1,5)
						},300)
					}else{
						this.delayTel(250,num)
						if(this.distanceComp(230)){
							this.heroChongci(2000,2)
						}else{
							this.heroChongci(2000,2,0.3)
						}
						setTimeout(()=>{
							let val = this.harmComputer(1,addTalent)+ this.myHero.gj + 200 + addTalent*50
							this.beat(val)
							this.cd(8500 - addTalent*250,1)
							this.ygbj = false
						},250)
					}
				}
				if(num == 2){
					this.cd(10000 - addTalent2*250,2)
					this.blueComput(35 + addTalent2*5,'reduce')
					this.fastsp = this.myspeed - 0.2
					this.myNoMove = true
					if(this.enemyX<this.characterX){
						this.characterX = this.characterX + 85 + addTalent2*8
					}else{
						this.characterX = this.characterX - 85 - addTalent2*8
					}
					setTimeout(()=>{
						this.fastsp = 0
						this.myNoMove = false
					},100)
					this.myHero.fy = this.myHero.fy + 50 + addTalent2*7
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy - 50 - addTalent2*7
					},3500)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*250,3)
					this.delayTel(200,num)
					this.blueComput(50 + addTalent3*5,'reduce')
					let val = this.harmComputer(1,addTalent)+ 300 + addTalent*50
					this.beat(val)
					if(this.myHero.v > 0.6){
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.2 - addTalent3*0.05).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.2 + addTalent3*0.05).toFixed(2)
						},3000)
					}
					this.tallentExpert(3,1,3000)
				}
				if(num == 4){
					this.cd(12000 - addTalent4*300,4)
					this.delayTel(500,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					setTimeout(()=>{
						this.enNoMove = true
						this.shotDown = true
						this.fastsp2 = this.enspeed - 0.5
						if(this.enemyX <= this.characterX){
							this.enemyX = this.enemyX - 100 - addTalent4*10
						}else{
							this.enemyX = this.enemyX + 100 + addTalent4*10
						}
						if(this.enemyY <= this.characterY){
							if(Math.abs(this.enemyY - this.characterY)<60){
								this.enemyY = this.enemyY - parseInt(Math.abs(this.enemyY - this.characterY)*1.5) - addTalent4*5
							}else{
								this.enemyY = this.enemyY - parseInt(Math.abs(this.enemyY - this.characterY)*0.6)
							}
						}else{
							if(Math.abs(this.enemyY - this.characterY)<60){
								this.enemyY = this.enemyY + parseInt(Math.abs(this.enemyY - this.characterY)*1.5)  + addTalent4*5
							}else{
								this.enemyY = this.enemyY + parseInt(Math.abs(this.enemyY - this.characterY)*0.6)
							}
						}
						let val1 = (parseInt(this.myHero.gj * (2.6+addTalent4*0.1)) - parseInt(this.enemy.fy*4*this.pojia))*2
						if(val1 <= 0){
							val1 = -100
						}
						let val2 = val1 + 650 + addTalent4*70
						this.beat(val2)
					},500)
					setTimeout(()=>{
						this.fastsp2 = 0
						this.shotDown = false
						this.enNoMove = false
					},1000)
				}
			}
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
		//所有技能延时
		delayTel(time,num) {
			this.$refs.tallents.tallentShow = false
			this.$refs.tallents.tallentShow2 = false
			this.$refs.tallents.tallentShow3 = false
			this.$refs.tallents.tallentShow4 = false
			this.tallentDuring = time
			this.showTallentTime = true
			this.cd5 = false
			setTimeout(()=>{
				if(num != 1 && this.cd1 == null) {
					this.$refs.tallents.tallentShow = true
				}
			},time)
			setTimeout(()=>{
				if(num != 2 && this.cd2 == null) {
					this.$refs.tallents.tallentShow2 = true
				}
			},time)
			setTimeout(()=>{
				if(num != 3 && this.cd3 == null){
					this.$refs.tallents.tallentShow3 = true
				}
			},time)
			setTimeout(()=>{
				if(num != 4 && this.cd4 == null){
					this.$refs.tallents.tallentShow4 = true
				}
			},time)
			setTimeout(()=>{
				this.showTallentTime = false
				this.cd5 = true
			},time)
		},
		
		//普通攻击
		regGj() {
			if(this.bettleEnd){
				return
			}
			if(!this.begin) {
				uni.showToast({
					title: '请点击开始战斗',
					icon:'none',
					duration: 1500
				});
				return
			}
			//超出攻击范围
			if(this.distance > this.myHero.distance){
				if(!this.regGjTimeout){
					if(this.characterX > this.enemyX + 35){
						this.characterX = this.characterX - 30
					}
					if(this.characterY > this.enemyY + 35){
						this.characterY = this.characterY - 30
					}
					if(this.characterX < this.enemyX - 35){
						this.characterX = this.characterX + 30
					}
					if(this.characterY < this.enemyY - 35){
						this.characterY = this.characterY + 30
					}
					this.regGjTimeout = true
					setTimeout(()=>{
						this.regGjTimeout = false
					},this.myspeed * 1000)
				}
				return
			}
			this.playVoice('../../static/sounds/'+this.myHero.id+'.wav',true,7,1500)
			this.cd5 = false
			let v = parseFloat(this.myHero.v) * 1000
			let val = (parseInt(this.myHero.gj * 2.5) - parseInt(this.enemy.fy * 2.2)) * 1.5 + this.regGjAdd.gjHarm
			let hasBj = false
			//暴击
			if(this.randomNum(0,10) <= (parseFloat(this.myHero.bj) * 10)){
				hasBj = true
				if(val <= 0){
					val = 100 + this.randomNum(30,80)
				}else{
					if(this.myEquipName.includes('无尽之刃')) {
						val = (val - this.regGjAdd.gjHarm) * 2.5 + this.regGjAdd.gjHarm
					}else{
						val = (val - this.regGjAdd.gjHarm) * 2 + this.regGjAdd.gjHarm
					}
				}
			}
			//焚天装备
			if(this.myEquipName.includes('焚天')){
				if(!hasBj){
					if((this.$refs.tallents.tallentShow == false && this.$refs.tallents.tallentShow2 == false) ||
					(this.$refs.tallents.tallentShow3 == false && this.$refs.tallents.tallentShow2 == false) ||
					(this.$refs.tallents.tallentShow == false && this.$refs.tallents.tallentShow3 == false)){
						if(this.myEquipName.includes('无尽之刃')) {
							val = (val - this.regGjAdd.gjHarm) * 2.5 + this.regGjAdd.gjHarm
						}else{
							val = (val - this.regGjAdd.gjHarm) * 2 + this.regGjAdd.gjHarm
						}
					}
				}
			}
			//电刃装备
			if(this.dianren) {
				val = val + this.reallyRandom(1,3)*100 + 200
			}
			this.beat(val,1)
			//回血
			if(this.regGjAdd.addBlood > 0){
				this.addBlood(this.regGjAdd.addBlood,0,0)
			}
			//回魔法
			if(this.regGjAdd.addFlz > 0){
				this.flz = parseInt(this.flz) + parseInt(this.regGjAdd.addFlz)
				if(this.flz > parseInt(this.myHero.flz)){
					this.flz = this.myHero.flz
				}
				this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
			}
			setTimeout(()=>{
				this.cd5 = true
			},v)
			this.regGjHandle()
		},
		//打开装备商店
		openEquip(show) {
			if(this.begin && !this.bettleEnd){
				uni.showToast({
					title: '战斗已开始不能打开装备商店',
					icon:'none',
					duration: 1500
				});
				return
			}
			this.openEq = show
		},
		
		//己方回复血量
		addBlood(val,time,timeOut) {
			let vals = val
			if(this.myEquipName.includes('振奋盔甲')){
				vals = parseInt(vals * 1.3)
			}
			if(time == 0 && timeOut == 0){
				this.blood2 = parseInt(this.blood2) + vals
				if(parseInt(this.myHero.blood) < parseInt(this.blood2)){
					this.blood2 = this.myHero.blood
				}
				this.bloodVal2 = Math.round(parseInt(this.blood2) / parseInt(this.myHero.blood) * 100)
				//显示
				this.harm2 = vals
				this.showHarm2 = true
				setTimeout(()=>{
					this.showHarm2 = false
				},1000)
			}else{
				let t = null
				t = setInterval(()=>{
					this.blood2 = parseInt(this.blood2) + vals
					//显示
					this.harm2 = vals
					this.showHarm2 = true
					setTimeout(()=>{
						this.showHarm2 = false
					},1000)
					if(parseInt(this.myHero.blood) < parseInt(this.blood2)){
						this.blood2 = this.myHero.blood
					}
					this.bloodVal2 = Math.round(parseInt(this.blood2) / parseInt(this.myHero.blood) * 100)
				},time)
				setTimeout(()=>{
					clearInterval(t)
				},timeOut)
			}
		},
		//购买的装备
		getEqlist(list,type) {
			let templist = JSON.parse(list)
			let templist2 = []
			this.myEquip = JSON.parse(list)
			templist2 = this.myEquip
			this.myHero = {...this.origHero}
			this.pojia = 1
			this.pomo = 1
			this.myspeed = 1.1
			let has1 = false	//冰晶节杖
			let bloodsEq = 0	//装备总加血量
			let flzEq = 0	//装备总加法力值
			this.regGjAdd.gjHarm = 0
			this.myEquipName.splice(0)
			if(this.gameType == 'paiwei' && !type) {
				let he = []
				if(uni.getStorageSync('paiweiHero')){
					he = JSON.parse(uni.getStorageSync('paiweiHero'))
					if(this.myEquip.length != 0){
						he.forEach((i,d)=>{
							if(i.id == this.myHero.id){
								he[d].eqlist = this.myEquip.map(it=>{
									return JSON.stringify(it)
								})
							}
						})
						uni.setStorageSync('paiweiHero',JSON.stringify(he))
					}
				}
			}
			templist2.forEach(item=>{
				if(item.gj != 0){
					this.myHero.gj = parseInt(this.myHero.gj) + item.gj
				}
				if(item.fy != 0){
					this.myHero.fy = parseInt(this.myHero.fy) + item.fy
				}
				if(item.fs != 0){
					this.myHero.fs = parseInt(this.myHero.fs) + item.fs
				}
				if(item.blood != 0){
					bloodsEq += item.blood
					if(parseInt(this.blood2) == parseInt(this.myHero.blood)){
						this.blood2 = parseInt(this.blood2) + item.blood
					}
				}
				if(item.flz != 0){
					flzEq += item.flz
					if(parseInt(this.flz) == parseInt(this.myHero.flz)){
						this.flz = parseInt(this.flz) + item.flz
					}
				}
				if(item.gs != 0){
					if(parseFloat(this.myHero.v) - parseFloat(item.gs) >= 0.5){
						this.myHero.v = parseFloat(this.myHero.v) - parseFloat(item.gs)
					}else{
						uni.showToast({
							title: '提示：攻击速度最快为0.5s/次',
							icon:'none',
							duration: 1500
						});
						this.myHero.v = 0.5
					}
					this.myHero.v = parseFloat(this.myHero.v).toFixed(2)
				}
				if(item.bj != 0){
					this.myHero.bj = parseInt(this.myHero.bj) + item.bj
				}
				if(item.distance){
					this.addHeroDistance(item.distance,1)
				}
				if(item.speed){
					this.myspeed -= item.speed
				}
				this.myHero.blood = parseInt(this.origHero.blood) + bloodsEq
				this.myHero.flz = parseInt(this.origHero.flz) + flzEq
				this.myEquipName.push(item.name)
				if(item.name == '饮血剑') {
					this.regGjAdd.addBlood = parseInt(parseInt(this.myHero.gj) * 0.25) + this.randomNum(20,50)
				}
				if(item.name == '破败王者之刃') {
					this.regGjAdd.addBlood = parseInt(parseInt(this.myHero.gj) * 0.1) + this.randomNum(50,80)
				}
				if(item.name == '挑战护手') {
					this.regGjAdd.gjHarm = parseInt(this.myHero.gj * 0.6)
				}
				if(item.name == '黑曜切割者') {
					this.pojia -= 0.15
				}
				if(item.name == '收集者') {
					this.pojia -= 0.1
				}
				if(item.name == '赛瑞尔达的怨恨') {
					this.pojia -= 0.3
				}
				if(item.name == '卢登的配枪') {
					this.myHero.fs = parseInt(this.myHero.fs) + 70
					this.myHero.flz = parseInt(this.origHero.flz) + 350
				}
				if(item.name == '虚空之杖') {
					this.pomo -= 0.3
				}
				if(item.name == '法师之靴') {
					this.pomo -= 0.15
				}
				if(item.name == '轻灵之靴') {
					this.antijiansu += 0.25
				}
				if(item.name == '纳什之牙') {
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.fs*1.8)
				}
				if(item.name == '鬼索的狂暴之刃') {
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*0.5) + parseInt(this.myHero.fs*0.5)
				}
				if(item.name == '冰脉护手') {
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.fs*1.6)
				}
				if(item.name == '卢登的配枪') {
					let hs = false
					this.myTool.forEach((i,index)=>{
						if(i.name == '卢登的配枪') {
							hs = true
						}
					})
					if(!hs){
						this.myTool.push(item)
					}
				}
				if(item.name == '兰顿之兆') {
					let hs = false
					this.myTool.forEach((i,index)=>{
						if(i.name == '兰顿之兆') {
							hs = true
						}
					})
					if(!hs){
						this.myTool.push(item)
					}
				}
				if(item.name == '中娅沙漏') {
					let hs = false
					this.myTool.forEach((i,index)=>{
						if(i.name == '中娅沙漏') {
							hs = true
						}
					})
					if(!hs){
						this.myTool.push(item)
					}
				}
				if(item.name == '幽梦之灵') {
					let hs = false
					this.myTool.forEach((i,index)=>{
						if(i.name == '幽梦之灵') {
							hs = true
						}
					})
					if(!hs){
						this.myTool.push(item)
					}
				}
				if(item.name == '斯塔缇克电刃') {
					this.dianren = true
				}
				if(item.name == '无终恨意') {
					this.wzhy = setInterval(()=>{
						if(this.begin){
							this.addBlood(parseInt(this.shotVal1*0.1)+20,0,0)
						}
					},4000)
				}
				//射手加成
				if(item.name == '急射火炮' && this.myHero.details == '射手') {
					this.myHero.gj = parseInt(this.myHero.gj) + 15
					this.myHero.bj = parseInt(this.myHero.bj) + 0.1
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.1).toFixed(2)
					this.addHeroDistance(10,1)
				}
				if(item.name == '飓风王者之弓' && this.myHero.details == '射手') {
					this.myHero.gj = parseInt(this.myHero.gj) + 20
					this.myHero.bj = parseInt(this.myHero.bj) + 0.2
					this.addHeroDistance(10,1)
				}
				if(item.name == '界弓' && this.myHero.details == '射手') {
					this.myHero.gj = parseInt(this.myHero.gj) + 15
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.1).toFixed(2)
					this.pojia -= 0.1
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*0.6)
				}else if(item.name == '界弓'){
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*0.5)
				}
				if(item.name == '残疫') {
					this.addData.add11 += 1
				}
				
				
			})
		},
		//购买的道具
		getToolList(list) {
			if(this.myTool.length != 0){
				let arr = this.myTool.concat(JSON.parse(list))
				this.myTool = [...arr]
			}else {
				this.myTool = JSON.parse(list)
			}
		},
		//使用道具
		useTool(name) {
			if(!this.begin){
				uni.showToast({
					title: '战斗开始后才能使用',
					icon:'none',
					duration: 1500
				});
				return
			}
			if(name == '中娅沙漏') {
				this.shotDown = true
				this.delayTel(3500,0)
				this.tallentExpert(2,2,3500)
				setTimeout(()=>{
					this.shotDown = false
				},3500)
			}
			if(name == '卢登的配枪') {
				if(this.distanceComp(this.myHero.distance)){
					let m = this.myHero.fs*1.6 + this.randomNum(100,250)
					this.beat(m)
				}
			}
			if(name == '兰顿之兆') {
				this.tallentExpert(3,1,3000)
			}
			if(name == '幽梦之灵') {
				this.heroAddSpeed(0.35,3000)
			}
			if(name == '生命药水') {
				this.addBlood(450,0,0)
			}
			if(name == '大瓶生命药水') {
				this.addBlood(750,0,0)
			}
			if(name == '医疗包') {
				this.addBlood(2000,0,0)
			}
			if(name == '夹心饼干') {
				this.addBlood(350,0,0)
				this.flz = parseInt(this.flz) + 400
				if(this.flz > parseInt(this.myHero.flz)){
					this.flz = this.myHero.flz
				}
				this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
			}
			if(name == '法力值药水') {
				this.flz = parseInt(this.flz) + 600
				if(this.flz > parseInt(this.myHero.flz)){
					this.flz = this.myHero.flz
				}
				this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
			}
			if(name == '法术提升药水') {
				this.myHero.fs = parseInt(this.myHero.fs) + 30
				setTimeout(()=>{
					this.myHero.fs = parseInt(this.myHero.fs) - 30
				},6000)
			}
			if(name == '攻击提升药水') {
				this.myHero.gj = parseInt(this.myHero.gj) + 25
				setTimeout(()=>{
					this.myHero.gj = parseInt(this.myHero.gj) - 25
				},6000)
			}
			this.myTool.forEach((item,index)=>{
				if(item.name == name) {
					this.myTool.splice(index,1)
				}
			})
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
		gameLoop() {
			if(this.gameType == 'jinbiao') {
				this.flag = 0
				this.flag2 = 0
				this.xuli = 0
				this.ygbj = false
				clearInterval(this.goTime2)
				clearInterval(this.arrowTimer)
				if(this.myHero.id == 16){	//东海龙王
					this.myHero.icon = 'ag.jpg'
				}
				//64强
				if(this.enemy.level == 64) {
					this.getLoopEnmList(32)
					return
				}
				//32强
				if(this.enemy.level == 32) {
					this.getLoopEnmList(30)
					return
				}
				//32强进16强
				if(this.enemy.level == 30) {
					this.getLoopEnmList(16)
					return
				}
				//16强进8强
				if(this.enemy.level == 16) {
					this.getLoopEnmList(8)
					return
				}
				//8强进4强
				if(this.enemy.level == 8) {
					this.getLoopEnmList(4)
					return
				}
				//4强进半决赛
				if(this.enemy.level == 4) {
					this.getLoopEnmList(2)
					return
				}
				//半决赛进决赛
				if(this.enemy.level == 2) {
					this.getLoopEnmList(1)
					return
				}
				//胜利
				if(this.enemy.level == 1) {
					this.money = editMoney(1500)
					this.modelFrame('恭喜你获得本次锦标赛的【冠军】！请捧起你的冠军奖杯，再接再厉！冠军奖励1500元！','捷报')
					this.showEnIcon = false
					this.showWinLogo2 = true
					setTimeout(()=>{
						this.showWinLogo2 = false
					},4000)
					return
				}
			}
		},
		getLoopEnmList(num) {
			const self = this
			this.bloodVal1 = 100
			this.begin = false
			this.bettleEnd = false
			clearInterval(this.beatTime)
			this.enemyX = this.reallyRandom(0,5)*parseInt((this.screenWidth - 150)/5)
			this.enemyY = this.reallyRandom(0,5)*parseInt((this.screenHeight - 80)/5)
			//开启防御塔
			if(num <= 4){
				if(this.bgImgIndex == 0 || this.bgImgIndex == 4){
					this.showTower2 = true
				}else{
					this.showTower = true
				}
			}
			if(num == 32){
				this.money = editMoney(100)
				this.modelFrame('恭喜你获得胜利！接下来是32强中的另一位选手与你交战。','捷报')
			}
			if(num == 30){
				this.money = editMoney(100)
				this.modelFrame('恭喜你获得胜利！接下来是32强中的另一位选手与你交战。','捷报')
			}
			if(num == 16){
				this.money = editMoney(100)
				this.addBlood(600,0,0)
				this.modelFrame('恭喜你进入到16强！接下来的难度会越来越大，竞争对手的实力会越强。','捷报')
			}
			if(num == 8){
				this.money = editMoney(100)
				this.addBlood(700,0,0)
				this.modelFrame('嘿！你太厉害啦，您已进入到8强！接下来竞争对手有丰富的实力，好好准备好应战吧！','捷报')
			}
			if(num == 4){
				this.money = editMoney(100)
				this.addBlood(800,0,0)
				this.modelFrame('恭喜您已进入到四强！好好准备应战吧！','捷报')
			}
			if(num == 2){
				this.money = editMoney(600)
				this.addBlood(1000,0,0)
				this.modelFrame('恭喜您！已进入到半决赛！你将遇到与你实力相当的对手。奖励您600元！','捷报')
			}
			if(num == 1){
				this.money = editMoney(1000)
				this.addBlood(1500,0,0)
				this.modelFrame('恭喜你再次战胜对方！你已进入到决赛！好好加油！争取获得本次锦标赛的冠军。奖励您1000元！','捷报')
			}
			
			this.flz = parseInt(this.flz) + 350
			if(this.flz > parseInt(this.myHero.flz)){
				this.flz = this.myHero.flz
			}
			this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
					let resp = [...res.data]
					self.enmList = resp.slice()
					let list = []
					self.enmList.forEach(item=>{
						if(item.level == num) {
							list.push(item)
						}
					})
					self.enemy = {...list[self.reallyRandom(0,list.length - 1)]}
					self.enemyGJdis = self.enemy.distance
					self.enspeed = self.enemy.speed
					self.blood1 = self.enemy.blood
					let text = ''
					if(self.enemy.name == '神奇宝贝-小火龙'){
						text = '你本轮的对手是神奇宝贝家族-小火龙，它的能力超群，要小心哦！招式：喷火——会给你造成持续性的伤害。'
					}
					if(self.enemy.name == '三丽鸥-玉桂狗'){
						text = '你本轮的对手是三丽鸥家族的玉桂狗，招式有：洪荒之力——会给你额外造成随机的伤害。'
					}
					if(self.enemy.name == '羊村-灰太狼'){
						text = '你本轮的对手是羊村的灰太狼'
					}
					if(self.enemy.name == '海贼王-路飞'){
						text = '你本轮的对手是海贼王家族的路飞，实力有点强悍。'
					}
					if(self.enemy.name == '南宫问天'){
						text = '你本轮的对手是神兵小将家族的南宫问天。'
					}
					if(self.enemy.name == '加勒比海盗王'){
						text = '你本轮的对手是加勒比海盗王，路过的商船都会被他们劫持，实力很强，小心。'
					}
					if(self.enemy.name == '神奇宝贝-皮卡丘'){
						text = '你本轮的对手是神奇宝贝家族的皮卡丘，实力强悍，要小心哦！'
					}
					if(self.enemy.name == '三界-二郎神杨戬'){
						text = '你本轮的对手是三界的二郎神杨戬，实力特别强悍。有招式：天眼——能让你攻击力和法力值下降。'
						self.myHero.gj = parseInt(self.myHero.gj) - 22
						if(parseInt(self.myHero.fs)>35){
							self.myHero.fs = parseInt(self.myHero.fs) - 35
						}
					}
					
					if(self.enemy.name == '玄武'){
						text = '你本轮的对手是四大神兽的玄武，实力特别强悍。有招式：择机会持续恢复血量与增加防御力。'
					}
					if(self.enemy.name == '武侠-扫地僧'){
						text = '你本轮的对手是武侠界的扫地僧，实力特别强悍。有招式：轮回——当他生命值低于30%时，会恢复一些血量。'
					}
					if(self.enemy.name == '传说-金武圣人'){
						text = '你决赛的对手是“金武圣人”，实力特别强悍。有招式：狂僧——会对你造成随机伤害。'
					}
					if(self.enemy.name == '成龙历险记-圣主'){
						text = '你决赛的对手是“圣主”，实力特别强悍。有招式：元素波——会对你造成持续伤害。'
					}
					if(text != ''){
						setTimeout(()=>{
							self.modelFrame(text,'小提示')
						},2500)
					}
					self.addEnemyStrong()
			// uniCloud.callFunction({
			// 	name: 'getChallegeEnemy'
			// }).then((res) => {
			// 	this.enmList = res.result.data.slice()
			// 	let list = []
			// 	this.enmList.forEach(item=>{
			// 		if(item.level == num) {
			// 			list.push(item)
			// 		}
			// 	})
			// 	this.enemy = {...list[this.reallyRandom(0,list.length - 1)]}
			// 	this.blood1 = this.enemy.blood
			// 	let text = ''
			// 	if(this.enemy.name == '神奇宝贝-小火龙'){
			// 		text = '你本轮的对手是神奇宝贝家族-小火龙，它的能力超群，要小心哦！招式：喷火——会给你造成持续性的伤害。'
			// 	}
			// 	if(this.enemy.name == '三丽鸥-玉桂狗'){
			// 		text = '你本轮的对手是三丽鸥家族的玉桂狗，招式有：洪荒之力——会给你额外造成随机的伤害。'
			// 	}
			// 	if(this.enemy.name == '羊村-灰太狼'){
			// 		text = '你本轮的对手是羊村的灰太狼'
			// 	}
			// 	if(this.enemy.name == '海贼王-路飞'){
			// 		text = '你本轮的对手是海贼王家族的路飞，实力有点强悍。'
			// 	}
			// 	if(this.enemy.name == '神奇宝贝-皮卡丘'){
			// 		text = '你本轮的对手是神奇宝贝家族的皮卡丘，实力强悍，要小心哦！'
			// 	}
			// 	if(this.enemy.name == '三界-二郎神杨戬'){
			// 		text = '你本轮的对手是三界的二郎神杨戬，实力特别强悍。有招式：天眼——能让你攻击力和法力值下降。'
			// 		this.myHero.gj = parseInt(this.myHero.gj) - 22
			// 		if(parseInt(this.myHero.fs)>35){
			// 			this.myHero.fs = parseInt(this.myHero.fs) - 35
			// 		}
			// 	}
			// 	if(this.enemy.name == '武侠-扫地僧'){
			// 		text = '你本轮的对手是武侠界的扫地僧，实力特别强悍。有招式：轮回——当他生命值低于30%时，会恢复一些血量。'
			// 	}
			// 	if(this.enemy.name == '传说-金武圣人'){
			// 		text = '你决赛的对手是“金武圣人”，实力特别强悍。有招式：狂僧——会对你造成随机伤害。'
			// 	}
			// 	if(this.enemy.name == '成龙历险记-圣主'){
			// 		text = '你决赛的对手是“圣主”，实力特别强悍。有招式：元素波——会对你造成持续伤害。'
			// 	}
			// 	if(text != ''){
			// 		setTimeout(()=>{
			// 			this.modelFrame(text,'小提示')
			// 		},2500)
			// 	}
			// })
		},
		modelFrame(text,title) {
			uni.showToast({
				title: text,
				icon:'none',
				duration: 2000
			});
			// uni.showModal({
			// 	title: title,
			// 	content: text,
			// 	showCancel: false,
			// 	success: function (res) {
			// 		if (res.confirm) {}
			// 	}
			// });
		},
		//查看技能介绍
		toTInfo() {
			this.tallentList = JSON.parse(JSON.stringify(this.myHero.tallent))
			this.showTInfo = true
		},
		toIntro() {
			this.showIntro = true
		},
		//战斗胜利
		winBettle() {
			this.win = true
			this.blood1 = 0
			this.bloodVal1 = 0
			this.bettleEnd = true
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
								e.fs = e.fs + 25
							}
						})
						uni.setStorageSync('paiweiHero',JSON.stringify(h))
					}
				}else{
					this.myHero.fs = this.myHero.fs + 15
				}
			}
			this.beatTime = null
			if(this.gameType == 'jinbiao' || this.gameType == 'tianti'){
				this.gameLoop()
			}else{
				this.showEnIcon = false
			}
			if(this.gameType == 'wuxian'){
				this.wuxianLoop()
			}
			if(this.gameType == 'paiwei'){
				let time = parseInt(this.min) * 60 + parseInt(this.second)
				if(this.myHero.hasMKE){
					this.blood2 = parseInt(this.blood2) + 1000
				}
				setTimeout(()=>{
					let url = this.enemy.name+'&heroBlood='+parseInt(this.blood2)+'&hero='+this.myHero.name+'&time='+time+""
					uni.redirectTo({
						url: "/pages/white?beatEnemy="+url+""
					})
				},1000)
			}
		},
		//战斗失败
		loseBettle() {
			uni.showToast({
				title: '战斗结束，你的英雄阵亡！请到“我的背包”复活',
				icon:'none',
				duration: 1000
			});
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
		playVoice(url,type,index,time) {
			this.innerAudioContext[index] = uni.createInnerAudioContext();
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
		},
		//装填英雄加成
		getAddTalent(option) {
			//选择的英雄皮肤
			if(this.addData.strongIndex){
				heroStrongList.data.map(i=>{
					if(i.index == this.addData.strongIndex && this.myHero.id == i.id){
						this.myHero.name = i.name
						this.myHero.blood = i.blood
						this.myHero.flz = i.flz
						this.myHero.gj = i.gj
						this.myHero.fs = i.fs
						this.myHero.fy = i.fy
						this.myHero.v = parseFloat(i.v).toFixed(2)
						this.myHero.bj = i.bj
						this.myHero.icon = i.icon
					}
				})
			}
			this.flz = this.myHero.flz + this.addData.add2*100
			if(this.gameType != 'paiwei'){
				this.blood2 = this.myHero.blood + this.addData.add1*150
			}else{
				if(this.myHero.blood > 3000){
					this.blood2 = this.myHero.blood + this.addData.add1*150
				}else{
					this.blood2 = this.myHero.blood
				}
			}
			this.myHero.blood = this.blood2
			this.myHero.flz = this.flz
			this.myHero.gj += parseInt(this.addData.add3)*2
			this.myHero.fs += parseInt(this.addData.add4)*2
			this.myHero.fy += parseInt(this.addData.add5)*2
			if(parseFloat(this.myHero.v) > 0.5){
				this.myHero.v = parseFloat(this.myHero.v - parseInt(this.addData.add6)*0.15).toFixed(2)
			}
			this.myHero.bj += parseFloat(this.addData.add7*0.1).toFixed(1)
			if(parseFloat(this.myHero.bj)>1){
				this.myHero.bj = 1
			}
			// 齐天大圣被动
			if(this.myHero.name == '齐天大圣'){
				this.myHero.fy += Math.ceil(this.addData.allPointer/500)*2
			}
		
		},
		known() {
			this.showIntro = false
			// uniCloud.callFunction({
			// 	name: 'setMoney',
			// 	data: {
			// 		money: 0,
			// 		name: name
			// 	}
			// }).then((res) => {
			// 	this.showIntro = false
			// }).catch(e=>{
			// 	uni.showToast({
			// 		title: e,
			// 		icon:'none',
			// 		duration: 1500
			// 	});
			// })
		},
		//敌方持续回血
		enemyConsistAddBlood(val,t,timeout) {
			let self = this
			let time = setInterval(()=>{
				if(parseInt(self.blood1) + val > self.enemy.blood){
					self.blood1 = self.enemy.blood
				}else{
					self.blood1 = parseInt(self.blood1) + val
				}
				self.bloodVal1 = Math.round(parseInt(self.blood1) / parseInt(self.enemy.blood) * 100)
				//显示
				self.harm = val
				self.showAddBlood = true
				self.showHarm = false
			},t)
			setTimeout(()=>{
				self.showHarm = false
				self.showAddBlood = false
				clearInterval(time)
			},timeout)
		},
		// //英雄被沉默，且有背景动画
		// delayHero(time) {
		// 	this.bgZIndex = 11
		// 	this.delayTel(time,0)
		// 	setTimeout(()=>{
		// 		this.bgZIndex = 1
		// 	},time)
		// },
		heroAnm(url,type) {
			if(type){
				this.showEngjAnm = true
				this.engjAnm = url
			}else{
				this.showMygjAnm = true
				this.mygjAnm = url
			}
		},
		wuxianLoop() {
			this.begin = false
			this.bettleEnd = false
			this.enemy.gj += 3
			this.enemy.fy += 3
			this.enemy.mk += 3
			this.enemy.blood += 90
			this.bloodVal1 = 100
			this.blood1 = parseInt(this.enemy.blood)
			clearInterval(this.beatTime)
			let earnMoney = 50
			if(this.loop > 4 && this.loop < 10){
				this.enemy.gj += 3
				this.enemy.fy += 3
				this.enemy.mk += 3
				this.enemy.blood += 50
				earnMoney = 100
			}
			if(this.loop >= 10 && this.loop < 15){
				this.enemy.gj += 3
				this.enemy.fy += 4
				this.enemy.mk += 4
				this.enemy.blood += 70
				earnMoney = 150
			}
			if(this.loop >= 15 && this.loop < 20){
				this.enemy.gj += 3
				this.enemy.fy += 5
				this.enemy.mk += 5
				this.enemy.blood += 110
				earnMoney = 200
			}
			if(this.loop >= 20 && this.loop < 30){
				this.enemy.gj += 5
				this.enemy.fy += 6
				this.enemy.mk += 6
				this.enemy.blood += 160
				earnMoney = 250
			}
			if(this.loop >= 30){
				this.enemy.gj += 7
				this.enemy.fy += 8
				this.enemy.mk += 8
				this.enemy.blood += 150
				earnMoney = 350
			}
			this.money = editMoney(earnMoney)
			this.addBlood(12000,0,0)
			this.flz = parseInt(this.flz) + 1000
			if(this.flz > parseInt(this.myHero.flz)){
				this.flz = this.myHero.flz
			}
			this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
			this.loop += 1
			uni.showToast({
				title: '第'+this.loop+'关，奖励'+earnMoney+'元',
				icon:'none',
				duration: 1600
			});
		},
		//标准伤害算法
		harmComputer(type,addTalent) {
			let val = 0
			//攻击
			if(type == 1){
				val = (parseInt(this.myHero.gj * (2.5+addTalent*0.2)) - parseInt(this.enemy.fy*4.3*this.pojia))*2
			}
			//法术
			if(type == 2){
				val = (parseInt(this.myHero.fs * (2.5 + addTalent*0.2)) - parseInt(this.enemy.mk*4.3*this.pomo))*2
			}
			//敌方英雄
			if(type == 3){
				val = (parseInt(this.enemy.gj * 2.5) - parseInt(this.myHero.fy*2.8))*2 + 100
			}
			if(val < 0){
				return -50
			}
			return val
		},
		//敌方英雄技能
		enemyTallent(num) {
			if(this.bettleEnd || !this.begin){
				return
			}
			if(this.enemy.name.indexOf('德玛西亚之力') != -1){
				let t1 = null
				//被动
				t1 = setInterval(()=>{
					this.enemy.fy = parseInt(this.enemy.fy) + 1
				},1000)
				setTimeout(()=>{
					clearInterval(t1)
				},2000)
				this.playVoice('../../static/sounds/qmxyzl'+num+'.wav',false,num+3,5000)
				if(num == 1){
					if(this.distanceComp(85)){
						let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj * 1.3)
						this.enemyBeat2(val)
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 1200
						});
						//沉默1.5秒
						this.delayTel(1500,0)
					}else{
						this.enspeed = this.enspeed - 0.4
						setTimeout(()=>{
							this.enspeed = this.enspeed + 0.4
						},2000)
					}
				}
				if(num == 2){
						this.enemy.fy = parseInt(this.enemy.fy) + 100
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 100
						},2200)
				}
				if(num == 3){
					if(this.distanceComp(85)){
						let val = parseInt(this.enemy.gj * 1.2) - parseInt(this.myHero.fy*1.2) + 35
						this.consistEnemyBeat(val,200,2200)
					}
				}
				if(num == 4){
					if(this.distanceComp(100)){
						this.heroAnm('../../static/imgs/hero/dmxyzy.gif?'+ new Date().getTime(),1)
						this.backBgImg('dmxyzy',3000, 1)
						let cval = 0
						//敌方生命值小于30%
						if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.33){
							cval = parseInt(this.enemy.gj * 3) + 700 - parseInt(this.myHero.fy*2.2)
						}
						let val = (parseInt(this.enemy.gj * 3.3) - parseInt(this.myHero.fy*2.2))*2 + 700 + cval
						this.enemyBeat2(val)
					}
				}
			}
			if(this.enemy.name.indexOf('GG Bond') != -1){
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
						let val = this.harmComputer(3) + 300 + parseInt(this.enemy.gj*1.3)
						this.enemyBeat2(val)
					}
				}
				if(num == 2){
					this.tallentExpert(1,1,3000)
					let val = parseInt(this.enemy.gj) * 0.5 + 50
					this.enemyConsistAddBlood(val,500,3000)
				}
				if(num == 3){
						this.heroAnm('../../static/imgs/hero/cjbbt.gif?'+ new Date().getTime(),1)
						this.backBgImg('cjbbt',6000,1)
						setTimeout(()=>{
							this.enemy.gj = parseInt(this.enemy.gj) + 60
							this.enemy.fy = parseInt(this.enemy.fy) + 30
							setTimeout(()=>{
								this.enemy.gj = parseInt(this.enemy.gj) - 60
								this.enemy.fy = parseInt(this.enemy.fy) - 30
							},4000)
							this.enemyConsistAddBlood(600,90,100)
						},1500)
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
						this.heroAnm('../../static/imgs/hero/xlsbz.gif?'+ new Date().getTime(),1)
						this.backBgImg('xlsbz',5500,1)
						setTimeout(()=>{
							this.fasheArrow(600,1,50,this.enemy.name,4,3)
						},3000)
					}
				}
			}
			if(this.enemy.name.indexOf('少林武僧') != -1){
				let randomVal = this.randomNum(50,250)
				this.playVoice('../../static/sounds/wuqi'+num+'.wav',false,num+3,5500)
				if(num == 1){
					this.enChongci(this.enemy.dis1)
					let val = this.harmComputer(3)
					+ randomVal + 350 
					this.enemyBeat2(val)
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
						this.delayTel(2500,0)
						let val = Math.round(this.shotVal2) + Math.round(120 / parseFloat(this.myHero.v))
						+ parseInt(this.enemy.gj*1.5) - parseInt(this.myHero.fy*0.6) + randomVal
						if(val<=0){
							val = randomVal
						}
						setTimeout(()=>{
							this.enemyBeat2(val)
						},2500)
						}
				}
				if(num == 4){
						this.heroAnm('../../static/imgs/hero/wqds.gif?'+ new Date().getTime(),1)
						this.backBgImg('wqds',1500,1)
						if(this.enspeed >= 0.7){
							this.enemy.fy = parseInt(this.enemy.fy) + 30
							this.enspeed = this.enspeed - 0.3
							setTimeout(()=>{
								this.enemy.fy = parseInt(this.enemy.fy) - 30
								this.enspeed = this.enspeed + 0.3
							},5000)
						}
						let val =  parseInt(this.enemy.gj * 2.7)
						 - parseInt(this.myHero.fy*2) + 500 + randomVal
						setTimeout(()=>{
							if(this.distanceComp(100)){
								this.enemyBeat2(val)
							}
						},1000)
				}
			}
			if(this.enemy.name.indexOf('无极剑圣') != -1){
				if(num != 2){
					this.playVoice('../../static/sounds/jiansheng'+num+'.wav',true,num+3,3500)
				}
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
						this.enChongci(this.enemy.dis1)
						let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj*1.3)
						this.enemyBeat2(val)
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 1200
						});
						//沉默1.5秒
						this.delayTel(1500,0)
					}
				}
				if(num == 2){
					if(this.bloodVal1 <= 50 && this.randomNum(0,1) == 1){
						let val = parseInt(this.enemy.gj) * 0.5 + 20 + this.randomNum(10,50)
						this.enemyConsistAddBlood(val,500,3000)
						this.tallentExpert(1,1,3000)
						this.enemy.fy = parseInt(this.enemy.fy) + 60
						this.shotDown = true
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 60
							this.shotDown = false
						},3000)
					}
						
				}
				if(num == 3){
					if(this.enemy.gs >= 0.7){
						this.enemy.gs = (parseFloat(this.enemy.gs) - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = (parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},3500)
					}
					if(this.enspeed >= 0.7){
						this.enspeed = this.enspeed - 0.2
						setTimeout(()=>{
							this.enspeed = this.enspeed + 0.2
						},2500)
					}
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
						this.heroAnm('../../static/imgs/hero/wjjs.gif?'+ new Date().getTime(),1)
						this.backBgImg('wjjs',5000,1)
						let val = parseInt(this.enemy.gj * 1.5) - parseInt(this.myHero.fy*1.5) + this.randomNum(50,200)
						if(val <= 60){
							val = this.randomNum(70,170)
						}
						this.consistEnemyBeat(val,500,3000)
					}
				}
			}
			if(this.enemy.name.indexOf('广寒仙子-嫦娥') != -1){
				this.playVoice('../../static/sounds/cer'+num+'.wav',true,num+3,3000)
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
						this.ygbj = true
						let val = this.harmComputer(3) + 250
						this.enemyBeat2(val)
					}
				}
				if(num == 2){
					if(this.distanceComp(this.enemy.dis2)){
						this.enemy.fy = parseInt(this.enemy.fy) + 35
						this.enemy.gj = parseInt(this.enemy.gj) + 35
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 35
							this.enemy.gj = parseInt(this.enemy.gj) - 35
							let val = (parseInt(this.enemy.gj)*2.2 - parseInt(this.myHero.fy*2.2))*2 + 150
							if(val < 150){
								val = 150
							}
							this.enemyBeat2(val,1)
						},4000)
					}
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
						let addVal = 0
						if(this.ygbj){
							addVal = parseInt(this.enemy.gj)
						}
						let val = this.harmComputer(3) + 350 + addVal
						if(val < 150){
							val = 150
						}
						this.enChongci(parseInt(this.enemy.dis3))
						this.enemyBeat2(val)
						this.ygbj = false
					}
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/cer.gif?'+ new Date().getTime(),1)
					this.backBgImg('cer',3600,1)
					setTimeout(()=>{
						let val = Math.ceil(parseInt(this.enemy.gj)*1.5) + 300 + this.randomNum(0,200)
						this.enemyConsistAddBlood(val,900,1000)
						this.enemy.fy = parseInt(this.enemy.fy) + 35
						this.enemy.gj = parseInt(this.enemy.gj) + 50
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 35
							this.enemy.gj = parseInt(this.enemy.gj) - 50
						},5000)
					},1500)
				}
			}
			if(this.enemy.name.indexOf('鲲') != -1){
				this.playVoice('../../static/sounds/kun'+num+'.wav',true,num+3,6000)
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
						this.myHero.gj = parseInt(this.myHero.gj) - Math.ceil(parseInt(this.myHero.gj) * 0.4)
						this.myHero.fs = parseInt(this.myHero.fs) - Math.ceil(parseInt(this.myHero.fs) * 0.4)
						setTimeout(()=>{
							this.myHero.gj = parseInt(this.myHero.gj) + Math.ceil(parseInt(this.myHero.gj) * 0.4)
							this.myHero.fs = parseInt(this.myHero.fs) + Math.ceil(parseInt(this.myHero.fs) * 0.4)
						},2000)
					}
				}
				if(num == 2){
					this.fasheArrow(220,1,30,"鲲",2,2)
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
					this.heroChongci(this.enemy.dis3)
						let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj *1.3)
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.enemyBeat2(val)
						}
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/jthl.gif?'+ new Date().getTime(),1)
					this.backBgImg('jthl',6000,1)
					
					setTimeout(()=>{
						this.fasheArrow(500,1,65,"鲲",4,6)
					},2500)
				}
			}
			if(this.enemy.name.indexOf('精英战士') != -1){
				this.playVoice('../../static/sounds/jyzs'+num+'.wav',true,num+3,3000)
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
					//狙击枪
					this.heroAnm('../../static/imgs/hero/jyzs3.gif?'+ new Date().getTime(),1)
					this.backBgImg('jyzs3',2200,1)
					setTimeout(()=>{
						this.fasheArrow(650,1,25,"精英战士",1,1)
					},1000)
					}
				}
				if(num == 2 || num == 3){
					if(this.distanceComp(this.enemy.dis2)){
					//手榴弹
						let val = this.harmComputer(3) + 250 + this.randomNum(250,250+this.enemy.gj*3)
						this.tallentExpert(3,2,5000)
						setTimeout(()=>{
							this.enemyBeat2(val)
						},4000)
						}
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
						this.fasheArrow(2000,1,38,"精英战士",4,3)
						this.heroAnm('../../static/imgs/hero/jyzs2.gif?'+ new Date().getTime(),1)
						this.backBgImg('jyzs2',5000)
					}
				}
			}
			if(this.enemy.name.indexOf('风神') != -1){
				this.playVoice('../../static/sounds/fs'+num+'.wav',true,num+3,5000)
				if(num == 1){
					if(this.distanceComp(150)){
						this.heroAnm('../../static/imgs/hero/fengs1.gif?'+ new Date().getTime(),1)
						this.backBgImg('fengs1',600,1)
						if(parseInt(this.myHero.fy) > 60){
							this.myHero.fy = parseInt(this.myHero.fy) - 10
						}
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*1.5) + 300
						this.enemyBeat2(val)
					}
				}
				if(num == 2){
					this.fasheArrow(600,1,100,"风神",2,7)
				}
				if(num == 3){
						this.enemy.gj = Math.ceil(parseInt(this.enemy.gj) + parseInt(this.enemy.gj)*0.3 + 50)
						setTimeout(()=>{
							this.enemy.gj = parseInt(this.enemy.gj) - 50
							this.enemy.gj = Math.ceil(parseInt(this.enemy.gj) - parseInt(this.enemy.gj)*0.25)
						},3000)
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
					this.tallentExpert(3,2,3000+addTalent4*250)
					this.heroAnm('../../static/imgs/hero/fengs2.gif?'+ new Date().getTime(),1)
					this.backBgImg('fengs2',3000,1)
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
					//沉默1.5秒
					this.delayTel(1500,0)
					setTimeout(()=>{
						let val = (parseInt(this.enemy.gj)*3 - parseInt(this.myHero.fy*2.5))*2.3 + this.randomNum(250,600)
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.enemyBeat2(val)
					},2000)
					}
				}
			}
			if(this.enemy.name.indexOf('诺克萨斯之手') != -1){
				this.playVoice('../../static/sounds/nksszs'+num+'.wav',true,num+3,5000)
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
					setTimeout(()=>{
						let val = this.harmComputer(3) + 300
						if(this.distanceComp(65)){
							val = (parseInt(this.enemy.gj * 3) - parseInt(this.myHero.fy*2.5))*2 + 450
							this.enemyConsistAddBlood(parseInt(val),50,60)
						}
						this.enemyBeat2(val)
					},1600)
					}
				}
				if(num == 2){
					if(this.distanceComp(this.enemy.dis2)){
						let val = parseInt(this.enemy.gj * 2.2) - parseInt(this.myHero.fy*2) + 200
						//被动
						this.consistEnemyBeat(this.randomNum(20,60),500,2000)
						this.enemyBeat2(val)
						this.tallentExpert(3,2,2500)
						}
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
						this.myHero.fy = Math.floor(this.myHero.fy*0.8)
						this.heroChongci(this.enemy.dis3)
						setTimeout(()=>{
							this.myHero.fy = Math.floor(this.myHero.fy/0.8)
						},2500)
					}
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
						this.heroAnm('../../static/imgs/hero/dtt.gif?'+ new Date().getTime(),1)
						this.backBgImg('dtt',2200,1)
						let cval = 0
						//敌方生命值小于35%
						if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.35){
							cval = parseInt(this.enemy.gj*1.2) + 300
						}
						let val = parseInt(this.enemy.gj * 2.2) + 500 + cval
						setTimeout(()=>{
							this.enemyBeat2(val)
						},1300)
					}
				}
			}
			if(this.enemy.name.indexOf('探险家') != -1){
				this.playVoice('../../static/sounds/txj'+num+'.wav',true,num+3,4000)
				if(num == 1){
					this.fasheArrow(220,1,30,"探险家",1,1)
				}
				if(num == 2){
					this.fasheArrow(185,1,25,"探险家",2,4)
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
					this.heroAnm('../../static/imgs/hero/ez1.gif?'+ new Date().getTime(),1)
					this.backBgImg('ez1',1000,1)
					let self = this
					if(self.enmoveModel == 2){
						self.enChongci(70,1)
					}else{
						self.enDuobi(70)
					}
					setTimeout(()=>{
						self.enemy.gs = parseFloat(parseFloat(self.enemy.gs) - 0.2).toFixed(1)
						setTimeout(()=>{
							self.enemy.gs = parseFloat(parseFloat(self.enemy.gs) + 0.2).toFixed(1)
						},2500)
					},800)
					}
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/ez2.gif?'+ new Date().getTime(),1)
					this.backBgImg('ez2',2200)
					setTimeout(()=>{
						this.fasheArrow(2000,1,40,"探险家",4,6)
					},1500)
				}
			}
			if(this.enemy.name.indexOf('影流之主') != -1){
				this.playVoice('../../static/sounds/ylzz'+num+'.wav',true,num+3,6000)
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
						let val = this.harmComputer(3) + 300 + parseInt(this.enemy.gj * 1.3)
						let cval = parseInt(val*0.6)
							val = val + cval
						this.enemyBeat2(val)
					}
				}
				if(num == 2){
					this.enemy.distance += 86
					this.enemyGJdis += 86
					setTimeout(()=>{
						this.enemy.distance -= 86
						this.enemyGJdis -= 86
					},4000)
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
						let h = (parseInt(this.enemy.gj * 2.3) - parseInt(this.myHero.fy*2))*2
						if(h<0){
							h = 0
						}
						let val = h + 250
						let cval = parseInt(val*0.6)
							val = val + cval
						this.enemyBeat2(val)
					}
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
						this.enChongci(this.enemy.dis4)
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie2.gif?'+ new Date().getTime(),1)
						this.backBgImg('jie2',1500,1)
					},1000)
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie3.gif?'+ new Date().getTime(),1)
						this.backBgImg('jie3',1500,1)
					},2500)
					setTimeout(()=>{
						let cval = 0
						let aval = 0
						//50%概率吨级伤害
						if(this.reallyRandom(0,1) == 1){
							aval = parseInt(this.enemy.gj*2) + 100
						}
						//敌方生命值小于33%
						if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.33){
							cval = parseInt(this.enemy.gj) + 300
						}
						let val = (parseInt(this.enemy.gj * 2.8) - parseInt(this.myHero.fy*2.5))*2
						 + 550 + cval + aval
						this.enemyBeat2(val)
					},3300)
					}
				}
			}
			if(this.enemy.name.indexOf('玉玲珑') != -1){
				this.playVoice('../../static/sounds/yll'+num+'.wav',true,num+3,5000)
				if(num == 1){
					if(this.distanceComp(this.enemy.dis1)){
					this.tallentExpert(3,2,3000)
					this.follow(2,3500)
					this.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime(),1)
					this.backBgImg('yll1',3500,1)
						let val = parseInt(this.enemy.gj *1.8) - parseInt(this.myHero.fy*1.2) + this.randomNum(30,90)
						if(val < 50){
							val = this.randomNum(30,100)
						}
						this.consistEnemyBeat(val,500,3500)
						}
				}
				if(num == 2){
					if(this.distanceComp(this.enemy.dis2)){
					this.heroAnm('../../static/imgs/hero/yll2.gif?'+ new Date().getTime(),1)
					this.backBgImg('yll2',1500,1)
					this.enemy.fy = this.enemy.fy + 35
					this.enemy.mk = this.enemy.mk + 35
					setTimeout(()=>{
						let val = parseInt(this.blood2*0.12) + 50
						if(val < 50){
							val = this.randomNum(100,200)
						}
						this.enemyBeat2(val)
					},1000)
					setTimeout(()=>{
						this.enemy.fy = this.enemy.fy - 35
						this.enemy.mk = this.enemy.mk - 35
					},4300)
					}
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
						this.enChongci(this.enemy.dis3)
					let self = this
						let val = self.harmComputer(3) + 200
						self.enemyBeat2(val)
						setTimeout(()=>{
							self.enemyConsistAddBlood(parseInt(self.enemy.gj*1.2),100,150)
						},500)
						//敌方生命值小于40%
						if(parseInt(self.blood2)/parseInt(self.myHero.blood) <= 0.4){
							self.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime(),1)
							self.backBgImg('yll1',3500)
							let val = parseInt(self.enemy.gj *1.6) - parseInt(self.myHero.fy*1.2) + self.randomNum(30,90)
							if(val < 50){
								val = self.randomNum(30,100)
							}
							self.consistEnemyBeat(val,500,3500)
						}
						}
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
					let self = this
					self.heroAnm('../../static/imgs/hero/yll4.gif?'+ new Date().getTime(),1)
					self.backBgImg('yll4',2500,1)
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
					self.delayTel(2300,0)
					let val = (parseInt(self.enemy.gj * 2.5) - parseInt(self.myHero.fy*2.5))*1.5 + 250
					if(val < 50){
						val = self.randomNum(100,200)
					}
					self.consistEnemyBeat(val,800,1700)
					setTimeout(()=>{
						let val = self.harmComputer(3) + self.enemy.gj*1.2 + 370
						self.enemyBeat2(val)
					},2300)
					}
				}
			}
			if(this.enemy.name.indexOf('迅捷斥候') != -1){
				if(num == 1 || num == 3){
						this.heroAnm('../../static/imgs/hero/timo1.gif?'+ new Date().getTime(),1)
						this.backBgImg('timo1',2000,1)
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
							this.fasheArrow(220,1,30,"迅捷斥候",1,2)
						},1200)
				}
				if(num == 2){
					if(parseFloat(this.enemy.gs)>0.7){
						this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) - 0.15).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.15).toFixed(2)
						},2000)
					}
				}
				if(num == 4){
					// 添加蘑菇到地图上
					 this.enmapObjects.push({
						left: this.enemyX,
						top: this.enemyY,
						img: 'mogu.png'
					 });
				}
			}
			if(this.enemy.name.indexOf('云影之剑') != -1){
				if(num == 1){
					this.playVoice('../../static/sounds/shuixingjian.wav',false,num+3,3000)
					this.heroAnm('../../static/imgs/hero/yyzj.gif?'+ new Date().getTime(),1)
					this.backBgImg('yyzj',1800,1)

					let val = this.harmComputer(3) + 350
					this.enemyBeat2(val)
					this.myspeed = this.myspeed + 0.5
					setTimeout(()=>{
						this.myspeed = this.myspeed - 0.5
					},2300)
				}
				if(num == 2){
					if(parseFloat(this.enemy.gs)>0.4){
						this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) - 0.2).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.2).toFixed(2)
						},2300)
					}
					if(this.enspeed - 0.25 > 0.5){
						this.enspeed = this.enspeed - 0.25
						setTimeout(()=>{
							this.enspeed = this.enspeed + 0.25
						},2300)
					}
					//记录当前位置
					this.enmapObjects.map((i,d)=>{
						if(i.img == 'chuansongdoor.gif'){
							this.enmapObjects.splice(d,1)
						}
					})
					this.enmapObjects.push({
						left: this.enemyX,
						top: this.enemyY,
						width: 160,
						height: 160,
						img: 'chuansongdoor.gif'
					});
					setTimeout(()=>{
						this.enmapObjects.map((i,d)=>{
							if(i.img == 'chuansongdoor.gif'){
								this.enmapObjects.splice(d,1)
							}
						})
					},7000)
				}
				if(num == 3){
					if(this.distanceComp(this.enemy.dis3)){
						this.playVoice('../../static/sounds/kuaisuyidong.wav',false,num+3,3000)
						if(this.distanceComp(110)){
							this.enChongci(110,2)
							if(this.enemyX > this.characterX){
								this.enemyX = this.characterX - 50
							}else{
								this.enemyX = this.characterX + 50
							}
							if(this.enemyY > this.characterY){
								this.enemyY = this.characterY - 50
							}else{
								this.enemyY = this.characterY + 50
							}
							let val = this.harmComputer(3) + 300 + parseInt(this.enemy.gj*0.6)
							this.enemyBeat2(val)
						}else{
							this.enDuobi(60)
						}
					}
				}
				if(num == 4){
					if(this.distanceComp(this.enemy.dis4)){
						this.playVoice('../../static/sounds/mofasukan.wav',false,num+3,2000)
						if(this.distanceComp(70)){
							let val = (parseInt(this.enemy.gj * 2.8) - parseInt(this.myHero.fy*4))*2
							 + 700
							this.enemyBeat2(val)
						}
						if(this.distance > 100){
							this.enemyConsistAddBlood(this.enemy.gj+200,500,550)
						}
						this.enmapObjects.map((i,d)=>{
							if(i.img == 'chuansongdoor.gif'){
								this.enNoMove = true
								let sp = this.enspeed
								this.enspeed = 0.35
								this.enemyX = parseInt(i.left) + 15
								this.enemyY = parseInt(i.top) + 20
								setTimeout(()=>{
									this.enspeed = sp
									this.enNoMove = false
								},300)
							}
						})
					}
				}
			}
			if(this.enemy.name.indexOf('刀锋之影') != -1){
				this.playVoice('../../static/sounds/dfzy'+num+'.wav',true,num+3,3000)
				if(num == 1){
					this.enChongci(110)
					let val = this.harmComputer(3) + 150
					this.enemyBeat2(val)
					setTimeout(()=>{
						if(this.distanceComp(90) && this.yinshen2){
							let val = (parseInt(this.enemy.gj * 2.7) - parseInt(this.myHero.fy*3.5))*2 + 500
							this.enemyBeat2(val)
							this.yinshen2 = false
						}
					},300)
					//生命值小于20%
					if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.2){
						this.enemyConsistAddBlood(this.enemy.gj*1.6,500,550)
					}
				}
				if(num == 2){
					this.tallentExpert(3,2,3250)
					setTimeout(()=>{
						let val = this.harmComputer(3) + 50
						this.enemyBeat2(val)
						setTimeout(()=>{
							if(this.distanceComp(90) && this.yinshen2){
								let val = (parseInt(this.enemy.gj * 2.7) - parseInt(this.myHero.fy*3.5))*2 + 500
								this.enemyBeat2(val)
								this.yinshen2 = false
							}
						},300)
					},500)
					setTimeout(()=>{
						let val = this.harmComputer(3) + 50
						this.enemyBeat2(val)
					},1200)
				}
				if(num == 3){
					if(this.enemyGJdis < 90){
						this.enemyGJdis = this.enemyGJdis + 25
						setTimeout(()=>{
							this.enemyGJdis = this.enemyGJdis - 25
						},3500)
					}
				}
				if(num == 4){
					if(this.enspeed >= 0.5){
						this.enspeed = this.enspeed - 0.25
						setTimeout(()=>{
							this.enspeed = this.enspeed + 0.25
						},5000)
					}
					if(this.distanceComp(90)){
						let val = (parseInt(this.enemy.gj * 2.8) - parseInt(this.myHero.fy*3.5))*2 + 650
						this.enemyBeat2(val)
					}
					uni.showToast({
						title: '敌方隐身',
						icon:'none',
						duration: 600
					});
					this.yinshen2 = true
					setTimeout(()=>{
						this.yinshen2 = false
						if(this.distanceComp(90)){
							let val = (parseInt(this.enemy.gj * 2.5) - parseInt(this.myHero.fy*3.5))*2 + 500
							this.enemyBeat2(val)
						}
					},4000)
				}
			}
			if(this.enemy.name.indexOf('熔岩巨兽') != -1){
				this.playVoice('../../static/sounds/ryjs'+num+'.wav',true,num+3,3000)
				if(num == 1){
					this.fasheArrow(230,1,30,'熔岩巨兽',1,2)
				}
				if(num == 2){
					if(this.enemyGJdis < 80){
						this.heroAnm('../../static/imgs/hero/ryjs2.gif?'+ new Date().getTime(),1)
						this.backBgImg('ryjs2',2000,1)
						this.enemyGJdis = this.enemyGJdis + 25
						setTimeout(()=>{
							this.enemyGJdis = this.enemyGJdis - 25
						},4000)
					}
				}
				if(num == 3){
					this.fasheArrow(3000,1,50,'熔岩巨兽',3,11)
					setTimeout(()=>{
						this.enemy.fy = this.enemy.fy + 50
						this.enemy.mk = this.enemy.mk + 50
					},500)
					setTimeout(()=>{
						this.enemy.fy = this.enemy.fy - 50
						this.enemy.mk = this.enemy.mk - 50
					},3000)
				}
				if(num == 4){
					this.enChongci(150)
					setTimeout(()=>{
						let val = (parseInt(this.enemy.gj)*2.8 - parseInt(this.myHero.fy*3.5))*2 + this.randomNum(500,900)
						if(val < 50){
							val = this.randomNum(100,200)
						}
						this.enemyBeat2(val)
						this.tallentExpert(2,2,2800)
					},300)
				}
			}
			if(this.enemy.name.indexOf('东海龙王敖光') != -1){
				if(num == 1){
					if(this.randomNum(0,1) == 1 && this.fastsp2 == 0){	//龙形态
						this.heroAnm('../../static/imgs/hero/ag1-1.gif?'+ new Date().getTime(),1)
						this.backBgImg('ag1-1',6500,1)
						this.playVoice('../../static/sounds/ag4.wav',false,num+3,6500)
						this.fastsp2 = this.enspeed - 0.4
						setTimeout(()=>{
							this.fastsp2 = 0
						},5000)
					}else{
						this.heroAnm('../../static/imgs/hero/ag1.gif?'+ new Date().getTime(),1)
						this.backBgImg('ag1',4000,1)
						this.playVoice('../../static/sounds/ag1.wav',true,num+3,4000)
						if(this.distanceComp(150)){
							setTimeout(()=>{
								let val = this.harmComputer(3) + parseInt(this.enemy.gj*1.5) + 260 + (this.reallyRandom(0,5)*100)
								this.enemyBeat2(val)
							},2500)
						}else{
							setTimeout(()=>{
								this.fasheArrow(550,1,30,"敌方射击",1,2)
							},2000)
						}
					}
				}
				if(num == 2){
					if(this.randomNum(0,1) == 1){	//龙形态
						this.fasheArrow(420,1,30,"敌方射击-高伤害",2,4)
					}else{
						this.heroAnm('../../static/imgs/hero/ag2.gif?'+ new Date().getTime(),1)
						this.backBgImg('ag2',5500,1)
						this.playVoice('../../static/sounds/ag'+num+'.wav',false,num+3,5500)
						setTimeout(()=>{
							this.enemy.gj = this.enemy.gj + 50
							uni.showToast({
								title: '你被禁止释放技能',
								icon:'none',
								duration: 1200
							});
							this.delayTel(2000,0)
							setTimeout(()=>{
								this.enemy.gj = this.enemy.gj - 50
							},2000)
						},1000)
					}
				}
				if(num == 3){
					this.fasheArrow(3000,1,35,"无",3,14)
					if(Math.abs(this.enemyX - this.characterX) <= 625 && Math.abs(this.enemyY - this.characterY)<=35){
						let val = parseInt(this.enemy.gj*1.8) - parseInt(this.myHero.fy*1.5) + 50
						if(val<=0){
							val = 50
						}
						this.consistEnemyBeat(val,500,3000)
					}
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/ag4.gif?'+ new Date().getTime(),1)
					this.backBgImg('ag4',5500,1)
					this.playVoice('../../static/sounds/ag'+num+'.wav',false,num+3,4000)
					setTimeout(()=>{
						if(this.enspeed>=0.6){
							this.enspeed = this.enspeed - 0.2
							setTimeout(()=>{
								this.enspeed = this.enspeed + 0.2
							},3000)
						}
						this.enemyConsistAddBlood(150,500,1500)
					},2000)
				}
			}
			if(this.enemy.name.indexOf('神明') != -1){
				if(num == 1){
					this.enmapObjects.push({
						left: this.characterX >=this.enemyX? (this.characterX - this.randomNum(10,100)):(this.characterX + this.randomNum(10,100)),
						top: this.randomNum(0,1) == 0?(this.characterY - this.randomNum(10,60)):(this.characterY + this.randomNum(10,60)),
						width: 190,
						height: 190,
						img: 'mofacircle.gif'
					});
					setTimeout(()=>{
					  this.enmapObjects.map((i,d)=>{
						  if(i.img == 'mofacircle.gif'){
							  this.enmapObjects.splice(d,1)
						  }
					  })
					},3500)
				}
				if(num == 2){
					this.heroAnm('../../static/imgs/hero/sm2.gif?'+ new Date().getTime(),1)
					this.backBgImg('sm2',3300,1)
					let time = setInterval(()=>{
						if(this.distanceComp(this.enemyGJdis)){
							let val = parseInt(parseInt(this.enemy.gj)*1.3) - parseInt(this.myHero.fy*2) + this.randomNum(70,90)
							if(val <= 30){
								val = this.randomNum(30,40)
							}
							this.enemyBeat2(val,1)
						}
					},300)
					setTimeout(()=>{
						clearInterval(time)
					},3300)
					this.playVoice('../../static/sounds/sm'+num+'.wav',true,num+3,5300)
				}
				if(num == 3){
					this.fasheArrow(3500,1,50,'神明',3,11)
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy + 50
					},500)
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy - 50
					},3500)
				}
				if(num == 4){
					setTimeout(()=>{
						this.fasheArrow(320,1,44,'神明',4,6)
					},300)
					this.playVoice('../../static/sounds/sm'+num+'.wav',false,num+3,2300)
				}
			}
		},
		regGjHandle() {
			if(this.dianren) {
				setTimeout(()=>{
					this.dianren = true
				},9500)
				this.dianren = false
			}
			if(this.myHero.name == '迅捷斥候' && this.xuli == 1) {
				let t = setInterval(()=>{
					let val2 = parseInt(this.myHero.fs * 1.6) - parseInt(this.enemy.mk*2) + 100
					if(val2 < 50){
						val2 = this.randomNum(30,90)
					}
					this.beat(val2,1)
				},900)
				setTimeout(()=>{
					clearInterval(t)
				},2750)
				this.xuli == 0
			}
			if(this.myHero.id == 15 && parseInt(this.addData.strongIndex) == 1) {
				this.tallentExpert(3,1,1000,0.7)
			}
			if(this.myEquipName.includes('冰脉护手')){
				this.tallentExpert(3,1,1000,0.6)
			}
		},
		
		//计算距离
		computeDistance() {
			let x = Math.abs(this.characterX - this.enemyX)
			let y = Math.abs(this.characterY - this.enemyY)
			this.distance = Math.sqrt(x*x+y*y)
		},
		go(type) {
			if(!this.begin) {
				uni.showToast({
					title: '请点击开始战斗',
					icon:'none',
					duration: 1000
				});
				return
			}
			if(this.myNoMove){
				uni.showToast({
					title: '你被禁止移动',
					icon:'none',
					duration: 800
				});
				return
			}
			//如果你的血量低于60%
			if(!this.enmoveModelTime && this.bloodVal2 <= 60){
				if(this.enmoveModelTime == null){
					this.enmoveModelTime = setTimeout(()=>{
						//敌方不是逃跑
						if(this.enmoveModel != 3){
							if(this.bloodVal1 <= 35){	//如果敌方血量很少，则逃跑或追击
								//敌方随机变化
								this.enemyMoveContrl(this.reallyRandom(2,3))
							}else{	//敌方血量不少，追击
								this.enemyMoveContrl(2)
							}
							
						}else{	//敌方逃跑
							if(this.distance > 380){
								this.enemyMoveContrl(this.reallyRandom(1,2))
							}
						}
						clearTimeout(this.enmoveModelTime)
						this.enmoveModelTime = null
					},7000)
				}
			}
			this.heroMoveType = type
			clearInterval(this.goTime)
			if(type == 1 && this.directType != true){	//向左
				this.characterX = this.characterX - 30
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
				},this.myspeed * 1000-300)
			}
			if(type == 2 && this.directType2 != true){	//向右
				if(this.characterX < this.screenWidth * 1.35){
					this.characterX = this.characterX + 30
				}
				if(this.characterX > this.screenWidth * 0.85){
					this.$nextTick(function() {
						this.scrollLeft = this.screenWidth
					});
				}
				this.directType2 = true
				setTimeout(()=>{
					this.directType2 = false
				},this.myspeed * 1000-300)
			}
			if(type == 3 && this.directType3 != true){	//向上
				if(this.characterY < parseInt(this.screenHeight*0.45)){
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
				}
				if(this.characterY >= 70){
					this.characterY = this.characterY - 30
				}
				this.directType3 = true
				setTimeout(()=>{
					this.directType3 = false
				},this.myspeed * 1000-300)
			}
			if(type == 4 && this.directType4 != true){	//向下
				if(this.characterY > parseInt(this.screenHeight*0.75)){
					this.$nextTick(function() {
						this.scrollTop = this.screenHeight
					});
				}
				if(this.characterY < parseInt(this.screenHeight * 1.1)){
					this.characterY = this.characterY + 30
				}
				this.directType4 = true
				setTimeout(()=>{
					this.directType4 = false
				},this.myspeed * 1000-300)
			}
			if(type == 5){
				this.goTime = setInterval(()=>{
					this.characterX = this.characterX - 30
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
				}, this.myspeed * 1000)
				this.directType = true
			}
			if(type == 6){
				this.goTime = setInterval(()=>{
					if(this.characterX < this.screenWidth * 1.35){
						this.characterX = this.characterX + 30
					}
					if(this.characterX > this.screenWidth * 0.85){
						this.$nextTick(function() {
							this.scrollLeft = this.screenWidth
						});
					}
					this.directType2 = false
				}, this.myspeed * 1000)
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
						this.characterY = this.characterY - 30
					}
					this.directType3 = false
				}, this.myspeed * 1000)
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
						this.characterY = this.characterY + 30
					}
					this.directType4 = false
				}, this.myspeed * 1000)
				this.directType4 = true
			}
			
			this.myMoveEffect()
		},
		//敌方移动控制
		enemyMoveContrl(type) {
			clearInterval(this.goTime2)
			this.enmoveModel = type
			if(type == 1){	//自由模式
				this.goTime2 = setInterval(()=>{
					this.enemyMove(this.randomNum(1,4))
				},500)
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
			if(this.enNoMove || !this.begin || this.bettleEnd){
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
				},this.enspeed * 1000)
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
				},this.enspeed * 1000)
			}
			if(type == 3 && this.directType7 != true){	//向上
				if(this.enemyY > 80){
					this.enemyY = this.enemyY - 30
				}
				this.directType7 = true
				setTimeout(()=>{
					this.directType7 = false
				},this.enspeed * 1000)
			}
			if(type == 4 && this.directType8 != true){	//向下
				if(this.enemyY < parseInt(this.screenHeight)){
					this.enemyY = this.enemyY + 30
				}
				this.directType8 = true
				setTimeout(()=>{
					this.directType8 = false
				},this.enspeed * 1000)
			}
			this.enMoveEffect()
		},
		//敌方移动事件
		enMoveEffect() {
			//敌方踩到地图物体
			if(this.mapObjects.length != 0){
				this.mapObjects.map((it,idx)=>{
					let x = Math.abs(it.left - this.enemyX)
					let y = Math.abs(it.top - this.enemyY)
					let dis = Math.sqrt(x*x+y*y)
					if(dis <= 38){	//踩到
						this.mapObjsEvent(idx,1)
					}
				})
			}
			this.computeDistance()
			if(this.bgImg.indexOf('battlebg3') != -1){
				//河流
				if(this.enemyX<this.screenWidth*0.45+130 && this.enemyX>=this.screenWidth*0.45+30
				&& this.enemyY < parseInt(this.screenHeight) - 8){
					clearInterval(this.riverTime2)
					this.riverTime2 = setInterval(()=>{
						this.enemyY = this.enemyY+22
						if(this.enemyY >= parseInt(this.screenHeight)){
							clearInterval(this.riverTime2)
						}
					},300)
				}
			}
			
			if(this.mapObjects.length != 0 && (this.myHero.name == '神明' || this.myHero.id == 17)){
				this.mapObjects.map((it,idx)=>{
					if(this.mapObjects[idx].img == 'mofacircle.gif'){
						let x = Math.abs(it.left+5 - this.enemyX)
						let y = Math.abs(it.top+5 - this.enemyY)
						let dis = Math.sqrt(x*x+y*y)
						let addTalent = parseInt(this.addData.add8)
						if(dis <= 40){	//踩到
							let val = parseInt(this.myHero.fs * (0.7 + addTalent*0.07)) - parseInt(this.enemy.mk*1.7) + this.randomNum(addTalent*15,50 + addTalent*10)
							if(val <= 30){
								val = this.randomNum(30,50)
							}
							if(parseInt(this.addData.strongIndex) == 1){
								val = val + 50
							}
							this.tallentExpert(3,1,1000)
							this.beat(val,1)
						}
					}
				})
			}
		},
		//英雄冲刺
		heroChongci(dis,type,speed) {
			if(this.myNoMove){
				return
			}
			//向前冲刺一小段距离
			if(type == 1){
				this.heroAddSpeed(0.7,300)
				if(this.characterX > this.enemyX){
					this.characterX = this.characterX - dis
				}
				if(this.characterX <= this.enemyX){
					this.characterX = this.characterX + dis
				}
			}else{
				if(this.distance <= dis+8){
					this.fastsp = this.myspeed - 0.1
					if(speed){
						this.fastsp = this.myspeed - speed
					}
					if(this.fastsp < 0){
						this.fastsp = 0
					}
					if(this.characterX > this.enemyX){
						this.characterX = this.enemyX + 5
					}
					if(this.characterY > this.enemyY){
						this.characterY = this.enemyY + 5
					}
					if(this.characterX <= this.enemyX){
						this.characterX = this.enemyX - 5
					}
					if(this.characterY <= this.enemyY){
						this.characterY = this.enemyY - 5
					}
					setTimeout(()=>{
						this.fastsp = 0
					},500)
					if(this.myEquipName.includes('电震涡流剑') && (this.myHero.details == '刺客' || this.myHero.id == 102)) {
						let val = parseInt(this.myHero.gj) + 100
						this.beat(val,1)
						this.myHero.gj = this.myHero.gj + 5
					}
				}
			}
		},
		//敌方冲刺
		enChongci(dis,type) {
			if(this.enNoMove){
				return
			}
			//向前冲刺一小段距离
			if(type == 1){
				this.fastsp2 = this.enspeed - 0.2
				if(this.enemyX > this.characterX){
					this.enemyX = this.enemyX - dis
				}
				if(this.enemyX <= this.characterX){
					this.enemyX = this.enemyX + dis
				}
				setTimeout(()=>{
					this.fastsp2 = 0
				},300)
			}else{
				if(this.distance <= dis+8){
					this.playVoice('../../static/sounds/enchongji.wav',false,7,2000)
					this.fastsp2 = this.enspeed - 0.2
					if(this.enemyX > this.characterX){
						this.enemyX = this.characterX + 5
					}
					if(this.enemyY > this.characterY){
						this.enemyY = this.characterY + 5
					}
					if(this.enemyX <= this.characterX){
						this.enemyX = this.characterX - 5
					}
					if(this.enemyY <= this.characterY){
						this.enemyY = this.characterY - 5
					}
					setTimeout(()=>{
						this.fastsp2 = 0
					},500)
				}
			}
		},
		//我方闪现
		shanxian(dis) {
			if(this.enNoMove){
				return
			}
			if(this.myspeed - 0.9 >= 0.2){
				this.myspeed = this.myspeed - 0.9
			}else{
				this.myspeed = this.myspeed - 0.6
			}
			if(this.heroMoveType == 1){
				this.characterX = this.characterX - dis
			}
			if(this.heroMoveType == 2){
				this.characterX = this.characterX + dis
			}
			if(this.heroMoveType == 3){
				this.characterY = this.characterY - dis
			}
			if(this.heroMoveType == 4){
				this.characterY = this.characterY + dis
			}
			setTimeout(()=>{
				if(this.myspeed >= 0.2){
					this.myspeed = this.myspeed + 0.9
				}else{
					this.myspeed = this.myspeed + 0.6
				}
			},300)
		},
		//敌方躲避
		enDuobi(dis) {
			if(this.enNoMove){
				return
			}
			if(this.enspeed - 0.6 >= 0.2){
				this.enspeed = this.enspeed - 0.6
			}else{
				this.enspeed = this.enspeed - 0.3
			}
			if(this.enemyX > this.characterX){
				this.enemyX = this.enemyX + dis
			}
			if(this.enemyY > this.characterY){
				this.enemyY = this.enemyY + dis
			}
			if(this.enemyX <= this.characterX){
				this.enemyX = this.enemyX - dis
			}
			if(this.enemyY <= this.characterY){
				this.enemyY = this.enemyY - dis
			}
			setTimeout(()=>{
				if(this.enspeed >= 0.2){
					this.enspeed = this.enspeed + 0.6
				}else{
					this.enspeed = this.enspeed + 0.3
				}
			},200)
		},
		//跟随
		follow(type,time) {
			if(type == 1){
				let sp = this.myspeed
				this.myspeed = 0.3
				var t = setInterval(()=>{
					if(this.characterX > this.enemyX){
						this.characterX = this.enemyX + 40
					}
					if(this.characterY > this.enemyY){
						this.characterY = this.enemyY + 30
					}
					if(this.characterX <= this.enemyX){
						this.characterX = this.enemyX - 40
					}
					if(this.characterY <= this.enemyY){
						this.characterY = this.enemyY - 30
					}
				},300)
				
				setTimeout(()=>{
					this.myspeed = sp
					clearInterval(t)
				},time)
			}else{
				let sp = this.enspeed
				this.enspeed = 0.3
				var t = setInterval(()=>{
					if(this.enemyX > this.characterX){
						this.enemyX = this.characterX + 40
					}
					if(this.enemyY > this.characterY){
						this.enemyY = this.characterY + 30
					}
					if(this.enemyX <= this.characterX){
						this.enemyX = this.characterX - 40
					}
					if(this.enemyY <= this.characterY){
						this.enemyY = this.characterY - 30
					}
				},300)
				setTimeout(()=>{
					this.enspeed = sp
					clearInterval(t)
				},time)
			}
		},
		//技能效果
		tallentExpert(type,index,time,val) {
			if(index == 1){	//敌方被施加
				if(type == 1){	//禁锢
					this.enNoMove = true
					setTimeout(()=>{
						this.enNoMove = false
					},time)
				}
				if(type == 2){	//眩晕
					this.enNoMove = true
					this.shotDown = true
					this.tempEnemyIcon = this.enemy.icon
					if(this.enemy.icon != 'xuanyun.gif'){
						this.enemy.icon = 'xuanyun.gif'
					}
					setTimeout(()=>{
						this.enNoMove = false
						this.shotDown = false
						if(this.tempEnemyIcon != this.enemy.icon && this.enemy.icon == 'xuanyun.gif'){
							this.enemy.icon = this.tempEnemyIcon
						}
					},time)
				}
				if(type == 3){	//减速
					if(val){
						this.enspeed = this.enspeed + val
						setTimeout(()=>{
							this.enspeed = this.enspeed - val
						},time)
					}else{
						this.enspeed = this.enspeed + 0.6
						setTimeout(()=>{
							this.enspeed = this.enspeed - 0.6
						},time)
					}
				}
			}else{	//我方被施加
				if(type == 1){	//禁锢
					this.myNoMove = true
					setTimeout(()=>{
						this.myNoMove = false
					},time)
					uni.showToast({
						title: '你已被禁锢',
						icon:'none',
						duration: 1000
					});
				}
				if(type == 2){	//眩晕
					this.myNoMove = true
					if(this.myHero.icon != 'xuanyun.gif'){
						this.myHero.icon = 'xuanyun.gif'
					}
					this.delayTel(time,0)
					setTimeout(()=>{
						this.myNoMove = false
						this.myHero.icon = this.origHero.icon
					},time)
				}
				if(type == 3){	//减速
					if(val){
						this.myspeed = this.myspeed + val - this.antijiansu
						setTimeout(()=>{
							this.myspeed = this.myspeed - val + this.antijiansu
						},time)
					}else{
						this.myspeed = this.myspeed + 0.6 - this.antijiansu
						setTimeout(()=>{
							this.myspeed = this.myspeed - 0.6 + this.antijiansu
						},time)
					}
				}
			}
		},
		heroAddSpeed(val,time) {
			if(this.fastsp + val <= 0.8 && (this.myspeed - this.fastsp)>=0.2){
				this.fastsp = this.fastsp + val
				this.showTX(2,2)
			}else{
				this.fastsp = this.myspeed - 0.3
			}
			setTimeout(()=>{
				this.fastsp = 0
				this.showTX(2,2,true)
			},time)
		},
		//地图上的物体被踩到
		mapObjsEvent(idx,type) {
			if(type == 1){	//敌方踩到
				if((this.myHero.name == '迅捷斥候' || this.myHero.id == 12) && this.mapObjects[idx].img == 'mogu.png'){
					let addTalent4 = parseInt(this.addData.add11)
					let val = parseInt(this.myHero.fs * (1.2 + addTalent4*0.2)) - parseInt(this.enemy.mk*2.5) + 100 + addTalent4*30
					this.tallentExpert(3,1,2500)
					this.mapObjects.splice(idx,1)
					let t = setInterval(()=>{
						if(val < 50){
							val = this.randomNum(100,180)
						}
						this.beat(val,1)
					},500)
					setTimeout(()=>{
						clearInterval(t)
					},2050)
					return
				}
				//踩到血包
				if(this.mapObjects[idx].img == 'addBlood.png'){
					if(this.blood1 + 500 <= this.enemy.blood){
						this.blood1 = parseInt(this.blood1) + 500
						this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					}
					this.mapObjects.splice(idx,1)
				}
			}else{	//我方踩到
				if(this.enemy.name == '迅捷斥候' && this.enmapObjects[idx] && this.enmapObjects[idx].img == 'mogu.png'){
					let val = parseInt(this.enemy.gj * 2) - parseInt(this.myHero.fy*1.8) + 300
					let self = this
					this.tallentExpert(3,2,2500)
					this.enmapObjects.splice(idx,1)
					setTimeout(()=>{
						let t = setInterval(()=>{
							if(val < 50){
								val = self.randomNum(120,200)
							}
							self.enemyBeat2(val)
						},500)
						setTimeout(()=>{
							clearInterval(t)
						},1550)
					},3500)
					return
				}
				//踩到血包
				if(this.mapObjects[idx].img == 'addBlood.png'){
					this.addBlood(500,0,0)
					this.mapObjects.splice(idx,1)
					return
				}
				//踩到宝箱
				if(this.mapObjects[idx].img == 'plusBox.png' || this.mapObjects[idx].img == 'eqBox.png'
				 || this.mapObjects[idx].img == 'regBox.png'){
					if(this.mapObjects[idx].img == 'regBox.png'){
						if(this.reallyRandom(0,5) == 0){
							uni.showToast({
								title: '获得100金币',
								icon:'none',
								duration: 1000
							});
							this.money = editMoney(100)
						}
						if(this.reallyRandom(0,5) == 1){
							uni.showToast({
								title: '获得法术提升药水',
								icon:'none',
								duration: 1500
							});
							this.myTool.push({"name":"法术提升药水","gj":0,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/2139.png","detail":"饮用后法术强度提升30（持续6秒）","bj":0,"price":50,"istool":1})
						}
						if(this.reallyRandom(0,5) == 2){
							uni.showToast({
								title: '获得【权力法杖】：法力值+500',
								icon:'none',
								duration: 1500
							});
							this.flz = parseInt(this.flz) + 500
							if(this.flz > parseInt(this.myHero.flz)){
								this.myHero.flz = this.flz
							}
							this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
						}
						if(this.reallyRandom(0,5) == 3){
							uni.showToast({
								title: '获得【铁甲】：生命值上限+1000',
								icon:'none',
								duration: 1500
							});
							this.myHero.blood = parseInt(this.myHero.blood) + 1000
						}
						if(this.reallyRandom(0,5) == 4){
							uni.showToast({
								title: '获得攻击提升药水',
								icon:'none',
								duration: 1500
							});
							this.myTool.push({"name":"攻击提升药水","gj":0,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/2140.png","detail":"饮用后攻击力提升25（持续6秒）","bj":0,"price":50,"istool":1})
						}
						if(this.reallyRandom(0,5) == 5){
							uni.showToast({
								title: '获得夹心饼干',
								icon:'none',
								duration: 1500
							});
							this.myTool.push({"name":"夹心饼干","gj":0,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/2010.png","detail":"使用后生命值恢复300，法力值恢复400","bj":0,"price":100,"istool":1})
						}
					}
					if(this.mapObjects[idx].img == 'plusBox.png'){
						if(this.reallyRandom(0,5) == 0){
							uni.showToast({
								title: '获得200金币',
								icon:'none',
								duration: 1000
							});
							this.money = editMoney(200)
						}
						if(this.reallyRandom(0,5) == 1){
							uni.showToast({
								title: '获得【疾跑】：移动速度增加30%',
								icon:'none',
								duration: 1500
							});
							if(this.myspeed - 0.3 > 0){
								this.myspeed = this.myspeed - 0.3
								setTimeout(()=>{
									this.myspeed = this.myspeed + 0.3
								},5000)
							}
						}
						if(this.reallyRandom(0,5) == 2){
							uni.showToast({
								title: '获得【射手属性】：攻击范围+50码(10秒)',
								icon:'none',
								duration: 1800
							});
							this.myHero.distance = this.myHero.distance + 50
							this.myHero.dis1 = this.myHero.dis1 + 50
							this.myHero.dis2 = this.myHero.dis2 + 50
							this.myHero.dis3 = this.myHero.dis3 + 50
							this.myHero.dis4 = this.myHero.dis4 + 50
							setTimeout(()=>{
								this.myHero.distance = this.myHero.distance - 50
								this.myHero.dis1 = this.myHero.dis1 - 50
								this.myHero.dis2 = this.myHero.dis2 - 50
								this.myHero.dis3 = this.myHero.dis3 - 50
								this.myHero.dis4 = this.myHero.dis4 - 50
							},10000)
						}
						if(this.reallyRandom(0,5) == 3){
							uni.showToast({
								title: '获得【生命之心】：生命值上限+2000',
								icon:'none',
								duration: 1500
							});
							this.myHero.blood = parseInt(this.myHero.blood) + 2000
						}
						if(this.reallyRandom(0,5) == 4){
							uni.showToast({
								title: '获得【蓝盾】：防御力增加50',
								icon:'none',
								duration: 1500
							});
							this.myHero.fy = this.myHero.fy + 50
						}
						if(this.reallyRandom(0,5) == 5){
							uni.showToast({
								title: '获得【魔法披风】：防御力增加30，法术强度+30',
								icon:'none',
								duration: 1500
							});
							this.myHero.fy = this.myHero.fy + 30
							this.myHero.fs = this.myHero.fs + 30
						}
					}
					if(this.mapObjects[idx].img == 'eqBox.png'){
						if(this.reallyRandom(0,5) == 0){
							uni.showToast({
								title: '获得【医疗包】',
								icon:'none',
								duration: 1500
							});
							this.myTool.push({"name":"医疗包","gj":0,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"../../static/imgs/ylb.png","detail":"使用后生命值恢复2000","bj":0,"price":280,"istool":1})
						}
						if(this.reallyRandom(0,5) == 1){
							uni.showToast({
								title: '获得【明朗之靴】',
								icon:'none',
								duration: 1500
							});
							this.myEquipName.push('明朗之靴')
							if(this.myspeed - 0.25 >= 0.3){
								this.myspeed = this.myspeed - 0.25
							}
						}
						if(this.reallyRandom(0,5) == 2){
							uni.showToast({
								title: '获得【狂徒铠甲】',
								icon:'none',
								duration: 1500
							});
							this.myEquipName.push('狂徒铠甲')
							this.myHero.blood = parseInt(this.myHero.blood) + 1350
							this.addBlood(1350,0,0)
						}
						if(this.reallyRandom(0,5) == 3){
							uni.showToast({
								title: '获得【斯塔缇克电刃】',
								icon:'none',
								duration: 1500
							});
							this.myEquipName.push('斯塔缇克电刃')
							this.myHero.gj = this.myHero.gj + 25
							if(parseFloat(this.myHero.v) - 0.3 >= 0.3){
								this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.3).toFixed(2)
							}
						}
						if(this.reallyRandom(0,5) == 4){
							uni.showToast({
								title: '获得【冰晶节杖】',
								icon:'none',
								duration: 1500
							});
							this.myEquipName.push('冰晶节杖')
							this.myHero.blood = parseInt(this.myHero.blood) + 600
							this.addBlood(600,0,0)
							this.myHero.fs = this.myHero.fs + 40
							this.flz = parseInt(this.flz) + 500
							if(this.flz > parseInt(this.myHero.flz)){
								this.myHero.flz = this.flz
							}
							this.blueVal = Math.round(parseInt(this.flz) / parseInt(this.myHero.flz) * 100)
						}
						if(this.reallyRandom(0,5) == 5){
							uni.showToast({
								title: '获得【纳什之牙】',
								icon:'none',
								duration: 1500
							});
							this.myEquipName.push('纳什之牙')
							this.myHero.fs = this.myHero.fs + 50
							if(parseFloat(this.myHero.v) - 0.25 >= 0.3){
								this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.25).toFixed(2)
							}
						}
					}
					this.mapObjects.splice(idx,1)
				}
			}
			
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
		fasheArrow(distance,index,range,heroId,num,type) {
			if(index == 1){		//敌方发射
				let arrowType =  'leftSJ.png'
				let arrowType2 =  'rightSJ.png'
				if(type == 1){	//普通小箭
					arrowType =  'leftSJ.png'
					arrowType2 =  'rightSJ.png'
					this.arrowWid2 = 100
					this.arrowHei2 = 35
				}
				if(type == 2){	//普通魔法小箭
					arrowType =  'leftSJblue.png'
					arrowType2 =  'rightSJblue.png'
					this.arrowWid2 = 100
					this.arrowHei2 = 35
				}
				if(type == 3){	//加农火炮
					arrowType =  'leftSJ2.png'
					arrowType2 =  'rightSJ2.png'
					this.arrowWid2 = 110
					this.arrowHei2 = 42
				}
				if(type == 4){	//魔法球
					arrowType =  'leftSJ3blue.png'
					arrowType2 =  'rightSJ3blue.png'
					this.arrowWid2 = 68
					this.arrowHei2 = 50
				}
				if(type == 5){	//火球
					arrowType =  'leftSJ4.png'
					arrowType2 =  'rightSJ4.png'
					this.arrowWid2 = 115
					this.arrowHei2 = 35
				}
				if(type == 6){	//魔法加农火炮
					arrowType =  'leftSJ2blue.png'
					arrowType2 =  'rightSJ2blue.png'
					this.arrowWid2 = 110
					this.arrowHei2 = 42
				}
				if(type == 7){	//龙卷风
					arrowType =  'ljf.gif'
					arrowType2 =  'ljf.gif'
					this.arrowWid2 = 110
					this.arrowHei2 = 130
				}
				if(type == 8){	//雪花箭
					arrowType =  'leftbinghuaTX.gif'
					arrowType2 =  'rightbinghuaTX.gif'
					this.arrowWid2 = 130
					this.arrowHei2 = 52
				}
				if(type == 9){	//魔法长箭
					arrowType =  'lefthanbingArrowTX.gif'
					arrowType2 =  'righthanbingArrowTX.gif'
					this.arrowWid2 = 135
					this.arrowHei2 = 30
				}
				if(type == 10){	//激光波
					arrowType =  'leftjiguangTX.gif'
					arrowType2 =  'rightjiguangTX.gif'
					this.arrowWid2 = 450
					this.arrowHei2 = 67
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 11){	//盾
					arrowType =  'leftdunpaiTX.gif'
					arrowType2 =  'rightdunpaiTX.gif'
					this.arrowWid2 = 80
					this.arrowHei2 = 160
				}
				if(type == 12){	//子弹
					arrowType =  'leftzidan.png'
					arrowType2 =  'rightzidan.png'
					this.arrowWid2 = 40
					this.arrowHei2 = 17
				}
				if(type == 13){	//正方形火焰
					arrowType =  'leftSJ3.png'
					arrowType2 =  'rightSJ3.png'
					this.arrowWid2 = 49
					this.arrowHei2 = 45
				}
				if(type == 14){	//水激光
					arrowType =  'leftShuiJG.gif'
					arrowType2 =  'rightShuiJG.gif'
					this.arrowWid2 = 450
					this.arrowHei2 = 67
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 15){	//火激光
					arrowType =  'leftHuoJG.png'
					arrowType2 =  'rightHuoJG.png'
					this.arrowWid2 = 450
					this.arrowHei2 = 67
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 10 || type == 11 || type == 14 || type == 15){	//固定的特效
					this.ArrowTX2 = arrowType
					this.arrowY2 = this.enemyY - 15
					if(this.enemyX > this.characterX){	//如果敌方在左边
						this.arrowX2 = this.enemyX - 25
					}else{
						this.arrowX2 = this.enemyX + 25
						this.ArrowTX2 = arrowType2
					}
					setTimeout(()=>{
						this.ArrowTX2 = ''
					},distance)
					return
				}
					this.ArrowTX2 = ''
					clearInterval(this.arrowTimer2)
					this.arrowY2 = this.enemyY
					if(this.enemyX > this.characterX){	//如果敌方在左边
						this.arrowX2 = this.enemyX - 20
						this.ArrowTX2 = arrowType
						this.arrowTimer2 = setInterval(()=>{
							this.arrowX2 = this.arrowX2 - 4
							//射中
							if(Math.abs(this.arrowY2 - this.characterY) <= range && Math.abs(this.arrowX2 - this.characterX) <= 20 && this.arrowTimer2){
								this.shejiBeat(index,heroId,num)
								this.ArrowTX2 = ''
								clearInterval(this.arrowTimer2)
								clearInterval(this.arrowtimeout2)
								this.arrowTimer2 = null
							}
							//过界回收
							if(this.arrowX2 <= -80){
								this.ArrowTX2 = ''
								clearInterval(this.arrowTimer2)
							}
						},15)
					}else{
						this.arrowX2 = this.enemyX + 20
						this.arrowTimer2 = setInterval(()=>{
							this.arrowX2 = this.arrowX2 + 4
							//射中
							if(Math.abs(this.arrowY2 - this.characterY) <= range && Math.abs(this.arrowX2 - this.characterX) <= 20 && this.arrowTimer2){
								this.shejiBeat(index,heroId,num)
								this.ArrowTX2 = ''
								clearInterval(this.arrowTimer2)
								clearInterval(this.arrowtimeout2)
								this.arrowTimer2 = null
							}
							//过界回收
							if(this.arrowX2 >= 2500){
								this.ArrowTX2 = ''
								clearInterval(this.arrowTimer2)
							}
						},15)
						this.ArrowTX2 = arrowType2
					}
					//没命中，自动结束
					this.arrowtimeout2 = setTimeout(()=>{
						this.ArrowTX2 = ''
						clearInterval(this.arrowTimer2)
					},parseInt((distance/4)*15))
					
			}else{	//我方发射
				let arrowType =  'leftSJ.png'
				let arrowType2 =  'rightSJ.png'
				if(type == 1){	//普通小箭
					arrowType =  'leftSJ.png'
					arrowType2 =  'rightSJ.png'
					this.arrowWid = 100
					this.arrowHei = 35
				}
				if(type == 2){	//普通魔法小箭
					arrowType =  'leftSJblue.png'
					arrowType2 =  'rightSJblue.png'
					this.arrowWid = 100
					this.arrowHei = 35
				}
				if(type == 3){	//加农火炮
					arrowType =  'leftSJ2.png'
					arrowType2 =  'rightSJ2.png'
					this.arrowWid = 110
					this.arrowHei = 42
				}
				if(type == 4){	//魔法球
					arrowType =  'leftSJ3blue.png'
					arrowType2 =  'rightSJ3blue.png'
					this.arrowWid = 68
					this.arrowHei = 50
				}
				if(type == 5){	//火球
					arrowType =  'leftSJ4.png'
					arrowType2 =  'rightSJ4.png'
					this.arrowWid = 115
					this.arrowHei = 35
				}
				if(type == 6){	//魔法加农火炮
					arrowType =  'leftSJ2blue.png'
					arrowType2 =  'rightSJ2blue.png'
					this.arrowWid = 110
					this.arrowHei = 42
				}
				if(type == 7){	//龙卷风
					arrowType =  'ljf.gif'
					arrowType2 =  'ljf.gif'
					this.arrowWid = 110
					this.arrowHei = 130
				}
				if(type == 8){	//雪花箭
					arrowType =  'leftbinghuaTX.gif'
					arrowType2 =  'rightbinghuaTX.gif'
					this.arrowWid = 130
					this.arrowHei = 52
				}
				if(type == 9){	//魔法长箭
					arrowType =  'lefthanbingArrowTX.gif'
					arrowType2 =  'righthanbingArrowTX.gif'
					this.arrowWid = 135
					this.arrowHei = 30
				}
				if(type == 10){	//激光波
					arrowType =  'leftjiguangTX.gif'
					arrowType2 =  'rightjiguangTX.gif'
					this.arrowWid = 600
					this.arrowHei = 90
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 11){	//盾
					arrowType =  'leftdunpaiTX.gif'
					arrowType2 =  'rightdunpaiTX.gif'
					this.arrowWid = 80
					this.arrowHei = 160
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 12){	//子弹
					arrowType =  'leftzidan.png'
					arrowType2 =  'rightzidan.png'
					this.arrowWid = 40
					this.arrowHei = 17
				}
				if(type == 13){	//正方形火焰
					arrowType =  'leftSJ3.png'
					arrowType2 =  'rightSJ3.png'
					this.arrowWid = 49
					this.arrowHei = 45
				}
				if(type == 14){	//水激光
					arrowType =  'leftShuiJG.gif'
					arrowType2 =  'rightShuiJG.gif'
					this.arrowWid = 600
					this.arrowHei = 90
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 15){	//火激光
					arrowType =  'leftHuoJG.png'
					arrowType2 =  'rightHuoJG.png'
					this.arrowWid = 600
					this.arrowHei = 90
					this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
				}
				if(type == 10 || type == 11 || type == 14 || type == 15){	//固定的特效
					this.arrowY = this.characterY - 25
					if(type == 11){
						if(this.characterX > this.enemyX){	//如果敌方在左边
							this.arrowX = this.characterX - 25
							this.ArrowTX = arrowType
						}else{
							this.arrowX = this.characterX + 25
							this.ArrowTX = arrowType2
						}
					}else{
						if(this.characterX > this.enemyX){	//如果敌方在左边
							this.arrowX = this.characterX - 610
							this.ArrowTX = arrowType2
						}else{
							this.arrowX = this.characterX + 25
							this.ArrowTX = arrowType
						}
					}
					setTimeout(()=>{
						this.ArrowTX = ''
					},distance)
					return
				}
					this.ArrowTX = ''
					clearInterval(this.arrowTimer)
					//有一定概率敌方躲避射击
					if(this.reallyRandom(0,1) == 1 && !this.enNoMove){
						let sp = this.enspeed
						this.enspeed = 0.3
						this.enNoMove = true
						if(this.randomNum(0,1) == 1){
							this.enemyY = this.enemyY - 40
						}else{
							this.enemyY = this.enemyY + 40
						}
						setTimeout(()=>{
							this.enspeed = sp
							this.enNoMove = false
						},350)
					}
					this.arrowY = this.characterY
					if(this.characterX > this.enemyX){	//如果敌方在左边
						this.arrowX = this.characterX - 20
						this.ArrowTX = arrowType
						this.arrowTimer = setInterval(()=>{
							this.arrowX = this.arrowX - 4
							//射中
							if(Math.abs(this.arrowY - this.enemyY) <= range && Math.abs(this.arrowX - this.enemyX) <= 20 && this.arrowTimer){
								this.shejiBeat(index,heroId,num)
								this.ArrowTX = ''
								clearInterval(this.arrowtimeout)
								clearInterval(this.arrowTimer)
								this.arrowTimer = null
							}
							// //过界回收
							if(this.arrowX <= -80){
								this.ArrowTX = ''
								clearInterval(this.arrowTimer)
							}
						},15)
					}else{
						this.arrowX = this.characterX + 20
						this.arrowTimer = setInterval(()=>{
							this.arrowX = this.arrowX + 4
							//射中
							if(Math.abs(this.arrowY - this.enemyY) <= range && Math.abs(this.arrowX - this.enemyX) <= 20 && this.arrowTimer){
								this.shejiBeat(index,heroId,num)
								this.ArrowTX = ''
								clearInterval(this.arrowtimeout)
								clearInterval(this.arrowTimer)
								this.arrowTimer = null
							}
							// //过界回收
							if(this.arrowX >= 2500){
								this.ArrowTX = ''
								clearInterval(this.arrowTimer)
							}
						},15)
						this.ArrowTX = arrowType2
					}
					//没命中，自动结束
					this.arrowtimeout = setTimeout(()=>{
						this.ArrowTX = ''
						clearInterval(this.arrowTimer)
					},parseInt((distance/4)*15))
			}
		},
		shejiBeat(index,heroId,num) {
			let addTalent = parseInt(this.addData.add8)
			let addTalent2 = parseInt(this.addData.add9)
			let addTalent3 = parseInt(this.addData.add10)
			let addTalent4 = parseInt(this.addData.add11)
			let strongIndex = 0
			if(this.addData.strongIndex){
				strongIndex = parseInt(this.addData.strongIndex)
			}
			if(index == 1){
				//神明
				if(this.myHero.id == 17 && this.ygbj){
					this.fasheArrow(260,2,33,this.myHero.id,3,4)
					return
				}
				if(heroId == 'GG Bond'){
					if(parseInt(this.myHero.fy) > 10){
						this.myHero.fy = parseInt(this.myHero.fy) - 8
					}
					let val = (parseInt(this.enemy.gj * 2.9) - parseInt(this.myHero.fy*2.5))*2 + 500
					this.enemyBeat2(val)
					this.tallentExpert(3,2,3000)
				}
				if(heroId == '鲲'){
					if(num == 2){
						this.tallentExpert(3,2,3000)
						let val = parseInt(this.enemy.gj *1.3) - parseInt(this.myHero.fy*1.2) +this.randomNum(80,120)
						if(val < 50){
							val = this.randomNum(50,100)
						}
						this.consistEnemyBeat(val,500,3000)
					}
					if(num == 4){
						//眩晕4.5秒
						this.tallentExpert(2,2,4500)
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 1200
						});
						//沉默3秒
						this.delayTel(3000,0)
						let val = (parseInt(this.enemy.gj)*2.3 - parseInt(this.myHero.fy*2.5))*2 + 550
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.enemyBeat2(val)
					}
				}
				if(heroId == '精英战士'){
					if(num == 2){
						let val = this.harmComputer(3) + 350 + this.randomNum(0,500)
						this.enemyBeat2(val)
					}
					if(num == 4){
						let val = (parseInt(this.enemy.gj *2.8) - parseInt(this.myHero.fy*2.5))*2 + 550
						this.enemyBeat2(val)
					}
				}
				if(heroId == '风神'){
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
					//沉默2秒
					this.delayTel(2000,0)
					this.tallentExpert(2,2,2000)
				}
				if(heroId == '探险家'){
					if(num == 1){
						let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj)
						this.enemyBeat2(val)
						if(parseFloat(this.enemy.gs)>0.6){
							this.enemy.gs = parseFloat(this.enemy.gs - 0.2).toFixed(2)
							setTimeout(()=>{
								this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.2).toFixed(2)
							},3000)
						}
					}
					if(num == 2){
						let val = parseInt(this.enemy.gj *2.5) - parseInt(this.myHero.fy*2.5) + 150
						this.enemyBeat2(val)
					}
					if(num == 4){
						let val = (parseInt(this.enemy.gj * 3.8) - parseInt(this.myHero.fy*2.5))*2 + 550
						this.enemyBeat2(val)
					}
				}
				
				if(heroId == '迅捷斥候'){
					let val = this.harmComputer(3) + parseInt(this.enemy.gj)
					let self = this
					self.enemyBeat2(val)
					self.delayTel(2200,0)
						let t = setInterval(()=>{
							let val2 = parseInt(self.enemy.gj * 2) - parseInt(self.myHero.fy*2) + 50
							if(val2 < 50){
								val2 = self.randomNum(30,70)
							}
							self.enemyBeat2(val2)
						},700)
						setTimeout(()=>{
							clearInterval(t)
						},2150)
				}
				if(heroId == '熔岩巨兽'){
					this.tallentExpert(3,2,2800)
					let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj*1.5)
					this.enemyBeat2(val)
					if(this.enspeed >= 0.7){
						this.enspeed = this.enspeed - 0.35
						setTimeout(()=>{
							this.enspeed = this.enspeed + 0.35
						},3000)
					}
				}
				if(heroId == '神明'){
					if(num == 4){
						let val = this.harmComputer(3) + 350
						this.enemyBeat2(val)
						this.tallentExpert(2,2,1000)
						let sp = this.myspeed
						this.myspeed = 0.45
						if(this.characterX >= this.enemyX){
							this.characterX = this.enemyX + 45
						}else{
							this.characterX = this.enemyX - 45
						}
						this.characterY = this.enemyY
						setTimeout(()=>{
							this.myspeed = sp
						},2000)
					}
				}
				if(heroId == '敌方射击'){
					let val = this.enemy.gj*2 - this.myHero.fy*1.5 + 300
					this.enemyBeat2(val)
				}
				if(heroId == '敌方射击-高伤害'){
					let val = this.enemy.gj*3.3 - this.myHero.fy*2 + 380
					this.enemyBeat2(val)
				}
				
				
			}else{	//我方
				if(heroId == 10){
					if(num == 1){
						let val = this.harmComputer(1,addTalent) + 250 + addTalent*50
						if(this.xuli >= 1){
							this.xuli = 0
							val += this.randomNum(this.myHero.gj*1.5,this.myHero.gj*2.5)
						}
						if(strongIndex == 1){
							val = val + this.myHero.gj
						}
						this.beat(val)
						if(parseFloat(this.myHero.v)>0.5){
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.2 + addTalent*0.04)).toFixed(2)
							setTimeout(()=>{
								this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.2 + addTalent*0.04)).toFixed(2)
							},6000)
						}
					}
					if(num == 2){
						let val = parseInt(this.myHero.fs * (2+addTalent2*0.2)) - parseInt(this.enemy.mk*2.5*this.pomo) + 250 + addTalent2*50
						this.xuli = 1
						this.beat(val)
					}
					if(num == 4){
						let val = (parseInt(this.myHero.gj * (2.7+addTalent4*0.25)) + this.myHero.fs * (2.3+addTalent4*0.25)
						 - parseInt(this.enemy.fy*2.5*this.pojia) - parseInt(this.enemy.mk*2.5*this.pomo))*2 + 550 + addTalent4*100
						 if(strongIndex == 1){
						 	val = val + this.myHero.gj
							this.tallentExpert(3,1,2000)
						 }
						this.beat(val)
					}
				}
				if(heroId == 3){
					if(parseInt(this.enemy.mk) > 10){
						this.enemy.mk = parseInt(this.enemy.mk) - 6 - addTalent4*2
					}
					let val = (parseInt(this.myHero.fs * (2.5+addTalent4*0.25)) - parseInt(this.enemy.mk)*4*this.pomo)*2 + 600+addTalent4*100
					if(parseInt(this.myHero.fs) >= 250){
						val = val * 0.8
					}
					this.beat(val)
					this.tallentExpert(3,1,3000)
				}
				if(heroId == 6){
					if(num == 2){
						this.tallentExpert(3,1,3000)
						let val = parseInt(this.myHero.gj * (1.3 + addTalent2*0.2)) - parseInt(this.enemy.fy*1.2) + this.randomNum(80,120 + addTalent2*20)
						if(strongIndex == 1){
							val = val + parseInt(this.myHero.gj*0.5)
							this.addBlood(150,0,0)
						}
						if(val < 50){
							val = this.randomNum(50,100)
						}
						this.consistBeat(val,500,3000)
					}
					if(num == 4){
						//眩晕4秒
						this.tallentExpert(2,1,4000 + addTalent4*200)
						let val = (parseInt(this.myHero.fs)*(2.3 + addTalent4*0.25) - parseInt(this.enemy.mk*4*this.pomo))*2 + 500 + addTalent4*50
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.beat(val)
					}
				}
				if(heroId == 7){
					if(num == 1){
						if(this.ygbj){
							let val = this.harmComputer(1,addTalent) + 350 + this.randomNum(0,500 + addTalent*50)
							this.beat(val)
						}else{
							let val = parseInt(this.myHero.gj*(0.7 + addTalent*0.2)) - parseInt(this.enemy.fy*(2*this.pojia)) + this.randomNum(150,250+addTalent*50)
							this.beat(val)
						}
					}
					if(num == 4){
						let val = (parseInt(this.myHero.gj * (3+addTalent*0.25) - parseInt(this.enemy.fy*(4*this.pojia)))*2 + 550+addTalent4*100)
						this.beat(val)
					}
				}
				if(heroId == 8){
					if(num == 2){
						this.tallentExpert(2,1,2000+addTalent2*250)
						if(strongIndex == 2){
							let val = this.harmComputer(2,addTalent2)
							this.beat(val)
						}
					}
				}
				if(heroId == 12){
					let self = this
					let val = this.harmComputer(2,addTalent) + 100 + addTalent*50
					self.beat(val)
					self.shotDown = true
					let t = setInterval(()=>{
						let val2 = parseInt(self.myHero.fs * (1.8 + addTalent*0.1)) - parseInt(self.enemy.mk*2) + 50 + addTalent*15
						if(val2 < 50){
							val2 = self.randomNum(30,70)
						}
						self.beat(val2,1)
					},700)
					setTimeout(()=>{
						clearInterval(t)
						self.shotDown = false
					},2150)
				}
				if(heroId == 15){
					if(num == 1){
						this.tallentExpert(3,1,2500+addTalent*250)
						let val = this.harmComputer(2,addTalent) + 250 + parseInt(this.myHero.fs*1.5)
						this.beat(val)
						this.heroAddSpeed(0.35+addTalent*0.05,3000+addTalent*200)
					}
				}
				if(heroId == 16){
					if(num == 1){
						let val = this.harmComputer(2,addTalent) + parseInt(this.myHero.fs) + (200+addTalent*60) + (this.reallyRandom(0,5)*50)
						this.beat(val)
					}
					if(num == 2){
						let val = this.harmComputer(2,addTalent) + (150+addTalent*50)
						this.beat(val)
						this.tallentExpert(3,1,2000+addTalent*250)
					}
				}
				if(heroId == 17){
					if(num == 3){
						let val = this.harmComputer(2,addTalent3) + 250+addTalent3*50
						this.beat(val)
					}
					if(num == 4){
						let val = this.harmComputer(2,addTalent4) + 250+addTalent4*100
						this.beat(val)
						this.tallentExpert(2,1,1000)
						let sp = this.enspeed
						this.enspeed = 0.45
						if(this.enemyX >= this.characterX){
							this.enemyX = this.characterX + 45
						}else{
							this.enemyX = this.characterX - 45
						}
						this.enemyY = this.characterY
						setTimeout(()=>{
							this.enspeed = sp
						},2000)
					}
				}
				if(heroId == 18){
					if(num == 1){
						this.ygbj = true
						let val = this.harmComputer(1,addTalent) + addTalent*20
						this.beat(val)
						this.$refs.tallents.tallentShow = true
						setTimeout(()=>{
							if(this.ygbj){
								this.cd(8500 - addTalent*250,1)
								this.ygbj = false
							}
						},4500)
					}
				}
			}
		},
		//地图随机道具
		putMapTools() {
			if(this.bgImgIndex == 0 || this.bgImgIndex == 2){
				for(let i = 0;i<this.randomNum(2,4);i++){
					this.mapObjects.push({
						name: 'addBlood',
						left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
						top: this.randomNum(90,this.screenHeight),
						img: 'addBlood.png'
					});
				}
				for(let i = 0;i<this.reallyRandom(1,3);i++){
					this.mapObjects.push({
						name: 'box',
						left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
						top: 90 + this.randomNum(10,50),
						width: 120,
						height: 120,
						img: 'regBox.png'
					});
				}
				if(this.randomNum(0,2) == 1){
					for(let i = 0;i<this.reallyRandom(2,3);i++){
						this.mapObjects.push({
							name: 'box',
							left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
							top: 90 + this.randomNum(10,50),
							width: 120,
							height: 120,
							img: 'plusBox.png'
						});
					}
				}
				if(this.randomNum(0,2) == 2){
					for(let i = 0;i<2;i++){
						this.mapObjects.push({
							name: 'box',
							left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
							top: 90 + this.randomNum(10,50),
							width: 120,
							height: 120,
							img: 'eqBox.png'
						});
					}
				}
			}else{
				for(let i = 0;i<this.randomNum(1,3);i++){
					this.mapObjects.push({
						name: 'addBlood',
						left: parseInt(this.screenWidth*1.1) - this.randomNum(10,this.screenWidth),
						top: this.randomNum(90,this.screenHeight),
						img: 'addBlood.png'
					});
				}
				for(let i = 0;i<this.reallyRandom(1,3);i++){
					this.mapObjects.push({
						name: 'box',
						left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
						top: 90 + this.randomNum(10,50),
						width: 120,
						height: 120,
						img: 'regBox.png'
					});
				}
				if(this.randomNum(0,1) == 1){
					for(let i = 0;i<this.randomNum(1,3);i++){
						this.mapObjects.push({
							name: 'box',
							left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
							top: 90 + this.randomNum(10,50),
							width: 120,
							height: 120,
							img: 'plusBox.png'
						});
					}
				}
				if(this.randomNum(0,1) == 1){
					for(let i = 0;i<this.randomNum(1,2);i++){
						this.mapObjects.push({
							name: 'box',
							left: parseInt(this.screenWidth*1.3) - this.randomNum(10,this.screenWidth*1.1),
							top: 90 + this.randomNum(10,50),
							width: 120,
							height: 120,
							img: 'eqBox.png'
						});
					}
				}
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
			//踩到地图物体
			if(this.enmapObjects.length != 0){
				this.enmapObjects.map((it,idx)=>{
					let x = Math.abs(it.left - this.characterX)
					let y = Math.abs(it.top - this.characterY)
					let dis = Math.sqrt(x*x+y*y)
					if(dis <= 38){	//踩到
						this.mapObjsEvent(idx,2)
					}
				})
			}
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
			if(this.bgImg.indexOf('battlebg3') != -1){
				if(this.characterX<this.screenWidth*0.45+130 && this.characterX>=this.screenWidth*0.45+30
				&& this.characterY < parseInt(this.screenHeight) - 8){
					clearInterval(this.riverTime)
					this.riverTime = setInterval(()=>{
						this.characterY = this.characterY+18
						if(this.characterY >= parseInt(this.screenHeight)){
							clearInterval(this.riverTime)
						}
					},300)
				}
			}
			
			if(this.showTower || this.showTower2){
				//判断你是否移动到塔下
				let x = Math.abs(this.characterX - (this.towerLeft2+35))
				let y = Math.abs(this.characterY - 230)
				let distance = Math.sqrt(x*x+y*y)
				
				if(distance <= 130){
					if(this.bloodVal2 > 35){	//不是很少血，不追
						this.enemyMoveContrl(1)
					}
				}else if(distance <= 160){	//从防御塔里出来，追击
					this.enemyMoveContrl(2)
				}
			}
			//刀锋之影
			if(this.myHero.id == 14){
				if(this.distanceComp(150)){
					this.fastsp = 0.35
				}else{
					this.fastsp = 0
				}
			}
			if(this.enmapObjects.length != 0 && (this.enemy.name == '神明' || this.enemy.id == 17)){
				this.enmapObjects.map((it,idx)=>{
					if(this.enmapObjects[idx].img == 'mofacircle.gif'){
						let x = Math.abs(it.left+5 - this.characterX)
						let y = Math.abs(it.top+5 - this.characterY)
						let dis = Math.sqrt(x*x+y*y)
						if(dis <= 40){	//踩到
							let val = parseInt(this.enemy.gj * 0.75) - parseInt(this.myHero.fy*1.7) + this.randomNum(15,60)
							if(val <= 30){
								val = this.randomNum(30,50)
							}
							this.tallentExpert(3,2,1000)
							this.enemyBeat2(val)
						}
					}
				})
			}
		},
		//点击背景图释放技能
		handleTap(e) {
			if(!this.begin || this.bettleEnd){
				return
			}
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
			//风神
			if(this.myHero.id == 8 && this.$refs.tallents.tallentShow){
				this.$refs.tallents.tallentShow = false
				this.cd(4000 - addTalent*300,1)
				this.blueComput(35+addTalent*8,'reduce')
				this.mapObjects.push({
					left: pageX - 25,
					top: pageY - 28,
					width: 160,
					height: 160,
					img: 'chuansongdoor.gif'
				});
				setTimeout(()=>{
				  if(Math.abs(this.enemyX - pageX) <= 60 && Math.abs(this.enemyY - pageY) <= 60){
					  this.playVoice('../../static/sounds/fs1.wav',true,0,5000)
					  this.heroAnm('../../static/imgs/hero/fengs1.gif?'+ new Date().getTime(),1)
					  this.backBgImg('fengs1',600,1)
					  if(parseInt(this.enemy.mk) > 60){
						this.enemy.mk = parseInt(this.enemy.mk) - (7 + 2*addTalent)
					  }
					  let val = this.harmComputer(2,addTalent) + (300+addTalent*50)
					  if(strongIndex == 2){
						val = val + this.randomNum(50,this.myHero.fs*2)
					  }
					  this.beat(val)
				  }
				  this.mapObjects.map((i,d)=>{
					  if(i.img == 'chuansongdoor.gif'){
						  this.mapObjects.splice(d,1)
					  }
				  })
				},2000 + this.reallyRandom(0,5)*250)
			}
			//神明
			if(this.myHero.id == 17 && this.$refs.tallents.tallentShow){
				this.playVoice('../../static/sounds/sm1.wav',false,0,2300)
				this.$refs.tallents.tallentShow = false
				if(parseInt(this.addData.strongIndex) == 1){
					this.cd(5000 - addTalent*150,1)
				}else{
					this.cd(5800 - addTalent*200,1)
				}
				this.blueComput(45+addTalent*5,'reduce')
				this.mapObjects.push({
					left: pageX - 28,
					top: pageY - 31,
					width: 190,
					height: 190,
					img: 'mofacircle.gif'
				});
				setTimeout(()=>{
				  this.mapObjects.map((i,d)=>{
					  if(i.img == 'mofacircle.gif'){
						  this.mapObjects.splice(d,1)
					  }
				  })
				},3500 + addTalent*150)
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
				//移速快的地图
				if(this.bgImgIndex == 0 || this.bgImgIndex == 3){
					this.enspeed = this.enspeed - 0.15
					this.myspeed = this.myspeed - 0.15
				}
			},100)
		},
		scroll: function(e) {
			this.old.scrollTop = e.detail.scrollTop
			this.old.scrollLeft = e.detail.scrollLeft
		},
		distanceComp(dis1) {
			if(this.distance <= dis1){
				return true
			}else{
				return false
			}
		},
		
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
	.mygjAnm {
		width: 21%;
		height: 65%;
		position: absolute;
		top: 30%;
		left: 20%;
		opacity: 0.7;
		object-fit: cover;
		z-index: 2;
		border-radius: 12rpx;
		box-shadow: 0px 0px 7px 2px #ffcc11;
	}
	.main {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.my {
			width: 100%;
			z-index: 9;
			position: fixed;
			bottom: 10rpx;
			.tallentBar {
				position: fixed;
				bottom: 90rpx;
				left: 280rpx;
				width: 35%;
				height: 80rpx;
				z-index: 12;
			}
			.opreate {
				width: 55%;
				height: 120rpx;
				display: flex;
				position: fixed;
				left: 0;
				bottom: 160rpx;
				z-index: 16;
				.store{
					margin: 8rpx 30rpx;
					.storeImg {
						width: 80rpx;
						height: 80rpx;
					}
					.storeText {
						color: #ffed65;
						font-size: 24rpx;
					}
					.toolImg {
						width: 62rpx;
						height: 62rpx;
					}
				}
				.tool {
					.tooltext {
						width: 30rpx;
						padding: 10rpx 0rpx;
						color: $main-color;
						font-size: 24rpx;
					}
					width: 42%;
					display: flex;
					justify-content: space-around;
					background-color: rgba(211, 211, 211, 0.15);
					border: 2rpx solid rgba(255, 237, 101, 0.5);
					border-radius: 18rpx;
				}
			}
			.tallent{
				width: 250rpx;
				position: fixed;
				right: 30rpx;
				bottom: 30rpx;
				z-index: 19;
				.tallentRow {
					width: 100%;
					height: 278rpx;
					margin-top: 16rpx;
					.talText {
						width: 90%;
						display: flex;
						justify-content: space-between;
						color: $main-color;
						font-size: 36rpx;
						padding: 6rpx 20rpx;
						font-weight: bold;
						letter-spacing: 6rpx;
					}
				}
			}
		}
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
		.regularGj {
			position: fixed;
			right: 36rpx;
			bottom: 36rpx;
			z-index: 19;
			.storeImg {
				width: 100rpx;
				height: 100rpx;
			}
			.storeText {
				color: #ffed65;
				font-size: 28rpx;
			}
			.toolImg {
				width: 82rpx;
				height: 82rpx;
			}
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
		.enemy{
			position: fixed;
			z-index: 12;
		}
		.enemy,.me {
			width: 100%;
			padding: 10rpx 0rpx;
			padding-left: 36rpx;
			box-sizing: border-box;
			display: flex;
			.icon1 {
				margin-right: 20rpx;
				.icon1Img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					border: 4rpx solid $main-color;
				}
				.icon2Img {
					border: 4rpx solid #f8220e;
				}
			}
			.blood {
				width: 30%;
				height: 34rpx;
				// border: 4rpx solid $main-color;
				box-shadow: 0rpx 0rpx 6rpx 4rpx #4a4a4a;
				border-radius: 4rpx;
				font-size: 28rpx;
				.bloodText {
					width: 100%;
					float: left;
					position: relative;
					text-align: center;
					color: #ececec;
					z-index: 3;
					line-height: 34rpx;
					vertical-align: middle;
				}
				.bloodVal {
					position: relative;
					z-index: 2;
					height: 34rpx;
					border-radius: 4rpx;
					background: linear-gradient(90deg, rgba(247, 64, 67, 0.5) 0%, #ed0003 100%);
				}
				.mybloodVal {
					background: linear-gradient(90deg, rgba(28, 214, 0, 0.6) 0%, #15c305 100%) !important;
				}
				.mybloodVal2 {
					background-color: #95ff93 !important;
				}
				.bloodVal2 {
					position: relative;
					top: -34rpx;
					height: 34rpx;
					border-radius: 4rpx;
					background-color: #ed9294;
					transition-property: width;
					transition-duration: 0.3s;
					transition-timing-function: linear;
				}
				.blueVal {
					width: 100%;
					position: relative;
					height: 34rpx;
					border-radius: 4rpx;
					text-align: center;
					float: left;
					color: #ececec;
					line-height: 34rpx;
					vertical-align: middle;
					background: linear-gradient(90deg, rgba(0, 0, 220, 0.5) 0%, #0167ff 100%);
				}
			}
			.harmText1 {
				width: 130rpx;
				color: #ed0003;
				font-weight: bold;
				font-size: 36rpx;
				padding-left: 8rpx;
			}
		}
		.enemyInfo {
			width: 47%;
			color: #ffff7f;
			display: flex;
			padding-left: 18rpx;
			.infoRow {
				width: 100%;
				display: flex;
				font-size: 28rpx;
				justify-content: space-between;
				.val {
					 color: #00ff00;
					 font-weight: bold;
					 font-size: 32rpx;
				}
			}
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
	.time {
		width: 100%;
		position: fixed;
		top: 26%;
		display: flex;
		justify-content: center;
		z-index: 10;
		.aler {
			width: 80rpx;
			height: 80rpx;
		}
		.timeText {
			font-size: 38rpx;
			color: #f1f1f1;
			font-weight: bold;
			padding-top: 20rpx;
		}
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
		width: 80rpx;
		height: 80rpx;
		border-radius: 100%;
		position: absolute;
		z-index: 2;
	}
	.vs {
		width: 100%;
		position: fixed;
		top: 27%;
		display: flex;
		justify-content: center;
		z-index: 10;
		.vsImg {
			width: 300rpx;
			height: 300rpx;
		}
		.begImg {
			width: 280rpx;
			height: 100rpx;
		}
		.backMenu {
			border-radius: 16rpx;
			background-color: #ffbf00;
			padding: 8rpx 26rpx;
			height: 50rpx;
			position: relative;
			top: 80rpx;
		}
	}
	.towerImg {
		position: absolute;
		top: 135px;
		width: 160px;
		height: 160px;
		z-index: 6;
	}
	.towerImg2 {
		position: absolute;
		top: 100px;
		width: 160px;
		height: 220px;
		z-index: 6;
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
	.sel {
		width: 50%;
		position: relative;
		top: 5%;
		background: url('../../static/imgs/selRole.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		z-index: 95;
		overflow-y: auto;
		.titles {
			width: 100%;
			color: #ffbf00;
			font-size: 36rpx;
			font-weight: bold;
			text-align: center;
			position: absolute;
			top: 0;
			padding-top: 6rpx;
		}
		.close {
			position: absolute;
			left: 92%;
			font-size: 58rpx;
			color: #ffffff;
		}
		.roleInfo {
			padding: 70rpx 70rpx;
			p {
				padding: 10rpx 0rpx;
			}
			.know {
				border-radius: 14rpx;
				padding: 6rpx 12rpx;
				background-color: #ffaa00;
				color: #fff;
				text-align: center;
				font-size: 30rpx;
				margin-top: 20rpx;
			}
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
						font-size: 36rpx;
						font-weight: bold;
					}
					.textInfo {
						color: #ebebeb;
						padding: 10rpx 0rpx;
						font-size: 30rpx;
					}
				}
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
}

</style>