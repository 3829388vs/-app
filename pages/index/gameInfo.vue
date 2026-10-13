<template>
	<view class="container">
		<view class="back">
			<button @click="back" size="mini">返回</button>
		</view>
		<view class="main">
			<view class="bossItem">
				<view class="left" @click="pageChange(0)"></view>
				<view class="bossIcon">
					<view class="star" v-if="selInfo.levelNum">
						<image class="starImg" :src="'../../static/imgs/star'+startNum()+'.png'" v-for="indx in selInfo.levelNum" :key="indx"></image>
					</view>
					<image :class="{'bossIconImg': true,'nostar': !selInfo.levelNum}" :style="{'opacity': opacity}" :src="'../../static/imgs/'+selInfo.img"></image>
				</view>
				<view class="right" @click="pageChange(1)"></view>
			</view>
			<view class="name">
				{{selInfo.name}}
			</view>
			<view class="details">
				<view class="details-text">
					{{selInfo.text}}
				</view>
			</view>
		</view>

	</view>
</template>

<script>
export default {
data() {
	return {
		list: [
			{
				id: 5,
				name: '聚龙锤',
				img: 'mapObjs/julong.png',
				text: '聚龙锤。可通过探险模式拾取宝箱获得。攻击+119，法术+70',
				levelNum: 4
			},
			{
				id: 2,
				name: '钰仙剑',
				img: 'mapObjs/yuxianjian.png',
				text: '钰仙剑，仙界专属剑，通过完成SPTBOSS-周一周二的任务获得。装备后可提升移动速度10%，攻击力提升125，法术提升80，法力值提升600',
				levelNum: 4
			},
			{
				id: 6,
				name: '光影剑',
				img: 'mapObjs/guangying.png',
				text: '光影剑。可通过探险模式拾取轮回之地的宝箱获得。攻击+115，法术+70',
				levelNum: 5
			},
			{
				id: 1,
				name: '至尊幻焰剑',
				img: 'mapObjs/zhizun.png',
				text: '至尊幻焰剑。可通过探险模式拾取宝箱获得。攻击+165。普通攻击附带魔法伤害。',
				levelNum: 6
			},
			{
				id: 3,
				name: '降龙宝剑',
				img: 'mapObjs/xianglong.png',
				text: '降龙宝剑。可通过探险模式拾取宝箱获得。攻击+198，法术+160。每击败一名敌人，获得5~9攻击力。BOSS模式下释放英雄技能可以吸取BOSS血',
				levelNum: 6
			},
			{
				id: 4,
				name: '仙灵雨翼扇',
				img: 'mapObjs/xianling.png',
				text: '仙灵雨翼扇。可通过探险模式拾取宝箱获得。法术+236，法力值+1000。释放一个法术型技能后，普通攻击附带魔法伤害，持续3秒。',
				levelNum: 6
			},
			{
				id: 7,
				name: '万魔之魂剑',
				img: 'mapObjs/wanmozhihun.png',
				text: '万魔之魂剑。通过世界杯获得冠军获得此剑。装备后可提升攻击力199，法术提升100',
				levelNum: 6
			},
			{
				id: 19,
				name: '宝莲灯',
				img: 'mapObjs/bld.png',
				text: '盘古开天碎片形成的宝莲灯，世间仅有一个，法术无与伦比，拥有此物可上天入地无人能敌，乃至与天庭抗衡。通过探险模式-困难，进入轮回之地拾取紫色宝箱获得',
				levelNum: 6
			},
			{
				id: 8,
				name: '火云邪神羽翼',
				img: 'mapObjs/hyxsyy.png',
				text: '火云邪神羽翼。可通过探险模式拾取宝箱获得。装备后可提升移动速度33%，防御力提升50'
			},
			{
				id: 9,
				name: '太阳神羽翼',
				img: 'mapObjs/taiyangshenyy.png',
				text: '太阳神羽翼。可通过探险模式拾取轮回之地的宝箱获得或完成周五周六周日的SPTBOSS任务获得。装备后可提升移动速度38%，防御力提升70'
			},
			{
				id: 10,
				name: '王者羽翼',
				img: 'mapObjs/wangzheyy.png',
				text: '王者羽翼。可通过排位赛达到王者段位获得。装备后可提升移动速度40%，防御力提升50'
			},
			{
				id: 11,
				name: '嗜血恶魔羽翼',
				img: 'mapObjs/shixueemoyy.png',
				text: '嗜血恶魔羽翼。可通过排位赛达到巅峰王者段位获得。装备后可提升移动速度40%，防御力提升75'
			},
			{
				id: 12,
				name: 'AWM狙击枪',
				img: 'mapObjs/awm.png',
				text: 'AWM狙击枪。可通过每日下午3点，锦标赛决赛遇见秦始皇时，击败他获得。只有射手（远程）英雄可以装备，攻击力提升206，暴击几率提升50%，攻击距离提升30码'
			},
			{
				id: 13,
				name: '少林武僧-光明骑士',
				img: 'hero/gmqs.jpg',
				text: '少林武僧-光明骑士皮肤。可通过探险模式-困难，进入轮回之地拾取紫色宝箱有概率获得（2天）。'
			},
			{
				id: 14,
				name: "影流之主-均衡教派",
				img: 'hero/jhjp.jpg',
				text: '影流之主-均衡教派皮肤。可通过探险模式-普通，进入轮回之地拾取紫色宝箱有概率获得（2天）。'
			},
			{
				id: 15,
				name: "海洋龙魂",
				img: 'mapObjs/haiyanglh.png',
				text: '通过探险模式简单或困难，进入轮回之地拾取紫色宝箱有概率获得。主动释放龙魂会回复70%生命值和500法力值，释放之后，离敌方英雄距离稍远触发：移动英雄则回复3%生命值，5法力值。'
			},
			{
				id: 16,
				name: "炼狱龙魂",
				img: 'mapObjs/lianyulh.png',
				text: '通过探险模式困难，进入轮回之地拾取紫色宝箱有概率获得。释放技能后，给敌方每秒造成50~100真实伤害，持续3秒。'
			},
			{
				id: 17,
				name: "云霄龙魂",
				img: 'mapObjs/yunxiaolh.png',
				text: '通过排位赛翡翠钻石段位宝箱可以领取。手动触发该龙魂后，提升英雄移动速度120，持续12秒，并永久提升5移动速度。'
			},
			{
				id: 18,
				name: "山脉龙魂",
				img: 'mapObjs/shanmailh.png',
				text: '通过天梯模式击败最后一位-齐天大圣获得。主动释放后，提升自己防御力150，持续7秒，并永久提升6防御力.'
			}
		],
		selInfo: {},
		index: 0,
		opacity: 1,
		innerAudioContext: null,
		showTaskModel: false,
	}
},
onLoad(option) {
	this.selInfo = this.list[0]
},
methods:{
	pageChange(type) {
		//左
		if(type == 0){
			if(this.index > 0){
				this.index -= 1
				this.opacity = 0
				this.playVoice()
			}
		}else{	//右
			if(this.index < this.list.length - 1){
				this.index += 1
				this.opacity = 0
				this.playVoice()
			}
		}
		setTimeout(()=>{
			this.opacity = 1
			this.selInfo = this.list[this.index]
		},500)
	},
	back() {
		uni.redirectTo({
			url: "/pages/index/index?isLogin=true"
		})
	},
	startNum() {
		let num = ''
		if(this.selInfo.levelNum >= 4 && this.selInfo.levelNum < 5){
			num = 2
		}
		if(this.selInfo.levelNum >= 5){
			num = 3
		}
		return num
	},
	playVoice() {
		if (this.innerAudioContext) {
			this.innerAudioContext.destroy()
			this.innerAudioContext = null
		}
		this.innerAudioContext = uni.createInnerAudioContext();
		this.innerAudioContext.volume = 0.5
		this.innerAudioContext.src = '../../static/sounds/tabChange.mp3'
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
}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	background: url('../../static/imgs/infoBg.jpeg');
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
	width: 330rpx;
	height: 330rpx;
	border-radius: 32rpx;
	box-shadow: 0px 0px 12rpx 8rpx #513300;
	transition: opacity 0.6s ease;
}
.nostar {
	position: relative;
	top: 80rpx;
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