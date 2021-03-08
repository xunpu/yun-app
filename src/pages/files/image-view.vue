<template>
  <view>
    <!-- <u-upload
      ref="upload"
      :action="action"
      :deletable="false"
      :file-list="fileList"
      upload-text="上传图片"
      max-count="1"
    ></u-upload> -->
    <tui-list-view unlined="all">
      <view class="page" v-for="(images, index) in imageList" :key="index">
        <tui-list-cell
          v-for="image in images"
          :key="image.uuid"
          class="image-wrap"
          unlined
          padding="0 0"
          backgroundColor="transparent"
        >
          <image
            class="image-view"
            mode="aspectFit"
            :src="image.url"
            @click="choose(image)"
          ></image>
        </tui-list-cell>
      </view>
    </tui-list-view>
  </view>
</template>
  
<script>
import { FILE_LIST } from "@/api/api";
import { renderImage } from "@/api/render";
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
export default {
  data() {
    return {
      from: "",
      action: "",
      imageList: [],
      fileList: [],
    };
  },
  onLoad(option) {
    this.from = option.from;
    this.refreshImageList();
  },
  methods: {
    choose(img) {
      let that = this;
      uni.navigateBack({
        delta: 1,
      });
      if (this.from == "article") {
        uni.$emit("acceptArticleImageChooseData", { img: img });
      } else {
        uni.$emit("acceptImageData", { img: img });
      }
    },
    refreshImageList() {
      this.imageList = [];
      storeCache.delete(`${FILE_LIST}`);
      let that = this;
      getToken().then((token) => {
        storeCache
          .on(
            `${FILE_LIST}`,
            {},
            { ext: ["png", "jpg", "gif", "svg"], token: token, range: "all" }
          )
          .then((res) => {
            that.getImages();
          });
      });
    },
    getImages() {
      getToken().then((token) => {
        storeCache
          .next(`${FILE_LIST}`, {
            ext: ["png", "jpg", "gif", "svg"],
            token: token,
            range: "all",
          })
          .then((res) => {
            if (res.data.length > 0) {
              var data = renderImage(res.data);
              this.imageList.push(data);
            }
            uni.stopPullDownRefresh();
          });
      });
    },
    onPullDownRefresh() {
      this.refreshImageList();
    },
    onReachBottom: function () {
      this.getImages();
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.image-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 50vw;
  height: 50vw;
}
.image-view {
  width: 375rpx;
  height: 375rpx;
  background: #f5f5f5;
}
</style>


