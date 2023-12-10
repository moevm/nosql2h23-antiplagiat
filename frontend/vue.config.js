const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true
// });

module.exports = {
  devServer: {
    proxy: {
      "^/backend": {
        target: `http://${process.env.ANTIPLAGIAT_BACKEND_HOST}`,
        pathRewrite: {'^/backend': ''},
        ws: true,
        changeOrigin: true
      }
    },
    port: process.env.ANTIPLAGIAT_FRONTEND_PORT
  }
}
