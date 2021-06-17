<template>
    <div>
        <site-header><span>{{b_no}}#皮带详情</span></site-header>
        <div class="show_body flex">
            <div class="show_list">
                <div class="show_header flex" v-if="topBelt.length">
                        <div class="belt_item" v-for="(item,i) in topBelt" :key="i">
                            <p class="name">
                                {{item.d_no}}号{{item.d_type | filterBelt}} 
                                <img v-if="item.rtsp" @click="palyLive(item.rtsp)" :class="item.d2_state==0 && item.d1_state==0?'live_icon':'live_icon live_show'" src="@/assets/icon_live.png"/>
                            </p>
                            <div class="status_box flex">
                                <div class="flex_item">
                                    <span class="status no_status" v-if="item.d_state==2"></span>
                                    <span v-else :class="item.d1_state==0?'status none_status':'status warn_status'"></span>
                                </div>
                                <div class="flex_item">
                                    <span class="status no_status" v-if="item.d_state==2"></span>
                                    <span v-else :class="item.d2_state==0?'status none_status':'status warn_status'"></span>
                                </div>
                            </div>
                        </div>
                </div>
            </div>

            <div class="show_center flex">
                <div class="show_side flex">
                    <div class="belt_item" v-for="(item,i) in deviateTop" :key="i">
                        <p class="name">{{item.d_no}}号{{item.d_type | filterBelt}}
                            <img v-if="item.rtsp" @click="palyLive(item.rtsp)" :class="item.d2_state==0 && item.d1_state==0?'live_icon':'live_icon live_show'" src="@/assets/icon_live.png"/>
                        </p>
                        <div class="status_box flex">
                            <div class="flex_item">
                                <span class="status no_status" v-if="item.d_state==2"></span>
                                <span v-else :class="item.d1_state==0?'status none_status':'status warn_status'"></span>
                            </div>
                            <div class="flex_item">
                                <span class="status no_status" v-if="item.d_state==2"></span>
                                <span v-else :class="item.d2_state==0?'status none_status':'status warn_status'"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex_item show_direction">
                    <span>运行方向</span><i class="el-icon-right"></i>
                </div>

                <div class="show_side flex">
                    <div class="belt_item" v-for="(item,i) in deviateBottom" :key="i">
                        <div class="status_box flex">
                            <div class="flex_item">
                                <span class="status no_status" v-if="item.d_state==2"></span>
                                <span v-else :class="item.d1_state==0?'status none_status':'status warn_status'"></span>
                            </div>
                            <div class="flex_item">
                                <span class="status no_status" v-if="item.d_state==2"></span>
                                <span v-else :class="item.d2_state==0?'status none_status':'status warn_status'"></span>
                            </div>
                        </div>
                        <p class="name">{{item.d_no}}号{{item.d_type | filterBelt}} 
                            <img v-if="item.rtsp" @click="palyLive(item.rtsp)" :class="item.d2_state==0 && item.d1_state==0?'live_icon':'live_icon live_show'" src="@/assets/icon_live.png"/>
                        </p>
                    </div>
                </div>
            </div>

            <div class="show_list">
                <div class="show_footer flex" v-if="footBelt.length">
                        <div class="belt_item" v-for="(item,k) in footBelt" :key="k">
                            <div class="status_box flex">
                                <div class="flex_item">
                                    <span class="status no_status" v-if="item.d_state==2"></span>
                                    <span v-else :class="item.d1_state==0?'status none_status':'status warn_status'"></span>
                                </div>
                                <div class="flex_item">
                                    <span class="status no_status" v-if="item.d_state==2"></span>
                                    <span v-else :class="item.d2_state==0?'status none_status':'status warn_status'"></span>
                                </div>
                            </div>
                            <p class="name">{{item.d_no}}号{{item.d_type | filterBelt}}
                                <img v-if="item.rtsp" @click="palyLive(item.rtsp)" :class="item.d2_state==0 && item.d1_state==0?'live_icon':'live_icon live_show'" src="@/assets/icon_live.png"/>
                            </p>
                        </div>
                </div>
            </div>
        </div>
        <site-footer :isHome="true">
            <span class="status no_status">离线</span>
            <span class="status none_status">正常</span>
            <span class="status warn_status">报警</span>
        </site-footer>
    </div>
