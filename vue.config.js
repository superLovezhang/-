module.exports = {
    devServer: {
      proxy: {
          '/top':{
              target: 'http://api.mtnhao.com',
              changeOrigin: true
          }
      }
    }
  }