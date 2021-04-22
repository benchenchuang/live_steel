<template>
    <div>
        <site-header><span>警报解除</span></site-header>
        <div class="history_box">
            <div style="width:100%;overflow:auto">
                <el-table
                    :data="tableData"
                    border
                    size="small"
                    :fit="true">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="b_no"
                        label="皮带编号"
                        align="center"
                        min-width="30">
                        <template slot-scope="scope">
                            <span>{{ scope.row.b_no +'#' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="d_no"
                        label="设备地址"
                        align="center"
                        min-width="30">
                    </el-table-column>
                    
                    <el-table-column
                        prop="msg"
                        label="报警信息"
                        align="center"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">          
                        <template slot-scope="scope">
                            <el-button type="success" size="small" @click="release(scope)">解除警报</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div> -->
        </div>
        <site-footer :isHome="true"><div></div></site-footer>
    </div>
</template>
<script>
import SiteFooter from '@/components/footer'
import SiteHeader from '@/components/header'
import requestApi from '@/request/index'
import {areaMixin} from '@/mixins/area'

export default {
    name:'History',
    mixins:[areaMixin],
    components:{
        SiteFooter,
        SiteHeader
    },
    data(){
        return{
            tableData:[],
            releaseTimer:null
        }
    },
    created(){
        this.getAlarmList();
        this.releaseTimer=setInterval(()=>{
            this.getAlarmList();
        },5000)
    },
    methods:{
        //解除警报
        release(item){
            let index = item.$index;
            let {b_no,d_no} = item.row;
            requestApi.releaseAlarm({b_no,d_no}).then(res=>{
                if(res.code==1000){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    // this.tableData.splice(index,1)
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        //报警列表
        getAlarmList(){
            requestApi.getAlarmList().then(res=>{
                if(res.code==1000){
                    this.tableData = res.data.filter(item=>item.msg=="发生二级报警");
                }
            })
        },
        
    },
    beforeDestroy(){
        clearInterval(this.releaseTimer);
    },
    filters:{
        filterDevice(type){
            switch(type){
                case 1:
                    return "皮带";
                    break;
                case 2:
                    return '综保仪';
                    break;
                default:
                    return '无法确认'
            }
        },
        filterEvent(type){
            switch(type){
                case 1:
                    return "告警";
                    break;
                case 2:
                    return '告警恢复';
                    break;
                case 3:
                    return '离线';
                    break;
                default:
                    return '离线恢复'
            }
        },
        filterState(type){
            switch(type){
                case 1:
                    return "在线";
                    break;
                case 2:
                    return '离线';
                    break;
                case 17:
                    return '开关1报警';
                    break;
                case 18:
                    return '开关1恢复';
                    break;
                case 33:
                    return '开关2报警';
                    break;
                default:
                    return '开关2报警'
            }
        },
        filterDate(time){
            let newDate = new Date(time);
            let year = newDate.getFullYear();
            let month = toDouble(newDate.getMonth()+1);
            let day = toDouble(newDate.getDay());
            let hour = toDouble(newDate.getHours());
            let mintues = toDouble(newDate.getMinutes());
            let seconds = toDouble(newDate.getSeconds());
            return year+'-'+month+'-'+day+' '+hour+':'+mintues+':'+seconds
            function toDouble(m){
                return m<10?'0'+m:m;
            }
        }
    }
}
</script>
<style>
.el-form-item__label{
    color: #409eff!important;
}
</style>
<style lang="less" scoped>
.history_box{
    margin: 20px auto;
    width:90%;
    padding: 15px;
    background: #0a346e;
    box-sizing: border-box;
    .pagination{
        margin-top: 20px;
        text-align: right;
    }
}
</style>