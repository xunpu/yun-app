<template>
  <view class="wrap">
    <u-card
      :title="article.title"
      :thumb="article.thumb"
      :sub-title="article.ctime"
      thumb-width="42"
      thumb-height="42"
      thumb-circle
      margin="30rpx 40rpx 0 40rpx"
      @head-click="open"
      @body-click="open"
      @foot-click="edit"
    >
      <view slot="body" class="body">
        <image
          class="body-image"
          :src="article.img_url"
          mode="aspectFill"
        ></image>
        <view class="body-text">
          <text class="real-text" v-html="article.desc"></text>
        </view>
      </view>
      <view slot="foot" class="article-foot">
        <!-- <u-icon name="chat" size="28" color="" label="阅读原文"></u-icon> -->
        <u-icon name="setting" size="28" margin-left="12" label="编辑"></u-icon>
      </view>
    </u-card>
  </view>
</template>

<script>
export default {
  props: {
    article: {
      require: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    open() {
      let that = this;
      uni.navigateTo({
        url: "/pages/preview/article",
        success: function (res) {
          res.eventChannel.emit(
            "acceptArticleContent",
            that.article,
            true
          );
        },
      });
      // this.$emit("detail", { link: this.article.link });
    },
    edit() {
      let that = this;
      uni.navigateTo({
        url: "/pages/article/edit",
        success: function (res) {
          res.eventChannel.emit(
            "acceptArticleData",
            { article: that.article },
            true
          );
        },
      });
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
.article-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>