<template>
  <view class="page">
    <u-navbar
      z-index="900"
      height="60"
      title=""
      :is-back="isBack"
      :back-text="filename"
      :border-bottom="false"
      :custom-back="backEvent"
    >
      <view v-if="isShowRight" slot="right">
        <u-button
          @click="closeFileOpt"
          class="file-btn close-btn"
          :hair-line="false"
          >关闭</u-button
        >
        <u-button class="file-btn" :hair-line="false">移动</u-button>
        <u-button class="file-btn" :hair-line="false">改名</u-button>
        <u-button class="file-btn" :hair-line="false">删除</u-button>
        <u-button @click="selectAll" class="file-btn" :hair-line="false">{{
          multiSelectState ? "全选" : "全不选"
        }}</u-button>
      </view>
    </u-navbar>
    <yun-files-content
      ref="myfile"
      @multi-select="multiSelect"
      @take-file="changeBackText"
      :filelist="filelist"
    ></yun-files-content>
    <tui-fab :right="50" :bottom="150" @click="showOpt"></tui-fab>
    <u-popup
      v-model="optShow"
      mode="bottom"
      z-index="99998"
      border-radius="20"
      duration="150"
      closeable
    >
      <view class="opt-panel">
        <u-row class="opt-content">
          <u-col span="4">
            <view class="wrap-inline" @click="newOpt('folder')">
              <image
                class="opt-img"
                src="/static/wenjianjia.png"
                mode="aspectFill"
              />
              <text>新文件夹</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="newOpt('image')">
              <image
                class="opt-img"
                src="/static/tupian.png"
                mode="aspectFill"
              />
              <text>上传图片</text>
            </view>
          </u-col>
          <u-col span="4">
            <view class="wrap-inline" @click="newOpt('other')">
              <image
                class="opt-img"
                src="/static/weizhiwenjian.png"
                mode="aspectFill"
              />
              <text>上传其它</text>
            </view>
          </u-col>
        </u-row>
      </view>
    </u-popup>
    <u-modal
      v-model="newFolderPanelShow"
      show-cancel-button
      title="创建新文件夹"
      :zoom="false"
      @cancel="optShow = true"
    >
      <view class="new-folder-popup">
        <u-input v-model="newFolderForm.name" />
      </view>
    </u-modal>
  </view>
</template>
  
<script>
import storeCache from "@/store/cache.js";
import { FILE_LIST } from "@/api/api";
export default {
  data() {
    return {
      multiSelectState: true,
      isBack: true,
      isShowRight: false,
      path: "",
      filename: "",
      optShow: false,
      newFolderPanelShow: false,
      newFolderForm: {},
      filelist: [],
    };
  },
  onReady() {
    this.initList();
  },
  methods: {
    multiSelect() {
      this.isShowRight = true;
      this.isBack = false;
    },
    selectAll() {
      this.multiSelectState
        ? ((this.multiSelectState = false), this.$refs.myfile.selectAll())
        : ((this.multiSelectState = true), this.$refs.myfile.unSelectAll());
    },
    closeFileOpt() {
      this.$refs.myfile.unSelectAll();
      this.multiSelectState = true;
      this.isShowRight = false;
      this.isBack = true;
      this.$refs.myfile.disableSelect();
    },
    backEvent() {},
    showOpt() {
      this.optShow = true;
    },
    newOpt(type) {
      if (type == "folder") {
        this.optShow = false;
        this.newFolderPanelShow = true;
      } else if (type == "image") {
        uni.navigateTo({
          url: "/pages/files/upload",
        });
      }
    },
    changeBackText(file) {
      this.filename = file.name;
    },
    initList() {
      storeCache.on(FILE_LIST).then((res) => {
        storeCache.next(FILE_LIST).then((res) => {
          this.filelist.push(res.data.filelist);
          uni.stopPullDownRefresh();
        });
      });
    },
    onPullDownRefresh() {
      storeCache.delete(FILE_LIST);
      this.filelist = [];
      this.initList();
    },
    onReachBottom: function () {
      storeCache.next(FILE_LIST).then((res) => {
        this.filelist.push(res.data.filelist);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page/deep/ {
  .u-line-1 {
    width: 45vw;
    display: inline-block;
  }
  .file-btn {
    width: 150rpx;
    border-width: 0;
  }
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
.close-btn {
  color: #fa2800;
}
</style>


