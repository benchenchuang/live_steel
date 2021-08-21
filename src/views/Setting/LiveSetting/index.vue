<template>
    <div>
        <site-header>
        <span>监控设置</span>
        </site-header>
        <div class="setter_box">
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
                    width="50"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="名称"
                    width="120"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="ip"
                    label="IP"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="port"
                    label="端口号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="belt"
                    label="所属皮带"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="area"
                    label="监视区域"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="user"
                    label="用户"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="password"
                    label="密码"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="device"
                    label="设备"
                    align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.device.toString()}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center">
                        <template slot-scope="scope">
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
        <site-footer :isHome="true">
            <span></span>
            <!-- <span class="status no_status">失去连接</span>
            <span class="status none_status">连接正常</span> -->
        </site-footer>

        <el-dialog :title="isEdit?'修改':'新增'" :visible.sync="tableVisible" :before-close="closeDialog" center width="500px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" inline label-width="140px">
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                    <el-input type="text" v-model="ruleForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                    <el-input type="text" v-model="ruleForm.port"></el-input>
                </el-form-item>
                <el-form-item label="所属皮带" prop="belt">
                    <el-input type="number" v-model="ruleForm.belt"></el-input>
                </el-form-item>
                <el-form-item label="监视区域" prop="area">
                    <el-input type="text" v-model="ruleForm.area"></el-input>
                </el-form-item>
                <el-form-item label="用户" prop="user">
                    <el-input type="text" v-model="ruleForm.user"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="设备" prop="device">
                    <el-input style="width:100%" placeholder="多个设备请用英文逗号','分开" v-model="ruleForm.device"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">取 消</el-button>
                <el-button type="primary" @click="submitInfo('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import SiteFooter from '@/components/footer'
import SiteHeader from '@/components/header'
import requestApi from '@/request/index'
import {areaMixin} from '@/mixins/area'
let originForm = {
    name:'',
    ip:'',
    port:'',
    belt:'',
    area:'',
    user:'',
    password:'',
    device:''
}
export default {
    name:'Setter',
    mixins:[areaMixin],
    components:{
        SiteFooter,
        SiteHeader
    },
    data(){
        return{
            tableVisible:false,
            list:[],
            ruleForm:{...originForm},
            deleteBox:[],
            isEdit:false,
            eidtIndex:'',
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                ip: [
                    { required: true, message: '请输入ip地址', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '请输入端口号', trigger: 'blur' }
                ],
                belt: [
                    { required: true, message: '请输入所属皮带', trigger: 'blur' }
                ],
                area: [
                    { required: true, message: '请输入监视区域', trigger: 'blur' }
                ],
                user: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                device: [
                    { required: true, message: '请输入设备', trigger: 'blur' }
                ]
            }
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
            this.editIndex = index;
            item.device = item.device.toString();
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
                var boxString = obj.name+obj.ip+obj.port+obj.user;
                var flag = false;
                for(var j = 0; j < deleteBox.length; j++){
                    var aj = deleteBox[j];
                    var itemString = aj.name+aj.ip+aj.port+aj.user;
                    if(boxString == itemString){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    list.push(obj);
                }
            }

            requestApi.addLiveDevice({cameras:list}).then(res=>{
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
        submitInfo(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let query = JSON.parse(JSON.stringify(this.ruleForm));
                    let list = this.list;
                    let isEdit = this.isEdit;
                    let editIndex = this.editIndex;
                    
                    if(!Array.isArray(query.device)){
                        query.device = query.device.split(',');
                    }
                    // query.belt = Number(query.belt)
                    query.port = Number(query.port)
                    if(isEdit){
                        list[editIndex] = query;
                    }else{
                        list = [...list,query];
                    }
                    requestApi.addLiveDevice({cameras:list}).then(res=>{
                        if(res.code==1000){
                            let tipString = '恭喜你，添加成功'
                            if(isEdit){
                                tipString = '恭喜你，修改成功'
                            }
                            this.isEdit = false
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        //获取信息
        getDeviceList(){
            requestApi.getLiveDevice().then(res=>{
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
        },
        closeDialog(){
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
    .setter_content{
        background: #fff;
    }
    .setter_footer{
        padding: 20px 0;
        text-align: right;
    }
}
</style>