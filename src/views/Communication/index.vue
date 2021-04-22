<template>
    <div>
        <site-header>
            <span>通信状态</span>
        </site-header>
        <div class="communication_box">
            <el-row class="communication_item communication_head" :gutter="20">
                <el-col :span="6" :offset="2">设备</el-col>
                <el-col :span="6" :offset="2">从站地址</el-col>
                <el-col :span="6" :offset="2">状态</el-col>
            </el-row>
            <div v-for="(device,index) in netsState.device" :key="index">
                <el-row class="communication_item" :gutter="20" >
                    <el-col :span="6" :offset="2">{{device.d_no}}综保仪</el-col>
                    <el-col :span="6" :offset="2">{{device.address}}</el-col>
                    <el-col :span="6" :offset="2">
                        <span class="status off_line" v-if="device.d_state==2"></span>
                        <span class="status on_line" v-else></span>
                    </el-col>
                </el-row>
                <el-row class="communication_item" :gutter="20" v-for="(belt,i) in device.belt" :key="i+'_belt'">
                    <el-col class="item_child" :span="6" :offset="2">{{belt.b_no}}号皮带</el-col>
                    <el-col :span="6" :offset="2">&nbsp;&nbsp;</el-col>
                    <el-col :span="6" :offset="2">
                        <span class="status off_line" v-if="belt.b_state==2"></span>
                        <span class="status on_line" v-else></span>
                    </el-col>
                </el-row>
            </div>
            <!-- <el-row class="communication_item" :gutter="20">
                <el-col :span="6" :offset="6">2#综保仪</el-col>
                <el-col :span="6" :offset="6"><span class="status on_line"></span></el-col>
            </el-row>
            <el-row class="communication_item" :gutter="20">
                <el-col class="item_child" :span="6" :offset="6">2#皮带</el-col>
                <el-col :span="6" :offset="6"><span class="status on_line"></span></el-col>
            </el-row>
            <el-row class="communication_item" :gutter="20">
                <el-col class="item_child" :span="6" :offset="6">2#皮带</el-col>
                <el-col :span="6" :offset="6"><span class="status on_line"></span></el-col>
            </el-row> -->
        </div>
        <site-footer :isHome="true">
            <span class="status no_status">离线</span>
            <span class="status none_status">在线</span>
        </site-footer>
    </div>
</template>
<script>
import SiteFooter from '@/components/footer'
import SiteHeader from '@/components/header'
import requestApi from '@/request/index'
import {areaMixin} from '@/mixins/area'

export default {
    name:'Communication',
    mixins:[areaMixin],
    components:{
        SiteFooter,
        SiteHeader
    },
    data(){
        return{
            netsState:[],
            communicationTimer:null
        }
    },
    created(){
        this.getNetState();
        this.communicationTimer=setInterval(()=>{
            this.getNetState();
        },5000)
    },
    methods:{
        getNetState(){
            requestApi.netsState().then(res=>{
                if(res.code==1000){
                    this.netsState = res.data;
                }
            })
        },
//         0: {d_no: "1", address: 1, d_state: 1,…}
// 1: {d_no: "2", address: 2, d_state: 1, belt: [{b_no: 2, b_state: 2}, {b_no: 10, b_state: 2}]}
// 2: {d_no: "3", address: 3, d_state: 1, belt: [{b_no: 3, b_state: 1}]}
// 3: {d_no: "4", address: 4, d_state: 1, belt: [{b_no: 4, b_state: 2}]}
// 4: {d_no: "5", address: 5, d_state: 1, belt: [{b_no: 5, b_state: 2}]}
// 5: {d_no: "6", address: 6, d_state: 1, belt: [{b_no: 6, b_state: 2}]}
// 6: {d_no: "7", address: 7, d_state: 1, belt: [{b_no: 7, b_state: 2}]}
// 7: {d_no: "8", address: 8, d_state: 1, belt: [{b_no: 8, b_state: 2}]}
    },
    beforeDestroy(){
        clearInterval(this.communicationTimer);
    },
}
</script>
<style lang="less" scoped>
.communication_box{
    font-size: 18px;
    margin: 20px auto;
    width:90%;
    padding: 15px;
    color: #409cf3;
    background: #0a346e;
    box-sizing: border-box;
    .communication_head{
        color: #fff;
    }
    .communication_item{
        margin:15px 0;
        font-size: 14px;
    }
    .item_child{
        text-indent: 20px;
    }
    .status{
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background: #aaa;
        box-shadow: 0 1px 0 #aaa inset, 0 2px 2px #333;
        background: -webkit-linear-gradient(to bottom, #aaa, #666);
        background: -moz-linear-gradient(to bottom, #aaa, #666);
        background: -ms-linear-gradient(to bottom, #aaa, #666);
        background: -o-linear-gradient(to bottom, #aaa, #666);
        background: linear-gradient(to bottom, #aaa, #666);
        &.on_line{
            background: #128c4f;
            box-shadow: 0 1px 0 #45f59d inset, 0 2px 2px #07341e;
            background: -webkit-linear-gradient(to bottom, #45f59d, #1a9457);
            background: -moz-linear-gradient(to bottom, #45f59d, #1a9457);
            background: -ms-linear-gradient(to bottom, #45f59d, #1a9457);
            background: -o-linear-gradient(to bottom, #45f59d, #1a9457);
            background: linear-gradient(to bottom, #45f59d, #1a9457);
        }
    }
}
</style>