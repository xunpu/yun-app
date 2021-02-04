<template>
  <view
    class="wrap"
    @click="open"
    @touchstart="showOpt"
    @touchend="clearShowOpt"
    @touchmove="clearShowOpt"
  >
    <image class="item-img" :src="realSrc" mode="aspectFill" />
    <view class="wrap-inline">
      <text class="item-text">{{ file.name }}</text>
      <text class="item-text mtime">{{ file.mtime }} {{ file.size }}</text>
    </view>
    <u-icon
      v-if="showCheck"
      :name="checkState ? 'checkmark-circle-fill' : 'minus-circle'"
      class="item-icon"
      color="#8097bd"
      size="36"
    ></u-icon>
  </view>
</template>

<script>
const TYPE_IMG = { 1: "folder", 2: "file" };
export default {
  props: {
    showCheck: {
      type: Boolean,
      default: false,
    },
    file: {
      require: true,
    },
    onlyView: {},
  },
  data() {
    return {
      checkState: false,
      longTap: null,
    };
  },
  computed: {
    realSrc() {
      return `/static/${TYPE_IMG[this.file.type]}.png`;
    },
  },
  methods: {
    showOpt() {
      if (this.onlyView) return;
      let that = this;
      this.longTap = setTimeout(function () {
        that.$emit("event-bridge", { type: "show-icon" });
        that.checkState = true;
        // that.$emit("take-file", that.file);
      }, 1000);
    },
    clearShowOpt() {
      clearTimeout(this.longTap);
    },
    open(src) {
      if (this.showCheck === true) {
        this.checkState ? (this.checkState = false) : (this.checkState = true);
      } else if (this.file.type != 2) {
        this.$emit("take-file", this.file);
      }
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
  width: calc(100% - 156rpx);
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