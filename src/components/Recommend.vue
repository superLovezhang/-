<template>
  <div>
      <div class="music-list">
          <div class="recommed-wrap">
            <div class="recommed-title">云音乐特色榜</div>
            <div class="recommed-items clearfix">
                <div
                class="recommed-item" 
                v-for="(item, index) in listData" 
                :key="index" 
                v-if="index < 4"
                >
                    <router-link tag='div' :to='"/Music/Detail/"+item.id'>
                        <img :src="item.coverImgUrl | setWH('200y200')" class="cover-img">
                        <p>{{ item.name }}</p>
                    </router-link>
                </div>
            </div>
          </div>
          <div class="recommed-wrap">
            <div class="recommed-title">热门歌单</div>
            <div class="recommed-items clearfix">
                <div 
                class="recommed-item" 
                v-for="(item, index) in hotData" 
                :key="index"
                >
                    <router-link tag="div" :to='"/Music/Detail/"+item.id'>
                        <img v-lazy="item.picUrl" class="cover-img">
                        <p>{{ item.name }}</p>
                    </router-link>
                </div>
            </div>
          </div>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
    data(){
        return{
            listData: null,
            hotData: null
        }
    },
    mounted(){
        this.$store.state.truthly = false;
        this.axios.get('http://api.mtnhao.com/toplist/detail')
            .then((res)=>{
                if(res.status == 200 && res.statusText === 'OK'){
                    this.listData = res.data.list;
                }
            })
            .catch((err)=>{
                cosnole.log(err);
            })

        this.axios.get('http://api.mtnhao.com/personalized')
            .then((res)=>{
                if(res.status == 200 && res.statusText === 'OK'){
                    this.hotData = res.data.result;
                }
            })
            .catch((err)=>{
                cosnole.log(err);
            })
    }
};
</script>

<style lang="scss" scoped>
$rem: 469/16rem;

.music-list{
    width: 100%;
    .recommed-title{
        color: #fff;
        width: 100%;
        line-height: 93/$rem;
        font-size: 23/$rem;
    }
    .recommed-items{
        width: 469/$rem;
        font-size: 18/$rem;
        padding-left: 15/$rem;
        .recommed-item{
            float: left;
            width: 114/$rem;
            margin:{
              right: 28/$rem; 
              bottom: 30/$rem;  
            }
            .cover-img{
            width: 114/$rem;
            height: 114/$rem;
            }
            p{
                width: 100%;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }
}
</style>