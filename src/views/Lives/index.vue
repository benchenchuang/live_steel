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
        <div
          class="live_item"
          v-for="item in lives"
          :key="activeName+'_'+ item.timeId"
        >
          <p class="live_device">{{ activeName }}号皮带{{item.area}}监控区域</p>
          <div style="position: relative;width:100%;height:100%;">
            <LivePlayer aspect='fullscreen' :videoUrl="item.rtsp" live autoplay/>
          </div>
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
import requestApi from "@/request/index";

import LivePlayer from '@liveqing/liveplayer'

export default {
  name: "Lives",
  mixins: [areaMixin],
  components: {
    SiteFooter,
    SiteHeader,
    LivePlayer
  },
  data() {
    return {
      maxSize: 6,
      lives: [],
      activeName: "",
      allLives: [],
      currentPage: 1
    };
  },
  watch: {
    activeName(val) {
      this.currentPage = 1;
      this.allLives = [];
      this.lives = [];
      this.$nextTick(()=>{
        console.log('tab-val:'+val)
        this.getLives(val);
      })
    }
  },
  created(){
    // setTimeout(()=>{
    //   this.handleCurrentChange(this.currentPage,false);
    // },3000)
    // this.timer = setInterval(()=>{
    //   console.log('开始转换')
    //   this.handleCurrentChange(this.currentPage,false);
    // },5*1000*60)
  },
  methods: {
    tabClickEvent(no) {
      this.activeName = no + "";
    },
    async transferLive(data) {
      data.map(async (item, index) => {
        let res = await requestApi.streamStart({ rtsp: item.rtsp });
        item.rtsp = res.data;
      });
      this.lives = data;
    },
    handleCurrentChange(page,isFresh=true){
        let allLives = this.allLives;
        let maxSize = this.maxSize;
        
          let oldLives = JSON.parse(JSON.stringify(this.lives));
          if(oldLives.length && isFresh){
            oldLives.map(async item=>{
              await requestApi.streamStop({ rtsp: item.rtsp });
            });
          }
          let lives = allLives.slice(
            (page - 1) * maxSize,
            page * maxSize
          );
          lives.map((item,index) => {
            item.timeId = new Date().getTime()+'_'+index;
          });
          this.transferLive(lives);
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
          this.transferLive(lives);
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
    // clearInterval(this.timer);
    let lives = this.lives;
    lives.map(async item => {
      await requestApi.streamStop({ rtsp: item.rtsp });
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
