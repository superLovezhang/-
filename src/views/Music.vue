<template>
  <div>
    <div class="top-header">superLZPlayer在线音乐播放器</div>
    <div class="music-wrap">
      <div class="columns">
        <router-link class="column-item" tag="span" to="/Music/NowPlaying">正在播放</router-link>
        <router-link class="column-item" tag="span" to="/Music/Recommend">推荐</router-link>
        <router-link class="column-item" tag="span" to="/Music/Search">搜索</router-link>
        <router-link class="column-item" tag="span" to="/Music/Heard">我听过的</router-link>
      </div>
      <div class="components-views customize">
        <!-- <div class="music-title">
                  <span>歌曲</span>
                  <span>歌手</span>
        </div>-->
        <!-- <div class="music-view" v-if="this.$store.state.truthly"></div> -->
        <keep-alive>
          <router-view
            @listenIcon="listenIcon"
            @timeOut="timeOut"
            @isListen="isListen"
            @increase="increase"
            :LineWidth.sync="LineWidth"
          ></router-view>
        </keep-alive>
      </div>
      <div class="play-bar">
        <div class="music-info">
          <p>{{ musicName || '欢迎使用superLZPlayer在线音乐播放器' }}</p>
          <p v-if="minute">{{ musicTime.minute }}:{{ musicTime.second }}/{{ minute }}:{{ second }}</p>
        </div>
        <div class="progress-wrap" ref="progressWrap">
          <div class="progress-item" ref="progressItem"></div>
          <div class="slide-bar">
            <span class="white-line" ref="line"></span>
            <span class="ball" ref="ball"></span>
          </div>
        </div>
        <div class="icon-list">
          <span class="mode"></span>
          <span class="previous" @touchstart="previousMusic"></span>
          <span class="listing" ref="listing" @touchstart="toggleIcon"></span>
          <span class="next" @touchstart="nextMusic"></span>
          <span class="comment"></span>
        </div>
      </div>
    </div>
    <div class="mask" :style="{'background-image': 'url('+this.$store.state.picurl+')' }"></div>
    <audio src ref="musicItem"></audio>
  </div>
</template>

