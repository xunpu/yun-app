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
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
import { ARTICLE_LIST } from "@/api/api";
import { renderArticle } from "@/api/render";

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
    // uni.$on("refreshFileList", (res) => {
    //   this.refreshArticleList();
    // });
    // this.refreshArticleList();
  },
  onShow() {
    this.refreshArticleList();
  },
  onHide() {
    this.articlelist = [];
  },
  methods: {
    navToEditor() {
      uni.navigateTo({
        url: "/pages/article/edit",
      });
    },
    refreshArticleList() {
      this.articlelist = [];
      storeCache.delete(`${ARTICLE_LIST}`);
      let that = this;
      getToken().then((token) => {
        storeCache.on(`${ARTICLE_LIST}`, {}, { token: token }).then((res) => {
          that.getArticles();
        });
      });
    },
    getArticles() {
      getToken().then((token) => {
        storeCache
          .next(`${ARTICLE_LIST}`, {
            token: token,
          })
          .then((res) => {
            if (res.data.length > 0) {
              var data = renderArticle(res.data);
              this.articlelist.push(data);
            }
            uni.stopPullDownRefresh();
          });
      });
    },
    onPullDownRefresh() {
      this.refreshArticleList();
    },
    onReachBottom: function () {
      this.getArticles();
    },
  },
};
</script>
<style lang="scss" scoped>
uni-page-body {
  background-color: #eee;
}
.page {
  height: 100vh;
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
  margin: 20rpx 0;
}
.wrap-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>


