<template>
  <view>
    <yun-files-content></yun-files-content>
  </view>
</template>
  
<script>
import storeCache from "@/store/list.js";

export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
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
</style>


