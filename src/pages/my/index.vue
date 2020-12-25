<template>
  <view>
    <view class="u-flex user-box">
      <view class="u-m-r-10">
        <u-avatar :src="avatar_path" size="140"></u-avatar>
      </view>
      <view class="u-flex-1">
        <view class="u-tips">
          <template v-if="logged == false">
            <view @click="nav2login">点击登录</view>
          </template>
          <template v-else>
            <view v-html="phone"></view>
          </template>
        </view>
      </view>
      <view class="u-m-l-10 u-p-10">
        <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
      </view>
    </view>
    <!-- <view class="u-m-t-20">
      <u-cell-group>
        <u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
        <u-cell-item icon="star" title="收藏"></u-cell-item>
        <u-cell-item icon="heart" title="关注"></u-cell-item>
        <u-cell-item icon="setting" title="设置"></u-cell-item>
      </u-cell-group>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      avatar_path: "/static/avatar_logo.png",
      logged: false,
      phone: "",
    };
  },
  onReady() {
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
  onLoad() {},
  methods: {
    nav2login() {
      uni.navigateTo({
        url: "./login",
      });
    },
    showAvatar() {
      var phone = "";
      uni.getStorage({
        key: "phone",
        success: (res) => {
          phone = res.data;
        },
      });
      this.avatar_path =
        `${avatar_path}?phone=${phone}#` + new Date().getTime();
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}
.camera {
  width: 54px;
  height: 44px;

  &:active {
    background-color: #ededed;
  }
}
.user-box {
  padding: 96rpx 48rpx 48rpx;
  background-color: #fff;
}
.u-tips {
  padding-left: 20px;
}
</style>
