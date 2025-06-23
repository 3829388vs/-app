<template>
	<div class="container">
		请选择你的英雄排列（出场优先级从上到下）：
		<div class="role">
			<div class="roleFrame" style="color:#ff0000" @click="selRole(1)">
				<span v-if="!heros[0]">前锋队</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[0].icon"></image>
				</view>
			</div>
			<div class="roleFrame" style="color:#ff8b07" @click="selRole(2)">
				<span v-if="!heros[1]">后卫队</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[1].icon"></image>
				</view>
			</div>
			<div class="roleFrame" style="color:#00ff00" @click="selRole(3)">
				<span v-if="!heros[2]">守护大将军</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[2].icon"></image>
				</view>
			</div>
			<div class="roleFrame" style="color:#00aa00" @click="selRole(4)">
				<span v-if="!heros[3]">左右护法</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[3].icon"></image>
				</view>
			</div>
			<div class="roleFrame" style="color:#000000" @click="selRole(5)">
				<span v-if="!heros[4]">自己</span>
				<view v-else class="icon1">
					<image class="icon1Img" :src="'../../static/imgs/hero/'+heros[4].icon"></image>
				</view>
			</div>
		</div>
		<div>
			<button size="mini" type="primary" style="float: right;" @click="begin">开始</button>
		</div>
	</div>
</template>

<script>
import tallent from '@/components/tallent/index.vue'
import equipment from '@/components/equipment/index.vue'
import res from '../../static/data/challegeEnemy.json'
export default {
	data() {
		return {
			heros: [null,null,null,null,null]
		}
	},
	onLoad(option) {
		if(uni.getStorageSync('tiantiHero')){
			this.heros = JSON.parse(uni.getStorageSync('tiantiHero'))
		}
		if(JSON.stringify(option) != '{}'){
			this.heros[option.num-1] = JSON.parse(option.item)
			uni.setStorageSync('tiantiHero',JSON.stringify(this.heros))
		}
	},
	methods:{
		selRole(num){
			uni.redirectTo({
				url: "/pages/tianti/sel?num="+num
			})
		},
		begin() {
			uni.redirectTo({
				url: "/pages/play/load"
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		background: url('../../static/imgs/tianti1.jpeg');
		background-size: cover;
		background-repeat: no-repeat;
		box-sizing: border-box;
		text-align: center;
		font-size: 42rpx;
		padding: 20rpx;
		.role {
			width: 100%;
			height: 85%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding-top: 30rpx;
			.roleFrame {
				width: 160rpx;
				height: 160rpx;
				border-radius: 20rpx;
				background-color: rgba(255, 255, 255, 0.4);
				border: 6rpx solid rgba(15, 119, 255, 0.7);
				font-weight: bold;
				font-size: 34rpx;
				text-align: center;
			}
		}
		.icon1 {
			.icon1Img {
				width: 160rpx;
				height: 160rpx;
				border-radius: 12rpx;
			}
		}
	}

</style>