<template>
  <view class="wrap" @click="open">
    <u-card
      :title="title"
      :thumb="thumb"
      :sub-title="ctime"
      thumb-width="42"
      thumb-height="42"
      thumb-circle
    >
      <view slot="body" class="body">
        <image class="body-image" :src="image" mode="aspectFill"></image>
        <view class="body-text">
          <text v-html="text"></text>
        </view>
      </view>
      <view class="" slot="foot"
        ><u-icon name="chat-fill" size="28" color="" label="阅读原文"></u-icon
      ></view>
    </u-card>
  </view>
</template>

<script>
export default {
  props: {
    id: {
      require: true,
      type: [Number, String],
    },
    title: {
      require: true,
      default: "",
      type: String,
    },
    text: {
      require: true,
      default: "",
      type: String,
    },
    thumb: {
      require: true,
    },
    image: {
      require: true,
    },
    url: {
      default: "",
      type: String,
    },
    ctime: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      cardlist: [],
    };
  },
  computed: {},
  methods: {
    open(src) {
      this.$emit("current", this.id);
    },
  },
  mounted() {},
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
  width:634rpx;
  height:280rpx;
}
.body-text {
  color: $u-type-info;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>