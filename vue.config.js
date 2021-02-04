module.exports = {
    chainWebpack: (config) => {

    },
    configureWebpack: {
        watch: true
    },
    "devServer": {
        "port": 8081,
        "disableHostCheck": true,
        "proxy": {
            "/api": {
                "target": "http://yun.test.com:8080",
                "changeOrigin": true,
                "secure": false,
                "pathRewrite": {
                    "^/api": ""
                }
            }
        }
    }
}