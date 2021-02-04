<template>
  <view class="page">
    <yun-article-content :articlelist="articlelist"></yun-article-content>
    <tui-fab
      :right="50"
      :bottom="150"
      @click="navToEditor"
      bgColor="#81b71a"
    ></tui-fab>
  </view>
</template>
  
<script>
import storeCache from "@/store/cache.js";
import { ARTICLE_LIST } from "@/api/api";

export default {
  data() {
    return {
      path: "",
      articlelist: [],
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
        url: "/pages/article/edit",
      });
    },
    initList() {
      storeCache.on(ARTICLE_LIST).then((res) => {
        storeCache.next(ARTICLE_LIST).then((res) => {
          this.articlelist.push(res.data.articlelist);
          uni.stopPullDownRefresh();
        });
      });
    },
    onPullDownRefresh() {
      storeCache.delete(ARTICLE_LIST);
      this.articlelist = [];
      this.initList();
    },
    onReachBottom: function () {
      storeCache.next(ARTICLE_LIST).then((res) => {
        this.articlelist.push(res.data.articlelist);
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


