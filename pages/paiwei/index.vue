<template>
	<view class="container">
		<view class="enemyList">
			<view class="role">
				<view v-if="enemy[0]" :class="{'roleFrame':true,'seled': selAct}" style="color:#95111e" @click="selEnemy(1)">
					<span v-if="!enemy[0]"></span>
					<view v-else class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/'+enemy[0].icon"></image>
					</view>
					<view style="font-size: 28rpx;">{{enemy[0].name}} Lv:{{+enemy[0].lv}}</view>
				</view>
				<view v-if="enemy[1]" :class="{'roleFrame':true,'seled': selAct2}" style="color:#95111e" @click="selEnemy(2)">
					<span v-if="!enemy[1]"></span>
					<view v-else class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/'+enemy[1].icon"></image>
					</view>
					<view style="font-size: 28rpx;">{{enemy[1].name}} Lv:{{+enemy[1].lv}}</view>
				</view>
				<view v-if="enemy[2]" :class="{'roleFrame':true,'seled': selAct3}" style="color:#95111e" @click="selEnemy(3)">
					<span v-if="!enemy[2]"></span>
					<view v-else class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/'+enemy[2].icon"></image>
					</view>
					<view style="font-size: 28rpx;">{{enemy[2].name}} Lv:{{+enemy[2].lv}}</view>
				</view>
				<view v-if="enemy[3]" :class="{'roleFrame':true,'seled': selAct4}" style="color:#95111e" @click="selEnemy(4)">
					<span v-if="!enemy[3]"></span>
					<view v-else class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/'+enemy[3].icon"></image>
					</view>
					<view style="font-size: 28rpx;">{{enemy[3].name}} Lv:{{+enemy[3].lv}}</view>
				</view>
				<view v-if="enemy[4]" :class="{'roleFrame':true,'seled': selAct5}" style="color:#95111e" @click="selEnemy(5)">
					<span v-if="!enemy[4]"></span>
					<view v-else class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/'+enemy[4].icon"></image>
					</view>
					<view style="font-size: 28rpx;">{{enemy[4].name}} Lv:{{+enemy[4].lv}}</view>
				</view>
				<view v-if="enemy[5]" :class="{'roleFrame':true,'seled': selAct6}" style="color:#95111e" @click="selEnemy(6)">
					<span v-if="!enemy[5]"></span>
					<view v-else class="icon1">
						<image class="icon1Img" :src="'../../static/imgs/'+enemy[5].icon"></image>
					</view>
					<view style="font-size: 28rpx;">{{enemy[5].name}} Lv:{{+enemy[5].lv}}</view>
				</view>
			</view>
		</view>
		<view class="tool">
			<view class="store" v-if="myTool.length >= 1" v-for="item in myTool">
				<image class="toolImg" @click="useTool(item.name)" :src="'../../static/imgs/hero/'+item.icon"></image>
				<view class="storeText">{{item.name}}</view>
			</view>
			<view style="color: #fff;margin-top: 32rpx;" v-if="myTool.length == 0">暂无道具</view>
		</view>
		<view class="myStore" @click="toStore">
			<image class="storeImg" src="../../static/imgs/storeIcon.png"></image>
		</view>
		<view class="my">
		你的英雄队伍：
		<view class="role">
			<view :class="{'roleFrame':true,'seled': selMeAct}" style="color:#ff0000" @click="selRole(1)">
				<span v-if="!heros[0]">第一顺位</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[0].icon"></image>
				</view>
			</view>
			<view :class="{'roleFrame':true,'seled': selMeAct2}" style="color:#ff8b07" @click="selRole(2)">
				<span v-if="!heros[1]">第二顺位</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[1].icon"></image>
				</view>
			</view>
			<view :class="{'roleFrame':true,'seled': selMeAct3}" style="color:#00ff00" @click="selRole(3)">
				<span v-if="!heros[2]">第三顺位</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[2].icon"></image>
				</view>
			</view>
			<view :class="{'roleFrame':true,'seled': selMeAct4}" style="color:#00aa00" @click="selRole(4)">
				<span v-if="!heros[3]">第四顺位</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[3].icon"></image>
				</view>
			</view>
			<view :class="{'roleFrame':true,'seled': selMeAct5}" style="color:#000000" @click="selRole(5)">
				<span v-if="!heros[4]">第五顺位</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[4].icon"></image>
				</view>
			</view>
			<view :class="{'roleFrame':true,'seled': selMeAct6}" style="color:#0055ff" @click="selRole(6)">
				<span v-if="!heros[5]">第六顺位</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[5].icon"></image>
				</view>
			</view>
		</view>
		</view>
		<view v-if="showBtn" style="position: absolute;bottom: 20rpx;right: 50rpx;float: right;">
			<button size="mini" @click="randomHero">机选英雄</button>
			<button size="mini" type="primary" style="margin-left: 26rpx;" @click="begin">准备好了</button>
		</view>
	</view>
