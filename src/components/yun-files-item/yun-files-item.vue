<template>
  <view class="wrap" @click="open">
    <image class="item-img" :src="realSrc" mode="aspectFill" />
    <view class="wrap-inline">
      <text class="item-text">{{ this.name }}</text>
      <text class="item-text mtime">{{ this.mtime }} {{ this.size }}</text>
    </view>
    <tui-icon
      class="item-icon"
      name="circle"
      color="#CCC"
      :size="21"
      unit="rpx"
    ></tui-icon>
  </view>
</template>

<script>
const TYPE_IMG = { 1: "folder", 2: "file" };
export default {
  props: {
    type: {
      require: true,
      default: 1,
      type: Number,
    },
    name: {
      require: true,
      default: "?",
      type: String,
    },
    path: {
      default: "",
      type: String,
    },
    url: {
      default: "",
      type: String,
    },
    mtime: {
      default: "",
      type: String,
    },
    size: {
      default: "",
      type: [String, Number],
    },
  },
  data() {
    return {};
  },
  computed: {
    realSrc() {
      return `/static/${TYPE_IMG[this.type]}.png`;
    },
  },
  methods: {
    open(src) {
      this.$emit('current', this.name, this.path);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 28rpx 14rpx;
}
.wrap-inline {
  width: calc(100% - 146rpx);
  display: flex;
  flex-direction: column;
}
.item-img {
  margin-left: 28rpx;
  width: 56rpx;
  height: 56rpx;
}
.item-text {
  font-size: 28rpx;
  margin-left: 42rpx;
  color: $u-content-color;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  &.mtime {
    color: $u-light-color;
    font-size: 24rpx;
  }
}
.item-icon {
  padding-left: 21rpx;
}
</style>