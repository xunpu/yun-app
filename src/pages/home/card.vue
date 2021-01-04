<template>
  <view class="page">
    <yun-card-content v-on:change="getTitle"></yun-card-content>
    <tui-fab :right="50" :bottom="150" @click="showOpt" bgColor="#56b1fc"></tui-fab>
    </view>
</template>
  
<script>
import storeCache from "@/store/list.js";

export default {
  data() {
    return {
      path: "",
      cardname: "",
      newFolderPanelShow: false,
      newFolderForm: {},
    };
  },
  onLoad() {},
  methods: {
    myBack() {},
    showOpt() {
      uni.navigateTo({
        url: '/pages/card/edit'
      })
    },
    newOpt(type) {
      if (type == "folder") {

        this.newFolderPanelShow = true;
      } else if (type == "image") {
        uni.navigateTo({
          url: "/pages/files/upload",
        });
      }
    },
    getTitle(value) {
      this.cardname = value;
    },
    init() {
      storeCache.on(api.product).then((res) => {
        this.listGoods();
      });
    },
    onPullDownRefresh() {
      return;
      var that = this;
      request(api.product_banner).then((res) => {
        that.setData({
          banners: res,
        });
      });
      manager.delete(api.product);
      manager.on(api.product).then((res) => {
        that.listGoods();
      });
    },
    onReachBottom: function () {
      return;
      var that = this;
      that.listGoods();
    },
    onPageScroll: function (t) {},
    listGoods: function () {
      var that = this;
      manager.next(api.product).then((res) => {
        var index = res.index;
        res.data.results.forEach((v) => {
          var price = that.getPrice(v);
          v.minPrice = price.minPrice;
          v.maxPrice = price.maxPrice;
        });
        that.setData({
          ["goods[" + index + "]"]: res.data.results,
          nextPageUrl: res.data.next,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.opt-panel {
  padding: 200rpx 0;
  .opt-content {
    text-align: center;
    .opt-img {
      margin-bottom: 20rpx;
      width: 96rpx;
      height: 96rpx;
    }
  }
}
.new-folder-popup {
  padding: 0 75rpx;
}
.wrap-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>


