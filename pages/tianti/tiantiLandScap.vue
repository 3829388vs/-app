<template>
	<!-- <view class="container" :style="{'background-image': 'url('+require('../../static/imgs/hero/'+bgImg)+')','background-size': 'cover','background-repeat':'no-repeat'}"> -->
	<view class="container" @tap="handleTap">
		<!-- ===== 虚拟摇杆 ===== -->
		<view
			class="joystick"
			id="joystick"
			@touchstart="onJoyStart"
			@touchmove.stop.prevent="onJoyMove"
			@touchend="onJoyEnd"
			@touchcancel="onJoyEnd"
		>
			<view class="joy-ring"></view>
			<view class="joy-stick" :style="stickStyle"></view>
		</view>
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
			<image class="winlogoImg" style="width: 100%;height: 500rpx" src="../../static/imgs/lose.gif"></image>
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
				<image class="mygjAnm" :style="{top: parseInt(enemyY - 80) + 'px', left: parseInt(enemyX - 50) + 'px'}" :src="engjAnm" v-if="showEngjAnm"></image>
				<video v-if="showVideo" class="videoStyle" :src="'../../static/imgs/hero/'+strongId+'.mp4'" @ended="videoEnded(1)" :autoplay="true" :controls="false" :duration="videoDuration"
				 :style="{top: parseInt(characterY + scrollTop*0.5 - 90 + (landscape?-110:0)) + 'px', left: parseInt(characterX - 50 + scrollLeft*0.5) + 'px', width: videoWid+'px', height: videoHei+'px'}"></video>
				 <video v-if="showVideo2" class="videoStyle" :src="'../../static/imgs/hero/'+enemyVideo+'.mp4'" @ended="videoEnded" :autoplay="true" :controls="false" :duration="videoDuration2"
				  :style="{top: parseInt(enemyY + scrollTop*0.5 - 200) + 'px', left: parseInt(enemyX - 83 + scrollLeft*0.5) + 'px', width: videoWid2+'px', height: videoHei2+'px'}"></video>
				<image class="mygjAnm" :style="{top: parseInt(characterY - 100) + 'px', left: parseInt(characterX - 70) + 'px'}" :src="mygjAnm" v-if="showMygjAnm"></image>
				<image v-if="showMyIcon" class="bettleIconImg" :style="characterStyle" :src="'../../static/imgs/hero/'+myHero.icon"></image>
				<image class="bettleIconImg" :style="enemyStyle" :src="'../../static/imgs/'+enemy.icon"></image>
				<image class="bettleIconImg bettleIconImgStyle" :style="characterStyle" :src="'../../static/imgs/hero/'+iconStyle"></image>
				<image class="bettleIconImg flyImgStyle" :style="characterStyle" :src="'../../static/imgs/hero/'+flyStyle"></image>
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
						<tallent ref="tallents" :noflz="flz == 0" :name="myHero.name" :heroId="myHero.id" :begin="begin"
						@tallent="tallentHandle" :disList="[myHero.dis1,myHero.dis2,myHero.dis3,myHero.dis4]" :dist="distance"></tallent>
					</view>
				</view>
				</view>
				<view class="regularGj" v-if="cd5" @click="regGj">
					<image class="storeImg" src="../../static/imgs/gj.png" ></image>
					<view class="storeText">攻击/追击</view>
				</view>
			</view>
			<!-- <view class="direct">
				<image class="left" src="../../static/imgs/left2.png" @click.stop="go(1)" @longtap="go(5)"></image>
				<image class="right" src="../../static/imgs/right2.png" @click.stop="go(2)" @longtap="go(6)"></image>
				<image class="top" src="../../static/imgs/top.png" @click.stop="go(3)" @longtap="go(7)"></image>
				<image class="down" src="../../static/imgs/down.png" @click.stop="go(4)" @longtap="go(8)"></image>
			</view> -->
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
				<image v-if="showTower" class="towerImg" :style="{left: towerLeft2 + 'px'}" src="../../static/imgs/tower.png"></image>
				<!-- 不同地图的防御塔不同 -->
				<image v-if="showTower2" class="towerImg2" :style="{left: towerLeft + 'px'}" src="../../static/imgs/tower2.png"></image>
				<image v-if="showTower2" class="towerImg2" :style="{left: towerLeft2 + 'px'}" src="../../static/imgs/tower2.png"></image>
				<view v-if="showTower || showTower2" class="towercircle" :style="{left: (towerLeft - 50) + 'px'}"></view>
				<view v-if="showTower || showTower2" class="towercircle towercircle2" :style="{left: (towerLeft2 - 50) + 'px'}"></view>
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
import res3 from '../../static/data/heroList.json'
import res4 from '../../static/data/goods.json'
import heroStrongList from '../../static/data/heroStrong.json'
import { editMoney } from '../../utils/editUser'
import aiProgress from '@/components/ai-progress/ai-progress.vue'
const PLAYER_SIZE = 45; // 人物直径(px)，需与 CSS 中 .player 宽高一致
export default {
	data() {
		return {
			myHero: {},
			begin: false,
			enemy: {},
			enmList: [],
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
			bgImg2: '../../static/imgs/battlebg.png',
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
			audioVoice: [null,null,null,null,null,null,null,null],
			bgAudio: null,
			ygbj: false,	//嫦娥月光标记或战士换枪标记
			ylzz: null,	//影流之主flag
			yinshen: false,  //自己隐身
			yinshen2: false, //敌方隐身
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
			heros: [],
			loop: 0	,//关卡
			mygjAnm: '',
			engjAnm: '',
			showMygjAnm: false,	//我方英雄攻击动画
			showEngjAnm: false,	//敌方英雄攻击动画
			showMyIcon: true,
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
			tallentObjects: [],	//技能特效物体
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
			enemyBeatCD: null,
			arrowX: 0,
			arrowY: 0,
			arrowX2: 0,
			arrowY2: 0,
			arrowTimer: null,
			arrowTimer2: null,
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
			arrowtimeout: null,
			arrowtimeout2: null,
			tempEnemyIcon: null,
			myStore: [],
			myImmunity: false,	//我方免疫异常状态
			enImmunity: false,	//敌方免疫异常状态
			enFlag: false,	//敌方flag
			enFlagTime: null,	//敌方时间flag
			enFlagTime2: null,
			iconStyle: '',	//头像装饰
			flyStyle: '',	//羽翼
			strongId: null,
			showVideo: false,
			showVideo2: false,
			videoWid: 150,
			videoHei: 270,
			videoWid2: 150,
			videoHei2: 270,
			videoDuration: 3,
			videoDuration2: 3,
			enemyVideo: null,
			enConsisAddTime: null,	//敌方持续回血timer
			landscape: false,	//我方视频是否横屏
			playerStyle: 'transform: translate3d(0px, 0px, 0);',
			stickStyle: 'transform: translate3d(0px, 0px, 0);',
			speed: 32,
			usetransitionDuration: false,
			joyStickjieliu: null
		}
	},
	onReady() {
		/* ---------- 非响应式状态（避免每帧 setData） ---------- */
		this.player = { x: 0, y: 0 };     // 人物左上角坐标
		this.dir = { x: 0, y: 0 };        // 当前移动方向（单位向量）
		this.stageSize = { w: 0, h: 0 };  // 舞台尺寸
		this.joyCenter = null;            // 摇杆中心（屏幕坐标）
		this.joyRadius = 40;              // 摇杆小球最大偏移(px)
		this.deadZone = 6;                // 死区(px)，防止手抖
		this.lastTime = 0;
		this.timer = null;
		this.initLayout();
	},
	onHide() {
		// 切到后台停止循环，避免继续跑
		this.stopLoop();
		this.resetDir();
	},
	 computed: {
	    characterStyle() {
	      return {
			transform: `translate3d(${this.characterX}px, ${this.characterY}px, 0)`,
	        // left: this.characterX + 'px',
	        // top: this.characterY + 'px',
			border: this.bigGJTX2,
	        transitionDuration:  this.usetransitionDuration ? (parseFloat(parseFloat(this.myspeed)-parseFloat(this.fastsp)).toFixed(2)+ 's'):'0s',
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
		this.bgImgIndex = this.reallyRandom(0,4)
		if(this.bgImgIndex == 0){
			this.bgImg = '../../static/imgs/battlebg.png'
		}else if(this.bgImgIndex == 1){
			this.bgImg = '../../static/imgs/battlebg2.jpeg'
		}else if(this.bgImgIndex == 2){
			this.bgImg = '../../static/imgs/battlebg3.jpg'
		}else if(this.bgImgIndex == 3){
			this.bgImg = '../../static/imgs/battlebg4.jpg'
		}else if(this.bgImgIndex == 4){
			this.bgImg = '../../static/imgs/tianjinBg.png'
		}
		this.putMapTools()
		this.gameType = uni.getStorageSync('gameType')
	},
	onLoad(option) {
		if (this.stageSize && this.stageSize.w) this.startLoop();
		if(option){
			if(JSON.parse(uni.getStorageSync('tiantiHero'))){
				this.heros = JSON.parse(uni.getStorageSync('tiantiHero'))
			}
			let userInfo = JSON.parse(uni.getStorageSync('user'))
			this.gameType = uni.getStorageSync('gameType')
			this.money = parseInt(userInfo.money)
			if(this.gameType == 'spt'){
				this.getSptBoss()
				if(uni.getStorageSync('myStore')){
					this.myStore = JSON.parse(uni.getStorageSync('myStore'))
				}else{
					let store = []
					uni.setStorageSync('myStore',JSON.stringify(store));
				}
			}else{
				this.getTTEnmList()
			}
			this.myHero = {...this.heros[0]}
			this.blood1 = this.enemy.blood
			let self = this
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			datas.forEach((it,idx)=>{
				if(self.myHero.id == it.id){
					self.addData = {...it}
				}
			})
			//装填英雄属性加成
			self.getAddTalent(self.heros[0])
			self.origHero = {...self.myHero}
			this.enspeed = this.enemy.speed
			this.enemyGJdis = this.enemy.distance
			if(this.gameType == 'spt'){
				if(this.reallyRandom(0,1) == 1){
					self.playVoice('../../static/sounds/battleBg.wav',true,10,180000)
				}else{
					self.playVoice('../../static/sounds/battleBg2.wav',true,10,180000)
				}
			}else{
				self.playVoice('../../static/sounds/bgMp3.wav',true,10,170000)
			}
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
					let li = [{"_id":{"$oid":"6509a9647ad52ddc64ea029c"},"name":"灭世者的死亡之帽","gj":0,"fy":0,"fs":120,"mk":0,"blood":0,"flz":200,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3089.png","detail":"法术强度+120，法力值+200","bj":0,"price":380,"istool":0},
					{"_id":{"$oid":"6509a9647ad52ddc64ea033b"},"name":"残疫","gj":0,"fy":0,"fs":90,"mk":0,"blood":0,"flz":350,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3118.png","detail":"法术强度+90，法力值+350。1、你的技能释放会使对方产生灼烧伤害，并削减其魔法抗性。2、你的终极技能造成的伤害提升、冷却时间减少。","bj":0,"price":395,"istool":0},
					{"_id":{"$oid":"6509aa337ad52ddc64ea2a71"},"name":"莫雷洛秘典","gj":0,"fy":0,"fs":60,"mk":0,"blood":350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3165.png","detail":"法术强度+60，生命值+350，每施放一个法术技能时，带法术吸血效果（生命值回复）。","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509aa337ad52ddc64ea2a73"},"name":"卢登的配枪","gj":0,"fy":0,"fs":70,"mk":0,"blood":0,"flz":350,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6655.png","detail":"法术强度+70，法力值+350。该武器可以当道具使用，主动激发可使敌方造成一定的伤害。","bj":0,"price":370,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b15"},"name":"法师之靴","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3020.png","detail":"法师鞋子，提升移动速度25%，增加15%法术穿透","bj":0,"price":220,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509a9647ad52ddc64ea029c"},"name":"灭世者的死亡之帽","gj":0,"fy":0,"fs":120,"mk":0,"blood":0,"flz":200,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3089.png","detail":"法术强度+120，法力值+200","bj":0,"price":380,"istool":0},
					{"_id":{"$oid":"6509a9647ad52ddc64ea036c"},"name":"虚空之杖","gj":0,"fy":0,"fs":95,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3135.png","detail":"法术强度+95。36%法术穿透","bj":0,"price":530,"istool":0},
					{"_id":{"$oid":"6509a9647ad52ddc64ea016c"},"name":"风暴狂涌","gj":0,"fy":0,"fs":90,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/4646.png","detail":"法术强度+90。释放技能后，2秒会产生风啸，风啸会给敌人造成100~350的真实伤害。","bj":0,"price":350,"istool":0},
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
					let li = [{"_id":{"$oid":"6509acbda7c432baa0c89b30"},"name":"破败王者之刃","gj":40,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3153.png","detail":"攻击力+40，攻速+25%，释放技能和普通攻击有15%生命偷取（与饮血剑装备叠加则无效）。","bj":0,"price":335,"istool":0},
					{"_id":{"$oid":"6509acbda7c432baa0c89b35"},"name":"急射火炮","gj":25,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3094.png","detail":"如果装备的英雄是【射手】，暴击几率提升至0.2，攻击力提升至40，攻速提升至30%，攻击范围提升至15码","bj":0.1,"price":260,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b7cb"},"name":"界弓","gj":30,"fy":0,"fs":0,"mk":0,"blood":0,"distance": 10,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3302.png","detail":"如果装备的英雄是【射手】，攻击速度提升35%，攻击力提升至45，护甲穿透10%","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b76f"},"name":"无尽之刃","gj":75,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7031.png","detail":"攻击力+75，普通攻击暴击几率提升30%，暴击伤害提升25%","bj":0.3,"price":380,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b12"},"name":"狂战士胫甲","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3006.png","detail":"提升移动速度25%，增加20%攻击速度","bj":0,"price":200,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":95,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+95，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":450,"istool":0},
					{"_id":{"$oid":"6509acbda7c432baa0c89b33"},"name":"斯塔缇克电刃","gj":45,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0.3,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3087.png","detail":"普通攻击时会释放连锁闪电，给对方造成魔法伤害，一段时间（10秒）只有一次闪电。","bj":0.2,"price":360,"istool":0},
					{"_id":{"$oid":"6509acbda7c432baa0c89b35"},"name":"急射火炮","gj":25,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0.2,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3094.png","detail":"如果装备的英雄是【射手】，暴击几率提升至0.2，攻击力提升至40，攻速提升至30%，攻击范围提升至15码","bj":0.1,"price":260,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b7cb"},"name":"界弓","gj":30,"fy":0,"fs":0,"mk":0,"blood":0,"distance": 10,"flz":0,"gs":0.25,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3302.png","detail":"如果装备的英雄是【射手】，攻击速度提升35%，攻击力提升至45，护甲穿透10%","bj":0,"price":290,"istool":0},
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
					let li = [{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":95,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+95，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":450,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b91f"},"name":"收集者","gj":50,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6676.png","detail":"攻击力+50，护甲穿透10%。【刺客专属特效】如果敌方生命值低于16%，任意有伤害的技能会直接秒杀对方。","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b93f"},"name":"电震涡流剑","gj":55,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6699.png","detail":"攻击力+55。【刺客专属特效】每次冲刺性的技能都会提升5攻击力，且冲刺的伤害提升。","bj":0,"price":335,"istool":0},
					{"_id":{"$oid":"6504218721821b2af571b9fa"},"name":"挑战护手","gj":20,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":450,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3053.png","detail":"1.普通攻击附加额外伤害。2.当你生命值低于30%时启动保护机制，血量提升800，防御力+25(持续6秒)。挑战模式下的每一回合都会有保护效果。","bj":0,"price":370,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b28"},"name":"明朗之靴","gj":0,"fy":0,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3158.png","detail":"提升移动速度25%，在脱离战斗下，提升额外15%移动速度","bj":0,"price":180,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":95,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+95，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":450,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b91f"},"name":"收集者","gj":50,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6676.png","detail":"攻击力+50，护甲穿透10%。【刺客专属特效】如果敌方生命值低于16%，任意有伤害的技能会直接秒杀对方。","bj":0,"price":290,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"黑曜切割者","gj":75,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7037.png","detail":"攻击力+75，生命值+500，15%护甲穿透","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b90f"},"name":"星蚀","gj":60,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6692.png","detail":"攻击力+60，在每释放两次技能后，会提供一个护盾（与攻击力相关），持续2.5秒","bj":0,"price":330,"istool":0},
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
					let li = [{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"黑曜切割者","gj":75,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7037.png","detail":"攻击力+75，生命值+500，15%护甲穿透","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6504218721821b2af571b9fa"},"name":"挑战护手","gj":20,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":450,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3053.png","detail":"1.普通攻击附加额外伤害。2.当你生命值低于30%时启动保护机制，血量提升800，防御力+25(持续6秒)。挑战模式下的每一回合都会有保护效果。","bj":0,"price":370,"istool":0},
					{"_id":{"$oid":"6509b11ff08210d515235598"},"name":"狂徒铠甲","gj":0,"fy":0,"fs":0,"mk":0,"blood":1350,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3083.png","detail":"生命值+1350，一旦没有受到敌方伤害，每秒回复35生命值","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509adb2652341bd6427b2ca"},"name":"焚天","gj":40,"fy":0,"fs":0,"mk":0,"blood":400,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/6610.png","detail":"在释放两个普通技能后（非大招），普通攻击必定会爆击，并回复250生命值","bj":0,"price":330,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b23"},"name":"铁板靴","gj":0,"fy":25,"fs":0,"mk":0,"speed":0.25,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3047.png","detail":"提升移动速度25%，防御力提升25","bj":0,"price":220,"istool":0,"isShoot":true}]
					let li2 = [{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"黑曜切割者","gj":75,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/7037.png","detail":"攻击力+75，生命值+500，15%护甲穿透","bj":0,"price":360,"istool":0},
					{"_id":{"$oid":"6509b1cc2139291ceb150b10"},"name":"幽梦之灵","gj":95,"fy":0,"fs":0,"mk":0,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3142.png","detail":"攻击力+95，护甲穿透+10%。幽梦：主动触发提升35%移动速度（持续3秒）","bj":0,"price":450,"istool":0},
					{"_id":{"$oid":"6509b034652341bd6427f8da"},"name":"石像石板甲","gj":0,"fy":55,"fs":0,"mk":0,"blood":500,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/663193.png","detail":"防御+55，生命+500。敌方每次攻击你，都有50%概率减少2~3点攻击力。","bj":0,"price":325,"istool":0},
					{"_id":{"$oid":"6509ac30f08210d51522b79f"},"name":"贪欲九头蛇","gj":65,"fy":0,"fs":0,"mk":0,"distance": 5,"blood":0,"flz":0,"gs":0,"icon":"https://game.gtimg.cn/images/lol/act/img/item/3074.png","detail":"攻击力+65，15%护甲穿透。劈斩：主动释放，给敌方造成360点物理伤害","bj":0,"price":350,"istool":1},
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
			if(this.loop == 0){
				this.timeBg();
			}
			this.computeDistance()
			this.enemyMoveContrl(2)
		},
		//下一轮
		getNextLoop() {
			this.nextHeroHandle()
			this.begin = false
			clearInterval(this.beatTime)
			this.initGame()
			this.$refs.tallents.tallentShow = true
			this.$refs.tallents.tallentShow2 = true
			this.$refs.tallents.tallentShow3 = true
			this.$refs.tallents.tallentShow4 = true
			this.myEquip = []
			this.myEquipName = []
			this.regGjAdd.addBlood = 0
			let addbloodPer = 0.5
			if(this.gameType == 'spt'){
				addbloodPer = 0.2
				if(this.enemy.levelNum >= 5){
					addbloodPer = 0.1
				}
			}
			if(parseInt(this.blood1) + parseInt(this.enemy.blood)*addbloodPer > parseInt(this.enemy.blood)){
				this.blood1 = parseInt(this.enemy.blood)
				this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
			}else{
				this.blood1 = parseInt(this.blood1) + parseInt(parseInt(this.enemy.blood)*addbloodPer)
				this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
			}
			this.loop += 1
			if(this.loop < this.heros.length){
				this.myHero = this.heros[this.loop]
				this.origHero = {...this.myHero}
				this.blood2 = this.myHero.blood
				this.bloodVal2 = 100
				this.blueVal = 100
				this.flz = this.myHero.flz
				this.myspeed = 1.1
				this.heroGJdis = this.myHero.distance
				let datas = JSON.parse(uni.getStorageSync('heroAddData'))
				datas.forEach((it,idx)=>{
					if(this.myHero.id == it.id){
						this.addData = {...it}
					}
				})
				//装填英雄属性加成
				this.getAddTalent(1)
				this.characterX = parseInt(this.screenWidth*0.8) - this.reallyRandom(0,5)*45
				this.characterY = parseInt(this.screenHeight*0.6) - this.reallyRandom(0,5)*15
			}else{
				uni.showToast({
					title: '比赛结束，你的英雄全部阵亡',
					icon:'none',
					duration: 1500
				});
				this.win = false
				this.blood2 = 0
				this.bloodVal2 = 0
				this.bettleEnd = true
				this.initGame()
				this.addLog(0)
				setTimeout(()=>{
					this.showlose = true
				},500)
				setTimeout(()=>{
					this.showlose = false
				},2500)
				clearInterval(this.time1)
				clearInterval(this.time3)
				clearInterval(this.beatTime)
				clearInterval(this.wzhy)
				clearInterval(this.goTime2)
				clearInterval(this.arrowTimer)
				this.videoEnded(1)
				this.videoEnded()
				this.beatTime = null
			}
		},
		backMenu() {
			let money = parseInt(JSON.parse(uni.getStorageSync('user')).money)
			let name = JSON.parse(uni.getStorageSync('user')).name
			let time = parseInt(this.min) * 60 + parseInt(this.second)
			let winner = this.win ? this.randomNum((time*2),(time*3)+150)+100: 0
			let addPointer = time + Math.ceil(winner*0.5)
			 if(this.gameType == 'match' && this.win) {
			 	winner += this.enemy.lv*100
			 }
			 if(this.gameType == 'fuben' && this.win) {
			 	winner += this.enemy.money
			 }
			let newMoney = money + (time*3) + this.randomNum(60,120) + winner
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
		//敌方英雄属性随机加成
		addEnemyStrong(){
			// let self = this
			// let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			// let allPointer = 0
			// self.heros.forEach(i=>{
			// 	datas.forEach((it,idx)=>{
			// 		if(i.id == it.id){
			// 			allPointer += it.allPointer
			// 		}
			// 	})
			// })
			//计算平均英雄等级
			// let level = Math.ceil(parseInt(allPointer/5)/500)
			// if(level>=25){
			// 	this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*55,parseInt(this.enemy.blood*0.15) + parseInt(level)*90))
			// }else if(level>=20 && level<25){
			// 	this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*40,parseInt(this.enemy.blood*0.13) + parseInt(level)*75))
			// }else if(level>=15 && level<20){
			// 	this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*35,parseInt(this.enemy.blood*0.1) + parseInt(level)*65))
			// }else if(level>=7 && level<15){
			// 	this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*35,parseInt(this.enemy.blood*0.1) + parseInt(level)*50))
			// }else{
			// 	this.enemy.blood = parseInt(this.enemy.blood + this.randomNum(parseInt(level)*25,parseInt(this.enemy.blood*0.1) + parseInt(level)*50))
			// }
			this.blood1 = this.enemy.blood
			// this.enemy.gj = this.enemy.gj + this.randomNum(parseInt(level),parseInt(level)+parseInt(this.enemy.gj*(0.06+level*0.01)))
			// this.enemy.fy = this.enemy.fy + this.randomNum(parseInt(level),parseInt(level)+parseInt(this.enemy.fy*(0.12+level*0.01)))
			// this.enemy.mk = this.enemy.mk + this.randomNum(parseInt(level),parseInt(level)+parseInt(this.enemy.mk*(0.12+level*0.01)))
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
				//spt敌方英雄伤害、技能
				if(this.gameType == 'spt'){
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
								},1000 + this.randomNum(0,2)*500)
							}
							if(this.distanceComp(this.enemy.dis3)){
								setTimeout(()=>{
									this.enemyTallent(3)
								},2300 + this.randomNum(0,2)*500)
							}
							if(this.distanceComp(this.enemy.dis4)){
								if(this.randomNum(0,2) != 0){
									setTimeout(()=>{
										this.enemyTallent(4)
									},3300 + this.randomNum(0,2)*800)
								}
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

				this.shotVal1 = this.harmComputer(3,0,300 + this.randomNum(50,parseInt(this.enemy.gj)))
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
					uni.showToast({
						title: '你的英雄阵亡，后续请到“我的背包”复活',
						icon:'none',
						duration: 2000
					});
					let self = this
					let datas = JSON.parse(uni.getStorageSync('heroAddData'))
					datas.forEach((it,idx)=>{
						if(self.myHero.id == it.id){
							datas[idx].isLive = 0
						}
					})
					uni.setStorageSync('heroAddData',JSON.stringify(datas))
					this.blood2 = 0
					this.bloodVal2 = 0
					this.shotDown = true
					this.begin = false
					this.getNextLoop()
					this.addLog(0)
					clearInterval(this.goTime2)
					clearInterval(this.arrowTimer)
					clearInterval(this.beatTime)
					clearInterval(this.time1)
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
				this.shotVal1 = val
				if(this.shotVal1 < 50){
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
					uni.showToast({
						title: '你的英雄阵亡，后续请到“我的背包”复活',
						icon:'none',
						duration: 1800
					});
					let self = this
					let datas = JSON.parse(uni.getStorageSync('heroAddData'))
					datas.forEach((it,idx)=>{
						if(self.myHero.id == it.id){
							datas[idx].isLive = 0
						}
					})
					uni.setStorageSync('heroAddData',JSON.stringify(datas))
					this.blood2 = 0
					this.bloodVal2 = 0
					this.shotDown = true
					this.begin = false
					this.getNextLoop()
					this.addLog(0)
					clearInterval(this.goTime2)
					clearInterval(this.arrowTimer)
					clearInterval(this.time1)
					clearInterval(this.beatTime)
				}
		},
		
		//敌方持续攻击
		consistEnemyBeat(val,time,timeOut) {
			if(this.enFlagTime2){
				return
			}
			if(!this.bettleEnd || this.begin){
			this.enFlagTime2 = setInterval(()=>{
				if(this.shotDown){
					return
				}
				if(this.bettleEnd || !this.begin){
					clearInterval(this.enFlagTime2)
					this.enFlagTime2 = null
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
					clearInterval(this.enFlagTime2)
					this.enFlagTime2 = null
					uni.showToast({
						title: '你的英雄阵亡，后续请到“我的背包”复活',
						icon:'none',
						duration: 2000
					});
					let self = this
					let datas = JSON.parse(uni.getStorageSync('heroAddData'))
					datas.forEach((it,idx)=>{
						if(self.myHero.id == it.id){
							datas[idx].isLive = 0
						}
					})
					uni.setStorageSync('heroAddData',JSON.stringify(datas))
					this.blood2 = 0
					this.bloodVal2 = 0
					this.shotDown = true
					this.begin = false
					this.getNextLoop()
					this.addLog(0)
					clearInterval(this.goTime2)
					clearInterval(this.arrowTimer)
					clearInterval(this.beatTime)
					this.beatTime = null
					clearInterval(this.time1)
					clearInterval(this.enFlagTime2)
					this.enFlagTime2 = null
				}
			},time)
			setTimeout(()=>{
				clearInterval(this.enFlagTime2)
				this.enFlagTime2 = null
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
			if(!this.begin){
				return
			}
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
			if(this.myEquipName.includes('石像石板甲')) {
				if(this.randomNum(0,1) == 1 && this.distanceComp(this.enemy.distance)){
					this.enemy.gj = this.enemy.gj - 2
				}
			}
			if(this.myHero.id == 17 && this.flag == 0) {
				if(this.bloodVal2 <= 26){
					this.heroAnm('../../static/imgs/hero/fuhuo.gif?'+ new Date().getTime())
					this.backBgImg('fuhuo',3000)
					this.delayTel(3000,0)
					this.myNoMove = true
					this.shotDown = true
					setTimeout(()=>{
						this.addBlood(parseInt(this.myHero.blood*0.5),0,0)
						this.myNoMove = false
						this.shotDown = false
					},3000)
					this.flag = 1
				}
			}
			if(this.myEquipName.includes('狂徒铠甲') && this.distanceComp(200)) {
				this.addBlood(35,0,0)
			}
			if(this.myEquipName.includes('海洋龙魂') && this.distanceComp(200)) {
				this.addBlood(parseInt(this.myHero.blood*0.05),0,0)
				this.blueComput(30,"add")
			}
			if(this.myEquipName.includes('明朗之靴')) {
				this.fastsp = 0.15
			}
			if(this.myEquipName.includes('荆棘之甲') && this.distanceComp(this.enemyGJdis)) {
				let m = parseInt(this.harm2*0.12) - parseInt(this.myHero.fy*0.06)
				this.beat(Math.abs(m),1)
			}
			if(this.myEquipName.includes('心之钢') || this.myEquipName.includes('时光杖')) {
				let time = parseInt(this.min) * 60 + parseInt(this.second)
				if(time - this.xinzhigang >= 15){
					if(this.myEquipName.includes('心之钢')){this.myHero.blood += 200}
					if(this.myEquipName.includes('时光杖')){
						this.myHero.gj += 6;
						this.myHero.fs += 10
						this.myHero.fy += 3
						this.myHero.blood += 100
					}
					this.xinzhigang = time
				}
				if(this.xinzhigang == 0){
					this.xinzhigang = time
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
			if(this.myHero.name == '托塔天王' || this.myHero.id == 21){
				if(this.bloodVal2 < 40){	//宝塔护体
					if(this.myHero.fy < 150){
						this.myHero.fy = 180
					}else if(this.myHero.fy < 200){
						this.myHero.fy = 210
					}
				}
			}
			//艾欧尼亚之心
			if(this.myHero.id == 1015) {
				this.myHero.fs = this.myHero.fs + 1
			}
			//对手技能
			if(this.enemy.name == '地府-阎王'){
				if(this.randomNum(0,1) == 1){
					setTimeout(()=>{
						this.consistEnemyBeat(30,200,1000)
					},3000)
				}
			}
			if(this.enemy.name == '人间-花木兰'){
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_hml') == -1 && this.distanceComp(120)){
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hml2.gif?'+ new Date().getTime()
					this.backBgImg('fb_hml2',2500,1)
					uni.showToast({
						title: '兄长，吃我一剑！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('兄长，吃我一剑！',true,4,2000,'aicheng')
					this.enChongci(120)
					setTimeout(()=>{
						this.enemyBeat2(this.harmComputer(3,0,this.randomNum(100,300)))
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
					this.playVoice('兄长，看招！',true,5,2000,'aicheng')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_hml.gif?'+ new Date().getTime()
					this.backBgImg('fb_hml',4200,1)
					let val = this.harmComputer(3,0,this.randomNum(100,200))
					this.enemyBeat2(val)
					this.playVoice('../../static/sounds/soonGJ.wav',true,7,2000)
					if(this.myHero.fy > 5){
						this.myHero.fy -= 5
					}
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
				}
			}
			if(this.enemy.name == '人间-项羽'){
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_xy') == -1){
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_xy.gif?'+ new Date().getTime()
					this.backBgImg('fb_xy',2300,1)
					this.enemy.gj = parseInt(this.enemy.gj) + 25
					this.enemy.fy = parseInt(this.enemy.fy) + 20
					this.enemy.mk = parseInt(this.enemy.mk) + 20
					this.blood1 = parseInt(this.blood1) + 100
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					uni.showToast({
						title: '永不畏缩！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('永不畏缩！',true,5,2000,'zhifeng_emo')
					setTimeout(()=>{
						this.enemy.gj = parseInt(this.enemy.gj) - 25
						this.enemy.fy = parseInt(this.enemy.fy) - 20
						this.enemy.mk = parseInt(this.enemy.mk) - 20
					},3500)
				}
				if(this.randomNum(0,2) == 1 && this.enmoveModel == 2){
					uni.showToast({
						title: '逆贼！休想跑！',
						icon:'none',
						duration: 800
					});
					this.playVoice('逆贼！休想跑！',true,6,2000,'zhifeng_emo')
					this.enChongci(50,1)
				}
			}
			if(this.enemy.name == '人间-刘邦'){
				if(this.randomNum(0,2) == 1 && this.distanceComp(75)){
					uni.showToast({
						title: '杀！杀！杀！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('杀！杀！杀！',true,5,2000,'zhifeng_emo')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_lb.gif?'+ new Date().getTime()
					this.backBgImg('fb_lb',2000,1)
					let v = 90
					this.consistEnemyBeat(v,100,600)
				}
			}
			if(this.enemy.name == '人间-赵云'){
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_zzl') == -1 && this.distanceComp(75)){
					uni.showToast({
						title: '在下赵子龙也',
						icon:'none',
						duration: 1500
					});
					this.playVoice('在下！赵子龙也！',true,5,2000,'xiaogang')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_zzl.gif?'+ new Date().getTime()
					this.backBgImg('fb_zzl',2000,1)
					setTimeout(()=>{
						this.enemyBeat2(this.harmComputer(3)+this.randomNum(10,80))
					},1500)
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_zzl') == -1 && this.distanceComp(120)){
					this.enChongci(120)
					this.enemyBeat2(this.harmComputer(3)+this.randomNum(10,80))
				}
			}
			if(this.enemy.name == '人间-张天志'){
				if(this.randomNum(0,2) == 1 && this.distanceComp(110)){
					uni.showToast({
						title: '吃我一招',
						icon:'none',
						duration: 1500
					});
					this.playVoice('吃我一招！',true,5,2000,'laotie')
					this.enChongci(110)
					this.enemyBeat2(this.harmComputer(3)+this.randomNum(10,200))
				}
				if(this.randomNum(0,3) == 2 && this.distanceComp(85)){
					uni.showToast({
						title: '在下咏春张天志',
						icon:'none',
						duration: 1500
					});
					this.playVoice('在下咏春张天志！',true,6,2000,'laotie')
					let v = this.randomNum(50,90)
					this.consistEnemyBeat(v,100,600+this.randomNum(0,6)*100)
				}
				if(this.randomNum(0,2) == 1 && this.distanceComp(95)){
					uni.showToast({
						title: '咏春飞踢',
						icon:'none',
						duration: 1000
					});
					this.playVoice('咏春飞踢！',true,7,2000,'laotie')
					if(this.enemyX<this.characterX){
						this.characterX = this.characterX + 110
					}else{
						this.characterX = this.characterX - 110
					}
					this.enemyBeat2(this.harmComputer(3)+this.randomNum(50,350))
					if(this.randomNum(0,1) == 1 && this.distanceComp(110)){
						this.enChongci(110)
						this.enemyBeat2(parseInt(this.enemy.gj)*3 - parseInt(this.myHero.fy)+this.randomNum(10,150))
					}
				}
			}
			if(this.enemy.name == '人间-曹操'){
				if(this.randomNum(0,2) == 1 && this.distanceComp(120)){
					this.enChongci(120)
					this.enemyBeat2(this.harmComputer(3,0,200))
					uni.showToast({
						title: '贼寇休走',
						icon:'none',
						duration: 1000
					});
					this.playVoice('贼寇休走！',true,4,2000,'zhifeng_emo')
				}
			}
			if(this.enemy.name == '人间-关羽'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_gy') == -1 && this.distanceComp(85)){
					uni.showToast({
						title: '来者何人，报上名来',
						icon:'none',
						duration: 1500
					});
					this.playVoice('来者何人？报上名来！',true,4,2000,'zhifeng_emo')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_gy.gif?'+ new Date().getTime()
					this.backBgImg('fb_gy',4700,1)
					setTimeout(()=>{
						let v = this.randomNum(30,80)
						this.consistEnemyBeat(v,500,4700)
					},500)
				}
				if(this.bloodVal1 <= 30 && this.bloodVal1 > 2 && this.engjAnm.indexOf('fb_gy') == -1 && this.distanceComp(125)){
					uni.showToast({
						title: '我和你拼了！！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('我和你拼了！',true,5,2000,'zhifeng_emo')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_gy.gif?'+ new Date().getTime()
					this.backBgImg('fb_gy',2200,1)
					this.enChongci(125)
					setTimeout(()=>{
						let v = this.randomNum(30,60)
						this.consistEnemyBeat(v,200,2200)
					},500)
				}
			}
			if(this.enemy.name == '妖族-鬼'){
				if(this.randomNum(0,2) == 1){
					this.fasheArrow(380,1,45,"敌方射击",1,4,3)
				}
				if(this.randomNum(0,2) == 2){
					this.fasheArrow(325,1,32,"敌方射击-高伤害",1,2,2)
				}
				if(this.randomNum(0,2) == 0){
					this.fasheArrow(285,1,32,"妖族-鬼",1,16,1)
				}
			}
			if(this.enemy.name == '妖族-奎木狼'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_kml') == -1 && this.distanceComp(130)){
					uni.showToast({
						title: '看招',
						icon:'none',
						duration: 1200
					});
					this.playVoice('看招！',true,5,2000,'zhifeng_emo')
					this.enChongci(130)
					//禁锢
					this.tallentExpert(1,2,1500)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_kml.gif?'+ new Date().getTime()
					this.backBgImg('fb_kml',900,1)
					setTimeout(()=>{
						this.enemyBeat2(this.harmComputer(3)+this.randomNum(100,300))
					},300)
				}
			}
			
			if(this.enemy.name == '妖族-白素贞'){
				if(this.randomNum(0,3) == 2){
					this.fasheArrow(320,1,36,"百花仙子",2,4,1)
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_bsz') == -1 && this.distanceComp(105) && !this.enFlagTime2){
					uni.showToast({
						title: '我要抽干你的血！',
						icon:'none',
						duration: 1200
					});
					
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_bsz.gif?'+ new Date().getTime()
					this.backBgImg('fb_bsz',5000,1)
					this.playVoice('我要抽干你的血！',true,4,2000,'maoxiaomei')
					this.consistEnemyBeat(65+this.randomNum(0,30),300,3000)
					this.enemyConsistAddBlood(50+this.randomNum(0,20),300,3000)
				}
			}
			if(this.enemy.name == '妖族-石矶娘娘'){
				if(this.randomNum(0,2) == 1 && this.distanceComp(100)){
					uni.showToast({
						title: '给我灰飞烟灭！',
						icon:'none',
						duration: 1200
					});
					this.playVoice('给我灰飞烟灭！',true,4,2000,'xiaoxian')
					this.tallentExpert(3,1,2500)
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						this.enemyBeat2(this.harmComputer(3)+this.randomNum(150,380))
					},300)
				}
				if(this.bloodVal1 <= 23 && this.bloodVal1 > 2){
					if(this.randomNum(0,2) == 1){
						this.enemyConsistAddBlood(50,100,1500)
						uni.showToast({
							title: '嘿！挺能打的嘛',
							icon:'none',
							duration: 1500
						});
						this.playVoice('嘿！挺能打的嘛',true,5,2000,'xiaoxian')
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
						this.playVoice('眼前是哪位勇士',true,4,2000,'laotie')
						this.showEngjAnm = true
						this.engjAnm = '../../static/imgs/hero/fb_bhlw.gif?'+ new Date().getTime()
						this.playVoice('../../static/sounds/jiguangbo.wav',false,6,3000)
						if(this.enspeed >= 0.6){
							this.enspeed = this.enspeed - 0.3
						}
						this.backBgImg('fb_bhlw',5300)
						this.enemyConsistAddBlood(90,300,2700)
						let self = this
						if(self.distanceComp(100) && Math.abs(this.characterY - this.enemyY) < 35){
							setTimeout(()=>{
								self.enemyBeat2(this.harmComputer(3) + self.randomNum(150,300))
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
			if(this.enemy.name == '妖族-西海龙王'){
				if(this.randomNum(0,3) == 2 && this.engjAnm.indexOf('fb_lkz') == -1){
					uni.showToast({
						title: '裂空爪！',
						icon:'none',
						duration: 1000
					});
					this.playVoice('裂空爪',true,4,2000,'siqi')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_lkz.gif?'+ new Date().getTime()
					this.backBgImg('fb_lkz',4000)
					setTimeout(()=>{
						this.yinshen2 = true
						this.enNoMove = true
						setTimeout(()=>{
							this.enNoMove = false
							this.enChongci(3000)
							setTimeout(()=>{
								this.yinshen2 = false
								this.enemyBeat2(this.harmComputer(3) + this.randomNum(100,300))
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
					this.playVoice('走了！再见',true,5,2000,'siqi')
					this.yinshen2 = true
					setTimeout(()=>{
						this.yinshen2 = false
					},2500+this.randomNum(0,3)*1200)
				}
			}
			if(this.enemy.name == '神-哪吒'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_nz2') == -1){
					uni.showToast({
						title: '哪吒在此！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('哪吒在此！',true,4,2000,'aiying')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_nz2.gif?'+ new Date().getTime()
					this.backBgImg('fb_nz2',1500)
					this.playVoice('../../static/sounds/jiguangbo.wav',false,6,3000)
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
					this.playVoice('我命！由我不由天！',true,5,2000,'aiying')
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
					this.playVoice('八仙过海！',true,5,2000,'xiaogang')
					var sp = this.enspeed
					this.enspeed = 0.2
					setTimeout(()=>{
						this.enspeed = sp
					},3000)
					this.playVoice('../../static/sounds/rain.wav',false,6,3000)
					if(this.distanceComp(100)){
						this.delayTel(1500,0)
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
					this.playVoice('杀！杀！杀！',true,4,2000,'laotie')
					this.playVoice('../../static/sounds/lianji.wav',false,6,5000)
					this.consistEnemyBeat(this.randomNum(20,70),100,1200)
				}
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_swtb') == -1){
					uni.showToast({
						title: '集合！',
						icon:'none',
						duration: 2500
					});
					this.playVoice('集合！',true,5,2000,'laotie')
					this.showEngjAnm = true
					this.enDuobi(60)
					this.engjAnm = '../../static/imgs/hero/fb_swtb.gif?'+ new Date().getTime()
					this.backBgImg('fb_swtb',6500)
					this.enemyConsistAddBlood(160,500,2500)
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
					this.playVoice('持国天王：破！',true,4,2000,'laotie')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw3.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw3',1000)
					let val = this.harmComputer(3) + this.randomNum(200,800)
					setTimeout(()=>{
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
					this.playVoice('多闻天王：转！',true,5,2000,'laotie')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw2.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw2',1600)
					this.fasheArrow(2000,1,35,"无",1,11)
					this.enemyConsistAddBlood(60+this.randomNum(0,60),200,1600)
					this.playVoice('../../static/sounds/lianji.wav',false,7,5000)
					if(this.distanceComp(150) && Math.abs(this.characterY - this.enemyY) < 35){
						this.consistEnemyBeat(this.randomNum(20,35),100,1600)
					}
				}
				if(this.randomNum(0,4) == 1 && this.engjAnm.indexOf('fb_sdtw') == -1 && this.enspeed != 0.5){
					uni.showToast({
						title: '增长天王：进！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('增长天王：进！',true,6,2000,'laotie')
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
					this.playVoice('广目天王：电！',true,7,2000,'laotie')
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_sdtw4.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw4',1200)
					if(this.distanceComp(150)){
						this.tallentExpert(4,2,3500)
					}
					this.fasheArrow(320,1,35,"敌方射击-高伤害",1,13)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1000)
				}
			}
			if(this.enemy.name == '神-金蝉子'){
				if(this.randomNum(0,3) == 1 && !this.showVideo2){
					this.playMovies2(1,'jinchanzi',true)
					uni.showToast({
						title: '罗汉翻天印',
						icon:'none',
						duration: 1500
					});
					this.playVoice('罗汉翻天印',true,4,2000,'aicheng')
					setTimeout(()=>{
						this.fasheArrow(360,1,39,"神-金蝉子",1,20)
					},2000)
				}
				if(this.randomNum(0,3) == 3 && !this.showVideo2){
					this.fasheArrow(410,1,33,"敌方射击-高伤害",1,13)
				}
			}
			
			if(this.enemy.name == '神-二郎神杨戬'){
				if(this.randomNum(0,3) == 1 && this.engjAnm.indexOf('fb_yj') == -1 && this.distanceComp(100)){
					uni.showToast({
						title: '杨戬在此！谁敢造次',
						icon:'none',
						duration: 2000
					});
					this.playVoice('杨戬在此！谁敢造次',true,4,2000,'laotie')
					this.playVoice('../../static/sounds/soonGJ.wav',true,7,2000)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_yj.gif?'+ new Date().getTime()
					this.backBgImg('fb_yj',3000)
					this.enemy.gj = this.enemy.gj + 56
					setTimeout(()=>{
						this.blood1 = parseInt(this.blood1) + 900
						this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
						this.enemyBeat2(this.randomNum(180,500))
						this.enemy.gj = this.enemy.gj - 56
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1000)
					},3000)
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_yj') == -1){
					if(this.distanceComp(150) && Math.abs(this.characterY - this.enemyY) < 35){
						let val = this.harmComputer(3) + this.randomNum(100,300)
						this.enemyBeat2(val)
					}
				}
			}
			if(this.enemy.name == '神-齐天大圣'){
				if(this.randomNum(0,1) == 1 && this.bloodVal1 <= 33 && this.bloodVal1 > 2){
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					uni.showToast({
						title: '此地不宜久留！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('../../static/sounds/cdbyjl.mp3',true,4,2500)
				}
				if(this.randomNum(0,2) == 1 && this.engjAnm.indexOf('fb_swk') == -1 && this.distanceComp(120)){
					uni.showToast({
						title: '妖怪哪里跑！',
						icon:'none',
						duration: 1500
					});
					this.playVoice('../../static/sounds/ygnlp.mp3',false,6,3500)
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_swk.gif?'+ new Date().getTime()
					this.backBgImg('fb_swk',2000)
					this.playVoice('../../static/sounds/qtds3.wav',true,7,2000)
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
						this.playVoice('../../static/sounds/calsyb.mp3',false,4,2500)
						let val = this.harmComputer(3) + this.randomNum(200,500)
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
					this.showEngjAnm = true
					this.engjAnm = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
					this.backBgImg('fb_qtds',3000)
					this.playVoice('../../static/sounds/qtds1.wav',true,5,2000)
					uni.showToast({
						title: '吃俺老孙一棒！',
						icon:'none',
						duration: 1000
					});
					this.playVoice('../../static/sounds/calsyb.mp3',false,4,2500)
					let val = this.harmComputer(3) + this.randomNum(200,500)
					setTimeout(()=>{
						this.enemyBeat2(val)
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},2000)
					},2200)
				}
			}
			this.computeDistance()
			//百花仙子
			if(this.enemy.id == 1002 && this.enImmunity && this.distance <= 150){
				let val = parseInt(this.enemy.gj*1.5)
				this.enemyBeat2(val)
			}
			if(this.myHero.id == 1002 && this.myImmunity && this.distance <= 150){
				let val = parseInt(this.myHero.fs*1.2) + parseInt(this.addData.add11)*50
				if(parseInt(this.addData.strongIndex) == 1){
					val = val + parseInt(this.myHero.fs*0.5)
				}
				this.beat(val,1)
			}
		},
		//已方发动技能触发事件
		heroHarm () {
			if(this.myEquipName.includes('兰德里的折磨') && !this.beatTime){
				this.consistBeat(80+parseInt(this.myHero.fs*0.23),700,2800)
			}
			if(this.myEquipName.includes('残疫') && !this.beatTime){
				this.consistBeat(50+parseInt(this.myHero.fs*0.15),1000,3000)
				this.enemy.mk -= 1
			}
			if(this.myEquipName.includes('星界驱驰') && !this.beatTime){
				this.heroAddSpeed(30,2000)
			}
			if(this.myEquipName.includes('风暴狂涌') && !this.beatTime){
				setTimeout(()=>{
					this.beat(this.reallyRandom(1,3)*100+50+parseInt(this.myHero.fs*0.5),1)
				},2000)
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
			if(this.myEquipName.includes('降龙剑') && this.gameType == 'spt'){
				this.addBlood(parseInt(this.harm*0.15)+parseInt(this.blood1*0.02),0,0)
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
			if(this.myEquipName.includes('炼狱龙魂')){
				let val = 60 + this.reallyRandom(0,5)*15
				this.consistBeat(val,500,1520)
			}
			if(this.myEquipName.includes('仙灵雨翼扇')){
				this.regGjAdd.gjHarm = this.regGjAdd.gjHarm + parseInt(this.myHero.fs*1.3)
				setTimeout(()=>{
					this.regGjAdd.gjHarm = this.regGjAdd.gjHarm - parseInt(this.myHero.fs*1.3)
				},3000)
			}
			this.directType = false
			this.directType2 = false
			this.directType3 = false
			this.directType4 = false
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
				this.showWinLogo = true
				setTimeout(()=>{
					this.showWinLogo = false
				},2500)
				this.ygbj = false
				this.blood1 = 0
				this.bloodVal1 = 0
				this.bettleEnd = true
				this.addLog(1)
				clearInterval(this.time1)
				clearInterval(this.beatTime)
				this.beatTime = null
				this.gameLoop()
			}
		},
		//计算法力值
		blueComput(val,type) {
			if(type == 'reduce'){
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
				if(this.cd1){
					clearTimeout(this.cd1)
					this.cd1 = null
				}
				this.cd1 = setTimeout(()=>{
					if(this.$refs.tallents){
						this.$refs.tallents.tallentShow = true
					}
					this.cd1 = null
				},time)
			}
			if(num == 2){
				if(this.cd2){
					clearTimeout(this.cd2)
					this.cd2 = null
				}
				this.cd2 = setTimeout(()=>{
					if(this.$refs.tallents){
						this.$refs.tallents.tallentShow2 = true
					}
					this.cd2 = null
				},time)
			}
			if(num == 3){
				if(this.cd3){
					clearTimeout(this.cd3)
					this.cd3 = null
				}
				this.cd3 = setTimeout(()=>{
					if(this.$refs.tallents){
						this.$refs.tallents.tallentShow3 = true
					}
					this.cd3 = null
				},time)
			}
			if(num == 4){
				if(this.cd4){
					clearTimeout(this.cd4)
					this.cd4 = null
				}
				this.cd4 = setTimeout(()=>{
					if(this.$refs.tallents){
						this.$refs.tallents.tallentShow4 = true
					}
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
			if(this.myEquipName.includes('残疫')) {
				addTalent4 += 2
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
				//被动
				this.myHero.fy = parseInt(this.myHero.fy) + 2
				this.playVoice('../../static/sounds/dmxyzl'+num+'.wav',true,num-1,5000)
				if(num == 1){
					this.cd(5500 - addTalent*150,1)
					this.blueComput(70 + addTalent*6,'reduce')
					this.playMovies(1,strongIndex)
					if(this.distanceComp(75)){
						setTimeout(()=>{
							let val = this.harmComputer(1,addTalent,120+addTalent*35,1.5)
							this.beat(val)
						},800)
						//沉默1.5秒
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1500)
					}else{
						this.heroAddSpeed(55,2500)
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
					this.playMovies(3,strongIndex)
					setTimeout(()=>{
						this.blueComput(70 + addTalent3*10,'reduce')
						let val = this.harmComputer(1,0,12+addTalent3*4,0.5)
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
					cval = (parseInt(this.enemy.blood) - parseInt(this.blood1))*(0.25+addTalent4*0.035)
					
					let val = parseInt(cval) + 200 + addTalent4*50
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
						let val = this.harmComputer(2,0,250+addTalent*60,0.8)
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
								this.heroAddSpeed(30,4000)
							}
							this.myHero.fs = parseInt(this.myHero.fs) - 30
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
					let val = this.harmComputer(1,addTalent,300 + this.xuli,1.3) + randomVal
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
					this.xuli = parseInt(this.myHero.fs * (2.2 + addTalent2*0.25)) + 250 + addTalent2*35
					if(strongIndex == 3){
						this.xuli = this.xuli + this.myHero.gj
					}
					this.blueComput(70 + addTalent2*10,'reduce')
				}
				if(num == 3){
					this.cd(8000 - addTalent3*300,3)
					this.playVoice('../../static/sounds/wuqi3.wav',false,2,4000)
					this.delayTel(500,num)
					this.blueComput(100 + addTalent3*15,'reduce')
					this.playMovies(3,strongIndex)
					this.myHero.fy = parseInt(this.myHero.fy) + 200
					let val = this.harmComputer(1,addTalent3,Math.round(this.shotVal1*0.5) + 200 + randomVal,1)
					if(val<=0){
						val = randomVal
					}
					setTimeout(()=>{
						this.beat(val,1)
						if(strongIndex == 2 || strongIndex == 3){
							if(parseFloat(this.myHero.v)>=0.6){
								this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.3 + addTalent*0.04)).toFixed(2)
								setTimeout(()=>{
									this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.3 + addTalent*0.04)).toFixed(2)
								},3000)
							}
						}
						this.tallentExpert(2,1,2500 + addTalent3*200)
						this.myHero.fy = parseInt(this.myHero.fy) - 200
					},2500 + addTalent3*200)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.delayTel(1000,num)
					this.playMovies(4,strongIndex)
					if(strongIndex == 2){
						this.$refs.tallents.tallentShow = true
						this.$refs.tallents.tallentShow2 = true
						this.$refs.tallents.tallentShow3 = true
					}else if(strongIndex == 0){
						this.playVoice('../../static/sounds/wuqi4.wav',false,3,5800)
						this.heroAnm('../../static/imgs/hero/wqds.gif?'+ new Date().getTime())
						this.backBgImg('wqds',1500)
					}
					if(strongIndex == 3){
						this.heroAddSpeed(40,5000)
						this.addBlood(parseInt(parseInt(this.myHero.blood)*0.025),300,3000)
					}else{
						this.heroAddSpeed(25,5000)
					}
					this.myHero.fy = parseInt(this.myHero.fy) + 30 + addTalent4*10
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy) - 30 - addTalent4*10
					},5000)
					let val =  this.harmComputer(1,addTalent4,this.myHero.fs+500+addTalent4*50+randomVal,1)
					this.blueComput(100 + addTalent4*25,'reduce')
					setTimeout(()=>{
						this.beat(val)
					},2000)
				}
			}
			if(this.myHero.name == '无极剑圣' || this.myHero.id == 4){
				//被动
				this.regGjAdd.gjHarm = parseInt(this.myHero.fs*0.6) + 50
				if(strongIndex == 1 || strongIndex == 3){
					this.regGjAdd.addBlood = this.myHero.gj + 100
				}
				this.playVoice('../../static/sounds/jiansheng'+num+'.wav',true,num-1,4000)
				if(num == 1){
					this.cd(4500 - addTalent*200,1)
					this.delayTel(500,num)
					this.blueComput(65 + addTalent*8,'reduce')
					this.heroChongci(this.myHero.dis1)
					let val = this.harmComputer(1,addTalent,250,1.5)
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
					if(strongIndex == 2){
						this.playMovies(2,strongIndex)
					}
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
					if(strongIndex == 3){
						this.heroAddSpeed(70,2500 + addTalent3*100)
						this.playMovies(3,strongIndex,false,true)
					}else{
						this.heroAddSpeed(40,2500 + addTalent3*100)
						this.playMovies(3,strongIndex)
					}
					this.regGjAdd.gjHarm = val
					if(strongIndex == 3){
						this.regGjAdd.gjHarm = this.regGjAdd.gjHarm + 150 + addTalent3*35
					}
					setTimeout(()=>{
						this.regGjAdd.gjHarm = parseInt(this.myHero.fs*1.2) + 50
					},5000)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.delayTel(1000,num)
					this.blueComput(120 + addTalent4*20,'reduce')
					if(strongIndex == 3){
						this.playMovies(4,strongIndex,false,true)
					}else{
						this.heroAnm('../../static/imgs/hero/wjjs.gif?'+ new Date().getTime())
						this.backBgImg('wjjs',5000)
					}
					let val = this.harmComputer(1,0,60+addTalent4*40,0.5)
					if(val <= 60){
						val = this.randomNum(60,100)
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
						let val = this.harmComputer(2,addTalent,250,1)
						this.beat(val)
					},1000)
				}
				if(num == 2){
					this.cd(6000 - addTalent2*250,2)
					this.delayTel(500,num)
					this.playMovies(2,strongIndex)
					setTimeout(()=>{
						this.blueComput(80 + addTalent2*10,'reduce')
						this.myHero.fy = parseInt(this.myHero.fy) + 35 + addTalent2*6
						this.myHero.fs = parseInt(this.myHero.fs) + 60 + addTalent2*10
						setTimeout(()=>{
							this.myHero.fy = parseInt(this.myHero.fy) - 35 - addTalent2*6
							this.myHero.fs = parseInt(this.myHero.fs) - 60 - addTalent2*10
							let val = this.harmComputer(2,addTalent2,100,1)
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
						let val = this.harmComputer(2,addTalent3,350 + addVal,1)
						if(strongIndex == 1){
							val = this.harmComputer(2,addTalent3,550 + parseInt(addVal*1.3),1)
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
					if(strongIndex == 0){
						this.heroAnm('../../static/imgs/hero/cer.gif?'+ new Date().getTime())
						this.backBgImg('cer',3600)
					}
					this.playMovies(4,strongIndex)
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
							this.heroAddSpeed(40,3500)
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
						this.enemy.gj = parseInt(this.enemy.gj*0.6)
						setTimeout(()=>{
							this.enemy.gj = parseInt(this.enemy.gj/0.6)
							this.enemy.gj = this.enemy.gj - 3 - addTalent
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
					let val = this.harmComputer(2,addTalent3,250,1)
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
								this.fasheArrow(780,2,25,this.myHero.id,1,1,2)
							}else{
								this.fasheArrow(650,2,25,this.myHero.id,1,1,2)
							}
						},1000)
					}else{	//步枪
						this.cd(1200 - addTalent*30,1)
						this.blueComput(15 + addTalent*3,'reduce')
						if(strongIndex == 1){
							this.fasheArrow(550,2,22,this.myHero.id,1,12,1)
						}else{
							this.fasheArrow(420,2,22,this.myHero.id,1,12,1)
						}
					}
				}
				if(num == 2){
					//手榴弹
					if(this.ygbj){
						this.cd(5500 - addTalent2*300,2)
						this.blueComput(50 + addTalent2*10,'reduce')
						let val = this.harmComputer(2,addTalent2,250 + this.randomNum(250,250+this.myHero.gj*3.5),1)
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
					this.heroAddSpeed(30 + addTalent3*3,3000)
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
						this.playMovies(4,strongIndex)
					}else{
						this.cd(7500 - addTalent4*300,4)
						this.heroAnm('../../static/imgs/hero/jyzs2.gif?'+ new Date().getTime())
						this.backBgImg('jyzs2',5000)
					}
					setTimeout(()=>{
						this.fasheArrow(2000,2,38,this.myHero.id,4,3,1)
					},1000)
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
						this.cd(7200 - addTalent2*100,2)
					}else{
						this.cd(9500 - addTalent2*200,2)
					}
					this.delayTel(1000,num)
					setTimeout(()=>{
						this.blueComput(80+addTalent2*8,'reduce')
						this.fasheArrow(600,2,100,this.myHero.id,2,7)
					},1000)
				}
				if(num == 3){
					this.cd(6500 - addTalent3*250,3)
					this.delayTel(500,num)
					this.playMovies(3,strongIndex)
					setTimeout(()=>{
						this.blueComput(35+addTalent3*8,'reduce')
						this.myHero.fs = Math.ceil(parseInt(this.myHero.fs) + parseInt(this.myHero.fs)*0.3 + 30 + addTalent3*20)
						setTimeout(()=>{
							this.myHero.fs = parseInt(this.myHero.fs) - 30 - addTalent3*20
							this.myHero.fs = Math.ceil(parseInt(this.myHero.fs) - parseInt(this.myHero.fs)*0.25)
						},3000)
					},500)
				}
				if(num == 4){
					this.cd(15000 - addTalent4*500,4)
					this.delayTel(2000,num)
					this.blueComput(150+addTalent4*25,'reduce')
					this.playMovies(4,strongIndex,true)
					//沉默1.5秒
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
					this.tallentExpert(3,1,3000+addTalent4*250)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent4,550+this.randomNum(250,500+addTalent4*100),1.3)
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
					this.playMovies(1,strongIndex,true,true)
					setTimeout(()=>{
						this.blueComput(70 + addTalent*10,'reduce')
						let val = this.harmComputer(1,addTalent,300,1.1)
						if(strongIndex == 1){
							val = val + 150
						}
						if(!this.distanceComp(70)){
							val = this.harmComputer(1,addTalent,380,1.4)
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
						let val = this.harmComputer(1,addTalent2,250,1)
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
					if(strongIndex == 1){
						this.playMovies(4,strongIndex,false,true)
					}else{
						this.heroAnm('../../static/imgs/hero/dtt.gif?'+ new Date().getTime())
						this.backBgImg('dtt',2200)
					}
					let cval = 0
					//敌方生命值小于35%
					if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.35){
						cval = parseInt(this.myHero.gj*0.7) + 250 + addTalent4*50
					}
					let val = this.harmComputer(1,addTalent4,500 + cval + parseInt(this.xuli)*170 + addTalent4*120,1)
					setTimeout(()=>{
						this.beat(val)
						this.xuli = 0
					},1300)
				}
			}
			if(this.myHero.name == '探险家' || this.myHero.id == 10){
				this.playVoice('../../static/sounds/txj'+num+'.wav',true,num-1,3000)
				if(num == 1){
					// this.delayTel(100,num)
						this.cd(4000 - addTalent*250,1)
						this.blueComput(35 + addTalent*6,'reduce')
						this.fasheArrow(220,2,30,this.myHero.id,1,1,5)
				}
				if(num == 2){
					this.cd(6500 - addTalent2*150,2)
					// this.delayTel(500,num)
					this.heroAnm('../../static/imgs/hero/ez1.gif?'+ new Date().getTime())
					this.backBgImg('ez1',1000)
					this.blueComput(35 + addTalent2*6,'reduce')
					this.fasheArrow(185,2,25,this.myHero.id,2,4,5)
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
					// this.delayTel(1500,num)
					this.blueComput(100 + addTalent4*15,'reduce')
					if(strongIndex == 1){
						this.playMovies(4,strongIndex)
					}else{
						this.heroAnm('../../static/imgs/hero/ez2.gif?'+ new Date().getTime())
						this.backBgImg('ez2',2200)
					}
					setTimeout(()=>{
						this.fasheArrow(2000,2,40,this.myHero.id,4,6,2)
					},1500)
				}
			}
			if(this.myHero.name == '齐天大圣' || this.myHero.id == 101){
				this.playVoice('../../static/sounds/qtds'+num+'.wav',true,num-1,4000)
				if(num == 1){
					this.delayTel(2900,num)
					this.playVoice('../../static/sounds/calsyb.mp3',false,7,2500)
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
					if(strongIndex == 3){
						this.playMovies(1,strongIndex)
					}else{
						this.heroAnm('../../static/imgs/hero/swk1.gif?'+ new Date().getTime())
					}
					this.backBgImg('swk1',2900)
					let val = this.harmComputer(1,addTalent,450,1.5)
					if(strongIndex == 2){
						val = val+(this.myHero.gj*1.5)
					}
					setTimeout(()=>{
						this.beat(val)
						//三昧真火
						if(strongIndex == 3){
							this.consistBeat(this.randomNum(30+parseInt(this.myHero.gj*0.1),70+parseInt(this.myHero.gj*0.2)),500,1500)
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
					this.enemyMoveContrl(1)
					let strong = 0
					if(strongIndex == 1){
						this.heroAddSpeed(70 + addTalent2*5,4500 + addTalent2*120)
						strong = 1500
					}else{
						this.heroAddSpeed(45 + addTalent2*5,3000 + addTalent2*120)
					}
					this.heroChongci(40 + addTalent2*5,1)
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
					if(this.reallyRandom(0,1) == 0){
						this.playVoice('../../static/sounds/ygnlp.mp3',false,6,3600)
					}else{
						this.playVoice('../../static/sounds/alsly.mp3',false,6,3600)
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
					let val = this.harmComputer(1,addTalent3,400,1)
					if(this.yinshen){
						val += parseInt(this.myHero.gj)
						this.shotDown = false
					}
					this.beat(val)
					//三昧真火
					if(strongIndex == 3){
						this.consistBeat(this.randomNum(30+parseInt(this.myHero.gj*0.1),70+parseInt(this.myHero.gj*0.2)),500,1500)
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
					let val = this.harmComputer(1,0,50 + addTalent4*20,0.35)
					  if(val < 35){
						  val = 35
					  }
					  let beatTime = setInterval(()=>{
					  	this.beat(val,1)
					  },300)
					  setTimeout(()=>{
					  	clearInterval(beatTime)
					  },5000)
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
					this.cd(5500 - addTalent*500,1)
					this.blueComput(70 + addTalent*10,'reduce')
					let val = this.harmComputer(1,addTalent,300,1.3)
					let cval = parseInt(val*0.6)
					if(this.xuli == 1){
						val = val + cval
					}
					if(this.xuli == 2 && this.reallyRandom(0,3) != 1){
						val = val + cval + val*0.5
					}
					if(strongIndex == 2 || strongIndex == 1 || strongIndex == 3){
						val = val + 180
					}
					this.beat(val)
				}
				if(num == 2){
					let heroimg = 'jie.jpg'
					if(strongIndex == 1){
						heroimg = 'cjzr.jpg'
					}
					if(strongIndex == 2){
						heroimg = 'msts.jpg'
					}
					if(strongIndex == 3){
						heroimg = 'jhjp.jpg'
					}
					//与分身互换位置
					if(this.ylzz != null && !this.ygbj){
						let objlist = []
						this.mapObjects.map(i=>{
							if(i.img == 'hero/'+heroimg){
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
						if(strongIndex == 2 || strongIndex == 1|| strongIndex == 3){
							left = -90 + addTalent2*5
						}else{
							left = -70 + addTalent2*5
						}
					}
					if(this.heroMoveType == 2){
						if(strongIndex == 2 || strongIndex == 1|| strongIndex == 3){
							left = 90 + addTalent2*5
						}else{
							left = 70 + addTalent2*5
						}
					}
					
					// 添加分身到地图上
					 this.mapObjects.push({
						left: this.characterX + left,
						top: this.characterY,
						img: 'hero/'+heroimg
					 });
					 this.myHero.dis1 = this.myHero.dis1 + 86
					 this.myHero.dis3 = this.myHero.dis3 + 86
					setTimeout(()=>{
						this.xuli -= 1
						this.myHero.dis1 = this.myHero.dis1 - 86
						this.myHero.dis3 = this.myHero.dis3 - 86
						this.ygbj = false
						this.cd(6000 - addTalent2*450,2)
						this.mapObjects.map((i,d)=>{
							if(i.img == 'hero/'+heroimg && !i.name){
								this.mapObjects.splice(d,1)
							}
						})
					},4000+addTalent2*500)
				}
				if(num == 3){
					this.delayTel(70,num)
					this.cd(4000 - addTalent3*330,3)
					this.blueComput(50 + addTalent3*6,'reduce')
					if(strongIndex == 0){
						this.playMovies(3,strongIndex,true)
					}
					let h = this.harmComputer(1,addTalent3,200,1.1)
					let val = h + this.randomNum(0,100)
					let cval = parseInt(val*0.6)
					if(this.xuli == 1){
						val = val + cval
					}
					this.beat(val)
				}
				if(num == 4){
					let heroimg = 'jie.jpg'
					if(strongIndex == 1){
						heroimg = 'cjzr.jpg'
					}
					if(strongIndex == 2){
						heroimg = 'msts.jpg'
					}
					if(strongIndex == 3){
						heroimg = 'jhjp.jpg'
					}
					let objlist = []
					this.mapObjects.map(i=>{
						if(i.img == 'hero/'+heroimg){
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
					this.playMovies(4,strongIndex,true)
					// setTimeout(()=>{
					// 	this.heroAnm('../../static/imgs/hero/jie2.gif?'+ new Date().getTime())
					// 	this.backBgImg('jie2',1500)
					// },1000)
					// 添加分身到地图上
					 this.mapObjects.push({
						 name: 'big',
						left: this.characterX,
						top: this.characterY,
						img: 'hero/'+heroimg
					 });
					 
					 this.myHero.dis1 = this.myHero.dis1 + 40
					 this.myHero.dis3 = this.myHero.dis3 + 40
					setTimeout(()=>{
						this.myHero.dis1 = this.myHero.dis1 - 40
						this.myHero.dis3 = this.myHero.dis3 - 40
						this.xuli -= 1
						this.mapObjects.map((i,d)=>{
							if(i.name == 'big' && i.img == 'hero/'+heroimg){
								this.mapObjects.splice(d,1)
							}
						})
						if(strongIndex == 2){
							this.cd(10000 - addTalent4*350,4)
						}else{
							this.cd(12000 - addTalent4*350,4)
						}
					},5500+addTalent4*250)
					this.xuli += 1
					this.heroChongci(this.myHero.dis4)
					setTimeout(()=>{
						let cval = 0
						let aval = 0
						//50%概率吨级伤害
						if(this.reallyRandom(0,1) == 1 || strongIndex == 3){
							aval = parseInt(this.myHero.gj*2) + 100
						}
						if(strongIndex == 3){
							aval = aval + (parseInt(this.enemy.blood) - parseInt(this.blood1))*0.35
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
						let val = this.harmComputer(1,addTalent4,550+ cval + aval + addTalent4*50,1.3)
						this.beat(val)
					},4300)
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
					this.playMovies(1,strongIndex)
					this.playVoice('../../static/sounds/yll1.wav',true,0,4000)
					this.blueComput(65 + addTalent*10,'reduce')
					if(strongIndex == 0){
						this.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime())
						this.backBgImg('yll1',3500)
					}
					this.tallentExpert(3,1,3000 + addTalent*300)
					this.follow(1,3500)
						let val = this.harmComputer(2,0,60+addTalent*25,0.3)
						if(strongIndex == 2){
							val = this.harmComputer(2,0,105+addTalent*25,0.36) 
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
						let val = self.harmComputer(2,addTalent3,100,1.1)
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
					if(strongIndex == 0){
						self.heroAnm('../../static/imgs/hero/yll4.gif?'+ new Date().getTime())
						self.backBgImg('yll4',2500)
					}
					self.playMovies(4,strongIndex)
					self.shotDown = true
					let val = self.harmComputer(2,addTalent4,250,1.2)
					if(val < 50){
						val = self.randomNum(100,200)
					}
					self.consistBeat(val,800,1700)
					setTimeout(()=>{
						let val = self.harmComputer(2,addTalent4,300+addTalent4*50,1.4)
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
					this.playMovies(1,strongIndex,true)
					setTimeout(()=>{
						this.fasheArrow(220,2,33,this.myHero.id,1,2)
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
					this.heroAddSpeed(60 + addTalent2*5, 3000+addTalent2*250)
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
					this.playMovies(1,strongIndex,true)
					this.heroAddSpeed(20,2000)
					setTimeout(()=>{
						let val = self.harmComputer(1,addTalent,300,1.5)
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
						this.heroAddSpeed(70+addTalent2*5,2500 + addTalent2*250)
					}else{
						this.heroAddSpeed(40+addTalent2*5,2500 + addTalent2*250)
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
						let val = this.harmComputer(1,addTalent3,300,1)
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
						this.heroAddSpeed(25,2000)
					if(this.distanceComp(70)){
						let val = this.harmComputer(1,addTalent4,600+addTalent4*100,1.1)
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
				if(strongIndex == 2){
					this.myHero.dis1 = 170
				}
				if(num == 1){
					if(strongIndex == 1){
						this.cd(7000 - addTalent*200,1)
					}else{
						this.cd(8000 - addTalent*200,1)
					}
					this.blueComput(50 + addTalent*8,'reduce')
					this.heroChongci(this.myHero.dis1,2)
					let val = this.harmComputer(1,addTalent,250,1)
					if(strongIndex == 2){
						if(this.reallyRandom(0,1) == 1){
							val = val + 150 + this.myHero.gj
						}
					}
					this.beat(val)
					setTimeout(()=>{
						if(this.distanceComp(90) && this.yinshen){
							let val = this.harmComputer(1,addTalent4,600+addTalent4*100,1.2)
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
					if(strongIndex == 1){
						this.playMovies(2,strongIndex)
					}
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent2,300,1)
						if(strongIndex == 1){
							val = val+150
						}
						this.beat(val)
						setTimeout(()=>{
							if(this.distanceComp(90) && this.yinshen){
								let val = this.harmComputer(1,addTalent4,600+addTalent4*100,1.2)
								this.beat(val)
								this.shotDown = false
								this.yinshen = false
								this.enemyMoveContrl(2)
							}
						},300)
					},500)
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent2,300,1)
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
					if(strongIndex == 2){
						this.playMovies(3,strongIndex)
					}
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
					this.heroAddSpeed(32,5000 + addTalent4*500)
					if(this.distanceComp(90)){
						let val = this.harmComputer(1,addTalent4,600+addTalent4*100,1.2)
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
							let val = this.harmComputer(1,addTalent4,600+addTalent4*100,1.2)
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
					let val = (parseInt(this.myHero.fs)*(2+addTalent2*0.2) - parseInt(this.enemy.mk*4*this.pomo))*2
					if(strongIndex == 0){
						this.heroAnm('../../static/imgs/hero/ryjs2.gif?'+ new Date().getTime())
						this.backBgImg('ryjs2',2000)
						this.playVoice('../../static/sounds/ryjs'+num+'.wav',true,num-1,3000)
					}else{
						this.playMovies(2,strongIndex)
						val = val + this.randomNum(150,380)
					}
					setTimeout(()=>{
						this.beat(val)
					},2700)
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
					if(strongIndex != 0){
						this.playMovies(3,strongIndex)
						setTimeout(()=>{
							this.myHero.fy = this.myHero.fy + 55 + addTalent3*8
						},500)
						setTimeout(()=>{
							this.myHero.fy = this.myHero.fy - 55 - addTalent3*8
						},4500 + addTalent3*500)
					}else{
						this.fasheArrow(3000+addTalent3*500,2,50,15,3,11)
						setTimeout(()=>{
							this.myHero.fy = this.myHero.fy + 35 + addTalent3*8
						},500)
						setTimeout(()=>{
							this.myHero.fy = this.myHero.fy - 35 - addTalent3*8
						},3500 + addTalent3*500)
					}
					
				}
				if(num == 4){
					this.cd(11500 - addTalent4*250,4)
					this.delayTel(300,num)
					this.blueComput(120 + addTalent4*15,'reduce')
					this.heroChongci(150)
					this.playVoice('../../static/sounds/ryjs'+num+'.wav',true,num-1,3000)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent4,300+this.randomNum(150,300+addTalent4*70),1.5) 
						if(strongIndex == 2){
							val = val + parseInt(this.myHero.fs*0.6) + 100
							this.enemy.fy = this.enemy.fy - 6
						}
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
						this.heroAddSpeed(90,5000 + addTalent*250)
					}else{
						this.cd(9000 - addTalent*250,1)
						this.delayTel(2500,num)
						this.blueComput(60+addTalent*6,'reduce')
						this.playMovies(1,strongIndex)
						if(strongIndex == 0){
							this.heroAnm('../../static/imgs/hero/ag1.gif?'+ new Date().getTime())
							this.backBgImg('ag1',4000)
						}
						this.playVoice('../../static/sounds/ag1.wav',true,num-1,4000)
						if(this.distanceComp(150)){
							setTimeout(()=>{
								let val = this.harmComputer(2,addTalent,370+this.reallyRandom(0,5)*150,2.5)
								if(strongIndex == 1){
									val = val + 280
								}
								this.beat(val)
							},2500)
						}else{
							setTimeout(()=>{
								this.fasheArrow(400,2,43,this.myHero.id,1,19)
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
							let val = this.harmComputer(2,0,70+addTalent3*16,0.6)
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
						this.heroAddSpeed(25,3000+addTalent4*500)
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
					if(strongIndex == 2){
						this.tallentExpert(3,1,3000)
					}
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
					if(strongIndex == 0){
						this.playMovies(3,strongIndex,true,true)
					}else{
						this.playMovies(3,strongIndex)
					}
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
					if(strongIndex == 0){
						this.playMovies(4,strongIndex,true,true)
					}else{
						this.playMovies(4,strongIndex)
					}
					setTimeout(()=>{
						if(strongIndex == 2){
							this.fasheArrow(370,2,48,this.myHero.id,4,6,1)
						}else{
							this.fasheArrow(320,2,44,this.myHero.id,4,6)
						}
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
							this.fasheArrow(260 + addTalent*10,2,43,this.myHero.id,1,5,2)
						},300)
					}else{
						this.delayTel(250,num)
						if(this.distanceComp(230)){
							this.heroChongci(2000,2)
						}else{
							this.heroChongci(2000,2,0.3)
						}
						setTimeout(()=>{
							let val = this.harmComputer(1,addTalent,250,1.4)
							if(strongIndex == 1){
								val = val + 230
								if(this.reallyRandom(0,1) == 1){
									setTimeout(()=>{
										var vals = this.myHero.gj*2
										this.beat(vals,1)
									},500)
								}
							}
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
					if(strongIndex == 0){
						this.heroAnm('../../static/imgs/hero/damo3.gif?'+ new Date().getTime())
						this.backBgImg('damo3',1000)
					}else{
						this.playMovies(3,strongIndex)
					}
					let val = this.harmComputer(1,addTalent3,250,1.2)
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
					this.playMovies(4,strongIndex)
					setTimeout(()=>{
						this.enNoMove = true
						this.shotDown = true
						this.fastsp2 = this.enspeed - 0.5
						if(this.enemyX <= this.characterX){
							if(strongIndex == 1){
								this.enemyX = this.enemyX - 130 - addTalent4*10
							}else{
								this.enemyX = this.enemyX - 100 - addTalent4*10
							}
						}else{
							if(strongIndex == 1){
								this.enemyX = this.enemyX + 130 + addTalent4*10
							}else{
								this.enemyX = this.enemyX + 100 + addTalent4*10
							}
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
						let val = this.harmComputer(1,addTalent4,500,1.6)
						if(strongIndex == 1){
							val = val + 350
						}
						this.beat(val)
						this.computeDistance()
					},500)
					setTimeout(()=>{
						this.fastsp2 = 0
						this.shotDown = false
						this.enNoMove = false
					},1000)
				}
			}
			if(this.myHero.name == '疾风灵鹰' || this.myHero.id == 19){
				this.playVoice('../../static/sounds/jfly'+num+'.wav',false,num-1,4000)
				if(num == 1){
					this.cd(6000 - addTalent*250,1)
					this.delayTel(300,num)
					this.blueComput(50 + addTalent*5,'reduce')
					this.heroAnm('../../static/imgs/hero/jfly1.gif?'+ new Date().getTime())
					this.backBgImg('jfly1',1000)
					this.shotDown = false
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent,250,1.5)
						this.beat(val)
						this.consistBeat(this.harmComputer(1,0,100+addTalent*10,0.4),500,1500)
					},300)
				}
				if(num == 2){
					this.cd(14000 - addTalent2*250,2)
					this.blueComput(50 + addTalent2*5,'reduce')
					this.heroAnm('../../static/imgs/hero/jfly2.gif?'+ new Date().getTime())
					this.backBgImg('jfly2',5000+ addTalent2*500)
					this.heroAddSpeed(45+addTalent2*7,6000+ addTalent2*500)
					this.delayTel(5000+ addTalent2*500,2)
					this.$refs.tallents.tallentShow3 = true
					this.ygbj = true
					this.shotDown = true
					if((strongIndex == 1 || strongIndex == 2) && this.reallyRandom(0,1) == 1 && this.distanceComp(150)){
						setTimeout(()=>{
							let val = this.harmComputer(1,addTalent2,350,1.2)
							this.beat(val)
						},2000 + this.randomNum(0,5)*300)
					}
					setTimeout(()=>{
						this.shotDown = false
						this.ygbj = false
					},5000+ addTalent2*500)
				}
				if(num == 3){
					this.cd(8500 - addTalent3*250,3)
					this.blueComput(75 + addTalent3*7,'reduce')
					this.heroChongci(135,0,0.3)
					let val = this.harmComputer(1,addTalent3,300,1.5)
					if(strongIndex == 2){
						val = val + parseInt(this.myHero.gj*1.3) + addTalent3*35
					}
					if(this.ygbj){
						val = val + parseInt(this.myHero.gj*1.2) + addTalent3*25
						if(strongIndex == 2){
							val = val + parseInt(this.myHero.gj*1.8) + addTalent3*35
						}
						this.tallentExpert(1,1,1500+ addTalent3*200)
						this.shotDown = false
						this.ygbj = false
						this.$refs.tallents.tallentShow = true
					}
					this.beat(val)
				}
				if(num == 4){
					this.blueComput(100 + addTalent4*10,'reduce')
					if(this.distanceComp(this.heroGJdis)){
						this.cd(16000 - addTalent4*300,4)
						this.delayTel(1000,num)
						this.shotDown = true
						this.enNoMove = true
						this.cd(5500+addTalent4*330,1)
						this.cd(5500+addTalent4*330,3)
						this.heroAnm('../../static/imgs/hero/jfly4.gif?'+ new Date().getTime())
						this.backBgImg('jfly4',1500)
						this.$refs.tallents.tallentShow3 = false
						if(strongIndex == 1 || strongIndex == 2){
							let val = this.harmComputer(1,addTalent4,200,1)
							this.beat(val)
						}
						let t = setInterval(()=>{
							if(this.enemyX >= this.characterX){
								this.enemyX = this.characterX + 15
							}else{
								this.enemyX = this.characterX - 15
							}
							this.enemyY = this.characterY - 10
						},250)
						setTimeout(()=>{
							clearInterval(t)
							this.shotDown = false
							this.enNoMove = false
							let val = this.harmComputer(1,addTalent4,500+addTalent4*100,1.5)
							this.beat(val)
							this.tallentExpert(2,1,1000)
						},5500+addTalent4*330)
					}else{
						this.cd(11000 - addTalent4*300,4)
						this.delayTel(500,num)
						this.myHero.gj = this.myHero.gj + parseInt(this.myHero.gj*0.15)
						this.heroGJdis = this.heroGJdis + 20
						this.addBlood(500+ addTalent4*150,0,0)
						setTimeout(()=>{
							this.myHero.gj = this.myHero.gj - parseInt(this.myHero.gj*0.14)
							this.heroGJdis = this.heroGJdis - 20
						},5000+addTalent4*300)
					}
				}
			}
			if(this.myHero.name == '敖丙' || this.myHero.id == 20){
				if(num == 1){
					this.cd(10500 - addTalent*250,2)
					this.blueComput(80 + addTalent*8,'reduce')
					if(strongIndex == 0){
						this.heroAnm('../../static/imgs/hero/aobin1.gif?'+ new Date().getTime())
						this.backBgImg('aobin1',4600)
					}else{
						this.playMovies(1,strongIndex)
					}
					this.delayTel(1000,num)
					this.playVoice('../../static/sounds/aobin'+num+'.wav',true,num-1,4000)
					if(this.distanceComp(100)){
						this.tallentExpert(1,1,2000+addTalent*250)
					}
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},2500+addTalent*250)
				}
				if(num == 2){
					if(strongIndex == 1){
						this.cd(5500 - addTalent2*200,2)
					}else{
						this.cd(7000 - addTalent2*250,2)
					}
					this.blueComput(35 + addTalent2*5,'reduce')
					this.heroAnm('../../static/imgs/hero/aobin2.gif?'+ new Date().getTime())
					this.backBgImg('aobin2',1900)
					if(strongIndex == 1){
						this.fasheArrow(280 + addTalent2*10,2,45,this.myHero.id,2,16,2)
					}else{
						this.fasheArrow(230 + addTalent2*10,2,45,this.myHero.id,2,16,2)
					}
					this.playVoice('../../static/sounds/aobin'+num+'.wav',true,num-1,3000)
				}
				if(num == 3){
					this.cd(17000 - addTalent3*300,3)
					this.blueComput(100 + addTalent3*10,'reduce')
					this.mapObjects.map((i,d)=>{
						if(i.img == 'shuiwall.png'){
							this.mapObjects.splice(d,1)
						}
					})
					this.mapObjects.push({
						left: this.characterX - 100,
						top: this.characterY - 100,
						width: 430,
						height: 430,
						img: 'shuiwall.png'
					});
					setTimeout(()=>{
						this.mapObjects.map((i,d)=>{
							if(i.img == 'shuiwall.png'){
								this.mapObjects.splice(d,1)
							}
						})
						if(this.xuli){
							this.myHero.fs = this.myHero.fs - 50 - addTalent3*10
							this.myHero.gj = this.myHero.gj - 25 - addTalent3*5
							this.myHero.fy = this.myHero.fy - 25 - addTalent3*5
							this.xuli = false
						}
					},7000+addTalent3*500)
				}
				if(num == 4){
					this.cd(11000 - addTalent4*250,4)
					this.delayTel(3000,num)
					this.blueComput(150 + addTalent4*15,'reduce')
					setTimeout(()=>{
						this.fasheArrow(3000+addTalent4*250,2,35,"无",3,14)
						if(Math.abs(this.characterX - this.enemyX) <= 625 && Math.abs(this.characterY - this.enemyY)<=35){
							let val = this.harmComputer(2,0,100 + addTalent4*30,0.6)
							if(val<=0){
								val = 50
							}
							if(strongIndex == 1){
								val = val + 100
							}
							this.consistBeat(val,500,3000+addTalent4*250)
						}
					},500)
				}
			}
			if(this.myHero.name == '托塔天王' || this.myHero.id == 21){
				if(num == 1){
					if(strongIndex == 1){
						this.cd(4000 - addTalent*250,1)
					}else{
						this.cd(5000 - addTalent*250,1)
					}
					this.playMovies(1,strongIndex,true)
					this.blueComput(35 + addTalent*3,'reduce')
					this.delayTel(500,num)
					this.fasheArrow(135,2,75,this.myHero.id,1,18,4)
				}
				if(num == 2){
					this.cd(10000 - addTalent2*250,2)
					this.blueComput(60 + addTalent2*5,'reduce')
					this.heroAnm('../../static/imgs/hero/tttw2.gif?'+ new Date().getTime())
					this.backBgImg('tttw2',2500)
					this.delayTel(1500,num)
					if(!this.xuli){
						this.enemy.gs = parseFloat(this.enemy.gs + 0.4 + addTalent2*0.1).toFixed(2)
						this.enNoMove = true
						if(!this.ygbj){
							this.ygbj = setInterval(()=>{
								if(this.characterX > this.enemyX){
									this.enemyX = this.enemyX + 6 + addTalent2*1
								}else{
									this.enemyX = this.enemyX - 6 - addTalent2*1
								}
								if(this.characterY > this.enemyY){
									this.enemyY = this.enemyY + 6 + addTalent2*1
								}else{
									this.enemyY = this.enemyY - 6 - addTalent2*1
								}
							},100)
						}
						setTimeout(()=>{
							this.enemy.gs = parseFloat(this.enemy.gs - 0.4 + addTalent2*0.1).toFixed(2)
							this.enNoMove = false
							clearInterval(this.ygbj)
							this.ygbj = false
						},3000 + addTalent2*250)
					}else{
						let val = this.harmComputer(2,addTalent2,200,1.2)
						this.beat(val)
					}
					this.playVoice('../../static/sounds/sm'+num+'.wav',true,num-1,3000)
				}
				if(num == 3){
					this.cd(7500 - addTalent3*250,3)
					this.blueComput(50 + addTalent3*5,'reduce')
					if(strongIndex == 1){
						this.shanxian(110 + addTalent3*10)
					}else{
						this.shanxian(80 + addTalent3*10)
					}
					this.addBlood(100 + addTalent3*30 + strongIndex*100 + parseInt(this.myHero.fs*1.6),0,0)
					this.myHero.gj = parseInt(this.myHero.gj * (1.2 + addTalent3*0.025))
					setTimeout(()=>{
						this.myHero.gj = parseInt(this.myHero.gj / (1.2 + addTalent3*0.025))
					},4000)
				}
				if(num == 4){
					this.cd(14000 - addTalent4*250,4)
					this.delayTel(2000,num)
					this.blueComput(150 + addTalent4*10,'reduce')
					this.playVoice('../../static/sounds/tttw'+num+'.wav',true,num-1,3500)
					if(this.tallentObjects.length != 0){
						this.tallentObjects.map((i,d)=>{
							if(i.img == 'baota.png'){
								this.tallentObjects.splice(d,1)
							}
						})
					}
					this.tallentExpert(3,1,900)
					this.tallentObjects.push({
						left: this.enemyX - 50,
						top: this.enemyY - 250,
						width: 350,
						height: 480,
						img: 'baota.png'
					});
					setTimeout(()=>{
						this.tallentObjects.forEach((i,d)=>{
							if(i.img == 'baota.png'){
								i.top += 130
							}
						})
					},100)
					setTimeout(()=>{
						this.xuli = true
						this.shotDown = true
						this.tallentExpert(1,1,5000+addTalent4*350)
						let val = this.harmComputer(1,addTalent4,350 + parseInt(this.myHero.fs),1)
						this.beat(val)
					},900)
					setTimeout(()=>{
						this.tallentObjects.map((i,d)=>{
							if(i.img == 'baota.png'){
								this.tallentObjects.splice(d,1)
							}
						})
						this.xuli = false
						this.shotDown = false
					},5900+addTalent4*350)
				}
			}
			if(this.myHero.name == '隐世侠客' || this.myHero.id == 22){
				if(num == 1){
					this.cd(5000 - addTalent*250,1)
					this.blueComput(30 + addTalent*3,'reduce')
					this.fasheArrow(170,2,37,this.myHero.id,1,2,2)
					this.playVoice('../../static/sounds/ysxk'+num+'.wav',true,num-1,1200)
				}
				if(num == 2){
					this.cd(11500 - addTalent2*250,2)
					this.blueComput(60 + addTalent2*5,'reduce')
					this.delayTel(1000,num)
					this.heroAddSpeed(75 + addTalent2*5,4000 + addTalent2*250)
					this.playVoice('../../static/sounds/ysxk'+num+'.wav',true,num-1,1200)
					if(strongIndex == 2){
						this.myHero.dis3 = 185
						this.computeDistance()
					}
					this.playMovies(2,strongIndex,true)
					if(parseFloat(this.myHero.v)>0.5){
						this.xuli = true
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.3 + addTalent2*0.05)).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.3 + addTalent2*0.05)).toFixed(2)
							this.xuli = false
							if(strongIndex == 2){
								this.myHero.dis3 = 125
								this.computeDistance()
							}
						},4000 + addTalent2*250)
					}
				}
				if(num == 3){
					if(this.xuli){
						this.cd(500,3)
					}else{
						this.cd(6000 - addTalent3*250,3)
					}
					this.playVoice('../../static/sounds/ysxk'+num+'.wav',true,num-1,1200)
					this.blueComput(70 + addTalent3*5,'reduce')
					this.heroChongci(this.myHero.dis3)
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
					this.player.x = this.characterX
					this.player.y = this.characterY
					let val = this.harmComputer(1,addTalent3,250,1.1)
					if(this.xuli){
						val = val + this.myHero.gj
					}
					if(this.reallyRandom(0,1) == 1){
						val = parseInt(val*1.3)
					}
					this.beat(val)
				}
				if(num == 4){
					this.cd(13000 - addTalent4*250,4)
					this.delayTel(2000,num)
					this.blueComput(120 + addTalent4*10,'reduce')
					this.fasheArrow(160,2,45,this.myHero.id,4,18,5)
					this.playVoice('../../static/sounds/ysxk'+num+'.wav',true,num-1,2200)
					this.playMovies(4,strongIndex)
					setTimeout(()=>{
						this.fasheArrow(160,2,45,this.myHero.id,4,18,5)
					},500)
					setTimeout(()=>{
						this.fasheArrow(180,2,50,this.myHero.id,4,18,5)
					},1000)
					setTimeout(()=>{
						this.fasheArrow(200,2,50,this.myHero.id,4,18,5)
					},1500)
				}
			}
			if(this.myHero.name == '阿宁' || this.myHero.id == 23){
				this.playVoice('../../static/sounds/aning'+num+'.wav',true,num-1,1200)
				if(num == 1){
					this.cd(5000 - addTalent*250,1)
					this.blueComput(30 + addTalent*3,'reduce')
					if(strongIndex == 1){
						this.fasheArrow(170+ addTalent*5,2,30,this.myHero.id,1,9,10)
					}else{
						if(strongIndex == 2){
							this.fasheArrow(160+ addTalent*5,2,30,this.myHero.id,1,9,8)
						}else{
							this.fasheArrow(135+ addTalent*5,2,30,this.myHero.id,1,9,8)
						}
					}
				}
				if(num == 2){
					this.cd(9000 - addTalent2*250,2)
					this.blueComput(80 + addTalent2*10,'reduce')
					this.delayTel(2500,num)
					this.heroAnm('../../static/imgs/hero/aning2.gif?'+ new Date().getTime())
					this.backBgImg('aning2',2200)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},2500)
					let val = this.harmComputer(1,0,80 + addTalent2*40,0.5)
					if(val<50){
						val = 50
					}
					this.consistBeat(val,500,2500)
					if(this.reallyRandom(0,2) == 2){
						//被动
						this.fasheArrow(120,2,30,this.myHero.id,1,9,7)
					}
				}
				if(num == 3){
					this.cd(7500 - addTalent3*250,3)
					this.blueComput(50 + addTalent3*5,'reduce')
					this.ylzz = 1
					if(strongIndex == 2){
						this.shanxian(118+ addTalent3*6)
					}else{
						this.shanxian(90+ addTalent3*6)
					}
					setTimeout(()=>{
						this.ylzz = 0
						this.computeDistance()
						if((strongIndex == 2 && this.distanceComp(118)) || this.distanceComp(90)){
							let val = this.harmComputer(1,addTalent3,220 + addTalent3*50,1.3)
							if(val < 50){
								val = 50
							}
							//敌方生命值小于20%
							if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.2){
								val = val * (2 + addTalent3*0.25)
							}
							if(strongIndex == 1){
								val = val + parseInt(this.myHero.gj)
							}
							this.beat(val)
						}
					},800)
					if(this.reallyRandom(0,2) == 2){
						//被动
						this.fasheArrow(120,2,30,this.myHero.id,1,9,7)
					}
				}
				if(num == 4){
					this.cd(14000 - addTalent4*250,4)
					this.delayTel(1500,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					if(this.bloodVal2 <= (20 + addTalent4*3)){	//生命值小于20%~30%
						this.addBlood(333+ addTalent4*90 + parseInt(parseInt(this.myHero.fy)/1.5),500,1500)
						this.tallentExpert(3,2,1500)
					}else{
						this.addBlood(170+ addTalent4*22 + parseInt(parseInt(this.myHero.fy)/3),500,1500)
					}
					if(strongIndex == 2){
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},3000 + this.reallyRandom(0,3)*700)
						let val = this.harmComputer(1,0,30 + addTalent4*30,0.5)
						if(val<50){
							val = 50
						}
						this.consistBeat(val,500,3000 + this.reallyRandom(0,3)*700)
					}
				}
			}
			if(this.myHero.name == '亡灵战神' || this.myHero.id == 24){
				if(num == 1){
					if(this.xuli != 0){
						this.cd(8500 - addTalent*250,1)
						this.blueComput(50 + addTalent*5,'reduce')
						this.heroAnm('../../static/imgs/hero/wlzs1.gif?'+ new Date().getTime())
						this.backBgImg('wlzs1',2000)
						this.playVoice('../../static/sounds/wangling1.wav',true,num-1,1600)
						if(this.distanceComp(110 + addTalent*3)){
							this.tallentExpert(2,1,1000 + this.xuli*120)
							let val = this.harmComputer(1,addTalent,200+ parseInt(this.xuli)*30+ this.randomNum(0,this.xuli*22),1)
							this.beat(val)
						}
						this.xuli = 0
						clearInterval(this.ylzz)
						this.ylzz = null
					}else{
						this.playMovies(1,strongIndex,true)
						this.delayTel(2500,1)
						if(!this.ylzz){
							this.ylzz = setInterval(()=>{
								this.xuli += 1
							},200)
						}
						setTimeout(()=>{
							this.$refs.tallents.tallentShow = true
						},250)
						//没有释放出来
						setTimeout(()=>{
							if(this.xuli != 0){
								this.cd(6000 - addTalent*250,1)
								clearInterval(this.ylzz)
								this.ylzz = null
								this.xuli = 0
							}
						},2600)
					}
				}
				if(num == 2){
					this.cd(8000 - addTalent2*250,2)
					this.blueComput(50 + addTalent2*5,'reduce')
					this.myHero.fy = this.myHero.fy + 40 + addTalent2*5
					this.addBlood(200 + parseInt(this.myHero.fy*2),0,0)
					setTimeout(()=>{
						if(this.distanceComp(138)){
							let val = this.myHero.fs + 100 + this.randomNum(0,200) + addTalent2*30
							this.beat(val,1)
						}
						this.myHero.fy = this.myHero.fy - 40 - addTalent2*5
					},3500)
				}
				if(num == 3){
					this.cd(5000 - addTalent3*250,3)
					this.blueComput(30 + addTalent3*3,'reduce')
					this.fasheArrow(160,2,36,this.myHero.id,3,2,2)
				}
				if(num == 4){
					this.cd(13000 - addTalent4*250,4)
					this.blueComput(120 + addTalent4*10,'reduce')
					this.playVoice('../../static/sounds/wangling4.wav',true,num-1,3300)
					this.$refs.tallents.tallentShow = false
					this.$refs.tallents.tallentShow2 = false
					this.$refs.tallents.tallentShow3 = false
					this.myNoMove = true
					this.showTX(2,2)
					this.fastsp = this.myspeed
					if(this.characterX >= this.enemyX){
						if(!this.ygbj){
							this.ygbj = setInterval(()=>{
								this.computeDistance()
								if(this.distanceComp(40)){
									this.tallentExpert(2,1,2500)
									clearInterval(this.ygbj)
									this.ygbj = false
									let val = this.harmComputer(1,addTalent4,500+ addTalent4*70+ this.randomNum(0,300),1)
									this.beat(val)
									this.$refs.tallents.tallentShow = true
									this.$refs.tallents.tallentShow2 = true
									this.$refs.tallents.tallentShow3 = true
									this.myNoMove = false
									this.fastsp = 0
									this.showTX(2,2,true)
								}else{
									if(this.characterX < 20){
										this.$refs.tallents.tallentShow = true
										this.$refs.tallents.tallentShow2 = true
										this.$refs.tallents.tallentShow3 = true
										this.myNoMove = false
										this.fastsp = 0
										this.showTX(2,2,true)
										clearInterval(this.ygbj)
										this.ygbj = false
									}else{
										this.characterX = this.characterX - 12
									}
								}
							},50)
						}
						
					}else{
						if(!this.ygbj){
						this.ygbj = setInterval(()=>{
							this.computeDistance()
							if(this.distanceComp(40)){
								this.tallentExpert(2,1,2500)
								clearInterval(this.ygbj)
								this.ygbj = false
								let val = this.harmComputer(1,addTalent4,500+ addTalent4*70+ this.randomNum(0,300),1.2)
								this.beat(val)
								this.$refs.tallents.tallentShow = true
								this.$refs.tallents.tallentShow2 = true
								this.$refs.tallents.tallentShow3 = true
								this.myNoMove = false
								this.fastsp = 0
								this.showTX(2,2,true)
							}else{
								if(this.characterX < this.screenWidth * 1.3){
									this.characterX = this.characterX + 12
								}else{
									this.$refs.tallents.tallentShow = true
									this.$refs.tallents.tallentShow2 = true
									this.$refs.tallents.tallentShow3 = true
									this.myNoMove = false
									this.fastsp = 0
									this.showTX(2,2,true)
									clearInterval(this.ygbj)
									this.ygbj = false
								}
							}
						},50)
					}
					}
				}
			}
			if(this.myHero.name == '刀锋意志' || this.myHero.id == 25){
				this.myHero.blood += 35
				if(num == 1){
					this.cd(6500 - addTalent*250,1)
					this.blueComput(70 + addTalent*6,'reduce')
					this.heroChongci(this.myHero.dis1)
					this.playVoice('../../static/sounds/chongji.wav',true,num-1,1800)
					let val = this.harmComputer(1,addTalent,200,1.3)
					this.beat(val)
				}
				if(num == 2){
					this.cd(11000 - addTalent2*350,2)
					this.blueComput(100 + addTalent2*10,'reduce')
					this.delayTel(500,num)
					this.addBlood(parseInt(this.myHero.blood*(0.1+addTalent2*0.015)),0,0)
					this.myHero.gj = this.myHero.gj + 30 + addTalent2*8
					if(strongIndex != 0){
						this.heroAddSpeed(25+addTalent2*5,4000+addTalent2*500)
					}
					setTimeout(()=>{
						this.myHero.gj = this.myHero.gj - 30 - addTalent2*8
					},4000+addTalent2*500)
				}
				if(num == 3){
					this.cd(8500 - addTalent3*250,3)
					this.blueComput(70 + addTalent3*7,'reduce')
					this.delayTel(1000,num)
					this.playMovies(3,strongIndex,true,strongIndex == 2)
					this.playVoice('../../static/sounds/dfyz3.wav',true,num-1,1200)
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent3,250,1)
						this.beat(val)
						this.tallentExpert(2,1,2000+addTalent3*250)
					},1000)
				}
				if(num == 4){
					this.cd(17000 - addTalent4*350,4)
					this.delayTel(1000,num)
					this.blueComput(135 + addTalent4*15,'reduce')
					this.playMovies(4,strongIndex,false,strongIndex == 2)
					setTimeout(()=>{
						this.fasheArrow(300,2,33,this.myHero.id,1,8,5)
					},1000)
					setTimeout(()=>{
						this.fasheArrow(300,2,33,this.myHero.id,2,8,5)
					},2600)
					setTimeout(()=>{
						this.fasheArrow(330,2,33,this.myHero.id,3,8,5)
					},4200)
					setTimeout(()=>{
						this.fasheArrow(380,2,35,this.myHero.id,4,8,5)
					},5700)
				}
			}
			if(this.myHero.name == '韦鲁斯' || this.myHero.id == 1000){
				if(this.fastsp < 0.4){
					this.fastsp = parseFloat(this.fastsp + 0.05).toFixed(3)
				}
				if(num == 1){
					this.cd(6500 - addTalent*250,1)
					this.blueComput(50 + addTalent*5,'reduce')
					this.delayTel(1000,0)
					this.heroAnm('../../static/imgs/hero/wls1.gif?'+ new Date().getTime())
					this.backBgImg('wls1',1800)
					this.fasheArrow(520,2,32,this.myHero.id,1,9,3)
				}
				if(num == 2){
					this.cd(5000 - addTalent2*250,2)
					this.blueComput(30 + addTalent2*5,'reduce')
					this.fasheArrow(400,2,38,this.myHero.id,2,8,3)
				}
				if(num == 3){
					this.cd(7500 - addTalent3*250,3)
					this.blueComput(30 + addTalent3*3,'reduce')
					if(parseFloat(this.myHero.v)>0.6){
						this.myHero.v = parseFloat(this.myHero.v - 0.3).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3).toFixed(2)
						},3500)
					}
				}
				if(num == 4){
					this.cd(13000 - addTalent4*250,4)
					this.delayTel(1500,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					this.fasheArrow(600,2,36,this.myHero.id,4,5,3)
					if(this.enemyX < this.characterX){
						this.characterX = this.characterX + (80 + this.randomNum(0,50))
					}else{
						this.characterX = this.characterX - (80 + this.randomNum(0,50))
					}
				}
			}
			if(this.myHero.name == '狂暴奎木狼' || this.myHero.id == 1001){
				if(num == 1){
					this.cd(5500 - addTalent*250,1)
					this.blueComput(35 + addTalent*5,'reduce')
					this.delayTel(500,0)
					this.heroAnm('../../static/imgs/hero/jfly1.gif?'+ new Date().getTime())
					this.backBgImg('jfly1',1000)
					let val = this.harmComputer(1,addTalent,250,1)
					if(this.randomNum(0,1) == 1){
						val = parseInt(val*1.5)
					}
					this.beat(val)
				}
				if(num == 2){
					this.playVoice('../../static/sounds/kbkml.mp3',true,num-1,3000)
					this.cd(11000 - addTalent2*350,2)
					this.blueComput(30,'reduce')
					this.delayTel(1000,0)
					this.playMovies(2,strongIndex,true)
					setTimeout(()=>{
						this.tallentExpert(5,1)
					},500)
					if(parseFloat(this.myHero.v)>0.6){
						this.myHero.v = parseFloat(this.myHero.v - 0.2 - addTalent2*0.05).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.2 + addTalent2*0.05).toFixed(2)
						},3500+addTalent2*500)
					}
				}
				if(num == 3){
					this.playVoice('../../static/sounds/chongji.wav',true,num-1,1800)
					this.cd(7500 - addTalent3*250,3)
					this.blueComput(50 + addTalent3*5,'reduce')
					this.heroChongci(130)
					//禁锢
					this.tallentExpert(1,1,1500)
					this.heroAnm('../../static/imgs/hero/kbkml3.gif?'+ new Date().getTime())
					this.backBgImg('kbkml3',900)
					this.beat(this.harmComputer(1,addTalent3,150,1))
				}
				if(num == 4){
					this.playVoice('../../static/sounds/kbkml4.mp3',true,num-1,4000)
					this.cd(16000 - addTalent4*250,4)
					this.blueComput(100+addTalent4*10,'reduce')
					this.delayTel(500,0)
					this.playMovies(4,strongIndex,true)
					setTimeout(()=>{
						this.tallentExpert(6,2,3800 + addTalent4*1000)
					},500)
				}
			}
			if(this.myHero.name == '百花仙子' || this.myHero.id == 1002){
				if(num == 1){
					this.cd(7500 - addTalent*250,1)
					this.playVoice('../../static/sounds/bhxz1.wav',true,num-1,2000)
					this.blueComput(60 + addTalent*6,'reduce')
					this.fasheArrow(450,2,35,this.myHero.id,1,2,2)
					this.playMovies(1,strongIndex,true,strongIndex==1)
				}
				if(num == 2){
					this.playVoice('../../static/sounds/bhxz2.wav',true,num-1,3000)
					this.cd(13000 - addTalent2*350,2)
					this.blueComput(100,'reduce')
					this.delayTel(2000,0)
					let blval = parseInt((600 + addTalent2*150 + this.myHero.fs*2)/2)
					if(strongIndex == 1){
						blval = blval + parseInt(this.myHero.fs)
					}
					this.addBlood(blval,1000,2050)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*250,3)
					this.blueComput(70 + addTalent3*5,'reduce')
					this.fasheArrow(350,2,30,this.myHero.id,2,16,1)
				}
				if(num == 4){
					this.playVoice('../../static/sounds/bhxz4.wav',true,num-1,4000)
					this.cd(13000 - addTalent4*250,4)
					this.blueComput(100+addTalent4*5,'reduce')
					this.delayTel(500,0)
					if(strongIndex == 1){
						this.playMovies(4,strongIndex,false,true)
					}
					this.myImmunity = true
					setTimeout(()=>{
						this.myImmunity = false
					},5000+addTalent4*1000)
				}
			}
			if(this.myHero.name == '牛魔王' || this.myHero.id == 1003){
				if(num == 1){
					this.cd(6000 - addTalent*200,1)
					this.blueComput(50 + addTalent*5,'reduce')
					this.delayTel(600,0)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent,150,1)
						this.beat(val)
						this.tallentExpert(2,1,1000+addTalent*100)
					},600)
				}
				if(num == 2){
					this.cd(9500 - addTalent2*250,2)
					this.blueComput(100,'reduce')
					let fyval = parseInt(this.myHero.fy*(0.3 + addTalent2*0.02))
					let blood2 = this.blood2
					this.myHero.fy = this.myHero.fy + fyval
					setTimeout(()=>{
						this.myHero.fy = this.myHero.fy - fyval
						if(this.blood2 < blood2 && this.distanceComp(135)){
							let val = parseInt((blood2 - this.blood2)*0.5) + 250 - this.enemy.mk*2
							this.beat(val)
						}
					},3500 + addTalent2*500)
				}
				if(num == 3){
					this.cd(10000 - addTalent3*250,3)
					this.blueComput(50 + addTalent3*5,'reduce')
					this.heroChongci(120)
					let val = this.harmComputer(2,addTalent3,50,0.8)
					this.beat(val)
					setTimeout(()=>{
						this.enDuobi(70+ addTalent3*10)
						this.tallentExpert(2,1,1000+addTalent3*100)
					},100)
				}
				if(num == 4){
					this.cd(15000 - addTalent4*250,4)
					this.blueComput(100+addTalent4*5,'reduce')
					this.delayTel(1500,0)
					this.playMovies(4,strongIndex,true,true)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent4,500 + this.randomNum(0,300),1.1)
						if(strongIndex == 1){
							val = val + this.myHero.fs
						}
						this.beat(val)
						this.pojia = this.pojia - 0.25 - addTalent4*0.03
						this.pomo = this.pomo - 0.25 - addTalent4*0.03
						this.enemy.fy = this.enemy.fy - 6 - addTalent4
						this.enemy.mk = this.enemy.mk - 6 - addTalent4
						setTimeout(()=>{
							this.pojia = this.pojia + 0.25 + addTalent4*0.03
							this.pomo = this.pomo + 0.25 + addTalent4*0.03
						})
					},1500)
				}
			}
			if(this.myHero.name == '狂暴武僧' || this.myHero.id == 1004) {
				let randomVal = this.randomNum(50,250)
				if(num == 1){
					this.cd(3800 - addTalent*200,1)
					this.playVoice('../../static/sounds/wuqi1.wav',false,0,4000)
					this.delayTel(300,num)
					this.heroChongci(this.myHero.dis1)
					this.addBlood(randomVal,0,0)
					let val = this.harmComputer(1,addTalent,350+randomVal+this.xuli,1.5)
					this.beat(val)
					this.blueComput(70 + addTalent*8,'reduce')
					this.xuli = 0
				}
				if(num == 2){
					this.cd(6000 - addTalent2*300,2)
					this.playVoice('../../static/sounds/wuqi2.wav',false,1,2000)
					this.xuli = parseInt(this.myHero.fs * (2.2 + addTalent2*0.25)) + 250 + addTalent2*35
					this.blueComput(70 + addTalent2*10,'reduce')
					this.myHero.gj = this.myHero.gj + 5
				}
				if(num == 3){
					this.cd(8000 - addTalent3*300,3)
					this.playVoice('../../static/sounds/wuqi3.wav',false,2,4000)
					this.delayTel(500,num)
					this.blueComput(100 + addTalent3*15,'reduce')
					let val = this.harmComputer(1,addTalent3,Math.round(this.shotVal1*0.6) + 300 + randomVal,1)
					if(val<=0){
						val = randomVal
					}
					setTimeout(()=>{
						this.beat(val,1)
						this.tallentExpert(2,1,2500 + addTalent3*200)
					},2500 + addTalent3*200)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.playVoice('../../static/sounds/wuqi4.wav',false,3,5800)
					this.delayTel(1000,num)
					this.heroAnm('../../static/imgs/hero/wqds.gif?'+ new Date().getTime())
					this.backBgImg('wqds',1500)
					this.myHero.fy = parseInt(this.myHero.fy) + 30 + addTalent4*10
					this.myHero.gj = parseInt(this.myHero.gj) + 20 + addTalent4*5
					this.myHero.fs = parseInt(this.myHero.fs) + 30 + addTalent4*5
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy) - 30 - addTalent4*10
						this.myHero.gj = parseInt(this.myHero.gj) - 20 - addTalent4*5
						this.myHero.fs = parseInt(this.myHero.fs) - 30 - addTalent4*5
					},5000)
					let val = this.harmComputer(1,addTalent4,500+randomVal+ addTalent4*70+parseInt(this.myHero.fs*0.7),0.7)
					this.blueComput(100 + addTalent4*25,'reduce')
					setTimeout(()=>{
						this.beat(val)
					},1000)
				}
			}
			if(this.myHero.name == '雷伊' || this.myHero.id == 1005) {
				if(this.blood1 <= 50 && this.xuli == 0){
					this.myHero.fs = this.myHero.fs + 30
					this.xuli = 1
				}
				if(num == 1){
					this.cd(5000 - addTalent*250,1)
					this.blueComput(35 + addTalent*3,'reduce')
					this.fasheArrow(450,2,35,this.myHero.id,1,16,2)
				}
				if(num == 2){
					this.cd(10000 - addTalent2*250,2)
					this.blueComput(60 + addTalent2*10,'reduce')
					this.playVoice('../../static/sounds/ly2.mp3',true,num-1,4000)
					this.heroAnm('../../static/imgs/hero/ly2.gif?'+ new Date().getTime())
					this.backBgImg('ly2',1200)
					let fsv = parseInt(this.myHero.fs*(0.25 + addTalent2*0.02))
					this.myHero.fs = this.myHero.fs + fsv
					this.myHero.gj = this.myHero.gj + 50 + addTalent2*10
					this.fastsp = 0.15
					setTimeout(()=>{
						this.myHero.fs = this.myHero.fs - fsv
						this.myHero.gj = this.myHero.gj - 50 - addTalent2*10
						this.fastsp = 0
					},4000 + addTalent2*500)
				}
				if(num == 3){
					this.cd(7000 - addTalent3*250,3)
					this.blueComput(60 + addTalent3*5,'reduce')
					this.playVoice('../../static/sounds/ly3.wav',true,num-1,2000)
					this.heroChongci(120)
					if(this.characterX > this.enemyX){
						this.characterX = this.enemyX - 40
					}else{
						this.characterX = this.enemyX + 40
					}
					if(this.characterY > this.enemyY){
						this.characterY = this.enemyY - 40
					}else{
						this.characterY = this.enemyY + 40
					}
					let val = this.harmComputer(2,addTalent3,250,1.1)
					this.beat(val)
					if(!this.shotDown){
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1000)
					}
				}
				if(num == 4){
					this.cd(11000 - addTalent4*350,4)
					this.blueComput(130 + addTalent4*10,'reduce')
					this.heroChongci(138)
					this.playVoice('../../static/sounds/ly4.mp3',true,num-1,3000)
					this.playMovies(4,strongIndex,true)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent4,350+ addTalent4*70,1.5)
						this.beat(val)
						this.tallentExpert(4,1,5000)
					},60)
				}
			}
			if(this.myHero.name == '地狱火' || this.myHero.id == 1006) {
				if(num == 1){
					this.cd(5000 - addTalent*250,1)
					this.blueComput(35 + addTalent*3,'reduce')
					this.fasheArrow(400,2,35,this.myHero.id,1,1,1)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*250,3)
					this.blueComput(70 + addTalent3*7,'reduce')
					this.playVoice('../../static/sounds/ly3.wav',true,num-1,2000)
					this.delayTel(500,0)
					this.xuli = 1
					setTimeout(()=>{
						this.xuli = 0
					},3000+ addTalent3*500)
				}
				if(num == 4){
					this.cd(13500 - addTalent4*350,4)
					this.blueComput(150 + addTalent4*15,'reduce')
					this.fasheArrow(400,2,38,this.myHero.id,4,3,2)
					this.playMovies(4,strongIndex,true)
				}
			}
			if(this.myHero.name == '二郎真君-杨戬' || this.myHero.id == 1007) {
				if(num == 1){
					if(this.enFlagTime){
						return
					}
					this.playVoice('../../static/sounds/elzj1.mp3',true,num-1,2500)
					this.blueComput(50 + addTalent*5,'reduce')
					this.tallentObjects.push({
						left: this.characterX - this.randomNum(30,70),
						top: this.characterY + this.randomNum(20,60),
						width: 130,
						height: 136,
						img: 'xtq.png'
					});
					let ind = 0
					this.tallentObjects.map((i,d)=>{
					  if(i.img == 'xtq.png'){
						  ind = d
					  }
					})
					if(!this.enFlagTime){
						this.enFlagTime = setInterval(()=>{
							if(this.enemyX > this.tallentObjects[ind].left){
								this.tallentObjects[ind].left = this.tallentObjects[ind].left + 3
							}else if(this.tallentObjects[ind].left - this.enemyX > 36){
								this.tallentObjects[ind].left = this.tallentObjects[ind].left - 3
							}
							if(this.enemyY > this.tallentObjects[ind].top){
								this.tallentObjects[ind].top = this.tallentObjects[ind].top + 3
							}else if(this.tallentObjects[ind].top - this.enemyY > 10){
								this.tallentObjects[ind].top = this.tallentObjects[ind].top - 3
							}
							//哮天犬已靠近
							if(!this.enFlag && Math.abs(this.tallentObjects[ind].left - this.enemyX) <= (60 + addTalent*5) && Math.abs(this.tallentObjects[ind].top - this.enemyY) <= 50){
								setTimeout(()=>{
									clearInterval(this.enFlagTime)
									this.enFlagTime = null
									this.enFlag = false
									this.tallentObjects.splice(ind,1)
									this.cd(6000 - addTalent*250,1)
								},2000)
								let val = this.harmComputer(1,0,150+ addTalent*28,0.5)
								if(val<50){
									val = 50
								}
								this.consistBeat(val,500,2000)
								this.enFlag = true
							}
						},30)
					}
					
				}
				if(num == 2){
					this.cd(8000 - addTalent2*250,2)
					this.blueComput(30 + addTalent2*3,'reduce')
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*(0.15 + addTalent2*0.05))
					this.heroAddSpeed(35+addTalent2*5,3000+addTalent2*750)
					setTimeout(()=>{
						this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) - parseInt(this.myHero.gj*(0.15 + addTalent2*0.05))
					},3000+addTalent2*750)
				}
				if(num == 3){
					if(this.ygbj){
						this.cd(7500 - addTalent3*250,3)
						this.ygbj = false
					}else{
						this.cd(1500,3)
						this.ygbj = true
					}
					this.blueComput(25 + addTalent3*2,'reduce')
					this.playVoice('../../static/sounds/elzj3.wav',true,num-1,2500)
					this.fasheArrow(350,2,45,this.myHero.id,3,6,5)
					this.heroAnm('../../static/imgs/hero/elzj3.gif?'+ new Date().getTime())
					this.backBgImg('elzj3',2000)
				}
				if(num == 4){
					this.cd(12000 - addTalent4*300,4)
					this.blueComput(100 + addTalent4*10,'reduce')
					this.playVoice('../../static/sounds/chongji.wav',true,num-1,1800)
					this.heroChongci(200)
					let val = this.harmComputer(1,addTalent4,500+ addTalent4*100,1.3)
					//敌方生命值小于30%
					if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.3){
						val = parseInt(val*1.5)
					}
					if(strongIndex == 1){
						val = val + 350
					}
					this.beat(val)
					this.heroAnm('../../static/imgs/hero/elzj4.gif?'+ new Date().getTime())
					this.backBgImg('elzj4',1500)
				}
			}
			if(this.myHero.name == '无量仙翁' || this.myHero.id == 1008) {
				this.regGjAdd.gjHarm = parseInt(this.myHero.fs*1.5)
				if(num == 1){
					this.cd(7000 - addTalent*250,1)
					this.blueComput(60 + addTalent*6,'reduce')
					this.fasheArrow(450,2,35,this.myHero.id,1,16,2)
				}
				if(num == 2){
					this.cd(6000 - addTalent2*250,2)
					this.blueComput(50 + addTalent2*5,'reduce')
					//生命值小于30%
					if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.3){
						this.myHero.fy = this.myHero.fy + 70 + addTalent2*15
					}else{
						this.myHero.fy = this.myHero.fy + parseInt((70 + addTalent2*15)*1.5)
					}
					setTimeout(()=>{
						if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.3){
							this.myHero.fy = this.myHero.fy - 70 - addTalent2*15
						}else{
							this.myHero.fy = this.myHero.fy - parseInt((70 + addTalent2*15)*1.5)
						}
					},3500+addTalent2*500)
				}
				if(num == 3){
					this.cd(8500 - addTalent3*500,3)
					this.blueComput(80 + addTalent3*7,'reduce')
					this.delayTel(500,0)
					setTimeout(()=>{
						if(this.reallyRandom(0,1) == 0){
							this.shotDown = true
							setTimeout(()=>{
								this.shotDown = false
							},1000+addTalent3*250)
							this.enspeed = this.enspeed + 0.3 + addTalent3*0.05
							setTimeout(()=>{
								this.enspeed = this.enspeed - 0.3 - addTalent3*0.05
							},3000+addTalent3*500)
							let val = this.harmComputer(2,addTalent3,250 + this.randomNum(0,150),1)
							this.beat(val)
						}else{
							this.tallentExpert(9,1,3000+addTalent3*500)
							let val = this.harmComputer(2,addTalent3,250 + this.randomNum(0,150),1)
							this.beat(val)
						}
					},1500)
				}
				if(num == 4){
					this.cd(15000 - addTalent4*1000,4)
					this.blueComput(150 + addTalent4*15,'reduce')
					this.tallentObjects.push({
						left: this.enemyX - this.randomNum(30,70),
						top: this.enemyY - 280,
						width: 390,
						height: 390,
						img: 'tianyuanding.png'
					});
					let ind = 0
					this.tallentObjects.map((i,d)=>{
					  if(i.img == 'tianyuanding.png'){
						  ind = d
					  }
					})
					if(!this.enFlagTime){
						this.enFlagTime = setInterval(()=>{
							this.tallentObjects[ind].top = this.tallentObjects[ind].top + 20
							//装住
							if(!this.enFlag && Math.abs(this.tallentObjects[ind].left - this.enemyX) <= 150 && this.enemyY - this.tallentObjects[ind].top <= 150){
								let val = this.harmComputer(2,0,150+ addTalent4*35,0.4)
								if(val<50){
									val = 50
								}
								this.consistBeat(val,500,3000)
								this.shotDown = true
								this.enNoMove = true
								this.enFlag = true
								setTimeout(()=>{
									this.shotDown = false
									this.enNoMove = false
									this.tallentObjects.splice(ind,1)
									this.enFlag = false
								},3000 + addTalent*250)
								clearInterval(this.enFlagTime)
								this.enFlagTime = null
							}
						},350)
					}
					
					//没压到
					setTimeout(()=>{
						if(this.xuli == 0){
							this.tallentObjects.splice(ind,1)
							clearInterval(this.ylzz)
							this.ylzz = null
						}
					},4300)
				}
			}
			if(this.myHero.name == '不朽战神' || this.myHero.id == 1009) {
				if(num == 1){
					this.cd(5000 - addTalent*250,1)
					this.delayTel(300,0)
					this.blueComput(50 + addTalent*5,'reduce')
					this.playVoice('../../static/sounds/bxzs1.wav',true,num-1,1500)
					this.playMovies(1,strongIndex,true,true)
					let val = this.harmComputer(1,addTalent,250,1)
					this.beat(val)
					this.tallentExpert(3,1,3000,0.35+addTalent*0.05)
				}
				if(num == 2){
					this.cd(11000 - addTalent2*250,2)
					this.playVoice('../../static/sounds/bxzs2.wav',true,num-1,1500)
					this.blueComput(90 + addTalent2*5,'reduce')
					this.myHero.icon = ''
					//沉默
					this.shotDown = true
					this.yinshen = true
					this.enemyMoveContrl(1)
					setTimeout(()=>{
						this.computeDistance()
						if(this.distanceComp(250)){
							this.shotDown = false
							this.yinshen = false
							this.enemyMoveContrl(2)
							this.myHero.icon = this.origHero.icon
							this.heroChongci(250)
							this.playVoice('../../static/sounds/chongji.wav',true,num-1,1800)
							if(this.characterX > this.enemyX){
								this.characterX = this.enemyX - 30
							}else{
								this.characterX = this.enemyX + 30
							}
							if(this.characterY > this.enemyY){
								this.characterY = this.enemyY - 30
							}else{
								this.characterY = this.enemyY + 30
							}
							let val = this.harmComputer(1,addTalent2,150,1)
							this.beat(val)
							this.tallentExpert(5,1)
							if(strongIndex == 1){
								if(this.$refs.tallents){
									this.$refs.tallents.tallentShow = true
								}
							}
						}else{
							setTimeout(()=>{
								this.shotDown = false
								this.yinshen = false
								this.enemyMoveContrl(2)
								this.myHero.icon = this.origHero.icon
							},500+addTalent2*250)
						}
					},3500)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*300,3)
					this.blueComput(30 + addTalent3*7,'reduce')
					this.heroChongci(135)
					this.playVoice('../../static/sounds/chongji.wav',true,num-1,1800)
					let val = this.harmComputer(1,addTalent3,150,1.3)
					this.beat(val)
				}
				if(num == 4){
					this.cd(14500 - addTalent4*500,4)
					this.delayTel(1000,0)
					this.playVoice('../../static/sounds/bxzs4.mp3',true,num-1,1800)
					this.blueComput(100 + addTalent4*10,'reduce')
					this.playMovies(1,strongIndex,true,true)
					setTimeout(()=>{
						this.fasheArrow(500,2,50,this.myHero.id,4,18)
					},1000)
				}
			}
			if(this.myHero.name == '狂暴孙悟空' || this.myHero.id == 1010) {
				this.playVoice('../../static/sounds/qtds'+num+'.wav',true,num-1,4000)
				if(num == 1){
					this.delayTel(2500,num)
					this.playVoice('../../static/sounds/calsyb.mp3',false,7,2500)
					if(this.yinshen){
						this.cd(4300 - addTalent*250,1)
						this.shotDown = false
						this.yinshen = false
					}else{
						this.cd(5300 - addTalent*250,1)
					}
					this.blueComput(50 + addTalent*6,'reduce')
					this.heroAnm('../../static/imgs/hero/swk1.gif?'+ new Date().getTime())
					this.backBgImg('swk1',2900)
					let val = this.harmComputer(1,addTalent,450,1.8)
					setTimeout(()=>{
						this.beat(val)
					},2200)
					this.enemy.fy = parseInt(this.enemy.fy*(0.7-addTalent*0.05))
					setTimeout(()=>{
						this.enemy.fy = parseInt(this.enemy.fy/(0.7-addTalent*0.05))
					},3500 + addTalent*200)
					this.enemy.fy = this.enemy.fy - 5 - addTalent
					this.enemy.mk = this.enemy.mk - 5 - addTalent
				}
				if(num == 2){
					this.cd(9500 - addTalent2*150,2)
					this.delayTel(300,num)
					this.blueComput(60 + addTalent2*6,'reduce')
					this.heroAnm('../../static/imgs/hero/swk2.gif?'+ new Date().getTime())
					this.backBgImg('swk2',1200)
					this.shanxian(50 + addTalent2*5)
					this.enemyMoveContrl(1)
					this.heroAddSpeed(35 + addTalent2*5,3000 + addTalent2*120)
					this.myHero.icon = ''
					//沉默3秒
					this.shotDown = true
					this.yinshen = true
					setTimeout(()=>{
						this.shotDown = false
						this.yinshen = false
						this.enemyMoveContrl(2)
						this.myHero.icon = this.origHero.icon
					},3000 + addTalent2*250)
				}
				if(num == 3){
					this.cd(6800 - addTalent3*300,3)
					if(this.reallyRandom(0,1) == 0){
						this.playVoice('../../static/sounds/ygnlp.mp3',false,6,3600)
					}else{
						this.playVoice('../../static/sounds/alsly.mp3',false,6,3600)
					}
					this.delayTel(700,num)
					this.heroAnm('../../static/imgs/hero/swk3.gif?'+ new Date().getTime())
					this.backBgImg('swk3',4000)
					this.blueComput(80 + addTalent3*10,'reduce')
					if(parseFloat(this.myHero.v)>=0.75){
						this.myHero.v = parseFloat(this.myHero.v - 0.3 - addTalent3*0.05).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3 + addTalent3*0.05).toFixed(2)
						},3000)
					}else{
						let v = this.myHero.v
						this.myHero.v = 0.4
						setTimeout(()=>{
							this.myHero.v = v
						},3000)
					}
					this.yinshen = false
					this.heroChongci(this.myHero.dis3)
					let val = this.harmComputer(1,addTalent3,300,1.3)
					if(this.yinshen){
						val += parseInt(this.myHero.gj)
						this.shotDown = false
					}
					this.beat(val)
				}
				if(num == 4){
					this.cd(12000 - addTalent4*200,4)
					this.blueComput(120 + addTalent4*15,'reduce')
					this.delayTel(4000,num)
					this.heroAnm('../../static/imgs/hero/swk4.gif?'+ new Date().getTime())
					this.backBgImg('swk4',4000)
					this.follow(1,4000)
					this.myNoMove = true
					this.cd5 = false
					this.myHero.fy = parseInt(this.myHero.fy + this.myHero.fy*0.5)
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy - this.myHero.fy*0.5)
						this.cd5 = true
						this.myNoMove = false
					},4000)
					let val = this.harmComputer(1,0,70+addTalent4*25,0.4)
					  if(val < 30){
						  val = 30
					  }
					  let beatTime = setInterval(()=>{
					  	this.beat(val,1)
					  },300)
					  setTimeout(()=>{
					  	clearInterval(beatTime)
					  },4000)
				}
			}
			if(this.myHero.name == '艾欧尼亚之箭' || this.myHero.id == 1011){
				this.regGjAdd.gjHarm = this.min*110
				if(num == 1){
					this.cd(7000 - addTalent*250,1)
					this.blueComput(80 + addTalent*8,'reduce')
					this.delayTel(500,num)
					this.playVoice('../../static/sounds/aonyzj1.wav',true,5,1200)
					this.playMovies(1,strongIndex,true)
						let val = this.harmComputer(1,addTalent,300 + this.randomNum(50,200),1.1)
						if(this.reallyRandom(0,2) == 1){
							val = parseInt(val*2.5)
						}
						setTimeout(()=>{
							this.beat(val)
						},900)
				}
				if(num == 2){
					this.cd(10000 - addTalent2*500,2)
					this.blueComput(50,'reduce')
					if(parseFloat(this.myHero.v)>0.6){
						this.myHero.v = parseFloat(this.myHero.v - 0.3).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3).toFixed(2)
						},2500+addTalent2*500)
					}
				}
				if(num == 3){
					this.cd(7000 - addTalent2*350,3)
					this.blueComput(60,'reduce')
					let dir = this.randomNum(0,1)
					if(dir == 1){
						this.characterY = this.characterY + 55 + this.randomNum(0,15) + addTalent3*6
					}else{
						if(this.characterY > 89){
							this.characterY = this.characterY - 55 - this.randomNum(0,15) + addTalent3*6
						}
					}
					setTimeout(()=>{
						this.playVoice('../../static/sounds/jyzs4.wav',true,num-1,4000)
						this.fasheArrow(2000,2,42,this.myHero.id,3,3,5)
					},300)
				}
				if(num == 4){
					this.cd(15000 - addTalent4*350,4)
					this.blueComput(120 + addTalent4*12,'reduce')
					this.delayTel(800,num)
					this.playMovies(4,strongIndex,true)
					this.tallentExpert(6,2,3500+addTalent4*1000)
				}
			}
			if(this.myHero.name == '艾欧尼亚之闪' || this.myHero.id == 1012){
				this.antijiansu = 0.5
				if(num == 1){
					this.cd(4000 - addTalent*250,1)
					this.blueComput(25 + addTalent*3,'reduce')
					this.delayTel(500,num)
					this.playMovies(1,strongIndex,true,true)
					if(this.xuli >=4){
						this.xuli = 4
					}else{
						this.xuli = this.xuli + 1
					}
					let val = this.harmComputer(1,addTalent,350,1)
					if(strongIndex == 1){
						val = val + this.myHero.gj + 50
					}
					setTimeout(()=>{
						this.beat(val)
					},500)
				}
				if(num == 2){
					this.cd(13000 - addTalent2*300,2)
					this.playVoice('../../static/sounds/aonyzs2.mp3',true,num-1,2500)
					this.delayTel(600,num)
					this.blueComput(60 + addTalent2*5,'reduce')
					if(this.xuli >=4){
						this.xuli = 4
					}else{
						this.xuli = this.xuli + 1
					}
					setTimeout(()=>{
						this.fasheArrow(255,2,65,this.myHero.id,2,7)
					},600)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*250,3)
					this.blueComput(35 + addTalent3*5,'reduce')
					if(this.xuli < 4){
						this.playVoice('../../static/sounds/aning3.wav',true,num-1,1500)
						this.heroChongci(50+addTalent3*10,1)
						if(this.distanceComp(85)){
							let val = this.harmComputer(1,addTalent3,350,1)
							this.beat(val)
						}
					}else{
						this.fastsp = this.myspeed - 0.1
						this.myNoMove = true
						let dir = 'left'
							if(this.characterX > this.enemyX){
								dir = 'left'
								this.characterX = this.characterX - 70
							}
							if(this.characterX <= this.enemyX){
								this.characterX = this.characterX + 70
								dir = 'right'
							}
						if(this.distanceComp(85)){
							let val = this.harmComputer(1,addTalent3,250,1)
							this.beat(val)
						}
						this.playVoice('../../static/sounds/aning3.wav',true,num-1,450)
						setTimeout(()=>{
							if(dir == 'left'){
								this.characterX = this.characterX - 70
							}else{
								this.characterX = this.characterX + 70
							}
							if(this.distanceComp(85)){
								let val = this.harmComputer(1,addTalent3,250,1)
								this.beat(val)
							}
							this.playVoice('../../static/sounds/aning3.wav',true,num-1,450)
						},520)
						setTimeout(()=>{
							if(dir == 'left'){
								this.characterX = this.characterX - 70
							}else{
								this.characterX = this.characterX + 70
							}
							if(this.distanceComp(85)){
								let val = this.harmComputer(1,addTalent3,250,1)
								this.beat(val)
							}
							this.playVoice('../../static/sounds/aning3.wav',true,num-1,450)
						},1040)
						setTimeout(()=>{
							if(dir == 'left'){
								this.characterX = this.characterX - 70
							}else{
								this.characterX = this.characterX + 70
							}
							if(this.distanceComp(85)){
								let val = this.harmComputer(1,addTalent3,250,1)
								this.beat(val)
							}
							this.playVoice('../../static/sounds/aning3.wav',true,num-1,450)
							this.fastsp = 0
							this.myNoMove = false
						},1560)
					}
					this.xuli = 0
				}
				if(num == 4){
					this.cd(13500 - addTalent4*350,4)
					if(this.enemy.icon == 'xuanyun.gif'){
						this.playVoice('../../static/sounds/aonyzs.mp3',true,num-1,2500)
						this.blueComput(120 + addTalent4*12,'reduce')
						this.delayTel(2550,num)
						this.playMovies(4,strongIndex,true,true)
						this.heroChongci(250)
						this.tallentExpert(1,1,2500)
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},2500)
						let val = this.harmComputer(1,0,225+ addTalent4*40,1.1)
						if(strongIndex == 1){
							val = val + 150
						}
						this.consistBeat(val,500,2550)
					}else{
						this.blueComput(60 + addTalent4*6,'reduce')
						this.myHero.gj = this.myHero.gj + 35 + addTalent4*10
						setTimeout(()=>{
							this.myHero.gj = this.myHero.gj - 35 - addTalent4*10
						},3000)
					}
				}
			}
			if(this.myHero.name == '艾欧尼亚之影' || this.myHero.id == 1013){
				if(num == 1){
					this.cd(8000 - addTalent*250,1)
					this.blueComput(50 + addTalent*5,'reduce')
					this.fasheArrow(380,2,46,this.myHero.id,1,19,0)
				}
				if(num == 2){
					this.cd(7000 - addTalent2*250,2)
					this.blueComput(30,'reduce')
					if(strongIndex == 1){
						this.heroAddSpeed(35+addTalent2*5,4000)
					}else{
						this.heroAddSpeed(25+addTalent2*5,4000)
					}
				}
				if(num == 3){
					this.cd(9500 - addTalent3*250,3)
					this.blueComput(70 + addTalent3*7,'reduce')
					this.fasheArrow(320,2,35,this.myHero.id,3,6,1)
				}
				if(num == 4){
					this.cd(14000 - addTalent4*330,4)
					this.blueComput(125 + addTalent4*10,'reduce')
					this.delayTel(1000,num)
					this.playMovies(4,strongIndex,true,true)
					setTimeout(()=>{
						this.fasheArrow(500,2,39,"无",4,14)
						this.playVoice('../../static/sounds/elzj3.wav',true,num-1,1500)
						if(Math.abs(this.characterX - this.enemyX) <= 625 && Math.abs(this.characterY - this.enemyY)<=39){
							let val = this.harmComputer(2,addTalent4,500+ addTalent4*50,1.5)
							if(strongIndex == 1){
								val = val + parseInt(this.myHero.fs*0.5) + 100
							}
							this.beat(val)
						}
					},850)
				}
				//被动
				if(this.cd1 && this.cd2 && this.cd3){
					this.myHero.icon = ''
					this.shotDown = true
					this.yinshen = true
					setTimeout(()=>{
						this.shotDown = false
						this.yinshen = false
						this.myHero.icon = this.origHero.icon
					},1500)
				}
			}
			if(this.myHero.name == '艾欧尼亚之灵' || this.myHero.id == 1014){
				if(num == 1){
					this.cd(8000 - addTalent*250,1)
					this.blueComput(80 + addTalent*8,'reduce')
					this.fasheArrow(430,2,32,this.myHero.id,1,16,3)
				}
				if(num == 2){
					this.cd(8000 - addTalent2*250,2)
					this.blueComput(50,'reduce')
					this.myHero.fs = this.myHero.fs + 30 + addTalent2*10
					setTimeout(()=>{
						this.myHero.fs = this.myHero.fs - 25 - addTalent2*10
					},5000)
					if(strongIndex == 1){
						this.heroAddSpeed(35,3500)
					}
				}
				if(num == 3){
					this.cd(10000 - addTalent3*250,3)
					this.delayTel(500,num)
					this.blueComput(60 + addTalent3*5,'reduce')
					this.playMovies(3,strongIndex,true,true)
					setTimeout(()=>{
						let val = this.harmComputer(2,addTalent3,200,1.2)
						this.beat(val)
						let x = this.reallyRandom(0,1)
						let mk = parseInt(this.enemy.mk*(0.3+addTalent3*0.05))
						let gj = parseInt(this.enemy.gj*(0.4+addTalent3*0.05))
						if(x == 0){
							this.enemy.mk = this.enemy.mk - mk
							setTimeout(()=>{
								this.enemy.mk = this.enemy.mk + mk
							},3000)
							uni.showToast({
								title: '飞子',
								icon:'none',
								duration: 700
							});
						}else{
							this.enemy.gj = this.enemy.gj - gj
							setTimeout(()=>{
								this.enemy.gj = this.enemy.gj + gj
							},4000)
							uni.showToast({
								title: '弃子',
								icon:'none',
								duration: 700
							});
						}
					},500)
					
				}
				if(num == 4){
					this.cd(17000 - addTalent4*350,4)
					this.blueComput(135 + addTalent4*10,'reduce')
					this.delayTel(1500,num)
					this.playMovies(4,strongIndex,true,true)
					this.tallentExpert(1,2,1500)
					setTimeout(()=>{
						this.addBlood(this.myHero.fs*2,0,0)
						this.characterX = parseInt(this.screenWidth * 1.28)
					},1500)
				}
			}
			if(this.myHero.name == '艾欧尼亚之心' || this.myHero.id == 1015){
				if(num == 1){
					this.cd(8000 - addTalent*250,1)
					this.blueComput(90 + addTalent*9,'reduce')
					this.fasheArrow(335,2,35,this.myHero.id,1,21,3)
				}
				if(num == 2){
					this.cd(10000 - addTalent2*250,2)
					this.blueComput(60,'reduce')
					this.playMovies(2,strongIndex,true)
					if(!this.ygbj){
						this.ygbj = setInterval(()=>{
							if(this.distanceComp(120)){
								let val = this.harmComputer(2,0,120+addTalent2*60,0.7)
								if(val<100){
									val = 100
								}
								this.consistBeat(val,500,1520)
								clearInterval(this.ygbj)
								this.ygbj = false
							}
						},1000)
					}
					setTimeout(()=>{
						clearInterval(this.ygbj)
						this.ygbj = false
					},4000)
				}
				if(num == 3){
					this.cd(11500 - addTalent3*250,3)
					this.delayTel(500,num)
					this.blueComput(100 + addTalent3*5,'reduce')
					this.playMovies(3,strongIndex,true)
					this.fasheArrow(300,2,30,this.myHero.id,3,24,2)
				}
				if(num == 4){
					if(this.xuli >= 3){
						this.cd(17000 - addTalent4*350,4)
						this.xuli = 0
					}else{
						this.xuli = this.xuli + 1
						setTimeout(()=>{
							if(this.$refs.tallents){
								this.$refs.tallents.tallentShow4 = true
							}
						},500)
					}
					this.playVoice('../../static/sounds/chongji.wav',true,num+3,1200)
					this.blueComput(50 + addTalent4*5,'reduce')
					this.heroChongci(60 + addTalent4*6 + this.reallyRandom(0,3)*6,1)
					if(this.distanceComp(105)){
						let val = this.harmComputer(2,addTalent4,250+this.reallyRandom(0,3)*100,1)
						if(val<150){
							val = 150
						}
						this.beat(val,1)
					}
				}
			}
			if(this.myHero.name == '女警' || this.myHero.id == 103){
				if(num == 1){
					this.cd(3500 - addTalent*200,1)
					this.blueComput(20 + addTalent*2,'reduce')
					this.fasheArrow(350,2,25,this.myHero.id,1,12,3)
					this.playVoice('../../static/sounds/jyzs1-1.wav',true,num-1,3000)
				}
				if(num == 3){
					if(strongIndex == 1){
						this.cd(6500 - addTalent3*250,3)
					}else{
						this.cd(8000 - addTalent3*250,3)
					}
					this.blueComput(60 + addTalent3*6,'reduce')
					this.fasheArrow(420,2,39,this.myHero.id,3,2,1)
					if(this.enemyX < this.characterX){
						this.characterX = this.characterX + (80 + addTalent3*10)
					}else{
						this.characterX = this.characterX - (80 + addTalent3*10)
					}
				}
				if(num == 4){
					this.cd(12000 - addTalent4*300,4)
					this.playVoice('../../static/sounds/nj4.mp3',false,num-1,1500)
					setTimeout(()=>{
						this.playVoice('../../static/sounds/nj4_2.mp3',false,num-1,1500)
					},1500)
					this.playMovies(4,strongIndex,true)
					this.delayTel(2500,num)
					this.blueComput(100 + addTalent4*10,'reduce')
					setTimeout(()=>{
						this.fasheArrow(500,2,99,this.myHero.id,4,20,2)
					},2500)
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
			if(this.$refs.tallents && this.$refs.tallents.tallentShow){
				this.$refs.tallents.tallentShow = false
				setTimeout(()=>{
					this.$refs.tallents.tallentShow = true
				},time)
			}
			if(this.$refs.tallents && this.$refs.tallents.tallentShow2){
				this.$refs.tallents.tallentShow2 = false
				setTimeout(()=>{
					this.$refs.tallents.tallentShow2 = true
				},time)
			}
			if(this.$refs.tallents && this.$refs.tallents.tallentShow3){
				this.$refs.tallents.tallentShow3 = false
				setTimeout(()=>{
					this.$refs.tallents.tallentShow3 = true
				},time)
			}
			if(this.$refs.tallents && this.$refs.tallents.tallentShow4){
				this.$refs.tallents.tallentShow4 = false
				setTimeout(()=>{
					this.$refs.tallents.tallentShow4 = true
				},time)
			}
			this.tallentDuring = time
			this.showTallentTime = true
			this.cd5 = false
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
			this.computeDistance()
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
					},(this.myspeed-this.fastsp) * 1000-300)
				}
				return
			}
			if(!this.innerAudioContext[7]){
				this.playVoice('../../static/sounds/'+this.myHero.id+'.wav',true,7,1000)
			}
			this.cd5 = false
			let v = parseFloat(this.myHero.v) * 1000
			let val = this.harmComputer(1,0,50+parseInt(this.myHero.fs*0.2) + this.regGjAdd.gjHarm,1)
			let hasBj = false
			//暴击
			if(this.randomNum(0,10) <= (parseFloat(this.myHero.bj) * 10)){
				hasBj = true
				if(this.myEquipName.includes('无尽之刃')) {
					val = (val - this.regGjAdd.gjHarm) * 2.6 + this.regGjAdd.gjHarm
				}else{
					val = (val - this.regGjAdd.gjHarm) * 2 + this.regGjAdd.gjHarm
				}
			}
			//焚天装备
			if(this.myEquipName.includes('焚天')){
				if(!hasBj){
					if((this.$refs.tallents.tallentShow == false && this.$refs.tallents.tallentShow2 == false) ||
					(this.$refs.tallents.tallentShow3 == false && this.$refs.tallents.tallentShow2 == false) ||
					(this.$refs.tallents.tallentShow == false && this.$refs.tallents.tallentShow3 == false)){
						if(this.myEquipName.includes('无尽之刃')) {
							val = (val - this.regGjAdd.gjHarm) * 2.6 + this.regGjAdd.gjHarm
						}else{
							val = (val - this.regGjAdd.gjHarm) * 2 + this.regGjAdd.gjHarm
						}
						this.addBlood(250,0,0)
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
		getTTEnmList() {
			const self = this
			let resp = [...res.data]
			self.enmList = resp.slice()
			let list = []
			self.enmList.forEach(item=>{
				if(item.level == 200) {
					list.push(item)
				}
			})
			if(list.length == 1 && list.length != 0){
				self.enemy = list[0]
			}else{
				self.enemy = {...list[self.reallyRandom(0,list.length - 1)]}
			}
		},
		getSptBoss() {
			this.enemy = JSON.parse(uni.getStorageSync('sptBoss'))
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
			this.speed = 32
			let has1 = false	//冰晶节杖
			let bloodsEq = 0	//装备总加血量
			let flzEq = 0	//装备总加法力值
			this.regGjAdd.gjHarm = 0
			this.myEquipName.splice(0)
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
					if(parseFloat(this.myHero.v) - parseFloat(item.gs) >= 0.3){
						this.myHero.v = parseFloat(this.myHero.v) - parseFloat(item.gs)
					}else{
						uni.showToast({
							title: '提示：攻击速度最快为0.3s/次',
							icon:'none',
							duration: 1000
						});
						this.myHero.v = 0.3
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
					this.speed = this.speed + item.speed*100
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
					this.pomo -= 0.36
				}
				if(item.name == '法师之靴') {
					this.pomo -= 0.15
				}
				if(item.name == '轻灵之靴') {
					this.antijiansu = this.antijiansu + 0.25
				}
				if(item.name == '迅速进军') {
					this.antijiansu = this.antijiansu + 0.6
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
				if(item.name == '灭世者的死亡之帽'){
					this.myHero.fs = parseInt(this.myHero.fs) + parseInt(this.myHero.fs*0.2)
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
				if(item.name == '宝莲灯') {
					let hs = false
					this.myTool.forEach((i,index)=>{
						if(i.name == '宝莲灯') {
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
				if(item.name == '贪欲九头蛇') {
					this.pojia -= 0.15
					let hs = false
					this.myTool.forEach((i,index)=>{
						if(i.name == '贪欲九头蛇') {
							hs = true
						}
					})
					if(!hs){
						this.myTool.push(item)
					}
				}
				//羽翼
				if(item.name.indexOf('羽翼') != -1){
					this.flyStyle = item.img
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
					this.myHero.gj = parseInt(this.myHero.gj) + 35
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.1).toFixed(2)
					this.pojia -= 0.1
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*0.6)
				}else if(item.name == '界弓'){
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*0.5)
				}
				
				
			})
			//羽翼
			if(JSON.parse(uni.getStorageSync('myStore')).length != 0){
				JSON.parse(uni.getStorageSync('myStore')).forEach(i=>{
					if(i.isOther && i.name.indexOf('羽翼') != -1){
						if(i.fy != 0){
							this.myHero.fy = parseInt(this.myHero.fy) + i.fy
						}
							this.myspeed -= parseFloat(i.speed).toFixed(2)
							this.speed = this.speed + parseFloat(i.speed).toFixed(2)*100
					}
				})
			}
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
			if(name == '宝莲灯') {
				this.fasheArrow(350,2,37,"宝莲灯",1,24,2)
				this.playVoice('../../static/sounds/bld.wav',false,3,1500)
			}
			if(name == '幽梦之灵') {
				this.heroAddSpeed(50,3000)
			}
			if(name == '贪欲九头蛇') {
				this.beat(this.harmComputer(1,0,360,0))
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
			if(name == '海洋龙魂') {
				this.addBlood(parseInt(this.myHero.blood*0.7),0,0)
				this.blueComput(500,"add")
			}
			if(name == '炼狱龙魂') {
				this.myEquipName.push('炼狱龙魂')
			}
			if(name == '云霄龙魂') {
				this.heroAddSpeed(120,12000)
				this.speed = this.speed + 5
			}
			if(name == '山脉龙魂') {
				this.myHero.fy = this.myHero.fy + 150
				setTimeout(()=>{
					this.myHero.fy = this.myHero.fy - 144
				},7000)
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
				this.myHero.fs = parseInt(this.myHero.fs) + 50
				setTimeout(()=>{
					this.myHero.fs = parseInt(this.myHero.fs) - 50
				},6000)
			}
			if(name == '攻击提升药水') {
				this.myHero.gj = parseInt(this.myHero.gj) + 35
				setTimeout(()=>{
					this.myHero.gj = parseInt(this.myHero.gj) - 35
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
			this.flag = 0
			this.flag2 = 0
			this.xuli = 0
			this.ygbj = false
			this.initGame()
			clearInterval(this.goTime2)
			clearInterval(this.arrowTimer)
			this.videoEnded(1)
			this.videoEnded()
			let addPointer = 0
			if(parseInt(this.enemy.level)>300){
				addPointer = (parseInt(this.enemy.level)-999)*160
			}else{
				addPointer = this.enemy.level?(parseInt(this.enemy.level)-200)*26:100
			}
			//增加英雄经验
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			datas.forEach((it,idx)=>{
				if(this.myHero.id == it.id){
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
			if(this.myHero.id == 16){	//东海龙王
				this.myHero.icon = 'ag.jpg'
			}
			if(this.myHero.id == 1006){	//地狱火被动
				this.myHero.fs += 15
				this.addBlood(200,0,0)
			}
			if(this.myHero.id == 1009){	//不朽战神被动
				this.myHero.gj = this.myHero.gj + 5 + this.reallyRandom(0,3)
				this.myHero.fy = this.myHero.fy + 5 + this.reallyRandom(0,3)
			}
			if(this.myEquipName.includes('公理圆弧')){
				this.myHero.gj = this.myHero.gj + 12
			}
			if(this.myEquipName.includes('降龙剑')){
				this.myHero.gj = this.myHero.gj + 5 + this.reallyRandom(0,4)
			}
			if(this.gameType == 'spt'){	//胜利
				this.money = editMoney(300 + 1200*parseInt(this.enemy.levelNum))
				let has = false
				this.myStore.forEach(i=>{
					if(i.id == this.enemy.id){
						has = true
					}
				})
				if(!has){
					this.modelFrame('获得【'+this.enemy.name+'】的精元，使用期限3天','信息')
					if(this.tempEnemyIcon != this.enemy.icon && this.tempEnemyIcon){
						this.enemy.icon = this.tempEnemyIcon
					}
					let inf = null
					res.data.forEach(it=>{
						if(it.name == this.enemy.name){
							inf = {...it}
						}
					})
					inf.buyTime = new Date().getTime()
					inf.blood = inf.heroBlood
					inf.gj = parseInt(inf.gj * 0.6)
					inf.fy = parseInt(inf.fy * 0.4)
					if(inf.fy < 75){
						inf.fy = 75
					}
					this.myStore.push(inf)
					uni.setStorageSync('myStore',JSON.stringify(this.myStore));
				}
				this.win = true
				this.showWinLogo2 = true
				setTimeout(()=>{
					this.showWinLogo2 = false
				},4000)
			}else{
				if(this.enemy.level != 220) {
					this.getLoopEnmList(parseInt(this.enemy.level)+1)
					return
				}
				//胜利
				if(this.enemy.level == 220){
					this.money = editMoney(2500)
					let myToolList = JSON.parse(uni.getStorageSync('tanxianPack'))
					let has = false
					myToolList.forEach(i=>{
						if(i.name == '山脉龙魂'){
							has = true
						}
					})
					if(!has){
						uni.showToast({
							title: '获得【山脉龙魂】',
							icon:'none',
							duration: 2000
						});
						myToolList.push({"id":new Date().getTime(),"name":"山脉龙魂","gj": 0,"fy": 6,"fs": 0,"flz": 0,"speed": 0,"img":"shanmailh.png","icon":"shanmailh.png","detail":"主动释放后，提升自己防御力150，持续7秒，并永久提升6防御力","price":0,"istool":1})
						uni.setStorageSync('tanxianPack',JSON.stringify(myToolList))
					}
					this.modelFrame('恭喜你战无不胜，成为了三界武将第一人！！（来自玉帝发来的贺报）奖励2500元','捷报')
					this.win = true
					this.showWinLogo2 = true
					setTimeout(()=>{
						this.showWinLogo2 = false
					},4000)
					this.videoEnded(1)
					this.videoEnded()
					return
				}
			}
			
		},
		modelFrame(text,title) {
			uni.showToast({
				title: text,
				icon:'none',
				duration: 2300
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
						},
						fail: function(e) {
							console.log(e)
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
		//装填英雄加成
		getAddTalent(option) {
			let self = this
			let goods = [...res4.data]
			res3.data.concat(goods).forEach(ite=>{
				if(ite.id == self.myHero.id){
					self.myHero = {...ite}
				}
			})
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
						this.strongId = i.id+'_'+i.index
					}
				})
			}else{
				this.strongId = this.myHero.id
			}
			this.flz = this.myHero.flz + this.addData.add2*100
			this.blood2 = this.myHero.blood + this.addData.add1*150
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
			if(this.myHero.name == '齐天大圣' || this.myHero.name == '狂暴孙悟空'){
				this.myHero.fy += Math.ceil(this.addData.allPointer/500)*2
			}
			if(option != 1){
				this.addEnemyStrong()
			}
		},
		//战胜敌方，下一轮
		getLoopEnmList(num) {
			const self = this
			this.bloodVal1 = 100
			this.begin = false
			this.bettleEnd = false
			this.initGame()
			clearInterval(this.beatTime)
			this.videoEnded(1)
			this.videoEnded()
			this.enemyX = this.reallyRandom(0,5)*parseInt((this.screenWidth - 150)/5)
			this.enemyY = this.reallyRandom(0,5)*parseInt((this.screenHeight - 80)/5)
			//开启防御塔
			if(num >= 212){
				if(this.bgImgIndex == 0 || this.bgImgIndex == 4){
					this.showTower2 = true
				}else{
					this.showTower = true
				}
			}
			if(num == 201){
				this.money = editMoney(100)
				this.modelFrame('恭喜你击败了地府第一兽!','捷报')
			}
			if(num == 202){
				this.money = editMoney(100)
				this.modelFrame('恭喜你击败了黑白无常!','捷报')
			}
			if(num == 203){
				this.money = editMoney(100)
				this.modelFrame('恭喜你击败了'+this.enemy.name+'!','捷报')
			}
			if(num == 204){
				this.money = editMoney(100)
				this.addBlood(600,0,0)
				this.modelFrame('嘿！你太厉害啦，击败了地府之王——阎王！接下来开始征战凡间。','捷报')
			}
			if(num == 205){
				this.money = editMoney(150)
				this.addBlood(700,0,0)
				this.modelFrame('恭喜你击败了'+this.enemy.name+' ！','捷报')
			}
			if(num == 206){
				this.money = editMoney(150)
				this.addBlood(800,0,0)
				this.modelFrame('恭喜你击败了'+this.enemy.name+' ！接下来应战的是人间第一人赵云，做好准备！','捷报')
			}
			if(num == 208){
				this.money = editMoney(200)
				this.addBlood(900,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+' ！收到人间第一猛将关羽请战！速战！','捷报')
			}
			if(num == 209){
				this.money = editMoney(300)
				this.addBlood(1000,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+' ！接下来我们前往妖族区，降魔除妖！','捷报')
				this.bgImg = '../../static/imgs/battlebg4.jpg'
			}
			if(num == 212){
				this.money = editMoney(300)
				this.addBlood(1100,0,0)
				this.modelFrame('祝贺你拿下了石矶娘娘！'+this.enemy.name+'!接下来是白蛇白素贞，有技能会让你中毒，请小心。奖励300元','捷报')
			}
			if(num == 213){
				this.money = editMoney(350)
				this.addBlood(1200,0,0)
				this.modelFrame('祝贺你拿下了白素贞！'+this.enemy.name+'!接下来迎战的是北海龙王，千万要小心！奖励350元','捷报')
			}
			if(num == 214){
				this.money = editMoney(500)
				this.addBlood(1500,0,0)
				this.modelFrame('恭喜你打败了龙族的北海龙王！'+this.enemy.name+'!接下来前往天庭，迎战天庭的诸位神。奖励600元','捷报')
			}
			if(num == 215){
				this.money = editMoney(700)
				this.addBlood(1600,0,0)
				this.modelFrame('拿下了天庭第一小将！'+this.enemy.name+'!但不要松懈，后面还有更厉害的神。奖励700元','捷报')
			}
			if(num == 216){
				this.money = editMoney(900)
				this.addBlood(1700,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+'!接下来要迎战十万天兵天将，曾经孙悟空大闹天宫时的对手！奖励900元','捷报')
			}
			if(num == 217){
				this.money = editMoney(1200)
				this.addBlood(1800,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+'!接下来要迎战的是天庭四大天王！请做好准备。奖励1200元','捷报')
			}
			if(num == 218){
				this.money = editMoney(1200)
				this.addBlood(2000,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+'!接下来要迎战的是金蝉子！他的罗汉翻天印伤害非常高，会受到你生命值的60%伤害。奖励1200元','捷报')
			}
			if(num == 219){
				this.money = editMoney(1300)
				this.addBlood(2000,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+'!接下来要迎战杨戬，他可是二郎显圣真君，天庭一大将！奖励1300元','捷报')
			}
			if(num == 220){
				this.money = editMoney(1500)
				this.addBlood(2000,0,0)
				this.modelFrame('你太厉害了!竟然击败了'+this.enemy.name+'!接下来要迎战最后一位，斗战胜佛——大闹天宫的齐天大圣，做好准备了吗？奖励1500元','捷报')
			}
			
			this.flz = parseInt(this.flz) + 350
			if(this.flz > parseInt(this.myHero.flz)){
				this.flz = this.myHero.flz
			}
			if(this.myEquipName.includes('梅贾的窃魂卷')) {
				this.myHero.fs = this.myHero.fs + 20
				this.origHero.fs = this.origHero.fs + 20
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
					if(list.length == 1){
						self.enemy = list[0]
					}else{
						self.enemy = {...list[self.reallyRandom(0,list.length - 1)]}
					}
					self.blood1 = self.enemy.blood
					self.enemyGJdis = self.enemy.distance
					self.enspeed = self.enemy.speed
					let text = ''
					if(self.enemy.name == '海贼王-路飞'){
						text = '你本轮的对手是海贼王家族的路飞，实力有点强悍。'
					}
					if(self.enemy.name == '三界-二郎神杨戬'){
						text = '你本轮的对手是三界的二郎神杨戬，实力特别强悍。有招式：天眼——能让你攻击力和法力值下降。'
						self.myHero.gj = parseInt(self.myHero.gj) - 22
						if(parseInt(self.myHero.fs)>35){
							self.myHero.fs = parseInt(self.myHero.fs) - 35
						}
					}
		
					if(text != ''){
						setTimeout(()=>{
							self.modelFrame(text,'小提示')
						},2500)
					}
					self.addEnemyStrong()
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
			if(!self.enConsisAddTime){
				self.enConsisAddTime = setInterval(()=>{
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
					clearInterval(self.enConsisAddTime)
					self.enConsisAddTime = null
				},timeout)
			}
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

		//标准伤害算法
		harmComputer(type,addTalent,baseVal,adPoint) {
			let val = 0
			if(this.pojia<0.3){
				this.pojia = 0.3
			}
			if(this.pomo<0.3){
				this.pomo = 0.3
			}
			let jianmian = parseInt(this.enemy.fy*this.pojia)
			let jianmianPointer = parseFloat(jianmian/(jianmian+100)).toFixed(3)
			let jianmian2 = parseInt(this.enemy.mk*this.pomo)
			let jianmianPointer2 = parseFloat(jianmian2/(jianmian2+100)).toFixed(3)
			let enemyjianmian = parseInt(this.myHero.fy)
			let enemyjianmianPointer = parseFloat(enemyjianmian/(enemyjianmian+100)).toFixed(3)
			//攻击
			if(type == 1){
				// val = (parseInt(this.myHero.gj * (2.8+addTalent*0.2)) - parseInt(this.enemy.fy*4.3*this.pojia))*2
				val = parseInt((baseVal + addTalent*70 + adPoint * parseInt(this.myHero.gj)) * (1 - jianmianPointer))
			}
			//法术
			if(type == 2){
				// val = (parseInt(this.myHero.fs * (2.8 + addTalent*0.2)) - parseInt(this.enemy.mk*4.3*this.pomo))*2
				val = parseInt((baseVal + addTalent*60 + adPoint * parseInt(this.myHero.fs)) * (1 - jianmianPointer2))
			}
			//敌方英雄
			if(type == 3){
				// val = (parseInt(this.enemy.gj * 2.8) - parseInt(this.myHero.fy*3))*2 + 100
				if(baseVal){
					val = parseInt((baseVal + parseInt(this.enemy.gj*1.5)) * (1 - enemyjianmianPointer))
				}else{
					val = parseInt((450 + parseInt(this.enemy.gj*1.5)) * (1 - enemyjianmianPointer))
				}
			}
			// if(val < 0){
			// 	val = parseInt(val/2)
			// }
			return val
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
					let val2 = this.harmComputer(2,0,150,0.25)
					this.beat(val2,1)
				},900)
				setTimeout(()=>{
					clearInterval(t)
				},2750)
				this.xuli = 0
			}
			if(this.myHero.id == 15 && parseInt(this.addData.strongIndex) == 1) {
				this.tallentExpert(3,1,1000,0.7)
			}
			if(this.myHero.name == '敖丙' || this.myHero.id == 20){
				if(this.reallyRandom(0,1) == 1){
					let val = parseInt(this.myHero.gj * 2.3) + parseInt(this.myHero.fs*0.6) - parseInt(this.enemy.fy*2.2) + 250
					if(val < 50){
						val = this.randomNum(30,90)
					}
					this.beat(val,1)
				}
			}
			if(this.myHero.name == '隐世侠客' || this.myHero.id == 22){
				if(this.reallyRandom(0,1) == 1){
					let strongIndex = 0
					if(this.addData.strongIndex){
						strongIndex = parseInt(this.addData.strongIndex)
						if(strongIndex == 2){
							strongIndex = 0
						}
					}
					this.addBlood(this.randomNum(20 + strongIndex*80,100 + strongIndex*120),0,0)
				}
			}
			if(this.myHero.name == '亡灵战神' || this.myHero.id == 24){
				if(this.reallyRandom(0,1) == 1){
					if(this.pojia > 0.3){
						this.pojia -= 0.1
						setTimeout(()=>{
							this.pojia += 0.1
						},3000)
					}
				}
			}
			if(this.myHero.name == '女警' || this.myHero.id == 103) {
				this.xuli = this.xuli + 1
				if(this.xuli > 4){
					let val = parseInt(this.myHero.gj * 2)
					this.beat(val,1)
					this.xuli = 0
				}
			}
			if(this.myHero.name == '二郎真君-杨戬' || this.myHero.id == 1007) {
				if(this.reallyRandom(0,2) == 1){
					if(this.myHero.bj < 0.7){
						this.myHero.bj = this.myHero.bj + 0.2
					}
				}
			}
			if(this.myHero.name == '艾欧尼亚之灵' || this.myHero.id == 1014){
				if(this.reallyRandom(0,2) == 0){
					this.regGjAdd.gjHarm = parseInt(this.myHero.fs*0.5)
				}
				if(this.reallyRandom(0,2) == 1){
					this.regGjAdd.gjHarm = parseInt(this.myHero.fs)
				}
				if(this.reallyRandom(0,2) == 2){
					this.regGjAdd.gjHarm = parseInt(this.myHero.fs*2)
				}
			}
			if(this.myEquipName.includes('冰脉护手')){
				this.tallentExpert(3,1,1000,0.6)
			}
			if(this.myEquipName.includes('至尊幻焰剑')){
				this.regGjAdd.gjHarm = parseInt(this.myHero.fs*0.5)
			}
		},
		
		//计算距离
		computeDistance() {
			let x = Math.abs(this.characterX - this.enemyX)
			let y = Math.abs(this.characterY - this.enemyY)
			this.distance = Math.sqrt(x*x+y*y)
		},
		//地图上的物体被踩到
		mapObjsEvent(idx,type) {
			if(type == 1){	//敌方踩到
				if((this.myHero.name == '迅捷斥候' || this.myHero.id == 12) && this.mapObjects[idx].img == 'mogu.png'){
					let addTalent4 = parseInt(this.addData.add11)
					if(this.myEquipName.includes('残疫')) {
						addTalent4 += 2
					}
					let val = this.harmComputer(2,0,170+addTalent4*35,0.5)
					this.tallentExpert(3,1,2500)
					this.mapObjects.splice(idx,1)
					let t = setInterval(()=>{
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
							this.addBlood(1000,0,0)
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
								this.heroAddSpeed(45,5000)
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
							this.addBlood(2000,0,0)
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
			let intervalTime = (this.myspeed-this.fastsp) * 1000-300
			if(intervalTime <= 1){
				intervalTime = 500
			}
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
				},intervalTime)
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
				},intervalTime)
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
				},intervalTime)
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
				},intervalTime)
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
				}, intervalTime+300)
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
				}, intervalTime+300)
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
				}, intervalTime+300)
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
				}, intervalTime+300)
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
							if(parseInt(this.addData.strongIndex) == 1 || parseInt(this.addData.strongIndex) == 2){
								val = val + 50
							}
							this.tallentExpert(3,1,1000)
							this.beat(val,1)
						}
					}
				})
			}
			if(this.mapObjects.length != 0 && (this.myHero.name == '地狱火' || this.myHero.id == 1006)){
				this.mapObjects.map((it,idx)=>{
					if(this.mapObjects[idx].img == 'huozhu.png'){
						let x = Math.abs(it.left+5 - this.enemyX)
						let y = Math.abs(it.top+5 - this.enemyY)
						let dis = Math.sqrt(x*x+y*y)
						let addTalent = parseInt(this.addData.add9)
						if(dis <= 40){	//踩到
							let val = parseInt(this.myHero.fs * (0.6 + addTalent*0.07)) - parseInt(this.enemy.mk*1.7) + this.randomNum(addTalent*15,50 + addTalent*10)
							if(val <= 30){
								val = this.randomNum(30,50)
							}
							if(this.xuli == 1){
								val = parseInt(this.myHero.fs * (0.6 + addTalent*0.07))
							}
							this.beat(val,1)
						}
					}
				})
			}
			if(this.mapObjects.length != 0 && (this.myHero.name == '女警' || this.myHero.id == 103)){
				this.mapObjects.map((it,idx)=>{
					if(this.mapObjects[idx].img == 'jiazi.jpeg'){
						let x = Math.abs(it.left+5 - this.enemyX)
						let y = Math.abs(it.top+5 - this.enemyY)
						let dis = Math.sqrt(x*x+y*y)
						let addTalent = parseInt(this.addData.add9)
						if(dis <= 37){	//踩到
							let val = this.myHero.gj
							this.beat(val,1)
							this.tallentExpert(1,1,2000+parseInt(this.addData.add9)*500)
						}
					}
				})
			}
			//牛魔王
			if(this.enemy.id == 1003){
				this.enemyConsistAddBlood(this.randomNum(4,5),20,30)
			}
		},
		//英雄冲刺
		heroChongci(dis,type,speed) {
			if(this.myNoMove){
				return
			}
			if(!this.usetransitionDuration){
				this.usetransitionDuration = true
			}
			//向前冲刺一小段距离
			if(type == 1){
				if(this.characterX > this.enemyX){
					this.characterX = this.characterX - dis
				}
				if(this.characterX <= this.enemyX){
					this.characterX = this.characterX + dis
				}
				setTimeout(()=>{
					this.usetransitionDuration = false
				},500)
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
						this.characterX = this.enemyX + 30
					}
					if(this.characterY > this.enemyY){
						this.characterY = this.enemyY + 5
					}
					if(this.characterX <= this.enemyX){
						this.characterX = this.enemyX - 30
					}
					if(this.characterY <= this.enemyY){
						this.characterY = this.enemyY - 5
					}
					this.player.x = this.characterX
					this.player.y = this.characterY
					setTimeout(()=>{
						this.fastsp = 0
						this.usetransitionDuration = false
					},500)
					if(this.myEquipName.includes('电震涡流剑') && (this.myHero.details == '刺客' || this.myHero.id == 102)) {
						let val = parseInt(this.myHero.gj) + 100
						this.beat(val,1)
						this.myHero.gj = this.myHero.gj + 5
					}
				}
			}
			this.computeDistance()
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
						this.enemyX = this.characterX + 30
					}
					if(this.enemyY > this.characterY){
						this.enemyY = this.characterY + 5
					}
					if(this.enemyX <= this.characterX){
						this.enemyX = this.characterX - 30
					}
					if(this.enemyY <= this.characterY){
						this.enemyY = this.characterY - 5
					}
					setTimeout(()=>{
						this.fastsp2 = 0
					},500)
				}
			}
			this.computeDistance()
		},
		//我方闪现
		shanxian(dis) {
			if(this.myNoMove){
				return
			}
			this.heroAddSpeed(dis*4,550)

		},
		//敌方躲避
		enDuobi(dis) {
			if(this.enNoMove){
				return
			}
			if(this.enspeed - 0.9 >= 0.2){
				this.enspeed = this.enspeed - 0.9
			}else{
				this.enspeed = this.enspeed - 0.6
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
					this.enspeed = this.enspeed + 0.9
				}else{
					this.enspeed = this.enspeed + 0.6
				}
			},500)
		},
		//跟随
		follow(type,time) {
			if(!this.transitionDuration){
				this.transitionDuration = true
			}
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
					this.transitionDuration = false
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
					this.transitionDuration = false
					clearInterval(t)
				},time)
			}
		},
		//技能效果
		tallentExpert(type,index,time,val) {
			if(index == 1){	//敌方被施加
				if(this.enImmunity){
					return
				}
				if(type == 1){	//禁锢
					this.enNoMove = true
					setTimeout(()=>{
						this.enNoMove = false
					},time)
				}
				if(type == 2){	//眩晕
					this.enNoMove = true
					this.shotDown = true
					if(this.enemy.icon != 'xuanyun.gif'){
						this.tempEnemyIcon = this.enemy.icon
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
				if(type == 4){	//麻痹
					if(this.enemy.icon != 'mabi.png'){
						this.tempEnemyIcon = this.enemy.icon
						this.enemy.icon = 'mabi.png'
					}
					this.enspeed = this.enspeed + 0.7
					setTimeout(()=>{
						this.enspeed = this.enspeed - 0.7
						if(this.tempEnemyIcon != this.enemy.icon && this.enemy.icon == 'mabi.png'){
							this.enemy.icon = this.tempEnemyIcon
						}
					},time)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},3000)
				}
				if(type == 5){	//害怕
					if(this.enemy.icon != 'haipa.png'){
						this.tempEnemyIcon = this.enemy.icon
						this.enemy.icon = 'haipa.png'
					}
					this.enNoMove = true
					this.shotDown = true
					this.enspeed = this.enspeed + 0.8
					setTimeout(()=>{
						if(this.enspeed >= 1.2){
							this.enspeed = this.enspeed - 0.8
						}
						this.shotDown = false
						this.enNoMove = false
						if(this.tempEnemyIcon != this.enemy.icon && this.enemy.icon == 'haipa.png'){
							this.enemy.icon = this.tempEnemyIcon
						}
					},2500)
					this.enDuobi(30)
					setTimeout(()=>{
						this.enDuobi(30)
					},1200)
					setTimeout(()=>{
						this.enDuobi(30)
					},2300)
				}
				if(type == 6){	//狂暴
					if(this.enemy.icon != 'kuangbao.png'){
						this.tempEnemyIcon = this.enemy.icon
						this.enemy.icon = 'kuangbao.png'
					}
					this.fastsp2 = 0.3
					this.enemy.gj = this.enemy.gj + 80
					this.enemyMoveContrl(2)
					if(parseFloat(this.enemy.gs)>0.6){
						this.enemy.gs = parseFloat(this.enemy.gs - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},time)
					}
					setTimeout(()=>{
						this.fastsp2 = 0
						this.enemy.gj = this.enemy.gj - 80
						if(this.tempEnemyIcon != this.enemy.icon && this.enemy.icon == 'kuangbao.png'){
							this.enemy.icon = this.tempEnemyIcon
						}
					},time)
				}
				if(type == 7){	//烧伤-25%
					let val = Math.ceil(parseInt(this.blood1)/16)
					this.beat(val,1)
					setTimeout(()=>{
						this.beat(val,1)
					},1000)
					setTimeout(()=>{
						this.beat(val,1)
					},2000)
					setTimeout(()=>{
						this.beat(val,1)
					},3000)
				}
				if(type == 8){	//中毒-20%
					let val = Math.ceil(parseInt(this.blood1)/20)
					this.beat(val,1)
					setTimeout(()=>{
						this.beat(val,1)
					},1000)
					setTimeout(()=>{
						this.beat(val,1)
					},2000)
					setTimeout(()=>{
						this.beat(val,1)
					},3000)
					this.enspeed = this.enspeed + 0.4
					setTimeout(()=>{
						this.enspeed = this.enspeed - 0.4
					},3000)
				}
				if(type == 9){	//虚弱
					if(this.enemy.icon != 'xuruo.png'){
						this.tempEnemyIcon = this.enemy.icon
						this.enemy.icon = 'xuruo.png'
					}
					this.enemy.gs = parseFloat(this.enemy.gs + 0.3).toFixed(2)
					this.enspeed = this.enspeed + 0.3
					let gjdown = Math.ceil(this.enemy.gj/2)
					this.enemy.gj = this.enemy.gj - gjdown
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj + gjdown
						this.enspeed = this.enspeed - 0.3
						this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) - 0.3).toFixed(2)
						if(this.tempEnemyIcon != this.enemy.icon && this.enemy.icon == 'xuruo.png'){
							this.enemy.icon = this.tempEnemyIcon
						}
					},time)
				}
			}else{	//我方被施加
				if(this.myImmunity){
					return
				}
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
					let sp = this.speed
					if(this.antijiansu == 0){
						this.speed = 18
					}
					if(val){
						this.myspeed = this.myspeed + val - this.antijiansu
						setTimeout(()=>{
							this.myspeed = this.myspeed - val + this.antijiansu
							this.speed = sp
						},time)
					}else{
						this.myspeed = this.myspeed + 0.6 - this.antijiansu
						setTimeout(()=>{
							this.myspeed = this.myspeed - 0.6 + this.antijiansu
							this.speed = sp
						},time)
					}
				}
				if(type == 4){	//麻痹
					if(this.myHero.icon != 'mabi.png'){
						this.myHero.icon = 'mabi.png'
					}
					let sp = this.speed
					if(this.antijiansu == 0){
						this.speed = 18
					}
					this.myspeed = this.myspeed + 0.7
					setTimeout(()=>{
						this.myspeed = this.myspeed - 0.7
						this.speed = sp
						this.myHero.icon = this.origHero.icon
					},time)
					this.delayTel(3000,0)
				}
				if(type == 5){	//害怕
					if(this.myHero.icon != 'haipa.png'){
						this.myHero.icon = 'haipa.png'
					}
					let sp = this.speed
					this.delayTel(2500,0)
					this.myspeed = this.myspeed + 0.8
					this.speed = 18
					this.myNoMove = true
					this.transitionDuration = true
					setTimeout(()=>{
						this.speed = sp
						this.myspeed = this.myspeed - 0.8
						this.myNoMove = false
						this.transitionDuration = false
						this.myHero.icon = this.origHero.icon
					},2500)
					if(this.enemyX < this.characterX){
						this.characterX = this.characterX - 30
						setTimeout(()=>{
							this.characterX = this.characterX - 30
						},1200)
						setTimeout(()=>{
							this.characterX = this.characterX - 30
						},2300)
					}else{
						this.characterX = this.characterX + 30
						setTimeout(()=>{
							this.characterX = this.characterX + 30
						},1200)
						setTimeout(()=>{
							this.characterX = this.characterX + 30
						},2300)
					}
				}
				if(type == 6){	//狂暴
					if(this.myHero.icon != 'kuangbao.png'){
						this.myHero.icon = 'kuangbao.png'
					}
					this.fastsp = 0.37
					this.heroAddSpeed(48,time)
					this.myHero.gj = this.myHero.gj + 80
					this.myHero.fs = this.myHero.fs + 100
					if(parseFloat(this.myHero.v)>0.6){
						this.myHero.v = parseFloat(this.myHero.v - 0.3).toFixed(2)
						setTimeout(()=>{
							this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3).toFixed(2)
						},time)
					}
					setTimeout(()=>{
						this.fastsp = 0
						this.myHero.gj = this.myHero.gj - 80
						this.myHero.fs = this.myHero.fs - 100
						this.myHero.icon = this.origHero.icon
					},time)
				}
				if(type == 7){	//烧伤-25%
					uni.showToast({
						title: '你已被烧伤',
						icon:'none',
						duration: 700
					});
					let val = Math.ceil(parseInt(this.blood2)/16) + this.myHero.fy*2
					this.enemyBeat2(val)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},1000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},2000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},3000)
				}
				if(type == 8){	//中毒-20%
					uni.showToast({
						title: '你中毒了',
						icon:'none',
						duration: 900
					});
					let val = Math.ceil(parseInt(this.blood2)/20) + this.myHero.fy*2
					this.enemyBeat2(val)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},1000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},2000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},3000)
					this.myspeed = this.myspeed + 0.4
					setTimeout(()=>{
						this.myspeed = this.myspeed - 0.4
					},3000)
				}
				if(type == 9){	//虚弱
					if(this.myHero.icon != 'xuruo.png'){
						this.myHero.icon = 'xuruo.png'
					}
					this.myHero.v = parseFloat(this.myHero.v + 0.3).toFixed(2)
					this.myspeed = this.myspeed + 0.3
					let sp = this.speed
					this.speed = 18
					let gjdown2 = Math.ceil(this.myHero.gj/2)
					let fsdown = Math.ceil(this.myHero.fs/2)
					this.myHero.gj = this.myHero.gj - gjdown2
					this.myHero.fs = this.myHero.fs - fsdown
					setTimeout(()=>{
						this.myHero.gj = this.myHero.gj + gjdown2
						this.myHero.fs = this.myHero.fs + fsdown
						this.myspeed = this.myspeed - 0.3
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.3).toFixed(2)
						this.myHero.icon = this.origHero.icon
						this.speed = sp
					},time)
				}
			}
		},
		//切换到下一个我方英雄事件
		nextHeroHandle() {
			//灵魂莲华
			if(this.myHero.id == 4 && parseInt(this.addData.strongIndex) == 2){
				setTimeout(()=>{
					this.myHero.gj = this.myHero.gj + this.randomNum(65,120)
					this.myHero.blood = this.myHero.blood + this.randomNum(1000,1500)
					this.myHero.v = 0.5
					this.origHero = {...this.myHero}
					this.blood2 = this.myHero.blood
					this.bloodVal2 = 100
				},100)
			}
		},
		heroAddSpeed(val,time) {
			if(this.fastsp + val <= 0.8 && (this.myspeed - this.fastsp)>=0.2){
				this.fastsp = this.fastsp + val
				this.showTX(2,2)
			}else{
				this.fastsp = this.myspeed - 0.3
			}
			this.speed = this.speed + val
			setTimeout(()=>{
				this.speed = this.speed - val
				this.fastsp = 0
				this.showTX(2,2,true)
			},time)
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
		fasheArrow(distance,index,range,heroId,num,type,speed) {
			if(index == 1){		//敌方发射
				let arrowType =  'guangqiu2.png'
				let arrowType2 =  'guangqiu2.png'
				if(type == 1){	//普通小箭
					arrowType =  'guangqiu2.png'
					arrowType2 =  'guangqiu2.png'
					this.arrowWid2 = 66
					this.arrowHei2 = 66
				}
				if(type == 2){	//普通魔法小箭
					arrowType =  'guangqiu2-blue.png'
					arrowType2 =  'guangqiu2-blue.png'
					this.arrowWid2 = 66
					this.arrowHei2 = 66
				}
				if(type == 3){	//加农火炮
					arrowType =  'leftSJ2.png'
					arrowType2 =  'rightSJ2.png'
					this.arrowWid2 = 110
					this.arrowHei2 = 42
				}
				if(type == 4){	//魔法球
					arrowType =  'SJ3blue.png'
					arrowType2 =  'SJ3blue.png'
					this.arrowWid2 = 72
					this.arrowHei2 = 72
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
					arrowType =  'leftbinghuaTX.png'
					arrowType2 =  'rightbinghuaTX.png'
					this.arrowWid2 = 110
					this.arrowHei2 = 20
				}
				if(type == 9){	//飞镖
					arrowType =  'leftFeibiaoTX.png'
					arrowType2 =  'rightFeibiaoTX.png'
					this.arrowWid2 = 110
					this.arrowHei2 = 27
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
					arrowType =  'guangqiu1.png'
					arrowType2 =  'guangqiu1.png'
					this.arrowWid2 = 72
					this.arrowHei2 = 72
				}
				if(type == 14){	//水激光
					arrowType =  'leftShuiJG.gif'
					arrowType2 =  'rightShuiJG.gif'
					this.arrowWid2 = 450
					this.arrowHei2 = 67
					if(distance>1500){
						this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
					}
				}
				if(type == 15){	//火激光
					arrowType =  'leftHuoJG.png'
					arrowType2 =  'rightHuoJG.png'
					this.arrowWid2 = 450
					this.arrowHei2 = 67
					if(distance>1500){
						this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
					}
				}
				if(type == 16){	//蓝冰
					arrowType =  'lanbing.png'
					arrowType2 =  'lanbing.png'
					this.arrowWid2 = 55
					this.arrowHei2 = 55
				}
				if(type == 17){	//雪花
					arrowType =  'xuehua.png'
					arrowType2 =  'xuehua.png'
					this.arrowWid2 = 99
					this.arrowHei2 = 99
				}
				if(type == 18){	//劈斩
					arrowType =  'zhanLeft.png'
					arrowType2 =  'zhanRight.png'
					this.arrowWid2 = 120
					this.arrowHei2 = 120
				}
				if(type == 19){	//蓝色劈斩
					arrowType =  'landaoLeft.png'
					arrowType2 =  'landaoRight.png'
					this.arrowWid2 = 113
					this.arrowHei2 = 138
				}
				if(type == 20){	//黄色流星
					arrowType =  'liuxin1Left.png'
					arrowType2 =  'liuxin1Right.png'
					this.arrowWid2 = 150
					this.arrowHei2 = 55
				}
				if(type == 21){	//蓝色流星
					arrowType =  'liuxin3Left.png'
					arrowType2 =  'liuxin3Right.png'
					this.arrowWid2 = 150
					this.arrowHei2 = 55
				}
				if(type == 22){	//粉色流星
					arrowType =  'liuxin3Left.png'
					arrowType2 =  'liuxin3Right.png'
					this.arrowWid2 = 150
					this.arrowHei2 = 55
				}
				if(type == 23){	//黄色长流星
					arrowType =  'longliuxin1Left.png'
					arrowType2 =  'longliuxin1Right.png'
					this.arrowWid2 = 220
					this.arrowHei2 = 42
				}
				if(type == 24){	//粉色长流星
					arrowType =  'longliuxin2Left.png'
					arrowType2 =  'longliuxin2Right.png'
					this.arrowWid2 = 220
					this.arrowHei2 = 42
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
				let arrowType =  'guangqiu2.png'
				let arrowType2 =  'guangqiu2.png'
				if(type == 1){	//普通小箭
					arrowType =  'guangqiu2.png'
					arrowType2 =  'guangqiu2.png'
					this.arrowWid = 66
					this.arrowHei = 66
				}
				if(type == 2){	//普通魔法小箭
					arrowType =  'guangqiu2-blue.png'
					arrowType2 =  'guangqiu2-blue.png'
					this.arrowWid = 66
					this.arrowHei = 66
				}
				if(type == 3){	//加农火炮
					arrowType =  'leftSJ2.png'
					arrowType2 =  'rightSJ2.png'
					this.arrowWid = 110
					this.arrowHei = 42
				}
				if(type == 4){	//魔法球
					arrowType =  'SJ3blue.png'
					arrowType2 =  'SJ3blue.png'
					this.arrowWid = 72
					this.arrowHei = 72
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
					arrowType =  'leftbinghuaTX.png'
					arrowType2 =  'rightbinghuaTX.png'
					this.arrowWid = 110
					this.arrowHei = 20
				}
				if(type == 9){	//飞镖
					arrowType =  'leftFeibiaoTX.png'
					arrowType2 =  'rightFeibiaoTX.png'
					this.arrowWid = 110
					this.arrowHei = 27
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
					arrowType =  'guangqiu1.png'
					arrowType2 =  'guangqiu1.png'
					this.arrowWid = 72
					this.arrowHei = 72
				}
				if(type == 14){	//水激光
					arrowType =  'leftShuiJG.gif'
					arrowType2 =  'rightShuiJG.gif'
					this.arrowWid = 600
					this.arrowHei = 90
					if(distance>1500){
						this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
					}
				}
				if(type == 15){	//火激光
					arrowType =  'leftHuoJG.png'
					arrowType2 =  'rightHuoJG.png'
					this.arrowWid = 600
					this.arrowHei = 90
					if(distance>1500){
						this.playVoice('../../static/sounds/enmofabo.wav',false,7,2000)
					}
				}
				if(type == 16){	//蓝冰
					arrowType =  'lanbing.png'
					arrowType2 =  'lanbing.png'
					this.arrowWid = 55
					this.arrowHei = 55
				}
				if(type == 17){	//雪花
					arrowType =  'xuehua.png'
					arrowType2 =  'xuehua.png'
					this.arrowWid = 99
					this.arrowHei = 99
				}
				if(type == 18){	//劈斩
					arrowType =  'zhanLeft.png'
					arrowType2 =  'zhanRight.png'
					this.arrowWid = 120
					this.arrowHei = 120
				}
				if(type == 19){	//蓝色劈斩
					arrowType =  'landaoLeft.png'
					arrowType2 =  'landaoRight.png'
					this.arrowWid = 113
					this.arrowHei = 138
				}
				if(type == 20){	//黄色流星
					arrowType =  'liuxin1Left.png'
					arrowType2 =  'liuxin1Right.png'
					this.arrowWid = 150
					this.arrowHei = 55
				}
				if(type == 21){	//蓝色流星
					arrowType =  'liuxin3Left.png'
					arrowType2 =  'liuxin3Right.png'
					this.arrowWid = 150
					this.arrowHei = 55
				}
				if(type == 22){	//粉色流星
					arrowType =  'liuxin3Left.png'
					arrowType2 =  'liuxin3Right.png'
					this.arrowWid = 150
					this.arrowHei = 55
				}
				if(type == 23){	//黄色长流星
					arrowType =  'longliuxin1Left.png'
					arrowType2 =  'longliuxin1Right.png'
					this.arrowWid = 220
					this.arrowHei = 42
				}
				if(type == 24){	//粉色长流星
					arrowType =  'longliuxin2Left.png'
					arrowType2 =  'longliuxin2Right.png'
					this.arrowWid = 220
					this.arrowHei = 42
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
						let duobiTime = 250 - this.randomNum(0,200)
						if(speed){
							duobiTime = duobiTime + speed*50
						}
						setTimeout(()=>{
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
						},duobiTime)
					}
					this.arrowY = this.characterY
					if(this.characterX > this.enemyX){	//如果敌方在左边
						this.arrowX = this.characterX - 20
						this.ArrowTX = arrowType
						this.arrowTimer = setInterval(()=>{
							//自动瞄准
							if(range == 99){
								//如果两个人垂直距离大于水平距离
								if(Math.abs(this.arrowY-this.enemyY)>=Math.abs(this.arrowX-this.enemyX) && Math.abs(this.arrowY-this.enemyY)>20){
									//如果水平距离不会很近
									if(Math.abs(this.arrowX-this.enemyX)>18){
										if(speed){
											this.arrowX = this.arrowX - 3 - speed
										}else{
											this.arrowX = this.arrowX - 3
										}
									}
									if(this.arrowY>this.enemyY){
										this.arrowY = this.arrowY - 5
									}else{
										this.arrowY = this.arrowY + 5
									}
								}else{
									if(speed){
										this.arrowX = this.arrowX - 4 - speed
									}else{
										this.arrowX = this.arrowX - 4
									}
									if(Math.abs(this.arrowY-this.enemyY)>20){
										if(this.arrowY>this.enemyY){
											this.arrowY = this.arrowY - 4
										}else{
											this.arrowY = this.arrowY + 4
										}
									}
								}
							}else{
								if(speed){
									this.arrowX = this.arrowX - 4 - speed
								}else{
									this.arrowX = this.arrowX - 4
								}
							}
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
							if(range == 99){
								//如果两个人垂直距离大于水平距离
								if(Math.abs(this.arrowY-this.enemyY)>=Math.abs(this.arrowX-this.enemyX) && Math.abs(this.arrowY-this.enemyY)>20){
									//如果水平距离不会很近
									if(Math.abs(this.arrowX-this.enemyX)>18){
										if(speed){
											this.arrowX = this.arrowX + 3 + speed
										}else{
											this.arrowX = this.arrowX + 3
										}
									}
									if(this.arrowY>this.enemyY){
										this.arrowY = this.arrowY - 5
									}else{
										this.arrowY = this.arrowY + 5
									}
								}else{
									if(speed){
										this.arrowX = this.arrowX + 4 + speed
									}else{
										this.arrowX = this.arrowX + 4
									}
									if(Math.abs(this.arrowY-this.enemyY)>20){
										if(this.arrowY>this.enemyY){
											this.arrowY = this.arrowY - 4
										}else{
											this.arrowY = this.arrowY + 4
										}
									}
								}
							}else{
								if(speed){
									this.arrowX = this.arrowX + 4 + speed
								}else{
									this.arrowX = this.arrowX + 4
								}
							}
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
			if(this.myEquipName.includes('残疫')) {
				addTalent4 += 2
			}
			if(index == 1){
				//神明
				if(this.myHero.id == 17 && this.ygbj){
					this.fasheArrow(260,2,33,this.myHero.id,3,4)
					return
				}
				//百花仙子
				if(this.myHero.id == 1002 && this.myImmunity){
					return
				}
				//灵鹰
				if(this.myHero.id == 19){
					if(this.randomNum(0,1) == 1){
						return
					}
				}
				if(heroId == 'GG Bond'){
					if(parseInt(this.myHero.fy) > 10){
						this.myHero.fy = parseInt(this.myHero.fy) - 8
					}
					let val = this.harmComputer(3) + 250
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
						let val = this.harmComputer(3)+ this.randomNum(0,500)
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
						let val = this.harmComputer(3) + 100
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
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.2)
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
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.5)
					this.enemyBeat2(val)
					if(this.enspeed >= 0.7){
						this.enspeed = this.enspeed - 0.35
						setTimeout(()=>{
							this.enspeed = this.enspeed + 0.35
						},3000)
					}
				}
				if(heroId == '敌方射击'){
					let val = this.harmComputer(3)
					this.enemyBeat2(val)
				}
				if(heroId == '敌方射击-高伤害'){
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.8) + 100
					this.enemyBeat2(val)
				}
				if(heroId == '妖族-鬼'){
					let val = this.enemy.gj*1.8 - this.myHero.fy*1.5 + 300
					this.enemyBeat2(val)
					this.tallentExpert(2,2,1500)
				}
				if(heroId == '韦鲁斯'){
					if(num == 1){
						let val = this.harmComputer(3)+ parseInt(this.enemy.gj * 0.3)
						this.enemyBeat2(val)
						this.myHero.fy = this.myHero.fy - parseInt(this.myHero.fy*0.13)
					}
					if(num == 2){
						let val = this.harmComputer(3)+ parseInt(this.enemy.gj * 0.3)
						this.enemyBeat2(val)
						this.tallentExpert(3,2,3000)
					}
					if(num == 3){
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.3) + this.randomNum(0,250)
						this.enemyBeat2(val)
					}
				}
				if(heroId == '百花仙子'){
					if(num == 1){
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.2)
						this.enemyBeat2(val)
						this.tallentExpert(1,2,2000)
					}
					if(num == 2){
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.2)
						this.enemyBeat2(val)
						this.tallentExpert(8,2)
					}
				}
				if(heroId == '雷伊'){
					if(num == 1){
						let val = this.harmComputer(3)
						this.enemyBeat2(val)
						if(this.randomNum(0,2) == 2){
							this.tallentExpert(4,2,5000)
						}
					}
				}
				if(heroId == '地狱火'){
					if(num == 1){
						let val = 0
						if(this.ygbj){
							val = parseInt(this.enemy.gj * 2.6)*2
							this.enemyBeat2(val)
						}else{
							 val = this.harmComputer(3)
							 this.enemyBeat2(val)
						}
					}
					if(num == 4){
						this.tallentExpert(7,2)
					}
				}
				//二郎真君-杨戬
				if(heroId == '二郎真君-杨戬'){
					let val = this.harmComputer(3) + 150
					this.enemyBeat2(val)
				}
				if(heroId == '无量仙翁'){
					let val = this.harmComputer(3) + 150
					this.tallentExpert(1,2,1500)
					this.myHero.fy = this.myHero.fy - 7
					this.enemyBeat2(val)
				}
				if(heroId == '不朽战神'){
					let val = this.harmComputer(3) + parseInt(this.enemy.gj)
					this.enemyBeat2(val)
				}
				if(heroId == '艾欧尼亚之箭'){
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.3)
					this.enemyBeat2(val)
				}
				if(heroId == '艾欧尼亚之闪'){
					let val = this.harmComputer(3)
					this.enemyBeat2(val)
					if(this.randomNum(0,2) >= 1 && this.distanceComp(250)){
						setTimeout(()=>{
							this.delayTel(2500,0)
							this.enChongci(250)
							this.playMovies2(4,'1012',true)
							this.myNoMove = true
							setTimeout(()=>{
								this.myNoMove = false
							},2500)
							let val = parseInt(this.enemy.gj) + 100 + this.randomNum(0,60)
							this.consistEnemyBeat(val,500,2550)
						},600)
					}
				}
				if(heroId == '艾欧尼亚之影'){
					if(num == 1){
						this.myHero.fy = this.myHero.fy - 26
						setTimeout(()=>{
							this.myHero.fy = this.myHero.fy + 26
						},4000)
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.3)
						this.enemyBeat2(val)
					}
					if(num == 3){
						this.tallentExpert(1,2,2300)
						this.enmapObjects.push({
							left: this.characterX - 25,
							top: this.characterY - 16,
							img: 'jinguCircle.png',
							width: 210,
							height: 210,
						});
						setTimeout(()=>{
							this.enmapObjects.map((i,d)=>{
								if(i.img == 'jinguCircle.png' && !i.name){
									this.enmapObjects.splice(d,1)
								}
							})
							this.heroChongci(88,1)
						},2300)
						let val = this.harmComputer(3)
						this.enemyBeat2(val)
					}
				}
				if(heroId == '艾欧尼亚之灵'){
					if(num == 1){
						let val = this.harmComputer(3)
						this.enemyBeat2(val)
						if(this.randomNum(0,1) == 0){
							let val = parseInt(this.enemy.gj*2.5) - parseInt(this.myHero.fy*2) + 60
							if(val<=0){
								val = 125
							}
							this.consistEnemyBeat(val,500,1500)
						}else{
							this.tallentExpert(2,2,1500)
						}
					}
				}
				if(heroId == '神-金蝉子'){
					let val = parseInt(this.myHero.blood*0.5)
					this.enemyBeat2(val)
				}
				
			}else{	//我方
				//百花仙子
				if(this.enemy.id == 1002 && this.enImmunity){
					return
				}
				if(this.myEquipName.includes('皇后的箭矢') && this.myHero.details == '射手') {
					this.beat(200+this.reallyRandom(0,3)*150)
				}
				if(heroId == 10){
					if(num == 1){
						let val = this.harmComputer(1,addTalent,250,1.5)
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
						let val = this.harmComputer(1,addTalent2,100+parseInt(this.myHero.fs*0.8),0.8)
						this.xuli = 1
						this.beat(val)
					}
					if(num == 4){
						let val = this.harmComputer(1,addTalent4,parseInt(this.myHero.gj * (2.7+addTalent4*0.25)) + this.myHero.fs * (2.3+addTalent4*0.25)+550+addTalent4*100,1)
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
					let val = this.harmComputer(2,addTalent4,500,1.2)
					this.beat(val)
					this.tallentExpert(3,1,3000)
				}
				if(heroId == 6){
					if(num == 2){
						this.tallentExpert(3,1,3000)
						let val = this.harmComputer(1,0,60 + addTalent2*15,0.5) 
						if(strongIndex == 1){
							val = val + parseInt(this.myHero.gj*0.3)
							this.addBlood(150,0,0)
						}
						if(val < 30){
							val = this.randomNum(30,60)
						}
						this.consistBeat(val,500,3000)
					}
					if(num == 4){
						//眩晕4秒
						this.tallentExpert(2,1,4000 + addTalent4*200)
						let val = this.harmComputer(2,addTalent4,550 + addTalent4*20,1.3) 
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.beat(val)
					}
				}
				if(heroId == 7){
					if(num == 1){
						if(this.ygbj){
							let val = this.harmComputer(1,addTalent,350 + this.randomNum(0,500 + addTalent*50),1)
							this.beat(val)
						}else{
							let val = this.harmComputer(1,addTalent,250,1.3)
							this.beat(val)
						}
					}
					if(num == 4){
						let val = this.harmComputer(1,addTalent4,550+addTalent4*30,1.5)
						this.beat(val)
					}
				}
				if(heroId == 8){
					if(num == 2){
						this.tallentExpert(2,1,2000+addTalent2*250)
						if(strongIndex == 2){
							let val = this.harmComputer(2,addTalent2,250,0.8)
							this.beat(val)
						}
					}
				}
				if(heroId == 12){
					let self = this
					let val = this.harmComputer(2,addTalent2,100,1)
					self.beat(val)
					self.shotDown = true
					let t = setInterval(()=>{
						let val2 = this.harmComputer(2,0,60+addTalent2*10,0.3)
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
						let val = this.harmComputer(2,addTalent,250,1.2)
						if(strongIndex == 2){
							val = val + parseInt(this.myHero.fs*0.7)
						}
						this.beat(val)
						this.heroAddSpeed(45+addTalent*5,3000+addTalent*200)
					}
				}
				if(heroId == 16){
					if(num == 1){
						let val = this.harmComputer(2,addTalent,300+this.reallyRandom(0,5)*150,1.2)
						this.beat(val)
					}
					if(num == 2){
						let val = this.harmComputer(2,addTalent2,150,1)
						this.beat(val)
						this.tallentExpert(3,1,2000+addTalent*250)
					}
				}
				if(heroId == 17){
					if(num == 3){
						let val = this.harmComputer(2,addTalent3,250,1)
						this.beat(val)
					}
					if(num == 4){
						let val = this.harmComputer(2,addTalent4,250+addTalent4*50,1.2)
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
						let val = this.harmComputer(1,addTalent,250,1.3)
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
				if(heroId == 20){
					if(num == 2){
						let val =  this.harmComputer(2,addTalent2,250,1.3)
						this.beat(val)
						this.enDuobi(38)
						this.tallentExpert(3,1,2000)
					}
				}
				if(heroId == 21){
					if(num == 1){
						let val = this.harmComputer(1,addTalent,250,1.3)
						this.beat(val)
					}
				}
				if(heroId == 22){
					if(num == 1){
						let val = this.harmComputer(1,addTalent,250,1.3)
						if(strongIndex == 1 || strongIndex == 2){
							val = val + parseInt(this.myHero.gj * 1.2)
						}
						this.beat(val)
						this.cd(1800 - addTalent*250,1)
					}
					if(num == 4){
						this.computeDistance()
						let val = this.harmComputer(1,addTalent4,150 + parseInt(Math.abs(210 - parseInt(this.distance))*2.2),1.2)
						if(strongIndex == 2){
							val = val + 100
							this.addBlood(150,0,0)
						}
						this.beat(val)
					}
				}
				if(heroId == 23){
					if(num == 1){
						let val = this.harmComputer(1,addTalent,280,1.35)
						if(strongIndex == 1 || strongIndex == 2){
							val = val + parseInt(this.myHero.gj*0.7)
						}
						this.beat(val)
						if(this.distanceComp(130)){
							this.consistBeat(this.randomNum(50,150),600,1800)
						}
					}
				}
				if(heroId == 24){
					if(num == 3){
						let val = this.harmComputer(2,addTalent3,150,1)
						this.beat(val)
						this.tallentExpert(3,1,3500)
						this.myHero.gj = this.myHero.gj + 35 + addTalent3*5
						setTimeout(()=>{
							this.myHero.gj = this.myHero.gj - 35 - addTalent3*5
						},3500)
					}
				}
				if(heroId == 25){
					let val = this.harmComputer(1,addTalent4,250,1)
					if(strongIndex == 1 || strongIndex == 2){
						val = val + parseInt(this.myHero.gj*0.7)
					}
					if(strongIndex == 2){
						val = val + num*170
					}
					this.beat(val)
					this.tallentExpert(3,1,1500)
					
				}
				if(heroId == 1000){
					if(num == 1){
						this.computeDistance()
						let val = this.harmComputer(1,addTalent,250+ parseInt(this.distance * 0.8),1.5)
						this.beat(val)
						this.enemy.fy = this.enemy.fy - parseInt(this.enemy.fy*0.13)
					}
					if(num == 2){
						let val = this.harmComputer(1,addTalent2,150,1)
						this.beat(val)
						this.tallentExpert(3,1,3000)
					}
					if(num == 4){
						let val = this.harmComputer(1,addTalent4,400+ this.randomNum(0,250)+ addTalent4*30,1.3)
						this.beat(val)
					}
				}
				if(heroId == 1002){
					if(num == 1){
						let val = this.harmComputer(2,addTalent,250,0.8)
						this.beat(val)
						this.tallentExpert(1,1,2000)
					}
					if(num == 2){
						let val = this.harmComputer(2,addTalent3,250,0.8)
						this.beat(val)
						this.tallentExpert(8,1)
					}
				}
				if(heroId == 1005){
					if(num == 1){
						let val = this.harmComputer(2,addTalent,150,0.8)
						this.beat(val)
						if(this.reallyRandom(0,2) == 2){
							this.tallentExpert(4,1,5000)
						}
					}
				}
				//地狱火
				if(heroId == 1006){
					if(num == 1){
						let val = 0
						if(this.xuli==1){
							val = parseInt(this.myHero.fs * (2.5 + addTalent*0.2))*2
							this.beat(val,1)
						}else{
							 val = this.harmComputer(2,addTalent,250,0.8)
							 this.beat(val)
						}
					}
					if(num == 4){
						this.tallentExpert(7,1)
					}
				}
				//二郎真君-杨戬
				if(heroId == 1007){
					if(num == 3){
						let val = this.harmComputer(2,addTalent3,380,1.2)
						if(strongIndex == 1){
							val = val + this.myHero.fs + 300
						}
						this.beat(val)
					}
				}
				//无量仙翁
				if(heroId == 1008){
					let val =  this.harmComputer(2,addTalent3,150,1)
					this.tallentExpert(1,1,1000+addTalent3*250)
					this.enemy.mk = this.enemy.mk - 5 - addTalent3
					this.beat(val)
				}
				//不朽战神
				if(heroId == 1009){
					let val = parseInt(this.myHero.gj*2.6) + 200 + addTalent4*150
					if(strongIndex == 1){
						val = val + this.myHero.gj + 100
					}
					this.beat(val,1)
				}
				//艾欧尼亚之箭
				if(heroId == 1011){
					let val = this.harmComputer(1,addTalent3,250,1.3)
					this.beat(val)
				}
				//艾欧尼亚之闪
				if(heroId == 1012){
					if(num == 2){
						this.tallentExpert(2,1,1500+addTalent2*250)
						let val = this.harmComputer(2,addTalent2,300,1)
						this.beat(val)
					}
				}
				//艾欧尼亚之影
				if(heroId == 1013){
					if(num == 1){
						this.enemy.mk = this.enemy.mk - 20 - addTalent*3
						setTimeout(()=>{
							this.enemy.mk = this.enemy.mk + 20 + addTalent*3
						},4000)
						let val = this.harmComputer(2,addTalent,200,1)
						if(strongIndex == 1){
							val = val+this.myHero.fs
						}
						this.beat(val)
					}
					if(num == 3){
						this.tallentExpert(1,1,2000+addTalent3*250)
						this.mapObjects.push({
							left: this.enemyX - 25,
							top: this.enemyY - 16,
							img: 'jinguCircle.png',
							width: 210,
							height: 210,
						});
						setTimeout(()=>{
							this.mapObjects.map((i,d)=>{
								if(i.img == 'jinguCircle.png' && !i.name){
									this.mapObjects.splice(d,1)
								}
							})
							this.enChongci(80+addTalent3*5,1)
						},2000+addTalent3*250)
						let val = this.harmComputer(2,addTalent3,250,0.8)
						this.beat(val)
					}
				}
				//艾欧尼亚之灵
				if(heroId == 1014){
					if(num == 1){
						let val = this.harmComputer(2,addTalent,250,0.8)
						if(strongIndex == 1){
							val = val + 250
						}
						this.beat(val)
						if(this.reallyRandom(0,1) == 0){
							let val = this.harmComputer(2,0,50+addTalent*20,0.4)
							if(val<=0){
								val = 125
							}
							this.consistBeat(val,500,1500)
						}else{
							this.tallentExpert(2,1,1000+addTalent*250)
						}
					}
				}
				//艾欧尼亚之心
				if(heroId == 1015){
					if(num == 1){
						let val = this.harmComputer(2,addTalent,250,1)
						if(strongIndex != 0){
							val = val + this.myHero.fs
						}
						this.beat(val)
						if(this.reallyRandom(0,1) == 0){
							if(strongIndex == 2){
								this.addBlood(parseInt(this.myHero.fs*1.5),0,0)
							}else{
								this.addBlood(this.myHero.fs,0,0)
							}
						}
					}
					if(num == 3){
						let val = this.harmComputer(2,addTalent,200,0.6)
						this.beat(val)
						this.enNoMove = true
						this.tallentExpert(9,1,3000)
						if(!this.enFlagTime){
							this.enFlagTime = setInterval(()=>{
								if(this.characterX > this.enemyX){
									this.enemyX = this.enemyX + 5
								}else{
									this.enemyX = this.enemyX - 5
								}
							},120)
						}
						setTimeout(()=>{
							this.enNoMove = false
							clearInterval(this.enFlagTime)
							this.enFlagTime = null
							if(strongIndex == 2){
								this.tallentExpert(2,1,1000)
							}
						},3000)
					}
				}
				//女警
				if(heroId == 103){
					if(num == 1){
						let val =  this.harmComputer(1,addTalent,250,1.5)
						this.beat(val)
					}
					if(num == 3){
						let val = this.harmComputer(1,addTalent3,200,0.8)
						this.beat(val)
						if(strongIndex == 1){
							this.tallentExpert(1,1,2500)
						}else{
							this.tallentExpert(3,1,3000+addTalent3*500,0.7)
						}
					}
					if(num == 4){
						let val = this.harmComputer(1,addTalent4,550+addTalent4*50 + this.randomNum(0,300),1.6)
						this.beat(val)
						let enfy = parseInt(this.enemy.fy*(0.3+addTalent4*0.07))
						this.enemy.fy = this.enemy.fy - enfy
						setTimeout(()=>{
							this.enemy.fy = this.enemy.fy + enfy
						},3000+addTalent4*700)
					}
				}
				if(heroId == '宝莲灯'){
					let val = this.harmComputer(2,0,500 + this.reallyRandom(0,5)*150,1.2)
					this.beat(val)
					this.tallentExpert(1,1,2500)
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
			if(this.characterX <= this.screenWidth * 0.5){
				this.$nextTick(function() {
					this.scrollLeft = 0
				});
			}
			if(this.characterX > this.screenWidth * 0.85){
				this.$nextTick(function() {
					this.scrollLeft = this.screenWidth
				});
			}
			if(this.characterY < parseInt(this.screenHeight*0.45)){
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			}
			if(this.characterY > parseInt(this.screenHeight*0.75)){
				this.$nextTick(function() {
					this.scrollTop = this.screenHeight
				});
			}
			if(this.characterX < 0){
				this.characterX = this.screenWidth - 50
				this.player.x = this.characterX
			}
			//防过边界
			if(this.characterY >= parseInt(this.screenHeight * 1.22)){
				this.characterY = parseInt(this.screenHeight * 1.19)
				this.player.y = this.characterY
			}
			if(this.characterX >= this.screenWidth * 1.33){
				this.characterX = this.screenWidth * 1.31
				this.player.x = this.characterX
			}
			if(this.characterY < 45){
				this.characterY = 50
				this.player.y = this.characterY
			}
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
			if(this.mapObjects.length != 0 && (this.myHero.name == '敖丙' || this.myHero.id == 20)){
				this.mapObjects.map((it,idx)=>{
					if(this.mapObjects[idx].img == 'shuiwall.png'){
						let x = Math.abs(it.left+5 - this.characterX)
						let y = Math.abs(it.top+5 - this.characterY)
						let dis = Math.sqrt(x*x+y*y)
						if(dis <= 150 && !this.xuli){	//踩到
							this.myHero.fs = this.myHero.fs + 50 + parseInt(this.addData.add10)*10
							this.myHero.gj = this.myHero.gj + 25 + parseInt(this.addData.add10)*5
							this.myHero.fy = this.myHero.fy + 25 + parseInt(this.addData.add10)*5
							this.xuli = true
						}
						if(dis > 150 && this.xuli){
							this.myHero.fs = this.myHero.fs - 50 - parseInt(this.addData.add10)*10
							this.myHero.gj = this.myHero.gj - 25 - parseInt(this.addData.add10)*5
							this.myHero.fy = this.myHero.fy - 25 - parseInt(this.addData.add10)*5
							this.xuli = false
						}
					}
				})
			}
			//狂暴奎木狼
			if(this.myHero.id == 1001 && this.distance > 300){
				this.addBlood(20,0,0)
			}
			//牛魔王
			if(this.myHero.id == 1003){
				this.addBlood(this.randomNum(4,5),0,0)
			}
			//地狱火
			if(this.enmapObjects.length != 0 && (this.enemy.name == '地狱火')){
				this.enmapObjects.map((it,idx)=>{
					if(this.enmapObjects[idx].img == 'huozhu.png'){
						let x = Math.abs(it.left+5 - this.characterX)
						let y = Math.abs(it.top+5 - this.characterY)
						let dis = Math.sqrt(x*x+y*y)
						if(dis <= 40){	//踩到
							let val = parseInt(this.enemy.gj * 0.75) - parseInt(this.myHero.fy*1.7) + this.randomNum(15,60)
							if(val <= 30){
								val = this.randomNum(30,50)
							}
							if(this.ygbj){
								val = parseInt(this.enemy.gj * 0.75) + this.randomNum(10,30)
							}
							this.enemyBeat2(val)
						}
					}
				})
			}
			if(this.myEquipName.includes('狂徒铠甲') && !this.distanceComp(170)) {
				this.addBlood(35,0,0)
			}
			if(this.myEquipName.includes('海洋龙魂') && !this.distanceComp(170)) {
				this.addBlood(parseInt(this.myHero.blood*0.03),0,0)
				this.blueComput(5,"add")
			}
			if(this.myEquipName.includes('心之钢') || this.myEquipName.includes('时光杖')) {
				let time = parseInt(this.min) * 60 + parseInt(this.second)
				if(time - this.xinzhigang >= 15){
					if(this.myEquipName.includes('心之钢')){this.myHero.blood += 200}
					if(this.myEquipName.includes('时光杖')){
						this.myHero.gj += 6;
						this.myHero.fs += 10
						this.myHero.fy += 3
						this.myHero.blood += 100
					}
					this.xinzhigang = time
				}
				if(this.xinzhigang == 0){
					this.xinzhigang = time
				}
			}
			if(this.myEquipName.includes('明朗之靴')) {
				if(this.distanceComp(150)){
					this.speed = this.myHero.speed + 35
				}else{
					this.speed = 70
				}
			}
		},
		scroll: function(e) {
			this.old.scrollTop = e.detail.scrollTop
			this.old.scrollLeft = e.detail.scrollLeft
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
			if(this.myEquipName.includes('残疫')) {
				addTalent4 += 2
			}
			//风神
			if(this.myHero.id == 8 && this.$refs.tallents.tallentShow){
				this.$refs.tallents.tallentShow = false
				this.cd(4000 - addTalent*300,1)
				this.blueComput(50+addTalent*5,'reduce')
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
						this.enemy.mk = parseInt(this.enemy.mk) - (5 + 2*addTalent)
					  }
					  let val = this.harmComputer(2,addTalent,300,1.5)
					  if(strongIndex == 2){
					  	val = this.harmComputer(2,addTalent,380+parseInt(this.myHero.fs*0.5),1.5)
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
				if(parseInt(this.addData.strongIndex) == 1 || parseInt(this.addData.strongIndex) == 2){
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
			//地狱火
			if(this.myHero.id == 1006 && this.$refs.tallents.tallentShow2){
				this.$refs.tallents.tallentShow2 = false
				this.cd(5500 - addTalent2*200,2)
				this.blueComput(35+addTalent2*3,'reduce')
				this.mapObjects.push({
					left: pageX - 28,
					top: pageY - 31,
					width: 80,
					height: 135,
					img: 'huozhu.png'
				});
				setTimeout(()=>{
				  this.mapObjects.map((i,d)=>{
					  if(i.img == 'huozhu.png'){
						  this.mapObjects.splice(d,1)
					  }
				  })
				},3500 + addTalent2*150)
			}
			//女警
			if(this.myHero.id == 103 && this.$refs.tallents.tallentShow2){
				this.$refs.tallents.tallentShow2 = false
				this.cd(11000 - addTalent2*250,2)
				this.blueComput(50+addTalent2*5,'reduce')
				this.mapObjects.push({
					left: pageX - 28,
					top: pageY - 31,
					width: 110,
					height: 75,
					img: 'jiazi.jpeg'
				});
				setTimeout(()=>{
				  this.mapObjects.map((i,d)=>{
					  if(i.img == 'jiazi.jpeg'){
						  this.mapObjects.splice(d,1)
					  }
				  })
				},6000 + addTalent2*600)
			}
		},
		 getSystemInfo() {
			const systemInfo = uni.getSystemInfoSync();
			setTimeout(()=>{
				this.screenWidth = systemInfo.windowWidth;
				this.screenHeight = systemInfo.windowHeight;
				this.characterX = parseInt(this.screenWidth*0.8) - this.reallyRandom(0,5)*45
				this.characterY = parseInt(this.screenHeight*0.6) - this.reallyRandom(0,5)*15
				this.player.x = this.characterX;
				this.player.y = this.characterY;
				this.initLayout();
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
		distanceComp(dis1) {
			if(this.distance <= dis1){
				return true
			}else{
				return false
			}
		},
		//spt敌方英雄技能
		enemyTallent(num) {
			if(this.bettleEnd || !this.begin){
				return
			}
			if(this.enemy.name == '韦鲁斯'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'xiaogang')
				if(num == 1){
					if(!this.distanceComp(100)){
						this.heroAnm('../../static/imgs/hero/wls1.gif?'+ new Date().getTime(),1)
						this.backBgImg('wls1',1800, 1)
						this.fasheArrow(520,1,32,"韦鲁斯",1,9,5)
					}
				}
				if(num == 2){
					this.fasheArrow(400,1,38,"韦鲁斯",2,8,5)
				}
				if(num == 3){
					if(parseFloat(this.enemy.gs)>0.6){
						this.enemy.gs = parseFloat(this.enemy.gs - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},2500)
					}
				}
				if(num == 4){
					this.fasheArrow(600,1,36,"韦鲁斯",3,5,5)
					if(this.enemyX < this.characterX){
						this.enemyX = this.enemyX - (80 + this.randomNum(0,50))
					}else{
						this.enemyX = this.enemyX + (80 + this.randomNum(0,50))
					}
				}
			}
			if(this.enemy.name == '狂暴奎木狼'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'laotie')
				if(num == 1){
					this.heroAnm('../../static/imgs/hero/jfly1.gif?'+ new Date().getTime())
					this.backBgImg('jfly1',1000)
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.3)
					if(this.randomNum(0,1) == 1){
						val = parseInt(val*1.5)
					}
					this.enemyBeat2(val)
				}
				if(num == 2){
					this.playVoice('../../static/sounds/kbkml.mp3',true,num+3,3000)
					setTimeout(()=>{
						this.tallentExpert(5,2)
					},500)
					if(parseFloat(this.enemy.gs)>0.6){
						this.enemy.gs = parseFloat(this.enemy.gs - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},3500)
					}
				}
				if(num == 3){
					this.playVoice('../../static/sounds/chongji.wav',true,num+3,1800)
					this.enChongci(130)
					//禁锢
					this.tallentExpert(1,2,1500)
					this.showEngjAnm = true
					this.heroAnm('../../static/imgs/hero/fb_kml.gif?'+ new Date().getTime(),1)
					this.backBgImg('fb_kml',900,1)
					this.enemyBeat2(this.harmComputer(3))
				}
				if(num == 4){
					this.playVoice('../../static/sounds/kbkml4.mp3',true,num+3,4000)
					this.tallentExpert(6,1,5000)
				}
			}
			if(this.enemy.name == '百花仙子'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'zhimiao_emo')
				if(num == 1){
					this.fasheArrow(450,1,35,"百花仙子",1,2,5)
					this.playVoice('../../static/sounds/bhxz1.wav',true,num+3,2000)
				}
				if(num == 2){
					this.playVoice('../../static/sounds/bhxz2.wav',true,num+3,3000)
					this.shotDown = true
					this.enNoMove = true
					this.enemyConsistAddBlood(100,200,2000)
					setTimeout(()=>{
						this.shotDown = false
						this.enNoMove = false
					},2000)
				}
				if(num == 3){
					this.fasheArrow(350,1,35,"百花仙子",2,16,5)
				}
				if(num == 4){
					this.playVoice('../../static/sounds/bhxz4.wav',true,num+3,4000)
					this.enImmunity = true
					setTimeout(()=>{
						this.enImmunity = false
					},8000)
				}
			}
			if(this.enemy.name == '牛魔王'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'laotie')
				if(num == 1){
					let val = this.harmComputer(3)
					this.enemyBeat2(val)
					if(this.randomNum(0,1) == 1){
						this.tallentExpert(2,2,1000)
					}
				}
				if(num == 2){
					let fyval = parseInt(this.enemy.fy*0.35)
					let mkval = parseInt(this.enemy.mk*0.35)
					let blood1 = this.blood1
					this.enemy.fy = this.enemy.fy + fyval
					this.enemy.mk = this.enemy.mk + mkval
					setTimeout(()=>{
						this.enemy.fy = this.enemy.fy - fyval
						this.enemy.mk = this.enemy.mk - mkval
						if(this.blood1 < blood1 && this.distanceComp(135)){
							let val = parseInt((blood1 - this.blood1)*0.5) + 250 - this.myHero.fy*2
							this.enemyBeat2(val)
						}
					},3500)
				}
				if(num == 3){
					this.enChongci(120)
					let val = this.harmComputer(3)
					this.enemyBeat2(val)
					setTimeout(()=>{
						this.shanxian(90 + this.randomNum(0,30))
						this.tallentExpert(2,2,1000)
					},100)
				}
				if(num == 4){
					let val = this.harmComputer(3) + this.randomNum(0,200)
					this.enemyBeat2(val)
					this.myHero.fy = this.myHero.fy - 9
				}
			}
			if(this.enemy.name == '狂暴武僧'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'laotie')
				let randomVal = this.randomNum(50,250)
				this.playVoice('../../static/sounds/wuqi'+num+'.wav',false,num+3,5500)
				if(num == 1){
					this.enChongci(this.enemy.dis1)
					let val = this.harmComputer(3)
					+ randomVal + 350 
					this.enemyBeat2(val)
					this.enemyConsistAddBlood(randomVal,20,30)
				}
				if(num == 2){
					this.enemy.gj = this.enemy.gj + 35
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj - 30
					},3500)
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
						+ parseInt(this.enemy.gj*1.8) - parseInt(this.myHero.fy*0.6) + randomVal
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
							this.enemy.fy = parseInt(this.enemy.fy) + 30
							this.enemy.mk = parseInt(this.enemy.mk) + 30
							this.enemy.gj = parseInt(this.enemy.gj) + 15
							setTimeout(()=>{
								this.enemy.fy = parseInt(this.enemy.fy) - 30
								this.enemy.mk = parseInt(this.enemy.mk) - 30
								this.enemy.gj = parseInt(this.enemy.gj) - 15
							},5000)
						setTimeout(()=>{
							if(this.distanceComp(100)){
								let val =  parseInt(this.enemy.gj * 2.7)
								 - parseInt(this.myHero.fy*2) + 500 + randomVal
								this.enemyBeat2(val)
							}
						},1000)
				}
			}
			if(this.enemy.name == '雷伊'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'aicheng')
				if(num == 1){
					this.fasheArrow(450,1,35,'雷伊',1,16,2)
				}
				if(num == 2){
					this.heroAnm('../../static/imgs/hero/ly2.gif?'+ new Date().getTime(),1)
					this.backBgImg('ly2',1200,1)
					this.playVoice('../../static/sounds/ly2.mp3',true,num+3,4000)
					let fsv = parseInt(this.enemy.gj*0.2)
					this.enemy.gj = this.enemy.gj + fsv
					this.fastsp2 = 0.15
					setTimeout(()=>{
						this.fastsp2 = 0
						this.enemy.gj = this.enemy.gj - fsv
					},3500)
				}
				if(num == 3){
					this.enChongci(120)
					this.playVoice('../../static/sounds/ly3.wav',true,num+3,2000)
					if(this.distanceComp(120)){
						if(this.enemyX > this.characterX){
							this.enemyX = this.characterX - 40
						}else{
							this.enemyX = this.characterX + 40
						}
						if(this.enemyY > this.characterY){
							this.enemyY = this.characterY - 40
						}else{
							this.enemyY = this.characterY + 40
						}
						let val = this.harmComputer(3)
						this.enemyBeat2(val)
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 1000
						});
						this.delayTel(1000,0)
					}
					
				}
				if(num == 4){
					this.heroChongci(138)
					this.playVoice('../../static/sounds/ly4.mp3',true,num+3,3000)
					this.heroAnm('../../static/imgs/hero/ly4.gif?'+ new Date().getTime(),1)
					this.backBgImg('ly4',1000,1)
					if(this.distanceComp(138)){
						setTimeout(()=>{
							let val = this.harmComputer(3)+300
							this.enemyBeat2(val)
							this.tallentExpert(4,2,5000)
						},60)
					}
				}
			}
			if(this.enemy.name == '地狱火') {
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'zhibing_emo')
				if(num == 1){
					this.fasheArrow(400,1,35,'地狱火',1,1,1)
				}
				if(num == 2){
					this.enmapObjects.push({
						left: this.characterX >=this.enemyX? (this.characterX - this.randomNum(10,100)):(this.characterX + this.randomNum(10,100)),
						top: this.randomNum(0,1) == 0?(this.characterY - this.randomNum(10,60)):(this.characterY + this.randomNum(10,60)),
						width: 80,
						height: 135,
						img: 'huozhu.png'
					});
					setTimeout(()=>{
					  this.enmapObjects.map((i,d)=>{
						  if(i.img && i.img == 'huozhu.png'){
							  this.enmapObjects.splice(d,1)
						  }
					  })
					},3500)
				}
				if(num == 3){
					this.ygbj = true
					setTimeout(()=>{
						this.ygbj = false
					},3000)
				}
				if(num == 4){
					this.fasheArrow(450,1,38,'地狱火',4,3,2)
				}
			}
			if(this.enemy.name == '二郎真君-杨戬') {
				this.playVoice(this.enemy.tallent[num].name,true,num-1,2000,'zhibing_emo')
				if(num == 1){
					if(this.enFlagTime){
						return
					}
					this.playVoice('../../static/sounds/elzj1.mp3',true,num+3,2500)
					this.enmapObjects.push({
						left: this.enemyX - this.randomNum(30,70),
						top: this.enemyY + this.randomNum(20,60),
						width: 130,
						height: 136,
						img: 'xtq.png'
					});
					let ind = 0
					this.enmapObjects.map((i,d)=>{
					  if(i.img == 'xtq.png'){
						  ind = d
					  }
					})
					this.enFlagTime = setInterval(()=>{
						if(this.characterX > this.enmapObjects[ind].left){
							this.enmapObjects[ind].left = this.enmapObjects[ind].left + 3
						}else if(this.enmapObjects[ind].left - this.characterX > 36){
							this.enmapObjects[ind].left = this.enmapObjects[ind].left - 3
						}
						if(this.characterY > this.enmapObjects[ind].top){
							this.enmapObjects[ind].top = this.enmapObjects[ind].top + 3
						}else if(this.enmapObjects[ind].top - this.characterY > 10){
							this.enmapObjects[ind].top = this.enmapObjects[ind].top - 3
						}
						//哮天犬已靠近
						if(!this.enFlag && Math.abs(this.characterX - this.enmapObjects[ind].left) <= 70 && Math.abs(this.characterY - this.enmapObjects[ind].top) <= 50){
							setTimeout(()=>{
								clearInterval(this.enFlagTime)
								this.enFlagTime = null
								this.enmapObjects.splice(ind,1)
								this.enFlag = false
							},2000)
							let val = parseInt(this.enemy.gj*1.6) - parseInt(this.myHero.fy*1.5) + 100 + this.randomNum(20,50)
							if(val<50){
								val = 50
							}
							this.consistEnemyBeat(val,500,2550)
							this.enFlag = true
						}
					},30)
				}
				if(num == 2){
					if(this.enspeed > 0.2){
						this.enspeed = this.enspeed - 0.2
					}
					setTimeout(()=>{
						if(this.enspeed >= 0.2){
							this.enspeed = this.enspeed + 0.2
						}
					},3000)
				}
				if(num == 3){
					this.fasheArrow(380,1,45,'二郎真君-杨戬',3,6,5)
					this.playVoice('../../static/sounds/elzj3.wav',true,num+3,2500)
					this.heroAnm('../../static/imgs/hero/elzj3.gif?'+ new Date().getTime(),1)
					this.backBgImg('elzj3',2000,1)
				}
				if(num == 4){
					this.enChongci(200)
					this.playVoice('../../static/sounds/chongji.wav',true,num+3,1800)
					let val = this.harmComputer(3) + 300
					//生命值小于30%
					if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.3){
						val = parseInt(val*1.5)
					}
					this.enemyBeat2(val)
					this.heroAnm('../../static/imgs/hero/elzj4.gif?'+ new Date().getTime(),1)
					this.backBgImg('elzj4',1500,1)
				}
			}
			if(this.enemy.name == '无量仙翁') {
				this.playVoice(this.enemy.tallent[num].name,true,num-1,2000,'laotie')
				if(num == 1){
					this.fasheArrow(450,1,35,"无量仙翁",1,16,2)
				}
				if(num == 2){
					//生命值小于30%
					if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.3){
						this.enemy.fy = this.enemy.fy + 70
						this.enemy.mk = this.enemy.mk + 70
					}else{
						this.enemy.fy = this.enemy.fy + 105
						this.enemy.mk = this.enemy.mk + 105
					}
					setTimeout(()=>{
						if(parseInt(this.blood1)/parseInt(this.enemy.blood) <= 0.3){
							this.enemy.fy = this.enemy.fy - 70
							this.enemy.mk = this.enemy.mk - 70
						}else{
							this.enemy.fy = this.enemy.fy - 105
							this.enemy.mk = this.enemy.mk - 105
						}
					},3000)
				}
				if(num == 3){
					setTimeout(()=>{
						if(this.randomNum(0,1) == 0){
							this.delayTel(1000,0)
							this.tallentExpert(3,2,3500)
							let val = this.harmComputer(3) + this.randomNum(0,250)
							this.enemyBeat2(val)
						}else{
							this.tallentExpert(9,2,3000)
							let val = this.harmComputer(3) + this.randomNum(0,250)
							this.enemyBeat2(val)
						}
					},1500)
				}
				if(num == 4){
					this.enmapObjects.push({
						left: this.characterX - this.randomNum(30,70),
						top: this.characterY - 280,
						width: 390,
						height: 390,
						img: 'tianyuanding.png'
					});
					let ind = 0
					this.enmapObjects.map((i,d)=>{
					  if(i.img == 'tianyuanding.png'){
						  ind = d
					  }
					})
					this.enFlagTime = setInterval(()=>{
						this.enmapObjects[ind].top = this.enmapObjects[ind].top + 20
						//装住
						if(!this.enFlag && Math.abs(this.enmapObjects[ind].left - this.characterX) <= 150 && this.characterY - this.enmapObjects[ind].top <= 150){
							let val = parseInt(this.enemy.gj*1.6) - parseInt(this.myHero.fy*1.35) + 100 + this.randomNum(0,50)
							if(val<50){
								val = 50
							}
							setTimeout(()=>{
								this.myNoMove = false
								this.enFlag = false
								this.enmapObjects.splice(ind,1)
							},3000)
							this.consistEnemyBeat(val,500,3000)
							this.delayTel(3000,0)
							this.myNoMove = true
							this.enFlag = true
							clearInterval(this.enFlagTime)
							this.enFlagTime = null
						}
					},350)
					//没压到
					setTimeout(()=>{
						if(!this.enFlag){
							this.enmapObjects.splice(ind,1)
							clearInterval(this.enFlagTime)
							this.enFlagTime = null
							this.myNoMove = false
						}
					},4300)
				}
			}
			if(this.enemy.name == '不朽战神') {
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'zhifeng_emo')
				if(num == 1){
					let val = this.harmComputer(3) + 250
					this.enemyBeat2(val)
					this.playVoice('../../static/sounds/bxzs1.wav',true,num+3,1500)
					this.tallentExpert(3,2,3000,0.5)
				}
				if(num == 2){
						this.yinshen2 = true
						//非射手、法师，距离在100码外，打不到
						if(this.myHero.distance < 100 && !this.distanceComp(100)){
							this.delayTel(1500,0)
						}
						this.playVoice('../../static/sounds/bxzs2.wav',true,num-1,1500)
						setTimeout(()=>{
							this.computeDistance()
							if(this.distanceComp(250)){
								this.enChongci(250)
								this.playVoice('../../static/sounds/chongji.wav',true,num+3,1800)
								if(this.enemyX > this.characterX){
									this.enemyX = this.characterX - 30
								}else{
									this.enemyX = this.characterX + 30
								}
								if(this.enemyY > this.characterY){
									this.enemyY = this.characterY - 30
								}else{
									this.enemyY = this.characterY + 30
								}
								this.tallentExpert(5,2)
								this.yinshen2 = false
								let val = this.harmComputer(3)
								this.enemyBeat2(val)
							}else{
								this.delayTel(1000,0)
								setTimeout(()=>{
									this.yinshen2 = false
								},1500)
							}
						},3050)
				}
				if(num == 3){
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.3)
					this.enChongci(135)
					this.playVoice('../../static/sounds/chongji.wav',true,num+3,1800)
					this.enemyBeat2(val)
				}
				if(num == 4){
					this.playVoice('../../static/sounds/bxzs4.mp3',true,num+3,1800)
					setTimeout(()=>{
						this.fasheArrow(500,1,50,"不朽战神",4,18)
					},1000)
				}
			}
			if(this.enemy.name == '狂暴孙悟空') {
			this.playVoice('../../static/sounds/qtds'+num+'.wav',true,num+3,4000)
			if(num == 1){
				this.playVoice('../../static/sounds/calsyb.mp3',false,7,2500)
				if(this.yinshen2){
					this.yinshen2 = false
				}
				this.heroAnm('../../static/imgs/hero/swk1.gif?'+ new Date().getTime(),1)
				this.backBgImg('swk1',2900,1)
				let val = this.harmComputer(3) + 50
				setTimeout(()=>{
					this.enemyBeat2(val)
				},2200)
				this.myHero.fy = parseInt(this.myHero.fy*(0.8))
				setTimeout(()=>{
					this.myHero.fy = parseInt(this.myHero.fy/(0.8))
				},3000)
				this.myHero.fy = this.myHero.fy - 6
				this.myHero.mk = this.myHero.mk - 6
			}
			if(num == 2){
				this.enChongci(45,1)
				uni.showToast({
					title: '敌方隐身',
					icon:'none',
					duration: 600
				});
				//非射手、法师，距离在100码外，打不到
				if(this.myHero.distance < 100 && !this.distanceComp(100)){
					this.delayTel(1500,0)
				}
				this.yinshen2 = true
				setTimeout(()=>{
					this.yinshen2 = false
				},2500)
			}
			if(num == 3){
				this.playVoice('../../static/sounds/ygnlp.mp3',false,6,3600)
				this.heroAnm('../../static/imgs/hero/swk3.gif?'+ new Date().getTime(),1)
				this.backBgImg('swk3',4000,1)
				let v = this.enemy.gs
				this.enemy.gs = 0.6
				setTimeout(()=>{
					this.enemy.gs = v
				},2200)
				this.yinshen2 = false
				this.enChongci(145)
				let val = this.harmComputer(3) + 100
				if(this.yinshen2){
					val += parseInt(this.enemy.gj)
				}
				this.enemyBeat2(val)
			}
			if(num == 4){
				this.heroAnm('../../static/imgs/hero/swk4.gif?'+ new Date().getTime(),1)
				this.backBgImg('swk4',5300,1)
				this.follow(2,5000)
				this.enNoMove = true
				this.enemy.fy = parseInt(this.enemy.fy + this.enemy.fy*0.5)
				this.enemy.mk = parseInt(this.enemy.mk + this.enemy.mk*0.5)
				setTimeout(()=>{
					this.enemy.fy = parseInt(this.enemy.fy - this.enemy.fy*0.5)
					this.enemy.mk = parseInt(this.enemy.mk - this.enemy.mk*0.5)
					this.enNoMove = false
				},5200)
				let val = parseInt(this.enemy.gj * 1.5) - parseInt(this.myHero.fy*1.7) + this.randomNum(20,70)
				  if(val < 35){
					  val = 35
				  }
				  let enFlagTime = setInterval(()=>{
				  	this.enemyBeat2(val)
				  },300)
				  setTimeout(()=>{
				  	clearInterval(enFlagTime)
				  },5000)
			}
		}
			if(this.enemy.name == '艾欧尼亚之箭'){
				this.playVoice(this.enemy.tallent[num].name,true,num+3,2000,'zhifeng_emo')
				this.regGjAdd.gjHarm = this.min*110
				if(num == 1){
					if(this.distanceComp(200)){
						this.playVoice('../../static/sounds/aonyzj1.wav',true,5,1200)
						this.playMovies2(1,'1011',true)
						let val = this.harmComputer(3) + this.randomNum(50,200)
						if(this.randomNum(0,2) == 1){
							val = parseInt(val*2.5)
						}
						setTimeout(()=>{
							this.enemyBeat2(val)
						},900)
					}
				}
				if(num == 2){
					if(parseFloat(this.enemy.gs)>=0.6){
						this.enemy.gs = parseFloat(this.enemy.gs - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},3500)
					}
				}
				if(num == 3){
					let dir = this.randomNum(0,1)
					if(dir == 1){
						this.enemyY = this.enemyY + 55 + this.randomNum(0,18)
					}else{
						if(this.enemyY > 73){
							this.enemyY = this.enemyY - 55 - this.randomNum(0,18)
						}
					}
					setTimeout(()=>{
						this.playVoice('../../static/sounds/jyzs4.wav',true,num+3,4000)
						this.fasheArrow(2000,1,42,"艾欧尼亚之箭",3,3,7)
					},300)
				}
				if(num == 4){
					this.tallentExpert(6,1,5000)
				}
			}
			if(this.enemy.name == '艾欧尼亚之闪'){
				if(num == 1){
					this.playMovies2(1,'1012',true)
					let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.3)
					this.enemyBeat2(val)
				}
				if(num == 2){
					this.playVoice('../../static/sounds/aonyzs2.mp3',true,num+3,2500)
					this.fasheArrow(255,1,65,"艾欧尼亚之闪",2,7)
				}
				if(num == 3){
					if(this.randomNum(0,1) == 1){
						this.enChongci(60,1)
						this.playVoice('../../static/sounds/aning3.wav',true,num+3,1500)
					}
				}
			}
			if(this.enemy.name == '艾欧尼亚之影'){
				if(num == 1){
					this.fasheArrow(380,1,43,'艾欧尼亚之影',1,19,2)
				}
				if(num == 2){
					if(this.enspeed > 0.23){
						this.enspeed = this.enspeed - 0.23
					}
					setTimeout(()=>{
						if(this.enspeed >= 0.23){
							this.enspeed = this.enspeed + 0.23
						}
					},4000)
				}
				if(num == 3){
					this.fasheArrow(320,1,35,'艾欧尼亚之影',3,6,1)
				}
				if(num == 4){
					this.playMovies2(4,'1013',true)
					setTimeout(()=>{
						this.fasheArrow(500,1,39,"无",4,14)
						this.playVoice('../../static/sounds/elzj3.wav',true,num-1,1500)
						if(Math.abs(this.characterX - this.enemyX) <= 625 && Math.abs(this.characterY - this.enemyY)<=39){
							let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.5) + 200
							this.enemyBeat2(val)
						}
					},850)
				}
				//被动
				if(this.cd1 && this.cd2 && this.cd3){
					this.myHero.icon = ''
					this.shotDown = true
					this.yinshen = true
					this.enemyMoveContrl(1)
					setTimeout(()=>{
						this.shotDown = false
						this.yinshen = false
						this.enemyMoveContrl(2)
						this.myHero.icon = this.origHero.icon
					},1500)
				}
			}
			if(this.enemy.name == '艾欧尼亚之灵'){
				if(num == 1){
					this.fasheArrow(430,1,32,'艾欧尼亚之灵',1,16,3)
				}
				if(num == 2){
					this.enemy.gj = this.enemy.gj + 38
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj - 38
					},3000)
				}
				if(num == 3){
					this.playMovies2(3,'1014',true)
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*0.2)
						this.enemyBeat2(val)
						let x = this.randomNum(0,1)
						let mk = parseInt(this.myHero.fy*0.35)
						let gj = parseInt(this.myHero.gj*0.45)
						let fs = parseInt(this.myHero.fs*0.45)
						if(x == 0){
							this.myHero.fy = this.myHero.fy - mk
							setTimeout(()=>{
								this.myHero.fy = this.myHero.fy + mk
							},3000)
						}else{
							this.myHero.gj = this.myHero.gj - gj
							this.myHero.fs = this.myHero.fs - fs
							setTimeout(()=>{
								this.myHero.gj = this.myHero.gj + gj
								this.myHero.fs = this.myHero.fs + fs
							},4000)
						}
				}
				if(num == 4){
					this.playMovies2(4,'1014',true)
					this.tallentExpert(1,1,1500)
					setTimeout(()=>{
						this.enemyConsistAddBlood(this.enemy.gj*2,100,120)
						this.enemyX = 38
					},1500)
				}
			}
		},
		videoEnded(index,url) {
			if(index == 1){	//自己
				let strongIndex = 0
				if(this.addData.strongIndex){
					strongIndex = parseInt(this.addData.strongIndex)
				}
				if(strongIndex != 0){
					this.strongId = this.myHero.id+'_'+strongIndex
				}else{
					this.strongId = this.myHero.id
				}
				this.showVideo = false
			}else{
				// this.enemyVideo = url
				this.enemyVideo = ''
				this.showVideo2 = false
			}
		},
		playMovies(index,strId,hasOriMov,landscape) {
			if(this.showVideo){
				return
			}
			//要皮肤才有视频，无皮肤hasOriMov=true有视频
			if(strId != 0 || hasOriMov){
				if(landscape){	//横屏
					this.videoWid = 195
					this.videoHei = 120
					this.landscape = true
				}else{
					this.videoWid = 128
					this.videoHei = 220
					this.landscape = false
				}
				if(index == 4){
					this.videoDuration = 5
				}else{
					this.videoDuration = 3
				}
				this.strongId = this.strongId+"-"+index
				this.showVideo = true
			}
		},
		playMovies2(index,url,landscape) {
			if(this.showVideo2){
				return
			}
				if(landscape){	//横屏
					this.videoWid2 = 195
					this.videoHei2 = 120
				}else{
					this.videoWid2 = 150
					this.videoHei2 = 255
				}
				if(index == 4){
					this.videoDuration2 = 5
				}else{
					this.videoDuration2 = 3
				}
				this.enemyVideo = url+'-'+index
				this.showVideo2 = true
		},
		
		/* ================= 初始化 ================= */
			initLayout() {
				const query = uni.createSelectorQuery().in(this);
				this.renderPlayer();
				// 摇杆中心（屏幕坐标，用于和 touch 的 clientX/clientY 相减）
				query.select('#joystick').boundingClientRect(rect => {
					if (!rect) return;
					this.joyCenter = {
						x: this.screenWidth - 110,
						y: 110
					};
				});
		
				query.exec(() => {
					this.startLoop();
				});
			},
		
			/* ================= 摇杆事件 ================= */
			onJoyStart(e) {
				this.startLoop();
				const t = e.touches[0];
				// 兜底：万一没量到中心，用触点当中心
				if (!this.joyCenter) {
					this.joyCenter = { x: t.clientX, y: t.clientY };
				}
				this.player.x = this.characterX
				this.player.y = this.characterY
				this.updateDir(t.clientX, t.clientY);
			},
		
			onJoyMove(e) {
				const t = e.touches[0];
				this.updateDir(t.clientX, t.clientY);
			},
		
			onJoyEnd() {
				this.stopLoop()
				this.resetDir();
			},
		
			resetDir() {
				this.dir = { x: 0, y: 0 };
				this.stickStyle = 'transform: translate3d(0px, 0px, 0);';
			},
		
			/**
			 * 核心：根据触点位置计算方向
			 */
			updateDir(cx, cy) {
				const dx = cx - this.joyCenter.x;
				const dy = cy - this.joyCenter.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
		
				// 1. 摇杆小球视觉位置（限制在半径内）
				let ox = dx, oy = dy;
				if (dist > this.joyRadius) {
					ox = (dx / dist) * this.joyRadius;
					oy = (dy / dist) * this.joyRadius;
				}
				this.stickStyle = `transform: translate3d(${ox}px, ${oy}px, 0);`;
				// 禁止移动判断
				if(!this.begin) {
					return
				}
				if(this.myNoMove){
					return
				}
				// 3. 归一化成单位向量 —— 保证斜向速度与直向一致
				this.dir = { x: dx / dist, y: dy / dist };
			},
		
			/* ================= 游戏主循环 ================= */
			startLoop() {
				if (this.timer) return;
				this.lastTime = Date.now();
				this.timer = setInterval(this.tick, 10); // ≈60fps
			},
		
			stopLoop() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
		
			tick() {
				if(this.myNoMove){
					return
				}
				const now = Date.now();
				let dt = (now - this.lastTime) / 1000;
				this.lastTime = now;
				if (dt <= 0) return;
				if (dt > 0.1) dt = 0.1; // 防止切后台回来瞬移
				if (this.dir.x === 0 && this.dir.y === 0) return;
		
				const { w, h } = this.stageSize;
				let nx = this.player.x + this.dir.x * this.speed * dt;
				let ny = this.player.y + this.dir.y * this.speed * dt;
		
				// 边界限制
				// nx = Math.max(0, Math.min(w - PLAYER_SIZE, nx));
				// ny = Math.max(0, Math.min(h - PLAYER_SIZE, ny));
		
				this.player.x = nx;
				this.player.y = ny;
				this.renderPlayer();
			},
		
			renderPlayer() {
				this.characterX = parseInt(this.player.x)
				this.characterY = parseInt(this.player.y)
				if(!this.joyStickjieliu){
					this.joyStickjieliu = setTimeout(()=>{
						this.myMoveEffect()
						clearTimeout(this.joyStickjieliu)
						this.joyStickjieliu = null
					},700)
				}
				// 用 transform 移动，走 GPU 合成，比改 left/top 流畅
				// this.playerStyle = `transform: translate3d(${this.player.x}px, ${this.player.y}px, 0);`;
			},
		initGame() {
			clearInterval(this.ylzz)
			clearInterval(this.time1)
			clearInterval(this.enFlagTime2)
			clearInterval(this.enFlagTime)
			clearInterval(this.time3)
			clearInterval(this.time4)
			clearInterval(this.goTime2)
			clearInterval(this.goTime3)
			clearInterval(this.regGjTimer)
			clearInterval(this.arrowTimer)
			clearInterval(this.arrowTimer2)
			clearInterval(this.beatTime)
			clearInterval(this.ygbj)
			if(this.innerAudioContext[0])this.innerAudioContext[0].destroy()
			if(this.innerAudioContext[1])this.innerAudioContext[1].destroy()
			if(this.innerAudioContext[2])this.innerAudioContext[2].destroy()
			if(this.innerAudioContext[3])this.innerAudioContext[3].destroy()
			if(this.innerAudioContext[4])this.innerAudioContext[4].destroy()
			if(this.innerAudioContext[5])this.innerAudioContext[5].destroy()
			if(this.innerAudioContext[6])this.innerAudioContext[6].destroy()
			if(this.innerAudioContext[7])this.innerAudioContext[7].destroy()
			if(this.audioVoice[0])this.audioVoice[0].destroy()
			if(this.audioVoice[1])this.audioVoice[1].destroy()
			if(this.audioVoice[2])this.audioVoice[2].destroy()
			if(this.audioVoice[3])this.audioVoice[3].destroy()
			if(this.audioVoice[4])this.audioVoice[4].destroy()
			if(this.audioVoice[5])this.audioVoice[5].destroy()
			if(this.audioVoice[6])this.audioVoice[6].destroy()
			if(this.audioVoice[7])this.audioVoice[7].destroy()
			this.audioVoice = [null,null,null,null,null,null,null,null]
		}
		
	},
	onUnload() {
		clearInterval(this.wzhy)
		clearInterval(this.ylzz)
		clearInterval(this.time1)
		clearInterval(this.enFlagTime2)
		clearInterval(this.enFlagTime)
		clearInterval(this.time3)
		clearInterval(this.goTime2)
		clearInterval(this.arrowTimer)
		clearInterval(this.arrowTimer2)
		clearInterval(this.beatTime)
		clearInterval(this.ygbj)
		if(this.innerAudioContext[0])this.innerAudioContext[0].destroy()
		if(this.innerAudioContext[1])this.innerAudioContext[1].destroy()
		if(this.innerAudioContext[2])this.innerAudioContext[2].destroy()
		if(this.innerAudioContext[3])this.innerAudioContext[3].destroy()
		if(this.innerAudioContext[4])this.innerAudioContext[4].destroy()
		if(this.innerAudioContext[5])this.innerAudioContext[5].destroy()
		if(this.innerAudioContext[6])this.innerAudioContext[6].destroy()
		if(this.innerAudioContext[7])this.innerAudioContext[7].destroy()
		if(this.audioVoice[0])this.audioVoice[0].destroy()
		if(this.audioVoice[1])this.audioVoice[1].destroy()
		if(this.audioVoice[2])this.audioVoice[2].destroy()
		if(this.audioVoice[3])this.audioVoice[3].destroy()
		if(this.audioVoice[4])this.audioVoice[4].destroy()
		if(this.audioVoice[5])this.audioVoice[5].destroy()
		if(this.audioVoice[6])this.audioVoice[6].destroy()
		if(this.audioVoice[7])this.audioVoice[7].destroy()
		if (this.bgAudio) {
		  try {
			this.bgAudio.pause();
			this.bgAudio.destroy()
		  } catch (e) {
		  }
		}
		this.myHero = null
		this.begin = null
		this.enemy = null
		this.enmList = null
		this.blood1 = null
		this.blood2 = null
		this.flz = null
		this.bloodVal1 = null
		this.bloodVal2 = null
		this.blueVal = null
		this.shotVal1 = null
		this.shotVal2 = null
		this.time1 = null
		this.time2 = null
		this.time3 = null
		this.cd1 = null
		this.cd2 = null
		this.cd3 = null
		this.cd4 = null
		this.cd5 = null
		this.beatTime = null
		this.beatTime2 = null
		this.min = null
		this.second = null
		this.gs1 = null
		this.gs2 = null
		this.harm = null
		this.harm2 = null
		this.showHarm = null
		this.showHarm2 = null
		this.showAddBlood = null
		this.bettleEnd = null
		this.shotDown = null
		this.openEq = null
		this.myEquip = null
		this.myTool = null
		this.myEquipName = null
		this.regGjAdd = null
		this.flag = null
		this.flag2 = null
		this.bgImg = null
		this.bgImg2 = null
		this.win = null
		this.money = null
		this.xuli = null
		this.jinbiao = null
		this.gameType = null
		this.fyS = null
		this.showTInfo = null
		this.showIntro = null
		this.tallentList = null
		this.innerAudioContext = [null,null,null,null,null,null,null,null]
		this.audioVoice = [null,null,null,null,null,null,null,null]
		this.bgAudio = null
		this.ygbj = null
		this.ylzz = null
		this.yinshen = null
		this.yinshen2 = null
		this.dianren = null
		this.bgImgIndex = null
		this.addData = null
		this.xinshiFlag = null
		this.xinzhigang = null
		this.tallentDuring = null
		this.showTallentTime = null
		this.bgZIndex = null
		this.pojia = null
		this.pomo = null
		this.wzhy = null
		this.origHero = null
		this.heros = null
		this.loop = null
		this.mygjAnm = null
		this.engjAnm = null
		this.showMygjAnm = null
		this.showEngjAnm = null
		this.showWinLogo = null
		this.showWinLogo2 = null
		this.showlose = null
		this.myspeed = null
		this.fastsp = null
		this.fastsp2 = null
		this.enspeed = null
		this.goTime = null
		this.goTime2 = null
		this.characterX = null
		this.characterY = null
		this.enemyX = null
		this.enemyY = null
		this.directType = null
		this.directType2 = null
		this.directType3 = null
		this.directType4 = null
		this.directType5 = null
		this.directType6 = null
		this.directType7 = null
		this.directType8 = null
		this.distance = null
		this.enemyGJdis = null
		this.heroGJdis = null
		this.screenWidth = null
		this.screenHeight = null
		this.enmoveModel = null
		this.enmoveModelTime = null
		this.enNoMove = null
		this.myNoMove = null
		this.mapObjects = null
		this.tallentObjects = null
		this.enmapObjects = null
		this.antijiansu = null
		this.txImg = null
		this.txImg2 = null
		this.bigGJTX = null
		this.bigGJTX2 = null
		this.ArrowTX = null
		this.ArrowTX2 = null
		this.arrowWid = null
		this.arrowHei = null
		this.arrowWid2 = null
		this.arrowHei2 = null
		this.heroMoveType = null
		this.enemyBeatCD = null
		this.arrowX = null
		this.arrowY = null
		this.arrowX2 = null
		this.arrowY2 = null
		this.arrowTimer = null
		this.arrowTimer2 = null
		this.scrollTop = null
		this.scrollLeft = null
		this.old = null
		this.showTower = null
		this.showTower2 = null
		this.towerLeft = null
		this.towerLeft2 = null
		this.regGjTimeout = null
		this.arrowtimeout = null
		this.arrowtimeout2 = null
		this.tempEnemyIcon = null
		this.myStore = null
		this.myImmunity = null
		this.enImmunity = null
		this.enFlag = null
		this.enFlagTime = null
		this.enFlagTime2 = null
		this.iconStyle = null
		this.flyStyle = null
		this.strongId = null
		this.showVideo = null
		this.showVideo2 = null
		this.videoWid = null
		this.videoHei = null
		this.videoWid2 = null
		this.videoHei2 = null
		this.videoDuration = null
		this.videoDuration2 = null
		this.enemyVideo = null
		this.enConsisAddTime = null
	}
}
</script>

<style src="./tianti.scss" lang="scss" scoped></style>