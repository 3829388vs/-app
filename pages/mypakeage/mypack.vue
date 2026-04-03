<template>
	<view class="container">
		<view class="close" @click="close"></view>
		<view class="money">
			￥{{allPrice}}
		</view>
		<view class="tools" v-if="myTool.length != 0">
			<image class="tools-item" @click="toolInfo(item)" v-for="(item,index) in myTool" :key="index"
			 :src="'../../static/imgs/mapObjs/'+item.img"></image>
		</view>
		<view class="toolInfo" v-if="nowToolInfo">
			【{{nowToolInfo.name}}】售价{{nowToolInfo.price}}元。{{nowToolInfo.detail}}
		</view>
	</view>
</template>

<script>
import { editMoney } from '../../utils/editUser'
export default {
	data() {
		return {
			myTool: [],
			nowToolInfo: null,
			allPrice: 0
		}
	},
	mounted() {
		this.getTools()
	},
	methods: {
		close() {
			uni.redirectTo({
				url: "/pages/mypakeage/index"
			})
		},
		getTools() {
			if(!uni.getStorageSync('tanxianPack')){
				uni.setStorageSync('tanxianPack',JSON.stringify([]))
			}else{
				this.allPrice = 0
				this.myTool = JSON.parse(uni.getStorageSync('tanxianPack'))
				this.myTool.forEach(item=>{
					this.allPrice = this.allPrice + parseInt(item.price)
				})
			}
		},
		// 单击或双击
		toolInfo(info) {
		  let _this = this;
		  let curTime = new Date().getTime();
		  let lastTime = _this.lastTapDiffTime;
		  _this.lastTapDiffTime = curTime;
		  //两次点击间隔小于300ms, 认为是双击
		  let diff = curTime - lastTime;
		  if (diff < 300) {
			  _this.nowToolInfo = {...info}
		   	uni.showModal({
		   		title: '提示',
		   		content: '是否要卖掉这件物品？',
		   		success: function (r) {
		   			if (r.confirm) {
						editMoney(parseInt(info.price))
						_this.myTool.forEach((item,index)=>{
							if(item.name == info.name && item.id == info.id){
								_this.myTool.splice(index,1)
							}
						})
		   				uni.setStorageSync('tanxianPack',JSON.stringify(_this.myTool))
						uni.showToast({
							title: '售卖成功！',
							duration: 1500
						});
						_this.nowToolInfo = null
						_this.getTools()
		   			} else if (r.cancel) {
		   				
		   			}
		   		}
		   	});
		   clearTimeout(_this.lastTapTimeoutFunc); // 成功触发双击事件时，取消单击事件的执行
		 } else {
		  // 单击事件延时300毫秒执行
		   _this.lastTapTimeoutFunc = setTimeout(function() {
		   	_this.nowToolInfo = {...info}
		   //_this.handleVideo('playOrStop',index)自定义事件
		   	}, 300);
		 } 			
		}
	},
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background: url('../../static/imgs/mapObjs/mypackage.jpg');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	box-sizing: border-box;
	.close {
		width: 100rpx;
		height: 130rpx;
		position: absolute;
		top: 15rpx;
		right: 0;
		z-index: 5;
	}
	.money {
		width: 250rpx;
		height: 90rpx;
		position: absolute;
		top: 60rpx;
		right: 190rpx;
		font-size: 38rpx;
		color: #ffed65;
	}
	.tools{
		position: absolute;
		width: 100%;
		left: 26rpx;
		top: 64rpx;
		display: flex;
		flex-wrap: wrap;
		.tools-item {
			width: 100rpx;
			height: 100rpx;
			margin-right: 46rpx;
			margin-top: 66rpx;
		}
		.tools-item:hover {
			border-radius: 12rpx;
			border: 2rpx solid #ffffff;
		}
	}
	.toolInfo {
		width: 98%;
		height: 110rpx;
		position: absolute;
		bottom: 0;
		left: 10rpx;
		font-size: 32rpx;
		color: #ef4b00;
	}
}
</style>