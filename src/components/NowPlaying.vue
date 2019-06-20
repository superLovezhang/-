<template>
  <div>
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
                  <div class="icon" ref="icon" @click='changeImg(item.al.picUrl, index)'></div>
                  <p>{{ item.ar[0].name }}</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { clearInterval } from 'timers';
export default {
    data(){
        return{
            music_data: [],
            dif: 0
        }
    },
    activated(){
        this.sendData();
    },
    mounted(){
        this.$store.state.truthly = false;
    },

    methods:{
        sendData(){
            // http://api.mtnhao.com/playlist/detail?id=19723756
            let id = this.$route.params.id;
            if(!id){
                this.axios.get('/top/list?idx=1')
                    .then((res)=>{
                        if(res.status == 200 && res.statusText === 'OK'){
                        let result = res.data.playlist.tracks
                        this.music_data = result; 
                        this.$store.state.resdata = result;
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    });
            }else{
                this.axios.get(' http://api.mtnhao.com/playlist/detail?id='+id)
                    .then((res)=>{
                        if(res.status == 200 && res.statusText === 'OK'){
                        let result = res.data.playlist.tracks
                        this.music_data = result; 
                        this.$store.state.resdata = result;
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                    });
            }
        },
        changeImg(url, index){
            url = url + "?param=300y300";
            this.$store.state.resdata = this.music_data;
            this.$store.commit('changeUrl', url);
            let layod = {
                doms:  this.$refs.icon,
                index
            }

            let newArr = [];
            console.log(typeof window.localStorage.getItem('Listened'))
            // 如果点击歌曲与上一次相同，不同则将该歌曲放入本地缓存，并且让
            // 进度条为0和更新父组件数据
            if(this.$store.state.musicIndex != index){
                this.$emit('update:LineWidth', 0);
                this.$emit('isListen', layod);

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
            for(let i=0; i < this.$store.state.resdata.length; i++){
                this.$refs.icon[i].style.backgroundPosition = '-80px 0';
                if(i !== index){
                    this.$store.state.resdata[i].rtype = 0;
                }
            }
            if(this.$store.state.resdata[index].rtype % 2 === 0){
                this.$refs.icon[index].style.backgroundPosition = '-80px -200px';
                this.$emit('listenIcon');
                this.$emit('increase',1);
            }else{
                this.$refs.icon[index].style.backgroundPosition = '-80px 0';
                this.$emit('timeOut');
                this.$emit('increase',0);
            }
            this.$store.state.resdata[index].rtype ++;
        }
    }
}
</script>

<style lang="scss" scoped>
$rem: 469/16rem;
.music-title{
    width: 100%;
    display: flex;
    color: #fff;
    line-height: 63/$rem;
    padding: 0 65/$rem 0 50/$rem;
    justify-content: space-between;
    border-bottom: 1/$rem solid hsla(0,0%,100%,.1);
}
.now-playing{
    width: 100%;
    height: 486/$rem;
    overflow: auto;
    // &::-webkit-resizer, 
    // &::-webkit-scrollbar-corner {
    //     border-radius: 10px;
    // }
    // &::-webkit-scrollbar {
    //     background-color: rgba(0,0,0,.3);
    //     width: 5px;
    //     border-radius: 10px;
    // }
    // &::-webkit-scrollbar-button {
    //     display: none;
    // }
    // &::-webkit-resizer, 
    // &::-webkit-scrollbar-corner {
    //     border-radius: 10px;
    // }
    // &::-webkit-scrollbar-thumb {
    //     background-color: hsla(0,0%,100%,.5);
    //     border-radius: 10px;
    // }
    // &::-webkit-scrollbar-track {
    //     display: none;
    //     border-radius: 10px;
    // }
    // &::-webkit-scrollbar-track-piece {
    //     border-radius: 10px;
    // }
    .nowplaying-item{
        width: 100%;
        height: 65/$rem;
        display: flex;
        align-items: center;
        padding-left: 12/$rem;
        border-bottom: 1/$rem solid hsla(0,0%,100%,.1);
        justify-content: space-between;
        .playing-left{
            width: 230/$rem;
            display: flex;
            align-items: center;
            span{
                margin-right: 25/$rem;
            }
            p{
                width: 178/$rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .playing-right{
            width: 165/$rem;
            display: flex;
            align-items: center;
            justify-content: space-between; 
            .icon{     
                width: 39px;
                height: 39px;
                // border: 1/$rem solid #5a6567;
                border-radius: 50%;
                background: url('../../public/images/icon_list_menu.png');
                background-position: -80px 0;
            }
            p{
                width: 95/$rem; 
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>