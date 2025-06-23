<template>
	<!-- <view class="container" :style="{'background-image': 'url('+require('../../static/imgs/hero/'+bgImg)+')','background-size': 'cover','background-repeat':'no-repeat'}"> -->
	<view class="container">
		<image class="bgImg" :style="{'z-index':bgZIndex}" :src="bgImg"></image>
		<view class="time" v-if="begin">
			<image class="aler" src="../../static/imgs/time.png"></image>
			<view class="timeText">0{{min}}:{{second}}</view>
		</view>
		<view class="vs">
			<view v-if="bettleEnd" @click="backMenu" class="backMenu">返回主页</view>
			<image v-else-if="begin" class="vsImg" src="../../static/imgs/vs.png"></image>
			<image v-else @click="beginBettle" class="begImg" src="../../static/imgs/begin.png"></image>
		</view>
		<view class="winlogo" v-if="showWinLogo">
			<image class="winlogoImg" style="height: 600rpx" src="../../static/imgs/win.gif"></image>
		</view>
		<view class="winlogo" v-if="showWinLogo2">
			<image class="winlogoImg" style="height: 650rpx" src="../../static/imgs/challengeWin.gif"></image>
		</view>
		<view class="winlogo" v-if="showlose">
			<image class="winlogoImg" style="width: 100%;height: 650rpx" src="../../static/imgs/lose2.gif"></image>
		</view>
		<image class="mygjAnm" :src="mygjAnm" v-if="showMygjAnm"></image>
		<equipment v-if="openEq" :lists="myEquip" :tools="myTool" :moneys="money" @setMoney="setMoney" 
		@showEq="openEquip" @eqlist="getEqlist" @toolList="getToolList"></equipment>
		<view class="main">
			<view style="z-index: 3;">
			<view class="enemy">
				<view class="icon1">
					<image class="icon1Img icon2Img" :src="'../../static/imgs/'+enemy.icon"></image>
				</view>
				<view class="heroTX" v-if="showTX">
					<image class="heroTXimg" :src="'../../static/imgs/'+heroTX"></image>
				</view>
				<view style="width: 100%;">
					<view class="name" style="color: #ffffff;">
						<label>{{enemy.name}}</label>
					</view>
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
				</view>
			</view>
			<view class="enemyInfo">
				<view class="infoRow">
					<label>攻击力</label>
					<label>防御力</label>
					<label>魔法抗性</label>
					<label>攻击速度</label>
				</view>
				<view class="infoRow" style="color: #ff5a08;font-weight: bold;font-size: 42rpx;padding: 10rpx 0rpx;">
					<label>{{enemy.gj}}</label>
					<label>{{enemy.fy}}</label>
					<label>{{enemy.mk}}</label>
					<label>{{enemy.gs}}</label>
				</view>
			</view>
			</view>
			<view class="my">
				<view class="tallentBar" v-if="showTallentTime">
					<ai-progress percentage="100" :isAnimate="true" :duration="tallentDuring" bgColor="#ffd321"
					 :textInside="true" :strokeWidth="8"></ai-progress>
				</view>
				<view class="me" v-show="!yinshen">
					<view class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/hero/'+myHero.icon"></image>
					</view>
					<view class="enemyTX2" v-if="showTX3">
						<image class="heroTXimg" :src="'../../static/imgs/'+enemyTX"></image>
					</view>
					<view style="width: 100%;">
						<view style="display: flex;width: 100%;justify-content: space-between;">
							<view class="name">
								<label>{{myHero.name}}</label>
							</view>
							<view class="harmText2" :style="{color: harm2<0?'#ed0003':'#00ff00'}" v-if="showHarm2">
								{{harm2<0? harm2 : ('+' + harm2)}}
							</view>
						</view>
						<view class="blood">
							<view class="bloodText">{{blood2}}/{{myHero.blood}}</view>
							<view class="bloodVal mybloodVal" :style="{width: bloodVal2 + '%'}"></view>
							<view class="bloodVal2 mybloodVal2" :style="{width: bloodVal2 + '%'}"></view>
						</view>
						<view class="blood" style="height: 46rpx;margin-top: 10rpx;">
							<view class="blueVal" :style="{width: blueVal + '%'}">
							</view>
							<view class="bloodText" style="position: absolute;width: 78%;">{{flz}}/{{myHero.flz}}</view>
						</view>
					</view>
				</view>
				<view class="enemyInfo" v-show="!yinshen">
					<view class="infoRow" style="font-size: 28rpx;">
						<label>攻击力</label><label class="val">{{myHero.gj}}</label>
						<label>法术强度</label><label class="val">{{myHero.fs}}</label>
						<label>防御力</label><label class="val">{{myHero.fy}}</label>
						<label>攻击速度</label><label class="val">{{myHero.v}}</label>
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
							<image class="toolImg" @click="useTool(item.name)" :src="item.icon"></image>
							<view class="storeText">{{item.name}}</view>
						</view>
						<view style="color: #fff;margin-top: 32rpx;" v-if="myTool.length == 0">暂无道具</view>
					</view>
					<view class="regularGj" v-if="cd5" @click="regGj">
						<image class="storeImg" src="../../static/imgs/gj.png"></image>
						<view class="storeText">普通攻击</view>
					</view>
					<view style="width: 72px;height: 72px;" v-else>
					</view>
				</view>
				<view class="tallent">
					<view class="tallentRow">
						<view class="talText"><view>技能<label class="checkT" @click="toTInfo">技能说明</label></view><label style="font-size: 32rpx;">必杀技</label></view>
						<tallent ref="tallents" :noflz="flz == 0" :name="myHero.name" :heroId="myHero.id" @tallent="tallentHandle"></tallent>
					</view>
				</view>
				</view>
			</view>
			<!-- 查看技能介绍 -->
			<view class="sel" style="height: 78%;position: absolute;top: 20%;" v-if="showTInfo">
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
			
			<!-- 游戏介绍 -->
			<view class="sel" style="height: 70%;position: absolute;top: 20%;" v-if="showIntro">
				<view class="titles">玩法介绍</view>
				<view class="close" @click="closeT">×</view>
				<view class="roleInfo" style="color: #fff;font-size: 36rpx;padding-top: 90rpx;line-height: 50rpx;">
					<p>一、战斗开始前需在“<span style="color: #ff870e;">装备商店</span>”购买装备，挑选自己觉得合适的装备；挑装备合适与否往往与战斗的胜负密切相关。</p>
					<p>二、装备商店里有<span style="color: #ff870e;">“装备”</span>与<span style="color: #ff870e;">“道具”</span>两种类型，
					装备最多只可购买4件，道具可以无限购买，道具可以在战斗过程中使用掉。</p>
					<p>三、需提前查看所选角色的技能说明。技能多数是<span style="color: #ff870e;">“物理伤害”</span>的技能，买提升攻击力的装备较好，多数是<span style="color: #ff870e;">“魔法伤害”</span>的，买提升法术强度的装备。
					当然也可以买提升生命值和防御力的装备。另外，普通攻击是物理伤害，与攻击力有关</p>
					<view class="know" @click="known">我已了解，之后不需再提示我</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import tallent from '@/components/tallent/index.vue'
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
			bgImg: '../../static/imgs/hero/bg5.jpeg',
			bgImg2: '../../static/imgs/hero/bg5.jpeg',
			heroTX: 'herogj.gif',
			enemyTX: 'herogj.gif',
			showTX: false,
			showTX3: false,
			win: false,
			money: 0,
			xuli: 0,	//武器大师蓄力
			jinbiao: false,
			gameType: null,
			fyS: 1.7,	//敌方对自己护甲穿透，越小伤害越高
			showTInfo: false,
			showIntro: false,
			tallentList: [],
			innerAudioContext: null,
			ygbj: false,	//嫦娥月光标记或战士换枪标记
			yinshen: false,  //自己隐身
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
			showMygjAnm: false,	//我方英雄攻击动画
			showWinLogo: false,
			showWinLogo2: false,
			showlose: false,
		}
	},
	mounted() {
		this.gameType = uni.getStorageSync('gameType')
		if(JSON.parse(uni.getStorageSync('user')).showIntro == 1){
			this.showIntro = true
		}else{
			this.showIntro = false
		}
		// if(this.gameType == 'paiwei'){
		// 	this.money = 6000 + (6 - JSON.parse(uni.getStorageSync('paiweiEnemy')).length)*1000
		// 	if(this.money >= 11000){
		// 		this.money = 11000
		// 	}
		// }
		let userInfo = JSON.parse(uni.getStorageSync('user'))
		this.money = parseInt(userInfo.money)
		this.bgImgIndex = this.reallyRandom(0,2)
		if(this.bgImgIndex == 0){
			this.bgImg = '../../static/imgs/hero/bg5.jpeg'
		}else if(this.bgImgIndex == 1){
			this.bgImg = '../../static/imgs/hero/bg1.jpeg'
		}else if(this.bgImgIndex == 2){
			this.bgImg = '../../static/imgs/hero/bg2.png'
		}
		if(this.gameType == 'wuxian'){
			this.bgImg = '../../static/imgs/wuxianBg.jpg'
			this.bgImg2 = '../../static/imgs/wuxianBg.jpg'
		}
	},
	onLoad(option) {
		if(option){
			this.myHero = JSON.parse(option.item)
			this.enemy = JSON.parse(option.en)
			this.blood1 = this.enemy.blood
			this.gameType = uni.getStorageSync('gameType')
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
			this.begin = true
			this.enemyBeat();
			if(this.second == 0){
				this.timeBg();
			}
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
			let winExp = this.win ? time*5 + 100 + this.randomNum(0,100) : Math.floor(time*3.5)+this.randomNum(50,100)
			let lv = userInfo.lv?userInfo.lv:1
			let exp = userInfo.e?userInfo.e:0
			if(lv>=10){
				winExp = Math.floor(winExp*1.3)
			}
			if(lv>=15){
				winExp = Math.floor(winExp*1.5)
			}
			if(lv>=20){
				winExp = Math.floor(winExp*1.7)
			}
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
					if((datas[idx].allPointer+addPointer) <= 30*500){
						datas[idx].pointer += addPointer
						datas[idx].allPointer += addPointer
					}else{
						datas[idx].pointer = 0
						datas[idx].allPointer = 30*500-1
					}
				}
			})
			uni.setStorageSync('heroAddData',JSON.stringify(datas))
			clearInterval(self.wzhy)
			setTimeout(()=>{
				uni.redirectTo({
					url: "/pages/index/index?isLogin=true"
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
				this.gjTXAnim(3)
				this.fyS = 2
				if(parseInt(this.myHero.fy) > 150 && parseInt(this.myHero.fy) < 180) {
					this.fyS = 1.8
				}
				if(parseInt(this.myHero.fy) >= 180) {
					this.fyS = 1.6
				}
				let h = (parseInt(this.enemy.gj * 3) - parseInt(this.myHero.fy * this.fyS)) * 2
				if(h<0){
					h = 0
				}
				this.shotVal1 = h + this.randomNum(50,parseInt(this.enemy.gj * 1.3))
				this.shotVal1 = parseInt(this.shotVal1)
				//排位赛敌方英雄伤害、技能
				if((this.gameType == 'paiwei' || this.gameType == 'match') && this.enemy.isHero){
					this.shotVal1 = parseInt(parseInt(this.shotVal1)*0.5)
					if(this.enemy.fs >= 50){
						if(this.randomNum(0,2) != 0){
							this.enemyTallent(this.randomNum(1,4))
							return
						}
					}else{
						if(this.randomNum(0,1) == 1){
							this.enemyTallent(this.randomNum(1,4))
							return
						}
					}
				}
				//伤害显示
				this.harm2 = -this.shotVal1
				this.showHarm2 = true
				let t = 800
				if(this.shotVal1 >= 950){
					t = 1500
				}
				setTimeout(()=>{
					this.showHarm2 = false
				},t)
				this.enemyHarm()	//触发事件
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
				this.gjTXAnim(6)
				this.fyS = 2
				if(parseInt(this.myHero.fy) > 150 && parseInt(this.myHero.fy) < 180) {
					this.fyS = 1.8
				}
				if(parseInt(this.myHero.fy) >= 180) {
					this.fyS = 1.6
				}
				this.shotVal1 = (val - parseInt(this.myHero.fy * this.fyS)) * 2
				
				if(parseInt(this.shotVal1) < 50){
					this.shotVal1 = 50 + this.randomNum(0,120)
				}
				this.shotVal1 = parseInt(this.shotVal1)
				//伤害显示
				this.harm2 = -this.shotVal1
				this.showHarm2 = true
				let t = 800
				if(this.shotVal1 >= 950){
					t = 1500
				}
				setTimeout(()=>{
					this.showHarm2 = false
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
				this.gjTXAnim(4,timeOut)
				this.shotVal1 = parseInt(val)
				//伤害显示
				this.harm2 = -this.shotVal1
				this.showHarm2 = true
				setTimeout(()=>{
					this.showHarm2 = false
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
			if(this.myEquipName.includes('荆棘之甲')) {
				let m = parseInt(this.harm2*0.17) - parseInt(this.myHero.fy*0.06)
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
			if(this.enemy.name == '神奇宝贝-小火龙'){
				setTimeout(()=>{
					this.consistEnemyBeat(30,200,1600)
				},3000)
			}
			if(this.enemy.name == '三丽鸥-玉桂狗' || this.enemy.name == '葫芦兄弟'){
				setTimeout(()=>{
					let v = this.randomNum(10,250)
					this.consistEnemyBeat(v,1000,1050)
				},3000)
			}
			if(this.enemy.name == '南宫问天'){
				if(this.randomNum(0,2) == 1 && this.bgImg.indexOf('fb_ngwt') == -1){
					this.bgImg = '../../static/imgs/hero/fb_ngwt.gif?'+ new Date().getTime()
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
			if(this.enemy.name == '哆啦A梦-小夫'){
				if(this.randomNum(0,3) == 1){
					uni.showToast({
						title: '小子！',
						icon:'none',
						duration: 1200
					});
					let val = this.enemy.gj*2.1 - this.myHero.fy*1.5 + this.randomNum(100,300)
					this.enemyBeat2(val)
				}
			}
			if(this.enemy.name == '神奇宝贝-杰尼龟'){
				if(this.randomNum(0,2) == 1){
					uni.showToast({
						title: '俺可不是吃素的！',
						icon:'none',
						duration: 1200
					});
					this.enemy.fy += 50
					setTimeout(()=>{
						this.enemy.fy -= 50
					},2500)
				}
			}
			if(this.enemy.name == '羊村-灰太狼'){
				if(this.bloodVal1 <= 16 && this.bloodVal1 > 2){
					uni.showToast({
						title: '我又回来了！',
						icon:'none',
						duration: 1200
					});
					this.enemyConsistAddBlood(250,500,1500)
				}
			}
			if(this.enemy.name == '猪猪侠-超人强'){
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
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_lq') == -1){
					uni.showToast({
						title: '施主看招！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_lq.gif?'+ new Date().getTime()
					this.backBgImg('fb_lq',3500)
					let val = this.enemy.gj*2.2 - this.myHero.fy*1.5 + this.randomNum(200,700)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},3000)
				}
				if(this.randomNum(0,4) == 0){
					uni.showToast({
						title: '放下屠刀吧！',
						icon:'none',
						duration: 1000
					});
					let v = this.randomNum(100,250)
					this.consistEnemyBeat(v,500,2000)
				}
			}
			if(this.enemy.name == '绝命毒师'){
				setTimeout(()=>{
					let v = this.randomNum(30,90)
					this.consistEnemyBeat(v,500,2000)
				},1000)
			}
			if(this.enemy.name == '杨贵妃'){
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_ygf') == -1){
					this.bgImg = '../../static/imgs/hero/fb_ygf.gif?'+ new Date().getTime()
					this.backBgImg('fb_ygf',2200)
					this.myHero.fy -= 50
					setTimeout(()=>{
						this.myHero.fy += 50
					},3000)
				}
				if(this.randomNum(0,3) == 0 && this.bgImg.indexOf('fb_yyh') == -1){
					uni.showToast({
						title: '汝且听我演奏一曲',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_yyh.gif?'+ new Date().getTime()
					this.backBgImg('fb_yyh',2500)
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 1.2).toFixed(1)
					this.shotDown = true
					this.delayHero(2500)
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
					this.blood1 = parseInt(this.blood1) + 500
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
				}
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_lq') == -1){
					uni.showToast({
						title: '施主看招！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_lq.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_plk') == -1){
					uni.showToast({
						title: '嗯？',
						icon:'none',
						duration: 1000
					});
					this.blood1 = parseInt(this.blood1) + 500
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
				}
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_plk') == -1){
					uni.showToast({
						title: '是谁动了我蛋糕？！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_plk.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_hzw') == -1){
					this.bgImg = '../../static/imgs/hero/fb_hzw2.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_hzw') == -1){
					uni.showToast({
						title: '觉醒！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_hzw1.gif?'+ new Date().getTime()
					this.backBgImg('fb_hzw1',3000)
					this.enemy.gj += 50
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},2000)
					setTimeout(()=>{
						this.enemy.gj -= 50
					},5000)
				}
			}
			
			if((this.myHero.id == 5 || this.myHero.name == '鲲') && this.bloodVal2 <= 33 && this.flag2 == 0){
				if(this.myHero.name == '鲲'){
					this.addBlood(800,0,0)
				}else{
					if(this.myHero.id == 5 && parseInt(this.addData.strongIndex) == 1){
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
				this.flag2 = 1
			}
			if(this.myHero.name == '风神' && this.bloodVal2 < 50 && this.flag2 == 0){
				this.myHero.fy += parseInt(this.myHero.fy)*0.15
				this.flag2 = 1
			}
			
			//副本模式英雄
			if(this.enemy.name == '齐天大圣'){
				if(this.randomNum(0,2) == 1 && this.bgImg.indexOf('fb_qtds') == -1){
					uni.showToast({
						title: '吃俺老孙一棒！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
					this.backBgImg('fb_qtds',3000)
					let val = this.enemy.gj*2.7 - this.myHero.fy*1.5 + this.randomNum(300,800)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},2000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},2200)
				}
			}
			if(this.enemy.name == '葫芦兄弟'){
				if(this.randomNum(0,1) == 1 && this.bgImg.indexOf('fb_hlw') == -1 && this.bloodVal1 <= 50 && this.bloodVal1 > 2){
					uni.showToast({
						title: '兄弟连心！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_hlw.gif?'+ new Date().getTime()
					this.backBgImg('fb_hlw',2200)
					this.enemy.fy = this.enemy.fy + 200
					setTimeout(()=>{
						this.enemy.fy = this.enemy.fy - 200
					},3000)
				}
				if(this.randomNum(0,2) == 1 && this.bgImg.indexOf('fb_hlw') == -1){
					uni.showToast({
						title: '看我排山蹈海！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_hlw2.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,2) == 1 && this.bgImg.indexOf('fb_hml') == -1){
					uni.showToast({
						title: '兄长，吃我一剑！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_hml.gif?'+ new Date().getTime()
					this.backBgImg('fb_hml',4200)
					let val = this.enemy.gj*2.5 - this.myHero.fy*1.5 + this.randomNum(100,700)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1800)
					setTimeout(()=>{
						this.enemyBeat2(val)
						if(this.myHero.fy > 5){
							this.myHero.fy -= 5
						}
					},2000)
				}
			}
			if(this.enemy.name == '血耻鳄鱼'){
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_ey') == -1){
					uni.showToast({
						title: '来吧！伙计',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_ey.gif?'+ new Date().getTime()
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
			}
			if(this.enemy.name == '湫'){
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_chun') == -1){
					this.bgImg = '../../static/imgs/hero/fb_chun.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,3) == 0 && this.bgImg.indexOf('fb_nz') == -1){
					uni.showToast({
						title: '我命由我不由天！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_nz.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,3) == 0 && this.bgImg.indexOf('fb_xw') == -1){
					uni.showToast({
						title: '世界唯我独尊！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_xw.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_sz') == -1){
					uni.showToast({
						title: '恶龙激光波！',
						icon:'none',
						duration: 1000
					});
					this.bgImg = '../../static/imgs/hero/fb_sz.gif?'+ new Date().getTime()
					this.backBgImg('fb_sz',2800)
					let val = this.enemy.gj*2.6 - this.myHero.fy*1.2 + this.randomNum(100,500)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},2300)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},2600)
					setTimeout(()=>{
						let v = 35
						this.consistEnemyBeat(v,150,750)
					},2800)
				}
			}
			if(this.enemy.name == '妖族-奎木狼'){
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_kml') == -1){
					uni.showToast({
						title: '看招',
						icon:'none',
						duration: 1200
					});
					this.bgImg = '../../static/imgs/hero/fb_kml.gif?'+ new Date().getTime()
					this.backBgImg('fb_kml',900)
					setTimeout(()=>{
						this.enemyBeat2(parseInt(this.enemy.gj)*2 - parseInt(this.myHero.fy)+this.randomNum(100,300))
					},300)
				}
			}
			if(this.enemy.name == '妖族-石矶娘娘'){
				if(this.randomNum(0,3) == 1){
					uni.showToast({
						title: '给我灰飞烟灭！',
						icon:'none',
						duration: 1200
					});
					this.blood1 = parseInt(this.blood1) + 300
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						this.enemyBeat2(parseInt(this.enemy.gj)*1.5 - parseInt(this.myHero.fy*0.8)+this.randomNum(150,300))
					},300)
				}
				if(this.bloodVal1 <= 23 && this.bloodVal1 > 2){
					if(this.randomNum(0,1) == 1){
						this.enemyConsistAddBlood(50,100,1800)
						uni.showToast({
							title: '嘿！挺能打的嘛',
							icon:'none',
							duration: 1500
						});
					}
				}
			}
			if(this.enemy.name == '妖族-北海龙王'){
				if(this.bloodVal1 <= 60 && this.bloodVal1 > 2){
					if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_bhlw') == -1){
						uni.showToast({
							title: '眼前是哪位勇士？',
							icon:'none',
							duration: 1200
						});
						this.bgImg = '../../static/imgs/hero/fb_bhlw.gif?'+ new Date().getTime()
						this.backBgImg('fb_bhlw',5300)
						this.delayHero(5300)
						this.enemyConsistAddBlood(90,300,2700)
						this.shotDown = true
						let self = this
						setTimeout(()=>{
							self.enemyBeat2(parseInt(self.enemy.gj)*2.2 - parseInt(self.myHero.fy) + self.randomNum(150,500))
						},5500)
						setTimeout(()=>{
							self.shotDown = false
						},5800)
					}
				}
			}
			if(this.enemy.name == '神-哪吒'){
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_nz2') == -1){
					uni.showToast({
						title: '哪吒在此！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_nz2.gif?'+ new Date().getTime()
					this.backBgImg('fb_nz2',1500)
					this.enemy.gs = this.enemy.gs - 0.3
					setTimeout(()=>{
						this.enemy.gs = this.enemy.gs + 0.3
					},2500)
				}
				if(this.randomNum(0,3) == 0 && this.bgImg.indexOf('fb_nz') == -1){
					uni.showToast({
						title: '我命由我不由天！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_nz.gif?'+ new Date().getTime()
					this.backBgImg('fb_nz',6900)
					this.enemy.gj = this.enemy.gj + 30
					this.enemy.fy = this.enemy.fy + 60
					this.blood1 = parseInt(this.blood1) + 500
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj - 30
						this.enemy.fy = this.enemy.fy - 60
					},5000)
				}
			}
			if(this.enemy.name == '神-韩湘子'){
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_hxz') == -1){
					uni.showToast({
						title: '八仙过海',
						icon:'none',
						duration: 2000
					});
					this.bgImg = '../../static/imgs/hero/fb_hxz.gif?'+ new Date().getTime()
					this.backBgImg('fb_hxz',3200)
					this.delayHero(3000)
				}
			}
			if(this.enemy.name == '神-十万天兵'){
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_swtb') == -1){
					uni.showToast({
						title: '杀！杀！杀！',
						icon:'none',
						duration: 1500
					});
					this.consistEnemyBeat(this.randomNum(20,50),100,1200)
				}
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_swtb') == -1){
					uni.showToast({
						title: '集合！',
						icon:'none',
						duration: 2500
					});
					this.bgImg = '../../static/imgs/hero/fb_swtb.gif?'+ new Date().getTime()
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
				if(this.randomNum(0,4) == 0 && this.bgImg.indexOf('fb_sdtw') == -1){
					uni.showToast({
						title: '持国天王：破！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_sdtw3.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw3',1000)
					let val = this.enemy.gj*2.7 - this.myHero.fy*1.5 + this.randomNum(200,500)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1500)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},1200)
				}
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_sdtw') == -1){
					uni.showToast({
						title: '多闻天王：转！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_sdtw2.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw2',1600)
					this.enemyConsistAddBlood(60,200,1600)
					this.consistEnemyBeat(this.randomNum(20,35),100,1600)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1600)
				}
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_sdtw') == -1){
					uni.showToast({
						title: '增长天王：进！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_sdtw.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw',3500)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},3000)
					this.enemy.gj = this.enemy.gj + 30
					this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) - 0.2).toFixed(2)
					setTimeout(()=>{
						this.enemy.gj = this.enemy.gj - 30
						this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.2).toFixed(2)
					},5500)
				}
				if(this.randomNum(0,4) == 1 && this.bgImg.indexOf('fb_sdtw') == -1){
					uni.showToast({
						title: '广目天王：电！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_sdtw4.gif?'+ new Date().getTime()
					this.backBgImg('fb_sdtw4',1200)
					let val = this.enemy.gj*2.5 - this.myHero.fy*1.5 + this.randomNum(350,1200)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},800)
				}
			}
			if(this.enemy.name == '神-二郎神杨戬'){
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_yj') == -1){
					uni.showToast({
						title: '杨戬在此！谁敢造次',
						icon:'none',
						duration: 2000
					});
					this.bgImg = '../../static/imgs/hero/fb_yj.gif?'+ new Date().getTime()
					this.backBgImg('fb_yj',3000)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},1000)
					setTimeout(()=>{
						this.blood1 = parseInt(this.blood1) + 500
						this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
						this.enemyBeat2(this.randomNum(80,300))
					},3000)
				}
			}
			if(this.enemy.name == '神-齐天大圣'){
				if(this.bloodVal1 <= 33 && this.bloodVal1 > 2){
					this.blood1 = parseInt(this.blood1) + 500
					this.bloodVal1 = Math.round(parseInt(this.blood1) / parseInt(this.enemy.blood) * 100)
					uni.showToast({
						title: '俺老孙是打不死的！',
						icon:'none',
						duration: 1500
					});
				}
				if(this.randomNum(0,3) == 1 && this.bgImg.indexOf('fb_swk') == -1){
					uni.showToast({
						title: '俺老孙来也！',
						icon:'none',
						duration: 1500
					});
					this.bgImg = '../../static/imgs/hero/fb_swk.gif?'+ new Date().getTime()
					this.backBgImg('fb_swk',2000)
					this.enemy.gs = this.enemy.gs - 0.5
					setTimeout(()=>{
						this.enemy.gs = this.enemy.gs + 0.5
					},2000)
				}
				if(this.randomNum(0,2) == 0 && this.bgImg.indexOf('fb_qtds') == -1){
					this.bgImg = '../../static/imgs/hero/fb_qtds.gif?'+ new Date().getTime()
					this.backBgImg('fb_qtds',3000)
					uni.showToast({
						title: '吃俺老孙一棒！',
						icon:'none',
						duration: 1000
					});
					let val = this.enemy.gj*2.3 - this.myHero.fy*1.5 + this.randomNum(200,600)
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},2000)
					setTimeout(()=>{
						this.enemyBeat2(val)
					},2200)
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
		},
		//持续给敌方伤害
		consistBeat(beatVal,time,outTime) {
			clearInterval(this.beatTime)
			this.beatTime = null
			this.gjTXAnim(2,outTime)
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
			if(type != 1){
				this.gjTXAnim(5)
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
			}
			setTimeout(()=>{
				this.showHarm = false
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
			
			if(this.myHero.name == '德玛西亚之力' || this.myHero.id == 1){
				let t1 = null
				//被动
				t1 = setInterval(()=>{
					this.myHero.fy = parseInt(this.myHero.fy) + 1
				},1000)
				setTimeout(()=>{
					clearInterval(t1)
				},2000)
				
				if(num == 1){
					this.cd(4500 - addTalent*150,1)
					this.delayTel(1000,num)
					setTimeout(()=>{
						this.blueComput(70 + addTalent*6,'reduce')
						let val = this.harmComputer(1,addTalent) + 250 + addTalent*30
						this.beat(val)
						//沉默1.5秒
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},1500)
					},1000)
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
						this.beat(val)
						this.blueComput(100 + addTalent*10,'reduce')
					},1000)
				}
				if(num == 2){
					this.cd(5500 - addTalent2*200,2)
					this.delayTel(1000,num)
					setTimeout(()=>{
						let val = parseInt(this.myHero.fs) * (0.5 + addTalent2*0.1) + 50
						this.addBlood(val,500,3000)
						this.blueComput(100 + addTalent2*10,'reduce')
					},1000)
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
						if(parseInt(this.enemy.mk) > 10){
							this.enemy.mk = parseInt(this.enemy.mk) - 6 - addTalent4*2
						}
						let val = (parseInt(this.myHero.fs * (2.5+addTalent4*0.25)) - parseInt(this.enemy.mk)*4*this.pomo)*2 + 600+addTalent4*100
						if(parseInt(this.myHero.fs) >= 250){
							val = val * 0.8
						}
						this.beat(val)
					},3000)
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
					this.delayTel(300,num)
					setTimeout(()=>{
						let val = this.harmComputer(1,addTalent) + addTalent*35
						+ randomVal + this.xuli + 350
						if(strongIndex == 1){
							val = val + 100
						}
						this.beat(val)
						this.blueComput(70 + addTalent*8,'reduce')
						this.xuli = 0
					},300)
				}
				if(num == 2){
					this.cd(6000 - addTalent2*300,2)
					this.delayTel(1300,num)
					setTimeout(()=>{
						this.xuli = parseInt(this.myHero.fs * (2.6 + addTalent2*0.25)) + 250 + addTalent2*35
						this.blueComput(70 + addTalent2*10,'reduce')
					},1300)
				}
				if(num == 3){
					this.cd(8000 - addTalent3*300,3)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.blueComput(100 + addTalent3*15,'reduce')
						this.shotDown = true
						let val = Math.round(this.shotVal1) + Math.round(120 / parseFloat(this.enemy.gs)) + addTalent3*150
						+ parseInt(this.myHero.fs) + parseInt(this.myHero.gj) - parseInt(this.enemy.mk*0.6*this.pomo) - parseInt(this.enemy.fy*(0.6*this.pojia)) + randomVal
						if(val<=0){
							val = randomVal
						}
						setTimeout(()=>{
							this.shotDown = false
							this.beat(val,1)
							if(strongIndex == 2){
								if(parseFloat(this.myHero.v)>=0.6){
									this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.3 + addTalent*0.04)).toFixed(2)
									setTimeout(()=>{
										this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.3 + addTalent*0.04)).toFixed(2)
									},3000)
								}
							}
						},2500 + addTalent3*200)
					},500)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.delayTel(1000,num)
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/wqds.gif?'+ new Date().getTime())
						this.backBgImg('wqds',1500)
						if(strongIndex == 2){
							this.$refs.tallents.tallentShow = true
							this.$refs.tallents.tallentShow2 = true
							this.$refs.tallents.tallentShow3 = true
						}
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
					},1000)
				}
			}
			if(this.myHero.name == '无极剑圣' || this.myHero.id == 4){
				//被动
				this.regGjAdd.gjHarm = parseInt(this.myHero.fs*0.6) + 50
				if(strongIndex == 1){
					this.regGjAdd.addBlood = this.myHero.gj + 100
				}
				if(num == 1){
					this.cd(4500 - addTalent*200,1)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.blueComput(65 + addTalent*8,'reduce')
						let val = this.harmComputer(1,addTalent) + 250 + addTalent*35
						this.beat(val)
						//沉默1.5秒
						this.shotDown = true
						this.yinshen = true
						setTimeout(()=>{
							this.shotDown = false
							this.yinshen = false
						},1500)
					},500)
				}
				if(num == 2){
					this.cd(9500 - addTalent2*250,2)
					this.delayTel(3000,num)
					setTimeout(()=>{
						this.blueComput(80 + addTalent2*10,'reduce')
						let val = parseInt(this.myHero.fs) * 0.5 + 50 + this.randomNum(10,50 + addTalent2*50)
						this.addBlood(val,500,3000)
						this.myHero.fy = parseInt(this.myHero.fy) + 60 + addTalent2*10
						this.cd5 = false
						setTimeout(()=>{
							this.myHero.fy = parseInt(this.myHero.fy) - 60 - addTalent2*10
							this.cd5 = true
						},3000)
					},500)
				}
				if(num == 3){
					this.cd(4000 - addTalent3*200,3)
					this.blueComput(50 + addTalent3*10,'reduce')
					let val = parseInt(this.myHero.gj * 1.2) + this.randomNum(30,200) - parseInt(this.enemy.fy*(1*this.pojia)) + addTalent3*20
					if(val <= 60){
						val = this.randomNum(70,210)
					}
					this.regGjAdd.gjHarm = val
					setTimeout(()=>{
						this.regGjAdd.gjHarm = parseInt(this.myHero.fs*0.6) + 50
					},5000)
				}
				if(num == 4){
					this.cd(9000 - addTalent4*300,4)
					this.delayTel(1000,num)
					setTimeout(()=>{
						this.blueComput(120 + addTalent4*20,'reduce')
						this.heroAnm('../../static/imgs/hero/wjjs.gif?'+ new Date().getTime())
						this.backBgImg('wjjs',5000)
						let val = parseInt(this.myHero.gj * (1.3 + addTalent4*0.2)) - parseInt(this.enemy.fy*(1.5*this.pojia)) + this.randomNum(50,200 + addTalent4*20)
						if(val <= 60){
							val = this.randomNum(70,210)
						}
						this.consistBeat(val,500,3000)
					},1000)
				}
			}
			if(this.myHero.name == '广寒仙子-嫦娥' || this.myHero.id == 5){
				
				if(num == 1){
					this.cd(3600 - addTalent*250,1)
					this.delayTel(1000,num)
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
					setTimeout(()=>{
						let addVal = 0
						if(this.ygbj){
							addVal = parseInt(this.myHero.fs)
							this.cd(2500 - addTalent3*250,3)
						}else{
							this.cd(6500 - addTalent3*300,3)
						}
						this.blueComput(100 + addTalent3*20,'reduce')
						let val = this.harmComputer(2,addTalent3) + 350 + addVal + addTalent3*35
						if(strongIndex == 1){
							val = this.harmComputer(2,addTalent3) + 550 + addVal*1.3 + addTalent3*50
						}
						if(val < 150){
							val = 150
						}
						this.beat(val)
						this.ygbj = false
					},500)
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
					},1500)
				}
			}
			if(this.myHero.name == '鲲' || this.myHero.id == 6){
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
					setTimeout(()=>{
						this.blueComput(80 + addTalent2*10,'reduce')
						let val = parseInt(this.myHero.gj * (1.3 + addTalent2*0.2)) - parseInt(this.enemy.fy*1.2) + this.randomNum(80,120 + addTalent2*20)
						if(val < 50){
							val = this.randomNum(50,100)
						}
						this.consistBeat(val,500,3000)
					},1200)
				}
				if(num == 3){
					this.cd(2500 - addTalent3*150,3)
					this.delayTel(800,num)
					setTimeout(()=>{
						this.blueComput(35 + addTalent3*8,'reduce')
						let val = this.harmComputer(2,addTalent3) + 250 + addTalent3*70
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.beat(val)
					},800)
				}
				if(num == 4){
					this.cd(11000 - addTalent4*500,4)
					this.delayTel(2000,num)
					this.blueComput(180 + addTalent4*30,'reduce')
					this.heroAnm('../../static/imgs/hero/jthl.gif?'+ new Date().getTime())
					this.backBgImg('jthl',6000)
					//沉默4秒
					this.shotDown = true
					setTimeout(()=>{
						this.shotDown = false
					},4000 + addTalent4*250)
					setTimeout(()=>{
						let val = (parseInt(this.myHero.fs)*(2.6 + addTalent4*0.3) - parseInt(this.enemy.mk*4*this.pomo))*2 + 550 + addTalent4*100
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.beat(val)
					},3000)
				}
			}
			
			if(this.myHero.name == '精英战士' || this.myHero.id == 7){
				if(num == 1){
					//狙击枪
					if(this.ygbj){
						this.cd(4500 - addTalent*250,1)
						this.delayTel(1000,num)
						setTimeout(()=>{
							this.blueComput(50 + addTalent*8,'reduce')
							this.heroAnm('../../static/imgs/hero/jyzs3.gif?'+ new Date().getTime())
							this.backBgImg('jyzs3',2200)
							//33%几率没有命中
							if(this.reallyRandom(0,2) != 0){
								setTimeout(()=>{
									let val = this.harmComputer(1,addTalent) + 350 + this.randomNum(0,500 + addTalent*50)
									this.beat(val)
								},1500)
							}
						},1000)
					}else{	//步枪
						this.cd(5000 - addTalent*250,1)
						this.blueComput(70 + addTalent*10,'reduce')
						this.heroAnm('../../static/imgs/hero/jyzs1.gif?'+ new Date().getTime())
						this.backBgImg('jyzs1',1500)
						//25%几率没有命中
						let time = setInterval(()=>{
							if(this.randomNum(0,3) != 0){
								let val = parseInt(this.myHero.gj*(0.6 + addTalent*0.1)) - parseInt(this.enemy.fy*(1.8*this.pojia)) + this.randomNum(20,70+addTalent*20)
								this.beat(val)
							}
							setTimeout(()=>{
								clearInterval(time)
							},1500)
						},150)
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
						this.enemy.gs = (parseFloat(this.enemy.gs) + 0.4 + addTalent2*0.1).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = (parseFloat(this.enemy.gs) - 0.4 - addTalent2*0.1).toFixed(2)
						},5000)
					}
					this.delayTel(1000,num)
				}
				if(num == 3){
					this.cd(1000,3)
					this.addBlood(100,0,0)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.ygbj = !this.ygbj
					},500)
				}
				if(num == 4){
					this.cd(7500 - addTalent4*300,4)
					if(this.reallyRandom(0,2) != 0){
						setTimeout(()=>{
							let val = (parseInt(this.myHero.gj * (2.5+addTalent4*0.25)) - parseInt(this.enemy.fy*4*this.pojia))*2 + 350 +
							this.randomNum(200,500+addTalent4*100)
							this.beat(val)
						},1000)
						setTimeout(()=>{
							let val = parseInt(this.myHero.gj) - parseInt(this.enemy.fy*this.pojia) + 200 +
							this.randomNum(100,300+addTalent4*100)
							this.beat(val)
						},3500)
					}else{
						setTimeout(()=>{
							let val = (parseInt(this.myHero.gj * (2.5+addTalent*0.25) - parseInt(this.enemy.fy*(4*this.pojia)))*2 + 550+addTalent4*100)
							this.beat(val)
						},1000)
					}
					this.heroAnm('../../static/imgs/hero/jyzs2.gif?'+ new Date().getTime())
					this.backBgImg('jyzs2',5000)
					this.delayTel(1700,num)
					this.blueComput(100,'reduce')
				}
			}
			if(this.myHero.name == '风神' || this.myHero.id == 8){
				if(num == 1){
					this.cd(3500 - addTalent*300,1)
					this.delayTel(300,num)
					this.blueComput(35+addTalent*8,'reduce')
					this.heroAnm('../../static/imgs/hero/fengs1.gif?'+ new Date().getTime())
					this.backBgImg('fengs1',600)
					if(parseInt(this.enemy.mk) > 60){
						this.enemy.mk = parseInt(this.enemy.mk) - (7 + 2*addTalent)
					}
					let val = this.harmComputer(2,addTalent) + (300+addTalent*50)
					this.beat(val)
				}
				if(num == 2){
					this.cd(6500 - addTalent2*200,2)
					this.delayTel(1500,num)
					setTimeout(()=>{
						this.blueComput(80+addTalent2*8,'reduce')
						//沉默n秒
						this.shotDown = true
						setTimeout(()=>{
							this.shotDown = false
						},(2000+addTalent2*250))
					},1500)
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
				if(num == 1){
					this.cd(6200 - addTalent*150,1)
					this.delayTel(1600,num)
					setTimeout(()=>{
						this.blueComput(70 + addTalent*10,'reduce')
						let val = this.harmComputer(1,addTalent) + 250+addTalent*50
						if(this.reallyRandom(0,1) == 1){
							val = (parseInt(this.myHero.gj * (2.8+addTalent*0.2)) - parseInt(this.enemy.fy*4*this.pojia))*2 + 450+addTalent*50
							this.addBlood(parseInt(val*0.5),0,0)
						}
						if(this.xuli < 4){
							this.xuli += 1
						}
						this.beat(val)
					},1600)
				}
				if(num == 2){
					this.cd(3800 - addTalent2*150,2)
					this.delayTel(600,num)
					this.blueComput(35 + addTalent2*10,'reduce')
					setTimeout(()=>{
						let val = parseInt(this.myHero.gj * (2+addTalent2*0.2)) - parseInt(this.enemy.fy*2.5*this.pojia) + 200+addTalent2*50
						//被动
						this.consistBeat(this.randomNum(20,60),500,2000)
						if(this.xuli < 4){
							this.xuli += 1
						}
						this.beat(val)
					},600)
				}
				if(num == 3){
					this.cd(6000 - addTalent3*150,3)
					this.delayTel(500,num)
					setTimeout(()=>{
						this.blueComput(50 + addTalent3*10,'reduce')
						this.enemy.fy = Math.floor(this.enemy.fy*(0.85-addTalent3*0.1))
					},500)
					setTimeout(()=>{
						this.enemy.fy = Math.floor(this.enemy.fy/(0.85-addTalent3*0.1))
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
				if(num == 1){
					this.delayTel(500,num)
					setTimeout(()=>{
						this.cd(4000 - addTalent*250,1)
						this.blueComput(35 + addTalent*6,'reduce')
							let val = this.harmComputer(1,addTalent) + 250 + addTalent*50
							if(this.xuli >= 1){
								this.xuli = 0
								val += this.randomNum(this.myHero.gj*1.5,this.myHero.gj*2.5)
							}
							this.beat(val)
							if(parseFloat(this.myHero.v)>0.5){
								this.myHero.v = parseFloat(parseFloat(this.myHero.v) - (0.2 + addTalent*0.04)).toFixed(2)
								setTimeout(()=>{
									this.myHero.v = parseFloat(parseFloat(this.myHero.v) + (0.2 + addTalent*0.04)).toFixed(2)
								},6000)
							}
					},500)
				}
				if(num == 2){
					this.cd(6500 - addTalent2*150,2)
					this.delayTel(500,num)
					this.blueComput(35 + addTalent2*6,'reduce')
					setTimeout(()=>{
						let val = parseInt(this.myHero.fs * (2+addTalent2*0.2)) - parseInt(this.enemy.mk*2.5*this.pomo) + 250 + addTalent2*50
						this.xuli = 1
						this.beat(val)
					},500)
				}
				if(num == 3){
					this.cd(7000 - addTalent3*150,3)
					this.delayTel(800,num)
					this.heroAnm('../../static/imgs/hero/ez1.gif?'+ new Date().getTime())
					this.backBgImg('ez1',1000)
					let self = this
					setTimeout(()=>{
						self.blueComput(80 + addTalent3*10,'reduce')
						self.shotDown = true
						let val = self.harmComputer(1,addTalent3) + addTalent3*70
						if(self.xuli >= 1){
							self.xuli = 0
							val += self.randomNum(self.myHero.gj*1.5,self.myHero.gj*2.5)
						}
						self.beat(val)
						setTimeout(()=>{
							self.shotDown = false
						},1500 + addTalent3*120)
					},800)
				}
				if(num == 4){
					this.cd(10000 - addTalent4*200,4)
					this.delayTel(1500,num)
					this.blueComput(100 + addTalent4*15,'reduce')
					this.heroAnm('../../static/imgs/hero/ez2.gif?'+ new Date().getTime())
					this.backBgImg('ez2',2200)
					setTimeout(()=>{
						let val = (parseInt(this.myHero.gj * (2.7+addTalent4*0.25)) + this.myHero.fs * (2.3+addTalent4*0.25)
						 - parseInt(this.enemy.fy*2.5*this.pojia) - parseInt(this.enemy.mk*2.5*this.pomo))*2 + 550 + addTalent4*100
						this.beat(val)
					},1500)
				}
			}
			if(this.myHero.name == '齐天大圣' || this.myHero.id == 101){
				if(num == 1){
					this.delayTel(2900,num)
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
					let val = this.harmComputer(1,addTalent) + 450 + addTalent*60
					setTimeout(()=>{
						this.beat(val)
					},2200)
					this.enemy.fy = parseInt(this.enemy.fy - this.enemy.fy*0.2)
					setTimeout(()=>{
						this.enemy.fy = parseInt(this.enemy.fy + this.enemy.fy*0.2)
					},3000 + addTalent*200)
				}
				if(num == 2){
					this.cd(9500 - addTalent2*150,2)
					this.delayTel(300,num)
					this.blueComput(60 + addTalent2*6,'reduce')
					this.heroAnm('../../static/imgs/hero/swk2.gif?'+ new Date().getTime())
					this.backBgImg('swk2',1200)
					setTimeout(()=>{
						//沉默3秒
						this.shotDown = true
						this.yinshen = true
						setTimeout(()=>{
							this.shotDown = false
							this.yinshen = false
						},3000 + addTalent2*120)
					},300)
				}
				if(num == 3){
					this.cd(7000 - addTalent3*150,3)
					this.delayTel(1000,num)
					this.heroAnm('../../static/imgs/hero/swk3.gif?'+ new Date().getTime())
					this.backBgImg('swk3',4000)
					this.blueComput(80 + addTalent3*10,'reduce')
					this.myHero.v = parseFloat(parseFloat(this.myHero.v) - 0.3).toFixed(2)
					//沉默1.2秒
					this.shotDown = true
					this.yinshen = false
					setTimeout(()=>{
						this.shotDown = false
					},1200)
					//攻速恢复
					setTimeout(()=>{
						this.myHero.v = parseFloat(parseFloat(this.myHero.v) + 0.3).toFixed(2)
					},3000+addTalent3*250)
					let val = this.harmComputer(1,addTalent3) + 300 + addTalent3*60
					if(this.yinshen){
						val += parseInt(this.myHero.gj*1.2)
						this.shotDown = false
					}
					setTimeout(()=>{
						this.beat(val)
					},3500)
				}
				if(num == 4){
					this.cd(11000 - addTalent4*200,4)
					this.blueComput(120 + addTalent4*15,'reduce')
					this.delayTel(5000,num)
					this.heroAnm('../../static/imgs/hero/swk4.gif?'+ new Date().getTime())
					this.backBgImg('swk4',5300)
					this.cd5 = false
					this.myHero.fy = parseInt(this.myHero.fy + this.myHero.fy*0.5)
					setTimeout(()=>{
						this.myHero.fy = parseInt(this.myHero.fy - this.myHero.fy*0.5)
						this.cd5 = true
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
					this.beat(val)
				}
				if(num == 2){
					this.delayTel(150,num)
					this.cd(8500 - addTalent2*250,2)
					this.blueComput(30 + addTalent2*5,'reduce')
					this.heroAnm('../../static/imgs/hero/jie.gif?'+ new Date().getTime())
					this.backBgImg('jie',2500)
					this.xuli += 1
					setTimeout(()=>{
						this.xuli -= 1
					},3000+addTalent2*200)
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
					this.delayTel(500,num)
					this.cd(12000 - addTalent4*250,4)
					this.blueComput(100 + addTalent4*10,'reduce')
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie2.gif?'+ new Date().getTime())
						this.backBgImg('jie2',1500)
					},1000)
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie3.gif?'+ new Date().getTime())
						this.backBgImg('jie3',1500)
					},2500)
					this.xuli += 1
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
						let val = (parseInt(this.myHero.gj * (2.6+addTalent4*0.25)) - parseInt(this.enemy.fy*4*this.pojia))*2
						 + 550 + cval + aval + addTalent4*100
						this.beat(val)
					},3300)
					setTimeout(()=>{
						this.xuli -= 1
					},5000+addTalent4*300)
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
					this.blueComput(65 + addTalent*10,'reduce')
					this.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime())
					this.backBgImg('yll1',3500)
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
					this.delayTel(200,num)
					this.blueComput(60 + addTalent3*6,'reduce')
					let self = this
					setTimeout(()=>{
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
					},200)
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
					let val = this.harmComputer(2,addTalent) + 250 + addTalent*50
					let self = this
					setTimeout(()=>{
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
					this.cd(6000 - addTalent4*200,4)
					this.delayTel(1000,num)
					this.blueComput(75 + addTalent4*10,'reduce')
					this.heroAnm('../../static/imgs/hero/timo4.gif?'+ new Date().getTime())
					this.backBgImg('timo4',1000)
					let val = parseInt(this.myHero.fs * (1.8 + addTalent4*0.1)) - parseInt(this.enemy.mk*2) + 150 + addTalent4*50
					let self = this
					setTimeout(()=>{
						//50%~70%概率产生伤害
						if(addTalent4 > 2){
							if(self.reallyRandom(0,2) != 0){
								let t = setInterval(()=>{
									if(val < 50){
										val = self.randomNum(120,200)
									}
									self.beat(val)
								},500)
								setTimeout(()=>{
									clearInterval(t)
								},1550)
							}
						}else{
							if(self.reallyRandom(0,1) == 1){
								let t = setInterval(()=>{
									if(val < 50){
										val = self.randomNum(120,200)
									}
									self.beat(val)
								},500)
								setTimeout(()=>{
									clearInterval(t)
								},1550)
							}
						}
					},3500)
					
				}
			}
		},
		//恢复背景图
		backBgImg(name,time) {
			setTimeout(()=>{
				if(this.bgImg.indexOf(name) != -1){
					if(this.bgImgIndex == 0){
						this.bgImg = '../../static/imgs/hero/bg5.jpeg'
					}else if(this.bgImgIndex == 1){
						this.bgImg = '../../static/imgs/hero/bg1.jpeg'
					}else if(this.bgImgIndex == 2){
						this.bgImg = '../../static/imgs/hero/bg2.png'
					}
				}
				if(name.indexOf('fb_') == -1){
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
			this.gjTXAnim(1)
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
			if(time == 0 && timeOut == 0){
				this.blood2 = parseInt(this.blood2) + val
				if(parseInt(this.myHero.blood) < parseInt(this.blood2)){
					this.blood2 = this.myHero.blood
				}
				this.bloodVal2 = Math.round(parseInt(this.blood2) / parseInt(this.myHero.blood) * 100)
				//显示
				this.harm2 = val
				this.showHarm2 = true
				setTimeout(()=>{
					this.showHarm2 = false
				},1000)
			}else{
				let t = null
				t = setInterval(()=>{
					this.blood2 = parseInt(this.blood2) + val
					//显示
					this.harm2 = val
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
			let has1 = false	//冰晶节杖
			let bloodsEq = 0	//装备总加血量
			let flzEq = 0	//装备总加法力值
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
				if(item.name == '赛瑞尔达的怨恨') {
					this.pojia -= 0.3
				}
				if(item.name == '幽梦之灵') {
					this.pojia -= 0.1
				}
				if(item.name == '虚空之杖') {
					this.pomo -= 0.3
				}
				if(item.name == '纳什之牙') {
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.fs*1.8)
				}
				if(item.name == '鬼索的狂暴之刃') {
					this.regGjAdd.gjHarm = parseInt(this.regGjAdd.gjHarm) + parseInt(this.myHero.gj*0.5) + parseInt(this.myHero.fs*0.5)
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
				if(item.name == '冰晶节杖') {
					if(!has1){
						this.enemy.gs = (parseFloat(this.enemy.gs) + 0.2).toFixed(2)
						has1 = true
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
				}
				if(item.name == '飓风王者之弓' && this.myHero.details == '射手') {
					this.myHero.gj = parseInt(this.myHero.gj) + 20
					this.myHero.bj = parseInt(this.myHero.bj) + 0.2
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
				setTimeout(()=>{
					this.shotDown = false
				},3500)
			}
			if(name == '卢登的配枪') {
				let m = this.myHero.fs*1.6 + this.randomNum(100,250)
				this.beat(m)
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
			uni.showModal({
				title: title,
				content: text,
				showCancel: false,
				success: function (res) {
					if (res.confirm) {}
				}
			});
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
			this.showTX = false
			this.showTX3 = false
			if(this.gameType != 'jinbiao'){
				this.showWinLogo = true
				setTimeout(()=>{
					this.showWinLogo = false
				},2500)
			}else{
				uni.showToast({
					title: '恭喜你战胜敌方英雄！',
					icon:'none',
					duration: 2500
				});
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
					uni.redirectTo({
						url: "/pages/paiwei/index?beatEnemy="+this.enemy.name+'&heroBlood='+parseInt(this.blood2)+'&hero='+this.myHero.name+'&time='+time
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
			this.addLog(0)
			this.showTX = false
			this.showTX3 = false
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
					uni.redirectTo({
						url: "/pages/paiwei/index?beatHero="+this.myHero.name+'&enemyBlood='+parseInt(this.blood1)+'&enemy='+this.enemy.name+'&time='+time
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
		playVoice(url) {
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.volume = 0.25
			this.innerAudioContext.src = url
			this.innerAudioContext.autoplay = true;
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
				self.blood1 = parseInt(self.blood1) + val
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
		//英雄被沉默，且有背景动画
		delayHero(time) {
			this.bgZIndex = 11
			this.delayTel(time,0)
			setTimeout(()=>{
				this.bgZIndex = 1
			},time)
		},
		heroAnm(url) {
			if(this.bgImg.indexOf('fb_') != -1){
				this.showMygjAnm = true
				this.mygjAnm = url
			}else{
				this.bgImg = url
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
				val = (parseInt(this.myHero.gj * (2.5+addTalent*0.2)) - parseInt(this.enemy.fy*4*this.pojia))*2
			}
			//法术
			if(type == 2){
				val = (parseInt(this.myHero.fs * (2.5 + addTalent*0.2)) - parseInt(this.enemy.mk*4*this.pomo))*2
			}
			//敌方英雄
			if(type == 3){
				val = (parseInt(this.enemy.gj * 2.5) - parseInt(this.myHero.fy*2.5))*2 + 100
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
			if(this.enemy.name == '德玛西亚之力'){
				let t1 = null
				//被动
				t1 = setInterval(()=>{
					this.enemy.fy = parseInt(this.enemy.fy) + 1
				},1000)
				setTimeout(()=>{
					clearInterval(t1)
				},2000)
				
				if(num == 1){
					let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj * 1.3)
					this.enemyBeat2(val)
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
					//沉默1.5秒
					this.delayTel(1500,0)
				}
				if(num == 2){
						this.enemy.fy = parseInt(this.enemy.fy) + 100
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 100
						},2200)
				}
				if(num == 3){
					let val = parseInt(this.enemy.gj * 1.2) - parseInt(this.myHero.fy*1.2) + 35
					this.consistEnemyBeat(val,200,2200)
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/dmxyzy.gif?'+ new Date().getTime())
					this.backBgImg('dmxyzy',3000)
					let cval = 0
					//敌方生命值小于30%
					if(parseInt(this.blood2)/parseInt(this.myHero.blood) <= 0.33){
						cval = parseInt(this.enemy.gj * 3) + 700 - parseInt(this.myHero.fy*2.2)
					}
					let val = (parseInt(this.enemy.gj * 3.3) - parseInt(this.myHero.fy*2.2))*2 + 700 + cval
					this.enemyBeat2(val)
				}
			}
			if(this.enemy.name == 'GG Bond') {
				if(num == 1){
					let val = this.harmComputer(3) + 300 + parseInt(this.enemy.gj*1.3)
					this.enemyBeat2(val)
				}
				if(num == 2){
					let val = parseInt(this.enemy.gj) * 0.5 + 50
					this.enemyConsistAddBlood(val,500,3000)
				}
				if(num == 3){
						this.heroAnm('../../static/imgs/hero/cjbbt.gif?'+ new Date().getTime())
						this.backBgImg('cjbbt',6000)
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
					this.heroAnm('../../static/imgs/hero/xlsbz.gif?'+ new Date().getTime())
					this.backBgImg('xlsbz',5500)
					setTimeout(()=>{
						if(parseInt(this.myHero.fy) > 10){
							this.myHero.fy = parseInt(this.myHero.fy) - 8
						}
						let val = (parseInt(this.enemy.gj * 3.3) - parseInt(this.myHero.fy*2.5))*2 + 600
						this.enemyBeat2(val)
					},3000)
				}
			}
			if(this.enemy.name == '少林武僧') {
				let randomVal = this.randomNum(50,250)
				if(num == 1){
					setTimeout(()=>{
						let val = this.harmComputer(3)
						+ randomVal + 350 
						this.enemyBeat2(val)
					},300)
				}
				if(num == 2){
					let val = parseInt(this.enemy.gj * 2) + 250
					this.enemyBeat2(val)
				}
				if(num == 3){
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
				if(num == 4){
						this.heroAnm('../../static/imgs/hero/wqds.gif?'+ new Date().getTime())
						this.backBgImg('wqds',1500)
						this.enemy.fy = parseInt(this.enemy.fy) + 30
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 30
						},5000)
						let val =  parseInt(this.enemy.gj * 2.7)
						 - parseInt(this.myHero.fy*2) + 500 + randomVal
						setTimeout(()=>{
							this.enemyBeat2(val)
						},1000)
				}
			}
			if(this.enemy.name == '无极剑圣'){
				if(num == 1){
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
				if(num == 2){
						let val = parseInt(this.enemy.gj) * 0.5 + 20 + this.randomNum(10,50)
						this.enemyConsistAddBlood(val,500,3000)
						this.enemy.fy = parseInt(this.enemy.fy) + 60
						this.shotDown = true
						setTimeout(()=>{
							this.enemy.fy = parseInt(this.enemy.fy) - 60
							this.shotDown = false
						},3000)
				}
				if(num == 3){
					if(this.enemy.gs >= 0.7){
						this.enemy.gs = (parseFloat(this.enemy.gs) - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = (parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},3500)
					}
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/wjjs.gif?'+ new Date().getTime())
					this.backBgImg('wjjs',5000)
					let val = parseInt(this.enemy.gj * 1.5) - parseInt(this.myHero.fy*1.5) + this.randomNum(50,200)
					if(val <= 60){
						val = this.randomNum(70,170)
					}
					this.consistEnemyBeat(val,500,3000)
				}
			}
			if(this.enemy.name == '广寒仙子-嫦娥'){
				if(num == 1){
						this.ygbj = true
						let val = this.harmComputer(3) + 250
						this.enemyBeat2(val)
				}
				if(num == 2){
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
				if(num == 3){
						let addVal = 0
						if(this.ygbj){
							addVal = parseInt(this.enemy.gj)
						}
						let val = this.harmComputer(3) + 350 + addVal
						if(val < 150){
							val = 150
						}
						this.enemyBeat2(val)
						this.ygbj = false
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/cer.gif?'+ new Date().getTime())
					this.backBgImg('cer',3600)
					setTimeout(()=>{
						let val = Math.ceil(parseInt(this.enemy.gj)*1.5) + 500 + this.randomNum(0,250)
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
			if(this.enemy.name == '鲲'){
				if(num == 1){
						this.myHero.gj = parseInt(this.myHero.gj) - Math.ceil(parseInt(this.myHero.gj) * 0.4)
						this.myHero.fs = parseInt(this.myHero.fs) - Math.ceil(parseInt(this.myHero.fs) * 0.4)
						setTimeout(()=>{
							this.myHero.gj = parseInt(this.myHero.gj) + Math.ceil(parseInt(this.myHero.gj) * 0.4)
							this.myHero.fs = parseInt(this.myHero.fs) + Math.ceil(parseInt(this.myHero.fs) * 0.4)
						},2000)
				}
				if(num == 2){
					setTimeout(()=>{
						let val = parseInt(this.enemy.gj *1.3) - parseInt(this.myHero.fy*1.2) +this.randomNum(80,120)
						if(val < 50){
							val = this.randomNum(50,100)
						}
						this.consistEnemyBeat(val,500,3000)
					},1200)
				}
				if(num == 3){
						let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj *1.3)
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.enemyBeat2(val)
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/jthl.gif?'+ new Date().getTime())
					this.backBgImg('jthl',6000)
					uni.showToast({
						title: '你被禁止释放技能',
						icon:'none',
						duration: 1200
					});
					//沉默3秒
					this.delayTel(3000,0)
					setTimeout(()=>{
						let val = (parseInt(this.enemy.gj)*2.6 - parseInt(this.myHero.fy*2.5))*2 + 550
						if(val < 50){
							val = this.randomNum(100,300)
						}
						this.enemyBeat2(val)
					},2500)
				}
			}
			
			if(this.enemy.name == '精英战士'){
				if(num == 1){
					//狙击枪
					this.heroAnm('../../static/imgs/hero/jyzs3.gif?'+ new Date().getTime())
					this.backBgImg('jyzs3',2200)
					//33%几率没有命中
					if(this.reallyRandom(0,2) != 0){
						setTimeout(()=>{
							let val = this.harmComputer(3) + 350 + this.randomNum(0,500)
							this.enemyBeat2(val)
						},1500)
					}
				}
				if(num == 2 || num == 3){
					//手榴弹
						let val = this.harmComputer(3) + 250 + this.randomNum(250,250+this.enemy.gj*3)
						setTimeout(()=>{
							this.enemyBeat2(val)
						},4000)
				}
				if(num == 4){
					if(this.reallyRandom(0,2) != 0){
						setTimeout(()=>{
							let val = (parseInt(this.enemy.gj * 2.5) - parseInt(this.myHero.fy*2.5))*2 + 350 +
							this.randomNum(200,500)
							this.enemyBeat2(val)
						},1000)
						setTimeout(()=>{
							let val = parseInt(this.enemy.gj) - parseInt(this.myHero.fy) + 200 +
							this.randomNum(100,300)
							this.enemyBeat2(val)
						},3500)
					}else{
						setTimeout(()=>{
							let val = (parseInt(this.enemy.gj *2.5) - parseInt(this.myHero.fy*2.5))*2 + 550
							this.enemyBeat2(val)
						},1000)
					}
					this.heroAnm('../../static/imgs/hero/jyzs2.gif?'+ new Date().getTime())
					this.backBgImg('jyzs2',5000)
				}
			}
			if(this.enemy.name == '风神'){
				if(num == 1){
						this.heroAnm('../../static/imgs/hero/fengs1.gif?'+ new Date().getTime())
						this.backBgImg('fengs1',600)
						if(parseInt(this.myHero.fy) > 60){
							this.myHero.fy = parseInt(this.myHero.fy) - 10
						}
						let val = this.harmComputer(3) + parseInt(this.enemy.gj*1.5) + 300
						this.enemyBeat2(val)
				}
				if(num == 2){
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 1200
						});
						//沉默2秒
						this.delayTel(2000,0)
				}
				if(num == 3){
						this.enemy.gj = Math.ceil(parseInt(this.enemy.gj) + parseInt(this.enemy.gj)*0.3 + 50)
						setTimeout(()=>{
							this.enemy.gj = parseInt(this.enemy.gj) - 50
							this.enemy.gj = Math.ceil(parseInt(this.enemy.gj) - parseInt(this.enemy.gj)*0.25)
						},3000)
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/fengs2.gif?'+ new Date().getTime())
					this.backBgImg('fengs2',3000)
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
			if(this.enemy.name == '诺克萨斯之手'){
				if(num == 1){
					setTimeout(()=>{
						let val = this.harmComputer(3) + 300
						if(this.randomNum(0,1) == 1){
							val = (parseInt(this.enemy.gj * 3) - parseInt(this.myHero.fy*2.5))*2 + 450
							this.enemyConsistAddBlood(parseInt(val*0.6),50,60)
						}
						this.enemyBeat2(val)
					},1600)
				}
				if(num == 2){
						let val = parseInt(this.enemy.gj * 2.2) - parseInt(this.myHero.fy*2) + 200
						//被动
						this.consistEnemyBeat(this.randomNum(20,60),500,2000)
						this.enemyBeat2(val)
				}
				if(num == 3){
					this.myHero.fy = Math.floor(this.myHero.fy*0.8)
					setTimeout(()=>{
						this.myHero.fy = Math.floor(this.myHero.fy/0.8)
					},2500)
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/dtt.gif?'+ new Date().getTime())
					this.backBgImg('dtt',2200)
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
			if(this.enemy.name == '探险家'){
				if(num == 1){
					let val = this.harmComputer(3) + 250 + parseInt(this.enemy.gj * 1.3)
					this.enemyBeat2(val)
					if(parseFloat(this.enemy.gs)>0.5){
						this.enemy.gs = parseFloat(this.enemy.gs - 0.2).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.2).toFixed(2)
						},5000)
					}
				}
				if(num == 2){
					let val = parseInt(this.enemy.gj *2.5) - parseInt(this.myHero.fy*2.5) + 250
					this.enemyBeat2(val)
				}
				if(num == 3){
					this.heroAnm('../../static/imgs/hero/ez1.gif?'+ new Date().getTime())
					this.backBgImg('ez1',1000)
					let self = this
					setTimeout(()=>{
						uni.showToast({
							title: '你被禁止释放技能',
							icon:'none',
							duration: 1200
						});
						self.delayTel(1000,0)
						self.enemy.gs = parseFloat(parseFloat(self.enemy.gs) - 0.2).toFixed(1)
						setTimeout(()=>{
							self.enemy.gs = parseFloat(parseFloat(self.enemy.gs) + 0.2).toFixed(1)
						},2500)
						let val = self.harmComputer(3) + 200
						self.enemyBeat2(val)
					},800)
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/ez2.gif?'+ new Date().getTime())
					this.backBgImg('ez2',2200)
					setTimeout(()=>{
						let val = (parseInt(this.enemy.gj * 3.3) - parseInt(this.myHero.fy*2.5))*2 + 550
						this.enemyBeat2(val)
					},1500)
				}
			}
			if(this.enemy.name == '影流之主'){
				if(num == 1 || num == 2){
					let val = this.harmComputer(3) + 300 + parseInt(this.enemy.gj * 1.3)
					let cval = parseInt(val*0.6)
						val = val + cval
					this.enemyBeat2(val)
				}
				if(num == 3){
					let h = (parseInt(this.enemy.gj * 2.3) - parseInt(this.myHero.fy*2))*2
					if(h<0){
						h = 0
					}
					let val = h + 250
					let cval = parseInt(val*0.6)
						val = val + cval
					this.enemyBeat2(val)
				}
				if(num == 4){
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie2.gif?'+ new Date().getTime())
						this.backBgImg('jie2',1500)
					},1000)
					setTimeout(()=>{
						this.heroAnm('../../static/imgs/hero/jie3.gif?'+ new Date().getTime())
						this.backBgImg('jie3',1500)
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
			if(this.enemy.name == '玉玲珑'){
				if(num == 1){
					this.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime())
					this.backBgImg('yll1',3500)
						let val = parseInt(this.enemy.gj *1.8) - parseInt(this.myHero.fy*1.2) + this.randomNum(30,90)
						if(val < 50){
							val = this.randomNum(30,100)
						}
						this.consistEnemyBeat(val,500,3500)
				}
				if(num == 2){
					this.heroAnm('../../static/imgs/hero/yll2.gif?'+ new Date().getTime())
					this.backBgImg('yll2',1500)
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
				if(num == 3){
					let self = this
						let val = self.harmComputer(3) + 200
						self.enemyBeat2(val)
						setTimeout(()=>{
							self.enemyConsistAddBlood(parseInt(self.enemy.gj*1.2),100,150)
						},500)
						//敌方生命值小于40%
						if(parseInt(self.blood2)/parseInt(self.myHero.blood) <= 0.4){
							self.heroAnm('../../static/imgs/hero/yll1.gif?'+ new Date().getTime())
							self.backBgImg('yll1',3500)
							let val = parseInt(self.enemy.gj *1.6) - parseInt(self.myHero.fy*1.2) + self.randomNum(30,90)
							if(val < 50){
								val = self.randomNum(30,100)
							}
							self.consistEnemyBeat(val,500,3500)
						}
				}
				if(num == 4){
					let self = this
					self.heroAnm('../../static/imgs/hero/yll4.gif?'+ new Date().getTime())
					self.backBgImg('yll4',2500)
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
			if(this.enemy.name == '迅捷斥候'){
				if(num == 1 || num == 3){
					this.heroAnm('../../static/imgs/hero/timo1.gif?'+ new Date().getTime())
					this.backBgImg('timo1',2000)
					let val = this.harmComputer(3) + 200 + parseInt(this.enemy.gj*1.2)
					let self = this
					setTimeout(()=>{
						self.enemyBeat2(val)
						self.delayTel(2200,0)
							let t = setInterval(()=>{
								let val2 = parseInt(self.enemy.gj * 2) - parseInt(self.myHero.fy*1.8) + 50
								if(val2 < 50){
									val2 = self.randomNum(30,70)
								}
								self.enemyBeat2(val2)
							},700)
							setTimeout(()=>{
								clearInterval(t)
							},2150)
					},1200)
				}
				if(num == 2){
					if(parseFloat(this.enemy.gs)>0.6){
						this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) - 0.3).toFixed(2)
						setTimeout(()=>{
							this.enemy.gs = parseFloat(parseFloat(this.enemy.gs) + 0.3).toFixed(2)
						},3000)
					}
				}
				if(num == 4){
					this.heroAnm('../../static/imgs/hero/timo4.gif?'+ new Date().getTime())
					this.backBgImg('timo4',1000)
					let val = parseInt(this.enemy.gj * 2) - parseInt(this.myHero.fy*1.8) + 300
					let self = this
					setTimeout(()=>{
						if(self.reallyRandom(0,1) == 1){
							let t = setInterval(()=>{
								if(val < 50){
									val = self.randomNum(120,200)
								}
								self.enemyBeat2(val)
							},500)
							setTimeout(()=>{
								clearInterval(t)
							},1550)
						}
					},3500)
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
		},
		
		//攻击特效
		gjTXAnim(type,time) {
			if(type == 1){
				this.heroTX = 'herogj.gif'
				this.showTX = true
				setTimeout(()=>{
					if(this.heroTX.indexOf('herogj') != -1){
						this.showTX = false
					}
				},600)
			}
			if(type == 2){
				this.heroTX = 'heroconsis.gif'
				this.showTX = true
				setTimeout(()=>{
					if(this.heroTX.indexOf('heroconsis') != -1){
						this.showTX = false
					}
				},time)
			}
			if(type == 3){
				this.enemyTX = 'enemyTX.gif'
				this.showTX3 = true
				setTimeout(()=>{
					if(this.heroTX.indexOf('enemyTX') != -1){
						this.showTX3 = false
					}
				},700)
			}
			if(type == 4){
				this.enemyTX = 'heroconsis.gif'
				this.showTX3 = true
				setTimeout(()=>{
					this.showTX3 = false
				},time)
			}
			if(type == 5){
				this.heroTX = 'herotx.gif'
				this.showTX = true
				setTimeout(()=>{
					if(this.heroTX.indexOf('herotx') != -1){
						this.showTX = false
					}
				},600)
			}
			if(type == 6){
				this.heroTX = 'enemyTX2.gif'
				this.showTX = true
				setTimeout(()=>{
					if(this.heroTX.indexOf('enemyTX2') != -1){
						this.showTX = false
					}
				},600)
			}
		}
		
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	// background: url('../../static/imgs/bg5.jpeg');
	// background-size: cover;
	// background-repeat: no-repeat;
	// box-sizing: border-box;
	.bgImg {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		object-fit: cover;
		z-index: 1;
	}
	.mygjAnm {
		width: 65%;
		height: 50vh;
		position: absolute;
		top: 30%;
		left: 20%;
		opacity: 0.8;
		object-fit: cover;
		z-index: 2;
		border-radius: 12rpx;
		box-shadow: 0px 0px 7px 2px #ffcc11;
	}
	.main {
		width: 100%;
		height: 100vh;
		padding: 6% 0rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.my {
			z-index: 3;
			.tallentBar {
				width: 100%;
				padding: 0rpx 50rpx;
				box-sizing: border-box;
			}
			.opreate {
				width: 95%;
				height: 140rpx;
				padding: 20rpx 0rpx;
				display: flex;
				justify-content: space-between;
				.store,.regularGj {
					margin-left: 30rpx;
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
				.tool {
					.tooltext {
						width: 30rpx;
						padding: 10rpx 0rpx;
						color: $main-color;
						font-size: 30rpx;
					}
					width: 50%;
					display: flex;
					justify-content: space-around;
					background-color: rgba(211, 211, 211, 0.15);
					border: 2rpx solid rgba(255, 237, 101, 0.7);
					border-radius: 18rpx;
				}
			}
			.tallent{
				width: 100%;
				box-sizing: border-box;
				padding: 0rpx 26rpx;
				.tallentRow {
					width: 100%;
					height: 278rpx;
					margin-top: 16rpx;
					background-color: rgba(211, 211, 211, 0.2);
					border-radius: 28rpx;
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
					.checkT {
						color: #fff;
						background-color: #0aa9ff;
						font-size: 30rpx;
						padding: 2rpx 12rpx;
						margin: 0rpx 10rpx;
						border-radius: 8rpx;
					}
				}
			}
		}
		.heroTX {
			position: absolute;
			top: 6%;
			left: 2%;
		}
		.heroTXimg {
			width: 200rpx;
			height: 200rpx;
			z-index: 999;
		}
		.enemyTX {
			position: absolute;
			bottom: 580rpx;
			left: 2%;
		}
		.enemyTX2 {
			position: absolute;
			bottom: 580rpx;
			left: 2%;
		}
		.enemy,.me {
			width: 100%;
			padding: 20rpx;
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
				width: 100%;
				height: 54rpx;
				border: 4rpx solid $main-color;
				border-radius: 12rpx;
				.bloodText {
					width: 100%;
					float: left;
					position: relative;
					text-align: center;
					color: #ececec;
					z-index: 3;
					line-height: 54rpx;
					vertical-align: middle;
				}
				.bloodVal {
					position: relative;
					z-index: 2;
					height: 54rpx;
					border-radius: 6rpx;
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
					top: -54rpx;
					height: 54rpx;
					border-radius: 6rpx;
					background-color: #ed9294;
					transition-property: width;
					transition-duration: 0.3s;
					transition-timing-function: linear;
				}
				.blueVal {
					width: 100%;
					position: relative;
					height: 46rpx;
					border-radius: 6rpx;
					text-align: center;
					float: left;
					color: #ececec;
					line-height: 46rpx;
					vertical-align: middle;
					background: linear-gradient(90deg, rgba(0, 0, 220, 0.5) 0%, #0167ff 100%);
				}
			}
			.harmText1 {
				position: absolute;
				top: 26rpx;
				right: 20rpx;
				color: #ed0003;
				font-weight: bold;
				font-size: 36rpx;
			}
		}
		.enemyInfo {
			width: 100%;
			padding: 0rpx 30rpx;
			color: #ffff7f;
			.infoRow {
				width: 90%;
				display: flex;
				justify-content: space-between;
				.val {
					 color: #00ff00;
					 font-weight: bold;
					 font-size: 34rpx;
				}
			}
		}
		.name {
			color: $main-color;
			font-size: 38rpx;
			padding: 6rpx 0rpx;
		}
		.harmText2 {
			font-weight: bold;
			font-size: 36rpx;
		}
	}
	.time {
		width: 100%;
		position: absolute;
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
		width: 100%;
		position: absolute;
		top: 25%;
		display: flex;
		justify-content: center;
		z-index: 999;
		.winlogoImg {
			width: 92%;
		}
	}
	.vs {
		width: 100%;
		position: absolute;
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
	
	.sel {
		width: 100%;
		height: 80%;
		position: relative;
		top: 5%;
		background: url('../../static/imgs/selRole.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		z-index: 95;
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
			padding: 60rpx 50rpx;
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
}

</style>