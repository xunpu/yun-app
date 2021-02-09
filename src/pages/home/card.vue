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
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
import { CARD_LIST, IMAGE_URL } from "@/api/api";

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
    // uni.$on("refreshFileList", (res) => {
    //   this.refreshCardList();
    // });
    // this.refreshCardList();
  },
  onHide() {
    this.cardlist = [];
  },
  onShow() {
    this.refreshCardList();
  },
  methods: {
    navToEditor() {
      uni.navigateTo({
        url: "/pages/card/edit",
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
          link: v[10],
          ctime: `${v[10].split(" ")[0]}`,
          mtime: `${v[11].split(" ")[0]}`,
          img_url: `${IMAGE_URL}/thumb/${v[9]}?id=${v[1]}`,
        };
        render_data.push(data);
      });
      return render_data;
    },
    refreshCardList() {
      this.cardlist = [];
      storeCache.delete(`${CARD_LIST}`);
      let that = this;
      getToken().then((token) => {
        storeCache.on(`${CARD_LIST}`, {}, { token: token }).then((res) => {
          that.getCards();
        });
      });
    },
    getCards() {
      getToken().then((token) => {
        storeCache
          .next(`${CARD_LIST}`, {
            token: token,
          })
          .then((res) => {
            if (res.data.length > 0) {
              var data = this.renderData(res.data);
              this.cardlist.push(data);
            }
            uni.stopPullDownRefresh();
          });
      });
    },
    onPullDownRefresh() {
      this.refreshCardList();
    },
    onReachBottom: function () {
      this.getCards();
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


