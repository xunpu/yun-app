<template>
  <view class="wrap">
    <u-card
      :title="card.title"
      :sub-title="card.ctime"
      thumb-width="42"
      thumb-height="42"
      thumb-circle
      margin="30rpx 40rpx 0 40rpx"
      @head-click="open"
      @body-click="open"
      @foot-click="option"
    >
      <view slot="body" class="body">
        <image class="body-image" :src="card.img_url" mode="aspectFill"></image>
        <view class="body-text">
          <text class="real-text" v-html="card.desc"></text>
        </view>
      </view>
      <view slot="foot" class="card-foot">
        <u-icon
          name="setting"
          size="28"
          margin-left="12"
          :label="card._opt.is_view ? '选择' : '编辑'"
        ></u-icon>
      </view>
    </u-card>
  </view>
</template>

<script>
export default {
  props: {
    card: {
      require: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    open() {
      this.$emit("detail", { link: this.card.link });
    },
    option() {
      let that = this;
      if (that.card._opt.is_view) {
        uni.navigateBack({
          delta: 1,
        });
        uni.$emit("acceptArticleCardChooseData", { card: that.card });
      } else {
        uni.navigateTo({
          url: "/pages/card/edit",
          success: function (res) {
            res.eventChannel.emit("acceptCardData", { card: that.card }, true);
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.wrap/deep/ {
  .u-card {
    border: 1px solid #e4e7ed;
  }
  .u-border:after {
    border-width: 0;
  }
  .u-card__head--left__title {
    width: 350rpx;
  }
  .u-card__head--right {
    min-width: 180rpx;
    text-align: right;
  }
  .u-card__head--left__thumb {
    min-width: 48rpx;
    min-height: 48rpx;
  }
}
.body {
  width: 634rpx;
}
.body-image {
  width: 634rpx;
  height: 280rpx;
}
.body-text {
  color: $u-type-info;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>