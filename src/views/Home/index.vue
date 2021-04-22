<template>
    <div>
        <home-header></home-header>
        <div class="home_box flex">
            <router-link :to="{name:'belt',query:{'b_no':item.b_no}}" v-for="(item,index) in beltBox" :key="index" class="belt">
                <div class="belt_item no_status flex" v-if="item.b_state==0">
                    <span class="rank">{{item.b_no}}#</span>
                    <span class="flex_item">皮带</span>
                </div>
                <div class="belt_item undo_status flex" v-else-if="item.b_state==1">
                    <span class="rank">{{item.b_no}}#</span>
                    <span class="flex_item">皮带</span>
                </div>
                <div class="belt_item do_status flex" v-else-if="item.b_state==2">
                    <span class="rank">{{item.b_no}}#</span>
                    <span class="flex_item">皮带</span>
                </div>
                <div class="belt_item warn_status flex" v-else>
                    <span class="rank">{{item.b_no}}#</span>
                    <span class="flex_item">皮带</span>
                </div>
            </router-link>
        </div>
        <home-footer></home-footer>
    </div>
</template>
<script>
import HomeFooter from '@/components/footer'
import HomeHeader from '@/components/header'
import requestApi from '@/request/index'
import {areaMixin} from '@/mixins/area'

export default {
    name:"Home",
    mixins:[areaMixin],
    components:{
        HomeFooter,
        HomeHeader
    },
    data(){
        return{
            timer:null,
            beltBox:[],
            warnObject:'',
            isAutoCancel:false
        }
    },
}
</script>
<style lang="less" scoped>
.home_box{
    width: 100%;
    margin:20px 0;
    flex-wrap: wrap;
    .belt{
        width: 20%;
    }
    .belt_item{
        position: relative;
        margin: 20px;
        height: 48px;
        line-height: 48px;
        font-size: 18px;
        color: #fff;
        justify-content: center;
        padding: 0 8px;
        border-radius: 36px;
        box-sizing: border-box;
        .live_icon{
            margin-left: 2px;
            width: 20px;
            vertical-align: -4px;
        }
        .live_show{
            animation: fade 600ms infinite;
            -webkit-animation: fade 600ms infinite;
        }
        .rank{
            // position: absolute;
            // left: 8px;
            // top: 6px;
            margin-right: 10px;
            display: inline-block;
            padding: 0 10px;
            height: 36px;
            line-height: 36px;
            border-radius: 36px;
        }
        &.no_status{
            background: #aaa;
            box-shadow: 0 1px 0 #aaa inset, 0 2px 2px #333;
            background: -webkit-linear-gradient(to bottom, #aaa, #666);
            background: -moz-linear-gradient(to bottom, #aaa, #666);
            background: -ms-linear-gradient(to bottom, #aaa, #666);
            background: -o-linear-gradient(to bottom, #aaa, #666);
            background: linear-gradient(to bottom, #aaa, #666);
            .rank{
                background: #666;
            }
        }
        &.undo_status{
            background: #128c4f;
            box-shadow: 0 1px 0 #45f59d inset, 0 2px 2px #07341e;
            background: -webkit-linear-gradient(to bottom, #45f59d, #1a9457);
            background: -moz-linear-gradient(to bottom, #45f59d, #1a9457);
            background: -ms-linear-gradient(to bottom, #45f59d, #1a9457);
            background: -o-linear-gradient(to bottom, #45f59d, #1a9457);
            background: linear-gradient(to bottom, #45f59d, #1a9457);
            .rank{
                background: #07522d;
            }
        }
        &.do_status{
            background: #c37a2d;
            box-shadow: 0 1px 0 #d88329 inset, 0 2px 2px #46290b;
            background: -webkit-linear-gradient(to bottom, #d88329, #8f500d);
            background: -moz-linear-gradient(to bottom, #d88329, #8f500d);
            background: -ms-linear-gradient(to bottom, #d88329, #8f500d);
            background: -o-linear-gradient(to bottom, #d88329, #8f500d);
            background: linear-gradient(to bottom, #d88329, #8f500d);
            .rank{
                background: #905415;
            }
        }
        &.warn_status{
            background: #F56C6C;
            box-shadow: 0 1px 0 #F56C6C inset, 0 2px 2px #620f0f;
            background: -webkit-linear-gradient(to bottom, #F56C6C, #ac2424);
            background: -moz-linear-gradient(to bottom, #F56C6C, #ac2424);
            background: -ms-linear-gradient(to bottom, #F56C6C, #ac2424);
            background: -o-linear-gradient(to bottom, #F56C6C, #ac2424);
            background: linear-gradient(to bottom, #F56C6C, #ac2424);
            .rank{
                background: #bf1d1d;
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