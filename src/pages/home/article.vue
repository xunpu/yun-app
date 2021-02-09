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
import { ARTICLE_LIST, IMAGE_URL } from "@/api/api";

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
    renderData(imageList) {
      var data = {};
      var render_data = [];
      imageList.forEach((v, i) => {
        data = {
          id: v[0],
          creator: v[1],
          uuid: v[2],
          name: v[6],
          title: v[7],
          desc: v[8],
          img: v[9],
          content: v[10],
          ctime: `${v[10].split(" ")[0]}`,
          mtime: `${v[11].split(" ")[0]}`,
          img_url: `${IMAGE_URL}/thumb/${v[9]}?id=${v[1]}`,
        };
        render_data.push(data);
      });
      return render_data;
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
              var data = this.renderData(res.data);
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
}
.wrap-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>


