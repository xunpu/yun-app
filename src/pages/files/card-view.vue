<template>
  <view class="page">
    <yun-card-content :cardlist="cardlist"></yun-card-content>
  </view>
</template>
  
<script>
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
import { CARD_LIST } from "@/api/api";
import { renderCard } from "@/api/render";

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
              var data = renderCard(res.data, { is_view: true });
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


