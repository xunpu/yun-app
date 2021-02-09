<template>
  <view>
    <view class="u-flex user-box">
      <view>
        <image @error="avatarError" :src="avatar_path" class="avatar"></image>
      </view>
      <view class="u-flex-1">
        <view class="u-tips">
          <template v-if="logged == false">
            <view @click="nav2login">点击登录</view>
          </template>
          <template v-else>
            <view v-html="phone"></view>
            <view @click="logout2">登出</view>
          </template>
        </view>
      </view>
      <view>
        <u-icon
          @error="avatarError"
          name="arrow-right"
          color="#969799"
          size="28"
        ></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import { AVATAR_PATH, logout } from "@/api/api";
import { getToken } from "@/store/storage";
var default_avatar_path = "/static/avatar_logo.png";
export default {
  data() {
    return {
      avatar_path: default_avatar_path,
      logged: false,
      phone: "",
    };
  },
  onShow() {
    this.setUser();
  },
  methods: {
    setUser() {
      let that = this;
      uni.getStorage({
        key: "token",
        success: (res) => {
          uni.getStorage({
            key: "phone",
            success: (res2) => {
              if (res.data && res2.data) {
                that.logged = true;
                that.phone = res2.data;
                that.showAvatar();
              }
            },
          });
        },
      });
    },
    nav2login() {
      uni.navigateTo({
        url: "/pages/account/login",
      });
    },
    avatarError() {
      this.avatar_path = default_avatar_path;
    },
    showAvatar() {
      if (this.avatar_path !== "" || this.avatar_path !== default_avatar_path)
        return;
      var phone = "";
      uni.getStorage({
        key: "phone",
        success: (res) => {
          phone = res.data;
        },
      });
      this.avatar_path =
        `${AVATAR_PATH}?phone=${phone}#` + new Date().getTime();
    },
    logout2() {
      let that = this;
      getToken().then((token) => {
        logout({ token: token }).then((res) => {
          if (res.code == 0) {
            uni.removeStorage({
              key: "phone",
              success: () => {
                uni.setStorage({
                  key: "token",
                  data: res.data.token,
                  success: (res) => {
                    that.logged = false;
                  },
                });
              },
            });
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
}
.camera {
  width: 54px;
  height: 44px;

  &:active {
    background-color: #ededed;
  }
}
.user-box {
  padding: 48rpx 48rpx;
  background-color: #fff;
}
.u-tips {
  padding-left: 20px;
}
</style>
