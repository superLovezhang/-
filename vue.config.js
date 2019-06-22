module.exports = {
    publicPath:'webmusic',
    devServer: {
      proxy: {
          '/top':{
              target: 'http://api.mtnhao.com',
              changeOrigin: true
          }
      }
    }
  }