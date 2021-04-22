<template>
    <div class="site_footer">
        <div class="footer_fixed flex">
            <div class="tip_box flex_item">
                <slot>
                    <span class="status no_status">皮带离线</span>
                    <span class="status none_status">正常</span>
                    <span class="status do_status">地址编码器离线</span>
                    <span class="status warn_status">报警</span>
                </slot>
            </div>
            <div class="home_controls flex">
                <router-link :to="{name:'home'}" v-if="isHome" class="btn btn_home">主菜单</router-link>
                <router-link :to="{name:'lives'}" class="btn btn_live">实时监控</router-link>
                <router-link :to="{name:'release'}" class="btn btn_success">警报解除</router-link>
                <router-link :to="{name:'history'}" class="btn btn_log">历史查看</router-link>
                <router-link :to="{name:'communication'}" class="btn btn_status">通信状态</router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'HomeFooter',
    props:{
        isHome:{
            type:Boolean,
            default:false
        }
    }
}
</script>
<style lang="less" scoped>
.site_footer{
    width: 100%;
    height: 48px;
    .footer_fixed{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 48px;
        border-top: 1px solid #163d74;
        box-sizing: border-box;
        z-index: 9;
        background: #09397a;
        box-shadow: 0 1px 0 #4275bc inset, 0 2px 2px #041b3a;
        background: -webkit-linear-gradient(to bottom, #09397a, #062b5d);
        background: -moz-linear-gradient(to bottom, #09397a, #062b5d);
        background: -ms-linear-gradient(to bottom, #09397a, #062b5d);
        background: -o-linear-gradient(to bottom, #09397a, #062b5d);
        background: linear-gradient(to bottom, #09397a, #062b5d);
        .tip_box{
            margin-left: 20px;
            font-size: 13px;
            .status{
                position: relative;
                margin: 0 20px;
                &::before{
                    content: '';
                    position: absolute;
                    left: -26px;
                    top: 50%;
                    transform: translateY(-50%);
                    -webkit-transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    border-radius: 100%;
                    background: #aaa;
                    
                }
                &.no_status{
                    color: #aaa;
                    &::before{
                        background: #aaa;
                        box-shadow: 0 1px 0 #aaa inset, 0 2px 2px #333;
                        background: -webkit-linear-gradient(to bottom, #aaa, #666);
                        background: -moz-linear-gradient(to bottom, #aaa, #666);
                        background: -ms-linear-gradient(to bottom, #aaa, #666);
                        background: -o-linear-gradient(to bottom, #aaa, #666);
                        background: linear-gradient(to bottom, #aaa, #666);
                    }
                }
                &.none_status{
                    color: #128c4f;
                    &::before{
                        background: #128c4f;
                        box-shadow: 0 1px 0 #45f59d inset, 0 2px 2px #07341e;
                        background: -webkit-linear-gradient(to bottom, #45f59d, #1a9457);
                        background: -moz-linear-gradient(to bottom, #45f59d, #1a9457);
                        background: -ms-linear-gradient(to bottom, #45f59d, #1a9457);
                        background: -o-linear-gradient(to bottom, #45f59d, #1a9457);
                        background: linear-gradient(to bottom, #45f59d, #1a9457);
                    }
                }
                &.do_status{
                    color: #c37a2d;
                    &::before{
                        background: #c37a2d;
                        box-shadow: 0 1px 0 #d88329 inset, 0 2px 2px #46290b;
                        background: -webkit-linear-gradient(to bottom, #d88329, #8f500d);
                        background: -moz-linear-gradient(to bottom, #d88329, #8f500d);
                        background: -ms-linear-gradient(to bottom, #d88329, #8f500d);
                        background: -o-linear-gradient(to bottom, #d88329, #8f500d);
                        background: linear-gradient(to bottom, #d88329, #8f500d);
                    }
                }
                &.warn_status{
                    color: #F56C6C;
                    &::before{
                        background: #F56C6C;
                        box-shadow: 0 1px 0 #F56C6C inset, 0 2px 2px #620f0f;
                        background: -webkit-linear-gradient(to bottom, #F56C6C, #ac2424);
                        background: -moz-linear-gradient(to bottom, #F56C6C, #ac2424);
                        background: -ms-linear-gradient(to bottom, #F56C6C, #ac2424);
                        background: -o-linear-gradient(to bottom, #F56C6C, #ac2424);
                        background: linear-gradient(to bottom, #F56C6C, #ac2424);
                    }
                }
            }
        }
        .home_controls{
            a{
                margin: 0 2px;
            }
            .btn{
                height: 36px;
                line-height: 36px;
                width: 100px;
                text-align: center;
                font-size: 13px;
                border-radius: 4px;
                cursor: pointer;
                &.btn_home{
                    color: #fff;
                    background: #008bf8;
                    box-shadow: 0 1px 0 #99c1e1 inset, 0 2px 2px #063457;
                    background: -webkit-linear-gradient(to bottom, #008bf8, #064c83);
                    background: -moz-linear-gradient(to bottom, #008bf8, #064c83);
                    background: -ms-linear-gradient(to bottom, #008bf8, #064c83);
                    background: -o-linear-gradient(to bottom, #008bf8, #064c83);
                    background: linear-gradient(to bottom, #008bf8, #064c83);
                }
                &.btn_success{
                    color: #f0f9eb;
                    background: #128c4f;
                    box-shadow: 0 1px 0 #94d3b4 inset, 0 2px 2px #062e1a;
                    background: -webkit-linear-gradient(to bottom, #128c4f, #094c2a);
                    background: -moz-linear-gradient(to bottom, #128c4f, #094c2a);
                    background: -ms-linear-gradient(to bottom, #128c4f, #094c2a);
                    background: -o-linear-gradient(to bottom, #128c4f, #094c2a);
                    background: linear-gradient(to bottom, #128c4f, #094c2a);
                }
                &.btn_log{
                    color: #ecf5ff;
                    background: #c37a2d;
                    box-shadow: 0 1px 0 #d8b897 inset, 0 2px 2px #341e07;
                    background: -webkit-linear-gradient(to bottom, #c37a2d, #5f360a);
                    background: -moz-linear-gradient(to bottom, #c37a2d, #5f360a);
                    background: -ms-linear-gradient(to bottom, #c37a2d, #5f360a);
                    background: -o-linear-gradient(to bottom, #c37a2d, #5f360a);
                    background: linear-gradient(to bottom, #c37a2d, #5f360a);
                }
                &.btn_status{
                    color: #fdf6ec;
                    background: #19479c;
                    box-shadow: 0 1px 0 #8ea8d7 inset, 0 2px 2px #081e47;
                    background: -webkit-linear-gradient(to bottom, #3f75d9, #19479c);
                    background: -moz-linear-gradient(to bottom, #3f75d9, #19479c);
                    background: -ms-linear-gradient(to bottom, #3f75d9, #19479c);
                    background: -o-linear-gradient(to bottom, #3f75d9, #19479c);
                    background: linear-gradient(to bottom, #3f75d9, #19479c);
                }
                &.btn_live{
                    color: #fdf6ec;
                    background: #7c20b0;
                    box-shadow: 0 1px 0 #dcb3f4 inset, 0 2px 2px #7c20b0;
                    background: -webkit-linear-gradient(to bottom, #7d439e, #7c20b0);
                    background: -moz-linear-gradient(to bottom, #7d439e, #7c20b0);
                    background: -ms-linear-gradient(to bottom, #7d439e, #7c20b0);
                    background: -o-linear-gradient(to bottom, #7d439e, #7c20b0);
                    background: linear-gradient(to bottom, #7d439e, #7c20b0);
                }
            }
        }
    }
}
</style>