<script>
import { clearInterval, clearImmediate } from "timers";
export default {
  name: "music",
  data() {
    return {
      picurl: "",
      layod: null,
      LineWidth: 0,
      minute: null,
      second: null,
      curtime: 0,
      index: null,
      musicDuration: null,
      progressWidth: null,
      proportion: null
    };
  },
  mounted() {
    // 需求：点击进度条任意位置，白线长度则为点击位置
    //      点击白球可进行拖拽进度条长度
    let progressWidth =
    this.$refs.progressItem.clientWidth - this.$refs.ball.clientWidth;
    this.progressWidth = progressWidth;
    let progressWrap = this.$refs.progressWrap;
    let line = this.$refs.line;
    let musicItem = this.$refs.musicItem;
    // if(this.musicDuration){
    progressWrap.onclick = e => {
      e = e || window.event;
      // let proportion = progressWidth / this.musicDuration;
      let proportion = this.proportion;
      // this.proportion = proportion;
      let tranX = e.clientX - progressWrap.offsetLeft;
      this.LineWidth = tranX;
      line.style.width = tranX + "px";
      musicItem.currentTime = tranX / proportion;
    };
    // }
  },
  methods: {
    // 点击播放按钮 获取歌曲时长并且改变按钮样式和播放歌曲
    listenIcon() {
      setTimeout(() => {
        this.musicDuration = this.$refs.musicItem.duration;
        this.proportion = this.progressWidth / this.musicDuration;
        let minute = Math.floor(this.$refs.musicItem.duration / 60).toString();
        let second = Math.round(this.$refs.musicItem.duration % 60).toString();
        this.minute = minute;
        this.second = second;
        if (minute.length === 1) {
          this.minute = "0" + minute;
          if (second.length === 1) {
            this.second = "0" + second;
          }
        }
      }, 900);
      this.$refs.listing.style.backgroundPosition = "-29px 0";
      this.$refs.musicItem.play();
    },
    // 点击暂停按钮 改变按钮样式并且暂停该歌曲
    timeOut() {
      this.$refs.listing.style.backgroundPosition = "0 0";
      this.$refs.musicItem.pause();
    },
    // 需求：根据最后一次点击的歌曲进行播放和暂停操作(和在组件内点击歌曲效果一样)
    // 刚开始进入网页，该事件无效果

    // 点击歌单列表播放按钮，在audio标签中添加相应歌曲url，并且把歌单列表数据传入父组件data
    isListen(data) {
      this.layod = data;
      this.index = data.index;
      this.$refs.musicItem.src =
        "https://music.163.com/song/media/outer/url?id=" +
        this.$store.state.resdata[this.index].id +
        ".mp3";
    },
    // 点击最下方播放按钮 播放和暂停歌曲 并添加判断  如果用户没有
    // 在歌单列表点击歌曲 该事件无法触发
    toggleIcon() {
      if (this.layod !== null) {
        let index = this.index;
        let doms = this.layod.doms;
        for (let i = 0; i < this.$store.state.resdata.length; i++) {
          doms[i].style.backgroundPosition = "-80px 0";
          if (i !== index) {
            this.$store.state.resdata[i].rtype = 0;
          }
        }
        if (this.$store.state.resdata[index].rtype % 2 === 0) {
          doms[index].style.backgroundPosition = "-80px -200px";
          this.$options.methods.listenIcon.bind(this)();
          this.$options.methods.increase.bind(this, 1)();
        } else {
          doms[index].style.backgroundPosition = "-80px 0";
          this.$options.methods.timeOut.bind(this)();
          this.$options.methods.increase.bind(this, 0)();
        }
        this.$store.state.resdata[index].rtype++;
      }
    },
    // 管理进度条自动前进，和播放完毕跳转下一曲
    increase(data) {
      if (data) {
        window.clearInterval(this.$store.state.timer);
        this.$store.state.timer = setInterval(() => {
          if (this.$refs.musicItem.ended) {
            let index = ++this.index;
            this.$refs.musicItem.src =
              "https://music.163.com/song/media/outer/url?id=" +
              this.$store.state.resdata[index].id +
              ".mp3";
            
            this.axios.get('http://api.mtnhao.com/song/detail?ids=' + this.$store.state.resdata[index].id)
                .then((res)=>{
                    this.$store.state.resdata[index].ar = [];
                    this.$store.state.resdata[index].ar[0] = {};
                    this.$store.state.resdata[index].ar[0].name = res.data.songs[0].ar[0].name;
                    
                    this.$store.state.resdata[index].al = {};
                    this.$store.state.resdata[index].al.picUrl = res.data.songs[0].al.picUrl;
                    this.$store.commit("changeUrl", res.data.songs[0].al.picUrl + "?param=300y300");
                })
                .catch((err)=>{
                console.log(err+'未能成功获取数据')
                })

            // this.$store.commit(
            //   "changeUrl",
            //   this.$store.state.resdata[this.index].al.picUrl+ "?param=300y300"
            // );
            this.$refs.musicItem.play();
            this.LineWidth = 0;
            this.$options.methods.toggleIcon.bind(this)();
          }
          this.curtime = this.$refs.musicItem.currentTime;
          // this.LineWidth ++;
          this.LineWidth += 1 / this.proportion;
          this.$refs.line.style.width = this.LineWidth + "px";
        }, 1000);
      } else {
        window.clearInterval(this.$store.state.timer);
      }
    },
    // 点击上一首跳转上一首歌曲播放并且更换背景图片
    previousMusic() {
      this.layod.index--;
      this.LineWidth = 0;
      this.$options.methods.isListen.bind(this, this.layod)();
      this.$refs.musicItem.play();
      this.$store.commit(
        "changeUrl",
        this.$store.state.resdata[this.index].al.picUrl + "?param=300y300"
      );
      this.$options.methods.toggleIcon.bind(this)();
    },
    // 点击下一首跳转下一首歌曲播放并且更换背景图片
    nextMusic() {
      this.layod.index++;
      this.LineWidth = 0;
      this.$options.methods.isListen.bind(this, this.layod)();
      this.$refs.musicItem.play();
      this.$store.commit(
        "changeUrl",
        this.$store.state.resdata[this.index].al.picUrl + "?param=300y300"
      );
      this.$options.methods.toggleIcon.bind(this)();
    }
  },
  computed: {
    bgimg() {
      console.log(this.$store.state.picurl);
      return this.$store.state.picurl + "?param=300y300";
    },
    musicName() {
      if (this.$store.state.musicIndex == -1) {
        return undefined;
      }
      return this.$store.state.resdata[this.index].name;
    },
    musicTime() {
      let minute = Math.floor(this.curtime / 60).toString();
      let second = Math.floor(this.curtime % 60).toString();
      if (minute.length === 1) {
        minute = "0" + minute;
        if (second.length === 1) {
          second = "0" + second;
        }
      }
      return {
        minute,
        second
      };
    }
  }
};
</script>

