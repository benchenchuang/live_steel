<template>
    <div>
        <div class="setter_box">
            <h2 class="title">设备设置</h2>
            <div class="setter_content">
                <el-table :inline="true" size="small"
                    ref="multipleTable"
                    border
                    :data="list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    label="序号"
                    type="index"
                    width="120"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="名称"
                    width="120"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="port"
                    label="串口号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="baud"
                    label="波特率"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="slave"
                    label="从站地址"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="desc"
                    label="备注"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center">
                    8   <template slot-scope="scope">
                            <el-button type="success" size="small" @click="editSetter(scope)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="setter_footer">
                <el-button type="danger" @click="deleteDevice">删除</el-button>
                <el-button type="success" @click="tableVisible=true">新增</el-button>
            </div>
        </div>

        <el-dialog :title="isEdit?'修改设备':'新增设备'" :visible.sync="tableVisible" center width="500px">
            <el-form :model="ruleForm" ref="ruleForm" inline label-width="140px">
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="串口号" prop="port">
                    <el-input type="text" v-model="ruleForm.port"></el-input>
                </el-form-item>
                <el-form-item label="波特率" prop="baud">
                    <el-input type="text" v-model="ruleForm.baud"></el-input>
                </el-form-item>
                <el-form-item label="从站地址" prop="slave">
                    <el-input type="text" v-model="ruleForm.slave"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="desc">
                    <el-input type="textarea" style="width:100%" v-model="ruleForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="submitInfo">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import requestApi from '@/request/index'
import {areaMixin} from '@/mixins/area'

let originForm = {
    name:'',
    baud:'',
    port:'',
    slave:'',
    desc:''
}

export default {
    name:'Setter',
    mixins:[areaMixin],
    data(){
        return{
            tableVisible:false,
            list:[],
            ruleForm:{...originForm},
            deleteBox:[],
            isEdit:false,
            eidtIndex:''
        }
    },
    created(){
        this.getDeviceList();
    },
    methods:{
        handleSelectionChange(e){
            this.deleteBox = e;
        },
        //修改
        editSetter(e){
            let index = e.$index;
            let item = JSON.parse(JSON.stringify(e.row));
            this.isEdit = true;
            this.eidtIndex = index;
            this.ruleForm = item;
            this.tableVisible = true;
        },
        //删除设备
        deleteDevice(){
            let deleteBox = this.deleteBox;
            let getList = JSON.parse(JSON.stringify(this.list));
            let list = [];
            if(!deleteBox.length){
                this.$message.error('未选择删除项');
                return false;
            }
            
            for(var i = 0; i < getList.length; i++){
                var obj = getList[i];
                var boxString = obj.name+obj.port+obj.baud+obj.slave;
                var flag = false;
                for(var j = 0; j < deleteBox.length; j++){
                    var aj = deleteBox[j];
                    var itemString = aj.name+aj.port+aj.baud+aj.slave;;
                    if(boxString == itemString){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    list.push(obj);
                }
            }

            requestApi.addDevice({device:list}).then(res=>{
                if(res.code==1000){
                    this.$message({
                        message: '恭喜你，删除成功',
                        type: 'success'
                    });
                    this.deleteBox = [];
                    this.list = [...list]
                }else{
                    this.$message.error('删除错误，请重试');
                }
            })
        },
        //提交表单信息
        submitInfo(){
            let query = JSON.parse(JSON.stringify(this.ruleForm));
            let list = this.list;
            let isEdit = this.isEdit;
            let editIndex = this.editIndex;
            if(!query.name){
                this.$message.error('请输入名称');
                return false;
            }
            if(!query.port){
                this.$message.error('请输入串口号');
                return false;
            }
            if(!query.baud){
                this.$message.error('请输入波特率');
                return false;
            }
            if(!query.slave){
                this.$message.error('请输入从站地址');
                return false;
            }
            if(isEdit){
                list[editIndex] = query;
            }else{
                list = [...list,query];
            }
            requestApi.addDevice({device:list}).then(res=>{
                if(res.code==1000){
                    let tipString = '恭喜你，添加成功'
                    if(isEdit){
                        tipString = '恭喜你，修改成功'
                    }
                    this.$message({
                        message: tipString,
                        type: 'success'
                    });
                    this.getDeviceList();
                    this.resetForm('ruleForm')
                }else{
                    this.$message.error('添加错误，请重试');
                }
            })

        },
        //获取信息
        getDeviceList(){
            requestApi.getDevice().then(res=>{
                if(res.code==1000){
                    this.list = res.data;
                }
            })
        },
        //表单重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.ruleForm = {...originForm}
            this.tableVisible = false;
        }
    }
}
</script>
<style lang="less" scoped>
.setter_box{
    font-size: 18px;
    margin: 20px auto;
    width:90%;
    padding: 15px;
    background: #0a346e;
    box-sizing: border-box;
    .title{
        font-size: 18px;
        color: #fff;
        font-weight: 500;
        margin-bottom: 20px;
    }
    .setter_content{
        background: #fff;
    }
    .setter_footer{
        padding: 20px 0;
        text-align: right;
    }
}
</style>