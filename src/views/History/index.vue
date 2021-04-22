<template>
    <div>
        <site-header><span>历史查看</span></site-header>
        <div class="history_box">
            <div>
                <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
                    <el-form-item label="皮带编号">
                        <el-select v-model="formInline.b_no" style="width:140px" placeholder="皮带编号">
                            <el-option label="全部" value="0"></el-option>
                            <el-option :label="belt.name" :value="belt.value" v-for="(belt,index) in selectBeltBox" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备类型">
                        <el-select v-model="formInline.d_type" style="width:140px" placeholder="设备类型">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="拉绳开关" value="1"></el-option>
                            <el-option label="跑偏开关" value="2"></el-option>
                            <el-option label="防滑开关" value="3"></el-option>
                            <el-option label="堵料开关" value="4"></el-option>
                            <el-option label="堆料开关" value="5"></el-option>
                            <el-option label="撕裂开关" value="6"></el-option>
                            <el-option label="料流开关" value="7"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备地址">
                        <el-input v-model="formInline.d_no" placeholder="请输入设备地址"></el-input>
                    </el-form-item>
                    <el-form-item label="事件类型">
                        <el-select v-model="formInline.e_type" style="width:140px" placeholder="事件类型">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="上线" value="1"></el-option>
                            <el-option label="离线" value="2"></el-option>
                            <el-option label="一级报警" value="3"></el-option>
                            <el-option label="一级报警恢复" value="4"></el-option>
                            <el-option label="二级报警" value="5"></el-option>
                            <el-option label="二级报警解除" value="6"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- <el-form-item label="设备类型">
                        <el-select v-model="formInline.d_type" style="width:140px" placeholder="设备类型">
                            <el-option label="皮带" value="1"></el-option>
                            <el-option label="综保仪" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备编号">
                        <el-select v-model="formInline.b_no" v-if="formInline.d_type==1" style="width:140px" placeholder="设备编号">
                            <el-option :label="belt" :value="belt" v-for="(belt,index) in beltBox" :key="index"></el-option>
                        </el-select>
                        <el-select v-model="formInline.b_no" v-if="formInline.d_type==2" style="width:140px" placeholder="设备编号">
                            <el-option :label="item" :value="item" v-for="(item,index) in deviceBox" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="事件类型">
                        <el-select v-model="formInline.e_type" style="width:140px" placeholder="事件类型">
                            <el-option label="告警" value="1"></el-option>
                            <el-option label="告警恢复" value="2"></el-option>
                            <el-option label="离线" value="3"></el-option>
                            <el-option label="离线恢复" value="4"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="事件时间" >
                        <el-date-picker
                            v-model="rangeTime"
                            type="datetimerange"
                            style="width:350px"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
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
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="d_no"
                        label="设备地址"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="d_type"
                        label="设备类型"
                        align="center"
                        min-width="80">
                        <template slot-scope="scope">
                            <span>{{ scope.row.d_type | filterDevice }}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                        prop="e_type"
                        label="事件类型"
                        align="center"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        label="视频回放"
                        align="center"
                        min-width="80">
                        <template v-if="scope.row.video_file" slot-scope="scope">
                            <el-button type="primary" size="mini" @click="playBackVideo(scope.row.video_file)">回放</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        label="是否确认"
                        align="center"
                        min-width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.ask==0?'未确认':'已确认'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="user"
                        label="操作人"
                        align="center"
                        min-width="100">
                    </el-table-column> -->
                    <el-table-column
                        prop="e_time"
                        align="center"
                        label="时间"
                        min-width="160">
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
        <site-footer :isHome="true"></site-footer>
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
            formInline: {
                d_type: '0',
                b_no: '0',
                d_no:0,
                e_type:'0',
                b_time:'',
                e_time:''
            },
            rangeTime:['',''],
            deviceBox:[],
            selectBeltBox:[],
            tableData:[],
            timer:null
        }
    },
    // watch:{
    //     'formInline.d_type':function(val,oldval){
    //         this.formInline.b_no = '';
    //     },
    // },
    created(){
        let nowDate = new Date().getTime();
        let preDate= new Date(nowDate - 24*60*60*1000).getTime();
        this.formInline.b_time = this.toSeconds(preDate);
        this.formInline.e_time = this.toSeconds(nowDate);
        this.rangeTime = [new Date(nowDate - 24*60*60*1000),new Date()]
        this.getHistory();
    },
    mounted(){
        this.getDevice();
    },
    methods:{
        playBackVideo(url){
            this.playVideoFile(url);
        },
        getHistory(){
            let query = this.formInline;
            requestApi.searchHistory(query).then(res=>{
                if(res.code==1000){
                    this.tableData = res.data;
                }
            })
        },
        //设备编号查询
        getDevice(){
            let maxNumber = 255;
            let newBox = [];
            for(let i=1;i<=255;i++){
                newBox.push({
                    name:i+'号',
                    value:i
                })
            }
            this.selectBeltBox = [...newBox];
        },
        //查询
        onSubmit(){
            let b_time = this.rangeTime[0]
            let e_time = this.rangeTime[1]
            b_time= b_time?this.toSeconds(b_time.getTime()):b_time;
            e_time= e_time?this.toSeconds(e_time.getTime()):e_time;
            this.formInline.b_time = this.toSeconds(this.rangeTime[0].getTime());
            this.formInline.e_time = this.toSeconds(this.rangeTime[1].getTime());
            this.getHistory();
        },
        toSeconds(minSeconds){
            return parseInt(minSeconds/1000)
        }
    },
    filters:{
        filterDevice(type){
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
                    return "上线";
                    break;
                case 2:
                    return '离线';
                    break;
                case 17:
                    return '开关1报警';
                    break;
                case 18:
                    return '一级报警恢复';
                    break;
                case 33:
                    return '开关2二级报警';
                    break;
                default:
                    return '二级报警解除'
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