</template>

<script>
import tallent from '@/components/tallent/index.vue'
import equipment from '@/components/equipment/index.vue'
import bg1 from '../../static/imgs/tianti1.jpeg'
import bg2 from '../../static/imgs/tianti2.jpg'
import res from '../../static/data/challegeEnemy.json'
import res2 from '../../static/data/exp.json'
import res3 from '../../static/data/heroList.json'
import res4 from '../../static/data/goods.json'
export default {
	data() {
		return {
			heros: [null,null,null,null,null,null],
			herosAll: [null,null,null,null,null,null],
			enemy: [null,null,null,null,null,null],
			level: 17,
			minLevel: 5,
			showBtn: true,
			selAct: false,
			selAct2: false,
			selAct3: false,
			selAct4: false,
			selAct5: false,
			selAct6: false,
			selMeAct: false,
			selMeAct2: false,
			selMeAct3: false,
			selMeAct4: false,
			selMeAct5: false,
			selMeAct6: false,
			userInfo: {
				name: '',
				passWord: '',
				money: 0,
				e: 0,
				lv: 1,
				pwlv: 1,
				pwE: 0
			},
			enemyInfo: {},
			hero: {},
			myTool: [],
			storeList: []
		}
	},
	onLoad(option) {
	    if (typeof plus !== 'undefined' && typeof plus.screen !== 'undefined') {
	    	plus.screen.lockOrientation("portrait")
	    }
		if(!uni.getStorageSync('paiweiEnemy')){
			this.getEnemyList()
		}else{
			this.enemy = JSON.parse(uni.getStorageSync('paiweiEnemy'))
		}
		if(uni.getStorageSync('paiweiHero')){
			this.heros = JSON.parse(uni.getStorageSync('paiweiHero'))
		}
		//加载道具
		if(uni.getStorageSync('myStore')){
			this.storeList = JSON.parse(uni.getStorageSync('myStore'))
			this.storeList.map(it=>{
				if(it.isOther){
					if(this.myTool.length<=3){
						this.myTool.push(it)
					}
				}
			})
		}
		if(JSON.stringify(option) != '{}'){
			if(option.item){
				this.heros[option.num-1] = JSON.parse(option.item)
				uni.setStorageSync('paiweiHero',JSON.stringify(this.heros))
			}
			if(option.time){
				let time = parseInt(option.time)
				if(uni.getStorageSync('paiweiTime')){
					time = parseInt(option.time) + parseInt(uni.getStorageSync('paiweiTime'))
				}
				uni.setStorageSync('paiweiTime',time)
			}
			if(option.type){
				if(option.type == 1){
					this.showBtn = false
				}
			}
			if(option.beatEnemy){
				this.enemy.map((item,index)=>{
					if(item.name == option.beatEnemy){
						this.enemy.splice(index,1)
						if(this.enemy.length == 0){
							uni.showToast({
								title: '游戏结束，恭喜你获得胜利！',
								icon:'none',
								duration: 2000
							});
							this.herosAll = [...this.heros]
							this.backMenu(1)
							return
						}
						uni.setStorageSync('paiweiEnemy',JSON.stringify(this.enemy))
					}
				})
				if(this.reallyRandom(0,1) == 1 && this.enemy.length != 0){
					let enemylength = this.enemy.length -1
					let index = this.reallyRandom(0,enemylength)
					let index2 = this.reallyRandom(0,this.heros.length-1)
					let info = this.enemy[index]
					let info2 = this.heros[index2]
					let self = this
					if(info && info2){
						uni.showModal({
							title: '信息',
							content: '敌方"'+info.name + '"想与你"'+info2.name+'"交战',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									self.selRole(index2+1)
									self.selEnemy(index+1)
								}
							}
						});
					}
				}else if(this.enemy.length != 0){
					uni.showToast({
						title: '选择己方要出战的英雄和要对战的敌方目标英雄',
						icon:'none',
						duration: 2500
					});
				}
				this.showBtn = false
			}
			if(option.heroBlood){
				this.heros.map((item,index)=>{
					if(item && item.name == option.hero){
						this.heros[index].blood = parseInt(option.heroBlood)
					}
				})
				uni.setStorageSync('paiweiHero',JSON.stringify(this.heros))
				this.showBtn = false
			}
			if(option.beatHero){
				this.heros.map((item,index)=>{
					if(item && item.name == option.beatHero || option.beatHero.indexOf(item.name) != -1){
						this.heros.splice(index,1)
					}
				})
				let hs = false
				//判断有无英雄
				this.heros.map(item=>{
					if(item){
						hs = true
					}
				})
				if(!hs || this.heros.length == 0){
					uni.showToast({
						title: '游戏结束，战斗失败！',
						icon:'none',
						duration: 2000
					});
					this.backMenu(0)
					return
				}
				uni.setStorageSync('paiweiHero',JSON.stringify(this.heros))
				if(this.reallyRandom(0,1) == 1 && this.heros.length != 0){
					let enemylength = this.enemy.length -1
					let index = this.reallyRandom(0,enemylength)
					let index2 = this.reallyRandom(0,this.heros.length-1)
					let info = this.enemy[index]
					let info2 = this.heros[index2]
					let self = this
					if(info && info2){
						uni.showModal({
							title: '信息',
							content: '敌方"'+info.name + '"想与你"'+info2.name+'"交战',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									self.selRole(index2+1)
									self.selEnemy(index+1)
								}
							}
						});
					}
				}else if(this.heros.length != 0){
					uni.showToast({
						title: '选择己方要出战的英雄和要对战的敌方目标英雄',
						icon:'none',
						duration: 2500
					});
				}
				this.showBtn = false
			}
			if(option.enemyBlood){
				this.enemy.map((item,index)=>{
					if(item.name == option.enemy){
						this.enemy[index].blood = parseInt(option.enemyBlood)
					}
					uni.setStorageSync('paiweiEnemy',JSON.stringify(this.enemy))
				})
				this.showBtn = false
			}
		}
	},
	methods:{
		selRole(num){
			if(!this.showBtn){
				if(!this.heros[num-1]){
					return
				}
				this.hero = {...this.heros[num-1]}
				this.selMeAct = false
				this.selMeAct2 = false
				this.selMeAct3 = false
				this.selMeAct4 = false
				this.selMeAct5 = false
				this.selMeAct6 = false
				if(num == 1){
					this.selMeAct = true
				}
				if(num == 2){
					this.selMeAct2 = true
				}
				if(num == 3){
					this.selMeAct3 = true
				}
				if(num == 4){
					this.selMeAct4 = true
				}
				if(num == 5){
					this.selMeAct5 = true
				}
				if(num == 6){
					this.selMeAct6 = true
				}
				if(JSON.stringify(this.enemyInfo) != '{}'){
					this.toolsAdd()
					uni.redirectTo({
						url: "/pages/play/load?enemy="+JSON.stringify(this.enemyInfo)+'&item='+JSON.stringify(this.hero)
					})
				}
			}else{
				uni.redirectTo({
					url: "/pages/tianti/sel?num="+num
				})
			}

		},
		selEnemy(num){
			if(!this.showBtn){
				if(!this.enemy[num-1]){
					return
				}
				this.enemyInfo = {...this.enemy[num-1]}
				this.selAct = false
				this.selAct2 = false
				this.selAct3 = false
				this.selAct4 = false
				this.selAct5 = false
				this.selAct6 = false
				if(num == 1){
					this.selAct = true
				}
				if(num == 2){
					this.selAct2 = true
				}
				if(num == 3){
					this.selAct3 = true
				}
				if(num == 4){
					this.selAct4 = true
				}
				if(num == 5){
					this.selAct5 = true
				}
				if(num == 6){
					this.selAct6 = true
				}
				if(JSON.stringify(this.hero) != '{}'){
					this.toolsAdd()
					uni.redirectTo({
						url: "/pages/play/load?enemy="+JSON.stringify(this.enemyInfo)+'&item='+JSON.stringify(this.hero)
					})
				}
			}
		},
		begin() {
			// uni.redirectTo({
			// 	url: "/pages/play/load"
			// })
			if(!this.heros[1] || this.heros.length < 6){
				uni.showToast({
					title: '请选齐英雄阵列',
					icon:'none',
					duration: 2000
				});
				return
			}
			uni.showToast({
				title: '选择己方要出战的英雄和要对战的敌方目标英雄',
				icon:'none',
				duration: 2500
			});
			this.enemyStrong()
			this.showBtn = false
		},
		enemyStrong() {
			let datas = JSON.parse(uni.getStorageSync('heroAddData'))
			let allPointer = 0
			this.heros.forEach(i=>{
				datas.forEach((it,idx)=>{
					if(i.id == it.id){
						allPointer += it.allPointer
					}
				})
			})
			//计算平均英雄等级
			let level = Math.ceil(parseInt(allPointer/6)/500)
			this.enemy.forEach(item=>{
				if(level>=25){
					item.blood = parseInt(item.blood + this.randomNum(level*50,parseInt(item.blood*0.1) + level*90))
				}else if(level>=20 && level<25){
					item.blood = parseInt(item.blood + this.randomNum(level*45,parseInt(item.blood*0.1) + level*75))
				}else if(level>=15 && level<20){
					item.blood = parseInt(item.blood + this.randomNum(level*30,parseInt(item.blood*0.06) + level*65))
				}else if(level>=7 && level<15){
					item.blood = parseInt(item.blood + this.randomNum(level*20,parseInt(item.blood*0.06) + level*45))
				}else{
					item.blood = parseInt(item.blood + this.randomNum(level*15,parseInt(item.blood*0.06) + level*35))
				}
				this.blood1 = item.blood
				item.gj = item.gj + this.randomNum(level,level+parseInt(item.gj*(level*0.006)))
				item.fy = item.fy + this.randomNum(level,level+parseInt(item.fy*(level*0.005)))
				item.mk = item.mk + this.randomNum(level,level+parseInt(item.mk*(level*0.005)))
			})
		},
		getEnemyList() {
			let userInfo = JSON.parse(uni.getStorageSync('user'))
			let chaLi = []
			res.data.forEach(item=>{
				if(parseInt(userInfo.pwlv) >= 3){
					if(parseInt(userInfo.pwlv) >= 3 && parseInt(userInfo.pwlv) < 5){
						if(item.level >= 208 && item.level <= 214){
							chaLi.push(item)
						}
					}else{
						if(item.level >= 209 && item.level <= 216){
							chaLi.push(item)
						}
					}
				}else{
					if(item.level == 2 || item.level == 4 || item.level == 8){
						chaLi.push(item)
					}
				}
				
			})
			res3.data.concat(res4.data.slice(1)).forEach(item=>{
				if(!item.isOther){
					let ite = {...item}
					ite.gj = parseInt(ite.gj*1.5)
					ite.fy = parseInt(ite.fy*1.7)
					ite.blood = parseInt(ite.blood*1.5)
					ite.gs = ite.v
					ite.mk = ite.fy
					ite.icon = 'hero/' + ite.icon
					ite.isHero = true
					chaLi.push(ite)
				}
			})
			let list = chaLi
			let list2 = []
			let list3 = []
			for(let i = 0;i<list.length;i++){
				let hero = list[this.randomNum(0,list.length-1)].name
				if((list2.length == 0 || !list2.includes(hero)) && list2.length < 6){
					list2.push(hero)
				}
			}
			list.map(ite=>{
				list2.map(item=>{
					if(ite.name == item){
						list3.push(ite)
					}
				})
			})
			if(parseInt(userInfo.pwlv) == 1){
				this.minLevel = 2
				this.level = 6
				if(parseInt(userInfo.pwE) == 3){
					this.minLevel = 4
					this.level = 8
				}
				if(parseInt(userInfo.pwE) >= 4){
					this.minLevel = 5
					this.level = 9
				}
			}
			if(parseInt(userInfo.pwlv) == 2){
				this.minLevel = 6
				this.level = 10
				if(parseInt(userInfo.pwE) == 3){
					this.minLevel = 8
					this.level = 12
				}
				if(parseInt(userInfo.pwE) >= 4){
					this.minLevel = 8
					this.level = 13
				}
			}
			if(parseInt(userInfo.pwlv) == 3){
				this.minLevel = 9
				this.level = 15
				if(parseInt(userInfo.pwE) == 3){
					this.minLevel = 10
					this.level = 17
				}
				if(parseInt(userInfo.pwE) >= 4){
					this.minLevel = 12
					this.level = 18
				}
			}
			if(parseInt(userInfo.pwlv) == 4){
				this.minLevel = 13
				this.level = 19
				if(parseInt(userInfo.pwE) == 2){
					this.minLevel = 15
					this.level = 19
				}
				if(parseInt(userInfo.pwE) >= 3){
					this.minLevel = 16
					this.level = 19
				}
			}
			if(parseInt(userInfo.pwlv) == 5){
				this.minLevel = 17
				this.level = 24
				if(parseInt(userInfo.pwE) == 2){
					this.minLevel = 18
					this.level = 23
				}
				if(parseInt(userInfo.pwE) == 3){
					this.minLevel = 19
					this.level = 23
				}
				if(parseInt(userInfo.pwE) >= 4){
					this.minLevel = 20
					this.level = 24
				}
			}
			if(parseInt(userInfo.pwlv) == 6){
				this.minLevel = 24
				this.level = 35
				if(parseInt(userInfo.pwE) == 2){
					this.minLevel = 25
					this.level = 35
				}
				if(parseInt(userInfo.pwE) == 3){
					this.minLevel = 26
					this.level = 35
				}
				if(parseInt(userInfo.pwE) >= 4){
					this.minLevel = 28
					this.level = 35
				}
			}
			this.minLevel = this.minLevel
			this.level = this.level
			list3.forEach(item=>{
				item.lv = this.randomNum(this.minLevel,this.level)
				let lv = item.lv - 2
				if(lv <= 0) return
				if(item.lv < 10){
					item.gj += Math.floor(parseInt(item.gj)*0.03*lv)
					item.fy += Math.floor(parseInt(item.fy)*0.03*lv)
					item.mk += Math.floor(parseInt(item.mk)*0.03*lv)
					item.blood += Math.floor(parseInt(item.blood)*0.04*lv)
				}else if(item.lv >= 10 && item.lv < 20){
					item.gj += Math.floor(parseInt(item.gj)*0.03*lv)
					item.fy += Math.floor(parseInt(item.fy)*0.04*lv)
					item.mk += Math.floor(parseInt(item.mk)*0.04*lv)
					item.gs = parseFloat(parseFloat(item.gs) - parseFloat(0.006*lv)).toFixed(2);
					item.blood += Math.floor(parseInt(item.blood)*0.05*lv)
				}else if(item.lv >= 20){
					item.gj += Math.floor(parseInt(item.gj)*0.04*lv)
					item.fy += Math.floor(parseInt(item.fy)*0.05*lv)
					item.mk += Math.floor(parseInt(item.mk)*0.05*lv)
					item.gs = parseFloat(parseFloat(item.gs) - parseFloat(0.01*lv)).toFixed(2);
					item.blood += Math.floor(parseInt(item.blood)*0.05*lv)
				}
				if(item.blood > 12000) {
					item.blood = 12000
				}
			})
			this.enemy = [...list3]
			uni.setStorageSync('paiweiEnemy',JSON.stringify(this.enemy))
		},
		randomNum(Min,Max){
		  var Range = Max - Min;
		  var Rand = Math.random();
		  var num = Min + Math.round(Rand * Range); //四舍五入
		  return num;
		},
		//战斗结束，结算
		backMenu(type) {
			let money = parseInt(JSON.parse(uni.getStorageSync('user')).money)
			let name = JSON.parse(uni.getStorageSync('user')).name
			let time = parseInt(uni.getStorageSync('paiweiTime'))
			let winner = type == 1 ? this.randomNum((time*5),(time*6)+350)+700 : 0
			let newMoney = money + (time*10) + this.randomNum(150,350) + winner + (6 - this.enemy.length)*150
			let userInfo = JSON.parse(uni.getStorageSync('user'))
			let addPointer = (time*2) + Math.ceil(winner*0.3)
			let winExp = type == 1 ? time*5 + 100 + this.randomNum(0,100) : Math.floor(time*3.5)+this.randomNum(50,100)
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
			if(parseInt(userInfo.pwE) < 5 && type == 1){
				userInfo.pwE = parseInt(userInfo.pwE) + 1
			}else if(parseInt(userInfo.pwE) >= 5 && type == 1){
				userInfo.pwlv = parseInt(userInfo.pwlv) + 1
				userInfo.pwE = 0
			}else if(type == 0){
				if(parseInt(userInfo.pwE) <= 0){
					if(parseInt(userInfo.pwlv) > 1){
						userInfo.pwlv = parseInt(userInfo.pwlv) - 1
						userInfo.pwE = 4
					}else{
						userInfo.pwlv = 1
						userInfo.pwE = 0
					}
				}else{
					userInfo.pwE = parseInt(userInfo.pwE) - 1
				}
			}
			if(type!=0){
				let self = this
				let datas = JSON.parse(uni.getStorageSync('heroAddData'))
				self.herosAll.forEach(i=>{
					datas.forEach((it,idx)=>{
						if(i.id == it.id){
							if((datas[idx].allPointer+addPointer) <= 35*500){
								datas[idx].pointer += addPointer
								datas[idx].allPointer += addPointer
							}else{
								datas[idx].pointer = 0
								datas[idx].allPointer = 35*500-1
							}
						}
					})
				})
				uni.setStorageSync('heroAddData',JSON.stringify(datas))
			}
			this.deleteTool('1',1)
			uni.setStorageSync('user',JSON.stringify(userInfo))
			uni.removeStorageSync('paiweiEnemy');
			uni.removeStorageSync('paiweiHero');
			uni.setStorageSync('paiweiTime',0)
			setTimeout(()=>{
				uni.redirectTo({
					url: "/pages/paiwei/init"
				})
			},2000)
			
		},
		randomHero() {
			let list = []
			let numlist = []
			let all = res3.data
			for(let i = 0;i<50;i++){
				let rand = this.randomNum(0,all.length - 1)
				if(numlist.length==0 || !numlist.includes(rand)){
					if(list.length < 6){
						numlist.push(rand)
						list.push(all[rand])
					}
				}
			}
			this.heros = [...list]
			uni.setStorageSync('paiweiHero',JSON.stringify(this.heros))
		},
		//使用道具
		useTool(name) {
			if(this.showBtn){
				uni.showToast({
					title: '你还没有准备好',
					icon:'none',
					duration: 1500
				});
				return
			}
			if(name == '香炉护身') {
				let self = this
				uni.showModal({
					title: '请输入一个当前存活的受益英雄序号（1~6）',
					content: '',
					showCancel: false,
					editable: true,
					success: function (res) {
						if (res.confirm) {
							if(res.content){
								if(parseInt(res.content)-1 < self.heros.length){
									self.heros[parseInt(res.content)-1].fy = parseInt(self.heros[parseInt(res.content)-1].fy) + 60
									self.deleteTool(name,0)
								}else{
									uni.showToast({
										title: '输入有误，请重新输入',
										icon:'none',
										duration: 1500
									});
								}
							}
						}
					}
				})
			}
			if(name == '米凯尔的祝福') {
				let self = this
				uni.showModal({
					title: '请输入一个当前存活的受益英雄序号（1~6）',
					content: '',
					showCancel: false,
					editable: true,
					success: function (res) {
						if (res.confirm) {
							if(res.content){
								if(parseInt(res.content)-1 < self.heros.length){
									self.heros[parseInt(res.content)-1].blood = parseInt(self.heros[parseInt(res.content)-1].blood) + 1000
									self.heros[parseInt(res.content)-1].hasMKE = true
									self.deleteTool(name,0)
								}else{
									uni.showToast({
										title: '输入有误，请重新输入',
										icon:'none',
										duration: 1500
									});
								}
							}
						}
					}
				})
			}
			if(name == '铁索') {
				let self = this
				uni.showModal({
					title: '请输入一个当前存活的敌方英雄序号（1~6）',
					content: '',
					showCancel: false,
					editable: true,
					success: function (res) {
						if (res.confirm) {
							if(res.content){
								if(parseInt(res.content)-1 < self.enemy.length){
									self.enemy[parseInt(res.content)-1].gs = parseFloat(parseFloat(self.enemy[parseInt(res.content)-1].gs) + 0.2).toFixed(2)
									self.deleteTool(name,0)
								}else{
									uni.showToast({
										title: '输入有误，请重新输入',
										icon:'none',
										duration: 1500
									});
								}
							}
						}
					}
				})
			}
		},
		//道具加成
		toolsAdd() {
			this.myTool.map(i=>{
				if(i.name == '舒瑞娅的战歌'){
					this.hero.v = parseFloat(parseFloat(this.hero.v) - 0.1).toFixed(2)
					this.hero.gj = this.hero.gj + 30
					this.hero.fs = this.hero.fs + 35
				}
				if(i.name == '军团圣盾'){
					this.hero.fy = this.hero.fy + 30
					this.hero.blood = parseInt(this.hero.blood) + 600
				}
				if(i.name == '黎明核心'){
					if(this.heros.length == 1){
						this.hero.gj = this.hero.gj + 30
						this.hero.fs = this.hero.fs + 35
						this.hero.blood = parseInt(this.hero.blood) + 1500
					}
				}
			})
		},
		//用完道具
		deleteTool(name,type) {
			let self = this
			if(type == 1){
				self.storeList.map((i,index)=>{
					if(i.isOther) {
						self.storeList.splice(index,1)
					}
				})
			}else{
				self.myTool.forEach((item,index)=>{
					if(item.name == name) {
						self.myTool.splice(index,1)
					}
				})
				self.storeList.map((i,index)=>{
					if(i.name == name) {
						self.storeList.splice(index,1)
					}
				})
			}
			uni.setStorageSync('myStore',JSON.stringify(self.storeList));
		},
		toStore() {
			if(this.showBtn){
				uni.showToast({
					title: '你还没有准备好',
					icon:'none',
					duration: 1500
				});
				return
			}
			uni.redirectTo({
				url: "/pages/index/store?type=1"
			})
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
	}
}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		background-size: cover;
		background-repeat: no-repeat;
		background: url('../../static/imgs/tianti2.jpg');
		box-sizing: border-box;
		text-align: center;
		font-size: 42rpx;
		padding: 20rpx;
		.my {
			position: absolute;
			bottom: 90rpx;
		.role {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			padding-top: 30rpx;
			.roleFrame {
				width: 130rpx;
				height: 130rpx;
				margin: 20rpx 30rpx;
				border-radius: 20rpx;
				background-color: rgba(255, 255, 255, 0.4);
				border: 6rpx solid rgba(15, 119, 255, 0.7);
				font-weight: bold;
				font-size: 32rpx;
				text-align: center;
			}
		}
	}
	.tool {
			.tooltext {
				width: 30rpx;
				padding: 10rpx 0rpx;
				color: $main-color;
				font-size: 30rpx;
			}
			width: 90%;
			padding: 30rpx 0rpx;
			position: absolute;
			top: 45%;
			left: 5%;
			display: flex;
			justify-content: space-around;
			background-color: rgba(211, 211, 211, 0.15);
			border: 2rpx solid rgba(255, 237, 101, 0.7);
			border-radius: 18rpx;
		}
	.store {
		margin-left: 30rpx;
		.storeImg {
			width: 100rpx;
			height: 100rpx;
		}
		.storeText {
			color: #353535;
			font-size: 28rpx;
		}
		.toolImg {
			width: 92rpx;
			height: 92rpx;
		}
	}
	.myStore {
		position: absolute;
		bottom: 33%;
		right: 50rpx;
		border-radius: 38rpx;
		box-shadow: 0rpx 0rpx 16rpx 6rpx #ffd500;
		.storeImg {
			width: 120rpx;
			height: 120rpx;
		}
	}
	.enemyList {
			position: absolute;
			top: 0;
		.role {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			padding-top: 30rpx;
			.roleFrame {
				width: 130rpx;
				height: 130rpx;
				margin: 42rpx 30rpx;
				border-radius: 20rpx;
				background-color: rgba(255, 255, 255, 0.4);
				border: 6rpx solid rgba(255, 0, 0, 0.7);
				font-weight: bold;
				font-size: 32rpx;
				text-align: center;
			}
		}
	}
		.icon1 {
			.icon1Img {
				width: 130rpx;
				height: 130rpx;
				border-radius: 12rpx;
			}
		}
	}
	.seled {
		box-shadow: #ffffff 0rpx 0rpx 42rpx 36rpx;
	}
</style>