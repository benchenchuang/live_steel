<template>
    <div class="site_header">
        <div class="header_box flex">
            <!-- <router-link :to="{name:'home'}"><img class="logo" :src="logoUrl"/></router-link> -->
            <h2 class="head">
                <slot>
                    <span>皮带监控</span>
                </slot>
            </h2>
            <div class="flex_item header_info flex">
                <!-- <span class="info_item setting"><i class="el-icon-s-tools"></i></span>
                <span @click="drawer=true" class="info_item message"><i class="el-icon-message-solid"></i></span> -->
                <span class="info_item time">{{currentTime}}</span>
                <el-dropdown>
                    <span class="el-dropdown-link setting"><i class="el-icon-s-tools"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><router-link :to="{name:'beltSetting'}">设备设置</router-link></el-dropdown-item>
                        <el-dropdown-item><router-link :to="{name:'liveSetting'}">监控设置</router-link></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-drawer
            title="提示消息"
            :visible.sync="drawer"
            :with-header="false">
            <span>我来啦!</span>
        </el-drawer>
    </div>
</template>
<script>
export default {
    name:'HomeHeader',
    data(){
        return{
            logoUrl:require('@/assets/images/logo.png'),
            timer: "",//定义一个定时器的变量
            currentTime: new Date(), // 获取当前时间
            drawer:false,
        }
    },
    created() {
        this.getCurrentTime();
        this.timer = setInterval(()=>{
            this.getCurrentTime();
        }, 1000);
    },
    methods:{
        appendZero(num) {
            return num<10?'0'+num:num
        },
        getCurrentTime(){
            let nowDate = new Date();
            this.currentTime = nowDate.getFullYear() +
            "/" +
            this.appendZero(nowDate.getMonth() + 1) +
            "/" +
            this.appendZero(nowDate.getDate()) +
            " " +
            this.appendZero(nowDate.getHours()) +
            ":" +
            this.appendZero(nowDate.getMinutes()) +
            ":" +
            this.appendZero(nowDate.getSeconds());
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
</script>
<style lang="less" scoped>
.site_header{
    width: 100%;
    height: 54px;
    .header_box{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 54px;
        padding: 0 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #0f3687;
        z-index: 9;
        box-sizing: border-box;
        background: #09397a;
        box-shadow: 0 1px 0 #4275bc inset, 0 2px 2px #041b3a;
        background: -webkit-linear-gradient(to bottom, #09397a, #062b5d);
        background: -moz-linear-gradient(to bottom, #09397a, #062b5d);
        background: -ms-linear-gradient(to bottom, #09397a, #062b5d);
        background: -o-linear-gradient(to bottom, #09397a, #062b5d);
        background: linear-gradient(to bottom, #09397a, #062b5d);
        .head{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            -webkit-transform: translate(-50%,-50%);
            font-size: 24px;
            color: #409cf3;
            font-weight: 500;
            letter-spacing: 4px;
        }
        .logo{
            width: 450px;
        }
        .header_info{
            flex-direction: row-reverse;
            .info_item{
                margin: 0 10px;
            }
            .time{
                font-size: 12px;
                color: #409cf3;
            }
            .message{
                font-size: 22px;
                color: rgb(245, 108, 108);
            }
            .setting{
                font-size: 22px;
                color: rgb(64, 158, 255);
                
            }
        }
    }
}
.el-dropdown-menu a{
                    color: #0f3687;
                }
</style>