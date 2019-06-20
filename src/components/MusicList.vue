<template>
  <div>
    <div class="search-wrap">
      <input type="text" v-model="keywords" placeholder="音乐/歌手" @keydown.enter="toSearch">
    </div>
    <tip-text v-if="truthly"/>
    <div v-else>
      <div class="music-title">
        <span>歌曲</span>
        <span>歌手</span>
      </div>
      <div class="now-playing customize">
        <div class="nowplaying-item" v-for="(item, index) in music_data" :key="index">
          <div class="playing-left">
            <span>{{ index+1 }}</span>
            <p>{{ item.name }}</p>
          </div>
          <div class="playing-right">
            <div class="icon" ref="icon" @click="changeImg(index)"></div>
            <p>{{ item.artists[0].name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TipText from "@/components/TipText";
export default {
  data() {
    return {
      music_data: null,
      dif: 0,
      truthly: true,
      keywords: null,
      SerachData: null
    };
  },
  created() {
    // this.sendData();

  },

  mounted() {
    this.$store.state.truthly = false;
  },

  methods: {
    toSearch(){
        this.truthly = false;
        this.axios.get("http://api.mtnhao.com/search?offset=0&limit=30&keywords=" +this.keywords)
            .then(res => {
                if (res.status == 200 && res.statusText === "OK") {
                this.music_data = res.data.result.songs;
                this.$store.state.resdata = res.data.result.songs; 
                } else {
                console.log("数据获取失败！请稍后再试！");
                }
            })
            .catch(err => {
                console.log(err);
            });
    },
    changeImg(index) {
        this.$store.state.resdata = this.music_data;
        // 遍历数据数组，把每一个id都作为后缀去发送ajax
        // 获取图片地址
        if(!this.$store.state.resdata[index].al){
            this.axios.get('http://api.mtnhao.com/song/detail?ids=' + this.music_data[index].id)
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
        }
        
        setTimeout(()=>{
          let layod = {
          doms: this.$refs.icon,
          index
          };

          let newArr = [];
          // 如果点击歌曲与上一次不相同
          if (this.$store.state.musicIndex !== index) {
              this.$emit("update:LineWidth", 0);
              this.$emit("isListen", layod);

              if(typeof window.localStorage.getItem('Listened') != 'object'){
                    newArr = JSON.parse(window.localStorage.getItem('Listened'));
                }

              let listened = this.$store.state.resdata[index];
              newArr.unshift(listened);
              window.localStorage.setItem('Listened', JSON.stringify(newArr));
          }
          this.$store.state.musicIndex = index;

          // 先for循环 把所有的icon变成播放按钮,如果索引不为点击部分，mark设为0
          // for循环外 把点击的icon变成暂停按钮(值得商榷,不可行)
          // for循环外 给个if语句，判断条件为mark%2===0,执行语句为
          // 把点击的icon变成暂停按钮,否则 把点击的icon变成播放按钮,对应mark+1
          for (let i = 0; i < this.$store.state.resdata.length; i++) {
              this.$refs.icon[i].style.backgroundPosition = "-80px 0";
              if (i !== index) {
                  this.$store.state.resdata[i].rtype = 0;
              }
          }
          if (this.$store.state.resdata[index].rtype % 2 === 0) {
              this.$refs.icon[index].style.backgroundPosition = "-80px -200px";
              this.$emit("listenIcon");
              this.$emit("increase", 1);
          } else {
              this.$refs.icon[index].style.backgroundPosition = "-80px 0";
              this.$emit("timeOut");
              this.$emit("increase", 0);
          }
          this.$store.state.resdata[index].rtype++;
          }, 300)
    }
  },
  components:{
      TipText
  }
};
</script>

<style lang="scss" scoped>
$rem: 469/16rem;
.search-wrap {
  width: 432 / $rem;
  height: 76 / $rem;
  font-size: 18 / $rem;
  padding: 13 / $rem 19 / $rem;
  background-color: rgba(0, 0, 0, 0.1);
  input[type="text"] {
    width: 100%;
    height: 100%;
    color: #fff;
    padding-left: 20 / $rem;
    border-radius: 3 / $rem;
    border: 1 / $rem solid #babcbd;
    background-color: transparent;
  }
}
.music-title {
  width: 100%;
  display: flex;
  color: #fff;
  line-height: 63 / $rem;
  padding: 0 65 / $rem 0 50 / $rem;
  justify-content: space-between;
  border-bottom: 1 / $rem solid hsla(0, 0%, 100%, 0.1);
}
.now-playing {
  width: 100%;
  height: 410 / $rem;
  overflow: auto;
  .nowplaying-item {
    width: 100%;
    height: 65 / $rem;
    display: flex;
    align-items: center;
    padding-left: 12 / $rem;
    border-bottom: 1 / $rem solid hsla(0, 0%, 100%, 0.1);
    justify-content: space-between;
    .playing-left {
      width: 230 / $rem;
      display: flex;
      align-items: center;
      span {
        margin-right: 25 / $rem;
      }
      p {
        width: 178 / $rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .playing-right {
      width: 165 / $rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon {
        width: 39px;
        height: 39px;
        // border: 1/$rem solid #5a6567;
        border-radius: 50%;
        background: url("../../public/images/icon_list_menu.png");
        background-position: -80px 0;
      }
      p {
        width: 95 / $rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>