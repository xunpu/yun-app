// 将 api 的请求链接统一写在这个文件中
// https://ext.dcloud.net.cn/plugin?id=392
import Request from '@/utils/request';
import {
  API_URL
} from '@/api/config';


// #ifdef MP-WEIXIN
import Vue from 'vue';
// #endif

const http = new Request();
let tostTimeout;
let app;

http.setConfig(config => {
  Object.assign(config, {
    baseUrl: API_URL,
    header: {
      // 'Content-Type': 'application/vnd.api+json',
      'Content-Type': 'application/x-www-form-urlencoded',
      // Accept: 'application/vnd.api+json',
    },
  });
  // #ifdef MP-WEIXIN
  Object.assign(config.header, {
    'X-App-Platform': 'wx_miniprogram',
  });
  // #endif
  return config;
});
http.validateStatus = statusCode => {
  return statusCode >= 200 && statusCode < 300;
};

http.interceptor.request(conf => {
  const config = conf;
  if (config.custom.loading) {
    // uni.showLoading({
    //   title: '加载中',
    //   mask: true,
    // });
  }

  // #ifdef MP-WEIXIN
  app = Vue.prototype;
  // #endif

  // #ifdef H5
  app = getApp();
  // #endif

  try {
    const accessToken = app.$store.getters['session/get']('accessToken');

    if (accessToken && config.custom.login) {
      // eslint-disable-next-line no-param-reassign
      config.header.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.header.Authorization;
    }
  } catch (e) {
    // error
  }
  return config;
});

// 在请求之后拦截
http.interceptor.response(
  response => {
    if (response.config.custom.loading) {
      uni.hideLoading();
    }
    // 状态码 >= 200 < 300 会走这里
    response.status = response.statusCode;
    return response;
  },
  response => {
    if (response.config.custom.loading) {
      uni.hideLoading();
    }

    // #ifdef MP-WEIXIN
    app = getApp().$vm;
    // #endif

    // #ifdef H5
    app = getApp();
    // #endif

    if (response && response.data && response.data.errors) {
      response.data.errors.forEach(error => {
        switch (error.code) {
          case 'access_denied':
            // token 无效 重新请求
            delete response.config.header.Authorization;
            break;
          case 'model_not_found':
            console.log('模型未找到');
            app.$store.dispatch('forum/setError', {
              code: 'type_404',
              status: 500,
            });
            break;
          case 'permission_denied':
            console.log('没有查看权限');
            app.$store.dispatch('forum/setError', {
              code: 'type_401',
              status: 500,
            });
            break;
          case 'site_closed':
            uni.showToast({
              icon: 'none',
              title: '错误',
            });
            break;
          case 'not_install':
          case 'ban_user':
          case 'no_bind_user':
          case 'content_banned_show_words':
            break;
          default:
            if (response.config.custom.showTost) {
              clearTimeout(tostTimeout);
              tostTimeout = setTimeout(() => {
                // eslint-disable-next-line no-nested-ternary
                const title = error.detail ?
                  Array.isArray(error.detail) ?
                  error.detail[0] :
                  error.detail :
                  '错误代码:0';
                uni.showToast({
                  icon: 'none',
                  title,
                });
              });
            }
        }
      });
    } else if (response.config.custom.showTost) {
      // uni.showToast({
      //   title: response.errMsg
      // });
    }
    return response;
  },
);

export {
  http
};