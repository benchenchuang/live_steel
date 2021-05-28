<template>
  <div v-divDrag class="live_modal drag-body" v-if="true">
    <div v-for="(item, index) in alarmBox" :key="item.id">
      <div class="live_item " v-if="item.show">
        <div class="live_item_info flex">
          <p class="flex_item">
            #{{ item.b_no }}号皮带#{{ item.d_no }}设备{{ item.msg }}
          </p>
          <el-button type="primary" size="mini" round @click="closeLive(index)"
            >关闭</el-button
          >
        </div>
        <div style="width:100%;height:140pxmargin:auto">
          <LivePlayer :videoUrl="item.rtsp" live controls="false" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import requestApi from "@/request/index";
import LivePlayer from '@liveqing/liveplayer'

export default {
  name: "LiveAlarm",
  components:{
    LivePlayer
  },
  data() {
    return {
      isShowVideo: false,
      isPlayVideo: false,
      videoVisible: false,
      replayUrl: null,
      liveSource: [],
      allAlarms: [],
      liveTimer: null,
      liveCount: 0,
      plays: [],
      alarmBox: []
    };
  },
  created() {
    this.getAlarmList();
    this.liveTimer = setInterval(() => {
      this.getAlarmList();
    }, 3000);
  },
  methods: {
    
    //关闭直播
    async closeLive(index) {
      try {
        let item = this.liveSource[index];
        clearInterval(this.liveTimer);
        
        const loading = this.$loading({
          lock: true,
          text: "处理中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        await requestApi.streamStop({ rtsp: item.rtsp });
        this.liveSource.splice(index, 1);
        item.show = false;
        loading.close();
        this.alarmBox.splice(index, 1, item);

        this.liveTimer = setInterval(() => {
          this.getAlarmList();
        }, 3000);
      } catch (err) {
        console.log(err);
      }
    },
    getAlarmList() {
      requestApi.getAlarmList().then(async res => {
        if (res.code == 1000) {
          let alarmList = res.data.splice(0, 3);
          let liveSource = this.liveSource;

          if (JSON.stringify(alarmList) != JSON.stringify(liveSource)) {
            this.alarmBox = JSON.parse(JSON.stringify(alarmList));
            this.allAlarms.map(async item=>{
              let res = await requestApi.streamStart({ rtsp: item.rtsp });
                  item.rtsp = this.$transFlv(res.data);
            })
            this.liveSource = JSON.parse(JSON.stringify(alarmList));
          }
        }
      });
    }
  },
  async beforeDestroy() {
    clearInterval(this.liveTimer);
    if (this.alarmBox.length) {
      this.alarmBox.map(async item => {
        await requestApi.streamStop({ rtsp: item.rtsp });
      });
    }
  }
};
</script>
