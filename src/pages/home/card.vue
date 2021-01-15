<template>
  <view class="page">
    <yun-card-content :cardlist="cardlist"></yun-card-content>
    <tui-fab
      :right="50"
      :bottom="150"
      @click="navToEditor"
      bgColor="#56b1fc"
    ></tui-fab>
  </view>
</template>
  
<script>
import storeCache from "@/store/cache.js";
import { CARD_LIST } from "@/api/api";

export default {
  data() {
    return {
      path: "",
      cardlist: [],
      newFolderPanelShow: false,
      newFolderForm: {},
    };
  },
  onReady() {
    this.initList();
  },
  methods: {
    navToEditor() {
      uni.navigateTo({
        url: "/pages/card/edit",
      });
    },
    initList() {
      storeCache.on(CARD_LIST).then((res) => {
        storeCache.next(CARD_LIST).then((res) => {
          this.cardlist.push(res.data.cardlist);
          uni.stopPullDownRefresh();
        });
      });
    },
    onPullDownRefresh() {
      storeCache.delete(CARD_LIST);
      this.cardlist = [];
      this.initList();
    },
    onReachBottom: function () {
      storeCache.next(CARD_LIST).then((res) => {
        this.cardlist.push(res.data.cardlist);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
uni-page-body {
  background-color: #eee;
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


