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
        <video
          :id="'myVideo' + item.b_no + '_' + item.timeId + '_' + item.d_no"
          autoplay
          muted
          style="height:140px"
          class="video-js vjs-default-skin vjs-big-play-centered"
          preload="auto"
        ></video>
      </div>
    </div>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import videojs from "video.js";
import "videojs-contrib-hls";
import requestApi from "@/request/index";

export default {
  name: "LiveAlarm",
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
    showVideoModal(data) {
      data.map(async (item, index) => {
        let res = await requestApi.startTransLive({ rtsp: item.rtsp });
        setTimeout(() => {
          // this.plays[index] = (videojs("myVideo"+item.b_no+'_'+item.d_no));
          item.live = res.data;
          let singlePlayer = videojs(
            "myVideo" + item.b_no + "_" + item.timeId + "_" + item.d_no,
            {
              autoplay: true, //自动播放
              controls: false, //控件显示
              preload: "auto",
              responsive: true,
              width: "240", //视频框宽度
              height: "140" //视频框高度
            }
          );
          // let res ="./assets/live.mp4";
          // let res ="http://47.93.23.221:9997/hls/haikang2.m3u8";
          // let res ="http://47.93.23.221:9997/hls/test.m3u8";
          // singlePlayer.src({ src: res, type: "application/x-mpegURL" });
          // item.live = item.live.replace(
          //   "http://127.0.0.1:80",
          //   "http://47.93.23.221:9991"
          // );
          singlePlayer.src({ src: item.live, type: "application/x-mpegURL" });
          // singlePlayer.play();
          // singlePlayer.muted = false;
        }, 1000);
      });
    },
    //关闭直播
    async closeLive(index) {
      try {
        let item = this.liveSource[index];
        // let myPlayer = videojs('myVideo'+item.b_no+'_'+item.d_no);
        // myPlayer.dispose();
        // this.liveSource.splice(index,1)
        // let item = this.alarmBox[index];
        clearInterval(this.liveTimer);
        
        const loading = this.$loading({
          lock: true,
          text: "处理中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        await requestApi.stopTransLive({ rtsp: item.rtsp });
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
            this.alarmBox = [];
            if (liveSource.length) {
              liveSource.map(async item => {
                await requestApi.stopTransLive({ rtsp: item.rtsp });
              });
            }
            this.alarmBox = alarmList;
            this.liveSource = JSON.parse(JSON.stringify(alarmList));
            this.alarmBox.map((item, index) => {
              item.show = true;
              item.timeId = new Date().getTime() + "_" + index;
            });
            this.showVideoModal(this.alarmBox);
          }
        }
      });
    }
  },
  async beforeDestroy() {
    clearInterval(this.liveTimer);
    if (this.alarmBox.length) {
      this.alarmBox.map(async item => {
        await requestApi.stopTransLive({ rtsp: item.rtsp });
      });
    }
  }
};
</script>
