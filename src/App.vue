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
      <div style="width:100%;height:60vh;">
        <LivePlayer :videoUrl="replayUrl" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer'
import requestApi from "@/request/index";
import LiveAlarm from '@/components/liveAlarm'

export default {
  name: "App",
  components:{
    LiveAlarm,
    LivePlayer
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
      this.videoVisible = true;
    },
    async showPlayLive(url) {
      this.playLiveUrl = url;
      let res = await requestApi.streamStart({ rtsp: url });
      this.replayUrl = res.data;
      this.videoVisible = true;
    },
    //关闭播放视频
    async handleClose() {
      this.videoVisible = false;
      await requestApi.streamStop({ rtsp: this.playLiveUrl });
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
      await requestApi.streamStop({ rtsp: this.playLiveUrl });
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