</template>
<script>
import SiteFooter from '@/components/footer'
import SiteHeader from '@/components/header'
import requestApi from '@/request/index'
const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();

var body = document.getElementsByTagName("body")[0];
var audioUrl = require('@/assets/alarm.wav');

export default {
    name:'Belt',
    inject: ["playVideoFile",'showVideo', 'playLive',"hideVideo"],
    components:{
        SiteFooter,
        SiteHeader
    },
    data(){
        return{
            audio:null,
            isPlay:false,
            timer:null,
            audioTimer:null,
            beltBox:[],
            topBelt:[],
            footBelt:[],
            deviateTop:[],
            deviateBottom:[],
            centerBelt:[],
            warnObject:'',
            isAutoCancel:false,
            b_no:'',
            audioUrl:'../../assets/3071.wav'
        }
    },
    created(){
        let b_no = this.$route.query.b_no;
        this.b_no = b_no;
        
        this.getBeltData()
        this.timer=setInterval(()=>{
            this.getBeltData();
        },2000)
    },
    methods:{
        /**播放直播 */
        palyLive(rtsp){
            this.playLive(rtsp)
        },
         /** 语音播报的函数*/
        handleSpeak(e){
            msg.text = e;
            msg.lang = 'zh-CN';
            msg.volume = '1';
            msg.rate = 1;
            msg.pitch = 2;
            synth.speak(msg);
        },
            /* * 语音停止  */
        handleStop(e){
            msg.text = e;
            msg.lang = 'zh-CN';
            synth.cancel(msg);
        },
        getBeltData(){
            let b_no = this.b_no;
            
            //  let allBelt = [
            //     {d_no: 1, d_type: 1, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 2, d_type: 1, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 3, d_type: 2, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 4, d_type: 2, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 5, d_type: 2, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 6, d_type: 2, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 7, d_type: 2, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 8, d_type: 2, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 9, d_type: 1, d_state: 1, d1_state: 0, d2_state: 0},
            //     {d_no: 10, d_type: 1, d_state: 1, d1_state: 0, d2_state: 0},
            // ]
            // this.beltBox = allBelt.filter(item=>item.d_type==1);
            // let allLen = this.beltBox.length;
            // this.centerBelt = allBelt.filter(item=>item.d_type!=1);
            // this.topBelt = [];
            // this.footBelt = [];
            // this.beltBox.map(item=>{
            //     if(item.d_no%2){//单数
            //         this.footBelt.push(item)
            //     }else{//双数
            //         this.topBelt.push(item)
            //     }
            // })
            // this.centerBelt.map(item=>{
            //     if(item.d_no%2){//单数
            //         this.deviateBottom.push(item)
            //     }else{//双数
            //         this.deviateTop.push(item)
            //     }
            // })
            
            //  {d_no: 1, d_type: 1, d_state: 1, d1_state: 0, d2_state: 0}
            requestApi.getBeltData({b_no}).then(res=>{
                if(res.code==1000){
                    let allBelt = res.data;
                    this.beltBox = allBelt.filter(item=>item.d_type==1);
                    let allLen = this.beltBox.length;
                    this.centerBelt = allBelt.filter(item=>item.d_type==2);
                    this.topBelt = [];
                    this.footBelt = [];
                    this.deviateTop = [];
                    this.deviateBottom = [];
                    this.beltBox.map(item=>{
                        if(item.d_no%2){//单数
                            this.footBelt.push(item)
                        }else{//双数
                            this.topBelt.push(item)
                        }
                    })
                    this.centerBelt.map(item=>{
                        if(item.d_no%2){//单数
                            this.deviateBottom.push(item)
                        }else{//双数
                            this.deviateTop.push(item)
                        }
                    })

                    let warnBox = res.data.filter(item=>item.d1_state==1 || item.d2_state==1 || item.d_state==2 || item.d_state==3);
                    let warnStr = '';
                    
                    if(warnBox.length){
                        this.isAutoCancel = true;
                        
                        warnBox.map((item,index)=>{
                            let warnString= '告警';
                            let beltType = '';
                            beltType = this.filterBelt(item.d_type)
                            if(item.d_state==2 || item.d_state==3){
                                warnString="离线"
                            }
                            if(index==warnBox.length-1){
                                warnStr+=item.d_no+'号'+beltType+warnString
                            }else{
                                warnStr+=item.d_no+'号'+beltType+warnString+' '
                            }
                        });

                        if (body.getElementsByTagName("audio").length <= 0) {
                            var audio = document.createElement("audio");
                            audio.setAttribute("id", "awardAudio");
                            audio.setAttribute("autoplay", true);
                            audio.setAttribute("loop", true);
                            audio.setAttribute("hidden", true);
                            audio.setAttribute("src", audioUrl);
                            body.appendChild(audio);
                        }
                        if(this.warnObject!=JSON.stringify(warnBox)){
                            this.$notify.closeAll();
                            this.warnObject = JSON.stringify(warnBox)
                            this.$notify.error({
                                title: '提示',
                                message: warnStr,
                                icon:'warn',
                                position: 'bottom-right',
                                duration: 0,
                                onClose:result=>{
                                    this.warnObject = '';
                                    // if(!this.isAutoCancel){//手动
                                    //     console.log('手动取消的')
                                    // }
                                },
                                onClick:res=>{
                                    this.$router.push({path:'/release'})
                                }
                            });
                        }
                        // this.handleSpeak(warnStr)
                    }else{
                        this.$notify.closeAll();
                        if (body.getElementsByTagName("audio").length > 0) {
                            var audio = body.getElementsByTagName("audio")[0]
                            body.removeChild(audio);
                        }
                    }
                    
                }
            })
        },
        filterBelt(type){
            switch(type){
                case 1:
                    return "拉绳开关";
                    break;
                case 2:
                    return "跑偏开关";
                    break;
                case 3:
                    return "防滑开关";
                    break;
                case 4:
                    return "堵料开关";
                    break;
                case 5:
                    return "堆料开关";
                    break;
                case 6:
                    return "撕裂开关";
                    break;
                case 7:
                    return "料流开关";
                    break;
                default:
                    return "未知"
            }
        }
    },
    filters:{
        filterBelt(type){
            switch(type){
                case 1:
                    return "拉绳开关";
                    break;
                case 2:
                    return "跑偏开关";
                    break;
                case 3:
                    return "防滑开关";
                    break;
                case 4:
                    return "堵料开关";
                    break;
                case 5:
                    return "堆料开关";
                    break;
                case 6:
                    return "撕裂开关";
                    break;
                case 7:
                    return "料流开关";
                    break;
                default:
                    // return "跑偏开关"
                    return "未知类型"
            }
        }
    },
    beforeDestroy(){
        if (body.getElementsByTagName("audio").length > 0) {
            var audio = body.getElementsByTagName("audio")[0]
            body.removeChild(audio);
        }
        this.$notify.closeAll();
        clearInterval(this.timer);
    }
}
</script>
<style lang="less" scoped>
.show_body{
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 48px;
    flex-direction: column;
}
.show_list{
    width: 100%;
    // height: 142px;
    .flex{
        justify-content: space-between;
    }
}
.show_center{
    width: 100%;
    flex: 1;
    -webkit-flex:1;
    min-height: 200px;
}
.show_center{
    margin: 0 20px;
    flex-direction: column;
    background: #a4bbd1;
    box-shadow: 0 1px 0 #c8daec inset, 0 1px 4px #5682ac;
    background: -webkit-linear-gradient(to bottom, #a4bbd1, #81a5c8);
    background: -moz-linear-gradient(to bottom, #a4bbd1, #81a5c8);
    background: -ms-linear-gradient(to bottom, #a4bbd1, #81a5c8);
    background: -o-linear-gradient(to bottom, #a4bbd1, #81a5c8);
    background: linear-gradient(to bottom, #a4bbd1, #81a5c8);
    // border: 1px solid #0a346e;
    .show_side{
        width: 100%;
        // margin: 0 60px;
        justify-content: space-between;
        // width: 160px;
    }
    .show_direction{
        font-size: 32px;
        color: #0a346e;
        justify-content: space-between;
        i{
            font-size: 56px;
            margin-right: 5px;
        }
    }
}
.belt_item{
    margin: 25px 5px;
    padding: 5px 0;
    text-align: center;
    font-size: 15px;
    color: #fff;
    min-width: 120px;
    max-width: 200px;
    background: #0a346e;
    border-radius: 4px;
    box-shadow: 0 1px 0 #80aae3 inset, 0 2px 2px #0c2343;
    background: -webkit-linear-gradient(to bottom, #1c5fbc, #06244e);
    background: -moz-linear-gradient(to bottom, #1c5fbc, #06244e);
    background: -ms-linear-gradient(to bottom, #1c5fbc, #06244e);
    background: -o-linear-gradient(to bottom, #1c5fbc, #06244e);
    background: linear-gradient(to bottom, #1c5fbc, #06244e);
    .live_icon{
        margin-left: 2px;
        width: 20px;
        vertical-align: -4px;
        cursor: pointer;
    }
    .live_show{
        animation: fade 600ms infinite;
        -webkit-animation: fade 600ms infinite;
    }
    .name{
        margin: 10px 0;
    }
    .status_box{
        margin: 10px 0;
        .status{
            display: inline-block;
            width: 28px;
            height: 28px;
            background: #aaa;
            border-radius: 20px;
            box-shadow: 0 0 4px 1px rgba(242,242,242,.2);
            &.none_status{
                background: #128c4f;
                box-shadow: 0 1px 0 #616a74 inset, 0 2px 2px #07341e;
                background: -webkit-linear-gradient(to bottom, #45f59d, #1a9457);
                background: -moz-linear-gradient(to bottom, #45f59d, #1a9457);
                background: -ms-linear-gradient(to bottom, #45f59d, #1a9457);
                background: -o-linear-gradient(to bottom, #45f59d, #1a9457);
                background: linear-gradient(to bottom, #45f59d, #1a9457);
            }
            &.do_status{
                background: #c37a2d;
                box-shadow: 0 1px 0 #616a74 inset, 0 2px 2px #46290b;
                background: -webkit-linear-gradient(to bottom, #d88329, #8f500d);
                background: -moz-linear-gradient(to bottom, #d88329, #8f500d);
                background: -ms-linear-gradient(to bottom, #d88329, #8f500d);
                background: -o-linear-gradient(to bottom, #d88329, #8f500d);
                background: linear-gradient(to bottom, #d88329, #8f500d);
                animation: fade 600ms infinite;
                -webkit-animation: fade 600ms infinite;
            }
            &.warn_status{
                background: #F56C6C;
                box-shadow: 0 1px 0 #616a74 inset, 0 2px 2px #620f0f;
                background: -webkit-linear-gradient(to bottom, #F56C6C, #ac2424);
                background: -moz-linear-gradient(to bottom, #F56C6C, #ac2424);
                background: -ms-linear-gradient(to bottom, #F56C6C, #ac2424);
                background: -o-linear-gradient(to bottom, #F56C6C, #ac2424);
                background: linear-gradient(to bottom, #F56C6C, #ac2424);
                animation: fade 600ms infinite;
                -webkit-animation: fade 600ms infinite;
            }
        }
    }
}
@keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.4;
    }
    to {
        opacity: 1.0;
    }
}

@-webkit-keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0.4;
    }
    to {
        opacity: 1.0;
    }
}
</style>