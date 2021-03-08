<template>
  <view
    class="wrap"
    @click="open"
    @touchstart="showOpt"
    @touchend="clearShowOpt"
    @touchmove="clearShowOpt"
  >
    <image class="item-img" :src="realSrc" mode="aspectFill" />
    <view class="wrap-inline">
      <text class="item-text">{{ file.name }}</text>
      <text class="item-text mtime">{{ file.mtime }} {{ file.size }}</text>
    </view>
    <u-icon
      v-if="showCheck"
      :name="checkState ? 'checkmark-circle-fill' : 'minus-circle'"
      class="item-icon"
      color="#8097bd"
      size="36"
    ></u-icon>
  </view>
</template>

<script>
import { DOWNLOAD_URL, viewCard, viewArticle } from "@/api/api";
import { renderArticle, renderCard } from "@/api/render";
import { getToken } from "@/store/storage";
import FileSaver from "file-saver";
const TYPE_IMG = { 1: "folder", 2: "other", 3: "card", 4: "article" };
export default {
  props: {
    showCheck: {
      type: Boolean,
      default: false,
    },
    file: {
      require: true,
    },
    onlyView: {},
  },
  data() {
    return {
      checkState: false,
      longTap: null,
    };
  },
  computed: {
    realSrc() {
      if (
        this.file.type == 2 &&
        "png jpg gif svg".indexOf(this.file.ext) >= 0
      ) {
        return `/static/btn-image.png`;
      }
      return `/static/btn-${TYPE_IMG[this.file.type]}.png`;
    },
  },
  methods: {
    showOpt() {
      if (this.onlyView) return;
      let that = this;
      this.longTap = setTimeout(function () {
        that.$emit("event-bridge", { type: "show-icon" });
        that.checkState = true;
        // that.$emit("take-file", that.file);
      }, 1000);
    },
    clearShowOpt() {
      clearTimeout(this.longTap);
    },
    open(src) {
      if (this.showCheck === true) {
        this.checkState ? (this.checkState = false) : (this.checkState = true);
      } else if (this.file.type == 1) {
        this.$emit("take-file", this.file);
      } else if (this.file.type == 2) {
        uni.showModal({
          title: "下载文件",
          content: `${this.file.name}`,
          success: (res) => {
            if (res.confirm) {
              FileSaver.saveAs(
                `${DOWNLOAD_URL}/${this.file.uuid}?id=${this.file.id}`,
                this.file.name
              );
            }
          },
        });
      } else if (this.file.type == 3) {
        getToken().then((token) => {
          viewCard({ uuid: this.file.uuid, token: token }).then((res) => {
            if(res.code != 0) return;
            var card = renderCard(res.data);
            uni.navigateTo({
              url: "/pages/card/edit",
              success: function (res) {
                res.eventChannel.emit("acceptCardData", { card: card[0] }, true);
              },
            });
          });
        });
      } else if (this.file.type == 4) {
        getToken().then((token) => {
          viewArticle({ uuid: this.file.uuid, token: token }).then((res) => {
            if(res.code != 0) return;
            var article = renderArticle(res.data);
            uni.navigateTo({
              url: "/pages/article/edit",
              success: function (res) {
                res.eventChannel.emit(
                  "acceptArticleData",
                  { article: article[0] },
                  true
                );
              },
            });
          });
        });
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 28rpx 14rpx;
}
.wrap-inline {
  width: calc(100% - 156rpx);
  display: flex;
  flex-direction: column;
}
.item-img {
  margin-left: 28rpx;
  width: 56rpx;
  height: 56rpx;
}
.item-text {
  font-size: 28rpx;
  margin-left: 42rpx;
  color: $u-content-color;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &.mtime {
    color: $u-light-color;
    font-size: 24rpx;
  }
}
.item-icon {
  padding-left: 21rpx;
}
</style>