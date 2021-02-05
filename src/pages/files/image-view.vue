<template>
  <view>
    <u-upload
      ref="upload"
      :action="action"
      :deletable="false"
      :file-list="fileList"
      upload-text="上传图片"
      max-count="1"
    ></u-upload>
    <tui-list-view unlined="all">
      <view class="page" v-for="(images, index) in imageList" :key="index">
        <tui-list-cell
          v-for="image in images"
          :key="image.id"
          class="image-wrap"
          unlined
          padding="0 0"
          backgroundColor="transparent"
        >
          <image
            @click="choose(image)"
            class="image-view"
            :src="image.image"
            mode="aspectFit"
          ></image>
        </tui-list-cell>
      </view>
    </tui-list-view>
  </view>
</template>
  
<script>
import { IMAGE_LIST } from "@/api/api";
import storeCache from "@/store/cacheMock";
export default {
  data() {
    return {
      action: "",
      imageList: [],
      fileList: [],
    };
  },
  onLoad(option) {
    this.initList();
  },
  methods: {
    choose(img) {
      let that = this;
      uni.navigateBack({
        delta: 1,
      });
      uni.$emit("acceptImageData", { image: img });
    },
    initList() {
      storeCache.on(IMAGE_LIST).then((res) => {
        storeCache.next(IMAGE_LIST).then((res) => {
          this.imageList.push(res.data.imageList);
          uni.stopPullDownRefresh();
        });
      });
    },
    onPullDownRefresh() {
      storeCache.delete(IMAGE_LIST);
      this.imageList = [];
      this.initList();
    },
    onReachBottom: function () {
      storeCache.next(IMAGE_LIST).then((res) => {
        this.imageList.push(res.data.imageList);
      });
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


