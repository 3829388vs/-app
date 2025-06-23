<template>
	<view class="container">
		<view class="main">
			<view class="top">
				<view class="topText">游戏商城</view>
			</view>
			<button v-if="gametype == 0" size="mini" class="back" @click="back">主页</button>
			<button v-if="gametype == 1" size="mini" class="back" @click="back">返回</button>
			<view class="content">
				<view style="display: flex;">
					<view style="padding: 0px 15px;font-size: 20px;">
					类型：<select v-model="type" style="font-size: 20px;width: 200rpx;">
							<option :value="0">英雄</option>
							<option :value="1">其他</option>
						</select>
					</view>
					<view style="padding-left: 50rpx;">
						<image class="core" src="../../static/imgs/core.png"></image>
						<span style="color: #ff7700;font-weight: bold;padding: 0rpx 10rpx;font-size: 36rpx;">{{myMoney}}</span>
					</view>
				</view>
				<view class="goods">
					<view class="item" v-for="item in goodList" :key="item.id">
						<view class="good" :id="item.id" @click="sel(item)">
							<image class="goodsImg" :src="'../../static/imgs/hero/'+item.icon"></image>
						</view>
						<view style="padding: 12rpx 0rpx;width: 134rpx;text-align: center;height: 60rpx;">{{item.name}}</view>
					</view>
				</view>
				<view class="buy">
					<button type="warn" @click="buy">购买(￥{{money}})</button>
				</view>
				<view class="bottom">
					<view>
						{{text}}
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import res from '../../static/data/goods.json'
import { editMoney } from '../../utils/editUser'
export default {
	data() {
		return {
			type: 0,
			goodList: [],
			text: '',
			money: 0,
			myMoney: 0,
			gametype: 0,	//是否在排位赛内
			userInfo: {
				name: '',
				passWord: '',
				money: 0,
				e: 0,
				lv: 1,
				pwlv: 1,
				pwE: 6
			},
			myStore: [],
			selItem: null
		}
	},
	onLoad(option) {
		if(option){
			if(option.type == 1){
				this.gametype = 1
			}
		}
		this.goodList = [...res.data]
		if(uni.getStorageSync('user')){
			this.userInfo = JSON.parse(uni.getStorageSync('user'))
			this.myMoney = this.userInfo.money
		}
		if(uni.getStorageSync('myStore')){
			this.myStore = JSON.parse(uni.getStorageSync('myStore'))
		}else{
			let store = []
			uni.setStorageSync('myStore',JSON.stringify(store));
		}
	},
	methods: {
		sel(item) {
			this.text = item.details
			this.money = item.price
			this.selItem = {...item}
		},
		back() {
			if(this.gametype == 0){
				uni.redirectTo({
					url: "/pages/index/index?isLogin=true"
				})
			}
			if(this.gametype == 1){
				uni.redirectTo({
					url: "/pages/paiwei/index?type=1"
				})
			}
		},
		buy() {
			let self = this
			uni.showModal({
				content: '确定购买此商品吗？',
				success: function (res) {
					if (res.confirm) {
						if(parseInt(self.myMoney)<self.selItem.price){
							uni.showToast({
								title: '金钱不足',
								icon:'none',
								duration: 1500
							});
						}else{
							self.myMoney = editMoney(-self.selItem.price)
							if(!self.selItem.isOther){
								self.selItem.buyTime = new Date().getTime()
							}
							let has = false
							self.myStore.map((i,d)=>{
								if(i.id == self.selItem.id && i.isOther){
									has = true
								}
								if(i.id == self.selItem.id && !i.isOther){
									self.myStore.splice(d,1)
								}
							})
							if(!has){
								self.myStore.push(self.selItem)
								uni.setStorageSync('myStore',JSON.stringify(self.myStore));
								uni.showToast({
									title: '购买成功！',
									icon:'success',
									duration: 1500
								});
							}else{
								uni.showToast({
									title: '该商品已存在',
									icon:'none',
									duration: 1500
								});
							}
						}
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background: url('../../static/imgs/storeBg.jpeg') no-repeat;
	background-size: 100% 100%;
	.main {
		width: 100%;
		height: 100%;
		.top {
			text-align: center;
			.topText {
				padding: 40rpx 0rpx;
				color: #ff3b0a;
				font-size: 52rpx;
				font-weight: bold;
				letter-spacing: 4rpx;
			}
		}
		.content {
			width: 100%;
			height: 70%;
		}
		.goods {
			width: 100%;
			height: 68%;
			overflow-y: auto;
			margin-top: 40rpx;
			padding: 0rpx 16rpx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			.item {
				width: 150rpx;
				height: 250rpx;
				margin: 12rpx 30rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.good {
				width: 150rpx;
				height: 150rpx;
				border-radius: 16rpx;
				box-shadow: #dab006 0rpx 0rpx 8rpx 2rpx;
			}
			.goodsImg {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
		.bottom {
			width: 100%;
			height: 200rpx;
			box-shadow: #505050 0rpx -8rpx 10rpx 0rpx;
			padding: 38rpx;
			font-size: 17px;
			box-sizing: border-box;
		}
		.buy {
			width: 320rpx;
			position: absolute;
			display: flex;
			bottom: 6%;
			right: 30rpx;
			z-index: 9;
		}
		.core {
			width: 50rpx;
			height: 50rpx;
		}
	}
	.back {
		position: absolute;
		top: 50rpx;
		left: 30rpx;
		width: 160rpx;
		z-index: 99;
	}
}
</style>