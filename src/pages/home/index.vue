<template>
  <view class="page">
    <u-navbar
      z-index="999"
      height="60"
      title=""
      :back-text="filename"
      :border-bottom="false"
      :custom-back="myBack"
    >
    </u-navbar>
    <yun-files-content v-on:change="getPath"></yun-files-content>
    <tui-fab :right="50" :bottom="150" @click="showOpt"></tui-fab>
    <u-popup
      v-model="optShow"
      mode="bottom"
      z-index="99998"
      border-radius="20"
      duration="150"
      closeable
    >
      <view class="opt-panel">
        <u-row class="opt-content">
          <u-col span="4">
            <view class="wrap-inline" @click="newOpt('folder')">
              <image
                class="opt-img"
                src="/static/wenjianjia.png"
                mode="aspectFill"
              />
              <text>新文件夹</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="newOpt('image')">
              <image
                class="opt-img"
                src="/static/tupian.png"
                mode="aspectFill"
              />
              <text>上传图片</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="newOpt('other')">
              <image
                class="opt-img"
                src="/static/weizhiwenjian.png"
                mode="aspectFill"
              />
              <text>上传其它</text>
            </view>
          </u-col>
        </u-row>
      </view>
    </u-popup>
    <u-modal
      v-model="newFolderPanelShow"
      show-cancel-button
      title="创建新文件夹"
      :zoom="false"
      @cancel="optShow = true"
    >
      <view class="new-folder-popup">
        <u-input v-model="newFolderForm.name" />
      </view>
    </u-modal>
  </view>
</template>
  
<script>
import storeCache from "@/store/list.js";

export default {
  data() {
    return {
      path: "",
      filename: "",
      optShow: false,
      newFolderPanelShow: false,
      newFolderForm: {},
    };
  },
  onLoad() {},
  methods: {
    myBack() {},
    showOpt() {
      this.optShow = true;
    },
    newOpt(type) {
      if (type == "folder") {
        this.optShow = false;
        this.newFolderPanelShow = true;
      } else if (type == "image") {
        uni.navigateTo({
          url: "/pages/files/upload",
        });
      }
    },
    getPath(value) {
      this.filename = value;
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
.page/deep/ .u-line-1 {
  width: 45vw;
  display: inline-block;
}
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


