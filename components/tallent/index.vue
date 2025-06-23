<template>
	<view>
		<view class="flz" v-if="noflz">
			法力值不足
		</view>
	<view class="tallentItem" v-if="heroId == 1 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenQ.png"></image>
			<view class="itemText">致命打击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenW.png"></image>
			<view class="itemText">勇气</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenE.png"></image>
			<view class="itemText">审判</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenR.png"></image>
			<view class="itemText">德玛西亚正义</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 3 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://file.dahe.cn/image/gif/20201217/1608219103131164.gif"></image>
			<view class="itemText">武当太极拳</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://p3.itc.cn/images01/20200710/59842113d79f47b091bf58f7f32a7f07.jpeg"></image>
			<view class="itemText">打坐</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://n.sinaimg.cn/sinacn20111/114/w987h727/20181211/4c48-hpinrye0532239.jpg"></image>
			<view class="itemText">超级棒棒糖</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="../../static/imgs/hero/xlsbzIcon.jpeg"></image>
			<view class="itemText">降龙十八掌</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 2 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxLeapStrike.png"></image>
			<view class="itemText">跳斩</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxEmpowerTwo.png"></image>
			<view class="itemText">蓄力一击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxCounterStrike.png"></image>
			<view class="itemText">反击风暴</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxRApexForm.png"></image>
			<view class="itemText">武器大师</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 4 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/AlphaStrike.png"></image>
			<view class="itemText">突袭</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/Meditate.png"></image>
			<view class="itemText">坐禅</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/WujuStyle.png"></image>
			<view class="itemText">无极剑道</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/Highlander.png"></image>
			<view class="itemText">连暴击剑术</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 5 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaQ.png"></image>
			<view class="itemText">新月打击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaW.png"></image>
			<view class="itemText">苍白之瀑</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaE.png"></image>
			<view class="itemText">月神冲刺</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaR.png"></image>
			<view class="itemText">月之降临</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 6 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/NunuQ.png"></image>
			<view class="itemText">怒吼</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SejuaniR.png"></image>
			<view class="itemText">生灵召唤</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/FizzR.png"></image>
			<view class="itemText">撕咬</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/NamiR.png"></image>
			<view class="itemText">惊涛骇浪</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 7 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesQLineSpell.png"></image>
			<view class="itemText">点射</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesSmokeGrenade.png"></image>
			<view class="itemText">烟雾弹/手榴弹</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesMove.png"></image>
			<view class="itemText">换枪</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesChargeShot.png"></image>
			<view class="itemText">终极爆弹</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 8 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SowTheWind.png"></image>
			<view class="itemText">雷霆电击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/HowlingGale.png"></image>
			<view class="itemText">风形态</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EyeOfTheStorm.png"></image>
			<view class="itemText">汇风之力</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ReapTheWhirlwind.png"></image>
			<view class="itemText">龙卷飓风</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 9 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusCleave.png"></image>
			<view class="itemText">大杀四方</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusNoxianTacticsONH.png"></image>
			<view class="itemText">致残打击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusAxeGrabCone.png"></image>
			<view class="itemText">无情铁手</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusExecute.png"></image>
			<view class="itemText">断头台</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 10 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealQ.png"></image>
			<view class="itemText">秘术射击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealW.png"></image>
			<view class="itemText">精华跃动</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealE.png"></image>
			<view class="itemText">奥术跃迁</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealR.png"></image>
			<view class="itemText">精准弹幕</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 101 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingDoubleAttack.png"></image>
			<view class="itemText">粉碎打击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingDecoy.png"></image>
			<view class="itemText">分身术</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingNimbus.png"></image>
			<view class="itemText">腾云突击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingSpinToWin.png"></image>
			<view class="itemText">大闹天宫</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 102 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedQ.png"></image>
			<view class="itemText">诸刃</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedW.png"></image>
			<view class="itemText">分身</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedE.png"></image>
			<view class="itemText">鬼斩</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedR.png"></image>
			<view class="itemText">瞬狱影杀阵</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 11 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/KatarinaQ.png"></image>
			<view class="itemText">蝴蝶剑</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SyndraPassive.png"></image>
			<view class="itemText">环影魔能</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/IreliaQ.png"></image>
			<view class="itemText">暗影之袭</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/KatarinaR.png"></image>
			<view class="itemText">丽影之舞</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 12 && !noflz">
		<view class="item" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/BlindingDart.png"></image>
			<view class="itemText">致盲吹箭</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MoveQuick.png"></image>
			<view class="itemText">快速射击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ToxicShot.png"></image>
			<view class="itemText">毒性射击</view>
		</view>
		<view class="zw" v-else></view>
		<view class="item bigTel" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/TeemoRCast.png"></image>
			<view class="itemText">种蘑菇</view>
		</view>
		<view class="zw" v-else></view>
	</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tallentShow: true,
			tallentShow2: true,
			tallentShow3: true,
			tallentShow4: true,
		}
	},
	methods: {
		dmxyzl(type){
			if(type == 1){
				this.tallentShow = false
			}
			if(type == 2){
				this.tallentShow2 = false
			}
			if(type == 3){
				this.tallentShow3 = false
			}
			if(type == 4){
				this.tallentShow4 = false
			}
			let data = {
				name: this.name,
				type: type
			}
			this.$emit('tallent',JSON.stringify(data))
		}
	},
	props:{
		name:String,
		heroId: Number,
		noflz: Boolean
	}
}
</script>

<style lang="scss" scoped>
.tallentItem {
	width: 100%;
	padding: 10rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-around;
	.item {
		width: 120rpx;
		height: 120rpx;
		border-radius: 30rpx;
		border: 2rpx solid $main-color;
		.itemImg {
			width: 120rpx;
			height: 120rpx;
			border-radius: 30rpx;
		}
		.itemText {
			color: #ffed65;
			font-size: 28rpx;
			text-align: center;
		}
	}
	.bigTel {
		font-weight: bold;
		box-shadow: #ffaa00 0rpx 0rpx 26rpx 6rpx;
	}
	.zw {
		width: 124rpx;
		height: 124rpx;
	}
}
.flz {
	color: #ff4406;
	width: 100%;
	text-align: center;
	position: relative;
	top: 36rpx;
	font-size: 38rpx;
}
</style>