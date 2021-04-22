<template>
  <div class="lives_wrap">
    <site-header><span>实时监控</span></site-header>
    <div class="lives_content">
      <div class="live_belts" v-if="beltBox.length">
        <el-tabs v-model="activeName">
          <el-tab-pane
            @tab-click="tabClickEvent(item.b_no)"
            :label="item.b_no + '#皮带'"
            :name="item.b_no + ''"
            v-for="(item, index) in beltBox"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="lives_box">
        <videoPlayer
      ref="videoPlayer"
      :options="videoOptions"
      class="vjs-custom-skin videoPlayer"
      :playsinline="true"
    />
        <div
          class="live_item"
          v-for="item in lives"
          :key="activeName+'_'+ item.timeId"
        >
          <p class="live_device">{{ activeName }}号皮带{{item.area}}监控区域</p>
          <video
            :id="'live_hls_' + activeName + '_' + item.timeId + '_' + item.belt"
            style="width:100%;height:100%;"
            autoplay
            muted
            class="video-js vjs-default-skin vjs-big-play-centered"
            preload="auto"
          ></video>
        </div>
        <template v-if="lives.length < maxSize">
          <div
            class="live_item no_live"
            v-for="i in maxSize - lives.length"
            :key="i"
          >
            <div class="live">无设备接入</div>
          </div>
        </template>
      </div>
      <div class="lives_pages">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="maxSize"
          :current-page.sync="currentPage"
          :total="allLives.length"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <site-footer :isHome="true"></site-footer>
  </div>
</template>
<script>
import SiteFooter from "@/components/footer";
import SiteHeader from "@/components/header";
import { areaMixin } from "@/mixins/area";
import "video.js/dist/video-js.css";
import videojs from "video.js";
import "videojs-contrib-hls";
import requestApi from "@/request/index";

import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'

export default {
  name: "Lives",
  mixins: [areaMixin],
  components: {
    SiteFooter,
    SiteHeader,
    videoPlayer
  },
  data() {
    return {
      maxSize: 6,
      lives: [],
      activeName: "",
      allLives: [],
      currentPage: 1,
      // 视频播放
      videoOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        techOrder: ['flash', 'html5'],      // 兼容顺序
        sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
          type: 'rtmp/hls',
          src: 'rtmp://live.hkstv.hk.lxdns.com/live/hks1'	//拉流url
        }],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
    };
  },
  watch: {
    activeName(val) {
      this.currentPage = 1;
      this.allLives = [];
      this.lives = [];
      this.getLives(val);
    }
  },
  created(){
    setTimeout(()=>{
      this.handleCurrentChange(this.currentPage,false);
    },3000)
    this.timer = setInterval(()=>{
      console.log('开始转换')
      this.handleCurrentChange(this.currentPage,false);
    },5*1000*60)
  },
  methods: {
    tabClickEvent(no) {
      this.activeName = no + "";
    },
    async transferLive(data) {
      data.map(async (item, index) => {
        let res = await requestApi.startTransLive({ rtsp: item.rtsp });
        setTimeout(() => {
          item.live = res.data;
          let singlePlayer = videojs(
            "live_hls_" + this.activeName + "_" + item.timeId + "_" + item.belt,
            {
              autoplay: true, //自动播放
              controls: false, //控件显示
              preload: 'auto',
              responsive: true
            }
          );
          console.log( "live_hls_" + this.activeName + "_" + item.timeId + "_" + item.belt)
        //   item.live = item.live.replace(
        //     "http://127.0.0.1:80",
        //     "http://47.93.23.221:9991"
        //   );
          singlePlayer.src({ src: item.live, type: "application/x-mpegURL" });
          // singlePlayer.play();
          // singlePlayer.muted = false;
        }, 1000);
      });
    },
    handleCurrentChange(page,isFresh=true){
        let allLives = this.allLives;
        let maxSize = this.maxSize;
        
          let oldLives = JSON.parse(JSON.stringify(this.lives));
          if(oldLives.length && isFresh){
            oldLives.map(async item=>{
              await requestApi.stopTransLive({ rtsp: item.rtsp });
            });
          }
          let lives = allLives.slice(
            (page - 1) * maxSize,
            page * maxSize
          );
          lives.map((item,index) => {
            item.timeId = new Date().getTime()+'_'+index;
          });
          this.lives = lives
          this.transferLive(this.lives);
    },
    async getLives(b_no) {
      try {
        // let res = await requestApi.getBeltData({ b_no });
        // let allLives = res.data;
        let res = await requestApi.getLiveDevice();
        let allLives = res.data.filter(item=>item.belt==b_no);
        if (allLives.length) {
          
          this.allLives = allLives;
          let lives = allLives.slice(
            (this.currentPage - 1) * this.maxSize,
            this.currentPage * this.maxSize
          );
          lives.map((item,index) => {
            item.timeId = new Date().getTime()+'_'+index;
          });
          this.lives = lives
          this.transferLive(this.lives);
        } else {
          this.allLives = [];
          this.lives = [];
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    let lives = this.lives;
    lives.map(async item => {
      await requestApi.stopTransLive({ rtsp: item.rtsp });
    });
  }
};
</script>
<style lang="less" scoped>
.video-box {
  width: 1000px;
  padding: 20px;
}
.lives_wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  .lives_content {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .lives_box {
    flex: 1;
    display: flex;
    padding: 4px 0;
    flex-wrap: wrap;
    align-content: flex-start;
    .live_item {
      position: relative;
      width: 33.3%;
      height: 50%;
      padding: 4px;
      box-sizing: border-box;
      .live_device {
        position: absolute;
        left: 4px;
        top: 4px;
        right: 4px;
        padding: 2px 4px;
        font-size: 13px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9;
      }
      &.no_live {
        .live {
          display: block;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #474747;
          font-size: 14px;
          background: #fff;
        }
      }
    }
  }
  .lives_pages {
    margin-bottom: 6px;
    text-align: right;
  }
  .live_belts {
    padding: 8px 6px;
    box-sizing: border-box;
    .el-tabs__nav-wrap::after {
      background-color: #fff;
    }
  }
}
</style>
<style lang="less">
.live_belts {
  .el-tabs__nav-scroll {
    padding: 4px 8px 0;
    background-color: #09397a;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__item{
      color: #fff;
      &.is-active{
          color: #409cf3!important;
      }
  }
}
</style>
