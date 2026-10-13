<template>
	<view class="container">
		<view class="back">
			<button @click="back" size="mini">返回</button>
		</view>
		<view class="task" @click="showTask">
			<image class="taskImg" src="../../static/imgs/task.png"></image>
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
		<view class="taskModel" v-if="showTaskModel">
			<view class="closetask" @click="closeTask">×</view>
			<view class="taskText">
				<p v-for="(item,index) in tasks" :key="item">（{{index+1}}）{{item}}</p>
			</view>
			<image class="taskModelImg" src="../../static/imgs/taskModel.png"></image>
		</view>
	</view>
</template>

<script>
import res from '../../static/data/challegeEnemy.json'
import res2 from '../../static/data/goods.json'
export default {
	data() {
		return {
			boss: [],
			selBoss: {},
			index: 0,
			opacity: 1,
			innerAudioContext: null,
			showTaskModel: false,
			tasks: []
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
		this.getTask()
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
				let storeList = JSON.parse(uni.getStorageSync('myStore'))
				let hasnum = 0
				storeList.forEach(item=>{
					if(item.levelNum == this.selBoss.levelNum - 1){
						hasnum += 1
					}
				})
				// if(hasnum>=2 || this.selBoss.levelNum < 4){
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
				// }else{
				// 	uni.showToast({
				// 		title: '至少要拥有两个'+(this.selBoss.levelNum - 1)+'星的英雄，才可以挑战哦',
				// 		icon:'none',
				// 		duration: 2000
				// 	});
				// }
			
		},
		playVoice() {
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy()
				this.innerAudioContext = null
			}
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
		showTask() {
			this.showTaskModel = true
			let num = 0
			let userInfo = JSON.parse(uni.getStorageSync('user'))
			let storeList = JSON.parse(uni.getStorageSync('myStore'))
			let has = false
			let myToolList = []
			myToolList = JSON.parse(uni.getStorageSync('tanxianPack'))
			myToolList.forEach(i=>{
				if(i.name == '钰仙剑'){
					has = true
				}
			})
			if(new Date().getDay() == 1 || new Date().getDay() == 2){
				storeList.forEach(item=>{
					if(item.name.indexOf('不朽战神')!= -1 || item.name.indexOf('狂暴孙悟空')!= -1||
					item.name.indexOf('二郎真君')!= -1|| item.name.indexOf('无量仙翁')!= -1){
						num = num+1
					}
				})
				if(num>=4 && !has){
					uni.showToast({
						title: '恭喜完成当日任务，获得【钰仙剑】',
						icon:'none',
						duration: 2000
					});
					myToolList.push({
						id: new Date().getTime(),
						name: '钰仙剑',
						detail: '钰仙剑，仙界专属剑。装备后可提升移动速度10%，攻击力提升125，法术提升80，法力值提升600',
						img: 'yuxianjian.png',
						gj: 125,
						fy: 0,
						fs: 80,
						flz: 600,
						speed: 0.1,
						price: 58000
					})
					uni.setStorageSync('tanxianPack',JSON.stringify(myToolList))
					
				}
			}
			if(new Date().getDay() == 3 || new Date().getDay() == 4){
				let myToolList = []
				let has = false
				myToolList = JSON.parse(uni.getStorageSync('tanxianPack'))
				myToolList.forEach(i=>{
					if(i.name == '魔法神袍'){
						has = true
					}
				})
				storeList.forEach(item=>{
					if(item.name.indexOf('艾欧尼亚之影')!= -1 && parseInt(userInfo.money)>=1200000 && !has){
						uni.showToast({
							title: '恭喜完成当日任务，获得【魔法神袍】',
							icon:'none',
							duration: 2000
						});

						myToolList.push({
							id: new Date().getTime(),
							name: '魔法神袍',
							detail: '魔法神袍。装备后可提升防御力158',
							img: 'mfsp.png',
							gj: 0,
							fy: 158,
							fs: 0,
							flz: 0,
							speed: 0,
							price: 30000
						})
						uni.setStorageSync('tanxianPack',JSON.stringify(myToolList))
					}
				})
			}
			if(new Date().getDay() == 5 || new Date().getDay() == 6 || new Date().getDay() == 7){
				storeList.forEach(item=>{
					if(item.levelNum == 5 || item.levelNum == 4 || item.levelNum == 3 || item.levelNum == 2){
						num += 1
					}
				})
				let myToolList = []
				let has = false
				myToolList = JSON.parse(uni.getStorageSync('myStore'))
				myToolList.forEach(i=>{
					if(i.name == '太阳神羽翼'){
						has = true
					}
				})
				if(num >= 9 && !has){
					uni.showToast({
						title: '恭喜完成当日任务，获得【太阳神羽翼】',
						icon:'none',
						duration: 2000
					});

					myToolList.push({
						id: new Date().getTime(),
						name: '太阳神羽翼',
						details: '太阳神羽翼。装备后可提升移动速度38%，防御力提升70',
						icon: 'taiyangshenyy.png',
						buyTime: new Date().getTime(),
						fy: 70,
						speed: 0.38,
						istool:0,
						isOther: true,
						price: 39900
					})
					
					uni.setStorageSync('myStore',JSON.stringify(myToolList))
				}
			}
			let num2 = 0
			storeList.forEach(item=>{
				if(item.name.indexOf('艾欧尼亚之箭')!=-1 || item.name.indexOf('艾欧尼亚之影')!=-1 ||
					item.name.indexOf('艾欧尼亚之闪')!=-1 || item.name.indexOf('艾欧尼亚之灵')!=-1){
					 num2 += 1
				}
			})
			if(num2 == 4){
				let store = JSON.parse(uni.getStorageSync('myStore'))
				let goodList = [...res2.data]
				let buyTime = new Date().getTime()
				let herodata = null
				let has = false
				store.map((i,d)=>{
					if(i.id == 1015){
						has = true
					}
				})
				goodList.map(item=>{
					if(item.id == 1015){
						herodata = {...item}
					}
				})
				if(!has){
					herodata.buyTime = buyTime
					store.push(herodata)
					uni.setStorageSync('myStore',JSON.stringify(store));
					uni.showToast({
						title: '恭喜完成艾欧尼亚任务，获得英雄【艾欧尼亚之心】',
						icon:'none',
						duration: 2800
					});
				}
			}
		},
		closeTask() {
			this.showTaskModel = false
		},
		getTask() {
			this.tasks.push('击败艾欧尼亚之【箭】【影】【闪】【灵】。获得【艾欧尼亚之心】')
			let data = (new Date().getMonth()+1)+ '月' + new Date().getDate()+'日任务：'
			if(new Date().getDay() == 1 || new Date().getDay() == 2){
				data = data+'击败不朽战神、狂暴孙悟空、二郎真君、无量仙翁。获得【钰仙剑】'
			}
			if(new Date().getDay() == 3 || new Date().getDay() == 4){
				data = data+'击败艾欧尼亚之影并且金币达到120万。获得【魔法神袍】'
			}
			if(new Date().getDay() == 5 || new Date().getDay() == 6 || new Date().getDay() == 7){
				data = data+'获得全部6星级以下英雄且金币达到100万。获得【太阳神羽翼】'
			}
			this.tasks.push(data)
		}
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
.task {
	position: absolute;
	right: 30rpx;
	top: 10rpx;
}
.taskImg {
	width: 200rpx;
	height: 180rpx;
}
.taskModel {
	width: 100%;
	height: 800rpx;
	z-index: 10;
	position: absolute;
	left: 0;
	top: 10%;
}
.taskText {
	position: absolute;
	top: 53%;
	text-align: center;
	z-index: 12;
	font-size: 30rpx;
	padding: 0rpx 15%;
	color: #fff;
}
.closetask {
	z-index: 11;
	font-size: 56rpx;
	font-weight: bold;
	color: #fff;
	position: relative;
	top: 250rpx;
	right: 90rpx;
	text-align: right;
}
.taskModelImg {
	width: 100%;
	height: 100%;
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