<style lang="scss" scoped>
$rem: 469/16rem;
.top-header {
  color: #fff;
  width: 100%;
  font-size: 22 / $rem;
  line-height: 75 / $rem;
  padding-left: 25 / $rem;
  background-color: rgba(0, 0, 0, 0.3);
}
.music-wrap {
  width: 100%;
  height: 759 / $rem;
  color: #cacacc;
  position: relative;
  padding: 0 18 / $rem;
  font-size: 18 / $rem;
  background-color: rgba(0, 0, 0, 0.4);
  .columns {
    width: 100%;
    height: 82 / $rem;
    padding: 18 / $rem 0;
    .column-item {
      height: 45 / $rem;
      // color: #fff;
      padding: 12 / $rem;
      margin-right: 8 / $rem;
      display: inline-block;
      border: 1 / $rem solid #cacacc;
      // border: 1/$rem solid #fff;
    }
    .router-link-active {
      color: #fff;
      border: 1 / $rem solid #fff;
    }
  }
  .components-views {
    position: relative;
    width: 100%;
    height: 549 / $rem;
    .music-views {
      width: 100%;
      height: 549 / $rem;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .play-bar {
    width: 100%;
    color: #fff;
    height: 129 / $rem;
    padding: 25 / $rem 0 15 / $rem 0;
    .music-info {
      display: flex;
      justify-content: space-between;
      > p {
        font-size: 15 / $rem;
      }
    }
    .progress-wrap {
      width: 100%;
      height: 13 / $rem;
      margin: 5 / $rem 0 19 / $rem 0;
      position: relative;
      .progress-item {
        width: 100%;
        height: 2 / $rem;
        position: absolute;
        top: 5 / $rem;
        background-color: hsla(0, 0%, 100%, 0.1);
      }
      .slide-bar {
        height: 13 / $rem;
        display: flex;
        align-items: center;
        .white-line {
          width: 0;
          height: 2 / $rem;
          display: inline-block;
          background-color: #fff;
        }
        .ball {
          display: inline-block;
          width: 13 / $rem;
          height: 13 / $rem;
          border-radius: 50%;
          background-color: #bfc0c1;
        }
      }
    }
    .icon-list {
      width: 100%;
      height: 38 / $rem;
      display: flex;
      justify-content: space-around;
      > span {
        display: block;
        width: 28px;
        height: 30px;
        background: url(../../public/images/player.png) no-repeat;
        background-position: 0 -400px;
        // background-color: red;
        &:nth-child(1) {
          height: 25px;
          background-position: 0 -207px;
        }
        &:nth-child(2) {
          height: 22px;
          background-position: 0 -29px;
        }
        &:nth-child(3) {
          background-position: 0 0;
          // background-position: -29px 0;
        }
        &:nth-child(4) {
          height: 23px;
          background-position: 0 -51px;
        }
      }
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  filter: blur(15px);
  transition: all 1s;
  background-position: center;
  background-size: cover;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
}
</style>