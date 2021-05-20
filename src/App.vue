<template>
  <div id="app">
    <router-view />
    <live-alarm v-if="$route.name!='lives'" />
    <el-dialog
      title="视频播放"
      :visible.sync="videoVisible"
      width="70%"
      :before-close="handleClose"
    >
      <video
        id="showVideo"
        style="width:100%;height:60vh;"
        autoplay
        muted
        class="video-js vjs-default-skin vjs-big-play-centered"
        preload="auto"
      >
        <source id="playVideo" :src="replayUrl" type="video/mp4" />
      </video>
    </el-dialog>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from "video.js";
import "videojs-contrib-hls";
import requestApi from "@/request/index";
import LiveAlarm from '@/components/liveAlarm'

export default {
  name: "App",
  components:{
    LiveAlarm,
  },
  data() {
   return {
      isShowVideo: false,
      isPlayVideo: false,
      videoVisible: false,
      replayUrl: null,
      playLiveUrl: ""
    };
  },
  methods: {
    showPlayVideo(url) {
      // this.replayUrl = require(`${url}.mp4`);
      this.replayUrl = require(`${url}`);
      // this.replayUrl = require('C:/Intel/steel/static/test.mp4');
      setTimeout(() => {
        let singlePlayer = videojs("showVideo", {
          autoplay: true, //自动播放
          contcontrols: false, //控件显示
          preload: 'auto',
          responsive: true
        });
        singlePlayer.play();
        // singlePlayer.muted = false;
      },100);
    },
    async showPlayLive(url) {
      this.playLiveUrl = url;
      let res = await requestApi.startTransLive({ rtsp: url });
      setTimeout(() => {
        let singlePlayer = videojs("showVideo", {
          autoplay: true, //自动播放
          cocontrols: false, //控件显示
          preload: 'auto',
          responsive: true
        });
        singlePlayer.src({ src: res.data, type: "application/x-mpegURL" });
        singlePlayer.play();
        singlePlayer.muted = false;
      }, 200);
    },
    //关闭播放视频
    async handleClose() {
      this.videoVisible = false;
      await requestApi.stopTransLive({ rtsp: this.playLiveUrl });
      let singlePlayer = videojs("showVideo");
      singlePlayer.pause();
      this.replayUrl = null;
    },
  },
  provide: function() {
    let that = this;
    const provides = {
      showVideo(data) {
        that.isShowVideo = true;
        that.liveSource = data;
        that.showVideoModal(data);
      },
      hideVideo() {
        that.isShowVideo = false;
        that.showVideoModal();
      },
      //播放直播
      playLive(url) {
        that.videoVisible = true;
        that.showPlayLive(url);
      },
      //播放视频
      playVideoFile(url) {
        that.videoVisible = true;
        that.showPlayVideo(url);
      }
    };
    return provides;
  },
  async beforeDestroy() {
    if (this.playLiveUrl) {
      await requestApi.stopTransLive({ rtsp: this.playLiveUrl });
    }
  }
};
</script>

<style lang="less">
@import "./assets/reset.less";

.el-notification {
  bottom: 50px !important;
}
.live_modal {
  position: fixed;
  right: 20px;
  top: 56px;
  z-index: 99;
  // bottom: 50px;
  // overflow-y: scroll;
  padding: 0 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.06);
  .video-js {
    width: 280px;
  }
  .live_item_info {
    margin-bottom: 10px;
  }
  .live_item {
    padding: 20px 0;
    border-bottom: 1px solid #e6e6e6;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
