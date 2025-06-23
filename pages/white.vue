<template>  
    <view>  
        <!-- blank页面用来修复横竖屏切换后，字体变大问题 -->  
    </view>  
</template>  

<script>  
    export default {  
        data() {  
            return {  
				url: ''
            }  
        },  
        onLoad(options) {  
        // #ifdef APP-PLUS  
        plus.screen.lockOrientation("portrait");  
        // #endif     
		if(options){
			if(JSON.stringify(options) != '{}'){
				this.url = options
			}
		}
        },  
        onReady() {  
            setTimeout(()=>{
				if(this.url == ''){
					uni.redirectTo({
						url: "/pages/index/index?isLogin=true"
					})
				}else{
					if(this.url.beatHero){
						uni.redirectTo({
							url: "/pages/paiwei/index?beatHero="+this.url.beatHero+'&enemyBlood='+parseInt(this.url.enemyBlood)+'&enemy='+this.url.enemy+'&time='+this.url.time
						})
					}else if(this.url.beatEnemy){
						uni.redirectTo({
							url: "/pages/paiwei/index?beatEnemy="+this.url.beatEnemy+'&heroBlood='+parseInt(this.url.heroBlood)+'&hero='+this.url.hero+'&time='+this.url.time
						})
					}
				}
				
			},200)
        },  
        methods: {  

        }  
    }  
</script>  

<style>  
page{  

}  
</style>  