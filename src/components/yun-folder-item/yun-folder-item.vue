<template>
  <view class="wrap" @click="open">
    <image class="item-img" :src="realSrc" mode="aspectFill" />
    <text class="item-text">{{ this.title }}</text>
    <tui-icon
      class="item-icon"
      name="circle"
      color="#CCC"
      :size="12"
      unit="rpx"
    ></tui-icon>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      require: true,
      default: "folder",
      type: String,
    },
    title: {
      require: true,
      default: "?",
      type: String,
    },
    url: {
      default: "",
      type: String,
    }
  },
  data() {
    return {
    };
  },
  computed: {
    realSrc() {
      return `/static/${this.type}.png`;
    },
  },
  methods: {
    open(src) {
      console.log(111, this.url);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-img {
  margin-left: 1em;
  width: 80rpx;
  height: 80rpx;
}
.item-text {
  color: gray;
  margin-left: 1em;
  width: calc(100% - 80rpx);
}
.item-icon {
  padding-right: 1em;
}
</style>