export function editMoney(money) {
	let userInfo = JSON.parse(uni.getStorageSync('user'))
	if(userInfo.money + money < 0){
		uni.showToast({
			title: '金钱不足！',
			icon:'none',
			duration: 2000
		});
		return false
	}else{
		userInfo.money += money
		uni.setStorageSync('user',JSON.stringify(userInfo))
		return parseInt(userInfo.money)
	}
}
