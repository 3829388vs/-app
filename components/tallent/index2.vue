<template>
	<view>
		<view class="flz" v-if="noflz">
			法力值不足
		</view>
	<view class="tallentItem" v-if="heroId == 1 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenE.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GarenR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 3 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://file.dahe.cn/image/gif/20201217/1608219103131164.gif"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://p3.itc.cn/images01/20200710/59842113d79f47b091bf58f7f32a7f07.jpeg"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://n.sinaimg.cn/sinacn20111/114/w987h727/20181211/4c48-hpinrye0532239.jpg"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="../../static/imgs/hero/xlsbzIcon.jpeg"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 2 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxLeapStrike.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxEmpowerTwo.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxCounterStrike.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/JaxRApexForm.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 4 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/AlphaStrike.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/Meditate.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/WujuStyle.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/Highlander.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 5 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaE.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DianaR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 6 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/NunuQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SejuaniR.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/FizzR.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/NamiR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 7 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesQLineSpell.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesSmokeGrenade.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesMove.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/GravesChargeShot.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 8 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SowTheWind.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/HowlingGale.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EyeOfTheStorm.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ReapTheWhirlwind.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 9 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusCleave.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusNoxianTacticsONH.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusAxeGrabCone.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/DariusExecute.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 10 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealE.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/EzrealR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 101 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingDoubleAttack.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingDecoy.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingNimbus.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MonkeyKingSpinToWin.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 102 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedE.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ZedR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 11 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/KatarinaQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SyndraPassive.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/IreliaQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/KatarinaR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 12 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/BlindingDart.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/MoveQuick.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ToxicShot.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/TeemoRCast.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 13 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/52210.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/52200.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/52220.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/52230.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 14 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/TalonQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/TalonW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/passive/TalonP.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/TalonR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 15 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/SeismicShard.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/Obduracy.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/passive/Malphite_GraniteShield.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/UFSlash.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 16 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/519/51940.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/519/51920.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/519/51910.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/519/51930.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 17 && !noflz">
		<view class="item item1" :style="{opacity: 0.5}" v-if="tallentShow">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/14810.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/14800.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/14820.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/14830.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 18 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/BlindMonkQOne.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/BlindMonkWOne.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/BlindMonkEOne.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/BlindMonkRKick.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 19 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/UdyrQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/QuinnW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/QuinnQ.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/QuinnR.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 20 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/585/58500.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/585/58520.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/563/56330.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/519/51940.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 21 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/32010.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/lol/act/img/spell/ThreshW.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/52710.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/52700.png"></image>
		</view>
		<view class="zw" v-else></view>
	</view>
	<view class="tallentItem" v-if="heroId == 22 && !noflz">
		<view class="item item1" :style="{opacity: dist > disList[0]? 0.5 : 1}" v-if="tallentShow" @click="dmxyzl(1)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/544/54400.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item2" :style="{opacity: dist > disList[1]? 0.5 : 1}" v-if="tallentShow2" @click="dmxyzl(2)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/544/54410.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item3" :style="{opacity: dist > disList[2]? 0.5 : 1}" v-if="tallentShow3" @click="dmxyzl(3)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/544/54420.png"></image>
		</view>
		<view class="zw" v-else></view>
		<view class="item item4 bigTel" :style="{opacity: dist > disList[3]? 0.5 : 1}" v-if="tallentShow4" @click="dmxyzl(4)">
			<image class="itemImg" src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/544/54430.png"></image>
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
				if(this.dist <= this.disList[0]){
					this.tallentShow = false
				}else{
					uni.showToast({
						title: '技能距离不够',
						icon:'none',
						duration: 800
					});
					return
				}
			}
			if(type == 2){
				if(this.dist <= this.disList[1]){
					this.tallentShow2 = false
				}else{
					uni.showToast({
						title: '技能距离不够',
						icon:'none',
						duration: 800
					});
					return
				}
			}
			if(type == 3){
				if(this.dist <= this.disList[2]){
					this.tallentShow3 = false
				}else{
					uni.showToast({
						title: '技能距离不够',
						icon:'none',
						duration: 800
					});
					return
				}
			}
			if(type == 4){
				if(this.dist <= this.disList[3]){
					this.tallentShow4 = false
				}else{
					uni.showToast({
						title: '技能距离不够',
						icon:'none',
						duration: 800
					});
					return
				}
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
		noflz: Boolean,
		disList: Array,
		dist: Number
	}
}
</script>

<style lang="scss" scoped>
.tallentItem {
	width: 100%;
	.item1 {
		position: absolute;
		right: 210rpx;
		bottom: 0rpx;
	}
	.item2 {
		position: absolute;
		right: 180rpx;
		bottom: 100rpx;
	}
	.item3 {
		position: absolute;
		right: 110rpx;
		bottom: 180rpx;
	}
	.item4 {
		position: absolute;
		right: 0rpx;
		bottom: 210rpx;
	}
	.item {
		width: 86rpx;
		height: 86rpx;
		border-radius: 100%;
		box-shadow: 0rpx 0rpx 6rpx 8rpx rgba(255, 170, 0, 0.3);
		.itemImg {
			width: 86rpx;
			height: 86rpx;
			border-radius: 100%;
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