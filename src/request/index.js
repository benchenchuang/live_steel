import * as axiosApi from './axios'

export default{
    //首页总貌展示
    getArea:()=>axiosApi.getAxios('v1.0/area'),
    //皮带实时数据展示
    getBeltData:(params)=>axiosApi.getAxios('v1.0/belt',params),
    //历史事件查询
    searchHistory:(params)=>axiosApi.getAxios('v1.0/event',params),
    //七．设备编号查询
    // getDevice:()=>axiosApi.getAxios('v1.0/device'),
    //通信状态查询
    netsState:()=>axiosApi.getAxios('v1.0/netstate'),
    //报警查询
    getAlarmList:()=>axiosApi.getAxios('v1.0/alarm'),
    //解除报警
    releaseAlarm:(params)=>axiosApi.postAixos('v1.0/alarm',params),
    //增改设备
    addDevice:(params)=>axiosApi.postAixos('v1.0/device_rtu',params),
    //查询设备
    getDevice:()=>axiosApi.getAxios('v1.0/device_rtu'),
    //增改监控
    addLiveDevice:(params)=>axiosApi.postAixos('v1.0/camera',params),
    getLiveDevice:()=>axiosApi.getAxios('v1.0/camera'),
    //启动转码
    startTransLive:(params)=>axiosApi.postAixos('transcode/v1.0/start',params,'code'),
    //结束转码
    stopTransLive:(params)=>axiosApi.postAixos('transcode/v1.0/stop',params,'code'),
}