<template>
    <div class="login_wrap">
        <div class="login_box">
            <h2 class="title">设备监控系统</h2>
            <el-input type="text" placeholder="请输入激活码">
                <el-button slot="append" icon="el-icon-check">激活</el-button>
            </el-input>
        </div>
    </div>
</template>

<style lang="less" scoped>
.login_wrap{
    position: relative;
    width: 100%;
    height: 100vh;
    background: url('~@/assets/images/banner.jpeg') repeat;
    background-size: 100% 100%;
    .login_box{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 440px;
        text-align: center;
        transform: translate(-50%,-50%);
        .title{
            margin-bottom: 20px;
            font-size: 60px;
            color: #fff;
            font-weight: 500;
            letter-spacing: 10px;
        }
    }
}
</style>