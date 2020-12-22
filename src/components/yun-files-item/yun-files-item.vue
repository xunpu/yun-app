<template>
  <view class="wrap" @click="open">
    <image class="item-img" :src="realSrc" mode="aspectFill" />
    <text class="item-text">{{ this.name }}</text>
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
    url: {
      default: "",
      type: String,
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
  margin-left: 1em;
  width: 90%;
  color: gray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item-icon {
  padding-left: 1em;
  padding-right: 1.5em;
}
</style>