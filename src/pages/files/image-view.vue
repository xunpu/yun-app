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
            @error="imgError"
            @load="imgLoad"
          ></image>
        </tui-list-cell>
      </view>
    </tui-list-view>
  </view>
</template>
  
<script>
import { FILE_LIST, IMAGE_VIEW } from "@/api/api";
import { getToken } from "@/store/storage";
import storeCache from "@/store/cache";
export default {
  data() {
    return {
      action: "",
      imageList: [],
      fileList: [],
    };
  },
  onLoad(option) {
    this.refreshImageList();
  },
  methods: {
    imgError() {
      console.log(111);
    },
    imgLoad() {
      console.log(222);
    },
    renderData(imageList) {
      var data = {};
      var render_data = [];
      imageList.forEach((v, i) => {
        data = {
          id: v[0],
          name: v[2],
          type: v[3],
          ext: v[4],
          size: v[5],
          pid: v[6],
          path: v[7],
          uuid: v[8],
          ctime: `${v[9].split(" ")[0]} ${v[9].split(" ")[1]}`,
          mtime: `${v[10].split(" ")[0]} ${v[10].split(" ")[1]}`,
          url: `../../api/api${IMAGE_VIEW}/thumb/${v[8]}`,
        };
        render_data.push(data);
      });
      return render_data;
    },
    choose(img) {
      let that = this;
      uni.navigateBack({
        delta: 1,
      });
      uni.$emit("acceptImageData", { image: img });
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
            { ext: ["png", "jpg", "gif", "svg"], token: token }
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
          })
          .then((res) => {
            if (res.data.length > 0) {
              var data = this.renderData(res.data);
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


