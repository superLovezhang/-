<template>
  <div>
      <div class="search-wrap">
          <input type="text" v-model="keywords" placeholder="音乐/歌手" @keydown.enter="toSearch">
      </div>
      <tip-text v-if="truthly" />
      <search-result v-else :SearchResult=SerachData />
  </div>
</template>

<script>
import TipText from "@/components/TipText";
import SearchResult from "@/components/MusicList";
export default {
    data(){
        return{
            truthly: true,
            keywords: null,
            SerachData: null
        }
    },
    methods:{
        toSearch(){
            this.truthly = false;
            this.axios.get('http://api.mtnhao.com/search?offset=0&limit=30&keywords='+this.keywords)
                .then((res)=>{
                    if(res.status == 200 && res.statusText === 'OK') {
                        this.SerachData = res.data.result.songs;
                    }else{
                        console.log('数据获取失败！请稍后再试！')
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    },
    components:{
        TipText,
        SearchResult
    }
    
};
</script>

<style lang="scss" scoped>
$rem: 469/16rem;
.search-wrap{
    width: 432/$rem;
    height: 76/$rem;
    font-size: 18/$rem;
    padding: 13/$rem 19/$rem;
    background-color: rgba(0, 0, 0, .1);
    input[type='text']{
        width: 100%;
        height: 100%;
        color: #fff;
        padding-left: 20/$rem;
        border-radius: 3/$rem;
        border: 1/$rem solid #babcbd;
        background-color: transparent;
    }
}

</style>