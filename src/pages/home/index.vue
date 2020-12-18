<template>
  <view>
    <view class="tui-input-border">
      <u-input placeholder="搜索" />
    </view>
    <yun-files-content></yun-files-content>
  </view>
</template>
  
<script>
import storeCache from "@/store/list.js";
import YunFilesContent from '../../components/yun-files-content/yun-files-content.vue';
export default {
  components: {YunFilesContent},
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
      var that = this;
      that.listGoods();
    },
    onPageScroll: function (t) {
      if (t.scrollTop >= 180) {
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#ffffff",
        });
        app.fadeInOut(this, "fadeAni", 1);
      } else {
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#ffffff",
        });
        app.fadeInOut(this, "fadeAni", 0);
      }
    },
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


